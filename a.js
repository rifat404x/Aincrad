javascript:(function(){
  const T={c:null,i(){
    if(!this.c){this.c=document.createElement('div');this.c.id='nt';this.c.style.cssText='position:fixed;top:16px;right:16px;z-index:2147483647;display:flex;flex-direction:column;gap:10px;width:min(380px,calc(100vw-32px));pointer-events:none;font-family:system-ui,sans-serif';document.body.appendChild(this.c)}
    return this.c
  },s(m,t='info',d=3000,o={}){
    const c=this.i();const cl={success:'#4ade80',error:'#f87171',warning:'#fbbf24',info:'#60a5fa',progress:'#a78bfa',loading:'#67e8f9'};const co=cl[t]||cl.info;
    const to=document.createElement('div');
    // Neumorphic transparent theme
    to.style.cssText=`
      background:linear-gradient(145deg,rgba(255,255,255,.06),rgba(255,255,255,.02));
      backdrop-filter:blur(20px) saturate(180%);
      -webkit-backdrop-filter:blur(20px) saturate(180%);
      border:1px solid rgba(255,255,255,.1);
      border-radius:16px;
      padding:14px 16px;
      color:#e2e8f0;
      font-size:13px;
      line-height:1.4;
      box-shadow:8px 8px 16px rgba(0,0,0,.2),-1px -1px 2px rgba(255,255,255,.05),inset 1px 1px 1px rgba(255,255,255,.03);
      transform:translateX(120%);
      animation:ns .35s cubic-bezier(.16,1,.3,1) forwards;
      pointer-events:auto;
      display:flex;
      align-items:center;
      gap:10px;
      width:100%;
      position:relative;
      overflow:hidden;
    `;
    // Colored left accent
    const ac=document.createElement('div');ac.style.cssText=`position:absolute;left:0;top:0;bottom:0;width:3px;background:${co};border-radius:3px 0 0 3px;box-shadow:0 0 12px ${co}60`;
    to.appendChild(ac);
    // Message only (no icon, minimal)
    const ms=document.createElement('div');ms.textContent=m;ms.style.cssText='flex:1;word-break:break-word;font-weight:400;letter-spacing:.2px';
    to.appendChild(ms);
    // Close button
    const cb=document.createElement('button');cb.textContent='✕';cb.style.cssText='background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:#94a3b8;width:22px;height:22px;border-radius:50%;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0;transition:.2s;box-shadow:2px 2px 4px rgba(0,0,0,.2),inset -1px -1px 1px rgba(255,255,255,.02)';
    cb.onmouseover=()=>{cb.style.background='rgba(248,113,113,.2)';cb.style.color='#f87171';cb.style.borderColor='rgba(248,113,113,.3)'};
    cb.onmouseout=()=>{cb.style.background='rgba(255,255,255,.04)';cb.style.color='#94a3b8';cb.style.borderColor='rgba(255,255,255,.08)'};
    to.appendChild(cb);
    // Progress bar
    if(d>0){const pb=document.createElement('div');pb.style.cssText=`position:absolute;bottom:0;left:0;height:2px;background:linear-gradient(90deg,transparent,${co},transparent);width:100%;animation:pr ${d}ms linear forwards;border-radius:0 0 16px 16px`;to.appendChild(pb)}
    c.appendChild(to);
    let tid;if(d>0)tid=setTimeout(()=>this.r(to),d);
    const clr=()=>{clearTimeout(tid);this.r(to)};cb.onclick=e=>{e.stopPropagation();clr()};to.onclick=()=>clr();return to
  },r(to){
    if(!to||!to.parentNode)return;to.style.animation='no .25s ease forwards';setTimeout(()=>{if(to.parentNode)to.parentNode.removeChild(to)},250)
  },suc(m,d){return this.s(m,'success',d)},err(m,d){return this.s(m,'error',d)},warn(m,d){return this.s(m,'warning',d)},info(m,d){return this.s(m,'info',d)}};
  
  const st=document.createElement('style');st.textContent='@keyframes ns{from{transform:translateX(120%) scale(.9);opacity:0}to{transform:translateX(0) scale(1);opacity:1}}@keyframes no{to{transform:translateX(120%) scale(.9);opacity:0}}@keyframes pr{from{width:100%}to{width:0%}}@media(max-width:480px){#nt{right:8px;left:8px;width:auto}}';document.head.appendChild(st);
  
  const U=window.location.hostname,n=window.n,B=window.ABDULLAH_BOOKMARK_LOAD||'';
  
  const BLOCKED=[['aincradmods.com','Please open ads website first'],['facebook.com','Facebook blocked'],['youtube.com','YouTube blocked'],['instagram.com','Instagram blocked'],['twitter.com','Twitter/X blocked'],['reddit.com','Reddit blocked'],['wikipedia.org','Wikipedia blocked'],['stackoverflow.com','StackOverflow blocked']];
  
  const SITES=[['tarviral.com','aincrad'],['rodaemotor.com','aincrad'],['vipteam.store','vipteam'],['powercheats.fun','powercheats'],['vplink.in','universal-vplink']];
  
  function X(){
    for(let i=0;i<BLOCKED.length;i++){if(U.includes(BLOCKED[i][0])){T.err('⛔ '+BLOCKED[i][1],4000);return}}
    let engine='',site='';
    for(let i=0;i<SITES.length;i++){if(U.includes(SITES[i][0])){site=SITES[i][0];engine=SITES[i][1];break}}
    if(!engine){T.warn('⚠️ Unsupported site',3000);F(0,'default');return}
    if(n==='Abdullah'||B==='Abdullah'){if(U.includes('tarviral.com')||U.includes('rodaemotor.com'))B='aincrad';F(0,B||'abdullah');return}
    if(typeof n==='number'&&!isNaN(n)){F(n,engine);return}
    F(0,engine);
  }
  
  function F(v,eng){
    const u=`https://raw.githubusercontent.com/A2MBD3/Aincrad/main/dynamic-bypass-by-@a2mbd3.js?t=${Date.now()}&n=${v}&site=${eng}`;
    const lt=T.info('⏳ Loading...',0);
    fetch(u).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);T.r(lt);T.suc('✅ Done!',2000);return r.text()}).then(c=>{try{eval(c)}catch(e){T.err('❌ '+e.message,4000)}}).catch(e=>{T.r(lt);T.err('❌ '+e.message,4000)})
  }
  
  X();window.T=T;
})();