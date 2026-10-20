// Diagnostic comparison: deliberately runs blocked imports without accepting parity.
// node scripts/benchmark_forever_gear_free.mjs <build-checkout> [go] [iterations] [seed]
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { FRAGMENT, VERTEX } from '../threejs_webgl_des/src/kernel.js';
import { packConfig, COMPACT_STRIPES } from '../threejs_webgl_des/src/model.js';
import { decodeDetailedBatch, aggregateOurs, normalizeForever, compareBreakdowns, renderBreakdown } from './forever_breakdown.mjs';
import { migrateLegacyBuild } from '../threejs_webgl_des/src/contracts/legacy_build.js';
import { resolveWarlockImport } from '../threejs_webgl_des/src/classes/warlock_import.js';

const root = path.resolve(import.meta.dirname, '..');
const checkout = path.resolve(process.argv[2] || '../forever');
const go = process.argv[3] || 'go';
const iterations = Number(process.argv[4] || 1000);
const seed = Number(process.argv[5] || 101);
if (!Number.isInteger(iterations) || iterations < 1000 || iterations > 1000000) throw new Error('Use 1000–1000000 iterations.');
if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295) throw new Error('Seed must be uint32.');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'forever-benchmark-'));
const rows = [];
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const benchmarkProvenance = Object.fromEntries([
  'scripts/benchmark_forever_gear_free.mjs', 'scripts/forever_export/main.go',
  'fixtures/forever_gear_free_scenario.json', 'threejs_webgl_des/src/model.js',
  'threejs_webgl_des/src/kernel.js', 'threejs_webgl_des/src/classes/warlock_import.js',
  'threejs_webgl_des/src/classes/forever_bridge.js',
  'scripts/forever_breakdown.mjs', 'threejs_webgl_des/src/apl.js',
  'threejs_webgl_des/src/config_builder.js', 'threejs_webgl_des/src/talents.js',
].map(file => [file, sha(fs.readFileSync(path.join(root, file)))]));
const stats = (mean, sd, n) => ({ mean, sd, n, ci95HalfWidth: 1.96 * sd / Math.sqrt(n) });
try {
  const binary = path.join(temp, 'exporter');
  execFileSync(go, ['build', '-tags=with_db', '-o', binary, path.join(root, 'scripts/forever_export/main.go')], { cwd: checkout, stdio: ['ignore', 'ignore', 'inherit'] });
  for (const id of ['sm_ruin', 'aff_wrack', 'destro', 'demo_shadow_brand', 'demo_fire_brand']) {
    const fixture = JSON.parse(fs.readFileSync(path.join(root, 'fixtures/canonical_forever', `${id}.fixture.json`), 'utf8'));
    if (fixture.scenarioId !== 'gear-free-coe-v2') throw new Error(`${id} is not gear-free-coe-v2`);
    const source = JSON.parse(execFileSync(binary, [id, fixture.sourceBuild.player.race, String(iterations), String(seed)], { cwd: checkout, maxBuffer: 64 * 1024 * 1024 }));
    if (source.result.error) throw new Error(JSON.stringify(source.result.error));
    const { simOptions: oldOptions, ...oldRequest } = fixture.request;
    const { simOptions: newOptions, ...newRequest } = source.request;
    if (!isDeepStrictEqual(oldRequest, newRequest)) throw new Error(`${id}: regenerated request differs from captured fixture`);
    if (!isDeepStrictEqual({ ...oldOptions, iterations, randomSeed: String(seed) }, newOptions)) throw new Error(`${id}: unexpected simulation-option change`);
    const staged = migrateLegacyBuild(fixture.sourceBuild, { candidateId: id });
    const { config: importedConfig } = resolveWarlockImport(staged);
    const config = { ...importedConfig, iterations, seed, duration: source.request.encounter.duration };
    const width = Math.min(100, iterations), height = Math.ceil(iterations / width)*COMPACT_STRIPES;
    const manifest = { vertex: '#version 300 es\n' + VERTEX, detailed: '#version 300 es\n' + FRAGMENT, cases: [{
      mode: 'detailed', width, height, configWords: Array.from(packConfig(config)),
      uniforms: { numConfigs: 1, fightsPerConfig: iterations, seed, offset: 0, count: iterations, gridWidth: width, mode: 0, eventBudget: 65536 },
    }] };
    const manifestPath = path.join(temp, `${id}.json`);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest));
    const gpu = JSON.parse(execFileSync('python3', [path.join(root, 'threejs_webgl_des/validation/headless_gles.py'), manifestPath], { encoding: 'utf8', maxBuffer: 128 * 1024 * 1024 }));
    const states = decodeDetailedBatch(gpu.outputs[0], width, iterations);
    let mean = 0, m2 = 0, petDps = 0;
    for (let i = 0; i < iterations; i++) {
      const dps = states[i].total / config.duration;
      if (!Number.isFinite(dps) || dps <= 0) throw new Error(`${id}: invalid DPS`);
      const delta = dps - mean; mean += delta / (i + 1); m2 += delta * (dps - mean);
      petDps += states[i].petDamage / config.duration / iterations;
    }
    const dist = source.result.raidMetrics.dps;
    const n = source.request.simOptions.iterations;
    if (n !== iterations || Number(dist.aggregatorData.n) !== iterations) throw new Error('Forever sample count mismatch');
    const forever = stats(dist.avg, dist.stdev * Math.sqrt(n / (n - 1)), n);
    const ours = stats(mean, Math.sqrt(m2 / (iterations - 1)), iterations);
    const delta = ours.mean - forever.mean;
    const deltaCi95HalfWidth = 1.96 * Math.sqrt(ours.sd ** 2 / iterations + forever.sd ** 2 / n);
    const foreverPetDps = source.result.raidMetrics.parties[0].players[0].pets.reduce((sum, pet) => sum + pet.dps.avg, 0);
    const ourBreakdown=aggregateOurs(states,config), sourceBreakdown=normalizeForever(source.result,n,config.duration);
    const breakdown={ ours:ourBreakdown,forever:sourceBreakdown,comparison:compareBreakdowns(ourBreakdown,sourceBreakdown) };
    const row = { id, forever, ours, delta, deltaPct: delta / forever.mean * 100,
      deltaCi95HalfWidth, deltaExcludesZero: Math.abs(delta) > deltaCi95HalfWidth,
      petDps: { forever: foreverPetDps, ours: petDps }, renderer: gpu.renderer,
      acceptance: 'diagnostic-only', blockers: fixture.inputComparison.blockers,
      config, request: source.request, requestHash: sha(JSON.stringify(source.request)),
      foreverReference20: fixture.result.raidMetrics.dps.avg,
      sourceProvenance: fixture.provenance,
      mode:'detailed', breakdown,
      foreverActions: source.result.raidMetrics.parties[0].players[0],
    };
    rows.push(row);
    console.log(`${id}: Forever ${forever.mean.toFixed(3)} ± ${forever.ci95HalfWidth.toFixed(3)}, ours ${ours.mean.toFixed(3)} ± ${ours.ci95HalfWidth.toFixed(3)}, delta ${delta.toFixed(3)} (${row.deltaPct.toFixed(2)}%), n=${iterations} each`);
    fs.writeFileSync(path.join(root, 'FOREVER_GEAR_FREE_BENCHMARK.json'), JSON.stringify({ scenarioId: 'gear-free-coe-v2', mode:'detailed', iterations, seed, benchmarkProvenance, rows }, null, 2) + '\n');
  }
  const lines = ['# Gear-free diagnostic DPS comparison', '',
    `${iterations.toLocaleString('en-US')} iterations per preset **in each engine**, seed ${seed}, 180 seconds. Our shader uses **detailed/slow mode** for counters and damage splits. Explicit bonus stats, empty equipment and external CoE only; no other external buffs/consumables.`, '',
    '**Diagnostic results, not accepted parity.** Normal imports are evaluated as implemented, with known APL gaps and Fire Brand initial-state differences. No configuration values were adjusted to close the DPS gap.', '',
    'Intervals are approximate 95% confidence intervals for the means. Delta uncertainty uses independent-engine standard errors; equal seeds do not imply paired random outcomes. These intervals describe Monte Carlo uncertainty, not uncertainty from missing features or formulas.', '',
    '| Preset | Forever DPS ±95% CI | Our WebGL DPS ±95% CI | Ours − Forever | Delta % | Delta ±95% CI |',
    '| --- | ---: | ---: | ---: | ---: | ---: |'];
  for (const r of rows) lines.push(`| ${r.id} | ${r.forever.mean.toFixed(2)} ± ${r.forever.ci95HalfWidth.toFixed(2)} | ${r.ours.mean.toFixed(2)} ± ${r.ours.ci95HalfWidth.toFixed(2)} | ${r.delta.toFixed(2)} | ${r.deltaPct.toFixed(2)}% | ±${r.deltaCi95HalfWidth.toFixed(2)} |`);
  lines.push('', '## Pet damage contributions', '', '| Preset | Forever pet DPS | Our pet DPS |', '| --- | ---: | ---: |');
  for (const r of rows) lines.push(`| ${r.id} | ${r.petDps.forever.toFixed(2)} | ${r.petDps.ours.toFixed(2)} |`);
  for (const r of rows) lines.push(...renderBreakdown(r));
  lines.push('', '## Effect of replacing the 20-iteration reference', '', '| Preset | Old 20-trial Forever DPS | New Forever DPS |', '| --- | ---: | ---: |');
  for (const r of rows) lines.push(`| ${r.id} | ${r.foreverReference20.toFixed(2)} | ${r.forever.mean.toFixed(2)} |`);
  lines.push('', `Renderer: ${rows[0].renderer}. Actual GLSL ES shaders run through headless EGL; this is not a browser integration or performance measurement. All shader lanes completed successfully.`, '',
    'The JSON companion records sample standard deviations, counts, configs, exact requests, hashes, captured source provenance, source action metrics and blockers. Source requests are checked against the canonical captures; only iteration count and seed may differ.', '',
    'Reproduce:', '', '```sh', `node scripts/benchmark_forever_gear_free.mjs /path/to/forever go ${iterations} ${seed}`, '```', '');
  fs.writeFileSync(path.join(root, 'FOREVER_GEAR_FREE_BENCHMARK.md'), lines.join('\n'));
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
