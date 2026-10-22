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

test('Forever comparison definitions retain their talents/APL and inherit current configuration',async()=>{
 const before=structuredClone(FOREVER_PRESETS);
 const rows=await loadForeverComparisonPresets();
 assert.equal(rows.length,5);
 for(let i=0;i<rows.length;i++){
  const imported=await resolveSavedBuild(FOREVER_PRESETS[i].build);
  assert.equal(rows[i].useCurrentConfig,true);
  assert.equal(rows[i].resolvedConfig,undefined);
  assert.deepEqual(rows[i].talents,imported.candidate.talents);
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
 const current={duration:90,seed:17,spellPower:500,shadowPower:31,firePower:27,mp5:88,
  race:'GNOME',petChoice:'succubus',sacrifice:'none',rotation:'shadow',intellect:470,stamina:330,spirit:180,
  crit:17,hit:11,statsIncludeBase:true,externalElements:true,assignedElements:false,
  autoCooldowns:false,demonicRune:false,ezThroDynamite:false,trinketSP:0,
  partialResists:false,piercing:false,resistance:37,bossArmor:2600};
 await context.api.runBatchPresetSimulation(undefined,undefined,undefined,current);
 assert.equal(configs.length,36);assert.equal(runOptions.detailedResults,false);
 assert.equal(configs[0].spellPower,500,'our spec keeps the current stats');
 for(let i=0;i<5;i++){
  const rules=parseAPLText(rows[i].aplText);
  const expected=buildFightConfig({base:{...current,iterations:2},talent:getTalentFlagsFromRanks(rows[i].talents),
   pet:current.petChoice,sac:current.sacrifice,rotation:current.rotation,
   actionIds:new Set(rules.filter(r=>r.enabled).map(r=>r.id)),aplRules:compileAPLToBytecode(rules)});
  assert.deepEqual(packConfig(configs[(i+1)*6]),packConfig(expected));
  assert.equal(configs[(i+1)*6+3].crit,expected.crit+3);
  assert.equal(configs[(i+1)*6+4].intellect,expected.intellect+30);
  assert.equal(configs[(i+1)*6+5].spirit,expected.spirit+30);
  for(const key of ['race','petChoice','rotation','mp5','crit','intellect','assignedElements','autoCooldowns','demonicRune','ezThroDynamite','partialResists','piercing','resistance','bossArmor']){
   assert.equal(configs[(i+1)*6][key],current[key],`${rows[i].id}/${key}`);
  }
 }
 await context.api.runBatchPresetSimulation(undefined,undefined,undefined,{...current,spellPower:700,mp5:133,petChoice:'imp'});
 for(let i=0;i<5;i++){
  assert.equal(configs[(i+1)*6].spellPower,700+getTalentFlagsFromRanks(rows[i].talents).demonicKnowledge*20);
  assert.equal(configs[(i+1)*6].mp5,133);assert.equal(configs[(i+1)*6].petChoice,'imp');
 }
 controls['compare-all-races'].checked=true;
 assert.equal(context.api.getFilteredPresets().length,7,'all-races includes both of our specs plus the same five Forever builds');
});

test('clicking a Forever comparison row applies only talents/APL',async()=>{
 const source=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 const fn=source.slice(source.indexOf('export async function loadFullPreset'),source.indexOf('function getActiveStatsConfig')).replace('export ','');
 const calls=[];
 const context={importedConfig:{spellPower:500},setStatus:()=>{},
  applyTalentsObject:talents=>calls.push(['talents',talents]),setAPLFromText:apl=>calls.push(['apl',apl]),updateCombatStatsSummary:()=>{}};
 vm.runInNewContext(fn+'\nglobalThis.load=loadFullPreset;',context);
 const row=(await loadForeverComparisonPresets())[0];
 await context.load(row);
 assert.equal(context.importedConfig,null);
 assert.equal(calls.length,2);assert.equal(calls[0][1],row.talents);assert.equal(calls[1][1],row.aplText);
});
