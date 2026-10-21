# Forever race/stat diagnostic sweep

complete: 300/300 combinations completed; 1000 fights per engine per combination, seed 101.

Full preset × race × profile sweep. Profiles change one baseline stat at a time, except regeneration profiles which jointly change spirit and mp5. All stats are bonuses above racial/class bases. Gear-free, 180s, zero distance, external CoE only, no consumables. Source APLs are retained, including their race-specific action IDs; this measures import behavior rather than optimizing each race's rotation.

**Diagnostic only.** Source APLs are retained for every race, including race-specific action IDs. Unsupported imports are recorded, not treated as accepted parity. Gear and consumables are absent.

Intervals are approximate 95% Monte Carlo intervals for independent-engine mean differences. At 100 trials they are noisy, and intervals are not adjusted for multiple comparisons. Equal seeds do not pair RNG streams. Small total differences can hide offsetting spell errors.

| Preset | Cases | Mean absolute delta % | Worst absolute delta % |
| --- | ---: | ---: | ---: |
| sm_ruin | 60 | 0.21 | 0.63 |
| aff_wrack | 60 | 0.16 | 0.56 |
| destro | 60 | 0.17 | 0.36 |
| demo_shadow_brand | 60 | 0.16 | 0.70 |
| demo_fire_brand | 60 | 0.19 | 0.51 |

## Largest observed total differences

| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| demo_shadow_brand | GNOME | hit_5 | 653.72 | 658.32 | 0.70 | 4.61 ± 3.25 |
| sm_ruin | GNOME | regen_high | 662.79 | 666.96 | 0.63 | 4.17 ± 3.02 |
| aff_wrack | TROLL | int_0 | 516.82 | 519.73 | 0.56 | 2.92 ± 1.61 |
| sm_ruin | GNOME | hit_5 | 602.69 | 599.53 | -0.53 | -3.16 ± 3.32 |
| demo_fire_brand | GNOME | regen_low | 728.44 | 732.17 | 0.51 | 3.73 ± 2.09 |
| aff_wrack | TROLL | crit_0 | 478.55 | 480.98 | 0.51 | 2.42 ± 1.29 |
| demo_shadow_brand | ORC | crit_30 | 799.68 | 803.33 | 0.46 | 3.65 ± 3.26 |
| aff_wrack | TROLL | int_400 | 581.75 | 584.37 | 0.45 | 2.62 ± 1.69 |
| aff_wrack | TROLL | hit_5 | 525.07 | 527.39 | 0.44 | 2.32 ± 1.91 |
| aff_wrack | TROLL | hit_0 | 507.27 | 509.43 | 0.43 | 2.16 ± 2.00 |
| demo_fire_brand | ORC | int_400 | 791.63 | 794.78 | 0.40 | 3.15 ± 2.20 |
| sm_ruin | UNDEAD | sp_1000 | 990.19 | 994.10 | 0.39 | 3.91 ± 4.52 |
| sm_ruin | UNDEAD | baseline | 644.36 | 646.89 | 0.39 | 2.53 ± 2.87 |
| sm_ruin | UNDEAD | hit_16 | 644.36 | 646.89 | 0.39 | 2.53 ± 2.87 |
| sm_ruin | UNDEAD | sp_250 | 471.44 | 473.28 | 0.39 | 1.84 ± 2.04 |
| aff_wrack | HUMAN | hit_0 | 517.36 | 519.36 | 0.39 | 2.00 ± 2.10 |
| demo_fire_brand | TROLL | sp_250 | 564.55 | 566.71 | 0.38 | 2.16 ± 1.48 |
| demo_shadow_brand | HUMAN | crit_30 | 801.33 | 804.32 | 0.37 | 3.00 ± 3.30 |
| demo_shadow_brand | UNDEAD | hit_5 | 657.93 | 660.32 | 0.36 | 2.39 ± 3.16 |
| demo_shadow_brand | UNDEAD | regen_high | 739.03 | 741.69 | 0.36 | 2.66 ± 2.91 |

## All combinations

| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% | Stat differences | Group omissions |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| sm_ruin | HUMAN | baseline | 653.96 | 652.02 | -0.30 | -1.94 ± 2.95 | 0 | 1 |
| sm_ruin | HUMAN | sp_250 | 476.47 | 475.08 | -0.29 | -1.39 ± 2.10 | 0 | 1 |
| sm_ruin | HUMAN | sp_1000 | 1008.94 | 1005.90 | -0.30 | -3.04 ± 4.66 | 0 | 1 |
| sm_ruin | HUMAN | int_0 | 617.27 | 616.79 | -0.08 | -0.48 ± 2.76 | 0 | 1 |
| sm_ruin | HUMAN | int_400 | 690.83 | 691.57 | 0.11 | 0.74 ± 3.17 | 0 | 1 |
| sm_ruin | HUMAN | hit_0 | 579.92 | 580.36 | 0.08 | 0.44 ± 3.55 | 0 | 1 |
| sm_ruin | HUMAN | hit_5 | 611.57 | 611.54 | -0.00 | -0.03 ± 3.39 | 0 | 1 |
| sm_ruin | HUMAN | hit_16 | 653.96 | 652.02 | -0.30 | -1.94 ± 2.95 | 0 | 1 |
| sm_ruin | HUMAN | crit_0 | 555.18 | 554.74 | -0.08 | -0.44 ± 2.27 | 0 | 1 |
| sm_ruin | HUMAN | crit_30 | 749.22 | 747.91 | -0.18 | -1.32 ± 3.11 | 0 | 1 |
| sm_ruin | HUMAN | regen_low | 631.02 | 632.34 | 0.21 | 1.32 ± 2.94 | 0 | 1 |
| sm_ruin | HUMAN | regen_high | 678.75 | 679.57 | 0.12 | 0.82 ± 2.99 | 0 | 1 |
| sm_ruin | ORC | baseline | 647.77 | 648.00 | 0.04 | 0.23 ± 2.95 | 0 | 1 |
| sm_ruin | ORC | sp_250 | 471.00 | 471.13 | 0.03 | 0.13 ± 2.10 | 0 | 1 |
| sm_ruin | ORC | sp_1000 | 1001.31 | 1001.74 | 0.04 | 0.44 ± 4.67 | 0 | 1 |
| sm_ruin | ORC | int_0 | 612.04 | 611.02 | -0.17 | -1.02 ± 2.77 | 0 | 1 |
| sm_ruin | ORC | int_400 | 688.07 | 688.69 | 0.09 | 0.62 ± 3.10 | 0 | 1 |
| sm_ruin | ORC | hit_0 | 576.30 | 576.73 | 0.07 | 0.43 ± 3.51 | 0 | 1 |
| sm_ruin | ORC | hit_5 | 607.75 | 606.30 | -0.24 | -1.45 ± 3.29 | 0 | 1 |
| sm_ruin | ORC | hit_16 | 647.77 | 648.00 | 0.04 | 0.23 ± 2.95 | 0 | 1 |
| sm_ruin | ORC | crit_0 | 548.98 | 549.80 | 0.15 | 0.82 ± 2.21 | 0 | 1 |
| sm_ruin | ORC | crit_30 | 744.44 | 744.63 | 0.02 | 0.19 ± 3.16 | 0 | 1 |
| sm_ruin | ORC | regen_low | 629.07 | 630.38 | 0.21 | 1.31 ± 2.96 | 0 | 1 |
| sm_ruin | ORC | regen_high | 673.65 | 675.13 | 0.22 | 1.48 ± 3.09 | 0 | 1 |
| sm_ruin | UNDEAD | baseline | 644.36 | 646.89 | 0.39 | 2.53 ± 2.87 | 0 | 1 |
| sm_ruin | UNDEAD | sp_250 | 471.44 | 473.28 | 0.39 | 1.84 ± 2.04 | 0 | 1 |
| sm_ruin | UNDEAD | sp_1000 | 990.19 | 994.10 | 0.39 | 3.91 ± 4.52 | 0 | 1 |
| sm_ruin | UNDEAD | int_0 | 607.94 | 606.69 | -0.21 | -1.25 ± 2.71 | 0 | 1 |
| sm_ruin | UNDEAD | int_400 | 683.63 | 683.25 | -0.06 | -0.39 ± 3.03 | 0 | 1 |
| sm_ruin | UNDEAD | hit_0 | 574.14 | 575.71 | 0.27 | 1.57 ± 3.47 | 0 | 1 |
| sm_ruin | UNDEAD | hit_5 | 604.71 | 605.90 | 0.20 | 1.19 ± 3.22 | 0 | 1 |
| sm_ruin | UNDEAD | hit_16 | 644.36 | 646.89 | 0.39 | 2.53 ± 2.87 | 0 | 1 |
| sm_ruin | UNDEAD | crit_0 | 546.45 | 546.97 | 0.09 | 0.52 ± 2.07 | 0 | 1 |
| sm_ruin | UNDEAD | crit_30 | 740.89 | 742.08 | 0.16 | 1.19 ± 3.11 | 0 | 1 |
| sm_ruin | UNDEAD | regen_low | 624.51 | 625.76 | 0.20 | 1.25 ± 2.88 | 0 | 1 |
| sm_ruin | UNDEAD | regen_high | 669.25 | 671.08 | 0.27 | 1.83 ± 2.94 | 0 | 1 |
| sm_ruin | TROLL | baseline | 637.81 | 639.70 | 0.30 | 1.90 ± 2.89 | 0 | 1 |
| sm_ruin | TROLL | sp_250 | 464.77 | 466.13 | 0.29 | 1.35 ± 2.06 | 0 | 1 |
| sm_ruin | TROLL | sp_1000 | 983.87 | 986.86 | 0.30 | 2.99 ± 4.56 | 0 | 1 |
| sm_ruin | TROLL | int_0 | 599.33 | 601.26 | 0.32 | 1.93 ± 2.78 | 0 | 1 |
| sm_ruin | TROLL | int_400 | 675.08 | 674.96 | -0.02 | -0.12 ± 3.04 | 0 | 1 |
| sm_ruin | TROLL | hit_0 | 567.48 | 567.45 | -0.01 | -0.03 ± 3.46 | 0 | 1 |
| sm_ruin | TROLL | hit_5 | 599.35 | 597.91 | -0.24 | -1.45 ± 3.30 | 0 | 1 |
| sm_ruin | TROLL | hit_16 | 637.81 | 639.70 | 0.30 | 1.90 ± 2.89 | 0 | 1 |
| sm_ruin | TROLL | crit_0 | 540.11 | 539.82 | -0.05 | -0.29 ± 2.08 | 0 | 1 |
| sm_ruin | TROLL | crit_30 | 734.06 | 735.22 | 0.16 | 1.17 ± 3.13 | 0 | 1 |
| sm_ruin | TROLL | regen_low | 616.48 | 618.03 | 0.25 | 1.54 ± 2.83 | 0 | 1 |
| sm_ruin | TROLL | regen_high | 663.43 | 662.72 | -0.11 | -0.71 ± 3.02 | 0 | 1 |
| sm_ruin | GNOME | baseline | 640.54 | 642.34 | 0.28 | 1.80 ± 2.93 | 0 | 1 |
| sm_ruin | GNOME | sp_250 | 466.78 | 468.10 | 0.28 | 1.32 ± 2.09 | 0 | 1 |
| sm_ruin | GNOME | sp_1000 | 988.07 | 990.83 | 0.28 | 2.77 ± 4.61 | 0 | 1 |
| sm_ruin | GNOME | int_0 | 605.31 | 603.40 | -0.31 | -1.90 ± 2.72 | 0 | 1 |
| sm_ruin | GNOME | int_400 | 678.78 | 680.49 | 0.25 | 1.70 ± 3.03 | 0 | 1 |
| sm_ruin | GNOME | hit_0 | 571.55 | 571.34 | -0.04 | -0.22 ± 3.59 | 0 | 1 |
| sm_ruin | GNOME | hit_5 | 602.69 | 599.53 | -0.53 | -3.16 ± 3.32 | 0 | 1 |
| sm_ruin | GNOME | hit_16 | 640.54 | 642.34 | 0.28 | 1.80 ± 2.93 | 0 | 1 |
| sm_ruin | GNOME | crit_0 | 542.61 | 543.70 | 0.20 | 1.09 ± 2.16 | 0 | 1 |
| sm_ruin | GNOME | crit_30 | 737.27 | 738.86 | 0.22 | 1.59 ± 3.15 | 0 | 1 |
| sm_ruin | GNOME | regen_low | 622.28 | 624.16 | 0.30 | 1.88 ± 2.90 | 0 | 1 |
| sm_ruin | GNOME | regen_high | 662.79 | 666.96 | 0.63 | 4.17 ± 3.02 | 0 | 1 |
| aff_wrack | HUMAN | baseline | 559.93 | 559.57 | -0.06 | -0.36 ± 1.75 | 0 | 2 |
| aff_wrack | HUMAN | sp_250 | 406.98 | 406.72 | -0.06 | -0.25 ± 1.24 | 0 | 2 |
| aff_wrack | HUMAN | sp_1000 | 865.83 | 865.25 | -0.07 | -0.58 ± 2.78 | 0 | 2 |
| aff_wrack | HUMAN | int_0 | 532.37 | 531.89 | -0.09 | -0.48 ± 1.62 | 0 | 2 |
| aff_wrack | HUMAN | int_400 | 591.26 | 590.34 | -0.16 | -0.92 ± 1.81 | 0 | 2 |
| aff_wrack | HUMAN | hit_0 | 517.36 | 519.36 | 0.39 | 2.00 ± 2.10 | 0 | 2 |
| aff_wrack | HUMAN | hit_5 | 536.30 | 536.59 | 0.06 | 0.30 ± 1.97 | 0 | 2 |
| aff_wrack | HUMAN | hit_16 | 559.93 | 559.57 | -0.06 | -0.36 ± 1.75 | 0 | 2 |
| aff_wrack | HUMAN | crit_0 | 489.76 | 489.13 | -0.13 | -0.63 ± 1.48 | 0 | 2 |
| aff_wrack | HUMAN | crit_30 | 629.74 | 631.28 | 0.24 | 1.53 ± 1.84 | 0 | 2 |
| aff_wrack | HUMAN | regen_low | 540.35 | 541.20 | 0.16 | 0.85 ± 1.86 | 0 | 2 |
| aff_wrack | HUMAN | regen_high | 573.38 | 573.11 | -0.05 | -0.27 ± 1.97 | 0 | 2 |
| aff_wrack | ORC | baseline | 558.98 | 557.69 | -0.23 | -1.29 ± 1.70 | 0 | 2 |
| aff_wrack | ORC | sp_250 | 405.56 | 404.65 | -0.23 | -0.92 ± 1.20 | 0 | 2 |
| aff_wrack | ORC | sp_1000 | 865.82 | 863.78 | -0.24 | -2.04 ± 2.71 | 0 | 2 |
| aff_wrack | ORC | int_0 | 525.16 | 524.59 | -0.11 | -0.58 ± 1.61 | 0 | 2 |
| aff_wrack | ORC | int_400 | 589.15 | 588.34 | -0.14 | -0.82 ± 1.75 | 0 | 2 |
| aff_wrack | ORC | hit_0 | 514.58 | 515.96 | 0.27 | 1.37 ± 2.00 | 0 | 2 |
| aff_wrack | ORC | hit_5 | 533.36 | 533.22 | -0.03 | -0.14 ± 1.92 | 0 | 2 |
| aff_wrack | ORC | hit_16 | 558.98 | 557.69 | -0.23 | -1.29 ± 1.70 | 0 | 2 |
| aff_wrack | ORC | crit_0 | 486.28 | 486.77 | 0.10 | 0.49 ± 1.49 | 0 | 2 |
| aff_wrack | ORC | crit_30 | 627.58 | 627.39 | -0.03 | -0.19 ± 1.85 | 0 | 2 |
| aff_wrack | ORC | regen_low | 539.40 | 539.61 | 0.04 | 0.21 ± 1.75 | 0 | 2 |
| aff_wrack | ORC | regen_high | 570.08 | 570.43 | 0.06 | 0.35 ± 1.95 | 0 | 2 |
| aff_wrack | UNDEAD | baseline | 559.44 | 558.82 | -0.11 | -0.62 ± 1.62 | 0 | 2 |
| aff_wrack | UNDEAD | sp_250 | 408.43 | 407.96 | -0.12 | -0.47 ± 1.15 | 0 | 2 |
| aff_wrack | UNDEAD | sp_1000 | 861.46 | 860.54 | -0.11 | -0.91 ± 2.57 | 0 | 2 |
| aff_wrack | UNDEAD | int_0 | 522.29 | 522.76 | 0.09 | 0.47 ± 1.61 | 0 | 2 |
| aff_wrack | UNDEAD | int_400 | 587.72 | 588.93 | 0.21 | 1.21 ± 1.74 | 0 | 2 |
| aff_wrack | UNDEAD | hit_0 | 514.66 | 515.90 | 0.24 | 1.24 ± 2.10 | 0 | 2 |
| aff_wrack | UNDEAD | hit_5 | 533.76 | 535.20 | 0.27 | 1.44 ± 1.93 | 0 | 2 |
| aff_wrack | UNDEAD | hit_16 | 559.44 | 558.82 | -0.11 | -0.62 ± 1.62 | 0 | 2 |
| aff_wrack | UNDEAD | crit_0 | 490.82 | 491.17 | 0.07 | 0.34 ± 1.29 | 0 | 2 |
| aff_wrack | UNDEAD | crit_30 | 627.46 | 627.54 | 0.01 | 0.08 ± 1.81 | 0 | 2 |
| aff_wrack | UNDEAD | regen_low | 537.06 | 537.55 | 0.09 | 0.49 ± 1.74 | 0 | 2 |
| aff_wrack | UNDEAD | regen_high | 568.46 | 568.64 | 0.03 | 0.18 ± 1.91 | 0 | 2 |
| aff_wrack | TROLL | baseline | 549.13 | 550.02 | 0.16 | 0.88 ± 1.69 | 0 | 2 |
| aff_wrack | TROLL | sp_250 | 399.13 | 399.68 | 0.14 | 0.55 ± 1.19 | 0 | 2 |
| aff_wrack | TROLL | sp_1000 | 849.14 | 850.68 | 0.18 | 1.55 ± 2.68 | 0 | 2 |
| aff_wrack | TROLL | int_0 | 516.82 | 519.73 | 0.56 | 2.92 ± 1.61 | 0 | 2 |
| aff_wrack | TROLL | int_400 | 581.75 | 584.37 | 0.45 | 2.62 ± 1.69 | 0 | 2 |
| aff_wrack | TROLL | hit_0 | 507.27 | 509.43 | 0.43 | 2.16 ± 2.00 | 0 | 2 |
| aff_wrack | TROLL | hit_5 | 525.07 | 527.39 | 0.44 | 2.32 ± 1.91 | 0 | 2 |
| aff_wrack | TROLL | hit_16 | 549.13 | 550.02 | 0.16 | 0.88 ± 1.69 | 0 | 2 |
| aff_wrack | TROLL | crit_0 | 478.55 | 480.98 | 0.51 | 2.42 ± 1.29 | 0 | 2 |
| aff_wrack | TROLL | crit_30 | 618.46 | 619.89 | 0.23 | 1.43 ± 1.86 | 0 | 2 |
| aff_wrack | TROLL | regen_low | 532.82 | 533.95 | 0.21 | 1.13 ± 1.66 | 0 | 2 |
| aff_wrack | TROLL | regen_high | 564.47 | 565.52 | 0.19 | 1.05 ± 1.87 | 0 | 2 |
| aff_wrack | GNOME | baseline | 553.44 | 552.61 | -0.15 | -0.83 ± 1.67 | 0 | 2 |
| aff_wrack | GNOME | sp_250 | 402.20 | 401.62 | -0.14 | -0.58 ± 1.18 | 0 | 2 |
| aff_wrack | GNOME | sp_1000 | 855.92 | 854.58 | -0.16 | -1.34 ± 2.66 | 0 | 2 |
| aff_wrack | GNOME | int_0 | 515.29 | 515.80 | 0.10 | 0.51 ± 1.61 | 0 | 2 |
| aff_wrack | GNOME | int_400 | 587.27 | 585.91 | -0.23 | -1.35 ± 1.72 | 0 | 2 |
| aff_wrack | GNOME | hit_0 | 510.38 | 510.84 | 0.09 | 0.46 ± 2.10 | 0 | 2 |
| aff_wrack | GNOME | hit_5 | 529.80 | 530.11 | 0.06 | 0.31 ± 1.92 | 0 | 2 |
| aff_wrack | GNOME | hit_16 | 553.44 | 552.61 | -0.15 | -0.83 ± 1.67 | 0 | 2 |
| aff_wrack | GNOME | crit_0 | 484.60 | 484.17 | -0.09 | -0.44 ± 1.29 | 0 | 2 |
| aff_wrack | GNOME | crit_30 | 623.44 | 623.11 | -0.05 | -0.32 ± 1.88 | 0 | 2 |
| aff_wrack | GNOME | regen_low | 538.70 | 538.47 | -0.04 | -0.23 ± 1.68 | 0 | 2 |
| aff_wrack | GNOME | regen_high | 568.39 | 568.11 | -0.05 | -0.28 ± 1.90 | 0 | 2 |
| destro | HUMAN | baseline | 646.88 | 645.61 | -0.20 | -1.28 ± 2.06 | 0 | 1 |
| destro | HUMAN | sp_250 | 479.91 | 478.92 | -0.21 | -0.99 ± 1.51 | 0 | 1 |
| destro | HUMAN | sp_1000 | 980.83 | 978.98 | -0.19 | -1.85 ± 3.18 | 0 | 1 |
| destro | HUMAN | int_0 | 615.67 | 617.57 | 0.31 | 1.90 ± 1.86 | 0 | 1 |
| destro | HUMAN | int_400 | 676.91 | 675.85 | -0.16 | -1.06 ± 2.09 | 0 | 1 |
| destro | HUMAN | hit_0 | 577.78 | 579.71 | 0.33 | 1.93 ± 2.76 | 0 | 1 |
| destro | HUMAN | hit_5 | 607.25 | 605.89 | -0.23 | -1.37 ± 2.43 | 0 | 1 |
| destro | HUMAN | hit_16 | 646.88 | 645.61 | -0.20 | -1.28 ± 2.06 | 0 | 1 |
| destro | HUMAN | crit_0 | 569.23 | 568.18 | -0.19 | -1.05 ± 1.36 | 0 | 1 |
| destro | HUMAN | crit_30 | 723.27 | 723.16 | -0.02 | -0.11 ± 2.25 | 0 | 1 |
| destro | HUMAN | regen_low | 627.96 | 625.73 | -0.36 | -2.23 ± 2.05 | 0 | 1 |
| destro | HUMAN | regen_high | 671.47 | 671.06 | -0.06 | -0.41 ± 2.05 | 0 | 1 |
| destro | ORC | baseline | 643.96 | 642.81 | -0.18 | -1.15 ± 2.03 | 0 | 1 |
| destro | ORC | sp_250 | 477.35 | 476.39 | -0.20 | -0.97 ± 1.48 | 0 | 1 |
| destro | ORC | sp_1000 | 977.17 | 975.66 | -0.15 | -1.51 ± 3.14 | 0 | 1 |
| destro | ORC | int_0 | 619.72 | 619.12 | -0.10 | -0.60 ± 1.88 | 0 | 1 |
| destro | ORC | int_400 | 681.89 | 682.36 | 0.07 | 0.48 ± 2.12 | 0 | 1 |
| destro | ORC | hit_0 | 574.12 | 575.67 | 0.27 | 1.55 ± 2.68 | 0 | 1 |
| destro | ORC | hit_5 | 603.17 | 602.79 | -0.06 | -0.38 ± 2.47 | 0 | 1 |
| destro | ORC | hit_16 | 643.96 | 642.81 | -0.18 | -1.15 ± 2.03 | 0 | 1 |
| destro | ORC | crit_0 | 565.74 | 565.33 | -0.07 | -0.40 ± 1.31 | 0 | 1 |
| destro | ORC | crit_30 | 720.81 | 721.11 | 0.04 | 0.30 ± 2.31 | 0 | 1 |
| destro | ORC | regen_low | 620.49 | 620.14 | -0.06 | -0.35 ± 1.96 | 0 | 1 |
| destro | ORC | regen_high | 677.36 | 676.31 | -0.16 | -1.06 ± 2.05 | 0 | 1 |
| destro | UNDEAD | baseline | 642.59 | 640.87 | -0.27 | -1.72 ± 1.98 | 0 | 1 |
| destro | UNDEAD | sp_250 | 479.09 | 477.88 | -0.25 | -1.21 ± 1.45 | 0 | 1 |
| destro | UNDEAD | sp_1000 | 969.60 | 966.86 | -0.28 | -2.73 ± 3.05 | 0 | 1 |
| destro | UNDEAD | int_0 | 614.51 | 613.10 | -0.23 | -1.41 ± 1.84 | 0 | 1 |
| destro | UNDEAD | int_400 | 677.30 | 677.48 | 0.03 | 0.18 ± 2.04 | 0 | 1 |
| destro | UNDEAD | hit_0 | 571.34 | 572.51 | 0.20 | 1.17 ± 2.62 | 0 | 1 |
| destro | UNDEAD | hit_5 | 602.27 | 602.67 | 0.07 | 0.40 ± 2.39 | 0 | 1 |
| destro | UNDEAD | hit_16 | 642.59 | 640.87 | -0.27 | -1.72 ± 1.98 | 0 | 1 |
| destro | UNDEAD | crit_0 | 564.55 | 565.25 | 0.12 | 0.70 ± 1.27 | 0 | 1 |
| destro | UNDEAD | crit_30 | 718.58 | 717.97 | -0.09 | -0.61 ± 2.24 | 0 | 1 |
| destro | UNDEAD | regen_low | 613.54 | 614.22 | 0.11 | 0.69 ± 1.88 | 0 | 1 |
| destro | UNDEAD | regen_high | 667.24 | 665.94 | -0.19 | -1.30 ± 2.05 | 0 | 1 |
| destro | TROLL | baseline | 632.78 | 632.00 | -0.12 | -0.78 ± 1.93 | 0 | 1 |
| destro | TROLL | sp_250 | 470.21 | 469.68 | -0.11 | -0.53 ± 1.42 | 0 | 1 |
| destro | TROLL | sp_1000 | 957.91 | 956.64 | -0.13 | -1.27 ± 2.98 | 0 | 1 |
| destro | TROLL | int_0 | 604.05 | 602.99 | -0.18 | -1.07 ± 1.83 | 0 | 1 |
| destro | TROLL | int_400 | 674.13 | 672.79 | -0.20 | -1.34 ± 2.08 | 0 | 1 |
| destro | TROLL | hit_0 | 566.93 | 567.30 | 0.07 | 0.37 ± 2.63 | 0 | 1 |
| destro | TROLL | hit_5 | 596.03 | 594.50 | -0.26 | -1.54 ± 2.44 | 0 | 1 |
| destro | TROLL | hit_16 | 632.78 | 632.00 | -0.12 | -0.78 ± 1.93 | 0 | 1 |
| destro | TROLL | crit_0 | 555.03 | 555.03 | -0.00 | -0.00 ± 1.23 | 0 | 1 |
| destro | TROLL | crit_30 | 709.72 | 708.21 | -0.21 | -1.52 ± 2.16 | 0 | 1 |
| destro | TROLL | regen_low | 617.52 | 616.66 | -0.14 | -0.86 ± 1.95 | 0 | 1 |
| destro | TROLL | regen_high | 665.70 | 665.15 | -0.08 | -0.55 ± 1.97 | 0 | 1 |
| destro | GNOME | baseline | 637.71 | 636.17 | -0.24 | -1.53 ± 1.93 | 0 | 1 |
| destro | GNOME | sp_250 | 473.61 | 472.39 | -0.26 | -1.22 ± 1.41 | 0 | 1 |
| destro | GNOME | sp_1000 | 965.89 | 963.73 | -0.22 | -2.16 ± 2.97 | 0 | 1 |
| destro | GNOME | int_0 | 612.24 | 612.80 | 0.09 | 0.56 ± 1.86 | 0 | 1 |
| destro | GNOME | int_400 | 674.70 | 673.92 | -0.12 | -0.78 ± 2.05 | 0 | 1 |
| destro | GNOME | hit_0 | 570.01 | 571.27 | 0.22 | 1.26 ± 2.70 | 0 | 1 |
| destro | GNOME | hit_5 | 599.50 | 597.75 | -0.29 | -1.75 ± 2.40 | 0 | 1 |
| destro | GNOME | hit_16 | 637.71 | 636.17 | -0.24 | -1.53 ± 1.93 | 0 | 1 |
| destro | GNOME | crit_0 | 560.02 | 559.14 | -0.16 | -0.88 ± 1.27 | 0 | 1 |
| destro | GNOME | crit_30 | 714.73 | 713.53 | -0.17 | -1.20 ± 2.21 | 0 | 1 |
| destro | GNOME | regen_low | 620.82 | 619.25 | -0.25 | -1.57 ± 1.93 | 0 | 1 |
| destro | GNOME | regen_high | 679.29 | 679.85 | 0.08 | 0.56 ± 2.18 | 0 | 1 |
| demo_shadow_brand | HUMAN | baseline | 715.71 | 715.99 | 0.04 | 0.28 ± 2.91 | 0 | 1 |
| demo_shadow_brand | HUMAN | sp_250 | 540.51 | 540.76 | 0.05 | 0.25 ± 2.13 | 0 | 1 |
| demo_shadow_brand | HUMAN | sp_1000 | 1066.12 | 1066.46 | 0.03 | 0.34 ± 4.48 | 0 | 1 |
| demo_shadow_brand | HUMAN | int_0 | 677.72 | 678.49 | 0.11 | 0.76 ± 2.74 | 0 | 1 |
| demo_shadow_brand | HUMAN | int_400 | 759.09 | 758.99 | -0.01 | -0.11 ± 3.07 | 0 | 1 |
| demo_shadow_brand | HUMAN | hit_0 | 624.25 | 623.14 | -0.18 | -1.11 ± 3.50 | 0 | 1 |
| demo_shadow_brand | HUMAN | hit_5 | 664.84 | 664.27 | -0.08 | -0.56 ± 3.39 | 0 | 1 |
| demo_shadow_brand | HUMAN | hit_16 | 748.63 | 747.59 | -0.14 | -1.04 ± 2.59 | 0 | 1 |
| demo_shadow_brand | HUMAN | crit_0 | 629.35 | 630.38 | 0.16 | 1.03 ± 2.13 | 0 | 1 |
| demo_shadow_brand | HUMAN | crit_30 | 801.33 | 804.32 | 0.37 | 3.00 ± 3.30 | 0 | 1 |
| demo_shadow_brand | HUMAN | regen_low | 692.60 | 694.14 | 0.22 | 1.54 ± 2.78 | 0 | 1 |
| demo_shadow_brand | HUMAN | regen_high | 749.08 | 747.58 | -0.20 | -1.49 ± 2.99 | 0 | 1 |
| demo_shadow_brand | ORC | baseline | 712.90 | 714.31 | 0.20 | 1.40 ± 2.91 | 0 | 1 |
| demo_shadow_brand | ORC | sp_250 | 537.54 | 538.49 | 0.18 | 0.95 ± 2.12 | 0 | 1 |
| demo_shadow_brand | ORC | sp_1000 | 1063.63 | 1065.95 | 0.22 | 2.32 ± 4.48 | 0 | 1 |
| demo_shadow_brand | ORC | int_0 | 676.74 | 676.52 | -0.03 | -0.22 ± 2.69 | 0 | 1 |
| demo_shadow_brand | ORC | int_400 | 756.29 | 756.19 | -0.01 | -0.10 ± 3.05 | 0 | 1 |
| demo_shadow_brand | ORC | hit_0 | 621.96 | 621.51 | -0.07 | -0.45 ± 3.51 | 0 | 1 |
| demo_shadow_brand | ORC | hit_5 | 662.16 | 661.84 | -0.05 | -0.32 ± 3.34 | 0 | 1 |
| demo_shadow_brand | ORC | hit_16 | 743.31 | 745.17 | 0.25 | 1.85 ± 2.55 | 0 | 1 |
| demo_shadow_brand | ORC | crit_0 | 626.36 | 628.04 | 0.27 | 1.68 ± 2.04 | 0 | 1 |
| demo_shadow_brand | ORC | crit_30 | 799.68 | 803.33 | 0.46 | 3.65 ± 3.26 | 0 | 1 |
| demo_shadow_brand | ORC | regen_low | 691.30 | 691.64 | 0.05 | 0.35 ± 2.74 | 0 | 1 |
| demo_shadow_brand | ORC | regen_high | 743.14 | 742.37 | -0.10 | -0.77 ± 2.97 | 0 | 1 |
| demo_shadow_brand | UNDEAD | baseline | 711.99 | 710.74 | -0.18 | -1.25 ± 2.84 | 0 | 1 |
| demo_shadow_brand | UNDEAD | sp_250 | 539.22 | 538.48 | -0.14 | -0.74 ± 2.08 | 0 | 1 |
| demo_shadow_brand | UNDEAD | sp_1000 | 1057.54 | 1055.26 | -0.22 | -2.28 ± 4.37 | 0 | 1 |
| demo_shadow_brand | UNDEAD | int_0 | 671.48 | 672.00 | 0.08 | 0.51 ± 2.56 | 0 | 1 |
| demo_shadow_brand | UNDEAD | int_400 | 753.29 | 754.33 | 0.14 | 1.03 ± 3.00 | 0 | 1 |
| demo_shadow_brand | UNDEAD | hit_0 | 617.84 | 619.72 | 0.31 | 1.89 ± 3.37 | 0 | 1 |
| demo_shadow_brand | UNDEAD | hit_5 | 657.93 | 660.32 | 0.36 | 2.39 ± 3.16 | 0 | 1 |
| demo_shadow_brand | UNDEAD | hit_16 | 741.37 | 743.29 | 0.26 | 1.93 ± 2.53 | 0 | 1 |
| demo_shadow_brand | UNDEAD | crit_0 | 624.84 | 623.28 | -0.25 | -1.56 ± 1.95 | 0 | 1 |
| demo_shadow_brand | UNDEAD | crit_30 | 798.33 | 796.79 | -0.19 | -1.54 ± 3.21 | 0 | 1 |
| demo_shadow_brand | UNDEAD | regen_low | 688.58 | 689.19 | 0.09 | 0.61 ± 2.71 | 0 | 1 |
| demo_shadow_brand | UNDEAD | regen_high | 739.03 | 741.69 | 0.36 | 2.66 ± 2.91 | 0 | 1 |
| demo_shadow_brand | TROLL | baseline | 705.95 | 706.74 | 0.11 | 0.79 ± 2.82 | 0 | 1 |
| demo_shadow_brand | TROLL | sp_250 | 533.15 | 533.72 | 0.11 | 0.58 ± 2.06 | 0 | 1 |
| demo_shadow_brand | TROLL | sp_1000 | 1051.55 | 1052.77 | 0.12 | 1.22 ± 4.34 | 0 | 1 |
| demo_shadow_brand | TROLL | int_0 | 668.06 | 667.40 | -0.10 | -0.66 ± 2.63 | 0 | 1 |
| demo_shadow_brand | TROLL | int_400 | 748.70 | 747.22 | -0.20 | -1.49 ± 3.01 | 0 | 1 |
| demo_shadow_brand | TROLL | hit_0 | 614.15 | 615.58 | 0.23 | 1.43 ± 3.42 | 0 | 1 |
| demo_shadow_brand | TROLL | hit_5 | 654.18 | 654.89 | 0.11 | 0.71 ± 3.25 | 0 | 1 |
| demo_shadow_brand | TROLL | hit_16 | 736.49 | 735.89 | -0.08 | -0.59 ± 2.45 | 0 | 1 |
| demo_shadow_brand | TROLL | crit_0 | 619.70 | 620.12 | 0.07 | 0.42 ± 1.97 | 0 | 1 |
| demo_shadow_brand | TROLL | crit_30 | 792.54 | 794.52 | 0.25 | 1.98 ± 3.20 | 0 | 1 |
| demo_shadow_brand | TROLL | regen_low | 683.45 | 683.64 | 0.03 | 0.19 ± 2.72 | 0 | 1 |
| demo_shadow_brand | TROLL | regen_high | 734.82 | 733.94 | -0.12 | -0.89 ± 2.94 | 0 | 1 |
| demo_shadow_brand | GNOME | baseline | 707.83 | 708.60 | 0.11 | 0.77 ± 2.82 | 0 | 1 |
| demo_shadow_brand | GNOME | sp_250 | 534.60 | 535.21 | 0.11 | 0.60 ± 2.07 | 0 | 1 |
| demo_shadow_brand | GNOME | sp_1000 | 1054.28 | 1055.40 | 0.11 | 1.12 ± 4.34 | 0 | 1 |
| demo_shadow_brand | GNOME | int_0 | 665.82 | 666.93 | 0.17 | 1.11 ± 2.52 | 0 | 1 |
| demo_shadow_brand | GNOME | int_400 | 752.99 | 751.94 | -0.14 | -1.04 ± 3.09 | 0 | 1 |
| demo_shadow_brand | GNOME | hit_0 | 614.99 | 616.80 | 0.29 | 1.81 ± 3.46 | 0 | 1 |
| demo_shadow_brand | GNOME | hit_5 | 653.72 | 658.32 | 0.70 | 4.61 ± 3.25 | 0 | 1 |
| demo_shadow_brand | GNOME | hit_16 | 737.34 | 737.99 | 0.09 | 0.66 ± 2.51 | 0 | 1 |
| demo_shadow_brand | GNOME | crit_0 | 620.96 | 621.44 | 0.08 | 0.48 ± 2.00 | 0 | 1 |
| demo_shadow_brand | GNOME | crit_30 | 794.11 | 795.68 | 0.20 | 1.57 ± 3.23 | 0 | 1 |
| demo_shadow_brand | GNOME | regen_low | 682.67 | 683.88 | 0.18 | 1.21 ± 2.66 | 0 | 1 |
| demo_shadow_brand | GNOME | regen_high | 736.59 | 736.55 | -0.00 | -0.04 ± 2.89 | 0 | 1 |
| demo_fire_brand | HUMAN | baseline | 752.84 | 754.18 | 0.18 | 1.34 ± 1.99 | 0 | 1 |
| demo_fire_brand | HUMAN | sp_250 | 570.70 | 571.96 | 0.22 | 1.26 ± 1.48 | 0 | 1 |
| demo_fire_brand | HUMAN | sp_1000 | 1117.11 | 1118.61 | 0.13 | 1.49 ± 3.04 | 0 | 1 |
| demo_fire_brand | HUMAN | int_0 | 717.46 | 719.80 | 0.33 | 2.34 ± 1.85 | 0 | 1 |
| demo_fire_brand | HUMAN | int_400 | 788.86 | 790.68 | 0.23 | 1.82 ± 2.12 | 0 | 1 |
| demo_fire_brand | HUMAN | hit_0 | 658.88 | 658.73 | -0.02 | -0.16 ± 2.67 | 0 | 1 |
| demo_fire_brand | HUMAN | hit_5 | 697.71 | 698.50 | 0.11 | 0.80 ± 2.50 | 0 | 1 |
| demo_fire_brand | HUMAN | hit_16 | 785.00 | 785.75 | 0.10 | 0.75 ± 1.55 | 0 | 1 |
| demo_fire_brand | HUMAN | crit_0 | 681.59 | 682.86 | 0.19 | 1.27 ± 1.59 | 0 | 1 |
| demo_fire_brand | HUMAN | crit_30 | 824.62 | 825.89 | 0.15 | 1.27 ± 2.23 | 0 | 1 |
| demo_fire_brand | HUMAN | regen_low | 731.87 | 732.21 | 0.05 | 0.33 ± 1.99 | 0 | 1 |
| demo_fire_brand | HUMAN | regen_high | 774.69 | 777.12 | 0.31 | 2.43 ± 2.01 | 0 | 1 |
| demo_fire_brand | ORC | baseline | 749.89 | 751.90 | 0.27 | 2.02 ± 1.95 | 0 | 1 |
| demo_fire_brand | ORC | sp_250 | 567.69 | 569.44 | 0.31 | 1.74 ± 1.44 | 0 | 1 |
| demo_fire_brand | ORC | sp_1000 | 1114.28 | 1116.84 | 0.23 | 2.57 ± 2.98 | 0 | 1 |
| demo_fire_brand | ORC | int_0 | 718.32 | 720.25 | 0.27 | 1.93 ± 1.86 | 0 | 1 |
| demo_fire_brand | ORC | int_400 | 791.63 | 794.78 | 0.40 | 3.15 ± 2.20 | 0 | 1 |
| demo_fire_brand | ORC | hit_0 | 656.91 | 657.18 | 0.04 | 0.27 ± 2.73 | 0 | 1 |
| demo_fire_brand | ORC | hit_5 | 696.96 | 698.05 | 0.16 | 1.08 ± 2.46 | 0 | 1 |
| demo_fire_brand | ORC | hit_16 | 779.78 | 781.00 | 0.16 | 1.22 ± 1.55 | 0 | 1 |
| demo_fire_brand | ORC | crit_0 | 678.78 | 680.61 | 0.27 | 1.83 ± 1.58 | 0 | 1 |
| demo_fire_brand | ORC | crit_30 | 821.65 | 823.28 | 0.20 | 1.64 ± 2.16 | 0 | 1 |
| demo_fire_brand | ORC | regen_low | 730.26 | 730.96 | 0.10 | 0.71 ± 2.04 | 0 | 1 |
| demo_fire_brand | ORC | regen_high | 771.26 | 772.52 | 0.16 | 1.26 ± 2.01 | 0 | 1 |
| demo_fire_brand | UNDEAD | baseline | 752.13 | 753.55 | 0.19 | 1.42 ± 2.01 | 0 | 1 |
| demo_fire_brand | UNDEAD | sp_250 | 572.19 | 573.54 | 0.24 | 1.36 ± 1.49 | 0 | 1 |
| demo_fire_brand | UNDEAD | sp_1000 | 1112.00 | 1113.56 | 0.14 | 1.55 ± 3.05 | 0 | 1 |
| demo_fire_brand | UNDEAD | int_0 | 714.43 | 715.29 | 0.12 | 0.85 ± 1.84 | 0 | 1 |
| demo_fire_brand | UNDEAD | int_400 | 785.51 | 786.83 | 0.17 | 1.32 ± 2.01 | 0 | 1 |
| demo_fire_brand | UNDEAD | hit_0 | 655.89 | 657.86 | 0.30 | 1.97 ± 2.65 | 0 | 1 |
| demo_fire_brand | UNDEAD | hit_5 | 695.05 | 697.35 | 0.33 | 2.30 ± 2.49 | 0 | 1 |
| demo_fire_brand | UNDEAD | hit_16 | 787.08 | 788.40 | 0.17 | 1.33 ± 1.64 | 0 | 1 |
| demo_fire_brand | UNDEAD | crit_0 | 680.44 | 681.51 | 0.16 | 1.08 ± 1.61 | 0 | 1 |
| demo_fire_brand | UNDEAD | crit_30 | 823.58 | 824.71 | 0.14 | 1.13 ± 2.23 | 0 | 1 |
| demo_fire_brand | UNDEAD | regen_low | 730.65 | 733.02 | 0.32 | 2.36 ± 2.06 | 0 | 1 |
| demo_fire_brand | UNDEAD | regen_high | 769.86 | 771.55 | 0.22 | 1.69 ± 2.00 | 0 | 1 |
| demo_fire_brand | TROLL | baseline | 744.48 | 747.13 | 0.36 | 2.65 ± 2.00 | 0 | 1 |
| demo_fire_brand | TROLL | sp_250 | 564.55 | 566.71 | 0.38 | 2.16 ± 1.48 | 0 | 1 |
| demo_fire_brand | TROLL | sp_1000 | 1104.36 | 1107.99 | 0.33 | 3.63 ± 3.04 | 0 | 1 |
| demo_fire_brand | TROLL | int_0 | 711.44 | 712.42 | 0.14 | 0.98 ± 1.79 | 0 | 1 |
| demo_fire_brand | TROLL | int_400 | 778.61 | 779.67 | 0.14 | 1.06 ± 2.09 | 0 | 1 |
| demo_fire_brand | TROLL | hit_0 | 650.89 | 651.21 | 0.05 | 0.32 ± 2.65 | 0 | 1 |
| demo_fire_brand | TROLL | hit_5 | 690.49 | 691.33 | 0.12 | 0.84 ± 2.48 | 0 | 1 |
| demo_fire_brand | TROLL | hit_16 | 779.76 | 780.55 | 0.10 | 0.79 ± 1.56 | 0 | 1 |
| demo_fire_brand | TROLL | crit_0 | 673.60 | 675.51 | 0.28 | 1.91 ± 1.56 | 0 | 1 |
| demo_fire_brand | TROLL | crit_30 | 816.72 | 818.05 | 0.16 | 1.33 ± 2.24 | 0 | 1 |
| demo_fire_brand | TROLL | regen_low | 724.40 | 725.40 | 0.14 | 1.00 ± 1.96 | 0 | 1 |
| demo_fire_brand | TROLL | regen_high | 767.17 | 768.41 | 0.16 | 1.23 ± 2.04 | 0 | 1 |
| demo_fire_brand | GNOME | baseline | 745.46 | 746.72 | 0.17 | 1.26 ± 1.92 | 0 | 1 |
| demo_fire_brand | GNOME | sp_250 | 565.02 | 566.19 | 0.21 | 1.17 ± 1.42 | 0 | 1 |
| demo_fire_brand | GNOME | sp_1000 | 1106.35 | 1107.78 | 0.13 | 1.44 ± 2.93 | 0 | 1 |
| demo_fire_brand | GNOME | int_0 | 713.15 | 714.85 | 0.24 | 1.70 ± 1.97 | 0 | 1 |
| demo_fire_brand | GNOME | int_400 | 778.33 | 779.52 | 0.15 | 1.19 ± 2.03 | 0 | 1 |
| demo_fire_brand | GNOME | hit_0 | 652.09 | 652.42 | 0.05 | 0.32 ± 2.69 | 0 | 1 |
| demo_fire_brand | GNOME | hit_5 | 693.17 | 693.07 | -0.01 | -0.10 ± 2.49 | 0 | 1 |
| demo_fire_brand | GNOME | hit_16 | 774.13 | 774.40 | 0.04 | 0.27 ± 1.54 | 0 | 1 |
| demo_fire_brand | GNOME | crit_0 | 673.82 | 674.83 | 0.15 | 1.00 ± 1.47 | 0 | 1 |
| demo_fire_brand | GNOME | crit_30 | 817.96 | 817.94 | -0.00 | -0.02 ± 2.15 | 0 | 1 |
| demo_fire_brand | GNOME | regen_low | 728.44 | 732.17 | 0.51 | 3.73 ± 2.09 | 0 | 1 |
| demo_fire_brand | GNOME | regen_high | 770.26 | 770.80 | 0.07 | 0.53 ± 2.08 | 0 | 1 |

The JSON companion includes exact requests, resolved app configs, source/app hashes, input differences, import diagnostics, and spell/pet breakdowns. Existing five-preset benchmark artifacts are unchanged.
