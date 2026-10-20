# Eureka timing investigation

Current status (2026-10-20): actual Split Boosts gates are implemented and focused import/fast/detailed tests pass. The fallback-policy discrepancy below describes the pre-fix diagnostic. Fresh race/stat results are in `FOREVER_SWEEP.md`.

Implementation follow-up: imported Split Boosts conditions now compile into explicit racial APL actions. Duration-aware time-to-execute and independent Decimation-aura predicates are supported; unconditional Eureka at 0/120 seconds is tested in both shader modes. Measurements below describe the pre-fix diagnostic. Fresh actual-import results are saved in `FOREVER_EUREKA_APL_COMPARISON.*`.

All comparisons here are 180-second gear-free Shadow Brand fights. Eureka spell 1259821 has an 8-second duration and 120-second cooldown in the source data; our cooldown length already matches.

## Why source uses it once

The source Split Boosts groups gate Eureka on execute and an active Decimation aura. Time to execute is remaining fight time minus 35% of total duration: in this fight it starts at 117 seconds, so its alternative `>= 2m` predicate never passes. The pre-execute reference requires both not-in-execute and a child gate that cannot pass then. The execute reference requires Decimation active plus in-execute. Thus the first eligible activation is after approximately 117s, leaving insufficient fight time for a second use.

Source one-fight logs (seed 101) show Eureka at 119.10s / 123.30s / 119.80s for bonus hit 0 / 5 / 12. These are timing evidence, not DPS estimates.

## Why ours can use it twice

The bridge diagnoses and omits the Split Boosts arithmetic and Decimation-aura expressions. With no explicit Eureka row, the kernel uses its automatic racial policy. For Gnome this can activate when Doom has at most 6 seconds remaining. The zero-hit sample activates at 54.5s (ready again 174.5s) and 176.6s. Both activations obey the 120-second cooldown; the discrepancy is the activation policy, not the cooldown length.

## Diagnostic source-like gate

An in-memory experiment requires execute and an active Decimation aura for the fallback, using this specific 180-second scenario. It activates once at 121.3s in the GPU sample. Source and GPU random streams differ, so these samples do not establish exact timeline alignment. This patch is not a general replacement for preserving the source condition AST, and is not applied to production.

| Bonus hit profile | Source DPS | After production Doom fix | Eureka gate probe | Gap before | Gap after |
| --- | ---: | ---: | ---: | ---: | ---: |
| baseline | 707.83 | 713.72 | 711.69 | +0.83% | +0.54% |
| hit_0 | 614.99 | 623.19 | 620.54 | +1.33% | +0.90% |
| hit_5 | 653.72 | 663.32 | 660.59 | +1.47% | +1.05% |

1,000 fights per engine for the means, seed 101. The gate recovers roughly 2–3 DPS of the remaining Gnome difference; residual spell damage/action differences persist. The JSON contains standard deviations, delta intervals, spell breakdowns and exact diagnostic patches.

Next implementation should preserve the actual Split Boosts arithmetic, execute comparisons and Decimation aura gates. Do not change Eureka to a longer cooldown or hardcode one activation per fight: other rotations and longer fights can legitimately use it twice or more.

## Reproduce

```sh
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path python3 scripts/forever_probes/capture_eureka_probe.py /tmp/forever-benchmark-source /tmp/go/bin/go
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path node scripts/sweep_forever_parity.mjs --checkout /tmp/forever-benchmark-source --go /tmp/go/bin/go --matrix fixtures/forever_low_hit_matrix.json --iterations 1000 --out FOREVER_DOOM_FIXED_COMPARISON
node scripts/investigate_forever_eureka.mjs
```

Artifacts: `FOREVER_EUREKA_RUNTIME_PROBE.json`, `FOREVER_DOOM_FIXED_COMPARISON.json`, `FOREVER_EUREKA_INVESTIGATION.json`. Prerequisites are the existing prepared Go/Forever checkout. Replace temporary paths as appropriate.
