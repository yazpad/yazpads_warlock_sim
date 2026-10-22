// Isolated experiments: production kernel and model are never modified.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { FRAGMENT as CURRENT_FRAGMENT, FAST_FRAGMENT as CURRENT_FAST_FRAGMENT, VERTEX, simulationVariant } from '../threejs_webgl_des/src/kernel.js';
import { pathToFileURL } from 'node:url';
import * as model from '../threejs_webgl_des/src/model.js';

const root=path.resolve(import.meta.dirname,'..');
const {values:options}=parseArgs({options:{roundoff:{type:'boolean'},baseline:{type:'string'},browser:{type:'boolean'},validate:{type:'boolean'},'specialization-only':{type:'boolean'},multi:{type:'boolean'},detailed:{type:'boolean'},out:{type:'string',default:'/tmp/shader-recovery.json'},variants:{type:'string',default:'baseline,direct,features,features,direct,baseline'}}});
const {FRAGMENT,FAST_FRAGMENT}=options.baseline?await import(pathToFileURL(path.resolve(options.baseline))):{FRAGMENT:CURRENT_FRAGMENT,FAST_FRAGMENT:CURRENT_FAST_FRAGMENT};
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'shader-recovery-'));
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const sweep=JSON.parse(fs.readFileSync(path.join(root,'FOREVER_SWEEP.json')));
const configs=['sm_ruin','demo_fire_brand'].map(p=>({name:p,config:sweep.rows.find(r=>r.preset===p&&r.race==='HUMAN'&&r.profile==='baseline').config}));
configs.push({name:'sm_ruin_no_pet',config:{...configs[0].config,petChoice:'none'}});

export function directAPL(source){
 if(!source.includes('uint aplHeaders0['))return source;
 const preload=/  aplHeaders0\[numAplRules\]=h0;[\s\S]*?  numAplRules\+\+;/;
 assert(preload.test(source),'APL preload anchor changed');
 let result=source.replace(preload,'  numAplRules++;');
 for(const [name,offset,float] of [['aplHeaders0','APL_HEADER0_OFFSET',false],['aplHeaders1','APL_HEADER1_OFFSET',false],['aplParams0','APL_PARAM0_OFFSET',true],['aplParams1','APL_PARAM1_OFFSET',true]]){
  const read=`getConfigWord(currentCfgIdx,${offset}+r)`;
  result=result.replaceAll(`${name}[r]`,float?`uintBitsToFloat(${read})`:read);
  result=result.replace(new RegExp(`(?:uint|float) ${name}\\[\\d+\\];\\n`),'');
 }
 return result;
}

export function specialize(source,words,all=false){
 let result=source;
 for(const [index,[key,type]] of Object.entries(model.CONFIG).entries()){
  // Feature variants can be reused when stats, duration or APL parameters change.
  if(key.startsWith('apl')||(!all&&!(typeof model.DEFAULTS[key]==='boolean'||['petChoice','race','filler','racialPolicy'].includes(key))))continue;
  const assignment=new RegExp(`^ *c\\.${key}=[^;]+;`,'m');
  assert(assignment.test(result),`Config initialization anchor changed: ${key}`);
  const literal=type==='u32'?`${words[index]}u`:`uintBitsToFloat(${words[index]}u)`;
  result=result.replace(assignment,'').replace(new RegExp(`c\\.${key}\\b`,'g'),`(${literal})`);
 }
 return result;
}

function generate(base,variant,words,texture){
 if(variant==='production'){
  const packed=texture?Array.from({length:texture.height},(_,i)=>texture.words.slice(i*texture.width*4,i*texture.width*4+model.CONFIG_WORDS)):[words];
  return simulationVariant(base.includes('uint compactWord('),packed).build();
 }
 return variant==='baseline'?base:variant==='direct'?directAPL(base):specialize(directAPL(base),words,variant==='full');
}
const source=fs.readFileSync(path.join(root,'threejs_webgl_des/validation/headless_gles.py'),'utf8');
const anchor="        call('glDrawArrays',None,[uint,integer,integer],0x0004,0,3)\n        report = []";
assert(source.includes(anchor));
const draw=`        if manifest.get('benchmark'):
            for _ in range(2):
                call('glDrawArrays',None,[uint,integer,integer],0x0004,0,3)
                call('glFinish',None,[])
            timings=[]
            for _ in range(5):
                start=time.perf_counter()
                call('glDrawArrays',None,[uint,integer,integer],0x0004,0,3)
                call('glFinish',None,[])
                timings.append((time.perf_counter()-start)*1000)
            outputs.append({'medianMs':statistics.median(timings),'samplesMs':timings})
            continue
${anchor}`;
const runner=path.join(temp,'runner.py');
fs.writeFileSync(runner,source.replace('import sys','import sys\nimport time\nimport statistics').replace(anchor,draw));
const report={status:'running',startedAt:new Date().toISOString(),mode:options.detailed?'detailed':'fast',multi:!!options.multi,baselineHashes:{fast:hash(FAST_FRAGMENT),detailed:hash(FRAGMENT),model:hash(fs.readFileSync(path.join(root,'threejs_webgl_des/src/model.js')))},harnessHash:hash(fs.readFileSync(import.meta.filename)),stages:[],notes:'Native GPU draw+finish only. Excludes compilation, transfer, JS, and browser overhead. Candidate variants are experimental; no production files changed.'};
function save(){fs.writeFileSync(options.out,JSON.stringify(report,null,2)+'\n');}
function execute(cases,shaders,benchmark=false){
 const manifest=path.join(temp,'manifest.json');
 fs.writeFileSync(manifest,JSON.stringify({benchmark,vertex:'#version 300 es\n'+VERTEX,...shaders,cases}));
 return JSON.parse(execFileSync('python3',[runner,manifest],{encoding:'utf8',timeout:600000,maxBuffer:512*1024*1024}));
}
function makeCase(config,detailed,count=64,offset=0){
 const input=Object.fromEntries(Object.entries({...config,iterations:Math.max(count+offset,128),seed:101}).filter(([key])=>key in model.DEFAULTS||key==='aplRules'));
 const words=Array.from(model.packConfig(input));
 const width=Math.min(count,128);
 const result={configWords:words,width,height:Math.ceil(count/width)*(detailed?model.COMPACT_STRIPES:1),uniforms:{numConfigs:1,fightsPerConfig:count+offset,seed:101,offset,count,gridWidth:width,mode:0,eventBudget:65536}};
 if(options.multi){
  const texWidth=Math.ceil(model.CONFIG_WORDS/4),pixels=new Array(texWidth*4*3).fill(0);
  for(let i=0;i<3;i++)Array.from(model.packConfig({...input,spellPower:input.spellPower+i*10})).forEach((word,j)=>{pixels[i*texWidth*4+j]=word;});
  result.texture={width:texWidth,height:3,words:pixels};
  result.uniforms.numConfigs=3;result.uniforms.fightsPerConfig=Math.ceil((count+offset)/3);
 }
 return result;
}
function compareOutputs(actual,expected,detailed,width,label){
 if(!options.roundoff){assert.deepEqual(actual,expected,label);return {identical:true};}
 const floats=new Set(detailed?[0,5,6,26,29]:[0,5,6,8,11,14,15]);
 if(detailed){
  for(let i=0;i<6;i++)floats.add(8+i*3);
  for(let i=6;i<model.SPELLS.length;i++)floats.add(32+(i-6)*3);
  for(const offset of [6,7,8])floats.add(model.DETAIL_WORD_OFFSET+offset);
  model.DETAIL_EXTRA_OUTPUT.forEach(([,type],i)=>{if(type==='f32')floats.add(model.DETAIL_WORD_OFFSET+12+i);});
 }
 let floatDifferences=0,maxRelativeError=0,maxAbsoluteError=0;
 actual.forEach((attachment,a)=>{
  const af=new Float32Array(new Uint32Array(attachment).buffer),ef=new Float32Array(new Uint32Array(expected[a]).buffer);
  attachment.forEach((bits,i)=>{
   if(bits===expected[a][i])return;
   const stripe=detailed?Math.floor(Math.floor(i/4)/width)%model.COMPACT_STRIPES:0;
   const word=stripe*16+a*4+i%4;
   assert(floats.has(word),label+': integer/counter changed at word '+word);
   const abs=Math.abs(af[i]-ef[i]),relative=abs/Math.max(1,Math.abs(af[i]),Math.abs(ef[i]));
   assert(Number.isFinite(abs)&&relative<=1e-6,label+': float error exceeded 1e-6 at word '+word);
   floatDifferences++;maxRelativeError=Math.max(maxRelativeError,relative);maxAbsoluteError=Math.max(maxAbsoluteError,abs);
  });
 });
 return {identical:floatDifferences===0,integerWordsIdentical:true,floatDifferences,maxRelativeError,maxAbsoluteError};
}
try{
 if(options.browser){
  const shaders={directFast:directAPL(FAST_FRAGMENT),directDetailed:directAPL(FRAGMENT)};
  for(const {name,config} of configs)for(const detailed of [false,true]){
   shaders[name+(detailed?'Detailed':'Fast')]=generate(detailed?FRAGMENT:FAST_FRAGMENT,'features',makeCase(config,detailed).configWords);
  }
  const original=fs.readFileSync(path.join(root,'threejs_webgl_des/validation/browser_shader_compile.mjs'),'utf8');
  const browserRunner=original.replace("import { FRAGMENT, FAST_FRAGMENT } from '../src/kernel.js';",'')
   .replace("import { REGRET_FRAGMENT } from '../src/regret.js';",'')
   .replace('const shaders = { detailed: FRAGMENT, fast: FAST_FRAGMENT, regret: REGRET_FRAGMENT };',`const shaders=${JSON.stringify(shaders)};`);
  const file=path.join(temp,'browser.mjs');fs.writeFileSync(file,browserRunner);
  report.browser=JSON.parse(execFileSync(process.execPath,[file],{encoding:'utf8',timeout:180000,maxBuffer:4*1024*1024}));
  console.log(report.browser);
 }else if(options.validate){
  report.validation=[];
  // Every saved case, both output formats, arbitrary offsets. Generic direct reads.
  for(const preset of options['specialization-only']?[]:sweep.matrix.presets){
   const cases=[],shaders={},metadata=[];
   for(const row of sweep.rows.filter(r=>r.preset===preset))for(const detailed of [false,true]){
    const base=detailed?FRAGMENT:FAST_FRAGMENT;
    for(const variant of ['baseline',options.baseline?'production':'direct']){
     const c=makeCase(row.config,detailed,detailed?16:128,17);
     c.mode=(detailed?'detailed':'fast')+variant;
     // Each production feature set has its own program; the baseline is shared.
     const shader=generate(base,variant,c.configWords,c.texture);
     if(variant==='production')c.mode+=hash(shader);
     shaders[c.mode]='#version 300 es\n'+shader;cases.push(c);
    }
    metadata.push({id:row.id,detailed});
   }
   const data=execute(cases,shaders);report.renderer=data.renderer;
   const comparisons=metadata.map((m,i)=>({...m,...compareOutputs(data.outputs[2*i+1],data.outputs[2*i],m.detailed,cases[2*i].width,JSON.stringify(m))}));
   report.validation.push({preset,cases:metadata.length,identical:comparisons.every(c=>c.identical),comparisons});save();console.log(preset,metadata.length,'comparisons passed');
  }
  // Specialization candidates: complete outputs for the benchmark builds.
  for(const {name,config} of configs)for(const detailed of [false,true]){
   const shaders={},cases=[];
   for(const variant of ['baseline','direct','features','full']){
    const c=makeCase(config,detailed,128,17);c.mode=variant;
    shaders[variant]='#version 300 es\n'+generate(detailed?FRAGMENT:FAST_FRAGMENT,variant,c.configWords);cases.push(c);
   }
   const data=execute(cases,shaders);
   assert.deepEqual(data.outputs[1],data.outputs[0],name+' direct');
   assert.deepEqual(data.outputs[2],data.outputs[0],name+' features');
   let fullDifferentWords=0;
   data.outputs[3].forEach((a,i)=>a.forEach((word,j)=>{if(word!==data.outputs[0][i][j])fullDifferentWords++;}));
   report.validation.push({name,detailed,directIdentical:true,featuresIdentical:true,fullIdentical:fullDifferentWords===0,fullDifferentWords});save();console.log(name,detailed?'detailed':'fast','features identical; full differing words:',fullDifferentWords);
  }
 }else{
  report.configs=configs;report.iterations=options.detailed?1024:16384;report.warmups=2;report.repeats=5;
  for(const variant of options.variants.split(',')){
   assert(['baseline','direct','features','full','production'].includes(variant));
   const shaders={},cases=configs.map(({config},i)=>{
    const c=makeCase(config,!!options.detailed,report.iterations);c.mode='case'+i;
    shaders[c.mode]='#version 300 es\n'+generate(options.detailed?FRAGMENT:FAST_FRAGMENT,variant,c.configWords,c.texture);return c;
   });
   const data=execute(cases,shaders,true);report.renderer=data.renderer;
   const results=data.outputs.map((r,i)=>({name:configs[i].name,...r,fightsPerSecond:report.iterations*1000/r.medianMs,shaderHash:hash(shaders[cases[i].mode])}));
   report.stages.push({variant,results});save();console.log(variant,results.map(r=>({name:r.name,ms:r.medianMs})));
  }
 }
 report.status='complete';report.completedAt=new Date().toISOString();save();
}catch(error){report.status='failed';report.error=error.stack;save();throw error;}
finally{fs.rmSync(temp,{recursive:true,force:true});}
