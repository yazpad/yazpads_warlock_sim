# Forever race/stat diagnostic sweep

complete: 60/60 combinations completed; 1000 fights per engine per combination, seed 101.

Higher-sample follow-up of the 2026-10-20 sweep outlier profiles: five presets × Orc/Undead/Gnome × hit_5/hit_16/regen_low/regen_high. Diagnostic; selected after screening the 300-case sweep.

**Diagnostic only.** Source APLs are retained for every race, including race-specific action IDs. Unsupported imports are recorded, not treated as accepted parity. Gear and consumables are absent.

Intervals are approximate 95% Monte Carlo intervals for independent-engine mean differences. At 100 trials they are noisy, and intervals are not adjusted for multiple comparisons. Equal seeds do not pair RNG streams. Small total differences can hide offsetting spell errors.

| Preset | Cases | Mean absolute delta % | Worst absolute delta % |
| --- | ---: | ---: | ---: |
| sm_ruin | 12 | 0.33 | 0.67 |
| aff_wrack | 12 | 0.70 | 1.69 |
| destro | 12 | 0.84 | 3.35 |
| demo_shadow_brand | 12 | 0.42 | 0.98 |
| demo_fire_brand | 12 | 0.45 | 1.35 |

## Largest observed total differences

| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| destro | GNOME | regen_high | 679.29 | 656.53 | -3.35 | -22.76 ± 2.07 |
| aff_wrack | UNDEAD | regen_low | 537.06 | 528.01 | -1.69 | -9.05 ± 1.65 |
| aff_wrack | ORC | regen_low | 539.40 | 530.77 | -1.60 | -8.63 ± 1.63 |
| aff_wrack | GNOME | regen_low | 538.70 | 530.77 | -1.47 | -7.93 ± 1.65 |
| destro | ORC | regen_high | 677.36 | 667.66 | -1.43 | -9.70 ± 2.04 |
| demo_fire_brand | ORC | hit_16 | 779.78 | 790.30 | 1.35 | 10.52 ± 1.60 |
| destro | UNDEAD | hit_16 | 642.59 | 634.83 | -1.21 | -7.77 ± 1.99 |
| destro | UNDEAD | hit_5 | 602.27 | 596.00 | -1.04 | -6.27 ± 2.43 |
| demo_shadow_brand | GNOME | hit_5 | 653.72 | 660.14 | 0.98 | 6.42 ± 3.32 |
| demo_fire_brand | ORC | regen_high | 771.26 | 778.48 | 0.94 | 7.21 ± 1.97 |
| aff_wrack | UNDEAD | hit_5 | 533.76 | 528.80 | -0.93 | -4.97 ± 1.99 |
| destro | GNOME | regen_low | 620.82 | 615.96 | -0.78 | -4.86 ± 1.94 |
| destro | UNDEAD | regen_high | 667.24 | 662.03 | -0.78 | -5.21 ± 1.96 |
| demo_fire_brand | ORC | regen_low | 730.26 | 735.74 | 0.75 | 5.48 ± 2.02 |
| demo_fire_brand | UNDEAD | hit_16 | 787.08 | 781.28 | -0.74 | -5.79 ± 1.56 |
| aff_wrack | UNDEAD | hit_16 | 559.44 | 555.33 | -0.74 | -4.12 ± 1.62 |
| demo_shadow_brand | GNOME | regen_high | 736.59 | 741.87 | 0.72 | 5.28 ± 2.82 |
| demo_shadow_brand | ORC | hit_16 | 743.31 | 748.30 | 0.67 | 4.98 ± 2.62 |
| sm_ruin | GNOME | regen_high | 662.79 | 667.20 | 0.67 | 4.41 ± 3.03 |
| sm_ruin | UNDEAD | regen_low | 624.51 | 620.63 | -0.62 | -3.87 ± 2.92 |

## All combinations

| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% | Stat differences | Group omissions |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| sm_ruin | ORC | hit_5 | 607.75 | 605.85 | -0.31 | -1.90 ± 3.31 | 0 | 1 |
| sm_ruin | ORC | hit_16 | 647.77 | 648.62 | 0.13 | 0.85 ± 2.90 | 0 | 1 |
| sm_ruin | ORC | regen_low | 629.07 | 628.14 | -0.15 | -0.93 ± 2.93 | 0 | 1 |
| sm_ruin | ORC | regen_high | 673.65 | 672.54 | -0.17 | -1.11 ± 2.99 | 0 | 1 |
| sm_ruin | UNDEAD | hit_5 | 604.71 | 603.13 | -0.26 | -1.58 ± 3.36 | 0 | 1 |
| sm_ruin | UNDEAD | hit_16 | 644.36 | 642.25 | -0.33 | -2.11 ± 2.89 | 0 | 1 |
| sm_ruin | UNDEAD | regen_low | 624.51 | 620.63 | -0.62 | -3.87 ± 2.92 | 0 | 1 |
| sm_ruin | UNDEAD | regen_high | 669.25 | 666.72 | -0.38 | -2.53 ± 2.98 | 0 | 1 |
| sm_ruin | GNOME | hit_5 | 602.69 | 601.42 | -0.21 | -1.27 ± 3.35 | 0 | 1 |
| sm_ruin | GNOME | hit_16 | 640.54 | 644.24 | 0.58 | 3.70 ± 2.97 | 0 | 1 |
| sm_ruin | GNOME | regen_low | 622.28 | 623.45 | 0.19 | 1.17 ± 2.90 | 0 | 1 |
| sm_ruin | GNOME | regen_high | 662.79 | 667.20 | 0.67 | 4.41 ± 3.03 | 0 | 1 |
| aff_wrack | ORC | hit_5 | 533.36 | 533.07 | -0.05 | -0.29 ± 1.97 | 0 | 2 |
| aff_wrack | ORC | hit_16 | 558.98 | 557.40 | -0.28 | -1.59 ± 1.68 | 0 | 2 |
| aff_wrack | ORC | regen_low | 539.40 | 530.77 | -1.60 | -8.63 ± 1.63 | 0 | 2 |
| aff_wrack | ORC | regen_high | 570.08 | 568.91 | -0.20 | -1.17 ± 1.99 | 0 | 2 |
| aff_wrack | UNDEAD | hit_5 | 533.76 | 528.80 | -0.93 | -4.97 ± 1.99 | 0 | 2 |
| aff_wrack | UNDEAD | hit_16 | 559.44 | 555.33 | -0.74 | -4.12 ± 1.62 | 0 | 2 |
| aff_wrack | UNDEAD | regen_low | 537.06 | 528.01 | -1.69 | -9.05 ± 1.65 | 0 | 2 |
| aff_wrack | UNDEAD | regen_high | 568.46 | 571.59 | 0.55 | 3.13 ± 1.83 | 0 | 2 |
| aff_wrack | GNOME | hit_5 | 529.80 | 528.99 | -0.15 | -0.81 ± 1.96 | 0 | 2 |
| aff_wrack | GNOME | hit_16 | 553.44 | 550.66 | -0.50 | -2.78 ± 1.67 | 0 | 2 |
| aff_wrack | GNOME | regen_low | 538.70 | 530.77 | -1.47 | -7.93 ± 1.65 | 0 | 2 |
| aff_wrack | GNOME | regen_high | 568.39 | 566.91 | -0.26 | -1.48 ± 1.79 | 0 | 2 |
| destro | ORC | hit_5 | 603.17 | 600.57 | -0.43 | -2.60 ± 2.52 | 0 | 1 |
| destro | ORC | hit_16 | 643.96 | 642.24 | -0.27 | -1.72 ± 2.03 | 0 | 1 |
| destro | ORC | regen_low | 620.49 | 621.12 | 0.10 | 0.63 ± 1.95 | 0 | 1 |
| destro | ORC | regen_high | 677.36 | 667.66 | -1.43 | -9.70 ± 2.04 | 0 | 1 |
| destro | UNDEAD | hit_5 | 602.27 | 596.00 | -1.04 | -6.27 ± 2.43 | 0 | 1 |
| destro | UNDEAD | hit_16 | 642.59 | 634.83 | -1.21 | -7.77 ± 1.99 | 0 | 1 |
| destro | UNDEAD | regen_low | 613.54 | 614.41 | 0.14 | 0.87 ± 1.89 | 0 | 1 |
| destro | UNDEAD | regen_high | 667.24 | 662.03 | -0.78 | -5.21 ± 1.96 | 0 | 1 |
| destro | GNOME | hit_5 | 599.50 | 597.53 | -0.33 | -1.97 ± 2.40 | 0 | 1 |
| destro | GNOME | hit_16 | 637.71 | 639.08 | 0.22 | 1.38 ± 2.02 | 0 | 1 |
| destro | GNOME | regen_low | 620.82 | 615.96 | -0.78 | -4.86 ± 1.94 | 0 | 1 |
| destro | GNOME | regen_high | 679.29 | 656.53 | -3.35 | -22.76 ± 2.07 | 0 | 1 |
| demo_shadow_brand | ORC | hit_5 | 662.16 | 666.11 | 0.60 | 3.95 ± 3.32 | 0 | 1 |
| demo_shadow_brand | ORC | hit_16 | 743.31 | 748.30 | 0.67 | 4.98 ± 2.62 | 0 | 1 |
| demo_shadow_brand | ORC | regen_low | 691.30 | 689.74 | -0.23 | -1.56 ± 2.73 | 0 | 1 |
| demo_shadow_brand | ORC | regen_high | 743.14 | 744.04 | 0.12 | 0.90 ± 2.91 | 0 | 1 |
| demo_shadow_brand | UNDEAD | hit_5 | 657.93 | 659.73 | 0.27 | 1.81 ± 3.14 | 0 | 1 |
| demo_shadow_brand | UNDEAD | hit_16 | 741.37 | 740.83 | -0.07 | -0.53 ± 2.54 | 0 | 1 |
| demo_shadow_brand | UNDEAD | regen_low | 688.58 | 685.45 | -0.45 | -3.13 ± 2.73 | 0 | 1 |
| demo_shadow_brand | UNDEAD | regen_high | 739.03 | 737.42 | -0.22 | -1.61 ± 2.93 | 0 | 1 |
| demo_shadow_brand | GNOME | hit_5 | 653.72 | 660.14 | 0.98 | 6.42 ± 3.32 | 0 | 1 |
| demo_shadow_brand | GNOME | hit_16 | 737.34 | 740.34 | 0.41 | 3.01 ± 2.54 | 0 | 1 |
| demo_shadow_brand | GNOME | regen_low | 682.67 | 684.84 | 0.32 | 2.17 ± 2.76 | 0 | 1 |
| demo_shadow_brand | GNOME | regen_high | 736.59 | 741.87 | 0.72 | 5.28 ± 2.82 | 0 | 1 |
| demo_fire_brand | ORC | hit_5 | 696.96 | 699.43 | 0.35 | 2.47 ± 2.46 | 2 | 1 |
| demo_fire_brand | ORC | hit_16 | 779.78 | 790.30 | 1.35 | 10.52 ± 1.60 | 2 | 1 |
| demo_fire_brand | ORC | regen_low | 730.26 | 735.74 | 0.75 | 5.48 ± 2.02 | 2 | 1 |
| demo_fire_brand | ORC | regen_high | 771.26 | 778.48 | 0.94 | 7.21 ± 1.97 | 2 | 1 |
| demo_fire_brand | UNDEAD | hit_5 | 695.05 | 692.96 | -0.30 | -2.09 ± 2.49 | 2 | 1 |
| demo_fire_brand | UNDEAD | hit_16 | 787.08 | 781.28 | -0.74 | -5.79 ± 1.56 | 2 | 1 |
| demo_fire_brand | UNDEAD | regen_low | 730.65 | 728.12 | -0.35 | -2.53 ± 2.03 | 2 | 1 |
| demo_fire_brand | UNDEAD | regen_high | 769.86 | 770.22 | 0.05 | 0.36 ± 1.97 | 2 | 1 |
| demo_fire_brand | GNOME | hit_5 | 693.17 | 691.84 | -0.19 | -1.33 ± 2.48 | 2 | 1 |
| demo_fire_brand | GNOME | hit_16 | 774.13 | 772.81 | -0.17 | -1.32 ± 1.57 | 2 | 1 |
| demo_fire_brand | GNOME | regen_low | 728.44 | 728.02 | -0.06 | -0.42 ± 2.01 | 2 | 1 |
| demo_fire_brand | GNOME | regen_high | 770.26 | 771.54 | 0.17 | 1.28 ± 2.00 | 2 | 1 |

The JSON companion includes exact requests, resolved app configs, source/app hashes, input differences, import diagnostics, and spell/pet breakdowns. Existing five-preset benchmark artifacts are unchanged.
