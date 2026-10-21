# Forever race/stat diagnostic sweep

complete: 300/300 combinations completed; 1000 fights per engine per combination, seed 101.

Full preset × race × profile sweep. Profiles change one baseline stat at a time, except regeneration profiles which jointly change spirit and mp5. All stats are bonuses above racial/class bases. Gear-free, 180s, zero distance, external CoE only, no consumables. Source APLs are retained, including their race-specific action IDs; this measures import behavior rather than optimizing each race's rotation.

**Diagnostic only.** Source APLs are retained for every race, including race-specific action IDs. Unsupported imports are recorded, not treated as accepted parity. Gear and consumables are absent.

Intervals are approximate 95% Monte Carlo intervals for independent-engine mean differences. At 100 trials they are noisy, and intervals are not adjusted for multiple comparisons. Equal seeds do not pair RNG streams. Small total differences can hide offsetting spell errors.

| Preset | Cases | Mean absolute delta % | Worst absolute delta % |
| --- | ---: | ---: | ---: |
| sm_ruin | 60 | 0.26 | 0.90 |
| aff_wrack | 60 | 0.33 | 0.86 |
| destro | 60 | 0.25 | 1.09 |
| demo_shadow_brand | 60 | 0.41 | 1.15 |
| demo_fire_brand | 60 | 0.25 | 0.62 |

## Largest observed total differences

| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| demo_shadow_brand | UNDEAD | hit_0 | 617.84 | 624.97 | 1.15 | 7.13 ± 3.41 |
| demo_shadow_brand | GNOME | hit_0 | 614.99 | 621.70 | 1.09 | 6.71 ± 3.40 |
| destro | TROLL | regen_high | 665.70 | 658.46 | -1.09 | -7.24 ± 1.98 |
| demo_shadow_brand | HUMAN | hit_0 | 624.25 | 630.35 | 0.98 | 6.10 ± 3.54 |
| demo_shadow_brand | UNDEAD | hit_5 | 657.93 | 664.17 | 0.95 | 6.25 ± 3.11 |
| destro | TROLL | crit_30 | 709.72 | 716.41 | 0.94 | 6.69 ± 2.17 |
| destro | TROLL | sp_1000 | 957.91 | 966.83 | 0.93 | 8.93 ± 2.91 |
| destro | TROLL | crit_0 | 555.03 | 560.18 | 0.93 | 5.16 ± 1.20 |
| demo_shadow_brand | GNOME | hit_5 | 653.72 | 659.72 | 0.92 | 6.00 ± 3.26 |
| sm_ruin | TROLL | int_0 | 599.33 | 604.70 | 0.90 | 5.37 ± 2.78 |
| destro | TROLL | baseline | 632.78 | 638.37 | 0.88 | 5.60 ± 1.88 |
| destro | TROLL | hit_16 | 632.78 | 638.37 | 0.88 | 5.60 ± 1.88 |
| demo_shadow_brand | TROLL | hit_0 | 614.15 | 619.46 | 0.86 | 5.31 ± 3.48 |
| demo_shadow_brand | HUMAN | crit_30 | 801.33 | 808.25 | 0.86 | 6.92 ± 3.27 |
| aff_wrack | GNOME | hit_0 | 510.38 | 514.75 | 0.86 | 4.37 ± 2.08 |
| destro | TROLL | sp_250 | 470.21 | 474.14 | 0.84 | 3.93 ± 1.38 |
| demo_shadow_brand | ORC | hit_0 | 621.96 | 627.09 | 0.82 | 5.13 ± 3.62 |
| aff_wrack | TROLL | regen_low | 532.82 | 536.98 | 0.78 | 4.15 ± 1.68 |
| aff_wrack | TROLL | hit_5 | 525.07 | 529.02 | 0.75 | 3.95 ± 1.97 |
| aff_wrack | TROLL | hit_0 | 507.27 | 510.96 | 0.73 | 3.69 ± 2.05 |

## All combinations

| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% | Stat differences | Group omissions |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| sm_ruin | HUMAN | baseline | 653.96 | 651.95 | -0.31 | -2.01 ± 2.94 | 0 | 1 |
| sm_ruin | HUMAN | sp_250 | 476.47 | 475.03 | -0.30 | -1.44 ± 2.10 | 0 | 1 |
| sm_ruin | HUMAN | sp_1000 | 1008.94 | 1005.79 | -0.31 | -3.16 ± 4.64 | 0 | 1 |
| sm_ruin | HUMAN | int_0 | 617.27 | 616.62 | -0.11 | -0.65 ± 2.75 | 0 | 1 |
| sm_ruin | HUMAN | int_400 | 690.83 | 691.50 | 0.10 | 0.67 ± 3.16 | 0 | 1 |
| sm_ruin | HUMAN | hit_0 | 579.92 | 579.85 | -0.01 | -0.07 ± 3.52 | 0 | 1 |
| sm_ruin | HUMAN | hit_5 | 611.57 | 611.40 | -0.03 | -0.16 ± 3.37 | 0 | 1 |
| sm_ruin | HUMAN | hit_16 | 653.96 | 651.95 | -0.31 | -2.01 ± 2.94 | 0 | 1 |
| sm_ruin | HUMAN | crit_0 | 555.18 | 554.67 | -0.09 | -0.51 ± 2.26 | 0 | 1 |
| sm_ruin | HUMAN | crit_30 | 749.22 | 747.75 | -0.20 | -1.47 ± 3.09 | 0 | 1 |
| sm_ruin | HUMAN | regen_low | 631.02 | 632.43 | 0.22 | 1.41 ± 2.94 | 0 | 1 |
| sm_ruin | HUMAN | regen_high | 678.75 | 679.17 | 0.06 | 0.42 ± 2.99 | 0 | 1 |
| sm_ruin | ORC | baseline | 647.77 | 648.22 | 0.07 | 0.45 ± 2.94 | 0 | 1 |
| sm_ruin | ORC | sp_250 | 471.00 | 471.28 | 0.06 | 0.28 ± 2.09 | 0 | 1 |
| sm_ruin | ORC | sp_1000 | 1001.31 | 1002.09 | 0.08 | 0.78 ± 4.66 | 0 | 1 |
| sm_ruin | ORC | int_0 | 612.04 | 611.02 | -0.17 | -1.02 ± 2.77 | 0 | 1 |
| sm_ruin | ORC | int_400 | 688.07 | 688.96 | 0.13 | 0.89 ± 3.09 | 0 | 1 |
| sm_ruin | ORC | hit_0 | 576.30 | 576.24 | -0.01 | -0.06 ± 3.49 | 0 | 1 |
| sm_ruin | ORC | hit_5 | 607.75 | 606.14 | -0.26 | -1.60 ± 3.33 | 0 | 1 |
| sm_ruin | ORC | hit_16 | 647.77 | 648.22 | 0.07 | 0.45 ± 2.94 | 0 | 1 |
| sm_ruin | ORC | crit_0 | 548.98 | 550.02 | 0.19 | 1.04 ± 2.22 | 0 | 1 |
| sm_ruin | ORC | crit_30 | 744.44 | 744.75 | 0.04 | 0.31 ± 3.14 | 0 | 1 |
| sm_ruin | ORC | regen_low | 629.07 | 630.34 | 0.20 | 1.27 ± 2.95 | 0 | 1 |
| sm_ruin | ORC | regen_high | 673.65 | 675.19 | 0.23 | 1.54 ± 3.08 | 0 | 1 |
| sm_ruin | UNDEAD | baseline | 644.36 | 646.52 | 0.34 | 2.16 ± 2.88 | 0 | 1 |
| sm_ruin | UNDEAD | sp_250 | 471.44 | 473.02 | 0.33 | 1.57 ± 2.05 | 0 | 1 |
| sm_ruin | UNDEAD | sp_1000 | 990.19 | 993.53 | 0.34 | 3.33 ± 4.53 | 0 | 1 |
| sm_ruin | UNDEAD | int_0 | 607.94 | 607.24 | -0.11 | -0.70 ± 2.72 | 0 | 1 |
| sm_ruin | UNDEAD | int_400 | 683.63 | 683.09 | -0.08 | -0.54 ± 3.03 | 0 | 1 |
| sm_ruin | UNDEAD | hit_0 | 574.14 | 574.95 | 0.14 | 0.81 ± 3.48 | 0 | 1 |
| sm_ruin | UNDEAD | hit_5 | 604.71 | 604.28 | -0.07 | -0.43 ± 3.24 | 0 | 1 |
| sm_ruin | UNDEAD | hit_16 | 644.36 | 646.52 | 0.34 | 2.16 ± 2.88 | 0 | 1 |
| sm_ruin | UNDEAD | crit_0 | 546.45 | 547.55 | 0.20 | 1.10 ± 2.10 | 0 | 1 |
| sm_ruin | UNDEAD | crit_30 | 740.89 | 741.50 | 0.08 | 0.61 ± 3.11 | 0 | 1 |
| sm_ruin | UNDEAD | regen_low | 624.51 | 625.60 | 0.18 | 1.10 ± 2.89 | 0 | 1 |
| sm_ruin | UNDEAD | regen_high | 669.25 | 671.35 | 0.31 | 2.10 ± 2.97 | 0 | 1 |
| sm_ruin | TROLL | baseline | 637.81 | 641.87 | 0.64 | 4.06 ± 2.91 | 0 | 1 |
| sm_ruin | TROLL | sp_250 | 464.77 | 467.64 | 0.62 | 2.87 ± 2.07 | 0 | 1 |
| sm_ruin | TROLL | sp_1000 | 983.87 | 990.32 | 0.66 | 6.45 ± 4.60 | 0 | 1 |
| sm_ruin | TROLL | int_0 | 599.33 | 604.70 | 0.90 | 5.37 ± 2.78 | 0 | 1 |
| sm_ruin | TROLL | int_400 | 675.08 | 678.93 | 0.57 | 3.85 ± 2.99 | 0 | 1 |
| sm_ruin | TROLL | hit_0 | 567.48 | 568.61 | 0.20 | 1.13 ± 3.42 | 0 | 1 |
| sm_ruin | TROLL | hit_5 | 599.35 | 599.17 | -0.03 | -0.18 ± 3.35 | 0 | 1 |
| sm_ruin | TROLL | hit_16 | 637.81 | 641.87 | 0.64 | 4.06 ± 2.91 | 0 | 1 |
| sm_ruin | TROLL | crit_0 | 540.11 | 543.08 | 0.55 | 2.98 ± 2.12 | 0 | 1 |
| sm_ruin | TROLL | crit_30 | 734.06 | 737.96 | 0.53 | 3.90 ± 3.12 | 0 | 1 |
| sm_ruin | TROLL | regen_low | 616.48 | 620.64 | 0.67 | 4.16 ± 2.82 | 0 | 1 |
| sm_ruin | TROLL | regen_high | 663.43 | 664.64 | 0.18 | 1.21 ± 3.08 | 0 | 1 |
| sm_ruin | GNOME | baseline | 640.54 | 642.31 | 0.28 | 1.77 ± 2.92 | 0 | 1 |
| sm_ruin | GNOME | sp_250 | 466.78 | 468.08 | 0.28 | 1.30 ± 2.09 | 0 | 1 |
| sm_ruin | GNOME | sp_1000 | 988.07 | 990.77 | 0.27 | 2.71 ± 4.60 | 0 | 1 |
| sm_ruin | GNOME | int_0 | 605.31 | 603.26 | -0.34 | -2.05 ± 2.71 | 0 | 1 |
| sm_ruin | GNOME | int_400 | 678.78 | 680.53 | 0.26 | 1.75 ± 3.01 | 0 | 1 |
| sm_ruin | GNOME | hit_0 | 571.55 | 571.42 | -0.02 | -0.13 ± 3.58 | 0 | 1 |
| sm_ruin | GNOME | hit_5 | 602.69 | 599.27 | -0.57 | -3.42 ± 3.31 | 0 | 1 |
| sm_ruin | GNOME | hit_16 | 640.54 | 642.31 | 0.28 | 1.77 ± 2.92 | 0 | 1 |
| sm_ruin | GNOME | crit_0 | 542.61 | 543.44 | 0.15 | 0.83 ± 2.17 | 0 | 1 |
| sm_ruin | GNOME | crit_30 | 737.27 | 738.83 | 0.21 | 1.56 ± 3.16 | 0 | 1 |
| sm_ruin | GNOME | regen_low | 622.28 | 624.36 | 0.33 | 2.08 ± 2.89 | 0 | 1 |
| sm_ruin | GNOME | regen_high | 662.79 | 666.98 | 0.63 | 4.19 ± 3.03 | 0 | 1 |
| aff_wrack | HUMAN | baseline | 559.93 | 561.37 | 0.26 | 1.44 ± 1.75 | 0 | 2 |
| aff_wrack | HUMAN | sp_250 | 406.98 | 407.90 | 0.23 | 0.92 ± 1.24 | 0 | 2 |
| aff_wrack | HUMAN | sp_1000 | 865.83 | 868.30 | 0.29 | 2.48 ± 2.78 | 0 | 2 |
| aff_wrack | HUMAN | int_0 | 532.37 | 533.26 | 0.17 | 0.89 ± 1.62 | 0 | 2 |
| aff_wrack | HUMAN | int_400 | 591.26 | 592.83 | 0.27 | 1.57 ± 1.81 | 0 | 2 |
| aff_wrack | HUMAN | hit_0 | 517.36 | 519.82 | 0.47 | 2.46 ± 2.11 | 0 | 2 |
| aff_wrack | HUMAN | hit_5 | 536.30 | 537.73 | 0.27 | 1.44 ± 2.00 | 0 | 2 |
| aff_wrack | HUMAN | hit_16 | 559.93 | 561.37 | 0.26 | 1.44 ± 1.75 | 0 | 2 |
| aff_wrack | HUMAN | crit_0 | 489.76 | 491.20 | 0.29 | 1.44 ± 1.49 | 0 | 2 |
| aff_wrack | HUMAN | crit_30 | 629.74 | 632.23 | 0.39 | 2.49 ± 1.89 | 0 | 2 |
| aff_wrack | HUMAN | regen_low | 540.35 | 542.52 | 0.40 | 2.18 ± 1.85 | 0 | 2 |
| aff_wrack | HUMAN | regen_high | 573.38 | 575.22 | 0.32 | 1.84 ± 1.94 | 0 | 2 |
| aff_wrack | ORC | baseline | 558.98 | 559.05 | 0.01 | 0.06 ± 1.73 | 0 | 2 |
| aff_wrack | ORC | sp_250 | 405.56 | 405.50 | -0.02 | -0.07 ± 1.22 | 0 | 2 |
| aff_wrack | ORC | sp_1000 | 865.82 | 866.14 | 0.04 | 0.32 ± 2.75 | 0 | 2 |
| aff_wrack | ORC | int_0 | 525.16 | 526.22 | 0.20 | 1.05 ± 1.63 | 0 | 2 |
| aff_wrack | ORC | int_400 | 589.15 | 591.51 | 0.40 | 2.35 ± 1.79 | 0 | 2 |
| aff_wrack | ORC | hit_0 | 514.58 | 517.01 | 0.47 | 2.43 ± 2.04 | 0 | 2 |
| aff_wrack | ORC | hit_5 | 533.36 | 535.50 | 0.40 | 2.13 ± 1.97 | 0 | 2 |
| aff_wrack | ORC | hit_16 | 558.98 | 559.05 | 0.01 | 0.06 ± 1.73 | 0 | 2 |
| aff_wrack | ORC | crit_0 | 486.28 | 488.26 | 0.41 | 1.98 ± 1.48 | 0 | 2 |
| aff_wrack | ORC | crit_30 | 627.58 | 629.52 | 0.31 | 1.94 ± 1.85 | 0 | 2 |
| aff_wrack | ORC | regen_low | 539.40 | 541.84 | 0.45 | 2.44 ± 1.73 | 0 | 2 |
| aff_wrack | ORC | regen_high | 570.08 | 572.01 | 0.34 | 1.92 ± 1.95 | 0 | 2 |
| aff_wrack | UNDEAD | baseline | 559.44 | 560.35 | 0.16 | 0.90 ± 1.61 | 0 | 2 |
| aff_wrack | UNDEAD | sp_250 | 408.43 | 409.00 | 0.14 | 0.57 ± 1.14 | 0 | 2 |
| aff_wrack | UNDEAD | sp_1000 | 861.46 | 863.03 | 0.18 | 1.57 ± 2.56 | 0 | 2 |
| aff_wrack | UNDEAD | int_0 | 522.29 | 524.72 | 0.47 | 2.43 ± 1.62 | 0 | 2 |
| aff_wrack | UNDEAD | int_400 | 587.72 | 590.06 | 0.40 | 2.35 ± 1.74 | 0 | 2 |
| aff_wrack | UNDEAD | hit_0 | 514.66 | 517.82 | 0.62 | 3.17 ± 2.08 | 0 | 2 |
| aff_wrack | UNDEAD | hit_5 | 533.76 | 536.32 | 0.48 | 2.56 ± 1.91 | 0 | 2 |
| aff_wrack | UNDEAD | hit_16 | 559.44 | 560.35 | 0.16 | 0.90 ± 1.61 | 0 | 2 |
| aff_wrack | UNDEAD | crit_0 | 490.82 | 492.73 | 0.39 | 1.90 ± 1.26 | 0 | 2 |
| aff_wrack | UNDEAD | crit_30 | 627.46 | 628.72 | 0.20 | 1.26 ± 1.85 | 0 | 2 |
| aff_wrack | UNDEAD | regen_low | 537.06 | 538.91 | 0.35 | 1.86 ± 1.77 | 0 | 2 |
| aff_wrack | UNDEAD | regen_high | 568.46 | 569.70 | 0.22 | 1.23 ± 1.90 | 0 | 2 |
| aff_wrack | TROLL | baseline | 549.13 | 551.53 | 0.44 | 2.40 ± 1.68 | 0 | 2 |
| aff_wrack | TROLL | sp_250 | 399.13 | 400.74 | 0.40 | 1.61 ± 1.19 | 0 | 2 |
| aff_wrack | TROLL | sp_1000 | 849.14 | 853.11 | 0.47 | 3.98 ± 2.67 | 0 | 2 |
| aff_wrack | TROLL | int_0 | 516.82 | 519.07 | 0.44 | 2.25 ± 1.58 | 0 | 2 |
| aff_wrack | TROLL | int_400 | 581.75 | 584.66 | 0.50 | 2.91 ± 1.73 | 0 | 2 |
| aff_wrack | TROLL | hit_0 | 507.27 | 510.96 | 0.73 | 3.69 ± 2.05 | 0 | 2 |
| aff_wrack | TROLL | hit_5 | 525.07 | 529.02 | 0.75 | 3.95 ± 1.97 | 0 | 2 |
| aff_wrack | TROLL | hit_16 | 549.13 | 551.53 | 0.44 | 2.40 ± 1.68 | 0 | 2 |
| aff_wrack | TROLL | crit_0 | 478.55 | 481.94 | 0.71 | 3.39 ± 1.24 | 0 | 2 |
| aff_wrack | TROLL | crit_30 | 618.46 | 621.59 | 0.51 | 3.13 ± 1.85 | 0 | 2 |
| aff_wrack | TROLL | regen_low | 532.82 | 536.98 | 0.78 | 4.15 ± 1.68 | 0 | 2 |
| aff_wrack | TROLL | regen_high | 564.47 | 567.15 | 0.48 | 2.69 ± 1.83 | 0 | 2 |
| aff_wrack | GNOME | baseline | 553.44 | 554.14 | 0.13 | 0.70 ± 1.62 | 0 | 2 |
| aff_wrack | GNOME | sp_250 | 402.20 | 402.62 | 0.10 | 0.42 ± 1.14 | 0 | 2 |
| aff_wrack | GNOME | sp_1000 | 855.92 | 857.18 | 0.15 | 1.26 ± 2.57 | 0 | 2 |
| aff_wrack | GNOME | int_0 | 515.29 | 516.24 | 0.18 | 0.95 ± 1.57 | 0 | 2 |
| aff_wrack | GNOME | int_400 | 587.27 | 587.36 | 0.02 | 0.09 ± 1.74 | 0 | 2 |
| aff_wrack | GNOME | hit_0 | 510.38 | 514.75 | 0.86 | 4.37 ± 2.08 | 0 | 2 |
| aff_wrack | GNOME | hit_5 | 529.80 | 531.89 | 0.39 | 2.09 ± 1.93 | 0 | 2 |
| aff_wrack | GNOME | hit_16 | 553.44 | 554.14 | 0.13 | 0.70 ± 1.62 | 0 | 2 |
| aff_wrack | GNOME | crit_0 | 484.60 | 485.08 | 0.10 | 0.48 ± 1.27 | 0 | 2 |
| aff_wrack | GNOME | crit_30 | 623.44 | 624.67 | 0.20 | 1.23 ± 1.85 | 0 | 2 |
| aff_wrack | GNOME | regen_low | 538.70 | 540.17 | 0.27 | 1.47 ± 1.70 | 0 | 2 |
| aff_wrack | GNOME | regen_high | 568.39 | 570.04 | 0.29 | 1.65 ± 1.87 | 0 | 2 |
| destro | HUMAN | baseline | 646.88 | 646.28 | -0.09 | -0.60 ± 2.06 | 0 | 1 |
| destro | HUMAN | sp_250 | 479.91 | 479.59 | -0.07 | -0.32 ± 1.51 | 0 | 1 |
| destro | HUMAN | sp_1000 | 980.83 | 979.66 | -0.12 | -1.18 ± 3.18 | 0 | 1 |
| destro | HUMAN | int_0 | 615.67 | 618.22 | 0.41 | 2.55 ± 1.86 | 0 | 1 |
| destro | HUMAN | int_400 | 676.91 | 676.53 | -0.06 | -0.38 ± 2.09 | 0 | 1 |
| destro | HUMAN | hit_0 | 577.78 | 580.30 | 0.44 | 2.52 ± 2.76 | 0 | 1 |
| destro | HUMAN | hit_5 | 607.25 | 606.50 | -0.12 | -0.75 ± 2.43 | 0 | 1 |
| destro | HUMAN | hit_16 | 646.88 | 646.28 | -0.09 | -0.60 ± 2.06 | 0 | 1 |
| destro | HUMAN | crit_0 | 569.23 | 568.77 | -0.08 | -0.46 ± 1.37 | 0 | 1 |
| destro | HUMAN | crit_30 | 723.27 | 723.91 | 0.09 | 0.64 ± 2.25 | 0 | 1 |
| destro | HUMAN | regen_low | 627.96 | 626.39 | -0.25 | -1.57 ± 2.05 | 0 | 1 |
| destro | HUMAN | regen_high | 671.47 | 671.72 | 0.04 | 0.25 ± 2.05 | 0 | 1 |
| destro | ORC | baseline | 643.96 | 643.47 | -0.08 | -0.49 ± 2.03 | 0 | 1 |
| destro | ORC | sp_250 | 477.35 | 477.05 | -0.06 | -0.30 ± 1.48 | 0 | 1 |
| destro | ORC | sp_1000 | 977.17 | 976.32 | -0.09 | -0.85 ± 3.14 | 0 | 1 |
| destro | ORC | int_0 | 619.72 | 619.76 | 0.01 | 0.04 ± 1.88 | 0 | 1 |
| destro | ORC | int_400 | 681.89 | 683.05 | 0.17 | 1.16 ± 2.13 | 0 | 1 |
| destro | ORC | hit_0 | 574.12 | 576.24 | 0.37 | 2.12 ± 2.69 | 0 | 1 |
| destro | ORC | hit_5 | 603.17 | 603.41 | 0.04 | 0.24 ± 2.47 | 0 | 1 |
| destro | ORC | hit_16 | 643.96 | 643.47 | -0.08 | -0.49 ± 2.03 | 0 | 1 |
| destro | ORC | crit_0 | 565.74 | 565.92 | 0.03 | 0.18 ± 1.31 | 0 | 1 |
| destro | ORC | crit_30 | 720.81 | 721.85 | 0.14 | 1.04 ± 2.31 | 0 | 1 |
| destro | ORC | regen_low | 620.49 | 620.80 | 0.05 | 0.31 ± 1.96 | 0 | 1 |
| destro | ORC | regen_high | 677.36 | 676.97 | -0.06 | -0.39 ± 2.06 | 0 | 1 |
| destro | UNDEAD | baseline | 642.59 | 641.53 | -0.16 | -1.06 ± 1.98 | 0 | 1 |
| destro | UNDEAD | sp_250 | 479.09 | 478.54 | -0.12 | -0.55 ± 1.45 | 0 | 1 |
| destro | UNDEAD | sp_1000 | 969.60 | 967.53 | -0.21 | -2.07 ± 3.05 | 0 | 1 |
| destro | UNDEAD | int_0 | 614.51 | 613.74 | -0.12 | -0.77 ± 1.84 | 0 | 1 |
| destro | UNDEAD | int_400 | 677.30 | 678.16 | 0.13 | 0.87 ± 2.04 | 0 | 1 |
| destro | UNDEAD | hit_0 | 571.34 | 573.08 | 0.30 | 1.74 ± 2.62 | 0 | 1 |
| destro | UNDEAD | hit_5 | 602.27 | 603.27 | 0.17 | 1.00 ± 2.39 | 0 | 1 |
| destro | UNDEAD | hit_16 | 642.59 | 641.53 | -0.16 | -1.06 ± 1.98 | 0 | 1 |
| destro | UNDEAD | crit_0 | 564.55 | 565.83 | 0.23 | 1.28 ± 1.27 | 0 | 1 |
| destro | UNDEAD | crit_30 | 718.58 | 718.71 | 0.02 | 0.13 ± 2.24 | 0 | 1 |
| destro | UNDEAD | regen_low | 613.54 | 614.81 | 0.21 | 1.27 ± 1.88 | 0 | 1 |
| destro | UNDEAD | regen_high | 667.24 | 666.61 | -0.10 | -0.63 ± 2.05 | 0 | 1 |
| destro | TROLL | baseline | 632.78 | 638.37 | 0.88 | 5.60 ± 1.88 | 0 | 1 |
| destro | TROLL | sp_250 | 470.21 | 474.14 | 0.84 | 3.93 ± 1.38 | 0 | 1 |
| destro | TROLL | sp_1000 | 957.91 | 966.83 | 0.93 | 8.93 ± 2.91 | 0 | 1 |
| destro | TROLL | int_0 | 604.05 | 608.15 | 0.68 | 4.10 ± 1.83 | 0 | 1 |
| destro | TROLL | int_400 | 674.13 | 673.61 | -0.08 | -0.52 ± 2.06 | 0 | 1 |
| destro | TROLL | hit_0 | 566.93 | 569.36 | 0.43 | 2.43 ± 2.67 | 0 | 1 |
| destro | TROLL | hit_5 | 596.03 | 598.09 | 0.35 | 2.06 ± 2.43 | 0 | 1 |
| destro | TROLL | hit_16 | 632.78 | 638.37 | 0.88 | 5.60 ± 1.88 | 0 | 1 |
| destro | TROLL | crit_0 | 555.03 | 560.18 | 0.93 | 5.16 ± 1.20 | 0 | 1 |
| destro | TROLL | crit_30 | 709.72 | 716.41 | 0.94 | 6.69 ± 2.17 | 0 | 1 |
| destro | TROLL | regen_low | 617.52 | 619.88 | 0.38 | 2.36 ± 1.95 | 0 | 1 |
| destro | TROLL | regen_high | 665.70 | 658.46 | -1.09 | -7.24 ± 1.98 | 0 | 1 |
| destro | GNOME | baseline | 637.71 | 636.84 | -0.14 | -0.87 ± 1.93 | 0 | 1 |
| destro | GNOME | sp_250 | 473.61 | 473.05 | -0.12 | -0.56 ± 1.41 | 0 | 1 |
| destro | GNOME | sp_1000 | 965.89 | 964.40 | -0.15 | -1.49 ± 2.97 | 0 | 1 |
| destro | GNOME | int_0 | 612.24 | 613.46 | 0.20 | 1.22 ± 1.86 | 0 | 1 |
| destro | GNOME | int_400 | 674.70 | 674.60 | -0.01 | -0.10 ± 2.05 | 0 | 1 |
| destro | GNOME | hit_0 | 570.01 | 571.85 | 0.32 | 1.83 ± 2.70 | 0 | 1 |
| destro | GNOME | hit_5 | 599.50 | 598.37 | -0.19 | -1.14 ± 2.40 | 0 | 1 |
| destro | GNOME | hit_16 | 637.71 | 636.84 | -0.14 | -0.87 ± 1.93 | 0 | 1 |
| destro | GNOME | crit_0 | 560.02 | 559.72 | -0.05 | -0.30 ± 1.27 | 0 | 1 |
| destro | GNOME | crit_30 | 714.73 | 714.27 | -0.06 | -0.46 ± 2.21 | 0 | 1 |
| destro | GNOME | regen_low | 620.82 | 619.91 | -0.15 | -0.91 ± 1.93 | 0 | 1 |
| destro | GNOME | regen_high | 679.29 | 680.51 | 0.18 | 1.22 ± 2.18 | 0 | 1 |
| demo_shadow_brand | HUMAN | baseline | 715.71 | 719.43 | 0.52 | 3.72 ± 2.88 | 0 | 1 |
| demo_shadow_brand | HUMAN | sp_250 | 540.51 | 543.37 | 0.53 | 2.86 ± 2.10 | 0 | 1 |
| demo_shadow_brand | HUMAN | sp_1000 | 1066.12 | 1071.57 | 0.51 | 5.45 ± 4.44 | 0 | 1 |
| demo_shadow_brand | HUMAN | int_0 | 677.72 | 681.16 | 0.51 | 3.44 ± 2.73 | 0 | 1 |
| demo_shadow_brand | HUMAN | int_400 | 759.09 | 762.32 | 0.43 | 3.23 ± 3.06 | 0 | 1 |
| demo_shadow_brand | HUMAN | hit_0 | 624.25 | 630.35 | 0.98 | 6.10 ± 3.54 | 0 | 1 |
| demo_shadow_brand | HUMAN | hit_5 | 664.84 | 668.63 | 0.57 | 3.80 ± 3.35 | 0 | 1 |
| demo_shadow_brand | HUMAN | hit_16 | 748.63 | 747.62 | -0.14 | -1.01 ± 2.59 | 0 | 1 |
| demo_shadow_brand | HUMAN | crit_0 | 629.35 | 632.85 | 0.56 | 3.50 ± 2.10 | 0 | 1 |
| demo_shadow_brand | HUMAN | crit_30 | 801.33 | 808.25 | 0.86 | 6.92 ± 3.27 | 0 | 1 |
| demo_shadow_brand | HUMAN | regen_low | 692.60 | 696.12 | 0.51 | 3.51 ± 2.75 | 0 | 1 |
| demo_shadow_brand | HUMAN | regen_high | 749.08 | 750.93 | 0.25 | 1.85 ± 2.98 | 0 | 1 |
| demo_shadow_brand | ORC | baseline | 712.90 | 715.56 | 0.37 | 2.65 ± 2.90 | 0 | 1 |
| demo_shadow_brand | ORC | sp_250 | 537.54 | 539.42 | 0.35 | 1.88 ± 2.11 | 0 | 1 |
| demo_shadow_brand | ORC | sp_1000 | 1063.63 | 1067.83 | 0.40 | 4.20 ± 4.48 | 0 | 1 |
| demo_shadow_brand | ORC | int_0 | 676.74 | 679.53 | 0.41 | 2.79 ± 2.68 | 0 | 1 |
| demo_shadow_brand | ORC | int_400 | 756.29 | 757.26 | 0.13 | 0.97 ± 3.06 | 0 | 1 |
| demo_shadow_brand | ORC | hit_0 | 621.96 | 627.09 | 0.82 | 5.13 ± 3.62 | 0 | 1 |
| demo_shadow_brand | ORC | hit_5 | 662.16 | 665.45 | 0.50 | 3.29 ± 3.37 | 0 | 1 |
| demo_shadow_brand | ORC | hit_16 | 743.31 | 745.22 | 0.26 | 1.91 ± 2.55 | 0 | 1 |
| demo_shadow_brand | ORC | crit_0 | 626.36 | 628.93 | 0.41 | 2.57 ± 2.05 | 0 | 1 |
| demo_shadow_brand | ORC | crit_30 | 799.68 | 804.86 | 0.65 | 5.18 ± 3.26 | 0 | 1 |
| demo_shadow_brand | ORC | regen_low | 691.30 | 692.10 | 0.12 | 0.81 ± 2.74 | 0 | 1 |
| demo_shadow_brand | ORC | regen_high | 743.14 | 744.51 | 0.18 | 1.36 ± 2.93 | 0 | 1 |
| demo_shadow_brand | UNDEAD | baseline | 711.99 | 713.69 | 0.24 | 1.69 ± 2.84 | 0 | 1 |
| demo_shadow_brand | UNDEAD | sp_250 | 539.22 | 540.65 | 0.26 | 1.43 ± 2.08 | 0 | 1 |
| demo_shadow_brand | UNDEAD | sp_1000 | 1057.54 | 1059.77 | 0.21 | 2.23 ± 4.37 | 0 | 1 |
| demo_shadow_brand | UNDEAD | int_0 | 671.48 | 674.39 | 0.43 | 2.91 ± 2.56 | 0 | 1 |
| demo_shadow_brand | UNDEAD | int_400 | 753.29 | 757.84 | 0.60 | 4.55 ± 3.02 | 0 | 1 |
| demo_shadow_brand | UNDEAD | hit_0 | 617.84 | 624.97 | 1.15 | 7.13 ± 3.41 | 0 | 1 |
| demo_shadow_brand | UNDEAD | hit_5 | 657.93 | 664.17 | 0.95 | 6.25 ± 3.11 | 0 | 1 |
| demo_shadow_brand | UNDEAD | hit_16 | 741.37 | 742.71 | 0.18 | 1.35 ± 2.54 | 0 | 1 |
| demo_shadow_brand | UNDEAD | crit_0 | 624.84 | 626.03 | 0.19 | 1.19 ± 1.93 | 0 | 1 |
| demo_shadow_brand | UNDEAD | crit_30 | 798.33 | 800.19 | 0.23 | 1.86 ± 3.20 | 0 | 1 |
| demo_shadow_brand | UNDEAD | regen_low | 688.58 | 691.06 | 0.36 | 2.47 ± 2.71 | 0 | 1 |
| demo_shadow_brand | UNDEAD | regen_high | 739.03 | 741.20 | 0.29 | 2.16 ± 2.88 | 0 | 1 |
| demo_shadow_brand | TROLL | baseline | 705.95 | 706.79 | 0.12 | 0.85 ± 2.81 | 0 | 1 |
| demo_shadow_brand | TROLL | sp_250 | 533.15 | 533.82 | 0.13 | 0.67 ± 2.05 | 0 | 1 |
| demo_shadow_brand | TROLL | sp_1000 | 1051.55 | 1052.75 | 0.11 | 1.20 ± 4.32 | 0 | 1 |
| demo_shadow_brand | TROLL | int_0 | 668.06 | 669.96 | 0.28 | 1.90 ± 2.58 | 0 | 1 |
| demo_shadow_brand | TROLL | int_400 | 748.70 | 747.44 | -0.17 | -1.26 ± 3.03 | 0 | 1 |
| demo_shadow_brand | TROLL | hit_0 | 614.15 | 619.46 | 0.86 | 5.31 ± 3.48 | 0 | 1 |
| demo_shadow_brand | TROLL | hit_5 | 654.18 | 658.73 | 0.69 | 4.54 ± 3.28 | 0 | 1 |
| demo_shadow_brand | TROLL | hit_16 | 736.49 | 735.74 | -0.10 | -0.75 ± 2.45 | 0 | 1 |
| demo_shadow_brand | TROLL | crit_0 | 619.70 | 620.16 | 0.07 | 0.46 ± 1.96 | 0 | 1 |
| demo_shadow_brand | TROLL | crit_30 | 792.54 | 794.80 | 0.28 | 2.25 ± 3.18 | 0 | 1 |
| demo_shadow_brand | TROLL | regen_low | 683.45 | 686.11 | 0.39 | 2.65 ± 2.71 | 0 | 1 |
| demo_shadow_brand | TROLL | regen_high | 734.82 | 736.84 | 0.27 | 2.01 ± 2.94 | 0 | 1 |
| demo_shadow_brand | GNOME | baseline | 707.83 | 711.17 | 0.47 | 3.34 ± 2.83 | 0 | 1 |
| demo_shadow_brand | GNOME | sp_250 | 534.60 | 537.18 | 0.48 | 2.58 ± 2.07 | 0 | 1 |
| demo_shadow_brand | GNOME | sp_1000 | 1054.28 | 1059.15 | 0.46 | 4.87 ± 4.35 | 0 | 1 |
| demo_shadow_brand | GNOME | int_0 | 665.82 | 668.01 | 0.33 | 2.19 ± 2.49 | 0 | 1 |
| demo_shadow_brand | GNOME | int_400 | 752.99 | 753.09 | 0.01 | 0.10 ± 3.06 | 0 | 1 |
| demo_shadow_brand | GNOME | hit_0 | 614.99 | 621.70 | 1.09 | 6.71 ± 3.40 | 0 | 1 |
| demo_shadow_brand | GNOME | hit_5 | 653.72 | 659.72 | 0.92 | 6.00 ± 3.26 | 0 | 1 |
| demo_shadow_brand | GNOME | hit_16 | 737.34 | 737.99 | 0.09 | 0.65 ± 2.51 | 0 | 1 |
| demo_shadow_brand | GNOME | crit_0 | 620.96 | 623.53 | 0.41 | 2.57 ± 1.99 | 0 | 1 |
| demo_shadow_brand | GNOME | crit_30 | 794.11 | 798.43 | 0.54 | 4.32 ± 3.25 | 0 | 1 |
| demo_shadow_brand | GNOME | regen_low | 682.67 | 684.43 | 0.26 | 1.76 ± 2.68 | 0 | 1 |
| demo_shadow_brand | GNOME | regen_high | 736.59 | 738.40 | 0.25 | 1.81 ± 2.87 | 0 | 1 |
| demo_fire_brand | HUMAN | baseline | 752.84 | 755.05 | 0.29 | 2.21 ± 1.98 | 0 | 1 |
| demo_fire_brand | HUMAN | sp_250 | 570.70 | 572.62 | 0.34 | 1.92 ± 1.47 | 0 | 1 |
| demo_fire_brand | HUMAN | sp_1000 | 1117.11 | 1119.89 | 0.25 | 2.78 ± 3.02 | 0 | 1 |
| demo_fire_brand | HUMAN | int_0 | 717.46 | 719.98 | 0.35 | 2.52 ± 1.86 | 0 | 1 |
| demo_fire_brand | HUMAN | int_400 | 788.86 | 790.28 | 0.18 | 1.42 ± 2.12 | 0 | 1 |
| demo_fire_brand | HUMAN | hit_0 | 658.88 | 659.36 | 0.07 | 0.48 ± 2.69 | 0 | 1 |
| demo_fire_brand | HUMAN | hit_5 | 697.71 | 698.87 | 0.17 | 1.16 ± 2.52 | 0 | 1 |
| demo_fire_brand | HUMAN | hit_16 | 785.00 | 785.68 | 0.09 | 0.68 ± 1.55 | 0 | 1 |
| demo_fire_brand | HUMAN | crit_0 | 681.59 | 683.57 | 0.29 | 1.98 ± 1.56 | 0 | 1 |
| demo_fire_brand | HUMAN | crit_30 | 824.62 | 826.60 | 0.24 | 1.98 ± 2.20 | 0 | 1 |
| demo_fire_brand | HUMAN | regen_low | 731.87 | 732.46 | 0.08 | 0.58 ± 1.96 | 0 | 1 |
| demo_fire_brand | HUMAN | regen_high | 774.69 | 777.22 | 0.33 | 2.53 ± 2.00 | 0 | 1 |
| demo_fire_brand | ORC | baseline | 749.89 | 752.40 | 0.33 | 2.51 ± 1.95 | 0 | 1 |
| demo_fire_brand | ORC | sp_250 | 567.69 | 569.79 | 0.37 | 2.10 ± 1.44 | 0 | 1 |
| demo_fire_brand | ORC | sp_1000 | 1114.28 | 1117.62 | 0.30 | 3.34 ± 2.97 | 0 | 1 |
| demo_fire_brand | ORC | int_0 | 718.32 | 720.66 | 0.33 | 2.34 ± 1.85 | 0 | 1 |
| demo_fire_brand | ORC | int_400 | 791.63 | 795.07 | 0.43 | 3.44 ± 2.20 | 0 | 1 |
| demo_fire_brand | ORC | hit_0 | 656.91 | 658.98 | 0.32 | 2.07 ± 2.73 | 0 | 1 |
| demo_fire_brand | ORC | hit_5 | 696.96 | 698.38 | 0.20 | 1.42 ± 2.47 | 0 | 1 |
| demo_fire_brand | ORC | hit_16 | 779.78 | 781.26 | 0.19 | 1.47 ± 1.55 | 0 | 1 |
| demo_fire_brand | ORC | crit_0 | 678.78 | 680.82 | 0.30 | 2.04 ± 1.56 | 0 | 1 |
| demo_fire_brand | ORC | crit_30 | 821.65 | 823.97 | 0.28 | 2.32 ± 2.15 | 0 | 1 |
| demo_fire_brand | ORC | regen_low | 730.26 | 731.75 | 0.20 | 1.49 ± 2.03 | 0 | 1 |
| demo_fire_brand | ORC | regen_high | 771.26 | 773.26 | 0.26 | 2.00 ± 1.97 | 0 | 1 |
| demo_fire_brand | UNDEAD | baseline | 752.13 | 753.83 | 0.23 | 1.71 ± 2.02 | 0 | 1 |
| demo_fire_brand | UNDEAD | sp_250 | 572.19 | 573.82 | 0.29 | 1.63 ± 1.50 | 0 | 1 |
| demo_fire_brand | UNDEAD | sp_1000 | 1112.00 | 1113.87 | 0.17 | 1.87 ± 3.06 | 0 | 1 |
| demo_fire_brand | UNDEAD | int_0 | 714.43 | 716.06 | 0.23 | 1.63 ± 1.82 | 0 | 1 |
| demo_fire_brand | UNDEAD | int_400 | 785.51 | 786.27 | 0.10 | 0.76 ± 1.99 | 0 | 1 |
| demo_fire_brand | UNDEAD | hit_0 | 655.89 | 659.93 | 0.62 | 4.04 ± 2.64 | 0 | 1 |
| demo_fire_brand | UNDEAD | hit_5 | 695.05 | 697.47 | 0.35 | 2.42 ± 2.46 | 0 | 1 |
| demo_fire_brand | UNDEAD | hit_16 | 787.08 | 788.10 | 0.13 | 1.02 ± 1.64 | 0 | 1 |
| demo_fire_brand | UNDEAD | crit_0 | 680.44 | 682.17 | 0.25 | 1.73 ± 1.62 | 0 | 1 |
| demo_fire_brand | UNDEAD | crit_30 | 823.58 | 825.03 | 0.18 | 1.45 ± 2.24 | 0 | 1 |
| demo_fire_brand | UNDEAD | regen_low | 730.65 | 733.15 | 0.34 | 2.49 ± 2.06 | 0 | 1 |
| demo_fire_brand | UNDEAD | regen_high | 769.86 | 771.86 | 0.26 | 2.00 ± 1.98 | 0 | 1 |
| demo_fire_brand | TROLL | baseline | 744.48 | 747.65 | 0.42 | 3.16 ± 1.98 | 0 | 1 |
| demo_fire_brand | TROLL | sp_250 | 564.55 | 567.13 | 0.46 | 2.58 ± 1.47 | 0 | 1 |
| demo_fire_brand | TROLL | sp_1000 | 1104.36 | 1108.69 | 0.39 | 4.33 ± 3.01 | 0 | 1 |
| demo_fire_brand | TROLL | int_0 | 711.44 | 712.62 | 0.16 | 1.17 ± 1.79 | 0 | 1 |
| demo_fire_brand | TROLL | int_400 | 778.61 | 780.07 | 0.19 | 1.46 ± 2.10 | 0 | 1 |
| demo_fire_brand | TROLL | hit_0 | 650.89 | 652.17 | 0.20 | 1.28 ± 2.68 | 0 | 1 |
| demo_fire_brand | TROLL | hit_5 | 690.49 | 691.46 | 0.14 | 0.97 ± 2.44 | 0 | 1 |
| demo_fire_brand | TROLL | hit_16 | 779.76 | 780.61 | 0.11 | 0.85 ± 1.56 | 0 | 1 |
| demo_fire_brand | TROLL | crit_0 | 673.60 | 675.76 | 0.32 | 2.15 ± 1.55 | 0 | 1 |
| demo_fire_brand | TROLL | crit_30 | 816.72 | 819.12 | 0.29 | 2.41 ± 2.22 | 0 | 1 |
| demo_fire_brand | TROLL | regen_low | 724.40 | 726.69 | 0.32 | 2.29 ± 1.95 | 0 | 1 |
| demo_fire_brand | TROLL | regen_high | 767.17 | 769.63 | 0.32 | 2.45 ± 2.02 | 0 | 1 |
| demo_fire_brand | GNOME | baseline | 745.46 | 747.03 | 0.21 | 1.57 ± 1.93 | 0 | 1 |
| demo_fire_brand | GNOME | sp_250 | 565.02 | 566.46 | 0.25 | 1.44 ± 1.43 | 0 | 1 |
| demo_fire_brand | GNOME | sp_1000 | 1106.35 | 1108.17 | 0.16 | 1.82 ± 2.93 | 0 | 1 |
| demo_fire_brand | GNOME | int_0 | 713.15 | 715.62 | 0.35 | 2.47 ± 1.97 | 0 | 1 |
| demo_fire_brand | GNOME | int_400 | 778.33 | 779.77 | 0.19 | 1.44 ± 2.05 | 0 | 1 |
| demo_fire_brand | GNOME | hit_0 | 652.09 | 653.69 | 0.25 | 1.60 ± 2.62 | 0 | 1 |
| demo_fire_brand | GNOME | hit_5 | 693.17 | 693.48 | 0.04 | 0.30 ± 2.51 | 0 | 1 |
| demo_fire_brand | GNOME | hit_16 | 774.13 | 774.31 | 0.02 | 0.19 ± 1.54 | 0 | 1 |
| demo_fire_brand | GNOME | crit_0 | 673.82 | 675.55 | 0.26 | 1.73 ± 1.49 | 0 | 1 |
| demo_fire_brand | GNOME | crit_30 | 817.96 | 818.38 | 0.05 | 0.42 ± 2.14 | 0 | 1 |
| demo_fire_brand | GNOME | regen_low | 728.44 | 732.29 | 0.53 | 3.85 ± 2.05 | 0 | 1 |
| demo_fire_brand | GNOME | regen_high | 770.26 | 771.31 | 0.14 | 1.04 ± 2.06 | 0 | 1 |

The JSON companion includes exact requests, resolved app configs, source/app hashes, input differences, import diagnostics, and spell/pet breakdowns. Existing five-preset benchmark artifacts are unchanged.
