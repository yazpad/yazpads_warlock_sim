// Usage: node scripts/generate_forever_gear_free_fixtures.mjs <build-checkout> [provenance-checkout] [go]
// The build checkout needs generated Go protobufs. GOCACHE/GOPATH can be set externally.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
const root = path.resolve(import.meta.dirname, '..');
const checkout = path.resolve(process.argv[2] || '../forever');
const provenance = path.resolve(process.argv[3] || checkout);
const go = process.argv[4] || 'go';
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'forever-gear-free-'));
try {
  const exporter = path.join(temporary, 'exporter');
  execFileSync(go, ['build', '-tags=with_db', '-o', exporter, path.join(root, 'scripts/forever_export/main.go')], { cwd: checkout, stdio: ['ignore', 'ignore', 'inherit'] });
  for (const id of ['sm_ruin', 'aff_wrack', 'destro', 'demo_shadow_brand', 'demo_fire_brand']) {
    const snapshot = path.join(temporary, `${id}.json`);
    fs.writeFileSync(snapshot, execFileSync(exporter, [id], { cwd: checkout, maxBuffer: 32 * 1024 * 1024 }));
    const result = JSON.parse(execFileSync(process.execPath, [path.join(root, 'scripts/capture_forever_fixture.mjs'), snapshot, provenance], { cwd: root, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 }));
    console.log(`${id}: gear-free-coe-v2, input status ${result.status}, ${result.blockers.length} blockers`);
  }
  execFileSync(process.execPath, [path.join(root, 'scripts/generate_forever_parity_report.mjs'), '--inputs-only'], { cwd: root, stdio: 'inherit' });
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
