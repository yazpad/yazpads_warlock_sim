# Doom tick damage, dynamic buffs and Wrack overlap

Doom's ordinary tick formula already matches Forever. The apparent higher-sample damage differences are explained by different realized critical tick counts in the constant-buff cases. One separate source mismatch was confirmed and fixed: **Wrack incorrectly increased Doom damage by 10%**.

## What already matches

The generated source row for spell **603** gives **1742 base damage + 4 × spell power**, no random damage variance, one tick after 60 seconds, and a 60-second cooldown. The application rolls hit once; a landed application's tick can crit without another hit roll. The existing hit/miss cooldown behavior is preserved.

`spelldata.DotConfig` uses no snapshot callback, and `core.CalcPeriodicDamage` reads the current spell power and attacker modifiers when the tick happens. Controlled source/GPU cases confirm this: expired pull-time Blood Fury does not affect the tick, while Blood Fury activated shortly before the tick does. No coefficient or ordinary damage multiplier was changed.

In the existing 20-case, 10,000-fight report, eight constant-power cases (baseline/SP 1000 across Human, Undead, Troll and Gnome) reconcile after accounting for realized crit counts:

```text
noncritical-equivalent tick = total Doom damage
  / (tick count + (crit multiplier − 1) × critical tick count)
```

A read-only source probe also evaluates the actual Doom spell's `SpellCritChance` for these requests. Source and packed GPU expected probabilities match within 1e-7 (for example, Troll: 0.21782 in both engines). Thus this check distinguishes realized crit-count variation from a configured crit-rate mismatch.

The baseline normalized damage is **4527.820000** in source and **4527.8203125** on GPU. At SP 1000 it is **6947.820000** versus **6947.8203125**. Maximum difference across these checks is **0.000313 damage**, consistent with float32 precision.

For example, Troll baseline averages **0.4503 GPU critical ticks versus 0.4336 source critical ticks per fight**, with two total ticks each. That difference alone explains the observed **+0.420 DPS** Doom gap. The same crit-count difference scales to roughly +0.645 DPS at SP 1000. These engines use independent random streams; equal seed values do not pair outcomes. This establishes the cause of these measured means without fitting the base formula to sampling noise.

## Confirmed Wrack overlap bug

Forever's Wrack effect mask names **Corruption and Agony**, excluding Doom. The old GPU unconditionally used the active Wrack multiplier in its Doom tick formula.

A controlled 65-second case applies Doom at the pull, starts Wrack at 57 seconds and observes Doom at 60 seconds, while Wrack is still active until 63 seconds. Thus the mask exclusion is distinguished from mere buff expiration.

| Scenario | Source noncritical-equivalent tick | Old GPU | Corrected GPU |
| --- | ---: | ---: | ---: |
| Plain Doom | 4527.820 | 4527.820 | 4527.820 |
| Doom ticking during Wrack | 4527.820 | **4980.603** | **4527.820** |
| Orc, no Blood Fury at tick | 4527.820 | 4527.820 | 4527.820 |
| Pull-time Blood Fury expired | 4527.820 | 4527.820 | 4527.820 |
| Blood Fury active at tick | 4769.820 | 4769.820 | 4769.820 |

The production change removes only Wrack's multiplier from Doom. Corruption and Agony retain it. Doom still counts as another Affliction effect for Soul Siphon, as established in the earlier Wrack investigation.

[Complete source audit, requests, logs, GPU results and crit normalization](../FOREVER_DOOM_TICK_INVESTIGATION.json). Source revision: `86d0920cae8445eaa90de9c17c3583cf171c19c5`. Relevant source files: `sim/warlock/doom.go`, `sim/warlock/wrack.go`, `sim/core/spelldata/resolve_aura.go`, `sim/core/spell_result.go`, and `sim/core/spell_outcome.go`. Source engine code is unmodified.

## Scope and interpretation

None of the standard 300 configurations combines Doom and Wrack, so this overlap fix is not expected to lower their MAE. It corrects supported custom configurations. The rerun confirms **1.177 DPS MAE / 0.176% MAPE**, unchanged at the reported precision. All case means match the previous run within 0.000001 DPS, and all checked inputs match; the balanced 20-case × 10,000-fight result from the previous stage remains **0.442 DPS MAE**.

Remaining standard-matrix errors should be separated from independent-engine crit sampling before another damage coefficient change. Full projectile damage snapshots remain open. The controlled Orc probes explicitly schedule racial actions, because the app's legacy fallback otherwise adds a racial activation that a source-only custom APL may omit. An additional importer issue observed during this setup—dropping constant-false racial rows and thereby exposing fallback—is recorded separately in the TODO.

[Full matched comparison and current hashes](../FOREVER_DOOM_TICK_FIX_COMPARISON.json).

## Validation and reproduction

The new GPU regression covers SP 0/250/1000, active/inactive Wrack, deterministic critical damage, damage modifiers, expired and active Blood Fury, and identical fast/detailed totals. The cooldown regression remains included. Compatibility IDs and the service-worker cache were refreshed.

**Checks:** the new Doom GPU regression passes all 20 controlled mode/profile combinations. The complete suite has **179 passes and the same 16 existing failures** as the Shadowburn baseline, with no new failing test names. Existing cooldown/Wrack tests, compatibility hashes and `git diff --check` pass.

```sh
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path node scripts/investigate_forever_doom_ticks.mjs
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path node scripts/sweep_forever_parity.mjs --checkout /tmp/forever-run-source --go /tmp/go/bin/go --iterations 1000
```

The investigator binds the archived pre-fix shader to the pre-fix report hash, probes only the Doom/Wrack factor change in memory, and validates the corrected controlled ticks against source within 0.01 damage. Source rows and wrapper hashes are retained.
