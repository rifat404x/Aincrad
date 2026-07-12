javascript:(function(){
  const T={c:null,i(){
    if(!this.c){this.c=document.createElement('div');this.c.id='nt';this.c.style.cssText='position:fixed;top:16px;right:16px;z-index:2147483647;display:flex;flex-direction:column;gap:10px;width:min(380px,calc(100vw-32px));pointer-events:none;font-family:system-ui,sans-serif';document.body.appendChild(this.c)}
    return this.c
  },s(m,t='info',d=3000,o={}){
    const c=this.i();const cl={success:'#4ade80',error:'#f87171',warning:'#fbbf24',info:'#60a5fa',progress:'#a78bfa',loading:'#67e8f9'};const co=cl[t]||cl.info;const ic={success:'✓',error:'✕',warning:'!',info:'i',progress:'↻',loading:'◌'};
    const to=document.createElement('div');
    to.style.cssText=`background:linear-gradient(145deg,rgba(255,255,255,.05),rgba(255,255,255,.01));backdrop-filter:blur(24px) saturate(200%);-webkit-backdrop-filter:blur(24px) saturate(200%);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:14px 16px;color:#e2e8f0;font-size:13px;line-height:1.4;box-shadow:8px 8px 20px rgba(0,0,0,.25),-1px -1px 2px rgba(255,255,255,.04),inset 1px 1px 1px rgba(255,255,255,.02);transform:translateX(120%);animation:ns .35s cubic-bezier(.16,1,.3,1) forwards;pointer-events:auto;display:flex;align-items:flex-start;gap:10px;width:100%;position:relative;overflow:hidden`;
    const ac=document.createElement('div');ac.style.cssText=`position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(180deg,${co},${co}80,${co}40);border-radius:4px 0 0 4px;box-shadow:0 0 16px ${co}50`;
    to.appendChild(ac);
    const ic2=document.createElement('span');ic2.textContent=o.i||ic[t]||ic.info;ic2.style.cssText=`font-size:16px;flex-shrink:0;margin-top:1px;filter:drop-shadow(0 0 6px ${co}60)`;
    const mc=document.createElement('div');mc.style.cssText='flex:1;min-width:0;display:flex;flex-direction:column;gap:4px';
    if(o.ti){const ti=document.createElement('div');ti.textContent=o.ti;ti.style.cssText='font-weight:600;font-size:13px;color:#f1f5f9;letter-spacing:.3px';mc.appendChild(ti)}
    const ms=document.createElement('div');ms.textContent=m;ms.style.cssText='word-break:break-word;color:#cbd5e1;font-size:12px;opacity:.9';mc.appendChild(ms);
    if(o.a&&o.a.length){const ac2=document.createElement('div');ac2.style.cssText='display:flex;gap:6px;margin-top:4px;flex-wrap:wrap;justify-content:flex-end';
    o.a.forEach(a=>{const b=document.createElement('button');b.textContent=a.l;b.style.cssText=`background:${co}12;border:1px solid ${co}30;color:${co};padding:4px 10px;border-radius:14px;font-size:11px;font-weight:500;cursor:pointer;transition:.2s;white-space:nowrap;box-shadow:2px 2px 6px rgba(0,0,0,.2),inset -1px -1px 1px rgba(255,255,255,.02)`;b.onmouseover=()=>{b.style.background=`${co}25`;b.style.borderColor=`${co}50`};b.onmouseout=()=>{b.style.background=`${co}12`;b.style.borderColor=`${co}30`};b.onclick=e=>{e.stopPropagation();a.cb()};ac2.appendChild(b)});mc.appendChild(ac2)}
    const cb=document.createElement('button');cb.textContent='✕';cb.style.cssText='background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);color:#94a3b8;width:24px;height:24px;border-radius:50%;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0;transition:.2s;box-shadow:2px 2px 5px rgba(0,0,0,.2),inset -1px -1px 1px rgba(255,255,255,.02);margin-left:auto';cb.onmouseover=()=>{cb.style.background='rgba(248,113,113,.15)';cb.style.color='#f87171';cb.style.borderColor='rgba(248,113,113,.25)'};cb.onmouseout=()=>{cb.style.background='rgba(255,255,255,.03)';cb.style.color='#94a3b8';cb.style.borderColor='rgba(255,255,255,.06)'};
    if(d>0){const pc=document.createElement('div');pc.style.cssText='position:absolute;bottom:0;left:0;right:0;height:2px;background:rgba(255,255,255,.03)';const pb=document.createElement('div');pb.style.cssText=`height:100%;background:linear-gradient(90deg,transparent,${co}80,${co});width:100%;border-radius:0 0 0 16px;animation:pr ${d}ms linear forwards`;pc.appendChild(pb);to.appendChild(pc)}
    to.appendChild(ic2);to.appendChild(mc);to.appendChild(cb);c.appendChild(to);
    let tid;if(d>0)tid=setTimeout(()=>this.r(to),d);
    const clr=()=>{clearTimeout(tid);this.r(to)};cb.onclick=e=>{e.stopPropagation();clr()};to.onclick=e=>{if(e.target===to)clr()};return to
  },r(to){if(!to||!to.parentNode)return;to.style.animation='no .25s ease forwards';setTimeout(()=>{if(to.parentNode)to.parentNode.removeChild(to)},250)},suc(m,d,o){return this.s(m,'success',d,o)},err(m,d,o){return this.s(m,'error',d,o)},warn(m,d,o){return this.s(m,'warning',d,o)},info(m,d,o){return this.s(m,'info',d,o)},prog(m,d,o){return this.s(m,'progress',d,o)},load(m,d,o){return this.s(m,'loading',d,o)}};
  
  const st=document.createElement('style');st.textContent='@keyframes ns{from{transform:translateX(120%) scale(.9);opacity:0}to{transform:translateX(0) scale(1);opacity:1}}@keyframes no{to{transform:translateX(120%) scale(.9);opacity:0}}@keyframes pr{from{width:100%}to{width:0%}}@media(max-width:480px){#nt{right:8px;left:8px;width:auto}}';document.head.appendChild(st);
  
  const U=window.location.hostname,n=window.n,B=window.ABDULLAH_BOOKMARK_LOAD||'';
  
  const BLOCKED=[['aincradmods.com','Please open ads website first'],['facebook.com','Facebook is not supported'],['youtube.com','YouTube is not supported'],['instagram.com','Instagram is not supported'],['twitter.com','Twitter/X is not supported'],['reddit.com','Reddit is not supported'],['wikipedia.org','Wikipedia is not supported'],['stackoverflow.com','StackOverflow is not supported']];
  
  const SITES=[['tarviral.com','aincrad'],['rodaemotor.com','aincrad'],['vipteam.store','vipteam'],['powercheats.fun','powercheats'],['vplink.in','universal-vplink']];
  
  function X(){
    // Step 1: BLOCKLIST
    for(let i=0;i<BLOCKED.length;i++){if(U.includes(BLOCKED[i][0])){T.err('⛔ '+BLOCKED[i][1],5000,{ti:'Blocked',a:[{l:'Close',cb:()=>{}}]});return}}
    
    // Step 2: Manual engine string check (B = "aincrad","vipteam" etc)
    if(B&&B!=='0'&&B!==0&&typeof B==='string'&&B!=='Abdullah'){T.info(`📌 Manual engine: ${B}`,1500);F(0,B);return}
    
    // Step 3: ALLOWLIST check
    let engine='',site='';for(let i=0;i<SITES.length;i++){if(U.includes(SITES[i][0])){site=SITES[i][0];engine=SITES[i][1];break}}
    
    // Step 4: Evade mode (n="Abdullah" or B="Abdullah")
    if(n==='Abdullah'||B==='Abdullah'){
      T.info('👤 Evade app detected',2000);
      let abdEngine='abdullah';
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
  
  function F(v,eng){const u=`https://raw.githubusercontent.com/A2MBD3/Aincrad/main/dynamic-bypass-by-@a2mbd3.js?t=${Date.now()}&n=${v}&site=${eng}`;const lt=T.load('⏳ Loading...',0);fetch(u).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);T.r(lt);T.suc('✅ Loaded!',2500);return r.text()}).then(c=>{T.prog('⚡ Executing...',2000);setTimeout(()=>{try{eval(c);T.suc('🎉 Done!',3000)}catch(e){T.err('❌ '+e.message,5000)}},500)}).catch(e=>{T.r(lt);T.err('❌ '+e.message,5000,{a:[{l:'🔄 Retry',cb:()=>F(v,eng)}]})})}
  
  T.info('🚀 Nebula v3.6',1500);setTimeout(X,1600);window.T=T;
})();