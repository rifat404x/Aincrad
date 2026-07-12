javascript:(function(){
  const T={c:null,i(){
    if(!this.c){this.c=document.createElement('div');this.c.id='nt';this.c.style.cssText='position:fixed;top:16px;right:16px;z-index:2147483647;display:flex;flex-direction:column;gap:10px;width:min(420px,calc(100vw - 32px))';document.body.appendChild(this.c);document.head.appendChild(document.createElement('style')).textContent='@keyframes ns{from{transform:translateX(120%) scale(.9);opacity:0}to{transform:translateX(0) scale(1);opacity:1}}@keyframes no{to{transform:translateX(120%) scale(.9);opacity:0}}.nb-toast{animation:ns .25s ease}.nb-toast.removing{animation:no .25s ease}'}
    return this.c
  },s(m,t='info',d=3000,o={}){
    const c=this.i();const cl={success:'#4ade80',error:'#f87171',warning:'#fbbf24',info:'#60a5fa',progress:'#a78bfa',loading:'#67e8f9'};const co=cl[t]||cl.info;const ic={success:'✓',error:'✕',warning:'⚠',info:'ℹ',progress:'⟳',loading:'⟳'};
    const to=document.createElement('div');
    to.style.cssText=`background:linear-gradient(145deg,rgba(255,255,255,.05),rgba(255,255,255,.01));backdrop-filter:blur(24px) saturate(200%);-webkit-backdrop-filter:blur(24px) saturate(200%);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:12px 16px;box-shadow:0 8px 32px rgba(0,0,0,.2);display:flex;gap:10px;align-items:flex-start;color:#f1f5f9;font-family:'Segoe UI',system-ui,sans-serif;font-size:13px;line-height:1.4;position:relative;overflow:hidden;min-width:280px;class:nb-toast`;
    const ac=document.createElement('div');ac.style.cssText=`position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(180deg,${co},${co}80,${co}40);border-radius:4px 0 0 4px;box-shadow:0 0 12px ${co}40`;to.appendChild(ac);
    const ic2=document.createElement('span');ic2.textContent=o.i||ic[t]||ic.info;ic2.style.cssText=`font-size:16px;flex-shrink:0;margin-top:1px;filter:drop-shadow(0 0 6px ${co}60)`;
    const mc=document.createElement('div');mc.style.cssText='flex:1;min-width:0;display:flex;flex-direction:column;gap:4px';
    if(o.ti){const ti=document.createElement('div');ti.textContent=o.ti;ti.style.cssText='font-weight:600;font-size:13px;color:#f1f5f9;letter-spacing:.3px';mc.appendChild(ti)}
    const ms=document.createElement('div');ms.textContent=m;ms.style.cssText='word-break:break-word;color:#cbd5e1;font-size:12px;opacity:.9';mc.appendChild(ms);
    if(o.a&&o.a.length){const ac2=document.createElement('div');ac2.style.cssText='display:flex;gap:6px;margin-top:4px;flex-wrap:wrap;justify-content:flex-end';
    o.a.forEach(a=>{const b=document.createElement('button');b.textContent=a.l;b.style.cssText=`background:${co}12;border:1px solid ${co}30;color:${co};padding:4px 10px;border-radius:14px;font-size:11px;cursor:pointer;font-weight:600;transition:all .2s`;b.onmouseover=()=>{b.style.background=`${co}25`};b.onmouseout=()=>{b.style.background=`${co}12`};b.onclick=a.cb;ac2.appendChild(b)});mc.appendChild(ac2)}
    const cb=document.createElement('button');cb.textContent='✕';cb.style.cssText='background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);color:#94a3b8;width:24px;height:24px;border-radius:50%;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:16px;transition:all .2s';cb.onmouseover=()=>{cb.style.background='rgba(255,255,255,.08)';cb.style.color='#e2e8f0'};cb.onmouseout=()=>{cb.style.background='rgba(255,255,255,.03)';cb.style.color='#94a3b8'};
    if(d>0){const pc=document.createElement('div');pc.style.cssText='position:absolute;bottom:0;left:0;right:0;height:2px;background:rgba(255,255,255,.03)';const pb=document.createElement('div');pb.style.cssText=`height:100%;background:${co};animation:progress ${d}ms linear forwards`;pc.appendChild(pb);to.appendChild(pc)}
    to.appendChild(ic2);to.appendChild(mc);to.appendChild(cb);c.appendChild(to);
    let tid;if(d>0)tid=setTimeout(()=>this.r(to),d);
    const clr=()=>{clearTimeout(tid);this.r(to)};cb.onclick=e=>{e.stopPropagation();clr()};to.onclick=e=>{if(e.target===to)clr()};return to
  },r(to){if(!to||!to.parentNode)return;to.classList.add('removing');setTimeout(()=>{if(to.parentNode)to.parentNode.removeChild(to)},250)},suc(m,d,o){return this.s(m,'success',d,o)},err(m,d,o){return this.s(m,'error',d,o)},warn(m,d,o){return this.s(m,'warning',d,o)},info(m,d,o){return this.s(m,'info',d,o)},load(m,d){return this.s(m,'loading',d)},pro(m,d){return this.s(m,'progress',d)}
  };
  
  const st=document.createElement('style');st.textContent='@keyframes progress{from{width:100%}to{width:0%}}';
  document.head.appendChild(st);
  
  // ╔═══════════════════════════════════════════════════════╗
  // ║  AUTHOR: Ahmed Rifat                               ║
  // ║  GITHUB: @rifat404x                                ║
  // ║  PROJECT: VIP PERSON ONLY                          ║
  // ║  TELEGRAM: https://t.me/+d4CwJgibp5FiYWU1          ║
  // ║  CREDITS: Ahmed Rifat (@rifat404x)                 ║
  // ╚═══════════════════════════════════════════════════════╝
  
  const U=window.location.hostname,n=window.n,B=window.VIP_PERSON_ONLY_LOAD||'';
  
  const BLOCKED=[['aincradmods.com','Please open ads website first'],['facebook.com','Facebook is not supported'],['youtube.com','YouTube is not supported'],['instagram.com','Instagram is not supported']];
  
  const SITES=[['tarviral.com','aincrad'],['rodaemotor.com','aincrad'],['vipteam.store','vipteam'],['powercheats.fun','powercheats'],['vplink.in','universal-vplink']];
  
  function X(){
    // Step 1: BLOCKLIST
    for(let i=0;i<BLOCKED.length;i++){if(U.includes(BLOCKED[i][0])){T.err('⛔ '+BLOCKED[i][1],5000,{ti:'Blocked',a:[{l:'Close',cb:()=>{}}]});return}}
    
    // Step 2: Manual engine string check (B = "aincrad","vipteam" etc)
    if(B&&B!=='0'&&B!==0&&typeof B==='string'&&B!=='Ahmed'){T.info(`📌 Manual engine: ${B}`,1500);F(0,B);return}
    
    // Step 3: ALLOWLIST check
    let engine='',site='';for(let i=0;i<SITES.length;i++){if(U.includes(SITES[i][0])){site=SITES[i][0];engine=SITES[i][1];break}}
    
    // Step 4: Evade mode (n="Ahmed" or B="Ahmed")
    if(n==='Ahmed'||B==='Ahmed'){
      T.info('👤 Evade app detected',2000);
      let abdEngine='ahmed';
      if(U.includes('tarviral.com')||U.includes('rodaemotor.com')){abdEngine='aincrad';T.info('⚠️ Special site: aincrad engine',1500)}
      setTimeout(()=>F(0,abdEngine),2200);return;
    }
    
    // Step 5: Unsupported site
    if(!engine){T.warn('⚠️ Unsupported site!..',4000,{ti:'Warning',a:[{l:'Continue?',cb:()=>{F(0,'default')}}]});return}
    
    // Step 6: Numeric value
    if(typeof n==='number'&&!isNaN(n)){T.info(`🔢 Numeric value: ${n}`,2000);F(n,engine);return}
    
    // Step 7: Default load
    T.info(`📍 Site: ${site} | Engine: ${engine}`,2000);F(0,engine);
  }
  
  function F(v,eng){const u=`https://raw.githubusercontent.com/rifat404x/Aincrad/main/dynamic-bypass-by-@rifat404x.js?t=${Date.now()}&n=${v}&site=${eng}`;const lt=T.load('⏳ Loading...',0);fetch(u).then(r=>r.text()).then(t=>{lt.remove();eval(t)}).catch(e=>{lt.remove();T.err('❌ Load failed: '+e.message,5000)})}
  
  T.info('🚀 VIP PERSON ONLY v1.0',1500);setTimeout(X,1600);window.T=T;
})();