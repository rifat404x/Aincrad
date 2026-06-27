// script.js
(function() {
    // বর্তমান URL সংগ্রহ
    const currentURL = window.location.href;
    
    // কনসোলে প্রিন্ট
    console.log('বর্তমান URL:', currentURL);
    
    // পেজে একটি ছোট নোটিফিকেশন দেখানো
    const div = document.createElement('div');
    div.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #333;
        color: #fff;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 9999;
        font-family: Arial, sans-serif;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    div.textContent = 'URL: ' + currentURL;
    document.body.appendChild(div);
    
    // ৩ সেকেন্ড পর নোটিফিকেশন সরিয়ে ফেলা
    setTimeout(() => {
        div.remove();
    }, 3000);
})();