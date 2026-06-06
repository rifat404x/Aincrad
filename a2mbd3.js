(function () {
  "use strict";

  if (typeof window.ABDULLAH_BOOKMARK_LOAD === "undefined") {
    console.log(
      "%c[!] ACCESS DENIED - BOOKMARK REQUIRED [!]",
      "color:#ff0000;font-size:15px;font-weight:bold;background:#000;padding:5px;"
    );
    return;
  }

  const DATA_URL = "https://raw.githubusercontent.com/A2MBD3/Aincrad/main/data.json";

  let EMBEDDED_DATA = null;
  let audioPlayer = null;

  async function fetchData() {
    try {
      const response = await fetch(DATA_URL);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("[✗] Failed to load data.json:", error);
      return null;
    }
  }

  function initAudio() {
    if (!audioPlayer) {
      audioPlayer = new Audio(EMBEDDED_DATA.musicUrl);
      audioPlayer.loop = true;
      audioPlayer.volume = 0.35;
    }
    audioPlayer.play().catch(() => {});
  }

  function generateFakeLogs() {
    const randomHex = (len) => Array(len).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
    const randomIP = () => `${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}`;
    const randomPort = () => [22, 80, 443, 3306, 8080, 8443, 9090, 3000, 5000, 27017][Math.floor(Math.random()*10)];
    const protocols = ["SSH", "HTTPS", "MySQL", "MongoDB", "Redis", "FTP", "SMTP", "DNS"];
    
    return [
      { text: "⚡ INITIALIZING EXPLOIT FRAMEWORK v4.2.1", color: "#00ffff" },
      { text: "⚡ LOADING MODULES: [0x" + randomHex(8) + "]", color: "#00ffff" },
      { text: "🎯 TARGET LOCKED: aincrad.prime.server:443", color: "#ff9900" },
      { text: "🔍 SCANNING: " + randomIP() + "/24", color: "#00ffff" },
      { text: "⚠ PORT " + randomPort() + " OPEN - " + protocols[Math.floor(Math.random()*8)], color: "#ff9900" },
      { text: "⚠ VULNERABILITY: CVE-2024-" + Math.floor(Math.random()*9000+1000), color: "#ff6600" },
      { text: "🔑 BRUTE-FORCE SSH: root@" + randomIP(), color: "#00ffff" },
      { text: "✓ CREDENTIALS: root:" + randomHex(12), color: "#00ff88" },
      { text: "🔒 TLS HANDSHAKE: " + randomHex(32), color: "#00ffff" },
      { text: "📊 SQL INJECTION: aincrad_users", color: "#ff9900" },
      { text: "✓ ROWS EXTRACTED: " + Math.floor(Math.random()*90000+10000), color: "#00ff88" },
      { text: "💎 LICENSE TABLE: " + Math.floor(Math.random()*5000+500) + " KEYS", color: "#00ff88" },
      { text: "🔥 BYPASSING WAF: Layer 7 Rule #" + Math.floor(Math.random()*99+1), color: "#ff6600" },
      { text: "🧠 MEMORY DUMP: 0x" + randomHex(16), color: "#00ffff" },
      { text: "🔓 AES-256 KEY: " + randomHex(32), color: "#00ff88" },
      { text: "🛡 DISABLING IDS/IPS: Snort Rule " + Math.floor(Math.random()*99999), color: "#ff6600" },
      { text: "🧹 CLEARING: /var/log/auth.log", color: "#00ffff" },
      { text: "🧹 CLEARING: /var/log/syslog", color: "#00ffff" },
      { text: "🧹 CLEARING: ~/.bash_history", color: "#00ffff" },
      { text: "💉 BACKDOOR: /tmp/.x11_" + randomHex(6), color: "#ff0066" },
      { text: "☠ KERNEL MODULE: rootkit_" + randomHex(4) + ".ko", color: "#ff0066" },
      { text: "☠ RING 0 ACCESS: GRANTED", color: "#ff0066" },
      { text: "🔓 SSL PFS COMPROMISED: " + randomHex(48), color: "#ff6600" },
      { text: "📡 C2 BEACON: " + randomIP() + ":" + randomPort(), color: "#00ffff" },
      { text: "✓ HEARTBEAT: ESTABLISHED (3s interval)", color: "#00ff88" },
      { text: "📦 PAYLOAD: " + randomHex(20) + ".enc", color: "#ff9900" },
      { text: "✓ DECRYPTION: SUCCESS", color: "#00ff88" },
      { text: "⚙ COMPILING: shellcode_0x" + randomHex(4), color: "#00ffff" },
      { text: "✓ INJECTION: PID " + Math.floor(Math.random()*30000+1000), color: "#00ff88" },
      { text: "🏆 PRIVILEGE ESCALATION: uid=0(root)", color: "#ff0066" },
      { text: "📋 PASSWORD CACHE: " + Math.floor(Math.random()*200+50) + " hashes", color: "#00ffff" },
      { text: "🔐 HASH CRACKED: $6$" + randomHex(8) + " → password" + Math.floor(Math.random()*999), color: "#00ff88" },
      { text: "🗄 DATABASE: aincrad_production", color: "#ff9900" },
      { text: "✓ EXPORT: " + Math.floor(Math.random()*900+100) + "MB", color: "#00ff88" },
      { text: "🌐 REVERSE PROXY: 0.0.0.0:" + randomPort(), color: "#00ffff" },
      { text: "🔗 CHAIN: " + randomHex(64), color: "#ff6600" },
      { text: "✓ VALIDATION: BLOCKCHAIN VERIFIED", color: "#00ff88" },
      { text: "⚡ FINALIZING EXPLOIT SEQUENCE", color: "#ff9900" },
      { text: "✓ EXPLOIT CHAIN: COMPLETE", color: "#00ff88" },
      { text: "⬡ SYSTEM COMPROMISED: AINCRAD", color: "#00ff88" },
    ];
  }

  function createParticles() {
    const container = document.createElement("div");
    container.id = "particles-container";
    container.style.cssText = `
      position:fixed;top:0;left:0;width:100%;height:100%;
      pointer-events:none;z-index:2147483646;
    `;
    
    const particleCount = window.innerWidth < 600 ? 25 : 45;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      const size = Math.random() * 2.5 + 1;
      const colors = ["#00ffff", "#ff0066", "#ff9900", "#00ff88", "#6600ff"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particle.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        background:${color};
        border-radius:50%;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        box-shadow:0 0 ${size * 5}px ${color},0 0 ${size * 10}px ${color};
        animation:particle-float${i % 3} ${Math.random() * 12 + 8}s linear infinite;
        animation-delay:${Math.random() * 6}s;
        opacity:${Math.random() * 0.5 + 0.2};
      `;
      container.appendChild(particle);
    }
    document.body.appendChild(container);
  }

  function createHexGrid() {
    const grid = document.createElement("div");
    grid.id = "hex-grid";
    grid.style.cssText = `
      position:fixed;top:0;left:0;width:100%;height:100%;
      pointer-events:none;z-index:2147483645;
      background-image:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5L55 20v30L30 60 5 50V20L30 5z' fill='none' stroke='%2300ffff' stroke-width='0.3' opacity='0.06'/%3E%3C/svg%3E");
      background-size:${window.innerWidth < 600 ? '50px' : '70px'} ${window.innerWidth < 600 ? '50px' : '70px'};
      animation:hex-rotate 35s linear infinite;
    `;
    document.body.appendChild(grid);
  }

  function createScanLines() {
    const lines = document.createElement("div");
    lines.id = "scan-lines";
    lines.style.cssText = `
      position:fixed;top:0;left:0;width:100%;height:100%;
      pointer-events:none;z-index:2147483645;
      background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,255,0.01) 2px,rgba(0,255,255,0.01) 4px);
    `;
    document.body.appendChild(lines);
  }

  function showOutdated() {
    const outdatedOverlay = document.createElement("div");
    outdatedOverlay.style.cssText = `
      position:fixed;top:0;left:0;width:100%;height:100%;
      background:rgba(2,2,15,0.96);z-index:2147483647;
      display:flex;align-items:center;justify-content:center;
      font-family:'Rajdhani','Orbitron','Segoe UI',sans-serif;
      backdrop-filter:blur(5px);padding:20px;
    `;
    outdatedOverlay.innerHTML = `
      <div style="text-align:center;position:relative;
                  background:linear-gradient(135deg,rgba(255,0,0,0.05),rgba(0,0,0,0.85));
                  padding:clamp(25px,5vw,35px) clamp(20px,4vw,30px);
                  border:1px solid rgba(255,0,0,0.3);border-radius:14px;
                  width:min(360px,88vw);
                  box-shadow:0 0 60px rgba(255,0,0,0.12),0 0 150px rgba(255,0,0,0.04);
                  backdrop-filter:blur(10px);">
        <div style="font-size:clamp(40px,8vw,50px);margin-bottom:12px;filter:drop-shadow(0 0 15px #ff0000);">⚠</div>
        <h3 style="margin:0 0 8px 0;background:linear-gradient(90deg,#ff0000,#ff6600);
                   -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                   font-size:clamp(16px,4vw,18px);font-weight:700;letter-spacing:3px;">EXPLOIT OUTDATED</h3>
        <p style="margin:0 0 18px 0;color:#8899aa;font-size:clamp(10px,2.5vw,11px);line-height:1.6;">
          SIGNATURE_MISMATCH<br>VERSION_DEPRECATED
        </p>
        <button id="update-btn" style="
          width:100%;background:rgba(255,0,0,0.08);color:#ff4444;
          border:1px solid rgba(255,0,0,0.35);padding:clamp(10px,2vw,12px);
          border-radius:8px;font-weight:600;cursor:pointer;
          font-family:'Rajdhani','Orbitron',sans-serif;
          font-size:clamp(11px,2.5vw,13px);letter-spacing:2px;
          box-shadow:0 0 25px rgba(255,0,0,0.08);
          transition:all 0.3s ease;">⬇ DOWNLOAD LATEST</button>
      </div>
    `;
    document.body.appendChild(outdatedOverlay);
    
    document.getElementById("update-btn").addEventListener("click", () => {
      window.open(EMBEDDED_DATA.telegramUrl, "_blank");
    });
  }

  (async function () {
    // Fetch all data from single JSON file
    EMBEDDED_DATA = await fetchData();
    
    if (!EMBEDDED_DATA) {
      console.error("[✗] Could not load data.json");
      return;
    }

    // Check status from JSON
    if (EMBEDDED_DATA.status === 0) {
      showOutdated();
      return;
    }

    createParticles();
    createHexGrid();
    createScanLines();

    const existingBox = document.getElementById("auth-box");
    if (existingBox) existingBox.remove();

    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
      
      @keyframes particle-float0 {
        0%{transform:translateY(0) translateX(0) scale(1);}
        25%{transform:translateY(-80px) translateX(40px) scale(1.4);}
        50%{transform:translateY(-160px) translateX(-25px) scale(0.9);}
        75%{transform:translateY(-80px) translateX(-60px) scale(0.5);}
        100%{transform:translateY(0) translateX(0) scale(1);}
      }
      @keyframes particle-float1 {
        0%{transform:translateY(0) translateX(0) scale(1);}
        33%{transform:translateY(-120px) translateX(-30px) scale(0.7);}
        66%{transform:translateY(-60px) translateX(55px) scale(1.2);}
        100%{transform:translateY(0) translateX(0) scale(1);}
      }
      @keyframes particle-float2 {
        0%{transform:translateX(0) translateY(0) scale(1);}
        50%{transform:translateX(80px) translateY(-100px) scale(0.5);}
        100%{transform:translateX(0) translateY(0) scale(1);}
      }
      @keyframes hex-rotate {
        0%{transform:rotate(0deg);}
        100%{transform:rotate(360deg);}
      }
      @keyframes border-glow {
        0%,100%{border-color:rgba(0,255,255,0.25);box-shadow:0 0 25px rgba(0,255,255,0.08),inset 0 0 25px rgba(0,0,0,0.4);}
        50%{border-color:rgba(0,255,255,0.5);box-shadow:0 0 45px rgba(0,255,255,0.15),inset 0 0 45px rgba(0,0,0,0.6);}
      }
      @keyframes title-glow {
        0%,100%{text-shadow:0 0 12px rgba(0,255,255,0.4),0 0 25px rgba(0,255,255,0.15);}
        50%{text-shadow:0 0 22px rgba(0,255,255,0.7),0 0 50px rgba(0,255,255,0.3);}
      }
      @keyframes pulse-ring {
        0%{transform:translate(-50%,-50%) scale(1);opacity:0.4;}
        100%{transform:translate(-50%,-50%) scale(1.4);opacity:0;}
      }
      @keyframes float {
        0%,100%{transform:translate(-50%,-50%) translateY(0);}
        50%{transform:translate(-50%,-50%) translateY(-4px);}
      }
      @keyframes log-slide-in {
        0%{opacity:0;transform:translateX(-15px);}
        100%{opacity:1;transform:translateX(0);}
      }
      @keyframes success-pulse {
        0%{transform:scale(1);opacity:0.8;}
        50%{transform:scale(1.03);opacity:1;}
        100%{transform:scale(1);opacity:0.8;}
      }
      @keyframes scan-line-move {
        0%{top:-2px;}
        100%{top:100%;}
      }
    `;
    document.head.appendChild(styleEl);

    const authBox = document.createElement("div");
    authBox.id = "auth-box";
    authBox.style.cssText = `
      position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
      background:linear-gradient(160deg,rgba(5,8,22,0.96),rgba(10,15,35,0.96));
      backdrop-filter:blur(25px);-webkit-backdrop-filter:blur(25px);
      color:#fff;padding:clamp(22px,4vw,30px) clamp(18px,3.5vw,25px);
      border-radius:15px;z-index:2147483647;
      font-family:'Rajdhani','Orbitron',sans-serif;
      text-align:center;width:min(360px,90vw);
      box-sizing:border-box;
      border:1px solid rgba(0,255,255,0.25);
      animation:border-glow 3s ease-in-out infinite,float 6s ease-in-out infinite;
      box-shadow:0 0 50px rgba(0,255,255,0.08),0 0 120px rgba(102,0,255,0.04);
    `;

    authBox.innerHTML = `
      <div style="position:absolute;top:0;left:0;width:100%;height:2px;
                  background:linear-gradient(90deg,transparent,rgba(0,255,255,0.3),transparent);
                  animation:scan-line-move 4s linear infinite;pointer-events:none;"></div>
      
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
                  width:min(320px,80vw);height:min(320px,80vw);
                  border:1px solid rgba(0,255,255,0.07);border-radius:50%;
                  animation:pulse-ring 3.5s ease-out infinite;pointer-events:none;"></div>
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
                  width:min(280px,70vw);height:min(280px,70vw);
                  border:1px solid rgba(102,0,255,0.06);border-radius:50%;
                  animation:pulse-ring 3.5s ease-out 1.2s infinite;pointer-events:none;"></div>
      
      <div style="position:relative;z-index:1;">
        <button id="music-btn" style="
          position:absolute;top:-8px;right:-8px;
          background:rgba(0,255,255,0.04);border:1px solid rgba(0,255,255,0.2);
          color:#00ffff;border-radius:50%;width:clamp(28px,5vw,32px);height:clamp(28px,5vw,32px);
          cursor:pointer;font-size:clamp(10px,2vw,12px);display:flex;align-items:center;
          justify-content:center;backdrop-filter:blur(10px);
          transition:all 0.3s ease;z-index:10;
          box-shadow:0 0 12px rgba(0,255,255,0.08);">♪</button>

        <div style="margin-bottom:4px;">
          <span style="font-size:clamp(7px,1.5vw,8px);color:#00ffff;letter-spacing:5px;opacity:0.6;">SYS.AUTH</span>
        </div>
        
        <h3 style="margin:0 0 4px 0;
                   background:linear-gradient(90deg,#00ffff,#6600ff,#ff0066);
                   -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                   font-size:clamp(18px,4vw,22px);font-weight:800;letter-spacing:3px;
                   font-family:'Orbitron',sans-serif;
                   animation:title-glow 2s ease-in-out infinite;">
          A2MBD3
        </h3>
        
        <div style="width:clamp(30px,6vw,40px);height:1px;background:linear-gradient(90deg,transparent,#00ffff,transparent);
                    margin:clamp(6px,1.5vw,8px) auto;"></div>
        
        <p style="margin:0 0 clamp(14px,3vw,18px) 0;color:#667788;
                  font-size:clamp(9px,2vw,10px);letter-spacing:3px;font-weight:500;">
          ENTER LICENSE KEY
        </p>

        <div style="position:relative;">
          <input type="text" id="key-input" placeholder="XXXX-XXXX-XXXX-XXXX" style="
            width:100%;padding:clamp(11px,2vw,13px);margin-bottom:clamp(10px,2vw,12px);
            border:1px solid rgba(0,255,255,0.25);border-radius:10px;
            background:rgba(0,0,0,0.35);color:#fff;text-align:center;
            box-sizing:border-box;font-family:'Orbitron','Rajdhani',sans-serif;
            font-size:clamp(10px,2vw,12px);font-weight:600;letter-spacing:2px;
            outline:none;backdrop-filter:blur(10px);
            transition:all 0.3s ease;text-transform:uppercase;
            box-shadow:inset 0 0 15px rgba(0,255,255,0.02);"
            onfocus="this.style.borderColor='#00ffff';this.style.boxShadow='0 0 20px rgba(0,255,255,0.15),inset 0 0 15px rgba(0,255,255,0.04)'"
            onblur="this.style.borderColor='rgba(0,255,255,0.25)';this.style.boxShadow='inset 0 0 15px rgba(0,255,255,0.02)'">
        </div>

        <button id="login-btn" style="
          width:100%;background:linear-gradient(90deg,rgba(0,255,255,0.08),rgba(102,0,255,0.08));
          color:#fff;border:1px solid rgba(0,255,255,0.35);
          padding:clamp(11px,2vw,13px);border-radius:10px;
          font-weight:700;cursor:pointer;
          font-family:'Orbitron','Rajdhani',sans-serif;
          font-size:clamp(10px,2vw,12px);letter-spacing:3px;
          margin-bottom:clamp(8px,1.5vw,10px);
          backdrop-filter:blur(10px);transition:all 0.3s ease;
          text-transform:uppercase;
          box-shadow:0 0 20px rgba(0,255,255,0.08);">⬡ INITIATE EXPLOIT</button>

        <button id="support-btn" style="
          width:100%;background:rgba(102,0,255,0.04);color:#8899aa;
          border:1px solid rgba(102,0,255,0.18);
          padding:clamp(11px,2vw,13px);border-radius:10px;
          font-weight:600;cursor:pointer;
          font-family:'Orbitron','Rajdhani',sans-serif;
          font-size:clamp(10px,2vw,12px);letter-spacing:3px;
          backdrop-filter:blur(10px);transition:all 0.3s ease;
          text-transform:uppercase;">⚡ C2 CHANNEL</button>

        <div id="status-msg" style="margin-top:clamp(10px,2vw,12px);
                     font-size:clamp(8px,1.5vw,9px);font-weight:600;
                     color:#00ffff;letter-spacing:3px;opacity:0.7;">◆ STANDBY</div>
      </div>
    `;
    document.body.appendChild(authBox);

    initAudio();

    const musicBtn = document.getElementById("music-btn");
    const keyInput = document.getElementById("key-input");
    const loginBtn = document.getElementById("login-btn");
    const supportBtn = document.getElementById("support-btn");
    const statusEl = document.getElementById("status-msg");

    musicBtn.addEventListener("click", async () => {
      if (!audioPlayer) { initAudio(); musicBtn.textContent = "♪"; musicBtn.style.color = "#00ffff"; return; }
      if (audioPlayer.paused) {
        audioPlayer.play().catch(() => {});
        musicBtn.textContent = "♪"; musicBtn.style.color = "#00ffff";
      } else {
        audioPlayer.pause();
        musicBtn.textContent = "✕"; musicBtn.style.color = "#ff0066";
      }
    });

    supportBtn.addEventListener("click", () => {
      window.open(EMBEDDED_DATA.telegramUrl, "_blank");
    });

    loginBtn.addEventListener("click", async () => {
      const inputKey = keyInput.value.trim();

      if (!inputKey) {
        statusEl.innerHTML = "◆ KEY REQUIRED";
        statusEl.style.color = "#ff0066";
        return;
      }

      statusEl.innerHTML = "◆ AUTHENTICATING...";
      statusEl.style.color = "#00ffff";
      loginBtn.disabled = supportBtn.disabled = true;

      setTimeout(async () => {
        if (EMBEDDED_DATA.validKeys.includes(inputKey)) {
          statusEl.innerHTML = "◆ ACCESS GRANTED";
          statusEl.style.color = "#00ff88";

          setTimeout(async () => {
            authBox.style.transition = "all 0.4s ease";
            authBox.style.transform = "translate(-50%,-50%) scale(0.93)";
            authBox.style.opacity = "0";
            
            setTimeout(() => {
              authBox.remove();

              const exploitOverlay = document.createElement("div");
              exploitOverlay.id = "exploit-overlay";
              exploitOverlay.style.cssText = `
                position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
                width:min(440px,93vw);max-height:78vh;
                background:linear-gradient(160deg,rgba(5,8,22,0.98),rgba(10,15,35,0.98));
                backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);
                border:1px solid rgba(0,255,255,0.25);border-radius:14px;
                z-index:2147483647;font-family:'Rajdhani','Orbitron',sans-serif;
                padding:clamp(16px,3vw,22px);box-sizing:border-box;
                box-shadow:0 0 60px rgba(0,255,255,0.12),0 0 180px rgba(102,0,255,0.08);
                animation:border-glow 3s ease-in-out infinite;
                overflow:hidden;
              `;

              exploitOverlay.innerHTML = `
                <div style="position:absolute;top:0;left:0;width:100%;height:2px;
                            background:linear-gradient(90deg,transparent,rgba(0,255,255,0.25),transparent);
                            animation:scan-line-move 4s linear infinite;pointer-events:none;"></div>
                
                <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
                            width:min(400px,85vw);height:min(400px,85vw);
                            border:1px solid rgba(0,255,255,0.05);border-radius:50%;
                            animation:pulse-ring 4s ease-out infinite;pointer-events:none;"></div>
                
                <div style="display:flex;align-items:center;gap:clamp(4px,1vw,6px);margin-bottom:clamp(10px,2vw,14px);
                            padding-bottom:clamp(8px,1.5vw,10px);border-bottom:1px solid rgba(0,255,255,0.08);
                            flex-wrap:wrap;">
                  <div style="display:flex;gap:4px;">
                    <div style="width:clamp(6px,1.2vw,7px);height:clamp(6px,1.2vw,7px);background:#ff0066;border-radius:50%;box-shadow:0 0 6px #ff0066;"></div>
                    <div style="width:clamp(6px,1.2vw,7px);height:clamp(6px,1.2vw,7px);background:#ff9900;border-radius:50%;box-shadow:0 0 6px #ff9900;"></div>
                    <div style="width:clamp(6px,1.2vw,7px);height:clamp(6px,1.2vw,7px);background:#00ffff;border-radius:50%;box-shadow:0 0 6px #00ffff;"></div>
                  </div>
                  <span style="color:#00ffff;font-size:clamp(8px,1.8vw,9px);letter-spacing:2px;margin-left:clamp(5px,1vw,8px);">EXPLOIT://AINCRAD</span>
                  <span style="color:#ff0066;font-size:clamp(6px,1.2vw,7px);margin-left:auto;letter-spacing:1px;animation:success-pulse 1.5s ease-in-out infinite;">● LIVE</span>
                </div>

                <div id="log-output" style="
                  color:#aabbcc;font-size:clamp(8px,1.8vw,10px);line-height:1.9;
                  text-align:left;font-family:'Rajdhani',sans-serif;
                  letter-spacing:0.8px;max-height:clamp(180px,40vh,280px);
                  overflow-y:auto;padding-right:4px;
                  scrollbar-width:thin;scrollbar-color:rgba(0,255,255,0.2) transparent;">
                </div>

                <div id="progress-container" style="margin-top:clamp(10px,2vw,12px);display:none;">
                  <div style="display:flex;justify-content:space-between;color:#00ffff;
                              font-size:clamp(7px,1.4vw,8px);margin-bottom:5px;letter-spacing:2px;">
                    <span>PROGRESS</span>
                    <span id="progress-percent">0%</span>
                  </div>
                  <div style="width:100%;height:3px;background:rgba(0,255,255,0.04);border-radius:8px;overflow:hidden;">
                    <div id="progress-bar" style="width:0%;height:100%;
                                background:linear-gradient(90deg,#00ffff,#6600ff);
                                box-shadow:0 0 12px #00ffff;transition:width 0.3s linear;
                                border-radius:8px;"></div>
                  </div>
                </div>
              `;
              document.body.appendChild(exploitOverlay);

              const logOutput = document.getElementById("log-output");
              const progressBar = document.getElementById("progress-bar");
              const progressPercent = document.getElementById("progress-percent");
              const progressContainer = document.getElementById("progress-container");
              const fakeLogs = generateFakeLogs();

              setTimeout(() => {
                progressContainer.style.display = "block";
              }, 4000);

              let logIndex = 0;
              const totalLogs = fakeLogs.length;
              const TOTAL_DURATION = 30000;
              const startTime = Date.now();

              function typeNextLog() {
                if (logIndex < fakeLogs.length) {
                  const log = fakeLogs[logIndex];
                  const logLine = document.createElement("div");
                  logLine.style.cssText = `
                    color:${log.color};margin-bottom:2px;
                    animation:log-slide-in 0.3s ease;
                    font-weight:${log.color === '#00ff88' || log.color === '#ff0066' ? '600' : '400'};
                    text-shadow:0 0 4px ${log.color};
                  `;
                  logLine.textContent = log.text;
                  logOutput.appendChild(logLine);
                  logOutput.scrollTop = logOutput.scrollHeight;

                  const progress = Math.floor(((logIndex + 1) / totalLogs) * 100);
                  progressBar.style.width = progress + "%";
                  progressPercent.textContent = progress + "%";

                  logIndex++;
                  const remainingLogs = totalLogs - logIndex;
                  const remainingTime = TOTAL_DURATION - (Date.now() - startTime);
                  const avgDelay = remainingLogs > 0 ? remainingTime / remainingLogs : 800;
                  const randomDelay = Math.max(150, avgDelay * (0.5 + Math.random()));

                  setTimeout(typeNextLog, randomDelay);
                } else {
                  const elapsed = Date.now() - startTime;
                  const remaining = Math.max(0, TOTAL_DURATION - elapsed);
                  
                  setTimeout(() => {
                    const successDiv = document.createElement("div");
                    successDiv.style.cssText = `
                      text-align:center;margin-top:clamp(14px,3vw,18px);
                      animation:success-pulse 2s ease-in-out infinite;
                    `;
                    successDiv.innerHTML = `
                      <div style="font-size:clamp(30px,6vw,35px);margin-bottom:clamp(6px,1.5vw,8px);">⬡</div>
                      <div style="background:linear-gradient(90deg,#00ff88,#00ffff);
                                  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                                  font-size:clamp(14px,3vw,16px);font-weight:800;letter-spacing:3px;
                                  font-family:'Orbitron',sans-serif;">
                        EXPLOIT SUCCESSFUL
                      </div>
                      <div style="color:#00ffff;font-size:clamp(8px,1.6vw,9px);margin-top:4px;letter-spacing:2px;">
                        AINCRAD FULLY COMPROMISED
                      </div>
                      <div style="color:#667788;font-size:clamp(7px,1.4vw,8px);margin-top:6px;letter-spacing:1px;">
                        REDIRECTING TO PANEL...
                      </div>
                    `;
                    logOutput.appendChild(successDiv);
                    logOutput.scrollTop = logOutput.scrollHeight;

                    progressBar.style.width = "100%";
                    progressPercent.textContent = "100%";
                    progressBar.style.background = "linear-gradient(90deg,#00ff88,#00ffff)";

                    setTimeout(() => {
                      if (audioPlayer) { audioPlayer.pause(); audioPlayer = null; }
                      exploitOverlay.style.transition = "all 0.5s ease";
                      exploitOverlay.style.transform = "translate(-50%,-50%) scale(0.9)";
                      exploitOverlay.style.opacity = "0";
                      setTimeout(() => {
                        exploitOverlay.remove();
                        document.getElementById("particles-container")?.remove();
                        document.getElementById("hex-grid")?.remove();
                        document.getElementById("scan-lines")?.remove();
                        window.location.replace(EMBEDDED_DATA.redirectUrl);
                      }, 500);
                    }, 2000);
                  }, remaining);
                }
              }

              setTimeout(typeNextLog, 1000);
            }, 300);
          }, 800);
        } else {
          statusEl.innerHTML = "◆ INVALID KEY";
          statusEl.style.color = "#ff0066";
          loginBtn.disabled = supportBtn.disabled = false;
        }
      }, 50);
    });
  })();
})();
