# Causes of the full-default Forever differences

All five original defaults retain their buffs, consumables, race, talents, demons and 20-yard distance. They contain no equipment. The reference is Forever revision `86d0920cae8445eaa90de9c17c3583cf171c19c5`. The saved comparison and each diagnostic variant use 10,000 fights per build, seed 101, 180 seconds. No production import, combat or packing code was changed during this investigation.

## Production implementation

The fixes below have now been applied to the production importer, buff resolver and shared combat shader. Imp Firebolt uses a full cast-time damage snapshot and delayed impact, rather than the diagnostic end-of-fight guard. The fresh [production comparison](FOREVER_FULL_DEFAULTS_PRODUCTION.md) measures **0.546 DPS MAE / 0.150% MAPE**, versus the original 6.407 DPS / 1.713%. Full missile timing also moves on-hit procs and their RNG draws, so its result differs from the narrow diagnostic guard. The remaining residual has not been fully attributed.

The investigation results below describe the original production baseline and diagnostic variants.

## Confirmed causes

1. **Nightfin Soup is mapped to the wrong effect.** Forever item 13931 grants 22 spell power through Nutritious Food/Well Fed; our buff resolver grants 8 MP5 instead. The flask correctly grants 150 spell power in both engines. Evidence: `../forever/assets/database/db.json` (consumable 13931), spell 1249513, and `threejs_webgl_des/src/classes/warlock_import_buffs.js`.
2. **Weapon oil is applied without a weapon.** These default exports have empty equipment. Forever’s `Consumable.TakesItem` skips a temporary enchant when the slot’s item ID is zero; our import applies 36 spell power and 1% crit regardless. Combined with the missing food spell power, this produces exactly the observed +14 spell power, +8 MP5 and +1 percentage point of crit. Evidence: `../forever/sim/core/consumes_imbues.go` and the buff resolver.
3. **Judgement of Wisdom eligibility differs.** Forever’s landed applications of Corruption, Agony, Doom, Siphon Life and Wrack are direct spell outcomes with ProcMaskSpellDamage. Our shader only tries JoW in direct damage handlers, missing those applications. Conversely, our dynamite damage handler tries JoW even though Forever registers explosives with ProcMaskEmpty. Evidence: `../forever/sim/core/buffs/paladin.go`, the warlock spell registrations, and `../forever/sim/common/shared/shared_utils.go:damageShape`.
4. **Dynamite occupies extra player time.** Forever’s APL cooldown dispatcher specifically throws explosives during an existing GCD. Our `decide()` throws before the next action and blocks it for a second. Three throws can displace several seconds of player casts. The isolated scheduling experiment recovers roughly 3.4–4.8 DPS depending on build. Evidence: `../forever/sim/core/apl_actions_casting.go:APLActionAutocastOtherCooldowns.IsReady` and `threejs_webgl_des/src/kernel.js:decide`.
5. **Explosive damage omits general Fire multipliers.** Our dynamite calculation only includes the assigned curse. Forever also applies generic damage/school auras, including Soul Link, Master Demonologist, Demonic Sacrifice and the Shadow and Flame Fire buff where relevant. This is most visible for Fire Brand. These are distinct from class-spell-only modifiers, which should not be applied to explosives.
6. **Succubus Lash starts before moving into range.** Forever’s pet begins at the player’s 20-yard distance and first casts Lash after approaching to five yards (1.875 s at 8 yd/s). Our first Lash is scheduled at zero. In these runs ours casts 16 times and Forever 15, also affecting Demonic Brand triggers. Evidence: `../forever/sim/warlock/pets.go:ExecuteCustomRotation`, `../forever/sim/core/movement.go`, and the trace excerpts.
7. **Gift of Arthas has the wrong multiplier order.** Forever adds the flat physical damage taken after attacker modifiers and armor, before the outcome. Our pet melee formula puts the extra 8 damage inside `petMeleeMult`, incorrectly scaling it with attacker modifiers and armor. Evidence: `../forever/sim/core/spell_result.go:calcDamageInternal/applyTargetModifiers` and the shader’s Succubus melee handler.
8. **Imp Firebolt is counted before its missile arrives.** Forever uses a 16 yd/s missile. Our Imp handler deals damage when its two-second cast completes. At 20 yards a last cast can be counted even though its missile would arrive after the encounter. A narrow diagnostic guard excluding those late arrivals reduces the remaining Fire Brand difference from +1.097 DPS to -0.164 DPS. This guard measures the end-of-fight effect only; it is not a complete projectile implementation.

## Controlled results

Errors partly cancel: correcting only food/oil changes the positive production bias into a negative bias. Do not interpret a small baseline total error as validation of those individual mechanics.

| Stage | MAE DPS | Mean absolute percentage error |
| --- | ---: | ---: |
| Original production baseline | 6.407 | 1.713% |
| Food/oil stat corrections only | 5.328 | 1.454% |
| Add missing JoW applications and explosive scheduling | 0.751 | 0.197% |
| Refine proc eligibility, pet approach, Arthas ordering and explosive damage | 0.663 | 0.178% |
| Also exclude Imp missiles arriving after encounter end | 0.476 | 0.133% |

| Build | Current error DPS | Final diagnostic error DPS | Final error % | Delta 95% ±DPS |
| --- | ---: | ---: | ---: | ---: |
| sm_ruin | 5.308 | -0.570 | -0.163% | 0.586 |
| aff_wrack | 5.380 | -0.678 | -0.213% | 0.373 |
| destro | 5.877 | -0.505 | -0.137% | 0.474 |
| demo_shadow_brand | 8.571 | -0.465 | -0.115% | 0.607 |
| demo_fire_brand | 6.899 | -0.164 | -0.039% | 0.507 |

MAE is equally weighted across the five build means. Delta intervals use independent-engine standard errors. Equal seeds do not pair the engines’ random streams. The residual roughly 0.48 DPS / 0.13% has not been fully attributed; these diagnostics do not establish exact mechanics parity. Non-Imp builds reuse their refined measurements for the last guard, whose Imp-only branch is unreachable.

Additional source-level discrepancy observed but not isolated here: the generic player travel time is calculated at 24 yd/s, while Forever’s Shadow Bolt and Incinerate rows state 20 yd/s. Soul Fire’s 24 yd/s matches. This is a candidate for a follow-up distance-specific audit, not an established explanation of the remaining residual.

## Artifacts

- [Original full-default benchmark](FOREVER_FULL_DEFAULTS_BENCHMARK.md)
- [Food/oil ablations](FOREVER_FULL_DEFAULTS_INVESTIGATION.md)
- [Runtime ablations](FOREVER_FULL_DEFAULTS_RUNTIME_INVESTIGATION.md)
- [Source trace excerpts](FOREVER_FULL_DEFAULTS_TRACE_EVIDENCE.json)
- Scripts: `scripts/investigate_forever_full_defaults.mjs` and `scripts/investigate_forever_full_runtime.mjs`. The latter resumes cached variants only when their shader hashes match.
- JSON companions retain configurations, per-spell contributions, resource totals, and diagnostic shader hashes.

## Production validation

- All five defaults pass ordinary import and logical/resolved roundtrip checks, plus detailed/fast GPU execution and targeted mechanic regressions.
- Existing Forever pet, resource and Eureka APL suites pass (9 tests). Bridge, groups, racials, regret and service-worker checks pass. Detailed, fast and regret shaders compile in the browser.
- The broader contract/roundtrip checks retain two failures reproduced with unchanged HEAD sources: deferred gear roundtrip and the legacy Life Tap gain expectation. Their distance rejection assertion was updated for the supported continuous 0–120-yard range.
- The existing pet-swap execution check also fails with unchanged HEAD sources; the baseline shader has no pet-swap implementation. This work does not add that separate feature.
- `git diff --check` passes. The fresh production benchmark verifies its measured source hashes remain unchanged throughout the run.
