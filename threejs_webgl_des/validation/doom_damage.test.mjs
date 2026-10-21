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
const apl=text=>compileAPLToBytecode(parseAPLText(text));

test('Doom uses current power at its sole tick, supports crits, and receives no Wrack amplification in either mode',()=>{
 const definitions=[];
 for(const power of [0,250,1000])for(const overlap of [false,true])definitions.push({id:`power-${power}-${overlap}`,config:{spellPower:power,drainHope:overlap},expected:1742+4*power});
 definitions.push({id:'crit',config:{spellPower:500,charges:true,dotCrit:2},expected:2*(1742+4*500)});
 definitions.push({id:'modifiers',config:{spellPower:500,shadowMultiplier:1.2,shadowMasteryBonus:0.1},expected:(1742+4*500)*1.2*1.1});
 definitions.push({id:'fury-expired',config:{race:'ORC',spellPower:500,aplRules:apl('Blood Fury\nBane of Doom if target_ttd >= 60\nLife Tap')},expected:1742+4*500});
 definitions.push({id:'fury-at-tick',config:{race:'ORC',spellPower:500,aplRules:apl('Blood Fury if target_ttd <= 10\nBane of Doom if target_ttd >= 60\nLife Tap')},expected:1742+4*550});
 const anchor=' decide();\n for(uint step=0u;step<eventBudget;step++)';
 const force=shader=>{assert.ok(shader.includes(anchor));return shader.replace(anchor,' c.hit=1.0;c.shadowCrit=c.charges!=0u?1.0:0.0;if(c.drainHope!=0u)s.drainHopeEnd=c.end;\n'+anchor);};
 const cases=[],metadata=[];
 for(const mode of ['detailed','fast'])for(const d of definitions){
  const config={duration:65,distance:0,petChoice:'none',nightfall:false,isb:false,partialResists:false,curseOfDoom:true,
   aplRules:apl('Bane of Doom if target_ttd >= 60\nLife Tap'),...d.config};
  metadata.push({mode,...d});cases.push({mode,width:1,height:mode==='detailed'?COMPACT_STRIPES:1,configWords:Array.from(packConfig(config)),uniforms:{numConfigs:1,fightsPerConfig:1,seed:101,offset:0,count:1,gridWidth:1,mode:0,eventBudget:65536}});
 }
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'doom-damage-'));
 try{
  const file=path.join(dir,'cases.json');fs.writeFileSync(file,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,detailed:'#version 300 es\n'+force(FRAGMENT),fast:'#version 300 es\n'+force(FAST_FRAGMENT),cases}));
  const gpu=JSON.parse(execFileSync('python3',[new URL('./headless_gles.py',import.meta.url).pathname,file],{encoding:'utf8',timeout:180000,maxBuffer:32*1024*1024}));
  const totals={};
  gpu.outputs.forEach((raw,i)=>{
   const {mode,id,expected}=metadata[i];let total;
   if(mode==='detailed'){
    const [s]=decodeDetailedBatch(raw,1,1);total=s.total;
    assert.equal(s.casts6,1,id);assert.equal(s.ticks6,1,id);assert.equal(s.damage6,total,id);
   }else{assert.equal(raw[0][1]&65535,1);total=new Float32Array(new Uint32Array(raw[0]).buffer)[0];}
   assert.ok(Math.abs(total-expected)<0.005,`${mode}/${id}: ${total} vs ${expected}`);totals[mode+'/'+id]=total;
  });
  for(const d of definitions)assert.equal(totals['detailed/'+d.id],totals['fast/'+d.id]);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
