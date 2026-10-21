// Diagnostic shader variants only; production shader and imports remain unchanged.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {FRAGMENT,VERTEX} from '../threejs_webgl_des/src/kernel.js';
import {packConfig,COMPACT_STRIPES} from '../threejs_webgl_des/src/model.js';
import {decodeDetailedBatch,aggregateOurs} from './forever_breakdown.mjs';
const root=path.resolve(import.meta.dirname,'..');
const baseline=JSON.parse(fs.readFileSync(path.join(root,'FOREVER_FULL_DEFAULTS_BENCHMARK.json')));
const statReport=JSON.parse(fs.readFileSync(path.join(root,'FOREVER_FULL_DEFAULTS_INVESTIGATION.json')));
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
for(const[file,sha]of Object.entries(baseline.localHashes))assert.equal(hash(fs.readFileSync(path.join(root,file))),sha);
const replace=(text,needle,value)=>{assert.ok(text.includes(needle),needle);return text.replace(needle,value);};
function wisdomShader(shader){
 shader=replace(shader,'if(spell==1u){s.corrBonus=', 'wisdomProc(false);\n if(spell==1u){s.corrBonus=');
 shader=replace(shader,'s.doomEnd=s.now+60000000u;', 'wisdomProc(false);s.doomEnd=s.now+60000000u;');
 shader=replace(shader,'if(random01()<c.hit){s.siphonTicks=', 'if(random01()<c.hit){wisdomProc(false);s.siphonTicks=');
 shader=replace(shader,'s.drainHopeEnd=s.now+6000000u;', 'wisdomProc(false);s.drainHopeEnd=s.now+6000000u;');
 return shader;
}
function explosiveShader(shader){
 const block=` if(c.autoCooldowns!=0u&&c.ezThroDynamite!=0u&&s.now>=s.explosiveReady){
  s.explosiveReady=s.now+60000000u;s.casting=1u;
  enqueue(s.now+1000000u,16u,0u,0u);return;
 }`;
 shader=replace(shader,block,'');
 // Explosives can fit after an instant cast while its GCD runs, never ahead of it.
 const gcd='void gcd(){s.ready=s.now+uint(floor(max(1000000.0,1500000.0/hasteMultiplier())/1000.0+0.5))*1000u;enqueue(s.ready,5u,0u,0u);';
 shader=replace(shader,gcd,gcd+`
 if(c.autoCooldowns!=0u&&c.ezThroDynamite!=0u&&s.now>=s.explosiveReady&&s.casting==0u){
  s.explosiveReady=s.now+60000000u;s.casting=1u;enqueue(s.now+1000000u,16u,0u,0u);
 }`);
 return shader;
}
const instrument=shader=>replace(shader,'s.mana+=gain;s.gained+=gain;', 's.tickDamage15+=gain;s.mana+=gain;s.gained+=gain;');
function refinedShader(){
 let shader=replace(wisdomShader(FRAGMENT),'||spell==14u','');
 // A Sayaad starts at the owner's distance and reaches its 5-yard ability range at 8 yd/s.
 shader=replace(shader,'enqueue(0u,6u,201u,0u);', 'enqueue(uint(round(max(0.0,float(c.travel)*24.0-5000000.0)/8000.0))*1000u,6u,201u,0u);');
 // Gift of Arthas is flat target damage taken, after armor/attacker modifiers, before the outcome.
 shader=replace(shader,'float dmg=(base+(s.petAP/14.0)*2.0+(c.giftOfArthas!=0u?8.0:0.0))*c.petMeleeMult;', 'float dmg=(base+(s.petAP/14.0)*2.0)*c.petMeleeMult+(c.giftOfArthas!=0u?8.0:0.0);');
 // Generic Fire school and damage-done auras also modify explosive damage.
 shader=replace(shader,'float amount=(213.0+random01()*74.0)*(s.now<s.elementsEnd&&c.externalElements==0u?1.10:1.0);', 'float amount=(213.0+random01()*74.0)*currentFireMult();');
 return instrument(explosiveShader(shader));
}
const shaders={jow:instrument(wisdomShader(FRAGMENT)),explosive:instrument(explosiveShader(FRAGMENT)),both:instrument(explosiveShader(wisdomShader(FRAGMENT))),refined:refinedShader(),imp_end_guard:replace(refinedShader(),'s.petMana-=115.0;', 's.petMana-=115.0;if(s.now+uint(round(float(c.travel)*1.5))>c.end){queueFirebolt();break;}')};
const output=path.join(root,'FOREVER_FULL_DEFAULTS_RUNTIME_INVESTIGATION');
const report=fs.existsSync(output+'.json')?JSON.parse(fs.readFileSync(output+'.json')):{schemaVersion:1,status:'running',iterations:baseline.iterations,seed:baseline.seed,
 baselineHash:hash(fs.readFileSync(path.join(root,'FOREVER_FULL_DEFAULTS_BENCHMARK.json'))),
 shaderHashes:Object.fromEntries(Object.entries(shaders).map(([k,v])=>[k,hash(v)])),rows:[]};
const summary=rows=>({maeDps:rows.reduce((s,r)=>s+Math.abs(r.delta),0)/rows.length,mapePct:rows.reduce((s,r)=>s+Math.abs(r.deltaPct),0)/rows.length});
for(const[id,shader]of Object.entries(shaders)){
 const sha=hash(shader);if(report.shaderHashes[id])assert.equal(sha,report.shaderHashes[id],`Cached ${id} shader changed`);report.shaderHashes[id]=sha;
}
report.status='running';
function save(){
 fs.writeFileSync(output+'.json',JSON.stringify(report,null,2)+'\n');
 const lines=['# Full-default runtime investigation','',
  `${report.status}. ${report.iterations.toLocaleString('en-US')} fights per build and variant, seed ${report.seed}. All variants include the food/oil stat corrections, applied only to diagnostic configs. Production code is unchanged.`, '',
  'JoW: allow the landed applications of Corruption, Bane of Agony, Bane of Doom, Siphon Life and Wrack to proc Judgement of Wisdom, matching Forever’s ProcMaskSpellDamage application outcomes. Explosives: throw during an existing GCD after an instant spell, as Forever’s APL cooldown dispatcher does, rather than delaying the next spell.', '',
  '| Build | Stats only error DPS | +JoW | +Explosive timing | Both | Both error % | Both delta 95% ±DPS | Refined error DPS | Refined error % | Imp end guard DPS |',
  '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |'];
 for(const r of report.rows)lines.push(`| ${r.id} | ${r.statsOnly.delta.toFixed(3)} | ${r.variants.jow.delta.toFixed(3)} | ${r.variants.explosive.delta.toFixed(3)} | ${r.variants.both.delta.toFixed(3)} | ${r.variants.both.deltaPct.toFixed(3)}% | ${r.variants.both.deltaCi95HalfWidth.toFixed(3)} | ${r.variants.refined?.delta.toFixed(3)??'pending'} | ${r.variants.refined?.deltaPct.toFixed(3)??'pending'}% | ${r.variants.imp_end_guard?.delta.toFixed(3)??'pending'} |`);
 if(report.summary){lines.push('', '| Variant | MAE DPS | MAPE |','| --- | ---: | ---: |');for(const[id,s]of Object.entries(report.summary))lines.push(`| ${id} | ${s.maeDps.toFixed(3)} | ${s.mapePct.toFixed(3)}% |`);}
 lines.push('', 'Refined adds exact JoW eligibility (no explosive procs), the initial pet approach before Lash of Pain, Gift of Arthas after armor/attacker modifiers, and generic Fire damage multipliers on explosives. Each change follows the inspected Forever source; no constants were fitted to DPS. The extra Imp end-guard variant only excludes Firebolt impacts whose 16 yd/s missile would arrive after the encounter. It is a narrow timing diagnostic, not a complete projectile implementation; builds without an Imp reuse the identical refined results.', '', '## Judgement of Wisdom mana per fight', '', '| Build | Forever | JoW corrected | Both runtime corrections | Refined |','| --- | ---: | ---: | ---: | ---: |');
 for(const r of report.rows)lines.push(`| ${r.id} | ${r.foreverWisdomGain.toFixed(2)} | ${r.variants.jow.wisdomGain.toFixed(2)} | ${r.variants.both.wisdomGain.toFixed(2)} | ${r.variants.refined?.wisdomGain.toFixed(2)??'pending'} |`);
 lines.push('', 'The diagnostic shader records actual player JoW mana in the otherwise unused Curse of Elements periodic-damage counter. This counter is cleared before normal spell aggregation. The baseline source results and production shader hashes are checked before the run. Same seeds do not pair RNG streams between engines; uncertainty is estimated for independent means.');
 fs.writeFileSync(output+'.md',lines.join('\n')+'\n');
}
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'forever-default-runtime-'));
try{
 for(const base of baseline.rows){
  const stats=statReport.rows.find(r=>r.id===base.id).variants.all_stat_corrections;
  const result=report.rows.find(r=>r.id===base.id)||{id:base.id,statsOnly:{mean:stats.mean,delta:stats.delta,deltaPct:stats.deltaPct},variants:{},
   foreverWisdomGain:base.reference.result.raidMetrics.parties[0].players[0].resources.filter(r=>r.type==='ResourceTypeMana'&&r.id.spellId===20355).reduce((s,r)=>s+r.actualGain,0)/baseline.iterations};
  for(const[variant,shader]of Object.entries(shaders)){
   if(result.variants[variant])continue;
   if(variant==='imp_end_guard'&&stats.config.petChoice!=='imp'){result.variants[variant]={...result.variants.refined,reused:true,reuseReason:'No Imp: the guarded Firebolt branch is unreachable; reuse identical refined results.'};continue;}
   const config=stats.config,cases=[];
   for(let offset=0;offset<baseline.iterations;offset+=256){const count=Math.min(256,baseline.iterations-offset),width=Math.min(32,count);
    cases.push({mode:'detailed',width,height:Math.ceil(count/width)*COMPACT_STRIPES,configWords:Array.from(packConfig(config)),uniforms:{numConfigs:1,fightsPerConfig:baseline.iterations,seed:baseline.seed,offset,count,gridWidth:width,mode:0,eventBudget:65536}});
   }
   console.log(`${base.id}/${variant}: ${baseline.iterations} fights...`);
   const file=path.join(temp,'cases.json');fs.writeFileSync(file,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,detailed:'#version 300 es\n'+shader,cases}));
   const gpu=JSON.parse(execFileSync('python3',[path.join(root,'threejs_webgl_des/validation/headless_gles.py'),file],{encoding:'utf8',maxBuffer:256*1024*1024}));
   const states=gpu.outputs.flatMap((batch,i)=>decodeDetailedBatch(batch,cases[i].width,cases[i].uniforms.count));
   assert.equal(states.length,baseline.iterations);
   const wisdomGain=states.reduce((s,r)=>s+r.tickDamage15,0)/states.length;states.forEach(s=>s.tickDamage15=0);
   let mean=0,m2=0;states.forEach((s,i)=>{const x=s.total/config.duration,d=x-mean;mean+=d/(i+1);m2+=d*(x-mean);});
   const sd=Math.sqrt(m2/(states.length-1)),delta=mean-base.forever.mean;
   result.variants[variant]={mean,sd,delta,deltaPct:delta/base.forever.mean*100,deltaCi95HalfWidth:1.96*Math.sqrt(sd**2/states.length+base.forever.sd**2/states.length),wisdomGain,detail:aggregateOurs(states,config)};
   console.log(`${base.id}/${variant}: ${delta.toFixed(3)} DPS (${result.variants[variant].deltaPct.toFixed(3)}%)`);
  }
  if(!report.rows.includes(result))report.rows.push(result);save();
 }
 report.summary={stats_only:summary(report.rows.map(r=>r.statsOnly)),...Object.fromEntries(Object.keys(shaders).map(id=>[id,summary(report.rows.map(r=>r.variants[id]))]))};
 report.status='complete';save();console.log(JSON.stringify(report.summary));
}finally{fs.rmSync(temp,{recursive:true,force:true});}
