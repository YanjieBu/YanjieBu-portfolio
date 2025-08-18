window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

// === 移动端检测（只定义一次）===
const isMobile = window.innerWidth <= 768;
const isTouch = 'ontouchstart' in window;

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

let canHover = false;
let currentHoverSource = null;

// === 页面加载 1s 后允许 hover 效果 ===
setTimeout(() => {
  canHover = true;
}, 1000);

// === LOGO 悬停：显示 HOME 蒙罩 ===
logoLink?.addEventListener('mouseenter', () => {
  if (!canHover) return;
  currentHoverSource = 'logo';
  updateOverlay('HOME');
  overlay.style.height = text.getBoundingClientRect().height + 'px';
  text.style.opacity = '1';
  text.style.transform = 'translateY(0)';
  navLabels.forEach(el => el.style.color = 'white');
});

// === LOGO 离开：隐藏蒙罩 ===
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

  item.addEventListener("mouseenter", () => {
    if (!canHover) return;
    currentHoverSource = pageName;
    updateOverlay(pageName);
    overlay.style.height = text.getBoundingClientRect().height + 'px';
    text.style.opacity = '1';
    text.style.transform = 'translateY(0)';
    navLabels.forEach(el => el.style.color = 'white');
  });

  item.addEventListener("mouseleave", () => {
    if (!canHover) return;
    if (currentHoverSource === pageName) {
      hideOverlay();
      currentHoverSource = null;
    }
    navLabels.forEach(el => el.style.color = '');
  });

  item.addEventListener("click", (e) => {
    e.preventDefault();
    const inner = item.querySelector('.nav-cylinder-inner');
    if (inner) inner.style.transform = 'rotateX(90deg)';

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

// === 替换蒙罩文字内容 ===
function updateOverlay(textContent) {
  if (!textContent || textContent.length === 0) return;

  const firstLetter = textContent[0];
  const rest = textContent.slice(1);

  text.innerHTML = `<span class="overlay-font">${firstLetter}</span>${rest}`;
}

// === 隐藏蒙罩 ===
function hideOverlay() {
  overlay.style.height = '0';
  text.style.opacity = '0';
  text.style.transform = 'translateY(100%)';
}

// === 页面跳转动画 ===
function animateOverlay(label, targetUrl) {
  overlay.classList.add("expand");

  text.innerHTML = `<span class="overlay-font">${label[0]}</span>${label.slice(1)}`;
  text.classList.remove("show-white", "instant-white");
  text.style.transition = 'none';
  text.style.transform = 'translateY(0)';
  text.style.opacity = '1';
  text.style.color = 'rgba(219, 219, 219, 0.274)';

  setTimeout(() => {
    text.classList.add("instant-white");
  }, 0);

  setTimeout(() => {
    const grayLayer = document.createElement("div");
    grayLayer.classList.add("temporary-gray-bg");
    document.body.appendChild(grayLayer);
  }, 800);

  setTimeout(() => {
    overlay.classList.add("slide-up");
  }, 1600);

  setTimeout(() => {
    window.location.href = targetUrl;
  }, 2950);
}

// === 动画结束后清除白字状态类 ===
text?.addEventListener('animationend', () => {
  text.classList.remove('show-white');
});

// === 浮动导航条显示逻辑 ===
const floatingNav = document.querySelector('.floating-navbar');

// 优化的滚动处理器
let ticking = false;

function optimizedScrollHandler() {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY || window.pageYOffset;
      const triggerY = window.innerHeight * (isMobile ? 0.4 : 0.6);

      if (floatingNav) {
        if (scrollY > triggerY) {
          floatingNav.classList.add('show');
        } else {
          floatingNav.classList.remove('show');
        }
      }

      const musicSection = document.getElementById('musicSection');
      if (musicSection) {
        const rect = musicSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight * (isMobile ? 0.8 : 0.9)) {
          musicSection.classList.add('show');
        }
      }

      ticking = false;
    });
    ticking = true;
  }
}

// 使用优化的滚动处理器
if (isMobile) {
  window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
} else {
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

    const musicSection = document.getElementById('musicSection');
    if (musicSection) {
      const top = musicSection.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (top < windowHeight * 0.9) {
        musicSection.classList.add('show');
      }
    }
  });
}

// === 点击浮动导航文字 ===
document.querySelectorAll('.floating-link').forEach(link => {
  link.addEventListener('click', () => {
    const page = link.dataset.page;
    const label = link.textContent.trim();

    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      animateOverlay(label, page);
    }, 500);
  });
});

// === 点击浮动 Logo ===
document.querySelector('.floating-logo')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });

  setTimeout(() => {
    animateOverlay('HOME', 'index.html');
  }, 500);
});

// === 修复后的观察器 ===
document.addEventListener("DOMContentLoaded", () => {
  const edu = document.querySelector('.education-container');

  if (edu) {
    const eduObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            edu.classList.add('show');
            eduObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: isMobile ? 0.1 : 0.3,
      }
    );

    eduObserver.observe(edu);
  }
});

// === Experience Container 滚动观察器 ===
const expObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: isMobile ? 0.1 : 0.3 });

document.querySelectorAll('.experience-container').forEach(el => {
  expObserver.observe(el);
});

// === 音乐播放功能 ===
const musicGif = document.getElementById("music-gif");
const audioPlayer = document.getElementById("audio-player");
const playerBar = document.getElementById("playerBar");
const hobbyContainer = document.querySelector('.hobby-container');

if (musicGif && audioPlayer && playerBar) {
  musicGif.addEventListener("click", async () => {
    try {
      if (isMobile) {
        musicGif.style.opacity = '0.7';
      }
      
      musicGif.src = "images/music1.gif";
      await audioPlayer.play();
      playerBar.classList.add("show");

      if (hobbyContainer && !hobbyContainer.classList.contains('moved-down')) {
        hobbyContainer.style.marginTop = isMobile ? '150px' : '150px';
        hobbyContainer.classList.add('moved-down');
      }
      
      if (isMobile) {
        musicGif.style.opacity = '1';
      }
      
    } catch (error) {
      console.log('音频播放失败:', error);
      if (isMobile) {
        musicGif.style.opacity = '1';
        showPlayTip(musicGif);
      }
    }
  });
}

// === 显示播放提示 ===
function showPlayTip(element) {
  const tip = document.createElement('div');
  tip.textContent = '请点击播放按钮开始播放';
  tip.style.cssText = `
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 170, 42, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-family: 'Helvetica Neue', sans-serif;
    z-index: 1000;
    white-space: nowrap;
    margin-top: 10px;
  `;
  
  element.parentNode.style.position = 'relative';
  element.parentNode.appendChild(tip);
  
  setTimeout(() => {
    if (tip.parentNode) {
      tip.remove();
    }
  }, 3000);
}

// === 图片轮播滚动功能 ===
function scrollCarousel(containerId, direction) {
  const container = document.getElementById(containerId);
  if (container) {
    const scrollAmount = container.offsetWidth * 0.8;
    container.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
  }
}

// === 定义图片文件名列表 ===
const photoImages = [
  "pics0.jpg", "pics6.jpg", "pics17.jpg", "pics2.jpg", "pics3.png", "pics4.jpg", "pics5.jpg",
  "pics1.jpg", "pics7.png", "pics8.png", "pics9.jpg", "pics10.png",
  "pics11.jpg", "pics12.jpg", "pics13.jpg", "pics14.jpg", "pics15.jpg", "pics16.jpg",
  "pich1.jpg", "pich6.png", "pich7.png", "pich8.png", "pich9.png", "pich4.png", "pich5.jpg", "pich2.jpg", "pich3.jpg", "pich10.jpg"
];

const paintingImages = [
  "pas1.jpg", "pas2.jpg", "pas3.jpg", "pas4.jpg", "pas5.jpg", "pas6.jpg", "pas7.jpg",
  "pah2.jpg", "pah1.jpg", "pah3.jpg", "pah4.jpg", "pah5.jpg", "pah6.jpg", "pah7.jpg",
  "pah8.jpg", "pah9.jpg", "pah10.jpg", "pah11.jpg", "pah12.jpg", "pah13.jpg", "pah14.jpg"
];

// === 将图片添加到对应容器中 ===
function populateCarousel(containerId, imageList) {
  const container = document.getElementById(containerId);
  if (container) {
    imageList.forEach(src => {
      const img = document.createElement('img');
      img.src = `./images/${src}`;
      img.alt = '';
      img.loading = 'lazy';
      container.appendChild(img);
    });
  }
}

// === 调用函数分别填充摄影和绘画轮播 ===
populateCarousel('photo-carousel', photoImages);
populateCarousel('art-carousel', paintingImages);

// === 移动端轮播优化 ===
function addTouchScrollSupport() {
  if (isMobile) {
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(carousel => {
      let startX = 0;
      let scrollLeft = 0;
      let isDown = false;

      carousel.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX;
        scrollLeft = carousel.scrollLeft;
        carousel.style.scrollBehavior = 'auto';
      });

      carousel.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX;
        const walk = (startX - x) * 1.5;
        carousel.scrollLeft = scrollLeft + walk;
      });

      carousel.addEventListener('touchend', () => {
        isDown = false;
        carousel.style.scrollBehavior = 'smooth';
      });
    });
  }
}

// === 主观察器 ===
const mainObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = isMobile ? 50 : 0;
      setTimeout(() => {
        entry.target.classList.add('show');
      }, delay);
    }
  });
}, { 
  threshold: isMobile ? 0.1 : 0.2,
  rootMargin: isMobile ? '30px' : '0px'
});

// === 为所有需要动画显示的 section 添加监听 ===
[
  '.about-container',
  '.education-container',
  '.experience-container',
  '.awards-container',
  '.music-container',
  '.hobby-container'
].forEach(selector => {
  const el = document.querySelector(selector);
  if (el) {
    mainObserver.observe(el);
    console.log(`✅ Observer added for: ${selector}`);
  } else {
    console.warn(`⚠ Element not found: ${selector}`);
  }
});

// === 自动轮播功能 ===
function autoScrollCarousel(containerId, speed = 1.5, interval = 20) {
  if (isMobile) return;
  
  const container = document.getElementById(containerId);
  if (!container) return;

  let scrollDirection = 1;
  let isPaused = false;

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

  const timer = setInterval(autoScroll, interval);

  container.addEventListener('mouseenter', () => {
    isPaused = true;
  });

  container.addEventListener('mouseleave', () => {
    isPaused = false;
  });

  container.addEventListener('mousedown', () => {
    isPaused = true;
  });
  container.addEventListener('mouseup', () => {
    isPaused = false;
  });

  return timer;
}

// === 启动自动轮播 ===
autoScrollCarousel('photo-carousel');
autoScrollCarousel('art-carousel');

// === 照片放大功能 ===
const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxImg = document.getElementById('lightbox-image');

if (lightboxOverlay && lightboxImg) {
  document.addEventListener('click', (e) => {
    if (e.target.matches('.carousel-container img')) {
      lightboxImg.src = e.target.src;
      lightboxOverlay.style.display = 'flex';
    }
  });

  lightboxOverlay.addEventListener('click', () => {
    lightboxOverlay.style.display = 'none';
    lightboxImg.src = '';
  });

  lightboxImg.addEventListener('contextmenu', (e) => e.preventDefault());
}

// === 移动端图片lightbox手势支持 ===
function addLightboxGestureSupport() {
  if (isTouch) {
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImg = document.getElementById('lightbox-image');
    
    if (lightboxOverlay && lightboxImg) {
      let scale = 1;
      let startDistance = 0;
      let initialScale = 1;

      lightboxOverlay.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
          e.preventDefault();
          const touch1 = e.touches[0];
          const touch2 = e.touches[1];
          startDistance = Math.hypot(
            touch1.clientX - touch2.clientX,
            touch1.clientY - touch2.clientY
          );
          initialScale = scale;
        }
      });
      
      lightboxOverlay.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
          e.preventDefault();
          const touch1 = e.touches[0];
          const touch2 = e.touches[1];
          const distance = Math.hypot(
            touch1.clientX - touch2.clientX,
            touch1.clientY - touch2.clientY
          );
          
          scale = initialScale * (distance / startDistance);
          scale = Math.max(0.5, Math.min(scale, 3));
          
          lightboxImg.style.transform = `scale(${scale})`;
        }
      });
      
      let lastTouchTime = 0;
      lightboxImg.addEventListener('touchend', (e) => {
        const currentTime = new Date().getTime();
        if (currentTime - lastTouchTime < 300) {
          scale = scale > 1 ? 1 : 2;
          lightboxImg.style.transform = `scale(${scale})`;
          lightboxImg.style.transition = 'transform 0.3s ease';
          setTimeout(() => {
            lightboxImg.style.transition = '';
          }, 300);
        }
        lastTouchTime = currentTime;
      });
    }
  }
}

// === 移动端触摸事件优化 ===
if (isTouch) {
  document.querySelectorAll('.nav-item:not(.static)').forEach(item => {
    item.addEventListener('touchstart', function() {
      this.style.opacity = '0.7';
    });
    
    item.addEventListener('touchend', function() {
      this.style.opacity = '1';
    });
  });

  document.querySelectorAll('.floating-link').forEach(link => {
    link.addEventListener('touchstart', function() {
      this.style.color = '#ffffff';
    });
    
    link.addEventListener('touchend', function() {
      setTimeout(() => {
        this.style.color = '#cacacae7';
      }, 150);
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      document.querySelectorAll('.carousel-container img').forEach(img => {
        img.addEventListener('touchstart', function() {
          this.style.transform = 'scale(0.95)';
          this.style.transition = 'transform 0.1s ease';
        });
        
        img.addEventListener('touchend', function() {
          this.style.transform = '';
          this.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease, z-index 0.2s';
        });
      });
    }, 2000);
  });
}

// === 图片预加载功能 ===
function preloadImages(imageList) {
  imageList.forEach(src => {
    const img = new Image();
    img.src = `./images/${src}`;
  });
}

window.addEventListener('load', () => {
  preloadImages(photoImages);
  preloadImages(paintingImages);
});

// === 返回顶部功能 ===
document.querySelector('.contact-top')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// === 屏幕方向变化处理 ===
function handleOrientationChange() {
  setTimeout(() => {
    document.body.style.height = window.innerHeight + 'px';
    window.dispatchEvent(new Event('resize'));
    
    const containers = document.querySelectorAll('.education-container, .experience-container, .awards-container, .music-container, .hobby-container');
    containers.forEach(container => {
      const rect = container.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        container.classList.add('show');
      }
    });
  }, 100);
}

// === 移动端初始化 ===
function initMobileOptimizations() {
  if (isMobile) {
    console.log('移动端优化已启用');
    addTouchScrollSupport();
    addLightboxGestureSupport();
  }
}

// === Awards 专用观察器 ===
const awardsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      console.log("✅ Awards section animated successfully!");
    }
  });
}, { threshold: isMobile ? 0.1 : 0.3 });

// === DOMContentLoaded 事件处理 ===
document.addEventListener('DOMContentLoaded', () => {
  const awardsContainer = document.querySelector('.awards-container');
  if (awardsContainer) {
    awardsObserver.observe(awardsContainer);
    console.log("✅ Awards observer attached successfully!");
  }
  
  initMobileOptimizations();
  
  // 延迟检查所有容器的显示状态
  setTimeout(() => {
    const containers = [
      '.about-container',
      '.education-container', 
      '.experience-container',
      '.awards-container',
      '.music-container',
      '.hobby-container'
    ];
    
    containers.forEach(selector => {
      const container = document.querySelector(selector);
      if (container) {
        const rect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight * 0.8) {
          container.classList.add('show');
        }
      }
    });
  }, 100);
});

// === 监听屏幕方向变化 ===
window.addEventListener('orientationchange', handleOrientationChange);

// === 监听窗口大小变化 ===
window.addEventListener('resize', () => {
  clearTimeout(window.resizeTimeout);
  window.resizeTimeout = setTimeout(() => {
    const newIsMobile = window.innerWidth <= 768;
    if (newIsMobile !== isMobile) {
      location.reload();
    }
  }, 250);
});

// === 防止移动端弹跳效果 ===
if (isMobile) {
  document.addEventListener('touchmove', (e) => {
    const scrollableElements = [
      '.carousel-container',
      '.floating-navbar',
      'audio'
    ];
    
    const isScrollable = scrollableElements.some(selector => 
      e.target.closest(selector)
    );
    
    if (!isScrollable && e.target === document.body) {
      e.preventDefault();
    }
  }, { passive: false });
}

// === 页面可见性变化处理 ===
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    setTimeout(() => {
      const containers = document.querySelectorAll('.education-container, .experience-container, .awards-container, .music-container, .hobby-container');
      containers.forEach(container => {
        if (!container.classList.contains('show')) {
          const rect = container.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.8) {
            container.classList.add('show');
          }
        }
      });
    }, 100);
  }
});

// === 移动端性能监控 ===
if (isMobile && 'performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation && navigation.loadEventEnd > 4000) {
        console.warn('移动端页面加载时间较长，建议优化');
      }
    }, 100);
  });
}

// === 错误处理和调试信息 ===
window.addEventListener('error', (e) => {
  console.warn('页面错误:', e.message);
});

// === 最终初始化检查 ===
window.addEventListener('load', () => {
  console.log('✅ 页面完全加载完成');
  console.log('✅ 移动端检测:', isMobile ? '是' : '否');
  console.log('✅ 触摸设备检测:', isTouch ? '是' : '否');
  
  const criticalElements = [
    '.hero-text',
    '.nav-slide', 
    '.about-container',
    '.education-container',
    '.floating-navbar'
  ];
  
  criticalElements.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      console.log(`✅ ${selector} 元素找到`);
    } else {
      console.warn(`⚠️ ${selector} 元素未找到`);
    }
  });
});