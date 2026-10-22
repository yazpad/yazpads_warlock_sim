import { DEFAULTS, SPELLS, UPTIME_EFFECTS, DETAIL_WORD_OFFSET, DETAIL_EXTRA_OUTPUT, COMPACT_STRIPES, CONFIG, STATE, FAST_STATE, HEAP_CAPACITY, APL_HEADER0_OFFSET, APL_PARAM0_OFFSET, APL_HEADER1_OFFSET, APL_PARAM1_OFFSET, MAX_APL_RULES } from './model.js';
const type=t=>t==='u32'?'uint':'float';
const structure=(name,schema)=>`struct ${name} { ${Object.entries(schema).map(([k,t])=>`${type(t)} ${k};`).join('\n')} };`;
const word=(name,t)=>t==='f32'?`floatBitsToUint(s.${name})`:`s.${name}`;
export const VERTEX=`precision highp float;
in vec3 position;
void main(){ gl_Position=vec4(position,1.0); }`;

// Complete Table-Driven APL Bytecode VM Discrete Event Simulation per fragment.
export function buildFragment(detailed = true) {
const stateSchema = detailed ? STATE : FAST_STATE;
const counterSwitch = detailed ? `switch(spell){${Array.from({length:SPELLS.length},(_,i)=>`case ${i}u:s.casts${i}++;break;`).join('')}}` : '';
const missSwitch = detailed ? `switch(spell){${Array.from({length:SPELLS.length},(_,i)=>`case ${i}u:s.misses${i}++;break;`).join('')}}` : '';
const damageSwitch = detailed ? `switch(spell){${Array.from({length:SPELLS.length},(_,i)=>`case ${i}u:s.damage${i}+=amount;s.hits${i}++;s.crits${i}+=uint(crit);if(crit)s.critDamage${i}+=amount;break;`).join('')}}` : '';
const detailedCompactWord = detailed ? `uint compactWord(uint index){switch(index){
 case 0u:return floatBitsToUint(s.total);case 1u:return s.done|(s.highWater<<16u);case 2u:return s.events;case 3u:return s.taps|(s.procs<<16u);
 case 4u:return s.isbProcs|(s.isbConsumed<<16u);case 5u:return floatBitsToUint(s.petBrandDamage);case 6u:return floatBitsToUint(s.petDamage);case 7u:return s.petCasts|(s.rngCalls<<16u);
 ${Array.from({length:6},(_,i)=>`case ${8+i*3}u:return floatBitsToUint(s.damage${i});case ${9+i*3}u:return s.casts${i}|(s.hits${i}<<16u);case ${10+i*3}u:return s.crits${i}|(s.misses${i}<<16u);`).join('\n')}
 case 26u:return floatBitsToUint(s.petMeleeDamage);case 27u:return s.petMeleeCasts|(s.petMeleeHits<<16u);case 28u:return s.petMeleeCrits|(s.petMeleeMisses<<16u);
 case 29u:return floatBitsToUint(s.petSpellDamage);case 30u:return s.petSpellCasts|(s.petSpellHits<<16u);case 31u:return s.petSpellCrits|(s.petSpellMisses<<16u);
 ${SPELLS.slice(6).map((_,j)=>{const i=j+6,k=32+j*3;return `case ${k}u:return floatBitsToUint(s.damage${i});case ${k+1}u:return s.casts${i}|(s.hits${i}<<16u);case ${k+2}u:return s.crits${i}|(s.misses${i}<<16u);`;}).join('')}
 ${UPTIME_EFFECTS.filter((_,i)=>i%2===0).map(([,key],i)=>`case ${DETAIL_WORD_OFFSET+i}u:return uint(round(float(s.uptime_${key})/float(c.end)*65535.0))|(uint(round(float(s.uptime_${UPTIME_EFFECTS[i*2+1][1]})/float(c.end)*65535.0))<<16u);`).join('')}
 case ${DETAIL_WORD_OFFSET+6}u:return floatBitsToUint(s.spent);
 case ${DETAIL_WORD_OFFSET+7}u:return floatBitsToUint(s.manaWasted);
 case ${DETAIL_WORD_OFFSET+8}u:return floatBitsToUint(s.impDamage);
 case ${DETAIL_WORD_OFFSET+9}u:return s.impCasts|(s.impHits<<16u);
 case ${DETAIL_WORD_OFFSET+10}u:return s.impCrits|(s.impMisses<<16u);
 case ${DETAIL_WORD_OFFSET+11}u:return s.petSwapUsed;
 ${DETAIL_EXTRA_OUTPUT.map(([name,type,source],i)=>`case ${DETAIL_WORD_OFFSET+12+i}u:return ${type==='f32'?`floatBitsToUint(s.${source||name})`:`s.${source||name}`};`).join('\n')}
 default:return 0u;}}` : '';
const stripeCount = detailed ? `${COMPACT_STRIPES}u` : '1u';
const stateOverflow = detailed ? Array.from({length:SPELLS.length},(_,i)=>`if(max(max(s.casts${i},s.hits${i}),max(s.crits${i},s.misses${i}))>65535u)s.done=7u;`).join('\n') : '';
const stateWordFunction = detailed ? `uint stateWord(uint index){switch(index){${Object.entries(stateSchema).map(([k,t],i)=>`case ${i}u:return ${word(k,t)};`).join('\n')}default:return 0u;}}` : '';
const initialState = Object.entries(stateSchema).map(([k,t])=>`s.${k}=${t==='f32'?'0.0':'0u'};`).join('\n');
return `
precision highp float;
precision highp int;
precision highp usampler2D;
layout(location=0) out uvec4 report0;
layout(location=1) out uvec4 report1;
layout(location=2) out uvec4 report2;
layout(location=3) out uvec4 report3;
uniform uint configWords[${Object.keys(CONFIG).length}];
uniform highp usampler2D configTex;
uniform uint numConfigs;
uniform uint fightsPerConfig;
uniform uint seed;
uniform uint offset;
uniform uint count;
uniform uint gridWidth;
uniform uint mode;
uniform uint eventBudget;
${structure('FightConfig',CONFIG)}
${structure('FightState',stateSchema)}
struct Event { uint at; uint data; };
#define EV_KIND(e) ((e).data & 0xFFu)
#define EV_SPELL(e) (((e).data >> 8u) & 0xFFu)
#define EV_GEN(e) ((e).data >> 16u)
#define MAKE_EVENT(at, kind, spell, gen) Event((at), ((kind) & 0xFFu) | (((spell) & 0xFFu) << 8u) | (((gen) & 0xFFFFu) << 16u))
FightConfig c;
FightState s;
Event queue[${HEAP_CAPACITY}];
uvec2 rng[4];
float eventDamage;
bool dealingPeriodic = false;
uint eventFlags;
Event lastEvent;
uint currentCfgIdx;
uint numAplRules;

#define APL_HEADER0_OFFSET ${APL_HEADER0_OFFSET}u
#define APL_PARAM0_OFFSET ${APL_PARAM0_OFFSET}u
#define APL_HEADER1_OFFSET ${APL_HEADER1_OFFSET}u
#define APL_PARAM1_OFFSET ${APL_PARAM1_OFFSET}u
#define MAX_APL_RULES ${MAX_APL_RULES}u

uint getConfigWord(uint cfgIdx, uint wordIdx) {
  if (numConfigs <= 1u) return configWords[wordIdx];
  int texelX = int(wordIdx / 4u);
  uint comp = wordIdx % 4u;
  uvec4 val = texelFetch(configTex, ivec2(texelX, int(cfgIdx)), 0);
  if (comp == 0u) return val.r;
  if (comp == 1u) return val.g;
  if (comp == 2u) return val.b;
  return val.a;
}

uvec2 add64(uvec2 a,uvec2 b){uint low=a.x+b.x;return uvec2(low,a.y+b.y+uint(low<a.x));}
uint highMultiply(uint a,uint b){
 uint a0=a&65535u,a1=a>>16u,b0=b&65535u,b1=b>>16u;
 uint w0=a0*b0,t=a1*b0+(w0>>16u),w1=(t&65535u)+a0*b1;
 return a1*b1+(t>>16u)+(w1>>16u);
}
uvec2 mul64(uvec2 a,uvec2 b){return uvec2(a.x*b.x,highMultiply(a.x,b.x)+a.x*b.y+a.y*b.x);}
uvec2 shr64(uvec2 a,uint n){if(n>=32u)return uvec2(a.y>>(n-32u),0u);return uvec2((a.x>>n)|(a.y<<(32u-n)),a.y>>n);}
uvec2 rot64(uvec2 a,uint n){uvec2 v=a;uint k=n;if(n>=32u){v=a.yx;k-=32u;}return (v<<k)|(v.yx>>(32u-k));}
void seedRandom(uint index){
 uvec2 x=add64(uvec2(seed,0u),uvec2(index,0u));
 if(all(equal(x,uvec2(0u))))x=uvec2(0xbeefcafeu,0x0000deadu);
 for(int i=0;i<4;i++){
  x=add64(x,uvec2(0x7f4a7c15u,0x9e3779b9u));
  uvec2 z=mul64(x^shr64(x,30u),uvec2(0x1ce4e5b9u,0xbf58476du));
  z=mul64(z^shr64(z,27u),uvec2(0x133111ebu,0x94d049bbu));rng[i]=z^shr64(z,31u);
 }
}
float random01(){
 uvec2 value=mul64(rot64(mul64(rng[1],uvec2(5u,0u)),7u),uvec2(9u,0u));
 uvec2 t=uvec2(rng[1].x<<17u,(rng[1].y<<17u)|(rng[1].x>>15u));
 rng[2]^=rng[0];rng[3]^=rng[1];rng[1]^=rng[2];rng[0]^=rng[3];rng[2]^=t;rng[3]=rot64(rng[3],45u);
 s.rngCalls++;return float(value.y>>8u)*(1.0/16777216.0);
}
// Periodic events expire/apply before actions at the same timestamp.
bool eventBefore(Event a,Event b){
 uint ak=EV_KIND(a),bk=EV_KIND(b);
 uint ap=ak==13u?2u:((ak==3u||ak==14u)?0u:1u);
 uint bp=bk==13u?2u:((bk==3u||bk==14u)?0u:1u);
 return a.at<b.at||(a.at==b.at&&ap<bp);
}
void enqueue(uint at,uint kind,uint spell,uint generation){
 if(s.size>=${HEAP_CAPACITY}u){s.done=2u;return;}
 uint i=s.size++;s.highWater=max(s.highWater,s.size);Event e=MAKE_EVENT(at,kind,spell,generation);
 for(int guard=0;guard<6;guard++){
  if(i==0u)break;uint parent=(i-1u)/2u;if(!eventBefore(e,queue[parent]))break;queue[i]=queue[parent];i=parent;
 }
 queue[i]=e;
}
Event dequeue(){
 Event e=queue[0];s.size--;
 if(s.size>0u){Event tail=queue[s.size];uint i=0u;
  for(int guard=0;guard<6;guard++){
   uint left=2u*i+1u,right=left+1u,smallest=i;
   if(left<s.size){if(eventBefore(queue[left],tail))smallest=left;}
   if(right<s.size){
    bool before=smallest==i?eventBefore(queue[right],tail):eventBefore(queue[right],queue[left]);
    if(before)smallest=right;
   }
   if(smallest==i)break;queue[i]=queue[smallest];i=smallest;
  }
  queue[i]=tail;
 }return e;
}
void countCast(uint spell){${counterSwitch}}
void countMiss(uint spell){eventFlags|=2u;${missSwitch}}
void wisdomProc(bool pet){
 if(c.judgementOfWisdom==0u||random01()>=0.50)return;
 if(pet)s.petMana=min(c.petMaxMana,s.petMana+59.0);
 else{float gain=min(59.0,c.maxMana-s.mana);s.mana+=gain;s.gained+=gain;}
}
void damage(uint spell,float amount,bool crit){
 if(!dealingPeriodic&&(spell==0u||spell==3u||spell==4u||spell==5u||spell==7u||spell==8u||spell==9u))wisdomProc(false);
 if(c.race==2u&&c.targetIsBeast!=0u&&spell!=12u)amount*=1.05;
 s.total+=amount;eventDamage+=amount;if(crit)eventFlags|=1u;
 ${damageSwitch}
}
${detailed ? `void periodicDamage(uint spell,float amount,bool crit){
 float applied=amount;
 if(c.race==2u&&c.targetIsBeast!=0u&&spell!=12u)applied*=1.05;
 dealingPeriodic=true;damage(spell,amount,crit);dealingPeriodic=false;
 switch(spell){${SPELLS.map((_,i)=>`case ${i}u:s.ticks${i}++;s.tickCrits${i}+=uint(crit);s.tickDamage${i}+=applied;if(crit)s.tickCritDamage${i}+=applied;break;`).join('')}}
}
` : 'void periodicDamage(uint spell,float amount,bool crit){dealingPeriodic=true;damage(spell,amount,crit);dealingPeriodic=false;}'}float isbMultiplier(){
 if(s.now>=s.isbEnd)return 1.0;
 s.isbConsumed++;return 1.0+c.isb;
}
float resistanceMultiplier(){
 float resistance=max(0.0,c.resistance-(s.now<s.elementsEnd&&c.externalElements==0u?75.0:0.0))-c.penetration;
 if(resistance<0.0&&c.piercing!=0u)return 1.0-resistance*0.00575;
 if(resistance<=0.0||c.partial==0u)return 1.0;
 float roll=random01();if(roll<0.76)return 1.0;if(roll<0.95)return 0.75;if(roll<0.99)return 0.5;return 0.25;
}
float currentShadowMult(){return c.shadowMult*(s.now<s.elementsEnd&&c.externalElements==0u?1.10:1.0)*(s.now<s.snfShadowEnd?(1.0+c.snfBonus):1.0);}
float currentFireMult(){return c.fireMult*(s.now<s.elementsEnd&&c.externalElements==0u?1.10:1.0)*(s.now<s.snfFireEnd?(1.0+c.snfBonus):1.0);}
float currentPower(){return c.power+(c.race==1u&&s.now<s.racialEnd?c.basePower*0.10:0.0)+(s.now<s.trinketEnd?c.trinketSP:0.0);}
float manaMultiplier(){return s.now<s.eurekaEnd?0.9:1.0;}
float hasteMultiplier(){return c.race==2u&&s.now<s.racialEnd?1.10:1.0;}
float baseCost(uint spell){switch(spell){
 case 0u:return c.boltCost;case 1u:return c.corrCost;case 2u:return 215.0;
 case 3u:return c.immCost;case 4u:return 325.0*c.cataclysmCostMult;case 13u:return 335.0*c.cataclysmCostMult;
 case 23u:return 1300.0*c.cataclysmCostMult;case 6u:return 300.0;case 8u:return 255.0*c.cataclysmCostMult;
 case 9u:return 365.0*c.cataclysmCostMult;case 10u:return 365.0;case 11u:return 200.0;
 default:return 168.0*c.cataclysmCostMult;}}
float cost(uint spell){return baseCost(spell)*((spell==0u||spell==3u||spell==5u||spell==8u||spell==9u||spell==13u||spell==11u)?manaMultiplier():1.0);}
void spend(uint spell){
 float amount=cost(spell);s.mana-=amount;s.spent+=amount;if(amount>0.0)s.spiritRegenAt=s.now+5000000u;countCast(spell==13u?7u:spell==23u?13u:spell);
 s.castBonus=(s.now<s.eurekaEnd&&(spell==0u||spell==3u||spell==5u||spell==8u||spell==9u||spell==13u))?1.10:1.0;
 if(c.race==4u&&s.now>=s.graveReady&&random01()<0.30){s.graveReady=s.now+25000000u;damage(12u,c.maxHealth*0.05*((c.externalElements!=0u||s.now<s.elementsEnd)?1.10:1.0),false);}
}
bool racialInAPL(uint action){
 for(uint r=0u;r<numAplRules;r++)if((getConfigWord(currentCfgIdx,APL_HEADER0_OFFSET+r)&0xFFu)==action)return true;
 return false;
}
bool eurekaInAPL(){return racialInAPL(20u);}
// Dynamic pets inherit changed owner stats on the next shared 5.25s heartbeat.
void queuePetInheritance(){
 if(c.petChoice==0u)return;
 uint phase=s.petHeartbeatPhase;
 uint next=s.now<phase?phase:phase+((s.now-phase)/5250000u+1u)*5250000u;
 if(s.petInheritAt<=s.now||next<s.petInheritAt){s.petInheritAt=next;enqueue(next,14u,0u,0u);}
}
uint petManaWait(float needed){
 if(c.petMP5<=0.0)return 100000u;
 return max(100000u,uint(ceil(max(0.0,needed-s.petMana)*5000000.0/c.petMP5)));
}
void queueFirebolt(){
 if(s.petMana>=115.0){if(s.now+2000000u<=c.end)enqueue(s.now+2000000u,6u,100u,0u);}
 else{uint next=s.now+petManaWait(115.0);if(next<=c.end)enqueue(next,6u,102u,0u);}
}
void activateBerserking(){${detailed ? 's.racialCasts++;' : ''}s.racialReady=s.now+180000000u;s.racialEnd=s.now+10000000u;}
void activateBloodFury(){${detailed ? 's.racialCasts++;' : ''}s.racialReady=s.now+180000000u;s.racialEnd=s.now+15000000u;queuePetInheritance();enqueue(s.racialEnd,15u,0u,0u);}
void activateEureka(){${detailed ? 's.racialCasts++;' : ''}s.racialReady=s.now+120000000u;s.eurekaEnd=s.now+8000000u;}
void checkRacial(){
 if((c.race==3u&&eurekaInAPL())||(c.race==1u&&racialInAPL(21u))||(c.race==2u&&racialInAPL(22u)))return;
 if(s.now<s.racialReady)return;
 if(c.race==3u&&c.autoCooldowns!=0u){activateEureka();return;}
 if(c.race==2u&&c.autoCooldowns!=0u){activateBerserking();return;}
 bool execute=float(s.now)>=float(c.end)*0.65;
 uint cooldown=c.race==3u?120000000u:180000000u;
 bool trigger=c.racialPolicy==1u||execute||(c.racialPolicy==2u&&s.now<1000000u&&float(c.end)*0.65>=float(cooldown));
 if(c.race==1u||c.race==3u){
  uint window=c.race==1u?14000000u:6000000u;
  if(s.doomActive!=0u){if(s.doomEnd>c.end||s.doomEnd-s.now>window)return;trigger=true;}
  else if(c.race==1u&&c.curseOfDoom!=0u&&c.end-s.now>=60000000u)return;
  if(!trigger)return;
  if(c.race==1u)activateBloodFury();else activateEureka();
 }else if(c.race==2u&&trigger){${detailed ? 's.racialCasts++;' : ''}s.racialReady=s.now+180000000u;s.racialEnd=s.now+10000000u;}
}
void applyDot(uint spell){
 if(random01()>=c.hit){countMiss(spell);return;}
 wisdomProc(false);
 if(spell==1u){s.corrBonus=s.castBonus;s.corrTicks=6u;s.corrGen++;s.corrEnd=s.now+18000000u;enqueue(s.now+3000000u,3u,spell,s.corrGen);}
 if(spell==2u){s.agonySpellPowerShare=currentPower()*1.596/12.0;s.agonyBonus=s.castBonus;uint isAmp=(s.now<s.amplifyEnd)?1u:0u;s.agonyAmplified=isAmp;s.agonyTicks=12u;s.agonyGen++;s.agonyEnd=s.now+24000000u;enqueue(s.now+2000000u,3u,spell,s.agonyGen);}
}
void immolateImpact(){
 if(random01()>=c.hit){countMiss(3u);return;}
 bool crit=random01()<c.fireCrit;
 float amount=(c.immDirect+0.20*currentPower())*(crit?c.directCrit:1.0)*currentFireMult()*(1.0+c.afBonus)*(1.0+c.aftermathBonus);
 amount*=resistanceMultiplier();damage(3u,amount*s.castBonus,crit);
 s.immBonus=1.0;s.immTicks=5u;s.immGen++;s.immEnd=s.now+15000000u;enqueue(s.now+3000000u,3u,3u,s.immGen);
}
void soulFireImpact(){
 if(random01()>=c.hit){countMiss(7u);return;}
 float roll=random01(),p=currentPower();
 float amount=(340.0+roll*197.15+1.0*p)*currentFireMult()*(1.0+c.afBonus);
 bool crit=random01()<c.fireCrit;
 if(crit)amount*=c.directCrit;
 amount*=resistanceMultiplier();damage(7u,amount*s.castBonus,crit);
}
// Shadow Bolt and Searing Pain resolve hit at cast completion, before deciding
// the next action. Bits: 0 = Eureka, 1 = miss, 2 = hit outcome already rolled.
uint castHitOutcome(uint spell){
 bool landed=random01()<c.hit;
 if(landed&&c.decimation!=0u&&(spell==0u||spell==5u)){
  float fightProg=float(s.now)/max(1.0,float(c.end));
  if((1.0-fightProg)<=0.35)s.decimationEnd=s.now+10000000u;
 }
 return uint(s.castBonus>1.0)|4u|(landed?0u:2u);
}
void directImpact(uint spell,uint outcome){
 if(spell==13u){soulFireImpact();return;}
 if((outcome&4u)!=0u?((outcome&2u)!=0u):(random01()>=c.hit)){countMiss(spell);return;}
 float roll=random01(),amount,p=currentPower();
 bool crit=false;
 if(spell==0u){
  amount=(c.boltMin+roll*(c.boltMax-c.boltMin)+(3.0/3.5)*p)*currentShadowMult()*(1.0+c.shadowMasteryBonus)*(1.0+c.afBonus);
  float fightProg=float(s.now)/max(1.0,float(c.end));
  if((1.0-fightProg)<=0.35&&c.decimation!=0u)amount*=(1.0+0.03*float(c.decimationRank));
  amount*=isbMultiplier();
  crit=random01()<c.shadowCrit;
  if(crit){amount*=c.directCrit;if(c.isb>0.0){s.isbEnd=s.now+12000000u;s.isbProcs++;}}
 }
 else if(spell==4u){
  amount=(201.0+roll*32.0+(2.5/3.5)*p)*(s.immTicks>0u?1.25:1.0)*currentFireMult()*(1.0+c.afBonus);
  crit=random01()<c.fireCrit;
  if(crit)amount*=c.directCrit;
 }
 else if(spell==5u){
  amount=(108.0+roll*19.0+(1.5/3.5)*p);
  float fightProg=float(s.now)/max(1.0,float(c.end));
  if((1.0-fightProg)<=0.35&&c.decimation!=0u)amount*=(1.0+0.03*float(c.decimationRank));
  amount*=currentFireMult()*(1.0+c.afBonus);
  crit=random01()<(c.fireCrit+c.afBonus);
  if(crit)amount*=c.directCrit;
 }
 else if(spell==13u){
  soulFireImpact();
  return;
 }
 else{amount=0.0;}
 amount*=resistanceMultiplier();damage(spell,amount*s.castBonus,crit);
 if(spell==5u&&c.demonicBrand!=0u){s.brandCharges=c.demonicBrandRank*2u;s.brandEnd=s.now+10000000u;}
}
void launchBolt(){enqueue(s.now,2u,0u,castHitOutcome(0u));}
void tick(Event e){
 float amount,p=currentPower();uint remaining=0u,interval=3000000u;
 uint sp=EV_SPELL(e),gen=EV_GEN(e);
 if(sp==1u){
  if(gen!=s.corrGen||s.corrTicks==0u)return;
  s.corrTicks--;remaining=s.corrTicks;
  amount=(c.corrBase+p*1.2/6.0)*c.corrMultiplier*(s.now<s.elementsEnd&&c.externalElements==0u?1.10:1.0)*(s.now<s.snfShadowEnd?(1.0+c.snfBonus):1.0)*(s.now<s.drainHopeEnd?1.10:1.0);
  bool crit=random01()<c.shadowCrit;if(crit)amount*=c.dotCrit;
  amount*=isbMultiplier();periodicDamage(1u,amount*s.corrBonus,crit);
  if(c.nightfall>0.0){if(random01()<c.nightfall){s.trance=1u;s.tranceEnd=s.now+10000000u;s.procs++;enqueue(s.tranceEnd,8u,0u,0u);}}
  if(remaining>0u)enqueue(s.now+3000000u,3u,1u,gen);
  return;
 }else if(sp==2u){
  if(gen!=s.agonyGen||s.agonyTicks==0u)return;
  s.agonyTicks--;remaining=s.agonyTicks;interval=2000000u;
  uint index=12u-remaining;float ramp=index<=4u?0.5:(index<=8u?1.0:1.5);
  float baseTick=46.0;
  float ampMult=s.agonyAmplified!=0u?1.5:1.0;
  // Spell power is fixed on application; damage multipliers remain dynamic.
  amount=(baseTick*ramp+s.agonySpellPowerShare)*ampMult*currentShadowMult()*(1.0+c.shadowMasteryBonus)*(1.0+c.maledictionBonus)*(1.0+c.improvedAgonyBonus)*(s.now<s.drainHopeEnd?1.10:1.0);
  bool crit=random01()<c.shadowCrit;if(crit)amount*=c.dotCrit;
  amount*=isbMultiplier();periodicDamage(2u,amount*s.agonyBonus,crit);
  if(remaining>0u)enqueue(s.now+interval,3u,2u,gen);
  return;
 }else if(sp==3u){
  if(gen!=s.immGen||s.immTicks==0u)return;
  s.immTicks--;remaining=s.immTicks;amount=(c.immTick+0.13*p)*currentFireMult()*(1.0+c.afBonus)*(1.0+c.maledictionBonus);
  bool crit=random01()<c.fireCrit;if(crit)amount*=c.directCrit;
  periodicDamage(3u,amount*s.immBonus,crit);
  if(remaining>0u)enqueue(s.now+3000000u,3u,3u,gen);
  return;
 }else if(sp==15u){
  if(gen!=s.siphonGen||s.siphonTicks==0u)return;
  s.siphonTicks--;remaining=s.siphonTicks;
  amount=(41.0+0.05*p)*currentShadowMult()*(1.0+c.shadowMasteryBonus)*(1.0+c.maledictionBonus);
  bool crit=random01()<c.shadowCrit;if(crit)amount*=c.dotCrit; // Current rank-4 data permits periodic crits
  amount*=isbMultiplier();periodicDamage(10u,amount*s.siphonBonus,crit);
  if(remaining>0u)enqueue(s.now+3000000u,3u,15u,gen);
  return;
 }else if(sp==16u){
  // Only the caster's other active Affliction effects count; Wrack is not tagged.
  uint affCount=(s.corrTicks>0u?1u:0u)+(s.agonyTicks>0u?1u:0u)+(s.siphonTicks>0u?1u:0u)+(s.doomActive!=0u?1u:0u);
  float soulSiphonMult=1.0+c.soulSiphonBonus*float(min(3u,affCount));
  float affBonus=(1.0+c.shadowMasteryBonus)*(1.0+c.maledictionBonus)*(1.0+c.improvedDrainsBonus);
  amount=(36.0+0.143*p)*currentShadowMult()*affBonus*soulSiphonMult;
  bool crit=random01()<c.shadowCrit;if(crit)amount*=c.dotCrit;
  amount*=isbMultiplier();amount*=resistanceMultiplier();
  periodicDamage(11u,amount*(s.now<s.eurekaEnd?1.10:1.0),crit);
  if(c.nightfall>0.0){if(random01()<c.nightfall){s.trance=1u;s.tranceEnd=s.now+10000000u;s.procs++;enqueue(s.tranceEnd,8u,0u,0u);}}
  return;
 }else if(sp==23u){
  // One nearby target; self damage is reported separately from enemy damage.
  amount=(210.0+0.022*(p+c.hellfirePowerOffset))*currentFireMult()*(1.0+c.afBonus)*(1.0+c.maledictionBonus);
  periodicDamage(13u,amount*resistanceMultiplier(),false);
  if(gen<15u)enqueue(s.now+1000000u,3u,23u,gen+1u);
  return;
 }else if(sp==20u){
  if(gen!=s.agonyGen||s.doomActive==0u)return;
  // Wrack amplifies Corruption and Agony; Doom's class flags are excluded.
  s.doomActive=0u;amount=(1742.0+4.0*p)*currentShadowMult()*(1.0+c.shadowMasteryBonus)*(1.0+c.maledictionBonus);
  bool crit=random01()<c.shadowCrit;if(crit)amount*=c.dotCrit;
  amount*=isbMultiplier();amount*=resistanceMultiplier();
  periodicDamage(6u,amount,crit);return;
 }else{return;}
}
void gcd(){
 s.ready=s.now+uint(floor(max(1000000.0,1500000.0/hasteMultiplier())/1000.0+0.5))*1000u;enqueue(s.ready,5u,0u,0u);
 // Throw after an instant spell, while its GCD is already running.
 if(c.autoCooldowns!=0u&&c.ezThroDynamite!=0u&&s.now>=s.explosiveReady&&s.casting==0u){
  s.explosiveReady=s.now+60000000u;s.casting=1u;enqueue(s.now+1000000u,16u,0u,0u);
 }
}
void tap(){${detailed ? 's.manaWasted+=max(0.0,s.mana+c.tapGain-c.maxMana);' : ''}s.mana=min(c.maxMana,s.mana+c.tapGain);s.gained+=c.tapGain;s.taps++;if(c.petChoice!=0u&&c.demonicEnergies>0.0){float petMax=c.petMaxMana;s.petMana=min(petMax,s.petMana+c.tapGain*0.5*c.demonicEnergies);}gcd();}
void beginCast(uint spell){
 if(spell==0u&&s.trance!=0u){s.trance=0u;spend(0u);launchBolt();gcd();return;}
 if(spell==2u||(spell==1u&&c.corrCast==0u)){spend(spell);applyDot(spell);if(spell==2u)s.amplifyEnd=0u;gcd();return;}
 uint duration=2500000u;
 if(spell==1u)duration=c.corrCast;
 else if(spell==3u)duration=uint(max(1.0,2.0-0.1*float(c.baneRank))*1000000.0);
 else if(spell==5u)duration=1500000u;
 else if(spell==4u)duration=uint(max(1.0,2.5-0.1*float(c.baneRank))*1000000.0);
 else if(spell==13u){
  float castTime=6.0-0.4*float(c.baneRank);
  if(s.decimationEnd>s.now)castTime*=1.0-0.20*float(c.decimationRank);
  duration=uint(max(0.5,castTime)*1000000.0);
 }
 else if(spell==0u)duration=uint(max(1.0,3.0-0.1*float(c.baneRank))*1000000.0);
 // Forever rounds hasted cast times and GCDs to the nearest millisecond.
 duration=uint(floor(float(duration)/hasteMultiplier()/1000.0+0.5))*1000u;
 s.casting=1u;enqueue(s.now+duration,1u,spell,0u);gcd();
}
void checkTrinket(){
 if(c.manualTrinket==0u&&c.trinketSP>0.0&&s.now>=s.trinketReady){
  s.trinketEnd=s.now+c.trinketDuration;
  s.trinketReady=s.now+c.trinketCD;queuePetInheritance();
  enqueue(s.trinketEnd,11u,0u,0u);
 }
}
void castConflagrate(){
 s.conflagReady=s.now+10000000u;spend(8u);
 if(random01()<c.hit){
  float roll=random01(),p=currentPower();
  float baseAmount=282.0+0.429*p;
  float amount=baseAmount*(1.0+(roll-0.5)*0.2191235125)*currentFireMult()*(1.0+c.afBonus);
  bool crit=random01()<(c.fireCrit+c.fnbCrit);
  if(crit)amount*=c.directCrit;
  amount*=resistanceMultiplier();
  damage(8u,amount*s.castBonus,crit);
  if(c.snfBonus>0.0||c.snfChance>0.0){s.snfShadowEnd=s.now+20000000u;}
 }else{countMiss(8u);}
 if(c.snfChance>0.0){if(random01()>=c.snfChance){s.immTicks=0u;s.immGen++;}}else{s.immTicks=0u;s.immGen++;}
 gcd();
}
void castShadowburn(){
 s.shadowburnReady=s.now+15000000u;spend(9u);
 if(random01()<c.hit){
  float roll=random01(),p=currentPower();
  // Generated rank-6 row: direct variance applies to base damage plus spell power.
  float amount=(273.20001220703125+0.42899999022483826*p)*(1.0+(roll-0.5)*0.10924369841814041)*currentShadowMult()*(1.0+c.shadowMasteryBonus)*(1.0+c.afBonus);
  amount*=isbMultiplier();
  bool crit=random01()<c.shadowCrit;
  if(crit)amount*=c.directCrit;
  amount*=resistanceMultiplier();
  damage(9u,amount*s.castBonus,crit);
  if(c.snfBonus>0.0||c.snfChance>0.0){s.snfFireEnd=s.now+20000000u;}
 }else{countMiss(9u);}
 gcd();
}
void castDoom(){
 s.doomReady=s.now+60000000u;spend(6u);
 if(random01()<c.hit){
  wisdomProc(false);s.doomEnd=s.now+60000000u;s.doomActive=1u;s.agonyGen++;enqueue(s.now+60000000u,3u,20u,s.agonyGen);
 }else{countMiss(6u);}
 gcd();
}
bool evalCond(uint cond, float param, uint targetSpell, float playerManaPct, float targetHpPct){
 if(cond==39u||cond==40u){
  uint dotMask=(s.now<s.doomEnd?1u:0u)|(s.now<s.agonyEnd?2u:0u)|(s.now<s.corrEnd?4u:0u)|(s.now<s.immEnd?8u:0u)|(s.now<s.siphonEnd?16u:0u);
  uint mask=uint(param);return cond==39u?(dotMask&mask)==mask:(dotMask&mask)==0u;
 }
 if(cond==41u||cond==42u){bool curseActive=c.assignedElements!=0u&&s.now<s.elementsEnd;return cond==41u?curseActive:!curseActive;}
 if(cond==33u)return s.decimationEnd>s.now;
 if(cond==34u)return s.decimationEnd<=s.now;
 if(cond>=35u&&cond<=38u){
  float remaining=float(c.end)-float(s.now);
  float threshold=float(c.end)*float(targetSpell)/100.0+param*1000000.0;
  return cond==35u?remaining<=threshold:cond==36u?remaining>=threshold:cond==37u?remaining<threshold:remaining>threshold;
 }
 if(cond==31u)return s.now<s.amplifyEnd;
 if(cond==32u)return s.now>=s.amplifyEnd;
 if(cond==0u){ // ALWAYS
  return true;
 }else if(cond==1u){ // MANA_LE
  return (playerManaPct<=param);
 }else if(cond==2u){ // MANA_GE
  return (playerManaPct>=param);
 }else if(cond==3u){ // TARGET_HP_LE
  return (targetHpPct<=param);
 }else if(cond==4u){ // TARGET_HP_GE
  return (targetHpPct>=param);
 }else if(cond==5u||cond==23u||cond==29u||cond==30u){ // DOT_REM_LE / DOT_REM_LT / DOT_REM_GE / DOT_REM_GT
  float remSec=0.0;
  if(targetSpell==1u)remSec=(s.corrTicks>0u&&s.corrEnd>s.now)?float(s.corrEnd-s.now)*0.000001:0.0;
  else if(targetSpell==2u)remSec=(s.agonyTicks>0u&&s.agonyEnd>s.now)?float(s.agonyEnd-s.now)*0.000001:0.0;
  else if(targetSpell==22u)remSec=(s.doomActive!=0u&&s.doomEnd>s.now?float(s.doomEnd-s.now)*0.000001:0.0);
  else if(targetSpell==3u)remSec=(s.immTicks>0u&&s.immEnd>s.now)?float(s.immEnd-s.now)*0.000001:0.0;
  else if(targetSpell==15u)remSec=(s.siphonTicks>0u&&s.siphonEnd>s.now)?float(s.siphonEnd-s.now)*0.000001:0.0;
  return (cond==23u?remSec<param:(cond==29u?remSec>=param:(cond==30u?remSec>param:remSec<=param)));
 }else if(cond==6u){ // FIGHT_TIME_GE
  return (c.end>=s.now)&&(float(c.end-s.now)>=param*1000000.0);
 }else if(cond==7u){ // FIGHT_TIME_LE
  return (c.end>=s.now)&&(float(c.end-s.now)<=param*1000000.0);
 }else if(cond==8u){ // SHADOW_TRANCE
  return (s.trance!=0u);
 }else if(cond==9u){ // DECIMATION_ACTIVE
  return (c.decimation!=0u)&&(targetHpPct<=param)&&(s.decimationEnd>s.now);
 }else if(cond==10u){ // DECIMATION_INACTIVE
  return (c.decimation!=0u)&&(targetHpPct<=param)&&(s.decimationEnd<=s.now);
 }else if(cond==11u){ // DEMONIC_BRAND_MISSING
  return (s.brandCharges==0u||s.brandEnd<=s.now);
 }else if(cond==12u){ // DOOM_MISSING
  return (s.doomActive==0u);
 }else if(cond==13u){ // ISB_ACTIVE
  return (s.now<s.isbEnd);
 }else if(cond==14u){ // FIGHT_TIME_GE and named DoT missing
  bool missing=(targetSpell==1u?s.corrTicks==0u:targetSpell==2u?s.agonyTicks==0u:targetSpell==22u?s.doomActive==0u:targetSpell==3u?s.immTicks==0u:targetSpell==15u?s.siphonTicks==0u:false);
  return (c.end>=s.now&&float(c.end-s.now)>=param*1000000.0&&missing);
 }else if(cond==15u){ // Nightfall talent enabled and named DoT missing
  bool missing=(targetSpell==1u?s.corrTicks==0u:targetSpell==2u?s.agonyTicks==0u:targetSpell==22u?s.doomActive==0u:targetSpell==3u?s.immTicks==0u:targetSpell==15u?s.siphonTicks==0u:false);
  return (c.nightfall>0.0&&missing);
 }else if(cond==16u){ // Fight time threshold and both Doom/Agony missing
  return (c.end>=s.now&&float(c.end-s.now)>=param*1000000.0&&s.doomActive==0u&&s.agonyTicks==0u);
 }else if(cond==17u){return (playerManaPct<param);
 }else if(cond==18u){return (playerManaPct>param);
 }else if(cond==19u){return (targetHpPct<param);
 }else if(cond==20u){return (targetHpPct>param);
 }else if(cond==21u){return (c.end>s.now&&float(c.end-s.now)>param*1000000.0);
 }else if(cond==22u){return (c.end>=s.now&&float(c.end-s.now)<param*1000000.0);
 }else if(cond==24u){return (s.petMana<param);
 }else if(cond==25u){return (s.petMana<=param);
 }else if(cond==26u){return (s.petMana>param);
 }else if(cond==27u){return (s.petMana>=param);
 }else if(cond==28u){return (s.now>=s.isbEnd);
 }else{
  return true;
 }
}
void decide(){
 if(s.casting!=0u||s.now<s.ready)return;
 checkTrinket();checkRacial();
 if(c.autoCooldowns!=0u&&c.demonicRune!=0u&&s.now>=s.runeReady&&c.maxMana-s.mana>=1500.0){
  float gain=900.0+random01()*600.0;s.mana+=gain;s.gained+=gain;s.runeReady=s.now+120000000u;
 }


 float fightProgress=float(s.now)/max(1.0,float(c.end));
 float targetHpPct=max(0.0,(1.0-fightProgress)*100.0);
 float playerManaPct=(s.mana/c.maxMana)*100.0;

 for(uint r=0u;r<numAplRules;r++){
  uint header0=getConfigWord(currentCfgIdx,APL_HEADER0_OFFSET+r);
  uint enabled=(header0>>24u)&0xFFu;
  if(enabled==0u)continue;

  uint action=header0&0xFFu;
  uint cond1=(header0>>8u)&0xFFu;
  uint targetSpell1=(header0>>16u)&0xFFu;
  float param1=uintBitsToFloat(getConfigWord(currentCfgIdx,APL_PARAM0_OFFSET+r));

  if(!evalCond(cond1,param1,targetSpell1,playerManaPct,targetHpPct))continue;

  uint header1=getConfigWord(currentCfgIdx,APL_HEADER1_OFFSET+r);
  uint cond2=header1&0xFFu;
  uint targetSpell2=(header1>>8u)&0xFFu;
  float param2=uintBitsToFloat(getConfigWord(currentCfgIdx,APL_PARAM1_OFFSET+r));

  if(!evalCond(cond2,param2,targetSpell2,playerManaPct,targetHpPct))continue;

  // Execute Action
  if(action==25u){
   if(c.assignedElements!=0u&&s.now>=s.elementsEnd&&s.mana>=200.0){
    s.mana-=200.0;s.spent+=200.0;s.spiritRegenAt=s.now+5000000u;countCast(15u);
    if(random01()<c.hit)s.elementsEnd=s.now+300000000u;else countMiss(15u);
    gcd();return;
   }
  }else if(action==26u){
   if(c.trinketSP>0.0&&s.now>=s.trinketReady){s.trinketEnd=s.now+c.trinketDuration;s.trinketReady=s.now+c.trinketCD;queuePetInheritance();enqueue(s.trinketEnd,11u,0u,0u);}
  }else if(action==24u){ // Explicit off-GCD Amplify Curse; never inferred from an Agony cast.
   if(c.amplifyCurse!=0u&&s.now>=s.amplifyReady&&s.now>=s.amplifyEnd){
    s.amplifyReady=s.now+180000000u;s.amplifyEnd=s.now+30000000u;${detailed ? 's.amplifyCasts++;' : ''}
   }
  }else if(action==20u){ // Eureka is off-GCD; continue evaluating spells in this decision.
   if(c.race==3u&&s.now>=s.racialReady&&s.now>=s.eurekaEnd)activateEureka();
  }else if(action==21u){ // Blood Fury is off-GCD and follows this APL row.
   if(c.race==1u&&s.now>=s.racialReady)activateBloodFury();
  }else if(action==22u){ // Berserking is off-GCD and follows this APL row.
   if(c.race==2u&&s.now>=s.racialReady)activateBerserking();
  }else if(action==1u){ // LIFE_TAP
   tap();return;
  }else if(action==2u){ // NIGHTFALL_SHADOW_BOLT
   if(s.trance!=0u){
    if(s.mana>=cost(0u)){
     s.trance=0u;spend(0u);launchBolt();gcd();return;
    }
   }
  }else if(action==3u||action==5u||action==13u){ // SEARING_PAIN (Decimation / Brand / Filler)
   if(s.mana>=cost(5u)){beginCast(5u);return;}
  }else if(action==4u){ // DECIMATION_SOUL_FIRE
   if(s.now>=s.soulFireReady&&s.mana>=cost(13u)){beginCast(13u);return;}
  }else if(action==6u){ // CORRUPTION
   if(c.corr!=0u){
    if(s.mana>=cost(1u)){beginCast(1u);return;}
   }
  }else if(action==7u){ // CURSE_OF_DOOM
   if(c.curseOfDoom!=0u&&s.now>=s.doomReady&&s.doomActive==0u&&s.agonyTicks==0u){
    if(s.mana>=cost(6u)){castDoom();return;}
   }
  }else if(action==8u){ // CURSE_OF_AGONY
   if(c.agony!=0u&&s.doomActive==0u){
    if(s.mana>=cost(2u)){beginCast(2u);return;}
   }
  }else if(action==9u){ // IMMOLATE
   if(c.immolate!=0u){
    if(s.mana>=cost(3u)){beginCast(3u);return;}
   }
  }else if(action==10u){ // CONFLAGRATE
   if(c.conflagrate!=0u&&s.immTicks>0u&&s.now>=s.conflagReady){
    if(s.mana>=cost(8u)){castConflagrate();return;}
   }
  }else if(action==17u){ // SIPHON_LIFE
   if(c.siphonLife!=0u){
    if(s.mana>=cost(9u)){
     spend(10u);s.siphonBonus=s.castBonus;
     if(random01()<c.hit){wisdomProc(false);s.siphonTicks=10u;s.siphonGen++;s.siphonEnd=s.now+30000000u;enqueue(s.now+3000000u,3u,15u,s.siphonGen);}else{countMiss(10u);}
     gcd();return;
    }
   }
  }else if(action==19u){ // HELLFIRE: always complete the 15-second channel
   if(s.mana>=cost(23u)){
    spend(23u);enqueue(s.now+1000000u,3u,23u,1u);
    s.ready=s.now+15000000u;s.paidChannelEnd=s.ready;enqueue(s.ready,5u,0u,0u);return;
   }else{tap();return;}
  }else if(action==18u){ // DRAIN_HOPE (Wrack)
   if(c.drainHope!=0u&&s.now>=s.drainHopeReady){
    if(s.mana>=cost(11u)){
     spend(11u);
     // A miss consumes mana and the GCD, but starts no channel or amplification aura.
     if(random01()>=c.hit){countMiss(11u);gcd();return;}
     wisdomProc(false);s.drainHopeEnd=s.now+6000000u;s.drainHopeReady=s.now+6000000u;s.paidChannelEnd=s.drainHopeEnd;
     for(uint i=1u;i<=6u;i++)enqueue(s.now+i*1000000u,3u,16u,0u);
     s.ready=s.drainHopeEnd+c.channelClipDelay;enqueue(s.ready,5u,0u,0u);return;
    }
   }
  }else if(action==11u){ // SHADOWBURN
   if(c.shadowburn!=0u&&s.now>=s.shadowburnReady){
    if(s.mana>=cost(9u)){castShadowburn();return;}
   }
  }else if(action==12u){ // INCINERATE_FILLER
   if(c.incinerate!=0u&&s.mana>=cost(4u)){beginCast(4u);return;}
  }else if(action==16u||action==14u||action==15u){ // SHADOW_BOLT_FILLER
   if(s.mana>=cost(0u)){beginCast(0u);return;}
  }
 }

 // Fallback
 if(s.mana>=cost(c.filler)){beginCast(c.filler);return;}
 tap();
}
void creditManaRegen(uint at){
 // Same-time events have already received both player and pet regeneration.
 if(at==s.now)return;
 float elapsed=float(at-s.now)*0.000001;
 uint spiritFrom=max(s.now,max(s.spiritRegenAt,s.paidChannelEnd));
 float gain=c.mp5*elapsed/5.0+(at>spiritFrom?c.spiritRegen*float(at-spiritFrom)*0.000001:0.0);
 ${detailed ? 's.manaWasted+=max(0.0,s.mana+gain-c.maxMana);' : ''}
 s.mana=min(c.maxMana,s.mana+gain);s.gained+=gain;
 if(c.petChoice!=0u){
  uint through=at/100000u*100000u;
  s.petMana=min(c.petMaxMana,s.petMana+c.petMP5*float(through-s.petRegenAt)/5000000.0);s.petRegenAt=through;
 }
}
void advance(){
 if(s.size==0u){s.done=3u;return;}
 Event e=dequeue();lastEvent=e;
 if(e.at<s.now){s.done=4u;return;}
${detailed ? UPTIME_EFFECTS.map(([,key])=>{
 const active={corr:'s.corrTicks>0u',agony:'s.agonyTicks>0u',imm:'s.immTicks>0u',siphon:'s.siphonTicks>0u',doom:'s.doomActive!=0u',trance:'s.trance!=0u'}[key] || 'true';
 return ` if(${active}&&s.${key}End>s.now)s.uptime_${key}+=min(e.at,s.${key}End)-s.now;`;
}).join('\n')+'\n' : ''} creditManaRegen(e.at);s.now=e.at;s.events++;eventDamage=0.0;eventFlags=0u;
 uint ekind=EV_KIND(e),espell=EV_SPELL(e);
 switch(ekind){
 case 13u:s.done=1u;break;
 case 1u:
  s.casting=0u;spend(espell);
  if(espell==1u)applyDot(1u);
  else if(espell==3u)immolateImpact();
  else if(espell==13u){s.soulFireReady=s.now+60000000u-27000000u*c.decimationRank;enqueue(s.now,2u,13u,uint(s.castBonus>1.0));}
  else if(espell==5u)directImpact(5u,castHitOutcome(5u));
  else if(espell==0u)launchBolt();
  else enqueue(s.now,2u,espell,uint(s.castBonus>1.0));
  decide();break;
 case 2u:s.castBonus=(EV_GEN(e)&1u)!=0u?1.10:1.0;directImpact(espell,EV_GEN(e));break;
 case 3u:tick(e);break;
 case 5u:decide();break;
 case 6u:
  if(espell==100u){ // Firebolt resolves immediately when its cast completes.
   s.petCasts++;s.petSpellCasts++;${detailed ? 's.impCasts++;' : ''}s.petMana-=115.0;
   bool landed=random01()<c.hit,crit=false;float dmg=0.0;
   if(landed){
    s.petSpellHits++;${detailed ? 's.impHits++;' : ''}
    dmg=(45.20000076293945+0.5709999799728394*s.petSP)*(1.0+(random01()-0.5)*0.11363636702299118)*c.petFireboltMult*(s.now<s.elementsEnd&&c.externalElements==0u?1.10:1.0);
    crit=random01()<c.fireCrit;
    if(crit){dmg*=1.5;s.petSpellCrits++;${detailed ? 's.impCrits++;' : ''}}
    dmg*=resistanceMultiplier();
   }else{s.petSpellMisses++;${detailed ? 's.impMisses++;' : ''}}
   if(landed){
    wisdomProc(true);
     if(c.demonicBrand!=0u&&s.brandCharges>0u&&s.now<s.brandEnd){
      s.brandCharges--;
      float brandDmg=(65.0+random01()*3.0+0.078*currentPower())*c.brandMult*(s.now<s.elementsEnd&&c.externalElements==0u?1.10:1.0);
      ${detailed ? 's.petBrandCasts++;' : ''}
      if(random01()<c.hit){
       bool brandCrit=random01()<c.crit;if(brandCrit){brandDmg*=1.5;${detailed ? 's.petBrandCrits++;' : ''}}
       brandDmg*=resistanceMultiplier();s.total+=brandDmg;eventDamage+=brandDmg;s.petDamage+=brandDmg;s.petBrandDamage+=brandDmg;${detailed ? 's.petBrandHits++;' : ''}
      }else{${detailed ? 's.petBrandMisses++;' : ''}}
     }
    s.total+=dmg;eventDamage+=dmg;s.petDamage+=dmg;s.petSpellDamage+=dmg;${detailed ? 's.impDamage+=dmg;' : ''}if(crit)eventFlags|=1u;
   }
   queueFirebolt();
  }else if(espell==102u){queueFirebolt();
  }else if(espell==200u){ // Succubus Melee
   s.petCasts++;
   s.petMeleeCasts++;wisdomProc(true);
   float roll=random01()*100.0;
   // Physical miss (8% boss base) inherits hit; dodge remains 6.5%.
   float avoid=max(0.0,8.0-max(0.0,(c.hit-0.83)*100.0))+6.5;
   if(roll>=avoid){
    s.petMeleeHits++;
    float base=0.698*60.45291519165039*2.0*(0.785+0.43*random01());
    float dmg=(base+(s.petAP/14.0)*2.0)*c.petMeleeMult+(c.giftOfArthas!=0u?8.0:0.0);
    bool glance=(roll<avoid+40.0);
    bool crit=(!glance&&roll<(avoid+40.0+max(0.0,(c.crit-0.03-min(c.crit,0.018))*100.0)));
    if(glance)dmg*=0.55+0.20*random01();${detailed ? 'if(glance)s.petMeleeGlances++;' : ''}
    if(crit){dmg*=2.0;s.petMeleeCrits++;}
    if(c.demonicBrand!=0u&&s.brandCharges>0u&&s.now<s.brandEnd){
     s.brandCharges--;
      float brandDmg=(65.0+random01()*3.0+0.078*currentPower())*c.brandMult*(s.now<s.elementsEnd&&c.externalElements==0u?1.10:1.0);
      ${detailed ? 's.petBrandCasts++;' : ''}
      if(random01()<c.hit){
       bool brandCrit=random01()<c.crit;if(brandCrit){brandDmg*=1.5;${detailed ? 's.petBrandCrits++;' : ''}}
       brandDmg*=resistanceMultiplier();s.total+=brandDmg;eventDamage+=brandDmg;s.petDamage+=brandDmg;s.petBrandDamage+=brandDmg;${detailed ? 's.petBrandHits++;' : ''}
      }else{${detailed ? 's.petBrandMisses++;' : ''}}
    }
    s.total+=dmg;eventDamage+=dmg;s.petDamage+=dmg;s.petMeleeDamage+=dmg;if(crit)eventFlags|=1u;
   }else{
    s.petMeleeMisses++;
   }
   if(s.now+2000000u<=c.end)enqueue(s.now+2000000u,6u,200u,0u);
  }else if(espell==201u){ // Succubus Lash of Pain
   uint delay=12000000u;
   if(s.petMana>=160.0){
    s.petCasts++;
    s.petSpellCasts++;
    s.petMana-=160.0;
    if(random01()<c.hit){
     s.petSpellHits++;wisdomProc(true);
     float dmg=(50.0+0.42899999022483826*s.petSP)*c.petLashMult*(s.now<s.elementsEnd&&c.externalElements==0u?1.10:1.0);
     bool crit=random01()<c.crit;if(crit){dmg*=1.5;s.petSpellCrits++;}dmg*=resistanceMultiplier();
     if(c.demonicBrand!=0u&&s.brandCharges>0u&&s.now<s.brandEnd){
      s.brandCharges--;
      float brandDmg=(65.0+random01()*3.0+0.078*currentPower())*c.brandMult*(s.now<s.elementsEnd&&c.externalElements==0u?1.10:1.0);
      ${detailed ? 's.petBrandCasts++;' : ''}
      if(random01()<c.hit){
       bool brandCrit=random01()<c.crit;if(brandCrit){brandDmg*=1.5;${detailed ? 's.petBrandCrits++;' : ''}}
       brandDmg*=resistanceMultiplier();s.total+=brandDmg;eventDamage+=brandDmg;s.petDamage+=brandDmg;s.petBrandDamage+=brandDmg;${detailed ? 's.petBrandHits++;' : ''}
      }else{${detailed ? 's.petBrandMisses++;' : ''}}
     }
     s.total+=dmg;eventDamage+=dmg;s.petDamage+=dmg;s.petSpellDamage+=dmg;if(crit)eventFlags|=1u;
    }else{
     s.petSpellMisses++;
    }
   }else{
    delay=petManaWait(160.0);
   }
   if(s.now+delay<=c.end)enqueue(s.now+delay,6u,201u,0u);
  }
  break;
 case 8u:if(s.now>=s.tranceEnd)s.trance=0u;break;
 case 10u:enqueue(s.now+5000000u,10u,0u,0u);break;
 case 16u:
  s.casting=0u;countCast(14u);enqueue(s.now,17u,0u,0u);decide();break;
 case 17u:
  if(random01()<c.hit){float amount=(213.0+random01()*74.0)*currentFireMult();bool crit=random01()<c.fireCrit;if(crit)amount*=1.5;damage(14u,amount*resistanceMultiplier(),crit);}else countMiss(14u);break;
 case 11u:queuePetInheritance();break;
 case 14u:s.petSP=(currentPower()+c.petPowerOffset)*0.10+c.petOwnPower;s.petAP=c.petBaseAP+(currentPower()+c.petPowerOffset)*0.17;break;
 case 15u:queuePetInheritance();break;
 case 12u:queuePetInheritance();s.trinketEnd=s.now+c.trinketDuration;enqueue(s.trinketEnd,11u,0u,0u);if(s.now+c.trinketCD<=c.end)enqueue(s.now+c.trinketCD,12u,0u,0u);break;
 default:s.done=5u;break;
 }
}
${stateWordFunction}
${detailedCompactWord}
uint fastWord(uint index){switch(index){
 case 0u:return floatBitsToUint(s.total);case 1u:return s.done|(s.highWater<<16u);
 case 2u:return s.events;case 3u:return s.taps|(s.procs<<16u);
 case 4u:return s.isbProcs|(s.isbConsumed<<16u);case 5u:return floatBitsToUint(s.petBrandDamage);
 case 6u:return floatBitsToUint(s.petDamage);case 7u:return s.petCasts|(s.rngCalls<<16u);
 case 8u:return floatBitsToUint(s.petMeleeDamage);case 9u:return s.petMeleeCasts|(s.petMeleeHits<<16u);
 case 10u:return s.petMeleeCrits|(s.petMeleeMisses<<16u);case 11u:return floatBitsToUint(s.petSpellDamage);
 case 12u:return s.petSpellCasts|(s.petSpellHits<<16u);case 13u:return s.petSpellCrits|(s.petSpellMisses<<16u);
 case 14u:return floatBitsToUint(s.mana);case 15u:return floatBitsToUint(s.spent);default:return 0u;}}
uint outputWord(uint index){return ${detailed ? 'mode==1u?stateWord(index):compactWord(index)' : 'fastWord(index)'};}
uvec4 outputFour(uint index){return uvec4(outputWord(index),outputWord(index+1u),outputWord(index+2u),outputWord(index+3u));}
void main(){
 uint x=uint(gl_FragCoord.x),y=uint(gl_FragCoord.y);
 uint lane,stripe;
 if(mode==0u){
  uint stripes=${stripeCount};
  uint simX=x,simY=y/stripes;
  stripe=y%stripes;
  lane=simY*gridWidth+simX;
 }else if(mode==1u){
  lane=0u;stripe=y;
 }else{
  lane=x;stripe=0u;
 }
 report0=uvec4(0u);report1=uvec4(0u);report2=uvec4(0u);report3=uvec4(0u);
 if(lane>=count&&mode==0u)return;
 uint globalLane=offset+lane;
 currentCfgIdx=0u;
 uint fightInCfg=globalLane;
 if(numConfigs>1u&&fightsPerConfig>0u){
  currentCfgIdx=min(globalLane/fightsPerConfig,numConfigs-1u);
  fightInCfg=globalLane%fightsPerConfig;
 }
 ${Object.entries(CONFIG).map(([k,t],i)=>`c.${k}=${t==='f32'?'uintBitsToFloat':''}(getConfigWord(currentCfgIdx,${i}u));`).join('\n')}
 numAplRules=0u;
 for(uint r=0u;r<MAX_APL_RULES;r++){
  uint h0=getConfigWord(currentCfgIdx,APL_HEADER0_OFFSET+r);
  if(h0==0u)break;
  numAplRules++;
 }
 ${initialState}
 s.initialized=1u;s.mana=c.maxMana;eventDamage=0.0;eventFlags=0u;lastEvent=MAKE_EVENT(0u,0u,0u,0u);
 seedRandom(mode==2u?0u:(numConfigs>1u?fightInCfg:globalLane));
 enqueue(c.end,13u,0u,0u);enqueue(5000000u,10u,0u,0u);
 if(c.manualTrinket==0u&&c.trinketSP>0.0){s.trinketEnd=c.trinketDuration;s.trinketReady=c.trinketCD;enqueue(s.trinketEnd,11u,0u,0u);}
 if(c.petChoice!=0u){s.petSP=c.petSP;s.petAP=c.petAP;s.petHeartbeatPhase=uint(random01()*5250000.0);if(c.petOwnPower>0.0||c.trinketSP>0.0)queuePetInheritance();}
 if(c.petChoice==1u){s.petMana=c.petMaxMana;queueFirebolt();}
 else if(c.petChoice==2u){s.petMana=c.petMaxMana;enqueue(uint(random01()*100.0)*1000u,6u,200u,0u);enqueue(0u,6u,201u,0u);}
 decide();
 for(uint step=0u;step<eventBudget;step++){
  if(s.done!=0u)break;advance();if(mode==2u&&s.events==lane+1u)break;
 }
 if(mode!=2u&&s.done==0u)s.done=6u;
 ${stateOverflow}
 if(max(max(s.petMeleeCasts,s.petMeleeHits),max(s.petMeleeCrits,s.petMeleeMisses))>65535u)s.done=7u;
 if(max(max(s.petSpellCasts,s.petSpellHits),max(s.petSpellCrits,s.petSpellMisses))>65535u)s.done=7u;
 ${Array.from({length:4},(_,i)=>`s.rng${i*2}=rng[${i}].x;s.rng${i*2+1}=rng[${i}].y;`).join('\n')}
 if(mode==2u){
  report0=uvec4(s.now,EV_KIND(lastEvent),EV_SPELL(lastEvent),floatBitsToUint(eventDamage));
  report1=uvec4(floatBitsToUint(s.mana),eventFlags,floatBitsToUint(s.total),s.rngCalls);
 }else{uint base=stripe*16u;report0=outputFour(base);report1=outputFour(base+4u);report2=outputFour(base+8u);report3=outputFour(base+12u);}
}
`;
}

export const FRAGMENT = buildFragment(true);
export const FAST_FRAGMENT = buildFragment(false);

// Specialize only feature words shared by every config in the draw. Stats,
// duration and APL bytecode remain dynamic so search candidates reuse programs.
const FEATURE_FIELDS=Object.entries(CONFIG).flatMap(([name,type],index)=>
 !name.startsWith('apl')&&(typeof DEFAULTS[name]==='boolean'||['petChoice','race','filler','racialPolicy'].includes(name))? [{name,type,index}]:[]);
export function simulationVariant(detailed,packedConfigs){
 if(!packedConfigs.length)throw new Error('Shader variants require at least one packed config.');
 const shared=FEATURE_FIELDS.filter(({index})=>packedConfigs.every(words=>words[index]===packedConfigs[0][index]));
 const key=`${detailed?'detailed':'fast'}:${shared.map(({index})=>`${index}=${packedConfigs[0][index]}`).join(',')}`;
 return {key,build(){
  let shader=detailed?FRAGMENT:FAST_FRAGMENT;
  for(const {name,type,index} of shared){
   const bits=packedConfigs[0][index];
   const literal=type==='u32'?`${bits}u`:`uintBitsToFloat(${bits}u)`;
   shader=shader.replace(new RegExp(`^ *c\\.${name}=[^;]+;`,'m'),'')
    .replace(new RegExp(`c\\.${name}\\b`,'g'),`(${literal})`);
  }
  return shader;
 }};
}
