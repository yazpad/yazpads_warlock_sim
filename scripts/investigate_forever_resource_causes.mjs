// Counterfactual diagnostics against saved source results; production is unchanged.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { FRAGMENT, VERTEX } from '../threejs_webgl_des/src/kernel.js';
import { packConfig, COMPACT_STRIPES, APL_COND } from '../threejs_webgl_des/src/model.js';
import { decodeDetailedBatch, aggregateOurs, compareBreakdowns } from './forever_breakdown.mjs';
import { summarizeSamples } from './sweep_forever_parity.mjs';
const root = path.resolve(import.meta.dirname, '..');
const input = fs.readFileSync(path.join(root, 'FOREVER_SWEEP_FOLLOWUP.json'));
const source = JSON.parse(input);
const replace = (s, a, b) => { if (!s.includes(a)) throw new Error(`Probe anchor changed: ${a}`); return s.replaceAll(a, b); };
const incCost = s => replace(s, 'case 4u:return 355.0*', 'case 4u:return 325.0*');
const eurekaPolicy = s => replace(s, 'if(s.now<s.racialReady)return;', 'if(s.now<s.racialReady)return; if(c.race==3u){activateEureka();return;}');
const nightfall = s => replace(s, 'void beginCast(uint spell){', 'void beginCast(uint spell){if(spell==0u&&s.trance!=0u){s.trance=0u;spend(0u);enqueue(s.now+c.travel,2u,0u,uint(s.castBonus>1.0));gcd();return;}');
const soulFireCooldown = s => replace(s, 's.soulFireReady=s.now+uint(sfCD*1000000.0);', 's.soulFireReady=s.now+60000000u-27000000u*c.decimationRank;');
const inclusiveTime = s => replace(s, 'return (c.end>s.now)&&(float(c.end-s.now)>param*1000000.0);', 'return (c.end>=s.now)&&(float(c.end-s.now)>=param*1000000.0);');
const conflagCost = s => replace(s, 'case 8u:return 265.0*', 'case 8u:return 255.0*');
const eurekaMasks = s => {
  s = replace(s, 'return baseCost(spell)*manaMultiplier();', 'return baseCost(spell)*((spell==0u||spell==3u||spell==5u||spell==8u||spell==9u||spell==13u||spell==11u)?manaMultiplier():1.0);');
  s = replace(s, 's.castBonus=s.now<s.eurekaEnd?1.10:1.0;', 's.castBonus=(s.now<s.eurekaEnd&&(spell==0u||spell==3u||spell==5u||spell==8u||spell==9u||spell==13u))?1.10:1.0;');
  s = replace(s, 's.immBonus=s.castBonus;', 's.immBonus=1.0;');
  return replace(s, 'amount*(s.now<s.eurekaEnd?1.10:1.0)', 'amount');
};
const petMana = s => replace(s, '1150.0', '1896.0');
const petStart = s => replace(s, 'enqueue(300000u,6u,100u,0u);', 'enqueue(2000000u,6u,100u,0u);');
const tickFirst = s => {
  s = replace(s, 'void enqueue(uint at,', 'bool before(Event a,Event b){return a.at<b.at||(a.at==b.at&&EV_KIND(a)==3u&&EV_KIND(b)!=3u);}\nvoid enqueue(uint at,');
  s = replace(s, 'if(e.at>=queue[parent].at)break;', 'if(!before(e,queue[parent]))break;');
  s = replace(s, 'if(queue[left].at<queue[smallest].at)', 'if(before(queue[left],queue[smallest]))');
  return replace(s, 'if(queue[right].at<queue[smallest].at)', 'if(before(queue[right],queue[smallest]))');
};
const spiritRegen = (s, c) => {
  s = replace(s, 'Event lastEvent;', 'Event lastEvent;uint lastPaid=0u;bool completingPaidCast=false;');
  s = replace(s, 'void spend(uint spell){', 'void spend(uint spell){if(!completingPaidCast)lastPaid=s.now;');
  s = replace(s, 'void beginCast(uint spell){', 'void beginCast(uint spell){lastPaid=s.now;');
  s = replace(s, 's.casting=0u;spend(espell);', 's.casting=0u;completingPaidCast=true;spend(espell);completingPaidCast=false;');
  const credit = `uint regenFrom=max(s.now,max(lastPaid+5000000u,s.drainHopeEnd));if(e.at>regenFrom){float gain=${(6.25+c.spirit/8).toFixed(8)}*float(e.at-regenFrom)*0.000001;s.gained+=gain;s.mana=min(c.maxMana,s.mana+gain);} `;
  return replace(s, 's.now=e.at;s.events++;', credit+'s.now=e.at;s.events++;');
};
const continuousMP5 = s => {
  s = replace(s, 's.now=e.at;s.events++;', 'float gain=c.mp5*float(e.at-s.now)/5000000.0;s.mana=min(c.maxMana,s.mana+gain);s.gained+=gain;s.now=e.at;s.events++;');
  const before = 's.mana=min(c.maxMana,s.mana+c.mp5);s.gained+=c.mp5;';
  return replace(s,before,'');
};
const profiles = { destro: ['GNOME', 'regen_high'], aff_wrack: ['UNDEAD', 'regen_low'], demo_fire_brand: ['ORC', 'hit_16'] };
const probes = [
  ['destro_confirmed_and_continuous_mp5', 'destro', s => continuousMP5(eurekaMasks(eurekaPolicy(conflagCost(incCost(inclusiveTime(tickFirst(s)))))))],
  ['doom_tick_priority_and_inclusive', 'destro', s => inclusiveTime(tickFirst(s))],
  ['destro_all_confirmed', 'destro', s => eurekaMasks(eurekaPolicy(conflagCost(incCost(inclusiveTime(tickFirst(s))))))],
  ['destro_cost_policy_priority', 'destro', s => eurekaPolicy(incCost(tickFirst(s)))],
  ['soul_fire_integer_cooldown', 'demo_fire_brand', soulFireCooldown],
  ['imp_and_soul_fire_cooldown', 'demo_fire_brand', s => soulFireCooldown(petStart(petMana(s)))],
  ['wrack_spirit_regen', 'aff_wrack', spiritRegen],
  ['wrack_spirit_and_nightfall', 'aff_wrack', (s,c) => nightfall(spiritRegen(s,c))],
  ['doom_tick_priority', 'destro', tickFirst],
  ['doom_priority_and_incinerate_cost', 'destro', s => incCost(tickFirst(s))],
  ['incinerate_cost', 'destro', incCost],
  ['eureka_on_cooldown', 'destro', eurekaPolicy],
  ['incinerate_cost_and_eureka_policy', 'destro', s => eurekaPolicy(incCost(s))],
  ['nightfall_all_bolt_rows', 'aff_wrack', nightfall],
  ['wrack_inclusive_min', 'aff_wrack', s => s, c => { for (const r of c.aplRules) if (r.action === 18) for (const key of ['cond','cond1','cond2']) if (r[key] === APL_COND.DOT_REM_GT) r[key] = APL_COND.DOT_REM_GE; }],
  ['nightfall_and_inclusive_min', 'aff_wrack', nightfall, c => { for (const r of c.aplRules) if (r.action === 18) for (const key of ['cond','cond1','cond2']) if (r[key] === APL_COND.DOT_REM_GT) r[key] = APL_COND.DOT_REM_GE; }],
  ['imp_mana_capacity', 'demo_fire_brand', petMana],
  ['imp_first_firebolt', 'demo_fire_brand', petStart],
  ['imp_capacity_and_start', 'demo_fire_brand', s => petStart(petMana(s))],
];
const output = { diagnosticOnly: true, notes: "Source-backed counterfactuals, not production fixes. Spirit regeneration is an event-integrated diagnostic; complete payment/regen ordering still requires implementation and regression coverage.", sourceReportHash: crypto.createHash('sha256').update(input).digest('hex'), kernelHash: crypto.createHash('sha256').update(FRAGMENT).digest('hex'), iterations: source.iterations, seed: source.seed, rows: [] };
const selected = process.argv.slice(2);
if (selected.length && fs.existsSync(path.join(root,'FOREVER_RESOURCE_CAUSE_INVESTIGATION.json'))) output.rows = JSON.parse(fs.readFileSync(path.join(root,'FOREVER_RESOURCE_CAUSE_INVESTIGATION.json'))).rows.filter(r => !selected.includes(r.id));
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'forever-resources-'));
try {
  for (const [id, preset, shaderEdit, configEdit] of probes.filter(p => !selected.length || selected.includes(p[0]))) {
    const [race, profile] = profiles[preset];
    const row = source.rows.find(r => r.preset === preset && r.race === race && r.profile === profile);
    if (row?.status !== 'complete') throw new Error(`Missing reference ${preset}`);
    const config = structuredClone(row.config); configEdit?.(config);
    const count = source.iterations, width = 100;
    const manifest = path.join(temp, `${id}.json`);
    fs.writeFileSync(manifest, JSON.stringify({ vertex: '#version 300 es\n' + VERTEX, detailed: '#version 300 es\n' + shaderEdit(FRAGMENT,config), cases: [{mode:'detailed',width,height:Math.ceil(count/width)*COMPACT_STRIPES,configWords:Array.from(packConfig(config)),uniforms:{numConfigs:1,fightsPerConfig:count,seed:source.seed,offset:0,count,gridWidth:width,mode:0,eventBudget:65536}}] }));
    const gpu = JSON.parse(execFileSync('python3', [path.join(root,'threejs_webgl_des/validation/headless_gles.py'),manifest],{encoding:'utf8',timeout:120000,maxBuffer:128*1024*1024}));
    const states = decodeDetailedBatch(gpu.outputs[0],width,count);
    const ours = summarizeSamples(states.map(s => s.total/config.duration));
    const breakdown = aggregateOurs(states,config);
    output.rows.push({id,caseId:row.id,baseline:row.ours,forever:row.forever,ours,deltaPct:(ours.mean/row.forever.mean-1)*100,resources:breakdown.resources,comparison:compareBreakdowns(breakdown,row.breakdown.forever)});
    fs.writeFileSync(path.join(root,'FOREVER_RESOURCE_CAUSE_INVESTIGATION.json'),JSON.stringify(output,null,2)+'\n');
    console.log(`${id}: ${ours.mean.toFixed(3)} DPS (${output.rows.at(-1).deltaPct.toFixed(3)}%)`);
  }
} finally { fs.rmSync(temp,{recursive:true,force:true}); }
