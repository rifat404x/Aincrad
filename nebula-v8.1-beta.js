// ╔══════════════════════════════════════════════════════════╗
// ║  AUTHOR: Abdullah Al Mamun                             ║
// ║  GITHUB: @A2MBD3                                       ║
// ║  VERSION: 9.0.0 - NEBULA COSMIC REDESIGN              ║
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
  let updateTrackDisplay = function () { };
  let globalProgressInterval = null;
  let redirectTimeout = null;

  // ── INJECT STYLES ──────────────────────────────────────
  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
      
      :root {
        --cyan: #00ffff;
        --magenta: #ff00ff;
        --violet: #6600ff;
        --crimson: #ff0066;
        --bg-deep: #020010;
      }

      /* Nebula Drift */
      @keyframes nb-nebula-drift {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(30px, -40px) scale(1.1); }
        50% { transform: translate(-20px, 30px) scale(0.95); }
        75% { transform: translate(40px, 20px) scale(1.05); }
      }

      /* Grid Pulse */
      @keyframes nb-grid-pulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.8; }
      }

      /* Border Glow */
      @keyframes nb-border-glow {
        0%, 100% { border-color: rgba(0,255,255,0.2); box-shadow: 0 0 30px rgba(0,255,255,0.05), inset 0 0 30px rgba(0,0,0,0.4); }
        33% { border-color: rgba(255,0,255,0.3); box-shadow: 0 0 40px rgba(255,0,255,0.08), inset 0 0 40px rgba(0,0,0,0.5); }
        66% { border-color: rgba(102,0,255,0.3); box-shadow: 0 0 40px rgba(102,0,255,0.08), inset 0 0 40px rgba(0,0,0,0.5); }
      }

      /* Scan Line */
      @keyframes nb-scan {
        0% { top: -2px; }
        100% { top: 100%; }
      }

      /* Ripple */
      @keyframes nb-ripple {
        0% { width: 0; height: 0; opacity: 0.35; }
        100% { width: 250px; height: 250px; opacity: 0; }
      }

      /* Fade In */
      @keyframes nb-fade-in {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* Title Glitch */
      @keyframes nb-title-glitch {
        0%, 88%, 100% { clip-path: none; transform: none; }
        89% { clip-path: polygon(0 18%, 100% 18%, 100% 38%, 0 38%); transform: translate(-3px, 1px); }
        91% { clip-path: polygon(0 58%, 100% 58%, 100% 78%, 0 78%); transform: translate(3px, -1px); }
        93% { clip-path: none; transform: none; }
      }

      /* Author Glow */
      @keyframes nb-author-glow {
        0%, 100% { text-shadow: 0 0 8px var(--cyan), 0 0 16px rgba(0,255,255,0.4); }
        33% { text-shadow: 0 0 10px var(--magenta), 0 0 20px rgba(255,0,255,0.5); }
        66% { text-shadow: 0 0 10px var(--violet), 0 0 20px rgba(102,0,255,0.5); }
      }

      /* Toast */
      @keyframes nb-toast-in {
        from { opacity: 0; transform: translateX(-50%) translateY(15px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
      }

      /* Progress Bar Glow */
      @keyframes nb-progress-glow {
        0%, 100% { box-shadow: 0 0 8px rgba(0,255,255,0.6), 0 0 20px rgba(0,255,255,0.3); }
        33% { box-shadow: 0 0 8px rgba(255,0,255,0.6), 0 0 20px rgba(255,0,255,0.3); }
        66% { box-shadow: 0 0 8px rgba(102,0,255,0.6), 0 0 20px rgba(102,0,255,0.3); }
      }

      /* Success Screen */
      @keyframes nb-success-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.02); }
      }
    `;
    document.head.appendChild(style);
  }

  // ── CREATE COSMIC BACKGROUND ─────────────────────────
  function createCosmicBackground() {
    const blobs = [
      { color: "rgba(0,255,255,0.06)", width: "clamp(200px,40vw,500px)", height: "clamp(200px,40vw,500px)", top: "-20%", left: "-10%", delay: "0s" },
      { color: "rgba(255,0,255,0.05)", width: "clamp(180px,35vw,450px)", height: "clamp(180px,35vw,450px)", bottom: "-25%", right: "-15%", delay: "-7s" },
      { color: "rgba(102,0,255,0.05)", width: "clamp(150px,30vw,400px)", height: "clamp(150px,30vw,400px)", top: "50%", left: "50%", delay: "-14s" },
    ];

    blobs.forEach(b => {
      const blob = document.createElement("div");
      blob.style.cssText = `
        position: fixed; pointer-events: none; z-index: 0; border-radius: 50%;
        filter: blur(80px); opacity: 0.7;
        background: ${b.color};
        width: ${b.width}; height: ${b.height};
        top: ${b.top || 'auto'}; bottom: ${b.bottom || 'auto'};
        left: ${b.left || 'auto'}; right: ${b.right || 'auto'};
        animation: nb-nebula-drift 20s ease-in-out infinite alternate;
        animation-delay: ${b.delay};
      `;
      document.body.appendChild(blob);
    });

    const grid = document.createElement("div");
    const gridSize = window.innerWidth < 600 ? 35 : 55;
    grid.style.cssText = `
      position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background-image: 
        linear-gradient(rgba(0,255,255,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,255,0.04) 1px, transparent 1px);
      background-size: ${gridSize}px ${gridSize}px;
      animation: nb-grid-pulse 8s ease-in-out infinite;
    `;
    document.body.appendChild(grid);

    const scanLine = document.createElement("div");
    scanLine.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 2px; z-index: 1;
      pointer-events: none; opacity: 0.5;
      background: linear-gradient(90deg, transparent, var(--cyan), var(--magenta), var(--cyan), transparent);
      animation: nb-scan 3s linear infinite;
    `;
    document.body.appendChild(scanLine);
  }

  // ── STATUS CHECK ──────────────────────────────────────
  async function checkStatus() {
    try {
      const r = await fetch(CONFIG.statusUrl + "?t=" + Date.now());
      return (await r.text()).trim() === "1";
    } catch { return false; }
  }

  // ── REDIRECT URL ──────────────────────────────────────
  async function fetchRedirectUrl() {
    try {
      const r = await fetch(CONFIG.redirectUrlFile + "?t=" + Date.now());
      const url = (await r.text()).trim();
      return (url && url.startsWith("http")) ? url : null;
    } catch { return null; }
  }

  // ── MUSIC ─────────────────────────────────────────────
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
    audioPlayer.play().catch(() => { });
    audioPlayer.onended = () => playTrack(currentTrackIndex + 1);
    updateTrackDisplay();
  }

  function initAudio() {
    if (!musicList.length) return;
    playTrack(Math.floor(Math.random() * musicList.length));
  }

  function nextTrack() {
    playTrack(currentTrackIndex + 1);
    showToast("📳 Next Track!");
  }

  // ── SHAKE DETECTION ──────────────────────────────────
  function initShake() {
    if (!window.DeviceMotionEvent) return;
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission().then(permission => {
        if (permission === "granted") addShakeListener();
      }).catch(() => { });
    } else {
      addShakeListener();
    }
  }

  function addShakeListener() {
    window.addEventListener("devicemotion", (e) => {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      if (lastX === null) { lastX = a.x; lastY = a.y; lastZ = a.z; return; }
      const delta = Math.abs(a.x - lastX) + Math.abs(a.y - lastY) + Math.abs(a.z - lastZ);
      if (delta > 15 && !shakeTimeout) {
        shakeTimeout = setTimeout(() => shakeTimeout = null, 1000);
        nextTrack();
      }
      lastX = a.x; lastY = a.y; lastZ = a.z;
    });
  }

  // ── TOAST ────────────────────────────────────────────
  function showToast(msg) {
    const toast = document.createElement("div");
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed; bottom: clamp(60px, 12vh, 80px); left: 50%;
      transform: translateX(-50%); z-index: 2147483647;
      background: rgba(0,255,255,0.08); border: 1px solid rgba(0,255,255,0.3);
      color: var(--cyan); padding: 8px 20px; border-radius: 20px;
      font-size: 11px; font-family: 'Orbitron', sans-serif;
      letter-spacing: 2px; pointer-events: none;
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      animation: nb-toast-in 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1500);
  }

  // ── RIPPLE EFFECT ────────────────────────────────────
  function triggerRipple(btn, ev, color = "rgba(0,255,255,0.35)") {
    const ripple = document.createElement("span");
    const rect = btn.getBoundingClientRect();
    let x = rect.width / 2, y = rect.height / 2;
    if (ev && ev.touches) { x = ev.touches[0].clientX - rect.left; y = ev.touches[0].clientY - rect.top; }
    else if (ev) { x = ev.clientX - rect.left; y = ev.clientY - rect.top; }
    ripple.style.cssText = `
      position: absolute; left: ${x}px; top: ${y}px;
      border-radius: 50%; background: ${color};
      transform: translate(-50%, -50%); pointer-events: none;
      animation: nb-ripple 0.5s ease-out forwards;
    `;
    btn.style.position = "relative";
    btn.style.overflow = "hidden";
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 510);
  }

  function addRipple(btn, color) {
    btn.addEventListener("click", e => triggerRipple(btn, e, color));
    btn.addEventListener("touchstart", e => triggerRipple(btn, e, color), { passive: true });
  }

  // ── GLITCH TEXT EFFECT ──────────────────────────────
  function glitchText(el, text) {
    const chars = "█▓▒░#@$%&!?ABCDEFGHIJKLMNabcdefghijklmn0123456789";
    let iter = 0;
    const interval = setInterval(() => {
      el.textContent = text.split("").map((c, i) => {
        if (i < iter) return text[i];
        if (c === " ") return " ";
        return chars[Math.floor(Math.random() * chars.length)];
      }).join("");
      if (iter >= text.length) {
        el.textContent = text;
        clearInterval(interval);
        setTimeout(() => glitchText(el, text), 4500);
      }
      iter += 0.35;
    }, 38);
  }

  // ── PROGRESS BAR (FIXED) ────────────────────────────
  function startGlobalProgress(ms, onComplete) {
    const startTime = Date.now();
    
    // Update all progress bars
    function updateAllProgressBars(pct) {
      const bars = document.querySelectorAll('.nb-progress-fill');
      bars.forEach(bar => {
        bar.style.width = pct + "%";
      });
    }

    // Clear any existing interval
    if (globalProgressInterval) clearInterval(globalProgressInterval);

    globalProgressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / ms) * 100, 100);
      updateAllProgressBars(pct);

      if (pct >= 100) {
        clearInterval(globalProgressInterval);
        globalProgressInterval = null;
        if (onComplete) onComplete();
      }
    }, 50); // Update every 50ms for smooth animation

    // Initial update
    updateAllProgressBars(0);
  }

  // ── GENERATE FAKE LOGS ──────────────────────────────
  function generateLogs() {
    const randomHex = n => [...Array(n)].map(() => Math.floor(Math.random() * 16).toString(16)).join("").toUpperCase();
    const randomIP = () => [1, 2, 3, 4].map(() => Math.floor(Math.random() * 256)).join(".");
    const randomPort = () => [22, 80, 443, 3306, 8080, 8443, 9090, 3000, 27017][Math.floor(Math.random() * 9)];
    const timestamp = () => {
      const d = new Date();
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}.${String(d.getMilliseconds()).padStart(3, '0')}`;
    };
    const pid = Math.floor(Math.random() * 29000 + 1000);
    const sid = randomHex(8);
    const target = `aincrad-node-${Math.floor(Math.random() * 9 + 1)}.prime.cluster`;

    return [
      { t: `[${timestamp()}] [BOOT]  nebula    » Initializing NEBULA v9.0.0 (pid=${pid})`, c: "#4df" },
      { t: `[${timestamp()}] [INFO]  loader    » Session-ID: 0x${sid}`, c: "#4df" },
      { t: `[${timestamp()}] [INFO]  loader    » Entropy pool seeded — ${randomHex(16)}`, c: "#4df" },
      { t: `[${timestamp()}] [INFO]  net       » Resolving target: ${target}`, c: "#8cf" },
      { t: `[${timestamp()}] [INFO]  net       » DNS A record → ${randomIP()}  TTL=60`, c: "#8cf" },
      { t: `[${timestamp()}] [SCAN]  nmap      » TCP SYN scan ${randomIP()}/24 — ports 1–65535`, c: "#0ff" },
      { t: `[${timestamp()}] [SCAN]  nmap      » ${randomPort()} open   tcp  ssl/https`, c: "#0ff" },
      { t: `[${timestamp()}] [SCAN]  nmap      » ${randomPort()} open   tcp  mysql`, c: "#0ff" },
      { t: `[${timestamp()}] [WARN]  vuln      » CVE-2024-${Math.floor(Math.random() * 9000 + 1000)} detected — CVSS 9.8 CRITICAL`, c: "#fa0" },
      { t: `[${timestamp()}] [WARN]  vuln      » Unpatched kernel: Linux 5.4.0-${Math.floor(Math.random() * 200 + 100)}-generic`, c: "#fa0" },
      { t: `[${timestamp()}] [EXPL]  stage1    » Sending exploit payload (${Math.floor(Math.random() * 8 + 2)}KB shellcode)`, c: "#f60" },
      { t: `[${timestamp()}] [EXPL]  stage1    » Stack pivot @ 0x${randomHex(12)} — SUCCESS`, c: "#0f8" },
      { t: `[${timestamp()}] [EXPL]  stage2    » ROP chain built: ${Math.floor(Math.random() * 30 + 15)} gadgets`, c: "#f60" },
      { t: `[${timestamp()}] [EXPL]  stage2    » libc base: 0x${randomHex(12)}  offset: +0x${randomHex(4)}`, c: "#0f8" },
      { t: `[${timestamp()}] [AUTH]  ssh       » Initiating brute-force on root@${randomIP()}:22`, c: "#4df" },
      { t: `[${timestamp()}] [AUTH]  ssh       » Credential match — root:${randomHex(10)}  attempt #${Math.floor(Math.random() * 200 + 50)}`, c: "#0f8" },
      { t: `[${timestamp()}] [PRIV]  escalate  » uid=1000 → uid=0 (CVE-2024-1086)`, c: "#f06" },
      { t: `[${timestamp()}] [PRIV]  escalate  » euid=0(root) egid=0(root) groups=0(root)`, c: "#f06" },
      { t: `[${timestamp()}] [TLS]   handshake » Client Hello — TLS 1.3 — ${randomHex(32)}`, c: "#4df" },
      { t: `[${timestamp()}] [TLS]   handshake » Cipher: AES-256-GCM-SHA384  PFS: X25519`, c: "#4df" },
      { t: `[${timestamp()}] [DB]    mysql     » Connected to aincrad_production@${randomIP()}:3306`, c: "#8cf" },
      { t: `[${timestamp()}] [DB]    mysql     » SHOW TABLES → 47 tables found`, c: "#8cf" },
      { t: `[${timestamp()}] [DB]    inject    » UNION SELECT * FROM license_keys LIMIT 0,9999`, c: "#fa0" },
      { t: `[${timestamp()}] [DB]    inject    » Extracted ${Math.floor(Math.random() * 5000 + 800)} rows — ${Math.floor(Math.random() * 40 + 10)}MB`, c: "#0f8" },
      { t: `[${timestamp()}] [MEM]   dump      » /proc/${pid}/mem → 0x${randomHex(16)} – 0x${randomHex(16)}`, c: "#4df" },
      { t: `[${timestamp()}] [MEM]   dump      » AES-256 key recovered: ${randomHex(32)}`, c: "#0f8" },
      { t: `[${timestamp()}] [EVADE] ids       » Fragmented packets — Snort rule #${Math.floor(Math.random() * 99999)} bypassed`, c: "#f60" },
      { t: `[${timestamp()}] [EVADE] log       » Truncating /var/log/auth.log … done`, c: "#888" },
      { t: `[${timestamp()}] [EVADE] log       » Patching utmp/wtmp entries … done`, c: "#888" },
      { t: `[${timestamp()}] [C2]    beacon    » POST https://${randomIP()}/api/hb  interval=3s`, c: "#4df" },
      { t: `[${timestamp()}] [C2]    beacon    » ACK received — operator online`, c: "#0f8" },
      { t: `[${timestamp()}] [DONE]  nebula    » All stages complete — session 0x${sid} active`, c: "#0f8" },
      { t: `[${timestamp()}] [DONE]  nebula    » ⬡ AINCRAD FULLY COMPROMISED`, c: "#f06" },
      { t: `[${timestamp()}] [INFO]  redirect  » Launching secure portal…`, c: "#4df" },
    ];
  }

  // ── TYPEWRITER LOGS ──────────────────────────────────
  function typewriterLogs(logs, container, onDone) {
    let idx = 0;
    
    function next() {
      if (idx >= logs.length) { 
        if (onDone) onDone(); 
        return; 
      }
      const log = logs[idx++];

      const wrap = document.createElement("div");
      wrap.style.cssText = `
        display: flex; align-items: flex-start; gap: 6px; margin-bottom: 3px;
        animation: nb-fade-in 0.2s ease;
      `;

      const badge = document.createElement("span");
      let bc = "#4df";
      if (log.t.includes("[WARN]") || log.t.includes("[EVADE]")) bc = "#fa0";
      else if (log.t.includes("[EXPL]") || log.t.includes("[PRIV]") || log.t.includes("[DONE]")) bc = "#f06";
      else if (log.t.includes("[AUTH]") || log.t.includes("[DB]")) bc = "#a0f";
      else if (log.t.includes("[SCAN]")) bc = "#0ff";
      badge.style.cssText = `
        min-width: 4px; align-self: stretch; background: ${bc};
        border-radius: 2px; flex-shrink: 0; opacity: 0.8;
      `;
      wrap.appendChild(badge);

      const line = document.createElement("span");
      line.style.cssText = `
        color: ${log.c}; font-size: clamp(8px, 1.6vw, 10px);
        font-family: 'Courier New', monospace; letter-spacing: 0.2px;
        line-height: 1.5; word-break: break-all;
      `;
      wrap.appendChild(line);
      container.appendChild(wrap);
      container.scrollTop = container.scrollHeight;

      let charIndex = 0;
      const text = log.t;
      const speed = 20; // Fixed speed for consistent typing
      const interval = setInterval(() => {
        line.textContent = text.slice(0, ++charIndex);
        if (charIndex >= text.length) {
          clearInterval(interval);
          container.scrollTop = container.scrollHeight;
          setTimeout(next, 150); // Small delay between logs
        }
      }, speed);
    }
    next();
  }

  // ── RENDER SUCCESS SCREEN ────────────────────────────
  function renderSuccessScreen(redirectUrl) {
    // Remove existing wrapper
    const existingWrapper = document.getElementById("nb-wrapper");
    if (existingWrapper) existingWrapper.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "nb-wrapper";
    wrapper.style.cssText = `
      position: fixed; inset: 0; z-index: 2147483647;
      display: grid; place-items: center; padding: 16px;
      background: rgba(2,0,16,0.8);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    `;

    const panel = document.createElement("div");
    panel.style.cssText = `
      background: linear-gradient(155deg, rgba(4,2,18,0.95), rgba(8,4,26,0.95));
      backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
      border: 1.5px solid rgba(0,255,255,0.3); border-radius: clamp(16px, 3vw, 22px);
      padding: clamp(24px, 5vw, 36px); width: min(400px, 92vw); box-sizing: border-box;
      text-align: center; position: relative; overflow: hidden;
      box-shadow: 0 0 60px rgba(0,255,255,0.15), 0 0 120px rgba(255,0,255,0.08);
      animation: nb-success-pulse 2s ease-in-out infinite, nb-fade-in 0.5s ease;
    `;

    panel.innerHTML = `
      <div style="font-size: clamp(40px, 8vw, 60px); margin-bottom: 16px;">⬡</div>
      <h2 style="margin: 0 0 12px; font-size: clamp(18px, 5vw, 24px); font-weight: 900;
        font-family: 'Orbitron', sans-serif; letter-spacing: 3px;
        background: linear-gradient(90deg, var(--cyan), var(--emerald, #00ff88));
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text;">EXPLOIT SUCCESSFUL</h2>
      <p style="color: var(--cyan); font-size: clamp(9px, 2vw, 11px); letter-spacing: 2px; margin-bottom: 6px;">
        ◆ NEBULA ENGINE v9.0.0</p>
      <p style="color: rgba(255,255,255,0.5); font-size: clamp(8px, 1.8vw, 10px); margin-bottom: 20px;">
        Target compromised. Redirecting to secure portal...</p>
      
      <div style="width: 60px; height: 1.5px; background: linear-gradient(90deg, transparent, var(--cyan), transparent); margin: 12px auto;"></div>
      
      <p id="nb-redirect-countdown" style="color: rgba(255,255,255,0.4); font-size: 10px; margin-top: 12px; font-family: 'Orbitron', sans-serif;">
        Redirecting in 3s...</p>
      
      <div style="margin-top: 16px;">
        <span style="font-size: clamp(8px, 2vw, 9px); font-family: 'Orbitron', sans-serif;
          font-weight: 700; letter-spacing: 3px; color: var(--cyan);
          animation: nb-author-glow 4s ease-in-out infinite; text-transform: uppercase;">Abdullah Al Mamun</span>
        <div style="font-size: 6.5px; color: rgba(255,255,255,0.15); margin-top: 4px;">@A2MBD3 · NEBULA COSMIC</div>
      </div>
    `;

    wrapper.appendChild(panel);
    document.body.appendChild(wrapper);

    // Countdown redirect
    let countdown = 3;
    const countdownEl = document.getElementById("nb-redirect-countdown");
    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        window.location.href = redirectUrl;
      } else {
        countdownEl.textContent = `Redirecting in ${countdown}s...`;
      }
    }, 1000);
  }

  // ── RENDER OUTDATED PANEL ────────────────────────────
  function renderOutdatedPanel() {
    const wrapper = document.createElement("div");
    wrapper.id = "nb-wrapper";
    wrapper.style.cssText = `
      position: fixed; inset: 0; z-index: 2147483647;
      display: grid; place-items: center; padding: 20px;
    `;

    const panel = document.createElement("div");
    panel.style.cssText = `
      background: linear-gradient(155deg, rgba(4,2,18,0.97), rgba(8,4,26,0.97));
      backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
      border: 1.5px solid rgba(255,0,100,0.3); border-radius: clamp(16px, 3vw, 22px);
      padding: clamp(20px, 4vw, 30px); text-align: center;
      width: min(380px, 92vw); box-sizing: border-box;
      box-shadow: 0 0 60px rgba(255,0,100,0.08), 0 0 120px rgba(255,0,100,0.03);
      animation: nb-fade-in 0.4s ease;
    `;

    panel.innerHTML = `
      <div style="font-size: clamp(40px, 8vw, 55px); margin-bottom: 12px;">⚠</div>
      <h3 style="margin: 0 0 8px; background: linear-gradient(90deg, #ff0066, #ff6600);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        font-size: clamp(16px, 4vw, 20px); font-weight: 800;
        font-family: 'Orbitron', sans-serif; letter-spacing: 4px;">NEBULA OUTDATED</h3>
      <p style="color: rgba(255,255,255,0.4); font-size: 10px; margin-bottom: 18px;">SIGNATURE_MISMATCH</p>
      <button id="nb-update-btn" style="
        width: 100%; background: rgba(255,0,100,0.08); color: #ff0066;
        border: 1.5px solid rgba(255,0,100,0.35); padding: clamp(11px, 2.5vw, 14px);
        border-radius: 12px; font-weight: 700; cursor: pointer;
        font-family: 'Orbitron', sans-serif; font-size: clamp(11px, 2.5vw, 12px);
        letter-spacing: 3px; transition: all 0.3s;">⬇ DOWNLOAD LATEST</button>
      <div style="margin-top: 14px;">
        <span style="font-size: clamp(8px, 2vw, 9px); font-family: 'Orbitron', sans-serif;
          font-weight: 700; letter-spacing: 3px; color: #ff0066;
          text-shadow: 0 0 6px rgba(255,0,100,0.4);">Abdullah Al Mamun</span>
        <div style="font-size: 6.5px; color: rgba(255,255,255,0.15); margin-top: 4px;">@A2MBD3</div>
      </div>
    `;

    wrapper.appendChild(panel);
    document.body.appendChild(wrapper);

    document.getElementById("nb-update-btn").addEventListener("click", () => {
      window.open(CONFIG.telegramUrl, "_blank");
    });
  }

  // ── RENDER INIT PANEL ────────────────────────────────
  function renderInitPanel() {
    const wrapper = document.createElement("div");
    wrapper.id = "nb-wrapper";
    wrapper.style.cssText = `
      position: fixed; inset: 0; z-index: 2147483647;
      display: grid; place-items: center; padding: 16px;
    `;

    const panel = document.createElement("div");
    panel.id = "nb-init-panel";
    panel.style.cssText = `
      background: linear-gradient(155deg, rgba(4,2,18,0.97), rgba(8,4,26,0.97));
      backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
      border: 1.5px solid rgba(0,255,255,0.15); border-radius: clamp(16px, 3vw, 22px);
      padding: clamp(16px, 4vw, 24px); width: min(400px, 92vw); box-sizing: border-box;
      position: relative; overflow: hidden; text-align: center;
      animation: nb-border-glow 6s ease-in-out infinite, nb-fade-in 0.4s ease;
    `;

    panel.innerHTML = `
      <!-- Progress Bar Container -->
      <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: rgba(255,255,255,0.05); backdrop-filter: blur(10px);">
        <div class="nb-progress-fill" style="
          height: 100%; width: 0%; 
          background: linear-gradient(90deg, var(--cyan), var(--magenta), var(--violet));
          border-radius: 0 0 0 clamp(16px, 3vw, 22px);
          animation: nb-progress-glow 3s ease-in-out infinite;
          transition: width 0.05s linear;
          box-shadow: 0 0 10px rgba(0,255,255,0.4);
        "></div>
      </div>

      <button id="nb-music-btn" style="
        position: absolute; top: 10px; right: 10px; width: 34px; height: 34px;
        border-radius: 50%; background: rgba(0,255,255,0.05);
        border: 1px solid rgba(0,255,255,0.2); color: var(--cyan);
        font-size: 14px; cursor: pointer; display: flex; align-items: center;
        justify-content: center; z-index: 5; transition: all 0.3s;
        backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">♪</button>
      
      <div style="font-size: clamp(7px, 1.5vw, 8px); color: rgba(0,255,255,0.5); letter-spacing: 5px; margin-bottom: 6px;">NEBULA.DIRECT</div>
      <h1 id="nb-glitch-title" style="
        margin: 0 0 4px; font-size: clamp(24px, 6vw, 32px); font-weight: 900;
        font-family: 'Orbitron', sans-serif; letter-spacing: 3px;
        background: linear-gradient(90deg, var(--cyan), var(--magenta), var(--violet), var(--crimson));
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text; animation: nb-title-glitch 5s infinite; line-height: 1.2;">A2MBD3</h1>
      <div style="width: 50px; height: 1.5px; background: linear-gradient(90deg, transparent, var(--magenta), transparent); margin: 8px auto;"></div>
      <p style="color: var(--cyan); font-size: clamp(9px, 2vw, 10px); letter-spacing: 3px; margin-bottom: 12px;">◆ SYSTEM READY</p>
      <div id="nb-track-name" style="min-height: 16px; margin-bottom: 14px; font-size: clamp(7.5px, 1.8vw, 8.5px); color: rgba(255,255,255,0.3); letter-spacing: 1px;"></div>
      
      <button id="nb-init-btn" style="
        display: block; width: 100%; background: rgba(0,255,255,0.06);
        border: 1.5px solid rgba(0,255,255,0.35); color: #fff;
        padding: clamp(11px, 2.5vw, 14px); border-radius: 12px;
        font-weight: 700; cursor: pointer; font-family: 'Orbitron', sans-serif;
        font-size: clamp(11px, 2.5vw, 12px); letter-spacing: 4px;
        margin-bottom: 10px; backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px); transition: all 0.3s;">⬡ INITIATE NEBULA</button>
      
      <button id="nb-supp-btn" style="
        display: block; width: 100%; background: rgba(255,0,255,0.04);
        border: 1.5px solid rgba(255,0,255,0.18); color: rgba(255,255,255,0.6);
        padding: clamp(11px, 2.5vw, 14px); border-radius: 12px;
        font-weight: 600; cursor: pointer; font-family: 'Orbitron', sans-serif;
        font-size: clamp(11px, 2.5vw, 12px); letter-spacing: 4px;
        backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        transition: all 0.3s; margin-bottom: 14px;">⚡ Telegram</button>
      
      <div>
        <span style="font-size: clamp(8px, 2vw, 9px); font-family: 'Orbitron', sans-serif;
          font-weight: 700; letter-spacing: 3px; color: var(--cyan);
          animation: nb-author-glow 4s ease-in-out infinite; text-transform: uppercase;">Abdullah Al Mamun</span>
        <div style="font-size: 6.5px; color: rgba(255,255,255,0.15); margin-top: 4px;">@A2MBD3 · 📳 Shake = Next Track</div>
      </div>
    `;

    wrapper.appendChild(panel);
    document.body.appendChild(wrapper);

    // Glitch effect on title
    setTimeout(() => glitchText(document.getElementById("nb-glitch-title"), "A2MBD3"), 900);

    // Start global progress
    startGlobalProgress(CONFIG.totalTime, () => {
      // Auto-redirect when progress completes
      const initBtn = document.getElementById("nb-init-btn");
      if (initBtn && !initBtn.disabled) {
        initBtn.click();
      }
    });

    // Music button
    const musicBtn = document.getElementById("nb-music-btn");
    updateTrackDisplay = () => {
      const el = document.getElementById("nb-track-name");
      if (!el || !musicList.length) return;
      try {
        const name = decodeURIComponent(musicList[currentTrackIndex].split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));
        el.textContent = "♫ " + (name.length > 24 ? name.slice(0, 24) + "…" : name);
      } catch { el.textContent = "♫ Track " + (currentTrackIndex + 1); }
    };

    if (musicList.length) initAudio();
    initShake();

    addRipple(musicBtn, "rgba(0,255,255,0.35)");
    musicBtn.addEventListener("click", () => {
      if (!audioPlayer) { initAudio(); musicBtn.style.color = "var(--cyan)"; return; }
      if (audioPlayer.paused) {
        audioPlayer.play().catch(() => { });
        musicBtn.style.color = "var(--cyan)";
      } else {
        audioPlayer.pause();
        musicBtn.style.color = "var(--crimson)";
      }
    });

    // Support button
    const suppBtn = document.getElementById("nb-supp-btn");
    addRipple(suppBtn, "rgba(255,0,255,0.35)");
    suppBtn.addEventListener("click", () => {
      window.open(CONFIG.telegramUrl, "_blank");
    });

    // Init button
    const initBtn = document.getElementById("nb-init-btn");
    addRipple(initBtn, "rgba(0,255,255,0.35)");
    initBtn.addEventListener("click", async () => {
      initBtn.disabled = true;
      suppBtn.disabled = true;
      initBtn.textContent = "◆ INITIALIZING...";
      initBtn.style.opacity = "0.65";

      setTimeout(() => {
        panel.style.transition = "all 0.4s ease";
        panel.style.opacity = "0";
        panel.style.transform = "scale(0.9)";

        setTimeout(async () => {
          wrapper.remove();
          renderExploitPanel();
        }, 420);
      }, CONFIG.initPanelTime);
    });
  }

  // ── RENDER EXPLOIT PANEL ─────────────────────────────
  function renderExploitPanel() {
    const wrapper = document.createElement("div");
    wrapper.id = "nb-wrapper";
    wrapper.style.cssText = `
      position: fixed; inset: 0; z-index: 2147483647;
      display: grid; place-items: center; padding: 16px;
    `;

    const panel = document.createElement("div");
    panel.style.cssText = `
      background: linear-gradient(155deg, rgba(4,2,18,0.98), rgba(8,4,26,0.98));
      backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
      border: 1.5px solid rgba(0,255,255,0.2); border-radius: clamp(16px, 3vw, 22px);
      padding: clamp(14px, 3vw, 20px); width: min(480px, 95vw); box-sizing: border-box;
      position: relative; overflow: hidden;
      box-shadow: 0 0 60px rgba(0,255,255,0.06), 0 0 140px rgba(255,0,255,0.03);
      animation: nb-border-glow 6s ease-in-out infinite, nb-fade-in 0.3s ease;
    `;

    panel.innerHTML = `
      <!-- Progress Bar Container -->
      <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: rgba(255,255,255,0.05); backdrop-filter: blur(10px);">
        <div class="nb-progress-fill" style="
          height: 100%; width: 0%; 
          background: linear-gradient(90deg, var(--cyan), var(--magenta), var(--violet));
          border-radius: 0 0 0 clamp(16px, 3vw, 22px);
          animation: nb-progress-glow 3s ease-in-out infinite;
          transition: width 0.05s linear;
          box-shadow: 0 0 10px rgba(0,255,255,0.4);
        "></div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <div>
          <div style="font-size: 7px; color: #f60; letter-spacing: 3px; margin-bottom: 3px;">NEBULA EXPLOIT ENGINE</div>
          <div id="nb-exploit-title" style="
            font-size: clamp(14px, 4vw, 18px); font-weight: 900; letter-spacing: 2px;
            background: linear-gradient(90deg, var(--cyan), var(--crimson));
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text; animation: nb-title-glitch 4s infinite;">RUNNING...</div>
        </div>
        <div style="text-align: right;">
          <div id="nb-exploit-track" style="color: rgba(255,255,255,0.3); font-size: 7.5px; font-family: 'Orbitron', sans-serif; max-width: 120px;"></div>
          <div style="font-size: 6.5px; color: rgba(255,255,255,0.12); margin-top: 3px;">
            <span style="color: var(--cyan); text-shadow: 0 0 6px rgba(0,255,255,0.3); font-family: 'Orbitron', sans-serif; font-weight: 700;">Abdullah Al Mamun</span>
          </div>
        </div>
      </div>

      <div style="background: rgba(0,0,0,0.5); border: 1px solid rgba(0,255,255,0.08); border-radius: 8px; padding: 10px 10px 8px; backdrop-filter: blur(10px);">
        <div style="display: flex; gap: 6px; margin-bottom: 8px; align-items: center;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #f06; opacity: 0.7;"></span>
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #fa0; opacity: 0.7;"></span>
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #0f8; opacity: 0.7;"></span>
          <span style="font-size: 7px; color: rgba(255,255,255,0.2); margin-left: 6px; font-family: monospace;">nebula@aincrad ~ ./exploit.sh</span>
        </div>
        <div id="nb-log-container" style="
          overflow-y: auto; max-height: 55vh;
          scrollbar-width: none; -ms-overflow-style: none;
          font-family: 'Courier New', monospace;"></div>
      </div>
    `;

    wrapper.appendChild(panel);
    document.body.appendChild(wrapper);

    // Hide scrollbar in webkit
    const logContainer = document.getElementById("nb-log-container");
    logContainer.style.cssText += "::-webkit-scrollbar { display: none; }";

    // Continue global progress
    startGlobalProgress(CONFIG.totalTime - CONFIG.initPanelTime - 500);

    setTimeout(() => glitchText(document.getElementById("nb-exploit-title"), "RUNNING..."), 200);

    updateTrackDisplay = () => {
      const el = document.getElementById("nb-exploit-track");
      if (!el || !musicList.length) return;
      try {
        const name = decodeURIComponent(musicList[currentTrackIndex].split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));
        el.textContent = "♫ " + (name.length > 20 ? name.slice(0, 20) + "…" : name);
      } catch { el.textContent = "♫ Track " + (currentTrackIndex + 1); }
    };
    updateTrackDisplay();

    // Start typewriter logs
    const logs = generateLogs();
    typewriterLogs(logs, logContainer, () => {
      // Logs done, but wait for progress bar to complete
      // Check if we need to show success screen
    });

    // Schedule redirect based on remaining time
    const remainingTime = CONFIG.totalTime - CONFIG.initPanelTime - 500;
    
    if (redirectTimeout) clearTimeout(redirectTimeout);
    redirectTimeout = setTimeout(async () => {
      const url = await fetchRedirectUrl();
      renderSuccessScreen(url || CONFIG.redirectUrl);
    }, remainingTime);
  }

  // ── MAIN BOOT SEQUENCE ───────────────────────────────
  (async () => {
    injectStyles();
    createCosmicBackground();

    const active = await checkStatus();
    if (!active) {
      renderOutdatedPanel();
      return;
    }

    await fetchMusicList();
    renderInitPanel();
  })();

})();