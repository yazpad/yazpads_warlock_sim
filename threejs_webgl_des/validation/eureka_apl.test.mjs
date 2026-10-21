import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { packConfig, APL_COND, APL_ACTION } from '../src/model.js';
import { FRAGMENT, FAST_FRAGMENT, VERTEX } from '../src/kernel.js';
import { parseAPLText, compileAPLToBytecode } from '../src/apl.js';
import { convertForeverBuildToCandidate, extractForeverAPL } from '../src/classes/forever_bridge.js';
import { resolveSavedBuild } from '../src/contracts/build_io.js';
const source = () => JSON.parse(readFileSync(new URL('../../fixtures/canonical_forever/demo_shadow_brand.fixture.json', import.meta.url))).sourceBuild;

test('Split Boosts imports Eureka and Berserking with source arithmetic and aura gates', async () => {
  const build = source(); build.player.race = 'RaceGnome';
  const candidate = convertForeverBuildToCandidate(build);
  assert.deepEqual(candidate.importDiagnostics, []);
  assert.ok(candidate.apl.text.includes('spellblasting'));
  assert.match(candidate.apl.text, /eureka if buff.decimation && time_to_execute\(35\) <= 0/);
  assert.match(candidate.apl.text, /eureka if target.debuff_remains\("Bane of Doom"\) > 0 && time_to_execute\(35\) >= 120/);
  const resolved = await resolveSavedBuild(build);
  assert.equal(resolved.config.aplRules.filter(r=>r.action===APL_ACTION.EUREKA).length, 3);
  assert.ok(resolved.config.aplRules.some(r=>r.action===APL_ACTION.EUREKA && r.cond1===APL_COND.DECIMATION_AURA_ACTIVE && r.cond2===APL_COND.TIME_TO_EXECUTE_LE));
  // New condition payloads must also survive the resolved-config boundary.
  const again = await resolveSavedBuild({ resolvedConfig: resolved.config });
  assert.deepEqual(again.config.aplRules, resolved.config.aplRules);
});

test('top-level racial actions retain their predicates; Decimation aura is independent of execute eligibility', () => {
  const list = [{ action: { castSpell: { spellId: { spellId: 1259821 } }, condition: { cmp: { op: 'OpGe', lhs: { remainingTime: {} }, rhs: { const: { val: '120s' } } } } } }];
  assert.equal(extractForeverAPL(list), 'eureka if target_ttd >= 120');
  const rules = compileAPLToBytecode(parseAPLText('eureka if buff.decimation\neureka if !buff.decimation\neureka if time_to_execute(35) < -1\neureka if time_to_execute(35) > 0'));
  assert.deepEqual(rules.map(r=>r.cond1),[APL_COND.DECIMATION_AURA_ACTIVE,APL_COND.DECIMATION_AURA_INACTIVE,APL_COND.TIME_TO_EXECUTE_LT,APL_COND.TIME_TO_EXECUTE_GT]);
  assert.equal(rules[2].targetSpell1,35);
  assert.throws(()=>parseAPLText('eureka if time_to_execute(101) <= 0'),/percentage/);
});

test('Eureka APL obeys source gating, fight duration, boundaries, and unconditional use at pull in both shader modes', async t => {
  const build = source(); build.player.race='RaceGnome';
  const imported=(await resolveSavedBuild(build)).config;
  const specs=[
    {id:'pull',config:{duration:180,aplRules:compileAPLToBytecode(parseAPLText('Eureka!\nShadow Bolt'))}},
    {id:'execute180',config:{duration:180,aplRules:compileAPLToBytecode(parseAPLText('Eureka! if time_to_execute(35) <= 0\nShadow Bolt'))}},
    {id:'execute360',config:{duration:360,aplRules:compileAPLToBytecode(parseAPLText('Eureka! if time_to_execute(35) <= 0\nShadow Bolt'))}},
    {id:'source',config:imported},
    // Life Tap creates decisions precisely at the chosen 3/6-second boundaries.
    ...[['<=',6],['<',7.5],['>=',0],['>',0]].map(([op,expected])=>({id:`boundary${op}`,expected,config:{duration:12,aplRules:compileAPLToBytecode(parseAPLText(`eureka if time_to_execute(50) ${op} 0\nLife Tap`))}})),
  ];
  const cases=[],labels=[];
  for(const mode of ['detailed','fast'])for(const spec of specs){
    const config={race:'GNOME',intellect:5000,distance:0,baneRank:5,mp5:100,hit:100,nightfall:false,isb:false,...spec.config};
    labels.push({mode,...spec});cases.push({mode,width:2048,height:1,configWords:Array.from(packConfig(config)),uniforms:{numConfigs:1,fightsPerConfig:1,seed:101,offset:0,count:2048,gridWidth:2048,mode:2,eventBudget:65536}});
  }
  const trace = shader => {
    const before='report1=uvec4(floatBitsToUint(s.mana),eventFlags,floatBitsToUint(s.total),s.rngCalls);';
    assert.equal(shader.split(before).length,2);
    return shader.replace(before,before+'report2=uvec4(s.eurekaEnd,s.racialReady,s.decimationEnd,s.doomActive);');
  };
  const file=join(mkdtempSync(join(tmpdir(),'eureka-apl-')),'cases.json');
  writeFileSync(file,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,detailed:'#version 300 es\n'+trace(FRAGMENT),fast:'#version 300 es\n'+trace(FAST_FRAGMENT),cases}));
  const run=spawnSync('python3',[fileURLToPath(new URL('./headless_gles.py',import.meta.url)),file],{encoding:'utf8',timeout:120000,maxBuffer:16*1024*1024});
  assert.equal(run.status,0,run.stderr||String(run.error));
  const {outputs,renderer}=JSON.parse(run.stdout);t.diagnostic(renderer);
  outputs.forEach((out,index)=>{
    const label=labels[index],times=[];let expiry=0;
    for(let i=0;i<2048;i++)if(out[2][i*4]>expiry){expiry=out[2][i*4];times.push((expiry-8000000)/1e6);if(label.id==='source')assert.ok(out[2][i*4+2]>out[0][i*4],'source activation requires Decimation aura');}
    if(label.id==='pull')assert.deepEqual(times,[0,120],label.mode);
    else if(label.id==='execute180'||label.id==='source'){assert.equal(times.length,1,label.id);assert.ok(times[0]>=117,label.id);}
    else if(label.id==='execute360'){assert.equal(times.length,2);assert.ok(times[0]>=234);assert.ok(times[1]-times[0]>=120);}
    else assert.equal(times[0],label.expected,label.id);
  });
});
