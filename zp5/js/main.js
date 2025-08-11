// Image Viewer Variables
let currentZoom = 1;
let isDragging = false;
let startX = 0;
let startY = 0;
let translateX = 0;
let translateY = 0;
let currentTranslateX = 0;
let currentTranslateY = 0;

// DOM Elements
const imageViewer = document.getElementById('imageViewer');
const viewerImage = document.getElementById('viewerImage');
const viewerContainer = document.querySelector('.viewer-container');
const closeBtn = document.querySelector('.close-viewer');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const resetZoomBtn = document.getElementById('resetZoom');
const zoomLevelDisplay = document.querySelector('.zoom-level');

// Initialize Image Viewer
function initImageViewer() {
    // Add click event to all clickable images
    document.querySelectorAll('.clickable-image').forEach(img => {
        img.addEventListener('click', function() {
            openImageViewer(this.src, this.alt);
        });
    });

    // Close viewer events
    closeBtn.addEventListener('click', closeImageViewer);
    imageViewer.addEventListener('click', function(e) {
        if (e.target === imageViewer || e.target === viewerContainer) {
            closeImageViewer();
        }
    });

    // Keyboard controls
    document.addEventListener('keydown', function(e) {
        if (imageViewer.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeImageViewer();
                    break;
                case '+':
                case '=':
                    zoomIn();
                    break;
                case '-':
                case '_':
                    zoomOut();
                    break;
                case '0':
                    resetZoom();
                    break;
            }
        }
    });

    // Zoom controls
    zoomInBtn.addEventListener('click', zoomIn);
    zoomOutBtn.addEventListener('click', zoomOut);
    resetZoomBtn.addEventListener('click', resetZoom);

    // Mouse wheel zoom
    viewerContainer.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (e.deltaY < 0) {
            zoomIn();
        } else {
            zoomOut();
        }
    });

    // Drag functionality
    viewerImage.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    // Touch events for mobile
    viewerImage.addEventListener('touchstart', handleTouchStart, {passive: false});
    viewerImage.addEventListener('touchmove', handleTouchMove, {passive: false});
    viewerImage.addEventListener('touchend', handleTouchEnd);

    // Pinch zoom for mobile
    let initialDistance = 0;
    let initialZoom = 1;

    viewerImage.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            initialDistance = getDistance(e.touches[0], e.touches[1]);
            initialZoom = currentZoom;
        }
    });

    viewerImage.addEventListener('touchmove', function(e) {
        if (e.touches.length === 2) {
            e.preventDefault();
            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            const zoomFactor = currentDistance / initialDistance;
            currentZoom = Math.min(Math.max(initialZoom * zoomFactor, 0.5), 5);
            updateZoom();
        }
    });
}

// Open Image Viewer
function openImageViewer(src, alt) {
    viewerImage.src = src;
    viewerImage.alt = alt || 'Enlarged view';
    imageViewer.classList.add('active');
    document.body.style.overflow = 'hidden';
    resetZoom();
}

// Close Image Viewer
function closeImageViewer() {
    imageViewer.classList.remove('active');
    document.body.style.overflow = '';
    resetZoom();
}

// Zoom Functions
function zoomIn() {
    currentZoom = Math.min(currentZoom + 0.25, 5);
    updateZoom();
}

function zoomOut() {
    currentZoom = Math.max(currentZoom - 0.25, 0.5);
    updateZoom();
}

function resetZoom() {
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
    currentTranslateX = 0;
    currentTranslateY = 0;
    updateZoom();
}

function updateZoom() {
    viewerImage.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;
    zoomLevelDisplay.textContent = Math.round(currentZoom * 100) + '%';
}

// Drag Functions
function startDrag(e) {
    if (currentZoom > 1) {
        isDragging = true;
        viewerContainer.classList.add('dragging');
        startX = e.clientX - currentTranslateX;
        startY = e.clientY - currentTranslateY;
        e.preventDefault();
    }
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    currentTranslateX = e.clientX - startX;
    currentTranslateY = e.clientY - startY;
    
    // Apply boundaries
    const maxTranslate = (currentZoom - 1) * 200;
    currentTranslateX = Math.max(-maxTranslate, Math.min(maxTranslate, currentTranslateX));
    currentTranslateY = Math.max(-maxTranslate, Math.min(maxTranslate, currentTranslateY));
    
    translateX = currentTranslateX / currentZoom;
    translateY = currentTranslateY / currentZoom;
    
    updateZoom();
}

function endDrag() {
    isDragging = false;
    viewerContainer.classList.remove('dragging');
}

// Touch Functions
let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(e) {
    if (e.touches.length === 1 && currentZoom > 1) {
        touchStartX = e.touches[0].clientX - currentTranslateX;
        touchStartY = e.touches[0].clientY - currentTranslateY;
        isDragging = true;
    }
}

function handleTouchMove(e) {
    if (e.touches.length === 1 && isDragging) {
        e.preventDefault();
        currentTranslateX = e.touches[0].clientX - touchStartX;
        currentTranslateY = e.touches[0].clientY - touchStartY;
        
        const maxTranslate = (currentZoom - 1) * 200;
        currentTranslateX = Math.max(-maxTranslate, Math.min(maxTranslate, currentTranslateX));
        currentTranslateY = Math.max(-maxTranslate, Math.min(maxTranslate, currentTranslateY));
        
        translateX = currentTranslateX / currentZoom;
        translateY = currentTranslateY / currentZoom;
        
        updateZoom();
    }
}

function handleTouchEnd() {
    isDragging = false;
}

function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Fade In Animation on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Animate Numbers
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(function() {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            element.textContent = end;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Trigger Number Animation
const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numbers = entry.target.querySelectorAll('.stat-number');
            numbers.forEach(num => {
                const target = parseInt(num.getAttribute('data-target'));
                animateValue(num, 0, target, 1500);
            });
            numberObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    numberObserver.observe(heroStats);
}

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'white';
        navLinks.style.flexDirection = 'column';
        navLinks.style.padding = '1rem';
        navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    });
}

// Add hover effect to gallery items
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.zIndex = '';
    });
});

// Parallax Effect for Hero Section (optional)
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < hero.offsetHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initImageViewer();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Performance optimization - lazy load images
    const images = document.querySelectorAll('img');
    const imageOptions = {
        threshold: 0,
        rootMargin: '0px 0px 50px 0px'
    };
    
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    }, imageOptions);
    
    images.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });
});

// Add keyboard navigation for gallery
let currentImageIndex = 0;
const allImages = document.querySelectorAll('.clickable-image');