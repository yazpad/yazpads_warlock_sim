# Deferred geared baseline work

Historical work order before active configurations moved to gear-free-v1. Gear-specific tasks and numerical targets below are deferred; follow the active root todo.

# Forever / ThreeJS WebGL parity TODO

Updated: **2026-10-19**. This is the active work order for Warlock parity between the local `wowsims/forever` Go engine and `threejs_webgl_des`.

**Current status: input parity is unresolved.** SM/Ruin has a reproducible live reference and an ordinary-import comparison, but its inputs differ substantially. The other four presets still use legacy resolved snapshots. No preset currently has accepted, source-backed end-to-end parity.

**Priority change: establish gear-free, explicit-stat baselines first.** Forever accepts empty equipment plus `Player.bonusStats`; these are additions to racial/class base stats, not final combat totals. Keep the existing geared SM/Ruin capture as a separate integration case. Gear catalog, enchants, sets and item procs are deferred until the gear-free baseline is reliable.

## Immediate next work — gear-free baseline for every preset

- [ ] Extend the exporter with an explicit gear-free scenario: empty equipment, declared bonus stats, race, talents and source rotation. Give it a distinct case/fixture identity; do not overwrite or reuse the geared suite's DPS target.
- [ ] Define direct-stat semantics in our importer to match source bonus stats plus base attributes exactly once. The equipped-import fix does not yet fix our legacy direct-stat convention.
- [ ] Start with no external buffs/consumables, then add them individually. Explicitly specify pet/sacrifice and supported APL actions; diagnose unsupported actions rather than silently dropping them.
- [ ] Capture Go-resolved player/pet and packed shader inputs for each gear-free case; compare stats, resources and action semantics before DPS.
- [ ] Apply the same declared scenario construction across SM/Ruin, Wrack, Destruction and both Demonology presets; retain each preset's talent/racial/pet differences.
- [ ] Once those inputs match, compare per-action behavior and statistical DPS, then reintroduce buffs, consumables, channels/prepull capabilities and finally gear integration.

This work precedes the geared SM/Ruin work order below. Shared base-stat, packing and APL fixes remain relevant; synthetic enchants, set bonuses and catalog expansion are deferred gear work.

Old experiments and implementation notes are preserved in [the historical archive](docs/FOREVER_PARITY_HISTORY_2026-10-19.md). Its checkmarks, hit adjustments, formula conclusions, DPS attributions and parity tiers require revalidation. A small historical DPS delta does not establish that normal import works.

## Current evidence

| Preset | Reference and import status | Next action |
| --- | --- | --- |
| `sm_ruin` | Live request reproduces **645.8666648 DPS**, 20 iterations, seed 101; normal import resolves but differs | Fix P0 stat resolution, then P1 action semantics |
| `aff_wrack` | Legacy resolved snapshot; interruption unsupported | Capture source request after SM/Ruin pipeline is reliable; audit hit/Suppression without overrides |
| `destro` | Legacy resolved snapshot | Capture source request; audit cooldown/item actions and Conflagrate conditions |
| `demo_shadow_brand` | Legacy resolved snapshot | Capture source request; audit pet inheritance, active pet plus sacrifice and Brand |
| `demo_fire_brand` | Legacy resolved snapshot | Capture source request; audit Imp stats, Firebolt and Brand |

SM/Ruin numbers compare the **same request's reset-time combat state**, not a separate `CharacterStats-Default` case. Full comparison: [FOREVER_INPUT_COMPARISON_sm_ruin.md](FOREVER_INPUT_COMPARISON_sm_ruin.md).

| Input | Forever | Normal import | Difference |
| --- | ---: | ---: | ---: |
| Spell power | 535 | 526 | -9 |
| Shadow-only power | 0 | 20 | +20 |
| Intellect | 339 | 340 | +1 |
| Stamina | 374 | 238 | -136 |
| Spirit | 293 | 243 | -50 |
| Spell crit (packed shader) | 15.7935% | 10.81056% | -4.98294 percentage points |
| MP5 | 93 | 67 | -26 |
| Max health | 4974 | 3614 | -1360 |
| Max mana (packed shader) | 6178 | 6193 | +15 |

Equipped imports now add the source racial base attributes before buffs, and shader packing consumes total intellect without adding the legacy 136 intellect. Health/mana use source base-resource formulas. The earlier 1.5% crit figure was a config contribution, not actual shader crit; the comparison now reports the packed chance.

Hit (7%), fire-only power (0), and penetration (1) match in this snapshot. These individual matches do not clear the full configuration gate. Attribute each mismatch to source rules; the table does not prove which buff or formula caused it.

## P0 — Make SM/Ruin configuration trustworthy

Work in this order. Fix import/resolution code and regenerate the comparison; retain the source for each contribution. Never edit resolved values to reach a DPS target.

1. [x] **Resolve base racial stats and resources once for equipped imports.** Shared level-60 Human/Orc/Gnome/Undead/Troll attributes are added before buffs. Config marks total attributes so packing avoids legacy extra intellect; health/mana use source class values and first-20-point offsets. Direct-stat inputs retain their legacy convention. Remaining differences from enchants, sets, buffs and crit are tracked below; full configuration parity is still open.
2. [ ] **Remove synthetic enchants from source gear.** The resolver adds a fixed enchant package. Apply actual imported enchants/random suffixes, and none when absent. Preserve equipment metadata rather than reducing every entry to an ID.
3. [ ] **Resolve actual set bonuses and item effects.** Audit the source preraid set and passive effects. Real item IDs alone do not reproduce these effects. Preserve rating precision and derive conversions from source data.
4. [ ] **Map the exact suite buffs.** Compare the request's `FullBuffs`, including base-stat buffs, Moonkin Aura, Atiesh effects/counts, improved Mana Spring, Mana Tide and pet effects. Preserve ranks and quantities. Do not substitute the UI build's smaller buff selection for suite inputs.
5. [ ] **Resolve crit and resource conversions.** Account for base crit, final intellect conversion, ratings and buffs exactly once. Compare max mana, regeneration, health, Life Tap inputs and pet resources as well as DPS stats.
6. [ ] **Preserve encounter and class settings.** Map actual duration, target armor/resistances, level, execute proportions, distance, armor choice, shards, professions, reaction time and channel clip delay. Reject unsupported settings explicitly; avoid silent race/pet fallbacks.
7. [ ] **Expand input comparison beyond eleven player fields.** Include race, pet/sacrifice, encounter, ranks, multipliers, packed resource values, initial pet stats, cooldowns and unsupported settings. Explain each difference or mark it unsupported.

**Done when:** normal import reproduces the exact Go request's supported initial state and packed inputs within documented numerical tolerances, with no unexplained overrides. Scalar stat agreement alone does not enable combat scoring; P1 action semantics must also be accounted for.

## P1 — Preserve rotation and combat configuration

These are confirmed import losses or unresolved semantics, not measured explanations of a DPS delta. See the [generated audit](FOREVER_IMPORT_AUDIT.md) for per-build source paths.

- [ ] Expand named APL groups at the correct priority position. Preserve reference/action conditions and reject missing groups or cycles. `Boosts` is currently omitted.
- [ ] Preserve complete condition semantics: all AND/OR branches, general negation, variables, positive DoT/aura predicates, strict/inclusive bounds and `min` comparisons. Extend the shader representation where two condition slots are insufficient.
- [ ] Diagnose unsupported AST nodes/actions with source paths; never silently turn them into `true` or drop them. Prevent action rewrites from removing racial, Nightfall, Soul Fire or Conflagrate conditions.
- [ ] Represent Amplify Curse as an independent cooldown/action instead of translating it into Agony.
- [ ] Implement assigned curse choice/execution: GCD, mana, application, uptime and refresh. Distinguish this player's casts from external raid debuffs.
- [ ] Implement independent potion, trinket, racial and automatic cooldown actions, including conditions, timing and shared cooldown rules. Generic trinket SP fields currently stand in for the combat potion.
- [ ] Import/execute explosives and conjured consumables, including damage, resources, charges, cooldowns and profession requirements.
- [ ] Resolve relevant raid debuffs: Judgement of Wisdom, armor reductions, Gift of Arthas and school effects. Include player, pet and resource consequences.
- [ ] Audit readiness, insufficient-mana fallthrough, fallback Life Tap, GCDs and disabled/hidden actions against Go. Existing ordering/bytecode support does not prove semantic equivalence.

**Done when:** every combat-relevant action, predicate and setting in the selected request is preserved or explicitly unsupported. Unsupported behavior blocks full-parity acceptance even when total DPS is close.

## P2 — Finish the reproducible comparison pipeline

Work alongside P0/P1 where independent; complete before publishing new parity tiers.

- [ ] Replace capture's unconditional `blocked` status with an evidence-based gate distinguishing failed resolution, input differences, unsupported behavior and matched supported inputs. Do not clear it merely because scalar stats match.
- [ ] Bind provenance to the executed source at export time. Record/check engine/exporter hashes, build/database inputs, dirty state, toolchain/build flags and our importer/kernel/item-data hashes. Detect stale comparisons.
- [ ] Parameterize request selection beyond fixed FullBuffs/preraid/zero-distance/long-single-target cases. Preserve exact case names and distinguish suite cases from UI imports.
- [ ] Provide configuration-only reporting without combat execution, with blockers in Markdown and JSON. Keep historical DPS output visibly unverified.
- [ ] Migrate the other four presets to live exports, starting with Wrack. Archive overrides; do not copy final stats into new imports.
- [ ] Normalize per-spell casts, hits, crits, ticks, damage, resources, cooldowns, aura uptime and pet contributions across engines. Go results are captured; a comparable result/event contract remains unfinished.
- [ ] Capture compatible timelines and identify the first differing action, impact, aura or resource event, including ordering when timestamps tie.
- [ ] Verify native CPU and WebGL runners independently against the same source contract. The current Forever parity runner exercises WebGL; native cross-Forever parity is not established.
- [ ] Apply the input/feature gate consistently in reports, tests and any UI consuming fixtures before enabling combat scoring.

**Done when:** an unedited request can be exported, imported, diagnosed and compared reproducibly, and stale, unsupported or manually resolved inputs cannot receive accepted parity labels.

## P3 — Close combat and capability gaps

Use matched configurations and dedicated comparison cases. Known code defects may be fixed independently; attribute preset DPS effects only after measurement.

### First: channels and prepull

- [ ] Implement Wrack clipping: `interruptIf`, tick-boundary reevaluation, clip delay, recast policy, future-tick cancellation, debuff lifetime and action readiness. Current shader schedules six ticks and locks actions for six seconds.
- [ ] Implement negative-time prepull/precasting: scheduling, initial mana/GCD/cooldowns, auras/pets and casts/projectiles crossing time zero.
- [ ] Add explicit source comparison scenarios for these capabilities. None of the five current source presets contains prepull actions; the Wrack preset has no `interruptIf`. Neither gap is yet a demonstrated cause of their DPS differences.

### Then: damage, resources and pets

- [ ] Restrict Wrack's 10% amplification to Corruption and Agony; the shader currently also amplifies Doom. Compare a scenario containing both spells instead of assuming an impact on standard Wrack.
- [ ] Revalidate coefficients, ranks, costs, snapshots, periodic crit eligibility, school/passive multipliers and Amplify Curse against the captured revision. Historical edits are investigation leads, not completed cross-engine validation.
- [ ] Audit Suppression, rating conversion, level-based miss chance and minimum miss cap against Go. Retire unexplained legacy hit overrides, especially Wrack's earlier 7/12/16% adjustments.
- [ ] Compare pet initial stats, mana/regen, inheritance, crit/hit, melee distributions, armor mitigation, Firebolt, Lash, Brand consumption/crit and active pet plus sacrifice.
- [ ] Compare resistance distributions/binary outcomes, projectile impact queues, batching, simultaneous-event order and fight-end cutoffs. A scalar multiplier does not establish matching event outcomes.
- [ ] Report sample counts, means, variance and uncertainty for **both** engines. The 20-iteration reproduction validates request identity, not statistical parity. Equal seeds do not align different RNGs/draw ordering.
- [ ] Define acceptance thresholds after input alignment. Historical DPS bands were <=0.5% / <=1.5%; strict acceptance also needs feature/per-action checks. Do not infer cast parity from DPS or impose a universal <=1 cast rule on unrelated random streams.

**Done when:** supported scenarios meet documented per-action and statistical tolerances with matching inputs. Keep unsupported scenarios visible; increase trials on both engines when uncertainty could explain the difference.

## P4 — Broader coverage and maintenance

- [ ] Synchronize the broader item/enchant/effect catalog from the actual source database, including sets, on-use effects, ICDs, proc rates and supported pets/races. Current sync covers only the 17 missing SM/Ruin IDs.
- [ ] Add a capability matrix separating import support from engine execution, including encounter, APL, consumable and multi-target limitations.
- [ ] Add CI for deterministic input comparisons and supported mechanics; budget statistical benchmarks separately once the baseline is reliable.
- [ ] Provide timeline/resource/aura inspection and result UI diagnostics using the P2 contract.
- [ ] Extend the comparison contract to Priest and Mage after the Warlock baseline is reliable. Reconcile existing multiclass work first; absence of a Forever comparison does not mean a class has no implementation.

## Completed infrastructure — limited scope

- [x] Static source/import audit across five Warlock presets (`scripts/audit_forever_import.mjs`); observed import losses, not an exhaustive mechanics audit.
- [x] Forever recognition at the legacy import boundary, talent decoding, basic buff/action mapping and pet/sacrifice fields. Completeness remains P0/P1 work.
- [x] Preserve source distance unless overridden; forward book ranks, timed SP settings and target armor/resistance into final config building. Independent cooldown/encounter parity remains open.
- [x] Live Go exporter using the suite's `SettingsCombos` generator (`scripts/forever_export/main.go`, `-tags=with_db`).
- [x] Reproduce SM/Ruin Human/FullBuffs reference at 645.8666648 DPS, 20 iterations, seed 101.
- [x] Capture exact request, ComputeStats, reset-time player/pet stats, pseudo stats, raw gear and Go per-action results in the schema-v2 fixture.
- [x] Archive original SM/Ruin overrides under `fixtures/legacy_forever`; capture actual normal-import configuration instead.
- [x] Synchronize 17 missing source gear IDs/metadata; normal SM/Ruin import resolves. Base stats, enchants, sets and buffs remain open.
- [x] Generate field comparison with revision/hash provenance (`scripts/capture_forever_fixture.mjs`). Coverage, provenance validation and automatic gate resolution remain P2 work.
- [x] Block schema-v2 SM/Ruin scoring while inputs differ; mark other snapshots unverified in the report generator and label the saved report historical.
- [x] Headless WebGL runner and DPS/per-spell Markdown reporting. JSON combat reporting, compatible event diagnostics and native verification remain open.

## Artifacts and reproduction

| Artifact | Purpose |
| --- | --- |
| [SM/Ruin comparison](FOREVER_INPUT_COMPARISON_sm_ruin.md) | Current stat differences and blockers |
| [Import audit](FOREVER_IMPORT_AUDIT.md) / [JSON](FOREVER_IMPORT_AUDIT.json) | Observed settings/APL losses by source path |
| [Gap notes](docs/FOREVER_PARITY_GAPS.md) | Supporting observations; this todo defines work order |
| `fixtures/canonical_forever/sm_ruin.fixture.json` | Live reference and actual import config; blocked |
| Other fixtures under `fixtures/canonical_forever` | Legacy resolved snapshots; unverified |
| [Historical DPS report](PARITY_REPORT_FOREVER.md) | Previous measurements, not current acceptance evidence |
| [Historical todo](docs/FOREVER_PARITY_HISTORY_2026-10-19.md) | Superseded claims and earlier investigations |

From a Forever checkout with generated Go protobuf files, an embedded database and the recorded revision:

```sh
go run -tags=with_db /path/to/yazpads_warlock_sim/scripts/forever_export/main.go sm_ruin RaceHuman > /tmp/forever-export.json
```

From this repository, with that export and the same source checkout:

```sh
node scripts/sync_forever_fixture_items.mjs /tmp/forever-export.json /path/to/forever
node scripts/capture_forever_fixture.mjs /tmp/forever-export.json /path/to/forever
node scripts/audit_forever_import.mjs /path/to/forever
```

Sync updates the item catalog; capture updates the fixture/comparison; audit updates its Markdown/JSON outputs. Keep revisions and exact requests attached to results. Do not regenerate historical evidence merely to change a checkbox.
