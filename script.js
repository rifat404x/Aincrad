// script.js - Extract Data from Current Page
(function() {
    
    // CSS Animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { transform: translateX(-50%) translateY(100px); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        .link-toast {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #121628;
            color: #7c8fcf;
            padding: 14px 24px;
            border-radius: 50px;
            z-index: 99999;
            cursor: pointer;
            font-size: 15px;
            border: 1px solid #6a7bc2;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            text-align: center;
            font-family: Arial, sans-serif;
            animation: slideUp 0.4s ease;
            text-decoration: underline;
        }
    `;
    document.head.appendChild(style);
    
    // পেজের সব <a> ট্যাগ খুঁজে short link বের করা
    function extractShortLink() {
        const allLinks = document.querySelectorAll('a');
        
        for (let link of allLinks) {
            const href = link.getAttribute('href');
            
            // vplink.in বা short link প্যাটার্ন খোঁজা
            if (href && (href.includes('vplink.in') || href.includes('short_link') || href.includes('bit.ly') || href.includes('tinyurl'))) {
                return href;
            }
        }
        return null;
    }
    
    // পেজের টেক্সট থেকে short link খোঁজা
    function extractFromText() {
        const bodyText = document.body.innerText;
        const match = bodyText.match(/https?:\/\/vplink\.in\/\S+/);
        return match ? match[0] : null;
    }
    
    // লিংক বের করে দেখানো
    const shortLink = extractShortLink() || extractFromText();
    
    if (shortLink) {
        showToast(shortLink);
    } else {
        showToast('কোনো Short Link পাওয়া যায়নি');
    }
    
    function showToast(link) {
        const oldToast = document.querySelector('.link-toast');
        if (oldToast) oldToast.remove();
        
        const toast = document.createElement('div');
        toast.className = 'link-toast';
        toast.textContent = '🔗 ' + link;
        toast.onclick = () => {
            if (link.startsWith('http')) {
                window.open(link, '_blank');
            }
        };
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 8000);
    }
    
})();