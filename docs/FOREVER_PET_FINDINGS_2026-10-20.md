# Pet parity investigation and fixes — 2026-10-20

The pet fixes are applied to the production detailed and fast shaders. Isolated pet agreement improves substantially; **overall rotation MAE increases**, exposing compensating player errors and a deliberate Orc/source difference. This is not a total-MAE improvement claim.

## Results

Both pet-only runs cover **120 configurations × 1,000 fights per engine**, seed 101: Imp/Succubus with and without Demonic Knowledge, Human/Orc/Undead, and ten spell-power/intellect/hit/crit profiles. Source player actions are replaced by a 180s Wait; a diagnostic GPU fixture skips player decisions. Source talents, pet resources, sacrifice state, external CoE and stats remain declared. This does not implement Wait in the app importer.

| Comparison | Before MAE | After MAE |
| --- | ---: | ---: |
| All 120 isolated pet cases | 1.287 DPS | 0.765 DPS |
| 80 non-Orc isolated pet cases | 1.568 DPS | **0.028 DPS** |
| Full 300-case rotations, 1,000 fights/engine | 1.945 DPS | **2.553 DPS** |

Full-rotation MAPE changes from 0.289% to **0.386%**. Every detailed lane completed; all selected player/packed input checks still match. Removing a pet deficit can expose an offsetting player overestimate; total DPS alone did not identify those component errors.

## Source-backed pet corrections

1. **Demonic Knowledge and temporary spell power inherit on the pet heartbeat.** Source `sim/core/constants.go` defines a 5.25s interval; `environment.go` randomizes its phase. The pet initially inherits the owner before the active-pet owner aura is applied. A 500-SP owner with rank-3 Demonic Knowledge therefore starts the pet at 110 SP, then reaches 116 on the first heartbeat. Runtime Blood Fury and modeled spell-power trinket gains/expirations queue the same delayed inheritance. There is no unconditional +6 SP adjustment.
2. **Attack power uses the source model.** Succubus base AP is 186, with 17% of owner generic SP plus the stronger school bonus. The shader previously inherited 1/6 of generic SP and omitted base AP. The source base weapon average is `0.698 × 60.45291519165039 × 2`, with ±21.5% variation; the shader previously used a fixed 101 base.
3. **The white-attack table suppresses crit.** Against a level-63 target with no weapon-skill bonus, source removes 3 percentage points from skill and up to 1.8 from non-base crit. Dodge remains 6.5%, glance chance 40%, and glance damage rolls between 0.55 and 0.75. Previously crit suppression was absent and glance damage was fixed at the mean. The initial swing now follows source's random 0–99ms delay rather than a fixed 1s.
4. **Lash inherits global crit.** Source pets inherit the owner's SpellCritPercent stat. The old Lash path used `shadowCrit`, adding the owner's school-only Malevolence bonus. Both pet spells now use global crit. Source row 11780 has 50 base damage, coefficient 0.4289999902, 160 mana and 12s cooldown. Lash starts at 0s and can land at 180s: 16 casts when resources allow, versus the old fixed 0.5s start and 15.
5. **Firebolt checks affordability at cast start.** A cast cannot start without 115 mana. It finishes after 2s, then the next cast either starts or waits based on missing mana/regen. Previously the shader checked mana at the damage event, allowing regeneration during a cast that could not have started. Pet regeneration credits on the source's global 100ms boundaries; mana shortages are rechecked with a minimum 100ms wait. Source row 11763 supplies 45.20000076 base damage, coefficient 0.57099998 and centered variance 0.113636367 over the whole hit.
6. **Fight-end pet hits are retained.** Pet completions at exactly the declared endpoint run before the fight-end marker. With sufficient resources, Firebolt lands 90 times through 180s rather than 89. Periodic/inheritance events retain priority before ordinary actions at equal time.

Packing/simulation compatibility IDs and service-worker cache version are updated.

## The remaining Orc discrepancy is explicit

Our app deliberately applies **5% Command** to pet spells and melee, as recorded in the earlier beta work. The recorded Forever revision (`86d0920cae8445eaa90de9c17c3583cf171c19c5`) applies Savage and Blood Fury but contains no Command pet multiplier. It is not appropriate to silently remove the existing feature merely to improve a score. The initial pet run preserved the bonus pending user preference. The user subsequently confirmed that Command should be removed; production now omits this multiplier while retaining Savage and Blood Fury. Updated results follow below.

The 40 Orc isolated cases have 2.240 DPS MAE after the other fixes. Analytically dividing only their pet-only damage by 1.05 gives 0.025 DPS MAE against the source. This is an **analytical counterfactual**, not a production rerun or a change to the source engine. In the full matrix, Orc MAE rises from 2.111 to 4.354 DPS as other pet deficits disappear.

## What the corrected pets expose next

- Wrack is now about **+2.33 DPS** on average across its 60 full-rotation cases. Source rolls application hit before applying the channel; the shader currently schedules six ticks unconditionally. Source Soul Siphon counts the caster's other tagged Affliction auras and assigned curses; the shader adds an unconditional `+1`, including in the reference NoCurse scenarios. These are concrete code differences to isolate next, not yet measured corrections in this work.
- Shadow Brand still reallocates damage/actions between Shadow Bolt (+3.77 DPS mean) and Searing Pain (-2.22). Pet-only agreement does not close its player APL/timing gaps.
- Remaining pet/main-rotation edge cases include travel/movement beyond the zero-distance baseline, full pet stat/proc support and all source equal-time priorities. Initial player-field agreement is not exhaustive feature acceptance.

## Validation and artifacts

New GPU regressions check stronger-school/base-AP packing, 90 Firebolts and 16 Lashes including the endpoint, global versus school-only crit, initial and runtime inheritance, Blood Fury gain/expiry, shared fast/detailed results and the statistical melee dodge/glance/crit table. The focused suite has **24 passing tests**, plus the compatibility-source hash check. The full suite reports **174 passed / 16 failed**, retaining the same failing assertions as the preceding full-suite run; the three new pet tests pass. This is not a green full-suite claim.

- `FOREVER_PET_BEFORE.*` and `FOREVER_PET_AFTER.*`: pet-only requests/configs, source stats/results, per-action differences and source-row audit.
- `FOREVER_PET_FIX_COMPARISON.json`: before/after metrics, subgroup results and provenance hashes.
- `FOREVER_SWEEP.*`: new full-rotation 300-case run.
- `fixtures/benchmark_history/race-stat-300-before-pet-fixes.*`: previous full 1,000-fight production run; JSON compressed.

```sh
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path node scripts/investigate_forever_pets.mjs --out FOREVER_PET_BEFORE
# After changing the pet simulator, reuse the exact recorded source cases:
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path node scripts/investigate_forever_pets.mjs --out FOREVER_PET_AFTER --reuse FOREVER_PET_BEFORE.json
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path node scripts/sweep_forever_parity.mjs --checkout /tmp/forever-run-source --go /tmp/go/bin/go --iterations 1000
node threejs_webgl_des/validation/forever_pets.test.mjs
```

A prepared source checkout, protobufs and database are required. Before/after files preserve their recorded kernel hashes; rerunning the first command now creates a new baseline from current production. Sampling noise remains, and matching aggregate pet DPS alone is not proof of complete distributions or event timelines.

## Confirmed Command removal

Orc Command removed per user instruction: full **300-case × 1,000-fight** comparison improves MAE **2.553 → 1.994 DPS** (MAPE **0.303%**). Savage and Blood Fury remain. Nine pet/Orc/cache checks pass; compatibility hashes updated. Source requests, seed and matrix are unchanged. [Measured comparison](../FOREVER_COMMAND_REMOVAL_COMPARISON.json).
