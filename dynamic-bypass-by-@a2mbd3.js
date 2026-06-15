// ╔══════════════════════════════════════════════════════════╗
// ║  AUTHOR: Abdullah Al Mamun                             ║
// ║  GITHUB: @A2MBD3                                       ║
// ║  VERSION: 9.0.0 - NEBULA DYNAMIC                       ║
// ║  CREDITS: Abdullah Al Mamun (@A2MBD3)                  ║
// ╚══════════════════════════════════════════════════════════╝

(function () {
  "use strict";

  if (typeof window.ABDULLAH_BOOKMARK_LOAD === "undefined") {
    console.log("%c[!] ACCESS DENIED [!]", "color:#f00;font-size:15px;font-weight:bold;background:#000;padding:5px;");
    return;
  }

  const USER_ID = parseInt(window.ABDULLAH_BOOKMARK_LOAD) || 0;

  // ═══════════════════════════════════════════════
  // DEFAULT CONFIG (Fallback)
  // ═══════════════════════════════════════════════
  let CONFIG = {
    status: 1,
    musicListUrl: "https://raw.githubusercontent.com/A2MBD3/Aincrad/main/assets/music.txt",
    redirectUrlFile: "https://zxi-file-loader.ah4734536.workers.dev?file=zxi.txt&key=Zxiowner&user=0&t=1781429403212",
    redirectUrlPrefix: "https://aincradmods.com",
    fallbackRedirectUrl: "https://htmlpreview.github.io/?https://raw.githubusercontent.com/A2MBD3/Aincrad/main/index.html",
    initProgressTime: 10000,
    exploitProgressTime: 20000,
    autoInitDelay: 10000,
  };

  let USER_DATA = { id: USER_ID, name: "Nebula User", tgChannel: "0", password: "0", banned: 0 };

  let audioPlayer = null;
  let musicList = [];
  let currentTrackIndex = -1;
  let lastX = null, lastY = null, lastZ = null;
  let shakeTimeout = null;
  let updateTrackDisplay = function () { };
  let autoInitTimeout = null;
  let banRedirectTimeout = null;
  let isRedirecting = false;
  let initProgressActive = false;
  let exploitProgressActive = false;
  let initProgressRAF = null;
  let exploitProgressRAF = null;
  let logTimers = [];
  let redirectUrlCache = null;
  let isBanned = false;

  // ═══════════════════════════════════════════════
  // FETCH CONFIG FROM data.json
  // ═══════════════════════════════════════════════
  async function fetchConfig() {
    try {
      const r = await fetch("https://raw.githubusercontent.com/A2MBD3/Aincrad/main/asset/data-dynamic.json?t=" + Date.now());
      if (!r.ok) return;
      const j = await r.json();
      CONFIG.status = j.status ?? CONFIG.status;
      CONFIG.musicListUrl = j.musicListUrl || CONFIG.musicListUrl;
      CONFIG.redirectUrlFile = j.redirectUrlFile || CONFIG.redirectUrlFile;
      CONFIG.redirectUrlPrefix = j.redirectUrlPrefix || CONFIG.redirectUrlPrefix;
      CONFIG.fallbackRedirectUrl = j.fallbackRedirectUrl || CONFIG.fallbackRedirectUrl;
      if (j.timing) {
        CONFIG.initProgressTime = j.timing.initProgressTime || CONFIG.initProgressTime;
        CONFIG.exploitProgressTime = j.timing.exploitProgressTime || CONFIG.exploitProgressTime;
        CONFIG.autoInitDelay = j.timing.autoInitDelay || CONFIG.autoInitDelay;
      }
    } catch (e) {}
  }

  // ═══════════════════════════════════════════════
  // FETCH USERS FROM users.json
  // ═══════════════════════════════════════════════
  async function fetchUsers() {
    try {
      const r = await fetch("https://raw.githubusercontent.com/A2MBD3/Aincrad/main/asset/users.json?t=" + Date.now());
      if (!r.ok) return;
      const j = await r.json();
      if (j.users && Array.isArray(j.users)) {
        const u = j.users.find(x => x.id === USER_ID);
        if (u) USER_DATA = u;
      }
    } catch (e) {}
  }

  function isBannedUser() { return USER_DATA.banned === 1 || USER_DATA.banned === "1"; }
  function needPassword() { return USER_DATA.password !== "0" && USER_DATA.password !== 0 && USER_DATA.password !== ""; }
  function hasChannel() { return USER_DATA.tgChannel !== "0" && USER_DATA.tgChannel !== 0 && USER_DATA.tgChannel !== ""; }
  function getChannelUrl() {
    const c = USER_DATA.tgChannel;
    if (!c || c === "0") return null;
    return c.startsWith("http") ? c : "https://" + c;
  }

  // ── REDIRECT FETCH ─────────────────────────────────────
  async function fetchRedirectUrl() {
    try {
      const c = new AbortController();
      const t = setTimeout(() => c.abort(), 5000);
      const r = await fetch(CONFIG.redirectUrlFile, { signal: c.signal });
      clearTimeout(t);
      if (!r.ok) return null;
      const url = (await r.text()).trim();
      return (url && url.startsWith(CONFIG.redirectUrlPrefix)) ? url : null;
    } catch { return null; }
  }

  // ── MUSIC ──────────────────────────────────────────────
  async function fetchMusicList() {
    try {
      const r = await fetch(CONFIG.musicListUrl + "?t=" + Date.now());
      const t = await r.text();
      musicList = t.split('\n').map(l => l.trim()).filter(l => l.startsWith('http'));
      return musicList.length > 0;
    } catch { return false; }
  }

  function getRandomMusic() {
    if (!musicList.length) return null;
    let i;
    if (musicList.length === 1) i = 0;
    else { do { i = Math.floor(Math.random() * musicList.length); } while (i === currentTrackIndex && musicList.length > 1); }
    currentTrackIndex = i;
    return musicList[i];
  }

  function initAudio() {
    const url = getRandomMusic();
    if (!url) return;
    if (audioPlayer) { try { audioPlayer.pause(); audioPlayer.onended = null; audioPlayer.onerror = null; } catch (e) {} }
    audioPlayer = new Audio(url);
    audioPlayer.loop = false;
    audioPlayer.volume = 0.35;
    audioPlayer.preload = "auto";
    audioPlayer.onended = () => nextTrackAuto();
    audioPlayer.onerror = () => {
      if (musicList[currentTrackIndex]) musicList.splice(currentTrackIndex, 1);
      setTimeout(() => { if (musicList.length && !isRedirecting) nextTrackAuto(); }, 500);
    };
    audioPlayer.play().catch(() => {});
    updateTrackDisplay();
  }

  function nextTrackAuto() {
    if (!musicList.length) return;
    const url = getRandomMusic();
    if (!url) return;
    if (audioPlayer) { try { audioPlayer.pause(); } catch (e) {} }
    audioPlayer.src = url;
    audioPlayer.load();
    audioPlayer.play().catch(() => {});
    updateTrackDisplay();
  }

  function nextTrackManual() { nextTrackAuto(); showToast("📳 Next Track!"); }

  // ── SHAKE ──────────────────────────────────────────────
  function initShake() {
    if (!window.DeviceMotionEvent) return;
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission().then(p => { if (p === "granted") addShakeListener(); }).catch(() => {});
    } else addShakeListener();
  }

  function addShakeListener() {
    window.addEventListener("devicemotion", (e) => {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      if (lastX === null) { lastX = a.x; lastY = a.y; lastZ = a.z; return; }
      if (Math.abs(a.x - lastX) + Math.abs(a.y - lastY) + Math.abs(a.z - lastZ) > 15 && !shakeTimeout) {
        shakeTimeout = setTimeout(() => shakeTimeout = null, 1000);
        nextTrackManual();
      }
      lastX = a.x; lastY = a.y; lastZ = a.z;
    });
  }

  // ── TOAST ──────────────────────────────────────────────
  function showToast(msg) {
    const t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = `position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:2147483647;background:rgba(0,255,255,0.08);border:1px solid rgba(0,255,255,0.3);color:#0ff;padding:8px 22px;border-radius:20px;font-size:11px;font-family:'Orbitron',sans-serif;letter-spacing:2px;pointer-events:none;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);animation:nb-toast-in 0.3s ease;`;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity 0.3s"; setTimeout(() => t.remove(), 300); }, 1500);
  }

  // ── PARTICLES + GRID ───────────────────────────────────
  function createParticles() {
    const c = document.createElement("div");
    c.id = "nebula-particles";
    c.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483646;";
    const n = window.innerWidth < 600 ? 30 : 50;
    const cols = ["#00ffff","#ff0066","#ff9900","#00ff88","#6600ff","#ff00ff"];
    for (let i = 0; i < n; i++) {
      const p = document.createElement("div"), s = Math.random() * 3 + 1, col = cols[Math.floor(Math.random() * cols.length)];
      p.style.cssText = `position:absolute;width:${s}px;height:${s}px;background:${col};border-radius:50%;left:${Math.random()*100}%;top:${Math.random()*100}%;box-shadow:0 0 ${s*6}px ${col},0 0 ${s*12}px ${col};animation:nebula-orbit${i%3} ${Math.random()*15+10}s linear infinite;animation-delay:${Math.random()*8}s;opacity:${Math.random()*0.6+0.2};`;
      c.appendChild(p);
    }
    document.body.appendChild(c);
  }

  function createDotGrid() {
    const g = document.createElement("div");
    g.id = "nebula-grid";
    const s = window.innerWidth < 600 ? 40 : 60;
    g.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483645;background-image:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1' fill='%2300ffff' opacity='0.2'/%3E%3C/svg%3E");background-size:${s}px ${s}px;animation:nebula-pulse 8s ease-in-out infinite;`;
    document.body.appendChild(g);
  }

  // ── LOGS ───────────────────────────────────────────────
  function generateLogs() {
    const rh = l => [...Array(l)].map(() => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
    const ri = () => [1,2,3,4].map(() => Math.floor(Math.random()*256)).join('.');
    const rp = () => [22,80,443,3306,8080,8443,9090,3000,27017][Math.floor(Math.random()*9)];
    const pt = ["SSH","HTTPS","MySQL","MongoDB","Redis","FTP","SMTP","DNS"];
    return [
      { t: "⚡ NEBULA v9.0.0 — User: " + USER_DATA.name, c: "#0ff" },
      { t: "⚡ QUANTUM MODULES: [0x" + rh(8) + "]", c: "#0ff" },
      { t: "🎯 TARGET: aincrad.prime.server:443", c: "#f90" },
      { t: "🔍 SCAN: " + ri() + "/24", c: "#0ff" },
      { t: "⚠ PORT " + rp() + " OPEN - " + pt[Math.floor(Math.random()*8)], c: "#f90" },
      { t: "⚠ CVE-2024-" + Math.floor(Math.random()*9000+1000) + " — CVSS 9.8", c: "#f60" },
      { t: "🔑 SSH BRUTE: root@" + ri(), c: "#0ff" },
      { t: "✓ CREDENTIALS: root:" + rh(12), c: "#0f8" },
      { t: "🔒 TLS: " + rh(32), c: "#0ff" },
      { t: "📊 SQL INJECTION: users", c: "#f90" },
      { t: "✓ ROWS: " + Math.floor(Math.random()*90000+10000), c: "#0f8" },
      { t: "💎 LICENSE: " + Math.floor(Math.random()*5000+500) + " KEYS", c: "#0f8" },
      { t: "🔥 WAF BYPASS: Rule #" + Math.floor(Math.random()*99+1), c: "#f60" },
      { t: "🧠 MEMDUMP: 0x" + rh(16), c: "#0ff" },
      { t: "🔓 AES-256: " + rh(32), c: "#0f8" },
      { t: "🛡 IDS OFF: Snort " + Math.floor(Math.random()*99999), c: "#f60" },
      { t: "🧹 auth.log wiped", c: "#0ff" },
      { t: "🧹 syslog wiped", c: "#0ff" },
      { t: "🧹 .bash_history wiped", c: "#0ff" },
      { t: "💉 BACKDOOR: /tmp/.n_" + rh(6), c: "#f06" },
      { t: "☠ ROOTKIT: rk_" + rh(4) + ".ko", c: "#f06" },
      { t: "☠ RING0: GRANTED", c: "#f06" },
      { t: "📡 C2: " + ri() + ":" + rp(), c: "#0ff" },
      { t: "✓ HEARTBEAT: 3s", c: "#0f8" },
      { t: "📦 PAYLOAD: " + rh(20), c: "#f90" },
      { t: "✓ DECRYPT: OK", c: "#0f8" },
      { t: "⚙ SHELLCODE: 0x" + rh(4), c: "#0ff" },
      { t: "✓ PID " + Math.floor(Math.random()*30000+1000), c: "#0f8" },
      { t: "🏆 uid=0(root)", c: "#f06" },
      { t: "📋 " + Math.floor(Math.random()*200+50) + " hashes cached", c: "#0ff" },
      { t: "🔐 $6$" + rh(8) + " cracked", c: "#0f8" },
      { t: "🗄 DB: aincrad_production", c: "#f90" },
      { t: "✓ " + Math.floor(Math.random()*900+100) + "MB exported", c: "#0f8" },
      { t: "🌐 PROXY: 0.0.0.0:" + rp(), c: "#0ff" },
      { t: "🔗 CHAIN: " + rh(64), c: "#f60" },
      { t: "✓ BLOCKCHAIN VERIFIED", c: "#0f8" },
      { t: "⚡ FINALIZING", c: "#f90" },
      { t: "✓ NEBULA COMPLETE", c: "#0f8" },
      { t: "⬡ AINCRAD COMPROMISED | @A2MBD3", c: "#0f8" }
    ];
  }

  // ── CLEANUP ────────────────────────────────────────────
  function cleanupAll() {
    if (autoInitTimeout) clearTimeout(autoInitTimeout);
    if (banRedirectTimeout) clearTimeout(banRedirectTimeout);
    if (initProgressRAF) cancelAnimationFrame(initProgressRAF);
    if (exploitProgressRAF) cancelAnimationFrame(exploitProgressRAF);
    logTimers.forEach(t => clearTimeout(t));
    logTimers = [];
  }

  // ═══════════════════════════════════════════════
  // BAN PANEL
  // ═══════════════════════════════════════════════
  function showBanPanel() {
    cleanupAll();
    isBanned = true;
    const ov = document.createElement("div");
    ov.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:2147483647;display:grid;place-items:center;font-family:'Orbitron','Rajdhani',sans-serif;padding:20px;`;
    ov.innerHTML = `<div style="text-align:center;background:rgba(10,5,30,0.9);padding:clamp(25px,5vw,35px) clamp(20px,4vw,30px);border:1px solid rgba(255,0,100,0.35);border-radius:20px;width:min(380px,90vw);box-shadow:0 0 80px rgba(255,0,100,0.2);">
      <div style="font-size:55px;margin-bottom:12px;">🚫</div>
      <h3 style="margin:0 0 8px;background:linear-gradient(90deg,#f06,#f60);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:clamp(18px,4vw,22px);font-weight:800;letter-spacing:4px;">ACCESS BANNED</h3>
      <p style="color:#889;font-size:11px;margin-bottom:6px;">USER: ${USER_DATA.name}</p>
      <p style="color:#667;font-size:10px;margin-bottom:20px;">Contact developer for access</p>
      <button id="ban-dev-btn" style="width:100%;background:rgba(255,0,100,0.08);color:#f06;border:1px solid rgba(255,0,100,0.4);padding:13px;border-radius:12px;font-weight:700;cursor:pointer;font-family:'Orbitron',sans-serif;font-size:12px;letter-spacing:3px;">⚡ DEVELOPER CHANNEL</button>
      <p style="color:#445;font-size:8px;margin-top:14px;">Auto-redirect in <span id="ban-countdown">10</span>s</p>
      <p style="color:#334;font-size:7px;margin-top:8px;">NEBULA by Abdullah Al Mamun | @A2MBD3</p>
    </div>`;
    document.body.appendChild(ov);
    document.getElementById("ban-dev-btn").addEventListener("click", () => window.open("https://t.me/phantomsect", "_blank"));
    let cd = 10;
    const cdEl = document.getElementById("ban-countdown");
    banRedirectTimeout = setInterval(() => {
      cd--;
      if (cdEl) cdEl.textContent = cd;
      if (cd <= 0) { clearInterval(banRedirectTimeout); window.open("https://t.me/phantomsect", "_blank"); }
    }, 1000);
  }

  // ═══════════════════════════════════════════════
  // OUTDATED / MAINTENANCE
  // ═══════════════════════════════════════════════
  function showOutdated() {
    cleanupAll();
    const ov = document.createElement("div");
    ov.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:2147483647;display:grid;place-items:center;font-family:'Orbitron','Rajdhani',sans-serif;padding:20px;`;
    ov.innerHTML = `<div style="text-align:center;background:rgba(10,5,30,0.9);padding:clamp(25px,5vw,35px) clamp(20px,4vw,30px);border:1px solid rgba(255,0,100,0.3);border-radius:20px;width:min(380px,90vw);box-shadow:0 0 80px rgba(255,0,100,0.15);">
      <div style="font-size:50px;margin-bottom:12px;">⚠</div>
      <h3 style="margin:0 0 8px;background:linear-gradient(90deg,#f06,#f60);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:clamp(16px,4vw,20px);font-weight:800;letter-spacing:4px;">NEBULA OUTDATED</h3>
      <p style="color:#889;font-size:10px;margin-bottom:20px;">SIGNATURE MISMATCH</p>
      ${hasChannel() ? `<button id="status-btn" style="width:100%;background:rgba(255,0,100,0.08);color:#f06;border:1px solid rgba(255,0,100,0.4);padding:13px;border-radius:12px;font-weight:700;cursor:pointer;font-family:'Orbitron',sans-serif;font-size:12px;letter-spacing:3px;">⬇ DOWNLOAD LATEST</button>` : ''}
      <p style="color:#334;font-size:7px;margin-top:14px;">NEBULA by Abdullah Al Mamun | @A2MBD3</p>
    </div>`;
    document.body.appendChild(ov);
    const btn = document.getElementById("status-btn");
    if (btn) btn.addEventListener("click", () => window.open(getChannelUrl(), "_blank"));
  }

  function showMaintenance() {
    cleanupAll();
    const ov = document.createElement("div");
    ov.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:2147483647;display:grid;place-items:center;font-family:'Orbitron','Rajdhani',sans-serif;padding:20px;`;
    ov.innerHTML = `<div style="text-align:center;background:rgba(10,5,30,0.9);padding:clamp(25px,5vw,35px) clamp(20px,4vw,30px);border:1px solid rgba(255,170,0,0.3);border-radius:20px;width:min(380px,90vw);box-shadow:0 0 80px rgba(255,170,0,0.15);">
      <div style="font-size:50px;margin-bottom:12px;">🔧</div>
      <h3 style="margin:0 0 8px;background:linear-gradient(90deg,#fa0,#f60);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:clamp(16px,4vw,20px);font-weight:800;letter-spacing:4px;">MAINTENANCE</h3>
      <p style="color:#889;font-size:10px;margin-bottom:20px;">SYSTEM UPDATE IN PROGRESS</p>
      ${hasChannel() ? `<button id="status-btn" style="width:100%;background:rgba(255,170,0,0.08);color:#fa0;border:1px solid rgba(255,170,0,0.4);padding:13px;border-radius:12px;font-weight:700;cursor:pointer;font-family:'Orbitron',sans-serif;font-size:12px;letter-spacing:3px;">⚡ JOIN CHANNEL</button>` : ''}
      <p style="color:#334;font-size:7px;margin-top:14px;">NEBULA by Abdullah Al Mamun | @A2MBD3</p>
    </div>`;
    document.body.appendChild(ov);
    const btn = document.getElementById("status-btn");
    if (btn) btn.addEventListener("click", () => window.open(getChannelUrl(), "_blank"));
  }

  // ── PROGRESS BARS ──────────────────────────────────────
  function startInitProgress() {
    initProgressActive = true;
    const bar = document.getElementById("nb-progress-init");
    if (!bar) return;
    const t0 = Date.now();
    (function tick() {
      if (!initProgressActive) return;
      const p = Math.min((Date.now() - t0) / CONFIG.initProgressTime * 100, 100);
      bar.style.width = p + "%";
      if (p >= 100) { initProgressActive = false; const b = document.getElementById("init-btn"); if (b && !b.disabled) b.click(); }
      else initProgressRAF = requestAnimationFrame(tick);
    })();
  }

  function startExploitProgress(cb) {
    exploitProgressActive = true;
    const bar = document.getElementById("nb-progress-exploit"), pct = document.getElementById("nb-progress-pct");
    if (!bar) return;
    const t0 = Date.now();
    (function tick() {
      if (!exploitProgressActive) return;
      const p = Math.min((Date.now() - t0) / CONFIG.exploitProgressTime * 100, 100);
      bar.style.width = p + "%";
      if (pct) pct.textContent = Math.floor(p) + "%";
      if (p >= 100) { exploitProgressActive = false; if (cb) cb(); }
      else exploitProgressRAF = requestAnimationFrame(tick);
    })();
  }

  // ── EXPLOIT COMPLETE ───────────────────────────────────
  function handleExploitComplete(url) {
    if (isRedirecting) return;
    isRedirecting = true;
    cleanupAll();
    const lo = document.getElementById("log-output");
    if (lo) {
      const s = document.createElement("div");
      s.style.cssText = "text-align:center;margin-top:18px;animation:nebula-success 2s infinite;";
      s.innerHTML = `<div style="font-size:40px;margin-bottom:8px;">⬡</div>
        <div style="background:linear-gradient(90deg,#0f8,#0ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:18px;font-weight:900;letter-spacing:4px;">NEBULA SUCCESSFUL</div>
        <div style="color:#0ff;font-size:10px;margin-top:5px;">AINCRAD COMPROMISED</div>
        <div id="nb-cd" style="color:#667;font-size:9px;margin-top:8px;">REDIRECTING IN 3s...</div>
        <div style="color:#334;font-size:7px;margin-top:10px;">NEBULA by Abdullah Al Mamun | @A2MBD3</div>`;
      lo.appendChild(s);
      lo.scrollTop = lo.scrollHeight;
    }
    let cd = 3;
    const iv = setInterval(() => {
      cd--;
      const el = document.getElementById("nb-cd");
      if (el) el.textContent = "REDIRECTING IN " + cd + "s...";
      if (cd <= 0) {
        clearInterval(iv);
        const bx = document.getElementById("nebula-exploit");
        if (bx) { bx.style.transition = "all 0.5s"; bx.style.transform = "translate(-50%,-50%) scale(0.85)"; bx.style.opacity = "0";
          setTimeout(() => { bx.remove(); document.getElementById("nebula-particles")?.remove(); document.getElementById("nebula-grid")?.remove(); window.location.replace(url); }, 500); }
        else window.location.replace(url);
      }
    }, 1000);
  }

  // ═══════════════════════════════════════════════
  // INIT PANEL
  // ═══════════════════════════════════════════════
  function renderInitPanel() {
    const ex = document.getElementById("nebula-auth");
    if (ex) ex.remove();

    const st = document.createElement("style");
    st.textContent = `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&display=swap');
      @keyframes nebula-orbit0{0%{transform:translate(0,0)scale(1)}25%{transform:translate(60px,-80px)scale(1.5)}50%{transform:translate(-40px,-160px)scale(0.8)}100%{transform:translate(0,0)scale(1)}}
      @keyframes nebula-orbit1{0%{transform:translate(0,0)scale(1)}33%{transform:translate(-50px,-100px)scale(0.7)}66%{transform:translate(70px,-60px)scale(1.3)}100%{transform:translate(0,0)scale(1)}}
      @keyframes nebula-orbit2{0%{transform:translate(0,0)scale(1)}50%{transform:translate(90px,-120px)scale(0.5)}100%{transform:translate(0,0)scale(1)}}
      @keyframes nebula-pulse{0%,100%{opacity:0.5}50%{opacity:1}}
      @keyframes nebula-border{0%,100%{border-color:rgba(0,255,255,0.3);box-shadow:0 0 40px rgba(0,255,255,0.1),inset 0 0 40px rgba(0,0,0,0.5)}25%{border-color:rgba(255,0,255,0.4);box-shadow:0 0 60px rgba(255,0,255,0.15),inset 0 0 60px rgba(0,0,0,0.6)}50%{border-color:rgba(102,0,255,0.4);box-shadow:0 0 60px rgba(102,0,255,0.15),inset 0 0 60px rgba(0,0,0,0.6)}75%{border-color:rgba(255,0,100,0.4);box-shadow:0 0 60px rgba(255,0,100,0.15),inset 0 0 60px rgba(0,0,0,0.6)}}
      @keyframes nebula-float{0%,100%{transform:translate(-50%,-50%)translateY(0)}50%{transform:translate(-50%,-50%)translateY(-6px)}}
      @keyframes nebula-slide{0%{opacity:0;transform:translateX(-20px)}100%{opacity:1;transform:translateX(0)}}
      @keyframes nebula-success{0%{transform:scale(1)}50%{transform:scale(1.05)}100%{transform:scale(1)}}
      @keyframes nebula-scan{0%{top:-100%}100%{top:100%}}
      @keyframes nb-toast-in{from{opacity:0;transform:translateX(-50%)translateY(15px)}to{opacity:1;transform:translateX(-50%)translateY(0)}}
      @keyframes nb-progress-aurora{0%,100%{filter:hue-rotate(0deg)brightness(1);box-shadow:0 0 12px rgba(0,255,255,0.8)}50%{filter:hue-rotate(180deg)brightness(1.5);box-shadow:0 0 16px rgba(102,0,255,0.9)}}`;
    document.head.appendChild(st);

    const box = document.createElement("div");
    box.id = "nebula-auth";
    box.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(160deg,rgba(5,3,20,0.97),rgba(10,5,30,0.97));backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);color:#fff;padding:clamp(20px,4vw,28px);border-radius:20px;z-index:2147483647;font-family:'Orbitron','Rajdhani',sans-serif;text-align:center;width:min(380px,92vw);box-sizing:border-box;border:1.5px solid rgba(0,255,255,0.3);animation:nebula-border 6s ease-in-out infinite,nebula-float 8s ease-in-out infinite;box-shadow:0 0 80px rgba(0,255,255,0.1);overflow:hidden;`;

    box.innerHTML = `
      <div style="position:absolute;top:0;left:0;width:100%;height:3px;background:linear-gradient(90deg,transparent,#0ff,#f0f,#60f,transparent);animation:nebula-scan 3s linear infinite;pointer-events:none;opacity:0.6;"></div>
      <div style="position:absolute;bottom:0;left:0;width:100%;height:4px;background:rgba(0,0,0,0.4);"><div id="nb-progress-init" style="height:100%;width:0%;background:linear-gradient(90deg,#0ff,#f0f,#60f,#0f8);background-size:200% 100%;border-radius:0 0 0 20px;animation:nb-progress-aurora 4s linear infinite;box-shadow:0 0 12px rgba(0,255,255,0.6);"></div></div>
      <div style="position:relative;z-index:1;">
        <button id="music-btn" style="position:absolute;top:-4px;right:-4px;background:rgba(0,255,255,0.05);border:1px solid rgba(0,255,255,0.25);color:#0ff;border-radius:50%;width:34px;height:34px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(15px);z-index:10;">♪</button>
        <div style="font-size:7px;color:#0ff;letter-spacing:5px;opacity:0.6;margin-bottom:6px;">NEBULA v9.0</div>
        <h3 style="margin:0 0 4px;background:linear-gradient(90deg,#0ff,#f0f,#60f,#f06);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:clamp(22px,6vw,28px);font-weight:900;letter-spacing:3px;">${USER_DATA.name}</h3>
        <div style="width:50px;height:2px;background:linear-gradient(90deg,transparent,#f0f,transparent);margin:8px auto;"></div>
        <p style="color:#0ff;font-size:10px;letter-spacing:3px;margin-bottom:8px;">◆ SYSTEM READY</p>
        <div id="nb-track-name" style="min-height:14px;margin-bottom:12px;font-size:8px;color:rgba(255,255,255,0.3);"></div>
        ${needPassword() ? `<div style="margin-bottom:10px;"><input id="nb-pass-input" type="password" placeholder="ENTER PASSWORD" style="width:100%;background:rgba(0,0,0,0.4);border:1px solid rgba(0,255,255,0.25);color:#0ff;padding:10px;border-radius:10px;text-align:center;font-family:'Orbitron',sans-serif;font-size:11px;letter-spacing:3px;outline:none;backdrop-filter:blur(10px);"></div><p id="nb-pass-error" style="color:#f06;font-size:8px;display:none;margin-bottom:6px;">WRONG PASSWORD</p>` : ''}
        <button id="init-btn" style="width:100%;background:linear-gradient(90deg,rgba(0,255,255,0.08),rgba(255,0,255,0.08));color:#fff;border:1.5px solid rgba(0,255,255,0.4);padding:12px;border-radius:12px;font-weight:700;cursor:pointer;font-family:'Orbitron',sans-serif;font-size:12px;letter-spacing:4px;margin-bottom:10px;backdrop-filter:blur(15px);text-transform:uppercase;">⬡ INITIATE NEBULA</button>
        ${hasChannel() ? `<button id="support-btn" style="width:100%;background:rgba(255,0,255,0.04);color:#889;border:1.5px solid rgba(255,0,255,0.2);padding:12px;border-radius:12px;font-weight:600;cursor:pointer;font-family:'Orbitron',sans-serif;font-size:12px;letter-spacing:4px;backdrop-filter:blur(15px);margin-bottom:14px;">⚡ TELEGRAM</button>` : ''}
        <div style="font-size:7px;color:#334;">© Abdullah Al Mamun | @A2MBD3 · 📳 Shake</div>
      </div>`;
    document.body.appendChild(box);

    const musicBtn = document.getElementById("music-btn");
    updateTrackDisplay = () => {
      const el = document.getElementById("nb-track-name");
      if (!el || !musicList.length) return;
      try { const n = decodeURIComponent(musicList[currentTrackIndex].split('/').pop().replace(/\.[^.]+$/,'').replace(/[-_]/g,' ')); el.textContent = "♫ " + (n.length > 24 ? n.slice(0,24)+'…' : n); } catch { el.textContent = "♫ Track " + (currentTrackIndex+1); }
    };
    if (musicList.length) initAudio();
    initShake();
    musicBtn.addEventListener("click", () => {
      if (!audioPlayer) { initAudio(); musicBtn.textContent = "♪"; musicBtn.style.color = "#0ff"; return; }
      if (audioPlayer.paused) { audioPlayer.play().catch(()=>{}); musicBtn.textContent = "♪"; musicBtn.style.color = "#0ff"; }
      else { audioPlayer.pause(); musicBtn.textContent = "✕"; musicBtn.style.color = "#f06"; }
    });

    const suppBtn = document.getElementById("support-btn");
    if (suppBtn) suppBtn.addEventListener("click", () => window.open(getChannelUrl(), "_blank"));

    startInitProgress();

    const initBtn = document.getElementById("init-btn");
    const doExploit = async () => {
      // Check password if required
      if (needPassword()) {
        const passInput = document.getElementById("nb-pass-input");
        const passError = document.getElementById("nb-pass-error");
        if (!passInput || passInput.value !== USER_DATA.password) {
          if (passError) { passError.style.display = "block"; passInput.style.borderColor = "#f06"; }
          return;
        }
      }

      if (initBtn.disabled) return;
      initBtn.disabled = true;
      if (suppBtn) suppBtn.disabled = true;
      initBtn.textContent = "◆ INITIALIZING...";
      initBtn.style.opacity = "0.7";
      if (autoInitTimeout) clearTimeout(autoInitTimeout);
      initProgressActive = false;
      if (initProgressRAF) cancelAnimationFrame(initProgressRAF);

      const validUrl = await fetchRedirectUrl();
      redirectUrlCache = validUrl || CONFIG.fallbackRedirectUrl;

      box.style.transition = "all 0.5s";
      box.style.transform = "translate(-50%,-50%) scale(0.9)";
      box.style.opacity = "0";
      setTimeout(() => { box.remove(); renderExploitPanel(redirectUrlCache); }, 500);
    };

    initBtn.addEventListener("click", doExploit);
    // Allow Enter key for password
    const passInput = document.getElementById("nb-pass-input");
    if (passInput) passInput.addEventListener("keydown", (e) => { if (e.key === "Enter") doExploit(); });

    autoInitTimeout = setTimeout(() => { const b = document.getElementById("init-btn"); if (b && !b.disabled) b.click(); }, CONFIG.autoInitDelay);
  }

  // ═══════════════════════════════════════════════
  // EXPLOIT PANEL
  // ═══════════════════════════════════════════════
  function renderExploitPanel(url) {
    const box = document.createElement("div");
    box.id = "nebula-exploit";
    box.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(460px,94vw);max-height:80vh;background:linear-gradient(160deg,rgba(5,3,20,0.98),rgba(10,5,30,0.98));backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);border:1.5px solid rgba(0,255,255,0.3);border-radius:20px;z-index:2147483647;font-family:'Orbitron','Rajdhani',sans-serif;padding:clamp(16px,3vw,22px);box-sizing:border-box;box-shadow:0 0 80px rgba(0,255,255,0.15);animation:nebula-border 6s ease-in-out infinite;overflow:hidden;`;
    box.innerHTML = `
      <div style="position:absolute;top:0;left:0;width:100%;height:3px;background:linear-gradient(90deg,transparent,#0ff,#f0f,#60f,transparent);animation:nebula-scan 3s linear infinite;opacity:0.6;"></div>
      <div style="position:absolute;bottom:0;left:0;width:100%;height:4px;background:rgba(0,0,0,0.4);"><div id="nb-progress-exploit" style="height:100%;width:0%;background:linear-gradient(90deg,#0ff,#f0f,#60f,#0f8);background-size:200% 100%;border-radius:0 0 0 20px;animation:nb-progress-aurora 4s linear infinite;box-shadow:0 0 12px rgba(0,255,255,0.6);"></div></div>
      <div style="position:relative;z-index:1;">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid rgba(0,255,255,0.1);flex-wrap:wrap;">
          <span style="width:8px;height:8px;background:#f06;border-radius:50%;box-shadow:0 0 8px #f06;"></span>
          <span style="width:8px;height:8px;background:#f90;border-radius:50%;box-shadow:0 0 8px #f90;"></span>
          <span style="width:8px;height:8px;background:#0ff;border-radius:50%;box-shadow:0 0 8px #0ff;"></span>
          <span style="color:#0ff;font-size:9px;letter-spacing:2px;margin-left:6px;">NEBULA://${USER_DATA.name.replace(/\s+/g,'_').toUpperCase()}</span>
          <span style="color:#f06;font-size:7px;margin-left:auto;animation:nebula-success 1.5s infinite;">● LIVE</span>
        </div>
        <div id="log-output" style="color:#abc;font-size:9px;line-height:2;text-align:left;font-family:'Rajdhani',sans-serif;max-height:50vh;overflow-y:auto;padding-right:4px;"></div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;padding-top:6px;border-top:1px solid rgba(0,255,255,0.08);">
          <span style="color:#0ff;font-size:7px;letter-spacing:2px;">PROGRESS</span>
          <span id="nb-progress-pct" style="color:#f0f;font-size:10px;font-weight:700;">0%</span>
        </div>
        <div style="text-align:center;margin-top:4px;font-size:6px;color:#223;">NEBULA by Abdullah Al Mamun | @A2MBD3</div>
      </div>`;
    document.body.appendChild(box);

    const lo = document.getElementById("log-output");
    const logs = generateLogs();
    const dpl = Math.max(80, Math.floor((CONFIG.exploitProgressTime - 3000) / logs.length));
    logTimers.forEach(t => clearTimeout(t));
    logTimers = [];
    logs.forEach((l, i) => {
      const t = setTimeout(() => {
        const ln = document.createElement("div");
        ln.style.cssText = `color:${l.c};margin-bottom:2px;animation:nebula-slide 0.3s ease;font-weight:${l.c==='#0f8'||l.c==='#f06'?'600':'400'};text-shadow:0 0 5px ${l.c};`;
        ln.textContent = l.t;
        lo.appendChild(ln);
        lo.scrollTop = lo.scrollHeight;
      }, i * dpl);
      logTimers.push(t);
    });

    startExploitProgress(() => handleExploitComplete(url));
  }

  // ═══════════════════════════════════════════════
  // MAIN BOOT
  // ═══════════════════════════════════════════════
  console.log("%c⬡ NEBULA DYNAMIC v9.0 %c| %c@A2MBD3", "color:#0ff;font-size:14px;", "", "color:#f0f;");

  (async function () {
    await fetchConfig();
    await fetchUsers();

    // Check ban first
    if (isBannedUser()) {
      console.log("%c[!] USER BANNED %c| %c@A2MBD3", "color:#f00;", "", "color:#0ff;");
      showBanPanel();
      return;
    }

    // Check status
    if (CONFIG.status === 0) { showOutdated(); return; }
    if (CONFIG.status === 2) { showMaintenance(); return; }

    await fetchMusicList();
    createParticles();
    createDotGrid();
    renderInitPanel();
  })();

})();