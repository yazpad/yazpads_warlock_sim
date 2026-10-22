# Shader throughput recovery experiments

**Follow-up:** the app now integrates these optimizations. Broader race/profile checks found bounded float32 rounding differences despite exact integer counters; see [production integration and validation](shader-recovery-production.md). The exact-match claims below describe the original sampled experiments.

2026-10-21. Significant recovery is demonstrated in isolated candidate shaders, with the current working tree as baseline. Production code is unchanged. These experiments retain the current mechanics, including existing uncommitted work, rather than reverting to older mechanics.

## Fast mode

Native AMD/Mesa GLES3, 16,384 fights per draw. Two warmups and five measured draws per stage; baseline/direct/features/features/direct/baseline order. Values average the two stage medians. Timing includes GPU draw and completion, excluding compilation, transfer, decoding, summaries and browser overhead.

| Input | Current ms | Direct APL reads ms | Feature variant ms | Feature throughput gain |
| --- | ---: | ---: | ---: | ---: |
| SM/Ruin, Succubus | 519.03 | 428.57 | 303.70 | 70.9% |
| Fire Brand, Imp | 517.37 | 418.28 | 297.21 | 74.1% |
| SM/Ruin, no pet | 314.38 | 268.52 | 235.76 | 33.4% |

The direct-read candidate alone improves throughput by 17.1–23.7%. It removes the four private APL arrays and their initialization, retaining the rule-count scan and reading rule headers/parameters from `getConfigWord` at each use. These 128 array words need not be copied and kept in per-invocation storage. The arrays existed before the reported commit; this is a recovery optimization, not proof they were introduced by that commit. The exact hardware allocation/spilling mechanism has not been profiled.

The feature candidate includes direct reads and replaces a selected set of fixed configuration values with shader literals, removing their initialization assignments. The selection is packed fields whose DEFAULTS entry is boolean, plus petChoice, race, filler and racialPolicy. This includes some packed talent coefficients such as Nightfall/ISB; the cache key must therefore include their exact packed words, not just truthiness. Stats, encounter duration and APL headers/parameters remain dynamic. The compiler can eliminate unreachable paths. Shader hashes and exact baseline/model hashes are recorded in the artifacts.

## Search-style configuration textures

Three configurations share the same feature values and APL but differ in spell power by 0/10/20. Configurations are fetched from a texture, with seed lanes restarting per configuration as in production multi-config runs. Same repeated stage order, fight count and timing method as above.

| Input family | Current ms | Direct APL reads ms | Feature variant ms | Feature throughput gain |
| --- | ---: | ---: | ---: | ---: |
| SM/Ruin, Succubus | 517.61 | 453.20 | 326.45 | 58.6% |
| Fire Brand, Imp | 514.98 | 446.96 | 323.52 | 59.2% |
| SM/Ruin, no pet | 399.80 | 356.36 | 253.99 | 57.4% |

This covers homogeneous feature groups with different stats. It does not establish performance for arbitrary mixed APL/talent/pet search populations. Direct reads remain generic; specialized fields must be identical across the entire draw or remain dynamic.

## Detailed mode

1,024 fights per draw, baseline/features/features/baseline; otherwise the same method. All existing detailed fields and output stripes are retained.

| Input | Current ms | Feature variant ms | Throughput multiplier |
| --- | ---: | ---: | ---: |
| SM/Ruin, Succubus | 448.74 | 160.50 | 2.80× |
| Fire Brand, Imp | 447.05 | 156.87 | 2.85× |
| SM/Ruin, no pet | 348.75 | 126.26 | 2.76× |

This gains substantial throughput without solving the stripe replication architecture. Larger fight counts and browser execution still need measurement before predicting app throughput.

## Correctness and rejected experiment

The generic direct-read candidate matches every attachment word in all 300 saved configurations in both modes: 128 fast fights and 16 detailed fights per configuration, seed 101, offset 17. This is 43,200 logical fights per shader; detailed fights execute once per output stripe. Historical unsupported config keys are omitted using the same adaptation as the existing benchmark.

Feature specialization matches every attachment word for all three benchmark configurations in both modes, 128 fights each, offset 17. Search-style texture equivalence checks use the same three feature families with different spell-power values. Validation records include separate direct/feature checks for these multi-config cases. This is sampled coverage; it is not an exhaustive validation of every possible specialized program.

Chrome 131/ANGLE successfully compiles all eight tested candidate shaders: direct fast/detailed and feature fast/detailed for the three benchmark configurations. This is a compilation check, not a browser throughput measurement.

An aggressive candidate that bakes every scalar config value ran faster, but changed floating-point output words. It is rejected as an exact replacement. Its speed is not included in the accepted gains above. The validation harness records these differences rather than silently accepting a tolerance.

## Production implementation supported by the evidence

1. Use direct APL reads as the generic shader path, after expanding equivalence coverage to existing diagnostic/continuation paths.
2. Add a bounded material cache keyed by kernel/model compatibility and exact selected packed feature values. Reuse programs across stat, duration and APL-parameter changes.
3. For multi-config draws, specialize only values shared by every configuration, or group configurations by feature key. Retain the generic fallback for mixed groups and avoid unbounded compile work during search.
4. Measure compilation, first-use latency and full browser runs on the affected renderer before enabling specialization by default. The present native warmed results establish feasibility, not startup performance or cross-device guarantees.

Full recovery to the pre-a0255 throughput is not established for every workload. The feature candidate's SM/Ruin fast draw is faster than the historical parent's measurement, but the Imp and no-pet draws remain slower; historical mechanics/workloads differ. Both fast and detailed mode have substantial recoverable implementation overhead.

## Artifacts and reproduction

- [Fast measurements](shader-recovery-fast.json)
- [Detailed measurements](shader-recovery-detailed.json)
- [Configuration-texture measurements](shader-recovery-multi.json)
- [Output validation](shader-recovery-validation.json)
- [Browser compilation](shader-recovery-browser.json)

The harness snapshots shader strings when it starts and does not edit production files. Run GPU workloads serially:

```sh
node scripts/investigate_shader_recovery.mjs --out /tmp/recovery-fast.json
node scripts/investigate_shader_recovery.mjs --detailed --variants baseline,features,features,baseline --out /tmp/recovery-detailed.json
node scripts/investigate_shader_recovery.mjs --multi --out /tmp/recovery-multi.json
node scripts/investigate_shader_recovery.mjs --validate --out /tmp/recovery-validation.json
node scripts/investigate_shader_recovery.mjs --multi --validate --specialization-only --out /tmp/recovery-multi-validation.json
BROWSER_EXECUTABLE=/path/to/chrome node scripts/investigate_shader_recovery.mjs --browser --out /tmp/recovery-browser.json
```
