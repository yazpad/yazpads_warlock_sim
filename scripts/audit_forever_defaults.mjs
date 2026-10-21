// Audit the original defaults through the production importer, without fixture overrides.
// Usage: node scripts/audit_forever_defaults.mjs [Forever checkout]
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { resolveSavedBuild } from '../threejs_webgl_des/src/contracts/build_io.js';
const root = process.argv[2] ? path.resolve(process.argv[2], 'ui/specs/warlock/dps/builds') : new URL('../fixtures/forever_defaults/', import.meta.url).pathname;
const rows = [];
for (const file of fs.readdirSync(root).filter(f => f.endsWith('.build.json')).sort()) {
  const source = JSON.parse(fs.readFileSync(path.join(root, file)));
  const {candidate, config} = await resolveSavedBuild(source);
  assert.deepEqual(candidate.importDiagnostics, [], file);
  for (const key of ['autoCooldowns', 'assignedElements', 'demonicRune', 'ezThroDynamite', 'manualTrinket', 'judgementOfWisdom', 'giftOfArthas']) assert.equal(config[key], true, `${file}: ${key}`);
  assert.equal(config.mp5,65);
  assert.equal(config.crit,3);
  assert.equal(config.spellPower,172+config.demonicKnowledge*20);
  assert.equal(config.distance, source.player.distanceFromTarget);
  rows.push({build: file.replace('.build.json', ''), aplRules: config.aplRules.length, droppedActions: candidate.importDiagnostics.length,
    distance: config.distance, spirit: config.spirit, mp5: config.mp5, critBeforeIntellect: config.crit,
    bossArmor: config.bossArmor, soulShards: config.soulShards, potion: `${config.trinketSP} SP / ${config.trinketDuration}s / ${config.trinketCD}s CD, APL controlled`});
}
assert.equal(rows.length, 5, 'Expected all five default builds');
console.table(rows);
