function showSection(id) {
    const map = {
        about: 'ziye/about.html',
        news: 'ziye/news.html',
        tech: 'ziye/tech.html',
        product: 'ziye/product.html',
        job: 'ziye/job.html',
        contact: 'ziye/contact.html'
    };
    const file = map[id];
    if (!file) return;

    fetch(file)
        .then(res => res.text())
        .then(html => {
            document.getElementById('main-content').innerHTML = html;
            // 如果是公司介绍，手动加载 banner.js
            if (id === 'about') {
                const script = document.createElement('script');
                script.src = './js/banner.js';
                document.body.appendChild(script);
            }
        });
}

// 页面加载时只显示公司介绍
document.addEventListener('DOMContentLoaded', function() {
    showSection('about');
});

// 导航栏点击事件
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            showSection(href.substring(1));
        }
    });
});