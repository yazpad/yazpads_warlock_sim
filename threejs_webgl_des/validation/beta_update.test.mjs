import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { getTalentFlagsFromRanks } from '../src/talents.js';
import { TalentGraph, TALENT_DEFINITIONS } from '../src/classes/warlock_search.js';
import { resolveSavedBuild } from '../src/contracts/build_io.js';
import { packConfig, STATE_WORDS, decodeStates } from '../src/model.js';
import { FRAGMENT, VERTEX } from '../src/kernel.js';
import { parseAPLText, compileAPLToBytecode } from '../src/apl.js';

test('range talents replace periodic damage and agree with optimizer definitions', () => {
  const data = JSON.parse(readFileSync(new URL('../data/talents.json', import.meta.url)));
  for (const [id, name, tree] of [['grim_reach', 'Grim Reach', 0], ['destructive_reach', 'Destructive Reach', 2]]) {
    const node = TALENT_DEFINITIONS.find(n => n.id === id);
    const ui = data.trees[tree].talents.find(n => n.name === name);
    assert.equal(node.max, 2); assert.equal(ui.max, 2); assert.equal(ui.desc.length, 2);
  }
  for (let rank = 0; rank <= 2; rank++) {
    const flags = getTalentFlagsFromRanks({ affliction: { grim_reach: rank, malediction: 5 }, destruction: { destructive_reach: rank } });
    assert.equal(flags.maledictionBonus, 0);
    assert.equal(flags.afflictionRangeMultiplier, 1 + rank * 0.1);
    assert.equal(flags.destructionRangeMultiplier, 1 + rank * 0.1);
  }
});

test('legacy Malediction requests a respec instead of retaining damage or losing points', async () => {
  await assert.rejects(resolveSavedBuild({ talents: { affliction: { suppression: 5, malediction: 5 } } }), /Malediction.*Grim Reach.*Respec/);
  const current = await resolveSavedBuild({ talents: { affliction: { suppression: 5, grim_reach: 2 } }, aplText: 'Shadow Bolt' });
  assert.equal(current.config.maledictionBonus, 0);
  await assert.rejects(resolveSavedBuild({ talents: { affliction: { suppression: 5, grim_reach: 3 } } }), /Invalid talent rank/);
  await assert.rejects(resolveSavedBuild({ resolvedConfig: { maledictionBonus: 0.05 } }), /Malediction damage was removed/);
});

test('built-in presets have no removed talent and preserve Affliction row requirements', () => {
  const presets = JSON.parse(readFileSync(new URL('../data/presets.json', import.meta.url)));
  for (const preset of presets) {
    assert.ok(!Object.hasOwn(preset.talents.affliction, 'malediction'), preset.name);
    const vector = TalentGraph.fromTalentsObject(preset.talents);
    let below = 0;
    for (let row = 1; row <= 7; row++) {
      const nodes = TALENT_DEFINITIONS.map((n, i) => ({ ...n, rank: vector[i] })).filter(n => n.tree === 0 && n.row === row);
      if (nodes.some(n => n.rank > 0)) assert.ok(below >= 5 * (row - 1), preset.name);
      below += nodes.reduce((sum, n) => sum + n.rank, 0);
    }
  }
});

test('Undead GPU proc has a 25-second cooldown and flat damage independent of Shadow bonuses and spell base damage', t => {
  const base = { race: 'UNDEAD', duration: 80, distance: 0, intellect: 5000, hit: 100, nightfall: false, isb: false, partialResists: false,
    aplRules: compileAPLToBytecode(parseAPLText('Shadow Bolt')) };
  const inputs = [{}, { shadowMasteryBonus: 0.1, shadowMultiplier: 2, shadowPower: 500 }, { book: true }]
    .flatMap(extra => [5000, 10000].map(maxHealth => ({ ...base, ...extra, maxHealth })));
  const cases = inputs.map(config => ({ mode: 'detailed', width: 1, height: Math.ceil(STATE_WORDS / 16), configWords: Array.from(packConfig(config)),
    uniforms: { numConfigs: 1, fightsPerConfig: 1, seed: 42, offset: 0, count: 1, gridWidth: 1, mode: 1, eventBudget: 65536 } }));
  const path = join(mkdtempSync(join(tmpdir(), 'warlock-beta-')), 'cases.json');
  writeFileSync(path, JSON.stringify({ vertex: '#version 300 es\n' + VERTEX, detailed: '#version 300 es\n' + FRAGMENT, cases }));
  const run = spawnSync('python3', [fileURLToPath(new URL('./headless_gles.py', import.meta.url)), path], { encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024 });
  assert.equal(run.status, 0, run.stderr || String(run.error));
  const { outputs, renderer } = JSON.parse(run.stdout); t.diagnostic(renderer);
  const states = outputs.map(out => {
    const words = new Uint32Array(STATE_WORDS);
    for (let i = 0; i < words.length; i++) words[i] = out[Math.floor(i % 16 / 4)][Math.floor(i / 16) * 4 + i % 4];
    return decodeStates(words.buffer, 1)[0];
  });
  const delta = states[1].total - states[0].total;
  assert.ok(delta >= 250 && delta <= 1000);
  assert.ok(Math.abs(delta / 250 - Math.round(delta / 250)) < 0.001);
  for (let i = 0; i < states.length; i += 2) {
    assert.equal(states[i].done, 1); assert.equal(states[i + 1].done, 1);
    assert.equal(states[i].graveReady, states[0].graveReady);
    assert.ok(states[i].graveReady > 25000000);
    assert.ok(states[i].graveReady <= 105000000);
    assert.ok(Math.abs(states[i + 1].total - states[i].total - delta) < 0.1);
  }
});

test('Amplify Curse boosts all Agony damage including spell power by 50%', t => {
  const inputs = [0, 500, 2000].flatMap(spellPower => [false, true].map(amplifyCurse => ({
    duration: 25, distance: 0, hit: 100, spellPower, amplifyCurse,
    nightfall: false, isb: false, partialResists: false,
    aplRules: compileAPLToBytecode(parseAPLText('Bane of Agony if target.debuff_remains("Bane of Agony") <= 0')),
  })));
  const cases = inputs.map(config => ({ mode: 'detailed', width: 1, height: Math.ceil(STATE_WORDS / 16), configWords: Array.from(packConfig(config)),
    uniforms: { numConfigs: 1, fightsPerConfig: 1, seed: 42, offset: 0, count: 1, gridWidth: 1, mode: 1, eventBudget: 65536 } }));
  const path = join(mkdtempSync(join(tmpdir(), 'warlock-amplify-')), 'cases.json');
  writeFileSync(path, JSON.stringify({ vertex: '#version 300 es\n' + VERTEX, detailed: '#version 300 es\n' + FRAGMENT, cases }));
  const run = spawnSync('python3', [fileURLToPath(new URL('./headless_gles.py', import.meta.url)), path], { encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024 });
  assert.equal(run.status, 0, run.stderr || String(run.error));
  const { outputs, renderer } = JSON.parse(run.stdout); t.diagnostic(renderer);
  const states = outputs.map(out => {
    const words = new Uint32Array(STATE_WORDS);
    for (let i = 0; i < words.length; i++) words[i] = out[Math.floor(i % 16 / 4)][Math.floor(i / 16) * 4 + i % 4];
    return decodeStates(words.buffer, 1)[0];
  });
  for (let i = 0; i < states.length; i += 2) {
    const plain = states[i], amplified = states[i + 1];
    assert.equal(plain.done, 1); assert.equal(amplified.done, 1);
    assert.equal(plain.hits2, 12); assert.equal(amplified.hits2, 12);
    assert.ok(plain.damage2 > 0);
    assert.ok(Math.abs(amplified.damage2 - plain.damage2 * 1.5) < 0.02,
      `spell power ${inputs[i].spellPower}: ${amplified.damage2} vs ${plain.damage2 * 1.5}`);
  }
});
