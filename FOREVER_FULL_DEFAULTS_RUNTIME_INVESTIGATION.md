# Full-default runtime investigation

complete. 10,000 fights per build and variant, seed 101. All variants include the food/oil stat corrections, applied only to diagnostic configs. Production code is unchanged.

JoW: allow the landed applications of Corruption, Bane of Agony, Bane of Doom, Siphon Life and Wrack to proc Judgement of Wisdom, matching Forever’s ProcMaskSpellDamage application outcomes. Explosives: throw during an existing GCD after an instant spell, as Forever’s APL cooldown dispatcher does, rather than delaying the next spell.

| Build | Stats only error DPS | +JoW | +Explosive timing | Both | Both error % | Both delta 95% ±DPS | Refined error DPS | Refined error % | Imp end guard DPS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| sm_ruin | -6.791 | -5.581 | -1.977 | -0.582 | -0.167% | 0.587 | -0.570 | -0.163% | -0.570 |
| aff_wrack | -4.944 | -3.834 | -1.557 | -0.330 | -0.104% | 0.370 | -0.678 | -0.213% | -0.678 |
| destro | -5.899 | -4.955 | -1.417 | -0.697 | -0.190% | 0.475 | -0.505 | -0.137% | -0.505 |
| demo_shadow_brand | -3.884 | -3.189 | 0.960 | 1.551 | 0.385% | 0.605 | -0.465 | -0.115% | -0.465 |
| demo_fire_brand | -5.123 | -3.939 | -0.645 | 0.593 | 0.140% | 0.504 | 1.097 | 0.259% | -0.164 |

| Variant | MAE DPS | MAPE |
| --- | ---: | ---: |
| stats_only | 5.328 | 1.454% |
| jow | 4.300 | 1.174% |
| explosive | 1.311 | 0.366% |
| both | 0.751 | 0.197% |
| refined | 0.663 | 0.178% |
| imp_end_guard | 0.476 | 0.133% |

Refined adds exact JoW eligibility (no explosive procs), the initial pet approach before Lash of Pain, Gift of Arthas after armor/attacker modifiers, and generic Fire damage multipliers on explosives. Each change follows the inspected Forever source; no constants were fitted to DPS. The extra Imp end-guard variant only excludes Firebolt impacts whose 16 yd/s missile would arrive after the encounter. It is a narrow timing diagnostic, not a complete projectile implementation; builds without an Imp reuse the identical refined results.

## Judgement of Wisdom mana per fight

| Build | Forever | JoW corrected | Both runtime corrections | Refined |
| --- | ---: | ---: | ---: | ---: |
| sm_ruin | 1872.88 | 1936.71 | 1960.03 | 1882.38 |
| aff_wrack | 1721.74 | 1787.35 | 1813.30 | 1730.80 |
| destro | 2226.75 | 2278.59 | 2310.29 | 2234.37 |
| demo_shadow_brand | 1851.38 | 1901.68 | 1926.39 | 1852.48 |
| demo_fire_brand | 2375.96 | 2425.32 | 2457.18 | 2381.18 |

The diagnostic shader records actual player JoW mana in the otherwise unused Curse of Elements periodic-damage counter. This counter is cleared before normal spell aggregation. The baseline source results and production shader hashes are checked before the run. Same seeds do not pair RNG streams between engines; uncertainty is estimated for independent means.
