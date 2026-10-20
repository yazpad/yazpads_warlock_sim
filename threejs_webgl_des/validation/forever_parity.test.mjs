import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';

import { FRAGMENT, FAST_FRAGMENT, VERTEX } from '../src/kernel.js';
import { packConfig, STATE_WORDS, decodeStates } from '../src/model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES_DIR = path.resolve(__dirname, '../../fixtures/canonical_forever');

const PRESETS = [
  { id: 'destro', label: 'Destruction (destro)', foreverKey: 'TestDestruction-Settings-Gnome-preraid-Destruction-destro-FullBuffs-0.0yards-LongSingleTarget' },
  { id: 'sm_ruin', label: 'Affliction SM/Ruin', foreverKey: 'TestAffliction-Settings-Human-preraid-Affliction-sm_ruin-FullBuffs-0.0yards-LongSingleTarget' },
  { id: 'aff_wrack', label: 'Affliction Wrack', foreverKey: 'TestAfflictionWrack-Settings-Orc-preraid-Wrack-aff_wrack-FullBuffs-0.0yards-LongSingleTarget' },
  { id: 'demo_shadow_brand', label: 'Demonology Shadow Brand', foreverKey: 'TestDemonologyShadowBrand-Settings-Human-preraid-Shadow Brand-demo_shadow_brand-FullBuffs-0.0yards-LongSingleTarget' },
  { id: 'demo_fire_brand', label: 'Demonology Fire Brand', foreverKey: 'TestDemonologyFireBrand-Settings-Human-preraid-Fire Brand-demo_fire_brand-FullBuffs-0.0yards-LongSingleTarget' }
];

function runHeadlessSimulation(config) {
  const cases = [{
    mode: 'detailed',
    width: 1,
    height: Math.ceil(STATE_WORDS / 16),
    configWords: Array.from(packConfig(config)),
    uniforms: { numConfigs: 1, fightsPerConfig: 1, seed: config.seed || 101, offset: 0, count: 1, gridWidth: 1, mode: 1, eventBudget: 65536 }
  }];

  const tmpPath = path.join(tmpdir(), `forever_test_${config.candidateId || 'sim'}_${Date.now()}.json`);
  fs.writeFileSync(tmpPath, JSON.stringify({ vertex: '#version 300 es\n' + VERTEX, detailed: '#version 300 es\n' + FRAGMENT, cases }));

  try {
    const out = execFileSync('python3', [path.join(__dirname, 'headless_gles.py'), tmpPath], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
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

test('Headless GPU DES runs against all ingested canonical Forever fixtures', (t) => {
  for (const preset of PRESETS) {
    const fixturePath = path.join(FIXTURES_DIR, `${preset.id}.fixture.json`);
    assert.ok(fs.existsSync(fixturePath), `Fixture must exist for ${preset.id}`);

    const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
    if (fixture.schemaVersion >= 2) {
      assert.equal(fixture.inputComparison?.status, 'matched',
        `Input parity must be resolved before scoring ${preset.id}; see FOREVER_INPUT_COMPARISON_${preset.id}.md`);
    }
    assert.equal(fixture.classId, 'warlock');
    assert.ok(fixture.resolvedConfig);
    assert.ok(fixture.foreverResults);

    const config = {
      ...fixture.resolvedConfig,
      duration: 180,
      iterations: 1,
      seed: 101
    };

    const state = runHeadlessSimulation(config);
    assert.equal(state.done, 1, `Simulation for ${preset.id} must complete successfully`);
    assert.ok(state.total > 0, `Total damage for ${preset.id} must be positive`);

    const dps = state.total / 180;
    const foreverTarget = fixture.schemaVersion >= 2 ? { dps: fixture.result.raidMetrics.dps.avg } : fixture.foreverResults[preset.foreverKey];
    assert.ok(foreverTarget, `Forever baseline key ${preset.foreverKey} must be present in fixture`);

    const foreverDps = foreverTarget.dps;
    const dpsDeltaPct = Math.abs(dps - foreverDps) / foreverDps * 100;

    // Differential Tier Scoring
    // Tier A: <= 0.5%
    // Tier B: <= 1.5%
    // Tier C: > 1.5% (Divergence / Failure)
    const tier = dpsDeltaPct <= 0.5 ? 'Tier A (Strict Match)' : (dpsDeltaPct <= 1.5 ? 'Tier B (Statistical Parity)' : 'Tier C (Divergence)');
    t.diagnostic(`[${preset.id}] GPU DES: ${dps.toFixed(1)} DPS | Forever: ${foreverDps.toFixed(1)} DPS | Delta: ${dpsDeltaPct.toFixed(2)}% | Score: ${tier}`);
  }
});
