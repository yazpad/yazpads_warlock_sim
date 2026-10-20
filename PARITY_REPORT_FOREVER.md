# Forever gear-free parity status

See the [saved diagnostic combat comparison](FOREVER_GEAR_FREE_BENCHMARK.md) for high-iteration Forever versus WebGL results, confidence intervals and recorded code provenance. The values below describe the input-capture fixtures.

All active cases use `gear-free-coe-v2`: empty equipment, explicit bonus stats above racial/class bases, external CoE only, no other external buffs or consumables. Preset races, talents, pets and source rotations are retained.

The live reference results below use 20 iterations and seed 101. They establish distinct source scenarios; they are not accepted cross-engine DPS parity measurements. Input/feature blockers must be cleared before combat scoring.

| Preset | Race | Forever reference DPS | Input status | Blockers |
| --- | --- | ---: | --- | ---: |
| destro | RaceGnome | 640.2425 | blocked | 1 |
| sm_ruin | RaceHuman | 658.8214 | blocked | 1 |
| aff_wrack | RaceOrc | 558.3901 | blocked | 1 |
| demo_shadow_brand | RaceHuman | 710.6580 | blocked | 1 |
| demo_fire_brand | RaceHuman | 745.3840 | blocked | 4 |

## destro

[Full input comparison](FOREVER_INPUT_COMPARISON_destro.md)

- Named groups, assigned curse actions and complete APL semantics are not yet preserved (see FOREVER_IMPORT_AUDIT.md)

## sm_ruin

[Full input comparison](FOREVER_INPUT_COMPARISON_sm_ruin.md)

- Named groups, assigned curse actions and complete APL semantics are not yet preserved (see FOREVER_IMPORT_AUDIT.md)

## aff_wrack

[Full input comparison](FOREVER_INPUT_COMPARISON_aff_wrack.md)

- Named groups, assigned curse actions and complete APL semantics are not yet preserved (see FOREVER_IMPORT_AUDIT.md)

## demo_shadow_brand

[Full input comparison](FOREVER_INPUT_COMPARISON_demo_shadow_brand.md)

- Named groups, assigned curse actions and complete APL semantics are not yet preserved (see FOREVER_IMPORT_AUDIT.md)

## demo_fire_brand

[Full input comparison](FOREVER_INPUT_COMPARISON_demo_fire_brand.md)

- stamina: normal import 285, Forever 339 (delta -54)
- maxHealth: normal import 4084, Forever 4624 (delta -540)
- Shader maxHealth: 4084, Forever 4624 (delta -540)
- Named groups, assigned curse actions and complete APL semantics are not yet preserved (see FOREVER_IMPORT_AUDIT.md)

Geared and legacy snapshots are archived under `fixtures/geared_forever` and `fixtures/legacy_forever`. Their DPS targets are not reused. Gear integration is deferred.
