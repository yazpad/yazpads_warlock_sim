#!/usr/bin/env python3
"""Capture diagnostic Firebolt stats and Wrack action logs from an isolated copy.
Usage: python3 scripts/forever_probes/capture_runtime_probe.py <prepared-build-checkout> [go]
The prepared checkout needs generated protobufs and embedded database inputs.
"""
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

root = Path(__file__).resolve().parents[2]
checkout = Path(sys.argv[1]).resolve()
go = sys.argv[2] if len(sys.argv) > 2 else 'go'
env = os.environ.copy()
env.setdefault('GOCACHE', '/tmp/forever-go-cache')
env.setdefault('GOPATH', '/tmp/forever-gopath')
with tempfile.TemporaryDirectory(prefix='forever-runtime-probe-') as scratch:
    work = Path(scratch) / 'source'
    shutil.copytree(checkout, work, ignore=shutil.ignore_patterns('.git', 'node_modules'))
    pet = work / 'sim/warlock/pets.go'
    anchor = 'result := spell.CalcDamage(sim, target, fireboltHit.Average(), spell.OutcomeMagicHitAndCrit)'
    contents = pet.read_text()
    if contents.count(anchor) != 1:
        raise SystemExit('Firebolt implementation changed; review instrumentation before running.')
    log = '''if sim.Log != nil { sim.Log("PROBE Firebolt petSP=%.6f ownerSP=%.6f base=%.6f spellMult=%.6f spellAdd=%.6f petMult=%.6f schoolMult=%.6f", pet.GetStat(stats.SpellDamage), pet.owner.GetStat(stats.SpellDamage), fireboltHit.Average(), spell.DamageMultiplier, spell.DamageMultiplierAdditive, pet.PseudoStats.DamageDealtMultiplier, pet.PseudoStats.SchoolDamageDealtMultiplier[stats.SchoolIndexFire]) }
'''
    pet.write_text(contents.replace(anchor, log + anchor))
    exporter = root / 'scripts/forever_export/main.go'
    code = exporter.read_text().replace('_, sourceFile, _, _ := runtime.Caller(0)',
        '_, sourceFile, _, _ := runtime.Caller(0)\nsourceFile = ' + json.dumps(str(exporter)))
    code = code.replace('requestJSON := raw(request)', 'request.SimOptions.Debug = true\nrequestJSON := raw(request)')
    main = Path(scratch) / 'main.go'
    main.write_text(code)
    binary = Path(scratch) / 'exporter'
    subprocess.run([go, 'build', '-tags=with_db', '-o', str(binary), str(main)], cwd=work, env=env, check=True)
    def capture(preset, race):
        return json.loads(subprocess.run([str(binary), preset, race, '1', '101'], cwd=work, env=env,
                                        check=True, stdout=subprocess.PIPE, text=True).stdout)
    fire = capture('demo_fire_brand', 'RaceHuman')
    wrack = capture('aff_wrack', 'RaceOrc')
    result = {
        'seed': 101, 'iterations': 1, 'notes': 'Diagnostic source logging in a temporary copy; no production changes.',
        'sourceHashes': {f: hashlib.sha256((checkout / f).read_bytes()).hexdigest() for f in
            ['sim/warlock/pets.go', 'sim/warlock/wrack.go', 'sim/warlock/conflagrate.go', 'sim/core/spelldata/effect.go']},
        'initialImpSpellPower': next(p['stats']['SpellDamage'] for p in fire['initialPets'] if p['enabled']),
        'fireboltRuntime': [line for line in fire['result']['logs'].splitlines() if 'PROBE Firebolt' in line],
        'sourceWrackPlayerCasts': [line for line in wrack['result']['logs'].splitlines() if 'Casting ' in line and ' - ' not in line],
        'sourceWrackTargetAuraExpiries': [line for line in wrack['result']['logs'].splitlines() if '[Target 1]' in line and 'Aura faded' in line],
    }
    (root / 'FOREVER_RUNTIME_PROBE.json').write_text(json.dumps(result, indent=2) + '\n')
    print('Captured runtime Firebolt stats and source Wrack action timing.')
