'use strict';
const B=window.BOOK,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const E=(t,c,h,p)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;if(p)p.append(e);return e};
const X=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const A={sa:196,vol:.8,rev:.35,inst:'sitar',eq:0,drone:false};
const R=[1,16/15,9/8,6/5,5/4,4/3,45/32,3/2,8/5,5/3,9/5,15/8],NN=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const BS={'सा':0,'रे':2,'ग':4,'म':5,'प':7,'ध':9,'नि':11},SW=['सा','रे॒','रे','ग॒','ग','म',"म'",'प','ध॒','ध','नि॒','नि'],SL=['षड्ज','कोमल ऋषभ','ऋषभ','कोमल गान्धार','गान्धार','मध्यम','तीव्र मध्यम','पंचम','कोमल धैवत','धैवत','कोमल निषाद','निषाद'];
const ratio=i=>R[i]**(1-A.eq)*2**(i/12*A.eq),fq=s=>A.sa*ratio(((s%12)+12)%12)*2**Math.floor(s/12);
const saName=()=>{const n=Math.round(12*Math.log2(A.sa/261.626));return NN[((n%12)+12)%12]+(4+Math.floor(n/12))};
/* ---------- audio ---------- */
function au(){if(A.c){A.c.state==='suspended'&&A.c.resume();return A.c}
 const c=A.c=new(window.AudioContext||window.webkitAudioContext)(),m=A.m=c.createGain(),d=c.createGain(),w=A.w=c.createGain(),v=c.createConvolver(),b=A.b=c.createGain(),n=c.sampleRate*2.4|0,ir=c.createBuffer(2,n,c.sampleRate);
 for(let k=0;k<2;k++){const x=ir.getChannelData(k);for(let i=0;i<n;i++)x[i]=(Math.random()*2-1)*(1-i/n)**3}
 v.buffer=ir;m.gain.value=A.vol;w.gain.value=A.rev;b.connect(d);b.connect(v);v.connect(w);d.connect(m);w.connect(m);
 A.an=c.createAnalyser();A.an.fftSize=128;m.connect(A.an);m.connect(c.destination);A.cache={};
 const pk=c.createBiquadFilter();pk.type='peaking';pk.frequency.value=320;pk.gain.value=5;pk.Q.value=.8;A.fs=c.createGain();A.fs.connect(pk);pk.connect(b);
 let pr=A.fh=c.createGain();[[320,7,2],[900,6,1.6],[2200,7,1.4],[3600,3,2]].forEach(([f,g,q])=>{const k=c.createBiquadFilter();k.type='peaking';k.frequency.value=f;k.gain.value=g;k.Q.value=q;pr.connect(k);pr=k});
 const hl=c.createBiquadFilter();hl.type='lowpass';hl.frequency.value=6000;pr.connect(hl);hl.connect(b);const sp=c.createBiquadFilter();sp.type='peaking';sp.frequency.value=230;sp.gain.value=4;sp.Q.value=1;const s2=c.createBiquadFilter();s2.type='highshelf';s2.frequency.value=6500;s2.gain.value=-3;A.ft=c.createGain();A.ft.connect(sp);sp.connect(s2);s2.connect(b);loadS();return c}
/* Fysisch gemodelleerde klanken: sitar/tanpura = Karplus-Strong met jawari-buzz en sympathiesnaren,
   tabla = modale synthese van vel + syahi, harmonium = riet-golfvorm met kast-formanten, bansuri = ademruis + buisresonantie */
function nz(){if(!A.nb){const c=au();A.nb=c.createBuffer(1,c.sampleRate|0,c.sampleRate);const d=A.nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}return A.nb}
function ks(o,sr,f,tp){const T=tp?7:2.4,D=sr/f-.5;let N=Math.floor(D),fr=D-N;if(fr<.1){N--;fr+=1}const a=(1-fr)/(1+fr),dec=Math.pow(10,-3/(f*T)),d=new Float32Array(N);
 let p=0;for(let i=0;i<N;i++){p=p*.4+(Math.random()*2-1)*.6;d[i]=p}
 const P=Math.max(1,Math.round(N*(tp?.13:.17))),e=d.map((v,i)=>v-d[(i+P)%N]);let m=1e-6;e.forEach(v=>{if(Math.abs(v)>m)m=Math.abs(v)});for(let i=0;i<N;i++)d[i]=e[i]/m;
 const cf=tp?[]:[A.sa*2,A.sa*3],M=cf.map(x=>new Float32Array(Math.max(2,Math.round(sr/x)))),mi=cf.map(()=>0),L=o.length;let idx=0,lp=0,ax=0,ay=0;
 for(let i=0;i<L;i++){const out=d[idx],l=(out+lp)*.5*dec;lp=out;const y=a*(l-ay)+ax;ax=l;ay=y;d[idx]=y;if(++idx>=N)idx=0;
  let w=Math.tanh(out*((tp?3:2)+i/L*(tp?5:9)))*.5;
  for(let j=0;j<M.length;j++){const q=M[j][mi[j]];M[j][mi[j]]=out*.0008+q*.9993;mi[j]=(mi[j]+1)%M[j].length;w+=q}
  o[i]=w}
 const k=Math.round(sr*.004);for(let i=0;i<k;i++)o[i]+=(Math.random()*2-1)*.2*(1-i/k)}
function strPlay(f,t,dur,vel,tp){const c=au(),k=tp?'t'+f.toFixed(1):'',L=tp?5.5:2.8;let u=k&&A.cache[k];
 if(!u){u=c.createBuffer(1,Math.round(c.sampleRate*L),c.sampleRate);ks(u.getChannelData(0),c.sampleRate,f,tp);if(k){if(Object.keys(A.cache).length>12)A.cache={};A.cache[k]=u}}
 const s=c.createBufferSource(),g=c.createGain(),e=t+(tp?L:Math.min(L,Math.max(.8,dur*1.8))),v=vel*(tp?1.6:1.1);
 s.buffer=u;g.gain.setValueAtTime(v,t);g.gain.setValueAtTime(v,e-.12);g.gain.linearRampToValueAtTime(0,e);s.connect(g);g.connect(tp?A.b:A.fs);s.start(t);s.stop(e+.02)}
const SM={};
async function loadS(){try{const m=await(await fetch('samples/samples.json')).json(),ld=async f=>A.c.decodeAudioData(await(await fetch('samples/'+f)).arrayBuffer());
 for(const[k,f]of Object.entries(m.tabla||{}))SM['t_'+k]=await ld(f);if(m.harmonium)SM.h={b:await ld(m.harmonium.file),ref:m.harmonium.ref||261.63}}catch(e){}}
function hs(f,t,dur,vel){const c=au(),s=c.createBufferSource(),g=c.createGain(),e=t+dur+.15,w=SM.h.b;s.buffer=w;s.playbackRate.value=f/SM.h.ref;s.loop=true;s.loopStart=Math.min(.3,w.duration*.3);s.loopEnd=Math.max(s.loopStart+.2,w.duration-.1);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vel,t+.05);g.gain.setValueAtTime(vel,Math.max(t+.06,t+dur));g.gain.linearRampToValueAtTime(0,e);s.connect(g);g.connect(A.b);s.start(t);s.stop(e+.05)}
/* harmonium: smalle rietpuls (neusachtig, accordeon-achtig), meerdere rietrijen, ademende bellows, kast-formanten */
function harm(f,t,dur,vel){if(SM.h)return hs(f,t,dur,vel);
 const c=au(),end=t+dur+.14,h=Math.max(t+.12,t+dur),g=c.createGain(),lp=c.createBiquadFilter(),lf=c.createOscillator(),lg=c.createGain(),l2=c.createOscillator(),l2g=c.createGain(),dl=c.createOscillator(),dg=c.createGain();
 if(!A.hw){const re=new Float32Array(48);for(let n=1;n<48;n++)re[n]=Math.sin(n*Math.PI*.3)/n**.8;A.hw=c.createPeriodicWave(re,new Float32Array(48))}
 dl.frequency.value=.37;dg.gain.value=4;dl.connect(dg);dl.start(t);dl.stop(end+.05);
 [[1,-3,.5],[1,3,.5],[.5,0,.26],[2,1,.2]].forEach(([m,dt,a])=>{const o=c.createOscillator(),x=c.createGain();o.setPeriodicWave(A.hw);o.frequency.setValueAtTime(f*m*.99,t);o.frequency.exponentialRampToValueAtTime(f*m,t+.04);o.detune.value=dt;dg.connect(o.detune);x.gain.value=a;o.connect(x);x.connect(g);o.start(t);o.stop(end+.05)});
 const o6=c.createOscillator(),x6=c.createGain();o6.frequency.value=f*6.27;x6.gain.value=.012;o6.connect(x6);x6.connect(g);o6.start(t);o6.stop(end+.05);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vel*.5,t+.09);g.gain.setValueAtTime(vel*.46,h);g.gain.linearRampToValueAtTime(0,end);
 lf.frequency.value=.23;lg.gain.value=.02;l2.frequency.value=.9;l2g.gain.value=.012;lf.connect(lg);lg.connect(g.gain);l2.connect(l2g);l2g.connect(g.gain);[lf,l2].forEach(x=>{x.start(t);x.stop(end+.05)});
 lp.type='lowpass';lp.Q.value=.8;lp.frequency.setValueAtTime(800,t);lp.frequency.exponentialRampToValueAtTime(5600,t+.12);lp.frequency.setValueAtTime(5600,h);lp.frequency.exponentialRampToValueAtTime(1600,end);
 const n=c.createBufferSource(),bp=c.createBiquadFilter(),ng=c.createGain();n.buffer=nz();n.loop=true;bp.type='bandpass';bp.frequency.value=2800;bp.Q.value=.7;ng.gain.setValueAtTime(vel*.04,t);ng.gain.linearRampToValueAtTime(vel*.012,t+.2);ng.gain.setValueAtTime(vel*.012,h);ng.gain.linearRampToValueAtTime(0,end);n.connect(bp);bp.connect(ng);ng.connect(lp);n.start(t);n.stop(end+.05);
 g.connect(lp);lp.connect(A.fh)}
function flute(f,t,dur,vel){const c=au(),end=t+dur+.14,o=c.createOscillator(),g=c.createGain(),l=c.createOscillator(),lg=c.createGain(),n=c.createBufferSource(),bp=c.createBiquadFilter(),ng=c.createGain(),lp=c.createBiquadFilter(),h=Math.max(t+.17,t+dur);
 if(!A.bw)A.bw=c.createPeriodicWave(new Float32Array(8),Float32Array.from([0,1,.26,.1,.06,.03,.015,.008]));
 o.setPeriodicWave(A.bw);o.frequency.setValueAtTime(f*.975,t);o.frequency.exponentialRampToValueAtTime(f,t+.07);
 l.frequency.value=5+Math.random()*.8;lg.gain.setValueAtTime(0,t);lg.gain.setValueAtTime(0,t+.15);lg.gain.linearRampToValueAtTime(f*.005,t+.55);l.connect(lg);lg.connect(o.frequency);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vel,t+.045);g.gain.linearRampToValueAtTime(vel*.72,t+.16);g.gain.setValueAtTime(vel*.72,h);g.gain.linearRampToValueAtTime(0,end);
 n.buffer=nz();n.loop=true;bp.type='bandpass';bp.frequency.value=Math.min(f*3,5500);bp.Q.value=2;
 ng.gain.setValueAtTime(vel*.35,t);ng.gain.linearRampToValueAtTime(vel*.1,t+.14);ng.gain.setValueAtTime(vel*.1,h);ng.gain.linearRampToValueAtTime(0,end);
 lp.type='lowpass';lp.frequency.value=3800;o.connect(g);g.connect(lp);n.connect(bp);bp.connect(ng);ng.connect(lp);lp.connect(A.b);[o,l,n].forEach(x=>{x.start(t);x.stop(end+.05)})}
function note(s,t,dur,vel=.5,inst=A.inst){const f=fq(s);if(inst==='sitar'||inst==='tanpura')strPlay(f,t,dur,vel,inst==='tanpura');else if(inst==='harmonium')harm(f,t,dur,vel);else flute(f,t,dur,vel)}
function dr(){if(!A.drone)return;const t=au().currentTime+.05;[-5,0,0,-12].forEach((s,i)=>note(s,t+i*.85,3,.2,'tanpura'))}
/* tabla: dayan = bijna harmonische deeltonen 1:2:3:4:5 (syahi), gesplitste (gedegenereerde) modes, toonval bij aanslag; bayan = lage toon met opwaartse buiging */
function tm(o,s,off,f,a,tau,g=0,gt=.06){const n0=off*s|0,N=Math.min(o.length-n0,Math.ceil(tau*5*s)),f2=f*(1.004+.004*Math.random());let p1=0,p2=Math.random()*6;for(let i=0;i<N;i++){const t=i/s,k=1+g*Math.exp(-t/gt),e=Math.exp(-t/tau);p1+=6.2831853*f*k/s;p2+=6.2831853*f2*k/s;o[n0+i]+=a*e*(.62*Math.sin(p1)+.38*Math.sin(p2))}}
function tn(o,s,off,a,tau,m){const n0=off*s|0,N=Math.min(o.length-n0,Math.ceil(tau*6*s));let p=0;for(let i=0;i<N;i++){const r=Math.random()*2-1;let x=r;if(m===1){x=r-p;p=r}else if(m===2){p=p*.9+r*.1;x=p*3}o[n0+i]+=a*x*Math.exp(-i/s/tau)}}
const J=()=>1+.003*Math.random();
const TK={na:(o,s,t,F)=>{[.5,.55,.4,.25,.15].forEach((a,i)=>tm(o,s,t,F*(i+1)*J(),a,.22/(1+.8*i),.025,.02));tm(o,s,t,F*.5,.15,.03);tn(o,s,t,.5,.004,1)},
 tin:(o,s,t,F)=>{[1,.55,.3,.17,.08].forEach((a,i)=>tm(o,s,t,F*(i+1)*J(),a,[.7,.42,.28,.18,.12][i],.02,.03));tn(o,s,t,.25,.004,1)},
 ta:(o,s,t,F)=>{[[1,.6],[2.3,.4],[3.9,.2]].forEach(([m,a])=>tm(o,s,t,F*m,a,.05));tn(o,s,t,.7,.006,1)},
 tu:(o,s,t,F)=>{[[1,1,.9],[2,.35,.5],[3,.14,.3],[4,.06,.2]].forEach(([m,a,u])=>tm(o,s,t,F*m*J(),a,u,.015,.03));tn(o,s,t,.12,.01,2)},
 ti:(o,s,t,F)=>{tm(o,s,t,F,.7,.035);tm(o,s,t,F*2,.4,.03);tn(o,s,t,.4,.003,1)},
 te:(o,s,t,F)=>{tm(o,s,t,F*1.5,.5,.04);tm(o,s,t,F*3,.3,.03);tn(o,s,t,.3,.003,1)},
 ge:(o,s,t,F,B)=>{tm(o,s,t,B*1.1,1.1,.5,-.15,.1);tm(o,s,t,B*1.9,.28,.18,-.1,.08);tm(o,s,t,B*2.7,.14,.1,-.08,.06);tn(o,s,t,.4,.015,2);tn(o,s,t,.25,.003,1)},
 ke:(o,s,t,F,B)=>{tm(o,s,t,B*1.3,.7,.04,.3,.02);tm(o,s,t,B*2.6,.3,.025);tn(o,s,t,.7,.008,1)}};
const DH=[['ge',0],['ti',0]],TC={'धा':[['na',0],['ge',0]],'धिं':[['tin',0],['ge',0]],'धिन':[['tin',0],['ge',0]],'धी':DH,'धि':DH,'धे':DH,'तिं':[['tin',0]],'तिन':[['tin',0]],'ती':[['ti',0]],'ति':[['ti',0]],'ना':[['na',0]],'ता':[['na',0]],'तू':[['tu',0]],'ते':[['te',0]],'ग':[['ge',0]],'गे':[['ge',0]],'घे':[['ge',0]],'क':[['ke',0]],'के':[['ke',0]],'की':[['ke',0]],'कत':[['ke',0],['ta',.5]],'तक':[['ta',0],['ke',.5]],'धागे':[['na',0],['ge',0],['ge',.5]],'तिरकिट':[['ti',0],['ti',.25],['ke',.5],['ta',.75]],'धिरधिर':[['ge',0],['ti',0],['ti',.25],['ge',.5],['ti',.5],['ti',.75]],'तिट':[['ti',0],['ta',.5]],'धिट':[['ge',0],['ti',0],['ta',.5]]};
const comps=b=>TC[b]||(/^ध/.test(b)?TC['धा']:/^[गघ]/.test(b)?TC['ग']:/^क/.test(b)?TC['क']:TC['ना']);
function tb(b,t,bd,v=.9){const c=au(),s=c.sampleRate,o=new Float32Array(Math.ceil(s*(1+bd)));
 comps(b).forEach(([k,a])=>{const w=SM['t_'+k];if(w){const d=w.getChannelData(0),n0=a*bd*s|0,vv=.9+Math.random()*.2;for(let i=0;i<d.length&&n0+i<o.length;i++)o[n0+i]+=d[i]*vv}else TK[k](o,s,a*bd,A.sa,A.sa*.62)});
 for(let i=0;i<o.length;i++)o[i]=Math.tanh(o[i]*1.2);const u=c.createBuffer(1,o.length,s),g=c.createGain(),r=c.createBufferSource();u.copyToChannel(o,0);r.buffer=u;g.gain.value=v*.9;r.connect(g);g.connect(A.ft);r.start(t)}
function hitD(b){const k=comps(b).map(x=>x[0]),h=(id,on)=>{if(!on)return;const e=$(id);e.classList.remove('hit');void e.offsetWidth;e.classList.add('hit');const r=e.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2)};h('#dDay',k.some(x=>/na|tin|ta|tu|ti|te/.test(x)));h('#dBay',k.some(x=>/ge|ke/.test(x)))}
/* ---------- scheduler ---------- */
let stoppers=[];
function stopAll(){stoppers.forEach(f=>f());stoppers=[];$$('.hot').forEach(e=>e.classList.remove('hot'));$$('.bd .on').forEach(e=>e.classList.remove('on'));
 if(taalOn){taalOn=false;$('#tPlay').textContent='▶ ठेका बजाएँ'}$('#beat').textContent='▶ आरंभ'}
function run(get,on,end){const c=au();let i=0,nx=c.currentTime+.1,live=true;
 const id=setInterval(()=>{while(live&&nx<c.currentTime+.2){const s=get(i);if(!s){stop();end&&end();return}s.fn(nx);const k=i,ms=(nx-c.currentTime)*1000;setTimeout(()=>live&&on&&on(k,s),Math.max(0,ms));nx+=s.dur;i++}},25);
 function stop(){live=false;clearInterval(id)}stoppers.push(stop);return stop}
/* ---------- notatie ---------- */
const NR=/(सा|रे|ग|म|प|ध|नि)(॒|')?(ं)?(\((?:कोमल|तीव्र|शुद्ध)\))?/g;
const pn=str=>[...String(str).matchAll(NR)].map(m=>{let s=BS[m[1]];if(m[2]==='॒'||/कोमल/.test(m[4]||''))s--;if(m[2]==="'"||/तीव्र/.test(m[4]||''))s++;return{s:s+(m[3]?12:0),up:!!m[3]}});
const asc=t=>{const a=pn(t).map(x=>x.s);for(let i=a.length-2;i>=0;i--)while(a[i]>=a[i+1])a[i]-=12;return a};
const desc=t=>{const a=pn(t).map(x=>x.s);for(let i=1;i<a.length;i++)while(a[i]>=a[i-1])a[i]-=12;return a};
const pak=t=>{const o=[];let p=null;String(t).split(',').forEach(ph=>{pn(ph).forEach(x=>{let s=x.s;if(p==null){if(s>=9&&!x.up)s-=12}else if(!x.up){while(s-p>6)s-=12;while(p-s>6)s+=12}o.push(s);p=s});o.push(null)});return o};
const hot=n=>{$$('svg.wh circle.hot,.key.hot').forEach(e=>e.classList.remove('hot'));if(n==null)return;const pc=((n%12)+12)%12,c=$(`svg.wh circle[data-pc="${pc}"]`);c&&c.classList.add('hot')};
function seq(a,bpm,vel=.5){const bd=60/bpm;return run(i=>i<a.length?{dur:a[i]==null?bd*.6:bd,fn:t=>a[i]!=null&&note(a[i],t,bd*1.1,vel),n:a[i]}:null,(i,s)=>hot(s.n),()=>hot())}
const pcs=r=>new Set([...asc(r.aroh||''),...desc(r.avroh||'')].map(s=>((s%12)+12)%12));
const wheel=u=>{let s='<svg class="wh" viewBox="0 0 220 220" width="220" height="220">';for(let i=0;i<12;i++){const a=i*Math.PI/6-Math.PI/2,x=110+82*Math.cos(a),y=110+82*Math.sin(a);s+=`<circle data-pc="${i}" class="${u.has(i)?'u':''}" cx="${x}" cy="${y}" r="17"/><text x="${x}" y="${y+4}">${SW[i]}</text>`}return s+'<text x="110" y="116" style="font-size:15px">स्वर-चक्र</text></svg>'};
/* ---------- tijd ---------- */
const hw=s=>{if(/सर्वकालिक|वर्षा/.test(s))return[0,24];const p=s.split(/[,(]/)[0];
 for(const[r,a,b]of[[/रात्रि.*प्रथम/,18,21],[/रात्रि.*द्वितीय/,21,24],[/रात्रि.*तृतीय/,0,3],[/रात्रि.*मध्य/,22,26],[/रात्रि.*अंतिम/,3,6],[/अत्यंत प्रथम/,4,7],[/प्रातःकाल.*प्रथम/,6,9],[/प्रातःकाल.*द्वितीय/,9,12],[/प्रातःकाल/,4,9],[/दिन.*प्रथम/,6,9],[/दिन.*द्वितीय/,9,12],[/दिन.*तृतीय|मध्याह्न/,12,15],[/दिन.*अंतिम/,15,18],[/सूर्यास्त|संध्या|सायं|सांध्य/,17,20]])if(r.test(p))return[a,b];return[0,24]};
const inWin=(h,w)=>(h>=w[0]&&h<w[1])||(h+24>=w[0]&&h+24<w[1]);
const bucket=r=>{const s=r.samay||'';if(/वर्षा/.test(s))return'वर्षा ऋतु';const w=hw(s);if(w[1]-w[0]>=24)return'सर्वकालिक';const m=((w[0]+w[1])/2)%24;return m>=4&&m<12?'प्रातःकाल':m>=12&&m<17?'मध्याह्न':m>=17&&m<21?'सायंकाल':'रात्रि'};
/* ---------- navigatie ---------- */
const secs=$$('main>section');
secs.forEach(s=>{const b=E('button','',s.dataset.t,$('#nav'));b.dataset.s=s.id;b.onclick=()=>go(s.id)});
function go(id){if(!$('#'+id))id='home';secs.forEach(s=>s.classList.toggle('on',s.id===id));$$('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.s===id));history.replaceState(0,'','#'+id);scrollTo({top:0,behavior:'smooth'})}
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');g&&go(g.dataset.go)});
/* ---------- home ---------- */
[[0,'सा'],[2,'रे'],[4,'ग'],[5,'म'],[7,'प'],[9,'ध'],[11,'नि']].forEach(([s,n],i)=>{const t=E('div','tile',`<i>${SL[s]}</i><b>${n}</b>`,$('#ring'));t.style.transform=`rotateY(${i*360/7}deg) translateZ(150px)`;
 t.onclick=()=>{note(s,au().currentTime,1.8,.6);t.classList.add('hot');setTimeout(()=>t.classList.remove('hot'),500)}});
$('#stats').innerHTML=[[B.raags.length,'राग'],[B.taals.length,'ताल'],[B.thaats.length,'थाट'],[12,'स्वर'],[24,'घंटे']].map(([n,l])=>`<div class="stat"><b>${n}</b>${l}</div>`).join('');
$('#demo').onclick=()=>openRaag(B.raags.findIndex(r=>r.lat==='Yaman'),true);
/* ---------- raag-galerij ---------- */
const uniq=a=>[...new Set(a.filter(Boolean))];
uniq(B.raags.map(r=>r.thaat)).forEach(v=>$('#fTh').append(new Option(v,v)));uniq(B.raags.map(r=>r.jati)).forEach(v=>$('#fJa').append(new Option(v,v)));['प्रातःकाल','मध्याह्न','सायंकाल','रात्रि','सर्वकालिक','वर्षा ऋतु'].forEach(v=>$('#fTi').append(new Option(v,v)));
function grid(){const q=$('#q').value.trim().toLowerCase(),a=$('#fTh').value,j=$('#fJa').value,t=$('#fTi').value,g=$('#grid');g.innerHTML='';let n=0;
 B.raags.forEach((r,i)=>{if(q&&!(r.name+' '+r.lat+' '+(r.thaat||'')).toLowerCase().includes(q))return;if(a&&r.thaat!==a||j&&r.jati!==j||t&&bucket(r)!==t)return;n++;
  const c=E('div','card',`<span class="n">${r.n}</span><div class="d">${X(r.name)}</div><small>${X(r.thaat)} थाट</small><small class="tm">${({'प्रातःकाल':'🌅','मध्याह्न':'☀️','सायंकाल':'🌇','रात्रि':'🌙','सर्वकालिक':'♾️','वर्षा ऋतु':'🌧️'})[bucket(r)]||''} ${X(bucket(r))}</small>`,g);c.style.animationDelay=Math.min(n,24)*25+'ms';c.dataset.b=bucket(r);c.onclick=()=>openRaag(i)});
 $('#cnt').textContent=n+' / '+B.raags.length+' राग'}
['#q','#fTh','#fJa','#fTi'].forEach(s=>$(s).addEventListener('input',grid));grid();
$('#grid').addEventListener('mousemove',e=>{const c=e.target.closest('.card');if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*18+'deg');c.style.setProperty('--rx',-((e.clientY-r.top)/r.height-.5)*18+'deg');c.style.setProperty('--gx',e.clientX-r.left+'px');c.style.setProperty('--gy',e.clientY-r.top+'px')});
$('#grid').addEventListener('mouseout',e=>{const c=e.target.closest('.card');if(c){c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')}});
/* ---------- raag-detail ---------- */
let RI=0;
const VN=[['षड्ज',0],['ऋषभ',2],['रिषभ',2],['गान्धार',4],['गांधार',4],['मध्यम',5],['पंचम',7],['धैवत',9],['निषाद',11]];
const vpc=v=>{const h=VN.find(x=>(v||'').includes(x[0]));if(!h)return 7;return h[1]-(/कोमल/.test(v)?1:0)+(/तीव्र/.test(v)?1:0)};
const GL='<p><b>आरोह / अवरोह</b> — राग की ऊपर जाती तथा नीचे आती स्वर-रचना।</p><p><b>वादी</b> — राग का सर्वप्रमुख स्वर ("राजा"); <b>संवादी</b> — दूसरा प्रमुख स्वर ("मंत्री")।</p><p><b>पकड़</b> — वे विशिष्ट स्वर-समुच्चय जिनसे राग पहचाना जाता है।</p><p><b>जाति</b> — आरोह तथा अवरोह में स्वरों की संख्या: संपूर्ण = ७, षाड़व = ६, औड़व = ५। जैसे "औड़व-संपूर्ण" का अर्थ है आरोह में ५ तथा अवरोह में ७ स्वर।</p><p><b>वर्जित</b> — जो स्वर राग में नहीं लगाए जाते अथवा जिनसे बचा जाता है।</p><p><b>समय</b> — दिन का वह प्रहर जिसमें परंपरा से राग गाया-बजाया जाता है।</p><p><b>थाट</b> — सात स्वरों की मूल स्वर-माला, जिसके अंतर्गत रागों का वर्गीकरण होता है।</p>';
const THD=['सभी सात स्वर शुद्ध (प्राकृतिक) होते हैं।','बिलावल के समान, किंतु मध्यम तीव्र; भाव उज्ज्वल तथा उदात्त।','शुद्ध मध्यम तथा कोमल निषाद; भाव चंचल एवं शृंगारिक।','कोमल ऋषभ तथा कोमल धैवत; भाव गंभीर एवं भक्तिमय।','कोमल ऋषभ, कोमल धैवत तथा तीव्र मध्यम; संध्या की गहनता।','कोमल ऋषभ तथा तीव्र मध्यम, धैवत शुद्ध; भाव विचलित एवं तरल; अनेक राग पंचम का त्याग करते हैं।','कोमल गान्धार तथा कोमल निषाद; भाव कोमल एवं गीतात्मक।','कोमल गान्धार, कोमल धैवत तथा कोमल निषाद; भाव करुण एवं गंभीर।','कोमल ऋषभ, गान्धार, धैवत तथा निषाद; सभी चल स्वर कोमल; भाव आत्मीय एवं शांत।','कोमल ऋषभ, गान्धार, धैवत तथा तीव्र मध्यम; भाव गहन एवं गंभीर।'];
const info=r=>`<p>राग <b class="dev">${X(r.name)}</b> <b class="dev">${X(r.thaat)}</b> थाट से संबद्ध है। जाति (आरोह-अवरोह): <span class="dev">${X(r.jati)}</span>। वादी: <span class="dev">${X(r.vadi)}</span>, संवादी: <span class="dev">${X(r.samvadi)}</span>। परंपरा से इसका समय: <b>${bucket(r)}</b> (<span class="dev">${X(r.samay)}</span>)।</p>`;
const taalInfo=t=>{const m=t.vib.map((v,k)=>v?k:-1).filter(k=>k>=0),L=m.map((k,j)=>(m[j+1]??t.beats)-k),kh=t.vib.findIndex(v=>v==='०');return `${X(t.name)} में <b>${t.beats} मात्राएँ</b> हैं, जो <b>${L.join(' + ')}</b> के विभागों में बँटी हैं। सम (×) पहली मात्रा पर आता है${kh>=0?`, तथा रिक्त (०) ${kh+1}वीं मात्रा पर`:' (इस ताल में रिक्त नहीं है)'}। अंकों पर ताली दीजिए और ० पर हाथ घुमाइए।`};
function genImp(r){const pc=[...pcs(r)];if(!pc.length)pc.push(0,2,4,5,7,9,11);const sc=[];[-12,0,12].forEach(o=>pc.forEach(p=>sc.push(p+o)));sc.sort((a,b)=>a-b);
 const rnd=n=>Math.random()*n|0,V=((vpc(r.vadi)%12)+12)%12,g=[],add=(n,len)=>{g.push({n,len});for(let i=1;i<len;i++)g.push(null)},cl=j=>sc[Math.max(0,Math.min(sc.length-1,j))],base=Math.max(0,sc.indexOf(0));
 pak(r.pakad||'').forEach(n=>n==null?add(null,2):add(n,3));add(0,4);
 for(let k=0;k<5;k++){const st=base+rnd(4)-1,pt=rnd(3),q=[];
  if(pt===0)for(let j=0;j<8;j++)q.push(st+j);else if(pt===1)for(let j=0;j<4;j++)q.push(st+j,st+j+2,st+j+1);else for(let j=0;j<4;j++)q.push(st+j*2,st+j*2+1,st+j*2-1,st+j*2);
  q.forEach(j=>add(cl(j),1));for(let j=4;j>=0;j--)add(cl(st+j),1);add(sc.find(x=>x>=0&&((x%12)+12)%12===V)??0,3)}
 add(0,6);while(g.length%32)g.push(null);return g}
function openRaag(i,auto){stopAll();RI=i=(i+B.raags.length)%B.raags.length;const r=B.raags[i],m=$('#modal');m.classList.add('on');
 const P=(l,k)=>r[k]?`<div class="nt"><b>${l}</b><span>${X(r[k])}</span><button class="btn" data-p="${k}">▶</button></div>`:'';
 const att=[['थाट','thaat'],['स्वर','swar'],['वादी','vadi'],['संवादी','samvadi'],['वर्जित','varjit'],['जाति','jati'],['समय','samay']].filter(a=>r[a[1]]).map(a=>`<tr><td>${a[0]}</td><td class="dev">${X(r[a[1]])}</td></tr>`).join('');
 m.innerHTML=`<div class="sheet"><button class="x" title="बंद कीजिए">×</button>
 <div class="row"><button class="btn" data-n="-1">◀</button><span class="muted">राग ${r.n} / ${B.raags.length}</span><button class="btn" data-n="1">▶</button></div>
 <h2>राग ${X(r.name)}</h2><div><span class="badge">${X(r.thaat)} थाट</span><span class="badge">${X(r.jati)}</span><span class="badge">${X(bucket(r))}</span></div>
 <div class="cols"><div><div class="scroll"><table>${att}</table></div>${P('आरोह','aroh')}${P('अवरोह','avroh')}${P('पकड़','pakad')}
 <div class="row"><button class="btn gold" data-p="both">▶ आरोह + अवरोह</button><label>गति <input id="nBpm" type="range" min="40" max="300" value="130"></label></div></div><div>${wheel(pcs(r))}</div></div>
 ${info(r)}
 <h3>तीनताल में आलाप एवं तान</h3><p class="muted">हर बार नई, छोटी सुर-रचना: पहले पकड़ पर आधारित धीमा आलाप, फिर द्रुत तानें, ताल-वाद्य के साथ।</p>
 <div class="row"><button class="btn gold" id="iP">▶ बजाएँ</button><button class="btn" id="iN">↻ नया रूप</button><label>गति <input id="iB" type="range" min="50" max="240" value="110"><b id="iBv"></b></label><label><input type="checkbox" id="iT" checked> ताल-वाद्य</label></div>
 <details><summary>इन शब्दों का अर्थ</summary>${GL}</details></div>`;
 const sh=m.firstChild,ib=$('#iB');let G=genImp(r);ib.oninput=()=>$('#iBv').textContent=ib.value;ib.oninput();
 const playI=()=>{stopAll();const tl=B.taals.find(t=>t.name==='तीनताल');run(k=>k<G.length?{dur:60/ib.value/2,g:G[k],fn:t=>{const x=G[k],bd=60/ib.value;if(x&&x.n!=null)note(x.n,t,x.len*bd/2*1.02,.5);if(k%2===0&&$('#iT').checked&&tl)tb(tl.bols[(k/2)%tl.beats],t,bd)}}:null,(k,s)=>hot(s.g&&s.g.n),()=>hot())};
 $('#iP').onclick=playI;$('#iN').onclick=()=>{G=genImp(r);playI()};auto&&setTimeout(playI,300);
 sh.onclick=e=>{const t=e.target,bp=+($('#nBpm')||{}).value||130;
  if(t.classList.contains('x'))return closeM();if(t.dataset.n)return openRaag(RI+ +t.dataset.n);
  if(t.dataset.p){stopAll();const k=t.dataset.p;if(k==='aroh')seq(asc(r.aroh),bp);else if(k==='avroh')seq(desc(r.avroh),bp);else if(k==='pakad')seq(pak(r.pakad),bp);else seq([...asc(r.aroh),null,...desc(r.avroh)],bp)}};
 m.onclick=e=>{e.target===m&&closeM()}}
function closeM(){stopAll();$('#modal').classList.remove('on');$('#modal').innerHTML=''}
/* ---------- taals ---------- */
let TI=0,taalOn=false;
function taalSel(i){stopAll();TI=i;const t=B.taals[i],ring=$('#taalRing'),n=t.beats,rad=Math.max(130,n*24);$$('#taalChips .chip').forEach((c,j)=>c.classList.toggle('on',j===i));
 ring.innerHTML='';ring.dataset.n=n;ring.dataset.r=rad;ring.style.transform=`translateZ(-${rad}px)`;
 for(let k=0;k<n;k++){const v=t.vib[k]||'',d=E('div','tile'+(v==='×'?' sam':v==='०'?' khali':''),`<i>${k+1}${v?' · '+v:''}</i><b style="font-size:${t.bols[k].length>3?18:26}px">${X(t.bols[k])}</b>`,ring);d.style.transform=`rotateY(${k*360/n}deg) translateZ(${rad}px)`;d.onclick=()=>{tb(t.bols[k],au().currentTime,60/$('#tBpm').value,+$('#tVol').value);hitD(t.bols[k])}}
 $('#taalInfo').innerHTML=`<h3 class="dev">${X(t.name)} — ${n} मात्राएँ</h3><p>${taalInfo(t)}</p><p class="muted">× = सम (प्रथम मात्रा), अंक = ताली, ० = रिक्त (हाथ घुमाना)।</p>`;
 $('#taalTbl').innerHTML=`<table class="dev"><tr><td>मात्रा</td>${t.bols.map((_,k)=>`<td>${k+1}</td>`).join('')}</tr><tr><td>विभाग</td>${t.bols.map((_,k)=>`<td>${X(t.vib[k]||'')}</td>`).join('')}</tr><tr><td>बोल</td>${t.bols.map(b=>`<td>${X(b)}</td>`).join('')}</tr></table>`}
B.taals.forEach((t,i)=>{const c=E('span','chip',`${X(t.name)} <small>${t.beats}</small>`,$('#taalChips'));c.onclick=()=>taalSel(i)});
$('#tBpm').oninput=()=>$('#tBpmV').textContent=$('#tBpm').value;$('#tBpm').oninput();
$('#tPlay').onclick=()=>{if(taalOn){stopAll();return}stopAll();taalOn=true;$('#tPlay').textContent='■ रोकें';const t=B.taals[TI],ring=$('#taalRing');
 run(i=>{const bd=60/($('#tBpm').value*$('#tLaya').value);return{dur:bd,fn:tt=>tb(t.bols[i%t.beats],tt,bd,+$('#tVol').value)}},i=>{const n=t.beats;ring.style.transform=`translateZ(-${ring.dataset.r}px) rotateY(${-i*360/n}deg)`;[...ring.children].forEach((c,j)=>c.classList.toggle('hot',j===i%n));hitD(t.bols[i%n])})};
taalSel(0);
/* ---------- swar-lab ---------- */
const KM='asdfghjkl',KS=[0,2,4,5,7,9,11,12,14];
function keyP(s,e){note(s,au().currentTime,1.4,.55);e&&(e.classList.add('hot'),setTimeout(()=>e.classList.remove('hot'),180))}
SW.forEach((n,i)=>{const k=E('div','key'+([1,3,6,8,10].includes(i)?' k':''),`${n}<small>${SL[i]}</small><small class="rt"></small>`,$('#keys'));k.dataset.i=i;k.style.animationDelay=-i*.4+'s';k.onclick=()=>keyP(i,k)});
const upd=()=>{A.eq=+$('#eq').value;$('#eqV').textContent=Math.round(A.eq*100)+' प्रतिशत';$$('#keys .key').forEach((k,i)=>{const c=Math.round(1200*Math.log2(ratio(i)))-i*100;k.querySelector('.rt').textContent=(c>0?'+':'')+c})};$('#eq').oninput=upd;upd();
const TS={'बिलावल':[0,2,4,5,7,9,11],'कल्याण':[0,2,4,6,7,9,11],'खमाज':[0,2,4,5,7,9,10],'भैरव':[0,1,4,5,7,8,11],'पूर्वी':[0,1,4,6,7,8,11],'मारवा':[0,1,4,6,7,9,11],'काफी':[0,2,3,5,7,9,10],'आसावरी':[0,2,3,5,7,8,10],'भैरवी':[0,1,3,5,7,8,10],'तोड़ी':[0,1,3,6,7,8,11]};
let THI=0;
function thSel(i){THI=i;const t=B.thaats[i],sc=Object.values(TS)[i];$$('#thChips .chip').forEach((c,j)=>c.classList.toggle('on',j===i));
 $$('#keys .key').forEach((k,j)=>k.classList.toggle('dim',!sc.includes(j)));$('#thInfo').innerHTML=`<p class="dev"><b>${X(t.name)}:</b> ${sc.map(s=>X(SW[s])).join(' ')}</p><p>${THD[i]}</p>`}
B.thaats.forEach((t,i)=>{const c=E('span','chip',X(t.name),$('#thChips'));c.onclick=()=>thSel(i)});thSel(0);
const thP=a=>{stopAll();const sc=Object.values(TS)[THI],s=[...sc,12],bp=+$('#thBpm').value;seq(a?s:[...s].reverse(),bp)};$('#thUp').onclick=()=>thP(1);$('#thDn').onclick=()=>thP(0);
$('#beat').onclick=()=>{if($('#beat').textContent.includes('■'))return stopAll();stopAll();const c=au(),o1=c.createOscillator(),o2=c.createOscillator(),g=c.createGain();o1.frequency.value=A.sa*2;o2.frequency.value=A.sa*3;o2.detune.value=+$('#det').value;g.gain.value=.14;o1.connect(g);o2.connect(g);g.connect(A.b);o1.start();o2.start();A.o2=o2;$('#beat').textContent='■ रोकें';stoppers.push(()=>{try{o1.stop();o2.stop()}catch(e){}A.o2=null})};
$('#det').oninput=()=>{$('#detV').textContent=$('#det').value+' सूक्ष्मांश';A.o2&&(A.o2.detune.value=+$('#det').value)};
addEventListener('keydown',e=>{if(e.key==='Escape')return closeM();if(!$('#lab').classList.contains('on')||/INPUT|SELECT/.test(e.target.tagName)||e.repeat)return;const k=KM.indexOf(e.key);if(k>-1){const s=KS[k],el=$(`#keys .key[data-i="${s%12}"]`);keyP(s,s<12?el:null)}});
/* ---------- dagklok ---------- */
const SKY=[[0,[10,16,48]],[5,[26,42,90]],[6.5,[212,106,58]],[9,[74,154,224]],[15,[58,143,216]],[18,[224,102,58]],[19.5,[106,26,74]],[21,[10,16,48]],[24,[10,16,48]]];
const sky=h=>{let i=SKY.findIndex(s=>s[0]>h);if(i<1)i=1;const a=SKY[i-1],b=SKY[i],f=(h-a[0])/(b[0]-a[0]);return'rgb('+a[1].map((v,k)=>Math.round(v+(b[1][k]-v)*f)).join(',')+')'};
let CL=[];const skyset=h=>{$('#dial').style.setProperty('--sky',sky(h));$('#dial').style.setProperty('--nt',Math.max(0,Math.min(1,h<5?1:h<7?(7-h)/2:h>21?1:h>19?(h-19)/2:0)))};
Array.from({length:30},()=>{const u=E('u','',null,$('#dial'));u.style.left=Math.random()*88+6+'%';u.style.top=Math.random()*88+6+'%';u.style.animationDelay=Math.random()*3+'s'});
function clock(){const h=+$('#hr').value%24,hh=Math.floor(h),mm=Math.round((h-hh)*60);$('#tm').textContent=String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0');$('#hand').style.transform=`rotate(${(h-12)/24*360}deg)`;skyset(h);
 const g=$('#clkList');g.innerHTML='';CL=B.raags.map((r,i)=>({r,i,w:hw(r.samay||'')})).filter(x=>x.w[1]-x.w[0]<24&&inWin(h,x.w));CL.forEach(x=>{const c=E('div','card',`<div class="d">${X(x.r.name)}</div><small>${X(x.r.samay)}</small>`,g);c.onclick=()=>openRaag(x.i)});if(!CL.length)g.innerHTML='<p class="muted c">इस समय के लिए कोई निश्चित राग नहीं है — कोई अन्य समय चुनिए।</p>'}
$('#hr').oninput=clock;clock();let dayOn=false;
$('#run').onclick=()=>{dayOn=!dayOn;$('#run').textContent=dayOn?'■ दिन रोकिए':'▶ दिन चलाइए';let l=0;const f=t=>{if(!dayOn)return;if(t-l>60){l=t;$('#hr').value=(+$('#hr').value+.05)%24;if(+$('#hr').value*20%10<.5)clock();else{const h=+$('#hr').value;$('#hand').style.transform=`rotate(${(h-12)/24*360}deg)`;skyset(h)}}requestAnimationFrame(f)};requestAnimationFrame(f)};
$('#rnd').onclick=()=>{if(!CL.length)return;stopAll();const x=CL[Math.random()*CL.length|0];seq(pak(x.r.pakad),150)};
/* ---------- leren ---------- */
let deck=[['राग','निश्चित स्वर-क्रम (आरोह-अवरोह), प्रमुख स्वरों तथा अपने विशिष्ट भाव वाली स्वर-रचना का ढाँचा।'],['आरोह / अवरोह','राग की ऊपर जाती तथा नीचे आती स्वर-रचना।'],['वादी','राग का सर्वप्रमुख स्वर ("राजा")।'],['संवादी','दूसरा प्रमुख स्वर ("मंत्री"), प्रायः वादी से पंचम अथवा मध्यम के अंतर पर।'],['पकड़','वे विशिष्ट स्वर-समुच्चय जिनसे राग पहचाना जाता है।'],['थाट','सात स्वरों की मूल स्वर-माला जिसके अंतर्गत रागों का वर्गीकरण होता है; थाट दस हैं।'],['जाति','आरोह-अवरोह में स्वरों की संख्या: ५ (औड़व), ६ (षाड़व) अथवा ७ (संपूर्ण)।'],['स्वर','सा रे ग म प ध नि — सप्तक के सात मूल स्वर।'],['कोमल / तीव्र','कोमल = उतरा हुआ (रे, ग, ध, नि); तीव्र = चढ़ा हुआ (केवल म)।'],['ताल','निश्चित मात्राओं तथा विभागों वाला चक्रीय लय-ढाँचा।'],['सम, ताली, रिक्त','सम = प्रथम मात्रा (बल); ताली = हाथ की थाप; रिक्त = हाथ घुमाना।'],['ठेका','किसी ताल के बोलों का मूल क्रम।'],['लय','गति का स्तर: विलंबित (धीमी), मध्य, द्रुत (तीव्र)।'],['तानपूरा','वह तंत्रवाद्य जो षड्ज तथा पंचम का आधार-स्वर निरंतर देता है।'],['समय','दिन का वह प्रहर जिसमें राग परंपरा से प्रस्तुत किया जाता है।'],['श्रुति','सप्तक के भीतर सूक्ष्म स्वर-अंतर; परंपरा में २२ श्रुतियाँ मानी गई हैं।']],DI=0;
const card=()=>{$('#flip').classList.remove('on');const d=deck[DI];$('#ff').textContent=d[0];$('#fb').textContent=d[1];$('#fn').textContent=(DI+1)+' / '+deck.length};
$('#flip').onclick=()=>$('#flip').classList.toggle('on');$('#fp').onclick=()=>{DI=(DI-1+deck.length)%deck.length;card()};$('#fx').onclick=()=>{DI=(DI+1)%deck.length;card()};
$('#fs').onclick=()=>{deck.sort(()=>Math.random()-.5);DI=0;card()};card();
let QR=null,qs=0,qn=0;
function quiz(){const p=B.raags.filter(r=>r.pakad),r=p[Math.random()*p.length|0],o=[r];while(o.length<4){const x=p[Math.random()*p.length|0];if(!o.includes(x))o.push(x)}o.sort(()=>Math.random()-.5);QR=r;$('#qOpt').innerHTML='';
 o.forEach(x=>{const b=E('button','btn',X(x.name),$('#qOpt'));b.onclick=()=>{if(QR.done)return;QR.done=1;qn++;x===r?(qs++,b.classList.add('ok')):(b.classList.add('no'),[...$('#qOpt').children].forEach(c=>c.textContent.startsWith(r.name)&&c.classList.add('ok')));$('#qScore').textContent=`प्राप्तांक ${qs} / ${qn}`}});delete r.done;$('#qPlay').click()}
$('#qPlay').onclick=()=>{if(!QR)return quiz();stopAll();seq(pak(QR.pakad),150)};$('#qNext').onclick=quiz;
/* ---------- globale balk & achtergrond ---------- */
$('#sa').oninput=()=>{A.sa=+$('#sa').value;$('#saV').textContent=A.sa};$('#sa').oninput();
$('#vol').oninput=()=>{A.vol=+$('#vol').value;A.m&&(A.m.gain.value=A.vol)};$('#rev').oninput=()=>{A.rev=+$('#rev').value;A.w&&(A.w.gain.value=A.rev)};$('#inst').onchange=()=>A.inst=$('#inst').value;
$('#drone').onclick=()=>{A.drone=!A.drone;$('#drone').classList.toggle('act',A.drone);clearInterval(A.dt);if(A.drone){au();dr();A.dt=setInterval(dr,3400)}};$('#stop').onclick=stopAll;
let SP=[];const burst=(a,b)=>{for(let i=0;i<20;i++){const g=Math.random()*6.28,v=1+Math.random()*3;SP.push({x:a,y:b,vx:Math.cos(g)*v,vy:Math.sin(g)*v-1.5,l:1,c:['255,153,51','255,255,255','19,136,8','246,227,161'][i%4]})}};
const LITE=(navigator.hardwareConcurrency||4)<=4||innerWidth<760||matchMedia('(prefers-reduced-motion:reduce)').matches;
if(LITE)document.documentElement.classList.add('lite');
$$('.drum .sp').forEach(sp=>{for(let k=0;k<6;k++)E('i','',null,sp).style.setProperty('--k',k)});
if(!LITE)addEventListener('pointerdown',e=>burst(e.clientX,e.clientY));
/* अंकों को देवनागरी रूप में दिखाना */
const DD=t=>t.replace(/\d/g,d=>'०१२३४५६७८९'[d]),cvn=n=>{if(n.nodeType===3){if(/\d/.test(n.data))n.data=DD(n.data)}else if(n.nodeType===1&&!/^(SCRIPT|STYLE|INPUT|TEXTAREA)$/.test(n.tagName))n.childNodes.forEach(cvn)};
new MutationObserver(ms=>ms.forEach(m=>{m.addedNodes.forEach(cvn);if(m.type==='characterData')cvn(m.target)})).observe(document.body,{childList:true,subtree:true,characterData:true});
/* हल्की पृष्ठभूमि: थोड़े कण तथा दो लहरें, आधी गति से चित्रण */
(()=>{const cv=$('#bg'),x=cv.getContext('2d'),d=new Uint8Array(64),sp=document.createElement('canvas');sp.width=sp.height=32;const g=sp.getContext('2d'),gr=g.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'rgba(246,227,161,.9)');gr.addColorStop(1,'rgba(246,227,161,0)');g.fillStyle=gr;g.fillRect(0,0,32,32);
 let W,H,t=0,fr=0;const rs=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight};rs();addEventListener('resize',rs);
 const P=Array.from({length:LITE?14:36},()=>({x:Math.random(),y:Math.random(),z:Math.random()*.8+.2,p:Math.random()*6}));
 (function f(){requestAnimationFrame(f);if(document.hidden||(++fr&1))return;t+=.02;x.clearRect(0,0,W,H);let l=0;if(A.an&&(A.drone||stoppers.length)){A.an.getByteFrequencyData(d);l=d.reduce((a,b)=>a+b,0)/64/255}
  P.forEach(o=>{o.y-=.0004*o.z*(1+l*6);if(o.y<-.02){o.y=1.02;o.x=Math.random()}const s=o.z*14*(1+l);x.globalAlpha=.55*o.z;x.drawImage(sp,(o.x+Math.sin(t+o.p)*.02)*W-s/2,o.y*H-s/2,s,s)});x.globalAlpha=1;
  if(!LITE)for(let k=0;k<2;k++){x.beginPath();for(let px=0;px<=W;px+=48){const y=H*(.84+k*.05)+Math.sin(px*.004+t*(1+k*.4)+k)*(14+l*100);px?x.lineTo(px,y):x.moveTo(px,y)}x.strokeStyle=['rgba(216,180,90,.22)','rgba(23,161,115,.2)'][k];x.lineWidth=2;x.stroke()}
  SP.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.12;p.l-=.036;x.fillStyle=`rgba(${p.c},${Math.max(p.l,0)})`;x.fillRect(p.x,p.y,3,3)});SP=SP.filter(p=>p.l>0)})()})();
/* तिरंगा तथा सिंह-स्तंभ */
const FLAG=(()=>{const c=document.createElement('canvas');c.width=300;c.height=200;const g=c.getContext('2d');
 g.fillStyle='#FF9933';g.fillRect(0,0,300,67);g.fillStyle='#fff';g.fillRect(0,67,300,66);g.fillStyle='#138808';g.fillRect(0,133,300,67);
 g.translate(150,100);g.strokeStyle='#000080';g.lineWidth=1.6;g.beginPath();g.arc(0,0,25,0,7);g.stroke();
 for(let i=0;i<24;i++){g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(i*Math.PI/12)*25,Math.sin(i*Math.PI/12)*25);g.stroke()}
 g.fillStyle='#000080';g.beginPath();g.arc(0,0,3.5,0,7);g.fill();return c})();
function waveFlag(cv,t,amp,step){const x=cv.getContext('2d'),W=cv.width,H=cv.height,n=Math.floor(W/step),pad=amp+4,fh=H-pad*2,w=W/n;x.clearRect(0,0,W,H);
 for(let i=0;i<n;i++){const u=i/n,ph=u*6-t*3,dy=Math.sin(ph)*amp*u,sh=Math.cos(ph)*.3;x.drawImage(FLAG,u*300,0,300/n+1,200,i*w,pad+dy,w+1,fh);x.fillStyle=sh>0?`rgba(255,255,255,${(sh*.35).toFixed(3)})`:`rgba(0,0,0,${(-sh*.55).toFixed(3)})`;x.fillRect(i*w,pad+dy,w+1,fh)}}
(()=>{const f1=$('#flag'),f2=$('#flag2'),hm=$('#home');let fr=0;(function f(){requestAnimationFrame(f);if(document.hidden||(++fr%(LITE?3:2)))return;const t=performance.now()/1000;if(f1&&hm.classList.contains('on'))waveFlag(f1,t,16,LITE?10:6);if(f2)waveFlag(f2,t,3,4)})();
 const em=$('#emb');if(em){const im=E('img','embimg','',em);im.src='emblem.png';im.alt='भारत का राज्य-चिह्न: सत्यमेव जयते'}
})();
go(location.hash.slice(1)||'home');

/* सजावट: मंडल, आज का राग, विशेषता-पट्टिकाएँ, शीर्षक-पट्टियाँ */
(()=>{const st=$('#home .stage');let p='';
 for(let i=0;i<24;i++)p+=`<path transform="rotate(${i*15} 200 200)" d="M200 18Q224 70 200 122Q176 70 200 18Z"/>`;
 for(let i=0;i<12;i++)p+=`<path transform="rotate(${i*30+15} 200 200)" d="M200 72Q216 106 200 142Q184 106 200 72Z"/>`;
 st.insertAdjacentHTML('afterbegin',`<svg class="mand" viewBox="0 0 400 400" aria-hidden="true"><defs><linearGradient id="mg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e3a1"/><stop offset="1" stop-color="#17a173"/></linearGradient></defs><g fill="none" stroke="url(#mg)" stroke-width="1.3"><circle cx="200" cy="200" r="196"/><circle cx="200" cy="200" r="160" stroke-dasharray="3 7"/><circle cx="200" cy="200" r="70"/><circle cx="200" cy="200" r="30"/>${p}</g></svg>`);
 const d=new Date(),h=d.getHours()+d.getMinutes()/60,c=B.raags.map((r,i)=>({r,i,w:hw(r.samay||'')})).filter(x=>x.w[1]-x.w[0]<24&&inWin(h,x.w)),x=c.length?c[Math.random()*c.length|0]:{r:B.raags[0],i:0};
 const td=E('div','today',`<div class="ti">${h<5||h>=20?'🌙':h<9?'🌅':h<16?'☀️':'🌇'}</div><div><div class="muted">इस प्रहर का राग</div><h3 class="dev" style="margin:.1em 0">राग ${X(x.r.name)}</h3><div class="dev muted">${X(x.r.thaat)} थाट · ${X(x.r.samay)}</div></div><button class="btn gold">▶ सुनें</button><button class="btn">विवरण</button>`);
 $('.nat').before(td);const bs=td.querySelectorAll('button');bs[0].onclick=()=>{stopAll();seq(pak(x.r.pakad),150)};bs[1].onclick=()=>openRaag(x.i);
 const FT=[['🎼','राग',B.raags.length+' रागों की स्वर-रचना सुनिए','raags'],['🥁','ताल',B.taals.length+' तालों के ठेके सुनिए','taals'],['🎹','स्वर-प्रयोगशाला','बारह स्वर तथा दस थाट','lab'],['🕰️','प्रहर-घड़ी','दिन के समय के अनुसार राग','clock'],['🧠','अध्ययन','स्मरण-पत्र तथा प्रश्नोत्तरी','cards']];
 $('#stats').insertAdjacentHTML('afterend','<div class="orn">✦ ❖ ✦</div><div class="feats">'+FT.map(f=>`<div class="feat" data-go="${f[3]}"><i>${f[0]}</i><b>${f[1]}</b><span>${f[2]}</span></div>`).join('')+'</div>');
 $('.fw').append(E('div','lbl','भारत का राष्ट्रीय ध्वज'));$('#emb').append(E('div','lbl','भारत का राज्य-चिह्न'))})();
