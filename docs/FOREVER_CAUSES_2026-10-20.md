# Exact-cause follow-up — 2026-10-20

Production follow-up: these corrections are now applied. The [fresh production comparison](FOREVER_PRODUCTION_FIXES_2026-10-20.md) reports 300 cases at 1,000 fights each, MAE 1.945 DPS / MAPE 0.289%. Earlier statements below that production is unchanged describe the diagnostic stage.

This refines the earlier sweep findings using source debug logs, GPU action traces, source spell masks and 19 GPU counterfactuals of 1,000 fights each. Production combat code remains unchanged. The three combined probes explain the selected outliers to within 0.12% of the saved source means; that is diagnostic evidence, not acceptance across the full matrix.

## Current error

MAE is the mean of absolute case-mean DPS differences. MAPE is the mean of absolute percentage differences; cases have equal weight.

| Run | Cases | Fights / engine / case | MAE | MAPE | Signed bias |
| --- | ---: | ---: | ---: | ---: | ---: |
| Full screen | 300 | 100 | 4.642 DPS | 0.702% | +0.155 DPS |
| Selected follow-up | 60 | 1000 | 3.554 DPS | 0.549% | -1.155 DPS |

These runs cover different matrices and have different sampling noise. Their MAEs are not a before/after improvement measurement. No updated global MAE is claimed from three counterfactual cases.

## Destruction: mana affordability changes the rotation

Selected case: `destro__gnome__regen_high`.

Confirmed source/code differences:

- Incinerate's source row costs **325** base mana; our shader uses **355**. With Cataclysm this is 292.5 versus 319.5 mana per cast.
- Conflagrate's source row costs **255**, ours **265**. With Cataclysm this is 229.5 versus 238.5 mana.
- Source `autocastOtherCooldowns` activates Eureka at **0 and 120 seconds** here. Our automatic fallback waits for Doom's last six seconds. Explicit Split Boosts support fixed a different path; it did not fix this automatic path.
- Source Eureka scopes costs and direct damage by spell masks. Corruption, Agony, Doom, Siphon Life and **Incinerate** are excluded from both masks. The shader's generic cost discount and broad damage bonus affect them. Immolate's direct hit is eligible; its periodic ticks are not. Wrack's channel ticks have a separate eligible mask.
- Source MP5 is credited every **100ms** and before relevant resource operations; ours arrives in **five-second** lumps. This changes action affordability even when total regeneration is similar.
- Our heap compares only timestamps; source gives periodic events priority over GCD actions. The shader's `FIGHT_TIME_GE` also evaluates strict `>`. Both need correction, but neither their isolated probes nor their combination alone explains the total gap.

The full source-backed cost/policy/mask/timing probe first follows the source action sequence through **81.5s**. At **83.5s**, source pays 292.5 for the completed Incinerate and has **389.2 mana**, enough to select Corruption (340). The corresponding GPU trace has **319.2004 mana**, because its last MP5 credit was at 80s. It cannot afford Corruption, falls through to Incinerate, and changes later action and Doom refresh timing. Adding event-integrated MP5 to that combined probe restores the rotation's damage: **678.824 versus 679.285 source DPS** (-0.068%), from baseline **656.528** (-3.350%).

This establishes resource timing as the remaining trigger after the other confirmed mismatches are corrected. It does not assign additive DPS values to interacting bugs. The MP5 probe integrates credit at existing events; production should implement the source credit/check contract and test thresholds explicitly.

## Wrack: Nightfall scope and missing spirit regeneration

Selected case: `aff_wrack__undead__regen_low`.

- Source applies Shadow Trance's instant-cast modifier to **every eligible Shadow Bolt**, regardless of which APL row selects it. Our dedicated Nightfall row consumes it, but the higher-priority Shadow Bolt row for missing vulnerability routes through `beginCast` and hard-casts despite an active proc. The same omission can affect any ordinary Shadow Bolt row.
- Source restores spirit mana outside the five-second rule. Paid channels suppress that regeneration until channel end. Our kernel only restores configured MP5 and Life Tap mana; there is no spirit-regeneration implementation. Source's 1,000-fight resource totals contain **394.457 additional mana/fight** beyond Life Tap in this zero-bonus-regeneration profile (racial/base spirit remains present).
- Translating `min(DoT remains) >= 4s` as `> 4s` is a real importer bug, but changing it alone leaves this selected result unchanged. It is not the cause of this outlier.

Nightfall scope alone moves 528.006 to **530.385 DPS**. Spirit regeneration alone moves it to **533.008**. Together: **537.508 versus 537.056 source DPS** (+0.084%), versus baseline -1.685%. The diagnostic integrates spirit gain at events and tracks payment/channel windows; production must complete the same rules across all actions and modes. Source and GPU random streams are independent, so individual crit/proc timelines are not paired evidence.

## Fire Brand: a one-microsecond cooldown changes execute decisions

Selected case: `demo_fire_brand__orc__hit_16`.

- At Decimation rank 2, `60.0 * (1.0 - 0.45 * rank)` in float32 produces a cooldown that truncates to **6,000,001µs**, rather than source's **6,000,000µs**. Source and GPU choose the same actions from 119.1 through 167.3s. Soul Fire completes at **162.8s**. Source can cast it at **168.8s**; our readiness check fails by one microsecond, selecting Searing Pain instead. It does not cast Soul Fire until **173.3s**. This changes subsequent Corruption/Agony refreshes and leaves two extra completed Searing Pains in our result.
- Source Imp base mana is **576 + 264 × 5 = 1896**, multiplied by Fel Vitality: **2180.4** in this build. Our initial/cap formula uses **1150 × 1.15 = 1322.5**. The source trace confirms 2180.4 mana. Our pet-mana APL gate therefore triggers an early Life Tap (28.7s versus source's 48.3s in the captured fight).
- Source's first Firebolt lands at **2s**, ours at **0.3s**. Both can average 90 Firebolts while distributing resource and Brand events differently.
- Blood Pact independently explains the initial **54 stamina / 540 health** mismatch; it is not assumed to explain the Orc DPS gap.

Using exact integer cooldown microseconds alone moves **790.304 to 783.070 DPS** (+0.421% versus source). Adding the source Imp capacity and first Firebolt timing gives **780.664 versus 779.785 source DPS** (+0.113%), from baseline +1.349%. The probe uses the source-derived level-60 capacity; production should derive pet attributes/resources with talent multipliers and expose them to input comparison.

## Refined implementation order

1. **Correct mana accounting and affordability.** Take Incinerate/Conflagrate costs from the audited source rows. Replace five-second lump credits with source-compatible mana accrual/checks. Implement spirit regeneration with the five-second rule and paid-channel suppression, including capped/wasted gain. Cover the 83.5s Corruption threshold and post-channel windows in both shader modes.
2. **Apply Nightfall in shared Shadow Bolt execution.** Consume Shadow Trance for all eligible row paths, retaining cost/GCD, cast completion, impact and expiration rules. Test the missing-vulnerability row ahead of the explicit Nightfall row.
3. **Use exact cooldown arithmetic.** Preserve Decimation rank-dependent Soul Fire cooldowns in integer microseconds; test rank 0/1/2 at the exact ready timestamp and one microsecond before it. Do not advance readiness with arbitrary epsilon.
4. **Resolve pet inputs and timing.** Derive Imp capacity from base mana/intellect and Fel Vitality; retain source first Firebolt timing. Model active-Imp Blood Pact through normal stat aggregation, including aura strength and pet state. Continue runtime spell-power inheritance work separately.
5. **Preserve source cooldown policy and masks.** Represent `autocastOtherCooldowns` alongside explicit group rows. Use source Eureka cost/direct/channel eligibility and timing rather than a blanket multiplier; ensure ordinary periodic ticks are excluded.
6. **Specify event and predicate boundaries.** Implement source-compatible equal-time ordering, separate strict/inclusive predicates, and fight-end handling. Keep the earlier no-effect boundary probes as evidence against claiming either isolated change fixes the entire Destruction gap.
7. Run focused fast/detailed regressions, rerun these three references, then **the full 300-case matrix at 1,000 fights per engine**. Report new global MAE/MAPE and per-spell/action/input changes; close neither general import semantics nor combat parity based on these three small net deltas.

## Reproduction and evidence

```sh
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path node scripts/capture_forever_cause_traces.mjs --checkout /tmp/forever-run-source --go /tmp/go/bin/go
node scripts/investigate_forever_resource_causes.mjs
```

A prepared source checkout with generated protobufs and database assets is required. Optional positional probe IDs select individual counterfactuals and retain other previously recorded probe rows. All references use seed 101; counterfactuals run 1,000 fights each. They reuse the saved follow-up source means and do not modify production shaders.

- `FOREVER_RESOURCE_CAUSE_INVESTIGATION.json`: 19 executed variants, hashes, means, resources and per-spell differences. Probes are not additive and are not production acceptance tests.
- `FOREVER_CAUSE_TRACES.json`: source player casts, initial pet stats, source regeneration summaries and GPU events. Source starts and GPU completed events must be distinguished; the initial GPU decision is outside the recorded event stream.
- `FOREVER_EUREKA_MASK_AUDIT.json`: source spell costs and Eureka class-mask intersections. Proc and channel eligibility require the source's additional rules.
- Source mechanics: `sim/core/mana.go`, `sim/core/racials.go`, `sim/core/pending_action.go`, `sim/warlock/pets.go`, `sim/warlock/talents_affliction.go` at the recorded revision.

Residuals can include independent Monte Carlo sampling and remaining mechanics; the probes do not prove that every remaining difference is noise. No global MAE change is claimed before implementing and rerunning production.
