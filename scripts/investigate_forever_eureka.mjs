// Diagnostic for this 180-second Shadow Brand preset only; no production Eureka edits.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { FRAGMENT, VERTEX } from '../threejs_webgl_des/src/kernel.js';
import { packConfig, COMPACT_STRIPES } from '../threejs_webgl_des/src/model.js';
import { decodeDetailedBatch, aggregateOurs, compareBreakdowns } from './forever_breakdown.mjs';
import { summarizeSamples } from './sweep_forever_parity.mjs';
const root=path.resolve(import.meta.dirname,'..');
const file=path.resolve(process.argv[2] || 'FOREVER_DOOM_FIXED_COMPARISON.json');
const input=JSON.parse(fs.readFileSync(file));
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
if(input.localHashes['threejs_webgl_des/src/kernel.js']!==sha(fs.readFileSync(path.join(root,'threejs_webgl_des/src/kernel.js'))))throw new Error('Recapture input after kernel changes');
const selected=input.rows.filter(r=>r.race==='GNOME');
if(selected.some(r=>r.config.duration!==180 || r.preset!=='demo_shadow_brand'))throw new Error('This diagnostic assumes 180-second Shadow Brand source gates');
const before='if(c.race==1u||c.race==3u){';
const after='if(c.race==3u){if(!execute||s.decimationEnd<=s.now)return;activateEureka();return;}\n '+before;
if(FRAGMENT.split(before).length!==2)throw new Error('Racial fallback changed; review probe');
const shader=FRAGMENT.replace(before,after);
const traceBefore='report1=uvec4(floatBitsToUint(s.mana),eventFlags,floatBitsToUint(s.total),s.rngCalls);';
const traceAfter=traceBefore+'report2=uvec4(s.eurekaEnd,s.racialReady,s.decimationEnd,s.doomActive);';
if(FRAGMENT.split(traceBefore).length!==2)throw new Error('Trace output changed');
const cases=selected.map(r=>({mode:'gated',width:100,height:Math.ceil(input.iterations/100)*COMPACT_STRIPES,
 configWords:Array.from(packConfig(r.config)),uniforms:{numConfigs:1,fightsPerConfig:input.iterations,seed:input.seed,offset:0,count:input.iterations,gridWidth:100,mode:0,eventBudget:65536}}));
for(const mode of ['productionTrace','gatedTrace'])cases.push({mode,width:1024,height:1,configWords:Array.from(packConfig(selected.find(r=>r.profile==='hit_0').config)),uniforms:{numConfigs:1,fightsPerConfig:1,seed:input.seed,offset:0,count:1024,gridWidth:1024,mode:2,eventBudget:65536}});
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'eureka-probe-'));
try{
 const manifest=path.join(temp,'cases.json');
 fs.writeFileSync(manifest,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,gated:'#version 300 es\n'+shader,productionTrace:'#version 300 es\n'+FRAGMENT.replace(traceBefore,traceAfter),gatedTrace:'#version 300 es\n'+shader.replace(traceBefore,traceAfter),cases}));
 const gpu=JSON.parse(execFileSync('python3',[path.join(root,'threejs_webgl_des/validation/headless_gles.py'),manifest],{encoding:'utf8',maxBuffer:128*1024*1024}));
 const output={notes:'In-memory 180s-specific Eureka gate: execute AND Decimation aura. Source math time-to-execute >=120s is impossible in this 180s scenario (maximum117s); pre-execute group cannot pass. Production code unchanged. This is a targeted diagnostic, not a general APL translator.',inputHash:sha(fs.readFileSync(file)),patch:{before,after},iterations:input.iterations,seed:input.seed,renderer:gpu.renderer,rows:[]};
 selected.forEach((r,i)=>{
  const states=decodeDetailedBatch(gpu.outputs[i],100,input.iterations),ours=summarizeSamples(states.map(s=>s.total/180)),breakdown=aggregateOurs(states,r.config);
  const row={id:r.id,profile:r.profile,forever:r.forever,production:r.ours,probe:ours,deltaPct:(ours.mean-r.forever.mean)/r.forever.mean*100,deltaCi95HalfWidth:1.96*Math.sqrt((ours.sd**2+r.forever.sd**2)/input.iterations),breakdown:{ours:breakdown,forever:r.breakdown.forever,comparison:compareBreakdowns(breakdown,r.breakdown.forever)}};
  output.rows.push(row);console.log(`${r.profile}: source ${r.forever.mean.toFixed(2)}, production ${r.ours.mean.toFixed(2)}, gated ${ours.mean.toFixed(2)} (${row.deltaPct.toFixed(2)}%)`);
 });
 output.trace={};
 for(const [j,name] of ['production','gated'].entries()){
  const out=gpu.outputs[selected.length+j];let end=0;const activations=[];
  for(let i=0;i<1024;i++){const next=out[2][i*4];if(next>end){activations.push({atSeconds:out[0][i*4]/1e6,eurekaEndSeconds:next/1e6,nextReadySeconds:out[2][i*4+1]/1e6});end=next;}}
  output.trace[name]=activations;console.log(name,JSON.stringify(activations));
 }
 fs.writeFileSync(path.join(root,'FOREVER_EUREKA_INVESTIGATION.json'),JSON.stringify(output,null,2)+'\n');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
