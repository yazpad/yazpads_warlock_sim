# Forever race/stat diagnostic sweep

complete: 9/9 combinations completed; 1000 fights per engine per combination, seed 101.

Targeted low-hit Shadow Brand investigation: three races and bonus hit 0/5/12, source APL preserved.

**Diagnostic only.** Source APLs are retained for every race, including race-specific action IDs. Unsupported imports are recorded, not treated as accepted parity. Gear and consumables are absent.

Intervals are approximate 95% Monte Carlo intervals for independent-engine mean differences. At 100 trials they are noisy, and intervals are not adjusted for multiple comparisons. Equal seeds do not pair RNG streams. Small total differences can hide offsetting spell errors.

| Preset | Cases | Mean absolute delta % | Worst absolute delta % |
| --- | ---: | ---: | ---: |
| demo_shadow_brand | 9 | 1.77 | 3.04 |

## Largest observed total differences

| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| demo_shadow_brand | GNOME | hit_0 | 614.99 | 633.71 | 3.04 | 18.72 ± 3.24 |
| demo_shadow_brand | GNOME | hit_5 | 653.72 | 670.65 | 2.59 | 16.93 ± 3.16 |
| demo_shadow_brand | ORC | hit_0 | 621.96 | 635.87 | 2.24 | 13.91 ± 3.44 |
| demo_shadow_brand | HUMAN | hit_0 | 624.25 | 636.63 | 1.98 | 12.38 ± 3.37 |
| demo_shadow_brand | ORC | hit_5 | 662.16 | 673.08 | 1.65 | 10.92 ± 3.17 |
| demo_shadow_brand | HUMAN | hit_5 | 664.84 | 674.30 | 1.42 | 9.46 ± 3.26 |
| demo_shadow_brand | ORC | baseline | 712.90 | 721.62 | 1.22 | 8.71 ± 2.84 |
| demo_shadow_brand | GNOME | baseline | 707.83 | 715.94 | 1.15 | 8.11 ± 2.75 |
| demo_shadow_brand | HUMAN | baseline | 715.71 | 720.03 | 0.60 | 4.32 ± 2.84 |

## All combinations

| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% | Stat differences | Group omissions |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| demo_shadow_brand | GNOME | baseline | 707.83 | 715.94 | 1.15 | 8.11 ± 2.75 | 0 | 5 |
| demo_shadow_brand | GNOME | hit_0 | 614.99 | 633.71 | 3.04 | 18.72 ± 3.24 | 0 | 5 |
| demo_shadow_brand | GNOME | hit_5 | 653.72 | 670.65 | 2.59 | 16.93 ± 3.16 | 0 | 5 |
| demo_shadow_brand | ORC | baseline | 712.90 | 721.62 | 1.22 | 8.71 ± 2.84 | 0 | 5 |
| demo_shadow_brand | ORC | hit_0 | 621.96 | 635.87 | 2.24 | 13.91 ± 3.44 | 0 | 5 |
| demo_shadow_brand | ORC | hit_5 | 662.16 | 673.08 | 1.65 | 10.92 ± 3.17 | 0 | 5 |
| demo_shadow_brand | HUMAN | baseline | 715.71 | 720.03 | 0.60 | 4.32 ± 2.84 | 0 | 5 |
| demo_shadow_brand | HUMAN | hit_0 | 624.25 | 636.63 | 1.98 | 12.38 ± 3.37 | 0 | 5 |
| demo_shadow_brand | HUMAN | hit_5 | 664.84 | 674.30 | 1.42 | 9.46 ± 3.26 | 0 | 5 |

The JSON companion includes exact requests, resolved app configs, source/app hashes, input differences, import diagnostics, and spell/pet breakdowns. Existing five-preset benchmark artifacts are unchanged.
