// Level-60 Warlock attributes before racial multipliers, from Forever
// sim/core/base_stats.go (ClassBaseStats + RaceOffsets), revision
// d33930d04030c3f556582f31949f1f22c17da0e4. Base mana: base_stats_auto_gen.go.
export const WARLOCK_BASE_STATS = Object.freeze({
  HUMAN: Object.freeze({ intellect: 110, stamina: 65, spirit: 115 }),
  ORC: Object.freeze({ intellect: 107, stamina: 67, spirit: 118 }),
  GNOME: Object.freeze({ intellect: 113, stamina: 64, spirit: 115 }),
  UNDEAD: Object.freeze({ intellect: 108, stamina: 66, spirit: 120 }),
  TROLL: Object.freeze({ intellect: 106, stamina: 66, spirit: 116 }),
});

export function addWarlockBaseStats(gearStats, race) {
  const base = WARLOCK_BASE_STATS[race];
  if (!base) throw new Error(`Unsupported Warlock base-stat race: ${race}`);
  return { ...gearStats, intellect: gearStats.intellect + base.intellect,
    stamina: gearStats.stamina + base.stamina, spirit: gearStats.spirit + base.spirit };
}

// Forever character.go/mana.go grant one resource per point for the first
// twenty attributes, then ten health/fifteen mana per point thereafter.
export function warlockBaseResources(intellect, stamina) {
  return { maxHealth: 1414 + 10 * stamina - 180, maxMana: 1373 + 15 * intellect - 280 };
}
