# Full-default difference investigation

Nightfin Soup 13931 is 22 SP in Forever; our mapping uses 8 MP5. Brilliant Wizard Oil needs an equipped weapon, absent in all five defaults; our mapping always adds 36 SP and 1% crit.

complete; 10,000 fights per build and variant, seed 101. Saved Forever reference means are reused. Production imports and mechanics are unchanged. Each ablation runs the same GPU lanes as the baseline, including across batch boundaries.

| Build | Baseline error DPS | Food corrected | Oil corrected | Both corrected | Both error % |
| --- | ---: | ---: | ---: | ---: | ---: |
| sm_ruin | 5.308 | 16.653 | -18.084 | -6.791 | -1.942% |
| aff_wrack | 5.380 | 16.052 | -15.487 | -4.944 | -1.551% |
| destro | 5.877 | 16.612 | -16.601 | -5.899 | -1.604% |
| demo_shadow_brand | 8.571 | 19.498 | -14.804 | -3.884 | -0.965% |
| demo_fire_brand | 6.899 | 18.862 | -17.020 | -5.123 | -1.211% |

| Variant | MAE DPS | MAPE |
| --- | ---: | ---: |
| baseline | 6.407 | 1.713% |
| food_only | 17.535 | 4.723% |
| oil_only | 16.399 | 4.449% |
| all_stat_corrections | 5.328 | 1.454% |

## Largest remaining spell differences after both stat corrections

| Build | Spell | Forever DPS | Our DPS | Delta DPS | Forever casts | Our casts |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| sm_ruin | Shadow Bolt | 131.123 | 126.274 | -4.849 | 39.905 | 38.656 |
| sm_ruin | Bane of Doom | 38.787 | 36.907 | -1.880 | 2.087 | 2.000 |
| sm_ruin | Bane of Agony | 17.985 | 19.244 | 1.259 | 3.152 | 3.389 |
| sm_ruin | Corruption | 50.342 | 49.803 | -0.539 | 10.495 | 10.345 |
| sm_ruin | Succubus melee | 42.520 | 41.995 | -0.525 | 90.000 | 90.011 |
| sm_ruin | Immolate | 37.776 | 37.327 | -0.449 | 10.301 | 10.243 |
| sm_ruin | Succubus Lash of Pain | 4.833 | 5.159 | 0.327 | 15.000 | 16.000 |
| aff_wrack | Wrack | 29.752 | 27.095 | -2.658 | 8.547 | 7.945 |
| aff_wrack | Shadow Bolt | 74.346 | 73.624 | -0.722 | 22.809 | 22.596 |
| aff_wrack | Succubus melee | 42.564 | 42.049 | -0.515 | 90.000 | 90.011 |
| aff_wrack | Corruption | 48.863 | 48.355 | -0.508 | 10.238 | 10.205 |
| aff_wrack | Immolate | 35.421 | 34.944 | -0.476 | 9.630 | 9.535 |
| aff_wrack | Bane of Agony | 58.242 | 57.883 | -0.359 | 8.963 | 8.887 |
| aff_wrack | Succubus Lash of Pain | 4.845 | 5.178 | 0.333 | 15.000 | 16.000 |
| destro | Incinerate | 98.647 | 95.427 | -3.220 | 34.118 | 32.984 |
| destro | Bane of Doom | 33.587 | 32.776 | -0.811 | 2.033 | 2.000 |
| destro | Conflagrate | 46.977 | 46.333 | -0.644 | 15.235 | 15.116 |
| destro | Shadowburn | 24.455 | 24.002 | -0.453 | 9.858 | 9.710 |
| destro | Immolate | 53.579 | 53.132 | -0.446 | 11.472 | 11.392 |
| destro | Corruption | 42.397 | 42.041 | -0.356 | 10.184 | 10.159 |
| destro | Succubus Lash of Pain | 5.239 | 5.574 | 0.334 | 15.000 | 16.000 |
| demo_shadow_brand | Shadow Bolt | 103.613 | 101.731 | -1.882 | 26.389 | 25.901 |
| demo_shadow_brand | Soul Fire | 22.210 | 21.325 | -0.885 | 5.282 | 5.055 |
| demo_shadow_brand | Succubus Lash of Pain | 11.116 | 11.866 | 0.750 | 15.000 | 16.000 |
| demo_shadow_brand | Corruption | 46.559 | 45.833 | -0.726 | 9.076 | 8.898 |
| demo_shadow_brand | Bane of Doom | 40.796 | 40.379 | -0.417 | 2.002 | 2.000 |
| demo_shadow_brand | Immolate | 44.548 | 44.225 | -0.323 | 11.482 | 11.347 |
| demo_shadow_brand | Bane of Agony | 16.647 | 16.443 | -0.204 | 3.472 | 3.424 |
| demo_fire_brand | Ez-Thro Dynamite II | 5.062 | 3.910 | -1.152 | 3.000 | 3.000 |
| demo_fire_brand | Soul Fire | 31.297 | 30.213 | -1.084 | 5.855 | 5.601 |
| demo_fire_brand | Immolate | 67.482 | 66.440 | -1.042 | 11.735 | 11.554 |
| demo_fire_brand | Searing Pain | 123.410 | 122.444 | -0.966 | 63.549 | 62.598 |
| demo_fire_brand | Imp Firebolt | 71.854 | 72.616 | 0.763 | 90.000 | 89.989 |
| demo_fire_brand | Corruption | 37.663 | 37.064 | -0.600 | 9.470 | 9.304 |
| demo_fire_brand | Imp Demonic Brand | 41.712 | 41.199 | -0.512 | 0.000 | 72.274 |
