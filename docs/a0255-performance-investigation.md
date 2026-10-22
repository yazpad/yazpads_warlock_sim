# Performance regression in a0255f586

Measured on 2026-10-21 against the commit's immediate parent, using identical Human baseline configs from FOREVER_SWEEP.json. This isolates the named commit, unlike earlier reports comparing later parity revisions. Production files and existing worktree edits were left untouched.

## Direct measurement

Native AMD/Mesa surfaceless EGL/GLES3, fast mode, 16,384 fights per draw. Two warmups and five measured draws per stage, in parent/commit/commit/parent order. Each value averages the two stage medians. Compilation, transfer, JS decoding, summaries and traces are excluded. Historical mechanics and event counts can differ. These are GPU timings, not browser throughput.

| Input | Parent ms | Commit ms | More GPU time | Lower throughput |
| --- | ---: | ---: | ---: | ---: |
| SM/Ruin, Succubus | 329.88 | 439.98 | 33.4% | 25.0% |
| Fire Brand, Imp | 131.03 | 347.93 | 165.5% | 62.3% |
| SM/Ruin, no pet | 182.24 | 269.45 | 47.9% | 32.4% |

Raw samples, configs, revisions, renderer and generated shader hashes: [a0255-performance-measurements.json](a0255-performance-measurements.json).

## What changed

1. **Detailed output expands from 4 to 10 stripes.** The shader's `main()` maps each stripe to the same fight lane and executes the entire simulation before selecting 16 output words. It therefore executes each detailed fight ten times instead of four. This is a 2.5× increase in fragment invocations per fight, before accounting for more expensive counters or differences in GPU scheduling. It is not just a larger readback. The full state expands from 165 to 255 words, and 79 extra output words are introduced for periodic/critical damage, pet counters and resources. Detailed mode also adds another spell switch for periodic damage and more counter updates. This exact multiplier describes work replication, not a measured end-to-end slowdown.

2. **Fast mode also regresses independently.** Fast state grows from 82 to 95 declared words; new APL conditions/actions and combat rules enlarge the shader. The no-pet diagnostic fight changes from 421 to 420 events while GPU time rises 47.9%; Succubus changes from 528 to 519 events while time rises 33.4%. More events cannot explain these cases. More expensive event processing and compiler behavior are implicated, but register spilling/occupancy has not been profiled and declared state size alone does not establish live register use.

3. **Imp workloads also change materially.** Its diagnostic fight grows from 369 to 527 events. The commit changes pet regeneration from fixed 45 MP5 to intellect-dependent MP5 and changes pet power/Brand resolution. Brand gains independent hit/crit RNG and damage resolution in all three pet attack branches. These are additional combat work and changed workloads. The event counts are for the first fight, not batch averages. Later Firebolt missile changes are not part of this commit and cannot explain this particular regression.

4. **The JS detailed decoder does more allocation and aggregation.** It adds counters and per-fight temporary arrays/typed arrays. These costs are separate from the GPU regression demonstrated above. The commit's large JSON reports are offline artifacts; their size alone does not explain shader execution time.

## Fixability

The avoidable replication in detailed mode is the clearest architectural target. WebGL's four RGBA outputs provide only 16 words per fragment. Packing counters more tightly and emitting only relevant counters can reduce stripes without changing combat calculations; the required savings depend on which detailed fields must remain available. To retain all fields while executing each fight once, use a backend with storage-buffer writes (for example WebGPU compute). That requires a separate implementation and parity validation.

For fast mode, configuration-specialized shader variants can remove unused spell, pet and APL paths before compilation. Multi-config searches must group compatible variants or retain a generic fallback. This may reduce shader/control-flow costs while preserving mechanics, but its speedup has not been measured. Another target is generating detailed counters only for spells that can occur in the selected configuration. These changes require output/RNG/event equivalence checks; reversing the parity mechanics would not be an accuracy-preserving optimization.

No production optimization or recovered performance is claimed. The named commit's regression is reproduced; the exact compiler-level cause of the residual fast-mode cost remains unisolated. Existing later optimization measurements in `FOREVER_OPTIMIZATION_PERFORMANCE.json` show only approximately 0.8–2% gains, so those changes did not recover this regression.

Reproduce:

```sh
BENCH_REVISIONS=a0255f586^,a0255f586,a0255f586,a0255f586^ BENCH_OUTPUT=/tmp/a0255-performance.json node scripts/benchmark_optimized_shader.mjs
```
