import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { CONFIG, packConfig, validate } from '../src/model.js';
import { FRAGMENT, FAST_FRAGMENT, VERTEX } from '../src/kernel.js';
import { parseAPLText, compileAPLToBytecode } from '../src/apl.js';
import { resolveSavedBuild } from '../src/contracts/build_io.js';

const packedValue = (config, name) => {
  const index = Object.keys(CONFIG).indexOf(name);
  const packed = packConfig(config);
  return CONFIG[name] === 'f32' ? new Float32Array(packed.buffer)[index] : packed[index];
};
test('source channel delay survives normal import and packs milliseconds as microseconds', async () => {
  const source = JSON.parse(readFileSync(new URL('../../fixtures/canonical_forever/aff_wrack.fixture.json', import.meta.url))).sourceBuild;
  for (const delay of [0, 50, 125]) {
    const build = structuredClone(source);
    build.player.channelClipDelayMs = delay;
    const resolved = await resolveSavedBuild(build);
    assert.equal(resolved.candidate.channelClipDelayMs, delay);
    assert.equal(resolved.config.channelClipDelayMs, delay);
    assert.equal(packedValue(resolved.config, 'channelClipDelay'), delay * 1000);
  }
  assert.equal(packedValue({}, 'channelClipDelay'), 0);
  assert.throws(() => validate({ channelClipDelayMs: -1 }), /channelClipDelayMs/);
  assert.throws(() => validate({ channelClipDelayMs: 0.5 }), /integer/);
});

test('fast and detailed shaders spend 200 mana per Wrack and delay decisions after the sixth tick', t => {
  const cases = [], metadata = [];
  for (const mode of ['detailed', 'fast']) for (const delay of [0, 50, 125]) {
    const config = { duration: 13, distance: 0, channelClipDelayMs: delay, drainHope: true,
      mp5: 0, petChoice: 'none', nightfall: false, isb: false,
      aplRules: compileAPLToBytecode(parseAPLText('Wrack')) };
    metadata.push({ mode, delay, maxMana: packedValue(config, 'maxMana') });
    cases.push({ mode, width: 64, height: 1, configWords: Array.from(packConfig(config)),
      uniforms: { numConfigs: 1, fightsPerConfig: 1, seed: 42, offset: 0, count: 64, gridWidth: 64, mode: 2, eventBudget: 65536 } });
  }
  const path = join(mkdtempSync(join(tmpdir(), 'wrack-timing-')), 'cases.json');
  writeFileSync(path, JSON.stringify({ vertex: '#version 300 es\n' + VERTEX,
    detailed: '#version 300 es\n' + FRAGMENT, fast: '#version 300 es\n' + FAST_FRAGMENT, cases }));
  const run = spawnSync('python3', [fileURLToPath(new URL('./headless_gles.py', import.meta.url)), path],
    { encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024 });
  assert.equal(run.status, 0, run.stderr || String(run.error));
  const { outputs, renderer } = JSON.parse(run.stdout); t.diagnostic(renderer);
  outputs.forEach((out, index) => {
    const { delay, maxMana, mode } = metadata[index];
    const mana = new Float32Array(new Uint32Array(out[1]).buffer);
    const events = Array.from({ length: 64 }, (_, i) => ({ time: out[0][i * 4], kind: out[0][i * 4 + 1], spell: out[0][i * 4 + 2], mana: mana[i * 4] }));
    const ticks = events.filter(e => e.kind === 3 && e.spell === 16);
    assert.deepEqual(ticks.slice(0, 12).map(e => e.time),
      [...Array.from({ length: 6 }, (_, i) => (i + 1) * 1000000),
       ...Array.from({ length: 6 }, (_, i) => (i + 7) * 1000000 + delay * 1000)], mode);
    assert.equal(ticks[0].mana, maxMana - 200, mode);
    const decision = events.find(e => e.kind === 5 && e.time === 6000000 + delay * 1000);
    assert.ok(decision, `${mode}: next decision at channel end + ${delay}ms`);
    assert.equal(decision.mana, maxMana - 400, mode);
  });
});
