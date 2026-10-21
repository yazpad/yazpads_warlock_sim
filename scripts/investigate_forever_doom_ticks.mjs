// Source-backed Doom tick, dynamic-power and Wrack-overlap probes.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {VERTEX} from '../threejs_webgl_des/src/kernel.js';
import {CONFIG,packConfig,COMPACT_STRIPES} from '../threejs_webgl_des/src/model.js';
import {migrateLegacyBuild} from '../threejs_webgl_des/src/contracts/legacy_build.js';
import {resolveWarlockImport} from '../threejs_webgl_des/src/classes/warlock_import.js';
import {decodeDetailedBatch,aggregateOurs,normalizeForever} from './forever_breakdown.mjs';
const root=path.resolve(import.meta.dirname,'..'),checkout='/tmp/forever-run-source';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const baseline=JSON.parse(gunzipSync(fs.readFileSync(path.join(root,'fixtures/benchmark_history/race-stat-300-before-doom-audit-fix.json.gz'))));
const source=gunzipSync(fs.readFileSync(path.join(root,'fixtures/benchmark_history/doom-before-audit-kernel.js.gz'))).toString();
if(hash(source)!==baseline.localHashes['threejs_webgl_des/src/kernel.js'])throw new Error('Historical kernel differs');
const old=(await import('data:text/javascript;base64,'+Buffer.from(source.replace("from './model.js'",`from '${new URL('../threejs_webgl_des/src/model.js',import.meta.url).href}'`)).toString('base64'))).FRAGMENT;
const anchor='s.doomActive=0u;amount=(1742.0+4.0*p)*currentShadowMult()*(1.0+c.shadowMasteryBonus)*(1.0+c.maledictionBonus)*(s.now<s.drainHopeEnd?1.10:1.0);';
if(!old.includes(anchor))throw new Error('Historical Doom anchor differs');
const corrected=old.replace(anchor,anchor.replace('*(s.now<s.drainHopeEnd?1.10:1.0)',''));
const report={status:'running',diagnosticOnly:true,sourceRevision:baseline.source.revision,scriptHash:hash(fs.readFileSync(import.meta.filename)),beforeKernelHash:hash(source),scenarios:[],higherSampleNormalization:[]};
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'forever-doom-ticks-'));
const save=()=>fs.writeFileSync(path.join(root,'FOREVER_DOOM_TICK_INVESTIGATION.json'),JSON.stringify(report,null,2)+'\n');
const remaining=(op,seconds)=>({cmp:{op,lhs:{remainingTime:{}},rhs:{const:{val:seconds+'s'}}}});
const spell=(id,condition)=>({action:{condition,castSpell:{spellId:{spellId:id}}}});
try{
 const revision=execFileSync('git',['rev-parse','HEAD'],{cwd:checkout,encoding:'utf8'}).trim();if(revision!==baseline.source.revision)throw new Error('Source revision differs');
 report.sourceHashes=Object.fromEntries(['sim/warlock/doom.go','sim/warlock/wrack.go','sim/core/spell_result.go','sim/core/spell_outcome.go','sim/core/spelldata/resolve_aura.go'].map(f=>[f,hash(fs.readFileSync(path.join(checkout,f)))]));
 for(const [f,h] of Object.entries(report.sourceHashes))if(h!==baseline.source.hashes[f])throw new Error('Source file differs: '+f);
 const audit=path.join(temp,'audit'),trace=path.join(temp,'trace');
 execFileSync('/tmp/go/bin/go',['build','-tags=with_db','-o',audit,path.join(root,'scripts/forever_doom_audit/main.go')],{cwd:checkout});
 execFileSync('/tmp/go/bin/go',['build','-tags=with_db','-o',trace,path.join(root,'scripts/forever_pet_export/main.go')],{cwd:checkout});
 report.auditWrapperHash=hash(fs.readFileSync(path.join(root,'scripts/forever_doom_audit/main.go')));
 report.sourceWrapperHash=hash(fs.readFileSync(path.join(root,'scripts/forever_pet_export/main.go')));
 report.audit=JSON.parse(execFileSync(audit,[],{cwd:checkout,encoding:'utf8'}));
 for(const [name,race,overlap,fury] of [['plain','HUMAN',false,null],['wrack-overlap','HUMAN',true,null],['orc-plain','ORC',false,null],['fury-expired','ORC',false,'pull'],['fury-at-tick','ORC',false,'late']]){
  const row=baseline.rows.find(r=>r.preset==='aff_wrack'&&r.race===race&&r.profile==='hit_16');
  const request=structuredClone(row.request);request.encounter.duration=65;request.simOptions.iterations=1;request.simOptions.debug=true;
  const party=request.raid.parties[0],player=party.players[0];player.warlock.options.classOptions.summon='NoSummon';
  const actions=[];
  if(fury)actions.push(spell(20572,fury==='late'?remaining('OpLe',10):undefined));
  // Explicitly keep legacy racial fallback out of the tick window.
  else if(race==='ORC')actions.push(spell(20572,remaining('OpLe',1)));
  actions.push(spell(603,remaining('OpGe',60)));
  if(overlap)actions.push({action:{condition:remaining('OpLe',8),channelSpell:{spellId:{spellId:1316697}}}});
  actions.push(spell(11689));player.rotation={type:'TypeAPL',priorityList:actions};
  const file=path.join(temp,name+'.json');fs.writeFileSync(file,JSON.stringify(request));
  const exported=JSON.parse(execFileSync(trace,[file],{cwd:checkout,encoding:'utf8',maxBuffer:32*1024*1024}));const result=exported.result;if(result.error)throw new Error(JSON.stringify(result.error));
  const imported=resolveWarlockImport(migrateLegacyBuild({player,partyBuffs:party.buffs,raidBuffs:request.raid.buffs,debuffs:request.raid.debuffs,encounter:request.encounter}));
  const config={...imported.config,duration:65,seed:101,iterations:1};
  const sourceRow=normalizeForever(result,1,65).rows.find(x=>x.key==='player:6');
  report.scenarios.push({name,race,request,requestHash:hash(JSON.stringify(request)),config,importDiagnostics:imported.diagnostics,source:sourceRow,initialPlayerStats:exported.initialPlayerStats,sourceLogHash:hash(result.logs),sourceEvents:result.logs.split('\n').filter(l=>/SpellID: (603|1316697|20572)/.test(l)),gpu:{}});
 }
 for(const [name,shader] of [['before',old],['after',corrected]]){
  const file=path.join(temp,name+'-gpu.json');fs.writeFileSync(file,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,detailed:'#version 300 es\n'+shader,cases:report.scenarios.map(r=>({mode:'detailed',width:1,height:COMPACT_STRIPES,configWords:Array.from(packConfig(r.config)),uniforms:{numConfigs:1,fightsPerConfig:1,seed:101,offset:0,count:1,gridWidth:1,mode:0,eventBudget:65536}}))}));
  const gpu=JSON.parse(execFileSync('python3',[path.join(root,'threejs_webgl_des/validation/headless_gles.py'),file],{encoding:'utf8',timeout:180000,maxBuffer:16*1024*1024}));
  gpu.outputs.forEach((o,i)=>{const r=report.scenarios[i],states=decodeDetailedBatch(o,1,1),row=aggregateOurs(states,r.config).rows.find(x=>x.key==='player:6');r.gpu[name]={...row,critAdjustedTick:row.damage/(row.ticks+(r.config.dotCrit-1)*row.tickCrits)};r.sourceCritAdjustedTick=r.source.damage/(r.source.ticks+(r.config.dotCrit-1)*r.source.tickCrits);});
  report.renderer=gpu.renderer;save();
 }
 const highBytes=fs.readFileSync(path.join(root,'FOREVER_SHADOWBURN_RACE_HIGH_SAMPLE_AFTER.json'));const high=JSON.parse(highBytes);report.higherSampleReportHash=hash(highBytes);
 for(const row of high.rows.filter(r=>r.race!=='ORC'&&['baseline','sp_1000'].includes(r.profile))){
  const result={id:row.id,critMultiplier:row.config.dotCrit};
  const requestFile=path.join(temp,row.id+'-crit.json');fs.writeFileSync(requestFile,JSON.stringify(row.request));
  const critAudit=JSON.parse(execFileSync(audit,[requestFile],{cwd:checkout,encoding:'utf8'}));
  result.sourceExpectedCritRate=critAudit.expectedCritChance;
  result.gpuExpectedCritRate=new Float32Array(packConfig(row.config).buffer)[Object.keys(CONFIG).indexOf('shadowCrit')];
  if(Math.abs(result.sourceExpectedCritRate-result.gpuExpectedCritRate)>1e-7)throw new Error('Crit-rate configuration differs: '+row.id);
  for(const side of ['ours','forever']){
   const tick=row.breakdown[side].rows.find(x=>x.key==='player:6');
   result[side]={ticks:tick.ticks,critTicks:tick.tickCrits,damage:tick.damage,critAdjustedTick:tick.damage/(tick.ticks+(row.config.dotCrit-1)*tick.tickCrits)};
  }
  result.normalizedDifference=result.ours.critAdjustedTick-result.forever.critAdjustedTick;report.higherSampleNormalization.push(result);
 }
 if(report.audit.wrackAffectsDoom!==false)throw new Error('Unexpected source class mask');
 for(const r of report.scenarios)if(Math.abs(r.gpu.after.critAdjustedTick-r.sourceCritAdjustedTick)>0.01)throw new Error('Unexplained controlled tick difference: '+r.name);
 report.status='complete';save();console.log(report.scenarios.map(r=>({name:r.name,source:r.sourceCritAdjustedTick,before:r.gpu.before.critAdjustedTick,after:r.gpu.after.critAdjustedTick})));
}finally{fs.rmSync(temp,{recursive:true,force:true});}
