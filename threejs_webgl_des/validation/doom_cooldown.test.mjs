import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { packConfig } from '../src/model.js';
import { FRAGMENT, FAST_FRAGMENT, VERTEX } from '../src/kernel.js';
import { parseAPLText, compileAPLToBytecode } from '../src/apl.js';

test('Doom starts its 60-second cooldown on misses and hits in both shader modes', t => {
  const cases = [], labels = [];
  for (const mode of ['detailed','fast']) for (const hit of [0, 100]) {
    const config = { duration: 125, distance: 0, curseOfDoom: true, intellect: 5000, mp5: 100,
      hit, nightfall: false, isb: false, partialResists: false,
      aplRules: compileAPLToBytecode(parseAPLText('Bane of Doom\nLife Tap')) };
    cases.push({ mode: hit === 0 ? `${mode}Miss` : mode, width: 256, height: 1, configWords: Array.from(packConfig(config)),
      uniforms: { numConfigs: 1, fightsPerConfig: 1, seed: 42, offset: 0, count: 256, gridWidth: 256, mode: 2, eventBudget: 65536 } });
    labels.push({ mode, hit });
  }
  const forceMiss = shader => {
    const before = 'if(random01()<c.hit){\n  s.doomEnd';
    assert.equal(shader.split(before).length, 2);
    return shader.replace(before, 'if(random01()<0.0){\n  s.doomEnd');
  };
  const file = join(mkdtempSync(join(tmpdir(), 'doom-cooldown-')), 'cases.json');
  writeFileSync(file, JSON.stringify({ vertex: '#version 300 es\n'+VERTEX, detailed: '#version 300 es\n'+FRAGMENT, fast: '#version 300 es\n'+FAST_FRAGMENT, detailedMiss: '#version 300 es\n'+forceMiss(FRAGMENT), fastMiss: '#version 300 es\n'+forceMiss(FAST_FRAGMENT), cases }));
  const run = spawnSync('python3', [fileURLToPath(new URL('./headless_gles.py', import.meta.url)), file], { encoding:'utf8', timeout:120000, maxBuffer:8*1024*1024 });
  assert.equal(run.status, 0, run.stderr || String(run.error));
  const { outputs, renderer } = JSON.parse(run.stdout); t.diagnostic(renderer);
  outputs.forEach((out, i) => {
    // Event flags bit 2 denotes a miss. The initial cast precedes the first
    // recorded event; subsequent casts happen during decision (kind 5) events.
    const flags = out[1];
    const recasts = Array.from({ length:256 }, (_, n) => ({ time:out[0][n*4], kind:out[0][n*4+1], flags:flags[n*4+1] }))
      .filter(e => e.kind === 5 && (e.flags & 2));
    const { hit, mode } = labels[i];
    if (hit === 0) {
      assert.deepEqual(recasts.map(e=>e.time), [60000000,120000000], mode);
    }
    const ticks = Array.from({length:256},(_,n)=>({time:out[0][n*4],kind:out[0][n*4+1],spell:out[0][n*4+2]}))
      .filter(e=>e.kind===3&&e.spell===20);
    if (hit === 100) {
      assert.equal(ticks.length, 2, mode);
      assert.equal(ticks[0].time, 60000000, mode);
      // A same-time Life Tap decision can precede the Doom expiry in the
      // existing heap; the next GCD then applies Doom at 61.5s.
      assert.ok(ticks[1].time >= 120000000 && ticks[1].time <= 121500000, mode);
    }
  });
});
