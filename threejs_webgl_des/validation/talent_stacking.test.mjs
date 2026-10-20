import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { getTalentFlagsFromRanks } from '../src/talents.js';
import { packConfig, STATE_WORDS, decodeStates } from '../src/model.js';
import { FRAGMENT, VERTEX } from '../src/kernel.js';
import { parseAPLText, compileAPLToBytecode } from '../src/apl.js';

import { buildFightConfig } from '../src/config_builder.js';

// Forever: spell_mod.go multiplies DirectDamageMultiplier and
// PeriodicDamageMultiplier per modifier. Unholy Power is pet-wide, while
// Improved Imp / Improved Sayaad are separate spell modifiers.
test('pet and both Corruption config paths multiply independent talents', () => {
  const flags = getTalentFlagsFromRanks({ affliction: { shadow_mastery: 5, improved_corruption: 5 },
    demonology: { unholy_power: 5, improved_imp: 3, improved_sayaad: 3 } });
  assert.ok(Math.abs(flags.petFireboltMult - 1.43) < 1e-12);
  assert.ok(Math.abs(flags.petLashMult - 1.43) < 1e-12);
  const built = buildFightConfig({ talent: flags });
  assert.ok(Math.abs(built.corrMultiplier - 1.21) < 1e-12);
  const index = Object.keys(CONFIG).indexOf('corrMultiplier');
  for (const config of [built, { shadowMasteryBonus: 0.1, improvedCorruptionBonus: 0.1 }]) {
    assert.ok(Math.abs(new Float32Array(packConfig(config).buffer)[index] - 1.21) < 1e-6);
  }
});

import { CONFIG } from '../src/model.js';
test('GPU damage multiplies independent talent factors', t => {
  const scenarios = [
    ['Bane of Agony', { shadowMasteryBonus: 0.1, improvedAgonyBonus: 0.1 }, 1.21],
    ['Corruption', { shadowMasteryBonus: 0.1, improvedCorruptionBonus: 0.1 }, 1.21],
    ['Shadow Bolt', { shadowMasteryBonus: 0.1, afBonus: 0.1 }, 1.21],
    ['Immolate', { afBonus: 0.1 }, 1.1],
    ['Wrack', { shadowMasteryBonus: 0.1, improvedDrainsBonus: 0.2 }, 1.32],
  ];
  const inputs = scenarios.flatMap(([action, bonuses]) => [action === 'Immolate' ? { aftermathBonus: 0.2 } : {}, action === 'Immolate' ? { aftermathBonus: 0.2, ...bonuses } : bonuses].map(extra => ({
    duration: 20, rotation: 'shadow', distance: 0, hit: 100, intellect: 5000, spellPower: 300,
    nightfall: false, isb: false, partialResists: false, instantCorruption: false,
    agony: true, corruption: true, immolate: true, drainHope: true,
    aplRules: compileAPLToBytecode(parseAPLText(['Bane of Agony', 'Corruption', 'Immolate'].includes(action) ? `${action} if target.debuff_remains("${action}") <= 0\nLife Tap` : action)), ...extra,
  })));
  const cases = inputs.map(config => ({ mode: 'detailed', width: 1, height: Math.ceil(STATE_WORDS / 16), configWords: Array.from(packConfig(config)),
    uniforms: { numConfigs: 1, fightsPerConfig: 1, seed: 42, offset: 0, count: 1, gridWidth: 1, mode: 1, eventBudget: 65536 } }));
  const path = join(mkdtempSync(join(tmpdir(), 'warlock-stacking-')), 'cases.json');
  writeFileSync(path, JSON.stringify({ vertex: '#version 300 es\n' + VERTEX, detailed: '#version 300 es\n' + FRAGMENT, cases }));
  const run = spawnSync('python3', [fileURLToPath(new URL('./headless_gles.py', import.meta.url)), path], { encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024 });
  assert.equal(run.status, 0, run.stderr || String(run.error));
  const { outputs, renderer } = JSON.parse(run.stdout); t.diagnostic(renderer);
  const states = outputs.map(out => {
    const words = new Uint32Array(STATE_WORDS);
    for (let i = 0; i < words.length; i++) words[i] = out[Math.floor(i % 16 / 4)][Math.floor(i / 16) * 4 + i % 4];
    return decodeStates(words.buffer, 1)[0];
  });
  for (let i = 0; i < scenarios.length; i++) {
    const plain = states[i * 2], boosted = states[i * 2 + 1];
    assert.equal(plain.done, 1); assert.equal(boosted.done, 1);
    const [action, , ratio] = scenarios[i];
    assert.ok(plain.total > 0, action);
    assert.ok(Math.abs(boosted.total / plain.total - ratio) < 0.0001,
      `${action}: ${boosted.total / plain.total} expected ${ratio}`);
  }
});
