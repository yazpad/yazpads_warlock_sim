# Exported setup and throughput investigation

## Why the DPS differs

The user's supplied setup differs from the five checked-in Forever builds. Empty equipment does not imply zero bonus stats. The supplied Gnome Fire Brand setup has 328 bonus spell damage, 110 hit rating (11% hit), and 104 crit rating (7.428571% crit). It has food, Greater Wisdom and Improved Mana Spring, but lacks the presets' flask and most raid buffs. Its initial resolved spell damage is 410, versus 232 for the checked-in Orc Fire Brand preset.

Three import gaps were corrected:

- Convert level-60 raw hit and crit ratings using Forever's generated constants: 10 rating per hit percentage point, 14 per crit percentage point. Add independent spell-percent pseudo stats instead of replacing the rating contribution.
- Distinguish Improved Mana Spring (30 MP5) from regular (25 MP5). The supplied setup has 70 total MP5.
- Treat an omitted `curseOptions` as Elements: its protobuf value is zero. It does not mean NoCurse (value 4). This omission caused the importer to remove the assigned curse and its damage modifiers.

Hit/crit form inputs now accept fractional percentages without a step-validation failure. A local browser inspection confirmed valid form inputs and retained SP 410, bonus hit 12% including the talent, bonus crit 7.428571%, MP5 70 and assigned Elements after editing the duration and exporting again.

### Fresh comparison

Local Forever revision: `86d0920cae8445eaa90de9c17c3583cf171c19c5`; 10,000 fights per engine, seed 101. Combat settings were transcribed from the user's export; its Fire Brand APL matches the checked-in APL. Explicit zero item-swap and other inactive fields are omitted from the transcription. Source retains 180±5-second duration; our engine uses fixed 180 seconds.

| Encounter interpretation | Forever DPS | Our DPS |
| --- | ---: | ---: |
| Literal exported encounter | 548.106 | 565.548 |
| Normal execute-phase fields supplied | 565.498 | 565.548 |

The export contains execute proportions for 20% and 35%, but omits the newer 25%, 45% and 90% fields. In this local Forever revision, omitted 90% leaves phase progression blocked until the end; the reference does not cast execute Soul Fire or Eureka. The separate normal-phase experiment supplies 0.25, 0.45 and 0.90. The production GPU engine already uses normal fixed execute phases. This is an encounter interpretation difference, not a reason to tune spell damage.

The user's observed approximately 580 DPS has **not** been reproduced exactly. With the explicitly documented normal-phase encounter, the two engines differ by 0.050 DPS. This result should not be presented as literal-export parity. Details: [FOREVER_USER_SETUP_COMPARISON.json](FOREVER_USER_SETUP_COMPARISON.json).

The earlier claim that equipment alone explained the difference was incomplete: the export's bonus stats are substantial.

## Throughput

A real shader regression is reproduced with matched configs. The comparison uses the earlier optimized revision `1ac4e55d6` and the current production shader. Native AMD/Mesa EGL/GLES3, fast mode, 16,384 fights per draw; two warmups and five measured draws per stage. Reversed stage order: old/current/current/old. GPU draw plus finish only, excluding compile, browser readback, JavaScript decoding, diagnostics and summary time. These are not the user's browser fights/second.

| Same input configuration | Earlier draw ms | Current draw ms | More GPU time | Lower GPU throughput |
| --- | ---: | ---: | ---: | ---: |
| Fire Brand, Imp | 340.73 | 598.64 | 75.7% | 43.1% |
| SM/Ruin, Succubus | 450.17 | 530.10 | 17.8% | 15.1% |
| SM/Ruin, no pet | 276.94 | 314.66 | 13.6% | 12.0% |

Evidence: [FOREVER_DEFAULTS_PERFORMANCE.json](FOREVER_DEFAULTS_PERFORMANCE.json).

The Imp's first fight grows from 460 to 551 events because Firebolt now snapshots at cast completion and lands in a separate missile-impact event. A temporary diagnostic variant that collapses those into immediate damage reduces the current Fire Brand draw from 596.32 to 538.37 ms (about 10.8% more time with travel). This variant changes mechanics and is not applied to production. It shows missile events explain only part of the regression. Evidence: [FOREVER_IMP_TRAVEL_PERFORMANCE.json](FOREVER_IMP_TRAVEL_PERFORMANCE.json).

Other confirmed changes: fast state grows from 102 to 109 words, shader text from 55,366 to 60,024 characters, detailed output from 10 to 11 stripes, and full state from 262 to 289 words. More control flow/live state can affect compiler register allocation and occupancy, but that mechanism has not been isolated here. The remaining shader slowdown is not fully attributed. The app also now starts from a different build, with a different APL and combat workload, so the user's old/new default runs are not a controlled performance comparison.

The displayed fights/second includes compilation, readback, decode, summary and diagnostic replay time. The matched profile confirms GPU cost alone is significant; it does not establish the exact contribution of every component on the user's device. No production performance optimization is claimed by this investigation.

Reproduce the matched comparison:

```sh
BENCH_REVISIONS=1ac4e55d6,WORKTREE,WORKTREE,1ac4e55d6 BENCH_OUTPUT=FOREVER_DEFAULTS_PERFORMANCE.json node scripts/benchmark_optimized_shader.mjs
```
