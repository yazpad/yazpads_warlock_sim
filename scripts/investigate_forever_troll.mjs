// Independent cooldown-policy and millisecond-clock ablations, with source traces.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {gunzipSync} from 'node:zlib';
import {FRAGMENT,VERTEX} from '../threejs_webgl_des/src/kernel.js';
import {packConfig,COMPACT_STRIPES} from '../threejs_webgl_des/src/model.js';
import {decodeDetailedBatch,aggregateOurs,compareBreakdowns} from './forever_breakdown.mjs';
const root=path.resolve(import.meta.dirname,'..'),checkout='/tmp/forever-run-source';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const baseline=JSON.parse(gunzipSync(fs.readFileSync(path.join(root,'fixtures/benchmark_history/race-stat-300-before-troll-fixes.json.gz'))));
const source=gunzipSync(fs.readFileSync(path.join(root,'fixtures/benchmark_history/troll-before-kernel.js.gz'))).toString();
if(hash(source)!==baseline.localHashes['threejs_webgl_des/src/kernel.js'])throw new Error('Historical kernel differs');
const old=(await import('data:text/javascript;base64,'+Buffer.from(source.replace("from './model.js'",`from '${new URL('../threejs_webgl_des/src/model.js',import.meta.url).href}'`)).toString('base64'))).FRAGMENT;
const autoBefore='if(c.race==3u&&c.autoCooldowns!=0u){activateEureka();return;}';
const autoAfter=autoBefore+'\n if(c.race==2u&&c.autoCooldowns!=0u){activateBerserking();return;}';
const gcdBefore='uint(max(1000000.0,1500000.0/hasteMultiplier()))';
const gcdAfter='uint(floor(max(1000000.0,1500000.0/hasteMultiplier())/1000.0+0.5))*1000u';
const castBefore='duration=uint(float(duration)/hasteMultiplier());';
const castAfter='duration=uint(floor(float(duration)/hasteMultiplier()/1000.0+0.5))*1000u;';
for(const anchor of [autoBefore,gcdBefore,castBefore])if(!old.includes(anchor))throw new Error('Historical anchor differs');
const rows=baseline.rows.filter(r=>r.preset==='destro'&&r.race==='TROLL');
const report={status:'running',diagnosticOnly:true,iterations:1000,seed:101,sourceRevision:baseline.source.revision,scriptHash:hash(fs.readFileSync(import.meta.filename)),kernelSourceHash:hash(source),notes:'12 Troll Destruction profiles; exact archived pre-fix kernel and unchanged source results. Timers round to nearest millisecond as in core/cast.go. Independent engine RNG streams.',variants:[],traces:[]};
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'forever-troll-'));
const save=()=>fs.writeFileSync(path.join(root,'FOREVER_TROLL_INVESTIGATION.json'),JSON.stringify(report,null,2)+'\n');
try{
 const binary=path.join(temp,'trace');execFileSync('/tmp/go/bin/go',['build','-tags=with_db','-o',binary,path.join(root,'scripts/forever_trace/main.go')],{cwd:checkout});
 report.sourceHashes=Object.fromEntries(['sim/core/racials.go','sim/core/cast.go','sim/core/unit.go'].map(f=>[f,hash(fs.readFileSync(path.join(checkout,f)))]));
 for(const [f,h] of Object.entries(report.sourceHashes))if(h!==baseline.source.hashes[f])throw new Error('Source differs: '+f);
 for(const profile of ['baseline','sp_1000','regen_high']){
  const row=rows.find(r=>r.profile===profile),file=path.join(temp,profile+'.json');fs.writeFileSync(file,JSON.stringify(row.request));
  const result=JSON.parse(execFileSync(binary,[file],{cwd:checkout,encoding:'utf8',maxBuffer:32*1024*1024}));
  if(result.error)throw new Error(JSON.stringify(result.error));
  report.traces.push({id:row.id,request:row.request,requestHash:row.requestHash,sourceLogHash:hash(result.logs),sourceEvents:result.logs.split('\n').filter(l=>l.includes('20554')||l.includes('Casting ')&&!l.includes(' - ')),gpu:{}});
 }
 for(const variant of ['before','auto-only','clock-only','both']){
  let shader=old;
  if(variant==='auto-only'||variant==='both')shader=shader.replace(autoBefore,autoAfter);
  if(variant==='clock-only'||variant==='both')shader=shader.replace(gcdBefore,gcdAfter).replace(castBefore,castAfter);
  const file=path.join(temp,variant+'.json');fs.writeFileSync(file,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,detailed:'#version 300 es\n'+shader,cases:rows.map(r=>({mode:'detailed',width:100,height:10*COMPACT_STRIPES,configWords:Array.from(packConfig(r.config)),uniforms:{numConfigs:1,fightsPerConfig:1000,seed:101,offset:0,count:1000,gridWidth:100,mode:0,eventBudget:65536}}))}));
  const gpu=JSON.parse(execFileSync('python3',[path.join(root,'threejs_webgl_des/validation/headless_gles.py'),file],{encoding:'utf8',timeout:600000,maxBuffer:128*1024*1024}));
  const results=gpu.outputs.map((o,i)=>{const row=rows[i],states=decodeDetailedBatch(o,100,1000),mean=states.reduce((n,s)=>n+s.total/180,0)/1000;return {id:row.id,profile:row.profile,foreverMean:row.forever.mean,mean,delta:mean-row.forever.mean,comparison:compareBreakdowns(aggregateOurs(states,row.config),row.breakdown.forever)};});
  const metrics={maeDps:results.reduce((n,r)=>n+Math.abs(r.delta),0)/12,biasDps:results.reduce((n,r)=>n+r.delta,0)/12};
  report.variants.push({variant,shaderHash:hash(shader),...metrics,rows:results});report.renderer=gpu.renderer;save();console.log(variant,metrics);
  if(variant==='before'||variant==='both'){
   let trace=shader.replace('Event lastEvent;','Event lastEvent;uint chosen=999u;').replaceAll('eventFlags=0u;','eventFlags=0u;chosen=999u;');
   for(const [from,to] of [['void beginCast(uint spell){','void beginCast(uint spell){chosen=spell;'],['void tap(){','void tap(){chosen=7u;'],['void castDoom(){','void castDoom(){chosen=6u;'],['void castConflagrate(){','void castConflagrate(){chosen=8u;'],['void castShadowburn(){','void castShadowburn(){chosen=9u;'],['report0=uvec4(s.now,','report2=uvec4(chosen,s.racialEnd,s.racialReady,s.immEnd);report3=uvec4(s.ready,s.casting,s.corrEnd,s.agonyEnd);report0=uvec4(s.now,']]){if(!trace.includes(from))throw new Error('Trace anchor differs');trace=trace.replace(from,to);}
   const file=path.join(temp,'trace-'+variant+'.json');fs.writeFileSync(file,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,detailed:'#version 300 es\n'+trace,cases:report.traces.map(t=>({mode:'detailed',width:1024,height:1,configWords:Array.from(packConfig(rows.find(r=>r.id===t.id).config)),uniforms:{numConfigs:1,fightsPerConfig:1,seed:101,offset:0,count:1024,gridWidth:1024,mode:2,eventBudget:65536}}))}));
   const data=JSON.parse(execFileSync('python3',[path.join(root,'threejs_webgl_des/validation/headless_gles.py'),file],{encoding:'utf8',timeout:180000,maxBuffer:64*1024*1024}));
   data.outputs.forEach((raw,i)=>{report.traces[i].gpu[variant]={shaderHash:hash(trace),events:Array.from({length:1024},(_,j)=>({time:raw[0][j*4]/1e6,kind:raw[0][j*4+1],spell:raw[0][j*4+2],chosen:raw[2][j*4],racialEnd:raw[2][j*4+1]/1e6,ready:raw[3][j*4]/1e6})).filter((e,j,a)=>!j||JSON.stringify(e)!==JSON.stringify(a[j-1]))};});save();
  }
 }
 report.status='complete';save();
}finally{fs.rmSync(temp,{recursive:true,force:true});}
