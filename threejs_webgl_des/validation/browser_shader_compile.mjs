// Compile generated GLSL through Chrome/ANGLE, which rejects some Mesa extensions.
import assert from 'node:assert/strict';
import http from 'node:http';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { FRAGMENT, FAST_FRAGMENT, simulationVariant } from '../src/kernel.js';
import { packConfig } from '../src/model.js';
import { REGRET_FRAGMENT } from '../src/regret.js';
const browser = process.env.BROWSER_EXECUTABLE || (await import(process.env.PLAYWRIGHT_MODULE || 'playwright')).chromium.executablePath();
const shaders = { detailed: FRAGMENT, fast: FAST_FRAGMENT, regret: REGRET_FRAGMENT };
const imp=packConfig({petChoice:'imp'}),succubus=packConfig({petChoice:'succubus'});
shaders.featureFast=simulationVariant(false,[imp]).build();
shaders.featureDetailed=simulationVariant(true,[succubus]).build();
shaders.mixedFast=simulationVariant(false,[imp,succubus]).build();
const page = `<!doctype html><pre id="result"></pre><script>
const result = document.getElementById('result');
try {
 const gl = document.createElement('canvas').getContext('webgl2');
 if (!gl) throw Error('WebGL2 unavailable');
 const checks = Object.entries(${JSON.stringify(shaders).replaceAll('<', '\\u003c')}).map(([name,source]) => {
  const shader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(shader, '#version 300 es\\n' + source);
  gl.compileShader(shader);
  const check = {name,pass:gl.getShaderParameter(shader,gl.COMPILE_STATUS),log:gl.getShaderInfoLog(shader)};
  gl.deleteShader(shader);
  return check;
 });
 result.textContent = JSON.stringify({checks});
} catch (error) { result.textContent = JSON.stringify({error:String(error)}); }
</script>`;
const server = http.createServer((_req,res) => { res.setHeader('Content-Type','text/html'); res.end(page); });
try {
 await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
 const {stdout} = await promisify(execFile)(browser, ['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader','--dump-dom',`http://127.0.0.1:${server.address().port}`], {timeout:120000,maxBuffer:4*1024*1024});
 const match = stdout.match(/<pre id="result">([\s\S]*?)<\/pre>/);
 assert(match, 'Browser did not return shader checks');
 const report = JSON.parse(match[1].replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&'));
 console.log(JSON.stringify(report,null,2));
 assert(!report.error, report.error);
 assert(report.checks.every(check=>check.pass),'Browser shader compilation failed');
} finally { await new Promise(resolve=>server.close(resolve)); }
