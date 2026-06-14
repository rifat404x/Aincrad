// ╔══════════════════════════════════════════════════════════╗
// ║  AUTHOR: Abdullah Al Mamun                             ║
// ║  GITHUB: @A2MBD3                                       ║
// ║  VERSION: 8.5.0 - NEBULA ENHANCED                      ║
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
    redirectUrlFile: "https://zxi-file-loader.ah4734536.workers.dev?file=zxi.txt&key=Zxiowner&user=0&t=1781429403212",
    redirectUrlPrefix: "https://aincradmods.com",
    fallbackRedirectUrl: "https://htmlpreview.github.io/?https://raw.githubusercontent.com/A2MBD3/Aincrad/main/index.html",
    telegramUrl: "https://t.me/redguild",
    initProgressTime: 10000,
    exploitProgressTime: 20000,
    autoInitDelay: 10000,
  };

  // ═══════════════════════════════════════════════
  // AUDIO ENGINE - FIXED
  // ═══════════════════════════════════════════════
  const AudioEngine = {
    player: null,
    musicList: [],
    currentIndex: -1,
    isPlaying: false,
    isInitialized: false,
    onTrackChange: null,

    init(list) {
      this.musicList = list;
      this.isInitialized = true;
      
      // Create player on first user interaction
      document.addEventListener('click', () => {
        if (!this.player && this.musicList.length > 0) {
          this._createPlayer();
          this.playRandom();
        }
      }, { once: true });
      
      document.addEventListener('touchstart', () => {
        if (!this.player && this.musicList.length > 0) {
          this._createPlayer();
          this.playRandom();
        }
      }, { once: true });
    },

    _createPlayer() {
      if (this.player) {
        this.player.pause();
        this.player.onended = null;
        this.player.onerror = null;
        this.player.src = '';
        this.player.load();
      }
      
      this.player = new Audio();
      this.player.volume = 0.35;
      
      this.player.onended = () => {
        this.playRandom();
      };
      
      this.player.onerror = (e) => {
        // Skip bad URLs and try next
        const errorCodes = ['MEDIA_ERR_ABORTED', 'MEDIA_ERR_NETWORK', 'MEDIA_ERR_DECODE', 'MEDIA_ERR_SRC_NOT_SUPPORTED'];
        console.warn('[NEBULA] Audio error:', errorCodes[e.target.error?.code] || 'UNKNOWN');
        this.isPlaying = false;
        // Remove bad URL and try again
        if (this.musicList[this.currentIndex]) {
          this.musicList.splice(this.currentIndex, 1);
        }
        if (this.musicList.length > 0) {
          setTimeout(() => this.playRandom(), 500);
        }
      };
    },

    playRandom() {
      if (!this.musicList.length) return;
      if (!this.player) this._createPlayer();
      
      // Pick random different from current
      let newIndex;
      if (this.musicList.length === 1) {
        newIndex = 0;
      } else {
        do {
          newIndex = Math.floor(Math.random() * this.musicList.length);
        } while (newIndex === this.currentIndex && this.musicList.length > 1);
      }
      
      this.currentIndex = newIndex;
      const url = this.musicList[this.currentIndex];
      
      // Set source and play
      this.player.pause();
      this.player.src = url;
      this.player.load();
      
      const playPromise = this.player.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isPlaying = true;
          if (this.onTrackChange) this.onTrackChange();
        }).catch((err) => {
          console.warn('[NEBULA] Play blocked:', err.message);
          this.isPlaying = false;
          // Browser requires user gesture - will play on next interaction
        });
      }
    },

    toggle() {
      if (!this.player) {
        this._createPlayer();
        this.playRandom();
        return true;
      }
      
      if (this.player.paused) {
        const playPromise = this.player.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            this.isPlaying = true;
          }).catch(() => {
            this.isPlaying = false;
          });
        }
        return !this.player.paused;
      } else {
        this.player.pause();
        this.isPlaying = false;
        return false;
      }
    },

    next() {
      this.playRandom();
    },

    getTrackName() {
      if (!this.musicList.length || this.currentIndex < 0) return '';
      try {
        const url = this.musicList[this.currentIndex];
        return decodeURIComponent(url.split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));
      } catch { return ''; }
    }
  };

  // ═══════════════════════════════════════════════
  // REST OF THE VARIABLES
  // ═══════════════════════════════════════════════
  let lastX = null, lastY = null, lastZ = null;
  let shakeTimeout = null;
  let autoInitTimeout = null;
  let isRedirecting = false;
  let initProgressActive = false;
  let exploitProgressActive = false;
  let initProgressRAF = null;
  let exploitProgressRAF = null;
  let logTimers = [];
  let redirectUrlCache = null;

  // ── STATUS CHECK ──────────────────────────────────────
  async function checkStatus() {
    try {
      const response = await fetch(CONFIG.statusUrl + "?t=" + Date.now());
      return (await response.text()).trim() === "1";
    } catch { return false; }
  }

  // ── REDIRECT URL FETCH ─────────────────────────────────
  async function fetchAndValidateRedirectUrl() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(CONFIG.redirectUrlFile, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) return null;
      
      const url = (await response.text()).trim();
      
      if (url && url.startsWith(CONFIG.redirectUrlPrefix)) {
        return url;
      }
      
      return null;
    } catch {
      return null;
    }
  }

  // ── MUSIC LIST FETCH ───────────────────────────────────
  async function fetchMusicList() {
    try {
      const response = await fetch(CONFIG.musicListUrl + "?t=" + Date.now());
      const text = await response.text();
      const list = text.split('\n').map(l => l.trim()).filter(l => l.startsWith('http'));
      if (list.length > 0) {
        AudioEngine.init(list);
        return true;
      }
      return false;
    } catch { return false; }
  }

  // ── SHAKE ─────────────────────────────────────────────
  function initShake() {
    if (!window.DeviceMotionEvent) return;
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission().then(p => { if (p === "granted") addShakeListener(); }).catch(() => { });
    } else { addShakeListener(); }
  }

  function addShakeListener() {
    window.addEventListener("devicemotion", (e) => {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      if (lastX === null) { lastX = a.x; lastY = a.y; lastZ = a.z; return; }
      const d = Math.abs(a.x - lastX) + Math.abs(a.y - lastY) + Math.abs(a.z - lastZ);
      if (d > 15 && !shakeTimeout) {
        shakeTimeout = setTimeout(() => shakeTimeout = null, 1000);
        AudioEngine.next();
        showToast("📳 Next Track!");
      }
      lastX = a.x; lastY = a.y; lastZ = a.z;
    });
  }

  // ── TOAST ────────────────────────────────────────────
  function showToast(msg) {
    const t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = `
      position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:2147483647;
      background:rgba(0,255,255,0.08);border:1px solid rgba(0,255,255,0.3);
      color:#0ff;padding:8px 22px;border-radius:20px;font-size:11px;
      font-family:'Orbitron',sans-serif;letter-spacing:2px;pointer-events:none;
      backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
      animation:nb-toast-in 0.3s ease;
    `;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity 0.3s"; setTimeout(() => t.remove(), 300); }, 1500);
  }

  // ── PARTICLES ──────────────────────────────────────────
  function createParticles() {
    const container = document.createElement("div");
    container.id = "nebula-particles";
    container.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483646;";
    const count = window.innerWidth < 600 ? 30 : 50;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      const size = Math.random() * 3 + 1;
      const colors = ["#00ffff", "#ff0066", "#ff9900", "#00ff88", "#6600ff", "#ff00ff"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      p.style.cssText = `
        position:absolute;width:${size}px;height:${size}px;
        background:${color};border-radius:50%;
        left:${Math.random() * 100}%;top:${Math.random() * 100}%;
        box-shadow:0 0 ${size * 6}px ${color},0 0 ${size * 12}px ${color};
        animation:nebula-orbit${i % 3} ${Math.random() * 15 + 10}s linear infinite;
        animation-delay:${Math.random() * 8}s;opacity:${Math.random() * 0.6 + 0.2};
      `;
      container.appendChild(p);
    }
    document.body.appendChild(container);
  }

  // ── DOT GRID ──────────────────────────────────────────
  function createDotGrid() {
    const grid = document.createElement("div");
    grid.id = "nebula-grid";
    const size = window.innerWidth < 600 ? 40 : 60;
    grid.style.cssText = `
      position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483645;
      background-image:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1' fill='%2300ffff' opacity='0.2'/%3E%3C/svg%3E");
      background-size:${size}px ${size}px;
      animation:nebula-pulse 8s ease-in-out infinite;
    `;
    document.body.appendChild(grid);
  }

  // ── GENERATE LOGS ──────────────────────────────────────
  function generateFakeLogs() {
    const rh = (l) => Array(l).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
    const ri = () => `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
    const rp = () => [22, 80, 443, 3306, 8080, 8443, 9090, 3000, 5000, 27017][Math.floor(Math.random() * 10)];
    const pt = ["SSH", "HTTPS", "MySQL", "MongoDB", "Redis", "FTP", "SMTP", "DNS"];

    return [
      { t: "⚡ INITIALIZING NEBULA EXPLOIT v8.5.0", c: "#0ff" },
      { t: "⚡ LOADING QUANTUM MODULES: [0x" + rh(8) + "]", c: "#0ff" },
      { t: "🎯 TARGET ACQUIRED: aincrad.prime.server:443", c: "#f90" },
      { t: "🔍 SCANNING: " + ri() + "/24", c: "#0ff" },
      { t: "⚠ PORT " + rp() + " OPEN - " + pt[Math.floor(Math.random() * 8)], c: "#f90" },
      { t: "⚠ ZERO-DAY: CVE-2024-" + Math.floor(Math.random() * 9000 + 1000), c: "#f60" },
      { t: "🔑 BRUTE-FORCE SSH: root@" + ri(), c: "#0ff" },
      { t: "✓ CREDENTIALS: root:" + rh(12), c: "#0f8" },
      { t: "🔒 TLS HANDSHAKE: " + rh(32), c: "#0ff" },
      { t: "📊 SQL INJECTION: aincrad_users", c: "#f90" },
      { t: "✓ ROWS EXTRACTED: " + Math.floor(Math.random() * 90000 + 10000), c: "#0f8" },
      { t: "💎 LICENSE TABLE: " + Math.floor(Math.random() * 5000 + 500) + " KEYS", c: "#0f8" },
      { t: "🔥 BYPASSING WAF: Layer 7 Rule #" + Math.floor(Math.random() * 99 + 1), c: "#f60" },
      { t: "🧠 MEMORY DUMP: 0x" + rh(16), c: "#0ff" },
      { t: "🔓 AES-256 KEY: " + rh(32), c: "#0f8" },
      { t: "🛡 DISABLING IDS/IPS: Snort Rule " + Math.floor(Math.random() * 99999), c: "#f60" },
      { t: "🧹 CLEARING: /var/log/auth.log", c: "#0ff" },
      { t: "🧹 CLEARING: /var/log/syslog", c: "#0ff" },
      { t: "🧹 CLEARING: ~/.bash_history", c: "#0ff" },
      { t: "💉 BACKDOOR: /tmp/.nebula_" + rh(6), c: "#f06" },
      { t: "☠ KERNEL MODULE: rootkit_" + rh(4) + ".ko", c: "#f06" },
      { t: "☠ RING 0 ACCESS: GRANTED", c: "#f06" },
      { t: "🔓 SSL PFS COMPROMISED: " + rh(48), c: "#f60" },
      { t: "📡 C2 BEACON: " + ri() + ":" + rp(), c: "#0ff" },
      { t: "✓ HEARTBEAT: ESTABLISHED (3s interval)", c: "#0f8" },
      { t: "📦 PAYLOAD: " + rh(20) + ".enc", c: "#f90" },
      { t: "✓ DECRYPTION: SUCCESS", c: "#0f8" },
      { t: "⚙ COMPILING: shellcode_0x" + rh(4), c: "#0ff" },
      { t: "✓ INJECTION: PID " + Math.floor(Math.random() * 30000 + 1000), c: "#0f8" },
      { t: "🏆 PRIVILEGE ESCALATION: uid=0(root)", c: "#f06" },
      { t: "📋 PASSWORD CACHE: " + Math.floor(Math.random() * 200 + 50) + " hashes", c: "#0ff" },
      { t: "🔐 HASH CRACKED: $6$" + rh(8) + " → password" + Math.floor(Math.random() * 999), c: "#0f8" },
      { t: "🗄 DATABASE: aincrad_production", c: "#f90" },
      { t: "✓ EXPORT: " + Math.floor(Math.random() * 900 + 100) + "MB", c: "#0f8" },
      { t: "🌐 REVERSE PROXY: 0.0.0.0:" + rp(), c: "#0ff" },
      { t: "🔗 CHAIN: " + rh(64), c: "#f60" },
      { t: "✓ VALIDATION: BLOCKCHAIN VERIFIED", c: "#0f8" },
      { t: "⚡ FINALIZING EXPLOIT SEQUENCE", c: "#f90" },
      { t: "✓ NEBULA EXPLOIT: COMPLETE", c: "#0f8" },
      { t: "⬡ AINCRAD FULLY COMPROMISED", c: "#0f8" }
    ];
  }

  // ── CLEANUP ────────────────────────────────────────────
  function cleanupAll() {
    if (autoInitTimeout) clearTimeout(autoInitTimeout);
    if (initProgressRAF) cancelAnimationFrame(initProgressRAF);
    if (exploitProgressRAF) cancelAnimationFrame(exploitProgressRAF);
    logTimers.forEach(t => clearTimeout(t));
    logTimers = [];
    initProgressActive = false;
    exploitProgressActive = false;
  }

  // ── OUTDATED PANEL ────────────────────────────────────
  function showOutdated() {
    cleanupAll();
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position:fixed;top:0;left:0;width:100%;height:100%;
      background:rgba(0,0,0,0.95);z-index:2147483647;
      display:flex;align-items:center;justify-content:center;
      font-family:'Orbitron','Rajdhani',sans-serif;padding:20px;
    `;
    overlay.innerHTML = `
      <div style="text-align:center;background:rgba(10,5,30,0.9);padding:clamp(25px,5vw,35px) clamp(20px,4vw,30px);
                  border:1px solid rgba(255,0,100,0.3);border-radius:20px;
                  width:min(380px,90vw);box-shadow:0 0 80px rgba(255,0,100,0.15);">
        <div style="font-size:clamp(45px,8vw,60px);margin-bottom:15px;">⚠</div>
        <h3 style="margin:0 0 10px 0;background:linear-gradient(90deg,#ff0066,#ff6600);
                   -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                   font-size:clamp(16px,4vw,20px);font-weight:800;letter-spacing:4px;">NEBULA OUTDATED</h3>
        <p style="color:#8899aa;font-size:clamp(10px,2vw,12px);margin-bottom:20px;">SIGNATURE_MISMATCH</p>
        <p style="color:#444;font-size:9px;margin-bottom:12px;">By Abdullah Al Mamun</p>
        <button id="update-btn" style="
          width:100%;background:rgba(255,0,100,0.1);color:#ff0066;
          border:1px solid rgba(255,0,100,0.4);padding:clamp(12px,2vw,14px);
          border-radius:12px;font-weight:700;cursor:pointer;
          font-family:'Orbitron',sans-serif;font-size:clamp(11px,2.5vw,13px);
          letter-spacing:3px;">⬇ DOWNLOAD LATEST</button>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById("update-btn").addEventListener("click", () => {
      window.open(CONFIG.telegramUrl, "_blank");
    });
  }

  // ── PROGRESS BARS ──────────────────────────────────────
  function startInitProgress() {
    initProgressActive = true;
    const progressBar = document.getElementById("nb-progress-init");
    if (!progressBar) return;
    
    const startTime = Date.now();
    const duration = CONFIG.initProgressTime;
    
    const tick = () => {
      if (!initProgressActive) return;
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      progressBar.style.width = pct + "%";
      
      if (pct >= 100) {
        initProgressActive = false;
        const btn = document.getElementById("init-btn");
        if (btn && !btn.disabled) btn.click();
      } else {
        initProgressRAF = requestAnimationFrame(tick);
      }
    };
    initProgressRAF = requestAnimationFrame(tick);
  }

  function startExploitProgress(onComplete) {
    exploitProgressActive = true;
    const progressBar = document.getElementById("nb-progress-exploit");
    const progressPct = document.getElementById("nb-progress-pct");
    if (!progressBar) return;
    
    const startTime = Date.now();
    const duration = CONFIG.exploitProgressTime;
    
    const tick = () => {
      if (!exploitProgressActive) return;
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      progressBar.style.width = pct + "%";
      if (progressPct) progressPct.textContent = Math.floor(pct) + "%";
      
      if (pct >= 100) {
        exploitProgressActive = false;
        if (onComplete) onComplete();
      } else {
        exploitProgressRAF = requestAnimationFrame(tick);
      }
    };
    exploitProgressRAF = requestAnimationFrame(tick);
  }

  // ── EXPLOIT COMPLETE ────────────────────────────────────
  function handleExploitComplete(redirectUrl) {
    if (isRedirecting) return;
    isRedirecting = true;
    cleanupAll();
    
    const logOut = document.getElementById("log-output");
    if (logOut) {
      const succ = document.createElement("div");
      succ.style.cssText = "text-align:center;margin-top:18px;animation:nebula-success 2s infinite;";
      succ.innerHTML = `
        <div style="font-size:clamp(35px,7vw,40px);margin-bottom:8px;">⬡</div>
        <div style="background:linear-gradient(90deg,#0f8,#0ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:clamp(16px,3.5vw,18px);font-weight:900;letter-spacing:4px;">NEBULA SUCCESSFUL</div>
        <div style="color:#0ff;font-size:clamp(9px,2vw,10px);margin-top:5px;letter-spacing:3px;">AINCRAD COMPROMISED</div>
        <div id="nb-countdown-text" style="color:#667788;font-size:clamp(8px,1.5vw,9px);margin-top:8px;">REDIRECTING IN 3s...</div>
        <div style="color:#333;font-size:7px;margin-top:10px;">By Abdullah Al Mamun | @A2MBD3</div>
      `;
      logOut.appendChild(succ);
      logOut.scrollTop = logOut.scrollHeight;
    }
    
    let countdown = 3;
    const cdInterval = setInterval(() => {
      countdown--;
      const cdEl = document.getElementById("nb-countdown-text");
      if (cdEl) cdEl.textContent = "REDIRECTING IN " + countdown + "s...";
      if (countdown <= 0) {
        clearInterval(cdInterval);
        const exploitBox = document.getElementById("nebula-exploit");
        if (exploitBox) {
          exploitBox.style.transition = "all 0.5s ease";
          exploitBox.style.transform = "translate(-50%,-50%) scale(0.85)";
          exploitBox.style.opacity = "0";
          setTimeout(() => {
            exploitBox.remove();
            document.getElementById("nebula-particles")?.remove();
            document.getElementById("nebula-grid")?.remove();
            window.location.replace(redirectUrl);
          }, 500);
        } else {
          window.location.replace(redirectUrl);
        }
      }
    }, 1000);
  }

  // ── RENDER INIT PANEL ──────────────────────────────────
  function renderInitPanel() {
    const existingBox = document.getElementById("nebula-auth");
    if (existingBox) existingBox.remove();

    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
      @keyframes nebula-orbit0{0%{transform:translate(0,0)scale(1)}25%{transform:translate(60px,-80px)scale(1.5)}50%{transform:translate(-40px,-160px)scale(0.8)}75%{transform:translate(-80px,-40px)scale(0.5)}100%{transform:translate(0,0)scale(1)}}
      @keyframes nebula-orbit1{0%{transform:translate(0,0)scale(1)}33%{transform:translate(-50px,-100px)scale(0.7)}66%{transform:translate(70px,-60px)scale(1.3)}100%{transform:translate(0,0)scale(1)}}
      @keyframes nebula-orbit2{0%{transform:translate(0,0)scale(1)}50%{transform:translate(90px,-120px)scale(0.5)}100%{transform:translate(0,0)scale(1)}}
      @keyframes nebula-pulse{0%,100%{opacity:0.5}50%{opacity:1}}
      @keyframes nebula-border{0%,100%{border-color:rgba(0,255,255,0.3);box-shadow:0 0 40px rgba(0,255,255,0.1),inset 0 0 40px rgba(0,0,0,0.5)}25%{border-color:rgba(255,0,255,0.4);box-shadow:0 0 60px rgba(255,0,255,0.15),inset 0 0 60px rgba(0,0,0,0.6)}50%{border-color:rgba(102,0,255,0.4);box-shadow:0 0 60px rgba(102,0,255,0.15),inset 0 0 60px rgba(0,0,0,0.6)}75%{border-color:rgba(255,0,100,0.4);box-shadow:0 0 60px rgba(255,0,100,0.15),inset 0 0 60px rgba(0,0,0,0.6)}}
      @keyframes nebula-float{0%,100%{transform:translate(-50%,-50%)translateY(0)}50%{transform:translate(-50%,-50%)translateY(-6px)}}
      @keyframes nebula-slide{0%{opacity:0;transform:translateX(-20px)}100%{opacity:1;transform:translateX(0)}}
      @keyframes nebula-success{0%{transform:scale(1)}50%{transform:scale(1.05)}100%{transform:scale(1)}}
      @keyframes nebula-scan{0%{top:-100%}100%{top:100%}}
      @keyframes nb-toast-in{from{opacity:0;transform:translateX(-50%)translateY(15px)}to{opacity:1;transform:translateX(-50%)translateY(0)}}
      @keyframes nb-progress-aurora{0%,100%{filter:hue-rotate(0deg)brightness(1);box-shadow:0 0 12px rgba(0,255,255,0.8),0 0 30px rgba(0,255,255,0.3)}25%{filter:hue-rotate(90deg)brightness(1.3);box-shadow:0 0 14px rgba(255,0,255,0.8),0 0 35px rgba(255,0,255,0.4)}50%{filter:hue-rotate(180deg)brightness(1.5);box-shadow:0 0 16px rgba(102,0,255,0.9),0 0 40px rgba(102,0,255,0.5)}75%{filter:hue-rotate(270deg)brightness(1.3);box-shadow:0 0 14px rgba(0,255,136,0.8),0 0 35px rgba(0,255,136,0.4)}100%{filter:hue-rotate(360deg)brightness(1);box-shadow:0 0 12px rgba(0,255,255,0.8),0 0 30px rgba(0,255,255,0.3)}}
    `;
    document.head.appendChild(styleEl);

    const authBox = document.createElement("div");
    authBox.id = "nebula-auth";
    authBox.style.cssText = `
      position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
      background:linear-gradient(160deg,rgba(5,3,20,0.97),rgba(10,5,30,0.97));
      backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);
      color:#fff;padding:clamp(20px,4vw,30px) clamp(18px,3.5vw,28px);
      border-radius:20px;z-index:2147483647;
      font-family:'Orbitron','Rajdhani',sans-serif;
      text-align:center;width:min(380px,92vw);box-sizing:border-box;
      border:1.5px solid rgba(0,255,255,0.3);
      animation:nebula-border 6s ease-in-out infinite,nebula-float 8s ease-in-out infinite;
      box-shadow:0 0 80px rgba(0,255,255,0.1),0 0 200px rgba(102,0,255,0.05);
      overflow:hidden;
    `;

    authBox.innerHTML = `
      <div style="position:absolute;top:0;left:0;width:100%;height:3px;
                  background:linear-gradient(90deg,transparent,#0ff,#f0f,#60f,transparent);
                  animation:nebula-scan 3s linear infinite;pointer-events:none;opacity:0.6;"></div>
      
      <div style="position:absolute;bottom:0;left:0;width:100%;height:4px;background:rgba(0,0,0,0.4);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);">
        <div id="nb-progress-init" style="height:100%;width:0%;
          background:linear-gradient(90deg,#0ff 0%,#f0f 25%,#60f 50%,#0f8 75%,#0ff 100%);
          background-size:200% 100%;
          border-radius:0 0 0 20px;
          transition:width 0.1s linear;
          animation:nb-progress-aurora 4s linear infinite;
          box-shadow:0 0 12px rgba(0,255,255,0.6);"></div>
      </div>
      
      <div style="position:relative;z-index:1;">
        <button id="music-btn" style="
          position:absolute;top:-6px;right:-6px;
          background:rgba(0,255,255,0.05);border:1px solid rgba(0,255,255,0.25);
          color:#0ff;border-radius:50%;width:clamp(30px,5vw,36px);height:clamp(30px,5vw,36px);
          cursor:pointer;font-size:clamp(11px,2vw,14px);display:flex;align-items:center;
          justify-content:center;backdrop-filter:blur(15px);
          transition:all 0.3s ease;z-index:10;">♪</button>

        <div style="margin-bottom:6px;">
          <span style="font-size:clamp(7px,1.5vw,9px);color:#0ff;letter-spacing:6px;opacity:0.7;">NEBULA.DIRECT</span>
        </div>
        
        <h3 style="margin:0 0 6px 0;
                   background:linear-gradient(90deg,#0ff,#f0f,#60f,#f06);
                   -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                   font-size:clamp(20px,5vw,26px);font-weight:900;letter-spacing:4px;
                   font-family:'Orbitron',sans-serif;">
          A2MBD3
        </h3>
        
        <div style="width:50px;height:2px;background:linear-gradient(90deg,transparent,#f0f,transparent);
                    margin:10px auto;"></div>
        
        <p style="margin:0 0 4px 0;color:#0ff;font-size:clamp(9px,2vw,11px);letter-spacing:4px;font-weight:500;">◆ SYSTEM READY</p>
        
        <div id="nb-track-name" style="min-height:16px;margin-bottom:clamp(10px,2vw,16px);font-size:clamp(7px,1.5vw,8px);color:rgba(255,255,255,0.3);letter-spacing:1px;font-family:'Rajdhani',sans-serif;">♫ Waiting for interaction...</div>

        <button id="init-btn" style="
          width:100%;background:linear-gradient(90deg,rgba(0,255,255,0.1),rgba(255,0,255,0.1),rgba(102,0,255,0.1));
          color:#fff;border:1.5px solid rgba(0,255,255,0.4);padding:clamp(12px,2.5vw,14px);
          border-radius:12px;font-weight:700;cursor:pointer;
          font-family:'Orbitron',sans-serif;font-size:clamp(11px,2.5vw,13px);
          letter-spacing:4px;margin-bottom:clamp(8px,1.5vw,12px);
          backdrop-filter:blur(15px);transition:all 0.3s ease;
          text-transform:uppercase;">⬡ INITIATE NEBULA</button>

        <button id="support-btn" style="
          width:100%;background:rgba(255,0,255,0.05);color:#8899aa;
          border:1.5px solid rgba(255,0,255,0.2);padding:clamp(12px,2.5vw,14px);
          border-radius:12px;font-weight:600;cursor:pointer;
          font-family:'Orbitron',sans-serif;font-size:clamp(11px,2.5vw,13px);
          letter-spacing:4px;backdrop-filter:blur(15px);transition:all 0.3s ease;
          text-transform:uppercase;">⚡ Telegram</button>

        <div style="font-size:7px;color:#333;margin-top:10px;">© Abdullah Al Mamun | @A2MBD3 · 📳 Shake</div>
      </div>
    `;
    document.body.appendChild(authBox);

    // ── MUSIC BUTTON ──────────────────────────────────────
    const musicBtn = document.getElementById("music-btn");
    const trackNameEl = document.getElementById("nb-track-name");
    
    AudioEngine.onTrackChange = () => {
      const name = AudioEngine.getTrackName();
      if (trackNameEl && name) {
        trackNameEl.textContent = "♫ " + (name.length > 24 ? name.slice(0, 24) + "…" : name);
      }
    };
    
    musicBtn.addEventListener("click", () => {
      const isPlaying = AudioEngine.toggle();
      musicBtn.textContent = isPlaying ? "♪" : "✕";
      musicBtn.style.color = isPlaying ? "#0ff" : "#f06";
      
      // Update track name after toggle
      if (isPlaying) {
        const name = AudioEngine.getTrackName();
        if (trackNameEl && name) {
          trackNameEl.textContent = "♫ " + (name.length > 24 ? name.slice(0, 24) + "…" : name);
        }
      }
    });

    initShake();
    document.getElementById("support-btn").addEventListener("click", () => {
      window.open(CONFIG.telegramUrl, "_blank");
    });

    // Start init progress bar (10 seconds)
    startInitProgress();

    // Init button
    const initBtn = document.getElementById("init-btn");
    const initiateExploit = async () => {
      if (initBtn.disabled) return;
      initBtn.disabled = true;
      document.getElementById("support-btn").disabled = true;
      initBtn.textContent = "◆ INITIALIZING...";
      initBtn.style.opacity = "0.7";
      
      if (autoInitTimeout) clearTimeout(autoInitTimeout);
      initProgressActive = false;
      if (initProgressRAF) cancelAnimationFrame(initProgressRAF);

      // Fetch and validate redirect URL at initiate time
      const validatedUrl = await fetchAndValidateRedirectUrl();
      redirectUrlCache = validatedUrl || CONFIG.fallbackRedirectUrl;

      authBox.style.transition = "all 0.5s ease";
      authBox.style.transform = "translate(-50%,-50%) scale(0.9)";
      authBox.style.opacity = "0";

      setTimeout(() => {
        authBox.remove();
        renderExploitPanel(redirectUrlCache);
      }, 500);
    };

    initBtn.addEventListener("click", initiateExploit);

    // Auto-init after 10 seconds
    autoInitTimeout = setTimeout(() => {
      const btn = document.getElementById("init-btn");
      if (btn && !btn.disabled) btn.click();
    }, CONFIG.autoInitDelay);
  }

  // ── RENDER EXPLOIT PANEL ───────────────────────────────
  function renderExploitPanel(redirectUrl) {
    const exploitBox = document.createElement("div");
    exploitBox.id = "nebula-exploit";
    exploitBox.style.cssText = `
      position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
      width:min(460px,94vw);max-height:80vh;
      background:linear-gradient(160deg,rgba(5,3,20,0.98),rgba(10,5,30,0.98));
      backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);
      border:1.5px solid rgba(0,255,255,0.3);border-radius:20px;
      z-index:2147483647;font-family:'Orbitron','Rajdhani',sans-serif;
      padding:clamp(16px,3vw,24px);box-sizing:border-box;
      box-shadow:0 0 80px rgba(0,255,255,0.15),0 0 200px rgba(255,0,255,0.1);
      animation:nebula-border 6s ease-in-out infinite;
      overflow:hidden;
    `;

    exploitBox.innerHTML = `
      <div style="position:absolute;top:0;left:0;width:100%;height:3px;
                  background:linear-gradient(90deg,transparent,#0ff,#f0f,#60f,transparent);
                  animation:nebula-scan 3s linear infinite;opacity:0.6;"></div>
      
      <div style="position:absolute;bottom:0;left:0;width:100%;height:4px;background:rgba(0,0,0,0.4);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);">
        <div id="nb-progress-exploit" style="height:100%;width:0%;
          background:linear-gradient(90deg,#0ff 0%,#f0f 25%,#60f 50%,#0f8 75%,#0ff 100%);
          background-size:200% 100%;
          border-radius:0 0 0 20px;
          transition:width 0.1s linear;
          animation:nb-progress-aurora 4s linear infinite;
          box-shadow:0 0 12px rgba(0,255,255,0.6);"></div>
      </div>
      
      <div style="position:relative;z-index:1;">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:12px;
                    padding-bottom:10px;border-bottom:1px solid rgba(0,255,255,0.1);flex-wrap:wrap;">
          <div style="display:flex;gap:5px;">
            <div style="width:8px;height:8px;background:#f06;border-radius:50%;box-shadow:0 0 8px #f06;"></div>
            <div style="width:8px;height:8px;background:#f90;border-radius:50%;box-shadow:0 0 8px #f90;"></div>
            <div style="width:8px;height:8px;background:#0ff;border-radius:50%;box-shadow:0 0 8px #0ff;"></div>
          </div>
          <span style="color:#0ff;font-size:clamp(8px,1.8vw,10px);letter-spacing:2px;margin-left:8px;">NEBULA://AINCRAD</span>
          <span style="color:#f06;font-size:clamp(7px,1.5vw,8px);margin-left:auto;letter-spacing:1px;animation:nebula-success 1.5s infinite;">● LIVE</span>
          <span id="nb-exploit-track" style="color:rgba(255,255,255,0.25);font-size:7px;font-family:'Rajdhani',sans-serif;margin-left:8px;"></span>
        </div>

        <div id="log-output" style="
          color:#aabbcc;font-size:clamp(9px,2vw,11px);line-height:2;
          text-align:left;font-family:'Rajdhani',sans-serif;
          letter-spacing:1px;max-height:clamp(180px,45vh,300px);
          overflow-y:auto;padding-right:5px;"></div>
          
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;padding-top:8px;border-top:1px solid rgba(0,255,255,0.08);">
          <span style="color:#0ff;font-size:8px;letter-spacing:2px;">NEBULA PROGRESS</span>
          <span id="nb-progress-pct" style="color:#f0f;font-size:clamp(9px,2vw,11px);font-weight:700;letter-spacing:1px;">0%</span>
        </div>
      </div>
    `;
    document.body.appendChild(exploitBox);

    const logOut = document.getElementById("log-output");
    const logs = generateFakeLogs();
    const delayPerLog = Math.max(80, Math.floor((CONFIG.exploitProgressTime - 3000) / logs.length));

    // Update track display in exploit panel
    const exploitTrackEl = document.getElementById("nb-exploit-track");
    AudioEngine.onTrackChange = () => {
      // Update init track name if exists
      const initTrack = document.getElementById("nb-track-name");
      if (initTrack) {
        const name = AudioEngine.getTrackName();
        if (name) initTrack.textContent = "♫ " + (name.length > 24 ? name.slice(0, 24) + "…" : name);
      }
      // Update exploit track name
      if (exploitTrackEl) {
        const name = AudioEngine.getTrackName();
        if (name) exploitTrackEl.textContent = "♫ " + (name.length > 18 ? name.slice(0, 18) + "…" : name);
      }
    };
    
    // Initial track name
    const initialName = AudioEngine.getTrackName();
    if (exploitTrackEl && initialName) {
      exploitTrackEl.textContent = "♫ " + (initialName.length > 18 ? initialName.slice(0, 18) + "…" : initialName);
    }

    // Clear previous log timers
    logTimers.forEach(t => clearTimeout(t));
    logTimers = [];

    // Render logs with stagger
    logs.forEach((l, i) => {
      const timer = setTimeout(() => {
        const line = document.createElement("div");
        line.style.cssText = `color:${l.c};margin-bottom:2px;animation:nebula-slide 0.3s ease;font-weight:${l.c==='#0f8'||l.c==='#f06'?'600':'400'};text-shadow:0 0 5px ${l.c};`;
        line.textContent = l.t;
        logOut.appendChild(line);
        logOut.scrollTop = logOut.scrollHeight;
      }, i * delayPerLog);
      logTimers.push(timer);
    });

    // Start exploit progress bar (20 seconds) then redirect
    startExploitProgress(() => {
      handleExploitComplete(redirectUrl);
    });
  }

  // ── MAIN BOOT ──────────────────────────────────────────
  (async function () {
    const isActive = await checkStatus();
    if (!isActive) { showOutdated(); return; }

    await fetchMusicList();
    createParticles();
    createDotGrid();
    renderInitPanel();
  })();

})();