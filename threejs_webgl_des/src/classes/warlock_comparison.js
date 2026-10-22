import { FOREVER_PRESETS } from './warlock_defaults.js';
import { resolveSavedBuild } from '../contracts/build_io.js';

// Resolve the same saved builds used by Current Configuration. Keep source
// settings intact; comparison sampling settings are applied by the caller.
export async function loadForeverComparisonPresets(){
 return Promise.all(FOREVER_PRESETS.map(async preset=>{
  const resolved=await resolveSavedBuild(preset.build);
  const options=resolved.candidate.classOptions;
  return {...preset,race:options.race[0]+options.race.slice(1).toLowerCase(),
   pet:options.pet,sac:options.sacrifice,rotation:options.rotation,
   talents:resolved.candidate.talents,aplText:resolved.candidate.apl.text,
   resolvedConfig:resolved.config};
 }));
}
