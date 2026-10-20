# Forever race/stat diagnostic sweep

complete: 300/300 combinations completed; 1000 fights per engine per combination, seed 101.

Full preset × race × profile sweep. Profiles change one baseline stat at a time, except regeneration profiles which jointly change spirit and mp5. All stats are bonuses above racial/class bases. Gear-free, 180s, zero distance, external CoE only, no consumables. Source APLs are retained, including their race-specific action IDs; this measures import behavior rather than optimizing each race's rotation.

**Diagnostic only.** Source APLs are retained for every race, including race-specific action IDs. Unsupported imports are recorded, not treated as accepted parity. Gear and consumables are absent.

Intervals are approximate 95% Monte Carlo intervals for independent-engine mean differences. At 100 trials they are noisy, and intervals are not adjusted for multiple comparisons. Equal seeds do not pair RNG streams. Small total differences can hide offsetting spell errors.

| Preset | Cases | Mean absolute delta % | Worst absolute delta % |
| --- | ---: | ---: | ---: |
| sm_ruin | 60 | 0.26 | 0.78 |
| aff_wrack | 60 | 0.18 | 0.57 |
| destro | 60 | 0.32 | 1.35 |
| demo_shadow_brand | 60 | 0.32 | 1.01 |
| demo_fire_brand | 60 | 0.37 | 1.00 |

## Largest observed total differences

| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| destro | TROLL | regen_high | 665.70 | 656.68 | -1.35 | -9.02 ± 1.95 |
| destro | HUMAN | regen_high | 671.47 | 662.71 | -1.30 | -8.76 ± 2.04 |
| destro | HUMAN | int_0 | 615.67 | 608.71 | -1.13 | -6.97 ± 1.83 |
| demo_shadow_brand | ORC | crit_30 | 799.68 | 807.72 | 1.01 | 8.04 ± 3.25 |
| demo_fire_brand | ORC | regen_high | 771.26 | 778.98 | 1.00 | 7.72 ± 1.99 |
| demo_shadow_brand | ORC | sp_1000 | 1063.63 | 1073.33 | 0.91 | 9.70 ± 4.46 |
| demo_shadow_brand | ORC | hit_0 | 621.96 | 627.52 | 0.89 | 5.57 ± 3.56 |
| destro | TROLL | crit_0 | 555.03 | 559.99 | 0.89 | 4.96 ± 1.26 |
| demo_shadow_brand | ORC | baseline | 712.90 | 718.79 | 0.83 | 5.88 ± 2.89 |
| destro | TROLL | sp_1000 | 957.91 | 965.72 | 0.82 | 7.81 ± 2.99 |
| sm_ruin | GNOME | hit_0 | 571.55 | 567.10 | -0.78 | -4.46 ± 3.55 |
| demo_shadow_brand | ORC | int_400 | 756.29 | 761.95 | 0.75 | 5.66 ± 3.09 |
| demo_shadow_brand | ORC | sp_250 | 537.54 | 541.51 | 0.74 | 3.97 ± 2.11 |
| demo_fire_brand | UNDEAD | int_0 | 714.43 | 709.32 | -0.72 | -5.11 ± 1.83 |
| sm_ruin | TROLL | int_0 | 599.33 | 603.57 | 0.71 | 4.24 ± 2.77 |
| demo_shadow_brand | ORC | hit_16 | 743.31 | 748.50 | 0.70 | 5.18 ± 2.63 |
| destro | TROLL | int_0 | 604.05 | 608.20 | 0.69 | 4.15 ± 1.81 |
| demo_fire_brand | TROLL | regen_low | 724.40 | 719.44 | -0.69 | -4.96 ± 1.93 |
| demo_shadow_brand | TROLL | hit_0 | 614.15 | 618.35 | 0.68 | 4.20 ± 3.47 |
| destro | TROLL | baseline | 632.78 | 637.01 | 0.67 | 4.24 ± 1.94 |

## All combinations

| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% | Stat differences | Group omissions |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| sm_ruin | HUMAN | baseline | 653.96 | 651.29 | -0.41 | -2.67 ± 2.97 | 0 | 1 |
| sm_ruin | HUMAN | sp_250 | 476.47 | 474.08 | -0.50 | -2.39 ± 2.11 | 0 | 1 |
| sm_ruin | HUMAN | sp_1000 | 1008.94 | 1005.71 | -0.32 | -3.23 ± 4.68 | 0 | 1 |
| sm_ruin | HUMAN | int_0 | 617.27 | 615.26 | -0.33 | -2.01 ± 2.81 | 0 | 1 |
| sm_ruin | HUMAN | int_400 | 690.83 | 690.16 | -0.10 | -0.67 ± 3.15 | 0 | 1 |
| sm_ruin | HUMAN | hit_0 | 579.92 | 578.00 | -0.33 | -1.91 ± 3.59 | 0 | 1 |
| sm_ruin | HUMAN | hit_5 | 611.57 | 607.87 | -0.60 | -3.69 ± 3.31 | 0 | 1 |
| sm_ruin | HUMAN | hit_16 | 653.96 | 651.29 | -0.41 | -2.67 ± 2.97 | 0 | 1 |
| sm_ruin | HUMAN | crit_0 | 555.18 | 553.16 | -0.36 | -2.02 ± 2.30 | 0 | 1 |
| sm_ruin | HUMAN | crit_30 | 749.22 | 745.98 | -0.43 | -3.24 ± 3.04 | 0 | 1 |
| sm_ruin | HUMAN | regen_low | 631.02 | 628.88 | -0.34 | -2.14 ± 2.98 | 0 | 1 |
| sm_ruin | HUMAN | regen_high | 678.75 | 676.91 | -0.27 | -1.84 ± 3.01 | 0 | 1 |
| sm_ruin | ORC | baseline | 647.77 | 648.59 | 0.13 | 0.82 ± 2.88 | 0 | 1 |
| sm_ruin | ORC | sp_250 | 471.00 | 471.55 | 0.12 | 0.55 ± 2.04 | 0 | 1 |
| sm_ruin | ORC | sp_1000 | 1001.31 | 1002.66 | 0.14 | 1.36 ± 4.55 | 0 | 1 |
| sm_ruin | ORC | int_0 | 612.04 | 613.86 | 0.30 | 1.82 ± 2.77 | 0 | 1 |
| sm_ruin | ORC | int_400 | 688.07 | 688.93 | 0.12 | 0.86 ± 3.12 | 0 | 1 |
| sm_ruin | ORC | hit_0 | 576.30 | 577.95 | 0.29 | 1.65 ± 3.56 | 0 | 1 |
| sm_ruin | ORC | hit_5 | 607.75 | 609.13 | 0.23 | 1.38 ± 3.34 | 0 | 1 |
| sm_ruin | ORC | hit_16 | 647.77 | 648.59 | 0.13 | 0.82 ± 2.88 | 0 | 1 |
| sm_ruin | ORC | crit_0 | 548.98 | 549.28 | 0.05 | 0.30 ± 2.21 | 0 | 1 |
| sm_ruin | ORC | crit_30 | 744.44 | 743.87 | -0.08 | -0.57 ± 3.11 | 0 | 1 |
| sm_ruin | ORC | regen_low | 629.07 | 631.27 | 0.35 | 2.20 ± 2.98 | 0 | 1 |
| sm_ruin | ORC | regen_high | 673.65 | 673.13 | -0.08 | -0.52 ± 2.93 | 0 | 1 |
| sm_ruin | UNDEAD | baseline | 644.36 | 643.57 | -0.12 | -0.79 ± 2.93 | 0 | 1 |
| sm_ruin | UNDEAD | sp_250 | 471.44 | 470.43 | -0.22 | -1.01 ± 2.09 | 0 | 1 |
| sm_ruin | UNDEAD | sp_1000 | 990.19 | 989.85 | -0.03 | -0.34 ± 4.62 | 0 | 1 |
| sm_ruin | UNDEAD | int_0 | 607.94 | 607.44 | -0.08 | -0.49 ± 2.68 | 0 | 1 |
| sm_ruin | UNDEAD | int_400 | 683.63 | 682.74 | -0.13 | -0.89 ± 3.10 | 0 | 1 |
| sm_ruin | UNDEAD | hit_0 | 574.14 | 572.04 | -0.37 | -2.10 ± 3.50 | 0 | 1 |
| sm_ruin | UNDEAD | hit_5 | 604.71 | 602.72 | -0.33 | -1.99 ± 3.26 | 0 | 1 |
| sm_ruin | UNDEAD | hit_16 | 644.36 | 643.57 | -0.12 | -0.79 ± 2.93 | 0 | 1 |
| sm_ruin | UNDEAD | crit_0 | 546.45 | 545.96 | -0.09 | -0.50 ± 2.11 | 0 | 1 |
| sm_ruin | UNDEAD | crit_30 | 740.89 | 737.83 | -0.41 | -3.06 ± 3.14 | 0 | 1 |
| sm_ruin | UNDEAD | regen_low | 624.51 | 622.15 | -0.38 | -2.36 ± 2.86 | 0 | 1 |
| sm_ruin | UNDEAD | regen_high | 669.25 | 666.42 | -0.42 | -2.83 ± 3.00 | 0 | 1 |
| sm_ruin | TROLL | baseline | 637.81 | 640.01 | 0.34 | 2.20 ± 2.86 | 0 | 1 |
| sm_ruin | TROLL | sp_250 | 464.77 | 465.85 | 0.23 | 1.07 ± 2.04 | 0 | 1 |
| sm_ruin | TROLL | sp_1000 | 983.87 | 988.32 | 0.45 | 4.45 ± 4.52 | 0 | 1 |
| sm_ruin | TROLL | int_0 | 599.33 | 603.57 | 0.71 | 4.24 ± 2.77 | 0 | 1 |
| sm_ruin | TROLL | int_400 | 675.08 | 677.06 | 0.29 | 1.98 ± 3.05 | 0 | 1 |
| sm_ruin | TROLL | hit_0 | 567.48 | 569.60 | 0.37 | 2.13 ± 3.53 | 0 | 1 |
| sm_ruin | TROLL | hit_5 | 599.35 | 598.60 | -0.13 | -0.75 ± 3.34 | 0 | 1 |
| sm_ruin | TROLL | hit_16 | 637.81 | 640.01 | 0.34 | 2.20 ± 2.86 | 0 | 1 |
| sm_ruin | TROLL | crit_0 | 540.11 | 541.00 | 0.16 | 0.89 ± 2.14 | 0 | 1 |
| sm_ruin | TROLL | crit_30 | 734.06 | 735.01 | 0.13 | 0.96 ± 3.15 | 0 | 1 |
| sm_ruin | TROLL | regen_low | 616.48 | 618.97 | 0.40 | 2.49 ± 2.82 | 0 | 1 |
| sm_ruin | TROLL | regen_high | 663.43 | 662.33 | -0.16 | -1.09 ± 2.94 | 0 | 1 |
| sm_ruin | GNOME | baseline | 640.54 | 641.07 | 0.08 | 0.53 ± 2.95 | 0 | 1 |
| sm_ruin | GNOME | sp_250 | 466.78 | 466.75 | -0.01 | -0.03 ± 2.10 | 0 | 1 |
| sm_ruin | GNOME | sp_1000 | 988.07 | 989.72 | 0.17 | 1.66 ± 4.65 | 0 | 1 |
| sm_ruin | GNOME | int_0 | 605.31 | 602.65 | -0.44 | -2.66 ± 2.75 | 0 | 1 |
| sm_ruin | GNOME | int_400 | 678.78 | 679.07 | 0.04 | 0.28 ± 3.00 | 0 | 1 |
| sm_ruin | GNOME | hit_0 | 571.55 | 567.10 | -0.78 | -4.46 ± 3.55 | 0 | 1 |
| sm_ruin | GNOME | hit_5 | 602.69 | 599.21 | -0.58 | -3.48 ± 3.33 | 0 | 1 |
| sm_ruin | GNOME | hit_16 | 640.54 | 641.07 | 0.08 | 0.53 ± 2.95 | 0 | 1 |
| sm_ruin | GNOME | crit_0 | 542.61 | 542.41 | -0.04 | -0.20 ± 2.16 | 0 | 1 |
| sm_ruin | GNOME | crit_30 | 737.27 | 736.70 | -0.08 | -0.57 ± 3.19 | 0 | 1 |
| sm_ruin | GNOME | regen_low | 622.28 | 620.21 | -0.33 | -2.07 ± 2.87 | 0 | 1 |
| sm_ruin | GNOME | regen_high | 662.79 | 663.66 | 0.13 | 0.87 ± 3.00 | 0 | 1 |
| aff_wrack | HUMAN | baseline | 559.93 | 559.99 | 0.01 | 0.06 ± 1.72 | 0 | 2 |
| aff_wrack | HUMAN | sp_250 | 406.98 | 406.41 | -0.14 | -0.57 ± 1.22 | 0 | 2 |
| aff_wrack | HUMAN | sp_1000 | 865.83 | 867.14 | 0.15 | 1.31 ± 2.73 | 0 | 2 |
| aff_wrack | HUMAN | int_0 | 532.37 | 531.96 | -0.08 | -0.41 ± 1.65 | 0 | 2 |
| aff_wrack | HUMAN | int_400 | 591.26 | 591.47 | 0.04 | 0.21 ± 1.78 | 0 | 2 |
| aff_wrack | HUMAN | hit_0 | 517.36 | 517.67 | 0.06 | 0.31 ± 2.12 | 0 | 2 |
| aff_wrack | HUMAN | hit_5 | 536.30 | 534.83 | -0.27 | -1.47 ± 1.98 | 0 | 2 |
| aff_wrack | HUMAN | hit_16 | 559.93 | 559.99 | 0.01 | 0.06 ± 1.72 | 0 | 2 |
| aff_wrack | HUMAN | crit_0 | 489.76 | 489.51 | -0.05 | -0.25 ± 1.48 | 0 | 2 |
| aff_wrack | HUMAN | crit_30 | 629.74 | 629.56 | -0.03 | -0.18 ± 1.80 | 0 | 2 |
| aff_wrack | HUMAN | regen_low | 540.35 | 539.89 | -0.08 | -0.46 ± 1.85 | 0 | 2 |
| aff_wrack | HUMAN | regen_high | 573.38 | 573.51 | 0.02 | 0.13 ± 1.95 | 0 | 2 |
| aff_wrack | ORC | baseline | 558.98 | 558.79 | -0.03 | -0.19 ± 1.74 | 0 | 2 |
| aff_wrack | ORC | sp_250 | 405.56 | 405.30 | -0.07 | -0.27 ± 1.23 | 0 | 2 |
| aff_wrack | ORC | sp_1000 | 865.82 | 865.78 | -0.01 | -0.04 ± 2.76 | 0 | 2 |
| aff_wrack | ORC | int_0 | 525.16 | 527.87 | 0.51 | 2.70 ± 1.64 | 0 | 2 |
| aff_wrack | ORC | int_400 | 589.15 | 590.97 | 0.31 | 1.81 ± 1.79 | 0 | 2 |
| aff_wrack | ORC | hit_0 | 514.58 | 517.24 | 0.52 | 2.65 ± 2.06 | 0 | 2 |
| aff_wrack | ORC | hit_5 | 533.36 | 534.91 | 0.29 | 1.55 ± 1.94 | 0 | 2 |
| aff_wrack | ORC | hit_16 | 558.98 | 558.79 | -0.03 | -0.19 ± 1.74 | 0 | 2 |
| aff_wrack | ORC | crit_0 | 486.28 | 488.75 | 0.51 | 2.47 ± 1.51 | 0 | 2 |
| aff_wrack | ORC | crit_30 | 627.58 | 629.95 | 0.38 | 2.37 ± 1.87 | 0 | 2 |
| aff_wrack | ORC | regen_low | 539.40 | 540.87 | 0.27 | 1.47 ± 1.70 | 0 | 2 |
| aff_wrack | ORC | regen_high | 570.08 | 572.56 | 0.44 | 2.48 ± 1.90 | 0 | 2 |
| aff_wrack | UNDEAD | baseline | 559.44 | 558.47 | -0.17 | -0.97 ± 1.61 | 0 | 2 |
| aff_wrack | UNDEAD | sp_250 | 408.43 | 407.21 | -0.30 | -1.23 ± 1.14 | 0 | 2 |
| aff_wrack | UNDEAD | sp_1000 | 861.46 | 860.99 | -0.05 | -0.47 ± 2.57 | 0 | 2 |
| aff_wrack | UNDEAD | int_0 | 522.29 | 522.86 | 0.11 | 0.57 ± 1.65 | 0 | 2 |
| aff_wrack | UNDEAD | int_400 | 587.72 | 588.04 | 0.06 | 0.33 ± 1.76 | 0 | 2 |
| aff_wrack | UNDEAD | hit_0 | 514.66 | 516.81 | 0.42 | 2.16 ± 2.06 | 0 | 2 |
| aff_wrack | UNDEAD | hit_5 | 533.76 | 534.70 | 0.18 | 0.94 ± 1.92 | 0 | 2 |
| aff_wrack | UNDEAD | hit_16 | 559.44 | 558.47 | -0.17 | -0.97 ± 1.61 | 0 | 2 |
| aff_wrack | UNDEAD | crit_0 | 490.82 | 491.30 | 0.10 | 0.47 ± 1.26 | 0 | 2 |
| aff_wrack | UNDEAD | crit_30 | 627.46 | 627.05 | -0.07 | -0.41 ± 1.79 | 0 | 2 |
| aff_wrack | UNDEAD | regen_low | 537.06 | 536.50 | -0.10 | -0.56 ± 1.75 | 0 | 2 |
| aff_wrack | UNDEAD | regen_high | 568.46 | 567.42 | -0.18 | -1.04 ± 1.93 | 0 | 2 |
| aff_wrack | TROLL | baseline | 549.13 | 549.22 | 0.02 | 0.09 ± 1.69 | 0 | 2 |
| aff_wrack | TROLL | sp_250 | 399.13 | 398.59 | -0.14 | -0.54 ± 1.19 | 0 | 2 |
| aff_wrack | TROLL | sp_1000 | 849.14 | 850.48 | 0.16 | 1.34 ± 2.69 | 0 | 2 |
| aff_wrack | TROLL | int_0 | 516.82 | 518.24 | 0.27 | 1.42 ± 1.57 | 0 | 2 |
| aff_wrack | TROLL | int_400 | 581.75 | 582.12 | 0.06 | 0.38 ± 1.69 | 0 | 2 |
| aff_wrack | TROLL | hit_0 | 507.27 | 510.06 | 0.55 | 2.79 ± 2.08 | 0 | 2 |
| aff_wrack | TROLL | hit_5 | 525.07 | 527.08 | 0.38 | 2.01 ± 1.91 | 0 | 2 |
| aff_wrack | TROLL | hit_16 | 549.13 | 549.22 | 0.02 | 0.09 ± 1.69 | 0 | 2 |
| aff_wrack | TROLL | crit_0 | 478.55 | 481.30 | 0.57 | 2.74 ± 1.28 | 0 | 2 |
| aff_wrack | TROLL | crit_30 | 618.46 | 619.46 | 0.16 | 0.99 ± 1.84 | 0 | 2 |
| aff_wrack | TROLL | regen_low | 532.82 | 535.31 | 0.47 | 2.49 ± 1.65 | 0 | 2 |
| aff_wrack | TROLL | regen_high | 564.47 | 565.46 | 0.18 | 0.99 ± 1.83 | 0 | 2 |
| aff_wrack | GNOME | baseline | 553.44 | 553.04 | -0.07 | -0.40 ± 1.66 | 0 | 2 |
| aff_wrack | GNOME | sp_250 | 402.20 | 401.40 | -0.20 | -0.80 ± 1.18 | 0 | 2 |
| aff_wrack | GNOME | sp_1000 | 855.92 | 856.31 | 0.05 | 0.39 ± 2.64 | 0 | 2 |
| aff_wrack | GNOME | int_0 | 515.29 | 515.76 | 0.09 | 0.47 ± 1.59 | 0 | 2 |
| aff_wrack | GNOME | int_400 | 587.27 | 586.33 | -0.16 | -0.93 ± 1.68 | 0 | 2 |
| aff_wrack | GNOME | hit_0 | 510.38 | 512.02 | 0.32 | 1.64 ± 2.07 | 0 | 2 |
| aff_wrack | GNOME | hit_5 | 529.80 | 530.24 | 0.08 | 0.44 ± 1.95 | 0 | 2 |
| aff_wrack | GNOME | hit_16 | 553.44 | 553.04 | -0.07 | -0.40 ± 1.66 | 0 | 2 |
| aff_wrack | GNOME | crit_0 | 484.60 | 484.97 | 0.07 | 0.36 ± 1.30 | 0 | 2 |
| aff_wrack | GNOME | crit_30 | 623.44 | 622.37 | -0.17 | -1.07 ± 1.88 | 0 | 2 |
| aff_wrack | GNOME | regen_low | 538.70 | 538.54 | -0.03 | -0.17 ± 1.64 | 0 | 2 |
| aff_wrack | GNOME | regen_high | 568.39 | 568.32 | -0.01 | -0.07 ± 1.91 | 0 | 2 |
| destro | HUMAN | baseline | 646.88 | 645.45 | -0.22 | -1.43 ± 2.05 | 0 | 1 |
| destro | HUMAN | sp_250 | 479.91 | 478.52 | -0.29 | -1.38 ± 1.50 | 0 | 1 |
| destro | HUMAN | sp_1000 | 980.83 | 979.31 | -0.16 | -1.53 ± 3.17 | 0 | 1 |
| destro | HUMAN | int_0 | 615.67 | 608.71 | -1.13 | -6.97 ± 1.83 | 0 | 1 |
| destro | HUMAN | int_400 | 676.91 | 673.90 | -0.45 | -3.01 ± 2.05 | 0 | 1 |
| destro | HUMAN | hit_0 | 577.78 | 575.00 | -0.48 | -2.78 ± 2.75 | 0 | 1 |
| destro | HUMAN | hit_5 | 607.25 | 605.36 | -0.31 | -1.90 ± 2.44 | 0 | 1 |
| destro | HUMAN | hit_16 | 646.88 | 645.45 | -0.22 | -1.43 ± 2.05 | 0 | 1 |
| destro | HUMAN | crit_0 | 569.23 | 568.49 | -0.13 | -0.74 ± 1.37 | 0 | 1 |
| destro | HUMAN | crit_30 | 723.27 | 722.14 | -0.15 | -1.12 ± 2.27 | 0 | 1 |
| destro | HUMAN | regen_low | 627.96 | 625.53 | -0.39 | -2.43 ± 2.01 | 0 | 1 |
| destro | HUMAN | regen_high | 671.47 | 662.71 | -1.30 | -8.76 ± 2.04 | 0 | 1 |
| destro | ORC | baseline | 643.96 | 644.24 | 0.04 | 0.28 ± 2.02 | 0 | 1 |
| destro | ORC | sp_250 | 477.35 | 477.60 | 0.05 | 0.25 ± 1.47 | 0 | 1 |
| destro | ORC | sp_1000 | 977.17 | 977.52 | 0.04 | 0.35 ± 3.12 | 0 | 1 |
| destro | ORC | int_0 | 619.72 | 616.09 | -0.59 | -3.63 ± 1.85 | 0 | 1 |
| destro | ORC | int_400 | 681.89 | 682.76 | 0.13 | 0.87 ± 2.08 | 0 | 1 |
| destro | ORC | hit_0 | 574.12 | 574.71 | 0.10 | 0.59 ± 2.69 | 0 | 1 |
| destro | ORC | hit_5 | 603.17 | 603.19 | 0.00 | 0.02 ± 2.49 | 0 | 1 |
| destro | ORC | hit_16 | 643.96 | 644.24 | 0.04 | 0.28 ± 2.02 | 0 | 1 |
| destro | ORC | crit_0 | 565.74 | 567.04 | 0.23 | 1.30 ± 1.35 | 0 | 1 |
| destro | ORC | crit_30 | 720.81 | 721.22 | 0.06 | 0.41 ± 2.32 | 0 | 1 |
| destro | ORC | regen_low | 620.49 | 620.85 | 0.06 | 0.36 ± 1.92 | 0 | 1 |
| destro | ORC | regen_high | 677.36 | 677.07 | -0.04 | -0.29 ± 2.07 | 0 | 1 |
| destro | UNDEAD | baseline | 642.59 | 640.83 | -0.27 | -1.77 ± 1.97 | 0 | 1 |
| destro | UNDEAD | sp_250 | 479.09 | 477.47 | -0.34 | -1.62 ± 1.45 | 0 | 1 |
| destro | UNDEAD | sp_1000 | 969.60 | 967.54 | -0.21 | -2.06 ± 3.03 | 0 | 1 |
| destro | UNDEAD | int_0 | 614.51 | 612.14 | -0.39 | -2.37 ± 1.82 | 0 | 1 |
| destro | UNDEAD | int_400 | 677.30 | 675.81 | -0.22 | -1.48 ± 2.04 | 0 | 1 |
| destro | UNDEAD | hit_0 | 571.34 | 572.49 | 0.20 | 1.15 ± 2.65 | 0 | 1 |
| destro | UNDEAD | hit_5 | 602.27 | 600.90 | -0.23 | -1.37 ± 2.42 | 0 | 1 |
| destro | UNDEAD | hit_16 | 642.59 | 640.83 | -0.27 | -1.77 ± 1.97 | 0 | 1 |
| destro | UNDEAD | crit_0 | 564.55 | 564.41 | -0.03 | -0.14 ± 1.28 | 0 | 1 |
| destro | UNDEAD | crit_30 | 718.58 | 718.02 | -0.08 | -0.56 ± 2.24 | 0 | 1 |
| destro | UNDEAD | regen_low | 613.54 | 613.30 | -0.04 | -0.24 ± 1.89 | 0 | 1 |
| destro | UNDEAD | regen_high | 667.24 | 665.82 | -0.21 | -1.42 ± 2.01 | 0 | 1 |
| destro | TROLL | baseline | 632.78 | 637.01 | 0.67 | 4.24 ± 1.94 | 0 | 1 |
| destro | TROLL | sp_250 | 470.21 | 472.66 | 0.52 | 2.45 ± 1.42 | 0 | 1 |
| destro | TROLL | sp_1000 | 957.91 | 965.72 | 0.82 | 7.81 ± 2.99 | 0 | 1 |
| destro | TROLL | int_0 | 604.05 | 608.20 | 0.69 | 4.15 ± 1.81 | 0 | 1 |
| destro | TROLL | int_400 | 674.13 | 672.07 | -0.31 | -2.06 ± 2.05 | 0 | 1 |
| destro | TROLL | hit_0 | 566.93 | 566.64 | -0.05 | -0.29 ± 2.67 | 0 | 1 |
| destro | TROLL | hit_5 | 596.03 | 594.67 | -0.23 | -1.36 ± 2.40 | 0 | 1 |
| destro | TROLL | hit_16 | 632.78 | 637.01 | 0.67 | 4.24 ± 1.94 | 0 | 1 |
| destro | TROLL | crit_0 | 555.03 | 559.99 | 0.89 | 4.96 ± 1.26 | 0 | 1 |
| destro | TROLL | crit_30 | 709.72 | 714.09 | 0.62 | 4.37 ± 2.21 | 0 | 1 |
| destro | TROLL | regen_low | 617.52 | 616.20 | -0.21 | -1.31 ± 1.98 | 0 | 1 |
| destro | TROLL | regen_high | 665.70 | 656.68 | -1.35 | -9.02 ± 1.95 | 0 | 1 |
| destro | GNOME | baseline | 637.71 | 635.86 | -0.29 | -1.85 ± 1.99 | 0 | 1 |
| destro | GNOME | sp_250 | 473.61 | 471.92 | -0.36 | -1.69 ± 1.46 | 0 | 1 |
| destro | GNOME | sp_1000 | 965.89 | 963.74 | -0.22 | -2.15 ± 3.07 | 0 | 1 |
| destro | GNOME | int_0 | 612.24 | 612.25 | 0.00 | 0.01 ± 1.80 | 0 | 1 |
| destro | GNOME | int_400 | 674.70 | 672.70 | -0.30 | -2.00 ± 2.05 | 0 | 1 |
| destro | GNOME | hit_0 | 570.01 | 567.33 | -0.47 | -2.68 ± 2.72 | 0 | 1 |
| destro | GNOME | hit_5 | 599.50 | 596.45 | -0.51 | -3.05 ± 2.41 | 0 | 1 |
| destro | GNOME | hit_16 | 637.71 | 635.86 | -0.29 | -1.85 ± 1.99 | 0 | 1 |
| destro | GNOME | crit_0 | 560.02 | 558.69 | -0.24 | -1.33 ± 1.28 | 0 | 1 |
| destro | GNOME | crit_30 | 714.73 | 712.67 | -0.29 | -2.06 ± 2.22 | 0 | 1 |
| destro | GNOME | regen_low | 620.82 | 619.30 | -0.24 | -1.51 ± 1.93 | 0 | 1 |
| destro | GNOME | regen_high | 679.29 | 678.82 | -0.07 | -0.46 ± 2.17 | 0 | 1 |
| demo_shadow_brand | HUMAN | baseline | 715.71 | 717.50 | 0.25 | 1.79 ± 2.90 | 0 | 1 |
| demo_shadow_brand | HUMAN | sp_250 | 540.51 | 541.11 | 0.11 | 0.61 ± 2.12 | 0 | 1 |
| demo_shadow_brand | HUMAN | sp_1000 | 1066.12 | 1070.28 | 0.39 | 4.17 ± 4.48 | 0 | 1 |
| demo_shadow_brand | HUMAN | int_0 | 677.72 | 673.89 | -0.57 | -3.84 ± 2.65 | 0 | 1 |
| demo_shadow_brand | HUMAN | int_400 | 759.09 | 757.65 | -0.19 | -1.45 ± 3.09 | 0 | 1 |
| demo_shadow_brand | HUMAN | hit_0 | 624.25 | 626.55 | 0.37 | 2.30 ± 3.56 | 0 | 1 |
| demo_shadow_brand | HUMAN | hit_5 | 664.84 | 666.94 | 0.32 | 2.11 ± 3.41 | 0 | 1 |
| demo_shadow_brand | HUMAN | hit_16 | 748.63 | 748.11 | -0.07 | -0.53 ± 2.61 | 0 | 1 |
| demo_shadow_brand | HUMAN | crit_0 | 629.35 | 629.81 | 0.07 | 0.47 ± 2.10 | 0 | 1 |
| demo_shadow_brand | HUMAN | crit_30 | 801.33 | 805.07 | 0.47 | 3.74 ± 3.28 | 0 | 1 |
| demo_shadow_brand | HUMAN | regen_low | 692.60 | 692.97 | 0.05 | 0.36 ± 2.75 | 0 | 1 |
| demo_shadow_brand | HUMAN | regen_high | 749.08 | 747.62 | -0.19 | -1.45 ± 2.98 | 0 | 1 |
| demo_shadow_brand | ORC | baseline | 712.90 | 718.79 | 0.83 | 5.88 ± 2.89 | 0 | 1 |
| demo_shadow_brand | ORC | sp_250 | 537.54 | 541.51 | 0.74 | 3.97 ± 2.11 | 0 | 1 |
| demo_shadow_brand | ORC | sp_1000 | 1063.63 | 1073.33 | 0.91 | 9.70 ± 4.46 | 0 | 1 |
| demo_shadow_brand | ORC | int_0 | 676.74 | 678.28 | 0.23 | 1.54 ± 2.71 | 0 | 1 |
| demo_shadow_brand | ORC | int_400 | 756.29 | 761.95 | 0.75 | 5.66 ± 3.09 | 0 | 1 |
| demo_shadow_brand | ORC | hit_0 | 621.96 | 627.52 | 0.89 | 5.57 ± 3.56 | 0 | 1 |
| demo_shadow_brand | ORC | hit_5 | 662.16 | 666.33 | 0.63 | 4.17 ± 3.32 | 0 | 1 |
| demo_shadow_brand | ORC | hit_16 | 743.31 | 748.50 | 0.70 | 5.18 ± 2.63 | 0 | 1 |
| demo_shadow_brand | ORC | crit_0 | 626.36 | 629.48 | 0.50 | 3.12 ± 2.01 | 0 | 1 |
| demo_shadow_brand | ORC | crit_30 | 799.68 | 807.72 | 1.01 | 8.04 ± 3.25 | 0 | 1 |
| demo_shadow_brand | ORC | regen_low | 691.30 | 693.18 | 0.27 | 1.89 ± 2.78 | 0 | 1 |
| demo_shadow_brand | ORC | regen_high | 743.14 | 744.84 | 0.23 | 1.70 ± 2.89 | 0 | 1 |
| demo_shadow_brand | UNDEAD | baseline | 711.99 | 711.51 | -0.07 | -0.48 ± 2.79 | 0 | 1 |
| demo_shadow_brand | UNDEAD | sp_250 | 539.22 | 538.21 | -0.19 | -1.01 ± 2.04 | 0 | 1 |
| demo_shadow_brand | UNDEAD | sp_1000 | 1057.54 | 1058.11 | 0.05 | 0.57 ± 4.30 | 0 | 1 |
| demo_shadow_brand | UNDEAD | int_0 | 671.48 | 670.31 | -0.17 | -1.17 ± 2.53 | 0 | 1 |
| demo_shadow_brand | UNDEAD | int_400 | 753.29 | 752.85 | -0.06 | -0.44 ± 2.97 | 0 | 1 |
| demo_shadow_brand | UNDEAD | hit_0 | 617.84 | 619.86 | 0.33 | 2.02 ± 3.41 | 0 | 1 |
| demo_shadow_brand | UNDEAD | hit_5 | 657.93 | 659.44 | 0.23 | 1.51 ± 3.16 | 0 | 1 |
| demo_shadow_brand | UNDEAD | hit_16 | 741.37 | 739.57 | -0.24 | -1.80 ± 2.55 | 0 | 1 |
| demo_shadow_brand | UNDEAD | crit_0 | 624.84 | 624.40 | -0.07 | -0.43 ± 1.92 | 0 | 1 |
| demo_shadow_brand | UNDEAD | crit_30 | 798.33 | 797.99 | -0.04 | -0.34 ± 3.26 | 0 | 1 |
| demo_shadow_brand | UNDEAD | regen_low | 688.58 | 687.90 | -0.10 | -0.69 ± 2.72 | 0 | 1 |
| demo_shadow_brand | UNDEAD | regen_high | 739.03 | 738.22 | -0.11 | -0.81 ± 2.86 | 0 | 1 |
| demo_shadow_brand | TROLL | baseline | 705.95 | 708.07 | 0.30 | 2.12 ± 2.86 | 0 | 1 |
| demo_shadow_brand | TROLL | sp_250 | 533.15 | 533.86 | 0.13 | 0.72 ± 2.09 | 0 | 1 |
| demo_shadow_brand | TROLL | sp_1000 | 1051.55 | 1056.47 | 0.47 | 4.92 ± 4.41 | 0 | 1 |
| demo_shadow_brand | TROLL | int_0 | 668.06 | 668.22 | 0.02 | 0.16 ± 2.62 | 0 | 1 |
| demo_shadow_brand | TROLL | int_400 | 748.70 | 749.78 | 0.14 | 1.07 ± 3.04 | 0 | 1 |
| demo_shadow_brand | TROLL | hit_0 | 614.15 | 618.35 | 0.68 | 4.20 ± 3.47 | 0 | 1 |
| demo_shadow_brand | TROLL | hit_5 | 654.18 | 656.01 | 0.28 | 1.83 ± 3.29 | 0 | 1 |
| demo_shadow_brand | TROLL | hit_16 | 736.49 | 735.19 | -0.18 | -1.30 ± 2.53 | 0 | 1 |
| demo_shadow_brand | TROLL | crit_0 | 619.70 | 619.13 | -0.09 | -0.58 ± 1.99 | 0 | 1 |
| demo_shadow_brand | TROLL | crit_30 | 792.54 | 794.88 | 0.29 | 2.34 ± 3.28 | 0 | 1 |
| demo_shadow_brand | TROLL | regen_low | 683.45 | 680.38 | -0.45 | -3.08 ± 2.65 | 0 | 1 |
| demo_shadow_brand | TROLL | regen_high | 734.82 | 733.50 | -0.18 | -1.32 ± 2.91 | 0 | 1 |
| demo_shadow_brand | GNOME | baseline | 707.83 | 706.65 | -0.17 | -1.18 ± 2.76 | 0 | 1 |
| demo_shadow_brand | GNOME | sp_250 | 534.60 | 533.01 | -0.30 | -1.60 ± 2.02 | 0 | 1 |
| demo_shadow_brand | GNOME | sp_1000 | 1054.28 | 1053.94 | -0.03 | -0.34 ± 4.24 | 0 | 1 |
| demo_shadow_brand | GNOME | int_0 | 665.82 | 663.11 | -0.41 | -2.72 ± 2.47 | 0 | 1 |
| demo_shadow_brand | GNOME | int_400 | 752.99 | 751.32 | -0.22 | -1.67 ± 3.09 | 0 | 1 |
| demo_shadow_brand | GNOME | hit_0 | 614.99 | 617.79 | 0.46 | 2.80 ± 3.37 | 0 | 1 |
| demo_shadow_brand | GNOME | hit_5 | 653.72 | 657.77 | 0.62 | 4.05 ± 3.31 | 0 | 1 |
| demo_shadow_brand | GNOME | hit_16 | 737.34 | 734.10 | -0.44 | -3.23 ± 2.49 | 0 | 1 |
| demo_shadow_brand | GNOME | crit_0 | 620.96 | 619.45 | -0.24 | -1.51 ± 1.92 | 0 | 1 |
| demo_shadow_brand | GNOME | crit_30 | 794.11 | 793.54 | -0.07 | -0.57 ± 3.19 | 0 | 1 |
| demo_shadow_brand | GNOME | regen_low | 682.67 | 679.93 | -0.40 | -2.74 ± 2.73 | 0 | 1 |
| demo_shadow_brand | GNOME | regen_high | 736.59 | 737.94 | 0.18 | 1.35 ± 2.83 | 0 | 1 |
| demo_fire_brand | HUMAN | baseline | 752.84 | 749.95 | -0.38 | -2.89 ± 1.99 | 0 | 1 |
| demo_fire_brand | HUMAN | sp_250 | 570.70 | 567.74 | -0.52 | -2.97 ± 1.47 | 0 | 1 |
| demo_fire_brand | HUMAN | sp_1000 | 1117.11 | 1114.37 | -0.25 | -2.74 ± 3.04 | 0 | 1 |
| demo_fire_brand | HUMAN | int_0 | 717.46 | 713.93 | -0.49 | -3.52 ± 1.85 | 0 | 1 |
| demo_fire_brand | HUMAN | int_400 | 788.86 | 786.19 | -0.34 | -2.67 ± 2.13 | 0 | 1 |
| demo_fire_brand | HUMAN | hit_0 | 658.88 | 657.00 | -0.29 | -1.89 ± 2.67 | 0 | 1 |
| demo_fire_brand | HUMAN | hit_5 | 697.71 | 696.28 | -0.20 | -1.42 ± 2.47 | 0 | 1 |
| demo_fire_brand | HUMAN | hit_16 | 785.00 | 781.46 | -0.45 | -3.54 ± 1.61 | 0 | 1 |
| demo_fire_brand | HUMAN | crit_0 | 681.59 | 678.33 | -0.48 | -3.26 ± 1.58 | 0 | 1 |
| demo_fire_brand | HUMAN | crit_30 | 824.62 | 821.41 | -0.39 | -3.21 ± 2.20 | 0 | 1 |
| demo_fire_brand | HUMAN | regen_low | 731.87 | 727.60 | -0.58 | -4.27 ± 1.95 | 0 | 1 |
| demo_fire_brand | HUMAN | regen_high | 774.69 | 775.40 | 0.09 | 0.72 ± 2.02 | 0 | 1 |
| demo_fire_brand | ORC | baseline | 749.89 | 751.94 | 0.27 | 2.05 ± 1.95 | 0 | 1 |
| demo_fire_brand | ORC | sp_250 | 567.69 | 569.12 | 0.25 | 1.43 ± 1.44 | 0 | 1 |
| demo_fire_brand | ORC | sp_1000 | 1114.28 | 1117.59 | 0.30 | 3.31 ± 2.97 | 0 | 1 |
| demo_fire_brand | ORC | int_0 | 718.32 | 720.80 | 0.35 | 2.48 ± 1.87 | 0 | 1 |
| demo_fire_brand | ORC | int_400 | 791.63 | 794.19 | 0.32 | 2.56 ± 2.19 | 0 | 1 |
| demo_fire_brand | ORC | hit_0 | 656.91 | 659.18 | 0.35 | 2.27 ± 2.71 | 0 | 1 |
| demo_fire_brand | ORC | hit_5 | 696.96 | 699.96 | 0.43 | 3.00 ± 2.47 | 0 | 1 |
| demo_fire_brand | ORC | hit_16 | 779.78 | 781.38 | 0.20 | 1.59 ± 1.58 | 0 | 1 |
| demo_fire_brand | ORC | crit_0 | 678.78 | 679.80 | 0.15 | 1.02 ± 1.54 | 0 | 1 |
| demo_fire_brand | ORC | crit_30 | 821.65 | 824.17 | 0.31 | 2.52 ± 2.16 | 0 | 1 |
| demo_fire_brand | ORC | regen_low | 730.26 | 730.85 | 0.08 | 0.59 ± 1.96 | 0 | 1 |
| demo_fire_brand | ORC | regen_high | 771.26 | 778.98 | 1.00 | 7.72 ± 1.99 | 0 | 1 |
| demo_fire_brand | UNDEAD | baseline | 752.13 | 749.43 | -0.36 | -2.69 ± 1.97 | 0 | 1 |
| demo_fire_brand | UNDEAD | sp_250 | 572.19 | 569.60 | -0.45 | -2.58 ± 1.47 | 0 | 1 |
| demo_fire_brand | UNDEAD | sp_1000 | 1112.00 | 1109.10 | -0.26 | -2.90 ± 2.99 | 0 | 1 |
| demo_fire_brand | UNDEAD | int_0 | 714.43 | 709.32 | -0.72 | -5.11 ± 1.83 | 0 | 1 |
| demo_fire_brand | UNDEAD | int_400 | 785.51 | 781.52 | -0.51 | -4.00 ± 2.02 | 0 | 1 |
| demo_fire_brand | UNDEAD | hit_0 | 655.89 | 654.51 | -0.21 | -1.38 ± 2.67 | 0 | 1 |
| demo_fire_brand | UNDEAD | hit_5 | 695.05 | 693.93 | -0.16 | -1.12 ± 2.45 | 0 | 1 |
| demo_fire_brand | UNDEAD | hit_16 | 787.08 | 781.97 | -0.65 | -5.11 ± 1.60 | 0 | 1 |
| demo_fire_brand | UNDEAD | crit_0 | 680.44 | 677.63 | -0.41 | -2.80 ± 1.57 | 0 | 1 |
| demo_fire_brand | UNDEAD | crit_30 | 823.58 | 821.61 | -0.24 | -1.98 ± 2.22 | 0 | 1 |
| demo_fire_brand | UNDEAD | regen_low | 730.65 | 727.68 | -0.41 | -2.97 ± 1.99 | 0 | 1 |
| demo_fire_brand | UNDEAD | regen_high | 769.86 | 773.19 | 0.43 | 3.33 ± 2.01 | 0 | 1 |
| demo_fire_brand | TROLL | baseline | 744.48 | 743.09 | -0.19 | -1.40 ± 1.97 | 0 | 1 |
| demo_fire_brand | TROLL | sp_250 | 564.55 | 562.75 | -0.32 | -1.80 ± 1.46 | 0 | 1 |
| demo_fire_brand | TROLL | sp_1000 | 1104.36 | 1103.76 | -0.05 | -0.60 ± 3.00 | 0 | 1 |
| demo_fire_brand | TROLL | int_0 | 711.44 | 708.22 | -0.45 | -3.23 ± 1.81 | 0 | 1 |
| demo_fire_brand | TROLL | int_400 | 778.61 | 775.21 | -0.44 | -3.39 ± 2.08 | 0 | 1 |
| demo_fire_brand | TROLL | hit_0 | 650.89 | 648.06 | -0.44 | -2.83 ± 2.70 | 0 | 1 |
| demo_fire_brand | TROLL | hit_5 | 690.49 | 688.44 | -0.30 | -2.05 ± 2.44 | 0 | 1 |
| demo_fire_brand | TROLL | hit_16 | 779.76 | 775.22 | -0.58 | -4.54 ± 1.56 | 0 | 1 |
| demo_fire_brand | TROLL | crit_0 | 673.60 | 670.98 | -0.39 | -2.62 ± 1.56 | 0 | 1 |
| demo_fire_brand | TROLL | crit_30 | 816.72 | 814.72 | -0.24 | -1.99 ± 2.20 | 0 | 1 |
| demo_fire_brand | TROLL | regen_low | 724.40 | 719.44 | -0.69 | -4.96 ± 1.93 | 0 | 1 |
| demo_fire_brand | TROLL | regen_high | 767.17 | 766.12 | -0.14 | -1.05 ± 2.06 | 0 | 1 |
| demo_fire_brand | GNOME | baseline | 745.46 | 742.00 | -0.46 | -3.46 ± 1.93 | 0 | 1 |
| demo_fire_brand | GNOME | sp_250 | 565.02 | 561.69 | -0.59 | -3.33 ± 1.42 | 0 | 1 |
| demo_fire_brand | GNOME | sp_1000 | 1106.35 | 1102.64 | -0.34 | -3.71 ± 2.94 | 0 | 1 |
| demo_fire_brand | GNOME | int_0 | 713.15 | 708.84 | -0.60 | -4.31 ± 1.98 | 0 | 1 |
| demo_fire_brand | GNOME | int_400 | 778.33 | 778.19 | -0.02 | -0.13 ± 2.03 | 0 | 1 |
| demo_fire_brand | GNOME | hit_0 | 652.09 | 651.71 | -0.06 | -0.38 ± 2.66 | 0 | 1 |
| demo_fire_brand | GNOME | hit_5 | 693.17 | 690.40 | -0.40 | -2.78 ± 2.53 | 0 | 1 |
| demo_fire_brand | GNOME | hit_16 | 774.13 | 769.69 | -0.57 | -4.44 ± 1.56 | 0 | 1 |
| demo_fire_brand | GNOME | crit_0 | 673.82 | 670.80 | -0.45 | -3.03 ± 1.51 | 0 | 1 |
| demo_fire_brand | GNOME | crit_30 | 817.96 | 813.09 | -0.59 | -4.87 ± 2.15 | 0 | 1 |
| demo_fire_brand | GNOME | regen_low | 728.44 | 725.63 | -0.39 | -2.81 ± 2.03 | 0 | 1 |
| demo_fire_brand | GNOME | regen_high | 770.26 | 770.09 | -0.02 | -0.17 ± 2.08 | 0 | 1 |

The JSON companion includes exact requests, resolved app configs, source/app hashes, input differences, import diagnostics, and spell/pet breakdowns. Existing five-preset benchmark artifacts are unchanged.
