# Wrack application and Soul Siphon investigation

Subsequent follow-up: [Shadow Brand hit gating and timing](FOREVER_BRAND_FINDINGS_2026-10-20.md) is implemented. Current overall MAE is **1.366 DPS**; the Wrack-stage metrics below are historical.

Production now matches the inspected Forever revision's Wrack application and supported Soul Siphon effects. No source-engine modifications or coefficient fitting were used.

## Measured production result

Same 300 configurations, 1,000 fights per engine per configuration, seed 101, 180 seconds. Requests and source revision are unchanged; all 240 non-Wrack-preset GPU case results are exactly unchanged.

| Measurement | Before | After |
| --- | ---: | ---: |
| Full 300-case MAE | 1.994 DPS | **1.806 DPS** |
| Full mean absolute percentage error | 0.303% | **0.268%** |
| Wrack preset, 60-case MAE | 1.834 DPS | **0.895 DPS** |
| Wrack spell, mean signed damage difference | +2.325 DPS | **+0.174 DPS** |

The full MAE improves 9.4%; Wrack-preset MAE improves 51.2%. These are differences between sampled case means, not proof of exact engine equality. Equal seeds do not pair the engines' random streams.

Current complete report: [FOREVER_SWEEP.json](../FOREVER_SWEEP.json). Matched before/after metrics and hashes: [FOREVER_WRACK_FIX_COMPARISON.json](../FOREVER_WRACK_FIX_COMPARISON.json). Pre-fix report: `fixtures/benchmark_history/race-stat-300-before-wrack-fixes.json.gz`.

## Confirmed causes

1. **An extra Soul Siphon effect.** The old GPU tick calculation unconditionally added one effect. Forever's `Warlock.AfflictionCount` counts this caster's active tagged Affliction auras and assigned curses. Wrack has no Affliction tag and does not count itself. Our supported effects are now Corruption, Agony, Siphon Life and Doom, capped at three. An external raid curse does not add a caster-owned effect. Counting remains dynamic at each tick.
2. **No Wrack application hit check.** Forever's `soulSiphonChannelConfig` rolls `OutcomeMagicHitNoHitCounter` before applying its channel aura. A miss spends 200 mana and the GCD but produces no ticks, no Corruption/Agony amplification, and no paid-channel spirit-regeneration suppression. Wrack has no actual cooldown: the source row's six seconds is its channel duration. A miss can be retried after the GCD. Successful channels retain six one-second ticks and the configured post-channel clip delay.

Read-only source traces in [FOREVER_WRACK_SOURCE_AUDIT.json](../FOREVER_WRACK_SOURCE_AUDIT.json) confirm rank-three Soul Siphon damage factors **1.00 / 1.12 / 1.24 / 1.36** for zero through three other effects. Doom alone counts exactly like Corruption alone. Example noncritical ticks are 130.075, 145.684, 161.293 and 176.902 damage, respectively. In the zero-effect trace a miss at 6.05 seconds is followed by a new cast at 7.55 seconds. The source wrapper uses one debug fight per scenario, overriding the sample count in the retained request.

Source locations: `sim/warlock/talents_affliction.go` (`soulSiphonChannelConfig`, `soulSiphonMultiplier`), `sim/warlock/warlock.go` (`AfflictionCount`), `sim/warlock/wrack.go`, and channel scheduling in `sim/core/cast.go` and `sim/core/dot.go`. Revision: `86d0920cae8445eaa90de9c17c3583cf171c19c5`.

## Separate ablations

The twelve Human stat profiles were rerun at 1,000 fights against the unchanged source results. Only the named shader mechanics changed. [Full ablation details](../FOREVER_WRACK_ABLATIONS.json).

| Shader variant | Total rotation MAE |
| --- | ---: |
| Before | 1.715 DPS |
| Application hit check only | 1.463 DPS |
| Effect count only | 0.276 DPS |
| Both confirmed corrections | 0.567 DPS |

The effect-count correction removes most of the excess. The two corrections interact with action decisions and random-number consumption, so their MAE improvements are not additive. The smaller sampled error of the count-only variant is not a reason to keep the incorrect always-land application behavior.

## Validation and remaining work

GPU regression coverage checks forced misses, the 1.5-second retry cadence, mana consumption, absence of the missed-channel aura, zero/one/two/three effects, Doom, the three-effect cap, and exact fast/detailed total agreement. Existing channel-delay and resource tests are retained. The regret diagnostic's availability probe also handles the nested application-miss branch without retaining its side effects; actual rollouts still execute the hit roll.

**Checks:** 8/8 focused tests and the compatibility-hash check pass. The complete suite has 176 passes and the same 16 pre-existing failures as the pet baseline, with no new failing test names. `git diff --check` passes. The old racial test now correctly expects no Command multiplier.

The next investigation is Shadow Brand's player action mix and timing, especially Shadow Bolt versus Searing Pain. Wrack still has case-level sampling spread and other action differences; the remaining +0.174 DPS spell mean is not assigned a new cause without further evidence. Nonzero-distance behavior, additional assigned curse types and arbitrary channel interruption remain outside this matrix's validated scope.

## Reproduction

From the repository root with the prepared Forever checkout and Go environment:

```sh
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path node scripts/capture_forever_wrack_source.mjs
node scripts/investigate_forever_wrack.mjs --kernel fixtures/benchmark_history/wrack-before-kernel.js.gz
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path node scripts/sweep_forever_parity.mjs --checkout /tmp/forever-run-source --go /tmp/go/bin/go --iterations 1000
```

Historical ablations explicitly require the archived kernel; they do not overwrite production code. Current compatibility hashes and the service-worker cache version were updated.
