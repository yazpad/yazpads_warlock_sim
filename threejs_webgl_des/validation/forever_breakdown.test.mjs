import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeForever, compareBreakdowns } from '../../scripts/forever_breakdown.mjs';

test('source damage, crit and resisted subsets reconcile without double counting', () => {
  const target = { casts:2,hits:2,crits:2,ticks:2,critTicks:2,glances:0,blocks:0,blockedCrits:0,crushes:0,
    misses:0,dodges:0,parries:0,damage:200,tickDamage:100,critDamage:100,critTickDamage:50,
    resistedHits:1,resistedCrits:1,resistedTicks:1,resistedCritTicks:1 };
  const player = { actions:[{id:{spellId:25309},targets:[target]},
    {id:{spellId:999999},targets:[{...target,damage:0,tickDamage:0,critDamage:0,critTickDamage:0}]}], pets:[],resources:[],auras:[] };
  const output=normalizeForever({raidMetrics:{dps:{avg:10},parties:[{players:[player]}]}},2,10);
  const immo=output.rows.find(row=>row.name==='Immolate');
  assert.equal(immo.damage,100);assert.equal(immo.periodicDamage,50);assert.equal(immo.directDamage,50);
  assert.equal(immo.landed,4);assert.equal(immo.crits,2);assert.equal(immo.ticks,2);
  assert.equal(output.reconciliationError,0);
  const missing=compareBreakdowns({rows:[]},output).find(row=>row.key==='player:spell:999999');
  assert.equal(missing.presence,'forever-only');assert.equal(missing.ours,null);
});
