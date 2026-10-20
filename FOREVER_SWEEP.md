# Forever race/stat diagnostic sweep

complete: 300/300 combinations completed; 100 fights per engine per combination, seed 101.

Full preset × race × profile sweep. Profiles change one baseline stat at a time, except regeneration profiles which jointly change spirit and mp5. All stats are bonuses above racial/class bases. Gear-free, 180s, zero distance, external CoE only, no consumables. Source APLs are retained, including their race-specific action IDs; this measures import behavior rather than optimizing each race's rotation.

**Diagnostic only.** Source APLs are retained for every race, including race-specific action IDs. Unsupported imports are recorded, not treated as accepted parity. Gear and consumables are absent.

Intervals are approximate 95% Monte Carlo intervals for independent-engine mean differences. At 100 trials they are noisy, and intervals are not adjusted for multiple comparisons. Equal seeds do not pair RNG streams. Small total differences can hide offsetting spell errors.

| Preset | Cases | Mean absolute delta % | Worst absolute delta % |
| --- | ---: | ---: | ---: |
| sm_ruin | 60 | 0.80 | 2.46 |
| aff_wrack | 60 | 0.62 | 2.00 |
| destro | 60 | 0.86 | 3.04 |
| demo_shadow_brand | 60 | 1.11 | 3.65 |
| demo_fire_brand | 60 | 0.62 | 2.53 |

## Largest observed total differences

| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| demo_shadow_brand | GNOME | hit_0 | 610.96 | 633.29 | 3.65 | 22.33 ± 10.59 |
| demo_shadow_brand | GNOME | hit_5 | 650.18 | 673.64 | 3.61 | 23.46 ± 9.58 |
| demo_shadow_brand | ORC | hit_5 | 652.98 | 675.80 | 3.49 | 22.82 ± 9.21 |
| demo_shadow_brand | ORC | hit_0 | 614.72 | 634.61 | 3.24 | 19.89 ± 10.36 |
| demo_shadow_brand | UNDEAD | hit_0 | 611.38 | 630.98 | 3.21 | 19.60 ± 10.09 |
| destro | GNOME | regen_high | 675.93 | 655.40 | -3.04 | -20.54 ± 6.58 |
| demo_shadow_brand | TROLL | hit_0 | 608.86 | 627.35 | 3.04 | 18.49 ± 10.42 |
| demo_fire_brand | ORC | hit_0 | 650.56 | 667.03 | 2.53 | 16.47 ± 8.39 |
| demo_shadow_brand | TROLL | hit_5 | 648.88 | 665.25 | 2.52 | 16.36 ± 9.10 |
| sm_ruin | UNDEAD | hit_0 | 565.01 | 578.92 | 2.46 | 13.91 ± 10.35 |
| demo_shadow_brand | HUMAN | hit_0 | 621.59 | 635.77 | 2.28 | 14.18 ± 10.99 |
| demo_shadow_brand | HUMAN | hit_5 | 658.41 | 673.21 | 2.25 | 14.80 ± 9.27 |
| demo_fire_brand | GNOME | hit_0 | 648.90 | 662.98 | 2.17 | 14.08 ± 7.68 |
| destro | UNDEAD | int_400 | 676.28 | 661.96 | -2.12 | -14.32 ± 6.05 |
| destro | TROLL | int_400 | 670.29 | 656.37 | -2.08 | -13.92 ± 6.59 |
| aff_wrack | UNDEAD | regen_low | 537.48 | 526.71 | -2.00 | -10.77 ± 5.43 |
| demo_shadow_brand | ORC | crit_30 | 794.80 | 810.26 | 1.95 | 15.46 ± 9.72 |
| demo_shadow_brand | GNOME | int_400 | 751.20 | 765.67 | 1.93 | 14.47 ± 9.06 |
| destro | HUMAN | crit_0 | 568.18 | 557.52 | -1.88 | -10.66 ± 4.22 |
| destro | HUMAN | sp_1000 | 974.92 | 956.92 | -1.85 | -18.00 ± 9.59 |

## All combinations

| Preset | Race | Profile | Forever DPS | WebGL DPS | Delta % | Delta DPS ±95% | Stat differences | Group omissions |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| sm_ruin | HUMAN | baseline | 652.19 | 649.78 | -0.37 | -2.41 ± 8.80 | 0 | 1 |
| sm_ruin | HUMAN | sp_250 | 475.04 | 473.00 | -0.43 | -2.04 ± 6.27 | 0 | 1 |
| sm_ruin | HUMAN | sp_1000 | 1006.49 | 1003.35 | -0.31 | -3.14 ± 13.87 | 0 | 1 |
| sm_ruin | HUMAN | int_0 | 616.38 | 609.97 | -1.04 | -6.41 ± 9.14 | 0 | 1 |
| sm_ruin | HUMAN | int_400 | 688.05 | 690.44 | 0.35 | 2.39 ± 9.40 | 0 | 1 |
| sm_ruin | HUMAN | hit_0 | 574.68 | 585.26 | 1.84 | 10.59 ± 10.43 | 0 | 1 |
| sm_ruin | HUMAN | hit_5 | 609.98 | 611.83 | 0.30 | 1.85 ± 9.81 | 0 | 1 |
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
| sm_ruin | ORC | hit_0 | 574.09 | 582.55 | 1.47 | 8.47 ± 10.89 | 0 | 1 |
| sm_ruin | ORC | hit_5 | 610.32 | 611.74 | 0.23 | 1.42 ± 10.28 | 0 | 1 |
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
| sm_ruin | UNDEAD | hit_0 | 565.01 | 578.92 | 2.46 | 13.91 ± 10.35 | 0 | 1 |
| sm_ruin | UNDEAD | hit_5 | 604.02 | 609.14 | 0.85 | 5.12 ± 9.91 | 0 | 1 |
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
| sm_ruin | TROLL | hit_0 | 565.38 | 574.73 | 1.65 | 9.35 ± 9.64 | 0 | 1 |
| sm_ruin | TROLL | hit_5 | 597.38 | 604.10 | 1.12 | 6.72 ± 9.35 | 0 | 1 |
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
| sm_ruin | GNOME | hit_0 | 568.92 | 572.07 | 0.55 | 3.14 ± 10.87 | 0 | 1 |
| sm_ruin | GNOME | hit_5 | 601.91 | 605.53 | 0.60 | 3.61 ± 10.19 | 0 | 1 |
| sm_ruin | GNOME | hit_16 | 638.15 | 640.94 | 0.44 | 2.79 ± 8.69 | 0 | 1 |
| sm_ruin | GNOME | crit_0 | 541.89 | 545.01 | 0.58 | 3.12 ± 7.18 | 0 | 1 |
| sm_ruin | GNOME | crit_30 | 733.27 | 735.80 | 0.34 | 2.53 ± 9.79 | 0 | 1 |
| sm_ruin | GNOME | regen_low | 615.44 | 616.96 | 0.25 | 1.52 ± 8.66 | 0 | 1 |
| sm_ruin | GNOME | regen_high | 664.11 | 673.30 | 1.38 | 9.19 ± 9.38 | 0 | 1 |
| aff_wrack | HUMAN | baseline | 561.43 | 552.29 | -1.63 | -9.14 ± 5.72 | 0 | 1 |
| aff_wrack | HUMAN | sp_250 | 408.04 | 400.95 | -1.74 | -7.09 ± 4.04 | 0 | 1 |
| aff_wrack | HUMAN | sp_1000 | 868.21 | 854.97 | -1.53 | -13.24 ± 9.10 | 0 | 1 |
| aff_wrack | HUMAN | int_0 | 531.97 | 526.30 | -1.07 | -5.67 ± 4.55 | 0 | 1 |
| aff_wrack | HUMAN | int_400 | 589.88 | 592.38 | 0.42 | 2.51 ± 5.85 | 0 | 1 |
| aff_wrack | HUMAN | hit_0 | 514.54 | 516.79 | 0.44 | 2.25 ± 6.61 | 0 | 1 |
| aff_wrack | HUMAN | hit_5 | 535.14 | 533.85 | -0.24 | -1.29 ± 5.83 | 0 | 1 |
| aff_wrack | HUMAN | hit_16 | 561.43 | 552.29 | -1.63 | -9.14 ± 5.72 | 0 | 1 |
| aff_wrack | HUMAN | crit_0 | 488.57 | 483.33 | -1.07 | -5.24 ± 4.30 | 0 | 1 |
| aff_wrack | HUMAN | crit_30 | 628.16 | 623.24 | -0.78 | -4.92 ± 5.69 | 0 | 1 |
| aff_wrack | HUMAN | regen_low | 540.40 | 533.98 | -1.19 | -6.42 ± 5.40 | 0 | 1 |
| aff_wrack | HUMAN | regen_high | 574.67 | 577.49 | 0.49 | 2.81 ± 6.18 | 0 | 1 |
| aff_wrack | ORC | baseline | 556.23 | 553.49 | -0.49 | -2.74 ± 5.27 | 0 | 1 |
| aff_wrack | ORC | sp_250 | 403.48 | 401.66 | -0.45 | -1.82 ± 3.71 | 0 | 1 |
| aff_wrack | ORC | sp_1000 | 861.73 | 857.15 | -0.53 | -4.58 ± 8.43 | 0 | 1 |
| aff_wrack | ORC | int_0 | 526.06 | 524.22 | -0.35 | -1.84 ± 4.98 | 0 | 1 |
| aff_wrack | ORC | int_400 | 585.58 | 585.53 | -0.01 | -0.05 ± 5.78 | 0 | 1 |
| aff_wrack | ORC | hit_0 | 510.17 | 513.80 | 0.71 | 3.63 ± 6.21 | 0 | 1 |
| aff_wrack | ORC | hit_5 | 533.44 | 533.43 | -0.00 | -0.01 ± 6.08 | 0 | 1 |
| aff_wrack | ORC | hit_16 | 556.23 | 553.49 | -0.49 | -2.74 ± 5.27 | 0 | 1 |
| aff_wrack | ORC | crit_0 | 485.26 | 487.42 | 0.44 | 2.15 ± 4.56 | 0 | 1 |
| aff_wrack | ORC | crit_30 | 622.95 | 627.91 | 0.80 | 4.96 ± 5.73 | 0 | 1 |
| aff_wrack | ORC | regen_low | 538.85 | 531.59 | -1.35 | -7.26 ± 5.11 | 0 | 1 |
| aff_wrack | ORC | regen_high | 567.73 | 569.61 | 0.33 | 1.87 ± 6.15 | 0 | 1 |
| aff_wrack | UNDEAD | baseline | 556.96 | 556.02 | -0.17 | -0.93 ± 5.41 | 0 | 1 |
| aff_wrack | UNDEAD | sp_250 | 406.56 | 405.61 | -0.23 | -0.95 ± 3.82 | 0 | 1 |
| aff_wrack | UNDEAD | sp_1000 | 857.75 | 856.86 | -0.10 | -0.89 ± 8.61 | 0 | 1 |
| aff_wrack | UNDEAD | int_0 | 521.33 | 522.90 | 0.30 | 1.57 ± 4.92 | 0 | 1 |
| aff_wrack | UNDEAD | int_400 | 585.35 | 581.06 | -0.73 | -4.29 ± 5.64 | 0 | 1 |
| aff_wrack | UNDEAD | hit_0 | 513.91 | 507.77 | -1.20 | -6.14 ± 6.61 | 0 | 1 |
| aff_wrack | UNDEAD | hit_5 | 532.81 | 530.57 | -0.42 | -2.24 ± 6.75 | 0 | 1 |
| aff_wrack | UNDEAD | hit_16 | 556.96 | 556.02 | -0.17 | -0.93 ± 5.41 | 0 | 1 |
| aff_wrack | UNDEAD | crit_0 | 492.13 | 483.04 | -1.85 | -9.08 ± 4.14 | 0 | 1 |
| aff_wrack | UNDEAD | crit_30 | 624.54 | 622.78 | -0.28 | -1.76 ± 6.05 | 0 | 1 |
| aff_wrack | UNDEAD | regen_low | 537.48 | 526.71 | -2.00 | -10.77 ± 5.43 | 0 | 1 |
| aff_wrack | UNDEAD | regen_high | 565.67 | 568.57 | 0.51 | 2.90 ± 5.90 | 0 | 1 |
| aff_wrack | TROLL | baseline | 549.43 | 547.88 | -0.28 | -1.55 ± 5.17 | 0 | 1 |
| aff_wrack | TROLL | sp_250 | 399.26 | 397.74 | -0.38 | -1.52 ± 3.66 | 0 | 1 |
| aff_wrack | TROLL | sp_1000 | 849.78 | 848.16 | -0.19 | -1.62 ± 8.20 | 0 | 1 |
| aff_wrack | TROLL | int_0 | 517.14 | 510.56 | -1.27 | -6.59 ± 5.19 | 0 | 1 |
| aff_wrack | TROLL | int_400 | 578.47 | 579.21 | 0.13 | 0.74 ± 5.92 | 0 | 1 |
| aff_wrack | TROLL | hit_0 | 503.02 | 508.34 | 1.06 | 5.32 ± 6.23 | 0 | 1 |
| aff_wrack | TROLL | hit_5 | 523.01 | 526.52 | 0.67 | 3.51 ± 6.37 | 0 | 1 |
| aff_wrack | TROLL | hit_16 | 549.43 | 547.88 | -0.28 | -1.55 ± 5.17 | 0 | 1 |
| aff_wrack | TROLL | crit_0 | 477.06 | 475.36 | -0.36 | -1.70 ± 4.11 | 0 | 1 |
| aff_wrack | TROLL | crit_30 | 615.10 | 615.71 | 0.10 | 0.62 ± 6.19 | 0 | 1 |
| aff_wrack | TROLL | regen_low | 532.29 | 528.08 | -0.79 | -4.21 ± 5.32 | 0 | 1 |
| aff_wrack | TROLL | regen_high | 560.14 | 568.56 | 1.50 | 8.42 ± 5.59 | 0 | 1 |
| aff_wrack | GNOME | baseline | 553.00 | 551.41 | -0.29 | -1.59 ± 5.47 | 0 | 1 |
| aff_wrack | GNOME | sp_250 | 401.76 | 400.35 | -0.35 | -1.41 ± 3.86 | 0 | 1 |
| aff_wrack | GNOME | sp_1000 | 855.49 | 853.53 | -0.23 | -1.96 ± 8.69 | 0 | 1 |
| aff_wrack | GNOME | int_0 | 514.01 | 516.56 | 0.50 | 2.55 ± 5.40 | 0 | 1 |
| aff_wrack | GNOME | int_400 | 584.18 | 584.73 | 0.09 | 0.55 ± 5.60 | 0 | 1 |
| aff_wrack | GNOME | hit_0 | 507.46 | 510.31 | 0.56 | 2.86 ± 5.86 | 0 | 1 |
| aff_wrack | GNOME | hit_5 | 528.99 | 529.89 | 0.17 | 0.89 ± 6.11 | 0 | 1 |
| aff_wrack | GNOME | hit_16 | 553.00 | 551.41 | -0.29 | -1.59 ± 5.47 | 0 | 1 |
| aff_wrack | GNOME | crit_0 | 484.20 | 483.63 | -0.12 | -0.56 ± 3.94 | 0 | 1 |
| aff_wrack | GNOME | crit_30 | 621.22 | 622.68 | 0.24 | 1.46 ± 5.85 | 0 | 1 |
| aff_wrack | GNOME | regen_low | 539.39 | 532.21 | -1.33 | -7.18 ± 5.07 | 0 | 1 |
| aff_wrack | GNOME | regen_high | 566.68 | 565.84 | -0.15 | -0.83 ± 5.93 | 0 | 1 |
| destro | HUMAN | baseline | 642.86 | 631.33 | -1.79 | -11.53 ± 6.23 | 0 | 1 |
| destro | HUMAN | sp_250 | 476.83 | 468.53 | -1.74 | -8.30 ± 4.56 | 0 | 1 |
| destro | HUMAN | sp_1000 | 974.92 | 956.92 | -1.85 | -18.00 ± 9.59 | 0 | 1 |
| destro | HUMAN | int_0 | 612.97 | 610.34 | -0.43 | -2.63 ± 5.84 | 0 | 1 |
| destro | HUMAN | int_400 | 675.03 | 665.79 | -1.37 | -9.24 ± 6.12 | 0 | 1 |
| destro | HUMAN | hit_0 | 570.53 | 573.98 | 0.60 | 3.45 ± 8.54 | 0 | 1 |
| destro | HUMAN | hit_5 | 604.64 | 599.27 | -0.89 | -5.37 ± 7.90 | 0 | 1 |
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
| destro | ORC | hit_0 | 571.13 | 573.19 | 0.36 | 2.05 ± 7.32 | 0 | 1 |
| destro | ORC | hit_5 | 603.07 | 603.93 | 0.14 | 0.86 ± 7.97 | 0 | 1 |
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
| destro | UNDEAD | hit_0 | 568.07 | 575.88 | 1.38 | 7.81 ± 8.04 | 0 | 1 |
| destro | UNDEAD | hit_5 | 605.98 | 595.93 | -1.66 | -10.05 ± 7.44 | 0 | 1 |
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
| destro | TROLL | hit_0 | 563.62 | 566.03 | 0.43 | 2.42 ± 7.68 | 0 | 1 |
| destro | TROLL | hit_5 | 597.78 | 594.38 | -0.57 | -3.39 ± 7.68 | 0 | 1 |
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
| destro | GNOME | hit_0 | 563.22 | 573.13 | 1.76 | 9.91 ± 7.65 | 0 | 1 |
| destro | GNOME | hit_5 | 598.77 | 601.86 | 0.52 | 3.09 ± 8.12 | 0 | 1 |
| destro | GNOME | hit_16 | 637.21 | 637.37 | 0.03 | 0.16 ± 6.25 | 0 | 1 |
| destro | GNOME | crit_0 | 559.19 | 563.18 | 0.71 | 3.99 ± 4.38 | 0 | 1 |
| destro | GNOME | crit_30 | 712.70 | 713.17 | 0.07 | 0.47 ± 7.18 | 0 | 1 |
| destro | GNOME | regen_low | 619.47 | 616.22 | -0.52 | -3.25 ± 5.46 | 0 | 1 |
| destro | GNOME | regen_high | 675.93 | 655.40 | -3.04 | -20.54 ± 6.58 | 0 | 1 |
| demo_shadow_brand | HUMAN | baseline | 712.57 | 717.41 | 0.68 | 4.84 ± 8.66 | 0 | 5 |
| demo_shadow_brand | HUMAN | sp_250 | 538.11 | 541.12 | 0.56 | 3.02 ± 6.31 | 0 | 5 |
| demo_shadow_brand | HUMAN | sp_1000 | 1061.50 | 1069.98 | 0.80 | 8.48 ± 13.38 | 0 | 5 |
| demo_shadow_brand | HUMAN | int_0 | 678.24 | 673.61 | -0.68 | -4.63 ± 7.53 | 0 | 5 |
| demo_shadow_brand | HUMAN | int_400 | 757.89 | 759.81 | 0.25 | 1.91 ± 9.69 | 0 | 5 |
| demo_shadow_brand | HUMAN | hit_0 | 621.59 | 635.77 | 2.28 | 14.18 ± 10.99 | 0 | 5 |
| demo_shadow_brand | HUMAN | hit_5 | 658.41 | 673.21 | 2.25 | 14.80 ± 9.27 | 0 | 5 |
| demo_shadow_brand | HUMAN | hit_16 | 745.94 | 745.46 | -0.06 | -0.48 ± 8.22 | 0 | 5 |
| demo_shadow_brand | HUMAN | crit_0 | 628.02 | 630.21 | 0.35 | 2.19 ± 5.95 | 0 | 5 |
| demo_shadow_brand | HUMAN | crit_30 | 799.54 | 806.94 | 0.93 | 7.41 ± 9.94 | 0 | 5 |
| demo_shadow_brand | HUMAN | regen_low | 691.94 | 694.86 | 0.42 | 2.92 ± 8.39 | 0 | 5 |
| demo_shadow_brand | HUMAN | regen_high | 747.17 | 749.36 | 0.29 | 2.19 ± 8.52 | 0 | 5 |
| demo_shadow_brand | ORC | baseline | 712.24 | 720.18 | 1.12 | 7.94 ± 8.86 | 0 | 5 |
| demo_shadow_brand | ORC | sp_250 | 536.95 | 542.51 | 1.04 | 5.56 ± 6.46 | 0 | 5 |
| demo_shadow_brand | ORC | sp_1000 | 1062.83 | 1075.54 | 1.20 | 12.72 ± 13.67 | 0 | 5 |
| demo_shadow_brand | ORC | int_0 | 676.86 | 679.15 | 0.34 | 2.28 ± 8.82 | 0 | 5 |
| demo_shadow_brand | ORC | int_400 | 753.17 | 763.76 | 1.41 | 10.59 ± 8.93 | 0 | 5 |
| demo_shadow_brand | ORC | hit_0 | 614.72 | 634.61 | 3.24 | 19.89 ± 10.36 | 0 | 5 |
| demo_shadow_brand | ORC | hit_5 | 652.98 | 675.80 | 3.49 | 22.82 ± 9.21 | 0 | 5 |
| demo_shadow_brand | ORC | hit_16 | 740.71 | 747.27 | 0.89 | 6.56 ± 8.10 | 0 | 5 |
| demo_shadow_brand | ORC | crit_0 | 625.41 | 630.74 | 0.85 | 5.33 ± 6.28 | 0 | 5 |
| demo_shadow_brand | ORC | crit_30 | 794.80 | 810.26 | 1.95 | 15.46 ± 9.72 | 0 | 5 |
| demo_shadow_brand | ORC | regen_low | 688.68 | 690.96 | 0.33 | 2.28 ± 7.99 | 0 | 5 |
| demo_shadow_brand | ORC | regen_high | 741.71 | 748.78 | 0.95 | 7.07 ± 8.15 | 0 | 5 |
| demo_shadow_brand | UNDEAD | baseline | 711.31 | 709.31 | -0.28 | -2.01 ± 8.42 | 0 | 5 |
| demo_shadow_brand | UNDEAD | sp_250 | 538.59 | 536.60 | -0.37 | -1.99 ± 6.14 | 0 | 5 |
| demo_shadow_brand | UNDEAD | sp_1000 | 1056.75 | 1054.71 | -0.19 | -2.04 ± 13.02 | 0 | 5 |
| demo_shadow_brand | UNDEAD | int_0 | 671.14 | 668.71 | -0.36 | -2.42 ± 7.88 | 0 | 5 |
| demo_shadow_brand | UNDEAD | int_400 | 749.95 | 754.26 | 0.57 | 4.31 ± 9.23 | 0 | 5 |
| demo_shadow_brand | UNDEAD | hit_0 | 611.38 | 630.98 | 3.21 | 19.60 ± 10.09 | 0 | 5 |
| demo_shadow_brand | UNDEAD | hit_5 | 658.32 | 669.60 | 1.71 | 11.29 ± 9.45 | 0 | 5 |
| demo_shadow_brand | UNDEAD | hit_16 | 738.62 | 739.99 | 0.19 | 1.38 ± 8.73 | 0 | 5 |
| demo_shadow_brand | UNDEAD | crit_0 | 625.56 | 624.98 | -0.09 | -0.59 ± 5.44 | 0 | 5 |
| demo_shadow_brand | UNDEAD | crit_30 | 794.87 | 795.23 | 0.05 | 0.36 ± 9.70 | 0 | 5 |
| demo_shadow_brand | UNDEAD | regen_low | 687.48 | 686.43 | -0.15 | -1.05 ± 8.22 | 0 | 5 |
| demo_shadow_brand | UNDEAD | regen_high | 734.28 | 740.52 | 0.85 | 6.24 ± 8.47 | 0 | 5 |
| demo_shadow_brand | TROLL | baseline | 703.76 | 709.27 | 0.78 | 5.51 ± 7.87 | 0 | 5 |
| demo_shadow_brand | TROLL | sp_250 | 531.49 | 534.88 | 0.64 | 3.39 ± 5.75 | 0 | 5 |
| demo_shadow_brand | TROLL | sp_1000 | 1048.32 | 1058.06 | 0.93 | 9.75 ± 12.14 | 0 | 5 |
| demo_shadow_brand | TROLL | int_0 | 668.12 | 666.55 | -0.23 | -1.57 ± 8.27 | 0 | 5 |
| demo_shadow_brand | TROLL | int_400 | 744.60 | 748.88 | 0.57 | 4.27 ± 9.29 | 0 | 5 |
| demo_shadow_brand | TROLL | hit_0 | 608.86 | 627.35 | 3.04 | 18.49 ± 10.42 | 0 | 5 |
| demo_shadow_brand | TROLL | hit_5 | 648.88 | 665.25 | 2.52 | 16.36 ± 9.10 | 0 | 5 |
| demo_shadow_brand | TROLL | hit_16 | 732.13 | 738.73 | 0.90 | 6.61 ± 7.96 | 0 | 5 |
| demo_shadow_brand | TROLL | crit_0 | 618.95 | 618.67 | -0.05 | -0.28 ± 5.32 | 0 | 5 |
| demo_shadow_brand | TROLL | crit_30 | 788.67 | 797.51 | 1.12 | 8.84 ± 9.29 | 0 | 5 |
| demo_shadow_brand | TROLL | regen_low | 682.31 | 683.45 | 0.17 | 1.15 ± 7.88 | 0 | 5 |
| demo_shadow_brand | TROLL | regen_high | 732.57 | 737.52 | 0.68 | 4.96 ± 8.56 | 0 | 5 |
| demo_shadow_brand | GNOME | baseline | 705.80 | 714.93 | 1.29 | 9.13 ± 8.99 | 0 | 5 |
| demo_shadow_brand | GNOME | sp_250 | 533.05 | 539.27 | 1.17 | 6.22 ± 6.56 | 0 | 5 |
| demo_shadow_brand | GNOME | sp_1000 | 1051.31 | 1066.26 | 1.42 | 14.95 ± 13.87 | 0 | 5 |
| demo_shadow_brand | GNOME | int_0 | 663.75 | 668.77 | 0.76 | 5.01 ± 6.81 | 0 | 5 |
| demo_shadow_brand | GNOME | int_400 | 751.20 | 765.67 | 1.93 | 14.47 ± 9.06 | 0 | 5 |
| demo_shadow_brand | GNOME | hit_0 | 610.96 | 633.29 | 3.65 | 22.33 ± 10.59 | 0 | 5 |
| demo_shadow_brand | GNOME | hit_5 | 650.18 | 673.64 | 3.61 | 23.46 ± 9.58 | 0 | 5 |
| demo_shadow_brand | GNOME | hit_16 | 730.94 | 743.95 | 1.78 | 13.01 ± 8.07 | 0 | 5 |
| demo_shadow_brand | GNOME | crit_0 | 619.01 | 625.49 | 1.05 | 6.48 ± 5.88 | 0 | 5 |
| demo_shadow_brand | GNOME | crit_30 | 795.08 | 803.51 | 1.06 | 8.44 ± 9.50 | 0 | 5 |
| demo_shadow_brand | GNOME | regen_low | 679.85 | 688.63 | 1.29 | 8.78 ± 8.37 | 0 | 5 |
| demo_shadow_brand | GNOME | regen_high | 734.60 | 746.80 | 1.66 | 12.19 ± 8.62 | 0 | 5 |
| demo_fire_brand | HUMAN | baseline | 754.56 | 754.03 | -0.07 | -0.53 ± 6.11 | 2 | 5 |
| demo_fire_brand | HUMAN | sp_250 | 571.93 | 570.54 | -0.24 | -1.38 ± 4.51 | 2 | 5 |
| demo_fire_brand | HUMAN | sp_1000 | 1119.83 | 1121.00 | 0.10 | 1.17 ± 9.35 | 2 | 5 |
| demo_fire_brand | HUMAN | int_0 | 718.43 | 713.11 | -0.74 | -5.32 ± 5.59 | 2 | 5 |
| demo_fire_brand | HUMAN | int_400 | 788.26 | 784.74 | -0.45 | -3.51 ± 6.41 | 2 | 5 |
| demo_fire_brand | HUMAN | hit_0 | 655.40 | 662.45 | 1.08 | 7.05 ± 8.15 | 2 | 5 |
| demo_fire_brand | HUMAN | hit_5 | 695.74 | 700.03 | 0.62 | 4.29 ± 7.14 | 2 | 5 |
| demo_fire_brand | HUMAN | hit_16 | 784.71 | 779.94 | -0.61 | -4.77 ± 5.46 | 2 | 5 |
| demo_fire_brand | HUMAN | crit_0 | 682.44 | 683.02 | 0.09 | 0.58 ± 4.69 | 2 | 5 |
| demo_fire_brand | HUMAN | crit_30 | 824.51 | 826.38 | 0.23 | 1.87 ± 6.60 | 2 | 5 |
| demo_fire_brand | HUMAN | regen_low | 730.54 | 729.75 | -0.11 | -0.80 ± 5.97 | 2 | 5 |
| demo_fire_brand | HUMAN | regen_high | 773.45 | 775.85 | 0.31 | 2.40 ± 5.91 | 2 | 5 |
| demo_fire_brand | ORC | baseline | 750.34 | 757.82 | 1.00 | 7.49 ± 6.32 | 2 | 5 |
| demo_fire_brand | ORC | sp_250 | 567.94 | 573.17 | 0.92 | 5.23 ± 4.67 | 2 | 5 |
| demo_fire_brand | ORC | sp_1000 | 1115.14 | 1127.14 | 1.08 | 12.00 ± 9.65 | 2 | 5 |
| demo_fire_brand | ORC | int_0 | 716.53 | 718.68 | 0.30 | 2.15 ± 6.02 | 2 | 5 |
| demo_fire_brand | ORC | int_400 | 794.56 | 792.63 | -0.24 | -1.93 ± 6.86 | 2 | 5 |
| demo_fire_brand | ORC | hit_0 | 650.56 | 667.03 | 2.53 | 16.47 ± 8.39 | 2 | 5 |
| demo_fire_brand | ORC | hit_5 | 697.03 | 703.37 | 0.91 | 6.34 ± 6.57 | 2 | 5 |
| demo_fire_brand | ORC | hit_16 | 778.77 | 792.07 | 1.71 | 13.30 ± 5.22 | 2 | 5 |
| demo_fire_brand | ORC | crit_0 | 679.46 | 687.63 | 1.20 | 8.17 ± 4.80 | 2 | 5 |
| demo_fire_brand | ORC | crit_30 | 823.50 | 832.17 | 1.05 | 8.67 ± 6.77 | 2 | 5 |
| demo_fire_brand | ORC | regen_low | 730.63 | 735.95 | 0.73 | 5.32 ± 6.03 | 2 | 5 |
| demo_fire_brand | ORC | regen_high | 769.96 | 782.90 | 1.68 | 12.94 ± 5.66 | 2 | 5 |
| demo_fire_brand | UNDEAD | baseline | 753.55 | 747.01 | -0.87 | -6.54 ± 6.35 | 2 | 5 |
| demo_fire_brand | UNDEAD | sp_250 | 573.30 | 567.49 | -1.01 | -5.81 ± 4.68 | 2 | 5 |
| demo_fire_brand | UNDEAD | sp_1000 | 1114.05 | 1106.05 | -0.72 | -8.00 ± 9.72 | 2 | 5 |
| demo_fire_brand | UNDEAD | int_0 | 714.50 | 709.60 | -0.69 | -4.90 ± 5.41 | 2 | 5 |
| demo_fire_brand | UNDEAD | int_400 | 786.65 | 780.18 | -0.82 | -6.47 ± 6.26 | 2 | 5 |
| demo_fire_brand | UNDEAD | hit_0 | 655.52 | 660.07 | 0.69 | 4.55 ± 7.55 | 2 | 5 |
| demo_fire_brand | UNDEAD | hit_5 | 695.72 | 694.02 | -0.24 | -1.69 ± 7.08 | 2 | 5 |
| demo_fire_brand | UNDEAD | hit_16 | 787.36 | 780.90 | -0.82 | -6.46 ± 5.21 | 2 | 5 |
| demo_fire_brand | UNDEAD | crit_0 | 680.97 | 676.04 | -0.72 | -4.93 ± 4.46 | 2 | 5 |
| demo_fire_brand | UNDEAD | crit_30 | 823.25 | 819.82 | -0.42 | -3.44 ± 7.51 | 2 | 5 |
| demo_fire_brand | UNDEAD | regen_low | 732.22 | 731.71 | -0.07 | -0.52 ± 6.08 | 2 | 5 |
| demo_fire_brand | UNDEAD | regen_high | 768.57 | 770.50 | 0.25 | 1.93 ± 5.79 | 2 | 5 |
| demo_fire_brand | TROLL | baseline | 748.11 | 746.04 | -0.28 | -2.07 ± 6.49 | 2 | 5 |
| demo_fire_brand | TROLL | sp_250 | 567.25 | 564.80 | -0.43 | -2.46 ± 4.81 | 2 | 5 |
| demo_fire_brand | TROLL | sp_1000 | 1109.83 | 1108.53 | -0.12 | -1.30 ± 9.88 | 2 | 5 |
| demo_fire_brand | TROLL | int_0 | 711.56 | 708.37 | -0.45 | -3.20 ± 5.42 | 2 | 5 |
| demo_fire_brand | TROLL | int_400 | 778.04 | 776.20 | -0.24 | -1.85 ± 6.23 | 2 | 5 |
| demo_fire_brand | TROLL | hit_0 | 649.83 | 658.99 | 1.41 | 9.17 ± 8.01 | 2 | 5 |
| demo_fire_brand | TROLL | hit_5 | 690.34 | 690.73 | 0.06 | 0.39 ± 6.96 | 2 | 5 |
| demo_fire_brand | TROLL | hit_16 | 779.72 | 775.17 | -0.58 | -4.55 ± 4.83 | 2 | 5 |
| demo_fire_brand | TROLL | crit_0 | 675.46 | 674.60 | -0.13 | -0.85 ± 4.81 | 2 | 5 |
| demo_fire_brand | TROLL | crit_30 | 820.70 | 817.43 | -0.40 | -3.27 ± 7.22 | 2 | 5 |
| demo_fire_brand | TROLL | regen_low | 723.06 | 722.93 | -0.02 | -0.13 ± 5.70 | 2 | 5 |
| demo_fire_brand | TROLL | regen_high | 769.27 | 768.51 | -0.10 | -0.76 ± 5.80 | 2 | 5 |
| demo_fire_brand | GNOME | baseline | 746.68 | 749.91 | 0.43 | 3.24 ± 5.91 | 2 | 5 |
| demo_fire_brand | GNOME | sp_250 | 565.94 | 567.59 | 0.29 | 1.65 ± 4.38 | 2 | 5 |
| demo_fire_brand | GNOME | sp_1000 | 1108.16 | 1114.57 | 0.58 | 6.41 ± 9.00 | 2 | 5 |
| demo_fire_brand | GNOME | int_0 | 713.13 | 710.40 | -0.38 | -2.72 ± 5.58 | 2 | 5 |
| demo_fire_brand | GNOME | int_400 | 775.94 | 783.26 | 0.94 | 7.33 ± 5.74 | 2 | 5 |
| demo_fire_brand | GNOME | hit_0 | 648.90 | 662.98 | 2.17 | 14.08 ± 7.68 | 2 | 5 |
| demo_fire_brand | GNOME | hit_5 | 691.85 | 699.04 | 1.04 | 7.19 ± 7.53 | 2 | 5 |
| demo_fire_brand | GNOME | hit_16 | 774.35 | 773.91 | -0.06 | -0.43 ± 5.06 | 2 | 5 |
| demo_fire_brand | GNOME | crit_0 | 674.88 | 677.50 | 0.39 | 2.62 ± 4.45 | 2 | 5 |
| demo_fire_brand | GNOME | crit_30 | 818.00 | 821.01 | 0.37 | 3.01 ± 6.52 | 2 | 5 |
| demo_fire_brand | GNOME | regen_low | 730.82 | 726.82 | -0.55 | -4.00 ± 6.14 | 2 | 5 |
| demo_fire_brand | GNOME | regen_high | 772.33 | 769.39 | -0.38 | -2.94 ± 6.21 | 2 | 5 |

The JSON companion includes exact requests, resolved app configs, source/app hashes, input differences, import diagnostics, and spell/pet breakdowns. Existing five-preset benchmark artifacts are unchanged.
