# Wrack/DoT timing, Firebolt and Conflagrate investigation

Current status (2026-10-20): Wrack cost/channel delay, multiplicative talent factors and centered Conflagrate variance are implemented and focused regressions pass. The ordinary-row strict/inclusive `min` predicate and pet runtime inheritance remain open. Earlier proposed fixes and benchmark numbers below are historical; use `FOREVER_SWEEP.md` for the fresh production comparison.

Current follow-up: Wrack cost and completed-channel delay are now fixed and tested in production; the strict/inclusive predicate remains open. The fresh benchmark reports 557.40 WebGL vs 558.98 Forever DPS at 1,000 iterations each. Firebolt stacking and centered Conflagrate variance were also implemented after this investigation. Values below are the original diagnostic evidence.

Source: Forever `86d0920cae8445eaa90de9c17c3583cf171c19c5`. Baseline: saved 1,000-iteration `gear-free-coe-v2` comparison. Production mechanics and the Agony multiplier were not changed during this investigation. All GPU experiments modify configurations/shader strings only in memory.

## Wrack and DoT timing

Three confirmed differences:

1. **Boundary predicate:** source `min(Corruption remaining, Agony remaining) >= 4s` becomes `> 4s` for both DoTs in the bridge. `convertForeverCondition` currently maps both `OpGe` and `OpGt` to `>` for `min`. This is a translation bug, independent of damage formulas.
2. **Channel resource cost:** source runtime logs show 200 mana per Wrack. Our `baseCost` returns 240. That affects Life Tap scheduling and subsequent spell selection.
3. **Post-channel delay:** source request explicitly sets `channelClipDelayMs: 50`. Source logs show a Wrack at 13.50s ending at 19.50s and the next action at 19.55s; another at 25.55s ends at 31.55s with the next action at 31.60s. Ours starts the next decision at precisely 6 seconds without importing this delay. This applies to completed channels too, not only interruption support.

Measured 1,000-iteration diagnostics (same seed and existing source reference):

| Configuration | Total DPS | Wrack casts | Wrack ticks | Corruption ticks | Agony ticks |
| --- | ---: | ---: | ---: | ---: | ---: |
| Forever baseline | 558.98 | 8.916 | 52.330 | 52.274 | 85.745 |
| Our production baseline | 550.63 | 8.264 | 47.689 | 50.945 | 84.533 |
| Our diagnostic: `>= 4s` only | 549.70 | 8.376 | 48.537 | 50.937 | 84.329 |
| Our diagnostic: `>= 4s`, 200 mana, 50ms delay | 554.20 | 8.253 | 48.208 | 51.653 | 85.494 |

The strict-boundary bug is real, but fixing it alone does not raise total DPS: the rotation reallocates time. The three confirmed corrections together recover 3.57 DPS (gap shrinks from -8.35 to -4.78 DPS), while Wrack cast/tick counts remain mismatched. The experiment does not isolate which of cost or delay accounts for each part of the change, and it does not prove the remaining APL is equivalent.

**Fight-end check:** a diagnostic moving our fight-end marker one microsecond later adds only 0.44 DPS, with Corruption ticks unchanged and just 0.036 more Wrack ticks/fight. Fight-end handling merits correction, but this experiment does not explain the bulk of the missing channel/DoT ticks. Our heap also lacks explicit equal-time event priorities; a separate action/tick trace comparison is still needed before prescribing the full ordering fix.

Remaining investigation: complete APL gates/groups, resource fallthrough, channel/application timing, Nightfall/ISB timing, same-time tick/expiry/decision ordering and channel behavior near the fight end. Equal seeds do not align engine RNG streams, so a different action late in one sample is not by itself proof of an APL bug.

## Firebolt: modifier composition and runtime inheritance

Two confirmed differences explain nearly the whole current Firebolt damage deficit:

- Our talent formula adds Unholy Power and Improved Imp: `1 + 0.10 + 0.30 = 1.40` before other factors. Source applies a pet-wide 1.10 multiplier and a separate 1.30 spell modifier: `1.43` combined.
- Initial source pet spell power is **110**, but diagnostic logging shows **110 at the first Firebolt (2s), then 116 at the second (4s) and subsequent casts**. Player spell power is 560. Our earlier subtraction of Demonic Knowledge's owner bonus matched only initial stats; it leaves our pet at 110 throughout combat. Runtime inheritance cannot be inferred from reset stats alone. The source updates inheritance from the buffed owner value during combat.

Our current Firebolt uses coefficient `2 / 3.5` (~0.571429); the source row uses ~0.571. This is a small additional formula difference.

| Firebolt diagnostic | Firebolt DPS |
| --- | ---: |
| Forever | 106.66 |
| Our production baseline | 101.32 |
| Separate the two talent multipliers | 103.49 |
| Also use 116 SP and source coefficient | 106.73 |

The final probe uses 116 SP for every Firebolt, so it deliberately approximates the source's first-cast transition. It is a diagnostic, not a complete implementation of source inheritance timing or variance. A proper fix must model the state transition rather than hardcode +6 SP to every pet. Initial Firebolt timing also differs: source first damage at 2s with zero distance; ours starts at 0.3s. Both currently average 90 casts, so equal cast counts do not prove equal Brand/proc timing.

## Conflagrate: damage distribution has the wrong center

The source row's `Average()` is **282** at level 60, with spell-power coefficient **0.429**. Core applies a centered variance roll to the full direct amount (including spell power): `amount *= Uniform(1 - variance/2, 1 + variance/2)`, with variance ~0.2191235.

Ours uses `282 + Uniform(0, 61.8) + 0.429 * SP`, making the base mean **312.9**. This introduces approximately 30.9 extra base damage before multipliers. It also applies the random spread to a different portion of the formula.

A 1,000-iteration diagnostic that removes just the extra mean (retaining the RNG draw to avoid perturbing all later draws) moves our Conflagrate from **90.86 to 85.53 DPS**, versus source **85.80**. Whole Destruction DPS moves from **643.23 to 637.90**, versus source **637.71**. This diagnostic removes Conflagrate variance rather than fully reproducing source variance; it establishes the extra mean's impact, not distribution parity.

## Reproduction and artifacts

```sh
node scripts/investigate_forever_timing_damage.mjs
python3 scripts/forever_probes/capture_runtime_probe.py /tmp/forever-parity-amplify-fixed /tmp/go/bin/go
```

- `FOREVER_TIMING_DAMAGE_INVESTIGATION.json`: diagnostic spell breakdowns and saved source comparisons. Six experiments, 1,000 iterations each; not new source runs or accepted parity.
- `FOREVER_RUNTIME_PROBE.json`: single-iteration source runtime stat logs and cast/aura timestamps, with source file hashes. Instrumentation was applied only to an isolated temporary source copy.
- Root `FOREVER_GEAR_FREE_BENCHMARK.*` still describe production behavior before these proposed fixes.

Next fixes: faithfully preserve the Wrack comparison operator, import the explicit channel delay and source cost; center Conflagrate's variance as source does; separate Firebolt modifier factors and resolve the pet's runtime inheritance. Leave the questionable Agony multiplier unchanged pending a separate targeted source/mechanic check.
