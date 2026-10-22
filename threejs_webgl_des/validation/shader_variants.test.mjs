import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {simulationVariant,FRAGMENT,FAST_FRAGMENT} from '../src/kernel.js';
import {CONFIG,packConfig} from '../src/model.js';

test('stat, duration, seed and APL parameter changes reuse a feature program',()=>{
 const a=packConfig({}),b=packConfig({spellPower:700,duration:90,seed:31,crit:21});
 for(const detailed of [false,true]){
  assert.equal(simulationVariant(detailed,[a]).key,simulationVariant(detailed,[b]).key);
  assert.equal(simulationVariant(detailed,[a]).build(),simulationVariant(detailed,[b]).build());
 }
});
test('mixed pets keep petChoice dynamic and specialize other shared features',()=>{
 const a=packConfig({petChoice:'imp'}),b=packConfig({petChoice:'succubus'});
 const mixed=simulationVariant(false,[a,b]).build();
 assert.match(mixed,/c\.petChoice=/);
 assert.doesNotMatch(mixed,/c\.race\b/);
 assert.doesNotMatch(mixed,/c\.targetIsBeast\b/);
 assert.notEqual(simulationVariant(false,[a]).key,simulationVariant(false,[b]).key);
});
test('feature keys retain exact packed coefficient bits and output mode',()=>{
 const a=packConfig({}),b=a.slice();
 const index=Object.keys(CONFIG).indexOf('isb');b[index]^=1;
 assert.notEqual(simulationVariant(false,[a]).key,simulationVariant(false,[b]).key);
 assert.notEqual(simulationVariant(false,[a]).key,simulationVariant(true,[a]).key);
 assert.doesNotMatch(FAST_FRAGMENT,/uint aplHeaders0\[/);
 assert.doesNotMatch(FRAGMENT,/float aplParams0\[/);
});
test('material cache reuses variants, caps programs and preserves generic fallback',()=>{
 const source=readFileSync(new URL('../src/engine.js',import.meta.url),'utf8');
 const helper=source.slice(source.indexOf('function selectSimulationMaterial('),source.indexOf('\nfunction target('));
 const context={simulationVariant};vm.runInNewContext(helper+'\nglobalThis.select=selectSimulationMaterial;',context);
 let created=0;
 const e={variantMaterials:new Map(),makeMaterial:shader=>({id:++created,shader}),mesh:{},material:{generic:true},fastMaterial:{generic:true}};
 const a=packConfig({});context.select(e,false,[a]);const first=e.mesh.material;
 context.select(e,false,[packConfig({spellPower:999})]);assert.equal(e.mesh.material,first);
 const index=Object.keys(CONFIG).indexOf('isb');
 for(let i=1;i<=20;i++){const b=a.slice();b[index]+=i;context.select(e,false,[b]);}
 assert.equal(created,16);assert.equal(e.variantMaterials.size,16);assert.equal(e.mesh.material,e.fastMaterial);
 context.select(e,false,[a]);assert.equal(e.mesh.material,first);
});
