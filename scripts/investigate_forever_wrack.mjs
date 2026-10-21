// Controlled ablations of the pre-fix production kernel, against unchanged source fights.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {FRAGMENT,VERTEX} from '../threejs_webgl_des/src/kernel.js';
import {packConfig,COMPACT_STRIPES} from '../threejs_webgl_des/src/model.js';
import {decodeDetailedBatch,aggregateOurs,compareBreakdowns} from './forever_breakdown.mjs';
const root=path.resolve(import.meta.dirname,'..');
const report=JSON.parse(gunzipSync(fs.readFileSync(path.join(root,'fixtures/benchmark_history/race-stat-300-before-wrack-fixes.json.gz'))));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const expected=report.localHashes['threejs_webgl_des/src/kernel.js'];
// --kernel accepts the archived pre-fix source for reproducing these historical probes.
let kernel=FRAGMENT;
if(process.argv[2]==='--kernel'){
 const bytes=fs.readFileSync(process.argv[3]);
 const source=(process.argv[3].endsWith('.gz')?gunzipSync(bytes):bytes).toString();
 if(hash(source)!==expected)throw new Error('Historical kernel hash differs from baseline report');
 const mod=await import('data:text/javascript;base64,'+Buffer.from(source.replace("from './model.js'",`from '${new URL('../threejs_webgl_des/src/model.js',import.meta.url).href}'`)).toString('base64'));
 kernel=mod.FRAGMENT;
}
const countBefore='+(s.siphonTicks>0u?1u:0u)+1u;';
const countAfter='+(s.siphonTicks>0u?1u:0u)+(s.doomActive!=0u?1u:0u);';
const hitBefore='spend(11u);\n     s.drainHopeEnd=';
const hitAfter='spend(11u);\n     if(random01()>=c.hit){countMiss(11u);gcd();return;}\n     s.drainHopeEnd=';
if(!kernel.includes(countBefore)||!kernel.includes(hitBefore))throw new Error('Use pre-fix kernel for historical ablations');
const rows=report.rows.filter(r=>r.preset==='aff_wrack'&&r.race==='HUMAN');
const output={diagnosticOnly:true,seed:report.seed,iterations:report.iterations,sourceRevision:report.source.revision,baselineKernelSourceHash:expected,shaderHash:hash(kernel),scriptHash:hash(fs.readFileSync(import.meta.filename)),notes:'12 Human stat profiles; unchanged source requests/results. Independent engine RNGs; ablations change local random consumption. Full production sweep follows separately.',variants:[]};
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'forever-wrack-'));
try{
 for(const variant of ['before','hit-only','count-only','both']){
  let shader=kernel;
  if(variant==='hit-only'||variant==='both')shader=shader.replace(hitBefore,hitAfter);
  if(variant==='count-only'||variant==='both')shader=shader.replace(countBefore,countAfter);
  const cases=rows.map(r=>({mode:'detailed',width:100,height:10*COMPACT_STRIPES,configWords:Array.from(packConfig(r.config)),uniforms:{numConfigs:1,fightsPerConfig:1000,seed:101,offset:0,count:1000,gridWidth:100,mode:0,eventBudget:65536}}));
  const file=path.join(temp,variant+'.json');fs.writeFileSync(file,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,detailed:'#version 300 es\n'+shader,cases}));
  const gpu=JSON.parse(execFileSync('python3',[path.join(root,'threejs_webgl_des/validation/headless_gles.py'),file],{encoding:'utf8',timeout:600000,maxBuffer:256*1024*1024}));
  const results=gpu.outputs.map((o,i)=>{const r=rows[i],states=decodeDetailedBatch(o,100,1000),ours=aggregateOurs(states,r.config),source=r.breakdown.forever;return {id:r.id,mean:states.reduce((n,s)=>n+s.total/r.config.duration,0)/states.length,foreverMean:r.forever.mean,comparison:compareBreakdowns(ours,source)};});
  output.variants.push({variant,shaderHash:hash(shader),maeDps:results.reduce((n,r)=>n+Math.abs(r.mean-r.foreverMean),0)/results.length,rows:results});
  output.renderer=gpu.renderer;fs.writeFileSync(path.join(root,'FOREVER_WRACK_ABLATIONS.json'),JSON.stringify(output,null,2)+'\n');console.log(variant,output.variants.at(-1).maeDps);
 }
}finally{fs.rmSync(temp,{recursive:true,force:true});}
