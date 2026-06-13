// ╔══════════════════════════════════════════════════════════╗
// ║  AUTHOR: Abdullah Al Mamun                             ║
// ║  GITHUB: @A2MBD3                                       ║
// ║  VERSION: 8.2.0 - NEBULA COSMIC                        ║
// ╚══════════════════════════════════════════════════════════╝


(function () {
  "use strict";

  if (typeof window.ABDULLAH_BOOKMARK_LOAD === "undefined") {
    console.log("%c[!] ACCESS DENIED [!]", "color:#f00;font-size:15px;font-weight:bold;background:#000;padding:5px;");
    return;
  }

  const CONFIG = {
    statusUrl: "https://raw.githubusercontent.com/A2MBD3/Aincrad/main/assets/status.txt",
    musicListUrl: "https://raw.githubusercontent.com/A2MBD3/Aincrad/main/assets/music.txt",
    redirectUrlFile: "https://zxi-file-loader.ah4734536.workers.dev/?file=zxi.txt",
    redirectUrl: "https://aincradmods.com/getkey?token=bdf6a84bee36403986fa9f7a7c36e75a",
    telegramUrl: "https://t.me/redguild",
    totalTime: 30000,
    initPanelTime: 3000,
  };

  let audioPlayer = null;
  let musicList = [];
  let currentTrackIndex = -1;
  let lastX = null, lastY = null, lastZ = null;
  let shakeTimeout = null;
  let updateTrackDisplay = function(){};

  // ── STATUS ──────────────────────────────────────────────
  async function checkStatus() {
    try {
      const r = await fetch(CONFIG.statusUrl + "?t=" + Date.now());
      return (await r.text()).trim() === "1";
    } catch { return false; }
  }

  // ── REDIRECT ─────────────────────────────────────────────
  async function fetchRedirectUrl() {
    try {
      const r = await fetch(CONFIG.redirectUrlFile + "?t=" + Date.now());
      const url = (await r.text()).trim();
      return (url && url.startsWith("http")) ? url : null;
    } catch { return null; }
  }

  // ── MUSIC ─────────────────────────────────────────────────
  async function fetchMusicList() {
    try {
      const r = await fetch(CONFIG.musicListUrl + "?t=" + Date.now());
      const text = await r.text();
      musicList = text.split('\n').map(l => l.trim()).filter(l => l.startsWith('http'));
      return musicList.length > 0;
    } catch { return false; }
  }

  function playTrack(index) {
    if (!musicList.length) return;
    currentTrackIndex = ((index % musicList.length) + musicList.length) % musicList.length;
    const url = musicList[currentTrackIndex];
    if (!audioPlayer) { audioPlayer = new Audio(); audioPlayer.volume = 0.35; }
    else audioPlayer.pause();
    audioPlayer.src = url;
    audioPlayer.loop = false;
    audioPlayer.play().catch(() => {});
    audioPlayer.onended = () => playTrack(currentTrackIndex + 1);
    updateTrackDisplay();
  }

  function initAudio() {
    if (!musicList.length) return;
    playTrack(Math.floor(Math.random() * musicList.length));
  }

  function nextTrack() {
    playTrack(currentTrackIndex + 1);
    const btn = document.getElementById("music-btn");
    if (btn) triggerRipple(btn, null, "#0ff");
  }

  // ── SHAKE ─────────────────────────────────────────────────
  function initShake() {
    if (!window.DeviceMotionEvent) return;
    window.addEventListener("devicemotion", (e) => {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      if (lastX === null) { lastX=a.x; lastY=a.y; lastZ=a.z; return; }
      const d = Math.abs(a.x-lastX)+Math.abs(a.y-lastY)+Math.abs(a.z-lastZ);
      if (d > 15 && !shakeTimeout) {
        shakeTimeout = setTimeout(() => shakeTimeout = null, 1000);
        nextTrack();
        showToast("📳 Next Track!");
      }
      lastX=a.x; lastY=a.y; lastZ=a.z;
    });
  }

  function showToast(msg) {
    const t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = `position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
      background:rgba(0,255,255,0.12);border:1px solid rgba(0,255,255,0.35);
      color:#0ff;padding:8px 22px;border-radius:20px;font-size:11px;
      font-family:'Orbitron',sans-serif;letter-spacing:2px;
      z-index:2147483647;backdrop-filter:blur(10px);pointer-events:none;
      animation:nb-fadein 0.3s ease;`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1500);
  }

  // ── RIPPLE ────────────────────────────────────────────────
  function triggerRipple(btn, ev, color="#0ff") {
    const r = document.createElement("span");
    const rect = btn.getBoundingClientRect();
    let x = rect.width/2, y = rect.height/2;
    if (ev && ev.touches) { x=ev.touches[0].clientX-rect.left; y=ev.touches[0].clientY-rect.top; }
    else if (ev) { x=ev.clientX-rect.left; y=ev.clientY-rect.top; }
    r.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:0;height:0;border-radius:50%;
      background:${color};opacity:0.35;transform:translate(-50%,-50%);
      animation:nb-ripple 0.55s ease-out forwards;pointer-events:none;`;
    btn.style.position="relative"; btn.style.overflow="hidden";
    btn.appendChild(r);
    setTimeout(() => r.remove(), 560);
  }

  function rippleOn(btn, color) {
    btn.addEventListener("click", e => triggerRipple(btn, e, color));
    btn.addEventListener("touchstart", e => triggerRipple(btn, e, color), {passive:true});
  }

  // ── GLITCH ────────────────────────────────────────────────
  function glitch(el, text) {
    const chars = "█▓▒░#@$%&!?ABCDEFGHIJKLMNabcdefghijklmn0123456789";
    let iter = 0;
    const iv = setInterval(() => {
      el.textContent = text.split("").map((c,i) => {
        if (i < iter) return text[i];
        if (c === " ") return " ";
        return chars[Math.floor(Math.random()*chars.length)];
      }).join("");
      if (iter >= text.length) { el.textContent = text; clearInterval(iv); setTimeout(()=>glitch(el,text), 4500); }
      iter += 0.35;
    }, 38);
  }

  // ── LOGS ──────────────────────────────────────────────────
  // Real-looking log format: [TIMESTAMP] [LEVEL] MODULE » message
  function generateLogs() {
    const rh  = n => [...Array(n)].map(()=>Math.floor(Math.random()*16).toString(16)).join("").toUpperCase();
    const ri  = () => [1,2,3,4].map(()=>Math.floor(Math.random()*256)).join(".");
    const rp  = () => [22,80,443,3306,8080,8443,9090,3000,27017][Math.floor(Math.random()*9)];
    const ts  = () => { const d=new Date(); return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}.${String(d.getMilliseconds()).padStart(3,'0')}`; };
    const pid = Math.floor(Math.random()*29000+1000);
    const sid = rh(8);
    const tgt = `aincrad-node-${Math.floor(Math.random()*9+1)}.prime.cluster`;

    return [
      { t:`[${ts()}] [BOOT]  nebula    » Initializing NEBULA v8.2.0 (pid=${pid})`,          c:"#4df" },
      { t:`[${ts()}] [INFO]  loader    » Session-ID: 0x${sid}`,                              c:"#4df" },
      { t:`[${ts()}] [INFO]  loader    » Entropy pool seeded — ${rh(16)}`,                   c:"#4df" },
      { t:`[${ts()}] [INFO]  net       » Resolving target: ${tgt}`,                          c:"#8cf" },
      { t:`[${ts()}] [INFO]  net       » DNS A record → ${ri()}  TTL=60`,                    c:"#8cf" },
      { t:`[${ts()}] [SCAN]  nmap      » TCP SYN scan ${ri()}/24 — ports 1–65535`,           c:"#0ff" },
      { t:`[${ts()}] [SCAN]  nmap      » ${rp()} open   tcp  ssl/https`,                     c:"#0ff" },
      { t:`[${ts()}] [SCAN]  nmap      » ${rp()} open   tcp  mysql`,                         c:"#0ff" },
      { t:`[${ts()}] [WARN]  vuln      » CVE-2024-${Math.floor(Math.random()*9000+1000)} detected — CVSS 9.8 CRITICAL`, c:"#fa0" },
      { t:`[${ts()}] [WARN]  vuln      » Unpatched kernel: Linux 5.4.0-${Math.floor(Math.random()*200+100)}-generic`, c:"#fa0" },
      { t:`[${ts()}] [EXPL]  stage1    » Sending exploit payload (${Math.floor(Math.random()*8+2)}KB shellcode)`, c:"#f60" },
      { t:`[${ts()}] [EXPL]  stage1    » Stack pivot @ 0x${rh(12)} — SUCCESS`,               c:"#0f8" },
      { t:`[${ts()}] [EXPL]  stage2    » ROP chain built: ${Math.floor(Math.random()*30+15)} gadgets`, c:"#f60" },
      { t:`[${ts()}] [EXPL]  stage2    » libc base: 0x${rh(12)}  offset: +0x${rh(4)}`,       c:"#0f8" },
      { t:`[${ts()}] [AUTH]  ssh       » Initiating brute-force on root@${ri()}:22`,          c:"#4df" },
      { t:`[${ts()}] [AUTH]  ssh       » Credential match — root:${rh(10)}  attempt #${Math.floor(Math.random()*200+50)}`, c:"#0f8" },
      { t:`[${ts()}] [PRIV]  escalate  » uid=1000 → uid=0 (CVE-2024-1086)`,                  c:"#f06" },
      { t:`[${ts()}] [PRIV]  escalate  » euid=0(root) egid=0(root) groups=0(root)`,           c:"#f06" },
      { t:`[${ts()}] [TLS]   handshake » Client Hello — TLS 1.3 — ${rh(32)}`,                c:"#4df" },
      { t:`[${ts()}] [TLS]   handshake » Cipher: AES-256-GCM-SHA384  PFS: X25519`,            c:"#4df" },
      { t:`[${ts()}] [DB]    mysql     » Connected to aincrad_production@${ri()}:3306`,        c:"#8cf" },
      { t:`[${ts()}] [DB]    mysql     » SHOW TABLES → 47 tables found`,                      c:"#8cf" },
      { t:`[${ts()}] [DB]    inject    » UNION SELECT * FROM license_keys LIMIT 0,9999`,       c:"#fa0" },
      { t:`[${ts()}] [DB]    inject    » Extracted ${Math.floor(Math.random()*5000+800)} rows — ${Math.floor(Math.random()*40+10)}MB`, c:"#0f8" },
      { t:`[${ts()}] [MEM]   dump      » /proc/${pid}/mem → 0x${rh(16)} – 0x${rh(16)}`,       c:"#4df" },
      { t:`[${ts()}] [MEM]   dump      » AES-256 key recovered: ${rh(32)}`,                   c:"#0f8" },
      { t:`[${ts()}] [EVADE] ids       » Fragmented packets — Snort rule #${Math.floor(Math.random()*99999)} bypassed`, c:"#f60" },
      { t:`[${ts()}] [EVADE] log       » Truncating /var/log/auth.log … done`,                c:"#888" },
      { t:`[${ts()}] [EVADE] log       » Patching utmp/wtmp entries … done`,                  c:"#888" },
      { t:`[${ts()}] [C2]    beacon    » POST https://${ri()}/api/hb  interval=3s`,            c:"#4df" },
      { t:`[${ts()}] [C2]    beacon    » ACK received — operator online`,                      c:"#0f8" },
      { t:`[${ts()}] [DONE]  nebula    » All stages complete — session 0x${sid} active`,       c:"#0f8" },
      { t:`[${ts()}] [DONE]  nebula    » ⬡ AINCRAD FULLY COMPROMISED`,                        c:"#f06" },
      { t:`[${ts()}] [INFO]  redirect  » Launching secure portal…`,                           c:"#4df" },
    ];
  }

  // ── TYPEWRITER ────────────────────────────────────────────
  function typewriterLogs(logs, container, onDone) {
    let idx = 0;
    const budget = CONFIG.totalTime - CONFIG.initPanelTime - 800;
    const perLog = Math.floor(budget / logs.length);

    function next() {
      if (idx >= logs.length) { onDone(); return; }
      const log = logs[idx++];

      // prefix badge
      const wrap = document.createElement("div");
      wrap.style.cssText = `display:flex;align-items:flex-start;gap:6px;margin-bottom:3px;
        animation:nb-fadein 0.2s ease;`;

      const badge = document.createElement("span");
      // color badge based on level keyword
      let bc = "#4df";
      if (log.t.includes("[WARN]")||log.t.includes("[EVADE]")) bc="#fa0";
      else if (log.t.includes("[EXPL]")||log.t.includes("[PRIV]")||log.t.includes("[DONE]")) bc="#f06";
      else if (log.t.includes("[AUTH]")||log.t.includes("[DB]")) bc="#a0f";
      else if (log.t.includes("[SCAN]")) bc="#0ff";
      badge.style.cssText = `min-width:4px;height:auto;align-self:stretch;
        background:${bc};border-radius:2px;flex-shrink:0;opacity:0.8;`;
      wrap.appendChild(badge);

      const line = document.createElement("span");
      line.style.cssText = `color:${log.c};font-size:clamp(8px,1.8vw,10.5px);
        font-family:'Courier New',monospace;letter-spacing:0.3px;line-height:1.5;
        word-break:break-all;`;
      wrap.appendChild(line);
      container.appendChild(wrap);
      container.scrollTop = container.scrollHeight;

      let ci = 0;
      const text = log.t;
      const spd = Math.max(Math.floor((perLog * 0.55) / text.length), 14);
      const iv = setInterval(() => {
        line.textContent = text.slice(0, ++ci);
        if (ci >= text.length) {
          clearInterval(iv);
          container.scrollTop = container.scrollHeight;
          setTimeout(next, perLog * 0.45);
        }
      }, spd);
    }
    next();
  }

  // ── PARTICLES ────────────────────────────────────────────
  function createParticles() {
    const wrap = document.createElement("div");
    wrap.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483644;";
    const n = window.innerWidth < 600 ? 28 : 50;
    const cols = ["#00ffff","#ff0066","#ff9900","#00ff88","#6600ff","#ff00ff","#ffffff"];
    for (let i=0;i<n;i++) {
      const p = document.createElement("div");
      const s = Math.random()*2.5+0.8, c = cols[Math.floor(Math.random()*cols.length)];
      p.style.cssText = `position:absolute;width:${s}px;height:${s}px;background:${c};border-radius:50%;
        left:${Math.random()*100}%;top:${Math.random()*100}%;
        box-shadow:0 0 ${s*5}px ${c},0 0 ${s*10}px ${c}44;
        animation:nb-orbit${i%3} ${Math.random()*18+10}s linear infinite;
        animation-delay:${Math.random()*10}s;opacity:${Math.random()*0.55+0.15};`;
      wrap.appendChild(p);
    }
    document.body.appendChild(wrap);
  }

  function createGrid() {
    const g = document.createElement("div");
    const sz = window.innerWidth < 600 ? 36 : 55;
    g.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483643;
      background-image:url("data:image/svg+xml,%3Csvg width='55' height='55' viewBox='0 0 55 55' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='27.5' cy='27.5' r='0.8' fill='%2300ffff' opacity='0.12'/%3E%3C/svg%3E");
      background-size:${sz}px ${sz}px;animation:nb-pulse 9s ease-in-out infinite;`;
    document.body.appendChild(g);
  }

  // ── OUTDATED ──────────────────────────────────────────────
  function showOutdated() {
    const o = document.createElement("div");
    o.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:2147483647;
      display:flex;align-items:center;justify-content:center;font-family:'Orbitron',sans-serif;padding:20px;`;
    o.innerHTML = `<div style="text-align:center;background:rgba(10,5,30,0.9);
        padding:clamp(25px,5vw,35px) clamp(20px,4vw,30px);
        border:1px solid rgba(255,0,100,0.3);border-radius:20px;width:min(380px,90vw);
        box-shadow:0 0 80px rgba(255,0,100,0.12);">
      <div style="font-size:55px;margin-bottom:14px;">⚠</div>
      <h3 style="margin:0 0 8px;background:linear-gradient(90deg,#ff0066,#ff6600);
        -webkit-background-clip:text;-webkit-text-fill-color:transparent;
        font-size:clamp(15px,4vw,19px);font-weight:800;letter-spacing:4px;">NEBULA OUTDATED</h3>
      <p style="color:#8899aa;font-size:11px;margin-bottom:18px;">SIGNATURE_MISMATCH</p>
      <button id="upd-btn" style="width:100%;background:rgba(255,0,100,0.08);color:#ff0066;
        border:1px solid rgba(255,0,100,0.35);padding:13px;border-radius:12px;font-weight:700;
        cursor:pointer;font-family:'Orbitron',sans-serif;font-size:12px;letter-spacing:3px;">
        ⬇ DOWNLOAD LATEST</button>
    </div>`;
    document.body.appendChild(o);
    document.getElementById("upd-btn").addEventListener("click", () => window.open(CONFIG.telegramUrl,"_blank"));
  }

  // ── PROGRESS ──────────────────────────────────────────────
  function startProgress(el, ms) {
    const t0 = Date.now();
    const tick = () => {
      const pct = Math.min((Date.now()-t0)/ms*100, 100);
      el.style.width = pct + "%";
      if (pct < 100) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ════════════════════════════════════════════════════════
  //  MAIN
  // ════════════════════════════════════════════════════════
  (async () => {
    const active = await checkStatus();
    if (!active) { showOutdated(); return; }

    const musicLoaded = await fetchMusicList();
    createParticles();
    createGrid();

    document.getElementById("nebula-auth")?.remove();

    // ── STYLES ──
    const st = document.createElement("style");
    st.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
      @keyframes nb-orbit0{0%{transform:translate(0,0)scale(1)}25%{transform:translate(55px,-75px)scale(1.4)}50%{transform:translate(-35px,-150px)scale(0.7)}100%{transform:translate(0,0)scale(1)}}
      @keyframes nb-orbit1{0%{transform:translate(0,0)scale(1)}33%{transform:translate(-45px,-95px)scale(0.65)}66%{transform:translate(65px,-55px)scale(1.25)}100%{transform:translate(0,0)scale(1)}}
      @keyframes nb-orbit2{0%{transform:translate(0,0)scale(1)}50%{transform:translate(85px,-110px)scale(0.45)}100%{transform:translate(0,0)scale(1)}}
      @keyframes nb-pulse{0%,100%{opacity:0.4}50%{opacity:0.9}}
      @keyframes nb-border{
        0%,100%{border-color:rgba(0,255,255,0.3);box-shadow:0 0 40px rgba(0,255,255,0.08),inset 0 0 40px rgba(0,0,0,0.5)}
        25%{border-color:rgba(255,0,255,0.4);box-shadow:0 0 55px rgba(255,0,255,0.12),inset 0 0 50px rgba(0,0,0,0.6)}
        50%{border-color:rgba(102,0,255,0.4);box-shadow:0 0 55px rgba(102,0,255,0.12),inset 0 0 50px rgba(0,0,0,0.6)}
        75%{border-color:rgba(255,0,100,0.4);box-shadow:0 0 55px rgba(255,0,100,0.12),inset 0 0 50px rgba(0,0,0,0.6)}}
      @keyframes nb-float{0%,100%{transform:translate(-50%,-50%)translateY(0)}50%{transform:translate(-50%,-50%)translateY(-7px)}}
      @keyframes nb-scan{0%{top:-100%}100%{top:100%}}
      @keyframes nb-ripple{0%{width:0;height:0;opacity:0.35}100%{width:220px;height:220px;opacity:0}}
      @keyframes nb-fadein{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:none}}
      @keyframes nb-glow-name{
        0%,100%{text-shadow:0 0 6px #0ff,0 0 14px #0ff,0 0 28px #0ff44;letter-spacing:3px;}
        33%{text-shadow:0 0 8px #f0f,0 0 20px #f0f,0 0 40px #f0f66;letter-spacing:4px;}
        66%{text-shadow:0 0 8px #60f,0 0 20px #60f,0 0 40px #60f66;letter-spacing:4px;}}
      @keyframes nb-glitch{
        0%,88%,100%{clip-path:none;transform:none}
        89%{clip-path:polygon(0 18%,100% 18%,100% 38%,0 38%);transform:translate(-3px,1px)}
        91%{clip-path:polygon(0 58%,100% 58%,100% 78%,0 78%);transform:translate(3px,-1px)}
        93%{clip-path:none;transform:none}}
    `;
    document.head.appendChild(st);

    // ── INIT PANEL ──
    const box = document.createElement("div");
    box.id = "nebula-auth";
    box.style.cssText = `
      position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
      background:linear-gradient(155deg,rgba(4,2,18,0.97),rgba(8,4,26,0.97));
      backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);
      color:#fff;padding:clamp(18px,4vw,26px) clamp(16px,3.5vw,24px);
      border-radius:20px;z-index:2147483647;
      font-family:'Orbitron',sans-serif;
      text-align:center;width:min(370px,92vw);box-sizing:border-box;
      border:1.5px solid rgba(0,255,255,0.3);
      animation:nb-border 6s ease-in-out infinite,nb-float 8s ease-in-out infinite;
      overflow:hidden;`;

    box.innerHTML = `
      <!-- scan line -->
      <div style="position:absolute;top:0;left:0;width:100%;height:2.5px;
        background:linear-gradient(90deg,transparent,#0ff,#f0f,#60f,transparent);
        animation:nb-scan 2.8s linear infinite;pointer-events:none;opacity:0.65;"></div>

      <!-- progress bar -->
      <div style="position:absolute;bottom:0;left:0;height:2.5px;width:0%;
        background:linear-gradient(90deg,#0ff,#f0f,#60f);border-radius:0 0 0 20px;"
        id="nb-prog"></div>

      <div style="position:relative;z-index:1;">
        <!-- music btn -->
        <button id="music-btn" style="position:absolute;top:-2px;right:-2px;
          background:rgba(0,255,255,0.06);border:1px solid rgba(0,255,255,0.22);
          color:#0ff;border-radius:50%;width:34px;height:34px;
          cursor:pointer;font-size:13px;display:flex;align-items:center;
          justify-content:center;backdrop-filter:blur(12px);transition:all 0.3s;z-index:10;">♪</button>

        <div style="font-size:8px;color:#0ff;letter-spacing:6px;opacity:0.6;margin-bottom:6px;">
          NEBULA.DIRECT</div>

        <!-- GLITCH TITLE -->
        <h3 id="nb-title" style="margin:0 0 3px;
          background:linear-gradient(90deg,#0ff,#f0f,#60f,#f06);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
          font-size:clamp(22px,5.5vw,28px);font-weight:900;letter-spacing:4px;
          animation:nb-glitch 5.5s infinite;">A2MBD3</h3>

        <div style="width:46px;height:1.5px;
          background:linear-gradient(90deg,transparent,#f0f,transparent);
          margin:8px auto 6px;"></div>

        <p style="margin:0 0 3px;color:#0ff;font-size:10px;letter-spacing:4px;">◆ SYSTEM READY</p>

        <!-- track name -->
        <div id="track-name" style="color:#555;font-size:7.5px;letter-spacing:0.8px;
          min-height:11px;margin-bottom:14px;"></div>

        <!-- INITIATE -->
        <button id="init-btn" style="
          width:100%;background:linear-gradient(90deg,rgba(0,255,255,0.08),rgba(255,0,255,0.08),rgba(102,0,255,0.08));
          color:#fff;border:1.5px solid rgba(0,255,255,0.38);padding:13px;
          border-radius:12px;font-weight:700;cursor:pointer;
          font-family:'Orbitron',sans-serif;font-size:12px;
          letter-spacing:4px;margin-bottom:9px;
          backdrop-filter:blur(12px);transition:all 0.3s;">⬡ INITIATE NEBULA</button>

        <!-- TELEGRAM -->
        <button id="supp-btn" style="
          width:100%;background:rgba(255,0,255,0.04);color:#8899aa;
          border:1.5px solid rgba(255,0,255,0.18);padding:13px;
          border-radius:12px;font-weight:600;cursor:pointer;
          font-family:'Orbitron',sans-serif;font-size:12px;
          letter-spacing:4px;backdrop-filter:blur(12px);transition:all 0.3s;">⚡ Telegram</button>

        <!-- GLOWING AUTHOR NAME -->
        <div style="margin-top:12px;">
          <span id="nb-author" style="
            font-size:9px;font-family:'Orbitron',sans-serif;font-weight:700;
            letter-spacing:3px;color:#0ff;
            animation:nb-glow-name 4s ease-in-out infinite;
            text-transform:uppercase;">Abdullah Al Mamun</span>
          <div style="font-size:6.5px;color:#333;margin-top:3px;letter-spacing:1px;">
            @A2MBD3 &nbsp;·&nbsp; 📳 Shake = Next Track</div>
        </div>
      </div>`;

    document.body.appendChild(box);

    // glitch on title
    setTimeout(() => glitch(document.getElementById("nb-title"), "A2MBD3"), 900);

    // progress
    startProgress(document.getElementById("nb-prog"), CONFIG.totalTime);

    // music
    updateTrackDisplay = () => {
      const el = document.getElementById("track-name");
      if (!el || !musicList.length) return;
      try {
        const name = decodeURIComponent(musicList[currentTrackIndex].split('/').pop().replace(/\.[^.]+$/,'').replace(/[-_]/g,' '));
        el.textContent = "♫ " + (name.length > 24 ? name.slice(0,24)+"…" : name);
      } catch { el.textContent = "♫ Track "+(currentTrackIndex+1); }
    };

    if (musicLoaded) initAudio();
    initShake();

    // music btn
    const mBtn = document.getElementById("music-btn");
    rippleOn(mBtn, "#0ff");
    mBtn.addEventListener("click", () => {
      if (!audioPlayer) { initAudio(); mBtn.textContent="♪"; mBtn.style.color="#0ff"; return; }
      if (audioPlayer.paused) { audioPlayer.play().catch(()=>{}); mBtn.textContent="♪"; mBtn.style.color="#0ff"; }
      else { audioPlayer.pause(); mBtn.textContent="✕"; mBtn.style.color="#f06"; }
    });

    const sBtn = document.getElementById("supp-btn");
    rippleOn(sBtn, "#f0f");
    sBtn.addEventListener("click", () => window.open(CONFIG.telegramUrl,"_blank"));

    const iBtn = document.getElementById("init-btn");
    rippleOn(iBtn, "#0ff");

    // ── INITIATE ──
    iBtn.addEventListener("click", async () => {
      iBtn.disabled = sBtn.disabled = true;
      iBtn.textContent = "◆ INITIALIZING...";
      iBtn.style.opacity = "0.65";

      setTimeout(() => {
        box.style.transition = "all 0.45s ease";
        box.style.transform = "translate(-50%,-50%) scale(0.88)";
        box.style.opacity = "0";

        setTimeout(async () => {
          box.remove();

          // ── EXPLOIT PANEL ──
          const xbox = document.createElement("div");
          xbox.id = "nebula-exploit";
          xbox.style.cssText = `
            position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
            width:min(470px,95vw);max-height:82vh;
            background:linear-gradient(155deg,rgba(4,2,18,0.98),rgba(8,4,26,0.98));
            backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);
            border:1.5px solid rgba(0,255,255,0.28);border-radius:18px;
            z-index:2147483647;padding:clamp(14px,3vw,20px);box-sizing:border-box;
            box-shadow:0 0 70px rgba(0,255,255,0.1),0 0 160px rgba(255,0,255,0.06);
            animation:nb-border 6s ease-in-out infinite;overflow:hidden;`;

          xbox.innerHTML = `
            <div style="position:absolute;top:0;left:0;width:100%;height:2px;
              background:linear-gradient(90deg,transparent,#0ff,#f0f,#60f,transparent);
              animation:nb-scan 2s linear infinite;pointer-events:none;opacity:0.6;"></div>
            <div id="xprog" style="position:absolute;bottom:0;left:0;height:2.5px;width:0%;
              background:linear-gradient(90deg,#0ff,#f0f,#60f);border-radius:0 0 0 18px;"></div>

            <!-- header -->
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
              <div>
                <div style="font-size:7.5px;color:#f60;letter-spacing:4px;margin-bottom:3px;">NEBULA EXPLOIT ENGINE</div>
                <div id="xtitle" style="font-size:clamp(13px,3.5vw,17px);font-weight:900;letter-spacing:2px;
                  background:linear-gradient(90deg,#0ff,#f06);
                  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                  animation:nb-glitch 4s infinite;">RUNNING...</div>
              </div>
              <div style="text-align:right;">
                <div id="xtrack" style="color:#444;font-size:7px;font-family:'Orbitron',sans-serif;max-width:110px;"></div>
                <div style="font-size:6px;color:#333;margin-top:3px;letter-spacing:1px;">
                  <span id="nb-author2" style="color:#0ff8;animation:nb-glow-name 4s ease-in-out infinite;
                    font-family:'Orbitron',sans-serif;font-weight:700;">Abdullah Al Mamun</span>
                </div>
              </div>
            </div>

            <!-- terminal window chrome -->
            <div style="background:rgba(0,0,0,0.5);border:1px solid rgba(0,255,255,0.1);
              border-radius:8px;padding:10px 10px 8px;margin-bottom:0;">
              <div style="display:flex;gap:5px;margin-bottom:8px;">
                <div style="width:8px;height:8px;border-radius:50%;background:#f06;opacity:0.7;"></div>
                <div style="width:8px;height:8px;border-radius:50%;background:#fa0;opacity:0.7;"></div>
                <div style="width:8px;height:8px;border-radius:50%;background:#0f8;opacity:0.7;"></div>
                <span style="font-size:7px;color:#333;margin-left:4px;font-family:monospace;">nebula@aincrad ~ exploit.sh</span>
              </div>
              <div id="log-container" style="overflow-y:auto;max-height:calc(82vh - 130px);
                scrollbar-width:none;-ms-overflow-style:none;"></div>
            </div>`;

          document.body.appendChild(xbox);

          // update author2 glow too
          updateTrackDisplay = () => {
            ["track-name","xtrack"].forEach(id => {
              const el = document.getElementById(id);
              if (!el || !musicList.length) return;
              try {
                const name = decodeURIComponent(musicList[currentTrackIndex].split('/').pop().replace(/\.[^.]+$/,'').replace(/[-_]/g,' '));
                el.textContent = "♫ "+(name.length>20?name.slice(0,20)+"…":name);
              } catch { el.textContent = "♫ Track "+(currentTrackIndex+1); }
            });
          };
          updateTrackDisplay();

          startProgress(document.getElementById("xprog"), CONFIG.totalTime - CONFIG.initPanelTime - 500);
          setTimeout(() => glitch(document.getElementById("xtitle"), "RUNNING..."), 200);

          const redirectP = fetchRedirectUrl();
          typewriterLogs(generateLogs(), document.getElementById("log-container"), async () => {
            const url = await redirectP;
            window.location.href = url || CONFIG.redirectUrl;
          });

        }, 480);
      }, CONFIG.initPanelTime);
    });

  })();
})();
