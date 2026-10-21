import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {FRAGMENT,FAST_FRAGMENT,VERTEX} from '../src/kernel.js';
import {CONFIG,STATE,FAST_STATE,COMPACT_STRIPES,packConfig} from '../src/model.js';
import {parseAPLText,compileAPLToBytecode} from '../src/apl.js';
import {decodeDetailedBatch} from '../../scripts/forever_breakdown.mjs';
const apl=s=>compileAPLToBytecode(parseAPLText(s));
const close=(a,b,name)=>assert.ok(Math.abs(a-b)<0.03,`${name}: ${a} versus ${b}`);

test('pet packing uses racial base AP and the stronger school before initial Demonic Knowledge inheritance',()=>{
 const words=packConfig({petChoice:'succubus',spellPower:560,shadowPower:100,firePower:300,demonicKnowledge:3});
 const f=new Float32Array(words.buffer),keys=Object.keys(CONFIG);
 close(f[keys.indexOf('petSP')],140,'initial pet SP');
 close(f[keys.indexOf('petAP')],322,'initial pet AP');
});

test('Orc pets have no passive Command damage multiplier',()=>{
 const fields=['petFireboltMult','petMeleeMult','petLashMult'];
 for(const petChoice of ['imp','succubus']){
  const packed=race=>new Float32Array(packConfig({race,petChoice}).buffer);
  const human=packed('HUMAN'),orc=packed('ORC'),keys=Object.keys(CONFIG);
  for(const field of fields)assert.equal(orc[keys.indexOf(field)],human[keys.indexOf(field)],field);
 }
});

test('actual pet casts include the endpoint, global spell crit and delayed owner-stat inheritance in both modes',()=>{
 const defs=[
  ['imp',{duration:180,petChoice:'imp'}],
  ['sayaad',{duration:180,petChoice:'succubus'}],
  ['sayaad-affliction-crit',{duration:180,petChoice:'succubus',malevolence:5}],
  ['inherit',{duration:6,petChoice:'imp',spellPower:560,demonicKnowledge:3}],
  ['fury-on',{duration:6,petChoice:'imp',spellPower:560,demonicKnowledge:3,race:'ORC',aplRules:apl('Blood Fury\nLife Tap')}],
  ['fury-off',{duration:21,petChoice:'imp',spellPower:560,demonicKnowledge:3,race:'ORC',aplRules:apl('Blood Fury\nLife Tap')}],
  ['school-inherit',{duration:6,petChoice:'succubus',spellPower:560,shadowPower:100,firePower:300,demonicKnowledge:3}],
 ];
 const cases=[],metadata=[];
 for(const mode of ['detailed','fast'])for(const[id,c]of defs){
  const schema=mode==='detailed'?STATE:FAST_STATE;
  metadata.push({mode,id,schema});cases.push({mode,width:1,height:Math.ceil(Object.keys(schema).length/16),configWords:Array.from(packConfig({duration:180,intellect:5000,hit:100,distance:0,nightfall:false,isb:false,aplRules:apl('Life Tap'),...c})),uniforms:{numConfigs:1,fightsPerConfig:1,seed:101,offset:0,count:1,gridWidth:1,mode:1,eventBudget:65536}});
 }
 const t=fs.mkdtempSync(path.join(os.tmpdir(),'forever-pet-regression-'));
 try{
  const file=path.join(t,'cases.json');fs.writeFileSync(file,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,detailed:'#version 300 es\n'+FRAGMENT,fast:'#version 300 es\n'+FAST_FRAGMENT,cases}));
  const data=JSON.parse(execFileSync('python3',[new URL('./headless_gles.py',import.meta.url).pathname,file],{encoding:'utf8',timeout:120000,maxBuffer:16*1024*1024}));
  const results={};data.outputs.forEach((o,i)=>{
   const f=o.map(a=>new Float32Array(new Uint32Array(a).buffer));const m=metadata[i];
   const state=m.mode==='fast'?{done:o[0][1]&65535,total:f[0][0],petSpellCasts:o[3][0]&65535,petMeleeCasts:o[2][1]&65535}:Object.fromEntries(Object.entries(m.schema).map(([key,type],j)=>[key,(type==='f32'?f:o)[Math.floor(j%16/4)][Math.floor(j/16)*4+j%4]]));
   assert.equal(state.done,1,m.id);results[m.mode+'/'+m.id]=state;
  });
  for(const mode of ['detailed','fast']){
   assert.equal(results[mode+'/imp'].petSpellCasts,90,'Firebolt lands at 180s');
   assert.equal(results[mode+'/sayaad'].petSpellCasts,16,'Lash starts at 0 and lands at 180s');
   assert.equal(results[mode+'/sayaad'].total,results[mode+'/sayaad-affliction-crit'].total,'pets inherit global crit, not school-only talent crit');
  }
  close(results['detailed/inherit'].petSP,116,'owner DK reaches pet by the first heartbeat');
  close(results['detailed/fury-on'].petSP,121.6,'Blood Fury reaches pet');
  close(results['detailed/fury-off'].petSP,116,'Blood Fury expiry reaches pet');
  close(results['detailed/school-inherit'].petSP,146,'stronger school plus buffed owner DK');
  close(results['detailed/school-inherit'].petAP,332.2,'runtime AP includes owner DK');
  for(const[id]of defs)assert.equal(results['detailed/'+id].total,results['fast/'+id].total,id+' modes agree');
 }finally{fs.rmSync(t,{recursive:true,force:true});}
});

test('melee attack outcomes follow the level-63 glance, dodge and crit-suppression table',()=>{
 const count=1000,width=100,config={duration:180,intellect:200,crit:15,hit:100,distance:0,petChoice:'succubus',nightfall:false,isb:false,aplRules:apl('Life Tap')};
 const words=packConfig(config),crit=new Float32Array(words.buffer)[Object.keys(CONFIG).indexOf('crit')];
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'forever-pet-table-'));
 try{
  const file=path.join(dir,'cases.json');fs.writeFileSync(file,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,detailed:'#version 300 es\n'+FRAGMENT,cases:[{mode:'detailed',width,height:10*COMPACT_STRIPES,configWords:Array.from(words),uniforms:{numConfigs:1,fightsPerConfig:count,seed:101,offset:0,count,gridWidth:width,mode:0,eventBudget:65536}}]}));
  const g=JSON.parse(execFileSync('python3',[new URL('./headless_gles.py',import.meta.url).pathname,file],{encoding:'utf8',timeout:120000,maxBuffer:128*1024*1024}));
  const states=decodeDetailedBatch(g.outputs[0],width,count),sum=k=>states.reduce((n,s)=>n+s[k],0),n=sum('petMeleeCasts');
  assert.ok(Math.abs(sum('petMeleeMisses')/n-0.065)<0.006,'dodge remains after hit cap');
  assert.ok(Math.abs(sum('petMeleeGlances')/n-0.40)<0.007,'glance chance');
  assert.ok(Math.abs(sum('petMeleeCrits')/n-(crit-0.048))<0.007,'three-level crit suppression');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
