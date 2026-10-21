// Read-only source logs plus diagnostic GPU traces; no source-engine hooks.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {FRAGMENT,VERTEX} from '../threejs_webgl_des/src/kernel.js';
import {packConfig} from '../threejs_webgl_des/src/model.js';
const root=path.resolve(import.meta.dirname,'..'),checkout='/tmp/forever-run-source';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const bytes=fs.readFileSync(path.join(root,'fixtures/benchmark_history/race-stat-300-before-brand-fixes.json.gz'));
const baseline=JSON.parse(gunzipSync(bytes));
const selected=[['HUMAN','baseline'],['HUMAN','hit_0'],['HUMAN','hit_16'],['TROLL','baseline']];
const rows=selected.map(([race,profile])=>baseline.rows.find(r=>r.preset==='demo_shadow_brand'&&r.race===race&&r.profile===profile));
const revision=execFileSync('git',['rev-parse','HEAD'],{cwd:checkout,encoding:'utf8'}).trim();
if(revision!==baseline.source.revision)throw new Error('Unexpected reference revision');
const sources=['sim/warlock/talents_demonology.go','sim/warlock/searing_pain.go','sim/warlock/shadowbolt.go','sim/warlock/pets.go'];
const sourceHashes=Object.fromEntries(sources.map(f=>[f,hash(fs.readFileSync(path.join(checkout,f)))]));
for(const [f,h] of Object.entries(sourceHashes))if(h!==baseline.source.hashes[f])throw new Error('Source changed: '+f);
const oldSource=gunzipSync(fs.readFileSync(path.join(root,'fixtures/benchmark_history/brand-before-kernel.js.gz'))).toString();
if(hash(oldSource)!==baseline.localHashes['threejs_webgl_des/src/kernel.js'])throw new Error('Archived kernel changed');
const old=(await import('data:text/javascript;base64,'+Buffer.from(oldSource.replace("from './model.js'",`from '${new URL('../threejs_webgl_des/src/model.js',import.meta.url).href}'`)).toString('base64'))).FRAGMENT;
const output={sourceRevision:revision,sourceHashes,baselineHash:hash(bytes),scriptHash:hash(fs.readFileSync(import.meta.filename)),traceWrapperHash:hash(fs.readFileSync(path.join(root,'scripts/forever_trace/main.go'))),notes:'One debug fight per engine/case, seed 101; engine RNG streams are independent. GPU spell indices: 0 Shadow Bolt, 5 Searing Pain, 13 Soul Fire, 999 no selected action. First player choice precedes the event trace. Miss flags describe all damage in that event; correlate with its spell/actor. No source engine or production hooks.',rows:[]};
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'forever-brand-traces-'));
try{
 const binary=path.join(temp,'trace');execFileSync('/tmp/go/bin/go',['build','-tags=with_db','-o',binary,path.join(root,'scripts/forever_trace/main.go')],{cwd:checkout});
 for(const row of rows){
  const file=path.join(temp,row.id+'.json');fs.writeFileSync(file,JSON.stringify(row.request));
  const result=JSON.parse(execFileSync(binary,[file],{cwd:checkout,encoding:'utf8',maxBuffer:32*1024*1024}));
  if(result.error)throw new Error(JSON.stringify(result.error));
  output.rows.push({id:row.id,request:row.request,requestHash:row.requestHash,sourceLogsHash:hash(result.logs),sourceEvents:result.logs.split('\n').filter(l=>l.includes('Casting ')&&!l.includes(' - ')||/SpellID: (17923|1293696|440873)/.test(l)&&!/\[DEBUG\]/.test(l)),gpu:{}});
 }
 for(const [name,kernel] of [['before',old],['after',FRAGMENT]]){
  let shader=kernel.replace('Event lastEvent;','Event lastEvent;uint chosen=999u;').replaceAll('eventFlags=0u;','eventFlags=0u;chosen=999u;');
  for(const [from,to] of [['void beginCast(uint spell){','void beginCast(uint spell){chosen=spell;'],['void tap(){','void tap(){chosen=7u;'],['void castDoom(){','void castDoom(){chosen=6u;'],['report0=uvec4(s.now,','report2=uvec4(chosen,s.brandCharges,s.brandEnd,s.decimationEnd);report3=uvec4(s.ready,s.casting,s.rngCalls,s.trance);report0=uvec4(s.now,']]){
   if(!shader.includes(from))throw new Error('Trace anchor changed: '+from);shader=shader.replace(from,to);
  }
  const file=path.join(temp,name+'.json');fs.writeFileSync(file,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,detailed:'#version 300 es\n'+shader,cases:rows.map(r=>({mode:'detailed',width:1024,height:1,configWords:Array.from(packConfig(r.config)),uniforms:{numConfigs:1,fightsPerConfig:1,seed:101,offset:0,count:1024,gridWidth:1024,mode:2,eventBudget:65536}}))}));
  const gpu=JSON.parse(execFileSync('python3',[path.join(root,'threejs_webgl_des/validation/headless_gles.py'),file],{encoding:'utf8',timeout:180000,maxBuffer:64*1024*1024}));
  output.renderer=gpu.renderer;
  gpu.outputs.forEach((raw,i)=>{
   const f0=new Float32Array(new Uint32Array(raw[0]).buffer),f1=new Float32Array(new Uint32Array(raw[1]).buffer);
   output.rows[i].gpu[name]={shaderHash:hash(shader),events:Array.from({length:1024},(_,j)=>({time:raw[0][4*j]/1e6,kind:raw[0][4*j+1],spell:raw[0][4*j+2],damage:f0[4*j+3],mana:f1[4*j],flags:raw[1][4*j+1],chosen:raw[2][4*j],brandCharges:raw[2][4*j+1],brandEnd:raw[2][4*j+2]/1e6,decimationEnd:raw[2][4*j+3]/1e6})).filter((e,j,a)=>!j||JSON.stringify(e)!==JSON.stringify(a[j-1]))};
  });
 }
 fs.writeFileSync(path.join(root,'FOREVER_BRAND_TRACES.json'),JSON.stringify(output,null,2)+'\n');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
