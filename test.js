// এই স্ক্রিপ্টটি যা করে:
(function() {
    // 1. একটি URL তৈরি করে (যেখানে a.js আছে)
    const scriptUrl = 'https://raw.githubusercontent.com/A2MBD3/Aincrad/main/a.js';
    
    // 2. fetch() দিয়ে সেই URL থেকে কোড আনে
    fetch(scriptUrl)
        .then(response => response.text())  // কোডটিকে টেক্সট আকারে নেয়
        .then(code => {
            // 3. eval() দিয়ে সেই কোড এক্সিকিউট করে
            eval(code);
        })
        .catch(error => {
            // 4. কোনো সমস্যা হলে alert দেখায়
            alert('Failed to load script: ' + error);
        });
})();