// Counterfactual probes against saved source results; production shaders stay unchanged.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { FRAGMENT, VERTEX } from '../threejs_webgl_des/src/kernel.js';
import { packConfig, COMPACT_STRIPES } from '../threejs_webgl_des/src/model.js';
import { decodeDetailedBatch, aggregateOurs, compareBreakdowns } from './forever_breakdown.mjs';
import { summarizeSamples } from './sweep_forever_parity.mjs';

const root = path.resolve(import.meta.dirname, '..');
const input = fs.readFileSync(path.join(root, 'FOREVER_SWEEP_FOLLOWUP.json'));
const report = JSON.parse(input);
const row = report.rows.find(r => r.preset === 'destro' && r.race === 'GNOME' && r.profile === 'regen_high');
if (row?.status !== 'complete') throw new Error('Run the follow-up sweep first');
const inclusive = shader => {
  const before = 'return (c.end>s.now)&&(float(c.end-s.now)>param*1000000.0);';
  if (!shader.includes(before)) throw new Error('FIGHT_TIME_GE probe anchor changed');
  return shader.replace(before, 'return (c.end>=s.now)&&(float(c.end-s.now)>=param*1000000.0);');
};
const endAfter = shader => {
  const before = 'enqueue(c.end,13u,0u,0u);';
  if (!shader.includes(before)) throw new Error('Fight-end probe anchor changed');
  return shader.replace(before, 'enqueue(c.end+1u,13u,0u,0u);');
};
const probes = [ ['inclusive_fight_time', inclusive], ['end_after_equal_time', endAfter],
  ['inclusive_and_end_after', s => endAfter(inclusive(s))] ];
const result = { diagnosticOnly: true, sourceReportHash: crypto.createHash('sha256').update(input).digest('hex'),
  kernelHash: crypto.createHash('sha256').update(FRAGMENT).digest('hex'), caseId: row.id,
  iterations: report.iterations, seed: report.seed, baseline: row.ours, forever: row.forever, rows: [] };
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'forever-boundaries-'));
try {
  for (const [id, edit] of probes) {
    const width = 100, count = report.iterations;
    const file = path.join(temp, `${id}.json`);
    fs.writeFileSync(file, JSON.stringify({ vertex: '#version 300 es\n' + VERTEX,
      detailed: '#version 300 es\n' + edit(FRAGMENT), cases: [{ mode: 'detailed', width,
        height: Math.ceil(count / width) * COMPACT_STRIPES, configWords: Array.from(packConfig(row.config)),
        uniforms: { numConfigs: 1, fightsPerConfig: count, seed: report.seed, offset: 0, count,
          gridWidth: width, mode: 0, eventBudget: 65536 } }] }));
    const gpu = JSON.parse(execFileSync('python3', [path.join(root, 'threejs_webgl_des/validation/headless_gles.py'), file],
      { encoding: 'utf8', maxBuffer: 128 * 1024 * 1024, timeout: 120000 }));
    const states = decodeDetailedBatch(gpu.outputs[0], width, count);
    const ours = summarizeSamples(states.map(s => s.total / row.config.duration));
    const breakdown = aggregateOurs(states, row.config);
    result.rows.push({ id, ours, deltaPct: (ours.mean / row.forever.mean - 1) * 100,
      comparison: compareBreakdowns(breakdown, row.breakdown.forever), renderer: gpu.renderer });
    console.log(`${id}: ${ours.mean.toFixed(3)} DPS`);
  }
  fs.writeFileSync(path.join(root, 'FOREVER_SWEEP_BOUNDARY_INVESTIGATION.json'), JSON.stringify(result, null, 2) + '\n');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
