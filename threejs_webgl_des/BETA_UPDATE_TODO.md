# WoW Forever Beta update

Source: user-provided patch notes, October 15, 2026. Scope: Three.js/WebGL app.

- [x] Double Shadow Mastery to 2% per rank (10% maximum), update tooltip, and verify talent flags at all ranks.
- [x] Replace Malediction with two-rank Grim Reach; remove its damage bonus, update optimizer/tree/presets, and reject incompatible saved builds with a respec message.
- [x] Update Destructive Reach to Destruction-only range and rank-specific tooltips.
- [x] Update supported Warlock racials: Human crit, Orc crit/Blood Fury, Gnome Eureka, and Undead proc rules. Health regeneration is not modeled.
  - [x] Warlock: Human Ruthless grants 2% crit regardless of weapon; update racial tooltip and remove sword toggle.
  - [x] Warlock: Eureka lasts 8 seconds without charges, preserving 10% damage and Mana cost effects; update tooltip and compatibility versions.
  - [x] Warlock: Blood Fury cooldown is 3 minutes for APL and automatic activation; update tooltip and cooldown tests.
  - [x] Warlock: Savage grants Orcs 1% crit without a weapon requirement; update racial tooltip.
  - [x] Repair the pre-existing Command regression: apply Orc's 5% pet damage bonus once in GPU packing. Existing racial packing tests now pass.
  - [x] Warlock: Undead proc chance is 30%, internal cooldown is 25 seconds, and damage remains independent of Shadow bonuses and spell base damage.
- [x] Review raid buffs: Moonkin Aura and melee/ranged auras are absent; this single-player calculation has no party/raid propagation model. Existing Mana Spring selection already applies to the player.
- [x] Audit combat fixes: Soul Link's pet-dependent damage bonus already applies. There are no summon actions, Soul Shard inventory, Curse of Recklessness, movement, out-of-combat creature health, or Warlock wand attacks to patch.
- [x] Audit graphics/UI: Three.js performs offscreen calculations; there is no world fog, bloom, shadow-quality setting, unit-frame/minimap renderer, or in-game tutorial system.
- [x] Run relevant validation and the full app suite: 29/31 test files pass; all Warlock checks pass.
- [ ] Separate follow-up: repair the pre-existing experimental Priest core and Priest racial test failures before claiming the entire repository suite is green.

Implementation limits:

- Range bonuses are represented by talent data/flags. Encounter distance controls projectile travel; the app does not enforce spell range or model movement. These talents grant no damage increase.
- Presets previously investing in Malediction now use up to two Grim Reach points. Extra points go into the earliest available Affliction nodes, preserving tree totals. Saved user allocations are never silently redistributed; builds containing invested Malediction must be respecced.
- Retained the existing Undead damage formula (5% maximum health); the supplied patch does not specify a replacement amount. The patch calls the proc both Touch of the Grave and Touch of the Dead; the existing display name is retained.
- Troll health regeneration, Orc incoming magic damage/dispels, and Undead crowd-control restrictions require mechanics this Warlock DPS simulator does not model.
- The native C++ simulator and separate experimental Priest modules are not updated by this Warlock checklist. Historical CPU/browser parity fixtures predate the beta mechanics and are not beta acceptance tests.

Validation: new beta regression tests cover talent metadata, removed damage, saved-build respec errors, preset Affliction requirements, and actual GLSL Undead proc behavior. Existing racial GPU tests cover Eureka/Blood Fury timing. Final `npm test`: 29 passed, 2 failed (`priest_core.test.mjs`, `priest_racials.test.mjs`). Those failures also reproduce when run individually; they involve Starshards/Holy Nova and Priest racial expectations, outside these Warlock changes. `git diff --check` passes.
