# Forever race/stat diagnostic sweep

complete: 20/20 combinations completed; 10000 fights per engine per combination, seed 101.

Balanced higher-sample Shadowburn check: Destruction, five races, four profiles, unchanged source requests/gear-free scenario.

**Diagnostic only.** Source APLs are retained for every race, including race-specific action IDs. Unsupported imports are recorded, not treated as accepted parity. Gear and consumables are absent.

Intervals are approximate 95% Monte Carlo intervals for independent-engine mean differences. At 100 trials they are noisy, and intervals are not adjusted for multiple comparisons. Equal seeds do not pair RNG streams. Small total differences can hide offsetting spell errors.

| Preset | Cases | Mean absolute delta % | Worst absolute delta % |
| --- | ---: | ---: | ---: |
| destro | 20 | 0.06 | 0.17 |

## Largest observed total differences

| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| destro | GNOME | int_400 | 674.53 | 673.35 | -0.17 | -1.17 ± 0.65 |
| destro | GNOME | baseline | 637.72 | 636.83 | -0.14 | -0.89 ± 0.61 |
| destro | ORC | int_400 | 681.48 | 682.43 | 0.14 | 0.95 ± 0.67 |
| destro | GNOME | sp_1000 | 965.89 | 964.60 | -0.13 | -1.29 ± 0.94 |
| destro | ORC | sp_1000 | 977.00 | 977.90 | 0.09 | 0.90 ± 0.97 |
| destro | TROLL | sp_1000 | 956.86 | 957.63 | 0.08 | 0.77 ± 0.94 |
| destro | TROLL | baseline | 632.16 | 632.67 | 0.08 | 0.50 ± 0.61 |
| destro | ORC | baseline | 643.88 | 644.27 | 0.06 | 0.39 ± 0.63 |
| destro | TROLL | int_400 | 674.69 | 674.34 | -0.05 | -0.35 ± 0.65 |
| destro | UNDEAD | regen_high | 666.07 | 666.33 | 0.04 | 0.26 ± 0.62 |
| destro | TROLL | regen_high | 666.05 | 665.82 | -0.03 | -0.23 ± 0.62 |
| destro | ORC | regen_high | 676.18 | 676.37 | 0.03 | 0.20 ± 0.64 |
| destro | HUMAN | regen_high | 671.35 | 671.53 | 0.03 | 0.18 ± 0.64 |
| destro | HUMAN | int_400 | 676.55 | 676.38 | -0.03 | -0.18 ± 0.66 |
| destro | UNDEAD | baseline | 642.03 | 641.90 | -0.02 | -0.13 ± 0.61 |
| destro | GNOME | regen_high | 680.18 | 680.31 | 0.02 | 0.12 ± 0.68 |
| destro | UNDEAD | sp_1000 | 968.65 | 968.48 | -0.02 | -0.17 ± 0.94 |
| destro | HUMAN | baseline | 646.40 | 646.34 | -0.01 | -0.06 ± 0.63 |
| destro | HUMAN | sp_1000 | 980.08 | 980.01 | -0.01 | -0.07 ± 0.97 |
| destro | UNDEAD | int_400 | 677.16 | 677.16 | -0.00 | -0.01 ± 0.65 |

## All combinations

| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% | Stat differences | Group omissions |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| destro | HUMAN | baseline | 646.40 | 646.34 | -0.01 | -0.06 ± 0.63 | 0 | 1 |
| destro | HUMAN | sp_1000 | 980.08 | 980.01 | -0.01 | -0.07 ± 0.97 | 0 | 1 |
| destro | HUMAN | int_400 | 676.55 | 676.38 | -0.03 | -0.18 ± 0.66 | 0 | 1 |
| destro | HUMAN | regen_high | 671.35 | 671.53 | 0.03 | 0.18 ± 0.64 | 0 | 1 |
| destro | ORC | baseline | 643.88 | 644.27 | 0.06 | 0.39 ± 0.63 | 0 | 1 |
| destro | ORC | sp_1000 | 977.00 | 977.90 | 0.09 | 0.90 ± 0.97 | 0 | 1 |
| destro | ORC | int_400 | 681.48 | 682.43 | 0.14 | 0.95 ± 0.67 | 0 | 1 |
| destro | ORC | regen_high | 676.18 | 676.37 | 0.03 | 0.20 ± 0.64 | 0 | 1 |
| destro | UNDEAD | baseline | 642.03 | 641.90 | -0.02 | -0.13 ± 0.61 | 0 | 1 |
| destro | UNDEAD | sp_1000 | 968.65 | 968.48 | -0.02 | -0.17 ± 0.94 | 0 | 1 |
| destro | UNDEAD | int_400 | 677.16 | 677.16 | -0.00 | -0.01 ± 0.65 | 0 | 1 |
| destro | UNDEAD | regen_high | 666.07 | 666.33 | 0.04 | 0.26 ± 0.62 | 0 | 1 |
| destro | TROLL | baseline | 632.16 | 632.67 | 0.08 | 0.50 ± 0.61 | 0 | 1 |
| destro | TROLL | sp_1000 | 956.86 | 957.63 | 0.08 | 0.77 ± 0.94 | 0 | 1 |
| destro | TROLL | int_400 | 674.69 | 674.34 | -0.05 | -0.35 ± 0.65 | 0 | 1 |
| destro | TROLL | regen_high | 666.05 | 665.82 | -0.03 | -0.23 ± 0.62 | 0 | 1 |
| destro | GNOME | baseline | 637.72 | 636.83 | -0.14 | -0.89 ± 0.61 | 0 | 1 |
| destro | GNOME | sp_1000 | 965.89 | 964.60 | -0.13 | -1.29 ± 0.94 | 0 | 1 |
| destro | GNOME | int_400 | 674.53 | 673.35 | -0.17 | -1.17 ± 0.65 | 0 | 1 |
| destro | GNOME | regen_high | 680.18 | 680.31 | 0.02 | 0.12 ± 0.68 | 0 | 1 |

The JSON companion includes exact requests, resolved app configs, source/app hashes, input differences, import diagnostics, and spell/pet breakdowns. Existing five-preset benchmark artifacts are unchanged.
