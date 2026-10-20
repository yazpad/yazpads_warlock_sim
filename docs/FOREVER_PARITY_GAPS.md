# Forever parity gaps

Active configurations now use **gear-free-v1** across all five presets. Consult the [current status report](../PARITY_REPORT_FOREVER.md) and [active todo](../FOREVER_PARITY_FRAMEWORK_TODO.md). Gear-related observations below are deferred integration notes; geared SM/Ruin numbers and legacy fixture statuses have been superseded by fresh gear-free captures.

Source audit: 2026-10-19. Reproduce with `node scripts/audit_forever_import.mjs`; see `FOREVER_IMPORT_AUDIT.md` and its JSON companion for source paths, translated candidates, and fixture snapshots. These findings describe the local Forever checkout and current bridge, not every feature of Forever.

Use the [active prioritized todo](../FOREVER_PARITY_FRAMEWORK_TODO.md) for work order and completion status. The table below groups supporting findings; its priority numbers predate the live SM/Ruin comparison. Base stats and import resolution now come first.

## Resolve configuration before attributing DPS differences

SM/Ruin now has a live source export and its actual ordinary-import configuration; its scoring is blocked because inputs differ. The other four fixtures still contain hand-resolved configurations. See the [SM/Ruin comparison](../FOREVER_INPUT_COMPARISON_sm_ruin.md). A close aggregate DPS result does not establish import or feature parity. Do not tune hit, crit, or multipliers to close a DPS difference without a resolved Go export explaining each contribution.

| Priority | Difference | Required work |
| --- | --- | --- |
| 1 | Group expansion is implemented; some grouped actions remain unsupported | Boosts Blood Fury retains both condition branches. Nested/repeated groups, variables and cycles are handled. Split Boosts time-to-execute arithmetic and Decimation-aura gates now compile into explicit racial APL rows. Item actions remain diagnosed and omitted. |
| 1 | Moonkin Aura, Judgement of Wisdom, armor debuffs, Gift of Arthas, Fortitude and Spirit are unmapped | Resolve their effects in the actual import pipeline, including pet damage and mana effects. Compare final stats with Go rather than inferring them from total DPS. |
| 1 | Assigned curse action and `curseOptions` are skipped | Represent curse choice, cast cost, GCD, debuff application and refresh; stop assuming permanent free uptime. |
| 1 | Explosive and conjured consumables are dropped | Implement their own actions, charges and cooldowns; include their damage/resources in exports. |
| 1 | Boolean APL translation loses meaning | Preserve every AND/OR branch, negation, variable semantics, strict/inclusive comparisons and min comparisons. Unknown nodes must produce diagnostics rather than become true. Shader currently allows only two general condition slots. |
| 1 | Action rewrites override conditions | Preserve racial gates, Soul Fire eligibility, Conflagrate predicates and Nightfall conditions. Amplify now maps to its own explicit off-GCD action, with no automatic activation from talent ownership. Remaining general condition/group losses still require work; see the main parity TODO. |
| 2 | Wrack cannot be clipped | Add interrupt predicates, tick-boundary reevaluation, clip delay, recast policy, cancellation of future ticks and debuff expiry. Current shader schedules six ticks and the next action at +6s. |
| 2 | Precasting/prepull actions are ignored | Support negative-time scheduling, initial mana/GCD/cooldowns and spell impacts crossing pull. None of the five current source presets supplies prepull actions; add explicit comparison cases before attributing DPS to this gap. |
| 2 | Gear import preserves only item IDs | Audit enchants, item effects, sets and on-use/proc timing. The bridge silently drops extra equipment metadata. |
| 2 | Encounter import supplies fixed defaults | Resolve source encounter duration, target and variations. Distance now follows source unless explicitly overridden for a benchmark. |
| 2 | Pet and class options are incomplete | Audit armor, shards, supported summon types, pet resources, professions and racial compatibility; unknown races/pets currently fall back silently. |
| 2 | Timed potion uses generic trinket fields | Preserve independent potion and trinket slots, cooldowns and APL activation rather than conflating the effects. |
| 3 | Travel, resistance and event order differ | Compare spell-level casts, hits, ticks, uptime, partial resists and pet impacts after configuration is aligned. |

## Concrete changes made

- Preserve source `distanceFromTarget` on normal bridge imports; explicit `distance: 0` still overrides it for suite comparisons.
- Pass book ranks and timed spell-power settings from imported candidates into final configuration building.
- Pass imported target armor and resistance into final configuration building.
- Add a repeatable read-only audit listing unmapped settings, lossy APL constructs and condition compilation failures across all five source presets.

## Additional confirmed mechanics discrepancy

Forever `sim/warlock/wrack.go` restricts Wrack's 10% amplification to Corruption and Bane of Agony. Our shader also multiplies Doom damage by 1.10 while Wrack is active (`src/kernel.js`, Doom tick). Correct this with a dedicated mechanic comparison; it may be irrelevant to a Wrack preset without Doom.

## Evidence needed for a trustworthy comparison

Export the exact Go request plus resolved stats, encounter, cooldowns, initial state and per-spell results. Record the same inputs after our import resolution. Report these configuration differences before DPS tiers. Match seeds only where RNG algorithms and draw ordering are comparable; otherwise compare distributions across enough iterations. Separate unsupported features from measured damage differences. First-event divergence remains unavailable until both engines export compatible event timelines.

The audit is an inventory of observed import losses, not proof that every combat mechanic has been checked. Findings repeat across builds and include settings whose damage impact still needs investigation.
