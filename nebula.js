// script.js - Extract Redirect URL from Page
(function() {
    
    // CSS Toast স্টাইল
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { transform: translateX(-50%) translateY(100px); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        .url-toast {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #0b0f19;
            color: #a78bfa;
            padding: 16px 28px;
            border-radius: 50px;
            z-index: 99999;
            cursor: pointer;
            font-size: 15px;
            border: 1px solid #7c3aed;
            box-shadow: 0 8px 32px rgba(124,58,237,0.3);
            text-align: center;
            font-family: 'Outfit', Arial, sans-serif;
            animation: slideUp 0.4s ease;
            text-decoration: underline;
        }
    `;
    document.head.appendChild(style);
    
    // পেজ থেকে URL বের করার ফাংশন
    function extractURL() {
        
        // পদ্ধতি ১: window.location.href থেকে সরাসরি
        const currentURL = window.location.href;
        if (currentURL.includes('vplink.in')) {
            return currentURL;
        }
        
        // পদ্ধতি ২: setTimeout এর ভিতর থেকে URL খোঁজা
        const scripts = document.querySelectorAll('script');
        for (let script of scripts) {
            const content = script.textContent || script.innerText;
            if (content.includes('window.location.href')) {
                const match = content.match(/window\.location\.href\s*=\s*["']([^"']+)["']/);
                if (match && match[1]) {
                    return match[1];
                }
            }
        }
        
        // পদ্ধতি ৩: পুরো HTML থেকে vplink.in লিংক খোঁজা
        const htmlContent = document.documentElement.innerHTML;
        const match = htmlContent.match(/https?:\/\/vplink\.in\/[^\s"'<>]+/);
        if (match) {
            return match[0];
        }
        
        return null;
    }
    
    // URL বের করে দেখানো
    const url = extractURL();
    
    if (url) {
        showToast(url);
    } else {
        showToast('কোনো URL পাওয়া যায়নি');
    }
    
    function showToast(link) {
        const oldToast = document.querySelector('.url-toast');
        if (oldToast) oldToast.remove();
        
        const toast = document.createElement('div');
        toast.className = 'url-toast';
        toast.innerHTML = '🔗 <b>' + link + '</b>';
        
        // ক্লিক করলে কপি হবে
        toast.onclick = () => {
            navigator.clipboard.writeText(link).then(() => {
                toast.innerHTML = '✅ <b>Copied!</b>';
                setTimeout(() => {
                    toast.innerHTML = '🔗 <b>' + link + '</b>';
                }, 1500);
            });
        };
        
        document.body.appendChild(toast);
        
        // 10 সেকেন্ড পর অটো মিলিয়ে যাবে
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 10000);
    }
    
})();