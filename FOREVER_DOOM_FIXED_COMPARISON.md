# Forever race/stat diagnostic sweep

complete: 9/9 combinations completed; 1000 fights per engine per combination, seed 101.

Targeted low-hit Shadow Brand investigation: three races and bonus hit 0/5/12, source APL preserved.

**Diagnostic only.** Source APLs are retained for every race, including race-specific action IDs. Unsupported imports are recorded, not treated as accepted parity. Gear and consumables are absent.

Intervals are approximate 95% Monte Carlo intervals for independent-engine mean differences. At 100 trials they are noisy, and intervals are not adjusted for multiple comparisons. Equal seeds do not pair RNG streams. Small total differences can hide offsetting spell errors.

| Preset | Cases | Mean absolute delta % | Worst absolute delta % |
| --- | ---: | ---: | ---: |
| demo_shadow_brand | 9 | 0.76 | 1.47 |

## Largest observed total differences

| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| demo_shadow_brand | GNOME | hit_5 | 653.72 | 663.32 | 1.47 | 9.61 ± 3.34 |
| demo_shadow_brand | GNOME | hit_0 | 614.99 | 623.19 | 1.33 | 8.20 ± 3.39 |
| demo_shadow_brand | ORC | baseline | 712.90 | 719.50 | 0.93 | 6.60 ± 2.89 |
| demo_shadow_brand | GNOME | baseline | 707.83 | 713.72 | 0.83 | 5.89 ± 2.81 |
| demo_shadow_brand | ORC | hit_0 | 621.96 | 626.49 | 0.73 | 4.53 ± 3.58 |
| demo_shadow_brand | ORC | hit_5 | 662.16 | 666.11 | 0.60 | 3.95 ± 3.32 |
| demo_shadow_brand | HUMAN | hit_5 | 664.84 | 667.23 | 0.36 | 2.39 ± 3.45 |
| demo_shadow_brand | HUMAN | baseline | 715.71 | 718.17 | 0.34 | 2.45 ± 2.87 |
| demo_shadow_brand | HUMAN | hit_0 | 624.25 | 625.91 | 0.27 | 1.66 ± 3.58 |

## All combinations

| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% | Stat differences | Group omissions |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| demo_shadow_brand | GNOME | baseline | 707.83 | 713.72 | 0.83 | 5.89 ± 2.81 | 0 | 5 |
| demo_shadow_brand | GNOME | hit_0 | 614.99 | 623.19 | 1.33 | 8.20 ± 3.39 | 0 | 5 |
| demo_shadow_brand | GNOME | hit_5 | 653.72 | 663.32 | 1.47 | 9.61 ± 3.34 | 0 | 5 |
| demo_shadow_brand | ORC | baseline | 712.90 | 719.50 | 0.93 | 6.60 ± 2.89 | 0 | 5 |
| demo_shadow_brand | ORC | hit_0 | 621.96 | 626.49 | 0.73 | 4.53 ± 3.58 | 0 | 5 |
| demo_shadow_brand | ORC | hit_5 | 662.16 | 666.11 | 0.60 | 3.95 ± 3.32 | 0 | 5 |
| demo_shadow_brand | HUMAN | baseline | 715.71 | 718.17 | 0.34 | 2.45 ± 2.87 | 0 | 5 |
| demo_shadow_brand | HUMAN | hit_0 | 624.25 | 625.91 | 0.27 | 1.66 ± 3.58 | 0 | 5 |
| demo_shadow_brand | HUMAN | hit_5 | 664.84 | 667.23 | 0.36 | 2.39 ± 3.45 | 0 | 5 |

The JSON companion includes exact requests, resolved app configs, source/app hashes, input differences, import diagnostics, and spell/pet breakdowns. Existing five-preset benchmark artifacts are unchanged.
