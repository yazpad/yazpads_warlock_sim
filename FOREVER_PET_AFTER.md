# Forever pet-only diagnostic

complete: 120/120 cases, 1000 fights per engine.

120 pet-only scenarios; source uses a 180s Wait and no player cooldown/attacks, GPU diagnostic skips player decisions. App Wait import support is not claimed. DK/talents/sacrifice stay as declared by the source requests. Mana can exhaust without owner Life Tap; readiness differences remain measurable.

| Model | Cases | MAE DPS | Mean delta DPS |
| --- | ---: | ---: | ---: |
| succubus_no_dk | 30 | 0.740 | 0.736 |
| imp_no_dk | 30 | 0.391 | 0.387 |
| succubus_dk | 30 | 0.980 | 0.946 |
| imp_dk | 30 | 0.950 | 0.941 |
