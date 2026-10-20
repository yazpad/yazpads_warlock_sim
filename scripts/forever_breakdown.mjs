import { SPELLS, COMPACT_STRIPES, DETAIL_WORD_OFFSET, DETAIL_EXTRA_OUTPUT, UPTIME_EFFECTS } from '../threejs_webgl_des/src/model.js';
import { SPELL_ID_TO_ACTION } from '../threejs_webgl_des/src/classes/forever_bridge.js';

const aliasIndices = { bolt:0, corr:1, agony:2, immo:3, incinerate:4, searing:5,
  curse:6, decimateSoulFire:7, conflag:8, shadowburn:9, siphon:10, wrack:11, hellfire:13 };
const spellKey = index => `player:${index}`;
const utility = { 11689:['player:tap','Life Tap'], 1454:['player:tap','Life Tap'],
  18288:['player:amplify','Amplify Curse'], 20572:['player:racial','Blood Fury'],
  20554:['player:racial','Berserking'], 1259821:['player:racial','Eureka!'],
  1311680:['player:assigned-curse','Assigned curse'] };
const blank = (key, name, actor) => ({ key, name, actor, casts:0, landed:0, crits:0, misses:0,
  ticks:0, tickCrits:0, damage:0, periodicDamage:0, criticalDamage:0, periodicCriticalDamage:0, glances:0 });
const add = (map, row) => {
  const old = map.get(row.key);
  if (!old) map.set(row.key, row);
  else for (const field of Object.keys(row)) {
    if (typeof row[field] === 'number') old[field] += row[field];
    else if (field==='sourceIds') old[field].push(...row[field]);
  }
};
const finish = (row, n, duration) => {
  for (const field of Object.keys(row)) if (typeof row[field] === 'number') row[field] /= n;
  row.directDamage = row.damage - row.periodicDamage;
  row.directLanded = row.landed - row.ticks;
  row.directCrits = row.crits - row.tickCrits;
  row.dps = row.damage / duration;
  row.periodicDps = row.periodicDamage / duration;
  row.directDps = row.directDamage / duration;
  row.damagePerCast = row.casts > 0 ? row.damage / row.casts : null;
  row.damagePerLandedEvent = row.landed > 0 ? row.damage / row.landed : null;
  return row;
};

export function decodeDetailedBatch(raw, width, count) {
  const words = raw.map(a => new Uint32Array(a));
  const floats = words.map(a => new Float32Array(a.buffer));
  return Array.from({ length:count }, (_, lane) => {
    const index = word => ((Math.floor(lane / width) * COMPACT_STRIPES + Math.floor(word / 16)) * width + lane % width) * 4 + word % 4;
    const word = i => words[Math.floor(i % 16 / 4)][index(i)];
    const float = i => floats[Math.floor(i % 16 / 4)][index(i)];
    const state = { total:float(0), done:word(1)&65535, taps:word(3)&65535,
      procs:word(3)>>>16, isbProcs:word(4)&65535, isbConsumed:word(4)>>>16,
      petBrandDamage:float(5), petDamage:float(6),
      petMeleeDamage:float(26), petMeleeCasts:word(27)&65535, petMeleeHits:word(27)>>>16,
      petMeleeCrits:word(28)&65535, petMeleeMisses:word(28)>>>16,
      petSpellDamage:float(29), petSpellCasts:word(30)&65535, petSpellHits:word(30)>>>16,
      petSpellCrits:word(31)&65535, petSpellMisses:word(31)>>>16,
      spent:float(DETAIL_WORD_OFFSET+6), manaWasted:float(DETAIL_WORD_OFFSET+7) };
    if (state.done !== 1 || !Number.isFinite(state.total)) throw new Error(`Detailed lane ${lane} failed: ${state.done}`);
    for (let i=0;i<SPELLS.length;i++) {
      const at = i < 6 ? 8+i*3 : 32+(i-6)*3;
      state[`damage${i}`]=float(at); state[`casts${i}`]=word(at+1)&65535;
      state[`hits${i}`]=word(at+1)>>>16; state[`crits${i}`]=word(at+2)&65535; state[`misses${i}`]=word(at+2)>>>16;
    }
    DETAIL_EXTRA_OUTPUT.forEach(([name,type],i) => state[name] = type==='f32' ? float(DETAIL_WORD_OFFSET+12+i) : word(DETAIL_WORD_OFFSET+12+i));
    UPTIME_EFFECTS.forEach(([,key],i) => {
      const packed = word(DETAIL_WORD_OFFSET+Math.floor(i/2));
      state[`uptime_${key}`] = (i%2 ? packed>>>16 : packed&65535)/65535;
    });
    return state;
  });
}

export function aggregateOurs(states, config) {
  const n = states.length, duration = config.duration;
  const sum = field => states.reduce((total, s) => total+(s[field]||0), 0);
  const rows = SPELLS.map((name,i) => finish({ ...blank(spellKey(i),name,'player'),
    casts:sum(`casts${i}`), landed:sum(`hits${i}`), crits:sum(`crits${i}`), misses:sum(`misses${i}`),
    ticks:sum(`ticks${i}`), tickCrits:sum(`tickCrits${i}`), damage:sum(`damage${i}`),
    periodicDamage:sum(`tickDamage${i}`), criticalDamage:sum(`critDamage${i}`), periodicCriticalDamage:sum(`tickCritDamage${i}`) }, n, duration));
  const pet = config.petChoice==='imp' ? 'Imp' : 'Succubus';
  for (const [key,name,prefix] of [['pet:melee',`${pet} melee`,'petMelee'],['pet:spell',pet==='Imp'?'Imp Firebolt':'Succubus Lash of Pain','petSpell']]) {
    rows.push(finish({ ...blank(key,name,pet), casts:sum(prefix+'Casts'), landed:sum(prefix+'Hits'),
      crits:sum(prefix+'Crits'), misses:sum(prefix+'Misses'), damage:sum(prefix+'Damage'),
      glances:prefix==='petMelee'?sum('petMeleeGlances'):0,
      // Pet critical damage is not separately instrumented; do not report a false zero.
      criticalDamage:null, periodicCriticalDamage:0 }, n, duration));
  }
  rows.push(finish({ ...blank('pet:brand',`${pet} Demonic Brand`,pet), damage:sum('petBrandDamage'),
    casts:sum('petBrandCasts'), landed:sum('petBrandHits'), crits:sum('petBrandCrits'), misses:sum('petBrandMisses'), criticalDamage:null }, n, duration));
  rows.push(finish({ ...blank('player:tap','Life Tap','player'),casts:sum('taps') },n,duration));
  rows.push(finish({ ...blank('player:amplify','Amplify Curse','player'),casts:sum('amplifyCasts') },n,duration));
  rows.push(finish({ ...blank('player:racial',({HUMAN:'Racial',ORC:'Blood Fury',GNOME:'Eureka!',TROLL:'Berserking'})[config.race]||'Racial','player'),casts:sum('racialCasts') },n,duration));
  const totalDamage = sum('total')/n;
  const accountedDamage = rows.reduce((s,row)=>s+row.damage,0);
  if (Math.abs(accountedDamage-totalDamage)>Math.max(0.1,totalDamage*1e-5)) throw new Error(`Our damage breakdown does not reconcile: ${accountedDamage} vs ${totalDamage}`);
  return { rows, totalDamage, accountedDamage, reconciliationError:accountedDamage-totalDamage,
    resources:{ manaSpent:sum('spent')/n, manaGained:sum('gained')/n, manaWasted:sum('manaWasted')/n,
      manaActualGain:(sum('gained')-sum('manaWasted'))/n, manaEnd:sum('mana')/n, lifeTaps:sum('taps')/n },
    procs:{ nightfall:sum('procs')/n, isbApplications:sum('isbProcs')/n, isbConsumptions:sum('isbConsumed')/n },
    uptimes:UPTIME_EFFECTS.map(([name,key])=>({name,fraction:sum(`uptime_${key}`)/n})) };
}

export function normalizeForever(result, n, duration) {
  const player = result.raidMetrics.parties[0].players[0], map = new Map();
  for (const actor of [player,...player.pets]) {
    const isPlayer = actor===player;
    for (const action of actor.actions) {
      const id = action.id.spellId;
      let identity;
      if (isPlayer) {
        const index = aliasIndices[SPELL_ID_TO_ACTION[id]];
        identity = utility[id] || (index!=null ? [spellKey(index),SPELLS[index]] : [`player:spell:${id??action.id.otherId}`,`Spell ${id??action.id.otherId}`]);
        // Resource bookkeeping is retained in raw metrics, not counted again as a cast spell.
        if (!id && action.id.otherId==='OtherActionManaGain') continue;
      } else identity = [id===1293697||id===1293698?'pet:brand':action.isMelee?'pet:melee':'pet:spell',
        id===1293697||id===1293698?`${actor.name} Demonic Brand`:action.isMelee?`${actor.name} melee`:id===11763?'Imp Firebolt':id===11780?'Succubus Lash of Pain':`${actor.name} spell ${id??action.id.otherId}`];
      if (!isPlayer&&!id&&!action.isMelee) continue;
      const row = blank(...identity,isPlayer?'player':actor.name);
      for (const target of action.targets) {
        row.casts+=target.casts; row.damage+=target.damage;
        // Resisted outcomes are subsets of these counters, not extra events.
        row.landed+=target.hits+target.crits+target.ticks+target.critTicks+target.glances+target.blocks+target.blockedCrits+target.crushes;
        row.crits+=target.crits+target.critTicks+target.blockedCrits;
        row.misses+=target.misses+target.dodges+target.parries;
        row.ticks+=target.ticks+target.critTicks; row.tickCrits+=target.critTicks;
        row.periodicDamage+=target.tickDamage; row.criticalDamage+=target.critDamage;
        row.periodicCriticalDamage+=target.critTickDamage; row.glances+=target.glances;
      }
      if (!row.casts&&!row.damage&&!row.landed) continue;
      row.sourceIds=[action.id];
      add(map,row);
    }
  }
  const rows=[...map.values()].map(row=>finish(row,n,duration));
  const totalDamage=result.raidMetrics.dps.avg*duration, accountedDamage=rows.reduce((s,row)=>s+row.damage,0);
  if(Math.abs(totalDamage-accountedDamage)>Math.max(0.01,totalDamage*1e-6))throw new Error(`Forever damage breakdown does not reconcile: ${accountedDamage} vs ${totalDamage}`);
  const mana=player.resources.filter(r=>r.type==='ResourceTypeMana');
  return { rows,totalDamage,accountedDamage,reconciliationError:accountedDamage-totalDamage,
    resources:{ manaSpent:-mana.reduce((s,r)=>s+Math.min(0,r.actualGain),0)/n,
      manaGained:mana.reduce((s,r)=>s+Math.max(0,r.gain),0)/n,
      manaActualGain:mana.reduce((s,r)=>s+Math.max(0,r.actualGain),0)/n,
      manaWasted:mana.reduce((s,r)=>s+(r.gain>0?r.gain-r.actualGain:0),0)/n,
      lifeTaps:rows.find(r=>r.key==='player:tap')?.casts||0 },
    auras:{ player:player.auras, pets:player.pets.map(p=>({name:p.name,auras:p.auras})), targets:result.encounterMetrics?.targets?.map(t=>t.auras)||[] } };
}

export function compareBreakdowns(ours, forever) {
  const oursMap=new Map(ours.rows.map(r=>[r.key,r])), sourceMap=new Map(forever.rows.map(r=>[r.key,r]));
  return [...new Set([...oursMap.keys(),...sourceMap.keys()])].map(key=>{
    const our=oursMap.get(key)||null, source=sourceMap.get(key)||null;
    return { key,name:source?.name||our.name,ours:our,forever:source,
      presence:our&&source?'both':our?'ours-only':'forever-only',
      deltaDps:(our?.dps||0)-(source?.dps||0),deltaCasts:(our?.casts||0)-(source?.casts||0) };
  }).filter(r=>(r.ours?.damage||r.forever?.damage||r.ours?.casts||r.forever?.casts))
    .sort((a,b)=>Math.abs(b.deltaDps)-Math.abs(a.deltaDps));
}

export function renderBreakdown(row) {
  const fmt=value=>value==null?'—':value.toFixed(2);
  const pair=(r,field)=>`${fmt(r.forever?.[field])} / ${fmt(r.ours?.[field])}`;
  const lines=['',`## ${row.id}: spell and pet breakdown`,'',
    'Each pair is **Forever / ours**, averaged per fight. Landed events include crits and ticks; misses are failed applications/attacks. Resisted-hit counters are subsets and are not added again. Damage is inclusive; crit and periodic damage are subsets, not additional damage.', '',
    '| Action | DPS F / O | Δ DPS | Casts F / O | Landed F / O | Crits F / O | Ticks F / O | Misses F / O |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |'];
  for(const r of row.breakdown.comparison)lines.push(`| ${r.name} | ${pair(r,'dps')} | ${fmt(r.deltaDps)} | ${pair(r,'casts')} | ${pair(r,'landed')} | ${pair(r,'crits')} | ${pair(r,'ticks')} | ${pair(r,'misses')} |`);
  lines.push('','### Damage components','','| Action | Direct DPS F / O | Periodic DPS F / O | Damage/landed event F / O |','| --- | ---: | ---: | ---: |');
  for(const r of row.breakdown.comparison.filter(r=>(r.ours?.damage||r.forever?.damage)))lines.push(`| ${r.name} | ${pair(r,'directDps')} | ${pair(r,'periodicDps')} | ${pair(r,'damagePerLandedEvent')} |`);
  lines.push('','### Mana accounting','','| Metric per fight | Forever | Ours |','| --- | ---: | ---: |');
  for(const field of ['manaSpent','manaGained','manaActualGain','manaWasted','manaEnd','lifeTaps'])lines.push(`| ${field} | ${fmt(row.breakdown.forever.resources[field])} | ${fmt(row.breakdown.ours.resources[field])} |`);
  lines.push('',`Damage reconciliation error per fight: Forever ${row.breakdown.forever.reconciliationError.toFixed(6)}, ours ${row.breakdown.ours.reconciliationError.toFixed(6)}. All damage sources are retained, including source-only actions.`, '',
    'JSON also contains periodic crit counts/damage, per-action source identities, glances, source resource/aura metrics, our aura uptimes and proc totals. A dash denotes an absent/unavailable counterpart; it is not a measured zero. Pet critical damage is not separately collected on our side; Brand independent cast/hit/crit/miss counts are collected. Amplify Curse counts our automatic activations, which need not have identical action semantics to the source APL.');
  return lines;
}
