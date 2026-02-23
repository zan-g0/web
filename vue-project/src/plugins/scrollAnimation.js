const plugin = {
  version: '1.0.0',
  install(app) {
    // 添加平滑滚动动画
    app.directive('scroll-animate', {
      mounted(el) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.1 }
        );

        observer.observe(el);
      }
    });

    // 添加全局样式
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in {
        animation: fadeIn 0.8s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
  }
};

export default plugin;