# Forever sweep investigation — 2026-10-20

Latest follow-up: [pet investigation](FOREVER_PET_FINDINGS_2026-10-20.md) corrects pet components and records full-rotation MAE 2.553 DPS / MAPE 0.386%, including the preserved Orc Command/source gap. Earlier measurements below are historical; the preceding full production report is archived under `fixtures/benchmark_history/race-stat-300-before-pet-fixes.*`.

Production follow-up: these corrections are now applied. The [fresh production comparison](FOREVER_PRODUCTION_FIXES_2026-10-20.md) reports 300 cases at 1,000 fights each, MAE 1.945 DPS / MAPE 0.289%. Earlier statements below that production is unchanged describe the diagnostic stage.

Follow-up: [traced causes and refined implementation order](FOREVER_CAUSES_2026-10-20.md) identify resource timing/costs/Eureka behavior, shared Nightfall execution and a one-microsecond Soul Fire cooldown error. Combined diagnostic variants bring the three selected outliers within 0.12%; production remains unchanged. The earlier investigation below is retained as evidence.

Audited the current bridge, shader, packing and focused regression tests before running comparisons. Updated the active TODO and added current-status notices to historical findings. Production mechanics are unchanged by this investigation.

## Execution

- Full screen: 300/300 cases, five presets × five races × twelve stat profiles, 100 fights per engine per case.
- Selected follow-up: 60/60 cases, five presets × Orc/Undead/Gnome × four hit/regeneration profiles, 1,000 fights per engine per case.
- Total source comparison sampling: 90,000 fights per engine. Three additional 1,000-fight GPU-only boundary probes reuse the saved source reference.
- All detailed lanes completed and breakdown aggregation reconciled damage. Seven focused test files passed: sweep, groups, Wrack timing, talent stacking, Eureka APL, Doom cooldown and breakdown.
- Source revision: `86d0920cae8445eaa90de9c17c3583cf171c19c5`. Go 1.25.4 and protoc-gen-go 1.36.10 were restored in `/tmp`; protobufs were generated in an isolated source clone. Compared with the archived run, source hash differences are confined to generated `.pb.go` files. Reports retain exact source/local hashes; generated-code provenance differs, so this is not an identical-binary rerun.

## Results

Deltas are WebGL minus Forever. Screen extremes are noisy; the selected follow-up is not the complete 300-case matrix at 1,000 samples.

| Preset | Screen mean absolute delta | Screen worst absolute delta | Follow-up worst absolute delta |
| --- | ---: | ---: | ---: |
| sm_ruin | 0.73% | 1.55% | 0.67% |
| aff_wrack | 0.66% | 2.00% | 1.69% |
| destro | 0.83% | 3.04% | 3.35% |
| demo_shadow_brand | 0.77% | 2.75% | 0.98% |
| demo_fire_brand | 0.53% | 1.71% | 1.35% |

## Confirmed remaining differences

1. **Fire Brand inputs:** all 60 screen cases and 12 follow-up cases have -54 stamina and -540 health. Other selected player inputs match in the remaining 240 screen cases. Source `sim/warlock/pets.go:registerBloodPact` applies the active Imp's aura during the build phase; our importer does not model that contribution. This is an input mismatch, not permission to hardcode final health. Account for pet state and aura strength, then test across races and attributes.
2. **High-regeneration Gnome Destruction:** at 1,000 fights, 656.53 versus 679.29 DPS: -3.35%, or -22.76 ± 2.07 DPS (approximate independent-engine 95% interval). Source averages 3 Doom casts/ticks, 1 Agony cast with no ticks, and 39 Incinerates. Ours has 2 Doom casts/ticks, 3 Agony casts with 27 ticks, and 36 Incinerates. Per-spell deltas: Doom -27.30 DPS, Agony +24.28, Incinerate -18.99. This is a reproducible rotation/timing difference, not chiefly Conflagrate's already-fixed damage center.
3. **Low-regeneration Undead Wrack:** -1.69%, -9.05 ± 1.65 DPS. Ours casts 17.586 Shadow Bolts versus 19.173, and 9.684 Wracks versus 9.479. Shadow Bolt is -10.95 DPS while Wrack is +3.52 DPS. Diagnose action allocation/APL timing rather than inferring a universally low Wrack coefficient. The report separately names source spell 1260198 and our Touch of the Grave; their opposite deltas are a normalization identity issue, not two independent missing damage mechanics.
4. **Orc hit-16 Fire Brand:** +1.35%, +10.52 ± 1.60 DPS. Initial Blood Pact inputs differ, and pet/runtime/action accounting remains open. This case has fixed action counts under its hit profile; broader timelines are needed before attributing the remaining total to a particular coefficient.
5. **Import semantics:** ordinary APL rows still truncate AND/OR conditions, collapse strict/inclusive `min` bounds and rewrite some action gates. Group expansion and explicit Split Boosts gates are implemented and tested; they do not fix every ordinary-row translation. Pet Firebolt still uses fixed `c.petSP`, rather than source runtime inheritance.

## Boundary probes: excluded as sole explanations

`node scripts/investigate_forever_sweep_boundaries.mjs` compares three in-memory shader variants with the saved 1,000-fight high-regeneration Gnome Destruction reference:

| Probe | WebGL DPS |
| --- | ---: |
| inclusive_fight_time | 656.528100 |
| end_after_equal_time | 656.528100 |
| inclusive_and_end_after | 656.528100 |

All three match baseline 656.528100 DPS. Changing `FIGHT_TIME_GE` from strict `>` to inclusive `>=`, moving the fight-end marker by one microsecond, or combining those edits does not explain this case. The predicate implementation is still semantically wrong; this probe does not establish how often it matters elsewhere. Next inspect the first Doom refresh boundary and subsequent decision/GCD scheduling with compatible source/GPU traces, including active-dot guards and equal-time tick/decision ordering. Do not apply these probes as a claimed fix for the measured -3.35%.

## Artifacts and limits

- `FOREVER_SWEEP.md` / `.json`: current full screen.
- `FOREVER_SWEEP_FOLLOWUP.md` / `.json`: selected higher-sample follow-up; matrix in `fixtures/forever_sweep_followup_matrix.json`.
- `FOREVER_SWEEP_BOUNDARY_INVESTIGATION.json`: GPU-only counterfactuals, reference-report and shader hashes, per-spell comparisons.
- `fixtures/benchmark_history/race-stat-300-pre-2026-10-20.md` / `.json.gz`: previous screen.

Approximate intervals describe Monte Carlo sampling only and are not adjusted for selection or multiple comparisons. Equal seeds do not align different engines' random streams. Selected player-field agreement does not establish full pet/encounter/feature agreement. No case is promoted to accepted combat parity by a small DPS delta. Browser integration and the entire repository suite were not run in this investigation.
