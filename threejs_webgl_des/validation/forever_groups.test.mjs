import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { expandForeverAPLGroups, extractForeverAPL, convertForeverBuildToCandidate } from '../src/classes/forever_bridge.js';
import { parseAPLText, compileAPLToBytecode } from '../src/apl.js';
const cast = (id, condition = null, hide = false) => ({ hide, action: { castSpell: { spellId: { spellId: id } }, condition } });
const ref = (name, condition = null, variables = []) => ({ action: { groupReference: { groupName: name, variables }, condition } });
const remaining = (op, value) => ({ cmp: { op, lhs: { remainingTime: {} }, rhs: { const: { val: `${value}s` } } } });
const variable = name => ({ variableRef: { name } });

test('groups expand in place, including nested and repeated references, without mutating input', () => {
  const groups = [{ name: 'Outer', actions: [cast(20572), ref('Inner')] }, { name: 'Inner', actions: [cast(25307)] }];
  const list = [cast(25311), ref('Outer'), cast(11689), ref('Inner')];
  const before = structuredClone({ list, groups });
  const expanded = expandForeverAPLGroups(list, { groups });
  assert.deepEqual(expanded.map(x => x.action.castSpell.spellId.spellId), [25311, 20572, 25307, 11689, 25307]);
  assert.deepEqual({ list, groups }, before);
});

test('parent and child gates survive; OR alternatives retain action priority and compile', () => {
  const groups = [{ name: 'Boost', actions: [cast(20572, remaining('OpGe', 10))] }];
  const gate = { or: { vals: [remaining('OpLt', 20), remaining('OpGt', 100)] } };
  const text = extractForeverAPL([cast(25311), ref('Boost', gate), cast(25307)], { groups });
  assert.deepEqual(text.split('\n').slice(1, 3), [
    'bloodFury if target_ttd < 20 && target_ttd >= 10',
    'bloodFury if target_ttd > 100',
  ]);
  assert.equal(compileAPLToBytecode(parseAPLText(text)).length, 4);
});

test('group defaults and reference overrides are scoped; parent gates retain caller bindings', () => {
  const groups = [{ name: 'Boost', variables: [{ name: 'gate', value: remaining('OpGt', 50) }], actions: [cast(20572, variable('gate'))] }];
  const valueVariables = [{ name: 'gate', value: remaining('OpLt', 100) }];
  const text = extractForeverAPL([ref('Boost', variable('gate')), ref('Boost', null, [{ name: 'gate', value: remaining('OpGe', 20) }])], { groups, valueVariables });
  assert.deepEqual(text.split('\n'), ['bloodFury if target_ttd < 100 && target_ttd > 50', 'bloodFury if target_ttd >= 20']);
});

test('hidden references and children are skipped; unused groups are not expanded', () => {
  const hidden = { ...ref('Missing'), hide: true };
  const groups = [{ name: 'Boost', actions: [cast(20572, null, true), cast(11689)] }, { name: 'Unused', actions: [ref('Missing')] }];
  assert.equal(extractForeverAPL([hidden, ref('Boost')], { groups }), 'tap');
});

test('missing groups, cycles and unresolved variables fail explicitly', () => {
  assert.throws(() => expandForeverAPLGroups([ref('Missing')]), /Missing Forever APL group/);
  assert.throws(() => expandForeverAPLGroups([ref('A')], { groups: [{ name: 'A', actions: [ref('B')] }, { name: 'B', actions: [ref('A')] }] }), /A -> B -> A/);
  assert.throws(() => expandForeverAPLGroups([ref('A')], { groups: [{ name: 'A', actions: [cast(20572, variable('missing'))] }] }), /Missing Forever APL variable/);
  assert.throws(() => expandForeverAPLGroups([ref('A')], { groups: [{ name: 'A', actions: [cast(20572, variable('loop'))] }], valueVariables: [{ name: 'loop', value: variable('loop') }] }), /Cyclic Forever APL variable/);
});

test('unsupported group predicates and items are diagnosed without broadening gates', () => {
  const diagnostics = [];
  const groups = [{ name: 'Boost', actions: [cast(20572, { unknown: {} }), { action: { castSpell: { spellId: { itemId: 250937 } } } }, cast(11689)] }];
  assert.equal(extractForeverAPL([ref('Boost')], { groups, diagnostics }), 'tap');
  assert.equal(diagnostics.length, 2);
  assert.throws(() => extractForeverAPL([ref('Boost')], { groups }), /Unsupported Forever group condition/);
});

test('captured Boosts gates keep both Doom branches and unsupported actions remain visible', () => {
  for (const id of ['sm_ruin', 'destro', 'aff_wrack', 'demo_shadow_brand', 'demo_fire_brand']) {
    const fixture = JSON.parse(readFileSync(new URL(`../../fixtures/canonical_forever/${id}.fixture.json`, import.meta.url)));
    const candidate = convertForeverBuildToCandidate(fixture.sourceBuild);
    const racialRows = candidate.apl.text.split('\n').filter(line => line.startsWith('bloodFury'));
    assert.equal(racialRows.length, id === 'aff_wrack' ? 1 : 2, id);
    if (id !== 'aff_wrack') {
      assert.match(racialRows[0], /Bane of Doom.*> 0.*&&.*<= 14/);
      assert.match(racialRows[1], /Bane of Doom.*<= 0.*&&.*target_ttd < 60/);
    }
    compileAPLToBytecode(parseAPLText(candidate.apl.text));
    assert.ok(candidate.importDiagnostics.some(d => d.action?.itemId === 250937));
  }
});

test('normal UI import retains grouped rows and exposes omitted-action diagnostics', async () => {
  const { prepareUIBuildImport } = await import('../src/contracts/ui_build.js');
  const fixture = JSON.parse(readFileSync(new URL('../../fixtures/canonical_forever/aff_wrack.fixture.json', import.meta.url)));
  const prepared = await prepareUIBuildImport(fixture.sourceBuild);
  assert.equal(prepared.kind, 'editable');
  assert.ok(prepared.rules.some(row => row.id === 'bloodFury'));
  assert.ok(prepared.importDiagnostics.some(d => d.action?.itemId === 250937));
  assert.deepEqual(prepared.importDiagnostics, prepared.logicalBuild.candidate.importDiagnostics);
});
