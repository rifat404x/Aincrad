// script.js
(function() {
    // Toast স্টাইল
    const style = document.createElement('style');
    style.textContent = `
        .custom-toast {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #222;
            color: #fff;
            padding: 14px 24px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 15px;
            z-index: 99999;
            box-shadow: 0 4px 16px rgba(0,0,0,0.4);
            animation: slideUp 0.4s ease;
            cursor: pointer;
            text-decoration: underline;
        }
        @keyframes slideUp {
            from { bottom: -60px; opacity: 0; }
            to { bottom: 30px; opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // API কল
    fetch('https://vipteam.store/Getkey.php')
        .then(res => res.json())
        .then(data => {
            if (data.success && data.short_link) {
                showToast(data.short_link);
            } else {
                showToast('Link পাওয়া যায়নি');
            }
        })
        .catch(() => {
            showToast('API ফেচ করতে সমস্যা হয়েছে');
        });
    
    function showToast(link) {
        const toast = document.createElement('div');
        toast.className = 'custom-toast';
        toast.textContent = link;
        toast.onclick = () => window.open(link, '_blank');
        document.body.appendChild(toast);
        
        // 5 সেকেন্ড পর অটো রিমুভ
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.4s';
            setTimeout(() => toast.remove(), 400);
        }, 5000);
    }
})();