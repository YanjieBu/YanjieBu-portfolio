// 自定义慢速滚动函数（带 easing）
function smoothScrollTo(targetY, duration = 2000) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  const startTime = performance.now();

  function step(currentTime) {
    const time = Math.min(1, (currentTime - startTime) / duration);
    const easing = 1 - Math.pow(1 - time, 3); // easeOutCubic
    window.scrollTo(0, startY + diff * easing);
    if (time < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// 动画结束后触发：显示提示 + 解锁滚动 + 慢滑下一屏
setTimeout(() => {
  const scrollHint = document.getElementById('scrollHint');
  scrollHint.classList.add('show'); // 淡入 scroll hint

  // 禁用默认 smooth 行为，防止和自定义滚动冲突
  document.documentElement.style.scrollBehavior = 'auto';

  // 解锁页面滚动
  document.body.classList.remove('locked');
  document.documentElement.classList.remove('locked');
  document.body.classList.add('scrollable');
  document.documentElement.classList.add('scrollable');

  // 延迟一点再触发慢滑动
  setTimeout(() => {
    smoothScrollTo(window.innerHeight, 2000); // 滚到第二屏，2秒
  }, 900); // 避免和 scrollHint 淡入冲突
}, 1000); // 页面加载后6秒解锁滚动
