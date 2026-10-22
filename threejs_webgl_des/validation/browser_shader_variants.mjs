// Exercise Three.js material selection, compilation, reuse, decoding and traces.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {spawn} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..');
const browser=process.env.BROWSER_EXECUTABLE||(await import('playwright')).chromium.executablePath();
const page=`<!doctype html><script type="importmap">{"imports":{"three":"/vendor/three.module.js"}}</script>
<script type="module">
const report={checks:[]};
const progress=message=>fetch('/progress',{method:'POST',body:message});
const check=(name,pass)=>{if(!pass)throw Error(name);report.checks.push(name);progress(name);};
try{
 await progress('Loading engine');
 const {runSimulation,runMultiSimulation,disposeEngine}=await import('/src/engine.js');
 await progress('Starting fast simulation');
 const config={duration:10,iterations:8,seed:101};
 const fast=await runSimulation(config,{detailedResults:false,trace:false,onProgress:p=>progress(p.phase)});
 check('fast lanes complete',fast.states.every(s=>s.done===1));
 const repeat=await runSimulation({...config,spellPower:800},{detailedResults:false,trace:false});
 check('stat edits reuse compiled material',repeat.timing.compileMs===0);
 const multi=await runMultiSimulation([config,{...config,spellPower:800}],{detailedResults:false});
 check('shared-feature search reuses material',multi.timing.compileMs===0);
 check('search lanes complete',multi.results.length===2&&multi.results.every(r=>r.states.every(s=>s.done===1)));
 const mixed=await runMultiSimulation([{...config,petChoice:'imp'},{...config,petChoice:'succubus'}],{detailedResults:false});
 check('mixed pet search completes',mixed.results.every(r=>r.states.every(s=>s.done===1)));
 const detailed=await runSimulation({...config,iterations:2},{detailedResults:true,trace:true});
 check('detailed lanes and diagnostic complete',detailed.states.every(s=>s.done===1));
 check('trace executes with specialized material',detailed.trace.length>0);
 disposeEngine();
 const recreated=await runSimulation({...config,iterations:2},{detailedResults:false,trace:false});
 check('renderer disposal releases cached materials',recreated.states.every(s=>s.done===1));
 disposeEngine();report.status='complete';
}catch(error){report.status='failed';report.error=error.stack;}
await fetch('/done',{method:'POST',body:JSON.stringify(report)});
</script>`;
let resolveResult;
const result=new Promise(resolve=>{resolveResult=resolve;});
const server=http.createServer((req,res)=>{
 if(req.url==='/progress'){let body='';req.on('data',c=>{body+=c;});req.on('end',()=>{console.log(body);res.end('ok');});return;}
 if(req.url==='/done'){
  let body='';req.on('data',c=>{body+=c;});req.on('end',()=>{res.end('ok');resolveResult(JSON.parse(body));});return;
 }
 if(req.url==='/'){res.setHeader('Content-Type','text/html');res.end(page);return;}
 const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 try{
  res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':'application/json');
  if(req.url==='/src/kernel.js'&&process.env.BROWSER_BASELINE){
   res.end(fs.readFileSync(process.env.BROWSER_BASELINE,'utf8')+'\nexport function simulationVariant(detailed){return {key:detailed?"baselineDetailed":"baselineFast",build(){return detailed?FRAGMENT:FAST_FRAGMENT;}};}');
  }else res.end(fs.readFileSync(file));
 }
 catch{res.writeHead(404).end();}
});
let processHandle,timer;
try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 processHandle=spawn(browser,['--no-sandbox','--disable-dev-shm-usage','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows','--enable-webgl','--use-angle='+(process.env.BROWSER_ANGLE||'swiftshader'),'--enable-unsafe-swiftshader',`http://127.0.0.1:${server.address().port}`],{stdio:'ignore'});
 const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Browser variant smoke timed out')),240000);});
 const exit=new Promise((_,reject)=>{processHandle.on('error',reject);processHandle.on('exit',code=>reject(Error('Browser exited: '+code)));});
 const report=await Promise.race([result,timeout,exit]);console.log(JSON.stringify(report,null,2));assert.equal(report.status,'complete',report.error);
}finally{clearTimeout(timer);processHandle?.kill();await new Promise(resolve=>server.close(resolve));}
