# Repeatable Forever race/stat sweep

Run from the repository root:

```sh
node scripts/sweep_forever_parity.mjs --checkout /path/to/forever --go /path/to/go
```

Defaults: **300 combinations**, 100 fights per engine per combination (30,000 per engine), seed 101. Five Warlock presets × five supported races × twelve stat profiles. Outputs are `FOREVER_SWEEP.md` and `FOREVER_SWEEP.json`; existing five-preset benchmark files and canonical fixtures are not modified. Each invocation replaces the selected sweep outputs.

The checkout must have its generated Go protobufs and database assets, as required by the existing Forever exporter. Use the Go version specified by its `go.mod`. Set `GOCACHE` and `GOPATH` if the environment requires writable temporary caches. For the current temporary setup:

```sh
GOCACHE=/tmp/forever-go-cache GOPATH=/tmp/forever-go-path node scripts/sweep_forever_parity.mjs --checkout /tmp/forever-benchmark-source --go /tmp/go/bin/go
```

Inspect the planned cases without Go or GPU execution:

```sh
node scripts/sweep_forever_parity.mjs --dry-run
```

Change sample count, seed, report prefix or matrix:

```sh
node scripts/sweep_forever_parity.mjs --checkout /path/to/forever --iterations 1000 --seed 202 --out /tmp/sweep-1000
node scripts/sweep_forever_parity.mjs --checkout /path/to/forever --matrix /path/to/custom-matrix.json --out /tmp/subset
```

Copy [the default matrix](../fixtures/forever_sweep_matrix.json) and remove presets, races or profiles for a targeted subset. Profiles merge their `stats` overrides over [the declared baseline](../fixtures/forever_gear_free_scenario.json). Zero is an explicit bonus value, not a missing field. Stats are **additions above racial/class bases**, not total character-sheet values. Spell power, intellect, hit and crit vary separately; the two regeneration profiles jointly change spirit and mp5. This is a preset × race × profile cross product, not the combinatorial product of every individual stat level.

Scenarios retain 180 seconds, zero distance, empty equipment, external CoE, no other external buffs or consumables, and no assigned curse. Source talents, pets, sacrifices, APLs and channel-delay settings remain authoritative. Race changes preserve the source APL's explicit racial actions; the script does not optimize/rewrite the rotation for the new race. Thus unsupported or differently handled racial actions can expose real import discrepancies.

Each case runs a freshly generated Forever request, then passes that request's player/buffs through the normal app importer. The JSON saves exact requests, app configs, source resolved stats, selected initial-stat differences, group diagnostics, sample counts/standard deviations, DPS uncertainty and spell/pet breakdowns. Source Go files, preset files, database, exporter and local simulation files are hashed. GPU detailed lanes must complete; failed cases are recorded and cause a nonzero final exit status. Reports are checkpointed after each preset, with explicit running/failed status if incomplete.

One EGL process per preset reuses the shader across that preset's race/profile cases. Results are diagnostic, not accepted parity. Approximate 95% intervals describe sampling noise only; 100 fights is intentionally a quick screen. Intervals across the 300 cases are not adjusted for multiple comparisons, so isolated deviations warrant a targeted higher-sample rerun. A close total can conceal opposing spell differences. Input-difference counts cover selected player fields and packed resources, not every pet/encounter feature.

Verification:

```sh
node threejs_webgl_des/validation/forever_sweep.test.mjs
```
