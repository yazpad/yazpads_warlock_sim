# Shadowburn damage per cast

Subsequent [Doom audit](FOREVER_DOOM_FINDINGS_2026-10-20.md): ordinary Doom damage matches source after accounting for crit outcomes. A custom Wrack/Doom overlap bonus was corrected; standard-matrix MAE remains 1.177 DPS.

Production now uses Forever's generated rank-6 Shadowburn mean and direct variance. The higher-sample spell discrepancy is nearly eliminated, while the standard 1,000-fight full-matrix MAE rises slightly. Both outcomes are retained rather than selecting only the favorable score.

## Source-backed cause

The old GPU formula was:

```text
266 + U × 29.05 + 0.429 × spellPower
```

Its base mean is **280.525**, rather than the source row's **273.20001220703125**. It also varies only the base damage, so its damage spread does not grow with spell power.

Forever rank 6, spell **18871**, declares average **273.20001220703125**, coefficient **0.42899999022483826**, and direct variance **0.10924369841814041**. In `core/spell_result.go:CalcDamage`, spell power is added before the entire amount receives one centered variance roll. The corrected pre-modifier formula is:

```text
(273.20001220703125 + 0.42899999022483826 × spellPower)
  × (1 + (U − 0.5) × 0.10924369841814041)
```

The old mean was high by **7.3249878 base damage per landed noncritical cast**, before damage and crit multipliers. That explains the roughly 11–13 excess damage per cast observed in the previous higher-sample Destruction runs. The coefficient's decimal representation is preserved from source; the meaningful mean error was the base value, not a newly fitted spell-power coefficient.

Cooldown, mana cost, crit logic and talent multipliers are unchanged. All player/pet/utility action counts, hit counts, crit counts and periodic tick counts remain identical across the before/after 300-case run. Other presets' totals are unchanged; this matrix uses Shadowburn in Destruction.

Source revision: `86d0920cae8445eaa90de9c17c3583cf171c19c5`. The read-only Go audit captures the generated row and computed average/variance in [FOREVER_SHADOWBURN_INVESTIGATION.json](../FOREVER_SHADOWBURN_INVESTIGATION.json), together with relevant source hashes. No source engine was modified.

## Mean versus variance ablations

Four matched Troll Destruction profiles, 10,000 fights per engine, seed 101, unchanged source requests/results:

| Variant | Total rotation MAE | Shadowburn mean signed difference |
| --- | ---: | ---: |
| Before | 0.836 DPS | +0.681 DPS |
| Correct base mean only | 0.464 DPS | +0.017 DPS |
| Correct variance scope only | 0.836 DPS | +0.681 DPS |
| Both corrections | **0.465 DPS** | **+0.017 DPS** |

The base mean explains nearly all the average excess. Correct variance matters for the distribution rather than its expected damage. The source row and formula determine both corrections; neither is tuned to minimize a sampled total score.

## Matched higher-sample results

The four source and GPU cases were run at 10,000 fights per engine, with unchanged requests:

| Profile | Before Shadowburn difference | After Shadowburn difference | After total difference |
| --- | ---: | ---: | ---: |
| Baseline | +0.710 DPS | +0.050 DPS | +0.502 DPS |
| Spell power 1000 | +0.731 DPS | +0.072 DPS | +0.771 DPS |
| Intellect 400 | +0.669 DPS | -0.006 DPS | -0.354 DPS |
| High regeneration | +0.614 DPS | -0.049 DPS | -0.232 DPS |

Each engine still casts ten Shadowburns in every case. [Before report](../FOREVER_TROLL_HIGH_SAMPLE_AFTER.json), [after report](../FOREVER_SHADOWBURN_HIGH_SAMPLE_AFTER.json).

## Balanced five-race higher-sample check

To investigate the standard-matrix regression, the same four profiles were measured across all five races: **20 cases × 10,000 fights per engine**. The archived old GPU shader was rerun against exactly the corrected run's source requests/results.

- Total rotation MAE improves **0.788 → 0.442 DPS**.
- Mean total bias improves **+0.655 → -0.014 DPS**.
- Mean Shadowburn bias improves **+0.635 → -0.033 DPS**.

This balanced result supports the correction beyond the initial Troll-only selection. It does not replace or establish the result for all 300 cases at higher samples. [Balanced report](../FOREVER_SHADOWBURN_RACE_HIGH_SAMPLE_AFTER.json), [matched old/new comparison](../FOREVER_SHADOWBURN_RACE_COMPARISON.json).

## Full matrix, including the regression

At 300 cases × 1,000 fights per engine, production **MAE changes 1.122 → 1.177 DPS**, and **MAPE changes 0.168% → 0.176%**. Destruction's 60-case MAE changes **0.807 → 1.080 DPS**. All 300 cases complete with zero checked input differences.

The source-correct damage reduction moves many sampled Destruction totals farther below the source, despite removing Shadowburn's known inflated mean. This is a reason to inspect remaining component errors and sampling uncertainty, not retain an incorrect formula to compensate. Equal seeds do not pair the engines' random streams, and race/stat cells reuse seeds so their sampling errors are correlated. A balanced five-race higher-sample follow-up is recorded separately rather than substituting its score for the standard matrix.

[Full current matrix](../FOREVER_SWEEP.json), [matched comparison and hashes](../FOREVER_SHADOWBURN_FIX_COMPARISON.json), archived pre-fix report `fixtures/benchmark_history/race-stat-300-before-shadowburn-fix.json.gz`.

## Validation and remaining work

The statistical GPU regression checks 8,192 fights per profile at zero, 250, 500 and 1,000 spell power, plus combined damage modifiers, in both shader modes. It checks one landed noncritical cast, source-derived mean, uniform variance and bounds, scaling over the entire hit, and exact fast/detailed damage equality. Existing talent and Eureka tests are included. Compatibility IDs and the service-worker cache were refreshed.

**Checks:** 8/8 focused tests pass. The full suite has **178 passes and the same 16 existing failures** as the Troll-stage baseline, with no new failing test names. The compatibility hash check and `git diff --check` pass.

Remaining total differences must be examined independently of Shadowburn's now-correct base damage. Doom was another persistent component in the higher-sample follow-up. Full projectile damage snapshots, movement and geared configurations remain separate open work.

## Reproduction

```sh
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path node scripts/investigate_forever_shadowburn.mjs
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path node scripts/sweep_forever_parity.mjs --checkout /tmp/forever-run-source --go /tmp/go/bin/go --matrix fixtures/forever_shadowburn_followup_matrix.json --iterations 10000 --out FOREVER_SHADOWBURN_RACE_HIGH_SAMPLE_AFTER
node scripts/compare_shadowburn_race_followup.mjs
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path node scripts/sweep_forever_parity.mjs --checkout /tmp/forever-run-source --go /tmp/go/bin/go --iterations 1000
```

The historical ablations use the archived pre-fix shader and do not overwrite production code.
