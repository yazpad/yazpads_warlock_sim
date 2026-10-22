import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {loadForeverComparisonPresets} from '../src/classes/warlock_comparison.js';
import {FOREVER_PRESETS} from '../src/classes/warlock_defaults.js';
import {resolveSavedBuild} from '../src/contracts/build_io.js';
import {packConfig} from '../src/model.js';
import {getTalentFlagsFromRanks} from '../src/talents.js';
import {generateAPLForPreset,compileAPLToBytecode,parseAPLText} from '../src/apl.js';
import {buildFightConfig} from '../src/config_builder.js';

test('all comparison defaults pack identically to importing the same complete build',async()=>{
 const before=structuredClone(FOREVER_PRESETS);
 const rows=await loadForeverComparisonPresets();
 assert.equal(rows.length,5);
 for(let i=0;i<rows.length;i++){
  const imported=await resolveSavedBuild(FOREVER_PRESETS[i].build);
  assert.deepEqual(packConfig(rows[i].resolvedConfig),packConfig(imported.config));
  assert.equal(rows[i].aplText,imported.candidate.apl.text);
  assert.equal(rows[i].pet,imported.candidate.classOptions.pet);
 }
 assert.deepEqual(FOREVER_PRESETS,before);
});

test('comparison adds all five defaults alongside our race-filtered specs and batches both',async()=>{
 const controls={
  'compare-num-sims':{value:'2'},
  'compare-stat-weights':{checked:true,addEventListener(){}},
  'compare-all-races':{checked:false,addEventListener(){}},
 };
 let configs,runOptions;
 const source=fs.readFileSync(new URL('../src/presets.js',import.meta.url),'utf8')
  .replace(/^import .*;\n/gm,'').replace(/^export \{.*\};\n/gm,'').replaceAll('export ','')
  .replace("await import('./classes/warlock_comparison.js')",'foreverDependencies');
 const context={ACTIVE_CLASS:{id:'warlock'},CLASS_PRESENTATION:{presetDataUrl:'presets.json'},
  document:{getElementById:id=>controls[id]??null},fetch:async()=>({ok:true,json:async()=>[
   {id:'legacy',name:'Legacy Spec',race:'Human',talents:{}},
   {id:'legacy-orc',name:'Legacy Spec',race:'Orc',talents:{}},
  ]}),
  foreverDependencies:{loadForeverComparisonPresets},console,setTimeout,
  getTalentFlagsFromRanks,generateAPLForPreset,compileAPLToBytecode,parseAPLText,
  CLASS_SIMULATION:{buildFightConfig,runMultiSimulation:async(c,options)=>{
   configs=c;runOptions=options;
   return {timing:{elapsedMs:1},results:c.map(config=>({config,summary:{mean:100,p05:90,p95:110,sd:3,ci95:2}}))};
  }},getPresetPetAndSac:p=>({pet:p.pet,sac:p.sac})};
 vm.runInNewContext(source+'\nglobalThis.api={initPresets,getFilteredPresets,runBatchPresetSimulation};',context);
 await context.api.initPresets(()=>{},()=> 'Human');
 assert.equal(context.api.getFilteredPresets().length,6,'our Human spec and all five Forever builds appear together');
 assert.equal(context.api.getFilteredPresets()[0].id,'legacy');
 const rows=await loadForeverComparisonPresets();
 await context.api.runBatchPresetSimulation(undefined,undefined,undefined,{duration:90,seed:17,spellPower:500,mp5:0});
 assert.equal(configs.length,36);assert.equal(runOptions.detailedResults,false);
 assert.equal(configs[0].spellPower,500,'our spec keeps the current stats');
 for(let i=0;i<5;i++){
  const expected={...rows[i].resolvedConfig,duration:90,iterations:2,seed:17};
  assert.deepEqual(packConfig(configs[(i+1)*6]),packConfig(expected));
  assert.equal(configs[(i+1)*6+3].crit,expected.crit+3);
  assert.equal(configs[(i+1)*6+4].intellect,expected.intellect+30);
  assert.equal(configs[(i+1)*6+5].spirit,expected.spirit+30);
 }
 controls['compare-all-races'].checked=true;
 assert.equal(context.api.getFilteredPresets().length,7,'all-races includes both of our specs plus the same five Forever builds');
});

test('clicking a complete comparison preset uses the full build importer',async()=>{
 const source=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 const fn=source.slice(source.indexOf('export async function loadFullPreset'),source.indexOf('function getActiveStatsConfig')).replace('export ','');
 const calls=[];
 const context={applyImportedBuild:async build=>calls.push(build),setStatus:()=>{},$:()=>null};
 vm.runInNewContext(fn+'\nglobalThis.load=loadFullPreset;',context);
 await context.load(FOREVER_PRESETS[0]);
 assert.equal(calls.length,1);assert.equal(calls[0],FOREVER_PRESETS[0].build);
});
