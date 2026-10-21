# Shadow Brand spell allocation and hit timing

Subsequent follow-up: [Troll cooldown policy and millisecond cast clock](FOREVER_TROLL_FINDINGS_2026-10-20.md) is implemented. Current full-matrix MAE is **1.122 DPS / MAPE 0.168%**; the measurements below describe the Brand stage.

The main cause was **Demonic Brand activating on missed Searing Pain casts**. Our old shader granted a fresh set of charges on every completed Searing Pain. Forever only grants them after a landed hit. That let our rotation switch back to Shadow Bolt too soon, especially below hit cap.

Production now gates Brand and Decimation on landed hits. Searing Pain resolves immediately before the next action decision; Shadow Bolt's application hit is rolled at cast completion and retained through travel. Both instant Nightfall paths use the same hit/Decimation handling.

## Matched production comparison

Same 300 configurations, 1,000 fights per engine per configuration, seed 101, 180 seconds, unchanged source requests and revision. All selected input checks match. [Metrics and hashes](../FOREVER_BRAND_FIX_COMPARISON.json), [full current report](../FOREVER_SWEEP.json).

| Measurement | Before | After |
| --- | ---: | ---: |
| Overall MAE | 1.806 DPS | **1.366 DPS** |
| Overall mean absolute percentage error | 0.268% | **0.205%** |
| Shadow Brand preset MAE, 60 cases | 2.902 DPS | **1.179 DPS** |
| Fire Brand preset MAE, 60 cases | 1.875 DPS | **1.399 DPS** |
| Shadow Brand: Shadow Bolt mean signed difference | +3.774 DPS | **+0.937 DPS** |
| Shadow Brand: Searing Pain mean signed difference | -2.219 DPS | **+0.174 DPS** |
| Shadow Brand: Soul Fire mean signed difference | +0.070 DPS | **-0.748 DPS** |
| Shadow Brand: pet Brand mean signed difference | +0.494 DPS | **+0.137 DPS** |

Overall MAE improves 24.4%; Shadow Brand preset MAE improves 59.4%. These sampled differences do not imply every spell or configuration is exact. The old complete report and old kernel are archived under `fixtures/benchmark_history/*before-brand-fixes*` and `brand-before-kernel.js.gz`.

Before the correction, Human zero-bonus-hit Shadow Brand averaged **26.625 Shadow Bolts and 14.879 Searing Pains**, versus Forever's **25.470 and 17.255**. At hit cap, counts were already close: **28.181 / 15.000**, versus **28.204 / 14.999**. That hit dependence is consistent with the incorrectly refreshed Brand charges rather than a universal cast-time mismatch.

## Source-backed causes and timing

- `sim/warlock/talents_demonology.go:applyDemonicBrand` triggers on landed Searing Pain damage (`CallbackOnSpellHitDealt`, `OutcomeLanded`). Brand lasts ten seconds and grants two charges per talent rank. Its duration and charge count were already correct.
- `applyDecimation` also requires a landed result, but uses `CallbackOnCastResult`: Shadow Bolt and Searing Pain resolve hit at cast completion. During execute, a landed cast grants ten seconds of Decimation. Our old completion handler granted this even on misses, and instant Nightfall paths skipped that handler entirely.
- `sim/warlock/shadowbolt.go` calculates its result before `DealDamageAfterTravel`; Decimation can therefore be available while the bolt is still in flight. The GPU now carries known hit/miss and Eureka bits in the pending event, so the hit is neither rerolled nor changed by later hit-chance changes.
- `sim/warlock/searing_pain.go` calls `CalcDamage` and `DealDamage` synchronously. It does not use Shadow Bolt's projectile travel. The GPU now resolves Searing Pain and its Brand aura before selecting the next action.

The captured [source/GPU traces](../FOREVER_BRAND_TRACES.json) retain exact requests and hashes for Human baseline, zero-hit and hit-cap cases, plus Troll baseline. Source is unchanged at revision `86d0920cae8445eaa90de9c17c3583cf171c19c5`. The engines use independent random streams, so the traces establish within-engine behavior, not event-by-event paired RNG equality.

A concrete old-GPU zero-hit example: Searing Pain misses at **139.0s**, yet Brand has **six fresh charges until 149.0s** and Decimation is refreshed to **149.0s**. A corrected-GPU miss at **151.6s** leaves the existing Brand/Decimation expiration at **149.1s**, already expired. Source traces likewise contain missed Searing Pains without a Brand gain.

## Isolated ablations

All 60 Shadow Brand race/stat profiles were rerun against the unchanged 1,000-fight source results. The named gates were independently disabled in the new cast-ordering implementation. [Full ablation results](../FOREVER_BRAND_ABLATIONS.json).

| Variant | MAE | Mean signed difference |
| --- | ---: | ---: |
| Exact old production shader | 2.902 DPS | +2.801 DPS |
| New ordering, both old unconditional triggers | 2.949 DPS | +2.859 DPS |
| Brand requires hit, Decimation unconditional | 1.181 DPS | +0.557 DPS |
| Decimation requires hit, Brand unconditional | 2.995 DPS | +2.909 DPS |
| Both confirmed hit gates | **1.179 DPS** | **+0.563 DPS** |

Brand's missing hit gate explains most of the measured improvement. Decimation's gate and immediate Searing Pain timing are independently confirmed source behavior, but should not be credited with the whole MAE reduction. Changing ordering also changes random-number consumption; the ablations are not additive.

## Validation and remaining work

The new GPU regression executes detailed and fast modes with forced landed/missed Searing Pain, hardcast Shadow Bolt, both Nightfall paths, and a hit-chance change while a bolt travels. It verifies Brand charges, Decimation expiration, immediate Searing Pain damage, no missed-cast buff, retained projectile hit results, and matching fast/detailed totals. Compatibility hashes and the service-worker cache were updated. Existing Wrack/resource tests remain included.

**Checks:** the complete suite has **177 passes and the same 16 existing failures** as the Wrack baseline, with no new failing test names. The new Brand timing regression passes all 20 controlled mode/case combinations; the compatibility hash check and `git diff --check` pass.

Full projectile damage snapshots remain open: this change retains the cast's hit outcome, while other Shadow Bolt damage calculations still occur on impact. It does not establish complete nonzero-distance, pet movement or arbitrary APL parity.

The largest remaining full-matrix residuals are now concentrated in Troll Destruction (for example SP 1000: +8.93 DPS, approximate independent-engine 95% interval half-width 2.91 DPS). That is a better next focused trace target. Remaining Shadow Brand Shadow Bolt/Soul Fire differences should also be checked at higher samples before assigning another cause or changing coefficients.

## Reproduction

With the prepared Go environment and read-only Forever reference checkout:

```sh
node scripts/investigate_forever_brand.mjs
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path node scripts/capture_forever_brand_traces.mjs
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path node scripts/sweep_forever_parity.mjs --checkout /tmp/forever-run-source --go /tmp/go/bin/go --iterations 1000
```

The ablation runner uses the archived pre-fix report/kernel and verifies the kernel hash; it never overwrites production code.
