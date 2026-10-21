# Fresh comparison of full Forever warlock defaults

complete: 5/5 builds. 10,000 fights per build per engine, seed 101, detailed GPU mode.

Forever revision: `86d0920cae8445eaa90de9c17c3583cf171c19c5`. Reference simulations were rerun for this report; no historical DPS targets were reused.

Original five default builds, including all buffs and consumables, no equipment, 20 yards. Missing encounter supplied as 180 seconds, level 63, armor 3731, zero resistance, fixed execute phases.

The benchmark preserves source settings and measures the current ordinary import. It does not adjust stats or rotations to close differences. Same seeds do not pair the engines’ RNG streams. The intervals below describe independent-engine Monte Carlo error, not model accuracy.

| Build | Forever DPS | Our DPS | Ours − Forever | Error % | Delta 95% ±DPS |
| --- | ---: | ---: | ---: | ---: | ---: |
| sm_ruin | 349.77 | 349.20 | -0.57 | -0.16% | 0.59 |
| aff_wrack | 318.82 | 318.14 | -0.68 | -0.21% | 0.37 |
| destro | 367.82 | 367.31 | -0.50 | -0.14% | 0.47 |
| demo_shadow_brand | 402.35 | 401.88 | -0.46 | -0.12% | 0.61 |
| demo_fire_brand | 423.01 | 423.52 | 0.51 | 0.12% | 0.51 |

MAE across the five build means: **0.546 DPS**. Mean absolute percentage error (MAPE): **0.150%**.

MAE = mean(abs(our mean DPS − Forever mean DPS)); MAPE = mean(abs(delta) / Forever mean DPS × 100). Builds are weighted equally.

## Resolved input differences

These are observed differences between our imported config and Forever’s initial combat stats after reset. They are retained in the measurement rather than corrected. They can explain part of the measured error.

| Build | Stat | Forever | Ours |
| --- | --- | ---: | ---: |

## Damage contributions

| Build | Actor | Forever DPS | Our DPS |
| --- | --- | ---: | ---: |
| sm_ruin | player | 302.41 | 301.85 |
| sm_ruin | pet | 47.35 | 47.35 |
| aff_wrack | player | 271.41 | 270.74 |
| aff_wrack | pet | 47.41 | 47.40 |
| destro | player | 316.91 | 316.43 |
| destro | pet | 50.90 | 50.89 |
| demo_shadow_brand | player | 304.96 | 304.93 |
| demo_shadow_brand | pet | 97.38 | 96.95 |
| demo_fire_brand | player | 309.45 | 310.10 |
| demo_fire_brand | pet | 113.57 | 113.42 |

The JSON companion records requests, source builds, complete reference results, ComputeStats output, resolved configs, spell/resource summaries, shader renderer, source hashes, and compatibility IDs. Enemy damage alone is scored; Demonic Rune self damage is excluded. The existing simulator does not model player health limits or incoming damage; Demon Armor and rune health loss therefore do not affect our DPS.

Reproduce with a prepared Forever checkout (generated Go protobuf files and matching Go toolchain):

```sh
node scripts/benchmark_forever_defaults.mjs --checkout /path/to/forever --go /path/to/go --iterations 10000 --seed 101
```
