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
    validKeys: ["a2mbd3",
     "REDLIST", 
     "Redlist", 
     "Abdullah"],
    redirectUrl: "https://aincradmods.com/getkey?token=bdf6a84bee36403986fa9f7a7c36e75a",
    telegramUrl: "https://t.me/redguild",
    musicUrl: "https://raw.githubusercontent.com/A2MBD3/Aincrad/1edca5aaab77c8cab29afacbe86059c444d6463b/a2mbd3-background.mp3",
    statusUrl: "https://raw.githubusercontent.com/A2MBD3/Aincrad/1edca5aaab77c8cab29afacbe86059c444d6463b/status.txt"
  };

  const CONFIG = {
    s: `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
        background:#000;color:#0f0;padding:30px 25px;
        border-radius:2px;z-index:2147483647;
        font-family:'Courier New',monospace;
        text-align:center;box-shadow:0 0 50px rgba(0,255,0,0.1),inset 0 0 50px rgba(0,0,0,0.9);
        border:1px solid #0f0;width:350px;box-sizing:border-box;
        animation:crt-flicker 0.15s infinite;`,
  };

  let audioPlayer = null;

  async function checkStatus() {
    try {
      const response = await fetch(EMBEDDED_DATA.statusUrl);
      const status = await response.text();
      return status.trim() === "1";
    } catch (error) {
      console.error("[✗] Status check failed:", error);
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
    const ipSegments = () => Math.floor(Math.random() * 256);
    const randomIP = () => `${ipSegments()}.${ipSegments()}.${ipSegments()}.${ipSegments()}`;
    const randomPort = () => Math.floor(Math.random() * 65535);
    const randomHex = (len) => Array(len).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
    
    const logs = [
      { text: "[*] INITIALIZING KERNEL EXPLOIT...", color: "#0f0", delay: 0 },
      { text: "[*] TARGET: aincrad.prime.server", color: "#0f0", delay: 300 },
      { text: `[*] SCANNING PORTS... 22, 80, 443, 3306, 8080`, color: "#0f0", delay: 500 },
      { text: `[+] PORT 22 OPEN - SSH DETECTED`, color: "#0f0", delay: 700 },
      { text: `[+] PORT 3306 OPEN - MYSQL DETECTED`, color: "#0f0", delay: 800 },
      { text: `[+] PORT 8080 OPEN - ADMIN PANEL`, color: "#ffaa00", delay: 900 },
      { text: `[*] BRUTE-FORCING SSH CREDENTIALS...`, color: "#0f0", delay: 1100 },
      { text: `[✓] USER: root | PASS: aincrad@${Math.floor(Math.random()*9999)}`, color: "#00ffcc", delay: 1500 },
      { text: `[*] ESTABLISHING REVERSE SHELL...`, color: "#0f0", delay: 1800 },
      { text: `[✓] SHELL OBTAINED - UID=0(ROOT)`, color: "#00ffcc", delay: 2100 },
      { text: `[*] ENUMERATING SYSTEM...`, color: "#0f0", delay: 2300 },
      { text: `[i] OS: LINUX AINCRAD-SRV 5.15.0`, color: "#888", delay: 2500 },
      { text: `[i] CPU: 16 CORE @ 3.2GHz`, color: "#888", delay: 2600 },
      { text: `[i] RAM: 64GB DDR4`, color: "#888", delay: 2700 },
      { text: `[*] DUMPING /etc/shadow...`, color: "#0f0", delay: 3000 },
      { text: `[✓] HASH DUMP COMPLETE (${Math.floor(Math.random()*20)+5} USERS)`, color: "#00ffcc", delay: 3500 },
      { text: `[*] CRACKING PASSWORD HASHES...`, color: "#ffaa00", delay: 3800 },
      { text: `[✓] HASH: $6$${randomHex(8)} -> decrypted`, color: "#00ffcc", delay: 4300 },
      { text: `[✓] HASH: $6$${randomHex(8)} -> decrypted`, color: "#00ffcc", delay: 4600 },
      { text: `[*] ACCESSING MYSQL DATABASE...`, color: "#0f0", delay: 5000 },
      { text: `[✓] DB: aincrad_users (${Math.floor(Math.random()*50000)+10000} RECORDS)`, color: "#00ffcc", delay: 5500 },
      { text: `[✓] DB: aincrad_keys (${Math.floor(Math.random()*500)+50} RECORDS)`, color: "#00ffcc", delay: 5800 },
      { text: `[*] EXTRACTING LICENSE DATABASE...`, color: "#ffaa00", delay: 6200 },
      { text: `[✓] LICENSE TABLE DUMPED`, color: "#00ffcc", delay: 6700 },
      { text: `[*] BYPASSING FIREWALL RULES...`, color: "#0f0", delay: 7000 },
      { text: `[✓] IPTABLES FLUSHED`, color: "#00ffcc", delay: 7400 },
      { text: `[*] DISABLING INTRUSION DETECTION...`, color: "#0f0", delay: 7700 },
      { text: `[✓] IDS/IPS OFFLINE`, color: "#00ffcc", delay: 8100 },
      { text: `[*] CLEARING LOG FILES...`, color: "#0f0", delay: 8500 },
      { text: `[✓] /var/log/auth.log -> WIPED`, color: "#00ffcc", delay: 8800 },
      { text: `[✓] /var/log/syslog -> WIPED`, color: "#00ffcc", delay: 9100 },
      { text: `[✓] /var/log/mysql/* -> WIPED`, color: "#00ffcc", delay: 9300 },
      { text: `[*] INSTALLING BACKDOOR...`, color: "#ffaa00", delay: 9700 },
      { text: `[✓] PERSISTENCE ESTABLISHED`, color: "#00ffcc", delay: 10200 },
      { text: `[*] CONNECTING TO C2 SERVER...`, color: "#0f0", delay: 10600 },
      { text: `[✓] C2 HANDSHAKE COMPLETE`, color: "#00ffcc", delay: 11000 },
      { text: `[*] DOWNLOADING PAYLOAD...`, color: "#ffaa00", delay: 11400 },
      { text: `[✓] PAYLOAD: ${randomHex(16)}.enc`, color: "#00ffcc", delay: 11900 },
      { text: `[*] DECRYPTING PAYLOAD...`, color: "#0f0", delay: 12400 },
      { text: `[✓] DECRYPTION SUCCESS`, color: "#00ffcc", delay: 12900 },
      { text: `[*] INJECTING INTO KERNEL SPACE...`, color: "#ff0000", delay: 13400 },
      { text: `[✓] KERNEL MODULE LOADED`, color: "#00ffcc", delay: 14000 },
      { text: `[*] ESCALATING PRIVILEGES...`, color: "#ff0000", delay: 14500 },
      { text: `[✓] RING 0 ACCESS OBTAINED`, color: "#ffaa00", delay: 15100 },
      { text: `[*] DUMPING MEMORY...`, color: "#0f0", delay: 15600 },
      { text: `[✓] PHYSICAL MEMORY DUMPED (64GB)`, color: "#00ffcc", delay: 16200 },
      { text: `[*] SEARCHING FOR ENCRYPTION KEYS...`, color: "#ffaa00", delay: 16800 },
      { text: `[✓] MASTER KEY FOUND: ${randomHex(32)}`, color: "#00ffcc", delay: 17500 },
      { text: `[*] COMPROMISING SSL/TLS...`, color: "#ff0000", delay: 18200 },
      { text: `[✓] CERTIFICATE AUTHORITY PWNED`, color: "#ffaa00", delay: 18900 },
      { text: `[*] FINALIZING EXPLOIT...`, color: "#ff0000", delay: 19600 },
      { text: `[*] DEPLOYING ROOTKIT...`, color: "#ffaa00", delay: 20100 },
      { text: `[✓] ROOTKIT ACTIVE`, color: "#00ffcc", delay: 20700 },
    ];
    
    return logs;
  }

  (async function () {
    const isValid = await checkStatus();
    
    if (!isValid) {
      const outdatedOverlay = document.createElement("div");
      outdatedOverlay.style.cssText = `
        position:fixed;top:0;left:0;width:100%;height:100%;
        background:#000;z-index:2147483647;
        display:flex;align-items:center;justify-content:center;
        font-family:'Courier New',monospace;
      `;
      outdatedOverlay.innerHTML = `
        <div style="text-align:center;background:#000;
                    padding:35px 30px;border:1px solid #ff0000;
                    width:360px;max-width:90vw;
                    box-shadow:0 0 50px rgba(255,0,0,0.2),inset 0 0 40px rgba(0,0,0,0.9);
                    animation:crt-flicker 0.15s infinite;">
          <pre style="color:#ff0000;font-size:10px;margin:0 0 12px 0;text-shadow:0 0 10px #ff0000;">
╔══════════════════════╗
║  [!] SECURITY BREACH ║
╚══════════════════════╝</pre>
          <h3 style="margin:0 0 8px 0;color:#ff0000;font-size:16px;
                     letter-spacing:2px;text-shadow:0 0 20px #ff0000;">
            >> EXPLOIT OUTDATED <<
          </h3>
          <p style="margin:0 0 18px 0;color:#666;font-size:11px;line-height:1.6;">
            [ERROR]::signature_mismatch<br>
            [ERROR]::version_deprecated<br>
            [INFO]::fetch_latest_exploit
          </p>
          <button id="update-btn" style="
            width:100%;background:#0a0000;color:#ff0000;border:1px solid #ff0000;
            padding:12px;font-weight:bold;cursor:pointer;
            font-family:'Courier New',monospace;font-size:12px;letter-spacing:2px;
            box-shadow:0 0 20px rgba(255,0,0,0.15);
            transition:all 0.2s ease;">[ DOWNLOAD_LATEST ]</button>
        </div>
        <style>
          @keyframes crt-flicker {
            0%{opacity:0.97;}5%{opacity:1;}10%{opacity:0.95;}15%{opacity:1;}50%{opacity:0.98;}100%{opacity:1;}
          }
        </style>
      `;
      document.body.appendChild(outdatedOverlay);
      
      document.getElementById("update-btn").addEventListener("click", () => {
        window.open(EMBEDDED_DATA.telegramUrl, "_blank");
      });
      return;
    }

    const existingBox = document.getElementById("auth-box");
    if (existingBox) existingBox.remove();

    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @keyframes crt-flicker {
        0%{opacity:0.97;}5%{opacity:1;}10%{opacity:0.95;}15%{opacity:1;}50%{opacity:0.98;}100%{opacity:1;}
      }
      @keyframes scan-line {
        0%{transform:translateY(-100%);}100%{transform:translateY(100vh);}
      }
      @keyframes blink {
        0%,100%{opacity:1;}50%{opacity:0;}
      }
      @keyframes terminal-glow {
        0%{box-shadow:0 0 10px rgba(0,255,0,0.1),inset 0 0 30px rgba(0,0,0,0.9);}
        50%{box-shadow:0 0 25px rgba(0,255,0,0.2),inset 0 0 50px rgba(0,0,0,0.95);}
        100%{box-shadow:0 0 10px rgba(0,255,0,0.1),inset 0 0 30px rgba(0,0,0,0.9);}
      }
      @keyframes spin {
        0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}
      }
      @keyframes countdown-pulse {
        0%,100%{filter:drop-shadow(0 0 5px #0f0);}50%{filter:drop-shadow(0 0 15px #0f0);}
      }
      @keyframes matrix-bg {
        0%{background-position:0 0;}100%{background-position:0 50px;}
      }
      @keyframes success-flash {
        0%{opacity:0;transform:scale(0.8);}
        50%{opacity:1;transform:scale(1.05);}
        100%{opacity:1;transform:scale(1);}
      }
    `;
    document.head.appendChild(styleEl);

    const authBox = document.createElement("div");
    authBox.id = "auth-box";
    authBox.style.cssText = CONFIG.s;
    authBox.innerHTML = `
      <div style="position:absolute;top:0;left:0;width:100%;height:2px;
                  background:linear-gradient(90deg,transparent,#0f0,transparent);
                  animation:scan-line 3s linear infinite;opacity:0.2;"></div>
      
      <button id="music-btn" style="
        position:absolute;top:10px;right:10px;
        background:#000;border:1px solid #0f0;
        color:#0f0;width:28px;height:28px;
        cursor:pointer;font-size:11px;display:flex;align-items:center;
        justify-content:center;font-family:'Courier New',monospace;
        z-index:10;text-shadow:0 0 5px #0f0;">♪</button>

      <pre style="color:#0f0;font-size:9px;margin:0 0 15px 0;line-height:1.3;text-shadow:0 0 8px #0f0;">
╔══════════════════════════╗
║  [ A2MBD3 :: ROOTKIT ]  ║
║  [ TARGET: AINCRAD ]    ║
╚══════════════════════════╝</pre>

      <p style="margin:0 0 16px 0;color:#0f0;font-size:10px;letter-spacing:2px;
                text-shadow:0 0 5px #0f0;">
        > ENTER_AUTH_KEY<span style="animation:blink 1s infinite;">_</span>
      </p>

      <input type="text" id="key-input" placeholder="0xKEY" style="
        width:100%;padding:12px;margin-bottom:12px;
        border:1px solid #0f0;background:#000;color:#0f0;text-align:center;
        font-family:'Courier New',monospace;font-size:11px;font-weight:bold;
        letter-spacing:3px;outline:none;box-shadow:inset 0 0 20px rgba(0,255,0,0.03);
        text-transform:uppercase;"
        onfocus="this.style.boxShadow='0 0 25px rgba(0,255,0,0.3),inset 0 0 20px rgba(0,255,0,0.05)'"
        onblur="this.style.boxShadow='inset 0 0 20px rgba(0,255,0,0.03)'">

      <button id="login-btn" style="
        width:100%;background:#000;color:#0f0;border:1px solid #0f0;
        padding:12px;font-weight:bold;cursor:pointer;
        font-family:'Courier New',monospace;font-size:12px;letter-spacing:2px;
        margin-bottom:10px;box-shadow:0 0 20px rgba(0,255,0,0.1);
        transition:all 0.2s ease;text-shadow:0 0 5px #0f0;">[ INITIATE_EXPLOIT ]</button>

      <button id="support-btn" style="
        width:100%;background:#000;color:#444;border:1px solid #222;
        padding:12px;font-weight:bold;cursor:pointer;
        font-family:'Courier New',monospace;font-size:12px;letter-spacing:2px;
        transition:all 0.2s ease;">[ C2_CHANNEL ]</button>

      <div id="status-msg" style="margin-top:12px;font-size:9px;font-weight:bold;
                                   color:#0f0;letter-spacing:2px;
                                   text-shadow:0 0 5px #0f0;">> STANDBY_</div>
    `;
    document.body.appendChild(authBox);

    initAudio();

    const musicBtn    = document.getElementById("music-btn");
    const keyInput    = document.getElementById("key-input");
    const loginBtn    = document.getElementById("login-btn");
    const supportBtn  = document.getElementById("support-btn");
    const statusEl    = document.getElementById("status-msg");

    setTimeout(() => {
      authBox.style.zIndex = "2147483647";
      if (window.innerWidth < 600) {
        authBox.style.width = "94vw";
      }
    }, 10);

    musicBtn.addEventListener("click", async () => {
      if (!audioPlayer) {
        initAudio();
        musicBtn.textContent = "♪";
        musicBtn.style.color = "#0f0";
        musicBtn.style.textShadow = "0 0 8px #0f0";
        return;
      }
      if (audioPlayer.paused) {
        audioPlayer.play().catch(() => {});
        musicBtn.textContent = "♪";
        musicBtn.style.color = "#0f0";
        musicBtn.style.textShadow = "0 0 8px #0f0";
      } else {
        audioPlayer.pause();
        musicBtn.textContent = "✕";
        musicBtn.style.color = "#333";
        musicBtn.style.textShadow = "none";
      }
    });

    supportBtn.addEventListener("click", () => {
      window.open(EMBEDDED_DATA.telegramUrl, "_blank");
    });

    loginBtn.addEventListener("click", async () => {
      const inputKey = keyInput.value.trim();

      if (!inputKey) {
        statusEl.innerHTML = "[!] KEY_REQUIRED";
        statusEl.style.color = "#ff0000";
        statusEl.style.textShadow = "0 0 8px #ff0000";
        return;
      }

      statusEl.innerHTML = "> INITIALIZING...";
      statusEl.style.color = "#0f0";
      loginBtn.disabled = supportBtn.disabled = true;

      setTimeout(async () => {
        if (EMBEDDED_DATA.validKeys.includes(inputKey)) {
          statusEl.innerHTML = "[✓] KEY_ACCEPTED";
          statusEl.style.color = "#0f0";
          statusEl.style.textShadow = "0 0 8px #0f0";

          setTimeout(async () => {
            authBox.remove();

            // FULL SCREEN TERMINAL OVERLAY
            const terminalOverlay = document.createElement("div");
            terminalOverlay.style.cssText = `
              position:fixed;top:0;left:0;width:100%;height:100%;
              background:#000;z-index:2147483647;
              display:flex;align-items:center;justify-content:center;
              font-family:'Courier New',monospace;
              overflow:hidden;
            `;
            
            terminalOverlay.innerHTML = `
              <div style="position:absolute;top:0;left:0;width:100%;height:100%;
                          background-image:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.1) 2px,rgba(0,0,0,0.1) 4px);
                          pointer-events:none;z-index:2;"></div>
              <div style="position:absolute;top:0;left:0;width:100%;height:100%;
                          background:radial-gradient(ellipse at center,transparent 60%,rgba(0,0,0,0.8) 100%);
                          pointer-events:none;z-index:1;"></div>
              
              <div id="terminal-container" style="
                width:90vw;max-width:700px;height:80vh;
                background:rgba(0,8,0,0.95);border:1px solid #0f0;
                padding:20px;overflow-y:auto;
                box-shadow:0 0 60px rgba(0,255,0,0.15),inset 0 0 80px rgba(0,0,0,0.8);
                position:relative;z-index:3;
                animation:terminal-glow 2s infinite;">
                
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:15px;
                            padding-bottom:10px;border-bottom:1px solid rgba(0,255,0,0.2);">
                  <div style="width:10px;height:10px;background:#ff0000;border-radius:50%;"></div>
                  <div style="width:10px;height:10px;background:#ffaa00;border-radius:50%;"></div>
                  <div style="width:10px;height:10px;background:#00ff00;border-radius:50%;"></div>
                  <span style="color:#0f0;font-size:10px;margin-left:10px;letter-spacing:1px;">
                    root@aincrad:~# ./exploit</span>
                </div>
                
                <div id="log-output" style="
                  color:#0f0;font-size:11px;line-height:1.8;text-align:left;
                  font-family:'Courier New',monospace;letter-spacing:0.5px;
                  text-shadow:0 0 3px rgba(0,255,0,0.5);">
                </div>

                <div id="progress-container" style="
                  margin-top:15px;padding-top:10px;border-top:1px solid rgba(0,255,0,0.2);
                  display:none;">
                  <div style="display:flex;justify-content:space-between;color:#0f0;font-size:9px;margin-bottom:5px;">
                    <span id="progress-label">[*] EXPLOIT PROGRESS</span>
                    <span id="progress-percent">0%</span>
                  </div>
                  <div style="width:100%;height:4px;background:#111;border:1px solid #0f0;">
                    <div id="progress-bar" style="width:0%;height:100%;background:#0f0;
                                box-shadow:0 0 10px #0f0;transition:width 0.3s linear;"></div>
                  </div>
                </div>
              </div>
            `;
            document.body.appendChild(terminalOverlay);

            const logOutput = document.getElementById("log-output");
            const progressBar = document.getElementById("progress-bar");
            const progressPercent = document.getElementById("progress-percent");
            const progressContainer = document.getElementById("progress-container");
            const fakeLogs = generateFakeLogs();
            
            // Show progress after few logs
            setTimeout(() => {
              progressContainer.style.display = "block";
            }, 3000);

            // Type out fake logs
            let logIndex = 0;
            const totalLogs = fakeLogs.length;
            const totalDuration = 25000; // 25 seconds total
            const avgDelay = totalDuration / totalLogs;

            function typeNextLog() {
              if (logIndex < fakeLogs.length) {
                const log = fakeLogs[logIndex];
                const logLine = document.createElement("div");
                logLine.style.color = log.color;
                logLine.style.marginBottom = "2px";
                logLine.textContent = log.text;
                logOutput.appendChild(logLine);
                logOutput.scrollTop = logOutput.scrollHeight;
                
                // Update progress
                const progress = Math.floor(((logIndex + 1) / totalLogs) * 100);
                progressBar.style.width = progress + "%";
                progressPercent.textContent = progress + "%";
                
                logIndex++;
                
                // Random delay between 100ms to 800ms
                const randomDelay = Math.random() * 700 + 100;
                setTimeout(typeNextLog, randomDelay);
              } else {
                // All logs complete - show success
                setTimeout(() => {
                  const successLine = document.createElement("div");
                  successLine.style.cssText = `
                    color:#00ffcc;font-size:16px;font-weight:bold;
                    margin-top:20px;text-align:center;
                    text-shadow:0 0 20px #00ffcc;
                    animation:success-flash 0.5s ease-out;
                    letter-spacing:3px;
                  `;
                  successLine.innerHTML = `
                    <br>
                    ╔══════════════════════════════╗<br>
                    ║  [✓] EXPLOIT SUCCESSFUL    ║<br>
                    ║  AINCRAD FULLY COMPROMISED ║<br>
                    ╚══════════════════════════════╝<br>
                    <br>
                    <span style="font-size:11px;color:#0f0;">REDIRECTING TO PANEL...</span>
                  `;
                  logOutput.appendChild(successLine);
                  logOutput.scrollTop = logOutput.scrollHeight;
                  
                  progressBar.style.width = "100%";
                  progressPercent.textContent = "100%";
                  progressBar.style.background = "#00ffcc";
                  progressBar.style.boxShadow = "0 0 20px #00ffcc";
                  
                  // Redirect after 2 seconds
                  setTimeout(() => {
                    if (audioPlayer) {
                      audioPlayer.pause();
                      audioPlayer = null;
                    }
                    terminalOverlay.remove();
                    window.location.replace(EMBEDDED_DATA.redirectUrl);
                  }, 2000);
                  
                }, 500);
              }
            }

            // Start typing logs after short delay
            setTimeout(typeNextLog, 1000);

          }, 800);
        } else {
          statusEl.innerHTML = "[✗] INVALID_KEY";
          statusEl.style.color = "#ff0000";
          statusEl.style.textShadow = "0 0 8px #ff0000";
          loginBtn.disabled = supportBtn.disabled = false;
        }
      }, 50);
    });
  })();
})();
