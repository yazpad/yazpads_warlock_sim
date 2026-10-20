# Agony investigation — 2026-10-19

Investigated against the current local Forever source and the saved 1,000-iteration `gear-free-coe-v2` comparison. No combat implementation was changed and no new comparison was run during this investigation.

## Measured differences

| Preset | Forever / ours Agony DPS | Forever / ours ticks | Forever / ours damage per tick |
| --- | ---: | ---: | ---: |
| SM/Ruin | 45.84 / 37.40 | 27.086 / 26.281 | 304.65 / 256.19 |
| Wrack | 115.42 / 104.46 | 85.745 / 84.533 | 242.30 / 222.44 |
| Destruction | 25.11 / 29.78 | 28 / 27 | 161.45 / 198.55 |

Demonology Agony damage per tick is already close (Shadow Brand 198.49 / 198.87; Fire Brand 151.11 / 150.00). The issue is not an across-the-board base damage or coefficient mismatch.

## 1. Forever Amplify Curse does not consume on Agony

`sim/warlock/talents_affliction.go:registerAmplifyCurse` consumes the aura only when a completed spell matches the first effect's class flags. Current generated spell data gives that effect family 5, mask word 0 = 32768. Agony (11713) has family 5, mask word 0 = 1024. Their masks do not intersect. The source comment says Agony consumes the aura, but current code/data do not implement that comment.

`sim/warlock/agony.go:castNow` explicitly checks whether Amplify Curse is active and snapshots 1.5x when it is. Therefore another Agony applied during the 30-second aura also receives 1.5x, even though the first Agony already benefited.

Saved runtime aura metrics corroborate this: SM/Ruin and Wrack both have exactly 30 seconds average Amplify uptime, standard deviation zero, over 1,000 fights. Our `applyDot` automatically amplifies only the first eligible landed Agony per 180-second cooldown. This is a major damage-per-tick lead for both Affliction presets. Exact isolated DPS attribution has not been measured.

This appears to be a source consumption bug relative to its own stated behavior. Exact Forever parity and intended next-curse behavior must be represented explicitly; changing the global Agony coefficient would hide the distinction.

## 2. Destruction activates Amplify only in ours

**Historical finding, now fixed in our implementation:** Amplify is an explicit APL action; talent ownership no longer causes activation. See the current update below.

The source Destruction preset has the talent but no explicit Amplify action. Its captured aura uptime and proc count are zero. Our configuration enables Amplify from talent ownership and auto-uses it on the first Agony (one activation per fight). This explains why Amplify can push our Destruction Agony upward while the Affliction presets remain below source. Eligibility and activation policy are currently conflated.

The bridge additionally maps spell 18288 (Amplify Curse) to the Agony alias, so explicit source Amplify actions become extra Agony entries rather than an off-GCD aura action. SM/Ruin and Wrack each contain duplicate Agony bytecode entries as a result.

## 3. Periodic talent modifiers combine differently

Source Improved Agony applies a distinct `SpellMod_DotDamageDone_Pct`; Shadow Mastery's periodic effect is another. Core `applyDotDamageDonePercent` multiplies each factor into `PeriodicDamageMultiplier`.

For the selected Affliction presets the source factors are `1.10 * 1.10 = 1.21`. Our Agony code adds these as `1 + 0.10 + 0.10 = 1.20`. This is a confirmed approximately 0.83% damage difference at otherwise identical state, smaller than the Amplify difference. Rank amounts themselves (5% per Improved Agony rank) agree.

Agonizing Flames does not name Agony in the current spell masks; adding its generic `afBonus` here would be incorrect.

## 4. Spell power snapshot differs

Forever snapshots the spell-power share on application. Tick-time damage multipliers remain dynamic. Our tick handler reads `currentPower()` every tick instead. Temporary Blood Fury/trinket spell power can therefore change a running Agony in ours. Current base coefficient agrees: 0.133 per tick (ours 1.596 / 12), base 46, with base-only ramp 0.5 / 1 / 1.5 over thirds. Do not ramp the spell-power share or tune these matching constants.

## Remaining timing differences

SM/Ruin has 0.805 fewer ticks/fight in ours; Wrack has 1.212 fewer; Destruction has one fewer. Correcting amplification alone does not establish equal application timing, final-tick ordering, refresh behavior or fight-end handling. Use aligned action/tick traces after repairing Amplify representation and snapshot semantics.

## Work order

1. Represent Amplify as an explicit off-GCD action with aura lifetime/cooldown, separate from Agony and talent ownership.
2. Keep the observed source non-consumption behavior identifiable as a source discrepancy; decide parity semantics explicitly rather than silently changing general gameplay.
3. Multiply the distinct Agony periodic talent factors and snapshot spell power on application.
4. Re-capture imports and run 1,000-iteration comparisons, then investigate remaining tick counts with timelines. Current diagnostics have no aligned event trace, so first-divergence timing remains unproven.

## Implementation follow-up

Agony now snapshots its spell-power share on successful application in both execution modes. Tick damage uses that stored share, with damage multipliers still evaluated at tick time. No tests or combat comparison were run for this follow-up. Amplify behavior and periodic talent factor combination remain unchanged.

## Isolated double-application reproduction — confirmed

Added `scripts/forever_probes/amplify_double_dip_test.go` and a runner which temporarily installs the test in a disposable Forever build checkout and removes it afterward. The original `/home/aaron-ma/forever` checkout was not modified. Both direct execution and the companion runner passed with `-count=1` against `/tmp/forever-parity-source`.

```sh
python3 scripts/forever_probes/run_amplify_probe.py /tmp/forever-parity-source /tmp/go/bin/go
```

The test uses actual `Spell.Cast` calls, a talent setup with Amplify only, 300 spell power, guaranteed hit and a separate unamplified control. It casts Amplify exactly once at time zero, Agony at zero, Agony again at 24.1 seconds (after the first duration finishes), and a third Agony at 34 seconds. It checks first-tier tick snapshot bases to avoid crit/resist RNG and ramp-tier confounding. These values are pre-mitigation snapshot bases, not final hit damage or aggregate DPS.

| Observation | Control | With one Amplify cast | Ratio |
| --- | ---: | ---: | ---: |
| First Agony tick at 2s | 62.900 | 94.350 | 1.50x |
| Second Agony tick at 26.1s | 62.900 | 94.350 | 1.50x |
| Second Agony tick at 32.1s, after Amplify expiry | 62.900 | 94.350 | 1.50x |
| Third Agony tick at 36s | 62.900 | 62.900 | 1.00x |

The aura is active immediately after the first Agony and at the second application; it is inactive after 30 seconds. The test also asserts exactly one recorded Amplify cast. This confirms multiple Agony applications benefit from one Amplify in the current source, including the second application's snapshotted bonus surviving aura expiry. It does not establish intended live-game behavior or quantify total preset DPS impact.

## Updated source and explicit APL action — 2026-10-19

Forever revision `86d0920cae8445eaa90de9c17c3583cf171c19c5` explicitly consumes Amplify on `WarlockSpellBaneOfAgony`, correcting the mask mismatch above. The double-dip probe characterizes the earlier revision; its 1.5x second-cast expectation is intentionally historical and should not be used as a passing acceptance test for the corrected branch.

Our action 24 is now an explicit off-GCD Amplify with 180-second cooldown and 30-second aura. Agony snapshots active amplification and consumes the aura on cast, including misses. Import spell 18288 preserves Amplify's priority/conditions rather than generating duplicate Agony rows. The internal inactive-aura guard allows the compiler to omit only a redundant `!buff.amplify_curse` conjunct on Amplify actions while retaining the other two predicates. Other multi-condition translation limitations remain open.

The fresh 1,000-iteration comparison uses the updated source. SM/Ruin Agony is 38.68 / 37.40 DPS; Wrack 108.36 / 104.81; Destruction 25.11 / 24.27 (Forever / ours). Destruction now records zero Amplify activations in both engines. Matching periodic talent factor combination (1.21 vs 1.20) and remaining tick counts are still open; no constants were tuned to force agreement.
