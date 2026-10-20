// Read-only source/config audit; does not run combat simulations or alter fixtures.
// Usage: node scripts/audit_forever_import.mjs [forever checkout] [output prefix]
import fs from 'node:fs';
import path from 'node:path';
import { convertForeverBuildToCandidate, SPELL_ID_TO_ACTION } from '../threejs_webgl_des/src/classes/forever_bridge.js';
import { parseAPLText, compileAPLToBytecode } from '../threejs_webgl_des/src/apl.js';

const checkout = path.resolve(process.argv[2] || '../forever');
const prefix = path.resolve(process.argv[3] || 'FOREVER_IMPORT_AUDIT');
const builds = path.join(checkout, 'ui/specs/warlock/dps/builds');
const reports = [];
for (const file of fs.readdirSync(builds).filter(f => f.endsWith('.build.json')).sort()) {
  const activeFixturePath = path.resolve('fixtures/canonical_forever', file.replace('.build.json', '.fixture.json'));
  const active = fs.existsSync(activeFixturePath) ? JSON.parse(fs.readFileSync(activeFixturePath, 'utf8')) : null;
  const source = active?.scenarioId === 'gear-free-coe-v2' ? active.sourceBuild : JSON.parse(fs.readFileSync(path.join(builds, file), 'utf8'));
  const sourcePath = active?.scenarioId === 'gear-free-coe-v2' ? `${activeFixturePath}#sourceBuild` : path.join(builds, file);
  const candidate = convertForeverBuildToCandidate(source);
  const issues = [];
  const add = (at, reason, value) => issues.push({ path: at, reason, ...(value === undefined ? {} : { value }) });
  const mapped = {
    raidBuffs: ['arcaneBrilliance', 'giftOfTheWild'],
    partyBuffs: ['manaSpringTotem'],
    debuffs: ['curseOfElements', 'curseOfShadow', 'shadowWeaving', 'improvedScorch'],
    'player.buffs': ['greaterBlessingOfKings', 'blessingOfKings', 'greaterBlessingOfWisdom', 'blessingOfWisdom', 'rallyingCryOfTheDragonslayer', 'songflowerSerenade', 'warchiefsBlessing', 'spiritOfZandalar', 'saygesFortune'],
    'player.warlock.options.classOptions': ['summon', 'sacrificedDemon'],
  };
  for (const [at, supported] of Object.entries(mapped)) {
    const object = at.split('.').reduce((v, k) => v?.[k], source) || {};
    for (const [key, value] of Object.entries(object)) {
      if (value && !['TristateEffectMissing', 'NoArmor'].includes(value) && !supported.includes(key)) add(`${at}.${key}`, 'Not mapped by bridge; combat relevance needs review', value);
      else if (value && typeof value === 'string' && value.startsWith('TristateEffect') && value !== 'TristateEffectMissing') add(`${at}.${key}`, 'Effect rank collapsed to boolean', value);
    }
  }
  const consumes = source.player?.consumables || {};
  const supportedIds = { flaskId: [13512], foodId: [13931], mhImbueId: [20749], offensivePotId: [9155, 9264, 21546, 250937] };
  for (const [key, value] of Object.entries(consumes)) {
    if (value && !supportedIds[key]?.includes(value)) add(`player.consumables.${key}`, 'Consumable not mapped', value);
  }
  for (const [i, item] of (source.player?.equipment?.items || []).entries()) {
    for (const [key, value] of Object.entries(item)) if (key !== 'id' && value) add(`player.equipment.items[${i}].${key}`, 'Equipment metadata discarded (including enchants)', value);
  }
  if (source.encounter) add('encounter', 'Source encounter ignored; bridge supplies 180s / level 63 / armor 3731 / resistance 0', source.encounter);
  for (const key of ['profession1', 'profession2', 'bonusStats', 'reactionTimeMs', 'spellQueueWindowMs']) {
    if (source.player?.[key] !== undefined) add(`player.${key}`, 'Player setting not mapped', source.player[key]);
  }
  const rotation = source.player?.rotation || {};
  function walk(value, at) {
    if (!value || typeof value !== 'object') return;

    if (value.autocastOtherCooldowns) add(at, 'Automatic cooldown action omitted');
    if (value.castWarlockAssignedCurse) add(at, 'Assigned curse action omitted; uptime/GCD/mana not preserved');
    if (value.channelSpell) add(`${at}.channelSpell`, 'Channel treated as fixed action; interruptIf / allowRecast not preserved', value.channelSpell);
    if (value.castSpell) {
      const id = value.castSpell.spellId || {};
      if (!SPELL_ID_TO_ACTION[id.spellId ?? id.otherId]) add(`${at}.castSpell`, 'Spell or item action omitted', id);
      if (id.spellId === 18288) add(`${at}.castSpell`, 'Amplify Curse mapped to Agony rather than independent cooldown');
    }
    if (value.dotIsActive && !at.endsWith('.not.val')) add(at, 'Positive DoT predicate replaced by true or Immolate < 6s', value.dotIsActive);
    if (value.castSpell && value.condition) {
      const alias = SPELL_ID_TO_ACTION[value.castSpell.spellId?.spellId];
      if (!at.startsWith('player.rotation.groups') && ['conflag', 'decimateSoulFire'].includes(alias)) add(at, 'Action-specific rewrite discards or replaces source condition', alias);
    }
    if (value.not?.val?.variableRef) add(at, 'Variable negation discarded except special execute case', value.not);
    if (value.or) add(at, 'OR keeps only first translated branch');
    if (value.and?.vals?.length > 2) add(at, 'AND translation may retain only two predicates');
    if (value.cmp) add(at, 'Comparison translator conflates strict/inclusive bounds; min uses AND even for less-than', value.cmp.op);
    if (value.variableRef && !rotation.valueVariables?.some(v => v.name === value.variableRef.name)) add(at, 'Unresolved variable silently becomes true', value.variableRef);
    for (const [key, child] of Object.entries(value)) {
      // Group predicates use the strict branch translator and its diagnostics.
      if (key === 'condition' && (value.groupReference || at.startsWith('player.rotation.groups') || ['berserking', 'bloodFury', 'eureka'].includes(SPELL_ID_TO_ACTION[value.castSpell?.spellId?.spellId]))) continue;
      walk(child, `${at}.${key}`);
    }
  }
  walk(rotation, 'player.rotation');
  for (const diagnostic of candidate.importDiagnostics || []) add(`player.rotation.groups.${diagnostic.groupPath.join('.')}`, diagnostic.reason, diagnostic.action);
  if (rotation.prepullActions?.length) add('player.rotation.prepullActions', 'Prepull schedule ignored', rotation.prepullActions);
  const compilation = [];
  for (const line of (candidate.apl?.text || '').split('\n').filter(Boolean)) {
    try { compileAPLToBytecode(parseAPLText(line)); }
    catch (error) { compilation.push({ line, error: error.message }); }
  }
  const id = file.replace('.build.json', '');
  const fixturePath = path.resolve('fixtures/canonical_forever', `${id}.fixture.json`);
  let fixtureOverrides = [];
  if (fs.existsSync(fixturePath)) {
    const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
    fixtureOverrides = Object.entries(fixture.resolvedConfig || {}).map(([key, value]) => ({ key, value }));
    if (fixture.schemaVersion >= 2) add('fixture.inputComparison', `Source capture status: ${fixture.inputComparison?.status}; resolvedConfig is produced by ordinary import`);
    else if (fixtureOverrides.length) add('fixture.resolvedConfig', 'Benchmark uses resolved configuration, bypassing ordinary import resolution; inspect snapshot alongside source');
  }
  reports.push({ id, source: sourcePath, candidate, issues, compilation, fixtureOverrides });
}
fs.writeFileSync(`${prefix}.json`, JSON.stringify({ checkout, reports }, null, 2) + '\n');
const lines = ['# Forever import differences', '', 'Generated with `node scripts/audit_forever_import.mjs`. This audits source settings and bridge behavior; it does not measure DPS or certify mechanics parity.', '', 'Paths include unused group definitions so omitted actions remain visible. Unmapped fields require review; some may have no damage impact.', '', '| Build | Findings | APL lines failing compilation |', '| --- | ---: | ---: |'];
for (const r of reports) lines.push(`| ${r.id} | ${r.issues.length} | ${r.compilation.length} |`);
for (const r of reports) {
  lines.push('', `## ${r.id}`, '', `Source: \`${r.source}\``, '');
  for (const i of r.issues) lines.push(`- \`${i.path}\`: ${i.reason}${i.value === undefined ? '' : ` — \`${JSON.stringify(i.value)}\``}`);
  for (const i of r.compilation) lines.push(`- Compilation failure: \`${i.line}\` — ${i.error}`);
}
fs.writeFileSync(`${prefix}.md`, lines.join('\n') + '\n');
console.log(JSON.stringify(reports.map(r => ({ build: r.id, findings: r.issues.length, compilationFailures: r.compilation.length })), null, 2));
