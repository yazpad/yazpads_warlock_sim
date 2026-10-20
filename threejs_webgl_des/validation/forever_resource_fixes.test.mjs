import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { FRAGMENT, FAST_FRAGMENT, VERTEX } from '../src/kernel.js';
import { CONFIG, STATE, FAST_STATE, packConfig } from '../src/model.js';
import { parseAPLText, compileAPLToBytecode } from '../src/apl.js';
import { resolveSavedBuild } from '../src/contracts/build_io.js';
const apl = text => compileAPLToBytecode(parseAPLText(text));
const close = (a,b,label) => assert.ok(Math.abs(a-b)<0.03,`${label}: ${a} versus ${b}`);

test('normal import retains automatic cooldown policy and active-Imp Blood Pact before stat multipliers', async () => {
  const fixture = JSON.parse(fs.readFileSync(new URL('../../fixtures/canonical_forever/demo_fire_brand.fixture.json',import.meta.url)));
  const source = structuredClone(fixture.sourceBuild);
  const a = await resolveSavedBuild(source);
  assert.equal(a.config.autoCooldowns,true);
  const noImp = structuredClone(source); noImp.player.warlock.options.classOptions.summon='NoSummon';
  const b = await resolveSavedBuild(noImp);
  assert.equal(a.config.stamina-b.config.stamina,54);
  assert.equal(a.config.maxHealth-b.config.maxHealth,540);
  const packed=packConfig(a.config), i=Object.keys(CONFIG).indexOf('petMaxMana');
  close(new Float32Array(packed.buffer)[i],(576+264*5)*1.15,'Imp mana');
});

test('resource costs, shared Nightfall, channel regeneration and Doom boundaries execute in both shader modes', () => {
  const definitions = [
    ['incinerate',{duration:11,book:true,baneRank:5,incinerate:true,cataclysmCostMult:0.9,aplRules:apl('Incinerate')}],
    ['conflagrate',{duration:3,book:true,immolate:true,conflagrate:true,baneRank:5,aplRules:apl('Immolate if target.debuff_remains("Immolate") <= 0\nConflagrate\nLife Tap')}],
    ['channel',{duration:15,drainHope:true,spirit:100,mp5:100,channelClipDelayMs:50,aplRules:apl('Wrack')}],
    ['doom',{duration:180,intellect:5000,curseOfDoom:true,aplRules:apl('Bane of Doom if target.debuff_remains("Bane of Doom") <= 0 && target_ttd >= 60\nSearing Pain')}],
    ['nightfall-shared',{duration:180,corruption:true,nightfall:true,nightfallChance:0.04,aplRules:apl('Corruption if target.debuff_remains("Corruption") <= 0\nShadow Bolt')}],
    ['nightfall-explicit',{duration:180,corruption:true,nightfall:true,nightfallChance:0.04,aplRules:apl('Corruption if target.debuff_remains("Corruption") <= 0\nNightfall: Shadow Bolt if buff.shadow_trance\nShadow Bolt')}],
    ['cooldown',{duration:180,intellect:5000,baneRank:5,decimation:true,decimationRank:2,aplRules:apl('Decimation: Soul Fire if decimation.active\nSearing Pain')}],
    ['imp-start',{duration:1,petChoice:'imp',felVitalityBonus:0.15,aplRules:apl('Life Tap')}],
  ];
  const cases=[],meta=[];
  for(const mode of ['detailed','fast'])for(const [id,c] of definitions){
    const schema=mode==='detailed'?STATE:FAST_STATE;
    meta.push({mode,id,schema});
    cases.push({mode,width:1,height:Math.ceil(Object.keys(schema).length/16),configWords:Array.from(packConfig({nightfall:false,isb:false,hit:100,petChoice:'none',distance:0,...c})),uniforms:{numConfigs:1,fightsPerConfig:1,seed:17,offset:0,count:1,gridWidth:1,mode:1,eventBudget:65536}});
  }
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'forever-resource-fixes-'));
  try{
    const file=path.join(temp,'cases.json');
    fs.writeFileSync(file,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,detailed:'#version 300 es\n'+FRAGMENT,fast:'#version 300 es\n'+FAST_FRAGMENT,cases}));
    const gpu=JSON.parse(execFileSync('python3',[new URL('./headless_gles.py',import.meta.url).pathname,file],{encoding:'utf8',timeout:120000,maxBuffer:16*1024*1024}));
    const results={};
    gpu.outputs.forEach((o,i)=>{
      const floats=o.map(a=>new Float32Array(new Uint32Array(a).buffer));
      const state=meta[i].mode==='fast'?{total:floats[0][0],done:o[0][1]&65535,procs:o[0][3]>>>16,taps:o[0][3]&65535,petCasts:o[1][3]&65535,mana:floats[3][2],spent:floats[3][3]}:Object.fromEntries(Object.entries(meta[i].schema).map(([k,t],j)=>[k,(t==='f32'?floats:o)[Math.floor(j%16/4)][Math.floor(j/16)*4+j%4]]));
      assert.equal(state.done,1,`${meta[i].mode}/${meta[i].id}`);
      results[`${meta[i].mode}/${meta[i].id}`]=state;
    });
    for(const mode of ['detailed','fast']){
      close(results[`${mode}/incinerate`].spent,5*325*0.9,`${mode} Incinerate cost`);
      close(results[`${mode}/conflagrate`].spent,380+255,`${mode} Conflagrate cost`);
      const channel=results[`${mode}/channel`];
      const manaIndex=Object.keys(CONFIG).indexOf('maxMana');
      const channelCase=cases[meta.findIndex(m=>m.mode===mode&&m.id==='channel')];
      const initialMana=new Float32Array(new Uint32Array(channelCase.configWords).buffer)[manaIndex];
      close(mode==='fast'?channel.mana-initialMana+channel.spent:channel.gained,300+2*0.05*(6.25+100/8),`${mode} paid-channel regeneration`);
      const doom=results[`${mode}/doom`];if(mode==='detailed'){assert.equal(doom.doomReady,180000000);assert.equal(doom.doomActive,0);assert.equal(doom.ticks6,3);assert.equal(results[`${mode}/cooldown`].soulFireReady%100000,0,'Soul Fire readiness has no float rounding microseconds');}
      const shared=results[`${mode}/nightfall-shared`],explicit=results[`${mode}/nightfall-explicit`];
      assert.ok(shared.procs>0,'seed must exercise Nightfall');
      assert.equal(shared.total,explicit.total,`${mode} every Shadow Bolt consumes Nightfall`);
      assert.equal(shared.spent,explicit.spent);
      const imp=results[`${mode}/imp-start`];if(mode==='detailed')close(imp.petMana,1896*1.15,`${mode} pet capacity`);assert.equal(imp.petCasts,0,'first Firebolt lands after 1s');
    }
    for(const [id] of definitions){close(results[`fast/${id}`].total,results[`detailed/${id}`].total,`${id} mode damage parity`);close(results[`fast/${id}`].spent,results[`detailed/${id}`].spent,`${id} mode resource parity`);}
  }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
