"""Capture source Eureka cast timing without modifying the Forever checkout."""
import json, os, subprocess, sys, tempfile
from pathlib import Path
root = Path(__file__).resolve().parents[2]
checkout = Path(sys.argv[1]).resolve()
go = sys.argv[2] if len(sys.argv)>2 else 'go'
env = os.environ.copy()
exporter = root/'scripts/forever_export/main.go'
with tempfile.TemporaryDirectory(prefix='eureka-probe-') as tmp:
    work=Path(tmp)
    code=exporter.read_text().replace('_, sourceFile, _, _ := runtime.Caller(0)', '_, sourceFile, _, _ := runtime.Caller(0)\nsourceFile = '+json.dumps(str(exporter)))
    code=code.replace('requestJSON := raw(request)', 'request.SimOptions.Debug = true\nrequestJSON := raw(request)')
    main=work/'main.go'; main.write_text(code)
    binary=work/'exporter'
    subprocess.run([go,'build','-tags=with_db','-o',str(binary),str(main)],cwd=checkout,env=env,check=True)
    rows=[]
    for hit in [0,5,12]:
        scenario=json.loads((root/'fixtures/forever_gear_free_scenario.json').read_text())
        scenario['bonusStats']['hit']=hit
        file=work/'scenario.json';file.write_text(json.dumps(scenario))
        data=json.loads(subprocess.check_output([str(binary),'demo_shadow_brand','RaceGnome','1','101',str(file)],cwd=checkout,env=env,text=True))
        logs=data['result']['logs'].splitlines()
        selected=[line for line in logs if '1259821' in line or '440873' in line or ('Casting' in line and '17924' in line)]
        rows.append({'bonusHit':hit,'request':data['request'],'logs':selected})
    out={'notes':'One-fight source debug captures, seed 101. No source mechanics changed. Used for timing evidence, not DPS estimation.','rows':rows}
    (root/'FOREVER_EUREKA_RUNTIME_PROBE.json').write_text(json.dumps(out,indent=2)+'\n')
    for row in rows:
        print('hit',row['bonusHit'])
        for line in row['logs']: print(line)
