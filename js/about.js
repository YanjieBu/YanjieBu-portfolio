window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

// === 页面加载 5s 后显示 bottom caption（可选）===
setTimeout(() => {
  const bottomContainer = document.querySelector('.bottom-caption-container');
  if (bottomContainer) {
    bottomContainer.style.display = 'block';
  }
}, 5000);

// === 全局变量定义 ===
const overlay = document.querySelector('.home-overlay');
const text = document.querySelector('.home-text');
const logoLink = document.querySelector('.logo-link');
const logo = document.querySelector('.logo-slide');
const nav = document.querySelector('.nav-slide');
const navLabels = document.querySelectorAll('.nav-number, .nav-label, .face.front');

let canHover = false; // 控制 hover 延迟
let currentHoverSource = null; // 当前触发 hover 的元素（logo 或某导航）

// === 页面加载 1s 后允许 hover 效果 ===
setTimeout(() => {
  canHover = true;
}, 1000);

// === LOGO 悬停：显示 HOME 遮罩 ===
logoLink?.addEventListener('mouseenter', () => {
  if (!canHover) return;
  currentHoverSource = 'logo';
  updateOverlay('HOME');
  overlay.style.height = text.getBoundingClientRect().height + 'px';
  text.style.opacity = '1';
  text.style.transform = 'translateY(0)';
  navLabels.forEach(el => el.style.color = 'white');
});

// === LOGO 离开：隐藏遮罩 ===
logoLink?.addEventListener('mouseleave', () => {
  if (!canHover) return;
  if (currentHoverSource === 'logo') {
    hideOverlay();
    currentHoverSource = null;
  }
  navLabels.forEach(el => el.style.color = '');
});

// === 导航条悬停交互 ===
document.querySelectorAll(".nav-item:not(.static)").forEach(item => {
  const label = item.querySelector(".face.front");
  const pageName = label ? label.textContent.trim().toUpperCase() : "";

  // === 悬停：更新遮罩为当前页面名 ===
  item.addEventListener("mouseenter", () => {
    if (!canHover) return;
    currentHoverSource = pageName;
    updateOverlay(pageName);
    overlay.style.height = text.getBoundingClientRect().height + 'px';
    text.style.opacity = '1';
    text.style.transform = 'translateY(0)';
    navLabels.forEach(el => el.style.color = 'white');
  });

  // === 离开：若是当前项，则隐藏遮罩 ===
  item.addEventListener("mouseleave", () => {
    if (!canHover) return;
    if (currentHoverSource === pageName) {
      hideOverlay();
      currentHoverSource = null;
    }
    navLabels.forEach(el => el.style.color = '');
  });

  // === 点击导航：翻转动画并跳转 ===
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const inner = item.querySelector('.nav-cylinder-inner');
    if (inner) inner.style.transform = 'rotateX(90deg)'; // 强制翻转显示白字

    const targetUrl = `${pageName.toLowerCase()}.html`;
    animateOverlay(pageName, targetUrl);
  });
});

// === LOGO 点击返回首页 ===
logo?.addEventListener("click", (e) => {
  e.preventDefault();
  animateOverlay('HOME', 'index.html');
});

// === 页面加载后启用导航条动画 ===
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (nav) nav.style.animationPlayState = 'running';
  }, 3000);
});

// === 每个字符逐一浮现动画 ===
function animatePerChar(selector, delay = 0) {
  setTimeout(() => {
    const el = document.querySelector(selector);
    if (!el) return;

    const textContent = el.textContent.trim();
    el.style.visibility = 'hidden';
    el.innerHTML = '';

    const fragment = document.createDocumentFragment();
    [...textContent].forEach((char, i) => {
      const span = document.createElement('span');
      span.className = `char delay-char-${i}`;
      span.textContent = char === ' ' ? '\u00A0' : char;
      fragment.appendChild(span);
    });

    el.appendChild(fragment);
    el.style.visibility = 'visible';
  }, delay);
}

// === 启动主标题和副标题的动画 ===
window.addEventListener("DOMContentLoaded", () => {
  animatePerChar('.hero-title', 400);
  animatePerChar('.hero-subtitle', 700);
});

// === 替换遮罩文字内容 ===
function updateOverlay(textContent) {
  if (!textContent || textContent.length === 0) return;

  const firstLetter = textContent[0];
  const rest = textContent.slice(1);

  // ✅ 始终使用 overlay-font，只用于黑色背景文字
  text.innerHTML = `<span class="overlay-font">${firstLetter}</span>${rest}`;
}

// === 隐藏遮罩（用于离开或取消悬停）===
function hideOverlay() {
  overlay.style.height = '0';
  text.style.opacity = '0';
  text.style.transform = 'translateY(100%)';
}

// === 页面跳转动画（展开黑幕 → 上滑 → 跳转）===
function animateOverlay(label, targetUrl) {
  overlay.classList.add("expand"); // 黑色遮罩铺满

  // 设置遮罩文字，首字母字体不同
  text.innerHTML = `<span class="overlay-font">${label[0]}</span>${label.slice(1)}`;
  text.classList.remove("show-white", "instant-white");
  text.style.transition = 'none';
  text.style.transform = 'translateY(0)';
  text.style.opacity = '1';
  text.style.color = 'rgba(219, 219, 219, 0.274)';

  // 延迟变白色文字
  setTimeout(() => {
    text.classList.add("instant-white");
  }, 0);

  // 黑幕展开后再添加灰色背景层
  setTimeout(() => {
    const grayLayer = document.createElement("div");
    grayLayer.classList.add("temporary-gray-bg");
    document.body.appendChild(grayLayer);
  }, 800); // 黑色遮罩展开后再加灰色背景，时机可调

  // 黑幕上滑离场动画
  setTimeout(() => {
    overlay.classList.add("slide-up");
  }, 1600);

  // 页面跳转
  setTimeout(() => {
    window.location.href = targetUrl;
  }, 2950);
}

// === 动画结束后清除白字状态类 ===
text?.addEventListener('animationend', () => {
  text.classList.remove('show-white');
});

// === Education Container 滚动观察器 ===
document.addEventListener("DOMContentLoaded", () => {
  const edu = document.querySelector('.education-container');

  if (edu) {
    const eduObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            edu.classList.add('show');
            eduObserver.unobserve(entry.target); // 只触发一次
          }
        });
      },
      {
        threshold: 0.3, // 元素进入 30% 可见范围时触发
      }
    );

    eduObserver.observe(edu);
  }
});

// === 浮动导航栏显示逻辑 ===
const floatingNav = document.querySelector('.floating-navbar');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY || window.pageYOffset;
  const triggerY = window.innerHeight * 0.6;

  if (floatingNav) {
    if (scrollY > triggerY) {
      floatingNav.classList.add('show');
    } else {
      floatingNav.classList.remove('show');
    }
  }
});

// === 点击浮动导航文字：先滚动回顶部，再执行遮罩动画 ===
document.querySelectorAll('.floating-link').forEach(link => {
  link.addEventListener('click', () => {
    const page = link.dataset.page;
    const label = link.textContent.trim();

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 延迟执行遮罩展开动画
    setTimeout(() => {
      animateOverlay(label, page);
    }, 500); // 500ms 可根据实际滚动时间微调
  });
});

// === 点击浮动 Logo：滚动回顶部后跳转首页 ===
document.querySelector('.floating-logo')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });

  setTimeout(() => {
    animateOverlay('HOME', 'index.html');
  }, 500);
});

// === Experience Container 滚动观察器 ===
const expObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.experience-container').forEach(el => {
  expObserver.observe(el);
});

// === 音乐区域滚动显示 ===
window.addEventListener('scroll', () => {
  const musicSection = document.getElementById('musicSection');
  if (musicSection) {
    const top = musicSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (top < windowHeight * 0.9) {
      musicSection.classList.add('show');
    }
  }
});

// === 音乐播放功能 ===
const musicGif = document.getElementById("music-gif");
const audioPlayer = document.getElementById("audio-player");
const playerBar = document.getElementById("playerBar");
const hobbyContainer = document.querySelector('.hobby-container');

if (musicGif && audioPlayer && playerBar) {
  musicGif.addEventListener("click", () => {
    musicGif.src = "images/music1.gif"; // 确保 GIF 文件支持循环播放
    audioPlayer.play().catch(e => console.log('Audio play failed:', e));
    playerBar.classList.add("show");

    // ✅ 关键点：修改兴趣板块的位置
    if (hobbyContainer && !hobbyContainer.classList.contains('moved-down')) {
      hobbyContainer.style.top = '393%';  // 或者更大，看你播放器高度
      hobbyContainer.classList.add('moved-down');
    }
  });
}

// === 图片轮播滚动功能 ===
function scrollCarousel(containerId, direction) {
  const container = document.getElementById(containerId);
  if (container) {
    const scrollAmount = container.offsetWidth * 0.8; // 每次滚动80%
    container.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
  }
}

// === 定义摄影图片文件名列表（pics = portrait，pich = horizontal）===
const photoImages = [
  "pics0.jpg", "pics6.jpg", "pics17.jpg", "pics2.jpg", "pics3.png", "pics4.jpg", "pics5.jpg",
  "pics1.jpg", "pics7.png", "pics8.png", "pics9.jpg", "pics10.png",
  "pics11.jpg", "pics12.jpg", "pics13.jpg", "pics14.jpg", "pics15.jpg", "pics16.jpg",
  "pich1.jpg", "pich6.png", "pich7.png", "pich8.png", "pich9.png", "pich4.png", "pich5.jpg", "pich2.jpg", "pich3.jpg", "pich10.jpg"
];

// === 定义绘画图片文件名列表（pas = portrait，pah = horizontal）===
const paintingImages = [
  "pas1.jpg", "pas2.jpg", "pas3.jpg", "pas4.jpg", "pas5.jpg", "pas6.jpg", "pas7.jpg",
  "pah2.jpg", "pah1.jpg", "pah3.jpg", "pah4.jpg", "pah5.jpg", "pah6.jpg", "pah7.jpg",
  "pah8.jpg", "pah9.jpg", "pah10.jpg", "pah11.jpg", "pah12.jpg", "pah13.jpg", "pah14.jpg"
];

// === 将图片添加到对应容器中 ===
function populateCarousel(containerId, imageList) {
  const container = document.getElementById(containerId); // 获取轮播容器元素
  if (container) {
    imageList.forEach(src => {
      const img = document.createElement('img'); // 创建 img 元素
      img.src = `./images/${src}`; // 设置图片路径（注意改成你的实际路径）
      img.alt = '';
      img.loading = 'lazy'; // 添加懒加载
      container.appendChild(img); // 添加到轮播容器中
    });
  }
}

// === 调用函数分别填充摄影和绘画轮播 ===
populateCarousel('photo-carousel', photoImages);
populateCarousel('art-carousel', paintingImages);

// ✅ 使用 IntersectionObserver 在滚动到指定位置时添加 .show 类
const mainObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show'); // 添加 show 类，触发动画和显示
    }
  });
}, { threshold: 0.2 }); // 元素进入视口 20% 时触发

// ✅ 为所有需要动画显示的 section 添加监听（包括 Awards）
[
  '.about-container',
  '.education-container',
  '.experience-container',
  '.awards-container',    // ← 关键：添加这一行！
  '.music-container',
  '.hobby-container'  // 别忘了把你的摄影绘画板块加上
].forEach(selector => {
  const el = document.querySelector(selector);
  if (el) {
    mainObserver.observe(el);
    console.log(`✅ Observer added for: ${selector}`);
  } else {
    console.warn(`❌ Element not found: ${selector}`);
  }
});

// === 自动轮播功能 ===
function autoScrollCarousel(containerId, speed = 1.5, interval = 20) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let scrollDirection = 1;
  let isPaused = false;

  // 自动轮播逻辑
  const autoScroll = () => {
    if (!container || isPaused) return;

    container.scrollLeft += scrollDirection * speed;

    if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
      scrollDirection = -1;
    }
    if (container.scrollLeft <= 0) {
      scrollDirection = 1;
    }
  };

  // 每 interval 毫秒尝试滚动一次
  const timer = setInterval(autoScroll, interval);

  // 悬停时暂停
  container.addEventListener('mouseenter', () => {
    isPaused = true;
  });

  // 离开后恢复
  container.addEventListener('mouseleave', () => {
    isPaused = false;
  });

  // 用户滑动时也暂停（可选）
  container.addEventListener('mousedown', () => {
    isPaused = true;
  });
  container.addEventListener('mouseup', () => {
    isPaused = false;
  });

  return timer; // 返回定时器引用，方便清理
}

// === 启动自动轮播 ===
autoScrollCarousel('photo-carousel');
autoScrollCarousel('art-carousel');

// === 照片放大功能 ===
const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxImg = document.getElementById('lightbox-image');

if (lightboxOverlay && lightboxImg) {
  // 点击图片放大
  document.addEventListener('click', (e) => {
    if (e.target.matches('.carousel-container img')) {
      lightboxImg.src = e.target.src;
      lightboxOverlay.style.display = 'flex';
    }
  });

  // 点击遮罩关闭
  lightboxOverlay.addEventListener('click', () => {
    lightboxOverlay.style.display = 'none';
    lightboxImg.src = '';
  });

  // 禁用右键菜单
  lightboxImg.addEventListener('contextmenu', (e) => e.preventDefault());
}

// === 图片预加载功能 ===
function preloadImages(imageList) {
  imageList.forEach(src => {
    const img = new Image();
    img.src = `./images/${src}`;
  });
}

// ✅ 页面加载完立即预加载所有图片，减少滚动时卡顿
window.addEventListener('load', () => {
  preloadImages(photoImages);
  preloadImages(paintingImages);
});

// === 返回顶部功能 ===
document.querySelector('.contact-top')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ✅ 调试信息 - 确保 Awards 观察器设置成功
console.log("✅ Awards section observer set up successfully!");

// ✅ 检查 Awards 容器是否存在
document.addEventListener('DOMContentLoaded', () => {
  const awardsContainer = document.querySelector('.awards-container');
  if (awardsContainer) {
    console.log("✅ Awards container found in DOM");
  } else {
    console.warn("❌ Awards container not found in DOM");
  }
});

// ✅ 额外的 Awards 专用观察器（双重保险）
const awardsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      console.log("✅ Awards section animated successfully!");
    }
  });
}, { threshold: 0.3 });

// === 确保 Awards 容器被观察 ===
document.addEventListener('DOMContentLoaded', () => {
  const awardsContainer = document.querySelector('.awards-container');
  if (awardsContainer) {
    awardsObserver.observe(awardsContainer);
    console.log("✅ Awards observer attached successfully!");
  }
});




