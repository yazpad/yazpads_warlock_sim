// Capture an exporter result and compare it with the ordinary app import.
// node scripts/capture_forever_fixture.mjs /tmp/export.json /path/to/forever
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { migrateLegacyBuild } from '../threejs_webgl_des/src/contracts/legacy_build.js';
import { resolveWarlockImport } from '../threejs_webgl_des/src/classes/warlock_import.js';
import { CONFIG, packConfig } from '../threejs_webgl_des/src/model.js';

const root = path.resolve(import.meta.dirname, '..');
const exported = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const checkout = path.resolve(process.argv[3] || '../forever');
if (exported.schemaVersion !== 2 || !exported.request || !exported.initialPlayerStats) throw new Error('Expected a live Forever exporter snapshot.');
if (exported.result.error) throw new Error(`Forever simulation failed: ${JSON.stringify(exported.result.error)}`);
const id = exported.presetId;
if (!/^[a-z_]+$/.test(id)) throw new Error('Invalid preset ID');
const fixturePath = path.join(root, 'fixtures/canonical_forever', `${id}.fixture.json`);
const gearFree = exported.scenarioId === 'gear-free-coe-v2';
if (!gearFree) throw new Error('Active parity capture requires gear-free-coe-v2. Geared captures are archived.');
if (exported.request.raid.parties[0].players[0].equipment?.items?.some(item => item.id)) throw new Error('Gear-free request contains equipment.');
const archivePath = path.join(root, 'fixtures/geared_forever', `${id}.fixture.json`);
fs.mkdirSync(path.dirname(archivePath), { recursive: true });
if (!fs.existsSync(archivePath) && fs.existsSync(fixturePath)) {
  const previous = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  if (previous.scenarioId !== 'gear-free-coe-v2') fs.copyFileSync(fixturePath, archivePath);
}
const legacy = null; // Geared snapshot values are not comparable to this scenario.
const request = exported.request;
const party = request.raid.parties[0];
const source = { player: party.players[0], partyBuffs: party.buffs,
  raidBuffs: request.raid.buffs, debuffs: request.raid.debuffs, encounter: request.encounter };
const staged = migrateLegacyBuild(source, { candidateId: id });
const database = { slots: [], items: [] }; // Gear-free imports have no catalog dependency.
const missingItems = exported.gearItems.filter(Boolean).filter(item => !database.items.some(ours => ours.id === item.id)).map(item => ({ id: item.id, name: item.name }));
let imported = null, importError = null;
try { imported = resolveWarlockImport(staged, { itemDatabase: database }); }
catch (error) { importError = error.message; }
const packed = imported ? new Float32Array(packConfig(imported.config).buffer) : null;
const packedValue = field => packed?.[Object.keys(CONFIG).indexOf(field)] ?? null;
const packedFields = [
  { field: 'maxMana', forever: exported.initialPlayerStats.Mana, shader: packedValue('maxMana') },
  { field: 'maxHealth', forever: exported.initialPlayerStats.Health, shader: packedValue('maxHealth') },
  { field: 'spellCritPercent', forever: exported.initialPlayerStats.SpellCritPercent,
    shader: packed ? packedValue('crit') * 100 : null },
].map(row => ({ ...row, tolerance: Math.max(1e-4, Math.abs(row.forever) * 1e-6),
  delta: row.shader === null ? null : row.shader - row.forever }));
const mapping = { spellPower: 'SpellDamage', shadowPower: 'ShadowDamage', firePower: 'FireDamage', intellect: 'Intellect', stamina: 'Stamina', spirit: 'Spirit', hit: 'SpellHitPercent', crit: 'SpellCritPercent', mp5: 'MP5', penetration: 'SpellPiercing', maxHealth: 'Health' };
const differences = Object.entries(mapping).map(([field, stat]) => {
  const forever = exported.initialPlayerStats[stat];
  const old = legacy?.resolvedConfig?.[field] ?? null;
  // Config crit is only one contribution; compare the actual shader chance.
  const normalImport = field === 'crit' && packed ? packedValue('crit') * 100 : imported?.config?.[field] ?? null;
  return { field, foreverStat: stat, forever, legacy: old, legacyDelta: old === null ? null : old - forever,
    normalImport, importDelta: normalImport === null ? null : normalImport - forever };
});
const sourceFiles = ['go.mod', 'go.sum', 'sim/warlock/warlock_test.go', 'sim/core/test_generators.go', 'sim/core/test_utils.go',
  `ui/specs/warlock/dps/builds/${id}.build.json`, 'assets/database/db.bin', 'assets/database/db.json'];
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const provenance = {
  revision: execFileSync('git', ['-C', checkout, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  workingTree: execFileSync('git', ['-C', checkout, 'status', '--porcelain'], { encoding: 'utf8' }).trim(),
  sourceHashes: Object.fromEntries(sourceFiles.map(file => [file, hash(path.join(checkout, file))])),
  exporterHash: hash(path.join(root, 'scripts/forever_export/main.go')),
  scenarioHash: hash(path.join(root, 'fixtures/forever_gear_free_scenario.json')),
  command: `go run -tags=with_db <repo>/scripts/forever_export/main.go ${id} ${source.player.race}`,
};
const blockers = [
  ...(importError ? [`Ordinary import fails: ${importError}`] : []),
  ...(missingItems.length ? [`${missingItems.length} source equipment IDs are absent from the app database`] : []),
  ...differences.filter(d => d.importDelta !== null && Math.abs(d.importDelta) > 1e-6)
    .map(d => `${d.field}: normal import ${d.normalImport}, Forever ${d.forever} (delta ${d.importDelta})`),
  ...packedFields.filter(d => d.delta !== null && Math.abs(d.delta) > d.tolerance)
    .map(d => `Shader ${d.field}: ${d.shader}, Forever ${d.forever} (delta ${d.delta})`),
  'Named groups, assigned curse actions and complete APL semantics are not yet preserved (see FOREVER_IMPORT_AUDIT.md)',
];
const fixture = { ...exported, classId: 'warlock', provenance, sourceBuild: source, candidate: staged.candidate,
  resolvedConfig: imported?.config ?? null,
  inputComparison: { status: 'blocked', blockers, missingItems, fields: differences, packedFields, ordinaryImportError: importError },
  // The live result is the reference; no hand-maintained DPS target or override config.
  foreverResults: { [`Test${id === 'sm_ruin' ? 'Affliction' : id}-${exported.testName}`]: { dps: exported.result.raidMetrics.dps.avg } },
};
fs.writeFileSync(fixturePath, JSON.stringify(fixture, null, 2) + '\n');
const fmt = value => value === null ? 'unavailable' : String(value);
const lines = [`# ${id}: gear-free input comparison`, '', `Forever revision: \`${provenance.revision}\`. Working tree: ${provenance.workingTree ? 'modified (see fixture)' : 'clean'}.`, '',
  `Exact generated case: \`${exported.testName}\`. Live reference: **${exported.result.raidMetrics.dps.avg.toFixed(7)} DPS**, ${request.simOptions.iterations} iterations, seed ${request.simOptions.randomSeed}.`, '',
  '**Status: blocked before combat comparison.** No hand-resolved configuration is substituted when ordinary import fails.', '',
  `Scenario: **${exported.scenarioId}**. Empty equipment, external CoE only; no other external buffs or consumables. Declared bonus stats: \`${JSON.stringify(exported.declaredBonusStats)}\`.`, '',
  '| Field | Forever initial state | Normal import | Import minus Forever |', '| --- | ---: | ---: | ---: |',
  ...differences.map(d => `| ${d.field} | ${d.forever} | ${fmt(d.normalImport)} | ${fmt(d.importDelta)} |`), '',
  'The normal-import `crit` row uses packed shader crit, including base/intellect/racial contributions; the config field alone is only one contribution. Geared reference values are archived and do not apply to this scenario.', '',
  '## Packed shader inputs', '',
  '| Field | Forever initial state | Shader | Shader minus Forever |', '| --- | ---: | ---: | ---: |',
  ...packedFields.map(d => `| ${d.field} | ${d.forever} | ${fmt(d.shader)} | ${fmt(d.delta)} |`), '',
  'Packed float comparisons allow max(0.0001, absolute source value × 0.000001) for float32 representation; feature gaps still block parity.', '',
  '## Import blockers', '', ...blockers.map(b => `- ${b}`), '',
  '## Missing equipment', '', ...missingItems.map(item => `- ${item.id}: ${item.name}`), '',
  '## Provenance and reproduction', '',
  'The fixture records the exact gear-free request, declared bonus stats, ComputeStats response, initial player/pet stats, pseudo stats and per-action combat results. It uses empty equipment, external CoE only; no other external buffs/consumables, the preset race/talents/pet/rotation, zero distance and the default long single-target encounter.', '',
  'Run the exporter from a checkout of the recorded revision with generated Go protobuf files and the embedded database enabled:', '',
  '```sh', `go run -tags=with_db /path/to/yazpads_warlock_sim/scripts/forever_export/main.go ${id} ${source.player.race} > /tmp/forever-export.json`,
  'cd /path/to/yazpads_warlock_sim', 'node scripts/capture_forever_fixture.mjs /tmp/forever-export.json /path/to/forever', '```', '',
  'Previous geared snapshots are retained under fixtures/geared_forever for historical reference only. They supply no stats or DPS target to this scenario.', '',
  'Direct bonus-stat imports add level-60 racial/class attributes exactly once. Shader packing consumes totals without legacy extra intellect, and derives health/mana from source class values.', '',
  'Next: resolve remaining stat, pet, talent and APL differences in this gear-free scenario. Gear, enchants, sets and item effects are deferred. Group/curse/cooldown semantics must match before enabling a DPS tier.', ''];
fs.writeFileSync(path.join(root, `FOREVER_INPUT_COMPARISON_${id}.md`), lines.join('\n'));
console.log(JSON.stringify({ fixture: fixturePath, status: fixture.inputComparison.status, blockers, differences }, null, 2));
