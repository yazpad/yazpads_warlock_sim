// Repeatable gear-free diagnostic sweep. See docs/FOREVER_SWEEP.md.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { parseArgs, isDeepStrictEqual } from 'node:util';
import { fileURLToPath } from 'node:url';
import { FRAGMENT, VERTEX } from '../threejs_webgl_des/src/kernel.js';
import { CONFIG, packConfig, COMPACT_STRIPES, validate } from '../threejs_webgl_des/src/model.js';
import { WARLOCK_VERSION_SOURCE_HASHES } from '../threejs_webgl_des/src/classes/warlock_versions.js';
import { migrateLegacyBuild } from '../threejs_webgl_des/src/contracts/legacy_build.js';
import { resolveWarlockImport } from '../threejs_webgl_des/src/classes/warlock_import.js';
import { decodeDetailedBatch, aggregateOurs, normalizeForever, compareBreakdowns } from './forever_breakdown.mjs';
const root = path.resolve(import.meta.dirname, '..');
const presets = ['sm_ruin', 'aff_wrack', 'destro', 'demo_shadow_brand', 'demo_fire_brand'];
const races = { HUMAN: 'RaceHuman', ORC: 'RaceOrc', UNDEAD: 'RaceUndead', TROLL: 'RaceTroll', GNOME: 'RaceGnome' };
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));

export function expandSweep(matrix, baseline) {
  for (const [key, supported] of [['presets', presets], ['races', Object.keys(races)]]) {
    if (!Array.isArray(matrix[key]) || !matrix[key].length || new Set(matrix[key]).size !== matrix[key].length || matrix[key].some(v => !supported.includes(v))) throw new Error(`Invalid or duplicate sweep ${key}`);
  }
  if (!Array.isArray(matrix.profiles) || !matrix.profiles.length) throw new Error('Sweep needs stat profiles');
  const ids = new Set();
  const profiles = matrix.profiles.map(profile => {
    if (!/^[a-z0-9_]+$/.test(profile.id) || ids.has(profile.id)) throw new Error('Invalid or duplicate stat profile ID');
    ids.add(profile.id);
    if (!profile.stats || typeof profile.stats !== 'object' || Array.isArray(profile.stats)) throw new Error('Profile stats must be an object');
    for (const key of Object.keys(profile.stats)) if (!Object.hasOwn(baseline.bonusStats, key)) throw new Error(`Unsupported sweep stat: ${key}`);
    const stats = { ...baseline.bonusStats, ...profile.stats };
    validate(stats);
    return { ...profile, stats };
  });
  return matrix.presets.flatMap(preset => matrix.races.flatMap(race => profiles.map(profile => ({
    id: `${preset}__${race.toLowerCase()}__${profile.id}`, preset, race, profile: profile.id,
    scenario: { ...baseline, scenarioId: `gear-free-sweep-v1/${profile.id}`, bonusStats: profile.stats },
  }))));
}

export function summarizeSamples(samples) {
  if (samples.length < 2 || samples.some(v => !Number.isFinite(v) || v <= 0)) throw new Error('Invalid DPS samples');
  let mean = 0, m2 = 0;
  samples.forEach((x, i) => { const delta = x - mean; mean += delta / (i + 1); m2 += delta * (x - mean); });
  const sd = Math.sqrt(m2 / (samples.length - 1));
  return { mean, sd, n: samples.length, ci95HalfWidth: 1.96 * sd / Math.sqrt(samples.length) };
}

function sourceHashes(checkout) {
  const files = ['go.mod', 'go.sum', 'assets/database/db.bin'];
  function walk(dir) {
    for (const entry of fs.readdirSync(path.join(checkout, dir), { withFileTypes: true })) {
      const file = `${dir}/${entry.name}`;
      if (entry.isDirectory()) walk(file);
      else if (file.endsWith('.go') && !file.endsWith('_test.go')) files.push(file);
    }
  }
  walk('sim');
  for (const preset of presets) files.push(`ui/specs/warlock/dps/builds/${preset}.build.json`);
  return Object.fromEntries(files.sort().map(f => [f, sha(fs.readFileSync(path.join(checkout, f)))]));
}

export function renderSweep(report) {
  const good = report.rows.filter(r => r.status === 'complete');
  const lines = ['# Forever race/stat diagnostic sweep', '',
    `${report.status}: ${good.length}/${report.caseCount} combinations completed; ${report.iterations} fights per engine per combination, seed ${report.seed}.`, '',
    report.matrix.description || '', '',
    '**Diagnostic only.** Source APLs are retained for every race, including race-specific action IDs. Unsupported imports are recorded, not treated as accepted parity. Gear and consumables are absent.', '',
    'Intervals are approximate 95% Monte Carlo intervals for independent-engine mean differences. At 100 trials they are noisy, and intervals are not adjusted for multiple comparisons. Equal seeds do not pair RNG streams. Small total differences can hide offsetting spell errors.', '',
    '| Preset | Cases | Mean absolute delta % | Worst absolute delta % |', '| --- | ---: | ---: | ---: |'];
  for (const preset of report.matrix.presets) {
    const rows = good.filter(r => r.preset === preset);
    if (rows.length) lines.push(`| ${preset} | ${rows.length} | ${(rows.reduce((a,r) => a + Math.abs(r.deltaPct), 0) / rows.length).toFixed(2)} | ${Math.max(...rows.map(r => Math.abs(r.deltaPct))).toFixed(2)} |`);
  }
  lines.push('', '## Largest observed total differences', '', '| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% |', '| --- | --- | --- | ---: | ---: | ---: | ---: |');
  for (const r of [...good].sort((a,b) => Math.abs(b.deltaPct) - Math.abs(a.deltaPct)).slice(0, 20)) lines.push(`| ${r.preset} | ${r.race} | ${r.profile} | ${r.forever.mean.toFixed(2)} | ${r.ours.mean.toFixed(2)} | ${r.deltaPct.toFixed(2)} | ${r.delta.toFixed(2)} ± ${r.deltaCi95HalfWidth.toFixed(2)} |`);
  lines.push('', '## All combinations', '', '| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% | Stat differences | Group omissions |', '| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |');
  for (const r of report.rows) {
    if (r.status !== 'complete') lines.push(`| ${r.preset} | ${r.race} | ${r.profile} | FAILED: ${r.error.replaceAll('|', '/').replaceAll('\n',' ')} | | | | | |`);
    else lines.push(`| ${r.preset} | ${r.race} | ${r.profile} | ${r.forever.mean.toFixed(2)} | ${r.ours.mean.toFixed(2)} | ${r.deltaPct.toFixed(2)} | ${r.delta.toFixed(2)} ± ${r.deltaCi95HalfWidth.toFixed(2)} | ${r.inputDifferences.length} | ${r.importDiagnostics.length} |`);
  }
  lines.push('', 'The JSON companion includes exact requests, resolved app configs, source/app hashes, input differences, import diagnostics, and spell/pet breakdowns. Existing five-preset benchmark artifacts are unchanged.', '');
  return lines.join('\n');
}

export async function main(args = process.argv.slice(2)) {
  const { values: options } = parseArgs({ args, options: {
    checkout: { type: 'string', default: '../forever' }, go: { type: 'string', default: 'go' },
    iterations: { type: 'string', default: '100' }, seed: { type: 'string', default: '101' },
    matrix: { type: 'string', default: path.join(root, 'fixtures/forever_sweep_matrix.json') },
    out: { type: 'string', default: path.join(root, 'FOREVER_SWEEP') }, 'dry-run': { type: 'boolean', default: false },
  } });
  const iterations = Number(options.iterations), seed = Number(options.seed);
  if (!Number.isInteger(iterations) || iterations < 2 || iterations > 1000000) throw new Error('iterations must be 2–1000000');
  if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295) throw new Error('seed must be uint32');
  const baseline = read(path.join(root, 'fixtures/forever_gear_free_scenario.json'));
  const matrix = read(path.resolve(options.matrix)), cells = expandSweep(matrix, baseline);
  if (options['dry-run']) { console.log(JSON.stringify({ cases: cells.length, iterationsPerEngine: iterations, fightsPerEngine: cells.length * iterations, cells }, null, 2)); return; }
  const checkout = path.resolve(options.checkout), output = path.resolve(options.out);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'forever-sweep-'));
  const localFiles = [...Object.keys(WARLOCK_VERSION_SOURCE_HASHES).map(f => `threejs_webgl_des/${f}`),
    'scripts/sweep_forever_parity.mjs', 'scripts/forever_export/main.go', 'scripts/forever_breakdown.mjs',
    'fixtures/forever_gear_free_scenario.json', 'threejs_webgl_des/validation/headless_gles.py'];
  const report = { schemaVersion: 1, status: 'running', startedAt: new Date().toISOString(), acceptance: 'diagnostic-only',
    iterations, seed, caseCount: cells.length, matrix, baseline,
    source: { checkout, revision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: checkout, encoding: 'utf8' }).trim(), hashes: sourceHashes(checkout) },
    localHashes: Object.fromEntries(localFiles.map(f => [f, sha(fs.readFileSync(path.join(root, f)))])), rows: [] };
  const save = () => {
    fs.writeFileSync(`${output}.json`, JSON.stringify(report, null, 2) + '\n');
    fs.writeFileSync(`${output}.md`, renderSweep(report));
  };
  try {
    const binary = path.join(temp, 'exporter');
    execFileSync(options.go, ['build', '-tags=with_db', '-o', binary, path.join(root, 'scripts/forever_export/main.go')], { cwd: checkout, stdio: ['ignore', 'ignore', 'inherit'] });
    report.exporterHash = sha(fs.readFileSync(binary));
    save();
    for (const preset of matrix.presets) {
      const pending = [], gpuCases = [];
      for (const cell of cells.filter(c => c.preset === preset)) {
        const row = { id: cell.id, preset, race: cell.race, profile: cell.profile, bonusStats: cell.scenario.bonusStats, status: 'failed' };
        try {
          const scenarioPath = path.join(temp, `${cell.id}.json`);
          fs.writeFileSync(scenarioPath, JSON.stringify(cell.scenario));
          const source = JSON.parse(execFileSync(binary, [preset, races[cell.race], String(iterations), String(seed), scenarioPath], { cwd: checkout, maxBuffer: 64 * 1024 * 1024 }));
          if (source.result.error) throw new Error(JSON.stringify(source.result.error));
          const request = source.request, party = request.raid.parties[0], player = party.players[0];
          if (player.race !== races[cell.race] || !isDeepStrictEqual(source.declaredBonusStats, cell.scenario.bonusStats)) throw new Error('Source race/stat request mismatch');
          if (request.encounter.duration !== 180 || player.equipment?.items?.some(x => x.id) || player.consumables) throw new Error('Unexpected gear-free scenario input');
          const imported = resolveWarlockImport(migrateLegacyBuild({ player, partyBuffs: party.buffs, raidBuffs: request.raid.buffs, debuffs: request.raid.debuffs, encounter: request.encounter }, { candidateId: cell.id }));
          const config = { ...imported.config, iterations, seed };
          const n = source.result.raidMetrics.dps.aggregatorData.n;
          if (Number(n) !== iterations || request.simOptions.iterations !== iterations || request.simOptions.randomSeed !== String(seed)) throw new Error('Source sample count/seed mismatch');
          const dist = source.result.raidMetrics.dps;
          const forever = { mean: dist.avg, sd: dist.stdev * Math.sqrt(iterations / (iterations - 1)), n: iterations };
          forever.ci95HalfWidth = 1.96 * forever.sd / Math.sqrt(iterations);
          if (!Number.isFinite(forever.mean) || forever.mean <= 0 || !Number.isFinite(forever.sd)) throw new Error('Invalid source DPS');
          const packed = new Float32Array(packConfig(config).buffer);
          const packedField = name => packed[Object.keys(CONFIG).indexOf(name)];
          const mappings = { intellect: 'Intellect', stamina: 'Stamina', spirit: 'Spirit', spellPower: 'SpellDamage', shadowPower: 'ShadowDamage', firePower: 'FireDamage', hit: 'SpellHitPercent', mp5: 'MP5', penetration: 'SpellPiercing' };
          const inputs = Object.entries(mappings).map(([field, stat]) => ({ field, ours: config[field], forever: source.initialPlayerStats[stat] }));
          inputs.push({ field: 'crit', ours: packedField('crit') * 100, forever: source.initialPlayerStats.SpellCritPercent },
            { field: 'maxMana', ours: packedField('maxMana'), forever: source.initialPlayerStats.Mana },
            { field: 'maxHealth', ours: packedField('maxHealth'), forever: source.initialPlayerStats.Health });
          Object.assign(row, { config, request, requestHash: sha(JSON.stringify(request)), forever,
            importDiagnostics: imported.candidate.importDiagnostics || [], initialPlayerStats: source.initialPlayerStats,
            inputDifferences: inputs.filter(x => !Number.isFinite(x.ours) || !Number.isFinite(x.forever) || Math.abs(x.ours - x.forever) > Math.max(1e-4, Math.abs(x.forever) * 1e-6)),
            sourceBreakdown: normalizeForever(source.result, iterations, config.duration) });
          const width = Math.min(iterations, 100);
          pending.push({ row, width });
          gpuCases.push({ mode: 'detailed', width, height: Math.ceil(iterations / width) * COMPACT_STRIPES, configWords: Array.from(packConfig(config)),
            uniforms: { numConfigs: 1, fightsPerConfig: iterations, seed, offset: 0, count: iterations, gridWidth: width, mode: 0, eventBudget: 65536 } });
        } catch (error) { row.error = error.message; report.rows.push(row); }
      }
      if (pending.length) {
        // One EGL process per preset reuses the compiled shader across all race/profile cases.
        const manifest = path.join(temp, `${preset}-gpu.json`);
        fs.writeFileSync(manifest, JSON.stringify({ vertex: '#version 300 es\n' + VERTEX, detailed: '#version 300 es\n' + FRAGMENT, cases: gpuCases }));
        const gpu = JSON.parse(execFileSync('python3', [path.join(root, 'threejs_webgl_des/validation/headless_gles.py'), manifest], { encoding: 'utf8', maxBuffer: 512 * 1024 * 1024, timeout: 600000 }));
        if (gpu.outputs.length !== pending.length) throw new Error('Missing GPU case results');
        pending.forEach(({ row, width }, i) => {
          try {
            const states = decodeDetailedBatch(gpu.outputs[i], width, iterations);
            row.ours = summarizeSamples(states.map(s => s.total / row.config.duration));
            row.delta = row.ours.mean - row.forever.mean;
            row.deltaPct = row.delta / row.forever.mean * 100;
            row.deltaCi95HalfWidth = 1.96 * Math.sqrt((row.ours.sd ** 2 + row.forever.sd ** 2) / iterations);
            const ours = aggregateOurs(states, row.config);
            row.breakdown = { ours, forever: row.sourceBreakdown, comparison: compareBreakdowns(ours, row.sourceBreakdown) };
            row.renderer = gpu.renderer;
            row.status = 'complete';
          } catch (error) { row.error = error.message; }
          delete row.sourceBreakdown;
          report.rows.push(row);
        });
      }
      save();
      const good = report.rows.filter(r => r.preset === preset && r.status === 'complete');
      console.log(`${preset}: ${good.length}/${cells.filter(c => c.preset === preset).length} complete; worst absolute delta ${good.length ? Math.max(...good.map(r => Math.abs(r.deltaPct))).toFixed(2) : 'N/A'}%`);
    }
    report.status = report.rows.some(r => r.status !== 'complete') ? 'completed-with-errors' : 'complete';
    report.finishedAt = new Date().toISOString(); save();
    if (report.status !== 'complete') process.exitCode = 1;
    console.log(`Saved ${output}.md and ${output}.json`);
  } catch (error) {
    report.status = 'failed'; report.error = error.message; report.finishedAt = new Date().toISOString(); save(); throw error;
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
