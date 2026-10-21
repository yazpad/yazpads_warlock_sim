"""Warm browser fast-mode comparison of archived revisions with identical inputs.

Runs isolated files in /tmp; never checks out or edits the app. Default backend
is SwiftShader so it can run without a display. Use --hardware for EGL/ANGLE.
"""
import argparse
import functools
import hashlib
import http.server
import io
import json
import pathlib
import shutil
import subprocess
import tarfile
import tempfile
import threading


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--iterations', type=int, default=8192)
    parser.add_argument('--repeats', type=int, default=3)
    parser.add_argument('--hardware', action='store_true')
    args = parser.parse_args()
    root = pathlib.Path(__file__).resolve().parent.parent
    browser = pathlib.Path('/home/aaron-ma/.cache/puppeteer/chrome-headless-shell/linux-131.0.6778.204/chrome-headless-shell-linux64/chrome-headless-shell')
    sweep = json.loads((root / 'FOREVER_SWEEP.json').read_text())
    configs = []
    for preset in ['sm_ruin', 'demo_fire_brand']:
        row = next(r for r in sweep['rows'] if r['preset'] == preset and r['race'] == 'HUMAN' and r['profile'] == 'baseline')
        configs.append({'name': preset, 'config': {**row['config'], 'iterations': args.iterations, 'seed': 101}})
    configs.append({'name': 'sm_ruin_no_pet', 'config': {**configs[0]['config'], 'petChoice': 'none'}})
    report = {'backend': 'ANGLE/EGL' if args.hardware else 'ANGLE/SwiftShader', 'iterations': args.iterations,
              'repeats': args.repeats, 'mode': 'fast', 'trace': False, 'stages': [],
              'harnessHash': hashlib.sha256(pathlib.Path(__file__).read_bytes()).hexdigest(), 'configs': configs}
    with tempfile.TemporaryDirectory(prefix='warlock-parity-perf-') as directory:
        temp = pathlib.Path(directory)
        for index, revision in enumerate(['a0255f586', '24e75ac7e', 'HEAD']):
            full = subprocess.check_output(['git', 'rev-parse', revision], cwd=root, text=True).strip()
            archive = subprocess.check_output(['git', 'archive', full, 'threejs_webgl_des/src'], cwd=root)
            stage = temp / f'stage{index}'
            stage.mkdir()
            with tarfile.open(fileobj=io.BytesIO(archive)) as tar:
                tar.extractall(stage, filter='data')
            report['stages'].append({'name': revision, 'revision': full, 'path': f'/stage{index}/threejs_webgl_des/src/engine.js',
                                     'kernelHash': hashlib.sha256((stage / 'threejs_webgl_des/src/kernel.js').read_bytes()).hexdigest()})
        for vendor in (root / 'threejs_webgl_des/vendor').glob('*.js'):
            shutil.copyfile(vendor, temp / vendor.name)
        payload = json.dumps(report)
        (temp / 'index.html').write_text('''<!doctype html><script type="importmap">{"imports":{"three":"/three.module.js"}}</script>
<script type="module">
const report=PAYLOAD;
try {
 const gl=document.createElement('canvas').getContext('webgl2');const ext=gl.getExtension('WEBGL_debug_renderer_info');
 report.renderer=ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);report.userAgent=navigator.userAgent;
 const median=a=>[...a].sort((x,y)=>x-y)[Math.floor(a.length/2)];
 for(const stage of report.stages){
  const engine=await import(stage.path), model=await import(stage.path.replace('/engine.js','/model.js'));stage.results=[];
  const adapt=c=>Object.fromEntries(Object.entries(c).filter(([k])=>k in model.DEFAULTS||k==='aplRules'));
  stage.unsupportedInputFields=Object.keys(report.configs[0].config).filter(k=>!(k in model.DEFAULTS)&&k!=='aplRules');
  const warm=await engine.runSimulation({...adapt(report.configs[0].config),iterations:100},{detailedResults:false,trace:false});
  stage.warmupTiming=warm.timing;
  for(const entry of report.configs){
   const samples=[];
   for(let i=0;i<report.repeats;i++){
    const r=await engine.runSimulation(adapt(entry.config),{detailedResults:false,trace:false});
    samples.push({timing:r.timing,throughput:entry.config.iterations*1000/r.timing.elapsedMs,meanDps:r.summary.mean,events:r.summary.events});
   }
   stage.results.push({name:entry.name,samples,medianThroughput:median(samples.map(x=>x.throughput)),
    medianExecuteMs:median(samples.map(x=>x.timing.executeMs)),medianDecodeMs:median(samples.map(x=>x.timing.decodeMs)),
    medianSummaryMs:median(samples.map(x=>x.timing.summaryMs))});
  }
  engine.disposeEngine();
  await fetch('/progress',{method:'POST',body:JSON.stringify({stage:stage.name,results:stage.results})});
 }
 report.status='complete';
}catch(error){report.status='failed';report.error=error.stack||String(error);}
await fetch('/report',{method:'POST',body:JSON.stringify(report)});
</script>'''.replace('PAYLOAD', payload))
        done, results = threading.Event(), []

        class Handler(http.server.SimpleHTTPRequestHandler):
            def log_message(self, *_args):
                pass

            def do_POST(self):
                data = json.loads(self.rfile.read(int(self.headers['Content-Length'])))
                if self.path == '/report':
                    results.append(data)
                    done.set()
                else:
                    print(json.dumps(data), flush=True)
                self.send_response(200)
                self.end_headers()

        server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Handler, directory=directory))
        threading.Thread(target=server.serve_forever, daemon=True).start()
        command = [str(browser), '--no-sandbox', '--disable-dev-shm-usage', '--enable-webgl', '--enable-unsafe-swiftshader',
                   '--use-angle=gl' if args.hardware else '--use-angle=swiftshader', f'http://127.0.0.1:{server.server_port}/']
        process = subprocess.Popen(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        try:
            if not done.wait(240):
                raise RuntimeError('Browser benchmark timed out')
        finally:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
            server.shutdown()
            server.server_close()
        result = results[0]
        (root / 'FOREVER_PERFORMANCE_INVESTIGATION.json').write_text(json.dumps(result, indent=2) + '\n')
        if result['status'] != 'complete':
            raise RuntimeError(result.get('error'))
        print('Renderer:', result['renderer'])


if __name__ == '__main__':
    main()
