window.addEventListener('load', () => {
  const mask = document.querySelector('.split-mask');
  const text = document.querySelector('.text-section');
  const championship = document.getElementById('championText');

  // 3 秒后执行裂开和遮盖
  setTimeout(() => {
    mask.classList.add('open');
    text.style.opacity = '0';

    // 裂开后再显示 Championship 字样
    setTimeout(() => {
      championship.classList.add('show');
    }, 700); // 裂开开始后 0.7 秒触发
  }, 3000);
});

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


document.addEventListener('DOMContentLoaded', () => {
  const data = {
    2012: { regular: '13th / 18', playoffs: 'Did not qualify', final: '13th' },
    2013: { regular: '12th / 18', playoffs: 'Did not qualify', final: '12th' },
    2014: { regular: '15th / 18', playoffs: 'Did not qualify', final: '15th' },
    2015: { regular: '17th / 18', playoffs: 'Did not qualify', final: '17th' },
    2016: { regular: '17th / 18', playoffs: 'Did not qualify', final: '17th' },
    2017: { regular: '18th / 18', playoffs: 'Did not qualify', final: '18th' },
    2018: { regular: '15th / 18', playoffs: 'Did not qualify', final: '15th' },
    2019: { regular: '2nd / 18', playoffs: 'Eliminated in Semifinals', final: '5th' },
    2020: { regular: '2nd / 18', playoffs: 'Eliminated in Semifinals', final: '3rd' },
    2021: { regular: '4th / 18', playoffs: 'Eliminated in Semifinals', final: '5th' },
    2022: { regular: '6th / 18', playoffs: 'Eliminated in Semifinals', final: '4th' },
    2023: { regular: '2nd / 18', playoffs: 'Runner-up (Finals)', final: '2nd' },
    2024: { regular: '5th / 18', playoffs: 'Premiers !', final: '1st' }
  };

  const buttons = document.querySelectorAll('.year-button');
  const yearFinal = document.getElementById('yearFinal');
  const yearRegular = document.getElementById('yearRegular');
  const yearPlayoffs = document.getElementById('yearPlayoffs');
  const section = document.getElementById('section2');

  const years = Object.keys(data).sort((a, b) => b - a); // [2024, 2023, ..., 2012]
  let currentIndex = 0;
  let intervalId = null;

  function updateBackground(year) {
    section.style.backgroundImage = `
      linear-gradient(to left, rgba(0, 0, 0, 0.8), rgba(29, 41, 69, 1)),
      url("images/${year}.jpg")
    `;
    section.style.backgroundRepeat = 'no-repeat';
    section.style.backgroundSize = '50% 100%';
    section.style.backgroundPosition = 'right top';
  }

  function updateContent(year) {
    const info = data[year];
    yearFinal.textContent = info.final;
    yearRegular.textContent = `Regular Season: ${info.regular}`;
    yearPlayoffs.textContent = `AFL Playoffs: ${info.playoffs}`;
    buttons.forEach(b => b.classList.remove('active'));
    document.querySelector(`.year-button[data-year="${year}"]`)?.classList.add('active');
  }

  function autoplay() {
    const year = years[currentIndex];
    updateContent(year);
    updateBackground(year);
    currentIndex = (currentIndex + 1) % years.length;
  }

  // 自动播放开始
  intervalId = setInterval(autoplay, 3000); // 每3秒播放一个年份

  // 鼠标悬停立即展示该年份并暂停自动播放
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      clearInterval(intervalId); // 暂停自动播放
      const year = button.dataset.year;
      updateContent(year);
      updateBackground(year);
    });

    button.addEventListener('mouseleave', () => {
      // 鼠标离开时恢复自动播放
      intervalId = setInterval(autoplay, 3000);
    });
  });

  // 默认初始化
  updateContent('2024');
  updateBackground('2024');
});



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


document.addEventListener('DOMContentLoaded', () => {
  const allDigits = [];

  // 初始化每个 funfact 里的 digit 框
  document.querySelectorAll('.funfact').forEach(fact => {
    const value = fact.getAttribute('data-value');
    const suffix = fact.getAttribute('data-suffix') || ''; // 如 "%"
    const container = fact.querySelector('.digit-boxes');
    container.innerHTML = '';

    [...value].forEach(d => {
      const digit = document.createElement('div');
      digit.classList.add('digit');
      digit.textContent = '0';
      container.appendChild(digit);
      allDigits.push({ el: digit, target: d });
    });

    //  加入后缀符号，例如 "%"
    if (suffix) {
      const symbol = document.createElement('div');
      symbol.classList.add('digit');
      symbol.textContent = suffix;
      container.appendChild(symbol);
    }
  });

  // 老虎机动画：所有数字一起开始转，但从左到右依次停
  const startSlotAnimation = () => {
    allDigits.forEach(({ el, target }, i) => {
      const interval = setInterval(() => {
        el.textContent = Math.floor(Math.random() * 10);
      }, 40);

      // 从左到右依次停下
      setTimeout(() => {
        clearInterval(interval);
        el.textContent = target;
      }, 1000 + i * 400);
    });
  };

  // 滚动到视图触发动画
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startSlotAnimation();
      }
    });
  }, { threshold: 0.3 });

  const section = document.querySelector('#section6');
  if (section) observer.observe(section);
});


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


