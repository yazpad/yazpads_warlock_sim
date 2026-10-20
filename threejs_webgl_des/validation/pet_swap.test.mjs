import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { APL_ACTION, STATE_WORDS, packConfig, decodeStates, buildDefaultAPLRules } from '../src/model.js';
import { FRAGMENT, FAST_FRAGMENT, VERTEX } from '../src/kernel.js';
import { parseAPLText, compileAPLToBytecode, formatAPLToText, generateAPLForPreset } from '../src/apl.js';
import { getAvailableActionsForSpec, createRule, individualToBytecodeRules, createDefaultIndividual, getHandcraftedRuleForAction } from '../src/classes/warlock_apl_search.js';
import { getTalentFlagsFromRanks } from '../src/talents.js';
import { buildFightConfig } from '../src/config_builder.js';
import vm from 'node:vm';
import * as model from '../src/model.js';
import { describePetSwapOutcome } from '../src/apl_rules.js';
import { summarizeDetails } from '../src/detailed_results.js';
const source=readFileSync(new URL('../src/engine.js',import.meta.url),'utf8')
 .replace(/^import .*?;\n/gm,'').replace(/^import \{[\s\S]*?from 'three';\n/m,'').replaceAll('export ', '');
const globals={...model,summarizeDetails,Float64Array,Float32Array,Uint32Array};
vm.runInNewContext(source,globals);
const summarize=globals.summarize;

const talent={...getTalentFlagsFromRanks({}),demonicPact:true,sacRank:1,felDomination:true,masterSummoner:2,masterDemo:5,soulLink:true};
const action=APL_ACTION.SACRIFICE_SUCCUBUS_SUMMON_IMP;
const text='sacrifice_succubus_summon_imp\nShadow Bolt';

test('pet swap is discoverable only with the required talents and round trips without changing defaults',()=>{
 for(const missing of ['demonicPact','sacRank','felDomination']){
  assert.ok(!getAvailableActionsForSpec({...talent,[missing]:0}).some(a=>a.id==='petSwap'));
 }
 const available=getAvailableActionsForSpec(talent);
 assert.ok(available.some(a=>a.id==='petSwap'));
 assert.equal(compileAPLToBytecode(parseAPLText(text))[0].action,action);
 assert.equal(compileAPLToBytecode(parseAPLText(formatAPLToText(parseAPLText(text))))[0].action,action);
 assert.equal(individualToBytecodeRules({rules:[createRule('petSwap','TARGET_HP_LE',35)]})[0].action,action);
 assert.equal(getHandcraftedRuleForAction('petSwap').param,35);
 assert.ok(!createDefaultIndividual(available,talent).rules.some(r=>r.id==='petSwap'));
 assert.ok(!generateAPLForPreset('shadow').some(r=>r.id==='petSwap'));
 assert.ok(!buildDefaultAPLRules({rotation:'shadow'}).some(r=>r.action===action));
 const config=buildFightConfig({talent,pet:'succubus',sac:'imp'});
 assert.equal(config.demonicPact,true);assert.equal(config.masterSummoner,2);
});

test('actual GLSL swap is once per fight, talent guarded, replaces buffs and pet, and costs a GCD',t=>{
 const base={duration:20,distance:0,hit:100,nightfall:false,isb:false,partialResists:false,
  petChoice:'succubus',sacImp:true,demonicPact:true,demonicSacrifice:true,felDomination:true,masterSummoner:2,masterDemo:5,soulLink:true,
  shadowMultiplier:1.15*1.10*1.03,fireMultiplier:1.03,
  aplRules:compileAPLToBytecode(parseAPLText(text))};
 const inputs=[['on',base],['short',{...base,duration:1}],['off',{...base,aplRules:compileAPLToBytecode(parseAPLText('Shadow Bolt'))}],
  ...['demonicPact','demonicSacrifice','felDomination'].map(key=>[key,{...base,[key]:false}]),
  ['wrongPet',{...base,petChoice:'imp'}],['noPet',{...base,petChoice:'none'}],
  ['long',{...base,duration:700}],['delayed',{...base,aplRules:compileAPLToBytecode(parseAPLText('sacrifice_succubus_summon_imp if target_hp_pct <= 50\nShadow Bolt'))}],
  ['rank1',{...base,masterSummoner:1}],['duplicate',{...base,aplRules:compileAPLToBytecode(parseAPLText('sacrifice_succubus_summon_imp\n'+text))}]];
 const uniforms={numConfigs:1,fightsPerConfig:1,seed:42,offset:0,count:1,gridWidth:1,mode:1,eventBudget:65536};
 const cases=inputs.map(([,config])=>({mode:'detailed',width:1,height:Math.ceil(STATE_WORDS/16),configWords:Array.from(packConfig(config)),uniforms}));
 cases.push({mode:'detailed',width:1,height:model.COMPACT_STRIPES,configWords:Array.from(packConfig(inputs.find(([name])=>name==='delayed')[1])),uniforms:{...uniforms,mode:0}});
 cases.push({mode:'fast',width:1,height:1,configWords:Array.from(packConfig(base)),uniforms:{...uniforms,mode:0}});
 const path=join(mkdtempSync(join(tmpdir(),'warlock-pet-swap-')),'cases.json');
 writeFileSync(path,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,detailed:'#version 300 es\n'+FRAGMENT,fast:'#version 300 es\n'+FAST_FRAGMENT,cases}));
 const run=spawnSync('python3',[fileURLToPath(new URL('./headless_gles.py',import.meta.url)),path],{encoding:'utf8',timeout:120000,maxBuffer:8*1024*1024});
 assert.equal(run.status,0,run.stderr||String(run.error));
 const {outputs,renderer}=JSON.parse(run.stdout);t.diagnostic(renderer);
 const results=Object.fromEntries(inputs.map(([name],index)=>{
  const out=outputs[index],words=new Uint32Array(STATE_WORDS);
  for(let i=0;i<words.length;i++)words[i]=out[Math.floor(i%16/4)][Math.floor(i/16)*4+i%4];
  return [name,decodeStates(words.buffer,1)[0]];
 }));
 for(const state of Object.values(results))assert.equal(state.done,1);
 for(const name of ['on','long','delayed','rank1','duplicate']){
  const s=results[name];assert.equal(s.petSwapUsed,1);assert.equal(s.petGeneration,1);assert.equal(s.activePet,1);
  assert.ok(Math.abs(s.petShadowScale-1/(1.15*1.10))<1e-6);
  assert.ok(Math.abs(s.petFireScale-1.15*1.10)<1e-6);
  assert.ok(s.impCasts>0);
 }
 for(const name of ['off','demonicPact','demonicSacrifice','felDomination','wrongPet','noPet'])assert.equal(results[name].petSwapUsed,0);
 assert.equal(results.on.petMeleeCasts,0);assert.equal(results.on.petSpellCasts,results.on.impCasts);
 assert.equal(results.on.casts0,Math.floor((base.duration-1.5)/3));
 assert.equal(results.short.casts0,0);assert.equal(results.short.activePet,1);
 assert.ok(Math.abs(results.short.spent-1393*0.64*0.10)<0.001);
 assert.ok(results.on.spent>=1393*0.64*0.10);
 assert.equal(results.duplicate.total,results.on.total);assert.equal(results.duplicate.spent,results.on.spent);
 assert.ok(results.delayed.petMeleeCasts>0);assert.ok(results.delayed.petSpellCasts>results.delayed.impCasts);
 const summary=summarize([results.delayed],20);
 assert.ok(summary.spells.some(s=>s.name==='Imp Firebolt'&&s.casts>0));
 assert.ok(summary.spells.some(s=>s.name==='Succubus Lash of Pain'&&s.casts>0));
 const compact=[];
 globals.decodeBatch2D(outputs.at(-2).map(a=>new Uint32Array(a)),1,1,{duration:20},0,compact);
 const compactSummary=summarize(compact,20);
 assert.equal(compactSummary.petSwaps,1);
 for(const name of ['Imp Firebolt','Succubus Lash of Pain']){
  const actual=compactSummary.spells.find(s=>s.name===name),expected=summary.spells.find(s=>s.name===name);
  assert.ok(actual&&actual.damage>0,`Missing ${name} in GPU compact damage breakdown`);
  assert.equal(actual.damage,expected.damage);assert.equal(actual.casts,expected.casts);
 }
 const fast=outputs.at(-1);assert.equal(fast[0][1]&65535,1);
 assert.equal(new Float32Array(new Uint32Array([fast[0][0]]).buffer)[0],results.on.total);
});


test('damage breakdown explains skipped pet swaps instead of silently omitting Imp damage',()=>{
 const config={demonicPact:true,demonicSacrifice:true,felDomination:true,petChoice:'succubus',aplRules:compileAPLToBytecode(parseAPLText(text))};
 const summary={detailed:true,petSwaps:0,spells:[]};
 assert.match(describePetSwapOutcome({...config,felDomination:false},summary),/requires Fel Domination/);
 assert.match(describePetSwapOutcome({...config,petChoice:'imp'},summary),/active Succubus/);
 assert.match(describePetSwapOutcome({...config,aplRules:compileAPLToBytecode(parseAPLText('Shadow Bolt\nsacrifice_succubus_summon_imp'))},summary),/above it blocks/);
 assert.match(describePetSwapOutcome(config,summary),/conditions were not met/);
 assert.match(describePetSwapOutcome(config,{...summary,petSwaps:1}),/ended before the Imp/);
 assert.match(describePetSwapOutcome(config,{...summary,petSwaps:1,spells:[{name:'Imp Firebolt',casts:1}]}),/Pet swap executed/);
 assert.equal(describePetSwapOutcome({...config,aplRules:[]},summary),'');
});
