/**
 * Landing Page Slider and Carousel Functions
 * Handles hero slider, carousels, and interactive sections
 */

class HeroSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = [
            {
                title: 'اكتشف أحدث الموضات',
                description: 'تسوق أفضل الملابس والإكسسوارات بأسعار مميزة',
                image: '🛍️',
                color1: '#B8860B',
                color2: '#D8BFD8'
            },
            {
                title: 'خصومات حصرية',
                description: 'احصل على خصم يصل إلى 50% على منتجات مختارة',
                image: '🎉',
                color1: '#D8BFD8',
                color2: '#B8860B'
            },
            {
                title: 'شحن سريع وآمن',
                description: 'توصيل إلى جميع أنحاء مصر والدول العربية',
                image: '🚚',
                color1: '#B8860B',
                color2: '#E6E6FA'
            }
        ];
        this.autoPlayInterval = null;
        this.init();
    }

    init() {
        this.createSlider();
        this.attachEventListeners();
        this.startAutoPlay();
    }

    createSlider() {
        const sliderContainer = document.querySelector('.slider-container');
        if (!sliderContainer) return;

        sliderContainer.innerHTML = this.slides.map((slide, index) => `
            <div class="slider-item ${index === 0 ? 'active' : ''}">
                <div class="slider-content">
                    <div class="slider-text">
                        <h2>${slide.title}</h2>
                        <p>${slide.description}</p>
                        <a href="../pages/shop.html" class="btn btn-primary" style="display: inline-block; padding: 12px 24px; background: white; color: ${slide.color1}; text-decoration: none; border-radius: 8px; font-weight: bold;">
                            تسوق الآن
                        </a>
                    </div>
                    <div class="slider-image" style="font-size: 100px;">
                        ${slide.image}
                    </div>
                </div>
            </div>
        `).join('');

        // Create dots
        const dotsContainer = document.querySelector('.slider-controls');
        if (dotsContainer) {
            dotsContainer.innerHTML = this.slides.map((_, index) => `
                <div class="slider-dot ${index === 0 ? 'active' : ''}" onclick="heroSlider.goToSlide(${index})"></div>
            `).join('') + `
                <button class="slider-arrow prev" onclick="heroSlider.prevSlide()">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <button class="slider-arrow next" onclick="heroSlider.nextSlide()">
                    <i class="fas fa-chevron-left"></i>
                </button>
            `;
        }
    }

    attachEventListeners() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.nextSlide();
            if (e.key === 'ArrowRight') this.prevSlide();
        });

        // Pause on hover
        const slider = document.querySelector('.hero-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => this.stopAutoPlay());
            slider.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }

    showSlide(index) {
        const slides = document.querySelectorAll('.slider-item');
        const dots = document.querySelectorAll('.slider-dot');

        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');

        this.currentSlide = index;
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }

    goToSlide(index) {
        this.showSlide(index);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
}

class Carousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentPosition = 0;
        this.itemWidth = 0;
        this.visibleItems = 4;
        this.init();
    }

    init() {
        if (!this.container) return;
        
        this.calculateDimensions();
        this.attachEventListeners();
        window.addEventListener('resize', () => this.calculateDimensions());
    }

    calculateDimensions() {
        const wrapper = this.container.querySelector('.carousel-wrapper');
        if (!wrapper) return;

        const items = wrapper.querySelectorAll('.carousel-item');
        if (items.length === 0) return;

        const containerWidth = this.container.offsetWidth;
        this.itemWidth = containerWidth / this.visibleItems;

        // Adjust visible items based on screen size
        if (window.innerWidth <= 768) {
            this.visibleItems = 2;
        } else if (window.innerWidth <= 1024) {
            this.visibleItems = 3;
        } else {
            this.visibleItems = 4;
        }
    }

    attachEventListeners() {
        const controls = this.container.querySelector('.carousel-controls');
        if (!controls) return;

        const prevBtn = controls.querySelector('.carousel-btn:first-child');
        const nextBtn = controls.querySelector('.carousel-btn:last-child');

        if (prevBtn) prevBtn.addEventListener('click', () => this.scroll('prev'));
        if (nextBtn) nextBtn.addEventListener('click', () => this.scroll('next'));
    }

    scroll(direction) {
        const wrapper = this.container.querySelector('.carousel-wrapper');
        if (!wrapper) return;

        const items = wrapper.querySelectorAll('.carousel-item');
        const itemWidth = items[0].offsetWidth + 24; // 24px gap
        const maxScroll = items.length * itemWidth - this.container.offsetWidth;

        if (direction === 'next') {
            this.currentPosition = Math.min(this.currentPosition + itemWidth, maxScroll);
        } else {
            this.currentPosition = Math.max(this.currentPosition - itemWidth, 0);
        }

        wrapper.style.transform = `translateX(-${this.currentPosition}px)`;
    }
}

class ProductCarousel {
    constructor() {
        this.init();
    }

    init() {
        // Initialize all carousels
        const carousels = document.querySelectorAll('[data-carousel]');
        carousels.forEach(carousel => {
            new Carousel(carousel.id);
        });
    }
}

// Testimonials Carousel
class TestimonialsCarousel {
    constructor() {
        this.testimonials = [
            {
                name: 'أحمد محمد',
                role: 'عميل دائم',
                text: 'متجر رائع جداً! المنتجات أصلية والخدمة ممتازة. سأشتري منهم مرة أخرى.',
                rating: 5
            },
            {
                name: 'فاطمة علي',
                role: 'عميلة جديدة',
                text: 'تجربة تسوق رائعة! الشحن سريع والمنتج وصل بحالة ممتازة.',
                rating: 5
            },
            {
                name: 'محمود حسن',
                role: 'عميل دائم',
                text: 'أفضل متجر للملابس والإكسسوارات. الأسعار منافسة والجودة عالية.',
                rating: 4
            },
            {
                name: 'سارة محمود',
                role: 'عميلة',
                text: 'موقع سهل الاستخدام وخدمة عملاء رائعة. أنصح به بشدة.',
                rating: 5
            }
        ];
        this.init();
    }

    init() {
        this.renderTestimonials();
    }

    renderTestimonials() {
        const container = document.getElementById('testimonialsContainer');
        if (!container) return;

        container.innerHTML = this.testimonials.map(testimonial => `
            <div class="testimonial-card">
                <div class="testimonial-stars">
                    ${Array.from({length: 5}, (_, i) => 
                        `<span class="testimonial-star ${i < testimonial.rating ? '' : 'empty'}">★</span>`
                    ).join('')}
                </div>
                <p class="testimonial-text">"${testimonial.text}"</p>
                <div class="testimonial-author">${testimonial.name}</div>
                <div class="testimonial-role">${testimonial.role}</div>
            </div>
        `).join('');
    }
}

// Newsletter Subscription
class NewsletterSubscription {
    constructor() {
        this.init();
    }

    init() {
        const form = document.querySelector('.newsletter-form');
        if (!form) return;

        const btn = form.querySelector('.newsletter-btn');
        if (btn) {
            btn.addEventListener('click', (e) => this.subscribe(e));
        }
    }

    subscribe(event) {
        event.preventDefault();
        
        const input = document.querySelector('.newsletter-input');
        const email = input.value.trim();

        if (!email) {
            alert('الرجاء إدخال بريدك الإلكتروني');
            return;
        }

        if (!this.isValidEmail(email)) {
            alert('الرجاء إدخال بريد إلكتروني صحيح');
            return;
        }

        // In production, this would be sent to Firebase or a backend service
        this.showSuccess();
        input.value = '';
    }

    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    showSuccess() {
        const toast = document.createElement('div');
        toast.textContent = 'شكراً لاشتراكك! سيتم إرسال العروض الحصرية إلى بريدك الإلكتروني.';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            animation: slideUp 0.3s ease-out;
            font-weight: 500;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize hero slider
    window.heroSlider = new HeroSlider();

    // Initialize carousels
    new ProductCarousel();

    // Initialize testimonials
    new TestimonialsCarousel();

    // Initialize newsletter
    new NewsletterSubscription();

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
