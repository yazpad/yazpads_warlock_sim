# Gear-free diagnostic DPS comparison

1,000 iterations per preset **in each engine**, seed 101, 180 seconds. Our shader uses **detailed/slow mode** for counters and damage splits. Explicit bonus stats, empty equipment and no external buffs/consumables.

**Diagnostic results, not accepted parity.** Normal imports are evaluated as implemented, with known APL gaps and Fire Brand initial-state differences. No configuration values were adjusted to close the DPS gap.

Intervals are approximate 95% confidence intervals for the means. Delta uncertainty uses independent-engine standard errors; equal seeds do not imply paired random outcomes. These intervals describe Monte Carlo uncertainty, not uncertainty from missing features or formulas.

| Preset | Forever DPS ±95% CI | Our WebGL DPS ±95% CI | Ours − Forever | Delta % | Delta ±95% CI |
| --- | ---: | ---: | ---: | ---: | ---: |
| sm_ruin | 655.99 ± 2.07 | 596.38 ± 1.87 | -59.61 | -9.09% | ±2.79 |
| aff_wrack | 562.24 ± 1.28 | 505.72 ± 1.12 | -56.52 | -10.05% | ±1.70 |
| destro | 635.03 ± 1.41 | 609.19 ± 1.32 | -25.84 | -4.07% | ±1.93 |
| demo_shadow_brand | 710.60 ± 2.05 | 661.26 ± 1.81 | -49.34 | -6.94% | ±2.73 |
| demo_fire_brand | 748.41 ± 1.44 | 665.21 ± 1.22 | -83.20 | -11.12% | ±1.89 |

## Pet damage contributions

| Preset | Forever pet DPS | Our pet DPS |
| --- | ---: | ---: |
| sm_ruin | 43.91 | 39.75 |
| aff_wrack | 43.50 | 41.46 |
| destro | 46.50 | 42.03 |
| demo_shadow_brand | 130.85 | 105.31 |
| demo_fire_brand | 180.06 | 130.12 |

## sm_ruin: spell and pet breakdown

Each pair is **Forever / ours**, averaged per fight. Landed events include crits and ticks; misses are failed applications/attacks. Resisted-hit counters are subsets and are not added again. Damage is inclusive; crit and periodic damage are subsets, not additional damage.

| Action | DPS F / O | Δ DPS | Casts F / O | Landed F / O | Crits F / O | Ticks F / O | Misses F / O |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Bane of Doom | 84.08 / 66.74 | -17.34 | 2.26 / 2.00 | 2.26 / 2.00 | 0.66 / 0.56 | 2.26 / 2.00 | 0.00 / 0.00 |
| Shadow Bolt | 299.06 / 284.27 | -14.79 | 40.90 / 43.34 | 40.90 / 43.24 | 11.80 / 12.28 | 0.00 / 0.00 | 0.00 / 0.00 |
| Siphon Life | 35.42 / 25.03 | -10.39 | 6.00 / 6.00 | 55.66 / 55.63 | 16.07 / 0.00 | 55.66 / 55.63 | 0.00 / 0.00 |
| Corruption | 96.50 / 87.72 | -8.78 | 9.32 / 9.63 | 53.71 / 53.91 | 15.46 / 15.54 | 53.71 / 53.91 | 0.00 / 0.00 |
| Immolate | 63.46 / 58.30 | -5.16 | 9.05 / 9.07 | 53.13 / 53.70 | 12.67 / 12.89 | 44.08 / 44.63 | 0.00 / 0.00 |
| Succubus melee | 36.12 / 32.95 | -3.17 | 90.01 / 90.00 | 84.16 / 77.00 | 17.03 / 23.86 | 0.00 / 0.00 | 5.85 / 13.00 |
| Bane of Agony | 33.56 / 34.57 | 1.01 | 2.28 / 3.00 | 19.87 / 26.92 | 5.66 / 7.61 | 19.87 / 26.92 | 0.00 / 0.00 |
| Succubus Lash of Pain | 7.79 / 6.81 | -0.98 | 16.00 / 15.00 | 16.00 / 15.00 | 3.86 / 4.31 | 0.00 / 0.00 | 0.00 / 0.00 |
| Life Tap | 0.00 / 0.00 | 0.00 | 23.09 / 19.79 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| Amplify Curse | 0.00 / 0.00 | 0.00 | 0.81 / 1.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| Assigned curse | 0.00 / — | 0.00 | 1.00 / — | 0.00 / — | 0.00 / — | 0.00 / — | 0.00 / — |

### Damage components

| Action | Direct DPS F / O | Periodic DPS F / O | Damage/landed event F / O |
| --- | ---: | ---: | ---: |
| Bane of Doom | 0.00 / 0.00 | 84.08 / 66.74 | 6693.80 / 6006.36 |
| Shadow Bolt | 299.06 / 284.27 | 0.00 / 0.00 | 1316.18 / 1183.37 |
| Siphon Life | 0.00 / 0.00 | 35.42 / 25.03 | 114.55 / 80.98 |
| Corruption | 0.00 / 0.00 | 96.50 / 87.72 | 323.39 / 292.91 |
| Immolate | 19.41 / 17.70 | 44.05 / 40.60 | 215.00 / 195.42 |
| Succubus melee | 36.12 / 32.95 | 0.00 / 0.00 | 77.25 / 77.02 |
| Bane of Agony | 0.00 / 0.00 | 33.56 / 34.57 | 303.94 / 231.14 |
| Succubus Lash of Pain | 7.79 / 6.81 | 0.00 / 0.00 | 87.58 / 81.69 |

### Mana accounting

| Metric per fight | Forever | Ours |
| --- | ---: | ---: |
| manaSpent | 23809.48 | 24634.10 |
| manaGained | 18724.31 | 19760.60 |
| manaActualGain | 18724.31 | 19760.60 |
| manaWasted | 0.00 | 0.00 |
| manaEnd | — | 869.50 |
| lifeTaps | 23.09 | 19.79 |

Damage reconciliation error per fight: Forever 0.000000, ours -0.048230. All damage sources are retained, including source-only actions.

JSON also contains periodic crit counts/damage, per-action source identities, glances, source resource/aura metrics, our aura uptimes and proc totals. A dash denotes an absent/unavailable counterpart; it is not a measured zero. Pet critical damage is not separately collected on our side; Brand crit count is zero under the current implementation. Amplify Curse counts our automatic activations, which need not have identical action semantics to the source APL.

## aff_wrack: spell and pet breakdown

Each pair is **Forever / ours**, averaged per fight. Landed events include crits and ticks; misses are failed applications/attacks. Resisted-hit counters are subsets and are not added again. Damage is inclusive; crit and periodic damage are subsets, not additional damage.

| Action | DPS F / O | Δ DPS | Casts F / O | Landed F / O | Crits F / O | Ticks F / O | Misses F / O |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Bane of Agony | 115.42 / 96.20 | -19.22 | 7.98 / 8.00 | 86.11 / 85.71 | 23.82 / 23.80 | 86.11 / 85.71 | 0.00 / 0.00 |
| Shadow Bolt | 150.17 / 140.88 | -9.29 | 21.80 / 22.80 | 21.80 / 22.72 | 6.03 / 6.20 | 0.00 / 0.00 | 0.00 / 0.00 |
| Siphon Life | 32.38 / 23.35 | -9.02 | 5.92 / 5.99 | 53.23 / 53.89 | 14.69 / 0.00 | 53.23 / 53.89 | 0.00 / 0.00 |
| Corruption | 90.37 / 81.45 | -8.92 | 9.01 / 9.00 | 51.88 / 51.52 | 14.30 / 14.26 | 51.88 / 51.52 | 0.00 / 0.00 |
| Wrack | 69.65 / 63.83 | -5.82 | 8.71 / 8.63 | 50.60 / 50.39 | 14.19 / 14.04 | 50.60 / 50.39 | 0.00 / 0.00 |
| Immolate | 60.76 / 58.56 | -2.21 | 8.94 / 9.43 | 51.01 / 53.92 | 11.49 / 12.31 | 42.06 / 44.49 | 0.00 / 0.00 |
| Succubus melee | 35.75 / 34.33 | -1.42 | 90.01 / 90.00 | 84.16 / 76.92 | 16.05 / 23.16 | 0.00 / 0.00 | 5.85 / 13.08 |
| Succubus Lash of Pain | 7.74 / 7.13 | -0.62 | 16.00 / 15.00 | 16.00 / 15.00 | 3.61 / 4.20 | 0.00 / 0.00 | 0.00 / 0.00 |
| Life Tap | 0.00 / 0.00 | 0.00 | 18.37 / 16.39 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| Amplify Curse | 0.00 / 0.00 | 0.00 | 1.00 / 1.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| Blood Fury | 0.00 / 0.00 | 0.00 | 1.10 / 1.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| Assigned curse | 0.00 / — | 0.00 | 1.00 / — | 0.00 / — | 0.00 / — | 0.00 / — | 0.00 / — |

### Damage components

| Action | Direct DPS F / O | Periodic DPS F / O | Damage/landed event F / O |
| --- | ---: | ---: | ---: |
| Bane of Agony | 0.00 / 0.00 | 115.42 / 96.20 | 241.27 / 202.04 |
| Shadow Bolt | 150.17 / 140.88 | 0.00 / 0.00 | 1239.95 / 1116.35 |
| Siphon Life | 0.00 / 0.00 | 32.38 / 23.35 | 109.47 / 78.00 |
| Corruption | 0.00 / 0.00 | 90.37 / 81.45 | 313.55 / 284.57 |
| Wrack | 0.00 / 0.00 | 69.65 / 63.83 | 247.76 / 227.99 |
| Immolate | 19.08 / 18.28 | 41.68 / 40.27 | 214.43 / 195.47 |
| Succubus melee | 35.75 / 34.33 | 0.00 / 0.00 | 76.46 / 80.33 |
| Succubus Lash of Pain | 7.74 / 7.13 | 0.00 / 0.00 | 87.12 / 85.51 |

### Mana accounting

| Metric per fight | Forever | Ours |
| --- | ---: | ---: |
| manaSpent | 20563.13 | 21281.06 |
| manaGained | 15354.74 | 16351.41 |
| manaActualGain | 15354.74 | 16351.41 |
| manaWasted | 0.00 | 0.00 |
| manaEnd | — | 768.35 |
| lifeTaps | 18.37 | 16.39 |

Damage reconciliation error per fight: Forever 0.000000, ours -0.041716. All damage sources are retained, including source-only actions.

JSON also contains periodic crit counts/damage, per-action source identities, glances, source resource/aura metrics, our aura uptimes and proc totals. A dash denotes an absent/unavailable counterpart; it is not a measured zero. Pet critical damage is not separately collected on our side; Brand crit count is zero under the current implementation. Amplify Curse counts our automatic activations, which need not have identical action semantics to the source APL.

## destro: spell and pet breakdown

Each pair is **Forever / ours**, averaged per fight. Landed events include crits and ticks; misses are failed applications/attacks. Resisted-hit counters are subsets and are not added again. Damage is inclusive; crit and periodic damage are subsets, not additional damage.

| Action | DPS F / O | Δ DPS | Casts F / O | Landed F / O | Crits F / O | Ticks F / O | Misses F / O |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Incinerate | 216.23 / 198.79 | -17.45 | 35.00 / 35.00 | 35.00 / 35.00 | 7.70 / 7.55 | 0.00 / 0.00 | 0.00 / 0.00 |
| Corruption | 74.99 / 69.65 | -5.34 | 9.00 / 9.00 | 50.00 / 51.00 | 10.83 / 11.15 | 50.00 / 51.00 | 0.00 / 0.00 |
| Conflagrate | 80.67 / 84.12 | 3.45 | 15.00 / 16.00 | 15.00 / 16.00 | 6.97 / 7.58 | 0.00 / 0.00 | 0.00 / 0.00 |
| Succubus melee | 38.20 / 34.88 | -3.32 | 90.01 / 90.00 | 84.16 / 76.91 | 15.18 / 22.13 | 0.00 / 0.00 | 5.85 / 13.09 |
| Bane of Doom | 61.33 / 58.19 | -3.13 | 2.00 / 2.00 | 2.00 / 2.00 | 0.44 / 0.42 | 2.00 / 2.00 | 0.00 / 0.00 |
| Bane of Agony | 24.37 / 26.93 | 2.56 | 3.00 / 3.00 | 27.00 / 27.00 | 5.97 / 5.69 | 27.00 / 27.00 | 0.00 / 0.00 |
| Immolate | 86.46 / 83.97 | -2.49 | 10.00 / 11.00 | 58.00 / 62.00 | 12.72 / 13.53 | 48.00 / 51.00 | 0.00 / 0.00 |
| Succubus Lash of Pain | 8.30 / 7.15 | -1.16 | 16.00 / 15.00 | 16.00 / 15.00 | 3.41 / 3.35 | 0.00 / 0.00 | 0.00 / 0.00 |
| Shadowburn | 44.48 / 45.51 | 1.03 | 10.00 / 11.00 | 10.00 / 11.00 | 2.21 / 2.43 | 0.00 / 0.00 | 0.00 / 0.00 |
| Life Tap | 0.00 / 0.00 | 0.00 | 24.00 / 22.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| Amplify Curse | — / 0.00 | 0.00 | — / 1.00 | — / 0.00 | — / 0.00 | — / 0.00 | — / 0.00 |
| Eureka! | 0.00 / 0.00 | 0.00 | 2.00 / 2.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| Assigned curse | 0.00 / — | 0.00 | 1.00 / — | 0.00 / — | 0.00 / — | 0.00 / — | 0.00 / — |

### Damage components

| Action | Direct DPS F / O | Periodic DPS F / O | Damage/landed event F / O |
| --- | ---: | ---: | ---: |
| Incinerate | 216.23 / 198.79 | 0.00 / 0.00 | 1112.06 / 1022.33 |
| Corruption | 0.00 / 0.00 | 74.99 / 69.65 | 269.97 / 245.83 |
| Conflagrate | 80.67 / 84.12 | 0.00 / 0.00 | 968.05 / 946.36 |
| Succubus melee | 38.20 / 34.88 | 0.00 / 0.00 | 81.69 / 81.63 |
| Bane of Doom | 0.00 / 0.00 | 61.33 / 58.19 | 5519.41 / 5237.45 |
| Bane of Agony | 0.00 / 0.00 | 24.37 / 26.93 | 162.45 / 179.54 |
| Immolate | 34.80 / 33.71 | 51.66 / 50.25 | 268.32 / 243.78 |
| Succubus Lash of Pain | 8.30 / 7.15 | 0.00 / 0.00 | 93.39 / 85.74 |
| Shadowburn | 44.48 / 45.51 | 0.00 / 0.00 | 800.62 / 744.74 |

### Mana accounting

| Metric per fight | Forever | Ours |
| --- | ---: | ---: |
| manaSpent | 24777.05 | 26469.45 |
| manaGained | 19123.20 | 21628.80 |
| manaActualGain | 19123.20 | 21628.80 |
| manaWasted | 0.00 | 0.00 |
| manaEnd | — | 1236.75 |
| lifeTaps | 24.00 | 22.00 |

Damage reconciliation error per fight: Forever 0.000000, ours -0.087771. All damage sources are retained, including source-only actions.

JSON also contains periodic crit counts/damage, per-action source identities, glances, source resource/aura metrics, our aura uptimes and proc totals. A dash denotes an absent/unavailable counterpart; it is not a measured zero. Pet critical damage is not separately collected on our side; Brand crit count is zero under the current implementation. Amplify Curse counts our automatic activations, which need not have identical action semantics to the source APL.

## demo_shadow_brand: spell and pet breakdown

Each pair is **Forever / ours**, averaged per fight. Landed events include crits and ticks; misses are failed applications/attacks. Resisted-hit counters are subsets and are not added again. Damage is inclusive; crit and periodic damage are subsets, not additional damage.

| Action | DPS F / O | Δ DPS | Casts F / O | Landed F / O | Crits F / O | Ticks F / O | Misses F / O |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Succubus Demonic Brand | 72.60 / 56.83 | -15.77 | 0.00 / 0.00 | 77.43 / 74.49 | 18.34 / 0.00 | 0.00 / 0.00 | 3.31 / 0.00 |
| Succubus Lash of Pain | 16.85 / 10.50 | -6.36 | 16.00 / 15.00 | 15.34 / 14.39 | 3.68 / 3.41 | 0.00 / 0.00 | 0.66 / 0.61 |
| Immolate | 74.70 / 68.50 | -6.20 | 10.34 / 10.40 | 57.26 / 57.55 | 13.76 / 13.82 | 47.34 / 47.56 | 0.41 / 0.41 |
| Searing Pain | 49.97 / 44.12 | -5.85 | 15.55 / 14.95 | 14.91 / 14.36 | 5.04 / 4.86 | 0.00 / 0.00 | 0.63 / 0.59 |
| Corruption | 83.79 / 78.42 | -5.37 | 8.28 / 8.43 | 46.45 / 47.55 | 11.13 / 11.35 | 46.45 / 47.55 | 0.33 / 0.32 |
| Succubus melee | 41.40 / 37.99 | -3.41 | 90.01 / 90.00 | 84.16 / 77.03 | 17.03 / 24.15 | 0.00 / 0.00 | 5.85 / 12.97 |
| Bane of Doom | 73.39 / 70.14 | -3.24 | 2.00 / 2.08 | 1.92 / 2.00 | 0.47 / 0.46 | 1.92 / 2.00 | 0.09 / 0.08 |
| Soul Fire | 43.61 / 41.56 | -2.05 | 5.33 / 5.59 | 5.11 / 5.35 | 1.19 / 1.26 | 0.00 / 0.00 | 0.21 / 0.24 |
| Bane of Agony | 27.55 / 26.27 | -1.28 | 2.94 / 3.12 | 24.88 / 26.12 | 5.83 / 6.25 | 24.88 / 26.12 | 0.10 / 0.13 |
| Shadow Bolt | 226.74 / 226.93 | 0.20 | 27.14 / 29.78 | 26.05 / 28.57 | 6.10 / 6.78 | 0.00 / 0.00 | 1.09 / 1.21 |
| Life Tap | 0.00 / 0.00 | 0.00 | 25.02 / 21.37 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| Assigned curse | 0.00 / — | 0.00 | 1.04 / — | 0.00 / — | 0.00 / — | 0.00 / — | 0.04 / — |

### Damage components

| Action | Direct DPS F / O | Periodic DPS F / O | Damage/landed event F / O |
| --- | ---: | ---: | ---: |
| Succubus Demonic Brand | 72.60 / 56.83 | 0.00 / 0.00 | 168.77 / 137.31 |
| Succubus Lash of Pain | 16.85 / 10.50 | 0.00 / 0.00 | 197.72 / 131.30 |
| Immolate | 22.70 / 21.03 | 52.00 / 47.46 | 234.81 / 214.22 |
| Searing Pain | 49.97 / 44.12 | 0.00 / 0.00 | 603.16 / 552.96 |
| Corruption | 0.00 / 0.00 | 83.79 / 78.42 | 324.74 / 296.86 |
| Succubus melee | 41.40 / 37.99 | 0.00 / 0.00 | 88.54 / 88.77 |
| Bane of Doom | 0.00 / 0.00 | 73.39 / 70.14 | 6890.89 / 6312.92 |
| Soul Fire | 43.61 / 41.56 | 0.00 / 0.00 | 1534.86 / 1398.97 |
| Bane of Agony | 0.00 / 0.00 | 27.55 / 26.27 | 199.36 / 181.04 |
| Shadow Bolt | 226.74 / 226.93 | 0.00 / 0.00 | 1566.95 / 1429.80 |

### Mana accounting

| Metric per fight | Forever | Ours |
| --- | ---: | ---: |
| manaSpent | 22891.86 | 23815.37 |
| manaGained | 16964.97 | 17844.07 |
| manaActualGain | 16964.97 | 17844.07 |
| manaWasted | 0.00 | 0.00 |
| manaEnd | — | 633.15 |
| lifeTaps | 25.02 | 21.37 |

Damage reconciliation error per fight: Forever -0.000000, ours 0.058844. All damage sources are retained, including source-only actions.

JSON also contains periodic crit counts/damage, per-action source identities, glances, source resource/aura metrics, our aura uptimes and proc totals. A dash denotes an absent/unavailable counterpart; it is not a measured zero. Pet critical damage is not separately collected on our side; Brand crit count is zero under the current implementation. Amplify Curse counts our automatic activations, which need not have identical action semantics to the source APL.

## demo_fire_brand: spell and pet breakdown

Each pair is **Forever / ours**, averaged per fight. Landed events include crits and ticks; misses are failed applications/attacks. Resisted-hit counters are subsets and are not added again. Damage is inclusive; crit and periodic damage are subsets, not additional damage.

| Action | DPS F / O | Δ DPS | Casts F / O | Landed F / O | Crits F / O | Ticks F / O | Misses F / O |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Imp Firebolt | 105.05 / 65.82 | -39.22 | 90.00 / 90.00 | 86.32 / 86.38 | 20.38 / 20.76 | 0.00 / 0.00 | 3.68 / 3.62 |
| Searing Pain | 254.49 / 243.73 | -10.76 | 62.70 / 65.77 | 60.18 / 63.11 | 20.38 / 21.45 | 0.00 / 0.00 | 2.52 / 2.66 |
| Imp Demonic Brand | 75.01 / 64.29 | -10.72 | 0.00 / 0.00 | 79.98 / 84.28 | 19.01 / 0.00 | 0.00 / 0.00 | 3.37 / 0.00 |
| Immolate | 111.40 / 103.12 | -8.28 | 10.43 / 10.96 | 59.02 / 60.14 | 13.93 / 14.24 | 49.01 / 49.62 | 0.43 / 0.44 |
| Soul Fire | 63.80 / 56.76 | -7.04 | 6.13 / 5.97 | 5.89 / 5.74 | 1.40 / 1.40 | 0.00 / 0.00 | 0.24 / 0.23 |
| Corruption | 63.27 / 59.85 | -3.42 | 8.32 / 9.06 | 47.63 / 49.54 | 11.27 / 11.78 | 47.63 / 49.54 | 0.32 / 0.35 |
| Bane of Doom | 53.66 / 51.09 | -2.58 | 2.00 / 2.07 | 1.92 / 2.00 | 0.44 / 0.48 | 1.92 / 2.00 | 0.08 / 0.07 |
| Bane of Agony | 21.73 / 20.55 | -1.18 | 3.12 / 3.12 | 25.97 / 27.26 | 6.23 / 6.50 | 25.97 / 27.26 | 0.13 / 0.13 |
| Life Tap | 0.00 / 0.00 | 0.00 | 21.61 / 18.88 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 | 0.00 / 0.00 |
| Assigned curse | 0.00 / — | 0.00 | 1.04 / — | 0.00 / — | 0.00 / — | 0.00 / — | 0.04 / — |

### Damage components

| Action | Direct DPS F / O | Periodic DPS F / O | Damage/landed event F / O |
| --- | ---: | ---: | ---: |
| Imp Firebolt | 105.05 / 65.82 | 0.00 / 0.00 | 219.04 / 137.17 |
| Searing Pain | 254.49 / 243.73 | 0.00 / 0.00 | 761.20 / 695.17 |
| Imp Demonic Brand | 75.01 / 64.29 | 0.00 / 0.00 | 168.83 / 137.32 |
| Immolate | 43.64 / 40.66 | 67.76 / 62.46 | 339.76 / 308.64 |
| Soul Fire | 63.80 / 56.76 | 0.00 / 0.00 | 1949.66 / 1780.83 |
| Corruption | 0.00 / 0.00 | 63.27 / 59.85 | 239.09 / 217.46 |
| Bane of Doom | 0.00 / 0.00 | 53.66 / 51.09 | 5025.68 / 4597.74 |
| Bane of Agony | 0.00 / 0.00 | 21.73 / 20.55 | 150.60 / 135.70 |

### Mana accounting

| Metric per fight | Forever | Ours |
| --- | ---: | ---: |
| manaSpent | 20859.37 | 21586.64 |
| manaGained | 14745.06 | 15844.85 |
| manaActualGain | 14745.06 | 15844.85 |
| manaWasted | 0.00 | 0.00 |
| manaEnd | — | 862.66 |
| lifeTaps | 21.61 | 18.88 |

Damage reconciliation error per fight: Forever 0.000000, ours 0.098703. All damage sources are retained, including source-only actions.

JSON also contains periodic crit counts/damage, per-action source identities, glances, source resource/aura metrics, our aura uptimes and proc totals. A dash denotes an absent/unavailable counterpart; it is not a measured zero. Pet critical damage is not separately collected on our side; Brand crit count is zero under the current implementation. Amplify Curse counts our automatic activations, which need not have identical action semantics to the source APL.

## Effect of replacing the 20-iteration reference

| Preset | Old 20-trial Forever DPS | New Forever DPS |
| --- | ---: | ---: |
| sm_ruin | 659.64 | 655.99 |
| aff_wrack | 562.68 | 562.24 |
| destro | 633.91 | 635.03 |
| demo_shadow_brand | 706.54 | 710.60 |
| demo_fire_brand | 745.06 | 748.41 |

Renderer: AMD Ryzen 9 9950X 16-Core Processor (radeonsi, raphael_mendocino, LLVM 20.1.2, DRM 3.64, 7.0.0-38-generic). Actual GLSL ES shaders run through headless EGL; this is not a browser integration or performance measurement. All shader lanes completed successfully.

The JSON companion records sample standard deviations, counts, configs, exact requests, hashes, captured source provenance, source action metrics and blockers. Source requests are checked against the canonical captures; only iteration count and seed may differ.

Reproduce:

```sh
node scripts/benchmark_forever_gear_free.mjs /path/to/forever go 1000 101
```
