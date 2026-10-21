// Read-only source-engine traces for Wrack's application and Soul Siphon effects.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {execFileSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..'),checkout='/tmp/forever-run-source';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const baseline=JSON.parse(gunzipSync(fs.readFileSync(path.join(root,'fixtures/benchmark_history/race-stat-300-before-wrack-fixes.json.gz'))));
const row=baseline.rows.find(r=>r.preset==='aff_wrack'&&r.race==='HUMAN'&&r.profile==='hit_0');
const revision=execFileSync('git',['rev-parse','HEAD'],{cwd:checkout,encoding:'utf8'}).trim();
if(revision!==baseline.source.revision)throw new Error('Source revision differs from archived baseline');
const output={sourceRevision:baseline.source.revision,scriptHash:hash(fs.readFileSync(import.meta.filename)),sourceHashes:Object.fromEntries(['sim/warlock/wrack.go','sim/warlock/talents_affliction.go','sim/warlock/warlock.go','sim/core/cast.go','sim/core/dot.go'].map(f=>[f,hash(fs.readFileSync(path.join(checkout,f)))])),scenarios:[]};
output.traceWrapperHash=hash(fs.readFileSync(path.join(root,'scripts/forever_trace/main.go')));
for(const [file,digest] of Object.entries(output.sourceHashes))if(digest!==baseline.source.hashes[file])throw new Error('Source file differs: '+file);
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'wrack-source-'));
try{
 const binary=path.join(temp,'trace');execFileSync('/tmp/go/bin/go',['build','-tags=with_db','-o',binary,path.join(root,'scripts/forever_trace/main.go')],{cwd:checkout});
 for(const [name,ids] of [['alone',[]],['corruption',[25311]],['doom',[603]],['two',[25311,18881]],['three',[25311,18881,11713]]]){
  const request=structuredClone(row.request);request.encounter.duration=30;
  const player=request.raid.parties[0].players[0];player.warlock.options.classOptions.summon='NoSummon';
  player.rotation={type:'TypeAPL',priorityList:[...ids.map(id=>({action:{condition:{not:{val:{dotIsActive:{spellId:{spellId:id}}}}},castSpell:{spellId:{spellId:id}}}})),{action:{channelSpell:{spellId:{spellId:1316697}}}}]};
  const file=path.join(temp,name+'.json');fs.writeFileSync(file,JSON.stringify(request));
  const result=JSON.parse(execFileSync(binary,[file],{cwd:checkout,encoding:'utf8',maxBuffer:32*1024*1024}));
  if(result.error)throw new Error(JSON.stringify(result.error));
  output.scenarios.push({name,request,requestHash:hash(JSON.stringify(request)),logsHash:hash(result.logs),wrackLogs:result.logs.split('\n').filter(l=>l.includes('1316697'))});
 }
 const firstHit=s=>Number(s.wrackLogs.find(l=>l.includes('tick Hit for')).match(/Hit for ([\d.]+)/)[1]);
 const unbuffed=firstHit(output.scenarios[0]);
 output.effectCounts=[0,1,1,2,3];
 output.scenarios.forEach((s,i)=>{
  s.firstNoncriticalTick=firstHit(s);s.observedFactor=s.firstNoncriticalTick/unbuffed;
  if(Math.abs(s.observedFactor-(1+0.12*output.effectCounts[i]))>0.00001)throw new Error('Unexpected Soul Siphon scaling: '+s.name);
 });
 output.validated=true;
 fs.writeFileSync(path.join(root,'FOREVER_WRACK_SOURCE_AUDIT.json'),JSON.stringify(output,null,2)+'\n');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
