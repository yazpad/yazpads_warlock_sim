# Forever / ThreeJS WebGL parity TODO

Current result after Doom tick audit: **MAE 1.177 DPS / MAPE 0.176%**, 300 cases × 1,000 fights per engine, unchanged. Ordinary Doom tick damage matches source after accounting for realized crit counts. Fixed an erroneous **10% Wrack bonus on Doom** in custom overlapping configurations; the standard matrix has no such combination. [Findings](docs/FOREVER_DOOM_FINDINGS_2026-10-20.md), [comparison](FOREVER_DOOM_TICK_FIX_COMPARISON.json). The preceding balanced 20-case × 10,000-fight result remains 0.442 DPS MAE.

Historical pet follow-up (2026-10-20): pet-only MAE improves **1.568 → 0.028 DPS** in 80 non-Orc cases (120 total isolated cases). The full 300-case, 1,000-fight rotation MAE changes **1.945 → 2.553 DPS** (MAPE 0.386%): correcting pet deficits exposes player overestimates and the preserved 5% Orc Command/source gap. [Pet fixes, validation and next causes](docs/FOREVER_PET_FINDINGS_2026-10-20.md). Earlier "current" measurements below describe their historical stage.

## Pet follow-up implementation status

- [x] Capture 120 source-backed pet-only cases across pet type, Demonic Knowledge, race, SP, intellect, hit and crit; reuse exact source requests/results after changes.
- [x] Implement initial/runtime inherited SP/AP with a randomized 5.25s phase, stronger-school inheritance, and queued Blood Fury/trinket gain/expiry updates.
- [x] Correct Succubus weapon/base AP, 17% inheritance, level-based crit suppression, variance and initial swing timing; use global pet spell crit.
- [x] Correct Firebolt affordability at cast start, 100ms pet-mana credits/readiness waits, source coefficient/variance, Lash's pull-time start and exact-endpoint pet damage.
- [x] Validate both shader modes and rerun all 300 rotations at 1,000 fights per engine; keep component accuracy separate from total MAE cancellation.
- [x] Remove the unsupported 5% Orc Command pet multiplier per user instruction; retain Savage and Blood Fury. Add regression coverage and refresh the full comparison.
- [x] Confirm and fix Wrack application misses (mana + GCD, no channel/aura) and Soul Siphon counting (other active Affliction effects including Doom, cap three). Source traces confirm 0/1/2/3-effect multipliers. Separate GPU ablations and the full 300-case rerun quantify the improvement.
- [x] Investigate Shadow Brand spell allocation: Brand now requires a landed Searing Pain; Decimation requires a landed cast result, including Nightfall bolts; Searing Pain resolves before the next decision and ignores projectile travel. Isolated gate ablations identify Brand-on-miss as the main cause.
- [x] Trace Troll Destruction: imported automatic cooldowns now activate Berserking at pull; source millisecond cast/GCD rounding is implemented. Measure separate ablations, rerun the full matrix and four matched 10,000-fight cases.
- [x] Audit and fix Shadowburn mean and variance: source base average 273.200012 instead of old 280.525; variance applies to base plus spell power. Preserve cast counts, verify source-derived distribution in both modes, and measure a balanced five-race high-sample comparison.
- [x] Audit Doom: generated 1742 + 4×SP formula, zero variance, crit multiplier and dynamic power match. Higher-sample constant-buff tick differences reduce to realized crit counts (normalized tick error <0.001 damage). Correct Wrack mask exclusion; verify plain, active-Wrack, expired-Blood-Fury and active-Blood-Fury scenarios. Standard matrix MAE is unchanged.
- [ ] Preserve imported constant-false racial actions as fallback-suppression guards. The Doom probe exposed that dropping `Blood Fury if false` allows legacy fallback to activate a racial absent from the source rotation. Reproduce this import path separately before implementation.
- [ ] Use a broader higher-sample matrix to distinguish persistent component errors from correlated crit-count sampling; continue projectile damage snapshots and Shadow Brand timing separately.
- [ ] Continue nonzero-distance damage snapshots, pet travel/movement and broader APL parity. Cast-result hit timing is tested here, while full projectile snapshot and movement parity remain open.

Current production result (2026-10-20): **MAE 1.945 DPS / MAPE 0.289%**, 300/300 cases at 1,000 fights per engine. The same 60 higher-sample cases improve from **3.554 to 1.792 DPS MAE** (49.59%). All selected player/packed input fields now match. [Production changes, validation and remaining limits](docs/FOREVER_PRODUCTION_FIXES_2026-10-20.md). Historical investigation/probe measurements below are retained; implemented tasks are marked accordingly.

Updated: **2026-10-20**. Active configurations are **gear-free**. Gear, enchants, sets and item procs will return as a separate integration phase.

## Fast-mode throughput regression investigation

- [ ] Reproduce browser fast-mode throughput at the three user-reported checkpoints using the same browser/device, scenario, fight count, warmup, and tracing setting; capture the generated shader, fast-state word count, and event count for each run.
- [ ] Bisect the drop from `c3e79f53206e20c1b39ff0510fa8709563337dfe` (~550k fights/s) to `a0255f586f1dc9976b51252180dc209fe33a1cc3` (~400k), then the partial recovery at `1ac4e55d6d469f9d69e0577145cc2dc8f78f8d47` (~450k). These are user-reported browser measurements; benchmark settings and environment are not yet recorded.
- [ ] Separate shader/runtime costs from app configuration, detailed-result tracing, WebGL compilation/cache state, and browser/GPU variability before attributing the regression to a particular feature.

Initial read: the c3→a025 interval changes the combat kernel and model substantially (kernel: 159 changed lines; model and engine also change), so there is enough scope for a real workload regression. The a025→1ac interval also changes kernel/model code and could explain some recovery. Existing diffs mix correctness fixes, new event/state behavior, and fast/detailed paths; code volume alone does not identify the cause. Browser runs must be matched before concluding that the observed 550k→400k change is purely from kernel work.

## Current configuration contract

- All 115 built-in app presets declare direct bonus stats and empty equipment. Gear selection is disabled, and startup no longer fetches a gear catalog or preloads BiS items.
- All five canonical Forever fixtures are live `gear-free-coe-v2` exports. They use the shared [scenario](fixtures/forever_gear_free_scenario.json): explicit bonus stats, no equipment, external CoE only, no other external buffs/consumables, preset race/talents/pet/source rotation, zero distance and 180 seconds.
- Direct logical imports add racial/class base attributes exactly once before buffs. Packing consumes total intellect and source health/mana formulas. Equipped logical imports are explicitly rejected while gear is deferred.
- UI buffs remain independently selectable. The unbuffed reference scenarios have their own identities and results; no geared DPS target is reused.
- Every case remains **blocked for combat parity** until action/feature gaps are resolved. Numeric stat agreement alone does not prove rotation parity.

See the [current generated status report](PARITY_REPORT_FOREVER.md) and each linked input comparison for live evidence. Reference runs use 20 iterations and seed 101; these establish scenario reproducibility, not statistical cross-engine acceptance.

The [diagnostic combat comparison](FOREVER_GEAR_FREE_BENCHMARK.md) now defaults to **1,000 iterations in each engine**, using our detailed/slow mode. It collects per-spell and pet casts, landed events, crits, ticks, misses, direct/periodic damage, mana accounting, our aura/proc counters and raw source aura/resource data. Every damage breakdown must reconcile with total damage. The earlier 10,000-trial fast benchmark is archived under `fixtures/benchmark_history`. The diagnostic additions originally preserved fast shader generation/packing; the later combat corrections intentionally update both execution modes without adding fast-mode diagnostic counters. focused transport/normalization checks cover the detailed additions.

## Current-code audit (2026-10-20)

The earlier benchmark notes below are historical measurements, not the current implementation baseline.

- [x] Wrack costs 200 mana and imports `channelClipDelayMs`; completed channels delay the next decision. `wrack_timing.test.mjs` verifies normal import, packing, mana and tick/decision timestamps in both shader modes.
- [x] Independent Agony/Corruption/Wrack talent factors multiply; pet Unholy Power and Improved Imp/Sayaad factors also multiply (1.43 for the tested ranks). `talent_stacking.test.mjs` verifies config paths and GPU damage ratios. The former 1.20 versus 1.21 discrepancy is resolved.
- [x] Conflagrate uses centered variance around `282 + 0.429 * SP` in production. Distribution/event parity still requires comparison.
- [x] Bane of Doom has its 60-second cooldown, including failed applications; focused GPU regression is in `doom_cooldown.test.mjs`.
- [x] Split Boosts imports duration-aware time-to-execute and independent Decimation-aura gates into explicit racial rows. `eureka_apl.test.mjs` covers import and both shader modes; this supersedes the earlier omitted-group/fallback explanation.
- [x] Focused current-code verification: sweep, groups, Wrack timing, talent stacking, Eureka APL, Doom cooldown and breakdown test files all passed on 2026-10-20.
- [ ] Ordinary (non-group) APL translation remains lossy: long ANDs truncate, OR keeps one branch, unknown conditions become true and some actions override gates. Supported `min` strict/inclusive bounds are now preserved. Group support does not close this general task.
- [x] Pet runtime inheritance, source coefficients and initial/completion timing are now implemented and verified in the focused pet investigation; the 110-to-116 SP transition follows a randomized heartbeat rather than a fixed additive adjustment. Remaining pet policy/travel/feature gaps stay open above.
- [x] Re-run the full 300-case race/stat sweep after this audit: all 300 cases completed at 100 fights/engine, followed by 60 selected cases at 1,000 fights/engine (90,000 fights per engine total). Reports: `FOREVER_SWEEP.*` and `FOREVER_SWEEP_FOLLOWUP.*`; preceding report archived under `fixtures/benchmark_history/race-stat-300-pre-2026-10-20.*` (JSON compressed).
- [x] Resolve measured Fire Brand initial inputs through Blood Pact: the historical 60 screen / 12 follow-up cases lacked 54 stamina / 540 health; current inputs match. Historical evidence: Source `registerBloodPact` applies the active Imp aura during the build phase; normal imports do not account for it. Other selected player fields match across the remaining 240 screen cases.
- [ ] Investigate the persistent high-regeneration Gnome Destruction rotation difference: at 1,000 fights source has 3 Doom ticks and 39 Incinerates, ours 2 and 36; total delta -3.35% (−22.76 ± 2.07 DPS, approximate 95%). The shader's `FIGHT_TIME_GE` is strict `>`; three in-memory 1,000-fight probes (inclusive predicate, fight-end +1µs, both) leave this case unchanged. The subsequent traced cause analysis identifies interacting costs, Eureka masks/policy and MP5 affordability timing; see the implementation steps below.
- [x] Investigate low-regeneration Undead Wrack and Orc hit-16 Fire Brand: Nightfall/spirit regeneration and integer Soul Fire cooldown/pet timing probes explain the selected gaps to within 0.12%; implementation remains open below. Higher-sample results supersede ranking the largest noisy 100-fight totals.

## Next implementation steps from traced causes (2026-10-20)

[Detailed cause analysis, MAE and reproduction](docs/FOREVER_CAUSES_2026-10-20.md). The traced corrections below are now implemented; probe deltas remain historical diagnostics. Use the production report above for current measurements.

- [x] Locate causes using source/GPU action traces and 19 × 1,000-fight GPU probes. Full-screen MAE is **4.642 DPS / 0.702% MAPE**; selected follow-up MAE is **3.554 DPS / 0.549% MAPE**. These matrices differ and are not before/after results.
- [x] Correct Incinerate base mana **355 → source 325** and Conflagrate **265 → source 255**; add source-compatible MP5 credit/check timing and spirit regeneration with the five-second rule and paid-channel suppression. At 83.5s in the corrected Destruction trace, five-second lump regen leaves 319.2 mana versus source 389.2, changing Corruption into Incinerate. The combined source-backed Destruction probe gives **-0.068%** versus baseline -3.350%, restoring 3 Doom ticks and 39 Incinerates.
- [x] Apply Nightfall to all eligible Shadow Bolt execution paths, including the higher-priority missing-vulnerability row. With spirit regeneration this moves the selected Wrack case **-1.685% → +0.084%**. The inclusive-min probe alone has no effect in that case; do not claim it explains the deficit.
- [x] Calculate Soul Fire cooldowns with exact integer microseconds. Float32 at Decimation rank 2 creates **6,000,001µs**, missing the 168.8s decision after a 162.8s completion. Fixing this alone moves Fire Brand **+1.349% → +0.421%**.
- [x] Derive Imp mana from **576 + 264 × 5**, then apply Fel Vitality, rather than the current 1150 base; preserve the first Firebolt at 2s versus our 0.3s. Together with the integer Soul Fire cooldown, the selected Fire Brand case reaches **+0.113%**, with source-matching 63 Searing Pains and 9 Corruptions. Integrate active-Imp Blood Pact separately to resolve -54 stamina / -540 health.
- [x] Preserve `autocastOtherCooldowns` policy as well as explicit racial groups. In the Destruction case source Eureka fires at 0/120s, while our fallback waits for Doom. Apply source cost/direct/channel masks: Incinerate, ordinary DoTs and curses are not blanket Eureka recipients. Then specify equal-time periodic/action ordering and strict/inclusive predicates; isolated boundary probes did not explain the entire gap.
- [x] Add focused fast/detailed regression cases for these specific triggers, then rerun all **300 cases at 1,000 fights per engine** and report global MAE/MAPE plus per-spell/input differences. Three small combined-probe totals do not close broader import/event/pet parity.

## P0 — Finish gear-free initial-state parity

### Implemented after the recorded benchmark (2026-10-19)

- [x] Switch all five canonical scenarios to `gear-free-coe-v2`: external CoE enabled, assigned curse set to NoCurse; regenerate source references and ordinary imports. Preserve target multipliers through shared configuration building and apply external CoE to pet spells/Brand as well as player spells. Preserve reduced resistance at import.
- [x] Life Tap uses `(424 + Spirit) * improvedMultiplier`, replacing the unexplained 577 base. Spirit remains 1:1 before Improved Life Tap.
- [x] Enable current rank-4 Siphon Life periodic crit behavior; this checkout still hardcoded `crit=false` despite the earlier fix reported by the user.
- [x] Pass Demonic Knowledge rank through the shared config builder. Exclude its player bonus from inherited pet power before adding the pet's own bonus; these source cases target 110 pet SP rather than 116.
- [x] Demonic Brand consumes a charge on a triggering landed pet attack and independently rolls magic hit and 1.5x crit. Detailed reports/UI now collect Brand attempts, hits, crits and misses.
- [x] Succubus melee inherits hit for its 8% boss miss chance; retain separate 6.5% dodge and 40% glance portions and remove the unexplained +2.72% crit adjustment.
- [x] Re-run all five cases with 1,000 iterations per engine after the fixes (seed 101, 180 seconds, external CoE). Current ours-minus-Forever gaps: SM/Ruin -2.39%, Wrack -2.78%, Destruction +1.73%, Shadow Brand +0.56%, Fire Brand -0.35%. All shader lanes completed and damage reconciled within 0.1 damage/fight. Previous measurements are archived under `fixtures/benchmark_history/gear-free-1000-detailed-pre-coe.*`.
- [ ] Run focused regression verification separately; the completed comparison does not establish browser integration or fast-mode equivalence.
- [ ] Prioritize residual Agony/APL/Amplify behavior (SM/Ruin Agony -8.44 DPS, Wrack Agony -10.96 DPS), Wrack damage/timing (-4.73 DPS), and Destruction action counts. Investigate remaining pet scaling (Firebolt -4.08 DPS) and initial Fire Brand health. Small net Demonology gaps include offsetting spell differences; all five mean-difference intervals still exclude zero at approximate 95% confidence.
- [ ] Resolve remaining pet scaling, crit suppression and attack-table assumptions using source/event comparisons; do not mark pet parity accepted from these small corrections alone.

- [x] Define one explicit bonus-stat scenario and use empty equipment in all five Forever requests.
- [x] Export and capture new reference results for SM/Ruin, Wrack, Destruction and both Demonology presets; archive previous snapshots under `fixtures/geared_forever`.
- [x] Map Forever bonus stats and percent hit/crit pseudo stats into direct imports. Add base attributes/resources once, without legacy extra intellect.
- [x] Use source intellect-to-crit conversion for total-stat configs and floor primary attributes after multipliers.
- [x] Fix missing Mana Spring enum values being treated as enabled, which introduced a phantom 25 MP5.
- [x] Compare actual packed crit, mana and health; allow documented float32 representation tolerances.
- [x] Resolve Fire Brand initial stamina/health through active-Imp Blood Pact in stat aggregation (before primary-stat multipliers); the current 300-case input checks match without fixture substitutions.
- [ ] Expand initial-state comparison to pet stats/resources, passive multipliers, execute/encounter settings and talent effects. The current eleven player fields and three packed fields are not exhaustive.
- [ ] Check the shared stat contract across supported races and saved logical/resolved imports, including search and preset comparison paths. Historical direct-stat inputs used a different convention; rebuild old resolved exports with current compatibility IDs.

**Done when:** every supported initial player/pet input and packed value matches the same gear-free source request within documented tolerances, with no unexplained substitutions.

## P1 — Preserve source APL and combat settings

Agony investigation: [source/data and import findings](docs/FOREVER_AGONY_FINDINGS.md). The original double-dip is fixed upstream in `86d0920`; our explicit Amplify action and Agony spell-power snapshot are implemented. Multiplicative periodic talent factors (1.21 vs 1.20) are now fixed and regression-tested; tick counts and broader APL semantics remain open.

- [x] Expand named groups at their priority positions, preserving supported conditions and rejecting missing/cyclic references. Nested/repeated groups, scoped variables and hidden rows are covered by `forever_groups.test.mjs`; unsupported grouped actions remain diagnostics, not executable support.
- [ ] Preserve all AND/OR branches, general negation, variables, positive DoT/aura predicates, comparison bounds and min semantics. Extend the two-slot shader condition representation where necessary.
- [ ] Diagnose unsupported nodes/actions by source path instead of converting to true or dropping them. Preserve racial, Nightfall, Soul Fire and Conflagrate gates.
- [x] Implement explicit off-GCD Amplify Curse APL action (24), parser/aliases, aura predicates and source spell 18288 mapping. Remove activation from Agony; talent ownership only enables action availability. Add explicit rows to app-generated defaults and expose the action to synthesis. Preserve cooldown/aura readiness and consume on Agony cast, including failed applications, matching corrected Forever.
- [x] Regenerate all five canonical fixtures and compare against Forever `86d0920cae8445eaa90de9c17c3583cf171c19c5` (clean source checkout, fresh protobuf generation in isolated build copy). Amplify casts/fight: SM/Ruin 1 / 1; Wrack 1.014 / 1.004; Destruction 0 / 0; both Demonology 0 / 0 (Forever / ours). Remaining Wrack cooldown-boundary frequency difference requires timing investigation.
- [ ] Add focused regression coverage for explicit Amplify conditions, aura expiry, cooldown, failed Agony applications and default/saved app APL paths. The five completed detailed benchmark scenarios do not cover all these cases.
- [ ] Implement assigned curse choice, GCD, mana, application, uptime and refresh; distinguish player casts from external debuffs.
- [ ] Audit racial cooldown execution, action readiness, mana fallthrough, fallback Life Tap, GCDs and hidden/disabled source actions.
- [ ] Distinguish source APL actions that are unavailable in a gear-free request from supported executable actions. Empty consumables must not enable potion/item effects.

**Done when:** each combat-relevant action/condition is preserved or explicitly unsupported. Unavailable source actions and unsupported simulator behavior must remain distinguishable.

## P2 — Reproducible comparison and acceptance

- [x] Run 1,000-trial detailed comparisons on both engines, verify request identity/lane completion, and report means, uncertainty and normalized spell/pet breakdowns. Reproduce with `scripts/benchmark_forever_gear_free.mjs`; diagnostic measurements do not clear acceptance gates.

- [ ] Replace capture's unconditional blocked status with an evidence-based gate for failed resolution, numerical input differences, unsupported behavior and matched supported inputs.
- [ ] Bind provenance to executed source at export time; validate engine/exporter/scenario/database/build hashes, dirty state, toolchain and our importer/kernel hashes. Detect stale comparisons.
- [x] Normalize per-spell/pet casts, landed events, crits, ticks, misses, total/direct/periodic damage and mana totals; retain unknown/source-only actions and check damage accounting.
- [ ] Align aura/cooldown identities and timing across engines. Source aura/resource metrics and our aura/proc summaries are collected, but a comparable event timeline and some pet damage subcategories remain open.
- [ ] Capture compatible timelines and diagnose the first differing action, impact, aura or resource event, including equal-time ordering.
- [ ] Verify native and WebGL runners separately against the same source contract. Native cross-Forever parity remains unestablished.
- [ ] After input/feature gates pass, compare distributions with sample counts and uncertainty for both engines. Equal seeds do not align different RNGs or draw ordering. Twenty reference trials do not establish statistical parity.
- [ ] Apply acceptance gates consistently in reports, tests and UI. Historical <=0.5% / <=1.5% DPS bands alone do not establish strict parity or matching cast behavior.

## P3 — Channels, precasting and remaining mechanics

- [ ] Implement Wrack clipping/interruption: interruptIf, tick-boundary reevaluation, clip delay, recast policy, cancellation of future ticks and debuff lifetime.
- [ ] Implement negative-time prepull/precasting, initial resource/GCD/cooldown state and casts/projectiles crossing pull.
- [ ] Add explicit scenarios for both capabilities. The five source rotations currently contain no prepull actions; Wrack specifies no interrupt predicate. These gaps are not established explanations of their DPS differences.
- [ ] Restrict Wrack amplification to Corruption/Agony; the shader also amplifies Doom. Measure a scenario with both spells.
- [ ] Revalidate coefficients, ranks, costs, snapshots, periodic crit eligibility, passive multipliers, Suppression and the minimum miss cap using current gear-free requests.
- [ ] Compare pet inheritance, mana/regen, melee distributions, mitigation, Firebolt, Lash, Brand and pet-plus-sacrifice states.
- [ ] Compare resistance outcomes, missile travel, batching, simultaneous-event ordering and fight-end cutoffs.

## P4 — Add complexity incrementally

- [ ] Add external buffs/debuffs one at a time, preserving effect ranks/counts and resource/pet effects.
- [ ] Add consumables and independent potion/trinket/item actions with charges, profession requirements and shared cooldowns.
- [ ] Add CI for deterministic input/feature checks and separately budgeted statistical benchmarks.
- [ ] Add timeline/resource/aura inspection and a capability matrix separating import support from engine execution.
- [ ] Extend source-backed comparison to existing Priest/Mage work after the Warlock baseline is reliable.
- [ ] **Gear later:** restore item selection and imports, actual enchants/suffixes, sets, proc effects and catalog synchronization only after stat-only parity is reliable. Deferred details: [geared work order](docs/FOREVER_PARITY_GEARED_BASELINE.md).

## Reproduction and artifacts

With Go, generated protobufs and the source database available:

```sh
node scripts/generate_forever_gear_free_fixtures.mjs /path/to/forever
node scripts/audit_forever_import.mjs /path/to/forever
node scripts/generate_forever_parity_report.mjs --inputs-only
```

The generator builds the exporter, captures all five requests/results through normal imports and regenerates the status report. Optional arguments select a separate provenance checkout and Go executable. It does not run WebGL combat scoring while inputs/features are blocked.

- [Scenario](fixtures/forever_gear_free_scenario.json): declared inputs, not inferred gear stats.
- [Status report](PARITY_REPORT_FOREVER.md): current case results and blockers, with individual comparison links.
- [Import audit](FOREVER_IMPORT_AUDIT.md): observed source-path losses in active captured requests; not an exhaustive mechanics audit.
- `fixtures/canonical_forever`: active gear-free requests and actual import configs.
- `fixtures/geared_forever` / `fixtures/legacy_forever`: historical snapshots, excluded from active reference targets.
- [Earlier investigations](docs/FOREVER_PARITY_HISTORY_2026-10-19.md): superseded claims and formula leads requiring revalidation.

## Agony snapshot follow-up

- [x] Snapshot Agony spell-power share on each successful application in fast and detailed modes; later ticks keep dynamic damage multipliers and their existing crit rolls. Cache and compatibility IDs updated.
- [ ] Verify snapshot behavior and rerun comparisons. Latest saved results predate this change. Amplify action/consumption differences and multiplicative talent factors remain open.

- [x] Isolated Forever Amplify double-application probe: real casts at 0s and 24.1s both snapshot 1.5x from one Amplify; a 34s application returns to 1x. Second-cast ticks retain 1.5x after aura expiry. Added reproducible test/runner under `scripts/forever_probes`; runner passed. Source consumption discrepancy is now experimentally confirmed, not only inferred from masks/aggregate aura metrics.

## Current comparison after explicit Amplify and upstream fix

1,000 iterations per engine, seed 101, 180-second external-CoE baseline, Forever revision `86d0920`: SM/Ruin -1.32%, Wrack -1.49%, Destruction +0.87%, Shadow Brand +0.56%, Fire Brand -0.67%. All lanes completed; breakdowns reconcile within 0.1 damage/fight. These supersede earlier current-result claims above. Previous CoE comparison and source fixtures are retained under `fixtures/benchmark_history/gear-free-coe-1000-before-explicit-amplify.*` and `fixtures/forever_history/pre-amplify-fix-d33930d`.

Agony residuals are now -1.27 DPS (SM/Ruin), -3.55 (Wrack), -0.84 (Destruction); its remaining multiplier combination and tick timing are open. Other priorities: SM/Ruin Shadow Bolt -4.25 DPS; Wrack channel -4.73 DPS and Corruption -2.75; Destruction action-count/Incinerate differences; Firebolt -5.34 DPS and Fire Brand initial stats. No input/feature acceptance gates have been cleared by small aggregate DPS gaps.

Built-in presets with saved Agony APL text and the Amplify talent now include an explicit Amplify row immediately before Agony, with the same predicates. Imported/user APLs remain authoritative: an absent Amplify action stays absent.

## Wrack/DoT and direct-damage investigation — no production fixes yet

See [measured diagnostics and runtime evidence](docs/FOREVER_TIMING_DAMAGE_FINDINGS.md).

- [ ] Preserve `OpGe` versus `OpGt` for Wrack's `min` DoT-floor condition (source >=4s is imported as >4s).
- [ ] Use source Wrack cost (200 mana, ours 240) and import/apply `channelClipDelayMs` (50ms in these fixtures, ours 0 after full channels). Combined with >=4s, diagnostic DPS improves 550.63 -> 554.20 versus 558.98 source; Wrack cast counts still differ. Continue timing/APL investigation rather than declare the gap closed.
- [ ] Trace remaining DoT/application/decision ordering. A diagnostic extending fight end by 1 microsecond recovers only 0.44 DPS, not the main missing ticks.
- [x] Multiply Firebolt's Improved Imp and Unholy Power factors separately (1.30 * 1.10); the old additive composition produced 1.40.
- [ ] Resolve runtime pet spell power inheritance: source starts at 110, first Firebolt at 2s uses 110, later casts use 116. Earlier initial-stat-only correction did not capture this transition. Combined diagnostic Firebolt 106.73 DPS versus source 106.66, production 101.32; do not implement a universal hardcoded +6 SP.
- [x] Center Conflagrate's direct damage roll on the full base-plus-power amount using source variance 0.2191235125. The old uniform 0..61.8 base damage incorrectly raised the mean and omitted power from the spread. Recheck DPS comparison after this correction; the earlier center-only diagnostic was 85.53 versus source 85.80 DPS, production 90.86.
- [ ] **Agony multiplier unresolved per user direction:** do not implement the earlier suggested multiplier change without a separate targeted investigation. All current diagnostic runs leave it unchanged.

## Multiplicative stacking follow-up

- Replaced independent damage-talent sums with products in Corruption (builder and packer), Agony, Wrack, Shadow Bolt, Shadowburn, Immolate and Lash of Pain. Firebolt already used separate factors. Source evidence: `spelldata/spells_auto_gen.go` talent rows, `core/spell_mod.go` direct/periodic modifier application, and pet-wide Unholy Power in `warlock/talents_demonology.go`.
- Added focused GPU damage-ratio and configuration regressions in `validation/talent_stacking.test.mjs`. Updated cache and compatibility IDs. Saved combat benchmarks predate this correction and must be rerun.
- Next: regenerate the combat comparison, then tackle APL group/condition preservation as a separate step.

## Fresh 1,000-iteration comparison after stacking corrections

1,000 fights per preset in each engine, seed 101, 180 seconds, same source revision `86d0920`: SM/Ruin -0.80%, Wrack -1.03%, Destruction +0.22%, Shadow Brand +0.60%, Fire Brand -0.20%. All lanes completed. See `FOREVER_GEAR_FREE_BENCHMARK.md` and JSON for per-spell splits and confidence intervals. This supersedes earlier saved current-DPS results, but remains diagnostic because import/APL blockers persist. The archived prior run also predates the Firebolt and Conflagrate fixes, so total improvements cannot be attributed solely to the latest stacking change.

## APL group preservation follow-up

- Group references now expand at their original priority position, including nested/repeated references, hidden-row filtering and per-reference variable overrides. Parent and child gates are combined without changing caller variable bindings. Missing/cyclic groups and variables raise explicit errors.
- Grouped actions use a strict condition path: OR branches become adjacent rows, every conjunction is retained, and all branches must compile before an action is emitted. The captured Boosts Blood Fury rows now retain both Doom-window and late-fight alternatives.
- Unsupported grouped actions/conditions remain in `candidate.importDiagnostics` with the original condition AST and are shown in import status. Item potion actions, Split Boosts time-to-execute arithmetic/Decimation aura predicates, and conjunctions beyond shader capacity remain unsupported. These are explicit omissions, not completed feature parity. Other top-level rows still use the older condition translator.
- Eight focused group/import tests, four existing bridge tests and the compatibility hash check pass. The broader UI suite still reports two stat expectation failures (438 vs 331; 313 vs 200). No combat comparison was rerun after this import behavior change; the saved benchmark describes the previous importer.
- Next: extend condition semantics for Split Boosts, then independent item cooldown actions.

## Comparison after group expansion

Fresh 1,000 iterations per preset per engine, seed 101: SM/Ruin -0.80%, Wrack -0.94%, Destruction +0.22%, Shadow Brand +0.60%, Fire Brand -0.20%. Wrack gains 0.482 DPS; the other four results are unchanged from the pre-group capture. All shader lanes completed. Source requests have no consumables and record no potion actions: potion support is not a remedy for these benchmark residuals. See the updated benchmark report for spell differences. Prioritize confirmed Wrack cost/channel delay/boundary corrections for this scenario; broad condition semantics remain a separate capability gap.

## Wrack cost and completed-channel delay correction

- Wrack base cost is now 200 mana (was 240). Existing mana-cost multipliers still apply.
- Imported `player.channelClipDelayMs` now survives bridge, normal import, config validation and packing. Default is 0ms; active source fixtures use 50ms. Packed unit is microseconds.
- A completed Wrack schedules its next action at channel end plus this delay. All six ticks and the channel debuff still end at six seconds; the delay does not extend them. Channel interruption support remains separate.
- Source evidence: `core/dot.go:periodicTick` waits after the final tick using `getChannelClipDelay`; `core/character.go` loads the setting. Prior source runtime probes measured 200 mana per Wrack.
- Focused GPU traces verify 200 mana per cast, unchanged tick spacing and exact next-decision times for 0/50/125ms in both fast and detailed shaders. Normal-import/packing, group, compatibility and service-worker checks pass. Cache and compatibility IDs updated.
- The separate strict/inclusive Wrack APL comparison discrepancy remains open.

Fresh 1,000-iteration comparison per engine (seed 101): Wrack 557.40 vs 558.98 DPS, -1.59 DPS (-0.28%, approximate 95% delta interval ±1.68 DPS). Improvement is +3.68 DPS from the previous group-preserving run. Other presets are unchanged. This interval includes zero, but aggregate agreement does not resolve remaining APL/tick differences.

## Repeatable race/stat sweep

Added `scripts/sweep_forever_parity.mjs` with editable `fixtures/forever_sweep_matrix.json`; usage and prerequisites in `docs/FOREVER_SWEEP.md`. Exporter accepts an optional scenario path, preserving its previous default behavior.

First run: all 300 combinations completed (5 presets × 5 races × 12 profiles), 100 fights per engine/case, seed 101. Mean absolute total-DPS difference 0.80%; 203/300 within 1%, 284/300 within 2%. Largest observed difference +3.65%: Gnome Shadow Brand at zero bonus hit. Several races show similar positive Shadow Brand residuals at low hit; inspect miss/application/curse behavior with higher-sample targeted cases before attributing a cause. Destruction Gnome high-regeneration case is -3.04%. Fire Brand retains its known -54 stamina / -540 health input difference across all 60 cells. Confidence intervals are unadjusted for the 300 comparisons; these are diagnostic screening results, not acceptance.

Results: `FOREVER_SWEEP.md` and `FOREVER_SWEEP.json`, including per-spell differences, exact requests, resolved configs, import diagnostics and source/app hashes. Existing canonical fixtures and five-preset comparison artifacts are unchanged. Matrix/statistics regression tests and end-to-end smoke test pass; saved artifact counts and local source hashes verified.

## Low-hit Shadow Brand investigation

Confirmed missing 60-second Doom cooldown in our shader. Forever consumes it even when the application misses; ours retries after the GCD. A source real-cast probe passes, and an in-memory cooldown-only GPU experiment reduces 1,000-trial zero-hit gaps: Gnome +3.04% → +1.33%, Orc +2.24% → +0.73%, Human +1.98% → +0.27%. No production mechanics changed. Gnome also has observed Eureka cast-count divergence (1.839 vs source 1.000 in the cooldown probe) because Split Boosts conditions are omitted and automatic fallback differs. Full measurements and reproduction: `docs/FOREVER_LOW_HIT_FINDINGS.md`. Next: implement/test Doom cooldown, then faithful Split Boosts/Eureka gates; do not tune hit or damage constants to mask these differences.

## Production Doom cooldown and Eureka investigation

Doom now has its own 60-second readiness state, starting on every cast including misses, in fast/detailed shaders. Forced-miss and guaranteed-hit GPU regressions pass. Cache/compatibility IDs updated. Nine targeted 1,000-fight comparisons reproduce the cooldown-only probe: Gnome zero-hit +1.33%, Orc +0.73%, Human +0.27%. Fresh ordinary five-preset baseline: SM/Ruin -0.80%, Wrack -0.28%, Destruction +0.22%, Shadow Brand +0.34%, Fire Brand -0.44%.

Eureka's source and app cooldowns both equal 120s; these are 180s fights. Source Split Boosts gates delay the first activation until execute/Decimation, around 119s in a source sample. Our automatic Doom-window fallback activates at 54.5s and 176.6s in its sample. In-memory source-like gating yields one use and reduces the Gnome zero-hit residual +1.33% → +0.90% (1,000 trials). Production Eureka behavior is unchanged. See `docs/FOREVER_EUREKA_FINDINGS.md`. Next: preserve actual Split Boosts condition semantics rather than imposing one use or changing cooldown length.

## Eureka and Split Boosts APL support

Eureka was already an off-GCD action; imports now preserve its conditions instead of omitting Split Boosts or stripping top-level racial predicates. Added duration-aware `time_to_execute(percent)` comparisons and independent Decimation-aura active/inactive predicates. Source execute arithmetic is recognized structurally, with variable resolution; OR alternatives preserve priority, redundant interval bounds simplify and contradictory alternatives disappear. Explicit imported Eureka rows suppress the automatic fallback and retain the source strategy. Potion actions remain unsupported diagnostics.

GPU tests pass in fast/detailed modes: unconditional Eureka at 0/120 seconds in a 180s fight; conditional source activation once during execute with Decimation; duration scaling to 360s; strict/inclusive comparison boundaries. Import, resolved-config validation, existing group/bridge/editor tests, cache and compatibility checks pass. See README for editable action syntax. The ordinary five-preset benchmark and full 300-cell sweep predate this APL change; the targeted comparison is saved separately as `FOREVER_EUREKA_APL_COMPARISON.*`.

Actual imported-APL validation: all nine targeted race/hit combinations completed at 1,000 trials per engine, seed 101; worst absolute total-DPS gap 0.98%. Gnome Eureka now averages one activation per fight in all three hit profiles, matching the source count. These are still diagnostic comparisons, not complete feature parity.
