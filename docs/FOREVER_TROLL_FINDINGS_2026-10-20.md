# Troll Destruction: automatic Berserking and the cast clock

Subsequent follow-up: [Shadowburn mean and variance](FOREVER_SHADOWBURN_FINDINGS_2026-10-20.md) are corrected. Current standard-matrix MAE is **1.177 DPS**, while the matched balanced 20-case × 10,000-fight check improves **0.788 → 0.442 DPS MAE**. Earlier measurements below describe the Troll stage.

Two source-backed corrections are implemented: imported automatic cooldowns activate Berserking when ready, and cast/GCD durations round to the nearest millisecond. Explicit Berserking APL rows retain control, including rows whose conditions are false. Ordinary app builds without the imported automatic-cooldown policy retain their existing racial policy.

## Confirmed causes

1. **Automatic Berserking was delayed until execute.** The imported Destruction APL contains `autocastOtherCooldowns`, with no explicit Berserking row. Forever registers Berserking as a DPS major cooldown and uses it at the pull. Our `autoCooldowns` flag previously handled Gnome Eureka but omitted Troll Berserking, leaving the default execute fallback in charge. The old GPU trace's opening GCD was 1.500 seconds with no haste; corrected/source opening GCD is 1.364 seconds, with Berserking expiring at 10 seconds.
2. **Cast/GCD rounding used the wrong clock resolution.** Forever's `core/cast.go` applies `.Round(time.Millisecond)` after haste, for both the GCD and cast time. The GPU truncated float durations to microseconds. Examples: a hasted 1.5-second GCD should be **1,364,000µs**, not 1,363,636µs; a hasted three-second Shadow Bolt should be **2,727,000µs**, not 2,727,272µs. Cast-start timestamps control DoT refreshes, Conflagrate availability and mana decisions, so this is not merely display precision. The corrected shared clock also rounds Soul Fire's float-derived cast duration to the source's milliseconds.

Berserking's **10% haste, ten-second duration and three-minute cooldown were already correct**. No haste coefficient or damage coefficient was fitted to the comparison score. Cast haste remains fixed when each cast starts; expiration affects subsequent casts.

Source revision: `86d0920cae8445eaa90de9c17c3583cf171c19c5`. Relevant files: `sim/core/racials.go`, `sim/core/cast.go`, `sim/core/unit.go`. [Ablations and source/GPU traces](../FOREVER_TROLL_INVESTIGATION.json) include the exact source requests and hashes. Source trace wrappers enable one debug fight; the reference engine is unmodified.

## Separate ablations

All twelve Troll Destruction stat profiles were compared at 1,000 fights per engine, seed 101. Exact old production is archived and used for the before variant; source results are reused unchanged.

| Variant | MAE | Mean signed difference |
| --- | ---: | ---: |
| Before | 4.550 DPS | +3.257 DPS |
| Automatic cooldown only | 0.913 DPS | +0.778 DPS |
| Millisecond clock only | 4.649 DPS | +3.353 DPS |
| Both corrections | **0.465 DPS** | **-0.169 DPS** |

Pull-time Berserking accounts for most of the improvement. Clock correction further improves the rotation once haste is applied at the right time. The effects interact through action order and random consumption, so separate MAE improvements are not additive.

## Full production comparison

The unchanged 300-case matrix at 1,000 fights per engine improves **MAE 1.366 → 1.122 DPS**, with **MAPE 0.205% → 0.168%**. All 300 cases complete with zero checked input differences. The full Destruction preset improves **1.624 → 0.807 DPS MAE**. [Before/after metrics and current hashes](../FOREVER_TROLL_FIX_COMPARISON.json), [full report](../FOREVER_SWEEP.json).

## Matched higher-sample confirmation

Four representative profiles were run at **10,000 fights per engine per case**, before and after, with the same seed, source requests and 180-second gear-free scenario. Both engines were rerun at the higher sample count. [Before](../FOREVER_TROLL_HIGH_SAMPLE_BEFORE.json), [after](../FOREVER_TROLL_HIGH_SAMPLE_AFTER.json).

| Profile | Before difference | After difference | After approximate 95% half-width |
| --- | ---: | ---: | ---: |
| Baseline | +7.502 DPS | +1.162 DPS | 0.612 DPS |
| Spell power 1000 | +11.824 DPS | +1.430 DPS | 0.943 DPS |
| Intellect 400 | -0.765 DPS | +0.321 DPS | 0.648 DPS |
| High regeneration | -6.989 DPS | +0.430 DPS | 0.620 DPS |

Matched four-case MAE improves **6.770 → 0.836 DPS**, an 87.7% reduction. The larger pre-fix differences relative to the earlier 1,000-fight report also show why comparisons must match sample count. Equal seeds do not pair the independent engines' random streams. Intervals are approximate and unadjusted for multiple comparisons.

The baseline and SP 1000 residuals remain positive beyond these approximate intervals; do not declare them entirely sampling noise or exact parity. A focused per-spell, per-action follow-up is still warranted.

## Validation and remaining scope

The existing Troll GPU regression now checks the source millisecond timestamps, pull-time automatic activation, explicit conditional APL precedence, cooldown, expiration, and fast/detailed totals. Shared Brand, Wrack and resource checks remain included. The compatibility IDs and service-worker cache version were refreshed.

**Checks:** 11/11 focused tests pass. The full suite has 177 passes and the same 16 existing failures as the Brand-stage baseline, with no new failing test names. Compatibility hashes and `git diff --check` pass.

The next diagnostic is Shadowburn damage per cast: all four higher-sample cases have ten casts in both engines, yet our damage is consistently +0.61 to +0.73 DPS (roughly +11 to +13 damage per cast). This distinguishes the remaining damage discrepancy from an action-count issue; its exact cause has not yet been isolated. Doom also contributes residual differences. Do not re-tune Berserking's already-correct haste amount. Projectile damage snapshots, pet movement, geared effects and arbitrary APL support remain separate open items.

## Reproduction

```sh
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path node scripts/investigate_forever_troll.mjs
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path node scripts/sweep_forever_parity.mjs --checkout /tmp/forever-run-source --go /tmp/go/bin/go --matrix fixtures/forever_troll_followup_matrix.json --iterations 10000 --out FOREVER_TROLL_HIGH_SAMPLE_AFTER
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path node scripts/sweep_forever_parity.mjs --checkout /tmp/forever-run-source --go /tmp/go/bin/go --iterations 1000
```

The ablation runner reads the archived pre-fix kernel and report, verifies the kernel hash, and does not overwrite production code. The higher-sample before artifact records the actual pre-fix run; rerunning the standard runner on current production produces the corrected implementation.
