// Capture source debug logs and instrumented GPU actions through existing runners.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { FRAGMENT, VERTEX } from '../threejs_webgl_des/src/kernel.js';
import { packConfig } from '../threejs_webgl_des/src/model.js';
const root = path.resolve(import.meta.dirname, '..');
const { values: options } = parseArgs({ options: { checkout: { type:'string',default:'/tmp/forever-run-source' }, go:{type:'string',default:'/tmp/go/bin/go'} } });
const checkout = path.resolve(options.checkout);
const input = fs.readFileSync(path.join(root,'FOREVER_SWEEP_FOLLOWUP.json'));
const report = JSON.parse(input);
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const selected = [['destro','GNOME','regen_high'],['aff_wrack','UNDEAD','regen_low'],['demo_fire_brand','ORC','hit_16']];
const rows = selected.map(([p,r,s]) => report.rows.find(x=>x.preset===p&&x.race===r&&x.profile===s));
if (rows.some(r=>r?.status!=='complete')) throw new Error('Complete the follow-up sweep first');
let shader = FRAGMENT.replace('Event lastEvent;','Event lastEvent;uint chosen=999u;')
  .replaceAll('eventFlags=0u;','eventFlags=0u;chosen=999u;');
for (const [before,after] of [ ['void beginCast(uint spell){','void beginCast(uint spell){chosen=spell;'],
  ['void tap(){','void tap(){chosen=7u;'], ['void castDoom(){','void castDoom(){chosen=6u;'],
  ['void castShadowburn(){','void castShadowburn(){chosen=9u;'], ['void castConflagrate(){','void castConflagrate(){chosen=8u;'],
  ['spend(11u);','chosen=16u;spend(11u);'], ['report0=uvec4(s.now,','report2=uvec4(chosen,s.corrTicks,s.agonyTicks,s.doomActive);report3=uvec4(s.ready,s.casting,s.corrEnd,s.agonyEnd);report0=uvec4(s.now,'] ]) {
  if (!shader.includes(before)) throw new Error(`Trace anchor changed: ${before}`);
  shader=shader.replace(before,after);
}
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'forever-cause-traces-'));
const output={diagnosticOnly:true,sourceReportHash:hash(input),kernelHash:hash(FRAGMENT),seed:101,sourceRevision:execFileSync('git',['rev-parse','HEAD'],{cwd:checkout,encoding:'utf8'}).trim(),notes:'Single-fight traces use independent engine RNGs. chosen is an instrumented GPU spell index, 999 means no selected action. Source casts log starts; GPU accounting counts completions. Initial GPU action is outside the event trace.',rows:[]};
try {
  const binary=path.join(temp,'trace');
  execFileSync(options.go,['build','-tags=with_db','-o',binary,path.join(root,'scripts/forever_trace/main.go')],{cwd:checkout,stdio:['ignore','ignore','inherit']});
  output.exporterHash=hash(fs.readFileSync(binary));
  output.exporterSourceHash=hash(fs.readFileSync(path.join(root,'scripts/forever_trace/main.go')));
  for(const row of rows){
    const file=path.join(temp,row.preset+'.json');fs.writeFileSync(file,JSON.stringify(row.request));
    const result=JSON.parse(execFileSync(binary,[file],{cwd:checkout,encoding:'utf8',maxBuffer:32*1024*1024}));
    if(result.error)throw new Error(JSON.stringify(result.error));
    const lines=result.logs.split('\n');
    const regen=lines.filter(l=>l.includes('Gained ')&&l.includes('mana from {OtherID: 2')&&!l.includes(' - '));
    output.rows.push({caseId:row.id,requestHash:hash(fs.readFileSync(file)),sourceLogHash:hash(result.logs),sourcePlayerCasts:lines.filter(l=>l.includes('Casting ')&&!l.includes(' - ')),sourceInitialPets:lines.filter(l=>l.includes('Pet stats:')),sourcePlayerManaRegen:{events:regen.length,total:regen.reduce((n,l)=>n+Number(l.match(/Gained ([\d.]+) mana/)[1]),0),examples:regen.slice(0,5)}});
  }
  const manifest=path.join(temp,'gpu.json');
  fs.writeFileSync(manifest,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,detailed:'#version 300 es\n'+shader,cases:rows.map(r=>({mode:'detailed',width:1024,height:1,configWords:Array.from(packConfig(r.config)),uniforms:{numConfigs:1,fightsPerConfig:1,seed:101,offset:0,count:1024,gridWidth:1024,mode:2,eventBudget:65536}}))}));
  const gpu=JSON.parse(execFileSync('python3',[path.join(root,'threejs_webgl_des/validation/headless_gles.py'),manifest],{encoding:'utf8',maxBuffer:32*1024*1024,timeout:120000}));
  output.renderer=gpu.renderer;
  gpu.outputs.forEach((o,n)=>{const fv=new Float32Array(new Uint32Array(o[1]).buffer);output.rows[n].gpuEvents=Array.from({length:1024},(_,i)=>({t:o[0][4*i]/1e6,kind:o[0][4*i+1],spell:o[0][4*i+2],chosen:o[2][4*i],mana:fv[4*i],ready:o[3][4*i]/1e6,casting:o[3][4*i+1]})).filter((e,i,a)=>!i||e.t!==a[i-1].t||e.kind!==a[i-1].kind||e.spell!==a[i-1].spell);});
  fs.writeFileSync(path.join(root,'FOREVER_CAUSE_TRACES.json'),JSON.stringify(output,null,2)+'\n');
  console.log('Saved source and GPU traces for three outlier cases.');
} finally {fs.rmSync(temp,{recursive:true,force:true});}
