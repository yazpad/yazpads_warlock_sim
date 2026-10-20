// Diagnostic only: add Doom's missing cooldown in memory; leave production mechanics untouched.
// Input is a saved sweep at the desired sample count. Source results are reused.
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
const inputPath = path.resolve(process.argv[2] || 'FOREVER_LOW_HIT_INVESTIGATION.json');
const outPath = path.resolve(process.argv[3] || 'FOREVER_DOOM_COOLDOWN_PROBE.json');
const input = JSON.parse(fs.readFileSync(inputPath));
const sha = x => crypto.createHash('sha256').update(x).digest('hex');
if (input.status !== 'complete') throw new Error('Expected a complete captured sweep');
if (input.localHashes['threejs_webgl_des/src/kernel.js'] !== sha(fs.readFileSync(path.join(root, 'threejs_webgl_des/src/kernel.js')))) throw new Error('Kernel changed since input sweep; recapture it first');
const patches = [
  ['void castDoom(){', 'uint probeDoomReady;\nvoid castDoom(){\n probeDoomReady=s.now+60000000u;'],
  ['if(c.curseOfDoom!=0u&&s.doomActive==0u&&s.agonyTicks==0u){', 'if(c.curseOfDoom!=0u&&s.now>=probeDoomReady&&s.doomActive==0u&&s.agonyTicks==0u){'],
  ['s.initialized=1u;s.mana=c.maxMana;', 'probeDoomReady=0u;s.initialized=1u;s.mana=c.maxMana;'],
];
let shader = FRAGMENT;
for (const [before, after] of patches) {
  if (shader.split(before).length !== 2) throw new Error(`Expected one patch site: ${before}`);
  shader = shader.replace(before, after);
}
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'doom-cooldown-probe-'));
try {
  const manifest = { vertex: '#version 300 es\n' + VERTEX, detailed: '#version 300 es\n' + shader,
    cases: input.rows.map(r => ({ mode: 'detailed', width: 100, height: Math.ceil(input.iterations / 100) * COMPACT_STRIPES,
      configWords: Array.from(packConfig(r.config)), uniforms: { numConfigs: 1, fightsPerConfig: input.iterations,
        seed: input.seed, offset: 0, count: input.iterations, gridWidth: 100, mode: 0, eventBudget: 65536 } })) };
  const file = path.join(temp, 'cases.json'); fs.writeFileSync(file, JSON.stringify(manifest));
  const gpu = JSON.parse(execFileSync('python3', [path.join(root, 'threejs_webgl_des/validation/headless_gles.py'), file], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }));
  const result = { notes: 'Counterfactual Doom cooldown only, applied to shader in memory. Production code is unchanged. Source means reused from captured sweep; differences include subsequent rotation/RNG changes.',
    inputPath, inputHash: sha(fs.readFileSync(inputPath)), iterations: input.iterations, seed: input.seed,
    patches, productionShaderHash: sha(FRAGMENT), probeShaderHash: sha(shader), renderer: gpu.renderer, rows: [] };
  if (gpu.outputs.length !== input.rows.length) throw new Error('Missing GPU cases');
  input.rows.forEach((r, i) => {
    const states = decodeDetailedBatch(gpu.outputs[i], 100, input.iterations);
    const ours = summarizeSamples(states.map(s => s.total / r.config.duration));
    const breakdown = aggregateOurs(states, r.config);
    const delta = ours.mean - r.forever.mean;
    const row = { id: r.id, race: r.race, profile: r.profile, forever: r.forever, production: r.ours, probe: ours,
      deltaFromProduction: ours.mean - r.ours.mean, delta, deltaPct: delta / r.forever.mean * 100,
      deltaCi95HalfWidth: 1.96 * Math.sqrt((ours.sd ** 2 + r.forever.sd ** 2) / input.iterations),
      breakdown: { ours: breakdown, forever: r.breakdown.forever, comparison: compareBreakdowns(breakdown, r.breakdown.forever) } };
    result.rows.push(row);
    console.log(`${r.race} ${r.profile}: source ${r.forever.mean.toFixed(2)}, production ${r.ours.mean.toFixed(2)}, cooldown probe ${ours.mean.toFixed(2)}; gap ${row.deltaPct.toFixed(2)}%`);
  });
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2) + '\n');
} finally { fs.rmSync(temp, { recursive: true, force: true }); }
