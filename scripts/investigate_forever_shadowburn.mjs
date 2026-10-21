// Mean and variance ablations against four matched 10,000-fight source results.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {VERTEX} from '../threejs_webgl_des/src/kernel.js';
import {packConfig,COMPACT_STRIPES} from '../threejs_webgl_des/src/model.js';
import {decodeDetailedBatch,aggregateOurs,compareBreakdowns} from './forever_breakdown.mjs';
const root=path.resolve(import.meta.dirname,'..'),checkout='/tmp/forever-run-source';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const baselineBytes=fs.readFileSync(path.join(root,'FOREVER_TROLL_HIGH_SAMPLE_AFTER.json'));
const baseline=JSON.parse(baselineBytes);
const oldSource=gunzipSync(fs.readFileSync(path.join(root,'fixtures/benchmark_history/shadowburn-before-kernel.js.gz'))).toString();
if(hash(oldSource)!==baseline.localHashes['threejs_webgl_des/src/kernel.js'])throw new Error('Archived kernel differs from high-sample baseline');
if(baseline.iterations!==10000||baseline.rows.length!==4)throw new Error('Unexpected high-sample baseline');
const old=(await import('data:text/javascript;base64,'+Buffer.from(oldSource.replace("from './model.js'",`from '${new URL('../threejs_webgl_des/src/model.js',import.meta.url).href}'`)).toString('base64'))).FRAGMENT;
const before='(266.0+roll*29.05+0.429*p)';
if(!old.includes(before))throw new Error('Historical formula differs');
const report={status:'running',diagnosticOnly:true,iterations:10000,seed:101,baselineReportHash:hash(baselineBytes),baselineReport:'FOREVER_TROLL_HIGH_SAMPLE_AFTER.json',baselineKernelHash:hash(oldSource),scriptHash:hash(fs.readFileSync(import.meta.filename)),variants:[]};
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'forever-shadowburn-'));
const save=()=>fs.writeFileSync(path.join(root,'FOREVER_SHADOWBURN_INVESTIGATION.json'),JSON.stringify(report,null,2)+'\n');
try{
 report.sourceRevision=execFileSync('git',['rev-parse','HEAD'],{cwd:checkout,encoding:'utf8'}).trim();
 if(report.sourceRevision!==baseline.source.revision)throw new Error('Source revision differs');
 report.sourceHashes=Object.fromEntries(['sim/warlock/shadowburn.go','sim/warlock/talents_destruction.go','sim/warlock/spell_data_auto_gen.go','sim/core/spell_result.go','sim/core/spelldata/effect.go'].map(f=>[f,hash(fs.readFileSync(path.join(checkout,f)))]));
 for(const [f,h] of Object.entries(report.sourceHashes))if(h!==baseline.source.hashes[f])throw new Error('Source file differs: '+f);
 const binary=path.join(temp,'audit');execFileSync('/tmp/go/bin/go',['build','-tags=with_db','-o',binary,path.join(root,'scripts/forever_spell_audit/main.go')],{cwd:checkout});
 report.auditWrapperHash=hash(fs.readFileSync(path.join(root,'scripts/forever_spell_audit/main.go')));
 report.audit=JSON.parse(execFileSync(binary,['18871'],{cwd:checkout,encoding:'utf8'}))[0];
 const {average,coefficient,directVariance:variance}=report.audit;
 const formulas={before, 'mean-only':`(${average}+(roll-0.5)*29.05+${coefficient}*p)`,
  'variance-only':`(280.525+${coefficient}*p)*(1.0+(roll-0.5)*${variance})`,
  both:`(${average}+${coefficient}*p)*(1.0+(roll-0.5)*${variance})`};
 for(const [variant,formula] of Object.entries(formulas)){
  const shader=old.replace(before,formula),file=path.join(temp,variant+'.json');
  fs.writeFileSync(file,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,detailed:'#version 300 es\n'+shader,cases:baseline.rows.map(r=>({mode:'detailed',width:100,height:100*COMPACT_STRIPES,configWords:Array.from(packConfig(r.config)),uniforms:{numConfigs:1,fightsPerConfig:10000,seed:101,offset:0,count:10000,gridWidth:100,mode:0,eventBudget:65536}}))}));
  const gpu=JSON.parse(execFileSync('python3',[path.join(root,'threejs_webgl_des/validation/headless_gles.py'),file],{encoding:'utf8',timeout:600000,maxBuffer:512*1024*1024}));
  const rows=gpu.outputs.map((o,i)=>{
   const r=baseline.rows[i],states=decodeDetailedBatch(o,100,10000),mean=states.reduce((n,s)=>n+s.total/180,0)/10000;
   return {id:r.id,profile:r.profile,requestHash:r.requestHash,mean,foreverMean:r.forever.mean,delta:mean-r.forever.mean,comparison:compareBreakdowns(aggregateOurs(states,r.config),r.breakdown.forever)};
  });
  const metrics={maeDps:rows.reduce((n,r)=>n+Math.abs(r.delta),0)/rows.length,shadowburnMeanDeltaDps:rows.reduce((n,r)=>n+r.comparison.find(x=>x.key==='player:9').deltaDps,0)/rows.length};
  report.variants.push({variant,formula,shaderHash:hash(shader),...metrics,rows});report.renderer=gpu.renderer;save();console.log(variant,metrics);
 }
 report.status='complete';save();
}finally{fs.rmSync(temp,{recursive:true,force:true});}
