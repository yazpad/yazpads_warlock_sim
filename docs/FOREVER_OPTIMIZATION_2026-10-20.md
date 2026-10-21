# Warlock WebGL optimization

This pass preserves the Forever mechanics. It changes the shader's hot event loop:

- Compare timestamp and numeric event priority with a single boolean expression. Periodic ticks and pet inheritance still precede ordinary actions; fight end remains last. Equal-priority comparisons remain strict.
- Sift the heap tail down through a hole instead of swapping two queue elements at every level. The same left/right comparisons preserve tie order.
- Skip regeneration integration when the next event has the current timestamp. Player elapsed time is zero and the pet's credited 100ms boundary is already current.

The JavaScript transport already has specialized fast decoding, shared float views, single-pass totals, and numeric typed-array sorting. This pass leaves that pipeline intact. Shader compatibility IDs and the two generated-shader snapshots are refreshed.

## Accuracy verification

`FOREVER_OPTIMIZATION_PARITY.json` records a replay of **all 300 saved Forever parameter cases**, with **1,000 fights per case**, seed 101. Both baseline (`git HEAD`) and optimized shaders run in **fast and detailed modes**: 1,200,000 fights total. Every attachment word matches exactly within each mode, including damage, event counts, RNG counts, and detailed output. All detailed fights complete.

Recomputed DPS MAE against the saved Forever means is **1.1771184622812896**, unchanged. This reuses the existing Forever requests/configs/results rather than running Go again, so Monte Carlo variation in a fresh reference cannot obscure an optimization regression. The reference file and both detailed shader hashes are recorded.

```sh
node scripts/validate_shader_optimization.mjs
```

This validator intentionally compares the working tree with `git HEAD`; run it before committing the optimization, or retain the baseline revision when adapting it later.

## Performance measurement

`FOREVER_OPTIMIZATION_PERFORMANCE.json` measures native surfaceless EGL/GLES3 GPU draw plus completion, excluding compilation, result transfer, decoding and summaries. It is not browser/app throughput. Each stage warms up twice and times five draws of 16,384 fights. The baseline/optimized/optimized/baseline order helps expose ordering drift. The report identifies the actual renderer and generated fast shader hashes.

```sh
node scripts/benchmark_optimized_shader.mjs
```

## Regression suite

The full validation directory is exercised sequentially to avoid multiple GPU tests competing with each other. Existing tests include stale base-stat expectations, deferred-gear imports, and a blocked canonical input fixture. The Amplify Curse and pet-swap GPU assertion failures were also reproduced with the original shader, with the same numerical errors. Snapshot checks are rerun after refreshing them. No unrelated mechanics or fixtures are changed to force this suite green.

The initial broad run completed 199 tests: 182 passed and 17 failed. Two failed generated-shader snapshots were refreshed and pass on rerun, alongside the compatibility-ID check. The other 15 failures remain unresolved by this performance pass:

- Amplify Curse boosts all Agony damage including spell power by 50%
- legacy and v1 logical builds round trip with exact configs and packed words
- inputs match CPU raw-stat conventions and preserve integer clock words
- Headless GPU DES runs against all ingested canonical Forever fixtures
- Eureka appears in presets, parses, compiles, and round trips as an off-GCD action
- UI migration maps fields losslessly without interpreting rotation or reapplying effects
- actual GLSL swap is once per fight, talent guarded, replaces buffs and pet, and costs a GCD
- versioned resolved exports reimport without reapplying buffs or racial stats
- Human sword selection survives import/export without doubling crit
- synthesis eligibility gates talent actions and retains baseline actions in metadata order
- actual app applies staged editable builds and clears stale buff selections
- actual app accepts legacy and versioned resolved imports without touching editable fields
- equipped imports derive stats independently of saved display snapshots
- buffs and racial effects preserve order, rounding, school bonuses, and resistance reduction
- final resolution produces validated text/rules configs and skips resolved effects

## Final measured results

Renderer: `AMD Ryzen 9 9950X 16-Core Processor (radeonsi, raphael_mendocino, LLVM 20.1.2, DRM 3.64, 7.0.0-38-generic)`. Each cell averages the two stage medians from the reversed-order runs.

| Build | Baseline draw ms | Optimized draw ms | Throughput improvement |
| --- | ---: | ---: | ---: |
| sm_ruin | 459.17 | 450.26 | 1.98% |
| demo_fire_brand | 343.56 | 340.78 | 0.82% |
| sm_ruin_no_pet | 280.07 | 276.68 | 1.23% |

The repeatable local gain is approximately **0.8–2.0% GPU throughput** with the browser-compatible shader. This pass does not recover the previously reported 33% app throughput drop, and these native timings do not establish a browser speedup. Browser measurements on the affected renderer remain necessary to explain that larger change.

## Browser compiler correction

Chrome/ANGLE rejected the original heap expression `smallest==i?tail:queue[left]`: WebGL does not permit ternary expressions that return structs. The native Mesa validator accepted it, so native execution alone missed the browser compilation failure. The expression now selects between boolean comparisons instead; event ordering is unchanged.

A dedicated browser check compiles the detailed, fast, and regret fragment shaders using a real WebGL2 context. All three pass after the correction. It reproduces the original failure before the correction.

```sh
cd threejs_webgl_des
npm run test:browser:shaders
# Or select an installed Chrome/Chromium executable explicitly:
BROWSER_EXECUTABLE=/path/to/chrome npm run test:browser:shaders
```

The default executable comes from Playwright; `PLAYWRIGHT_MODULE` can select an alternate installed module. This check is separate from native GPU tests so the WebGL compiler restrictions are exercised directly.

After the browser correction, the full 300-case × 1,000-fight replay was repeated in both modes. Every output word remains identical to baseline and DPS MAE remains **1.1771184622812896**. The parity artifact now records the corrected shader's hash. Five targeted shader snapshot, compatibility, and cache checks pass as well.
