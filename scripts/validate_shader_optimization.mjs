// Replay the saved Forever matrix with identical inputs and seeds in both shaders.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { VERTEX, FRAGMENT, FAST_FRAGMENT } from '../threejs_webgl_des/src/kernel.js';
import { packConfig, COMPACT_STRIPES } from '../threejs_webgl_des/src/model.js';
import { decodeDetailedBatch } from './forever_breakdown.mjs';
const root=path.resolve(import.meta.dirname,'..');
const reference=JSON.parse(fs.readFileSync(path.join(root,'FOREVER_SWEEP.json')));
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'shader-parity-'));
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
try {
 fs.writeFileSync(path.join(temp,'package.json'),'{"type":"module"}');
 for(const file of ['kernel.js','model.js']) fs.writeFileSync(path.join(temp,file),execFileSync('git',['show',`HEAD:threejs_webgl_des/src/${file}`],{cwd:root}));
 const before=await import(pathToFileURL(path.join(temp,'kernel.js')));
 const report={reference:'FOREVER_SWEEP.json',referenceHash:hash(fs.readFileSync(path.join(root,'FOREVER_SWEEP.json'))),iterations:reference.iterations,seed:reference.seed,rows:[],renderer:null,shaderHashes:{before:hash(before.FRAGMENT),after:hash(FRAGMENT)}};
 for(const preset of reference.matrix.presets){
  const rows=reference.rows.filter(r=>r.preset===preset);
  assert(rows.every(r=>r.status==='complete'));
  const cases=rows.flatMap(row=>['before','after','fastBefore','fastAfter'].map(mode=>({mode,width:100,height:Math.ceil(reference.iterations/100)*(mode.startsWith('fast')?1:COMPACT_STRIPES),configWords:Array.from(packConfig(row.config)),uniforms:{numConfigs:1,fightsPerConfig:reference.iterations,seed:reference.seed,offset:0,count:reference.iterations,gridWidth:100,mode:0,eventBudget:65536}})));
  const manifest=path.join(temp,'manifest.json');
  fs.writeFileSync(manifest,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,before:'#version 300 es\n'+before.FRAGMENT,after:'#version 300 es\n'+FRAGMENT,fastBefore:'#version 300 es\n'+before.FAST_FRAGMENT,fastAfter:'#version 300 es\n'+FAST_FRAGMENT,cases}));
  const gpu=JSON.parse(execFileSync('python3',[path.join(root,'threejs_webgl_des/validation/headless_gles.py'),manifest],{encoding:'utf8',maxBuffer:512*1024*1024,timeout:600000}));
  report.renderer=gpu.renderer;
  rows.forEach((row,i)=>{
   assert.deepEqual(gpu.outputs[i*4+1],gpu.outputs[i*4],`${row.id}: detailed output changed`);
   assert.deepEqual(gpu.outputs[i*4+3],gpu.outputs[i*4+2],`${row.id}: fast output changed`);
   const states=decodeDetailedBatch(gpu.outputs[i*4+1],100,reference.iterations);
   assert(states.every(s=>s.done===1));
   const mean=states.reduce((a,s)=>a+s.total/row.config.duration,0)/states.length;
   report.rows.push({id:row.id,mean,foreverMean:row.forever.mean,delta:mean-row.forever.mean,identical:true});
  });
  console.log(`${preset}: ${rows.length} cases identical in fast and detailed modes`);
 }
 report.mae=report.rows.reduce((a,r)=>a+Math.abs(r.delta),0)/report.rows.length;
 report.status='complete';
 fs.writeFileSync(path.join(root,'FOREVER_OPTIMIZATION_PARITY.json'),JSON.stringify(report,null,2)+'\n');
 console.log({cases:report.rows.length,mae:report.mae});
}finally{fs.rmSync(temp,{recursive:true,force:true});}
