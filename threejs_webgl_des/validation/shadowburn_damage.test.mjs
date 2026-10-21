import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {FRAGMENT,FAST_FRAGMENT,VERTEX} from '../src/kernel.js';
import {packConfig,COMPACT_STRIPES} from '../src/model.js';
import {parseAPLText,compileAPLToBytecode} from '../src/apl.js';
import {decodeDetailedBatch} from '../../scripts/forever_breakdown.mjs';

test('Shadowburn rank 6 matches source mean and full-hit variance across spell power in both modes',()=>{
 // Values are from the generated source row 18871, not inferred from GPU output.
 const base=273.20001220703125,coefficient=0.42899999022483826,variance=0.10924369841814041;
 const count=8192,width=128,height=count/width;
 const profiles=[{spellPower:0},{spellPower:250},{spellPower:500},{spellPower:1000},
  {spellPower:500,shadowMultiplier:1.2,shadowMasteryBonus:0.1,afBonus:0.1}];
 const anchor=' decide();\n for(uint step=0u;step<eventBudget;step++)';
 const cases=[],metadata=[];
 for(const mode of ['detailed','fast'])for(const p of profiles){
  metadata.push({mode,p});
  cases.push({mode,width,height:height*(mode==='detailed'?COMPACT_STRIPES:1),configWords:Array.from(packConfig({
   duration:1,distance:0,petChoice:'none',nightfall:false,isb:false,partialResists:false,
   shadowburn:true,aplRules:compileAPLToBytecode(parseAPLText('Shadowburn')),...p})),
   uniforms:{numConfigs:1,fightsPerConfig:count,seed:101,offset:0,count,gridWidth:width,mode:0,eventBudget:65536}});
 }
 const force=shader=>{assert.ok(shader.includes(anchor));return shader.replace(anchor,' c.hit=1.0;c.shadowCrit=0.0;\n'+anchor);};
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'shadowburn-damage-'));
 try{
  const file=path.join(temp,'cases.json');fs.writeFileSync(file,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,detailed:'#version 300 es\n'+force(FRAGMENT),fast:'#version 300 es\n'+force(FAST_FRAGMENT),cases}));
  const gpu=JSON.parse(execFileSync('python3',[new URL('./headless_gles.py',import.meta.url).pathname,file],{encoding:'utf8',timeout:180000,maxBuffer:256*1024*1024}));
  const detailed=[];
  gpu.outputs.forEach((raw,i)=>{
   const {mode,p}=metadata[i];let amounts;
   if(mode==='detailed'){
    const states=decodeDetailedBatch(raw,width,count);
    for(const s of states){assert.equal(s.casts9,1);assert.equal(s.hits9,1);assert.equal(s.crits9,0);assert.equal(s.total,s.damage9);}
    amounts=states.map(s=>s.damage9);detailed.push(amounts);
   }else{
    const floats=new Float32Array(new Uint32Array(raw[0]).buffer);
    amounts=Array.from({length:count},(_,j)=>{assert.equal(raw[0][4*j+1]&65535,1);return floats[4*j];});
    assert.deepEqual(amounts,detailed[i-profiles.length],'fast and detailed damage agree');
   }
   const scale=(p.shadowMultiplier||1)*(1+(p.shadowMasteryBonus||0))*(1+(p.afBonus||0));
   const expected=(base+coefficient*p.spellPower)*scale;
   const mean=amounts.reduce((n,v)=>n+v,0)/count;
   const observedVariance=amounts.reduce((n,v)=>n+(v-mean)**2,0)/(count-1);
   const expectedVariance=(expected*variance)**2/12;
   assert.ok(Math.abs(mean-expected)<4*Math.sqrt(expectedVariance/count),`${mode}: source mean at SP ${p.spellPower}`);
   assert.ok(Math.abs(observedVariance/expectedVariance-1)<0.04,`${mode}: source variance scales with total hit at SP ${p.spellPower}`);
   for(const value of amounts)assert.ok(value>=expected*(1-variance/2)-0.002&&value<=expected*(1+variance/2)+0.002,'damage stays within source bounds');
  });
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
