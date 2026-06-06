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
        background:#0a0a0a;color:#0f0;padding:30px 25px;
        border-radius:4px;z-index:2147483647;
        font-family:'Courier New',monospace;
        text-align:center;box-shadow:0 0 40px rgba(0,255,0,0.15),inset 0 0 40px rgba(0,0,0,0.8);
        border:1px solid #0f0;width:340px;box-sizing:border-box;
        animation: crt-flicker 0.15s infinite;`,
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
      audioPlayer.volume = 0.5;
    }
    audioPlayer.play().catch(() => {
      console.log("[!] Autoplay blocked, waiting for user interaction");
    });
  }

  function typeEffect(element, text, speed = 50) {
    let i = 0;
    element.textContent = "";
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
  }

  (async function () {
    const isValid = await checkStatus();
    
    if (!isValid) {
      const outdatedOverlay = document.createElement("div");
      outdatedOverlay.style.cssText = `
        position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.92); z-index:2147483647;
        display:flex; align-items:center; justify-content:center;
        font-family:'Courier New',monospace;
      `;
      outdatedOverlay.innerHTML = `
        <div style="text-align:center; background:#0a0a0a;
                    padding:35px 30px; border-radius:4px;
                    border:1px solid #ff0000; width:340px;max-width:90vw;
                    box-shadow:0 0 40px rgba(255,0,0,0.2),inset 0 0 30px rgba(0,0,0,0.8);
                    animation:crt-flicker 0.15s infinite;">
          <div style="font-size:42px; margin-bottom:15px;filter:drop-shadow(0 0 10px #ff0000);">[!]</div>
          <h3 style="margin:0 0 10px 0;color:#ff0000;font-size:18px;font-weight:bold;
                     letter-spacing:2px;text-shadow:0 0 15px #ff0000;">
            >> SCRIPT OUTDATED <<
          </h3>
          <p style="margin:0 0 20px 0;color:#888;font-size:12px;">
            [ERROR]::version_mismatch<br>
            [INFO]::update_required
          </p>
          <button id="update-btn" style="
            width:100%;background:#1a0000;color:#ff0000;border:1px solid #ff0000;
            padding:12px;border-radius:2px;font-weight:bold;cursor:pointer;
            font-family:'Courier New',monospace;font-size:13px;letter-spacing:1px;
            box-shadow:0 0 15px rgba(255,0,0,0.2);
            transition:all 0.2s ease;">[ GET_UPDATE ]</button>
        </div>
        <style>
          @keyframes crt-flicker {
            0% { opacity: 0.98; }
            5% { opacity: 1; }
            10% { opacity: 0.96; }
            15% { opacity: 1; }
            50% { opacity: 0.99; }
            100% { opacity: 1; }
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
        0% { opacity: 0.98; }
        5% { opacity: 1; }
        10% { opacity: 0.96; }
        15% { opacity: 1; }
        50% { opacity: 0.99; }
        100% { opacity: 1; }
      }
      @keyframes scan-line {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
      @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @keyframes matrix-rain {
        0% { background-position: 0 0; }
        100% { background-position: 0 100%; }
      }
      @keyframes terminal-glow {
        0% { box-shadow: 0 0 10px rgba(0,255,0,0.2),inset 0 0 30px rgba(0,0,0,0.8); }
        50% { box-shadow: 0 0 25px rgba(0,255,0,0.35),inset 0 0 50px rgba(0,0,0,0.9); }
        100% { box-shadow: 0 0 10px rgba(0,255,0,0.2),inset 0 0 30px rgba(0,0,0,0.8); }
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes countdown-pulse {
        0%, 100% { filter: drop-shadow(0 0 8px #0f0); }
        50% { filter: drop-shadow(0 0 20px #0f0); }
      }
    `;
    document.head.appendChild(styleEl);

    const authBox = document.createElement("div");
    authBox.id = "auth-box";
    authBox.style.cssText = CONFIG.s;
    authBox.innerHTML = `
      <div style="position:absolute;top:0;left:0;width:100%;height:2px;
                  background:linear-gradient(90deg,transparent,#0f0,transparent);
                  animation:scan-line 3s linear infinite;opacity:0.3;"></div>
      
      <button id="music-btn" style="
        position:absolute;top:12px;right:12px;
        background:#0a0a0a;border:1px solid #0f0;
        color:#0f0;border-radius:2px;width:30px;height:30px;
        cursor:pointer;font-size:12px;display:flex;align-items:center;
        justify-content:center;font-family:'Courier New',monospace;
        transition:all 0.3s ease;z-index:10;">♪</button>

      <div style="margin-bottom:20px;">
        <pre style="color:#0f0;font-size:10px;margin:0;line-height:1.2;text-shadow:0 0 8px #0f0;">
╔═══════════════════════╗
║  [ A2MBD3 :: ROOT ]  ║
╚═══════════════════════╝</pre>
      </div>

      <p style="margin:0 0 18px 0;color:#0f0;font-size:10px;letter-spacing:2px;
                text-shadow:0 0 5px #0f0;">
        > ENTER_AUTH_KEY<span style="animation:blink 1s infinite;">_</span>
      </p>

      <input type="text" id="key-input" placeholder="0xKEY_HERE" style="
        width:100%;padding:12px;margin-bottom:14px;
        border:1px solid #0f0;border-radius:2px;
        background:#000;color:#0f0;text-align:center;
        box-sizing:border-box;font-family:'Courier New',monospace;
        font-size:12px;font-weight:bold;
        letter-spacing:2px;outline:none;transition:all 0.3s ease;
        box-shadow:inset 0 0 15px rgba(0,255,0,0.05);
        text-transform:uppercase;"
        onfocus="this.style.boxShadow='0 0 20px rgba(0,255,0,0.3),inset 0 0 15px rgba(0,255,0,0.1)'"
        onblur="this.style.boxShadow='inset 0 0 15px rgba(0,255,0,0.05)'">

      <button id="login-btn" style="
        width:100%;background:#0a0a0a;color:#0f0;border:1px solid #0f0;
        padding:12px;border-radius:2px;font-weight:bold;cursor:pointer;
        font-family:'Courier New',monospace;font-size:13px;letter-spacing:2px;
        margin-bottom:10px;box-shadow:0 0 15px rgba(0,255,0,0.15);
        transition:all 0.2s ease;text-shadow:0 0 5px #0f0;">[ EXECUTE ]</button>

      <button id="support-btn" style="
        width:100%;background:#0a0a0a;color:#888;border:1px solid #333;
        padding:12px;border-radius:2px;font-weight:bold;cursor:pointer;
        font-family:'Courier New',monospace;font-size:13px;letter-spacing:2px;
        transition:all 0.2s ease;">[ CHANNEL ]</button>

      <div id="status-msg" style="margin-top:14px;font-size:10px;font-weight:bold;
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
        authBox.style.width = "92vw";
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
        statusEl.innerHTML = "[!] INPUT_REQUIRED";
        statusEl.style.color = "#ff0000";
        statusEl.style.textShadow = "0 0 8px #ff0000";
        return;
      }

      statusEl.innerHTML = "> AUTHENTICATING...";
      statusEl.style.color = "#0f0";
      loginBtn.disabled = supportBtn.disabled = true;

      setTimeout(async () => {
        if (EMBEDDED_DATA.validKeys.includes(inputKey)) {
          statusEl.innerHTML = "[✓] ACCESS_GRANTED";
          statusEl.style.color = "#0f0";
          statusEl.style.textShadow = "0 0 8px #0f0";

          setTimeout(async () => {
            authBox.remove();

            const loadingOverlay = document.createElement("div");
            loadingOverlay.style.cssText = `
              position:fixed; top:0; left:0; width:100%; height:100%;
              background:rgba(0,0,0,0.9); z-index:2147483647;
              display:flex; align-items:center; justify-content:center;
              font-family:'Courier New',monospace;
            `;
            loadingOverlay.innerHTML = `
              <div style="text-align:center; background:#0a0a0a;
                          padding:30px 25px; border-radius:4px;
                          border:1px solid #0f0; width:300px;max-width:90vw;
                          animation:terminal-glow 2s infinite;">
                <pre style="color:#0f0;font-size:10px;margin:0 0 18px 0;text-shadow:0 0 5px #0f0;">
[##################] 100%
[ LOADING MODULES  ]</pre>
                <div style="width:35px;height:35px;
                            border:3px solid #111;
                            border-top:3px solid #0f0;border-radius:50%;
                            margin:0 auto 18px auto;
                            animation:spin 0.6s linear infinite;
                            box-shadow:0 0 12px rgba(0,255,0,0.15);"></div>
                <p id="check-text" style="color:#0f0;font-size:13px;
                   font-weight:bold;margin:0;letter-spacing:2px;
                   text-shadow:0 0 5px #0f0;">> PROCESSING...</p>
              </div>
            `;
            document.body.appendChild(loadingOverlay);

            await new Promise(res => setTimeout(res, 5000));
            const checkText = document.getElementById("check-text");
            checkText.innerHTML = "[✓] COMPLETE";
            await new Promise(res => setTimeout(res, 1500));
            loadingOverlay.remove();

            const redirectUrl = EMBEDDED_DATA.redirectUrl;
            if (redirectUrl.startsWith("http")) {
              const countdownOverlay = document.createElement("div");
              countdownOverlay.style.cssText = `
                position:fixed; top:0; left:0; width:100%; height:100%;
                background:rgba(0,0,0,0.85); z-index:2147483647;
                display:flex; align-items:center; justify-content:center;
                font-family:'Courier New',monospace;
              `;

              const totalSeconds  = Math.floor(Math.random() * 4) + 22;
              const DASH_TOTAL    = 597;

              countdownOverlay.innerHTML = `
                <div style="text-align:center;">
                  <div style="position:relative; width:220px; height:220px;
                              margin:0 auto; display:flex; align-items:center;
                              justify-content:center;">
                    <div style="position:absolute; top:50%; left:50%;
                                width:190px; height:190px; border-radius:50%;
                                border:1px solid rgba(0,255,0,0.1);
                                background:transparent;
                                box-shadow:0 0 25px rgba(0,255,0,0.08);"></div>
                    <svg width="220" height="220"
                         style="transform:rotate(-90deg);position:relative;z-index:3;">
                      <circle cx="110" cy="110" r="85"
                              fill="none"
                              stroke="rgba(0,255,0,0.05)"
                              stroke-width="3"></circle>
                      <circle id="progress" cx="110" cy="110" r="85"
                              fill="none" stroke="#0f0" stroke-width="3"
                              stroke-dasharray="${DASH_TOTAL}"
                              stroke-dashoffset="${DASH_TOTAL}"
                              stroke-linecap="square"
                              style="filter:drop-shadow(0 0 5px #0f0);
                                     transition:stroke-dashoffset 1s linear;"></circle>
                    </svg>
                    <div id="countdown-text" style="
                      position:absolute; top:50%; left:50%;
                      transform:translate(-50%,-50%);
                      font-size:48px;font-weight:bold;color:#0f0;
                      font-family:'Courier New',monospace;
                      text-shadow:0 0 15px #0f0;
                      z-index:4;animation:countdown-pulse 1s infinite;">${totalSeconds}</div>
                  </div>
                  <p style="margin-top:25px;color:#0f0;font-size:14px;
                             font-weight:bold;letter-spacing:3px;
                             text-shadow:0 0 10px #0f0;
                             position:relative;z-index:4;">> REDIRECTING...</p>
                  <p style="color:#444;font-size:9px;margin-top:8px;letter-spacing:1px;">
                    TARGET: ${redirectUrl.replace('https://','')}</p>
                </div>
              `;
              document.body.appendChild(countdownOverlay);

              let remaining = totalSeconds;
              const progressCircle = countdownOverlay.querySelector("#progress");
              const countdownText  = countdownOverlay.querySelector("#countdown-text");

              const timer = setInterval(() => {
                remaining--;
                countdownText.textContent = remaining;
                progressCircle.style.strokeDashoffset = DASH_TOTAL * (remaining / totalSeconds);

                if (remaining <= 0) {
                  clearInterval(timer);
                  if (audioPlayer) {
                    audioPlayer.pause();
                    audioPlayer = null;
                  }
                  countdownOverlay.remove();
                  window.location.replace(redirectUrl);
                }
              }, 1000);
            }
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
