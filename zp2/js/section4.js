document.addEventListener('DOMContentLoaded', function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible'); // 滚出视口时移除动画类
      }
    });
  }, {
    threshold: 0.3
  });

  const section4 = document.querySelector('.section4-content');
  if (section4) {
    observer.observe(section4);
  }
});
