import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {FRAGMENT,FAST_FRAGMENT,VERTEX} from '../src/kernel.js';
import {STATE,packConfig} from '../src/model.js';
import {parseAPLText,compileAPLToBytecode} from '../src/apl.js';
const apl=text=>compileAPLToBytecode(parseAPLText(text));

test('Brand and Decimation require landed hits; Searing Pain is immediate and all bolts resolve hit before travel',t=>{
 const defs=[
  ['searing',2,120,'Searing Pain'],
  ['bolt',3,120,'Shadow Bolt'],
  ['nightfall-shared',3,120,'Shadow Bolt'],
  ['nightfall-explicit',3,120,'Nightfall: Shadow Bolt if buff.shadow_trance\nShadow Bolt'],
  ['stored-bolt-hit',6,30,'Shadow Bolt'],
 ];
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'brand-timing-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 const results={};
 for(const mode of ['detailed','fast']){
  let shader=mode==='detailed'?FRAGMENT:FAST_FRAGMENT;
  const anchor=' decide();\n for(uint step=0u;step<eventBudget;step++)';assert.ok(shader.includes(anchor));
  // Force application outcomes and, for instant bolts, begin the diagnostic in execute.
  shader=shader.replace(anchor,` c.hit=c.partial!=0u?1.0:0.0;
 if(c.nightfall>0.0){s.now=2000000u;s.trance=1u;}
${anchor}`);
  // Change hit chance while bolts travel: the pending hit must retain its cast result.
  shader=shader.replace('case 2u:s.castBonus=', 'case 2u:if(c.travel==1250000u)c.hit=1.0-c.hit;s.castBonus=');
  if(mode==='fast')shader=shader.replace('case 14u:return floatBitsToUint(s.mana);case 15u:return floatBitsToUint(s.spent);',
   'case 14u:return s.brandCharges;case 15u:return s.decimationEnd;');
  const cases=[],metadata=[];
  for(const [id,duration,distance,text] of defs)for(const hit of [false,true]){
   const config={duration,distance,partialResists:hit,petChoice:'none',intellect:5000,
    corruption:false,agony:false,nightfall:id.startsWith('nightfall'),nightfallChance:id.startsWith('nightfall')?0.04:0,
    isb:false,baneRank:5,demonicBrand:true,demonicBrandRank:2,decimation:true,decimationRank:2,
    aplRules:apl(text)};
   metadata.push({id,hit});cases.push({mode,width:1,height:mode==='fast'?1:Math.ceil(Object.keys(STATE).length/16),configWords:Array.from(packConfig(config)),
    uniforms:{numConfigs:1,fightsPerConfig:1,seed:101,offset:0,count:1,gridWidth:1,mode:1,eventBudget:65536}});
  }
  const file=path.join(dir,mode+'.json');fs.writeFileSync(file,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,[mode]:'#version 300 es\n'+shader,cases}));
  const gpu=JSON.parse(execFileSync('python3',[new URL('./headless_gles.py',import.meta.url).pathname,file],{encoding:'utf8',timeout:180000,maxBuffer:32*1024*1024}));
  gpu.outputs.forEach((raw,i)=>{
   const f=raw.map(x=>new Float32Array(new Uint32Array(x).buffer));
   const s=mode==='fast'?{total:f[0][0],done:raw[0][1]&65535,brandCharges:raw[3][2],decimationEnd:raw[3][3]}:
    Object.fromEntries(Object.entries(STATE).map(([key,type],j)=>[key,(type==='f32'?f:raw)[Math.floor(j%16/4)][Math.floor(j/16)*4+j%4]]));
   const {id,hit}=metadata[i],label=`${mode}/${id}/${hit}`;results[label]=s;assert.equal(s.done,1,label);
   if(id==='searing'){
    assert.equal(s.brandCharges,hit?4:0,label+' Brand stacks');
    assert.equal(s.decimationEnd,hit?11500000:0,label+' Decimation');
    assert.equal(s.total>0,hit,label+' damage before any projectile could arrive');
   }else if(id==='stored-bolt-hit'){
    if(!hit)assert.equal(s.total,0,label+' misses remain misses after hit chance changes in flight');
    else assert.ok(s.total>0,label+' landed cast remains landed');
   }else{
    assert.equal(s.total,0,label+' projectile still in flight');
    assert.equal(s.decimationEnd,hit?(id==='bolt'?12500000:12000000):0,label+' cast-time hit grants Decimation');
    assert.equal(s.brandCharges,0,label+' bolts never grant Brand');
   }
  });
 }
 for(const [id] of defs)for(const hit of [false,true])assert.equal(results[`detailed/${id}/${hit}`].total,results[`fast/${id}/${hit}`].total);
});
