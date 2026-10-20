import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function worker({offline=false}={}){
 const handlers={}, writes=[], requests=[];
 const cached={status:200,version:'old',clone(){return this;}};
 const fresh={status:200,version:'new',clone(){return this;}};
 const cache={match:async()=>cached,put:async(request,response)=>writes.push(response)};
 vm.runInNewContext(readFileSync(new URL('../sw.js',import.meta.url),'utf8'),{
  self:{addEventListener:(name,handler)=>handlers[name]=handler,skipWaiting(){},clients:{claim(){}}},
  caches:{open:async()=>cache},URL,Request,console,
  fetch:async(request,options)=>{requests.push(options);if(offline)throw new Error('offline');return fresh;},
 });
 async function get(path,mode='cors'){
  let response;
  handlers.fetch({request:{method:'GET',url:'https://sim.example/'+path,mode},respondWith(value){response=value;}});
  return await response;
 }
 return {get,requests,writes};
}

test('current modules, schemas, data and pages replace stale cached versions',async()=>{
 for(const path of ['src/kernel.js','src/model.js','src/regret.js','data/presets.json','index.html']){
  const w=worker();assert.equal((await w.get(path)).version,'new');
  assert.equal(w.requests[0].cache,'no-cache');assert.equal(w.writes.length,1);
 }
 const w=worker();assert.equal((await w.get('','navigate')).version,'new');
});
test('offline modules fall back to cache; static assets reuse cache',async()=>{
 assert.equal((await worker({offline:true}).get('src/model.js')).version,'old');
 const w=worker();assert.equal((await w.get('assets/icon.png')).version,'old');assert.equal(w.requests.length,0);
});
