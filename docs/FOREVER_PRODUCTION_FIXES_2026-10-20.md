# Production Forever fixes — 2026-10-20

The traced corrections are applied to the Three.js/WebGL simulator in both detailed and fast modes. This supersedes the earlier diagnostic-only implementation status in the cause investigation.

## Measured result

**Full matrix: MAE 1.945 DPS, MAPE 0.289%.** All 300 combinations completed, at 1,000 fights per engine per configuration (300,000 fights per engine), seed 101. The 13 player/packed-stat fields checked by the sweep agree in all 300 cases. This does not establish exhaustive pet/encounter/combat parity.

The earlier full screen used 100 fights per case, so its 4.642 DPS / 0.702% error is not a sample-matched before/after comparison. The earlier 60-case follow-up and the same 60 cells from the new full matrix both use 1,000 fights:

| Same 60 cases | MAE | MAPE |
| --- | ---: | ---: |
| Before | 3.554 DPS | 0.549% |
| After | 1.792 DPS | 0.266% |

That is a **49.59% reduction in matched-case MAE**. Cases have equal weight; MAPE is the mean absolute case percentage difference. These are diagnostic engine-mean comparisons, with independent RNG streams and remaining Monte Carlo uncertainty.

| Preset | New MAE | New MAPE | Worst absolute difference |
| --- | ---: | ---: | ---: |
| sm_ruin | 1.672 DPS | 0.260% | 0.780% |
| aff_wrack | 0.946 DPS | 0.175% | 0.573% |
| destro | 2.082 DPS | 0.323% | 1.355% |
| demo_shadow_brand | 2.298 DPS | 0.319% | 1.006% |
| demo_fire_brand | 2.725 DPS | 0.367% | 1.001% |

## Applied changes

- Incinerate and Conflagrate use source base costs (325 and 255 mana).
- Player MP5, spirit regeneration and pet MP5 accrue across event intervals, with mana caps/waste accounting. Mana spending restarts the five-second rule; paid Wrack/Hellfire channels suppress spirit regeneration through channel end. This replaces five-second resource lumps. Source's full 100ms credit/check/task schedule is not implemented as a separate heartbeat; resource/event edge cases remain subject to comparison.
- Every shared Shadow Bolt path consumes active Nightfall for an instant cast, including higher-priority ordinary rows.
- Soul Fire cooldowns use exact integer microseconds by Decimation rank.
- Pet mana capacity derives from source base mana and intellect conversions, with Fel Vitality. The Imp's first Firebolt is scheduled at 2s. Active-Imp Blood Pact contributes 54 stamina before primary-stat multipliers in normal imports and the app's current-build stat summary. Source `NoSummon` maps to no pet.
- Forever imports retain `autocastOtherCooldowns` for the automatic Gnome/Eureka path while preserving explicit racial APL precedence. Eureka cost/direct/channel eligibility follows the audited spell masks; ordinary DoTs, curses and Incinerate do not receive blanket bonuses.
- Periodic events run ahead of same-time actions; fight-time `>=` and supported ordinary-row `min` comparisons preserve inclusive/strict operators. This is not a claim of complete source event ordering or general APL AST support.
- Packing/simulation compatibility IDs and the service-worker cache version are updated.

## Previously selected outliers, now in production

| Case | New DPS difference |
| --- | ---: |
| destro__gnome__regen_high | -0.068% (-0.461 DPS) |
| aff_wrack__undead__regen_low | -0.104% (-0.561 DPS) |
| demo_fire_brand__orc__hit_16 | +0.205% (+1.595 DPS) |

The production implementation applies shared rules across configurations; its results need not exactly equal the earlier isolated probes.

## Validation and remaining work

The new regression file checks imported cooldown policy and Blood Pact, source pet capacity, actual GPU costs, shared versus explicit Nightfall execution, paid-channel regeneration, exact Soul Fire readiness, Doom tick/refresh/fight-end boundaries, and identical fast/detailed damage and resources for the focused cases. Existing Wrack timing expectations now include legitimate spirit regeneration during post-channel delay. The Eureka GPU test now verifies that ordinary DoTs are excluded.

Focused new/GPU/import/cache/hash checks pass. The full app suite reports **171 passed, 16 failed**. Those failing assertions reproduce against the pre-change HEAD: stale source/base-stat and import expectations, deferred gear paths, static shader hashes, Amplify/synthesis/pet-swap expectations and older race/version assertions. They are recorded as existing failures, not dismissed as a green suite. The isolated snapshot omits native CPU files, so its separate native-fixture-source check is not evidence of a production regression.

Next investigate per-spell differences in the new matrix rather than reusing the old outlier ranking. Pet runtime inheritance, complete APL Boolean semantics, source mana/cast/aura boundary details and full equal-time ordering remain open. Current corrections do not restore deferred gear/proc integration or establish combat acceptance.

## Artifacts and reproduction

- `FOREVER_SWEEP.md` / `.json`: fresh 300-case, 1,000-fight production results and exact hashes/configurations.
- `FOREVER_PRODUCTION_FIX_COMPARISON.json`: global/per-preset MAE/MAPE and sample-matched 60-case before/after comparison.
- `FOREVER_SWEEP_FOLLOWUP.*`: unchanged pre-fix 60-case reference.
- `fixtures/benchmark_history/race-stat-300-before-production-fixes.md` / `.json.gz`: immediately preceding full 100-fight screen.
- Earlier cause-probe outputs are historical, bound to their recorded pre-fix kernel hashes; their string-edit probes require that old kernel and should not be rerun as production tests.

```sh
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path node scripts/sweep_forever_parity.mjs --checkout /tmp/forever-run-source --go /tmp/go/bin/go --iterations 1000
node threejs_webgl_des/validation/forever_resource_fixes.test.mjs
```

A prepared source checkout with generated protobufs and database assets is required; temporary paths must be restored on a fresh environment.
