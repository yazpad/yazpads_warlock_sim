# Gear-free diagnostic DPS comparison

Forever revision: `86d0920cae8445eaa90de9c17c3583cf171c19c5`. This run includes the upstream Amplify consumption fix and our explicit Amplify APL action/Agony spell-power snapshot.

1,000 iterations per preset **in each engine**, seed 101, 180 seconds. Our shader uses **detailed/slow mode** for counters and damage splits. Explicit bonus stats, empty equipment and external CoE only; no other external buffs/consumables.

**Diagnostic results, not accepted parity.** Normal imports are evaluated as implemented, with known APL gaps and Fire Brand initial-state differences. No configuration values were adjusted to close the DPS gap.

Intervals are approximate 95% confidence intervals for the means. Delta uncertainty uses independent-engine standard errors; equal seeds do not imply paired random outcomes. These intervals describe Monte Carlo uncertainty, not uncertainty from missing features or formulas.

| Preset | Forever DPS ±95% CI | Our WebGL DPS ±95% CI | Ours − Forever | Delta % | Delta ±95% CI |
| --- | ---: | ---: | ---: | ---: | ---: |
| sm_ruin | 653.96 ± 2.12 | 645.30 ± 2.00 | -8.66 | -1.32% | ±2.92 |
| aff_wrack | 558.98 ± 1.22 | 550.63 ± 1.16 | -8.35 | -1.49% | ±1.68 |
| destro | 637.71 ± 1.43 | 643.23 ± 1.43 | 5.52 | 0.87% | ±2.02 |
| demo_shadow_brand | 715.71 ± 2.04 | 719.70 ± 1.98 | 3.99 | 0.56% | ±2.84 |
| demo_fire_brand | 752.84 ± 1.41 | 747.81 ± 1.32 | -5.03 | -0.67% | ±1.93 |

## Pet damage contributions

| Preset | Forever pet DPS | Our pet DPS |
| --- | ---: | ---: |
| sm_ruin | 43.94 | 42.24 |
| aff_wrack | 43.55 | 43.97 |
| destro | 46.58 | 44.61 |
| demo_shadow_brand | 131.17 | 127.35 |
| demo_fire_brand | 182.63 | 176.72 |

## sm_ruin: spell and pet breakdown

Each pair is **Forever / ours**, averaged per fight. Landed events include crits and ticks; misses are failed applications/attacks. Resisted-hit counters are subsets and are not added again. Damage is inclusive; crit and periodic damage are subsets, not additional damage.

| Action | DPS F / O | Δ DPS | Casts F / O | Landed F / O | Crits F / O | Ticks F / O | Misses F / O |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Shadow Bolt | 301.17 / 296.92 | -4.25 | 41.22 / 41.10 | 41.22 / 41.00 | 11.88 / 11.83 | 0.00 / 0.00 | 0.00 / 0.00 |
| Succubus melee | 36.12 / 34.74 | -1.38 | 90.01 / 90.00 | 84.16 / 84.15 | 17.03 / 21.45 | 0.00 / 0.00 | 5.85 / 5.85 |
| Bane of Agony | 38.68 / 37.40 | -1.27 | 3.00 / 3.00 | 27.09 / 26.28 | 7.85 / 7.69 | 27.09 / 26.28 | 0.00 / 0.00 |
| Corruption | 96.72 / 96.05 | -0.68 | 9.57 / 9.55 | 53.76 / 53.74 | 15.52 / 15.56 | 53.76 / 53.74 | 0.00 / 0.00 |
| Siphon Life | 35.73 / 35.15 | -0.58 | 6.00 / 6.00 | 56.14 / 55.34 | 16.04 / 15.89 | 56.14 / 55.34 | 0.00 / 0.00 |
| Immolate | 64.07 / 63.65 | -0.42 | 9.09 / 9.08 | 53.62 / 53.38 | 12.84 / 12.65 | 44.53 / 44.30 | 0.00 / 0.00 |
| Succubus Lash of Pain | 7.82 / 7.49 | -0.33 | 16.00 / 15.00 | 16.00 / 15.00 | 3.81 / 4.33 | 0.00 / 0.00 | 0.00 / 0.00 |
| Bane of Doom | 73.64 / 73.88 | 0.24 | 2.00 / 2.00 | 2.00 / 2.00 | 0.57 / 0.58 | 2.00 / 2.00 | 0.00 / 0.00 |
| Life Tap | 0.00 / 0.00 | 0.00 | 23.06 / 23.04 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| Amplify Curse | 0.00 / 0.00 | 0.00 | 1.00 / 1.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |

### Damage components

| Action | Direct DPS F / O | Periodic DPS F / O | Damage/landed event F / O |
| --- | ---: | ---: | ---: |
| Shadow Bolt | 301.17 / 296.92 | 0.00 / 0.00 | 1315.26 / 1303.67 |
| Succubus melee | 36.12 / 34.74 | 0.00 / 0.00 | 77.25 / 74.31 |
| Bane of Agony | 0.00 / 0.00 | 38.68 / 37.40 | 257.04 / 256.19 |
| Corruption | 0.00 / 0.00 | 96.72 / 96.05 | 323.86 / 321.73 |
| Siphon Life | 0.00 / 0.00 | 35.73 / 35.15 | 114.56 / 114.33 |
| Immolate | 19.56 / 19.41 | 44.51 / 44.24 | 215.10 / 214.64 |
| Succubus Lash of Pain | 7.82 / 7.49 | 0.00 / 0.00 | 87.96 / 89.92 |
| Bane of Doom | 0.00 / 0.00 | 73.64 / 73.88 | 6627.82 / 6649.56 |

### Mana accounting

| Metric per fight | Forever | Ours |
| --- | ---: | ---: |
| manaSpent | 23892.09 | 23840.15 |
| manaGained | 18716.53 | 18657.33 |
| manaActualGain | 18716.53 | 18657.33 |
| manaWasted | 0.00 | 0.00 |
| manaEnd | — | 560.18 |
| lifeTaps | 23.06 | 23.04 |

Damage reconciliation error per fight: Forever 0.000000, ours 0.006888. All damage sources are retained, including source-only actions.

JSON also contains periodic crit counts/damage, per-action source identities, glances, source resource/aura metrics, our aura uptimes and proc totals. A dash denotes an absent/unavailable counterpart; it is not a measured zero. Pet critical damage is not separately collected on our side; Brand independent cast/hit/crit/miss counts are collected. Amplify Curse counts our automatic activations, which need not have identical action semantics to the source APL.

## aff_wrack: spell and pet breakdown

Each pair is **Forever / ours**, averaged per fight. Landed events include crits and ticks; misses are failed applications/attacks. Resisted-hit counters are subsets and are not added again. Damage is inclusive; crit and periodic damage are subsets, not additional damage.

| Action | DPS F / O | Δ DPS | Casts F / O | Landed F / O | Crits F / O | Ticks F / O | Misses F / O |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Wrack | 70.56 / 65.83 | -4.73 | 8.92 / 8.26 | 52.33 / 47.69 | 14.45 / 13.20 | 52.33 / 47.69 | 0.00 / 0.00 |
| Bane of Agony | 108.36 / 104.81 | -3.55 | 7.96 / 7.98 | 85.75 / 84.53 | 23.64 / 23.46 | 85.75 / 84.53 | 0.00 / 0.00 |
| Corruption | 91.16 / 88.41 | -2.75 | 9.01 / 9.01 | 52.27 / 50.95 | 14.32 / 14.08 | 52.27 / 50.95 | 0.00 / 0.00 |
| Shadow Bolt | 151.12 / 152.80 | 1.67 | 21.83 / 22.32 | 21.83 / 22.29 | 6.12 / 6.20 | 0.00 / 0.00 | 0.00 / 0.00 |
| Siphon Life | 32.07 / 32.60 | 0.54 | 5.86 / 5.98 | 52.60 / 53.46 | 14.55 / 15.00 | 52.60 / 53.46 | 0.00 / 0.00 |
| Succubus melee | 35.75 / 36.15 | 0.39 | 90.01 / 90.00 | 84.16 / 84.20 | 16.05 / 20.42 | 0.00 / 0.00 | 5.85 / 5.80 |
| Immolate | 62.17 / 62.22 | 0.05 | 9.07 / 8.98 | 52.06 / 52.19 | 11.89 / 11.92 | 42.99 / 43.21 | 0.00 / 0.00 |
| Succubus Lash of Pain | 7.80 / 7.82 | 0.02 | 16.00 / 15.00 | 16.00 / 15.00 | 3.68 / 4.14 | 0.00 / 0.00 | 0.00 / 0.00 |
| Life Tap | 0.00 / 0.00 | 0.00 | 18.21 / 19.44 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| Amplify Curse | 0.00 / 0.00 | 0.00 | 1.01 / 1.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| Blood Fury | 0.00 / 0.00 | 0.00 | 1.11 / 1.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |

### Damage components

| Action | Direct DPS F / O | Periodic DPS F / O | Damage/landed event F / O |
| --- | ---: | ---: | ---: |
| Wrack | 0.00 / 0.00 | 70.56 / 65.83 | 242.70 / 248.46 |
| Bane of Agony | 0.00 / 0.00 | 108.36 / 104.81 | 227.47 / 223.17 |
| Corruption | 0.00 / 0.00 | 91.16 / 88.41 | 313.88 / 312.37 |
| Shadow Bolt | 151.12 / 152.80 | 0.00 / 0.00 | 1246.10 / 1233.79 |
| Siphon Life | 0.00 / 0.00 | 32.07 / 32.60 | 109.73 / 109.78 |
| Succubus melee | 35.75 / 36.15 | 0.00 / 0.00 | 76.46 / 77.27 |
| Immolate | 19.51 / 19.27 | 42.66 / 42.94 | 214.94 / 214.58 |
| Succubus Lash of Pain | 7.80 / 7.82 | 0.00 / 0.00 | 87.79 / 93.89 |

### Mana accounting

| Metric per fight | Forever | Ours |
| --- | ---: | ---: |
| manaSpent | 20438.98 | 20840.56 |
| manaGained | 15250.73 | 15685.95 |
| manaActualGain | 15250.73 | 15685.95 |
| manaWasted | 0.00 | 0.00 |
| manaEnd | — | 543.39 |
| lifeTaps | 18.21 | 19.44 |

Damage reconciliation error per fight: Forever 0.000000, ours 0.029970. All damage sources are retained, including source-only actions.

JSON also contains periodic crit counts/damage, per-action source identities, glances, source resource/aura metrics, our aura uptimes and proc totals. A dash denotes an absent/unavailable counterpart; it is not a measured zero. Pet critical damage is not separately collected on our side; Brand independent cast/hit/crit/miss counts are collected. Amplify Curse counts our automatic activations, which need not have identical action semantics to the source APL.

## destro: spell and pet breakdown

Each pair is **Forever / ours**, averaged per fight. Landed events include crits and ticks; misses are failed applications/attacks. Resisted-hit counters are subsets and are not added again. Damage is inclusive; crit and periodic damage are subsets, not additional damage.

| Action | DPS F / O | Δ DPS | Casts F / O | Landed F / O | Crits F / O | Ticks F / O | Misses F / O |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Conflagrate | 85.80 / 90.86 | 5.07 | 16.00 / 16.00 | 16.00 / 16.00 | 7.52 / 7.42 | 0.00 / 0.00 | 0.00 / 0.00 |
| Incinerate | 212.37 / 207.39 | -4.99 | 34.00 / 33.00 | 34.00 / 33.00 | 7.50 / 7.29 | 0.00 / 0.00 | 0.00 / 0.00 |
| Immolate | 87.21 / 91.66 | 4.44 | 10.00 / 11.00 | 59.00 / 61.00 | 12.79 / 13.21 | 49.00 / 50.00 | 0.00 / 0.00 |
| Bane of Doom | 61.08 / 64.02 | 2.94 | 2.00 / 2.00 | 2.00 / 2.00 | 0.43 / 0.42 | 2.00 / 2.00 | 0.00 / 0.00 |
| Succubus melee | 38.20 / 36.77 | -1.42 | 90.01 / 90.00 | 84.16 / 84.11 | 15.18 / 19.58 | 0.00 / 0.00 | 5.85 / 5.89 |
| Bane of Agony | 25.11 / 24.27 | -0.84 | 3.00 / 3.00 | 28.00 / 27.00 | 6.20 / 5.85 | 28.00 / 27.00 | 0.00 / 0.00 |
| Shadowburn | 44.60 / 45.24 | 0.64 | 10.00 / 10.00 | 10.00 / 10.00 | 2.24 / 2.23 | 0.00 / 0.00 | 0.00 / 0.00 |
| Succubus Lash of Pain | 8.38 / 7.84 | -0.55 | 16.00 / 15.00 | 16.00 / 15.00 | 3.56 / 3.25 | 0.00 / 0.00 | 0.00 / 0.00 |
| Corruption | 74.95 / 75.19 | 0.24 | 9.00 / 9.00 | 50.00 / 50.00 | 10.80 / 10.99 | 50.00 / 50.00 | 0.00 / 0.00 |
| Life Tap | 0.00 / 0.00 | 0.00 | 24.00 / 25.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| Eureka! | 0.00 / 0.00 | 0.00 | 2.00 / 2.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |

### Damage components

| Action | Direct DPS F / O | Periodic DPS F / O | Damage/landed event F / O |
| --- | ---: | ---: | ---: |
| Conflagrate | 85.80 / 90.86 | 0.00 / 0.00 | 965.20 / 1022.21 |
| Incinerate | 212.37 / 207.39 | 0.00 / 0.00 | 1124.33 / 1131.20 |
| Immolate | 34.79 / 37.39 | 52.42 / 54.26 | 266.08 / 270.46 |
| Bane of Doom | 0.00 / 0.00 | 61.08 / 64.02 | 5496.77 / 5761.43 |
| Succubus melee | 38.20 / 36.77 | 0.00 / 0.00 | 81.69 / 78.69 |
| Bane of Agony | 0.00 / 0.00 | 25.11 / 24.27 | 161.45 / 161.82 |
| Shadowburn | 44.60 / 45.24 | 0.00 / 0.00 | 802.80 / 814.24 |
| Succubus Lash of Pain | 8.38 / 7.84 | 0.00 / 0.00 | 94.31 / 94.05 |
| Corruption | 0.00 / 0.00 | 74.95 / 75.19 | 269.83 / 270.67 |

### Mana accounting

| Metric per fight | Forever | Ours |
| --- | ---: | ---: |
| manaSpent | 24537.00 | 25524.45 |
| manaGained | 19123.20 | 19870.00 |
| manaActualGain | 19123.20 | 19870.00 |
| manaWasted | 0.00 | 0.00 |
| manaEnd | — | 422.95 |
| lifeTaps | 24.00 | 25.00 |

Damage reconciliation error per fight: Forever 0.000000, ours -0.089650. All damage sources are retained, including source-only actions.

JSON also contains periodic crit counts/damage, per-action source identities, glances, source resource/aura metrics, our aura uptimes and proc totals. A dash denotes an absent/unavailable counterpart; it is not a measured zero. Pet critical damage is not separately collected on our side; Brand independent cast/hit/crit/miss counts are collected. Amplify Curse counts our automatic activations, which need not have identical action semantics to the source APL.

## demo_shadow_brand: spell and pet breakdown

Each pair is **Forever / ours**, averaged per fight. Landed events include crits and ticks; misses are failed applications/attacks. Resisted-hit counters are subsets and are not added again. Damage is inclusive; crit and periodic damage are subsets, not additional damage.

| Action | DPS F / O | Δ DPS | Casts F / O | Landed F / O | Crits F / O | Ticks F / O | Misses F / O |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Bane of Doom | 71.93 / 76.60 | 4.67 | 2.00 / 2.08 | 1.92 / 2.00 | 0.41 / 0.49 | 1.92 / 2.00 | 0.08 / 0.08 |
| Soul Fire | 44.47 / 46.33 | 1.85 | 5.41 / 5.61 | 5.18 / 5.38 | 1.25 / 1.32 | 0.00 / 0.00 | 0.24 / 0.23 |
| Succubus Lash of Pain | 17.05 / 15.21 | -1.85 | 16.00 / 15.00 | 15.41 / 14.42 | 3.76 / 3.45 | 0.00 / 0.00 | 0.59 / 0.58 |
| Corruption | 84.06 / 85.82 | 1.75 | 8.30 / 8.34 | 46.53 / 47.43 | 11.17 / 11.27 | 46.53 / 47.43 | 0.35 / 0.33 |
| Succubus melee | 41.40 / 39.84 | -1.56 | 90.01 / 90.00 | 84.16 / 84.25 | 17.03 / 21.29 | 0.00 / 0.00 | 5.85 / 5.75 |
| Searing Pain | 50.11 / 48.56 | -1.54 | 15.57 / 14.97 | 14.93 / 14.40 | 4.96 / 4.83 | 0.00 / 0.00 | 0.64 / 0.57 |
| Shadow Bolt | 231.34 / 232.36 | 1.02 | 27.61 / 27.69 | 26.45 / 26.61 | 6.32 / 6.31 | 0.00 / 0.00 | 1.16 / 1.08 |
| Succubus Demonic Brand | 72.72 / 72.31 | -0.41 | 0.00 / 80.23 | 77.44 / 77.05 | 18.42 / 18.22 | 0.00 / 0.00 | 3.27 / 3.18 |
| Immolate | 74.30 / 74.45 | 0.15 | 10.38 / 10.42 | 56.83 / 56.73 | 13.45 / 13.60 | 46.90 / 46.75 | 0.44 / 0.44 |
| Bane of Agony | 28.33 / 28.23 | -0.09 | 3.06 / 3.10 | 25.69 / 25.55 | 6.03 / 6.11 | 25.69 / 25.55 | 0.11 / 0.14 |
| Life Tap | 0.00 / 0.00 | 0.00 | 25.02 / 25.06 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |

### Damage components

| Action | Direct DPS F / O | Periodic DPS F / O | Damage/landed event F / O |
| --- | ---: | ---: | ---: |
| Bane of Doom | 0.00 / 0.00 | 71.93 / 76.60 | 6729.37 / 6893.70 |
| Soul Fire | 44.47 / 46.33 | 0.00 / 0.00 | 1546.57 / 1549.91 |
| Succubus Lash of Pain | 17.05 / 15.21 | 0.00 / 0.00 | 199.18 / 189.77 |
| Corruption | 0.00 / 0.00 | 84.06 / 85.82 | 325.19 / 325.71 |
| Succubus melee | 41.40 / 39.84 | 0.00 / 0.00 | 88.54 / 85.12 |
| Searing Pain | 50.11 / 48.56 | 0.00 / 0.00 | 604.22 / 607.05 |
| Shadow Bolt | 231.34 / 232.36 | 0.00 / 0.00 | 1574.47 / 1571.91 |
| Succubus Demonic Brand | 72.72 / 72.31 | 0.00 / 0.00 | 169.02 / 168.92 |
| Immolate | 22.99 / 23.20 | 51.31 / 51.25 | 235.33 / 236.24 |
| Bane of Agony | 0.00 / 0.00 | 28.33 / 28.23 | 198.49 / 198.87 |

### Mana accounting

| Metric per fight | Forever | Ours |
| --- | ---: | ---: |
| manaSpent | 22940.86 | 23000.34 |
| manaGained | 16966.94 | 16975.74 |
| manaActualGain | 16966.94 | 16975.74 |
| manaWasted | 0.00 | 0.00 |
| manaEnd | — | 579.85 |
| lifeTaps | 25.02 | 25.06 |

Damage reconciliation error per fight: Forever 0.000000, ours -0.003840. All damage sources are retained, including source-only actions.

JSON also contains periodic crit counts/damage, per-action source identities, glances, source resource/aura metrics, our aura uptimes and proc totals. A dash denotes an absent/unavailable counterpart; it is not a measured zero. Pet critical damage is not separately collected on our side; Brand independent cast/hit/crit/miss counts are collected. Amplify Curse counts our automatic activations, which need not have identical action semantics to the source APL.

## demo_fire_brand: spell and pet breakdown

Each pair is **Forever / ours**, averaged per fight. Landed events include crits and ticks; misses are failed applications/attacks. Resisted-hit counters are subsets and are not added again. Damage is inclusive; crit and periodic damage are subsets, not additional damage.

| Action | DPS F / O | Δ DPS | Casts F / O | Landed F / O | Crits F / O | Ticks F / O | Misses F / O |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Imp Firebolt | 106.66 / 101.32 | -5.34 | 90.00 / 90.00 | 86.36 / 86.39 | 20.66 / 20.67 | 0.00 / 0.00 | 3.63 / 3.60 |
| Immolate | 114.62 / 110.59 | -4.03 | 10.91 / 10.41 | 60.09 / 59.15 | 14.25 / 14.04 | 49.62 / 49.15 | 0.44 / 0.41 |
| Bane of Doom | 53.31 / 56.24 | 2.93 | 2.00 / 2.07 | 1.92 / 2.00 | 0.41 / 0.49 | 1.92 / 2.00 | 0.08 / 0.07 |
| Soul Fire | 58.64 / 55.91 | -2.73 | 5.64 / 5.37 | 5.42 / 5.16 | 1.28 / 1.23 | 0.00 / 0.00 | 0.22 / 0.21 |
| Searing Pain | 259.96 / 262.66 | 2.70 | 64.06 / 64.43 | 61.47 / 61.82 | 20.71 / 20.98 | 0.00 / 0.00 | 2.59 / 2.61 |
| Corruption | 62.35 / 63.84 | 1.48 | 8.41 / 8.87 | 46.94 / 48.02 | 11.11 / 11.44 | 46.94 / 48.02 | 0.32 / 0.36 |
| Imp Demonic Brand | 75.97 / 75.40 | -0.57 | 0.00 / 83.82 | 80.87 / 80.37 | 19.31 / 18.98 | 0.00 / 0.00 | 3.43 / 3.45 |
| Bane of Agony | 21.31 / 21.84 | 0.53 | 3.10 / 3.12 | 25.43 / 26.21 | 6.00 / 6.13 | 25.43 / 26.21 | 0.13 / 0.12 |
| Life Tap | 0.00 / 0.00 | 0.00 | 22.00 / 21.95 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |

### Damage components

| Action | Direct DPS F / O | Periodic DPS F / O | Damage/landed event F / O |
| --- | ---: | ---: | ---: |
| Imp Firebolt | 106.66 / 101.32 | 0.00 / 0.00 | 222.30 / 211.10 |
| Immolate | 45.89 / 42.50 | 68.73 / 68.09 | 343.35 / 336.56 |
| Bane of Doom | 0.00 / 0.00 | 53.31 / 56.24 | 4992.81 / 5062.02 |
| Soul Fire | 58.64 / 55.91 | 0.00 / 0.00 | 1946.10 / 1949.99 |
| Searing Pain | 259.96 / 262.66 | 0.00 / 0.00 | 761.23 / 764.75 |
| Corruption | 0.00 / 0.00 | 62.35 / 63.84 | 239.10 / 239.26 |
| Imp Demonic Brand | 75.97 / 75.40 | 0.00 / 0.00 | 169.09 / 168.88 |
| Bane of Agony | 0.00 / 0.00 | 21.31 / 21.84 | 150.90 / 150.00 |

### Mana accounting

| Metric per fight | Forever | Ours |
| --- | ---: | ---: |
| manaSpent | 20925.68 | 20886.64 |
| manaGained | 14999.45 | 14957.53 |
| manaActualGain | 14999.45 | 14957.53 |
| manaWasted | 0.00 | 0.00 |
| manaEnd | — | 675.35 |
| lifeTaps | 22.00 | 21.95 |

Damage reconciliation error per fight: Forever -0.000000, ours 0.094645. All damage sources are retained, including source-only actions.

JSON also contains periodic crit counts/damage, per-action source identities, glances, source resource/aura metrics, our aura uptimes and proc totals. A dash denotes an absent/unavailable counterpart; it is not a measured zero. Pet critical damage is not separately collected on our side; Brand independent cast/hit/crit/miss counts are collected. Amplify Curse counts our automatic activations, which need not have identical action semantics to the source APL.

## Effect of replacing the 20-iteration reference

| Preset | Old 20-trial Forever DPS | New Forever DPS |
| --- | ---: | ---: |
| sm_ruin | 658.82 | 653.96 |
| aff_wrack | 558.39 | 558.98 |
| destro | 640.24 | 637.71 |
| demo_shadow_brand | 710.66 | 715.71 |
| demo_fire_brand | 745.38 | 752.84 |

Renderer: AMD Ryzen 9 9950X 16-Core Processor (radeonsi, raphael_mendocino, LLVM 20.1.2, DRM 3.64, 7.0.0-38-generic). Actual GLSL ES shaders run through headless EGL; this is not a browser integration or performance measurement. All shader lanes completed successfully.

The JSON companion records sample standard deviations, counts, configs, exact requests, hashes, captured source provenance, source action metrics and blockers. Source requests are checked against the canonical captures; only iteration count and seed may differ.

Reproduce:

```sh
node scripts/benchmark_forever_gear_free.mjs /path/to/forever go 1000 101
```
