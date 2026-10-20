#!/usr/bin/env python3
"""Run the Agony/Amplify characterization in a disposable Forever build checkout.

Usage: python3 scripts/forever_probes/run_amplify_probe.py /tmp/forever-parity-source /tmp/go/bin/go
The checkout must already have generated protobufs and dependencies. The source
checkout is not modified: only a temporary test file is installed and removed.
"""
import os
from pathlib import Path
import subprocess
import sys

checkout = Path(sys.argv[1]).resolve()
go = sys.argv[2] if len(sys.argv) > 2 else 'go'
probe = Path(__file__).with_name('amplify_double_dip_test.go')
target = checkout / 'sim/warlock/parity_probe_amplify_double_dip_test.go'
if target.exists():
    raise SystemExit(f'Refusing to overwrite {target}; remove the previous probe copy first.')
env = os.environ.copy()
env.setdefault('GOCACHE', '/tmp/forever-go-cache')
env.setdefault('GOPATH', '/tmp/forever-gopath')
try:
    target.write_bytes(probe.read_bytes())
    result = subprocess.run([go, 'test', '-tags=with_db', './sim/warlock', '-run',
                             '^TestParityProbeAmplifyDoubleDip$', '-count=1', '-v'],
                            cwd=checkout, env=env, check=False)
finally:
    target.unlink()
sys.exit(result.returncode)
