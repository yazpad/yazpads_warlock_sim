import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { expandSweep, summarizeSamples, renderSweep } from '../../scripts/sweep_forever_parity.mjs';
const read = file => JSON.parse(readFileSync(new URL(`../../fixtures/${file}`, import.meta.url)));

test('default sweep is 300 unique race/preset/profile combinations with isolated bonus stat overrides', () => {
  const baseline = read('forever_gear_free_scenario.json'), matrix = read('forever_sweep_matrix.json');
  const before = structuredClone({ baseline, matrix });
  const cells = expandSweep(matrix, baseline);
  assert.equal(cells.length, 300);
  assert.equal(new Set(cells.map(x => x.id)).size, 300);
  for (const cell of cells) {
    const profile = matrix.profiles.find(x => x.id === cell.profile);
    assert.deepEqual(cell.scenario.bonusStats, { ...baseline.bonusStats, ...profile.stats });
    assert.deepEqual(cell.scenario.externalDebuffs, baseline.externalDebuffs);
  }
  assert.deepEqual({ baseline, matrix }, before);
});

test('invalid or duplicated axes and misspelled/invalid stats fail before simulations', () => {
  const baseline = read('forever_gear_free_scenario.json'), matrix = read('forever_sweep_matrix.json');
  for (const change of [ { races: ['HUMAN','HUMAN'] }, { races: ['DWARF'] }, { presets: [] },
    { profiles: [{ id: 'x', stats: { spellpower: 100 } }] }, { profiles: [{ id: 'x', stats: { crit: -1 } }] },
    { profiles: [{ id: 'x', stats: {} }, { id: 'x', stats: {} }] } ]) {
    assert.throws(() => expandSweep({ ...matrix, ...change }, baseline));
  }
});

test('sample statistics use sample variance and report noisy or failed cells honestly', () => {
  const stats = summarizeSamples([100, 200, 300]);
  assert.equal(stats.mean, 200); assert.equal(stats.sd, 100); assert.equal(stats.n, 3);
  assert.ok(Math.abs(stats.ci95HalfWidth - 1.96 * 100 / Math.sqrt(3)) < 1e-10);
  assert.throws(() => summarizeSamples([100, NaN]));
  const report = renderSweep({ status: 'completed-with-errors', caseCount: 1, iterations: 100, seed: 101,
    matrix: { presets: ['sm_ruin'] }, rows: [{ preset: 'sm_ruin', race: 'HUMAN', profile: 'baseline', status: 'failed', error: 'import failed' }] });
  assert.match(report, /0\/1 combinations completed/);
  assert.match(report, /FAILED: import failed/);
  assert.match(report, /not adjusted for multiple comparisons/);
});
