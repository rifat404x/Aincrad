javascript: (function() {
  // ============================================
  // NEBULA ENGINE v3.0 - Responsive & Conditional
  // ============================================
  
  // Responsive Toast System
  const ToastSystem = {
    container: null,
    activeToasts: [],
    
    init() {
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'nebula-container';
        this.container.style.cssText = `
          position: fixed;
          top: env(safe-area-inset-top, 16px);
          right: env(safe-area-inset-right, 16px);
          z-index: 2147483647;
          display: flex;
          flex-direction: column;
          gap: clamp(8px, 1.5vw, 12px);
          width: min(420px, calc(100vw - 32px));
          pointer-events: none;
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        `;
        document.body.appendChild(this.container);
      }
      return this.container;
    },
    
    show(message, type = 'info', duration = 3500, options = {}) {
      const container = this.init();
      
      // Responsive settings
      const isMobile = window.innerWidth <= 480;
      const isTablet = window.innerWidth <= 768;
      
      const icons = {
        success: '✓',
        error: '✕',
        warning: '!',
        info: 'i',
        progress: '↻',
        loading: '◌',
        celebrate: '★',
        security: '⬢'
      };
      
      const colors = {
        success: '#00c853',
        error: '#ff1744',
        warning: '#ff9100',
        info: '#2979ff',
        progress: '#7c4dff',
        loading: '#00b8d4',
        celebrate: '#f50057',
        security: '#00bfa5'
      };
      
      const color = colors[type] || colors.info;
      const icon = options.icon || icons[type] || icons.info;
      
      // Create toast element
      const toast = document.createElement('div');
      toast.className = 'nebula-toast';
      toast.setAttribute('data-type', type);
      
      // Responsive styles
      const fontSize = isMobile ? '13px' : isTablet ? '14px' : '15px';
      const padding = isMobile ? '12px 14px' : '14px 18px';
      const borderRadius = isMobile ? '12px' : '16px';
      const gap = isMobile ? '8px' : '12px';
      const iconSize = isMobile ? '18px' : '22px';
      
      toast.style.cssText = `
        background: linear-gradient(135deg, 
          rgba(10, 15, 30, 0.98), 
          rgba(20, 28, 45, 0.96)
        );
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-left: 4px solid ${color};
        border-radius: ${borderRadius};
        padding: ${padding};
        color: #e8edf5;
        font-size: ${fontSize};
        line-height: 1.5;
        box-shadow: 
          0 8px 32px rgba(0, 0, 0, 0.4),
          0 0 1px rgba(255, 255, 255, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.05);
        transform: translateX(120%) scale(0.9);
        animation: nebulaSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        pointer-events: auto;
        display: flex;
        align-items: flex-start;
        gap: ${gap};
        width: 100%;
        position: relative;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
      `;
      
      // Icon container
      const iconContainer = document.createElement('div');
      iconContainer.style.cssText = `
        width: ${iconSize};
        height: ${iconSize};
        min-width: ${iconSize};
        border-radius: 50%;
        background: ${color}20;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${isMobile ? '11px' : '13px'};
        font-weight: 700;
        color: ${color};
        border: 1.5px solid ${color}40;
        position: relative;
      `;
      iconContainer.textContent = icon;
      
      // Content area
      const contentArea = document.createElement('div');
      contentArea.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      `;
      
      // Title
      if (options.title) {
        const titleEl = document.createElement('div');
        titleEl.textContent = options.title;
        titleEl.style.cssText = `
          font-weight: 600;
          font-size: ${isMobile ? '13px' : '14px'};
          color: #f0f4ff;
          letter-spacing: 0.3px;
          margin-bottom: 2px;
        `;
        contentArea.appendChild(titleEl);
      }
      
      // Message
      const messageEl = document.createElement('div');
      messageEl.textContent = message;
      messageEl.style.cssText = `
        word-break: break-word;
        font-weight: 400;
        color: #b0bdd0;
        font-size: ${isMobile ? '12px' : '13px'};
        opacity: 0.9;
      `;
      contentArea.appendChild(messageEl);
      
      // Action buttons
      if (options.actions && options.actions.length > 0) {
        const actionsContainer = document.createElement('div');
        actionsContainer.style.cssText = `
          display: flex;
          gap: 6px;
          margin-top: 8px;
          flex-wrap: wrap;
        `;
        
        options.actions.forEach(action => {
          const btn = document.createElement('button');
          btn.textContent = action.label;
          btn.style.cssText = `
            background: ${color}15;
            border: 1px solid ${color}40;
            color: ${color};
            padding: 4px 12px;
            border-radius: 20px;
            font-size: ${isMobile ? '11px' : '12px'};
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
            backdrop-filter: blur(10px);
            -webkit-tap-highlight-color: transparent;
          `;
          
          btn.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            btn.style.transform = 'scale(0.95)';
          });
          
          btn.addEventListener('pointerup', (e) => {
            e.stopPropagation();
            btn.style.transform = 'scale(1)';
            action.onClick?.();
          });
          
          btn.addEventListener('pointerleave', () => {
            btn.style.transform = 'scale(1)';
          });
          
          actionsContainer.appendChild(btn);
        });
        
        contentArea.appendChild(actionsContainer);
      }
      
      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✕';
      closeBtn.style.cssText = `
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #708090;
        width: ${isMobile ? '24px' : '28px'};
        height: ${isMobile ? '24px' : '28px'};
        border-radius: 50%;
        font-size: ${isMobile ? '12px' : '14px'};
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        flex-shrink: 0;
        padding: 0;
        -webkit-tap-highlight-color: transparent;
      `;
      
      closeBtn.addEventListener('pointerenter', () => {
        closeBtn.style.background = 'rgba(255, 50, 50, 0.2)';
        closeBtn.style.color = '#ff4444';
        closeBtn.style.borderColor = 'rgba(255, 50, 50, 0.4)';
      });
      
      closeBtn.addEventListener('pointerleave', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.05)';
        closeBtn.style.color = '#708090';
        closeBtn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      });
      
      // Progress bar
      if (options.showProgress !== false && duration > 0) {
        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = `
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255, 255, 255, 0.05);
        `;
        
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
          height: 100%;
          background: linear-gradient(90deg, 
            ${color}00, 
            ${color}, 
            ${color}80
          );
          width: 100%;
          border-radius: 0 0 0 ${borderRadius};
          transition: width 0.1s linear;
        `;
        
        progressContainer.appendChild(progressBar);
        toast.appendChild(progressContainer);
        
        // Animate progress
        const startTime = Date.now();
        const updateProgress = () => {
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, 1 - elapsed / duration);
          progressBar.style.width = `${remaining * 100}%`;
          
          if (remaining > 0) {
            requestAnimationFrame(updateProgress);
          }
        };
        requestAnimationFrame(updateProgress);
      }
      
      // Assemble toast
      toast.appendChild(iconContainer);
      toast.appendChild(contentArea);
      toast.appendChild(closeBtn);
      container.appendChild(toast);
      
      this.activeToasts.push(toast);
      
      // Auto remove
      let timeoutId;
      if (duration > 0) {
        timeoutId = setTimeout(() => this.remove(toast), duration);
      }
      
      // Close handler
      const closeToast = () => {
        clearTimeout(timeoutId);
        this.remove(toast);
      };
      
      closeBtn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        closeToast();
      });
      
      // Click to dismiss
      toast.addEventListener('click', (e) => {
        if (e.target === toast) closeToast();
      });
      
      // Touch swipe to dismiss (mobile)
      let touchStartX = 0;
      let touchCurrentX = 0;
      let isDragging = false;
      
      toast.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        isDragging = true;
      }, { passive: true });
      
      toast.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        touchCurrentX = e.touches[0].clientX;
        const diff = touchCurrentX - touchStartX;
        if (diff > 30) {
          toast.style.transform = `translateX(${diff}px)`;
          toast.style.opacity = Math.max(0, 1 - diff / 200);
        }
      }, { passive: true });
      
      toast.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        const diff = touchCurrentX - touchStartX;
        if (diff > 100) {
          closeToast();
        } else {
          toast.style.transform = '';
          toast.style.opacity = '';
        }
      });
      
      return toast;
    },
    
    remove(toast) {
      if (!toast || !toast.parentNode) return;
      
      toast.style.animation = 'nebulaSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
      
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
          this.activeToasts = this.activeToasts.filter(t => t !== toast);
        }
      }, 300);
    },
    
    clear() {
      [...this.activeToasts].forEach(toast => this.remove(toast));
    },
    
    // Convenience methods
    success(msg, dur, opts) { return this.show(msg, 'success', dur, opts); },
    error(msg, dur, opts) { return this.show(msg, 'error', dur, opts); },
    warning(msg, dur, opts) { return this.show(msg, 'warning', dur, opts); },
    info(msg, dur, opts) { return this.show(msg, 'info', dur, opts); },
    progress(msg, dur, opts) { return this.show(msg, 'progress', dur, opts); },
    loading(msg, dur, opts) { return this.show(msg, 'loading', dur, opts); },
    celebrate(msg, dur, opts) { return this.show(msg, 'celebrate', dur, opts); }
  };
  
  // Inject styles
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes nebulaSlideIn {
      from { 
        transform: translateX(120%) scale(0.9); 
        opacity: 0; 
        filter: blur(8px); 
      }
      to { 
        transform: translateX(0) scale(1); 
        opacity: 1; 
        filter: blur(0); 
      }
    }
    
    @keyframes nebulaSlideOut {
      from { 
        transform: translateX(0) scale(1); 
        opacity: 1; 
        filter: blur(0); 
      }
      to { 
        transform: translateX(120%) scale(0.8); 
        opacity: 0; 
        filter: blur(8px); 
      }
    }
    
    @media (max-width: 480px) {
      #nebula-container {
        right: 8px !important;
        left: 8px !important;
        width: auto !important;
      }
      
      .nebula-toast {
        font-size: 13px !important;
        padding: 10px 12px !important;
        border-radius: 12px !important;
      }
    }
    
    @media (prefers-reduced-motion: reduce) {
      .nebula-toast {
        animation: none !important;
        transition: opacity 0.2s ease !important;
      }
    }
    
    @media (prefers-color-scheme: dark) {
      .nebula-toast {
        background: linear-gradient(135deg, 
          rgba(8, 12, 24, 0.98), 
          rgba(16, 22, 36, 0.96)
        ) !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
  
  // ============================================
  // CONDITIONAL EXECUTION LOGIC
  // ============================================
  
  function executeNebula() {
    const currentUrl = window.location.href;
    const currentHostname = window.location.hostname;
    
    // Check window.ABDULLAH_BOOKMARK_LOAD value
    const bookmarkLoad = window.ABDULLAH_BOOKMARK_LOAD;
    const nValue = window.n;
    
    let scriptUrl = '';
    let engineName = '';
    
    // Condition 1: Check if window.n is numeric
    if (typeof nValue === 'number' && !isNaN(nValue)) {
      ToastSystem.info(`🔢 Numeric value detected: ${nValue}`, 2500);
      ToastSystem.progress('⚡ Loading Numeric Engine...', 2000);
      scriptUrl = `https://raw.githubusercontent.com/A2MBD3/Aincrad/main/dynamic-bypass-by-@a2mbd3.js?t=${Date.now()}&n=${nValue}`;
      engineName = 'Numeric Engine';
    }
    
    // Condition 2: Check if window.n is "Abdullah"
    else if (nValue === 'Abdullah' || bookmarkLoad === 'Abdullah') {
      ToastSystem.info('👤 Abdullah mode detected!', 2500);
      
      // Check current website
      if (currentHostname.includes('tarviral.com') || currentHostname.includes('rodaemotor.com')) {
        ToastSystem.warning('⚠️ Special site detected!', 2000);
        scriptUrl = `https://raw.githubusercontent.com/A2MBD3/Aincrad/main//dynamic-bypass-by-@a2mbd3.js?t=${Date.now()}`;
        window.ABDULLAH_BOOKMARK_LOAD = 'aincrad';
        engineName = 'Aincrad Engine';
      } else {
        ToastSystem.info('👤 Standard Abdullah mode', 2000);
        scriptUrl = `https://raw.githubusercontent.com/A2MBD3/Aincrad/main/dynamic-bypass-by-@a2mbd3.js?t=${Date.now()}`;
        engineName = 'Abdullah Engine';
      }
    }
    
    // Condition 3: Check for vipteam.store
    else if (currentHostname.includes('vipteam.store')) {
      ToastSystem.security('🔒 VipTeam Store Detected!', 2500);
      window.ABDULLAH_BOOKMARK_LOAD = 'vipteam';
      scriptUrl = `https://raw.githubusercontent.com/A2MBD3/Aincrad/main/dynamic-bypass-by-@a2mbd3.js?t=${Date.now()}&site=vipteam`;
      engineName = 'VipTeam Engine';
    }
    
    // Default: Use aincrad engine
    else {
      ToastSystem.info('🌐 Loading Default Engine...', 2000);
      scriptUrl = `https://raw.githubusercontent.com/A2MBD3/Aincrad/main/dynamic-bypass-by-@a2mbd3.js?t=${Date.now()}`;
      engineName = 'Default Engine';
    }
    
    // Execute the script
    if (scriptUrl) {
      const loadingToast = ToastSystem.loading(`⏳ Fetching ${engineName}...`, 0);
      
      fetch(scriptUrl)
        .then(response => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          ToastSystem.remove(loadingToast);
          ToastSystem.success(`✅ ${engineName} Loaded!`, 3000);
          return response.text();
        })
        .then(code => {
          ToastSystem.progress('⚡ Executing script...', 2000);
          setTimeout(() => {
            try {
              eval(code);
              ToastSystem.celebrate('🎉 Execution Complete!', 3500);
            } catch (execError) {
              ToastSystem.error(`❌ Execution Error: ${execError.message}`, 5000);
            }
          }, 500);
        })
        .catch(error => {
          ToastSystem.remove(loadingToast);
          ToastSystem.error(`❌ Failed: ${error.message}`, 5000, {
            actions: [
              {
                label: '🔄 Retry',
                onClick: () => executeNebula()
              },
              {
                label: '📋 Log',
                onClick: () => console.error('Nebula Error:', error)
              }
            ]
          });
        });
    }
  }
  
  // ============================================
  // INITIALIZATION
  // ============================================
  
  ToastSystem.info('🚀 Nebula Engine v3.0', 2000, {
    title: 'Initializing',
    showProgress: false
  });
  
  // Small delay for visual effect
  setTimeout(() => {
    // Display system info
    const isMobile = window.innerWidth <= 480;
    const deviceType = isMobile ? '📱 Mobile' : '💻 Desktop';
    
    ToastSystem.info(`${deviceType} | ${window.innerWidth}px`, 2500, {
      title: 'System Check',
      showProgress: true
    });
    
    // Execute main logic
    setTimeout(executeNebula, 1000);
  }, 2200);
  
  // Expose globally
  window.NebulaToast = ToastSystem;
  window.NebulaEngine = {
    toast: ToastSystem,
    execute: executeNebula,
    version: '3.0.0',
    responsive: true
  };
  
  // Handle orientation changes
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      ToastSystem.info(`↻ Orientation: ${window.innerWidth}px`, 1500);
    }, 500);
  });
  
  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const toasts = document.querySelectorAll('.nebula-toast');
      if (toasts.length === 0) {
        ToastSystem.info(`↔ Viewport: ${window.innerWidth}px`, 1200);
      }
    }, 1000);
  });
  
})();