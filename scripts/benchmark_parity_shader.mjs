import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import crypto from 'node:crypto';
// Isolated native-GPU draws; no browser or app source modifications.
const root=path.resolve(import.meta.dirname,'..');
const revisions=(process.env.BENCH_REVISIONS||'a0255f586,24e75ac7e,HEAD').split(',');
const output=path.resolve(root,process.env.BENCH_OUTPUT||'FOREVER_PERFORMANCE_INVESTIGATION.json');
const sweep=JSON.parse(fs.readFileSync(root+'/FOREVER_SWEEP.json'));
const configs=['sm_ruin','demo_fire_brand'].map(p=>({name:p,config:sweep.rows.find(r=>r.preset===p&&r.race==='HUMAN'&&r.profile==='baseline').config}));
configs.push({name:'sm_ruin_no_pet',config:{...configs[0].config,petChoice:'none'}});
const temp=fs.mkdtempSync('/tmp/parity-native-');
const report={configs,harnessHash:crypto.createHash('sha256').update(fs.readFileSync(import.meta.filename)).digest('hex'),status:'running',backend:'native surfaceless EGL GLES3',iterations:16384,warmups:2,repeats:5,notes:'GPU draw+finish timings only; compilation, readback, JavaScript decode and summaries excluded. Not the app end-to-end throughput. Historical fixes change gameplay/events.',stages:[]};
try {
 const runner=path.join(temp,'benchmark_gles.py');
 const source=fs.readFileSync(path.join(root,'threejs_webgl_des/validation/headless_gles.py'),'utf8');
 const drawAnchor="        call('glDrawArrays',None,[uint,integer,integer],0x0004,0,3)\n        report = []";
 if(!source.includes(drawAnchor))throw Error('GLES benchmark anchor changed');
 const benchmarkDraw="        if manifest.get('benchmark'):\n            for _ in range(2):\n                call('glDrawArrays',None,[uint,integer,integer],0x0004,0,3)\n                call('glFinish',None,[])\n            timings=[]\n            for _ in range(5):\n                start=time.perf_counter()\n                call('glDrawArrays',None,[uint,integer,integer],0x0004,0,3)\n                call('glFinish',None,[])\n                timings.append((time.perf_counter()-start)*1000)\n            call('glReadBuffer',None,[uint],0x8CE0)\n            pixel=(uint*4)()\n            call('glReadPixels',None,[integer,integer,integer,integer,uint,uint,pointer],0,0,1,1,0x8D99,0x1405,pixel)\n            outputs.append({'medianMs':statistics.median(timings),'samplesMs':timings,'firstPixel':list(pixel)})\n            continue\n        call('glDrawArrays',None,[uint,integer,integer],0x0004,0,3)\n        report = []";
 fs.writeFileSync(runner,source.replace('import sys','import sys\nimport time\nimport statistics').replace(drawAnchor,benchmarkDraw));
 for(const rev of revisions){
  const dir=path.join(temp,rev.replaceAll(/[^a-zA-Z0-9_-]/g,'_'));fs.mkdirSync(dir);fs.writeFileSync(dir+'/package.json','{"type":"module"}');
  for(const file of ['model.js','kernel.js'])fs.writeFileSync(dir+'/'+file,execFileSync('git',['show',rev+':threejs_webgl_des/src/'+file],{cwd:root}));
  const m=await import(pathToFileURL(dir+'/model.js')),k=await import(pathToFileURL(dir+'/kernel.js'));
  const cases=configs.map(({config})=>({mode:'fast',width:128,height:128,configWords:Array.from(m.packConfig(Object.fromEntries(Object.entries({...config,iterations:16384,seed:101}).filter(([key])=>key in m.DEFAULTS||key==='aplRules')))),uniforms:{numConfigs:1,fightsPerConfig:16384,seed:101,offset:0,count:16384,gridWidth:128,mode:0,eventBudget:6784}}));
  const file=dir+'/manifest.json';fs.writeFileSync(file,JSON.stringify({benchmark:true,vertex:'#version 300 es\n'+k.VERTEX,fast:'#version 300 es\n'+k.FAST_FRAGMENT,cases}));
  const data=JSON.parse(execFileSync('python3',[runner,file],{encoding:'utf8',timeout:180000,maxBuffer:1024*1024}));
  report.renderer=data.renderer;
  const results=data.outputs.map((r,i)=>{if((r.firstPixel[1]&65535)!==1)throw Error('Incomplete '+rev);return {name:configs[i].name,...r,gpuFightsPerSec:16384*1000/r.medianMs}});
  report.stages.push({revision:rev,resolvedRevision:execFileSync('git',['rev-parse',rev],{cwd:root,encoding:'utf8'}).trim(),fastStateWords:m.FAST_STATE_WORDS,shaderChars:k.FAST_FRAGMENT.length,results});
  fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(rev,results.map(r=>({name:r.name,ms:r.medianMs,events:r.firstPixel[2]})));
 }
 report.status='complete';fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
