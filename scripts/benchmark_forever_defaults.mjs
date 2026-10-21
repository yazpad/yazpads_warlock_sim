// Fresh, unmodified Forever default exports through both production engines.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { resolveSavedBuild } from '../threejs_webgl_des/src/contracts/build_io.js';
import { FRAGMENT, VERTEX } from '../threejs_webgl_des/src/kernel.js';
import { packConfig, COMPACT_STRIPES, SPELLS } from '../threejs_webgl_des/src/model.js';
import { WARLOCK_VERSION_SOURCE_HASHES, WARLOCK_VERSIONS } from '../threejs_webgl_des/src/classes/warlock_versions.js';
import { decodeDetailedBatch, aggregateOurs } from './forever_breakdown.mjs';
const root = path.resolve(import.meta.dirname, '..');
const { values: options } = parseArgs({ options: {
  checkout: {type:'string', default:'../forever'}, exporter:{type:'string'}, go:{type:'string',default:'go'},
  iterations:{type:'string',default:'10000'}, seed:{type:'string',default:'101'},
  out:{type:'string',default:'FOREVER_FULL_DEFAULTS_BENCHMARK'},
} });
const iterations = Number(options.iterations), seed = Number(options.seed);
assert.ok(Number.isInteger(iterations) && iterations >= 2 && iterations <= 1000000);
assert.ok(Number.isInteger(seed) && seed >= 0 && seed <= 4294967295);
const checkout = path.resolve(options.checkout), output = path.resolve(options.out);
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const hashFile = file => sha(fs.readFileSync(file));
const temp = fs.mkdtempSync(path.join(os.tmpdir(),'forever-full-defaults-benchmark-'));
const names = ['sm_ruin','aff_wrack','destro','demo_shadow_brand','demo_fire_brand'];
const sourceFiles = ['go.mod','go.sum',...execFileSync('git',['ls-files','sim','assets/database','proto'],{cwd:checkout,encoding:'utf8'}).trim().split('\n')];
const localFiles = [...Object.keys(WARLOCK_VERSION_SOURCE_HASHES).map(file => `threejs_webgl_des/${file}`),
  'scripts/benchmark_forever_defaults.mjs','scripts/forever_defaults_export/main.go','scripts/forever_breakdown.mjs','threejs_webgl_des/validation/headless_gles.py'];
const localHashes = Object.fromEntries(localFiles.map(file => [file,hashFile(path.join(root,file))]));
const stats = (mean,sd,n) => ({mean,sd,n,ci95HalfWidth:1.96*sd/Math.sqrt(n)});
const report = {schemaVersion:1,status:'running',startedAt:new Date().toISOString(),iterations,seed,
  scenario:'full-default-exports',description:'Original five default builds, including all buffs and consumables, no equipment, 20 yards. Missing encounter supplied as 180 seconds, level 63, armor 3731, zero resistance, fixed execute phases.',
  mode:'detailed',versions:WARLOCK_VERSIONS,localHashes,
  source:{checkout,revision:execFileSync('git',['rev-parse','HEAD'],{cwd:checkout,encoding:'utf8'}).trim(),
    workingTree:execFileSync('git',['status','--porcelain'],{cwd:checkout,encoding:'utf8'}).trim(),
    hashes:Object.fromEntries(sourceFiles.map(file => [file,hashFile(path.join(checkout,file))]))}, rows:[]};
function render() {
  const lines = ['# Fresh comparison of full Forever warlock defaults','',
    `${report.status}: ${report.rows.length}/5 builds. ${iterations.toLocaleString('en-US')} fights per build per engine, seed ${seed}, detailed GPU mode.`, '',
    `Forever revision: \`${report.source.revision}\`. Reference simulations were rerun for this report; no historical DPS targets were reused.`, '',
    report.description, '',
    'The benchmark preserves source settings and measures the current ordinary import. It does not adjust stats or rotations to close differences. Same seeds do not pair the engines’ RNG streams. The intervals below describe independent-engine Monte Carlo error, not model accuracy.', '',
    '| Build | Forever DPS | Our DPS | Ours − Forever | Error % | Delta 95% ±DPS |',
    '| --- | ---: | ---: | ---: | ---: | ---: |'];
  for (const r of report.rows) lines.push(`| ${r.id} | ${r.forever.mean.toFixed(2)} | ${r.ours.mean.toFixed(2)} | ${r.delta.toFixed(2)} | ${r.deltaPct.toFixed(2)}% | ${r.deltaCi95HalfWidth.toFixed(2)} |`);
  if (report.summary) lines.push('', `MAE across the five build means: **${report.summary.maeDps.toFixed(3)} DPS**. Mean absolute percentage error (MAPE): **${report.summary.mapePct.toFixed(3)}%**.`, '',
    'MAE = mean(abs(our mean DPS − Forever mean DPS)); MAPE = mean(abs(delta) / Forever mean DPS × 100). Builds are weighted equally.');
  lines.push('', '## Resolved input differences', '',
    'These are observed differences between our imported config and Forever’s initial combat stats after reset. They are retained in the measurement rather than corrected. They can explain part of the measured error.', '',
    '| Build | Stat | Forever | Ours |', '| --- | --- | ---: | ---: |');
  for (const r of report.rows) for (const d of r.inputDifferences) lines.push(`| ${r.id} | ${d.stat} | ${d.forever} | ${d.ours} |`);
  lines.push('', '## Damage contributions', '', '| Build | Actor | Forever DPS | Our DPS |', '| --- | --- | ---: | ---: |');
  for (const r of report.rows) for (const actor of ['player','pet']) lines.push(`| ${r.id} | ${actor} | ${r.actorDps.forever[actor].toFixed(2)} | ${r.actorDps.ours[actor].toFixed(2)} |`);
  lines.push('', 'The JSON companion records requests, source builds, complete reference results, ComputeStats output, resolved configs, spell/resource summaries, shader renderer, source hashes, and compatibility IDs. Enemy damage alone is scored; Demonic Rune self damage is excluded. The existing simulator does not model player health limits or incoming damage; Demon Armor and rune health loss therefore do not affect our DPS.', '',
    'Reproduce with a prepared Forever checkout (generated Go protobuf files and matching Go toolchain):', '', '```sh',
    `node scripts/benchmark_forever_defaults.mjs --checkout /path/to/forever --go /path/to/go --iterations ${iterations} --seed ${seed}`, '```','');
  return lines.join('\n');
}
function save() {
  fs.writeFileSync(`${output}.json`,JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(`${output}.md`,render());
}
try {
  let binary = options.exporter && path.resolve(options.exporter);
  if (!binary) {
    binary = path.join(temp,'exporter');
    execFileSync(options.go,['build','-tags=with_db','-o',binary,path.join(root,'scripts/forever_defaults_export/main.go')],{cwd:checkout,stdio:['ignore','ignore','inherit']});
  }
  report.exporterHash = hashFile(binary);
  save();
  for (const id of names) {
    console.log(`${id}: running fresh Forever reference (${iterations} fights)...`);
    const sourcePath = path.join(checkout,'ui/specs/warlock/dps/builds',`${id}.build.json`);
    const sourceBuild = JSON.parse(fs.readFileSync(sourcePath,'utf8'));
    assert.deepEqual(sourceBuild,JSON.parse(fs.readFileSync(path.join(root,'fixtures/forever_defaults',`${id}.build.json`),'utf8')), `${id}: defaults changed since import coverage capture`);
    const reference = JSON.parse(execFileSync(binary,[sourcePath,String(iterations),String(seed)],{cwd:checkout,maxBuffer:128*1024*1024}));
    assert.ok(!reference.result.error,JSON.stringify(reference.result.error));
    assert.ok(!reference.computeStats.errorResult,JSON.stringify(reference.computeStats.errorResult));
    const request = reference.request;
    assert.equal(request.simOptions.iterations,iterations);
    assert.equal(Number(request.simOptions.randomSeed),seed);
    assert.equal(Number(reference.result.raidMetrics.dps.aggregatorData.n),iterations);
    const inputPlayer = request.raid.parties[0].players[0];
    assert.equal(inputPlayer.race,sourceBuild.player.race);
    assert.equal(inputPlayer.distanceFromTarget,sourceBuild.player.distanceFromTarget);
    assert.equal(request.encounter.targets.length,1);
    const { config: importedConfig, candidate } = await resolveSavedBuild(sourceBuild);
    assert.deepEqual(candidate.importDiagnostics,[]);
    const config = {...importedConfig,iterations,seed};
    assert.equal(config.duration,request.encounter.duration);
    // Limit each draw to 256 fights; preserve global RNG lane IDs across batches.
    const batches = [];
    for (let offset=0;offset<iterations;offset+=256) {
      const count=Math.min(256,iterations-offset),width=Math.min(32,count);
      batches.push({mode:'detailed',width,height:Math.ceil(count/width)*COMPACT_STRIPES,configWords:Array.from(packConfig(config)),
        uniforms:{numConfigs:1,fightsPerConfig:iterations,seed,offset,count,gridWidth:width,mode:0,eventBudget:65536}});
    }
    const manifestPath = path.join(temp,`${id}.gpu.json`);
    fs.writeFileSync(manifestPath,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,detailed:'#version 300 es\n'+FRAGMENT,cases:batches}));
    console.log(`${id}: running our GPU (${iterations} fights in ${batches.length} batches)...`);
    const gpu = JSON.parse(execFileSync('python3',[path.join(root,'threejs_webgl_des/validation/headless_gles.py'),manifestPath],{encoding:'utf8',maxBuffer:128*1024*1024}));
    const states = gpu.outputs.flatMap((batch,i) => decodeDetailedBatch(batch,batches[i].width,batches[i].uniforms.count));
    assert.ok(states.every(s => s.done===1 && Number.isFinite(s.total) && s.total>0),'All GPU lanes must complete');
    let mean=0,m2=0;
    states.forEach((s,i) => {const x=s.total/config.duration,d=x-mean;mean+=d/(i+1);m2+=d*(x-mean);});
    const ours=stats(mean,Math.sqrt(m2/(iterations-1)),iterations),dist=reference.result.raidMetrics.dps;
    const forever=stats(dist.avg,dist.stdev*Math.sqrt(iterations/(iterations-1)),iterations);
    const player=reference.result.raidMetrics.parties[0].players[0];
    const enemyIndices=new Set(reference.result.encounterMetrics.targets.map(t => t.unitIndex));
    const sourceActions=[];
    for (const actor of [player,...player.pets]) for (const a of actor.actions) {
      const targets=a.targets.filter(t => enemyIndices.has(t.unitIndex));
      const sum=field => targets.reduce((s,t) => s+(t[field]||0),0)/iterations;
      sourceActions.push({actor:actor===player?'player':actor.name,id:a.id,isMelee:a.isMelee,casts:a.targets.reduce((s,t)=>s+t.casts,0)/iterations,
        damage:sum('damage'),dps:sum('damage')/config.duration,crits:sum('crits')+sum('critTicks'),misses:sum('misses'),ticks:sum('ticks')+sum('critTicks')});
    }
    const sourceDamage=sourceActions.reduce((s,a)=>s+a.damage,0);
    assert.ok(Math.abs(sourceDamage-forever.mean*config.duration)<0.01,'Reference enemy damage must reconcile');
    const oursBreakdown=aggregateOurs(states,config);
    const sourceStats=reference.initialPlayerStats;
    const fields={stamina:2,intellect:3,spellPower:5,firePower:7,shadowPower:11,spirit:13,mp5:31};
    const inputDifferences=Object.entries(fields).flatMap(([stat,index]) => Math.abs(config[stat]-sourceStats[index])>1e-6 ? [{stat,forever:sourceStats[index],ours:config[stat]}] : []);
    const delta=ours.mean-forever.mean;
    const petDps=states.reduce((sum,s)=>sum+s.petDamage/config.duration/iterations,0);
    const sourcePet=player.pets.reduce((sum,p)=>sum+p.dps.avg,0);
    const row={id,race:config.race,forever,ours,delta,deltaPct:delta/forever.mean*100,
      deltaCi95HalfWidth:1.96*Math.sqrt(ours.sd**2/iterations+forever.sd**2/iterations),
      actorDps:{forever:{player:forever.mean-sourcePet,pet:sourcePet},ours:{player:ours.mean-petDps,pet:petDps}},
      inputDifferences,renderer:gpu.renderer,importDiagnostics:candidate.importDiagnostics,
      sourceBuild,sourceBuildHash:hashFile(sourcePath),requestHash:sha(JSON.stringify(request)),config,
      breakdown:{ours:oursBreakdown,forever:sourceActions},reference};
    report.rows.push(row);
    save();
    console.log(`${id}: Forever ${forever.mean.toFixed(3)}, ours ${ours.mean.toFixed(3)}, delta ${delta.toFixed(3)} (${row.deltaPct.toFixed(2)}%), delta CI ±${row.deltaCi95HalfWidth.toFixed(3)} DPS`);
  }
  for (const [file,hash] of Object.entries(localHashes)) assert.equal(hashFile(path.join(root,file)),hash,`${file} changed during measurement`);
  report.summary={maeDps:report.rows.reduce((s,r)=>s+Math.abs(r.delta),0)/names.length,
    mapePct:report.rows.reduce((s,r)=>s+Math.abs(r.deltaPct),0)/names.length};
  report.status='complete';report.completedAt=new Date().toISOString();save();
  console.log(JSON.stringify(report.summary));
} catch (error) {report.status='failed';report.error=error.stack;save();throw error;}
finally {fs.rmSync(temp,{recursive:true,force:true});}
