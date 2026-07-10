javascript: (function() {
  // Enhanced Nebula Toast System v2.0
  const ToastSystem = {
    container: null,
    queue: [],
    maxToasts: 5,
    init() {
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'nebula-toast-container';
        this.container.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 999999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 420px;
          width: 100%;
          pointer-events: none;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        document.body.appendChild(this.container);
      }
      return this.container;
    },
    show(message, type = 'info', duration = 3000, options = {}) {
      const container = this.init();
      
      // Queue management - remove oldest if too many
      const existingToasts = container.querySelectorAll('.nebula-toast');
      if (existingToasts.length >= this.maxToasts) {
        this.remove(existingToasts[0]);
      }
      
      const toast = document.createElement('div');
      toast.className = `nebula-toast nebula-${type}`;
      
      const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
        progress: '🔄',
        loading: '⏳',
        celebrate: '🎉',
        security: '🔒'
      };
      
      const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
        progress: '#8b5cf6',
        loading: '#06b6d4',
        celebrate: '#ec4899',
        security: '#14b8a6'
      };
      
      const color = colors[type] || colors.info;
      const icon = options.icon || icons[type] || icons.info;
      const showProgress = options.showProgress !== false;
      
      toast.style.cssText = `
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95));
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid ${color}50;
        border-left: 4px solid ${color};
        border-radius: 14px;
        padding: 14px 18px;
        color: #e2e8f0;
        font-size: 14px;
        line-height: 1.5;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${color}20;
        transform: translateX(120%) scale(0.8);
        animation: nebulaSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        pointer-events: auto;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        min-width: 300px;
        max-width: 100%;
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
      `;
      
      // Hover effect
      toast.onmouseenter = () => {
        toast.style.transform = 'translateY(-2px)';
        toast.style.boxShadow = `0 12px 40px rgba(0,0,0,0.4), 0 0 0 2px ${color}40`;
      };
      toast.onmouseleave = () => {
        toast.style.transform = 'translateY(0)';
        toast.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${color}20`;
      };
      
      // Icon with glow
      const iconSpan = document.createElement('span');
      iconSpan.textContent = icon;
      iconSpan.style.cssText = `
        font-size: 20px;
        flex-shrink: 0;
        margin-top: 1px;
        filter: drop-shadow(0 0 8px ${color});
        animation: nebulaPulse 2s ease-in-out infinite;
      `;
      
      // Content wrapper
      const contentWrapper = document.createElement('div');
      contentWrapper.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
      `;
      
      // Title (optional)
      if (options.title) {
        const titleSpan = document.createElement('div');
        titleSpan.textContent = options.title;
        titleSpan.style.cssText = `
          font-weight: 600;
          font-size: 15px;
          color: #f1f5f9;
          letter-spacing: 0.3px;
        `;
        contentWrapper.appendChild(titleSpan);
      }
      
      // Message
      const msgSpan = document.createElement('div');
      msgSpan.textContent = message;
      msgSpan.style.cssText = `
        word-break: break-word;
        font-weight: 400;
        color: #cbd5e1;
        font-size: 13px;
      `;
      contentWrapper.appendChild(msgSpan);
      
      // Action buttons (optional)
      if (options.actions) {
        const actionWrapper = document.createElement('div');
        actionWrapper.style.cssText = `
          display: flex;
          gap: 8px;
          margin-top: 6px;
        `;
        options.actions.forEach(action => {
          const actionBtn = document.createElement('button');
          actionBtn.textContent = action.label;
          actionBtn.style.cssText = `
            background: ${color}30;
            border: 1px solid ${color}60;
            color: ${color};
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            backdrop-filter: blur(8px);
          `;
          actionBtn.onmouseover = () => {
            actionBtn.style.background = `${color}50`;
            actionBtn.style.borderColor = color;
          };
          actionBtn.onmouseout = () => {
            actionBtn.style.background = `${color}30`;
            actionBtn.style.borderColor = `${color}60`;
          };
          actionBtn.onclick = (e) => {
            e.stopPropagation();
            action.onClick?.();
          };
          actionWrapper.appendChild(actionBtn);
        });
        contentWrapper.appendChild(actionWrapper);
      }
      
      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '✕';
      closeBtn.style.cssText = `
        background: rgba(148, 163, 184, 0.1);
        border: 1px solid rgba(148, 163, 184, 0.2);
        color: #94a3b8;
        font-size: 14px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 8px;
        flex-shrink: 0;
        transition: all 0.2s;
        pointer-events: auto;
        backdrop-filter: blur(8px);
      `;
      closeBtn.onmouseover = () => {
        closeBtn.style.background = 'rgba(239, 68, 68, 0.2)';
        closeBtn.style.color = '#ef4444';
        closeBtn.style.borderColor = 'rgba(239, 68, 68, 0.4)';
      };
      closeBtn.onmouseout = () => {
        closeBtn.style.background = 'rgba(148, 163, 184, 0.1)';
        closeBtn.style.color = '#94a3b8';
        closeBtn.style.borderColor = 'rgba(148, 163, 184, 0.2)';
      };
      
      // Progress bar
      let progressBar = null;
      if (showProgress) {
        progressBar = document.createElement('div');
        progressBar.style.cssText = `
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, ${color}00, ${color}, ${color}00);
          width: 100%;
          animation: nebulaProgress ${duration}ms linear forwards;
          border-radius: 0 0 0 14px;
        `;
        toast.appendChild(progressBar);
      }
      
      toast.appendChild(iconSpan);
      toast.appendChild(contentWrapper);
      toast.appendChild(closeBtn);
      container.appendChild(toast);
      
      // Auto remove with animation
      let timeoutId;
      if (duration > 0) {
        timeoutId = setTimeout(() => {
          this.remove(toast);
        }, duration);
      }
      
      // Close handler
      const closeHandler = () => {
        clearTimeout(timeoutId);
        this.remove(toast);
      };
      closeBtn.onclick = closeHandler;
      
      // Pause progress on hover
      if (progressBar) {
        toast.onmouseenter = () => {
          clearTimeout(timeoutId);
          if (progressBar) progressBar.style.animationPlayState = 'paused';
          toast.style.transform = 'translateY(-2px)';
          toast.style.boxShadow = `0 12px 40px rgba(0,0,0,0.4), 0 0 0 2px ${color}40`;
        };
        
        toast.onmouseleave = () => {
          const computedStyle = getComputedStyle(progressBar);
          const remainingWidth = parseFloat(computedStyle.width) / parseFloat(computedStyle.parentElement.offsetWidth) * 100;
          const remaining = (remainingWidth / 100) * duration;
          if (remaining > 0 && duration > 0) {
            timeoutId = setTimeout(() => this.remove(toast), remaining);
            progressBar.style.animationPlayState = 'running';
          }
          toast.style.transform = 'translateY(0)';
          toast.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${color}20`;
        };
      }
      
      return toast;
    },
    remove(toast) {
      if (toast && toast.parentNode) {
        toast.style.animation = 'nebulaSlideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 350);
      }
    },
    // Enhanced methods
    success(msg, duration = 3000, options = {}) { return this.show(msg, 'success', duration, options); },
    error(msg, duration = 4000, options = {}) { return this.show(msg, 'error', duration, options); },
    warning(msg, duration = 3500, options = {}) { return this.show(msg, 'warning', duration, options); },
    info(msg, duration = 3000, options = {}) { return this.show(msg, 'info', duration, options); },
    progress(msg, duration = 5000, options = {}) { return this.show(msg, 'progress', duration, options); },
    loading(msg, duration = 0, options = {}) { return this.show(msg, 'loading', duration, options); },
    celebrate(msg, duration = 4000, options = {}) { return this.show(msg, 'celebrate', duration, options); },
    security(msg, duration = 3000, options = {}) { return this.show(msg, 'security', duration, options); },
    
    // New methods
    clear() {
      const container = this.init();
      const toasts = container.querySelectorAll('.nebula-toast');
      toasts.forEach(toast => this.remove(toast));
    },
    update(toast, message, type = null) {
      if (toast && toast.parentNode) {
        const msgSpan = toast.querySelector('div > div:last-child');
        if (msgSpan) msgSpan.textContent = message;
        if (type) {
          toast.className = `nebula-toast nebula-${type}`;
          const color = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6',
            progress: '#8b5cf6',
            loading: '#06b6d4',
            celebrate: '#ec4899',
            security: '#14b8a6'
          }[type] || '#3b82f6';
          toast.style.borderLeftColor = color;
          toast.style.borderColor = `${color}50`;
          toast.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${color}20`;
        }
      }
    }
  };
  
  // Add enhanced CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes nebulaSlideIn {
      from { transform: translateX(120%) scale(0.8); opacity: 0; filter: blur(4px); }
      to { transform: translateX(0) scale(1); opacity: 1; filter: blur(0); }
    }
    @keyframes nebulaSlideOut {
      from { transform: translateX(0) scale(1); opacity: 1; filter: blur(0); }
      to { transform: translateX(120%) scale(0.8); opacity: 0; filter: blur(4px); }
    }
    @keyframes nebulaProgress {
      from { width: 100%; }
      to { width: 0%; }
    }
    @keyframes nebulaPulse {
      0%, 100% { filter: drop-shadow(0 0 4px currentColor); }
      50% { filter: drop-shadow(0 0 12px currentColor); }
    }
    @keyframes nebulaGlow {
      0%, 100% { box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(59, 130, 246, 0.1); }
      50% { box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 0 20px 2px rgba(59, 130, 246, 0.3); }
    }
    @media (max-width: 480px) {
      #nebula-toast-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
        width: auto;
      }
      #nebula-toast-container .nebula-toast {
        min-width: 0;
        padding: 12px 14px;
        font-size: 13px;
        border-radius: 10px;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Show initial status with enhanced features
  const initToast = ToastSystem.info('🚀 Nebula Engine v2.0 Initializing...', 2500, {
    title: 'Nebula Engine',
    actions: [
      {
        label: 'Details',
        onClick: () => ToastSystem.info('Build: v2.0.1 | Author: @A2MBD3\nEnhanced Toast System Active', 3000)
      }
    ]
  });
  
  // Fetch and execute with progress tracking
  setTimeout(() => {
    const loadingToast = ToastSystem.loading('⏳ Connecting to Nebula Network...', 0, {
      showProgress: false,
      icon: '🌐'
    });
    
    fetch('https://raw.githubusercontent.com/A2MBD3/Aincrad/main/dynamic-bypass-by-@a2mbd3.js?t=' + Date.now())
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        ToastSystem.remove(loadingToast);
        ToastSystem.success('✅ Nebula Network Connected!', 2500, {
          title: 'Connection Success',
          actions: [
            {
              label: 'Status',
              onClick: () => ToastSystem.security('🔒 Secure Connection Established\nProtocol: HTTPS\nEncryption: TLS 1.3', 3500)
            }
          ]
        });
        return r.text();
      })
      .then(code => {
        const execToast = ToastSystem.progress('⚡ Injecting Bypass Code...', 3000, {
          title: 'Execution Phase',
          showProgress: true
        });
        setTimeout(() => {
          eval(code);
          ToastSystem.remove(execToast);
          ToastSystem.celebrate('🎉 Nebula Engine Fully Operational!', 4000, {
            title: 'Mission Complete',
            actions: [
              {
                label: '🎯 Success',
                onClick: () => ToastSystem.info('All systems nominal\nBypass active and running', 3000)
              }
            ]
          });
        }, 1500);
      })
      .catch(e => {
        ToastSystem.remove(loadingToast);
        ToastSystem.error('❌ Engine Failure: ' + e.message, 6000, {
          title: 'Critical Error',
          actions: [
            {
              label: '🔄 Retry',
              onClick: () => location.reload()
            },
            {
              label: '📋 Details',
              onClick: () => console.error('Nebula Engine Error:', e)
            }
          ]
        });
        console.error('Nebula Engine Error:', e);
      });
  }, 2800);
  
  // Expose toast globally with extended API
  window.toast = ToastSystem;
  window.NebulaToast = ToastSystem;
  
  // Add keyboard shortcut to clear toasts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'X') {
      ToastSystem.clear();
      ToastSystem.info('🧹 All toasts cleared', 1500);
    }
  });
})();