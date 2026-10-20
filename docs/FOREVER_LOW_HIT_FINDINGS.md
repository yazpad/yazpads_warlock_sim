# Low-hit Shadow Brand investigation

Follow-up: Doom cooldown is now implemented and tested in production. `FOREVER_DOOM_FIXED_COMPARISON.*` reproduces the cooldown-only diagnostic below. Eureka has been investigated separately in `FOREVER_EUREKA_FINDINGS.md`; its cooldown is correct but its fallback activation policy differs. The original investigation below is retained as evidence.

Forever revision `86d0920cae8445eaa90de9c17c3583cf171c19c5`. Nine targeted race/hit combinations, 1,000 fights per engine, seed 101, same gear-free external-CoE scenario. No production mechanics changed during this investigation.

## Confirmed missing Doom cooldown

Forever spell data gives Bane of Doom (603) a 60-second cooldown. `spelldata/resolve_spell.go:castConfig` installs its timer; `core/cast.go` triggers cooldown before applying spell effects. `warlock/doom.go` separately rolls the application hit. Consequently a miss consumes the cooldown.

The production WebGL shader has no Doom cooldown state or readiness check. After a miss, its next decision can retry following the 1.5-second GCD. The two successful applications therefore still produce almost exactly two Doom ticks per fight at low hit, rather than the source average of about 1.66–1.68 at zero bonus hit. This disproportionately benefits low-hit configurations.

A real-cast Go probe passed: forced miss at 0s, exactly one recorded miss, 60 seconds remaining on cooldown; unavailable at 1.5s; available and cast again at 60s. The probe runs only in the disposable build checkout and removes its temporary test file.

## Measured cooldown-only diagnostic

The counterfactual adds a separate Doom timer to the generated shader in memory, starting on every cast, including misses. Source and production means come from the fresh 1,000-fight capture. The probe reruns 1,000 GPU fights for each case. Other mechanics remain unchanged, though the resulting rotation and RNG draw order change.

| Race | Bonus hit | Source DPS | Production DPS | With Doom cooldown | Gap before | Gap after | Remaining delta DPS ±95% |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| GNOME | 12 | 707.83 | 715.94 | 713.72 | +1.15% | +0.83% | +5.89 ± 2.81 |
| GNOME | 0 | 614.99 | 633.71 | 623.19 | +3.04% | +1.33% | +8.20 ± 3.39 |
| GNOME | 5 | 653.72 | 670.65 | 663.32 | +2.59% | +1.47% | +9.61 ± 3.34 |
| ORC | 12 | 712.90 | 721.62 | 719.50 | +1.22% | +0.93% | +6.60 ± 2.89 |
| ORC | 0 | 621.96 | 635.87 | 626.49 | +2.24% | +0.73% | +4.53 ± 3.58 |
| ORC | 5 | 662.16 | 673.08 | 666.11 | +1.65% | +0.60% | +3.95 ± 3.32 |
| HUMAN | 12 | 715.71 | 720.03 | 718.17 | +0.60% | +0.34% | +2.45 ± 2.87 |
| HUMAN | 0 | 624.25 | 636.63 | 625.91 | +1.98% | +0.27% | +1.66 ± 3.58 |
| HUMAN | 5 | 664.84 | 674.30 | 667.23 | +1.42% | +0.36% | +2.39 ± 3.45 |

## Remaining differences

The cooldown accounts for a substantial portion, not all, of the gap. The worst original Gnome case was +3.65% in the 100-fight screen; fresh 1,000-fight production results are +3.04%, so some of the original extreme was sampling noise.

For the Gnome zero-hit cooldown probe, Doom ticks move from 2.000 to 1.680 per fight, versus source 1.662. However damage per tick and other spell differences remain. The probe total is still +8.20 DPS (+1.33%), with an approximate independent-engine delta interval ±3.39 DPS.

A separate confirmed configuration/rotation difference is visible in that Gnome case: source casts Eureka exactly 1.000 time/fight; ours casts it 1.839 times/fight after adding the Doom cooldown. The bridge diagnoses and omits the unsupported Split Boosts arithmetic/aura gates; the shader then uses its automatic Doom-window racial policy. That is different from the source gate. This observation does not isolate the DPS contribution of Eureka or prove it explains all remaining Gnome damage.

Human zero-hit residual is +1.66 DPS (+0.27%, interval ±3.58 DPS); Orc is +4.53 (+0.73%, interval ±3.58 DPS). Do not infer complete mechanic parity from total DPS. In particular, residual Doom damage per tick and action allocation still need dedicated comparisons.

## Reproduce

```sh
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path node scripts/sweep_forever_parity.mjs --checkout /tmp/forever-benchmark-source --go /tmp/go/bin/go --matrix fixtures/forever_low_hit_matrix.json --iterations 1000 --out FOREVER_LOW_HIT_INVESTIGATION
node scripts/investigate_forever_doom_cooldown.mjs
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path python3 scripts/forever_probes/run_doom_cooldown_probe.py /tmp/forever-benchmark-source /tmp/go/bin/go
```

The source checkout needs generated protobufs and dependencies. Substitute equivalent checkout/Go/cache paths as needed. `FOREVER_LOW_HIT_INVESTIGATION.json` records the fresh production/source requests and provenance; `FOREVER_DOOM_COOLDOWN_PROBE.json` records the exact in-memory patches, shader hashes, source capture hash and measured breakdowns. The ordinary five-preset and 300-case sweep artifacts are unchanged.

Next implementation: add a real Doom cooldown to fast/detailed simulation state, start it on every cast, test misses and 60-second readiness, then rerun low-hit and baseline comparisons. Follow with source-preserving Split Boosts/Eureka conditions rather than tuning hit or damage coefficients.
