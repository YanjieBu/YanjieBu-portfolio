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

// === 大屏动画文字，仅首次刷新显示 ===
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector('.caption-container');
  const captions = document.querySelectorAll('.caption');

  if (window.innerWidth <= 600) {
    // 小屏幕直接隐藏
    container.style.display = 'none';
  } else {
    // 添加左右动画类 + 显示
    captions.forEach((caption, index) => {
      caption.classList.add(index === 0 ? 'caption-left' : 'caption-right');
      caption.style.opacity = '1';
    });

    // 4秒后淡出 + 彻底隐藏
    setTimeout(() => {
      container.style.opacity = '0';
      setTimeout(() => {
        container.style.display = 'none';
      }, 1000);
    }, 4000);
  }
});

// === 小屏幕显示 loading gif 动画 ===
document.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth <= 1650) {
    const gif = document.querySelector('.small-screen-gif');
    if (gif) {
      gif.classList.add('visible');
      setTimeout(() => gif.classList.remove('visible'), 3000);
    }
  }
});

// === 全局变量定义 ===
const overlay = document.querySelector('.home-overlay');
const text = document.querySelector('.home-text');
const logoLink = document.querySelector('.logo-link');
const logo = document.querySelector('.logo-slide');
const nav = document.querySelector('.nav-slide');
const navLabels = document.querySelectorAll('.nav-number, .nav-label, .face.front');

let canHover = false; // 控制 hover 延迟
let currentHoverSource = null; // 当前触发 hover 的元素（logo 或某导航）

// === 页面加载 3s 后允许 hover 效果 ===
setTimeout(() => {
  canHover = true;
}, 3000);

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
  animatePerChar('.hero-title', 3500);
  animatePerChar('.hero-subtitle', 4000);
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

  setTimeout(() => {
    window.location.href = targetUrl;
  }, 2950);

  setTimeout(() => {
    grayLayer.remove();
  }, 2955);
}




