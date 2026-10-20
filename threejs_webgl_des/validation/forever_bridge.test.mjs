import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  decodeForeverTalentsString,
  mapForeverBuffs,
  extractForeverAPL,
  convertForeverBuildToCandidate
} from '../src/classes/forever_bridge.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FOREVER_BUILDS_DIR = '/home/aaron-ma/forever/ui/specs/warlock/dps/builds';

test('decodeForeverTalentsString correctly parses forever talent strings', () => {
  // Test with SM/Ruin string
  const smRuinStr = '2540002013520105--0550305003';
  const talents = decodeForeverTalentsString(smRuinStr);

  assert.equal(talents.affliction.improved_life_tap, 2);
  assert.equal(talents.affliction.suppression, 5);
  assert.equal(talents.affliction.improved_corruption, 4);
  assert.equal(talents.affliction.improved_bane_of_agony, 2);
  assert.equal(talents.affliction.amplify_curse, 1);
  assert.equal(talents.affliction.pandemic, 3);
  assert.equal(talents.affliction.malevolence, 5);
  assert.equal(talents.affliction.nightfall, 2);
  assert.equal(talents.affliction.siphon_life, 1);
  assert.equal(talents.affliction.shadow_mastery, 5);

  assert.deepEqual(talents.demonology, {});

  assert.equal(talents.destruction.improved_shadow_bolt, 5);
  assert.equal(talents.destruction.bane, 5);
  assert.equal(talents.destruction.cataclysm, 3);
  assert.equal(talents.destruction.ruin, 5);
  assert.equal(talents.destruction.agonizing_flames, 3);
});

test('convertForeverBuildToCandidate loads and converts sm_ruin.build.json', () => {
  const filePath = path.join(FOREVER_BUILDS_DIR, 'sm_ruin.build.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const foreverBuild = JSON.parse(raw);

  const candidate = convertForeverBuildToCandidate(foreverBuild, { candidateId: 'sm_ruin_forever' });

  assert.equal(candidate.classId, 'warlock');
  assert.equal(candidate.candidateId, 'sm_ruin_forever');
  assert.equal(candidate.classOptions.race, 'ORC');
  assert.equal(candidate.classOptions.pet, 'succubus');
  assert.equal(candidate.buffs.arcaneIntellect, true);
  assert.equal(candidate.buffs.markOfTheWild, true);
  assert.equal(candidate.buffs.blessingOfKings, true);
  assert.equal(candidate.buffs.blessingOfWisdom, true);
  assert.equal(candidate.buffs.flaskSupremePower, true);
  assert.equal(candidate.buffs.wizardOil, true);
  assert.equal(candidate.buffs.nightfinSoup, true);
  assert.equal(candidate.book, true);
  assert.equal(candidate.trinketSP, 47);
  assert.equal(candidate.trinketDuration, 30);
  assert.equal(candidate.trinketCD, 120);

  // Talents check
  assert.equal(candidate.talents.affliction.shadow_mastery, 5);
  assert.equal(candidate.talents.destruction.ruin, 5);

  // APL check
  assert.ok(candidate.apl?.text);
  assert.ok(candidate.apl.text.includes('bolt') || candidate.apl.text.includes('Shadow Bolt'));
  assert.ok(candidate.apl.text.includes('Corruption') || candidate.apl.text.includes('corr'));
});

test('convertForeverBuildToCandidate loads and converts all canonical forever warlock presets', () => {
  const buildFiles = ['demo_fire_brand', 'demo_shadow_brand', 'destro', 'sm_ruin', 'aff_wrack'];

  for (const name of buildFiles) {
    const filePath = path.join(FOREVER_BUILDS_DIR, `${name}.build.json`);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const foreverBuild = JSON.parse(raw);

    const candidate = convertForeverBuildToCandidate(foreverBuild, { candidateId: name });
    assert.equal(candidate.classId, 'warlock');
    assert.ok(candidate.classOptions.race);
    assert.ok(candidate.talents);
    assert.ok(typeof candidate.talents.affliction === 'object');
    assert.ok(typeof candidate.talents.demonology === 'object');
    assert.ok(typeof candidate.talents.destruction === 'object');
  }
});
