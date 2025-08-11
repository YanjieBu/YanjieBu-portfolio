// Portfolio JavaScript - 修复加载问题

document.addEventListener('DOMContentLoaded', function() {
    // 立即初始化加载器
    initLoader();
    
    // 初始化其他组件
    initNavigation();
    initScrollAnimations();
    initParallaxEffects();
    initImageLazyLoading();
    initSmoothScrolling();
    initTypewriterEffect();
    initFloatingCards();
});

// 修复的加载屏幕函数
function initLoader() {
    const loader = document.getElementById('loading');
    
    if (!loader) {
        console.warn('Loading element not found');
        return;
    }
    
    // 方法1: 使用多种事件确保加载屏幕会消失
    let loadingHidden = false;
    
    function hideLoader() {
        if (loadingHidden) return;
        loadingHidden = true;
        
        console.log('Hiding loader...');
        
        setTimeout(() => {
            if (loader && loader.parentNode) {
                loader.classList.add('hidden');
                document.body.style.overflow = 'visible';
                
                // 移除加载屏幕
                setTimeout(() => {
                    if (loader && loader.parentNode) {
                        loader.remove();
                        console.log('Loader removed');
                    }
                }, 500);
            }
        }, 800); // 减少等待时间
    }
    
    // 方法2: 多重保险机制
    // 1. DOMContentLoaded 后立即隐藏（如果页面已经加载完成）
    if (document.readyState === 'complete') {
        hideLoader();
    }
    
    // 2. window load 事件
    window.addEventListener('load', hideLoader);
    
    // 3. 定时器保险（3秒后强制隐藏）
    setTimeout(() => {
        if (!loadingHidden) {
            console.log('Force hiding loader after 3 seconds');
            hideLoader();
        }
    }, 3000);
    
    // 4. 检查图片加载状态
    const images = document.querySelectorAll('img');
    if (images.length === 0) {
        // 如果没有图片，直接隐藏
        setTimeout(hideLoader, 1000);
    } else {
        // 等待关键图片加载
        let loadedImages = 0;
        const totalImages = Math.min(images.length, 3); // 最多等待3张图片
        
        images.forEach((img, index) => {
            if (index >= 3) return; // 只检查前3张图片
            
            if (img.complete) {
                loadedImages++;
            } else {
                img.addEventListener('load', () => {
                    loadedImages++;
                    if (loadedImages >= totalImages) {
                        hideLoader();
                    }
                });
                
                img.addEventListener('error', () => {
                    loadedImages++;
                    if (loadedImages >= totalImages) {
                        hideLoader();
                    }
                });
            }
        });
        
        if (loadedImages >= totalImages) {
            hideLoader();
        }
    }
}

// 增强的导航功能
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobileMenu');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navbar) return;
    
    // 滚动效果
    let ticking = false;
    
    function updateNavbar() {
        const scrolled = window.scrollY > 50;
        navbar.classList.toggle('scrolled', scrolled);
        ticking = false;
    }
    
    function requestNavbarUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestNavbarUpdate);
    
    // 移动端菜单
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }
    
    // 活动链接高亮
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', throttle(updateActiveLink, 100));
    
    // 关闭移动菜单
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        });
    });
}

// 滚动动画
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.overview-card, .story-card, .system-card, .impl-card, .challenge-card, .reflection-card, .stat-item'
    );
    
    if (!animatedElements.length) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in', 'visible');
                }, index * 100);
                
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
        scrollObserver.observe(element);
    });
}

// 视差效果
function initParallaxEffects() {
    const heroBackground = document.querySelector('.hero-background');
    const floatingCards = document.querySelectorAll('.floating-card');
    
    if (!heroBackground && !floatingCards.length) return;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
        
        floatingCards.forEach((card, index) => {
            const speed = 0.2 + (index * 0.1);
            const yPos = scrolled * speed;
            card.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    let parallaxTicking = false;
    
    function requestParallaxUpdate() {
        if (!parallaxTicking) {
            requestAnimationFrame(updateParallax);
            parallaxTicking = true;
        }
    }
    
    window.addEventListener('scroll', () => {
        requestParallaxUpdate();
        parallaxTicking = false;
    });
}

// 图片懒加载
function initImageLazyLoading() {
    const images = document.querySelectorAll('img[src]');
    
    if (!images.length) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                img.classList.add('loading');
                
                const newImg = new Image();
                newImg.onload = function() {
                    img.src = this.src;
                    img.classList.remove('loading');
                    img.classList.add('loaded');
                };
                newImg.onerror = function() {
                    img.classList.remove('loading');
                };
                newImg.src = img.src;
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 平滑滚动
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                smoothScrollTo(offsetTop, 1000);
            }
        });
    });
}

// 平滑滚动函数
function smoothScrollTo(target, duration) {
    const start = window.pageYOffset;
    const distance = target - start;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, start, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// 打字机效果
function initTypewriterEffect() {
    const titleLines = document.querySelectorAll('.title-line');
    
    if (!titleLines.length) return;
    
    titleLines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        line.style.opacity = '1';
        
        setTimeout(() => {
            typeWriter(line, text, 0, 50);
        }, index * 1000);
    });
}

function typeWriter(element, text, i, speed) {
    if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(() => typeWriter(element, text, i, speed), speed);
    }
}

// 浮动卡片动画
function initFloatingCards() {
    const cards = document.querySelectorAll('.floating-card');
    
    if (!cards.length) return;
    
    cards.forEach((card, index) => {
        const randomDelay = Math.random() * 2000;
        const randomDuration = 3000 + Math.random() * 2000;
        
        card.style.animationDelay = `${randomDelay}ms`;
        card.style.animationDuration = `${randomDuration}ms`;
        
        card.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
            this.style.transform = '';
        });
        
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}


// 工具函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// 添加图片加载状态样式
function addImageLoadingStates() {
    const style = document.createElement('style');
    style.textContent = `
        img.loading {
            filter: blur(5px);
            opacity: 0.5;
            transition: filter 0.3s ease, opacity 0.3s ease;
        }
        
        img.loaded {
            filter: blur(0);
            opacity: 1;
        }
        
        .modal-overlay .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border-gray);
        }
        
        .modal-overlay h3 {
            color: var(--text-white);
            margin: 0;
        }
        
        .modal-close {
            background: none;
            border: none;
            color: var(--text-gray);
            font-size: 1.5rem;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .modal-close:hover {
            color: var(--primary-orange);
        }
        
        .modal-body p {
            color: var(--text-gray);
            margin-bottom: 1rem;
        }
        
        .url-input {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .url-input input {
            flex: 1;
            padding: 0.8rem;
            background: var(--tertiary-black);
            border: 1px solid var(--border-gray);
            border-radius: 8px;
            color: var(--text-white);
            font-size: 0.9rem;
        }
        
        .url-input input:focus {
            outline: none;
            border-color: var(--primary-orange);
        }
        
        .modal-note {
            font-size: 0.85rem;
            color: var(--text-light-gray);
            font-style: italic;
        }
    `;
    document.head.appendChild(style);
}

// 性能优化
function optimizeForPerformance() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        
        const style = document.createElement('style');
        style.textContent = `
            @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 键盘导航支持
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.querySelector('.modal-overlay');
            if (modal) {
                modal.click();
            }
        }
        
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

// 初始化所有功能
addImageLoadingStates();
optimizeForPerformance();
initKeyboardNavigation();

// 控制台欢迎信息
console.log(`
🎨 Portfolio Website Loaded Successfully!
👋 Hi there! Thanks for checking out the code.
🚀 This portfolio showcases Yanjie Bu's DECO7140 project.
💡 Built with modern web technologies and best practices.
`);

// 初始化图片放大功能
initImageLightbox();

// 图片放大功能
// 增强版图片放大功能
function initImageLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxImageContainer = document.getElementById('lightboxImageContainer');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxReset = document.getElementById('lightboxReset');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxLoading = document.getElementById('lightboxLoading');
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    const zoomFit = document.getElementById('zoomFit');
    const zoomLevel = document.getElementById('zoomLevel');
    const zoomHint = document.getElementById('zoomHint');
    
    let images = [];
    let currentIndex = 0;
    let isOpen = false;
    let currentZoom = 1;
    const minZoom = 0.1;
    const maxZoom = 5;
    const zoomStep = 0.2;
    
    // 拖拽相关
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let imagePosition = { x: 0, y: 0 };
    
    // 初始化图片
    function setupImages() {
        const allImages = document.querySelectorAll('img:not(#lightboxImage)');
        images = [];
        
        allImages.forEach((img, index) => {
            if (img.closest('#lightbox')) return;
            
            img.classList.add('clickable-image');
            
            images.push({
                src: img.src,
                alt: img.alt || '',
                caption: img.getAttribute('data-caption') || img.alt || ''
            });
            
            img.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });
    }
    
    // 打开 lightbox
    function openLightbox(index) {
        currentIndex = index;
        isOpen = true;
        
        showLoading();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        resetView();
        loadImage();
        updateNavigation();
        showZoomHint();
    }
    
    // 关闭 lightbox
    function closeLightbox() {
        isOpen = false;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        resetView();
    }
    
    // 加载图片
    function loadImage() {
        const currentImage = images[currentIndex];
        
        if (currentImage) {
            const img = new Image();
            img.onload = () => {
                lightboxImage.src = currentImage.src;
                lightboxImage.alt = currentImage.alt;
                updateCaption(currentImage.caption);
                updateCounter();
                onImageLoad();
            };
            img.onerror = () => {
                onImageError();
            };
            img.src = currentImage.src;
        }
    }
    
    function onImageLoad() {
        hideLoading();
        fitToScreen();
    }
    
    function onImageError() {
        hideLoading();
        console.error('图片加载失败');
    }
    
    // 缩放图片
    function zoomImage(newZoom) {
        currentZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
        updateImageTransform();
        updateZoomLevel();
        updateZoomButtons();
        
        if (currentZoom > 1) {
            lightboxImageContainer.classList.add('zoomed');
        } else {
            lightboxImageContainer.classList.remove('zoomed');
        }
    }
    
    // 适应屏幕
    function fitToScreen() {
        currentZoom = 1;
        imagePosition = { x: 0, y: 0 };
        updateImageTransform();
        updateZoomLevel();
        updateZoomButtons();
        lightboxImageContainer.classList.remove('zoomed');
    }
    
    // 重置视图
    function resetView() {
        currentZoom = 1;
        imagePosition = { x: 0, y: 0 };
        isDragging = false;
        lightboxImageContainer.classList.remove('zoomed', 'dragging');
        updateImageTransform();
        updateZoomLevel();
        updateZoomButtons();
    }
    
    // 更新图片变换
    function updateImageTransform() {
        const transform = `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${currentZoom})`;
        lightboxImage.style.transform = transform;
    }
    
    // 更新缩放等级显示
    function updateZoomLevel() {
        zoomLevel.textContent = Math.round(currentZoom * 100) + '%';
    }
    
    // 更新缩放按钮状态
    function updateZoomButtons() {
        zoomOut.disabled = currentZoom <= minZoom;
        zoomIn.disabled = currentZoom >= maxZoom;
    }
    
    // 开始拖拽
    function startDrag(e) {
        if (currentZoom <= 1) return;
        
        isDragging = true;
        dragStart = {
            x: e.clientX - imagePosition.x,
            y: e.clientY - imagePosition.y
        };
        lightboxImageContainer.classList.add('dragging');
        e.preventDefault();
    }
    
    // 处理拖拽
    function handleDrag(e) {
        if (!isDragging || currentZoom <= 1) return;
        
        imagePosition = {
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        };
        
        updateImageTransform();
        e.preventDefault();
    }
    
    // 结束拖拽
    function endDrag() {
        isDragging = false;
        lightboxImageContainer.classList.remove('dragging');
    }
    
    // 显示缩放提示
    function showZoomHint() {
        if (isOpen && zoomHint) {
            zoomHint.classList.add('show');
            setTimeout(() => {
                zoomHint.classList.remove('show');
            }, 3000);
        }
    }
    
    // 其他辅助函数
    function showPrevious() {
        if (currentIndex > 0) {
            currentIndex--;
            showLoading();
            resetView();
            loadImage();
            updateNavigation();
        }
    }
    
    function showNext() {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            showLoading();
            resetView();
            loadImage();
            updateNavigation();
        }
    }
    
    function updateCaption(caption) {
        if (caption && caption.trim()) {
            lightboxCaption.textContent = caption;
            lightboxCaption.style.display = 'block';
        } else {
            lightboxCaption.style.display = 'none';
        }
    }
    
    function updateCounter() {
        lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    }
    
    function updateNavigation() {
        lightboxPrev.style.display = currentIndex > 0 ? 'flex' : 'none';
        lightboxNext.style.display = currentIndex < images.length - 1 ? 'flex' : 'none';
        
        if (images.length <= 1) {
            lightboxCounter.style.display = 'none';
        } else {
            lightboxCounter.style.display = 'block';
        }
    }
    
    function showLoading() {
        lightboxLoading.style.display = 'block';
        lightboxImage.style.opacity = '0';
    }
    
    function hideLoading() {
        lightboxLoading.style.display = 'none';
        lightboxImage.style.opacity = '1';
    }
    
    // 绑定所有事件
    function bindEvents() {
        // 基本控制
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxReset.addEventListener('click', resetView);
        
        // 导航
        lightboxPrev.addEventListener('click', showPrevious);
        lightboxNext.addEventListener('click', showNext);
        
        // 缩放控制
        zoomIn.addEventListener('click', () => zoomImage(currentZoom + zoomStep));
        zoomOut.addEventListener('click', () => zoomImage(currentZoom - zoomStep));
        zoomFit.addEventListener('click', fitToScreen);
        
        // 背景点击关闭
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (!isOpen) return;
            
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPrevious();
                    break;
                case 'ArrowRight':
                    showNext();
                    break;
                case '+':
                case '=':
                    zoomImage(currentZoom + zoomStep);
                    break;
                case '-':
                    zoomImage(currentZoom - zoomStep);
                    break;
                case '0':
                    fitToScreen();
                    break;
                case 'r':
                case 'R':
                    resetView();
                    break;
            }
        });
        
        // 鼠标滚轮缩放
        lightboxImageContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
            const newZoom = currentZoom + delta;
            
            // 以鼠标位置为中心缩放
            const rect = lightboxImageContainer.getBoundingClientRect();
            const mouseX = e.clientX - rect.left - rect.width / 2;
            const mouseY = e.clientY - rect.top - rect.height / 2;
            
            const scaleFactor = newZoom / currentZoom;
            
            imagePosition.x = mouseX - (mouseX - imagePosition.x) * scaleFactor;
            imagePosition.y = mouseY - (mouseY - imagePosition.y) * scaleFactor;
            
            zoomImage(newZoom);
        });
        
        // 双击缩放
        lightboxImageContainer.addEventListener('dblclick', (e) => {
            e.preventDefault();
            
            if (currentZoom > 1) {
                fitToScreen();
            } else {
                // 以双击位置为中心放大
                const rect = lightboxImageContainer.getBoundingClientRect();
                const mouseX = e.clientX - rect.left - rect.width / 2;
                const mouseY = e.clientY - rect.top - rect.height / 2;
                
                imagePosition.x = -mouseX;
                imagePosition.y = -mouseY;
                zoomImage(2);
            }
        });
        
        // 拖拽事件
        lightboxImageContainer.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', endDrag);
        
        // 防止拖拽时选择文本
        lightboxImageContainer.addEventListener('selectstart', (e) => e.preventDefault());
        
        // 触摸事件（移动端支持）
        setupTouchEvents();
    }
    
    // 触摸事件设置
    function setupTouchEvents() {
        let touchStartDistance = 0;
        let touchStartZoom = 1;
        
        lightboxImageContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                // 单指拖拽
                startDrag({
                    clientX: e.touches[0].clientX,
                    clientY: e.touches[0].clientY
                });
            } else if (e.touches.length === 2) {
                // 双指缩放
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                touchStartDistance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
                touchStartZoom = currentZoom;
            }
        });
        
        lightboxImageContainer.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                // 单指拖拽
                handleDrag({
                    clientX: e.touches[0].clientX,
                    clientY: e.touches[0].clientY
                });
            } else if (e.touches.length === 2) {
                // 双指缩放
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDistance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
                
                const scale = currentDistance / touchStartDistance;
                const newZoom = Math.max(minZoom, Math.min(maxZoom, touchStartZoom * scale));
                zoomImage(newZoom);
            }
        });
        
        lightboxImageContainer.addEventListener('touchend', endDrag);
    }
    
    // 初始化
    setupImages();
    bindEvents();
    updateNavigation();
}



// 清理并修复Jerry轮播顺序问题

// 首先清除所有可能的定时器
function clearAllCarouselTimers() {
    // 清除所有定时器（暴力方法）
    for (let i = 1; i < 99999; i++) {
        window.clearInterval(i);
    }
    console.log('已清除所有定时器');
}

// 干净的单一轮播函数
function cleanJerryCarousel() {
    console.log('启动干净的Jerry轮播');
    
    // 强制设置样式
    const style = document.createElement('style');
    style.id = 'jerry-carousel-style';
    style.textContent = `
        .hero-visual {
            display: flex !important;
            justify-content: flex-end !important;
            align-items: center !important;
            padding-right: 3% !important;
            padding-top: 60px !important;
        }
        
        .jerry-carousel {
            position: relative !important;
            width: 560px !important;
            height: 380px !important;
            border-radius: 24px !important;
            overflow: hidden !important;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            backdrop-filter: blur(20px) !important;
            margin-right: -20px !important;
        }
        
        .jerry-image {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            border-radius: 23px !important;
            opacity: 0 !important;
            transition: opacity 0.8s ease-in-out !important;
            pointer-events: none !important;
        }
        
        .jerry-image.active {
            opacity: 1 !important;
        }
    `;
    
    // 移除旧样式，添加新样式
    const oldStyle = document.getElementById('jerry-carousel-style');
    if (oldStyle) oldStyle.remove();
    document.head.appendChild(style);
    
    const images = document.querySelectorAll('.jerry-image');
    console.log('找到图片数量:', images.length);
    
    if (images.length === 0) {
        console.error('没有找到jerry-image元素');
        return;
    }
    
    // 打印图片信息
    images.forEach((img, index) => {
        console.log(`图片${index + 1}: ${img.src}`);
    });
    
    let currentIndex = 0;
    
    // 重置所有图片状态
    function resetAllImages() {
        images.forEach((img, index) => {
            img.classList.remove('active');
            img.style.opacity = '0';
            console.log(`重置图片${index + 1}`);
        });
    }
    
    // 显示指定图片
    function showImage(index) {
        resetAllImages();
        if (images[index]) {
            images[index].classList.add('active');
            images[index].style.opacity = '1';
            console.log(`显示图片${index + 1}: ${images[index].src}`);
        }
    }
    
    // 初始显示第一张图片
    showImage(0);
    
    // 轮播函数
    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
        console.log(`轮播到第${currentIndex + 1}张图片`);
    }
    
    // 启动轮播 - 只有一个定时器
    const carouselInterval = setInterval(nextImage, 2500);
    
    // 存储定时器ID，方便调试
    window.jerryCarouselInterval = carouselInterval;
    
    console.log('Jerry轮播启动完成，定时器ID:', carouselInterval);
    
    return carouselInterval;
}

// 完全重启轮播
function restartJerryCarousel() {
    console.log('=== 重启Jerry轮播 ===');
    
    // 1. 清除所有定时器
    clearAllCarouselTimers();
    
    // 2. 等待一下，然后启动新的轮播
    setTimeout(() => {
        cleanJerryCarousel();
    }, 100);
}

// 立即重启
restartJerryCarousel();

// 调试函数
function debugCarousel() {
    const images = document.querySelectorAll('.jerry-image');
    console.log('=== 轮播调试信息 ===');
    console.log('图片总数:', images.length);
    images.forEach((img, index) => {
        console.log(`图片${index + 1}:`, {
            src: img.src,
            opacity: img.style.opacity,
            hasActiveClass: img.classList.contains('active')
        });
    });
    console.log('当前定时器ID:', window.jerryCarouselInterval);
}

// 手动控制函数
function manualNext() {
    const images = document.querySelectorAll('.jerry-image');
    const currentActive = document.querySelector('.jerry-image.active');
    const currentIndex = Array.from(images).indexOf(currentActive);
    const nextIndex = (currentIndex + 1) % images.length;
    
    currentActive.classList.remove('active');
    currentActive.style.opacity = '0';
    
    images[nextIndex].classList.add('active');
    images[nextIndex].style.opacity = '1';
    
    console.log(`手动切换: ${currentIndex + 1} -> ${nextIndex + 1}`);
}

console.log('Jerry轮播控制函数已加载');
console.log('调试命令: debugCarousel()');
console.log('手动切换: manualNext()');
console.log('重启轮播: restartJerryCarousel()');