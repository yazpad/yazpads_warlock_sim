# Forever default warlock exports

Unmodified `ui/specs/warlock/dps/builds/*.build.json` from the local Forever checkout at commit `86d0920cae8445eaa90de9c17c3583cf171c19c5`.

These five builds retain the original buffs, consumables, professions, assigned Curse of Elements, soul shards, demons and 20-yard distance. They contain no equipment. Keep them separate from `canonical_forever`, whose gear-free comparison scenarios intentionally disable several of these settings.

`threejs_webgl_des/validation/forever_defaults.test.mjs` exercises ordinary import, logical/resolved export roundtrips, and actual detailed/fast GPU combat. It checks rune activation, explosive damage, assigned curse application, and explicit potion timing. This establishes import/execution coverage, not numerical DPS parity with Forever.

Demon Armor and professions are retained in the candidate's `sourceSettings`. Demon Armor affects incoming damage and health regeneration, which this outgoing-damage simulator does not model; neither default profession adds passive caster stats. Rune health damage likewise has no effect in this simulator's existing unlimited-health resource model. Soul shards are tracked for Shadowburn and Soul Fire, including the Decimation reagent waiver and Shadow and Flame refund.

Fresh production numerical results are saved in [FOREVER_FULL_DEFAULTS_PRODUCTION.md](../../FOREVER_FULL_DEFAULTS_PRODUCTION.md), with exact requests and engine provenance in its JSON companion. Reproduce with `node scripts/benchmark_forever_defaults.mjs --checkout /path/to/forever --go /path/to/go --iterations 10000 --seed 101 --out FOREVER_FULL_DEFAULTS_PRODUCTION` after preparing Forever’s Go protobuf files.

The regression coverage also checks food/oil stats, Judgement of Wisdom applications, explosive scheduling and multipliers, Succubus approach timing, Gift of Arthas modifier order, and Imp projectile arrivals in both shader modes. The original benchmark and diagnostic reports are preserved as historical evidence.
