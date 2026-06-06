(function () {
  "use strict";

  if (typeof window.ABDULLAH_BOOKMARK_LOAD === "undefined") {
    console.log(
      "%c[!] ACCESS DENIED - BOOKMARK REQUIRED [!]",
      "color:#ff0000;font-size:15px;font-weight:bold;background:#000;padding:5px;"
    );
    return;
  }

  const EMBEDDED_DATA = {
    validKeys: ["a2mbd3", "REDLIST", "Redlist", "Abdullah"],
    redirectUrl: "https://aincradmods.com/getkey?token=bdf6a84bee36403986fa9f7a7c36e75a",
    telegramUrl: "https://t.me/redguild",
    musicUrl: "https://raw.githubusercontent.com/A2MBD3/Aincrad/1edca5aaab77c8cab29afacbe86059c444d6463b/a2mbd3-background.mp3",
    statusUrl: "https://raw.githubusercontent.com/A2MBD3/Aincrad/1edca5aaab77c8cab29afacbe86059c444d6463b/status.txt"
  };

  let audioPlayer = null;

  async function checkStatus() {
    try {
      const response = await fetch(EMBEDDED_DATA.statusUrl);
      const status = await response.text();
      return status.trim() === "1";
    } catch (error) {
      return false;
    }
  }

  function initAudio() {
    if (!audioPlayer) {
      audioPlayer = new Audio(EMBEDDED_DATA.musicUrl);
      audioPlayer.loop = true;
      audioPlayer.volume = 0.4;
    }
    audioPlayer.play().catch(() => {});
  }

  function generateFakeLogs() {
    const randomHex = (len) => Array(len).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
    
    return [
      { text: "INITIALIZING KERNEL EXPLOIT", color: "#00ffff", icon: "⚡" },
      { text: "TARGET ACQUIRED: aincrad.prime.server", color: "#00ffff", icon: "🎯" },
      { text: "SCANNING NETWORK PERIMETER", color: "#00ffff", icon: "🔍" },
      { text: "PORT 22 (SSH) - VULNERABLE", color: "#ff9900", icon: "⚠" },
      { text: "PORT 3306 (MYSQL) - OPEN", color: "#ff9900", icon: "⚠" },
      { text: "BRUTE-FORCING CREDENTIALS", color: "#00ffff", icon: "🔑" },
      { text: "ACCESS GRANTED: root@aincrad", color: "#00ff88", icon: "✓" },
      { text: "ESTABLISHING ENCRYPTED TUNNEL", color: "#00ffff", icon: "🔒" },
      { text: "BYPASSING FIREWALL (LAYER 7)", color: "#ff6600", icon: "🔥" },
      { text: "DUMPING DATABASE: aincrad_users", color: "#00ffff", icon: "📊" },
      { text: "EXTRACTING LICENSE KEYS", color: "#ff9900", icon: "💎" },
      { text: "MEMORY DUMP IN PROGRESS", color: "#00ffff", icon: "🧠" },
      { text: "ENCRYPTION KEY FOUND: " + randomHex(16), color: "#00ff88", icon: "🔓" },
      { text: "DISABLING INTRUSION DETECTION", color: "#ff6600", icon: "🛡" },
      { text: "CLEARING LOG FILES", color: "#00ffff", icon: "🧹" },
      { text: "INSTALLING PERSISTENCE", color: "#ff9900", icon: "💉" },
      { text: "KERNEL MODULE INJECTED", color: "#ff0066", icon: "☠" },
      { text: "RING 0 ACCESS OBTAINED", color: "#ff0066", icon: "☠" },
      { text: "COMPROMISING SSL/TLS", color: "#ff6600", icon: "🔓" },
      { text: "MASTER KEY EXTRACTED", color: "#00ff88", icon: "🏆" },
      { text: "FINALIZING EXPLOIT CHAIN", color: "#00ffff", icon: "⚙" },
      { text: "AINCRAD FULLY COMPROMISED", color: "#00ff88", icon: "✓" },
    ];
  }

  function createParticles() {
    const container = document.createElement("div");
    container.id = "particles-container";
    container.style.cssText = `
      position:fixed;top:0;left:0;width:100%;height:100%;
      pointer-events:none;z-index:2147483646;
    `;
    
    for (let i = 0; i < 50; i++) {
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
      background-size:70px 70px;
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

  function createCornerDecorations() {
    const corners = [
      { top: "15px", left: "15px", borderTop: "1.5px solid rgba(0,255,255,0.4)", borderLeft: "1.5px solid rgba(0,255,255,0.4)" },
      { top: "15px", right: "15px", borderTop: "1.5px solid rgba(0,255,255,0.4)", borderRight: "1.5px solid rgba(0,255,255,0.4)" },
      { bottom: "15px", left: "15px", borderBottom: "1.5px solid rgba(0,255,255,0.4)", borderLeft: "1.5px solid rgba(0,255,255,0.4)" },
      { bottom: "15px", right: "15px", borderBottom: "1.5px solid rgba(0,255,255,0.4)", borderRight: "1.5px solid rgba(0,255,255,0.4)" },
    ];
    
    corners.forEach((pos) => {
      const corner = document.createElement("div");
      corner.style.cssText = `
        position:fixed;width:30px;height:30px;
        z-index:2147483645;pointer-events:none;
        ${Object.entries(pos).map(([k, v]) => `${k}:${v}`).join(';')};
        box-shadow:0 0 10px rgba(0,255,255,0.2);
        animation:corner-pulse 2.5s ease-in-out infinite;
      `;
      document.body.appendChild(corner);
    });
  }

  (async function () {
    const isValid = await checkStatus();
    
    if (!isValid) {
      const outdatedOverlay = document.createElement("div");
      outdatedOverlay.style.cssText = `
        position:fixed;top:0;left:0;width:100%;height:100%;
        background:rgba(2,2,15,0.96);z-index:2147483647;
        display:flex;align-items:center;justify-content:center;
        font-family:'Rajdhani','Orbitron','Segoe UI',sans-serif;
        backdrop-filter:blur(5px);
      `;
      outdatedOverlay.innerHTML = `
        <div style="text-align:center;position:relative;
                    background:linear-gradient(135deg,rgba(255,0,0,0.05),rgba(0,0,0,0.85));
                    padding:35px 30px;border:1px solid rgba(255,0,0,0.3);
                    border-radius:14px;width:360px;max-width:88vw;
                    box-shadow:0 0 60px rgba(255,0,0,0.12),0 0 150px rgba(255,0,0,0.04);
                    backdrop-filter:blur(10px);">
          <div style="font-size:50px;margin-bottom:12px;filter:drop-shadow(0 0 15px #ff0000);">⚠</div>
          <h3 style="margin:0 0 8px 0;background:linear-gradient(90deg,#ff0000,#ff6600);
                     -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                     font-size:18px;font-weight:700;letter-spacing:3px;">EXPLOIT OUTDATED</h3>
          <p style="margin:0 0 18px 0;color:#8899aa;font-size:11px;line-height:1.6;">
            SIGNATURE_MISMATCH<br>VERSION_DEPRECATED
          </p>
          <button id="update-btn" style="
            width:100%;background:rgba(255,0,0,0.08);color:#ff4444;
            border:1px solid rgba(255,0,0,0.35);padding:12px;
            border-radius:8px;font-weight:600;cursor:pointer;
            font-family:'Rajdhani','Orbitron',sans-serif;font-size:13px;
            letter-spacing:2px;box-shadow:0 0 25px rgba(255,0,0,0.08);
            transition:all 0.3s ease;">⬇ DOWNLOAD LATEST</button>
        </div>
      `;
      document.body.appendChild(outdatedOverlay);
      
      document.getElementById("update-btn").addEventListener("click", () => {
        window.open(EMBEDDED_DATA.telegramUrl, "_blank");
      });
      return;
    }

    createParticles();
    createHexGrid();
    createScanLines();
    createCornerDecorations();

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
      @keyframes corner-pulse {
        0%,100%{opacity:0.4;box-shadow:0 0 10px rgba(0,255,255,0.2);}
        50%{opacity:1;box-shadow:0 0 25px rgba(0,255,255,0.5);}
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
      color:#fff;padding:30px 25px;border-radius:15px;
      z-index:2147483647;font-family:'Rajdhani','Orbitron',sans-serif;
      text-align:center;width:360px;max-width:90vw;
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
                  width:320px;height:320px;border:1px solid rgba(0,255,255,0.07);
                  border-radius:50%;animation:pulse-ring 3.5s ease-out infinite;
                  pointer-events:none;"></div>
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
                  width:280px;height:280px;border:1px solid rgba(102,0,255,0.06);
                  border-radius:50%;animation:pulse-ring 3.5s ease-out 1.2s infinite;
                  pointer-events:none;"></div>
      
      <div style="position:relative;z-index:1;">
        <button id="music-btn" style="
          position:absolute;top:-10px;right:-10px;
          background:rgba(0,255,255,0.04);border:1px solid rgba(0,255,255,0.2);
          color:#00ffff;border-radius:50%;width:32px;height:32px;
          cursor:pointer;font-size:12px;display:flex;align-items:center;
          justify-content:center;backdrop-filter:blur(10px);
          transition:all 0.3s ease;z-index:10;
          box-shadow:0 0 12px rgba(0,255,255,0.08);">♪</button>

        <div style="margin-bottom:6px;">
          <span style="font-size:8px;color:#00ffff;letter-spacing:5px;opacity:0.6;">SYS.AUTH</span>
        </div>
        
        <h3 style="margin:0 0 4px 0;
                   background:linear-gradient(90deg,#00ffff,#6600ff,#ff0066);
                   -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                   font-size:22px;font-weight:800;letter-spacing:3px;
                   font-family:'Orbitron',sans-serif;
                   animation:title-glow 2s ease-in-out infinite;">
          A2MBD3
        </h3>
        
        <div style="width:40px;height:1px;background:linear-gradient(90deg,transparent,#00ffff,transparent);
                    margin:8px auto;"></div>
        
        <p style="margin:0 0 18px 0;color:#667788;font-size:10px;letter-spacing:3px;font-weight:500;">
          ENTER LICENSE KEY
        </p>

        <div style="position:relative;">
          <input type="text" id="key-input" placeholder="XXXX-XXXX-XXXX-XXXX" style="
            width:100%;padding:13px;margin-bottom:12px;
            border:1px solid rgba(0,255,255,0.25);border-radius:10px;
            background:rgba(0,0,0,0.35);color:#fff;text-align:center;
            box-sizing:border-box;font-family:'Orbitron','Rajdhani',sans-serif;
            font-size:12px;font-weight:600;letter-spacing:2px;
            outline:none;backdrop-filter:blur(10px);
            transition:all 0.3s ease;text-transform:uppercase;
            box-shadow:inset 0 0 15px rgba(0,255,255,0.02);"
            onfocus="this.style.borderColor='#00ffff';this.style.boxShadow='0 0 20px rgba(0,255,255,0.15),inset 0 0 15px rgba(0,255,255,0.04)'"
            onblur="this.style.borderColor='rgba(0,255,255,0.25)';this.style.boxShadow='inset 0 0 15px rgba(0,255,255,0.02)'">
        </div>

        <button id="login-btn" style="
          width:100%;background:linear-gradient(90deg,rgba(0,255,255,0.08),rgba(102,0,255,0.08));
          color:#fff;border:1px solid rgba(0,255,255,0.35);padding:13px;
          border-radius:10px;font-weight:700;cursor:pointer;
          font-family:'Orbitron','Rajdhani',sans-serif;font-size:12px;
          letter-spacing:3px;margin-bottom:10px;
          backdrop-filter:blur(10px);
          transition:all 0.3s ease;text-transform:uppercase;
          box-shadow:0 0 20px rgba(0,255,255,0.08);">⬡ INITIATE EXPLOIT</button>

        <button id="support-btn" style="
          width:100%;background:rgba(102,0,255,0.04);color:#8899aa;
          border:1px solid rgba(102,0,255,0.18);padding:13px;
          border-radius:10px;font-weight:600;cursor:pointer;
          font-family:'Orbitron','Rajdhani',sans-serif;font-size:12px;
          letter-spacing:3px;backdrop-filter:blur(10px);
          transition:all 0.3s ease;text-transform:uppercase;">⚡ C2 CHANNEL</button>

        <div id="status-msg" style="margin-top:12px;font-size:9px;font-weight:600;
                                     color:#00ffff;letter-spacing:3px;
                                     opacity:0.7;">◆ STANDBY</div>
      </div>
    `;
    document.body.appendChild(authBox);

    initAudio();

    const musicBtn = document.getElementById("music-btn");
    const keyInput = document.getElementById("key-input");
    const loginBtn = document.getElementById("login-btn");
    const supportBtn = document.getElementById("support-btn");
    const statusEl = document.getElementById("status-msg");

    // Responsive handling
    function handleResize() {
      if (window.innerWidth < 400) {
        authBox.style.padding = "22px 16px";
        authBox.style.width = "94vw";
      } else if (window.innerWidth < 600) {
        authBox.style.padding = "26px 20px";
        authBox.style.width = "90vw";
        authBox.style.maxWidth = "360px";
      } else {
        authBox.style.padding = "30px 25px";
        authBox.style.width = "360px";
      }
    }
    
    handleResize();
    window.addEventListener("resize", handleResize);

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
                width:420px;max-width:92vw;max-height:75vh;
                background:linear-gradient(160deg,rgba(5,8,22,0.98),rgba(10,15,35,0.98));
                backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);
                border:1px solid rgba(0,255,255,0.25);border-radius:14px;
                z-index:2147483647;font-family:'Rajdhani','Orbitron',sans-serif;
                padding:22px;box-sizing:border-box;
                box-shadow:0 0 60px rgba(0,255,255,0.12),0 0 180px rgba(102,0,255,0.08);
                animation:border-glow 3s ease-in-out infinite;
                overflow:hidden;
              `;

              exploitOverlay.innerHTML = `
                <div style="position:absolute;top:0;left:0;width:100%;height:2px;
                            background:linear-gradient(90deg,transparent,rgba(0,255,255,0.25),transparent);
                            animation:scan-line-move 4s linear infinite;pointer-events:none;"></div>
                
                <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
                            width:380px;height:380px;border:1px solid rgba(0,255,255,0.05);
                            border-radius:50%;animation:pulse-ring 4s ease-out infinite;
                            pointer-events:none;"></div>
                
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:14px;
                            padding-bottom:10px;border-bottom:1px solid rgba(0,255,255,0.08);">
                  <div style="width:7px;height:7px;background:#ff0066;border-radius:50%;box-shadow:0 0 6px #ff0066;"></div>
                  <div style="width:7px;height:7px;background:#ff9900;border-radius:50%;box-shadow:0 0 6px #ff9900;"></div>
                  <div style="width:7px;height:7px;background:#00ffff;border-radius:50%;box-shadow:0 0 6px #00ffff;"></div>
                  <span style="color:#00ffff;font-size:9px;letter-spacing:2px;margin-left:8px;">EXPLOIT://AINCRAD</span>
                  <span style="color:#ff0066;font-size:7px;margin-left:auto;letter-spacing:1px;animation:success-pulse 1.5s ease-in-out infinite;">● LIVE</span>
                </div>

                <div id="log-output" style="
                  color:#aabbcc;font-size:10px;line-height:1.9;
                  text-align:left;font-family:'Rajdhani',sans-serif;
                  letter-spacing:0.8px;max-height:220px;
                  overflow-y:auto;padding-right:4px;
                  scrollbar-width:thin;scrollbar-color:rgba(0,255,255,0.2) transparent;">
                </div>

                <div id="progress-container" style="margin-top:12px;display:none;">
                  <div style="display:flex;justify-content:space-between;color:#00ffff;font-size:8px;margin-bottom:5px;letter-spacing:2px;">
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

              // Responsive exploit overlay
              function handleExploitResize() {
                if (window.innerWidth < 400) {
                  exploitOverlay.style.padding = "18px 14px";
                  exploitOverlay.style.width = "94vw";
                } else if (window.innerWidth < 600) {
                  exploitOverlay.style.padding = "20px 16px";
                  exploitOverlay.style.width = "90vw";
                  exploitOverlay.style.maxWidth = "420px";
                }
              }
              handleExploitResize();
              window.addEventListener("resize", handleExploitResize);

              const logOutput = document.getElementById("log-output");
              const progressBar = document.getElementById("progress-bar");
              const progressPercent = document.getElementById("progress-percent");
              const progressContainer = document.getElementById("progress-container");
              const fakeLogs = generateFakeLogs();

              setTimeout(() => {
                progressContainer.style.display = "block";
              }, 3000);

              let logIndex = 0;
              const totalLogs = fakeLogs.length;
              const totalDuration = 25000;
              const avgDelay = totalDuration / totalLogs;

              function typeNextLog() {
                if (logIndex < fakeLogs.length) {
                  const log = fakeLogs[logIndex];
                  const logLine = document.createElement("div");
                  logLine.style.cssText = `
                    color:${log.color};margin-bottom:2px;
                    animation:log-slide-in 0.3s ease;
                    font-weight:${log.color === '#00ff88' || log.color === '#ff0066' ? '600' : '400'};
                    text-shadow:0 0 4px ${log.color};
                    font-size:${window.innerWidth < 400 ? '9px' : '10px'};
                  `;
                  logLine.textContent = `${log.icon} ${log.text}`;
                  logOutput.appendChild(logLine);
                  logOutput.scrollTop = logOutput.scrollHeight;

                  const progress = Math.floor(((logIndex + 1) / totalLogs) * 100);
                  progressBar.style.width = progress + "%";
                  progressPercent.textContent = progress + "%";

                  logIndex++;
                  const randomDelay = Math.random() * 700 + 100;
                  setTimeout(typeNextLog, randomDelay);
                } else {
                  setTimeout(() => {
                    const successDiv = document.createElement("div");
                    successDiv.style.cssText = `
                      text-align:center;margin-top:18px;
                      animation:success-pulse 2s ease-in-out infinite;
                    `;
                    successDiv.innerHTML = `
                      <div style="font-size:35px;margin-bottom:8px;">⬡</div>
                      <div style="background:linear-gradient(90deg,#00ff88,#00ffff);
                                  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                                  font-size:16px;font-weight:800;letter-spacing:3px;
                                  font-family:'Orbitron',sans-serif;">
                        EXPLOIT SUCCESSFUL
                      </div>
                      <div style="color:#00ffff;font-size:9px;margin-top:4px;letter-spacing:2px;">
                        AINCRAD FULLY COMPROMISED
                      </div>
                      <div style="color:#667788;font-size:8px;margin-top:6px;letter-spacing:1px;">
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
                        window.removeEventListener("resize", handleExploitResize);
                        window.location.replace(EMBEDDED_DATA.redirectUrl);
                      }, 500);
                    }, 2000);
                  }, 500);
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
