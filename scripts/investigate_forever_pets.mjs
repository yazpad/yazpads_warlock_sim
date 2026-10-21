// Pet-only diagnostic: source waits; the GPU fixture skips player decisions.
// This does not add Wait support to the app importer or change production shaders.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {parseArgs} from 'node:util';
import {FRAGMENT,VERTEX} from '../threejs_webgl_des/src/kernel.js';
import {CONFIG,packConfig,COMPACT_STRIPES} from '../threejs_webgl_des/src/model.js';
import {migrateLegacyBuild} from '../threejs_webgl_des/src/contracts/legacy_build.js';
import {resolveWarlockImport} from '../threejs_webgl_des/src/classes/warlock_import.js';
import {decodeDetailedBatch,aggregateOurs,normalizeForever,compareBreakdowns} from './forever_breakdown.mjs';
import {summarizeSamples} from './sweep_forever_parity.mjs';
const root=path.resolve(import.meta.dirname,'..');
const {values:opts}=parseArgs({options:{checkout:{type:'string',default:'/tmp/forever-run-source'},go:{type:'string',default:'/tmp/go/bin/go'},iterations:{type:'string',default:'1000'},out:{type:'string',default:'FOREVER_PET_INVESTIGATION'},reuse:{type:'string'}}});
const iterations=Number(opts.iterations);if(!Number.isInteger(iterations)||iterations<2)throw new Error('Need at least two iterations');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const input=fs.readFileSync(path.join(root,'FOREVER_SWEEP.json'));const baseline=JSON.parse(input);
const models=[['succubus_no_dk','sm_ruin','Succubus'],['imp_no_dk','sm_ruin','Imp'],['succubus_dk','demo_shadow_brand','Succubus'],['imp_dk','demo_fire_brand','Imp']];
const races=['HUMAN','ORC','UNDEAD'];const profiles=['baseline','sp_250','sp_1000','int_0','int_400','hit_0','hit_5','hit_16','crit_0','crit_30'];
const report={status:'running',diagnosticOnly:true,iterations,seed:101,inputHash:hash(input),kernelHash:hash(FRAGMENT),modelHash:hash(fs.readFileSync(path.join(root,'threejs_webgl_des/src/model.js'))),scriptHash:hash(fs.readFileSync(import.meta.filename)),notes:'120 pet-only scenarios; source uses a 180s Wait and no player cooldown/attacks, GPU diagnostic skips player decisions. App Wait import support is not claimed. DK/talents/sacrifice stay as declared by the source requests. Mana can exhaust without owner Life Tap; readiness differences remain measurable.',rows:[]};
const filePrefix=path.resolve(opts.out);const save=()=>{fs.writeFileSync(filePrefix+'.json',JSON.stringify(report,null,2)+'\n');let md='# Forever pet-only diagnostic\n\n'+report.status+': '+report.rows.length+'/120 cases, '+iterations+' fights per engine.\n\n'+report.notes+'\n\n| Model | Cases | MAE DPS | Mean delta DPS |\n| --- | ---: | ---: | ---: |\n';for(const [model]of models){const a=report.rows.filter(r=>r.model===model);if(a.length)md+=`| ${model} | ${a.length} | ${(a.reduce((n,r)=>n+Math.abs(r.delta),0)/a.length).toFixed(3)} | ${(a.reduce((n,r)=>n+r.delta,0)/a.length).toFixed(3)} |\n`;}fs.writeFileSync(filePrefix+'.md',md);};
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'forever-pets-'));
try{
 const binary=path.join(temp,'exporter');const checkout=path.resolve(opts.checkout);
 execFileSync(opts.go,['build','-tags=with_db','-o',binary,path.join(root,'scripts/forever_pet_export/main.go')],{cwd:checkout,stdio:['ignore','ignore','inherit']});
 report.audit=JSON.parse(execFileSync(binary,['audit'],{cwd:checkout,encoding:'utf8'}));
 report.sourceRevision=execFileSync('git',['rev-parse','HEAD'],{cwd:checkout,encoding:'utf8'}).trim();
 report.sourceHashes=Object.fromEntries(['sim/warlock/pets.go','sim/core/pet.go','sim/core/unit.go','sim/core/target.go','sim/core/spell_result.go','sim/warlock/talents_demonology.go'].map(f=>[f,hash(fs.readFileSync(path.join(checkout,f)))]));
 const previous=opts.reuse?JSON.parse(fs.readFileSync(opts.reuse)):null;
 if(previous&&(previous.iterations!==iterations||previous.seed!==101||JSON.stringify(previous.sourceHashes)!==JSON.stringify(report.sourceHashes)))throw new Error('Reused source provenance differs');
 const anchor=' decide();\n for(uint step=0u;step<eventBudget;step++)';if(!FRAGMENT.includes(anchor))throw new Error('Pet isolation anchor changed');
 const isolated=FRAGMENT.replace(anchor,' for(uint step=0u;step<eventBudget;step++)');
 for(const [model,preset,summon]of models){
  const cells=[],cases=[];
  for(const race of races)for(const profile of profiles){
   const b=baseline.rows.find(r=>r.preset===preset&&r.race===race&&r.profile===profile);if(b?.status!=='complete')throw new Error('Missing source reference');
   const request=structuredClone(b.request),party=request.raid.parties[0],player=party.players[0];
   player.warlock.options.classOptions.summon=summon;
   player.rotation={type:'TypeAPL',priorityList:[{action:{wait:{duration:{const:{val:'180s'}}}}}]};
   request.simOptions.iterations=iterations;request.simOptions.debug=false;
   const id=`${model}__${race.toLowerCase()}__${profile}`;const requestHash=hash(JSON.stringify(request));
   let source=previous?.rows.find(r=>r.id===id);
   if(source&&source.requestHash!==requestHash)throw new Error(`Request differs: ${id}`);
   if(!source){const f=path.join(temp,id+'.json');fs.writeFileSync(f,JSON.stringify(request));const data=JSON.parse(execFileSync(binary,[f],{cwd:checkout,encoding:'utf8',maxBuffer:64*1024*1024}));if(data.result.error)throw new Error(JSON.stringify(data.result.error));const d=data.result.raidMetrics.dps;source={forever:{mean:d.avg,sd:d.stdev,n:iterations},sourceBreakdown:normalizeForever(data.result,iterations,180),initialPets:data.initialPets,initialPlayerStats:data.initialPlayerStats};}
   const staged=migrateLegacyBuild({player,raidBuffs:request.raid.buffs,partyBuffs:party.buffs,debuffs:request.raid.debuffs});staged.candidate.apl={kind:'text',text:'Life Tap'};
   const imported=resolveWarlockImport(staged),config={...imported.config,iterations,seed:101};
   const cell={id,model,race,profile,request,requestHash,config,forever:source.forever,sourceBreakdown:source.sourceBreakdown,initialPets:source.initialPets,initialPlayerStats:source.initialPlayerStats};cells.push(cell);
   cases.push({mode:'detailed',width:100,height:Math.ceil(iterations/100)*COMPACT_STRIPES,configWords:Array.from(packConfig(config)),uniforms:{numConfigs:1,fightsPerConfig:iterations,seed:101,offset:0,count:iterations,gridWidth:100,mode:0,eventBudget:65536}});
  }
  const manifest=path.join(temp,model+'.json');fs.writeFileSync(manifest,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,detailed:'#version 300 es\n'+isolated,cases}));
  const gpu=JSON.parse(execFileSync('python3',[path.join(root,'threejs_webgl_des/validation/headless_gles.py'),manifest],{encoding:'utf8',timeout:600000,maxBuffer:512*1024*1024}));
  gpu.outputs.forEach((o,i)=>{const cell=cells[i],states=decodeDetailedBatch(o,100,iterations);cell.ours=summarizeSamples(states.map(s=>s.total/180));cell.delta=cell.ours.mean-cell.forever.mean;cell.deltaPct=cell.delta/cell.forever.mean*100;cell.comparison=compareBreakdowns(aggregateOurs(states,cell.config),cell.sourceBreakdown);report.rows.push(cell);});report.renderer=gpu.renderer;save();console.log(model+': '+cells.length+' complete');
 }
 report.status='complete';save();
}catch(e){report.status='failed';report.error=e.message;save();throw e;}finally{fs.rmSync(temp,{recursive:true,force:true});}
