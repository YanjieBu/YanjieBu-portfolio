function shootBall(el, maxGoals = 140) {
  const row = el.closest(".player-row");
  const track = row.querySelector(".track");
  const goals = parseInt(row.dataset.goals);

  // 克隆球
  const clone = el.cloneNode(true);
  clone.classList.add("ball-animate");
  document.body.appendChild(clone);

  const startRect = el.getBoundingClientRect();
  const trackRect = track.getBoundingClientRect();
  const ballWidth = el.offsetWidth;
  const ballHeight = el.offsetHeight;

  const startX = startRect.left + ballWidth / 2;
  const startY = startRect.top + ballHeight / 2;

  const unitWidth = track.offsetWidth / maxGoals;
  const targetX = trackRect.left + goals * unitWidth;
  const targetY = trackRect.top - ballHeight;

  clone.style.left = (startX - ballWidth / 2) + "px";
  clone.style.top = (startY - ballHeight / 2) + "px";

  let frame = 0;

  function animate() {
    if (frame > 60) {
      //  球动画结束，保留在终点（不替换）
      clone.style.left = (targetX - ballWidth / 2) + "px";
      clone.style.top = targetY + "px";
      clone.classList.add("landed-ball");

      //  添加得分数字
      const label = document.createElement("div");
      label.className = "goal-label";
      label.textContent = `+${goals}`;
      label.style.position = "absolute";
      label.style.left = (targetX - 10) + "px";
      label.style.top = (targetY - 30) + "px";
      label.style.fontSize = "18px";
      label.style.fontWeight = "bold";
      label.style.color = "#7b0000";
      label.style.transition = "all 0.8s ease";
      label.style.pointerEvents = "none";
      document.body.appendChild(label);

      //  等 3 秒后一起淡出并移除
      setTimeout(() => {
        clone.style.opacity = "0";
        label.style.opacity = "0";
        label.style.transform = "translateY(-20px)";
      }, 3000);
      setTimeout(() => {
        clone.remove();
        label.remove();
      }, 3600);

      return;
    }

    const t = frame / 60;
    const x = startX + (targetX - startX) * t;
    const y = startY + (targetY - startY) * t - 100 * Math.sin(Math.PI * t);

    clone.style.left = (x - ballWidth / 2) + "px";
    clone.style.top = (y - ballHeight / 2) + "px";

    frame++;
    requestAnimationFrame(animate);
  }

  animate();
}



document.addEventListener("DOMContentLoaded", () => {
  // 创建 tooltip 元素并加到 body
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  document.body.appendChild(tooltip);

  // 给所有 .hand-icon 添加悬停事件
  document.querySelectorAll(".hand-icon").forEach(img => {
    img.addEventListener("mouseenter", e => {
      const text = e.target.getAttribute("data-tooltip");
      tooltip.innerHTML = text.replace(/\n/g, "<br>"); // 支持换行
      tooltip.style.opacity = "1";
    });

    img.addEventListener("mousemove", e => {
      tooltip.style.left = (e.clientX + 12) + "px";
      tooltip.style.top = (e.clientY - 40) + "px";
    });

    img.addEventListener("mouseleave", () => {
      tooltip.style.opacity = "0";
    });
  });
});











