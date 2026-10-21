import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { CONFIG, STATE, FAST_STATE, packConfig, validate } from '../src/model.js';
import { FRAGMENT, FAST_FRAGMENT, VERTEX } from '../src/kernel.js';
import { parseAPLText, compileAPLToBytecode } from '../src/apl.js';
import { resolveSavedBuild } from '../src/contracts/build_io.js';

const packedValue = (config, name) => {
  const index = Object.keys(CONFIG).indexOf(name);
  const packed = packConfig(config);
  return CONFIG[name] === 'f32' ? new Float32Array(packed.buffer)[index] : packed[index];
};
test('source channel delay survives normal import and packs milliseconds as microseconds', async () => {
  const source = JSON.parse(readFileSync(new URL('../../fixtures/canonical_forever/aff_wrack.fixture.json', import.meta.url))).sourceBuild;
  for (const delay of [0, 50, 125]) {
    const build = structuredClone(source);
    build.player.channelClipDelayMs = delay;
    const resolved = await resolveSavedBuild(build);
    assert.equal(resolved.candidate.channelClipDelayMs, delay);
    assert.equal(resolved.config.channelClipDelayMs, delay);
    assert.equal(packedValue(resolved.config, 'channelClipDelay'), delay * 1000);
  }
  assert.equal(packedValue({}, 'channelClipDelay'), 0);
  assert.throws(() => validate({ channelClipDelayMs: -1 }), /channelClipDelayMs/);
  assert.throws(() => validate({ channelClipDelayMs: 0.5 }), /integer/);
});

test('Wrack misses only consume the GCD; Soul Siphon counts other effects and caps at three in both modes', t => {
  const definitions=[
    ['miss',0,0,0,0,0], ['alone',1,0,0,0,0], ['corruption',1,1,0,0,0],
    ['doom',1,0,0,0,1], ['two',1,1,0,1,0], ['three',1,1,1,1,0], ['cap',1,1,1,1,1],
  ];
  const inputs=[],metadata=[];
  // Controlled hit outcomes and pre-existing target auras isolate channel behavior.
  // No production hooks are added; both real shaders execute the same action and ticks.
  for(const mode of ['detailed','fast'])for(const [name,hit,corr,agony,siphon,doom] of definitions){
    const schema=mode==='detailed'?STATE:FAST_STATE;
    const config={duration:6,distance:0,drainHope:true,petChoice:'none',spellPower:0,
      soulSiphonBonus:0.12,nightfall:false,isb:false,partialResists:false,
      aplRules:compileAPLToBytecode(parseAPLText('Wrack'))};
    const original=mode==='detailed'?FRAGMENT:FAST_FRAGMENT;
    const anchor=' decide();\n for(uint step=0u;step<eventBudget;step++)';
    assert.ok(original.includes(anchor));
    const shader=original.replace(anchor,` c.hit=${hit}.0;c.shadowCrit=0.0;c.shadowMult=1.0;c.power=0.0;
 s.corrTicks=${corr}u;s.agonyTicks=${agony}u;s.siphonTicks=${siphon}u;s.doomActive=${doom}u;
${anchor}`);
    inputs.push({mode,schema,shader,config});metadata.push({name,hit,effects:Math.min(3,corr+agony+siphon+doom)});
  }
  const dir=mkdtempSync(join(tmpdir(),'wrack-outcomes-'));
  t.after(()=>rmSync(dir,{recursive:true,force:true}));
  const results={};
  inputs.forEach(({mode,schema,shader,config},i)=>{
    const file=join(dir,`${i}.json`);
    writeFileSync(file,JSON.stringify({vertex:'#version 300 es\n'+VERTEX,[mode]:'#version 300 es\n'+shader,
      cases:[{mode,width:1,height:mode==='fast'?1:Math.ceil(Object.keys(schema).length/16),configWords:Array.from(packConfig(config)),
        uniforms:{numConfigs:1,fightsPerConfig:1,seed:42,offset:0,count:1,gridWidth:1,mode:1,eventBudget:65536}}]}));
    const run=spawnSync('python3',[fileURLToPath(new URL('./headless_gles.py',import.meta.url)),file],{encoding:'utf8',timeout:120000,maxBuffer:8*1024*1024});
    assert.equal(run.status,0,run.stderr||String(run.error));
    const raw=JSON.parse(run.stdout).outputs[0],floats=raw.map(x=>new Float32Array(new Uint32Array(x).buffer));
    const state=mode==='fast'?{total:floats[0][0],done:raw[0][1]&65535,spent:floats[3][3]}:Object.fromEntries(Object.entries(schema).map(([key,type],j)=>[key,(type==='f32'?floats:raw)[Math.floor(j%16/4)][Math.floor(j/16)*4+j%4]]));
    const {name,hit,effects}=metadata[i];results[mode+'/'+name]=state.total;
    assert.equal(state.done,1);
    const expected=hit?6*36*(1+0.12*effects):0;
    assert.ok(Math.abs(state.total-expected)<0.001,`${mode}/${name}: ${state.total} vs ${expected}`);
    if(!hit){
      assert.equal(state.spent,1000,`${mode}: five 200-mana attempts at 0, 1.5, 3, 4.5, 6s`);
      if(mode==='detailed'){
        assert.equal(state.drainHopeEnd,0,'miss creates no amplification aura');
        assert.equal(state.paidChannelEnd,0,'miss suppresses no channel regeneration');
        assert.equal(state.misses11,5);
      }
    }
  });
  for(const [name] of definitions)assert.equal(results['fast/'+name],results['detailed/'+name]);
});

test('fast and detailed shaders spend 200 mana per Wrack and delay decisions after the sixth tick', t => {
  const cases = [], metadata = [];
  for (const mode of ['detailed', 'fast']) for (const delay of [0, 50, 125]) {
    const config = { duration: 13, distance: 0, hit: 100, channelClipDelayMs: delay, drainHope: true,
      mp5: 0, petChoice: 'none', nightfall: false, isb: false,
      aplRules: compileAPLToBytecode(parseAPLText('Wrack')) };
    metadata.push({ mode, delay, maxMana: packedValue(config, 'maxMana') });
    cases.push({ mode, width: 64, height: 1, configWords: Array.from(packConfig(config)),
      uniforms: { numConfigs: 1, fightsPerConfig: 1, seed: 42, offset: 0, count: 64, gridWidth: 64, mode: 2, eventBudget: 65536 } });
  }
  const path = join(mkdtempSync(join(tmpdir(), 'wrack-timing-')), 'cases.json');
  writeFileSync(path, JSON.stringify({ vertex: '#version 300 es\n' + VERTEX,
    detailed: '#version 300 es\n' + FRAGMENT, fast: '#version 300 es\n' + FAST_FRAGMENT, cases }));
  const run = spawnSync('python3', [fileURLToPath(new URL('./headless_gles.py', import.meta.url)), path],
    { encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024 });
  assert.equal(run.status, 0, run.stderr || String(run.error));
  const { outputs, renderer } = JSON.parse(run.stdout); t.diagnostic(renderer);
  outputs.forEach((out, index) => {
    const { delay, maxMana, mode } = metadata[index];
    const mana = new Float32Array(new Uint32Array(out[1]).buffer);
    const events = Array.from({ length: 64 }, (_, i) => ({ time: out[0][i * 4], kind: out[0][i * 4 + 1], spell: out[0][i * 4 + 2], mana: mana[i * 4] }));
    const ticks = events.filter(e => e.kind === 3 && e.spell === 16);
    assert.deepEqual(ticks.slice(0, 12).map(e => e.time),
      [...Array.from({ length: 6 }, (_, i) => (i + 1) * 1000000),
       ...Array.from({ length: 6 }, (_, i) => (i + 7) * 1000000 + delay * 1000)], mode);
    assert.equal(ticks[0].mana, maxMana - 200, mode);
    const decision = events.find(e => e.kind === 5 && e.time === 6000000 + delay * 1000);
    assert.ok(decision, `${mode}: next decision at channel end + ${delay}ms`);
    assert.ok(Math.abs(decision.mana - (maxMana - 400 + delay / 1000 * (6.25 + 100 / 8))) < 0.02, `${mode}: spirit regenerates during the post-channel delay`);
  });
});
