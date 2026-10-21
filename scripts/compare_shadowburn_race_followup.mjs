// Rerun the archived old GPU formula against exactly the new 20-case source requests/results.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {VERTEX} from '../threejs_webgl_des/src/kernel.js';
import {packConfig,COMPACT_STRIPES} from '../threejs_webgl_des/src/model.js';
import {decodeDetailedBatch,aggregateOurs,compareBreakdowns} from './forever_breakdown.mjs';
import {summarizeSamples} from './sweep_forever_parity.mjs';
const root=path.resolve(import.meta.dirname,'..'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const bytes=fs.readFileSync(path.join(root,'FOREVER_SHADOWBURN_RACE_HIGH_SAMPLE_AFTER.json'));
const after=JSON.parse(bytes);
if(after.status!=='complete'||after.rows.length!==20||after.iterations!==10000)throw new Error('Complete the balanced higher-sample sweep first');
const oldSource=gunzipSync(fs.readFileSync(path.join(root,'fixtures/benchmark_history/shadowburn-before-kernel.js.gz'))).toString();
const before=JSON.parse(gunzipSync(fs.readFileSync(path.join(root,'fixtures/benchmark_history/race-stat-300-before-shadowburn-fix.json.gz'))));
if(hash(oldSource)!==before.localHashes['threejs_webgl_des/src/kernel.js'])throw new Error('Archived kernel differs');
const old=(await import('data:text/javascript;base64,'+Buffer.from(oldSource.replace("from './model.js'",`from '${new URL('../threejs_webgl_des/src/model.js',import.meta.url).href}'`)).toString('base64'))).FRAGMENT;
const report={status:'running',diagnosticOnly:true,iterations:10000,seed:101,afterReportHash:hash(bytes),scriptHash:hash(fs.readFileSync(import.meta.filename)),beforeKernelHash:hash(oldSource),sourceRevision:after.source.revision,rows:[]};
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'shadowburn-races-'));
try{
 for(const race of after.matrix.races){
  const rows=after.rows.filter(r=>r.race===race),file=path.join(temp,race+'.json');
  fs.writeFileSync(file,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,detailed:'#version 300 es\n'+old,cases:rows.map(r=>({mode:'detailed',width:100,height:100*COMPACT_STRIPES,configWords:Array.from(packConfig(r.config)),uniforms:{numConfigs:1,fightsPerConfig:10000,seed:101,offset:0,count:10000,gridWidth:100,mode:0,eventBudget:65536}}))}));
  const gpu=JSON.parse(execFileSync('python3',[path.join(root,'threejs_webgl_des/validation/headless_gles.py'),file],{encoding:'utf8',timeout:600000,maxBuffer:512*1024*1024}));
  gpu.outputs.forEach((o,i)=>{
   const r=rows[i],states=decodeDetailedBatch(o,100,10000),ours=summarizeSamples(states.map(s=>s.total/180)),breakdown=aggregateOurs(states,r.config);
   report.rows.push({id:r.id,race:r.race,profile:r.profile,requestHash:r.requestHash,forever:r.forever,before:{ours,delta:ours.mean-r.forever.mean,comparison:compareBreakdowns(breakdown,r.breakdown.forever)},after:{ours:r.ours,delta:r.delta,comparison:r.breakdown.comparison}});
  });
  console.log(race+' complete');
 }
 for(const stage of ['before','after']){
  report[stage]={maeDps:report.rows.reduce((n,r)=>n+Math.abs(r[stage].delta),0)/20,biasDps:report.rows.reduce((n,r)=>n+r[stage].delta,0)/20,
   shadowburnMeanDeltaDps:report.rows.reduce((n,r)=>n+r[stage].comparison.find(x=>x.key==='player:9').deltaDps,0)/20};
 }
 report.status='complete';fs.writeFileSync(path.join(root,'FOREVER_SHADOWBURN_RACE_COMPARISON.json'),JSON.stringify(report,null,2)+'\n');console.log(report.before,report.after);
}finally{fs.rmSync(temp,{recursive:true,force:true});}
