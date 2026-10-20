# Forever race/stat diagnostic sweep

complete: 300/300 combinations completed; 100 fights per engine per combination, seed 101.

Full preset × race × profile sweep. Profiles change one baseline stat at a time, except regeneration profiles which jointly change spirit and mp5. All stats are bonuses above racial/class bases. Gear-free, 180s, zero distance, external CoE only, no consumables. Source APLs are retained, including their race-specific action IDs; this measures import behavior rather than optimizing each race's rotation.

**Diagnostic only.** Source APLs are retained for every race, including race-specific action IDs. Unsupported imports are recorded, not treated as accepted parity. Gear and consumables are absent.

Intervals are approximate 95% Monte Carlo intervals for independent-engine mean differences. At 100 trials they are noisy, and intervals are not adjusted for multiple comparisons. Equal seeds do not pair RNG streams. Small total differences can hide offsetting spell errors.

| Preset | Cases | Mean absolute delta % | Worst absolute delta % |
| --- | ---: | ---: | ---: |
| sm_ruin | 60 | 0.73 | 1.55 |
| aff_wrack | 60 | 0.66 | 2.00 |
| destro | 60 | 0.83 | 3.04 |
| demo_shadow_brand | 60 | 0.77 | 2.75 |
| demo_fire_brand | 60 | 0.53 | 1.71 |

## Largest observed total differences

| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| destro | GNOME | regen_high | 675.93 | 655.40 | -3.04 | -20.54 ± 6.58 |
| demo_shadow_brand | ORC | hit_5 | 652.98 | 670.93 | 2.75 | 17.95 ± 9.40 |
| demo_shadow_brand | TROLL | hit_0 | 608.86 | 623.83 | 2.46 | 14.97 ± 10.86 |
| destro | UNDEAD | int_400 | 676.28 | 661.96 | -2.12 | -14.32 ± 6.05 |
| destro | TROLL | int_400 | 670.29 | 656.37 | -2.08 | -13.92 ± 6.59 |
| demo_shadow_brand | GNOME | hit_0 | 610.96 | 623.64 | 2.08 | 12.68 ± 11.47 |
| aff_wrack | UNDEAD | regen_low | 537.48 | 526.71 | -2.00 | -10.77 ± 5.43 |
| aff_wrack | TROLL | int_0 | 517.14 | 507.24 | -1.92 | -9.90 ± 4.68 |
| destro | HUMAN | crit_0 | 568.18 | 557.52 | -1.88 | -10.66 ± 4.22 |
| destro | UNDEAD | hit_5 | 605.98 | 594.64 | -1.87 | -11.35 ± 7.58 |
| demo_shadow_brand | GNOME | hit_5 | 650.18 | 662.21 | 1.85 | 12.03 ± 10.44 |
| destro | HUMAN | sp_1000 | 974.92 | 956.92 | -1.85 | -18.00 ± 9.59 |
| aff_wrack | UNDEAD | crit_0 | 492.13 | 483.04 | -1.85 | -9.08 ± 4.14 |
| destro | HUMAN | baseline | 642.86 | 631.33 | -1.79 | -11.53 ± 6.23 |
| destro | HUMAN | hit_16 | 642.86 | 631.33 | -1.79 | -11.53 ± 6.23 |
| demo_shadow_brand | UNDEAD | hit_0 | 611.38 | 622.28 | 1.78 | 10.91 ± 11.09 |
| demo_shadow_brand | ORC | crit_30 | 794.80 | 808.85 | 1.77 | 14.05 ± 9.74 |
| demo_shadow_brand | ORC | hit_0 | 614.72 | 625.45 | 1.75 | 10.73 ± 11.25 |
| destro | HUMAN | sp_250 | 476.83 | 468.53 | -1.74 | -8.30 ± 4.56 |
| aff_wrack | HUMAN | sp_250 | 408.04 | 400.95 | -1.74 | -7.09 ± 4.04 |

## All combinations

| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% | Stat differences | Group omissions |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| sm_ruin | HUMAN | baseline | 652.19 | 649.78 | -0.37 | -2.41 ± 8.80 | 0 | 1 |
| sm_ruin | HUMAN | sp_250 | 475.04 | 473.00 | -0.43 | -2.04 ± 6.27 | 0 | 1 |
| sm_ruin | HUMAN | sp_1000 | 1006.49 | 1003.35 | -0.31 | -3.14 ± 13.87 | 0 | 1 |
| sm_ruin | HUMAN | int_0 | 616.38 | 609.97 | -1.04 | -6.41 ± 9.14 | 0 | 1 |
| sm_ruin | HUMAN | int_400 | 688.05 | 690.44 | 0.35 | 2.39 ± 9.40 | 0 | 1 |
| sm_ruin | HUMAN | hit_0 | 574.68 | 582.57 | 1.37 | 7.89 ± 10.63 | 0 | 1 |
| sm_ruin | HUMAN | hit_5 | 609.98 | 608.34 | -0.27 | -1.64 ± 10.27 | 0 | 1 |
| sm_ruin | HUMAN | hit_16 | 652.19 | 649.78 | -0.37 | -2.41 ± 8.80 | 0 | 1 |
| sm_ruin | HUMAN | crit_0 | 552.00 | 550.34 | -0.30 | -1.66 ± 6.59 | 0 | 1 |
| sm_ruin | HUMAN | crit_30 | 747.76 | 740.72 | -0.94 | -7.04 ± 9.64 | 0 | 1 |
| sm_ruin | HUMAN | regen_low | 628.01 | 621.44 | -1.05 | -6.57 ± 7.84 | 0 | 1 |
| sm_ruin | HUMAN | regen_high | 678.41 | 674.53 | -0.57 | -3.87 ± 9.58 | 0 | 1 |
| sm_ruin | ORC | baseline | 639.91 | 649.03 | 1.43 | 9.12 ± 9.00 | 0 | 1 |
| sm_ruin | ORC | sp_250 | 465.34 | 471.89 | 1.41 | 6.55 ± 6.39 | 0 | 1 |
| sm_ruin | ORC | sp_1000 | 989.07 | 1003.32 | 1.44 | 14.25 ± 14.25 | 0 | 1 |
| sm_ruin | ORC | int_0 | 606.57 | 609.18 | 0.43 | 2.60 ± 8.76 | 0 | 1 |
| sm_ruin | ORC | int_400 | 687.05 | 689.58 | 0.37 | 2.53 ± 9.62 | 0 | 1 |
| sm_ruin | ORC | hit_0 | 574.09 | 580.54 | 1.12 | 6.45 ± 11.13 | 0 | 1 |
| sm_ruin | ORC | hit_5 | 610.32 | 608.40 | -0.32 | -1.92 ± 10.70 | 0 | 1 |
| sm_ruin | ORC | hit_16 | 639.91 | 649.03 | 1.43 | 9.12 ± 9.00 | 0 | 1 |
| sm_ruin | ORC | crit_0 | 543.37 | 550.64 | 1.34 | 7.27 ± 6.90 | 0 | 1 |
| sm_ruin | ORC | crit_30 | 736.07 | 743.88 | 1.06 | 7.81 ± 9.29 | 0 | 1 |
| sm_ruin | ORC | regen_low | 627.20 | 626.44 | -0.12 | -0.75 ± 8.28 | 0 | 1 |
| sm_ruin | ORC | regen_high | 670.98 | 673.12 | 0.32 | 2.14 ± 8.77 | 0 | 1 |
| sm_ruin | UNDEAD | baseline | 636.16 | 643.50 | 1.15 | 7.34 ± 9.31 | 0 | 1 |
| sm_ruin | UNDEAD | sp_250 | 465.51 | 470.43 | 1.06 | 4.92 ± 6.62 | 0 | 1 |
| sm_ruin | UNDEAD | sp_1000 | 977.46 | 989.65 | 1.25 | 12.18 ± 14.71 | 0 | 1 |
| sm_ruin | UNDEAD | int_0 | 603.41 | 602.54 | -0.14 | -0.87 ± 7.99 | 0 | 1 |
| sm_ruin | UNDEAD | int_400 | 681.47 | 685.10 | 0.53 | 3.64 ± 10.12 | 0 | 1 |
| sm_ruin | UNDEAD | hit_0 | 565.01 | 573.79 | 1.55 | 8.78 ± 10.64 | 0 | 1 |
| sm_ruin | UNDEAD | hit_5 | 604.02 | 604.52 | 0.08 | 0.50 ± 10.32 | 0 | 1 |
| sm_ruin | UNDEAD | hit_16 | 636.16 | 643.50 | 1.15 | 7.34 ± 9.31 | 0 | 1 |
| sm_ruin | UNDEAD | crit_0 | 541.03 | 541.84 | 0.15 | 0.80 ± 6.23 | 0 | 1 |
| sm_ruin | UNDEAD | crit_30 | 732.46 | 740.99 | 1.16 | 8.53 ± 9.88 | 0 | 1 |
| sm_ruin | UNDEAD | regen_low | 621.60 | 617.07 | -0.73 | -4.52 ± 8.05 | 0 | 1 |
| sm_ruin | UNDEAD | regen_high | 665.90 | 665.86 | -0.01 | -0.04 ± 9.13 | 0 | 1 |
| sm_ruin | TROLL | baseline | 630.88 | 639.13 | 1.31 | 8.25 ± 8.76 | 0 | 1 |
| sm_ruin | TROLL | sp_250 | 459.74 | 465.25 | 1.20 | 5.52 ± 6.25 | 0 | 1 |
| sm_ruin | TROLL | sp_1000 | 973.16 | 986.88 | 1.41 | 13.71 ± 13.79 | 0 | 1 |
| sm_ruin | TROLL | int_0 | 601.12 | 599.43 | -0.28 | -1.69 ± 8.73 | 0 | 1 |
| sm_ruin | TROLL | int_400 | 670.64 | 676.13 | 0.82 | 5.49 ± 9.40 | 0 | 1 |
| sm_ruin | TROLL | hit_0 | 565.38 | 570.38 | 0.88 | 5.00 ± 10.04 | 0 | 1 |
| sm_ruin | TROLL | hit_5 | 597.38 | 600.36 | 0.50 | 2.97 ± 9.94 | 0 | 1 |
| sm_ruin | TROLL | hit_16 | 630.88 | 639.13 | 1.31 | 8.25 ± 8.76 | 0 | 1 |
| sm_ruin | TROLL | crit_0 | 537.81 | 539.65 | 0.34 | 1.84 ± 6.67 | 0 | 1 |
| sm_ruin | TROLL | crit_30 | 726.80 | 732.65 | 0.80 | 5.84 ± 9.31 | 0 | 1 |
| sm_ruin | TROLL | regen_low | 611.78 | 616.53 | 0.78 | 4.75 ± 8.19 | 0 | 1 |
| sm_ruin | TROLL | regen_high | 660.36 | 662.29 | 0.29 | 1.93 ± 8.49 | 0 | 1 |
| sm_ruin | GNOME | baseline | 638.15 | 640.94 | 0.44 | 2.79 ± 8.69 | 0 | 1 |
| sm_ruin | GNOME | sp_250 | 465.06 | 466.61 | 0.33 | 1.55 ± 6.23 | 0 | 1 |
| sm_ruin | GNOME | sp_1000 | 984.32 | 989.61 | 0.54 | 5.29 ± 13.64 | 0 | 1 |
| sm_ruin | GNOME | int_0 | 603.31 | 609.03 | 0.95 | 5.72 ± 9.72 | 0 | 1 |
| sm_ruin | GNOME | int_400 | 676.40 | 680.81 | 0.65 | 4.41 ± 10.21 | 0 | 1 |
| sm_ruin | GNOME | hit_0 | 568.92 | 565.11 | -0.67 | -3.81 ± 11.30 | 0 | 1 |
| sm_ruin | GNOME | hit_5 | 601.91 | 602.05 | 0.02 | 0.13 ± 10.37 | 0 | 1 |
| sm_ruin | GNOME | hit_16 | 638.15 | 640.94 | 0.44 | 2.79 ± 8.69 | 0 | 1 |
| sm_ruin | GNOME | crit_0 | 541.89 | 545.01 | 0.58 | 3.12 ± 7.18 | 0 | 1 |
| sm_ruin | GNOME | crit_30 | 733.27 | 735.80 | 0.34 | 2.53 ± 9.79 | 0 | 1 |
| sm_ruin | GNOME | regen_low | 615.44 | 616.96 | 0.25 | 1.52 ± 8.66 | 0 | 1 |
| sm_ruin | GNOME | regen_high | 664.11 | 673.30 | 1.38 | 9.19 ± 9.38 | 0 | 1 |
| aff_wrack | HUMAN | baseline | 561.43 | 552.29 | -1.63 | -9.14 ± 5.72 | 0 | 2 |
| aff_wrack | HUMAN | sp_250 | 408.04 | 400.95 | -1.74 | -7.09 ± 4.04 | 0 | 2 |
| aff_wrack | HUMAN | sp_1000 | 868.21 | 854.97 | -1.53 | -13.24 ± 9.10 | 0 | 2 |
| aff_wrack | HUMAN | int_0 | 531.97 | 526.30 | -1.07 | -5.67 ± 4.55 | 0 | 2 |
| aff_wrack | HUMAN | int_400 | 589.88 | 592.38 | 0.42 | 2.51 ± 5.85 | 0 | 2 |
| aff_wrack | HUMAN | hit_0 | 514.54 | 516.79 | 0.44 | 2.25 ± 6.61 | 0 | 2 |
| aff_wrack | HUMAN | hit_5 | 535.14 | 533.85 | -0.24 | -1.29 ± 5.83 | 0 | 2 |
| aff_wrack | HUMAN | hit_16 | 561.43 | 552.29 | -1.63 | -9.14 ± 5.72 | 0 | 2 |
| aff_wrack | HUMAN | crit_0 | 488.57 | 483.33 | -1.07 | -5.24 ± 4.30 | 0 | 2 |
| aff_wrack | HUMAN | crit_30 | 628.16 | 623.24 | -0.78 | -4.92 ± 5.69 | 0 | 2 |
| aff_wrack | HUMAN | regen_low | 540.40 | 533.98 | -1.19 | -6.42 ± 5.40 | 0 | 2 |
| aff_wrack | HUMAN | regen_high | 574.67 | 577.49 | 0.49 | 2.81 ± 6.18 | 0 | 2 |
| aff_wrack | ORC | baseline | 556.23 | 553.49 | -0.49 | -2.74 ± 5.27 | 0 | 2 |
| aff_wrack | ORC | sp_250 | 403.48 | 401.66 | -0.45 | -1.82 ± 3.71 | 0 | 2 |
| aff_wrack | ORC | sp_1000 | 861.73 | 857.15 | -0.53 | -4.58 ± 8.43 | 0 | 2 |
| aff_wrack | ORC | int_0 | 526.06 | 524.22 | -0.35 | -1.84 ± 4.98 | 0 | 2 |
| aff_wrack | ORC | int_400 | 585.58 | 585.53 | -0.01 | -0.05 ± 5.78 | 0 | 2 |
| aff_wrack | ORC | hit_0 | 510.17 | 513.80 | 0.71 | 3.63 ± 6.21 | 0 | 2 |
| aff_wrack | ORC | hit_5 | 533.44 | 533.43 | -0.00 | -0.01 ± 6.08 | 0 | 2 |
| aff_wrack | ORC | hit_16 | 556.23 | 553.49 | -0.49 | -2.74 ± 5.27 | 0 | 2 |
| aff_wrack | ORC | crit_0 | 485.26 | 487.42 | 0.44 | 2.15 ± 4.56 | 0 | 2 |
| aff_wrack | ORC | crit_30 | 622.95 | 627.91 | 0.80 | 4.96 ± 5.73 | 0 | 2 |
| aff_wrack | ORC | regen_low | 538.85 | 531.59 | -1.35 | -7.26 ± 5.11 | 0 | 2 |
| aff_wrack | ORC | regen_high | 567.73 | 569.61 | 0.33 | 1.87 ± 6.15 | 0 | 2 |
| aff_wrack | UNDEAD | baseline | 556.96 | 556.02 | -0.17 | -0.93 ± 5.41 | 0 | 2 |
| aff_wrack | UNDEAD | sp_250 | 406.56 | 405.61 | -0.23 | -0.95 ± 3.82 | 0 | 2 |
| aff_wrack | UNDEAD | sp_1000 | 857.75 | 856.86 | -0.10 | -0.89 ± 8.61 | 0 | 2 |
| aff_wrack | UNDEAD | int_0 | 521.33 | 522.90 | 0.30 | 1.57 ± 4.92 | 0 | 2 |
| aff_wrack | UNDEAD | int_400 | 585.35 | 581.06 | -0.73 | -4.29 ± 5.64 | 0 | 2 |
| aff_wrack | UNDEAD | hit_0 | 513.91 | 507.77 | -1.20 | -6.14 ± 6.61 | 0 | 2 |
| aff_wrack | UNDEAD | hit_5 | 532.81 | 530.57 | -0.42 | -2.24 ± 6.75 | 0 | 2 |
| aff_wrack | UNDEAD | hit_16 | 556.96 | 556.02 | -0.17 | -0.93 ± 5.41 | 0 | 2 |
| aff_wrack | UNDEAD | crit_0 | 492.13 | 483.04 | -1.85 | -9.08 ± 4.14 | 0 | 2 |
| aff_wrack | UNDEAD | crit_30 | 624.54 | 622.78 | -0.28 | -1.76 ± 6.05 | 0 | 2 |
| aff_wrack | UNDEAD | regen_low | 537.48 | 526.71 | -2.00 | -10.77 ± 5.43 | 0 | 2 |
| aff_wrack | UNDEAD | regen_high | 565.67 | 568.57 | 0.51 | 2.90 ± 5.90 | 0 | 2 |
| aff_wrack | TROLL | baseline | 549.43 | 543.94 | -1.00 | -5.49 ± 5.10 | 0 | 2 |
| aff_wrack | TROLL | sp_250 | 399.26 | 394.93 | -1.08 | -4.33 ± 3.60 | 0 | 2 |
| aff_wrack | TROLL | sp_1000 | 849.78 | 841.95 | -0.92 | -7.82 ± 8.13 | 0 | 2 |
| aff_wrack | TROLL | int_0 | 517.14 | 507.24 | -1.92 | -9.90 ± 4.68 | 0 | 2 |
| aff_wrack | TROLL | int_400 | 578.47 | 581.11 | 0.46 | 2.65 ± 5.54 | 0 | 2 |
| aff_wrack | TROLL | hit_0 | 503.02 | 503.93 | 0.18 | 0.90 ± 5.95 | 0 | 2 |
| aff_wrack | TROLL | hit_5 | 523.01 | 524.25 | 0.24 | 1.25 ± 5.91 | 0 | 2 |
| aff_wrack | TROLL | hit_16 | 549.43 | 543.94 | -1.00 | -5.49 ± 5.10 | 0 | 2 |
| aff_wrack | TROLL | crit_0 | 477.06 | 476.22 | -0.18 | -0.84 ± 3.99 | 0 | 2 |
| aff_wrack | TROLL | crit_30 | 615.10 | 619.22 | 0.67 | 4.12 ± 5.67 | 0 | 2 |
| aff_wrack | TROLL | regen_low | 532.29 | 526.72 | -1.05 | -5.57 ± 5.02 | 0 | 2 |
| aff_wrack | TROLL | regen_high | 560.14 | 562.13 | 0.36 | 1.99 ± 5.63 | 0 | 2 |
| aff_wrack | GNOME | baseline | 553.00 | 551.41 | -0.29 | -1.59 ± 5.47 | 0 | 2 |
| aff_wrack | GNOME | sp_250 | 401.76 | 400.35 | -0.35 | -1.41 ± 3.86 | 0 | 2 |
| aff_wrack | GNOME | sp_1000 | 855.49 | 853.53 | -0.23 | -1.96 ± 8.69 | 0 | 2 |
| aff_wrack | GNOME | int_0 | 514.01 | 516.56 | 0.50 | 2.55 ± 5.40 | 0 | 2 |
| aff_wrack | GNOME | int_400 | 584.18 | 584.73 | 0.09 | 0.55 ± 5.60 | 0 | 2 |
| aff_wrack | GNOME | hit_0 | 507.46 | 510.31 | 0.56 | 2.86 ± 5.86 | 0 | 2 |
| aff_wrack | GNOME | hit_5 | 528.99 | 529.89 | 0.17 | 0.89 ± 6.11 | 0 | 2 |
| aff_wrack | GNOME | hit_16 | 553.00 | 551.41 | -0.29 | -1.59 ± 5.47 | 0 | 2 |
| aff_wrack | GNOME | crit_0 | 484.20 | 483.63 | -0.12 | -0.56 ± 3.94 | 0 | 2 |
| aff_wrack | GNOME | crit_30 | 621.22 | 622.68 | 0.24 | 1.46 ± 5.85 | 0 | 2 |
| aff_wrack | GNOME | regen_low | 539.39 | 532.21 | -1.33 | -7.18 ± 5.07 | 0 | 2 |
| aff_wrack | GNOME | regen_high | 566.68 | 565.84 | -0.15 | -0.83 ± 5.93 | 0 | 2 |
| destro | HUMAN | baseline | 642.86 | 631.33 | -1.79 | -11.53 ± 6.23 | 0 | 1 |
| destro | HUMAN | sp_250 | 476.83 | 468.53 | -1.74 | -8.30 ± 4.56 | 0 | 1 |
| destro | HUMAN | sp_1000 | 974.92 | 956.92 | -1.85 | -18.00 ± 9.59 | 0 | 1 |
| destro | HUMAN | int_0 | 612.97 | 610.34 | -0.43 | -2.63 ± 5.84 | 0 | 1 |
| destro | HUMAN | int_400 | 675.03 | 665.79 | -1.37 | -9.24 ± 6.12 | 0 | 1 |
| destro | HUMAN | hit_0 | 570.53 | 570.79 | 0.05 | 0.26 ± 8.74 | 0 | 1 |
| destro | HUMAN | hit_5 | 604.64 | 596.69 | -1.31 | -7.95 ± 8.17 | 0 | 1 |
| destro | HUMAN | hit_16 | 642.86 | 631.33 | -1.79 | -11.53 ± 6.23 | 0 | 1 |
| destro | HUMAN | crit_0 | 568.18 | 557.52 | -1.88 | -10.66 ± 4.22 | 0 | 1 |
| destro | HUMAN | crit_30 | 719.36 | 706.90 | -1.73 | -12.46 ± 7.21 | 0 | 1 |
| destro | HUMAN | regen_low | 626.48 | 616.05 | -1.67 | -10.43 ± 6.38 | 0 | 1 |
| destro | HUMAN | regen_high | 669.17 | 664.54 | -0.69 | -4.63 ± 6.66 | 0 | 1 |
| destro | ORC | baseline | 642.83 | 641.84 | -0.15 | -0.99 ± 6.71 | 0 | 1 |
| destro | ORC | sp_250 | 476.31 | 476.39 | 0.02 | 0.08 ± 4.91 | 0 | 1 |
| destro | ORC | sp_1000 | 975.88 | 972.75 | -0.32 | -3.13 ± 10.34 | 0 | 1 |
| destro | ORC | int_0 | 616.26 | 608.81 | -1.21 | -7.44 ± 6.08 | 0 | 1 |
| destro | ORC | int_400 | 679.75 | 669.99 | -1.44 | -9.76 ± 6.27 | 0 | 1 |
| destro | ORC | hit_0 | 571.13 | 569.64 | -0.26 | -1.49 ± 7.55 | 0 | 1 |
| destro | ORC | hit_5 | 603.07 | 603.70 | 0.10 | 0.63 ± 7.96 | 0 | 1 |
| destro | ORC | hit_16 | 642.83 | 641.84 | -0.15 | -0.99 ± 6.71 | 0 | 1 |
| destro | ORC | crit_0 | 565.31 | 565.10 | -0.04 | -0.21 ± 4.05 | 0 | 1 |
| destro | ORC | crit_30 | 720.38 | 717.50 | -0.40 | -2.88 ± 8.02 | 0 | 1 |
| destro | ORC | regen_low | 617.04 | 620.34 | 0.53 | 3.30 ± 5.33 | 0 | 1 |
| destro | ORC | regen_high | 675.59 | 669.73 | -0.87 | -5.87 ± 6.95 | 0 | 1 |
| destro | UNDEAD | baseline | 640.61 | 632.74 | -1.23 | -7.87 ± 6.48 | 0 | 1 |
| destro | UNDEAD | sp_250 | 477.48 | 471.82 | -1.19 | -5.66 ± 4.72 | 0 | 1 |
| destro | UNDEAD | sp_1000 | 966.86 | 954.58 | -1.27 | -12.28 ± 10.02 | 0 | 1 |
| destro | UNDEAD | int_0 | 609.00 | 602.89 | -1.00 | -6.11 ± 5.41 | 0 | 1 |
| destro | UNDEAD | int_400 | 676.28 | 661.96 | -2.12 | -14.32 ± 6.05 | 0 | 1 |
| destro | UNDEAD | hit_0 | 568.07 | 569.52 | 0.25 | 1.45 ± 8.61 | 0 | 1 |
| destro | UNDEAD | hit_5 | 605.98 | 594.64 | -1.87 | -11.35 ± 7.58 | 0 | 1 |
| destro | UNDEAD | hit_16 | 640.61 | 632.74 | -1.23 | -7.87 ± 6.48 | 0 | 1 |
| destro | UNDEAD | crit_0 | 563.85 | 557.35 | -1.15 | -6.51 ± 4.08 | 0 | 1 |
| destro | UNDEAD | crit_30 | 716.55 | 710.67 | -0.82 | -5.88 ± 7.73 | 0 | 1 |
| destro | UNDEAD | regen_low | 609.89 | 614.28 | 0.72 | 4.38 ± 5.76 | 0 | 1 |
| destro | UNDEAD | regen_high | 664.39 | 661.25 | -0.47 | -3.14 ± 5.94 | 0 | 1 |
| destro | TROLL | baseline | 630.44 | 629.88 | -0.09 | -0.57 ± 6.21 | 0 | 1 |
| destro | TROLL | sp_250 | 468.34 | 467.37 | -0.21 | -0.97 ± 4.54 | 0 | 1 |
| destro | TROLL | sp_1000 | 954.66 | 954.89 | 0.02 | 0.22 ± 9.57 | 0 | 1 |
| destro | TROLL | int_0 | 599.42 | 604.90 | 0.91 | 5.48 ± 5.87 | 0 | 1 |
| destro | TROLL | int_400 | 670.29 | 656.37 | -2.08 | -13.92 ± 6.59 | 0 | 1 |
| destro | TROLL | hit_0 | 563.62 | 562.93 | -0.12 | -0.69 ± 7.79 | 0 | 1 |
| destro | TROLL | hit_5 | 597.78 | 593.56 | -0.71 | -4.22 ± 7.76 | 0 | 1 |
| destro | TROLL | hit_16 | 630.44 | 629.88 | -0.09 | -0.57 ± 6.21 | 0 | 1 |
| destro | TROLL | crit_0 | 554.94 | 554.63 | -0.05 | -0.30 ± 3.77 | 0 | 1 |
| destro | TROLL | crit_30 | 706.05 | 707.87 | 0.26 | 1.82 ± 7.28 | 0 | 1 |
| destro | TROLL | regen_low | 615.88 | 610.49 | -0.88 | -5.39 ± 6.03 | 0 | 1 |
| destro | TROLL | regen_high | 665.18 | 658.61 | -0.99 | -6.57 ± 6.39 | 0 | 1 |
| destro | GNOME | baseline | 637.21 | 637.37 | 0.03 | 0.16 ± 6.25 | 0 | 1 |
| destro | GNOME | sp_250 | 473.11 | 473.57 | 0.10 | 0.46 ± 4.60 | 0 | 1 |
| destro | GNOME | sp_1000 | 965.42 | 964.99 | -0.04 | -0.43 ± 9.59 | 0 | 1 |
| destro | GNOME | int_0 | 609.95 | 604.15 | -0.95 | -5.79 ± 5.45 | 0 | 1 |
| destro | GNOME | int_400 | 672.67 | 680.06 | 1.10 | 7.40 ± 6.19 | 0 | 1 |
| destro | GNOME | hit_0 | 563.22 | 569.55 | 1.12 | 6.33 ± 8.02 | 0 | 1 |
| destro | GNOME | hit_5 | 598.77 | 600.67 | 0.32 | 1.90 ± 8.07 | 0 | 1 |
| destro | GNOME | hit_16 | 637.21 | 637.37 | 0.03 | 0.16 ± 6.25 | 0 | 1 |
| destro | GNOME | crit_0 | 559.19 | 563.18 | 0.71 | 3.99 ± 4.38 | 0 | 1 |
| destro | GNOME | crit_30 | 712.70 | 713.17 | 0.07 | 0.47 ± 7.18 | 0 | 1 |
| destro | GNOME | regen_low | 619.47 | 616.22 | -0.52 | -3.25 ± 5.46 | 0 | 1 |
| destro | GNOME | regen_high | 675.93 | 655.40 | -3.04 | -20.54 ± 6.58 | 0 | 1 |
| demo_shadow_brand | HUMAN | baseline | 712.57 | 716.04 | 0.49 | 3.47 ± 8.72 | 0 | 1 |
| demo_shadow_brand | HUMAN | sp_250 | 538.11 | 540.09 | 0.37 | 1.98 ± 6.36 | 0 | 1 |
| demo_shadow_brand | HUMAN | sp_1000 | 1061.50 | 1067.95 | 0.61 | 6.44 ± 13.46 | 0 | 1 |
| demo_shadow_brand | HUMAN | int_0 | 678.24 | 673.05 | -0.77 | -5.19 ± 7.63 | 0 | 1 |
| demo_shadow_brand | HUMAN | int_400 | 757.89 | 758.05 | 0.02 | 0.15 ± 9.87 | 0 | 1 |
| demo_shadow_brand | HUMAN | hit_0 | 621.59 | 626.64 | 0.81 | 5.05 ± 12.11 | 0 | 1 |
| demo_shadow_brand | HUMAN | hit_5 | 658.41 | 666.43 | 1.22 | 8.02 ± 10.07 | 0 | 1 |
| demo_shadow_brand | HUMAN | hit_16 | 745.94 | 745.46 | -0.06 | -0.48 ± 8.22 | 0 | 1 |
| demo_shadow_brand | HUMAN | crit_0 | 628.02 | 628.67 | 0.10 | 0.65 ± 6.07 | 0 | 1 |
| demo_shadow_brand | HUMAN | crit_30 | 799.54 | 804.76 | 0.65 | 5.22 ± 10.12 | 0 | 1 |
| demo_shadow_brand | HUMAN | regen_low | 691.94 | 691.79 | -0.02 | -0.15 ± 8.87 | 0 | 1 |
| demo_shadow_brand | HUMAN | regen_high | 747.17 | 745.50 | -0.22 | -1.68 ± 8.86 | 0 | 1 |
| demo_shadow_brand | ORC | baseline | 712.24 | 719.57 | 1.03 | 7.33 ± 8.69 | 0 | 1 |
| demo_shadow_brand | ORC | sp_250 | 536.95 | 541.97 | 0.94 | 5.02 ± 6.34 | 0 | 1 |
| demo_shadow_brand | ORC | sp_1000 | 1062.83 | 1074.78 | 1.12 | 11.95 ± 13.41 | 0 | 1 |
| demo_shadow_brand | ORC | int_0 | 676.86 | 677.24 | 0.06 | 0.38 ± 9.02 | 0 | 1 |
| demo_shadow_brand | ORC | int_400 | 753.17 | 762.04 | 1.18 | 8.87 ± 9.21 | 0 | 1 |
| demo_shadow_brand | ORC | hit_0 | 614.72 | 625.45 | 1.75 | 10.73 ± 11.25 | 0 | 1 |
| demo_shadow_brand | ORC | hit_5 | 652.98 | 670.93 | 2.75 | 17.95 ± 9.40 | 0 | 1 |
| demo_shadow_brand | ORC | hit_16 | 740.71 | 747.27 | 0.89 | 6.56 ± 8.10 | 0 | 1 |
| demo_shadow_brand | ORC | crit_0 | 625.41 | 630.08 | 0.75 | 4.67 ± 6.21 | 0 | 1 |
| demo_shadow_brand | ORC | crit_30 | 794.80 | 808.85 | 1.77 | 14.05 ± 9.74 | 0 | 1 |
| demo_shadow_brand | ORC | regen_low | 688.68 | 690.09 | 0.20 | 1.41 ± 8.09 | 0 | 1 |
| demo_shadow_brand | ORC | regen_high | 741.71 | 744.43 | 0.37 | 2.72 ± 8.42 | 0 | 1 |
| demo_shadow_brand | UNDEAD | baseline | 711.31 | 708.47 | -0.40 | -2.84 ± 8.39 | 0 | 1 |
| demo_shadow_brand | UNDEAD | sp_250 | 538.59 | 535.96 | -0.49 | -2.63 ± 6.12 | 0 | 1 |
| demo_shadow_brand | UNDEAD | sp_1000 | 1056.75 | 1053.50 | -0.31 | -3.26 ± 12.97 | 0 | 1 |
| demo_shadow_brand | UNDEAD | int_0 | 671.14 | 666.61 | -0.67 | -4.53 ± 7.92 | 0 | 1 |
| demo_shadow_brand | UNDEAD | int_400 | 749.95 | 751.64 | 0.22 | 1.69 ± 9.50 | 0 | 1 |
| demo_shadow_brand | UNDEAD | hit_0 | 611.38 | 622.28 | 1.78 | 10.91 ± 11.09 | 0 | 1 |
| demo_shadow_brand | UNDEAD | hit_5 | 658.32 | 664.24 | 0.90 | 5.93 ± 9.87 | 0 | 1 |
| demo_shadow_brand | UNDEAD | hit_16 | 738.62 | 739.99 | 0.19 | 1.38 ± 8.73 | 0 | 1 |
| demo_shadow_brand | UNDEAD | crit_0 | 625.56 | 624.13 | -0.23 | -1.43 ± 5.51 | 0 | 1 |
| demo_shadow_brand | UNDEAD | crit_30 | 794.87 | 793.81 | -0.13 | -1.06 ± 9.76 | 0 | 1 |
| demo_shadow_brand | UNDEAD | regen_low | 687.48 | 685.66 | -0.26 | -1.82 ± 8.24 | 0 | 1 |
| demo_shadow_brand | UNDEAD | regen_high | 734.28 | 740.24 | 0.81 | 5.96 ± 8.47 | 0 | 1 |
| demo_shadow_brand | TROLL | baseline | 703.76 | 708.86 | 0.72 | 5.10 ± 8.01 | 0 | 1 |
| demo_shadow_brand | TROLL | sp_250 | 531.49 | 534.37 | 0.54 | 2.89 ± 5.85 | 0 | 1 |
| demo_shadow_brand | TROLL | sp_1000 | 1048.32 | 1057.83 | 0.91 | 9.52 ± 12.36 | 0 | 1 |
| demo_shadow_brand | TROLL | int_0 | 668.12 | 665.64 | -0.37 | -2.48 ± 8.35 | 0 | 1 |
| demo_shadow_brand | TROLL | int_400 | 744.60 | 750.27 | 0.76 | 5.67 ± 9.30 | 0 | 1 |
| demo_shadow_brand | TROLL | hit_0 | 608.86 | 623.83 | 2.46 | 14.97 ± 10.86 | 0 | 1 |
| demo_shadow_brand | TROLL | hit_5 | 648.88 | 655.40 | 1.00 | 6.51 ± 9.44 | 0 | 1 |
| demo_shadow_brand | TROLL | hit_16 | 732.13 | 737.58 | 0.75 | 5.46 ± 7.86 | 0 | 1 |
| demo_shadow_brand | TROLL | crit_0 | 618.95 | 617.87 | -0.17 | -1.08 ± 5.50 | 0 | 1 |
| demo_shadow_brand | TROLL | crit_30 | 788.67 | 796.96 | 1.05 | 8.29 ± 9.44 | 0 | 1 |
| demo_shadow_brand | TROLL | regen_low | 682.31 | 682.17 | -0.02 | -0.13 ± 8.27 | 0 | 1 |
| demo_shadow_brand | TROLL | regen_high | 732.57 | 737.75 | 0.71 | 5.18 ± 8.66 | 0 | 1 |
| demo_shadow_brand | GNOME | baseline | 705.80 | 714.22 | 1.19 | 8.42 ± 9.09 | 0 | 1 |
| demo_shadow_brand | GNOME | sp_250 | 533.05 | 538.46 | 1.02 | 5.41 ± 6.64 | 0 | 1 |
| demo_shadow_brand | GNOME | sp_1000 | 1051.31 | 1065.74 | 1.37 | 14.44 ± 13.99 | 0 | 1 |
| demo_shadow_brand | GNOME | int_0 | 663.75 | 665.63 | 0.28 | 1.87 ± 7.03 | 0 | 1 |
| demo_shadow_brand | GNOME | int_400 | 751.20 | 754.88 | 0.49 | 3.68 ± 9.01 | 0 | 1 |
| demo_shadow_brand | GNOME | hit_0 | 610.96 | 623.64 | 2.08 | 12.68 ± 11.47 | 0 | 1 |
| demo_shadow_brand | GNOME | hit_5 | 650.18 | 662.21 | 1.85 | 12.03 ± 10.44 | 0 | 1 |
| demo_shadow_brand | GNOME | hit_16 | 730.94 | 736.12 | 0.71 | 5.18 ± 7.55 | 0 | 1 |
| demo_shadow_brand | GNOME | crit_0 | 619.01 | 624.91 | 0.95 | 5.89 ± 6.02 | 0 | 1 |
| demo_shadow_brand | GNOME | crit_30 | 795.08 | 802.34 | 0.91 | 7.27 ± 10.52 | 0 | 1 |
| demo_shadow_brand | GNOME | regen_low | 679.85 | 682.64 | 0.41 | 2.79 ± 8.36 | 0 | 1 |
| demo_shadow_brand | GNOME | regen_high | 734.60 | 743.39 | 1.20 | 8.79 ± 9.02 | 0 | 1 |
| demo_fire_brand | HUMAN | baseline | 754.56 | 753.17 | -0.18 | -1.40 ± 6.22 | 2 | 1 |
| demo_fire_brand | HUMAN | sp_250 | 571.93 | 569.90 | -0.35 | -2.02 ± 4.59 | 2 | 1 |
| demo_fire_brand | HUMAN | sp_1000 | 1119.83 | 1119.69 | -0.01 | -0.14 ± 9.52 | 2 | 1 |
| demo_fire_brand | HUMAN | int_0 | 718.43 | 712.11 | -0.88 | -6.31 ± 5.69 | 2 | 1 |
| demo_fire_brand | HUMAN | int_400 | 788.26 | 783.74 | -0.57 | -4.51 ± 6.50 | 2 | 1 |
| demo_fire_brand | HUMAN | hit_0 | 655.40 | 656.60 | 0.18 | 1.21 ± 8.43 | 2 | 1 |
| demo_fire_brand | HUMAN | hit_5 | 695.74 | 696.44 | 0.10 | 0.70 ± 7.50 | 2 | 1 |
| demo_fire_brand | HUMAN | hit_16 | 784.71 | 779.94 | -0.61 | -4.77 ± 5.46 | 2 | 1 |
| demo_fire_brand | HUMAN | crit_0 | 682.44 | 682.17 | -0.04 | -0.27 ± 4.84 | 2 | 1 |
| demo_fire_brand | HUMAN | crit_30 | 824.51 | 825.53 | 0.12 | 1.02 ± 6.70 | 2 | 1 |
| demo_fire_brand | HUMAN | regen_low | 730.54 | 729.07 | -0.20 | -1.47 ± 6.04 | 2 | 1 |
| demo_fire_brand | HUMAN | regen_high | 773.45 | 774.69 | 0.16 | 1.24 ± 6.01 | 2 | 1 |
| demo_fire_brand | ORC | baseline | 750.34 | 756.67 | 0.84 | 6.33 ± 6.28 | 2 | 1 |
| demo_fire_brand | ORC | sp_250 | 567.94 | 572.32 | 0.77 | 4.38 ± 4.64 | 2 | 1 |
| demo_fire_brand | ORC | sp_1000 | 1115.14 | 1125.37 | 0.92 | 10.24 ± 9.59 | 2 | 1 |
| demo_fire_brand | ORC | int_0 | 716.53 | 717.18 | 0.09 | 0.66 ± 6.05 | 2 | 1 |
| demo_fire_brand | ORC | int_400 | 794.56 | 791.35 | -0.40 | -3.21 ± 7.21 | 2 | 1 |
| demo_fire_brand | ORC | hit_0 | 650.56 | 659.73 | 1.41 | 9.16 ± 8.74 | 2 | 1 |
| demo_fire_brand | ORC | hit_5 | 697.03 | 700.20 | 0.46 | 3.17 ± 6.95 | 2 | 1 |
| demo_fire_brand | ORC | hit_16 | 778.77 | 792.07 | 1.71 | 13.30 ± 5.22 | 2 | 1 |
| demo_fire_brand | ORC | crit_0 | 679.46 | 686.85 | 1.09 | 7.39 ± 4.90 | 2 | 1 |
| demo_fire_brand | ORC | crit_30 | 823.50 | 831.14 | 0.93 | 7.64 ± 6.73 | 2 | 1 |
| demo_fire_brand | ORC | regen_low | 730.63 | 735.30 | 0.64 | 4.67 ± 6.17 | 2 | 1 |
| demo_fire_brand | ORC | regen_high | 769.96 | 781.03 | 1.44 | 11.06 ± 5.81 | 2 | 1 |
| demo_fire_brand | UNDEAD | baseline | 753.55 | 746.73 | -0.91 | -6.82 ± 6.47 | 2 | 1 |
| demo_fire_brand | UNDEAD | sp_250 | 573.30 | 567.25 | -1.06 | -6.05 ± 4.77 | 2 | 1 |
| demo_fire_brand | UNDEAD | sp_1000 | 1114.05 | 1105.70 | -0.75 | -8.35 ± 9.91 | 2 | 1 |
| demo_fire_brand | UNDEAD | int_0 | 714.50 | 708.40 | -0.85 | -6.09 ± 5.49 | 2 | 1 |
| demo_fire_brand | UNDEAD | int_400 | 786.65 | 778.34 | -1.06 | -8.31 ± 6.57 | 2 | 1 |
| demo_fire_brand | UNDEAD | hit_0 | 655.52 | 653.96 | -0.24 | -1.56 ± 7.97 | 2 | 1 |
| demo_fire_brand | UNDEAD | hit_5 | 695.72 | 690.34 | -0.77 | -5.38 ± 7.49 | 2 | 1 |
| demo_fire_brand | UNDEAD | hit_16 | 787.36 | 780.90 | -0.82 | -6.46 ± 5.21 | 2 | 1 |
| demo_fire_brand | UNDEAD | crit_0 | 680.97 | 675.71 | -0.77 | -5.25 ± 4.53 | 2 | 1 |
| demo_fire_brand | UNDEAD | crit_30 | 823.25 | 819.25 | -0.49 | -4.00 ± 7.69 | 2 | 1 |
| demo_fire_brand | UNDEAD | regen_low | 732.22 | 729.52 | -0.37 | -2.71 ± 6.27 | 2 | 1 |
| demo_fire_brand | UNDEAD | regen_high | 768.57 | 768.54 | -0.00 | -0.04 ± 5.91 | 2 | 1 |
| demo_fire_brand | TROLL | baseline | 748.11 | 745.26 | -0.38 | -2.85 ± 6.70 | 2 | 1 |
| demo_fire_brand | TROLL | sp_250 | 567.25 | 564.21 | -0.54 | -3.04 ± 4.96 | 2 | 1 |
| demo_fire_brand | TROLL | sp_1000 | 1109.83 | 1107.36 | -0.22 | -2.46 ± 10.19 | 2 | 1 |
| demo_fire_brand | TROLL | int_0 | 711.56 | 707.54 | -0.57 | -4.02 ± 5.52 | 2 | 1 |
| demo_fire_brand | TROLL | int_400 | 778.04 | 774.71 | -0.43 | -3.33 ± 6.43 | 2 | 1 |
| demo_fire_brand | TROLL | hit_0 | 649.83 | 653.81 | 0.61 | 3.99 ± 8.42 | 2 | 1 |
| demo_fire_brand | TROLL | hit_5 | 690.34 | 687.10 | -0.47 | -3.24 ± 7.33 | 2 | 1 |
| demo_fire_brand | TROLL | hit_16 | 779.72 | 775.14 | -0.59 | -4.59 ± 4.77 | 2 | 1 |
| demo_fire_brand | TROLL | crit_0 | 675.46 | 673.64 | -0.27 | -1.82 ± 4.90 | 2 | 1 |
| demo_fire_brand | TROLL | crit_30 | 820.70 | 816.93 | -0.46 | -3.77 ± 7.36 | 2 | 1 |
| demo_fire_brand | TROLL | regen_low | 723.06 | 724.02 | 0.13 | 0.96 ± 6.06 | 2 | 1 |
| demo_fire_brand | TROLL | regen_high | 769.27 | 766.81 | -0.32 | -2.47 ± 6.05 | 2 | 1 |
| demo_fire_brand | GNOME | baseline | 746.68 | 746.39 | -0.04 | -0.29 ± 6.07 | 2 | 1 |
| demo_fire_brand | GNOME | sp_250 | 565.94 | 564.89 | -0.19 | -1.05 ± 4.49 | 2 | 1 |
| demo_fire_brand | GNOME | sp_1000 | 1108.16 | 1109.39 | 0.11 | 1.23 ± 9.25 | 2 | 1 |
| demo_fire_brand | GNOME | int_0 | 713.13 | 706.95 | -0.87 | -6.17 ± 6.13 | 2 | 1 |
| demo_fire_brand | GNOME | int_400 | 775.94 | 781.21 | 0.68 | 5.28 ± 5.95 | 2 | 1 |
| demo_fire_brand | GNOME | hit_0 | 648.90 | 655.29 | 0.98 | 6.39 ± 8.26 | 2 | 1 |
| demo_fire_brand | GNOME | hit_5 | 691.85 | 690.02 | -0.26 | -1.83 ± 7.70 | 2 | 1 |
| demo_fire_brand | GNOME | hit_16 | 774.35 | 771.72 | -0.34 | -2.63 ± 5.14 | 2 | 1 |
| demo_fire_brand | GNOME | crit_0 | 674.88 | 675.33 | 0.07 | 0.45 ± 4.76 | 2 | 1 |
| demo_fire_brand | GNOME | crit_30 | 818.00 | 819.43 | 0.18 | 1.43 ± 6.70 | 2 | 1 |
| demo_fire_brand | GNOME | regen_low | 730.82 | 726.79 | -0.55 | -4.03 ± 6.14 | 2 | 1 |
| demo_fire_brand | GNOME | regen_high | 772.33 | 771.58 | -0.10 | -0.76 ± 6.01 | 2 | 1 |

The JSON companion includes exact requests, resolved app configs, source/app hashes, input differences, import diagnostics, and spell/pet breakdowns. Existing five-preset benchmark artifacts are unchanged.
