# Performance follow-up after parity fixes

The reported 600k → 400k fights/s is a **33% throughput reduction**, or **50% more elapsed time per fight**. The code investigation identifies additional shader work, but the local matched test does **not** reproduce that full regression. No production simulation changes were made in this investigation.

## Measured comparison

The same Human baseline inputs were packed using each revision's model and executed in fast mode. New config fields unsupported by the historical model are omitted; the new automatic racial policy has no effect on these Human cases. Measurements use native surfaceless EGL/GLES3 on the local AMD/Mesa renderer, not the user's browser/backend.

Each sample draws 16,384 fights, with two warmup draws and five timed draws. Timings include GPU draw and completion wait, excluding compilation, result readback, JavaScript decoding and summaries. They are **not app fights/s**. Historical mechanics intentionally differ, so event counts/results can change.

| Case | Earlier parity shader (`a0255f586`) | Current shader | Execution-time change |
| --- | ---: | ---: | ---: |
| SM/Ruin, Succubus | 439.89 ms | 459.19 ms | +4.39% |
| Fire Brand, Imp | 347.58 ms | 344.00 ms | -1.03% |
| SM/Ruin, no pet | 269.07 ms | 281.17 ms | +4.50% |

The intermediate `24e75ac7e` revision and all individual samples are retained in [FOREVER_PERFORMANCE_INVESTIGATION.json](../FOREVER_PERFORMANCE_INVESTIGATION.json), alongside exact configs, resolved Git revisions and source hashes. The engine JavaScript hash is identical across the measured revisions. These are small repeated samples on one renderer, not a cross-device performance guarantee.

A Chrome 131/SwiftShader end-to-end attempt was stopped because it was too slow in this environment; no browser throughput conclusion is derived from it.

## Plausible shader costs

- Player mana regeneration now integrates at every event, with five-second-rule/channel checks. Pet mana also credits through the source's 100ms boundary at those events. Previously MP5 was largely handled by a single five-second event.
- Every heap comparison now handles same-time event priority, including periodic ticks, inheritance and fight-end ordering. This replaces simpler timestamp-only comparisons.
- Pets add inherited SP/AP, pending heartbeat timing, stat-change refreshes and mana readiness handling.
- The fast simulation state grows from **95 to 102 words** in the compared revisions. More live state and control flow can affect GPU register pressure and compiler decisions; the user-device contribution has not been measured.
- Hit-gated Brand/Decimation and source-correct timing can also alter the number and mix of simulated events for a particular build. First-fight event counts are included as diagnostics, not treated as average workload counts.

The recent Shadowburn/Doom arithmetic edits are not sufficient evidence for attributing a 33% drop to those individual fixes. The app's JavaScript rendering/readback/summary pipeline itself is unchanged across these revisions.

## Next measurement

Compare the user's exact build, iteration count and fast/detailed setting after shader warmup, on the same renderer. The existing result already separates `compileMs`, `executeMs`, `decodeMs`, `summaryMs` and diagnostic time. Determine which component increased before attempting to optimize it. Larger state or control-flow costs may be renderer-dependent, so the local ~4% loss should not be substituted for the user's observation.

Any optimization should preserve the parity fixes and pass the existing regression/comparison checks. This turn adds diagnostic tooling only.

## Reproduction

```sh
node scripts/benchmark_parity_shader.mjs
python3 scripts/benchmark_parity_performance.py --iterations 8192 --repeats 3
```

The native runner generates an instrumented EGL harness in a temporary directory. The browser runner uses an isolated local server and historical app files under `/tmp`, with SwiftShader by default. Both remove their temporary files and leave the app source untouched. The browser runner requires the configured cached Chrome binary, and its absolute results must be labeled with the actual renderer.
