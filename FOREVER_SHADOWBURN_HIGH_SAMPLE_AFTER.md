# Forever race/stat diagnostic sweep

complete: 4/4 combinations completed; 10000 fights per engine per combination, seed 101.

Higher-sample Troll Destruction follow-up: four representative profiles, unchanged gear-free scenario.

**Diagnostic only.** Source APLs are retained for every race, including race-specific action IDs. Unsupported imports are recorded, not treated as accepted parity. Gear and consumables are absent.

Intervals are approximate 95% Monte Carlo intervals for independent-engine mean differences. At 100 trials they are noisy, and intervals are not adjusted for multiple comparisons. Equal seeds do not pair RNG streams. Small total differences can hide offsetting spell errors.

| Preset | Cases | Mean absolute delta % | Worst absolute delta % |
| --- | ---: | ---: | ---: |
| destro | 4 | 0.06 | 0.08 |

## Largest observed total differences

| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| destro | TROLL | sp_1000 | 956.86 | 957.63 | 0.08 | 0.77 ± 0.94 |
| destro | TROLL | baseline | 632.16 | 632.67 | 0.08 | 0.50 ± 0.61 |
| destro | TROLL | int_400 | 674.69 | 674.34 | -0.05 | -0.35 ± 0.65 |
| destro | TROLL | regen_high | 666.05 | 665.82 | -0.03 | -0.23 ± 0.62 |

## All combinations

| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% | Stat differences | Group omissions |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| destro | TROLL | baseline | 632.16 | 632.67 | 0.08 | 0.50 ± 0.61 | 0 | 1 |
| destro | TROLL | sp_1000 | 956.86 | 957.63 | 0.08 | 0.77 ± 0.94 | 0 | 1 |
| destro | TROLL | int_400 | 674.69 | 674.34 | -0.05 | -0.35 ± 0.65 | 0 | 1 |
| destro | TROLL | regen_high | 666.05 | 665.82 | -0.03 | -0.23 ± 0.62 | 0 | 1 |

The JSON companion includes exact requests, resolved app configs, source/app hashes, input differences, import diagnostics, and spell/pet breakdowns. Existing five-preset benchmark artifacts are unchanged.
