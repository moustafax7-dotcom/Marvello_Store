// Animations Module - تأثيرات الحركة والانتقالات

// Back to Top Button
class BackToTopButton {
    constructor() {
        this.button = null;
        this.init();
    }
    
    init() {
        this.createButton();
        this.setupEventListeners();
    }
    
    createButton() {
        this.button = document.createElement('button');
        this.button.id = 'backToTop';
        this.button.className = 'back-to-top';
        this.button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        this.button.title = 'العودة للأعلى';
        document.body.appendChild(this.button);
        
        // إضافة الأنماط
        this.addStyles();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .back-to-top {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                background: var(--primary);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: none;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                z-index: 999;
                transition: all 0.3s ease-in-out;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            .back-to-top.show {
                display: flex;
                animation: slideUp 0.3s ease-in-out;
            }
            
            .back-to-top:hover {
                background: var(--primary-dark);
                transform: translateY(-5px);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
            }
            
            .back-to-top:active {
                transform: translateY(0);
            }
            
            @media (max-width: 768px) {
                .back-to-top {
                    width: 45px;
                    height: 45px;
                    bottom: 20px;
                    right: 20px;
                    font-size: 18px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setupEventListeners() {
        window.addEventListener('scroll', () => this.toggleButton());
        this.button.addEventListener('click', () => this.scrollToTop());
    }
    
    toggleButton() {
        if (window.pageYOffset > 300) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Scroll Animations (Intersection Observer)
class ScrollAnimations {
    constructor() {
        this.options = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        this.observer = new IntersectionObserver((entries) => this.handleIntersection(entries), this.options);
        this.init();
    }
    
    init() {
        // مراقبة جميع العناصر التي لها فئة animate-on-scroll
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => this.observer.observe(el));
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // إيقاف مراقبة العنصر بعد ظهوره
                this.observer.unobserve(entry.target);
            }
        });
    }
    
    observe(element) {
        if (element) {
            this.observer.observe(element);
        }
    }
}

// Page Loading Animation
class PageLoader {
    constructor() {
        this.loader = null;
        this.init();
    }
    
    init() {
        this.createLoader();
        this.setupEventListeners();
    }
    
    createLoader() {
        this.loader = document.createElement('div');
        this.loader.id = 'pageLoader';
        this.loader.className = 'page-loader';
        this.loader.innerHTML = `
            <div class="loader-content">
                <div class="spinner"></div>
                <p>جاري التحميل...</p>
            </div>
        `;
        document.body.appendChild(this.loader);
        
        // إضافة الأنماط
        this.addStyles();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .page-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                transition: opacity 0.3s ease-in-out;
            }
            
            .page-loader.hidden {
                opacity: 0;
                pointer-events: none;
            }
            
            .loader-content {
                text-align: center;
            }
            
            .spinner {
                width: 50px;
                height: 50px;
                border: 4px solid var(--gray-light);
                border-top-color: var(--primary);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            
            .loader-content p {
                color: var(--dark);
                font-family: var(--font-family-primary);
                font-size: var(--font-size-lg);
                margin: 0;
            }
            
            [data-theme="dark"] .page-loader {
                background: rgba(30, 30, 30, 0.95);
            }
            
            [data-theme="dark"] .loader-content p {
                color: var(--gray-dark);
            }
        `;
        document.head.appendChild(style);
    }
    
    setupEventListeners() {
        window.addEventListener('load', () => this.hide());
    }
    
    show() {
        this.loader.classList.remove('hidden');
    }
    
    hide() {
        setTimeout(() => {
            this.loader.classList.add('hidden');
        }, 500);
    }
}

// Smooth Scroll
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleClick(e));
        });
    }
    
    handleClick(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Parallax Effect
class ParallaxEffect {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        this.elements = document.querySelectorAll('[data-parallax]');
        if (this.elements.length > 0) {
            window.addEventListener('scroll', () => this.update());
        }
    }
    
    update() {
        this.elements.forEach(el => {
            const speed = el.getAttribute('data-parallax') || 0.5;
            const yPos = window.pageYOffset * speed;
            el.style.backgroundPosition = `center ${yPos}px`;
        });
    }
}

// Fade In on Scroll
class FadeInOnScroll {
    constructor() {
        this.init();
    }
    
    init() {
        const elements = document.querySelectorAll('[data-fade-in]');
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease-in-out';
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(el => observer.observe(el));
    }
}

// Hover Effects
class HoverEffects {
    constructor() {
        this.init();
    }
    
    init() {
        this.addCardHoverEffect();
        this.addButtonHoverEffect();
    }
    
    addCardHoverEffect() {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-6px)';
                card.style.boxShadow = '0 20px 30px rgba(0, 0, 0, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'var(--shadow-md)';
            });
        });
    }
    
    addButtonHoverEffect() {
        const buttons = document.querySelectorAll('button, .btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
            });
        });
    }
}

// Initialize All Animations
document.addEventListener('DOMContentLoaded', () => {
    new BackToTopButton();
    new ScrollAnimations();
    new PageLoader();
    new SmoothScroll();
    new ParallaxEffect();
    new FadeInOnScroll();
    new HoverEffects();
});

// دالة مساعدة لإضافة animation على عنصر معين
function addAnimationToElement(element, animationName, duration = 0.3) {
    if (!element) return;
    
    element.style.animation = `${animationName} ${duration}s ease-in-out`;
    
    element.addEventListener('animationend', () => {
        element.style.animation = '';
    }, { once: true });
}

// دالة مساعدة لإضافة fade in effect
function fadeInElement(element, duration = 0.3) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}s ease-in-out`;
    
    setTimeout(() => {
        element.style.opacity = '1';
    }, 10);
}

// دالة مساعدة لإضافة slide effect
function slideElement(element, direction = 'up', duration = 0.3) {
    const directions = {
        'up': 'slideUp',
        'down': 'slideDown',
        'left': 'slideLeft',
        'right': 'slideRight'
    };
    
    addAnimationToElement(element, directions[direction] || 'slideUp', duration);
}
