import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { resolveSavedBuild, exportLogicalBuild, exportResolvedBuild } from '../src/contracts/build_io.js';
import { CONFIG, STATE, FAST_STATE, packConfig } from '../src/model.js';
import { VERTEX, FRAGMENT, FAST_FRAGMENT } from '../src/kernel.js';
import { parseAPLText, compileAPLToBytecode } from '../src/apl.js';

const names = ['aff_wrack', 'demo_fire_brand', 'demo_shadow_brand', 'destro', 'sm_ruin'];
const source = name => JSON.parse(fs.readFileSync(new URL(`../../fixtures/forever_defaults/${name}.build.json`, import.meta.url)));
const apl = text => compileAPLToBytecode(parseAPLText(text));

test('all five unmodified Forever defaults import and roundtrip with their combat settings', async () => {
  for (const name of names) {
    const input = source(name), before = structuredClone(input);
    const resolved = await resolveSavedBuild(input);
    assert.deepEqual(input, before);
    assert.deepEqual(resolved.candidate.importDiagnostics, [], name);
    const c = resolved.config;
    assert.equal(c.distance, 20);
    assert.equal(c.bossArmor, 976);
    assert.equal(c.spirit, 191);
    assert.equal(c.crit, 3); // Moonkin only: no weapon to carry Brilliant Wizard Oil.
    assert.equal(c.spellPower, 172 + c.demonicKnowledge * 20);
    for (const key of ['autoCooldowns', 'assignedElements', 'demonicRune', 'ezThroDynamite', 'manualTrinket', 'judgementOfWisdom', 'giftOfArthas']) assert.equal(c[key], true, `${name}/${key}`);
    assert.equal(c.mp5, 65);
    assert.equal(c.soulShards, 32);
    assert.equal(resolved.candidate.sourceSettings.armor, 'DemonArmor');
    assert.equal(c.trinketSP, 47);
    assert.equal(c.trinketDuration, 30);
    assert.equal(c.trinketCD, 120);
    assert.ok(resolved.candidate.apl.text.includes('elements if !debuff.assigned_curse'));
    assert.ok(resolved.candidate.apl.text.includes('spellblasting'));
    const logical = await exportLogicalBuild(input);
    assert.deepEqual((await resolveSavedBuild(logical)).config, c);
    const envelope = await exportResolvedBuild(input);
    assert.deepEqual((await resolveSavedBuild(envelope)).config, c);
  }
});

test('default exports execute consumables, assigned curse and full gates in both GPU modes', async () => {
  const definitions = [];
  for (const name of names) definitions.push([name, (await resolveSavedBuild(source(name))).config]);
  definitions.push(['delayed-potion', {duration: 20, manualTrinket: true, trinketSP: 47, trinketDuration: 30, trinketCD: 120,
    aplRules: apl('spellblasting if target_ttd < 10\nShadow Bolt')}]);
  definitions.push(['no-auto-potion', {duration: 20, manualTrinket: true, trinketSP: 47, trinketDuration: 30, trinketCD: 120,
    aplRules: apl('Shadow Bolt')}]);
  definitions.push(['no-auto-consumes', {duration: 20, autoCooldowns: false, demonicRune: true, ezThroDynamite: true,
    aplRules: apl('Shadow Bolt')}]);
  const isolated = {hit:100,nightfall:false,isb:false,partialResists:false,mp5:0,petChoice:'none',distance:0};
  for (let seed=1;seed<=8;seed++) definitions.push([`dot-wisdom-${seed}`, {...isolated,seed,duration:1,book:true,instantCorruption:true,judgementOfWisdom:true,aplRules:apl('Corruption')}]);
  const bomb={...isolated,duration:1,assignedElements:true,autoCooldowns:true,ezThroDynamite:true,judgementOfWisdom:true,aplRules:apl('elements')};
  definitions.push(['bomb-gcd',bomb],['bomb-fire-bonus',{...bomb,fireMultiplier:2}]);
  definitions.push(['succ-before-range',{...isolated,duration:1,distance:20,petChoice:'succubus',aplRules:apl('Life Tap')}],
    ['succ-in-range',{...isolated,duration:2,distance:20,petChoice:'succubus',aplRules:apl('Life Tap')}],
    ['imp-before-arrival',{...isolated,duration:2,distance:20,petChoice:'imp',aplRules:apl('Life Tap')}],
    ['imp-arrived',{...isolated,duration:4,distance:20,petChoice:'imp',aplRules:apl('Life Tap')}],
    ['imp-zero-distance',{...isolated,duration:2,distance:0,petChoice:'imp',aplRules:apl('Life Tap')}]);
  for(let seed=1;seed<=4;seed++)for(const enabled of [false,true])definitions.push([`arthas-${seed}-${enabled}`,{...isolated,seed,duration:1,bossArmor:100000,petChoice:'succubus',giftOfArthas:enabled,aplRules:apl('Life Tap')}]);
  const cases = [], meta = [];
  for (const mode of ['detailed', 'fast']) for (const [name, config] of definitions) {
    const schema = mode === 'detailed' ? STATE : FAST_STATE;
    meta.push({mode, name, schema});
    cases.push({mode, width: 1, height: Math.ceil(Object.keys(schema).length / 16), configWords: Array.from(packConfig(config)),
      uniforms: {numConfigs: 1, fightsPerConfig: 1, seed: config.seed ?? 17, offset: 0, count: 1, gridWidth: 1, mode: 1, eventBudget: 65536}});
  }
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'forever-defaults-'));
  try {
    const file = path.join(temp, 'cases.json');
    fs.writeFileSync(file, JSON.stringify({vertex: '#version 300 es\n' + VERTEX, detailed: '#version 300 es\n' + FRAGMENT, fast: '#version 300 es\n' + FAST_FRAGMENT, cases}));
    const gpu = JSON.parse(execFileSync('python3', [new URL('./headless_gles.py', import.meta.url).pathname, file], {encoding: 'utf8', timeout: 180000, maxBuffer: 16*1024*1024}));
    const results = {};
    gpu.outputs.forEach((output, i) => {
      const floats = output.map(a => new Float32Array(new Uint32Array(a).buffer));
      const {mode, name, schema} = meta[i];
      const state = mode === 'fast' ? {total: floats[0][0], done: output[0][1] & 65535, mana: floats[3][2], spent: floats[3][3]} : Object.fromEntries(Object.entries(schema).map(([k, t], j) => [k, (t === 'f32' ? floats : output)[Math.floor(j%16/4)][Math.floor(j/16)*4+j%4]]));
      assert.equal(state.done, 1, `${mode}/${name}`);
      results[`${mode}/${name}`] = state;
    });
    for (const name of names) {
      const state = results[`detailed/${name}`];
      assert.ok(state.runeReady > 0, `${name}: rune used`);
      assert.ok(state.casts14 >= 2, `${name}: explosives used`);
      assert.equal(state.hits14 + state.misses14, state.casts14, `${name}: every explosive resolves`);
      assert.ok(state.casts15 >= 1, `${name}: assigned curse cast`);
      assert.ok(state.elementsEnd > 180e6, `${name}: assigned curse active`);
      assert.ok(state.trinketReady > 120e6, `${name}: potion used`);
      assert.ok(Math.abs(state.total-results[`fast/${name}`].total) < 0.2, `${name}: fast/detailed damage agrees`);
    }
    assert.ok(names.reduce((sum, name) => sum + results[`detailed/${name}`].damage14, 0) > 0, 'explosive damage is recorded');
    assert.ok(results['detailed/delayed-potion'].trinketReady > 130e6, 'potion follows its APL gate');
    assert.equal(results['detailed/no-auto-potion'].trinketReady, 0, 'explicit potion is not activated implicitly');
    assert.equal(results['detailed/no-auto-consumes'].runeReady, 0);
    assert.equal(results['detailed/no-auto-consumes'].casts14, 0);
    let wisdomProcs=0,arthasHits=0;
    for(let seed=1;seed<=8;seed++){
      const state=results[`detailed/dot-wisdom-${seed}`];
      assert.ok(state.gained===0||state.gained===59,'a landed DoT application can grant one JoW proc');
      wisdomProcs+=state.gained/59;
      assert.ok(Math.abs(state.total-results[`fast/dot-wisdom-${seed}`].total)<0.01);
    }
    assert.ok(wisdomProcs>0&&wisdomProcs<8,'DoT application procs are probabilistic');
    const bombState=results['detailed/bomb-gcd'];
    assert.equal(bombState.casts15,1,'assigned curse executes before the explosive during its GCD');
    assert.equal(bombState.casts14,1);
    assert.equal(bombState.gained,0,'explosives and the assigned curse cannot proc JoW');
    assert.ok(bombState.damage14>0);
    for(const mode of ['detailed','fast'])assert.ok(Math.abs(results[`${mode}/bomb-fire-bonus`].total-2*results[`${mode}/bomb-gcd`].total)<0.01,'generic Fire bonuses affect explosives');
    assert.equal(results['detailed/succ-before-range'].petSpellCasts,0);
    assert.equal(results['detailed/succ-in-range'].petSpellCasts,1);
    assert.equal(results['detailed/imp-before-arrival'].petSpellCasts,1,'an Imp cast may complete before its missile arrives');
    assert.equal(results['detailed/imp-before-arrival'].petDamage,0,'missiles arriving after encounter end deal no damage');
    assert.ok(results['detailed/imp-arrived'].petDamage>0);
    assert.ok(results['detailed/imp-zero-distance'].petDamage>0);
    for(const id of ['succ-before-range','succ-in-range','imp-before-arrival','imp-arrived','imp-zero-distance'])assert.ok(Math.abs(results[`detailed/${id}`].total-results[`fast/${id}`].total)<0.02,`${id}: shader modes agree`);
    for(let seed=1;seed<=4;seed++){
      const before=results[`detailed/arthas-${seed}-false`],after=results[`detailed/arthas-${seed}-true`];
      if(after.petMeleeHits){assert.ok(after.petMeleeDamage-before.petMeleeDamage>=4.39,'Gift of Arthas is not reduced by armor');arthasHits++;}
    }
    assert.ok(arthasHits>0);
  } finally { fs.rmSync(temp, {recursive: true, force: true}); }
});
