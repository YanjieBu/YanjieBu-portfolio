window.addEventListener('load', () => {
  const bgImage = document.getElementById('bgImage');
  const championText = document.getElementById('championText');
  const bg2Caption = document.getElementById('bg2Caption');

  // 等待 background1.gif 播放完成（9秒）
  setTimeout(() => {
    // 1. 淡出冠军文字
    championText.style.opacity = '0';

    // 2. 创建并插入 background3.gif
    const newImg = document.createElement('img');
    newImg.src = 'images/background3.gif';
    newImg.style.width = '100%';
    newImg.style.height = '100%';
    newImg.style.objectFit = 'cover';
    newImg.style.position = 'absolute';
    newImg.style.top = '0';
    newImg.style.left = '0';
    newImg.style.opacity = '0';
    newImg.style.transition = 'opacity 0.6s ease';
    newImg.setAttribute('id', 'bgImage3');

    bgImage.parentElement.appendChild(newImg);

    // 3. 淡入新背景并淡出旧背景
    setTimeout(() => {
      newImg.style.opacity = '1';
      bgImage.style.opacity = '0';
    }, 100); // 稍微延迟以触发动画

    // 4. 显示四行文字容器
    setTimeout(() => {
      bg2Caption.style.display = 'block';
    }, 600); // 等新背景淡入后显示文字

  }, 8500);
});

setTimeout(() => {
  document.getElementById('scrollHint').style.opacity = '1';
}, 12500); // ⏱ 最后一行动画之后再出现


