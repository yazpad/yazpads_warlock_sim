import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';

import { FRAGMENT, FAST_FRAGMENT, VERTEX } from '../threejs_webgl_des/src/kernel.js';
import { packConfig, STATE_WORDS, decodeStates } from '../threejs_webgl_des/src/model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const FIXTURES_DIR = path.resolve(ROOT_DIR, 'fixtures/canonical_forever');
const HEADLESS_PY = path.resolve(ROOT_DIR, 'threejs_webgl_des/validation/headless_gles.py');

const PRESETS = [
  { id: 'destro', label: 'Destruction (destro)', foreverKey: 'TestDestruction-Settings-Gnome-preraid-Destruction-destro-FullBuffs-0.0yards-LongSingleTarget' },
  { id: 'sm_ruin', label: 'Affliction SM/Ruin', foreverKey: 'TestAffliction-Settings-Human-preraid-Affliction-sm_ruin-FullBuffs-0.0yards-LongSingleTarget' },
  { id: 'aff_wrack', label: 'Affliction Wrack', foreverKey: 'TestAfflictionWrack-Settings-Orc-preraid-Wrack-aff_wrack-FullBuffs-0.0yards-LongSingleTarget' },
  { id: 'demo_shadow_brand', label: 'Demonology Shadow Brand', foreverKey: 'TestDemonologyShadowBrand-Settings-Human-preraid-Shadow Brand-demo_shadow_brand-FullBuffs-0.0yards-LongSingleTarget' },
  { id: 'demo_fire_brand', label: 'Demonology Fire Brand', foreverKey: 'TestDemonologyFireBrand-Settings-Human-preraid-Fire Brand-demo_fire_brand-FullBuffs-0.0yards-LongSingleTarget' }
];

if (process.argv.includes('--inputs-only')) {
  const lines = ['# Forever gear-free parity status', '',
    'See the [saved diagnostic combat comparison](FOREVER_GEAR_FREE_BENCHMARK.md) for high-iteration Forever versus WebGL results, confidence intervals and recorded code provenance. The values below describe the input-capture fixtures.', '',
    'All active cases use `gear-free-coe-v2`: empty equipment, explicit bonus stats above racial/class bases, external CoE only, no other external buffs or consumables. Preset races, talents, pets and source rotations are retained.', '',
    'The live reference results below use 20 iterations and seed 101. They establish distinct source scenarios; they are not accepted cross-engine DPS parity measurements. Input/feature blockers must be cleared before combat scoring.', '',
    '| Preset | Race | Forever reference DPS | Input status | Blockers |', '| --- | --- | ---: | --- | ---: |'];
  const fixtures = PRESETS.map(preset => {
    const fixture = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, `${preset.id}.fixture.json`), 'utf8'));
    if (fixture.scenarioId !== 'gear-free-coe-v2') throw new Error(`Active fixture ${preset.id} is not gear-free-coe-v2`);
    lines.push(`| ${preset.id} | ${fixture.sourceBuild.player.race} | ${fixture.result.raidMetrics.dps.avg.toFixed(4)} | ${fixture.inputComparison.status} | ${fixture.inputComparison.blockers.length} |`);
    return fixture;
  });
  for (const fixture of fixtures) {
    lines.push('', `## ${fixture.presetId}`, '', `[Full input comparison](FOREVER_INPUT_COMPARISON_${fixture.presetId}.md)`, '',
      ...fixture.inputComparison.blockers.map(blocker => `- ${blocker}`));
  }
  lines.push('', 'Geared and legacy snapshots are archived under `fixtures/geared_forever` and `fixtures/legacy_forever`. Their DPS targets are not reused. Gear integration is deferred.', '');
  fs.writeFileSync(path.join(ROOT_DIR, 'PARITY_REPORT_FOREVER.md'), lines.join('\n'));
  console.log('Updated gear-free input status report; combat scoring was not run.');
  process.exit(0);
}

function runHeadlessSimulation(config) {
  const cases = [{
    mode: 'detailed',
    width: 1,
    height: Math.ceil(STATE_WORDS / 16),
    configWords: Array.from(packConfig(config)),
    uniforms: { numConfigs: 1, fightsPerConfig: 1, seed: config.seed || 101, offset: 0, count: 1, gridWidth: 1, mode: 1, eventBudget: 65536 }
  }];

  const tmpPath = path.join(tmpdir(), `forever_parity_report_${config.candidateId || 'sim'}_${Date.now()}.json`);
  fs.writeFileSync(tmpPath, JSON.stringify({ vertex: '#version 300 es\n' + VERTEX, detailed: '#version 300 es\n' + FRAGMENT, cases }));

  try {
    const out = execFileSync('python3', [HEADLESS_PY, tmpPath], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
    const { outputs } = JSON.parse(out);

    const words = new Uint32Array(STATE_WORDS);
    for (let i = 0; i < words.length; i++) {
      words[i] = outputs[0][Math.floor(i % 16 / 4)][Math.floor(i / 16) * 4 + i % 4];
    }
    return decodeStates(words.buffer, 1)[0];
  } finally {
    try { fs.unlinkSync(tmpPath); } catch {}
  }
}

function runHeadlessMultiSimulation(config, count = 10000) {
  const width = Math.min(count, 100);
  const height = Math.ceil(count / width);
  const cases = [{
    mode: 'fast',
    width,
    height,
    configWords: Array.from(packConfig({ ...config, iterations: count })),
    uniforms: { numConfigs: 1, fightsPerConfig: count, seed: config.seed || 101, offset: 0, count, gridWidth: width, mode: 0, eventBudget: 65536 }
  }];

  const tmpPath = path.join(tmpdir(), `forever_parity_10k_${config.candidateId || 'sim'}_${Date.now()}.json`);
  fs.writeFileSync(tmpPath, JSON.stringify({ vertex: '#version 300 es\n' + VERTEX, fast: '#version 300 es\n' + FAST_FRAGMENT, cases }));

  try {
    const out = execFileSync('python3', [HEADLESS_PY, tmpPath], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const { outputs } = JSON.parse(out);
    const floatBuf = new Float32Array(new Uint32Array(outputs[0][0]).buffer);
    let totalDps = 0;
    for (let i = 0; i < count; i++) {
      totalDps += floatBuf[i * 4] / 180;
    }
    return totalDps / count;
  } finally {
    try { fs.unlinkSync(tmpPath); } catch {}
  }
}

console.log('Generating PARITY_REPORT_FOREVER.md with 10,000-iteration Monte Carlo benchmark...');

const lines = [];
lines.push('# Cross-Sim Parity Report: WebGL2 GPU DES vs wowsims/forever');
lines.push('');
lines.push(`**Generated:** ${new Date().toISOString()}`);
lines.push('**Comparison Target:** `wowsims/forever` (Go canonical engine & test suites)');
lines.push('**Simulation Target:** Headless WebGL2 GPU DES Shader (`headless_gles.py`, 180s, 10,000 Iterations Monte Carlo)');
lines.push('');
lines.push('## Scoring Tiers');
lines.push('- **Tier A (Strict Match)**: $\\Delta \\le 0.5\\%$, cast count delta $\\le 1$');
lines.push('- **Tier B (Statistical Parity)**: $\\Delta \\le 1.5\\%$');
lines.push('- **Tier C (Divergence / Failure)**: $\\Delta > 1.5\\%$ or missing damage sources');
lines.push('');
lines.push('## Summary Table (10,000 Iterations Monte Carlo)');
lines.push('');
lines.push('| Preset ID | Preset Name | 10k WebGL DPS | Forever DPS | DPS Delta | Delta % | Score Tier | 1-Fight Sample Casts |');
lines.push('|:---|:---|:---:|:---:|:---:|:---:|:---:|:---|');

const details = [];

for (const preset of PRESETS) {
  const fixturePath = path.join(FIXTURES_DIR, `${preset.id}.fixture.json`);
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  if (fixture.schemaVersion >= 2 && fixture.inputComparison?.status !== 'matched') {
    lines.push(`| \`${preset.id}\` | ${preset.label} | — | ${fixture.result.raidMetrics.dps.avg.toFixed(1)} | — | — | BLOCKED: input differences | See FOREVER_INPUT_COMPARISON_${preset.id}.md |`);
    continue;
  }
  const config = { ...fixture.resolvedConfig, duration: 180, iterations: 1, seed: 101 };
  const state = runHeadlessSimulation(config);
  const mean10kDps = runHeadlessMultiSimulation(config, 10000);

  const foreverTarget = fixture.foreverResults[preset.foreverKey];
  const foreverDps = fixture.schemaVersion >= 2 ? fixture.result.raidMetrics.dps.avg : foreverTarget.dps;
  const delta = mean10kDps - foreverDps;
  const deltaPct = Math.abs(delta) / foreverDps * 100;

  const tier = fixture.schemaVersion < 2 ? 'Unverified legacy inputs' :
    (deltaPct <= 0.5 ? '🟢 Tier A' : (deltaPct <= 1.5 ? '🟡 Tier B' : '🔴 Tier C'));
  const fillerStr = preset.id === 'demo_fire_brand'
    ? `Searing: ${state.casts5} | SF: ${state.casts7} | Immo: ${state.casts3} | Corr: ${state.casts1}`
    : (preset.id === 'destro'
      ? `Incin: ${state.casts4} | Immo: ${state.casts3} | Conflag: ${state.casts8} | CB: ${state.casts9}`
      : `SB: ${state.casts0} | Corr: ${state.casts1} | Agony: ${state.casts2} | Immo: ${state.casts3}`);

  lines.push(`| \`${preset.id}\` | ${preset.label} | ${mean10kDps.toFixed(1)} | ${foreverDps.toFixed(1)} | ${delta > 0 ? '+' : ''}${delta.toFixed(1)} | ${deltaPct.toFixed(2)}% | ${tier} | ${fillerStr} |`);

  details.push({
    preset: preset.id,
    label: preset.label,
    gpuDps: mean10kDps,
    singleSeedDps: state.total / 180,
    foreverDps,
    delta,
    deltaPct,
    state,
    config
  });
}

lines.push('');
lines.push('## Detailed Preset Diagnostics');
lines.push('');

for (const d of details) {
  lines.push(`### \`${d.preset}\`: ${d.label}`);
  lines.push(`- **WebGL2 Total Damage**: ${d.state.total.toFixed(1)} (${d.gpuDps.toFixed(2)} DPS)`);
  lines.push(`- **Forever Canonical DPS**: ${d.foreverDps.toFixed(2)} DPS`);
  lines.push(`- **Variance**: ${d.delta > 0 ? '+' : ''}${d.delta.toFixed(2)} DPS (${d.deltaPct.toFixed(2)}%)`);
  lines.push(`- **Mana Accounting**: Spent ${d.state.spent.toFixed(0)} | Gained ${d.state.gained.toFixed(0)} | Life Taps: ${d.state.taps}`);
  const petMeleeOnly = (d.state.petMeleeDamage || 0).toFixed(1);
  const isImp = d.config.petChoice === 'imp' || d.config.petChoice === 1;
  const impOnly = isImp ? (d.state.petSpellDamage || 0).toFixed(1) : '0.0';
  const petLashOnly = !isImp ? (d.state.petSpellDamage || 0).toFixed(1) : '0.0';
  const brandOnly = (d.state.petBrandDamage || 0).toFixed(1);
  lines.push(`- **Pet Damage**: Total ${(d.state.petDamage || 0).toFixed(1)} | Imp Firebolt: ${impOnly} | Succubus Lash: ${petLashOnly} | Brand: ${brandOnly} | Melee: ${petMeleeOnly}`);
  lines.push(`- **Spell Cast Counts**:`);
  lines.push(`  - Shadow Bolt: ${d.state.casts0} casts (${d.state.hits0} hits, ${d.state.crits0} crits, ${d.state.damage0.toFixed(0)} dmg)`);
  lines.push(`  - Corruption: ${d.state.casts1} casts (${d.state.hits1} hits, ${d.state.crits1} crits, ${d.state.damage1.toFixed(0)} dmg)`);
  lines.push(`  - Bane of Agony: ${d.state.casts2} casts (${d.state.hits2} hits, ${d.state.crits2} crits, ${d.state.damage2.toFixed(0)} dmg)`);
  lines.push(`  - Immolate: ${d.state.casts3} casts (${d.state.hits3} hits, ${d.state.crits3} crits, ${d.state.damage3.toFixed(0)} dmg)`);
  lines.push(`  - Incinerate: ${d.state.casts4} casts (${d.state.hits4} hits, ${d.state.crits4} crits, ${d.state.damage4.toFixed(0)} dmg)`);
  lines.push(`  - Searing Pain: ${d.state.casts5} casts (${d.state.hits5} hits, ${d.state.crits5} crits, ${d.state.damage5.toFixed(0)} dmg)`);
  lines.push(`  - Bane of Doom: ${d.state.casts6} casts (${d.state.hits6} hits, ${d.state.crits6} crits, ${d.state.damage6.toFixed(0)} dmg)`);
  lines.push(`  - Soul Fire: ${d.state.casts7} casts (${d.state.hits7} hits, ${d.state.crits7} crits, ${d.state.damage7.toFixed(0)} dmg)`);
  lines.push(`  - Conflagrate: ${d.state.casts8} casts (${d.state.hits8} hits, ${d.state.crits8} crits, ${d.state.damage8.toFixed(0)} dmg)`);
  lines.push(`  - Shadowburn: ${d.state.casts9} casts (${d.state.hits9} hits, ${d.state.crits9} crits, ${d.state.damage9.toFixed(0)} dmg)`);
  lines.push('');
}

const reportPath = path.resolve(ROOT_DIR, 'PARITY_REPORT_FOREVER.md');
fs.writeFileSync(reportPath, lines.join('\n'));
console.log(`Report successfully written to ${reportPath}`);
