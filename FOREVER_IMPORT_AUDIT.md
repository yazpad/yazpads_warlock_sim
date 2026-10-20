# Forever import differences

Generated with `node scripts/audit_forever_import.mjs`. This audits source settings and bridge behavior; it does not measure DPS or certify mechanics parity.

Paths include unused group definitions so omitted actions remain visible. Unmapped fields require review; some may have no damage impact.

| Build | Findings | APL lines failing compilation |
| --- | ---: | ---: |
| aff_wrack | 16 | 0 |
| demo_fire_brand | 18 | 0 |
| demo_shadow_brand | 18 | 0 |
| destro | 17 | 0 |
| sm_ruin | 16 | 0 |

## aff_wrack

Source: `/home/aaron-ma/yazpads_warlock_sim/fixtures/canonical_forever/aff_wrack.fixture.json#sourceBuild`

- `player.warlock.options.classOptions.curseOptions`: Not mapped by bridge; combat relevance needs review — `"NoCurse"`
- `player.warlock.options.classOptions.soulShards`: Not mapped by bridge; combat relevance needs review — `32`
- `encounter`: Source encounter ignored; bridge supplies 180s / level 63 / armor 3731 / resistance 0 — `{"apiVersion":0,"duration":180,"durationVariation":0,"executeProportion20":0.2,"executeProportion25":0.25,"executeProportion35":0.35,"executeProportion45":0.45,"executeProportion90":0.9,"useHealth":false,"targets":[{"id":0,"name":"","level":63,"mobType":"MobTypeMechanical","creatureFamily":"CreatureFamilyUnknown","stats":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,320,0,0,0,0,0,0,0,0,0,0,0,0,3731,0,0,0,0,0,0,0,0,0,0,0],"minBaseDamage":2601,"damageSpread":0.5,"swingSpeed":2,"dualWield":false,"dualWieldPenalty":false,"parryHaste":true,"suppressDodge":false,"canCrush":true,"spellSchool":"SpellSchoolPhysical","tankIndex":0,"secondTankIndex":0,"disabledAtStart":false,"targetInputs":[]}],"areaTypes":[],"zoneId":0}`
- `player.profession1`: Player setting not mapped — `"Engineering"`
- `player.profession2`: Player setting not mapped — `"ProfessionUnknown"`
- `player.bonusStats`: Player setting not mapped — `{"apiVersion":0,"stats":[0,0,220,200,0,500,0,0,0,0,0,0,0,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,0,0,0,0,0,0,0],"pseudoStats":[0,0,0,0,0,0,0,0,0,0,0,0,0,12,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}`
- `player.reactionTimeMs`: Player setting not mapped — `100`
- `player.rotation.priorityList.0.action`: Automatic cooldown action omitted
- `player.rotation.priorityList.2.action.castSpell`: Amplify Curse mapped to Agony rather than independent cooldown
- `player.rotation.priorityList.6.action`: Assigned curse action omitted; uptime/GCD/mana not preserved
- `player.rotation.priorityList.11.action.channelSpell`: Channel treated as fixed action; interruptIf / allowRecast not preserved — `{"spellId":{"spellId":1316697,"tag":0,"rank":0},"target":null,"interruptIf":null,"allowRecast":false}`
- `player.rotation.priorityList.11.action.condition`: Comparison translator conflates strict/inclusive bounds; min uses AND even for less-than — `"OpGe"`
- `player.rotation.groups.0.actions.1.action.castSpell`: Spell or item action omitted — `{"itemId":250937,"tag":0,"rank":0}`
- `player.rotation.groups.Boosts`: Unsupported grouped action: {"itemId":250937,"tag":0,"rank":0} — `{"itemId":250937,"tag":0,"rank":0}`
- `player.rotation.groups.priorityList`: Unsupported Forever group condition: warlockAssignedCurseIsActive — `{"spellId":20554,"tag":0,"rank":0}`
- `fixture.inputComparison`: Source capture status: blocked; resolvedConfig is produced by ordinary import

## demo_fire_brand

Source: `/home/aaron-ma/yazpads_warlock_sim/fixtures/canonical_forever/demo_fire_brand.fixture.json#sourceBuild`

- `player.warlock.options.classOptions.curseOptions`: Not mapped by bridge; combat relevance needs review — `"NoCurse"`
- `player.warlock.options.classOptions.soulShards`: Not mapped by bridge; combat relevance needs review — `32`
- `encounter`: Source encounter ignored; bridge supplies 180s / level 63 / armor 3731 / resistance 0 — `{"apiVersion":0,"duration":180,"durationVariation":0,"executeProportion20":0.2,"executeProportion25":0.25,"executeProportion35":0.35,"executeProportion45":0.45,"executeProportion90":0.9,"useHealth":false,"targets":[{"id":0,"name":"","level":63,"mobType":"MobTypeMechanical","creatureFamily":"CreatureFamilyUnknown","stats":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,320,0,0,0,0,0,0,0,0,0,0,0,0,3731,0,0,0,0,0,0,0,0,0,0,0],"minBaseDamage":2601,"damageSpread":0.5,"swingSpeed":2,"dualWield":false,"dualWieldPenalty":false,"parryHaste":true,"suppressDodge":false,"canCrush":true,"spellSchool":"SpellSchoolPhysical","tankIndex":0,"secondTankIndex":0,"disabledAtStart":false,"targetInputs":[]}],"areaTypes":[],"zoneId":0}`
- `player.profession1`: Player setting not mapped — `"Engineering"`
- `player.profession2`: Player setting not mapped — `"ProfessionUnknown"`
- `player.bonusStats`: Player setting not mapped — `{"apiVersion":0,"stats":[0,0,220,200,0,500,0,0,0,0,0,0,0,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,0,0,0,0,0,0,0],"pseudoStats":[0,0,0,0,0,0,0,0,0,0,0,0,0,12,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}`
- `player.reactionTimeMs`: Player setting not mapped — `100`
- `player.rotation.priorityList.0.action`: Automatic cooldown action omitted
- `player.rotation.priorityList.3.action.condition.and.vals.1`: Comparison translator conflates strict/inclusive bounds; min uses AND even for less-than — `"OpGe"`
- `player.rotation.priorityList.5.action.condition`: AND translation may retain only two predicates
- `player.rotation.priorityList.5.action.condition.and.vals.2`: Comparison translator conflates strict/inclusive bounds; min uses AND even for less-than — `"OpLt"`
- `player.rotation.priorityList.7.action`: Assigned curse action omitted; uptime/GCD/mana not preserved
- `player.rotation.priorityList.8.action.condition`: Comparison translator conflates strict/inclusive bounds; min uses AND even for less-than — `"OpLt"`
- `player.rotation.priorityList.10.action`: Action-specific rewrite discards or replaces source condition — `"decimateSoulFire"`
- `player.rotation.groups.0.actions.1.action.castSpell`: Spell or item action omitted — `{"itemId":250937,"tag":0,"rank":0}`
- `player.rotation.valueVariables.2.value`: Comparison translator conflates strict/inclusive bounds; min uses AND even for less-than — `"OpLe"`
- `player.rotation.groups.Boosts`: Unsupported grouped action: {"itemId":250937,"tag":0,"rank":0} — `{"itemId":250937,"tag":0,"rank":0}`
- `fixture.inputComparison`: Source capture status: blocked; resolvedConfig is produced by ordinary import

## demo_shadow_brand

Source: `/home/aaron-ma/yazpads_warlock_sim/fixtures/canonical_forever/demo_shadow_brand.fixture.json#sourceBuild`

- `player.warlock.options.classOptions.curseOptions`: Not mapped by bridge; combat relevance needs review — `"NoCurse"`
- `player.warlock.options.classOptions.soulShards`: Not mapped by bridge; combat relevance needs review — `32`
- `encounter`: Source encounter ignored; bridge supplies 180s / level 63 / armor 3731 / resistance 0 — `{"apiVersion":0,"duration":180,"durationVariation":0,"executeProportion20":0.2,"executeProportion25":0.25,"executeProportion35":0.35,"executeProportion45":0.45,"executeProportion90":0.9,"useHealth":false,"targets":[{"id":0,"name":"","level":63,"mobType":"MobTypeMechanical","creatureFamily":"CreatureFamilyUnknown","stats":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,320,0,0,0,0,0,0,0,0,0,0,0,0,3731,0,0,0,0,0,0,0,0,0,0,0],"minBaseDamage":2601,"damageSpread":0.5,"swingSpeed":2,"dualWield":false,"dualWieldPenalty":false,"parryHaste":true,"suppressDodge":false,"canCrush":true,"spellSchool":"SpellSchoolPhysical","tankIndex":0,"secondTankIndex":0,"disabledAtStart":false,"targetInputs":[]}],"areaTypes":[],"zoneId":0}`
- `player.profession1`: Player setting not mapped — `"Engineering"`
- `player.profession2`: Player setting not mapped — `"ProfessionUnknown"`
- `player.bonusStats`: Player setting not mapped — `{"apiVersion":0,"stats":[0,0,220,200,0,500,0,0,0,0,0,0,0,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,0,0,0,0,0,0,0],"pseudoStats":[0,0,0,0,0,0,0,0,0,0,0,0,0,12,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}`
- `player.reactionTimeMs`: Player setting not mapped — `100`
- `player.rotation.priorityList.0.action`: Automatic cooldown action omitted
- `player.rotation.priorityList.3.action.condition.and.vals.1`: Comparison translator conflates strict/inclusive bounds; min uses AND even for less-than — `"OpGe"`
- `player.rotation.priorityList.5.action.condition`: AND translation may retain only two predicates
- `player.rotation.priorityList.5.action.condition.and.vals.2`: Comparison translator conflates strict/inclusive bounds; min uses AND even for less-than — `"OpLt"`
- `player.rotation.priorityList.7.action`: Assigned curse action omitted; uptime/GCD/mana not preserved
- `player.rotation.priorityList.8.action.condition`: Comparison translator conflates strict/inclusive bounds; min uses AND even for less-than — `"OpLt"`
- `player.rotation.priorityList.10.action`: Action-specific rewrite discards or replaces source condition — `"decimateSoulFire"`
- `player.rotation.groups.0.actions.1.action.castSpell`: Spell or item action omitted — `{"itemId":250937,"tag":0,"rank":0}`
- `player.rotation.valueVariables.2.value`: Comparison translator conflates strict/inclusive bounds; min uses AND even for less-than — `"OpLe"`
- `player.rotation.groups.Boosts`: Unsupported grouped action: {"itemId":250937,"tag":0,"rank":0} — `{"itemId":250937,"tag":0,"rank":0}`
- `fixture.inputComparison`: Source capture status: blocked; resolvedConfig is produced by ordinary import

## destro

Source: `/home/aaron-ma/yazpads_warlock_sim/fixtures/canonical_forever/destro.fixture.json#sourceBuild`

- `player.warlock.options.classOptions.curseOptions`: Not mapped by bridge; combat relevance needs review — `"NoCurse"`
- `player.warlock.options.classOptions.soulShards`: Not mapped by bridge; combat relevance needs review — `32`
- `encounter`: Source encounter ignored; bridge supplies 180s / level 63 / armor 3731 / resistance 0 — `{"apiVersion":0,"duration":180,"durationVariation":0,"executeProportion20":0.2,"executeProportion25":0.25,"executeProportion35":0.35,"executeProportion45":0.45,"executeProportion90":0.9,"useHealth":false,"targets":[{"id":0,"name":"","level":63,"mobType":"MobTypeMechanical","creatureFamily":"CreatureFamilyUnknown","stats":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,320,0,0,0,0,0,0,0,0,0,0,0,0,3731,0,0,0,0,0,0,0,0,0,0,0],"minBaseDamage":2601,"damageSpread":0.5,"swingSpeed":2,"dualWield":false,"dualWieldPenalty":false,"parryHaste":true,"suppressDodge":false,"canCrush":true,"spellSchool":"SpellSchoolPhysical","tankIndex":0,"secondTankIndex":0,"disabledAtStart":false,"targetInputs":[]}],"areaTypes":[],"zoneId":0}`
- `player.profession1`: Player setting not mapped — `"Engineering"`
- `player.profession2`: Player setting not mapped — `"ProfessionUnknown"`
- `player.bonusStats`: Player setting not mapped — `{"apiVersion":0,"stats":[0,0,220,200,0,500,0,0,0,0,0,0,0,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,0,0,0,0,0,0,0],"pseudoStats":[0,0,0,0,0,0,0,0,0,0,0,0,0,12,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}`
- `player.reactionTimeMs`: Player setting not mapped — `100`
- `player.rotation.priorityList.0.action`: Automatic cooldown action omitted
- `player.rotation.priorityList.2.action.condition.and.vals.1`: Comparison translator conflates strict/inclusive bounds; min uses AND even for less-than — `"OpGe"`
- `player.rotation.priorityList.3.action.condition`: AND translation may retain only two predicates
- `player.rotation.priorityList.3.action.condition.and.vals.2`: Comparison translator conflates strict/inclusive bounds; min uses AND even for less-than — `"OpLt"`
- `player.rotation.priorityList.4.action`: Assigned curse action omitted; uptime/GCD/mana not preserved
- `player.rotation.priorityList.7.action`: Action-specific rewrite discards or replaces source condition — `"conflag"`
- `player.rotation.priorityList.7.action.condition`: Positive DoT predicate replaced by true or Immolate < 6s — `{"targetUnit":null,"spellId":{"spellId":25309,"tag":0,"rank":0}}`
- `player.rotation.groups.0.actions.1.action.castSpell`: Spell or item action omitted — `{"itemId":250937,"tag":0,"rank":0}`
- `player.rotation.groups.Boosts`: Unsupported grouped action: {"itemId":250937,"tag":0,"rank":0} — `{"itemId":250937,"tag":0,"rank":0}`
- `fixture.inputComparison`: Source capture status: blocked; resolvedConfig is produced by ordinary import

## sm_ruin

Source: `/home/aaron-ma/yazpads_warlock_sim/fixtures/canonical_forever/sm_ruin.fixture.json#sourceBuild`

- `player.warlock.options.classOptions.curseOptions`: Not mapped by bridge; combat relevance needs review — `"NoCurse"`
- `player.warlock.options.classOptions.soulShards`: Not mapped by bridge; combat relevance needs review — `32`
- `encounter`: Source encounter ignored; bridge supplies 180s / level 63 / armor 3731 / resistance 0 — `{"apiVersion":0,"duration":180,"durationVariation":0,"executeProportion20":0.2,"executeProportion25":0.25,"executeProportion35":0.35,"executeProportion45":0.45,"executeProportion90":0.9,"useHealth":false,"targets":[{"id":0,"name":"","level":63,"mobType":"MobTypeMechanical","creatureFamily":"CreatureFamilyUnknown","stats":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,320,0,0,0,0,0,0,0,0,0,0,0,0,3731,0,0,0,0,0,0,0,0,0,0,0],"minBaseDamage":2601,"damageSpread":0.5,"swingSpeed":2,"dualWield":false,"dualWieldPenalty":false,"parryHaste":true,"suppressDodge":false,"canCrush":true,"spellSchool":"SpellSchoolPhysical","tankIndex":0,"secondTankIndex":0,"disabledAtStart":false,"targetInputs":[]}],"areaTypes":[],"zoneId":0}`
- `player.profession1`: Player setting not mapped — `"Engineering"`
- `player.profession2`: Player setting not mapped — `"ProfessionUnknown"`
- `player.bonusStats`: Player setting not mapped — `{"apiVersion":0,"stats":[0,0,220,200,0,500,0,0,0,0,0,0,0,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,0,0,0,0,0,0,0],"pseudoStats":[0,0,0,0,0,0,0,0,0,0,0,0,0,12,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}`
- `player.reactionTimeMs`: Player setting not mapped — `100`
- `player.rotation.priorityList.0.action`: Automatic cooldown action omitted
- `player.rotation.priorityList.2.action.castSpell`: Amplify Curse mapped to Agony rather than independent cooldown
- `player.rotation.priorityList.3.action.condition.and.vals.1`: Comparison translator conflates strict/inclusive bounds; min uses AND even for less-than — `"OpGe"`
- `player.rotation.priorityList.8.action`: Assigned curse action omitted; uptime/GCD/mana not preserved
- `player.rotation.groups.0.actions.1.action.castSpell`: Spell or item action omitted — `{"itemId":250937,"tag":0,"rank":0}`
- `player.rotation.valueVariables.2.value`: AND translation may retain only two predicates
- `player.rotation.valueVariables.2.value.and.vals.2`: Comparison translator conflates strict/inclusive bounds; min uses AND even for less-than — `"OpLt"`
- `player.rotation.groups.Boosts`: Unsupported grouped action: {"itemId":250937,"tag":0,"rank":0} — `{"itemId":250937,"tag":0,"rank":0}`
- `fixture.inputComparison`: Source capture status: blocked; resolvedConfig is produced by ordinary import
