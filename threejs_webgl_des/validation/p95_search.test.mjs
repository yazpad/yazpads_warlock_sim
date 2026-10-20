import test from 'node:test';
import assert from 'node:assert/strict';
import { createNativeEvaluator } from '../src/contracts/native_evaluation.js';
import { getClassModule } from '../src/classes/registry.js';
import { createBuildOptimizer } from '../src/search/genetic_optimizer.js';
import { createAPLOptimizer } from '../src/search/apl_genetic_optimizer.js';
import { WARLOCK_SEARCH_DEPENDENCIES } from '../src/classes/warlock_search_dependencies.js';
import { getTalentFlagsFromRanks } from '../src/talents.js';

for (const kind of ['build', 'apl']) {
  test(`${kind} search uses the selected objective in all generations and final ranking`, async () => {
    for (const objective of ['mean-dps', 'p95-dps']) {
      let calls = 0;
      const simulation = { runMultiSimulation: async (configs, options) => {
        calls++;
        return { results: configs.map((config, i) => ({ config,
          summary: { mean: 100 + i, p95: 300 - i, sd: 2 },
          states: Array.from({ length: options.iterations }, () => ({ done: 1, total: 100 })),
        })) };
      }};
      const classModule = getClassModule();
      const factory = kind === 'build' ? createBuildOptimizer : createAPLOptimizer;
      const optimizer = factory({ classModule, simulation, dependencies: WARLOCK_SEARCH_DEPENDENCIES });
      const search = kind === 'build' ? optimizer.runConstrainedGeneticSearch : optimizer.runAPLGeneticSynthesis;
      let generations = 0;
      const check = candidate => {
        const summary = candidate.summary;
        assert.equal(candidate.objective, objective);
        assert.equal(candidate.score, objective === 'p95-dps' ? summary.p95 : summary.mean);
        assert.equal(candidate.mean_dps ?? candidate.meanDps, summary.mean);
      };
      const result = await search({ intellect: 200, spirit: 100, talentFlags: getTalentFlagsFromRanks({}) },
        { objective, populationSize: 8, generations: 2, screeningSims: 2, finalSims: 3,
          seed: 42, seedPresets: true, selectedActionIds: ['bolt', 'tap'] },
        { onGeneration: state => { generations++; state.elites.forEach(check); } });
      assert.equal(calls, 4);
      assert.equal(generations, 3);
      assert.ok(result.candidates.length > 1);
      result.candidates.forEach(check);
      for (let i = 1; i < result.candidates.length; i++) {
        assert.ok(result.candidates[i - 1].score >= result.candidates[i].score);
      }
      assert.equal(result.bestCandidate.score, objective === 'p95-dps' ? 300 : 100 + result.candidates.length - 1);
    }
  });
}

test('P95 evaluation rejects missing/nonfinite percentiles and does not report mean standard error as P95 uncertainty', async () => {
  for (const p95 of [undefined, NaN, Infinity, 150]) {
    const evaluate = createNativeEvaluator({ classId: 'warlock', runBatch: async () => ({ results: [{
      summary: { mean: 100, p95, sd: 2 }, states: [{ done: 1, total: 100 }],
    }] }) });
    const run = () => evaluate([{ iterations: 1 }], {}, { requestId: 'p95', candidateIds: ['a'], objective: 'p95-dps' });
    if (p95 === 150) {
      const result = await run();
      assert.equal(result.fitnessResults[0].objective.value, 150);
      assert.equal(result.fitnessResults[0].uncertainty, null);
    } else await assert.rejects(run, /Incomplete/);
  }
});
