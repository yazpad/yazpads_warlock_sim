// Controlled diagnostics against the saved full-default comparison; no production config edits.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {FRAGMENT,VERTEX} from '../threejs_webgl_des/src/kernel.js';
import {CONFIG,packConfig,COMPACT_STRIPES} from '../threejs_webgl_des/src/model.js';
import {SPELL_ID_TO_ACTION} from '../threejs_webgl_des/src/classes/forever_bridge.js';
import {decodeDetailedBatch,aggregateOurs} from './forever_breakdown.mjs';
const root=path.resolve(import.meta.dirname,'..');
const baseline=JSON.parse(fs.readFileSync(path.join(root,'FOREVER_FULL_DEFAULTS_BENCHMARK.json')));
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
for(const [file,hash] of Object.entries(baseline.localHashes))assert.equal(sha(fs.readFileSync(path.join(root,file))),hash,`${file}: baseline changed`);
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'forever-default-causes-'));
const variants={
 food_only:c=>({...c,spellPower:c.spellPower+22,mp5:c.mp5-8}),
 oil_only:c=>({...c,spellPower:c.spellPower-36,crit:c.crit-1}),
 all_stat_corrections:c=>({...c,spellPower:c.spellPower-14,mp5:c.mp5-8,crit:c.crit-1}),
};
const renderOnly=process.argv.includes('--render-only');
const report=renderOnly?JSON.parse(fs.readFileSync(path.join(root,'FOREVER_FULL_DEFAULTS_INVESTIGATION.json'))):{schemaVersion:1,status:'running',startedAt:new Date().toISOString(),iterations:baseline.iterations,seed:baseline.seed,
 baselineHash:sha(fs.readFileSync(path.join(root,'FOREVER_FULL_DEFAULTS_BENCHMARK.json'))),
 cause:'Nightfin Soup 13931 is 22 SP in Forever; our mapping uses 8 MP5. Brilliant Wizard Oil needs an equipped weapon, absent in all five defaults; our mapping always adds 36 SP and 1% crit.',rows:[]};
const indices={bolt:0,corr:1,agony:2,immo:3,incinerate:4,searing:5,curse:6,decimateSoulFire:7,conflag:8,shadowburn:9,siphon:10,wrack:11};
function sourceByKey(row){
 const result=new Map();
 for(const a of row.breakdown.forever){
  let key;
  if(a.actor!=='player'){
   if(a.id.spellId===1293697||a.id.spellId===1293698)key='pet:brand';
   else if(a.id.spellId===11763||a.id.spellId===11780)key='pet:spell';
   else if(a.id.otherId==='OtherActionAttack')key='pet:melee';
   else continue;
  }
  else if(a.id.itemId===18588)key='player:14';
  else if(a.id.spellId===1311680)key='player:15';
  else if(a.id.spellId===11689)key='player:tap';
  else {const i=indices[SPELL_ID_TO_ACTION[a.id.spellId]];if(i!==undefined)key=`player:${i}`;}
  if(!key)continue;
  const old=result.get(key)||{casts:0,damage:0,dps:0};
  for(const f of ['casts','damage','dps'])old[f]+=a[f];result.set(key,old);
 }
 return result;
}
const summarize=rows=>({maeDps:rows.reduce((s,r)=>s+Math.abs(r.delta),0)/rows.length,mapePct:rows.reduce((s,r)=>s+Math.abs(r.deltaPct),0)/rows.length});
function save(){
 fs.writeFileSync(path.join(root,'FOREVER_FULL_DEFAULTS_INVESTIGATION.json'),JSON.stringify(report,null,2)+'\n');
 const lines=['# Full-default difference investigation','',report.cause,'',
  `${report.status}; ${report.iterations.toLocaleString('en-US')} fights per build and variant, seed ${report.seed}. Saved Forever reference means are reused. Production imports and mechanics are unchanged. Each ablation runs the same GPU lanes as the baseline, including across batch boundaries.`, '',
  '| Build | Baseline error DPS | Food corrected | Oil corrected | Both corrected | Both error % |',
  '| --- | ---: | ---: | ---: | ---: | ---: |'];
 for(const row of report.rows){const v=row.variants;lines.push(`| ${row.id} | ${row.baselineDelta.toFixed(3)} | ${v.food_only.delta.toFixed(3)} | ${v.oil_only.delta.toFixed(3)} | ${v.all_stat_corrections.delta.toFixed(3)} | ${v.all_stat_corrections.deltaPct.toFixed(3)}% |`);}
 if(report.summary){lines.push('', '| Variant | MAE DPS | MAPE |','| --- | ---: | ---: |');for(const [id,s]of Object.entries(report.summary))lines.push(`| ${id} | ${s.maeDps.toFixed(3)} | ${s.mapePct.toFixed(3)}% |`);}
 lines.push('', '## Largest remaining spell differences after both stat corrections', '', '| Build | Spell | Forever DPS | Our DPS | Delta DPS | Forever casts | Our casts |', '| --- | --- | ---: | ---: | ---: | ---: | ---: |');
 for(const row of report.rows)for(const s of [...row.variants.all_stat_corrections.spells].sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta)).slice(0,7))lines.push(`| ${row.id} | ${s.name} | ${s.foreverDps.toFixed(3)} | ${s.oursDps.toFixed(3)} | ${s.delta.toFixed(3)} | ${s.foreverCasts.toFixed(3)} | ${s.oursCasts.toFixed(3)} |`);
 fs.writeFileSync(path.join(root,'FOREVER_FULL_DEFAULTS_INVESTIGATION.md'),lines.join('\n')+'\n');
}
if(renderOnly){
 for(const row of report.rows){
  const sources=sourceByKey(baseline.rows.find(r=>r.id===row.id));
  for(const variant of Object.values(row.variants))variant.spells=variant.detail.rows.map(s=>{const f=sources.get(s.key)||{dps:0,casts:0};return {key:s.key,name:s.name,foreverDps:f.dps,oursDps:s.dps,delta:s.dps-f.dps,foreverCasts:f.casts,oursCasts:s.casts};});
 }
 save();fs.rmSync(temp,{recursive:true,force:true});process.exit(0);
}
try{
 for(const base of baseline.rows){
  const batches=[],metadata=[];
  for(const [variant,alter]of Object.entries(variants)){
   const config=alter(base.config);
   if(variant==='all_stat_corrections'){
    for(const [stat,index]of Object.entries({spellPower:5,mp5:31,intellect:3,spirit:13,stamina:2}))assert.equal(config[stat],base.reference.initialPlayerStats[index],`${base.id}/${stat}`);
    const packed=packConfig(config),floats=new Float32Array(packed.buffer);
    assert.ok(Math.abs(floats[Object.keys(CONFIG).indexOf('crit')]*100-base.reference.computeStats.raidStats.parties[0].players[0].finalStats.pseudoStats[15])<0.00001,'crit matches');
   }
   for(let offset=0;offset<baseline.iterations;offset+=256){const count=Math.min(256,baseline.iterations-offset),width=Math.min(32,count);
    batches.push({mode:'detailed',width,height:Math.ceil(count/width)*COMPACT_STRIPES,configWords:Array.from(packConfig(config)),uniforms:{numConfigs:1,fightsPerConfig:baseline.iterations,seed:baseline.seed,offset,count,gridWidth:width,mode:0,eventBudget:65536}});
    metadata.push({variant,config,width,count});
   }
  }
  const file=path.join(temp,`${base.id}.json`);fs.writeFileSync(file,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,detailed:'#version 300 es\n'+FRAGMENT,cases:batches}));
  console.log(`${base.id}: food, oil, combined ablations (${baseline.iterations} fights each)...`);
  const gpu=JSON.parse(execFileSync('python3',[path.join(root,'threejs_webgl_des/validation/headless_gles.py'),file],{encoding:'utf8',maxBuffer:512*1024*1024}));
  const states={};gpu.outputs.forEach((batch,i)=>{const m=metadata[i];(states[m.variant]??=[]).push(...decodeDetailedBatch(batch,m.width,m.count));});
  const row={id:base.id,forever:base.forever,baselineDelta:base.delta,variants:{}};
  const sources=sourceByKey(base);
  for(const [variant,samples]of Object.entries(states)){
   const config=metadata.find(m=>m.variant===variant).config;
   assert.equal(samples.length,baseline.iterations);
   let mean=0,m2=0;samples.forEach((s,i)=>{const x=s.total/config.duration,d=x-mean;mean+=d/(i+1);m2+=d*(x-mean);});
   const detail=aggregateOurs(samples,config),delta=mean-base.forever.mean;
   row.variants[variant]={config,mean,sd:Math.sqrt(m2/(samples.length-1)),delta,deltaPct:delta/base.forever.mean*100,changeFromBaseline:mean-base.ours.mean,detail,
    spells:detail.rows.map(s=>{const f=sources.get(s.key)||{dps:0,casts:0};return {key:s.key,name:s.name,foreverDps:f.dps,oursDps:s.dps,delta:s.dps-f.dps,foreverCasts:f.casts,oursCasts:s.casts};})};
  }
  report.rows.push(row);save();console.log(`${base.id}: baseline ${base.delta.toFixed(3)} DPS, combined ${row.variants.all_stat_corrections.delta.toFixed(3)} DPS (${row.variants.all_stat_corrections.deltaPct.toFixed(3)}%)`);
 }
 report.summary={baseline:summarize(baseline.rows),...Object.fromEntries(Object.keys(variants).map(id=>[id,summarize(report.rows.map(r=>r.variants[id]))]))};
 report.status='complete';report.completedAt=new Date().toISOString();save();console.log(JSON.stringify(report.summary));
}finally{fs.rmSync(temp,{recursive:true,force:true});}
