# Production WebGL integration

The Three.js app now uses direct APL reads and cached feature-specialized materials in fast and detailed modes. The generic shader remains available when the 16-material specialization budget is exhausted. Mixed-config draws specialize only values shared by every packed configuration; stat changes reuse programs. Compiled materials are tracked by identity, and disposal releases the cached programs. The service-worker cache is advanced to v98 and compatibility IDs/snapshots are refreshed.

The three fast-mode benchmark builds produce exactly the generated shader hashes in `shader-recovery-fast.json`, so the measured 33–74% warmed GPU throughput improvement applies to these production shader programs. The previous detailed-mode and homogeneous search measurements also describe this implementation strategy; no claim is made about browser-wide throughput or cold compilation latency.

## Follow-up accuracy checks

The earlier exact-match feature checks covered three Human inputs. Broader production validation across all 300 saved configurations found tiny GPU floating-point rounding differences in some other inputs. Narrowing specialization to integer fields did not eliminate these compiler differences, so numerical equivalence is now reported explicitly rather than claiming universal bit identity.

Across 600 fast/detailed comparisons, 570 are entirely bit-identical. Every integer output word—including event, RNG, hit, cast, and completion counters—is identical in all cases. Only 49 floating output words differ; the largest observed relative error is **1.6718166980048707e-7** (approximately **0.0000167%**), and the largest absolute difference in a floating output is **0.03125**. The checker accepts differences only in known floating output slots and limits relative error to 1e-6; all other words require exact equality. It does not apply a blanket tolerance to packed counters.

The matrix uses 128 fast fights and 16 detailed fights per configuration, seed 101, offset 17. It compares production-generated feature variants against the pre-integration working-tree shader. [Full validation](shader-recovery-production-validation.json).

## Integration checks

- 19 targeted assertions pass, covering cache reuse/cap/fallback, mixed features, detailed decoding, diagnostic scheduling, schema snapshots, service worker behavior and compatibility IDs. Two import round-trip tests fail identically with the pre-change shader/model: intellect 344 vs 231, and Human sword import 225 vs 105. These failures were not changed by this integration.
- Chrome/ANGLE compiles generic fast/detailed, regret, specialized fast/detailed, and mixed-config shaders.
- The real Three.js browser smoke test passes using `BROWSER_ANGLE=gl`: fast lane completion, stat-edit program reuse, shared-feature multi-config reuse, mixed-pet searches, detailed output/diagnostics, traces, and disposal/recreation.
- SwiftShader runtime smoke attempts time out during program compilation for both the optimized shader and the pre-integration baseline; those attempts are not counted as passing runtime checks. Browser execution with the OpenGL backend succeeds. Cold compile latency and other browser/device combinations remain unmeasured.

Run the new cache tests with the normal package test command, or individually:

```sh
node --test threejs_webgl_des/validation/shader_variants.test.mjs
BROWSER_EXECUTABLE=/path/to/chrome BROWSER_ANGLE=gl node threejs_webgl_des/validation/browser_shader_variants.mjs
```

The broad validator supports `--baseline /path/to/baseline/kernel.js --validate --roundoff`. A baseline copy must have its matching `model.js` alongside it. Omitting `--roundoff` continues to require bit identity.
