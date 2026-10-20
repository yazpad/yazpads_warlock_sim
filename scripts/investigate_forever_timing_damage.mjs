// Diagnostic counterfactuals only: no production config or shader is changed.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {FRAGMENT,VERTEX} from '../threejs_webgl_des/src/kernel.js';
import {packConfig,COMPACT_STRIPES,APL_ACTION,APL_COND} from '../threejs_webgl_des/src/model.js';
import {decodeDetailedBatch,aggregateOurs} from './forever_breakdown.mjs';
const root=path.resolve(import.meta.dirname,'..');
const baseline=JSON.parse(fs.readFileSync(path.join(root,'FOREVER_GEAR_FREE_BENCHMARK.json')));
const probes=[
 {id:'wrack_ge_4',preset:'aff_wrack',edit:c=>{for(const r of c.aplRules)if(r.action===APL_ACTION.DRAIN_HOPE){for(const k of ['cond','cond1','cond2'])if(r[k]===APL_COND.DOT_REM_GT)r[k]=APL_COND.DOT_REM_GE;}return c;}},
 {id:'wrack_end_after_equal_time',preset:'aff_wrack',edit:c=>c,shader:s=>s.replace('enqueue(c.end,13u,0u,0u);','enqueue(c.end+1u,13u,0u,0u);')},
 {id:'wrack_ge4_cost200_channel_delay',preset:'aff_wrack',edit:c=>{for(const r of c.aplRules)if(r.action===APL_ACTION.DRAIN_HOPE){for(const k of ['cond','cond1','cond2'])if(r[k]===APL_COND.DOT_REM_GT)r[k]=APL_COND.DOT_REM_GE;}return c;},shader:s=>s.replace('case 11u:return 240.0;', 'case 11u:return 200.0;').replace('s.ready=s.now+6000000u;enqueue(s.ready,5u,0u,0u);','s.ready=s.now+6050000u;enqueue(s.ready,5u,0u,0u);')},
 {id:'firebolt_separate_modifiers',preset:'demo_fire_brand',edit:c=>({...c,petFireboltMult:c.petFireboltMult*(1.1*1.3/1.4)})},
 {id:'firebolt_separate_modifiers_runtime_sp',preset:'demo_fire_brand',edit:c=>({...c,petFireboltMult:c.petFireboltMult*(1.1*1.3/1.4)}),shader:s=>s.replace('float dmg=(45.2+(2.0/3.5)*c.petSP)*c.petFireboltMult;', 'float dmg=(45.2+0.571*(c.petSP+6.0))*c.petFireboltMult;')},
 {id:'conflagrate_source_average',preset:'destro',edit:c=>c,shader:s=>s.replace('(282.0+roll*61.8+0.429*p)', '(282.0+roll*0.0+0.429*p)')},
];
const selected=process.argv[2] ? probes.filter(p=>p.id===process.argv[2]) : probes;
const out={baselineScenario:baseline.scenarioId,iterations:1000,seed:101,kernelHash:crypto.createHash('sha256').update(FRAGMENT).digest('hex'),notes:'Single-factor diagnostics except explicitly combined Firebolt probe; source means reused from saved benchmark. No production changes.',rows:[]};
if(process.argv[2] && fs.existsSync(path.join(root,'FOREVER_TIMING_DAMAGE_INVESTIGATION.json'))) out.rows=JSON.parse(fs.readFileSync(path.join(root,'FOREVER_TIMING_DAMAGE_INVESTIGATION.json'))).rows.filter(r=>r.id!==process.argv[2]);
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'forever-timing-damage-'));
try{
 for(const p of selected){
  const r=baseline.rows.find(r=>r.id===p.preset);const c=p.edit(structuredClone(r.config));
  const shader=p.shader?p.shader(FRAGMENT):FRAGMENT;
  const file=path.join(tmp,p.id+'.json');
  fs.writeFileSync(file,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,detailed:'#version 300 es\n'+shader,cases:[{mode:'detailed',width:100,height:10*COMPACT_STRIPES,configWords:Array.from(packConfig(c)),uniforms:{numConfigs:1,fightsPerConfig:1000,seed:101,offset:0,count:1000,gridWidth:100,mode:0,eventBudget:65536}}]}));
  const gpu=JSON.parse(execFileSync('python3',[path.join(root,'threejs_webgl_des/validation/headless_gles.py'),file],{encoding:'utf8',maxBuffer:128*1024*1024}));
  const states=decodeDetailedBatch(gpu.outputs[0],100,1000);const stats=aggregateOurs(states,c);
  const dps=stats.totalDamage/c.duration;const row={id:p.id,preset:p.preset,dps,baselineDps:r.ours.mean,sourceDps:r.forever.mean,deltaFromBaseline:dps-r.ours.mean,breakdown:stats,sourceBreakdown:r.breakdown.forever};out.rows.push(row);
  console.log(`${p.id}: ${dps.toFixed(3)} DPS (${row.deltaFromBaseline.toFixed(3)} from baseline)`);
  fs.writeFileSync(path.join(root,'FOREVER_TIMING_DAMAGE_INVESTIGATION.json'),JSON.stringify(out,null,2)+'\n');
 }
}finally{fs.rmSync(tmp,{recursive:true,force:true});}
