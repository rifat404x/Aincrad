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
    fallbackRedirectUrl: "https://htmlpreview.github.io/?https://raw.githubusercontent.com/A2MBD3/Aincrad/main/index.html",
    telegramUrl: "https://t.me/redguild",
    totalTime: 30000,
    autoInitDelay: 10000,
  };

  let audioPlayer = null;
  let musicList = [];
  let currentTrackIndex = -1;
  let lastX = null, lastY = null, lastZ = null;
  let shakeTimeout = null;
  let updateTrackDisplay = function () { };
  let globalProgressInterval = null;
  let redirectTimeout = null;
  let autoInitTimeout = null;
  let isRedirecting = false;

  // ── INJECT STYLES ──────────────────────────────────────
  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@300;400;600;700;900&family=JetBrains+Mono:wght@300;400;600&display=swap');
      
      :root {
        --cyan: #00ffff;
        --magenta: #ff00ff;
        --violet: #7b2fff;
        --crimson: #ff0066;
        --emerald: #00ff88;
        --amber: #ffaa00;
        --bg-void: #010314;
        --glass-bg: rgba(6, 4, 28, 0.85);
        --glass-border: rgba(0, 255, 255, 0.12);
        --glass-highlight: rgba(255, 255, 255, 0.03);
      }

      @keyframes nb-nebula-drift {
        0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
        25% { transform: translate(40px, -50px) scale(1.15) rotate(5deg); }
        50% { transform: translate(-30px, 40px) scale(0.9) rotate(-3deg); }
        75% { transform: translate(50px, 30px) scale(1.1) rotate(2deg); }
      }

      @keyframes nb-grid-pulse {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.6; }
      }

      @keyframes nb-border-aurora {
        0%, 100% { 
          border-color: rgba(0,255,255,0.15); 
          box-shadow: 0 0 40px rgba(0,255,255,0.04), 
                     0 0 80px rgba(0,255,255,0.02),
                     inset 0 0 40px rgba(0,0,0,0.5);
        }
        25% { 
          border-color: rgba(123,47,255,0.25); 
          box-shadow: 0 0 50px rgba(123,47,255,0.08), 
                     0 0 100px rgba(123,47,255,0.04),
                     inset 0 0 50px rgba(0,0,0,0.6);
        }
        50% { 
          border-color: rgba(255,0,255,0.25); 
          box-shadow: 0 0 50px rgba(255,0,255,0.08), 
                     0 0 100px rgba(255,0,255,0.04),
                     inset 0 0 50px rgba(0,0,0,0.6);
        }
        75% { 
          border-color: rgba(0,255,136,0.2); 
          box-shadow: 0 0 50px rgba(0,255,136,0.06), 
                     0 0 100px rgba(0,255,136,0.03),
                     inset 0 0 50px rgba(0,0,0,0.5);
        }
      }

      @keyframes nb-scan-line {
        0% { top: -4px; opacity: 0; }
        10% { opacity: 0.6; }
        90% { opacity: 0.6; }
        100% { top: 100%; opacity: 0; }
      }

      @keyframes nb-ripple-effect {
        0% { width: 0; height: 0; opacity: 0.4; }
        100% { width: 300px; height: 300px; opacity: 0; }
      }

      @keyframes nb-fade-in-up {
        from { opacity: 0; transform: translateY(12px); filter: blur(4px); }
        to { opacity: 1; transform: translateY(0); filter: blur(0); }
      }

      @keyframes nb-title-glitch {
        0%, 90%, 100% { clip-path: none; transform: none; }
        91% { clip-path: polygon(0 15%, 100% 15%, 100% 35%, 0 35%); transform: translate(-3px, 2px); }
        93% { clip-path: polygon(0 55%, 100% 55%, 100% 75%, 0 75%); transform: translate(3px, -2px); }
        95% { clip-path: none; transform: none; }
      }

      @keyframes nb-author-glow {
        0%, 100% { text-shadow: 0 0 10px var(--cyan), 0 0 20px rgba(0,255,255,0.5), 0 0 40px rgba(0,255,255,0.2); }
        33% { text-shadow: 0 0 12px var(--magenta), 0 0 24px rgba(255,0,255,0.5), 0 0 48px rgba(255,0,255,0.2); }
        66% { text-shadow: 0 0 12px var(--violet), 0 0 24px rgba(123,47,255,0.5), 0 0 48px rgba(123,47,255,0.2); }
      }

      @keyframes nb-toast-slide {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
      }

      @keyframes nb-progress-aurora {
        0%, 100% { 
          box-shadow: 0 0 12px rgba(0,255,255,0.7), 0 0 30px rgba(0,255,255,0.3);
          filter: hue-rotate(0deg);
        }
        33% { 
          box-shadow: 0 0 12px rgba(255,0,255,0.7), 0 0 30px rgba(255,0,255,0.3);
          filter: hue-rotate(120deg);
        }
        66% { 
          box-shadow: 0 0 12px rgba(123,47,255,0.7), 0 0 30px rgba(123,47,255,0.3);
          filter: hue-rotate(240deg);
        }
      }

      @keyframes nb-success-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.03); opacity: 0.9; }
      }

      @keyframes nb-log-enter {
        from { opacity: 0; transform: translateX(-10px); }
        to { opacity: 1; transform: translateX(0); }
      }

      @keyframes nb-particle-float {
        0% { transform: translateY(100vh) scale(0); opacity: 0; }
        20% { opacity: 1; }
        80% { opacity: 1; }
        100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // ── CREATE COSMIC BACKGROUND ─────────────────────────
  function createCosmicBackground() {
    const orbs = [
      { gradient: "radial-gradient(circle, rgba(0,255,255,0.12) 0%, transparent 70%)", size: "clamp(300px, 50vw, 700px)", top: "-30%", left: "-15%", delay: "0s", duration: "25s" },
      { gradient: "radial-gradient(circle, rgba(255,0,255,0.1) 0%, transparent 70%)", size: "clamp(250px, 45vw, 600px)", bottom: "-35%", right: "-20%", delay: "-8s", duration: "28s" },
      { gradient: "radial-gradient(circle, rgba(123,47,255,0.1) 0%, transparent 70%)", size: "clamp(220px, 40vw, 500px)", top: "40%", left: "60%", delay: "-16s", duration: "30s" },
      { gradient: "radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)", size: "clamp(200px, 35vw, 450px)", top: "10%", right: "30%", delay: "-22s", duration: "22s" },
    ];

    orbs.forEach(orb => {
      const el = document.createElement("div");
      el.style.cssText = `
        position: fixed; pointer-events: none; z-index: 0; border-radius: 50%;
        background: ${orb.gradient};
        width: ${orb.size}; height: ${orb.size};
        top: ${orb.top || 'auto'}; bottom: ${orb.bottom || 'auto'};
        left: ${orb.left || 'auto'}; right: ${orb.right || 'auto'};
        animation: nb-nebula-drift ${orb.duration} ease-in-out infinite alternate;
        animation-delay: ${orb.delay};
      `;
      document.body.appendChild(el);
    });

    const grid = document.createElement("div");
    const gridSize = window.innerWidth < 600 ? 30 : 50;
    grid.style.cssText = `
      position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background-image: 
        linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px);
      background-size: ${gridSize}px ${gridSize}px;
      animation: nb-grid-pulse 8s ease-in-out infinite;
    `;
    document.body.appendChild(grid);

    const scanLine = document.createElement("div");
    scanLine.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 2px; z-index: 1;
      pointer-events: none;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(0,255,255,0.3) 20%, 
        rgba(255,0,255,0.4) 50%, 
        rgba(0,255,255,0.3) 80%, 
        transparent 100%);
      animation: nb-scan-line 4s linear infinite;
      filter: blur(1px);
    `;
    document.body.appendChild(scanLine);

    const particlesContainer = document.createElement("div");
    particlesContainer.style.cssText = "position: fixed; inset: 0; pointer-events: none; z-index: 0;";
    const particleColors = ["#00ffff", "#ff00ff", "#7b2fff", "#00ff88", "#ff0066", "#ffaa00"];
    
    for (let i = 0; i < 40; i++) {
      const particle = document.createElement("div");
      const size = Math.random() * 3 + 1;
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      particle.style.cssText = `
        position: absolute;
        width: ${size}px; height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        box-shadow: 0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}66;
        animation: nb-particle-float ${Math.random() * 20 + 10}s linear infinite;
        animation-delay: ${Math.random() * 15}s;
      `;
      particlesContainer.appendChild(particle);
    }
    document.body.appendChild(particlesContainer);
  }

  // ── STATUS CHECK ──────────────────────────────────────
  async function checkStatus() {
    try {
      const r = await fetch(CONFIG.statusUrl + "?t=" + Date.now());
      return (await r.text()).trim() === "1";
    } catch { return false; }
  }

  // ── REDIRECT URL FETCH & VERIFY ──────────────────────
  async function fetchRedirectUrl() {
    try {
      const r = await fetch(CONFIG.redirectUrlFile + "?t=" + Date.now());
      const url = (await r.text()).trim();
      return (url && url.startsWith("http")) ? url : null;
    } catch { return null; }
  }

  async function verifyAndGetRedirectUrl() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(CONFIG.redirectUrlFile + "?t=" + Date.now(), {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error("Not found");
      
      const url = (await response.text()).trim();
      if (url && url.startsWith("http")) {
        return url;
      }
      throw new Error("Invalid URL");
    } catch (error) {
      console.log("[NEBULA] Redirect URL fetch failed, using fallback");
      return CONFIG.fallbackRedirectUrl;
    }
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
      background: rgba(0,255,255,0.06); 
      border: 1px solid rgba(0,255,255,0.25);
      color: var(--cyan); padding: 10px 24px; border-radius: 30px;
      font-size: 11px; font-family: 'Orbitron', sans-serif;
      letter-spacing: 2px; pointer-events: none;
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      animation: nb-toast-slide 0.3s ease;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s";
      setTimeout(() => toast.remove(), 300);
    }, 1500);
  }

  // ── RIPPLE EFFECT ────────────────────────────────────
  function triggerRipple(btn, ev, color = "rgba(0,255,255,0.4)") {
    const ripple = document.createElement("span");
    const rect = btn.getBoundingClientRect();
    let x = rect.width / 2, y = rect.height / 2;
    if (ev && ev.touches) { x = ev.touches[0].clientX - rect.left; y = ev.touches[0].clientY - rect.top; }
    else if (ev) { x = ev.clientX - rect.left; y = ev.clientY - rect.top; }
    ripple.style.cssText = `
      position: absolute; left: ${x}px; top: ${y}px;
      border-radius: 50%; background: ${color};
      transform: translate(-50%, -50%); pointer-events: none;
      animation: nb-ripple-effect 0.6s ease-out forwards;
    `;
    btn.style.position = "relative";
    btn.style.overflow = "hidden";
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 610);
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
        setTimeout(() => glitchText(el, text), 5000);
      }
      iter += 0.4;
    }, 35);
  }

  // ── PROGRESS BAR SYSTEM ────────────────────────────
  function startGlobalProgress(ms, onComplete) {
    const startTime = Date.now();
    
    function updateAllProgressBars(pct) {
      const bars = document.querySelectorAll('.nb-progress-fill');
      bars.forEach(bar => {
        bar.style.width = pct + "%";
      });
    }

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
    }, 50);

    updateAllProgressBars(0);
  }

  // ── GENERATE FAKE LOGS ──────────────────────────────
  function generateLogs() {
    const randomHex = n => [...Array(n)].map(() => Math.floor(Math.random() * 16).toString(16)).join("").toUpperCase();
    const randomIP = () => [1, 2, 3, 4].map(() => Math.floor(Math.random() * 256)).join(".");
    const randomPort = () => [22, 80, 443, 3306, 8080, 8443, 9090, 3000, 27017][Math.floor(Math.random() * 9)];
    const pid = Math.floor(Math.random() * 29000 + 1000);
    const sid = randomHex(8);
    const target = `aincrad-node-${Math.floor(Math.random() * 9 + 1)}.prime.cluster`;

    return [
      { t: `⬢ NEBULA v9.0.0 — Kernel injected (pid=${pid})`, c: "#00ffff", badge: "#00ffff" },
      { t: `⬢ Session handshake complete — 0x${sid}`, c: "#4dc9f6", badge: "#4dc9f6" },
      { t: `⬢ Entropy pool initialized — ${randomHex(8)}`, c: "#4dc9f6", badge: "#4dc9f6" },
      { t: `⬢ Target locked: ${target}`, c: "#7b2fff", badge: "#7b2fff" },
      { t: `⬢ DNS resolved → ${randomIP()} [TTL: 60s]`, c: "#7b2fff", badge: "#7b2fff" },
      { t: `⬢ Port scan initiated — ${randomIP()}/24`, c: "#00ff88", badge: "#00ff88" },
      { t: `⬢ ${randomPort()}/tcp OPEN — ssl/https`, c: "#00ff88", badge: "#00ff88" },
      { t: `⬢ ${randomPort()}/tcp OPEN — mysql`, c: "#00ff88", badge: "#00ff88" },
      { t: `⚠ CVE-2024-${Math.floor(Math.random() * 9000 + 1000)} — CVSS 9.8 CRITICAL`, c: "#ffaa00", badge: "#ffaa00" },
      { t: `⚠ Kernel exploit available — Linux 5.4.0-${Math.floor(Math.random() * 200 + 100)}`, c: "#ffaa00", badge: "#ffaa00" },
      { t: `▶ Exploit payload compiled (${Math.floor(Math.random() * 8 + 2)}KB)`, c: "#ff6600", badge: "#ff6600" },
      { t: `▶ Stack pivot @ 0x${randomHex(12)} — SUCCESS`, c: "#00ff88", badge: "#00ff88" },
      { t: `▶ ROP chain: ${Math.floor(Math.random() * 30 + 15)} gadgets linked`, c: "#ff6600", badge: "#ff6600" },
      { t: `▶ libc base: 0x${randomHex(12)} [+0x${randomHex(4)}]`, c: "#00ff88", badge: "#00ff88" },
      { t: `🔑 Brute-force: root@${randomIP()}:22`, c: "#00ffff", badge: "#00ffff" },
      { t: `🔑 Credentials found — root:${randomHex(10)} [#${Math.floor(Math.random() * 200 + 50)}]`, c: "#00ff88", badge: "#00ff88" },
      { t: `⬆ Privilege escalation — uid=1000 → uid=0`, c: "#ff0066", badge: "#ff0066" },
      { t: `⬆ Root access confirmed — euid=0`, c: "#ff0066", badge: "#ff0066" },
      { t: `🔒 TLS 1.3 handshake — ${randomHex(16)}`, c: "#4dc9f6", badge: "#4dc9f6" },
      { t: `🔒 Cipher: AES-256-GCM-SHA384 [PFS: X25519]`, c: "#4dc9f6", badge: "#4dc9f6" },
      { t: `🗄 Database connection — aincrad_production@${randomIP()}:3306`, c: "#7b2fff", badge: "#7b2fff" },
      { t: `🗄 Schema extracted — 47 tables`, c: "#7b2fff", badge: "#7b2fff" },
      { t: `💉 SQL injection — license_keys dump`, c: "#ffaa00", badge: "#ffaa00" },
      { t: `💉 Data exfiltrated: ${Math.floor(Math.random() * 5000 + 800)} rows [${Math.floor(Math.random() * 40 + 10)}MB]`, c: "#00ff88", badge: "#00ff88" },
      { t: `🧠 Memory dump — /proc/${pid}/mem`, c: "#4dc9f6", badge: "#4dc9f6" },
      { t: `🧠 AES-256 key recovered: ${randomHex(16)}`, c: "#00ff88", badge: "#00ff88" },
      { t: `🛡 IDS bypassed — Snort rule #${Math.floor(Math.random() * 99999)}`, c: "#ff6600", badge: "#ff6600" },
      { t: `🛡 Log sanitization — auth.log truncated`, c: "#888888", badge: "#888888" },
      { t: `🛡 utmp/wtmp entries patched`, c: "#888888", badge: "#888888" },
      { t: `📡 C2 beacon active — https://${randomIP()}/api/hb`, c: "#00ffff", badge: "#00ffff" },
      { t: `📡 Operator connection — ACK received`, c: "#00ff88", badge: "#00ff88" },
      { t: `◆ EXPLOIT COMPLETE — Session 0x${sid}`, c: "#00ff88", badge: "#00ff88" },
      { t: `◆ AINCRAD FULLY COMPROMISED ⬡`, c: "#ff0066", badge: "#ff0066" },
    ];
  }

  // ── RENDER LOGS INSTANTLY ────────────────────────────
  function renderLogs(logs, container, totalDuration) {
    const delayPerLog = Math.floor(totalDuration / logs.length);
    
    logs.forEach((log, index) => {
      setTimeout(() => {
        const wrap = document.createElement("div");
        wrap.style.cssText = `
          display: flex; align-items: flex-start; gap: 8px; 
          margin-bottom: 2px; padding: 2px 4px;
          animation: nb-log-enter 0.15s ease;
        `;

        const badge = document.createElement("span");
        badge.style.cssText = `
          min-width: 3px; align-self: stretch; 
          background: ${log.badge || log.c};
          border-radius: 2px; flex-shrink: 0; opacity: 0.9;
          box-shadow: 0 0 6px ${log.badge || log.c}66;
        `;
        wrap.appendChild(badge);

        const line = document.createElement("span");
        line.textContent = log.t;
        line.style.cssText = `
          color: ${log.c}; 
          font-size: clamp(7.5px, 1.4vw, 9px);
          font-family: 'JetBrains Mono', 'Courier New', monospace; 
          letter-spacing: 0.3px; line-height: 1.6; 
          word-break: break-all;
          text-shadow: 0 0 4px ${log.c}33;
        `;
        wrap.appendChild(line);
        container.appendChild(wrap);
        container.scrollTop = container.scrollHeight;
      }, index * delayPerLog);
    });
  }

  // ── RENDER SUCCESS SCREEN ────────────────────────────
  function renderSuccessScreen(redirectUrl) {
    if (isRedirecting) return;
    isRedirecting = true;

    const existingWrapper = document.getElementById("nb-wrapper");
    if (existingWrapper) existingWrapper.remove();

    if (redirectTimeout) clearTimeout(redirectTimeout);
    if (globalProgressInterval) clearInterval(globalProgressInterval);
    if (autoInitTimeout) clearTimeout(autoInitTimeout);

    const wrapper = document.createElement("div");
    wrapper.id = "nb-wrapper";
    wrapper.style.cssText = `
      position: fixed; inset: 0; z-index: 2147483647;
      display: grid; place-items: center; padding: 20px;
    `;

    const panel = document.createElement("div");
    panel.style.cssText = `
      background: var(--glass-bg);
      backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);
      border: 1.5px solid var(--glass-border);
      border-radius: clamp(20px, 4vw, 28px);
      padding: clamp(28px, 5vw, 40px);
      width: min(420px, 92vw); box-sizing: border-box;
      text-align: center; position: relative; overflow: hidden;
      box-shadow: 0 0 80px rgba(0,255,255,0.1), 
                 0 0 160px rgba(255,0,255,0.05),
                 0 20px 60px rgba(0,0,0,0.5);
      animation: nb-success-pulse 2s ease-in-out infinite, nb-fade-in-up 0.5s ease;
    `;

    panel.innerHTML = `
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 2px;
        background: linear-gradient(90deg, transparent, var(--cyan), var(--emerald), transparent);
        opacity: 0.5;"></div>
      
      <div style="font-size: clamp(48px, 10vw, 72px); margin-bottom: 20px;
        filter: drop-shadow(0 0 20px rgba(0,255,136,0.5));">⬡</div>
      
      <h2 style="margin: 0 0 16px; font-size: clamp(20px, 5vw, 28px); font-weight: 900;
        font-family: 'Orbitron', sans-serif; letter-spacing: 4px;
        background: linear-gradient(135deg, var(--cyan), var(--emerald), var(--cyan));
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text; text-transform: uppercase;
        filter: drop-shadow(0 0 10px rgba(0,255,255,0.3));">EXPLOIT SUCCESSFUL</h2>
      
      <p style="color: var(--cyan); font-size: clamp(9px, 2vw, 11px); 
        letter-spacing: 3px; margin-bottom: 8px; opacity: 0.9;
        font-family: 'Orbitron', sans-serif;">◆ NEBULA ENGINE v9.0.0</p>
      
      <p style="color: rgba(255,255,255,0.5); font-size: clamp(8px, 1.6vw, 10px); 
        margin-bottom: 20px; font-family: 'JetBrains Mono', monospace;">
        Target compromised. Redirecting...</p>
      
      <div style="width: 80px; height: 2px; 
        background: linear-gradient(90deg, transparent, var(--emerald), transparent); 
        margin: 16px auto;"></div>
      
      <p id="nb-redirect-countdown" style="color: rgba(255,255,255,0.4); 
        font-size: 11px; margin-top: 16px; font-family: 'Orbitron', sans-serif;
        letter-spacing: 2px;">Redirecting in 3s...</p>
      
      <div style="margin-top: 24px;">
        <span style="font-size: clamp(8px, 2vw, 10px); font-family: 'Orbitron', sans-serif;
          font-weight: 700; letter-spacing: 4px; color: var(--cyan);
          animation: nb-author-glow 4s ease-in-out infinite; 
          text-transform: uppercase;">Abdullah Al Mamun</span>
        <div style="font-size: 7px; color: rgba(255,255,255,0.2); margin-top: 6px; 
          letter-spacing: 1px;">@A2MBD3 — NEBULA COSMIC</div>
      </div>
    `;

    wrapper.appendChild(panel);
    document.body.appendChild(wrapper);

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

  // ── IMMEDIATE REDIRECT ───────────────────────────────
  function immediateRedirect(url) {
    if (isRedirecting) return;
    isRedirecting = true;

    const existingWrapper = document.getElementById("nb-wrapper");
    if (existingWrapper) existingWrapper.remove();

    if (redirectTimeout) clearTimeout(redirectTimeout);
    if (globalProgressInterval) clearInterval(globalProgressInterval);
    if (autoInitTimeout) clearTimeout(autoInitTimeout);

    window.location.href = url;
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
      background: var(--glass-bg);
      backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);
      border: 1.5px solid rgba(255,0,100,0.25);
      border-radius: clamp(20px, 4vw, 28px);
      padding: clamp(24px, 5vw, 36px); text-align: center;
      width: min(380px, 92vw); box-sizing: border-box;
      box-shadow: 0 0 80px rgba(255,0,100,0.06), 0 20px 60px rgba(0,0,0,0.5);
      animation: nb-fade-in-up 0.4s ease;
    `;

    panel.innerHTML = `
      <div style="font-size: clamp(48px, 10vw, 64px); margin-bottom: 16px;
        filter: drop-shadow(0 0 15px rgba(255,0,100,0.4));">⚠</div>
      <h3 style="margin: 0 0 10px; background: linear-gradient(135deg, #ff0066, #ff6600);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        font-size: clamp(18px, 5vw, 24px); font-weight: 800;
        font-family: 'Orbitron', sans-serif; letter-spacing: 5px;">NEBULA OUTDATED</h3>
      <p style="color: rgba(255,255,255,0.4); font-size: 10px; margin-bottom: 20px;
        font-family: 'JetBrains Mono', monospace;">SIGNATURE_MISMATCH</p>
      <button id="nb-update-btn" style="
        width: 100%; background: rgba(255,0,100,0.06); color: #ff0066;
        border: 1.5px solid rgba(255,0,100,0.3); padding: clamp(12px, 3vw, 16px);
        border-radius: 14px; font-weight: 700; cursor: pointer;
        font-family: 'Orbitron', sans-serif; font-size: clamp(11px, 2.5vw, 13px);
        letter-spacing: 4px; transition: all 0.3s;
        backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
        box-shadow: 0 4px 24px rgba(255,0,100,0.1);">⬇ DOWNLOAD LATEST</button>
      <div style="margin-top: 20px;">
        <span style="font-size: clamp(9px, 2vw, 11px); font-family: 'Orbitron', sans-serif;
          font-weight: 700; letter-spacing: 4px; color: #ff0066;
          text-shadow: 0 0 10px rgba(255,0,100,0.5);">Abdullah Al Mamun</span>
        <div style="font-size: 7px; color: rgba(255,255,255,0.2); margin-top: 6px;">@A2MBD3</div>
      </div>
    `;

    wrapper.appendChild(panel);
    document.body.appendChild(wrapper);

    document.getElementById("nb-update-btn").addEventListener("click", () => {
      window.open(CONFIG.telegramUrl, "_blank");
    });
  }

  // ── CREATE PROGRESS BAR HTML ──────────────────────────
  function createProgressBarHTML() {
    return `
      <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; 
        background: rgba(255,255,255,0.02); backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);">
        <div class="nb-progress-fill" style="
          height: 100%; width: 0%; 
          background: linear-gradient(90deg, 
            var(--cyan) 0%, 
            var(--violet) 30%, 
            var(--magenta) 60%, 
            var(--emerald) 100%);
          background-size: 200% 100%;
          border-radius: 0 0 0 clamp(16px, 3vw, 22px);
          animation: nb-progress-aurora 4s linear infinite;
          transition: width 0.05s linear;
        "></div>
      </div>
    `;
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
      background: var(--glass-bg);
      backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);
      border: 1.5px solid var(--glass-border);
      border-radius: clamp(20px, 4vw, 28px);
      padding: clamp(20px, 5vw, 28px); 
      width: min(420px, 92vw); box-sizing: border-box;
      position: relative; overflow: hidden; text-align: center;
      animation: nb-border-aurora 8s ease-in-out infinite, nb-fade-in-up 0.5s ease;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    `;

    panel.innerHTML = `
      ${createProgressBarHTML()}

      <button id="nb-music-btn" style="
        position: absolute; top: 14px; right: 14px; 
        width: 38px; height: 38px;
        border-radius: 50%; 
        background: rgba(0,255,255,0.04);
        border: 1px solid rgba(0,255,255,0.2); 
        color: var(--cyan);
        font-size: 16px; cursor: pointer; 
        display: flex; align-items: center;
        justify-content: center; z-index: 5; 
        transition: all 0.3s;
        backdrop-filter: blur(10px); 
        -webkit-backdrop-filter: blur(10px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);">♪</button>
      
      <div style="font-size: clamp(7px, 1.4vw, 8px); 
        color: rgba(0,255,255,0.4); letter-spacing: 6px; margin-bottom: 8px;
        font-family: 'Orbitron', sans-serif; font-weight: 300;">NEBULA.DIRECT</div>
      
      <h1 id="nb-glitch-title" style="
        margin: 0 0 6px; 
        font-size: clamp(26px, 7vw, 36px); font-weight: 900;
        font-family: 'Orbitron', sans-serif; letter-spacing: 4px;
        background: linear-gradient(135deg, var(--cyan) 0%, var(--violet) 40%, var(--magenta) 70%, var(--crimson) 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text; 
        animation: nb-title-glitch 6s infinite; line-height: 1.2;
        filter: drop-shadow(0 0 8px rgba(0,255,255,0.2));">A2MBD3</h1>
      
      <div style="width: 60px; height: 2px; 
        background: linear-gradient(90deg, transparent, var(--magenta), transparent); 
        margin: 12px auto;"></div>
      
      <p style="color: var(--cyan); font-size: clamp(9px, 2vw, 10px); 
        letter-spacing: 4px; margin-bottom: 16px;
        font-family: 'Orbitron', sans-serif; font-weight: 300;">◆ SYSTEM READY</p>
      
      <div id="nb-track-name" style="min-height: 18px; margin-bottom: 16px; 
        font-size: clamp(7.5px, 1.6vw, 8.5px); 
        color: rgba(255,255,255,0.25); letter-spacing: 1px;
        font-family: 'JetBrains Mono', monospace;"></div>
      
      <button id="nb-init-btn" style="
        display: block; width: 100%; 
        background: rgba(0,255,255,0.04);
        border: 1.5px solid rgba(0,255,255,0.25); 
        color: #fff;
        padding: clamp(12px, 3vw, 16px); border-radius: 14px;
        font-weight: 700; cursor: pointer; 
        font-family: 'Orbitron', sans-serif;
        font-size: clamp(11px, 2.5vw, 13px); letter-spacing: 5px;
        margin-bottom: 12px; 
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px); 
        transition: all 0.3s;
        box-shadow: 0 4px 24px rgba(0,0,0,0.3);
        text-transform: uppercase;">⬡ INITIATE NEBULA</button>
      
      <button id="nb-supp-btn" style="
        display: block; width: 100%; 
        background: rgba(255,0,255,0.03);
        border: 1.5px solid rgba(255,0,255,0.15); 
        color: rgba(255,255,255,0.5);
        padding: clamp(12px, 3vw, 16px); border-radius: 14px;
        font-weight: 600; cursor: pointer; 
        font-family: 'Orbitron', sans-serif;
        font-size: clamp(11px, 2.5vw, 13px); letter-spacing: 4px;
        backdrop-filter: blur(12px); 
        -webkit-backdrop-filter: blur(12px);
        transition: all 0.3s; margin-bottom: 18px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.3);">⚡ Telegram</button>
      
      <div>
        <span style="font-size: clamp(9px, 2vw, 11px); 
          font-family: 'Orbitron', sans-serif;
          font-weight: 700; letter-spacing: 4px; color: var(--cyan);
          animation: nb-author-glow 5s ease-in-out infinite; 
          text-transform: uppercase;">Abdullah Al Mamun</span>
        <div style="font-size: 7px; color: rgba(255,255,255,0.15); 
          margin-top: 6px; letter-spacing: 1px;
          font-family: 'JetBrains Mono', monospace;">@A2MBD3 · 📳 Shake = Next Track</div>
      </div>
    `;

    wrapper.appendChild(panel);
    document.body.appendChild(wrapper);

    setTimeout(() => glitchText(document.getElementById("nb-glitch-title"), "A2MBD3"), 1000);

    // Start 30-second global progress
    startGlobalProgress(CONFIG.totalTime, () => {
      const initBtn = document.getElementById("nb-init-btn");
      if (initBtn && !initBtn.disabled) {
        initBtn.click();
      }
    });

    // Music button setup
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

    addRipple(musicBtn, "rgba(0,255,255,0.4)");
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

    const suppBtn = document.getElementById("nb-supp-btn");
    addRipple(suppBtn, "rgba(255,0,255,0.4)");
    suppBtn.addEventListener("click", () => {
      window.open(CONFIG.telegramUrl, "_blank");
    });

    // Init button - now triggers exploit panel immediately
    const initBtn = document.getElementById("nb-init-btn");
    addRipple(initBtn, "rgba(0,255,255,0.4)");
    
    const initiateExploit = () => {
      if (initBtn.disabled) return;
      initBtn.disabled = true;
      suppBtn.disabled = true;
      initBtn.textContent = "◆ INITIALIZING...";
      initBtn.style.opacity = "0.6";

      // Clear auto-init timeout since user clicked
      if (autoInitTimeout) clearTimeout(autoInitTimeout);

      panel.style.transition = "all 0.5s ease";
      panel.style.opacity = "0";
      panel.style.transform = "scale(0.92)";
      panel.style.filter = "blur(8px)";

      setTimeout(() => {
        wrapper.remove();
        renderExploitPanel();
      }, 500);
    };

    initBtn.addEventListener("click", initiateExploit);

    // Auto-init after 10 seconds
    autoInitTimeout = setTimeout(() => {
      const btn = document.getElementById("nb-init-btn");
      if (btn && !btn.disabled) {
        btn.click();
      }
    }, CONFIG.autoInitDelay);
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
      background: var(--glass-bg);
      backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);
      border: 1.5px solid var(--glass-border);
      border-radius: clamp(20px, 4vw, 28px);
      padding: clamp(16px, 3vw, 22px); 
      width: min(500px, 95vw); box-sizing: border-box;
      position: relative; overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5),
                  0 0 80px rgba(0,255,255,0.04);
      animation: nb-border-aurora 8s ease-in-out infinite, nb-fade-in-up 0.4s ease;
    `;

    panel.innerHTML = `
      ${createProgressBarHTML()}

      <div style="display: flex; justify-content: space-between; align-items: flex-start; 
        margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
        <div>
          <div style="font-size: 7px; color: var(--amber); letter-spacing: 4px; margin-bottom: 4px;
            font-family: 'Orbitron', sans-serif; font-weight: 300;">NEBULA EXPLOIT ENGINE</div>
          <div id="nb-exploit-title" style="
            font-size: clamp(15px, 4vw, 20px); font-weight: 900; letter-spacing: 3px;
            background: linear-gradient(135deg, var(--cyan), var(--crimson));
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text; 
            animation: nb-title-glitch 5s infinite;
            font-family: 'Orbitron', sans-serif;">RUNNING...</div>
        </div>
        <div style="text-align: right;">
          <div id="nb-exploit-track" style="color: rgba(255,255,255,0.25); font-size: 7.5px; 
            font-family: 'Orbitron', sans-serif; max-width: 130px; letter-spacing: 1px;"></div>
          <div style="font-size: 6.5px; color: rgba(255,255,255,0.1); margin-top: 4px;
            font-family: 'JetBrains Mono', monospace;">
            <span style="color: var(--cyan); text-shadow: 0 0 8px rgba(0,255,255,0.3); 
              font-family: 'Orbitron', sans-serif; font-weight: 700;">Abdullah Al Mamun</span>
          </div>
        </div>
      </div>

      <div style="background: rgba(0,0,0,0.4); 
        border: 1px solid rgba(0,255,255,0.06); 
        border-radius: 10px; padding: 12px 10px 8px; 
        backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
        box-shadow: inset 0 0 30px rgba(0,0,0,0.3);">
        <div style="display: flex; gap: 7px; margin-bottom: 10px; align-items: center;">
          <span style="width: 9px; height: 9px; border-radius: 50%; background: #ff0066; 
            opacity: 0.8; box-shadow: 0 0 6px #ff0066;"></span>
          <span style="width: 9px; height: 9px; border-radius: 50%; background: #ffaa00; 
            opacity: 0.8; box-shadow: 0 0 6px #ffaa00;"></span>
          <span style="width: 9px; height: 9px; border-radius: 50%; background: #00ff88; 
            opacity: 0.8; box-shadow: 0 0 6px #00ff88;"></span>
          <span style="font-size: 7px; color: rgba(255,255,255,0.15); margin-left: 8px; 
            font-family: 'JetBrains Mono', monospace;">nebula@aincrad ~ ./exploit.sh</span>
        </div>
        <div id="nb-log-container" style="
          overflow-y: auto; max-height: 55vh;
          scrollbar-width: none; -ms-overflow-style: none;
          font-family: 'JetBrains Mono', monospace;"></div>
      </div>
    `;

    wrapper.appendChild(panel);
    document.body.appendChild(wrapper);

    const logContainer = document.getElementById("nb-log-container");
    logContainer.style.cssText += "::-webkit-scrollbar { display: none; }";

    // Continue progress from where init left off (30 seconds total)
    const remainingTime = CONFIG.totalTime - CONFIG.autoInitDelay;
    startGlobalProgress(remainingTime);

    setTimeout(() => glitchText(document.getElementById("nb-exploit-title"), "RUNNING..."), 300);

    updateTrackDisplay = () => {
      const el = document.getElementById("nb-exploit-track");
      if (!el || !musicList.length) return;
      try {
        const name = decodeURIComponent(musicList[currentTrackIndex].split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));
        el.textContent = "♫ " + (name.length > 20 ? name.slice(0, 20) + "…" : name);
      } catch { el.textContent = "♫ Track " + (currentTrackIndex + 1); }
    };
    updateTrackDisplay();

    // Render logs
    const logs = generateLogs();
    renderLogs(logs, logContainer, remainingTime - 500);

    // Verify redirect URL in background while showing logs
    (async () => {
      const redirectUrl = await verifyAndGetRedirectUrl();
      
      // Schedule redirect based on remaining time
      if (redirectTimeout) clearTimeout(redirectTimeout);
      redirectTimeout = setTimeout(() => {
        if (redirectUrl === CONFIG.fallbackRedirectUrl) {
          // Fallback - immediate redirect without success screen
          immediateRedirect(redirectUrl);
        } else {
          // Normal redirect with success screen
          renderSuccessScreen(redirectUrl);
        }
      }, remainingTime);
    })();
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