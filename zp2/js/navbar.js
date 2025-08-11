window.addEventListener('load', () => {
  setTimeout(() => {
    // 解锁滚动
    document.body.classList.remove('locked');
    document.documentElement.classList.remove('locked');

    // 添加 scroll 监听
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.navbar');
      const scrollY = window.scrollY || document.documentElement.scrollTop;

      if (scrollY > window.innerHeight * 0.9) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }, 6000); // 页面动画结束后再解锁和监听
});

