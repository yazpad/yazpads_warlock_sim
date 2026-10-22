# App startup aligned with Forever

The Three.js app now starts from Forever's unmodified `demo_fire_brand.build.json`, revision `86d0920cae8445eaa90de9c17c3583cf171c19c5`. This is the default talent build in `../forever/ui/specs/warlock/dps/spec.ts`; its other settings match `presets.ts`. The shipped copy is `threejs_webgl_des/src/classes/warlock_defaults.js`.

## Previous startup differences

| Setting | Previous app | Forever / new app |
| --- | --- | --- |
| Race | Human | Orc |
| Bonus spell power | 500 | 0 |
| Bonus hit / crit | 12% / 15% | 0% / 0% |
| Bonus intellect / stamina / spirit | 200 / 220 / 100 | 0 / 0 / 0 |
| Bonus MP5 | 20 | 0 |
| Talents | Empty allocation; preset dropdown selection did not apply it | Demo (Fire Brand), 51 points |
| Demon / sacrifice | Imp / none | Imp / Succubus sacrifice, with Demonic Pact |
| Distance | 30 yards | 20 yards |
| Raid buffs | Off in the live form | Arcane Brilliance, Gift of the Wild, Fortitude, Spirit, Moonkin Aura, Kings, Greater Wisdom, Mana Spring |
| Consumables | Off in the live form | Flask, Nightfin food, Demonic Rune, Spellblasting potion, dynamite |
| Weapon oil | Off | No effect: source selects oil but has no main-hand weapon |
| Debuffs | External Shadow / Elements curses | Assigned Elements cast by player; JoW, armor debuffs, Gift of Arthas |
| Resources | General engine defaults | 32 soul shards, APL-controlled potion and automatic cooldowns |

Bonus stat inputs exclude race/class base attributes, buffs, and talents. Zero bonus inputs correctly represent Forever's empty equipment; they do not mean the character has zero total stats.

## New initial combat totals

| Stat | Value |
| --- | ---: |
| Spell power, both schools | 232 |
| Intellect | 169 |
| Stamina | 227 |
| Spirit | 191 |
| MP5 | 65 |
| Bonus spell hit, including talent | 1% |
| Total spell crit, including base and intellect | 8.4885% |
| Maximum mana, including Fel Vitality | 4172.2 |
| Maximum health | 3504 |
| Target armor after debuffs | 976 |

These values come from the same ordinary importer and configuration packer used for the production comparison. The saved reference has no resolved input stat differences for this build. They are initial values; the potion, procs, assigned curse and other combat effects change values during a fight.

## Implementation

Startup waits for the talent definitions and imports the actual default export. A Forever Defaults button restores it. The preset dropdown also includes all five original full builds: Demo (Fire Brand), Demo (Shadow Brand), Destro, SM/Ruin, and Aff (Wrack), each tagged `(Forever)`. Selecting one restores its complete stats, talents, demons, buffs, consumables, encounter settings and APL through the ordinary importer. The live form now exposes the missing buffs, debuffs, consumables, shards and potion controls. Its stat arithmetic uses the shared import buff resolver, and the combat summary includes talent spell power, base/intellect crit and talent-adjusted mana. Editing or exporting a build retains these settings instead of falling back to the earlier partial form configuration. Source metadata for Demon Armor and professions is preserved.

The outgoing-damage simulator still does not model incoming damage or health limits, so Demon Armor regeneration and Rune health loss do not affect its damage results. These pre-existing modeling limits are unchanged.

Validation this change: JavaScript syntax check and whitespace check. Automated tests were not run for this UI change.

## Replay decoder correction

The browser's detailed decoder used fixed word positions for `spent` and `manaWasted`, although the shader locates them relative to `DETAIL_WORD_OFFSET`. Adding the two imported spells shifted those fields. The decoder now uses the shared offset, and the existing transport fixture uses the same layout. Native GPU comparisons for all five presets agree between compact output and full diagnostic replay on every decoded field (including normalized uptimes); mana spent was respectively 22626, 23903, 25574, 24690 and 23000 for the five seed-42 fights.

A local browser inspection confirmed startup at 232 SP, all five named presets, and zero gear bonus stats after an edit. The full browser simulation encountered a software-renderer context loss in this environment; the native GPU comparison above isolates the reported replay mismatch. Edited logical exports also now include their required top-level schema version.

The later [export and performance investigation](FOREVER_DEFAULTS_DPS_AND_PERFORMANCE.md) distinguishes the checked-in zero-bonus presets from the supplied Gnome setup with 328 bonus SP and raw hit/crit ratings. Empty equipment alone does not establish expected DPS.
