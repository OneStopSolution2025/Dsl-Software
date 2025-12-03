
/**
 * RapidReportz Premium Landing Page
 * JavaScript - Interactivity & Smooth Scrolling
 */

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Storytelling Video Controls
const storytellingVideo = document.getElementById('storytellingVideo');
const playPauseBtn = document.getElementById('playPauseBtn');
const storytellingSection = document.querySelector('.storytelling-video');

if (storytellingVideo && playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
        if (storytellingVideo.paused) {
            storytellingVideo.play();
            storytellingSection.classList.add('playing');
            playPauseBtn.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
        } else {
            storytellingVideo.pause();
            storytellingSection.classList.remove('playing');
            playPauseBtn.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
        }
    });

    storytellingVideo.addEventListener('play', () => {
        storytellingSection.classList.add('playing');
    });

    storytellingVideo.addEventListener('pause', () => {
        storytellingSection.classList.remove('playing');
    });
}

// Demo Video Player Functionality
const playButton = document.getElementById('playButton');
const videoOverlay = document.getElementById('videoOverlay');
const demoVideo = document.getElementById('demoVideo');

if (playButton && videoOverlay && demoVideo) {
    playButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        videoOverlay.classList.add('hidden');
        demoVideo.play();
    });

    videoOverlay.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        videoOverlay.classList.add('hidden');
        demoVideo.play();
    });

    demoVideo.addEventListener('play', () => {
        videoOverlay.classList.add('hidden');
    });

    demoVideo.addEventListener('pause', () => {
        videoOverlay.classList.remove('hidden');
    });

    demoVideo.addEventListener('ended', () => {
        videoOverlay.classList.remove('hidden');
    });
}

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when a link is clicked
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// Smooth scroll to section
function scrollToSection(sectionId) {
    // Close mobile menu if open
    menuToggle.classList.remove('active');
    mobileMenu.classList.remove('active');

    if (sectionId === 'features') {
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
    } else if (sectionId === 'pricing') {
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.feature-card, .benefit-card, .pricing-card, .integration-card, .feature-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Scroll event for header shadow
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 0) {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
});

// Smooth scroll behavior for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add scroll animations to sections
const sections = document.querySelectorAll('section');
sections.forEach((section, index) => {
    section.style.opacity = '0';
    section.style.animation = `fadeInUp 0.8s ease-out ${index * 0.1}s forwards`;
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Button hover effects with ripple
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });

    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => imageObserver.observe(img));
}

// Smooth scroll on page load if there's a hash
window.addEventListener('load', () => {
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu on Escape
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
});

// Performance optimization: Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
        // Scroll event handler
    });
}, { passive: true });

// Add touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swiped left
    }
    if (touchEndX > touchStartX + 50) {
        // Swiped right
    }
}

// Add focus management for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Prevent layout shift from scrollbar
const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
if (scrollbarWidth > 0) {
    document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth + 'px');
}

// Add smooth transitions for theme changes
window.addEventListener('load', () => {
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
});

// Log page load time
window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log('Page load time: ' + pageLoadTime + 'ms');
});
