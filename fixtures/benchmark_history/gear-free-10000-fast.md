# Gear-free diagnostic DPS comparison

10,000 iterations per preset **in each engine**, seed 101, 180 seconds. Explicit bonus stats, empty equipment and no external buffs/consumables.

**Diagnostic results, not accepted parity.** Normal imports are evaluated as implemented, with known APL gaps and Fire Brand initial-state differences. No configuration values were adjusted to close the DPS gap.

Intervals are approximate 95% confidence intervals for the means. Delta uncertainty uses independent-engine standard errors; equal seeds do not imply paired random outcomes. These intervals describe Monte Carlo uncertainty, not uncertainty from missing features or formulas.

| Preset | Forever DPS ±95% CI | Our WebGL DPS ±95% CI | Ours − Forever | Delta % | Delta ±95% CI |
| --- | ---: | ---: | ---: | ---: | ---: |
| sm_ruin | 655.52 ± 0.66 | 597.89 ± 0.59 | -57.63 | -8.79% | ±0.89 |
| aff_wrack | 562.63 ± 0.39 | 506.36 ± 0.36 | -56.28 | -10.00% | ±0.53 |
| destro | 634.55 ± 0.43 | 610.10 ± 0.41 | -24.45 | -3.85% | ±0.60 |
| demo_shadow_brand | 711.18 ± 0.64 | 662.39 ± 0.57 | -48.79 | -6.86% | ±0.86 |
| demo_fire_brand | 748.65 ± 0.45 | 664.38 ± 0.38 | -84.27 | -11.26% | ±0.59 |

## Pet damage contributions

| Preset | Forever pet DPS | Our pet DPS |
| --- | ---: | ---: |
| sm_ruin | 43.91 | 39.80 |
| aff_wrack | 43.53 | 41.41 |
| destro | 46.58 | 42.03 |
| demo_shadow_brand | 131.05 | 105.17 |
| demo_fire_brand | 180.29 | 130.12 |

## Effect of replacing the 20-iteration reference

| Preset | Old 20-trial Forever DPS | New Forever DPS |
| --- | ---: | ---: |
| sm_ruin | 659.64 | 655.52 |
| aff_wrack | 562.68 | 562.63 |
| destro | 633.91 | 634.55 |
| demo_shadow_brand | 706.54 | 711.18 |
| demo_fire_brand | 745.06 | 748.65 |

Renderer: AMD Ryzen 9 9950X 16-Core Processor (radeonsi, raphael_mendocino, LLVM 20.1.2, DRM 3.64, 7.0.0-38-generic). Actual GLSL ES shaders run through headless EGL; this is not a browser integration or performance measurement. All shader lanes completed successfully.

The JSON companion records sample standard deviations, counts, configs, exact requests, hashes, captured source provenance, source action metrics and blockers. Source requests are checked against the canonical captures; only iteration count and seed may differ.

Reproduce:

```sh
node scripts/benchmark_forever_gear_free.mjs /path/to/forever go 10000 101
```
