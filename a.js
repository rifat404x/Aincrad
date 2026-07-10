javascript:(function(){
  const T={c:null,i(){
    if(!this.c){this.c=document.createElement('div');this.c.id='nt';this.c.style.cssText='position:fixed;top:16px;right:16px;z-index:2147483647;display:flex;flex-direction:column;gap:10px;width:min(400px,calc(100vw-32px));pointer-events:none;font-family:system-ui,sans-serif';document.body.appendChild(this.c)}
    return this.c
  },s(m,t='info',d=3000,o={}){
    const c=this.i();const cl={success:'#00c853',error:'#ff1744',warning:'#ff9100',info:'#2979ff',progress:'#7c4dff',loading:'#00b8d4'};const co=cl[t]||cl.info;const ic={success:'✓',error:'✕',warning:'!',info:'i',progress:'↻',loading:'◌'};
    const to=document.createElement('div');to.style.cssText=`background:rgba(10,15,30,0.96);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.08);border-left:4px solid ${co};border-radius:14px;padding:14px 18px;color:#e8edf5;font-size:14px;line-height:1.5;box-shadow:0 8px 32px rgba(0,0,0,0.4);transform:translateX(120%);animation:ns .4s cubic-bezier(.16,1,.3,1) forwards;pointer-events:auto;display:flex;align-items:flex-start;gap:12px;width:100%;position:relative;overflow:hidden`;
    const ic2=document.createElement('span');ic2.textContent=o.i||ic[t]||ic.info;ic2.style.cssText='font-size:18px;flex-shrink:0;margin-top:1px';
    const mc=document.createElement('div');mc.style.cssText='flex:1;min-width:0';
    if(o.ti){const ti=document.createElement('div');ti.textContent=o.ti;ti.style.cssText='font-weight:600;font-size:14px;color:#f0f4ff;margin-bottom:2px';mc.appendChild(ti)}
    const ms=document.createElement('div');ms.textContent=m;ms.style.cssText='word-break:break-word;color:#b0bdd0;font-size:13px';mc.appendChild(ms);
    if(o.a&&o.a.length){const ac=document.createElement('div');ac.style.cssText='display:flex;gap:6px;margin-top:8px;flex-wrap:wrap';
    o.a.forEach(a=>{const b=document.createElement('button');b.textContent=a.l;b.style.cssText=`background:${co}15;border:1px solid ${co}40;color:${co};padding:4px 12px;border-radius:20px;font-size:12px;cursor:pointer;transition:.2s;white-space:nowrap`;b.onclick=e=>{e.stopPropagation();a.cb()};ac.appendChild(b)});mc.appendChild(ac)}
    const cb=document.createElement('button');cb.textContent='✕';cb.style.cssText='background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#708090;width:26px;height:26px;border-radius:50%;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0';
    if(d>0&&o.p!==false){const pc=document.createElement('div');pc.style.cssText='position:absolute;bottom:0;left:0;right:0;height:3px;background:rgba(255,255,255,.05)';const pb=document.createElement('div');pb.style.cssText=`height:100%;background:${co};width:100%`;pc.appendChild(pb);to.appendChild(pc);
    const st=Date.now();const up=()=>{const e=Date.now()-st;const r=Math.max(0,1-e/d);pb.style.width=r*100+'%';if(r>0)requestAnimationFrame(up)};requestAnimationFrame(up)}
    to.appendChild(ic2);to.appendChild(mc);to.appendChild(cb);c.appendChild(to);
    let tid;if(d>0)tid=setTimeout(()=>this.r(to),d);
    const clr=()=>{clearTimeout(tid);this.r(to)};cb.onclick=clr;to.onclick=e=>{if(e.target===to)clr()};return to
  },r(to){
    if(!to||!to.parentNode)return;to.style.animation='no .3s cubic-bezier(.4,0,.2,1) forwards';setTimeout(()=>{if(to.parentNode)to.parentNode.removeChild(to)},300)
  },ss(m,d,o){return this.s(m,'success',d,o)},er(m,d,o){return this.s(m,'error',d,o)},wa(m,d,o){return this.s(m,'warning',d,o)},in(m,d,o){return this.s(m,'info',d,o)},pr(m,d,o){return this.s(m,'progress',d,o)},lo(m,d,o){return this.s(m,'loading',d,o)}};
  
  const st=document.createElement('style');st.textContent='@keyframes ns{from{transform:translateX(120%) scale(.9);opacity:0}to{transform:translateX(0) scale(1);opacity:1}}@keyframes no{from{transform:translateX(0) scale(1);opacity:1}to{transform:translateX(120%) scale(.8);opacity:0}}@media(max-width:480px){#nt{right:8px;left:8px;width:auto}}';document.head.appendChild(st);
  
  const U=window.location.hostname, n=window.n, B=window.ABDULLAH_BOOKMARK_LOAD||'';
  
  // ========== BLOCKLIST ==========
  // এই সাইট গুলোতে script চলবে না
  const BLOCKED=[
    ['google.com',        'Google is not supported'],
    ['facebook.com',      'Facebook is blocked'],
    ['youtube.com',       'YouTube is blocked'],
    ['instagram.com',     'Instagram is blocked'],
    ['twitter.com',       'Twitter/X is blocked'],
    ['reddit.com',        'Reddit is blocked'],
    ['wikipedia.org',     'Wikipedia is blocked'],
    ['stackoverflow.com', 'StackOverflow is blocked']
  ];
  
  // ========== ALLOWLIST ==========
  // Format: [hostname_match, engine_name]
  const SITES=[
    ['tarviral.com',         'aincrad'],
    ['rodaemotor.com',       'aincrad'],
    ['vipteam.store',        'vipteam'],
    ['powercheats.fun',      'powercheats'],
    ['vplink.in',            'vplink']
  ];
  
  function X(){
    // Step 1: BLOCKLIST check (সবার আগে)
    for(let i=0;i<BLOCKED.length;i++){
      if(U.includes(BLOCKED[i][0])){
        T.er(`⛔ ${BLOCKED[i][1]}`,5000,{ti:'Blocked Site',a:[{l:'Close',cb:()=>{}}]});
        return; // স্ক্রিপ্ট বন্ধ
      }
    }
    
    // Step 2: ALLOWLIST check (URL match খোঁজা)
    let engine='', site='';
    for(let i=0;i<SITES.length;i++){
      if(U.includes(SITES[i][0])){site=SITES[i][0];engine=SITES[i][1];break}
    }
    
    // Step 3: Unsupported site -> warning + default
    if(!engine){
      T.wa('⚠️ Unsupported site! Using default engine...',4000,{ti:'Warning',a:[{l:'Continue',cb:()=>{F(0,'default')}}]});
      return;
    }
    
    // Step 4: Abdullah mode check
    if(n==='Abdullah'||B==='Abdullah'){
      T.in('👤 Abdullah mode detected',2000);
      if(U.includes('tarviral.com')||U.includes('rodaemotor.com')){B='aincrad';T.wa('⚠️ Special site: aincrad engine',2000)}
      F(0,B||'abdullah');return;
    }
    
    // Step 5: Numeric value check
    if(typeof n==='number'&&!isNaN(n)){T.in(`🔢 Numeric value: ${n}`,2000);F(n,engine);return}
    
    // Step 6: Default load (n সেট না থাকলেও URL check করেই লোড হবে)
    T.in(`📍 Site: ${site} | Engine: ${engine}`,2000);F(0,engine);
  }
  
  function F(v,eng){
    const u=`https://raw.githubusercontent.com/A2MBD3/Aincrad/main/dynamic-bypass-by-@a2mbd3.js?t=${Date.now()}&n=${v}&site=${eng}`;
    const lt=T.lo('⏳ Loading...',0);
    fetch(u).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);T.r(lt);T.ss('✅ Loaded!',2500);return r.text()}).then(c=>{T.pr('⚡ Executing...',2000);setTimeout(()=>{try{eval(c);T.ss('🎉 Done!',3000)}catch(e){T.er('❌ '+e.message,5000)}},500)}).catch(e=>{T.r(lt);T.er('❌ '+e.message,5000,{a:[{l:'Retry',cb:()=>F(v,eng)}]})})
  }
  
  T.in('🚀 Nebula v3.3',1500);setTimeout(X,1600);
  window.T=T;
})();