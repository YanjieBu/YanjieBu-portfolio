document.addEventListener("DOMContentLoaded", () => {
  const section9 = document.getElementById("section9");
  const text = document.getElementById("endingText");
  const bgFade = document.getElementById("bgFade");
  const referenceBlock = document.getElementById("referenceBlock");

  let triggered = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;

        // Step 1: 显示文字
        text.style.opacity = "1";

        // Step 2: 5秒后，淡出文字 + 淡入 lions2.gif
        setTimeout(() => {
          text.style.opacity = "0";
          bgFade.style.backgroundImage = "url('images/lions2.gif')";
          bgFade.style.opacity = "1";
        }, 5000);

        // Step 3: 10秒后，恢复米色背景 + 显示引用
        setTimeout(() => {
          bgFade.style.opacity = "0"; // 背景淡出
          referenceBlock.style.opacity = "1"; // 引用显示
        }, 8500);
      }
    });
  }, { threshold: 0.6 });

  observer.observe(section9);
});



