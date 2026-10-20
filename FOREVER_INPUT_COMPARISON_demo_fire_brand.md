# demo_fire_brand: gear-free input comparison

Forever revision: `86d0920cae8445eaa90de9c17c3583cf171c19c5`. Working tree: clean.

Exact generated case: `Settings-Human-gear-free-Fire Brand-demo_fire_brand-ExternalCoEOnly-0.0yards-LongSingleTarget`. Live reference: **745.3840483 DPS**, 20 iterations, seed 101.

**Status: blocked before combat comparison.** No hand-resolved configuration is substituted when ordinary import fails.

Scenario: **gear-free-coe-v2**. Empty equipment, external CoE only; no other external buffs or consumables. Declared bonus stats: `{"crit":15,"firePower":0,"hit":12,"intellect":200,"mp5":20,"penetration":0,"shadowPower":0,"spellPower":500,"spirit":100,"stamina":220}`.

| Field | Forever initial state | Normal import | Import minus Forever |
| --- | ---: | ---: | ---: |
| spellPower | 560 | 560 | 0 |
| shadowPower | 0 | 0 | 0 |
| firePower | 0 | 0 | 0 |
| intellect | 310 | 310 | 0 |
| stamina | 339 | 285 | -54 |
| spirit | 225 | 225 | 0 |
| hit | 13 | 13 | 0 |
| crit | 23.814999999999998 | 23.81500005722046 | 5.7220461258111754e-8 |
| mp5 | 20 | 20 | 0 |
| penetration | 0 | 0 | 0 |
| maxHealth | 4624 | 4084 | -540 |

The normal-import `crit` row uses packed shader crit, including base/intellect/racial contributions; the config field alone is only one contribution. Geared reference values are archived and do not apply to this scenario.

## Packed shader inputs

| Field | Forever initial state | Shader | Shader minus Forever |
| --- | ---: | ---: | ---: |
| maxMana | 6604.45 | 6604.4501953125 | 0.00019531250018189894 |
| maxHealth | 4624 | 4084 | -540 |
| spellCritPercent | 23.814999999999998 | 23.81500005722046 | 5.7220461258111754e-8 |

Packed float comparisons allow max(0.0001, absolute source value × 0.000001) for float32 representation; feature gaps still block parity.

## Import blockers

- stamina: normal import 285, Forever 339 (delta -54)
- maxHealth: normal import 4084, Forever 4624 (delta -540)
- Shader maxHealth: 4084, Forever 4624 (delta -540)
- Named groups, assigned curse actions and complete APL semantics are not yet preserved (see FOREVER_IMPORT_AUDIT.md)

## Missing equipment


## Provenance and reproduction

The fixture records the exact gear-free request, declared bonus stats, ComputeStats response, initial player/pet stats, pseudo stats and per-action combat results. It uses empty equipment, external CoE only; no other external buffs/consumables, the preset race/talents/pet/rotation, zero distance and the default long single-target encounter.

Run the exporter from a checkout of the recorded revision with generated Go protobuf files and the embedded database enabled:

```sh
go run -tags=with_db /path/to/yazpads_warlock_sim/scripts/forever_export/main.go demo_fire_brand RaceHuman > /tmp/forever-export.json
cd /path/to/yazpads_warlock_sim
node scripts/capture_forever_fixture.mjs /tmp/forever-export.json /path/to/forever
```

Previous geared snapshots are retained under fixtures/geared_forever for historical reference only. They supply no stats or DPS target to this scenario.

Direct bonus-stat imports add level-60 racial/class attributes exactly once. Shader packing consumes totals without legacy extra intellect, and derives health/mana from source class values.

Next: resolve remaining stat, pet, talent and APL differences in this gear-free scenario. Gear, enchants, sets and item effects are deferred. Group/curse/cooldown semantics must match before enabling a DPS tier.
