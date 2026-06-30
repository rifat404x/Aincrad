javascript: (function() {
  // Enhanced Toast System
  const ToastSystem = {
    container: null,
    init() {
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 999999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 400px;
          width: 100%;
          pointer-events: none;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        document.body.appendChild(this.container);
      }
      return this.container;
    },
    show(message, type = 'info', duration = 3000) {
      const container = this.init();
      
      const toast = document.createElement('div');
      toast.className = `toast-${type}`;
      
      // Icons
      const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
        progress: '🔄'
      };
      
      const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
        progress: '#8b5cf6'
      };
      
      const color = colors[type] || colors.info;
      
      toast.style.cssText = `
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid ${color}40;
        border-left: 4px solid ${color};
        border-radius: 12px;
        padding: 14px 18px;
        color: #e2e8f0;
        font-size: 14px;
        line-height: 1.5;
        box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        transform: translateX(120%);
        animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        pointer-events: auto;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        min-width: 280px;
        max-width: 100%;
        position: relative;
        overflow: hidden;
      `;
      
      // Icon
      const iconSpan = document.createElement('span');
      iconSpan.textContent = icons[type] || icons.info;
      iconSpan.style.cssText = `
        font-size: 18px;
        flex-shrink: 0;
        margin-top: 1px;
      `;
      
      // Message
      const msgSpan = document.createElement('span');
      msgSpan.textContent = message;
      msgSpan.style.cssText = `
        flex: 1;
        word-break: break-word;
        font-weight: 400;
      `;
      
      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '✕';
      closeBtn.style.cssText = `
        background: none;
        border: none;
        color: #94a3b8;
        font-size: 16px;
        cursor: pointer;
        padding: 0 0 0 8px;
        flex-shrink: 0;
        transition: color 0.2s;
        pointer-events: auto;
      `;
      closeBtn.onmouseover = () => closeBtn.style.color = '#e2e8f0';
      closeBtn.onmouseout = () => closeBtn.style.color = '#94a3b8';
      
      // Progress bar
      const progressBar = document.createElement('div');
      progressBar.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: ${color};
        width: 100%;
        animation: progressShrink ${duration}ms linear forwards;
        border-radius: 0 0 0 12px;
      `;
      
      toast.appendChild(iconSpan);
      toast.appendChild(msgSpan);
      toast.appendChild(closeBtn);
      toast.appendChild(progressBar);
      container.appendChild(toast);
      
      // Auto remove
      let timeoutId = setTimeout(() => {
        this.remove(toast);
      }, duration);
      
      // Close on click
      closeBtn.onclick = () => {
        clearTimeout(timeoutId);
        this.remove(toast);
      };
      
      // Pause on hover
      toast.onmouseenter = () => {
        clearTimeout(timeoutId);
        progressBar.style.animationPlayState = 'paused';
      };
      
      toast.onmouseleave = () => {
        const remaining = duration - (Date.now() - startTime);
        if (remaining > 0) {
          timeoutId = setTimeout(() => this.remove(toast), remaining);
          progressBar.style.animationPlayState = 'running';
        }
      };
      
      const startTime = Date.now();
      
      return toast;
    },
    remove(toast) {
      if (toast && toast.parentNode) {
        toast.style.animation = 'slideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        setTimeout(() => {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 350);
      }
    },
    success(msg, duration = 3000) { return this.show(msg, 'success', duration); },
    error(msg, duration = 4000) { return this.show(msg, 'error', duration); },
    warning(msg, duration = 3500) { return this.show(msg, 'warning', duration); },
    info(msg, duration = 3000) { return this.show(msg, 'info', duration); },
    progress(msg, duration = 5000) { return this.show(msg, 'progress', duration); }
  };
  
  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(120%) scale(0.9); opacity: 0; }
      to { transform: translateX(0) scale(1); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0) scale(1); opacity: 1; }
      to { transform: translateX(120%) scale(0.9); opacity: 0; }
    }
    @keyframes progressShrink {
      from { width: 100%; }
      to { width: 0%; }
    }
    @media (max-width: 480px) {
      #toast-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
        width: auto;
      }
      #toast-container .toast-success,
      #toast-container .toast-error,
      #toast-container .toast-warning,
      #toast-container .toast-info,
      #toast-container .toast-progress {
        min-width: 0;
        padding: 12px 14px;
        font-size: 13px;
        border-radius: 10px;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Show initial status
  ToastSystem.info('🚀 Initializing Nebula Engine..', 2000);
  
  // Fetch and execute
  fetch('https://raw.githubusercontent.com/A2MBD3/Aincrad/main/dynamic-bypass-by-@a2mbd3.js?t=' + Date.now())
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      ToastSystem.success('✅ Nebula Alive!', 2500);
      return r.text();
    })
    .then(code => {
      ToastSystem.progress('⚡ Executing bypass...', 3000);
      eval(code);
    })
    .catch(e => {
      ToastSystem.error('❌ Error: ' + e.message, 5000);
      console.error('Nebula Engine Error:', e);
    });
  
  // Expose toast globally
  window.toast = ToastSystem;
})();