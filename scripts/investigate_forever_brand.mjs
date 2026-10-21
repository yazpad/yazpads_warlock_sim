// Matched source results, with independently toggled Brand/Decimation hit gates.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {FRAGMENT,VERTEX} from '../threejs_webgl_des/src/kernel.js';
import {packConfig,COMPACT_STRIPES} from '../threejs_webgl_des/src/model.js';
import {decodeDetailedBatch,aggregateOurs,compareBreakdowns} from './forever_breakdown.mjs';
const root=path.resolve(import.meta.dirname,'..'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const baselineBytes=fs.readFileSync(path.join(root,'fixtures/benchmark_history/race-stat-300-before-brand-fixes.json.gz'));
const baseline=JSON.parse(gunzipSync(baselineBytes));
const oldSource=gunzipSync(fs.readFileSync(path.join(root,'fixtures/benchmark_history/brand-before-kernel.js.gz'))).toString();
if(hash(oldSource)!==baseline.localHashes['threejs_webgl_des/src/kernel.js'])throw new Error('Archived kernel differs');
const moduleSource=oldSource.replace("from './model.js'",`from '${new URL('../threejs_webgl_des/src/model.js',import.meta.url).href}'`);
const oldKernel=(await import('data:text/javascript;base64,'+Buffer.from(moduleSource).toString('base64'))).FRAGMENT;
const rows=baseline.rows.filter(r=>r.preset==='demo_shadow_brand');
const output={status:'running',diagnosticOnly:true,iterations:1000,seed:101,sourceRevision:baseline.source.revision,baselineReportHash:hash(baselineBytes),scriptHash:hash(fs.readFileSync(import.meta.filename)),kernelSourceHash:hash(fs.readFileSync(path.join(root,'threejs_webgl_des/src/kernel.js'))),notes:'60 Shadow Brand race/stat profiles. Gates are independently disabled in the new ordering; order-only still rolls hit at completion and resolves Searing Pain synchronously. Baseline uses the exact archived old shader. Independent RNG streams; source results and requests unchanged.',variants:[]};
if(baseline.iterations!==1000||baseline.seed!==101||rows.length!==60)throw new Error('Unexpected baseline matrix');
const hitBranch='if((outcome&4u)!=0u?((outcome&2u)!=0u):(random01()>=c.hit)){countMiss(spell);return;}';
const brandOnMiss='if(spell==5u&&c.demonicBrand!=0u){s.brandCharges=c.demonicBrandRank*2u;s.brandEnd=s.now+10000000u;}';
if(!FRAGMENT.includes(hitBranch)||!FRAGMENT.includes('if(landed&&c.decimation'))throw new Error('Ablation anchors changed');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'forever-brand-'));
try{
 for(const variant of ['before','order-only','brand-hit-only','decimation-hit-only','both']){
  let shader=variant==='before'?oldKernel:FRAGMENT;
  if(variant==='order-only'||variant==='decimation-hit-only')shader=shader.replace(hitBranch,hitBranch.replace('countMiss(spell);',brandOnMiss+'countMiss(spell);'));
  if(variant==='order-only'||variant==='brand-hit-only')shader=shader.replace('if(landed&&c.decimation','if(c.decimation');
  const file=path.join(temp,variant+'.json');
  fs.writeFileSync(file,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,detailed:'#version 300 es\n'+shader,cases:rows.map(r=>({mode:'detailed',width:100,height:10*COMPACT_STRIPES,configWords:Array.from(packConfig(r.config)),uniforms:{numConfigs:1,fightsPerConfig:1000,seed:101,offset:0,count:1000,gridWidth:100,mode:0,eventBudget:65536}}))}));
  const gpu=JSON.parse(execFileSync('python3',[path.join(root,'threejs_webgl_des/validation/headless_gles.py'),file],{encoding:'utf8',timeout:600000,maxBuffer:512*1024*1024}));
  const results=gpu.outputs.map((o,i)=>{
   const row=rows[i],states=decodeDetailedBatch(o,100,1000),ours=aggregateOurs(states,row.config),mean=states.reduce((n,s)=>n+s.total/row.config.duration,0)/1000;
   return {id:row.id,race:row.race,profile:row.profile,requestHash:row.requestHash,mean,foreverMean:row.forever.mean,delta:mean-row.forever.mean,comparison:compareBreakdowns(ours,row.breakdown.forever)};
  });
  const metrics={maeDps:results.reduce((n,r)=>n+Math.abs(r.delta),0)/60,biasDps:results.reduce((n,r)=>n+r.delta,0)/60};
  output.variants.push({variant,shaderHash:hash(shader),...metrics,rows:results});output.renderer=gpu.renderer;
  fs.writeFileSync(path.join(root,'FOREVER_BRAND_ABLATIONS.json'),JSON.stringify(output,null,2)+'\n');console.log(variant,metrics);
 }
 output.status='complete';fs.writeFileSync(path.join(root,'FOREVER_BRAND_ABLATIONS.json'),JSON.stringify(output,null,2)+'\n');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
