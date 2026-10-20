import { TALENT_DEFINITIONS } from './warlock_search.js';
import { ACTION_ALIASES, parseAPLText, compileAPLToBytecode } from '../apl.js';

/**
 * Maps forever race enum/strings (e.g. 'RaceOrc', 'RaceGnome') to our app's uppercase format.
 */
export const RACE_MAP = {
  RaceHuman: 'HUMAN',
  Human: 'HUMAN',
  HUMAN: 'HUMAN',
  RaceGnome: 'GNOME',
  Gnome: 'GNOME',
  GNOME: 'GNOME',
  RaceOrc: 'ORC',
  Orc: 'ORC',
  ORC: 'ORC',
  RaceUndead: 'UNDEAD',
  Undead: 'UNDEAD',
  UNDEAD: 'UNDEAD',
  RaceTroll: 'TROLL', Troll: 'TROLL', TROLL: 'TROLL'
};

// Forever's bonusStats are additions to racial/class attributes. Percent hit
// and crit live in pseudoStats; they are not raw rating values.
export function mapForeverBonusStats(player) {
  const result = { swordEquipped: false, spellPower: 0, shadowPower: 0, firePower: 0,
    intellect: 0, stamina: 0, spirit: 0, hit: 0, crit: 0, mp5: 0, penetration: 0 };
  const stats = player.bonusStats?.stats || [];
  const pseudo = player.bonusStats?.pseudoStats || [];
  const fields = { 2: 'stamina', 3: 'intellect', 5: 'spellPower', 7: 'firePower',
    11: 'shadowPower', 12: 'penetration', 13: 'spirit', 31: 'mp5' };
  stats.forEach((value, index) => {
    if (!value) return;
    if (!fields[index]) throw new Error(`Unsupported Forever bonus stat index: ${index}`);
    result[fields[index]] = value;
  });
  pseudo.forEach((value, index) => {
    if (!value) return;
    if (index === 13) result.hit = value;
    else if (index === 15) result.crit = value;
    else throw new Error(`Unsupported Forever bonus pseudo stat index: ${index}`);
  });
  return result;
}

/**
 * Maps forever spell IDs to our canonical APL action aliases.
 */
export const SPELL_ID_TO_ACTION = {
  // Shadow Bolt
  25307: 'bolt',         // Rank 10
  11661: 'bolt',         // Rank 9
  11660: 'bolt',         // Rank 8
  // Corruption
  25311: 'corr',         // Rank 7
  11672: 'corr',         // Rank 6
  // Immolate
  25309: 'immo',         // Rank 8
  11684: 'immo',         // Rank 7
  11683: 'immo',         // Rank 6
  // Curses
  11713: 'agony',        // Bane of Agony Rank 6
  603: 'curse',          // Curse of Doom Rank 1
  18288: 'amplify',      // Explicit off-GCD Amplify Curse action
  // Destruction
  18932: 'conflag',      // Conflagrate Rank 6
  17962: 'conflag',      // Conflagrate Rank 1
  18871: 'shadowburn',   // Shadowburn Rank 6
  17877: 'shadowburn',   // Shadowburn Rank 1
  1293813: 'incinerate', // Incinerate Rank 3
  29722: 'incinerate',   // Incinerate
  412758: 'incinerate',  // Incinerate Rank 1
  17924: 'decimateSoulFire', // Soul Fire
  17923: 'searing',      // Searing Pain Rank 6
  5676: 'searing',       // Searing Pain Rank 1
  // Affliction
  18881: 'siphon',       // Siphon Life Rank 4
  18265: 'siphon',       // Siphon Life Rank 1
  1316697: 'wrack',      // Wrack
  17953: 'drain',        // Drain Soul Rank 4
  1120: 'drain',         // Drain Soul Rank 1
  11664: 'hellfire',     // Hellfire Rank 3
  // Utility & Racials
  11689: 'tap',          // Life Tap Rank 6
  1454: 'tap',           // Life Tap Rank 1
  20572: 'bloodFury',    // Blood Fury (Orc)
  20554: 'berserking',   // Berserking (Troll)
  26297: 'berserking',   // Berserking
  1259821: 'eureka',     // Eureka! (Gnome)
  1293696: 'brand'       // Demonic Brand Trigger
};

/**
 * Decodes a forever talents string (e.g. "2540002013520105--0550305003")
 * into our app's structured talents dictionary { affliction: {}, demonology: {}, destruction: {} }
 */
export function decodeForeverTalentsString(talentsString, definitions = TALENT_DEFINITIONS) {
  if (!talentsString || typeof talentsString !== 'string') {
    return { affliction: {}, demonology: {}, destruction: {} };
  }
  const treeParts = talentsString.split('-');
  const trees = [[], [], []];
  definitions.forEach(node => {
    if (node.tree >= 0 && node.tree < 3) {
      trees[node.tree].push(node);
    }
  });

  const result = { affliction: {}, demonology: {}, destruction: {} };
  const treeKeys = ['affliction', 'demonology', 'destruction'];

  trees.forEach((treeNodes, tIdx) => {
    const part = treeParts[tIdx] || '';
    treeNodes.forEach((node, nIdx) => {
      const char = part.charAt(nIdx);
      const rank = char ? parseInt(char, 10) : 0;
      if (Number.isFinite(rank) && rank > 0) {
        result[treeKeys[tIdx]][node.id] = Math.min(rank, node.max);
      }
    });
  });

  return result;
}

/**
 * Extracts and maps buffs/debuffs from a forever build JSON to our app's buff keys.
 */
export function mapForeverBuffs(foreverBuild) {
  const buffs = {};
  const raidBuffs = foreverBuild.raidBuffs || {};
  const partyBuffs = foreverBuild.partyBuffs || {};
  const debuffs = foreverBuild.debuffs || {};
  const player = foreverBuild.player || {};
  const playerBuffs = player.buffs || {};
  const consumes = player.consumables || {};

  // Raid / Party
  if (raidBuffs.arcaneBrilliance) buffs.arcaneIntellect = true;
  if (raidBuffs.giftOfTheWild) buffs.markOfTheWild = true;
  if (playerBuffs.greaterBlessingOfKings || playerBuffs.blessingOfKings) buffs.blessingOfKings = true;
  if (playerBuffs.greaterBlessingOfWisdom || playerBuffs.blessingOfWisdom) buffs.blessingOfWisdom = true;
  if (partyBuffs.manaSpringTotem && partyBuffs.manaSpringTotem !== 'TristateEffectMissing') buffs.manaSpringTotem = true;

  // World Buffs
  if (playerBuffs.rallyingCryOfTheDragonslayer) buffs.dragonslayer = true;
  if (playerBuffs.songflowerSerenade) buffs.songflower = true;
  if (playerBuffs.warchiefsBlessing) buffs.warchiefsBlessing = true;
  if (playerBuffs.spiritOfZandalar) buffs.spiritOfZandalar = true;
  if (playerBuffs.saygesFortune) buffs.saygesFortune = true;

  // Debuffs
  if (debuffs.curseOfElements) buffs.curseOfElements = true;
  if (debuffs.curseOfShadow) buffs.curseOfShadow = true;
  if (debuffs.shadowWeaving) buffs.shadowWeaving = true;
  if (debuffs.improvedScorch) buffs.improvedScorch = true;

  // Consumables (by known Item IDs)
  if (consumes.flaskId === 13512) buffs.flaskSupremePower = true;
  if (consumes.offensivePotId === 9155) buffs.greaterArcaneElixir = true;
  if (consumes.shadowPowerElixir || consumes.offensivePotId === 9264) buffs.shadowPowerElixir = true;
  if (consumes.greaterFirepowerElixir || consumes.offensivePotId === 21546) buffs.greaterFirepowerElixir = true;
  if (consumes.wizardOil || consumes.mhImbueId === 20749) buffs.wizardOil = true;
  if (consumes.magebloodElixir) buffs.magebloodElixir = true;
  if (consumes.foodId === 13931) buffs.nightfinSoup = true;

  return buffs;
}

/**
 * Maps forever spell IDs to debuff names used in our APL condition syntax.
 */
export const SPELL_ID_TO_DEBUFF_NAME = {
  603: 'Bane of Doom',
  11713: 'Bane of Agony',
  25311: 'Corruption',
  25309: 'Immolate',
  18881: 'Siphon Life',
};

function parseForeverDurationSec(str) {
  if (typeof str !== 'string') return 0;
  const m = str.match(/^([\d.]+)\s*s?$/);
  return m ? parseFloat(m[1]) : 0;
}

/**
 * Translates an authentic forever protobuf AST condition node into our plain-text APL condition expression.
 * Handles boolean trees (and, or, not), DoT predicates, aura predicates, fight timers, and variable references.
 */
export function convertForeverCondition(condNode, vars = {}) {
  if (!condNode) return 'true';

  if (condNode.variableRef) {
    const varName = condNode.variableRef.name;
    const resolved = vars[varName];
    if (resolved) {
      return convertForeverCondition(resolved, vars);
    }
    return 'true';
  }

  if (condNode.not) {
    const inner = condNode.not.val;
    if (inner?.dotIsActive) {
      const spId = inner.dotIsActive.spellId?.spellId;
      const spName = SPELL_ID_TO_DEBUFF_NAME[spId] || 'Corruption';
      return `target.debuff_remains("${spName}") <= 0`;
    }
    if (inner?.auraIsActive) {
      const spId = inner.auraIsActive.auraId?.spellId;
      if (spId === 1293696) return 'debuff.demonic_brand_missing';
      if (spId === 18288) return '!buff.amplify_curse';
      if (spId === 17794) return 'debuff.isb_missing'; // Improved Shadow Bolt vulnerability missing
    }
    if (inner?.warlockAssignedCurseIsActive) {
      return 'true';
    }
    if (inner?.variableRef) {
      const varName = inner.variableRef.name;
      if (varName === 'In execute') return 'decimation.inactive';
      if (vars[varName]) return convertForeverCondition(vars[varName], vars);
    }
  }

  if (condNode.dotIsActive) {
    const spId = condNode.dotIsActive.spellId?.spellId;
    // For actions like Conflagrate requiring Immolate up, or cooldown bursts requiring DoTs up,
    // if action is conflag, require Immolate remains > 0 (or true); for racials/bursts, map to true
    if (spId === 25309) {
      return 'target.debuff_remains("Immolate") < 6';
    }
    return 'true';
  }

  if (condNode.auraIsActive) {
    const spId = condNode.auraIsActive.auraId?.spellId;
    if (spId === 18288) return 'buff.amplify_curse';
    if (spId === 17941) return 'buff.shadow_trance';
    if (spId === 17794) return 'buff.isb';
    if (spId === 440873) return 'decimation.active';
    if (spId === 1293696) return '!debuff.demonic_brand_missing';
  }

  if (condNode.cmp) {
    const { op, lhs, rhs } = condNode.cmp;
    let rhsVal = 0;
    if (rhs?.const?.val) rhsVal = parseForeverDurationSec(rhs.const.val);
    else if (rhs?.variableRef) {
      const refNode = vars[rhs.variableRef.name];
      if (refNode?.const?.val) rhsVal = parseForeverDurationSec(refNode.const.val);
    }

    let lhsNode = lhs;
    if (lhsNode?.variableRef && vars[lhsNode.variableRef.name]) {
      lhsNode = vars[lhsNode.variableRef.name];
    }

    if (lhsNode?.remainingTime) {
      if (op === 'OpGe' || op === 'OpGt') return `target_ttd >= ${rhsVal}`;
      if (op === 'OpLe' || op === 'OpLt') return `target_ttd < ${rhsVal}`;
    }
    if (lhsNode?.dotRemainingTime) {
      const spId = lhsNode.dotRemainingTime.spellId?.spellId;
      const spName = SPELL_ID_TO_DEBUFF_NAME[spId] || 'Corruption';
      if (op === 'OpLe' || op === 'OpLt') return `target.debuff_remains("${spName}") <= ${rhsVal}`;
      if (op === 'OpGe' || op === 'OpGt') return `target.debuff_remains("${spName}") > ${rhsVal}`;
    }
    if (lhsNode?.min?.vals) {
      // E.g. Dot floor: min(Corruption rem, Agony rem) >= 4s
      const dotVals = lhsNode.min.vals.filter(v => v.dotRemainingTime);
      if (dotVals.length > 0) {
        const cmpOp = (op === 'OpGe' || op === 'OpGt') ? '>' : '<=';
        const conds = dotVals.map(v => {
          const spId = v.dotRemainingTime.spellId?.spellId;
          const spName = SPELL_ID_TO_DEBUFF_NAME[spId] || 'Corruption';
          return `target.debuff_remains("${spName}") ${cmpOp} ${rhsVal}`;
        });
        return conds.join(' && ');
      }
    }
    if (lhsNode?.currentMana?.sourceUnit?.type === 'Pet') {
      const cmpOp = (op === 'OpLt') ? '<' : (op === 'OpLe' ? '<=' : (op === 'OpGt' ? '>' : '>='));
      return `pet_mana ${cmpOp} ${rhsVal}`;
    }
  }

  if (condNode.and) {
    const parts = condNode.and.vals.map(v => convertForeverCondition(v, vars)).filter(s => s && s !== 'true');
    if (!parts.length) return 'true';
    if (parts.length > 2) {
      // Prioritize debuff remaining <= 0 conditions (e.g. Bane of Agony remains <= 0)
      // along with debuff absence or fight timer
      const agonyRem = parts.find(p => p.includes('"Bane of Agony"') && p.includes('<='));
      const doomRem = parts.find(p => p.includes('"Bane of Doom"') && p.includes('<='));
      const ttd = parts.find(p => p.startsWith('target_ttd'));
      if (agonyRem && ttd) {
        return `${agonyRem} && ${ttd}`;
      }
      if (agonyRem && doomRem) {
        return `${agonyRem} && ${doomRem}`;
      }
      return `${parts[0]} && ${parts[1]}`;
    }
    return parts.join(' && ');
  }

  if (condNode.or) {
    const parts = condNode.or.vals.map(v => convertForeverCondition(v, vars)).filter(s => s && s !== 'true');
    if (!parts.length) return 'true';
    return parts[0];
  }

  return 'true';
}

// Expand at the reference position, resolving variables before entering another
// scope so a child override cannot change a parent's condition.
export function expandForeverAPLGroups(priorityList, { groups = [], valueVariables = [] } = {}) {
  const definitions = new Map();
  for (const group of groups) {
    if (definitions.has(group.name)) throw new Error(`Duplicate Forever APL group: ${group.name}`);
    definitions.set(group.name, group);
  }
  const bindings = list => Object.fromEntries(list.map(v => [v.name, v.value]));
  function resolve(node, vars, stack = []) {
    if (!node || typeof node !== 'object') return node;
    const ref = node.variableRef || node.variablePlaceholder;
    if (ref) {
      if (stack.includes(ref.name)) throw new Error(`Cyclic Forever APL variable: ${[...stack, ref.name].join(' -> ')}`);
      if (!Object.hasOwn(vars, ref.name)) throw new Error(`Missing Forever APL variable: ${ref.name}`);
      return resolve(vars[ref.name], vars, [...stack, ref.name]);
    }
    if (Array.isArray(node)) return node.map(n => resolve(n, vars, stack));
    return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, resolve(v, vars, stack)]));
  }
  function walk(items, vars, gates = [], stack = []) {
    return items.flatMap(item => {
      if (item.hide) return [];
      const action = item.action || {};
      // Ordinary top-level rows keep the existing translator in this step.
      if (!stack.length && !action.groupReference) {
        const spell = action.castSpell?.spellId?.spellId;
        if (![20572, 20554, 26297, 1259821].includes(spell)) return [item];
        return [{ ...item, foreverGroupPath: ['priorityList'], action: resolve(action, vars) }];
      }
      const condition = resolve(action.condition, vars);
      const combined = [...gates, condition].filter(Boolean);
      if (action.groupReference) {
        const ref = action.groupReference, name = ref.groupName;
        if (stack.includes(name)) throw new Error(`Cyclic Forever APL group: ${[...stack, name].join(' -> ')}`);
        const group = definitions.get(name);
        if (!group) throw new Error(`Missing Forever APL group: ${name}`);
        const overrides = Object.fromEntries((ref.variables || []).map(v => [v.name, resolve(v.value, vars)]));
        return walk(group.actions || [], { ...vars, ...bindings(group.variables || []), ...overrides }, combined, [...stack, name]);
      }
      return [{ ...item, foreverGroupPath: stack, action: { ...resolve(action, vars),
        condition: combined.length ? { and: { vals: combined } } : null } }];
    });
  }
  return walk(priorityList || [], bindings(valueVariables));
}

// Recognize source time-to-execute arithmetic without baking in fight duration.
function timeToExecutePercent(node) {
  if (node?.math?.op !== 'OpSub' || !node.math.lhs?.remainingTime) return null;
  const product = node.math.rhs?.math;
  if (product?.op !== 'OpMul') return null;
  const sum = product.lhs?.math;
  if (sum?.op !== 'OpAdd' || !((sum.lhs?.currentTime && sum.rhs?.remainingTime) || (sum.rhs?.currentTime && sum.lhs?.remainingTime))) return null;
  const match = product.rhs?.const?.val?.match(/^(\d+)%$/);
  return match && Number(match[1]) <= 100 ? Number(match[1]) : null;
}

// Same-subject interval simplification retains every gate while fitting the
// existing two-condition rows; contradictions emit no action alternatives.
function simplifyForeverBranches(branches) {
  return branches.flatMap(branch => {
    const atoms = [...new Set(branch)];
    const intervals = new Map();
    for (let i = 0; i < atoms.length; i++) {
      const m = atoms[i].match(/^(.*?)\s+(<=|>=|<|>)\s+(-?\d+(?:\.\d+)?)$/);
      if (!m) continue;
      const bounds = intervals.get(m[1]) || {};
      const key = m[2].startsWith('>') ? 'lower' : 'upper';
      const next = { index: i, value: Number(m[3]), strict: m[2].length === 1 };
      const old = bounds[key];
      if (!old || (key === 'lower' ? next.value > old.value : next.value < old.value) || (next.value === old.value && next.strict && !old.strict)) bounds[key] = next;
      intervals.set(m[1], bounds);
    }
    const retained = new Set();
    for (const { lower, upper } of intervals.values()) {
      if (lower && upper && (lower.value > upper.value || (lower.value === upper.value && (lower.strict || upper.strict)))) return [];
      if (lower) retained.add(lower.index);
      if (upper) retained.add(upper.index);
    }
    return [atoms.filter((atom, i) => !/\s+(<=|>=|<|>)\s+-?\d+(?:\.\d+)?$/.test(atom) || retained.has(i))];
  });
}

// Emit OR alternatives as adjacent rows for the same action. Each branch keeps
// all conjunctions; compilation below rejects conditions beyond shader capacity.
export function foreverGroupConditionBranches(node, negated = false) {
  const cross = (left, right) => {
    if (left.length * right.length > 64) throw new Error('Forever group condition exceeds 64 alternatives');
    return left.flatMap(a => right.map(b => [...a, ...b]));
  };
  if (!node) return negated ? [] : [[]];
  if (node.not) return foreverGroupConditionBranches(node.not.val, !negated);
  if (node.and || node.or) {
    const vals = (node.and || node.or).vals;
    const conjunction = Boolean(node.and) !== negated;
    return vals.reduce((out, val) => {
      const branches = foreverGroupConditionBranches(val, negated);
      return conjunction ? cross(out, branches) : [...out, ...branches];
    }, conjunction ? [[]] : []);
  }
  const spellName = id => {
    const name = SPELL_ID_TO_DEBUFF_NAME[id];
    if (!name) throw new Error(`Unsupported Forever group debuff: ${id}`);
    return name;
  };
  if (node.dotIsActive) {
    return [[`target.debuff_remains("${spellName(node.dotIsActive.spellId?.spellId)}") ${negated ? '<=' : '>'} 0`]];
  }
  if (node.cmp) {
    const { lhs, rhs, op } = node.cmp;
    const operators = { OpLt: '<', OpLe: '<=', OpGt: '>', OpGe: '>=' };
    let operator = operators[op];
    if (!operator) throw new Error(`Unsupported Forever group comparison: ${op}`);
    if (negated) operator = { '<': '>=', '<=': '>', '>': '<=', '>=': '<' }[operator];
    const match = rhs?.const?.val?.match(/^(\d+(?:\.\d+)?)\s*(ms|s|m|%)?$/);
    if (!match) throw new Error('Unsupported Forever group comparison value');
    const value = Number(match[1]) * ({ ms: .001, m: 60, '%': .01 }[match[2]] || 1);
    const executePercent = timeToExecutePercent(lhs);
    const subject = executePercent !== null ? `time_to_execute(${executePercent})` : lhs?.remainingTime ? 'target_ttd' : lhs?.dotRemainingTime
      ? `target.debuff_remains("${spellName(lhs.dotRemainingTime.spellId?.spellId)}")`
      : lhs?.currentMana?.sourceUnit?.type === 'Pet' ? 'pet_mana' : null;
    if (subject) return [[`${subject} ${operator} ${value}`]];
  }
  if (node.auraIsActive) {
    const id = node.auraIsActive.auraId?.spellId;
    const expression = id === 18288 ? (negated ? '!buff.amplify_curse' : 'buff.amplify_curse')
      : id === 17794 ? (negated ? 'buff.isb_missing' : 'buff.isb')
      : id === 440873 ? (negated ? '!buff.decimation' : 'buff.decimation') : null;
    if (expression) return [[expression]];
  }
  throw new Error(`Unsupported Forever group condition: ${Object.keys(node).filter(key => key !== 'uuid').join(', ')}`);
}

/**
 * Extracts sequence of actions from forever rotation priorityList into plain text APL
 * via direct AST condition translation without preset heuristics or arbitrary clamps.
 */
export function extractForeverAPL(priorityList, { valueVariables = [], groups = [], diagnostics = null } = {}) {
  if (!Array.isArray(priorityList)) return null;

  // Build variable lookup map
  const vars = {};
  if (Array.isArray(valueVariables)) {
    for (const v of valueVariables) {
      if (v?.name && v?.value) vars[v.name] = v.value;
    }
  }

  const lines = [];

  for (const item of expandForeverAPLGroups(priorityList, { groups, valueVariables })) {
    if (item.foreverGroupPath) {
      const id = item.action?.castSpell?.spellId || item.action?.channelSpell?.spellId;
      const alias = SPELL_ID_TO_ACTION[id?.spellId ?? id?.otherId];
      try {
        if (!alias) throw new Error(`Unsupported grouped action: ${JSON.stringify(id || item.action)}`);
        const branches = simplifyForeverBranches(foreverGroupConditionBranches(item.action.condition));
        const rows = branches.map(atoms => `${alias}${atoms.length ? ` if ${[...new Set(atoms)].join(' && ')}` : ''}`);
        // Validate every branch before emitting any; never weaken a group gate.
        if (rows.length) compileAPLToBytecode(parseAPLText(rows.join('\n')));
        lines.push(...rows);
      } catch (error) {
        if (!diagnostics) throw error;
        diagnostics.push({ groupPath: item.foreverGroupPath, action: id, condition: item.action.condition, reason: error.message });
      }
      continue;
    }
    const act = item.action || {};
    let spellId = null;

    if (act.castSpell?.spellId?.spellId) {
      spellId = act.castSpell.spellId.spellId;
    } else if (act.castSpell?.spellId?.otherId) {
      spellId = act.castSpell.spellId.otherId;
    } else if (act.channelSpell?.spellId?.spellId) {
      spellId = act.channelSpell.spellId.spellId;
    }

    if (spellId && SPELL_ID_TO_ACTION[spellId]) {
      const alias = SPELL_ID_TO_ACTION[spellId];
      if (alias === 'tap' && lines.length > 0 && lines[lines.length - 1] === 'Life Tap') {
        continue;
      }

      // Convert AST condition
      let condStr = convertForeverCondition(act.condition, vars);

      if (alias === 'brand' || (alias === 'searing' && condStr.includes('demonic_brand_missing'))) {
        lines.push('Demonic Brand if debuff.demonic_brand_missing');
      } else if (alias === 'decimateSoulFire' || (alias === 'soulfire' && condStr.includes('decimation.active'))) {
        lines.push('Decimation: Soul Fire if decimation.active');
      } else if (alias === 'decimateSearing' || (alias === 'searing' && condStr.includes('decimation.inactive'))) {
        lines.push('Decimation: Searing Pain if decimation.inactive');
      } else if (alias === 'nightfall' || (alias === 'bolt' && condStr.includes('buff.shadow_trance'))) {
        lines.push('Nightfall: Shadow Bolt if buff.shadow_trance');
      } else if (alias === 'berserking' || alias === 'bloodFury' || alias === 'eureka') {
        lines.push(alias);
      } else if (alias === 'curse') {
        if (condStr === 'true') condStr = 'target_ttd >= 60';
        lines.push(`Bane of Doom if ${condStr}`);
      } else if (alias === 'amplify') {
        lines.push(`Amplify Curse if ${condStr}`);
      } else if (alias === 'agony') {
        if (condStr === 'true') {
          lines.push('Bane of Agony if target.debuff_remains("Bane of Agony") <= 0');
        } else {
          if (condStr.includes('target.debuff_remains("Bane of Doom") <= 0') && condStr.includes('target.debuff_remains("Bane of Agony") <= 0')) {
            lines.push('Bane of Agony if !target.has_debuff("Bane of Doom") && target.debuff_remains("Bane of Agony") <= 0');
          } else {
            lines.push(`Bane of Agony if ${condStr}`);
          }
        }
      } else if (alias === 'corr') {
        lines.push(`Corruption if ${condStr === 'true' ? 'target.debuff_remains("Corruption") <= 0' : condStr}`);
      } else if (alias === 'immo') {
        lines.push(`Immolate if ${condStr === 'true' ? 'target.debuff_remains("Immolate") <= 0' : condStr}`);
      } else if (alias === 'siphon') {
        lines.push(`Siphon Life if ${condStr === 'true' ? 'target.debuff_remains("Siphon Life") <= 0' : condStr}`);
      } else if (alias === 'conflag') {
        lines.push(condStr === 'true' || condStr.includes('Immolate') ? 'conflag' : `conflag if ${condStr}`);
      } else if (alias === 'tap') {
        lines.push(condStr === 'true' ? 'Life Tap' : `Life Tap if ${condStr}`);
      } else {
        lines.push(condStr === 'true' ? alias : `${alias} if ${condStr}`);
      }
    }
  }

  return lines.length ? lines.join('\n') : null;
}

/**
 * Translates a complete forever build JSON into our app's candidate build object.
 */
export function convertForeverBuildToCandidate(foreverBuild, { candidateId = 'forever-imported', race: raceOverride = null, distance = null } = {}) {
  const player = foreverBuild.player || {};
  const warlockOpts = player.warlock?.options?.classOptions || {};

  const race = raceOverride ? (RACE_MAP[raceOverride] || raceOverride) : (RACE_MAP[player.race] || 'HUMAN');
  let pet = 'imp';
  let sacrifice = 'none';

  const summon = (warlockOpts.summon || '').toLowerCase();
  if (summon.includes('imp')) pet = 'imp';
  else if (summon.includes('succubus')) pet = 'succubus';
  else if (summon.includes('none')) pet = 'none';

  const sacrificed = (warlockOpts.sacrificedDemon || '').toLowerCase();
  if (sacrificed.includes('imp')) sacrifice = 'imp';
  else if (sacrificed.includes('succubus')) sacrifice = 'succubus';
  else if (sacrificed.includes('none')) sacrifice = 'none';

  const talents = decodeForeverTalentsString(player.talentsString);
  const buffs = mapForeverBuffs(foreverBuild);

  // Rotation
  const aplPriorityList = player.rotation?.priorityList;
  const valueVariables = player.rotation?.valueVariables || [];
  const importDiagnostics = [];
  const aplText = extractForeverAPL(aplPriorityList, { valueVariables, groups: player.rotation?.groups || [], diagnostics: importDiagnostics });

  // Equipment item mapping
  const equipmentItems = {};
  const items = player.equipment?.items || [];
  const slotNames = [
    'HEAD', 'NECK', 'SHOULDERS', 'BACK', 'CHEST', 'WRISTS',
    'HANDS', 'WAIST', 'LEGS', 'FEET', 'RING1', 'RING2',
    'TRINKET1', 'TRINKET2', 'MAIN_HAND', 'OFF_HAND', 'RANGED'
  ];

  items.forEach((item, index) => {
    if (item && item.id && index < slotNames.length) {
      equipmentItems[slotNames[index]] = item.id;
    }
  });

  const consumes = player.consumables || {};
  const hasSpellblastingPot = consumes.offensivePotId === 250937;

  return {
    schemaVersion: 1,
    classId: 'warlock',
    candidateId,
    importDiagnostics,
    encounter: {
      duration: 180,
      distance: distance ?? player.distanceFromTarget ?? 0,
      target: {
        level: 63,
        bossArmor: 3731,
        resistance: 0
      }
    },
    stats: mapForeverBonusStats(player),
    equipment: {
      mode: Object.keys(equipmentItems).length ? 'equipped' : 'direct',
      items: equipmentItems
    },
    buffs,
    talents,
    apl: aplText ? { kind: 'text', text: aplText } : null,
    classOptions: {
      race,
      pet,
      sacrifice,
      rotation: 'shadow'
    },
    channelClipDelayMs: Math.max(0, player.channelClipDelayMs ?? 0),
    book: true,
    trinketSP: hasSpellblastingPot ? 47 : 0,
    trinketDuration: hasSpellblastingPot ? 30 : 20,
    trinketCD: hasSpellblastingPot ? 120 : 120
  };
}
