/**
 * Product Detail Page JavaScript
 * Handles product display, variant selection, reviews, and similar products
 */

class ProductDetailPage {
    constructor() {
        this.productId = this.getProductIdFromURL();
        this.product = null;
        this.selectedSize = null;
        this.selectedColor = null;
        this.selectedRating = 0;
        this.quantity = 1;
        
        this.init();
    }

    init() {
        this.loadProduct();
        this.attachEventListeners();
        this.loadReviews();
        this.loadSimilarProducts();
    }

    getProductIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id') || 1;
    }

    loadProduct() {
        // Sample product data - in production, this would come from Firebase
        const products = {
            1: {
                id: 1,
                name: 'تيشيرت كلاسيك أسود',
                category: 'تيشيرتات',
                price: 150,
                originalPrice: 200,
                image: 'https://via.placeholder.com/500x500?text=T-Shirt+Black',
                images: [
                    'https://via.placeholder.com/500x500?text=T-Shirt+Black+1',
                    'https://via.placeholder.com/500x500?text=T-Shirt+Black+2',
                    'https://via.placeholder.com/500x500?text=T-Shirt+Black+3',
                    'https://via.placeholder.com/500x500?text=T-Shirt+Black+4'
                ],
                sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
                colors: [
                    { name: 'أسود', hex: '#000000' },
                    { name: 'أبيض', hex: '#FFFFFF' },
                    { name: 'أحمر', hex: '#FF0000' }
                ],
                rating: 4.5,
                reviewCount: 128,
                stock: 45,
                description: `
                    <h4>وصف المنتج</h4>
                    <p>تيشيرت كلاسيكي مريح وعملي مصنوع من أفضل أنواع القطن. يتميز بتصميم بسيط وأنيق يناسب جميع الفئات العمرية.</p>
                    
                    <h4>المميزات</h4>
                    <ul>
                        <li>مصنوع من 100% قطن عالي الجودة</li>
                        <li>تصميم مريح وخفيف الوزن</li>
                        <li>متوفر بعدة ألوان وأحجام</li>
                        <li>سهل التنظيف والعناية</li>
                        <li>مناسب للارتداء اليومي والرياضة</li>
                    </ul>
                    
                    <h4>طريقة العناية</h4>
                    <ul>
                        <li>اغسل بماء بارد مع ألوان مشابهة</li>
                        <li>لا تستخدم مواد تبييض</li>
                        <li>جفف في الهواء الطلق</li>
                        <li>كوي بحرارة منخفضة إذا لزم الأمر</li>
                    </ul>
                `,
                soldCount: 500
            }
        };

        this.product = products[this.productId] || products[1];
        this.renderProduct();
    }

    renderProduct() {
        // Update breadcrumb
        document.getElementById('breadcrumbProduct').textContent = this.product.name;

        // Update product info
        document.getElementById('productCategory').textContent = this.product.category;
        document.getElementById('productTitle').textContent = this.product.name;
        document.getElementById('productPrice').textContent = `${this.product.price} ج.م`;
        document.getElementById('productRating').textContent = this.product.rating;
        document.getElementById('reviewCount').textContent = this.product.reviewCount;

        // Update price section
        if (this.product.originalPrice) {
            document.getElementById('originalPriceContainer').style.display = 'flex';
            document.getElementById('productOriginalPrice').textContent = `${this.product.originalPrice} ج.م`;
            const discount = Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
            document.getElementById('discountBadge').textContent = `-${discount}%`;
        }

        // Update stock status
        const stockStatus = this.product.stock > 10 ? 'متوفر' : 
                           this.product.stock > 0 ? 'متوفر (كمية محدودة)' : 'غير متوفر';
        const stockClass = this.product.stock > 10 ? 'stock-available' : 
                          this.product.stock > 0 ? 'stock-low' : 'stock-unavailable';
        document.getElementById('stockStatus').innerHTML = `<span class="${stockClass}">${stockStatus}</span>`;

        // Update main image
        document.getElementById('mainImage').src = this.product.image;

        // Render thumbnails
        this.renderThumbnails();

        // Render size options
        this.renderSizeOptions();

        // Render color options
        this.renderColorOptions();

        // Update description
        document.getElementById('descriptionContent').innerHTML = this.product.description;

        // Update rating stars
        this.updateRatingStars();
    }

    renderThumbnails() {
        const gallery = document.getElementById('thumbnailGallery');
        gallery.innerHTML = this.product.images.map((image, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="productDetail.selectThumbnail(${index})">
                <img src="${image}" alt="صورة ${index + 1}">
            </div>
        `).join('');
    }

    selectThumbnail(index) {
        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
        document.getElementById('mainImage').src = this.product.images[index];
    }

    renderSizeOptions() {
        const container = document.getElementById('sizeOptions');
        container.innerHTML = this.product.sizes.map(size => `
            <button class="size-option" onclick="productDetail.selectSize('${size}')">${size}</button>
        `).join('');
    }

    selectSize(size) {
        document.querySelectorAll('.size-option').forEach(btn => {
            btn.classList.toggle('active', btn.textContent === size);
        });
        this.selectedSize = size;
    }

    renderColorOptions() {
        const container = document.getElementById('colorOptions');
        container.innerHTML = this.product.colors.map(color => `
            <button class="color-option" 
                    style="background-color: ${color.hex};" 
                    onclick="productDetail.selectColor('${color.name}')"
                    title="${color.name}">
            </button>
        `).join('');
    }

    selectColor(color) {
        document.querySelectorAll('.color-option').forEach(btn => {
            btn.classList.toggle('active', btn.title === color);
        });
        this.selectedColor = color;
    }

    updateRatingStars() {
        const rating = this.product.rating;
        const stars = document.querySelectorAll('#productStars .star');
        stars.forEach((star, index) => {
            if (index < Math.floor(rating)) {
                star.classList.remove('empty');
            } else {
                star.classList.add('empty');
            }
        });
    }

    attachEventListeners() {
        // Star rating for reviews
        document.querySelectorAll('#starRating i').forEach(star => {
            star.addEventListener('click', (e) => this.selectReviewRating(e));
            star.addEventListener('mouseover', (e) => this.hoverReviewRating(e));
            star.addEventListener('mouseout', () => this.resetReviewRating());
        });

        // Wishlist button
        document.getElementById('wishlistBtn').addEventListener('click', () => this.toggleWishlist());
    }

    selectReviewRating(event) {
        this.selectedRating = parseInt(event.target.dataset.rating);
        this.updateReviewStars();
    }

    hoverReviewRating(event) {
        const rating = parseInt(event.target.dataset.rating);
        document.querySelectorAll('#starRating i').forEach((star, index) => {
            if (index < rating) {
                star.classList.add('fas');
                star.classList.remove('far');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    }

    resetReviewRating() {
        this.updateReviewStars();
    }

    updateReviewStars() {
        document.querySelectorAll('#starRating i').forEach((star, index) => {
            if (index < this.selectedRating) {
                star.classList.add('fas');
                star.classList.remove('far');
                star.style.color = 'var(--warning)';
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
                star.style.color = 'var(--gray-light)';
            }
        });
    }

    toggleWishlist() {
        const btn = document.getElementById('wishlistBtn');
        btn.classList.toggle('active');
        
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        if (btn.classList.contains('active')) {
            if (!wishlist.includes(this.productId)) {
                wishlist.push(this.productId);
            }
            this.showToast('تم إضافة المنتج إلى المفضلة ♥');
        } else {
            wishlist = wishlist.filter(id => id !== this.productId);
            this.showToast('تم حذف المنتج من المفضلة');
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    loadReviews() {
        // Sample reviews
        const reviews = [
            {
                author: 'أحمد محمد',
                rating: 5,
                date: '2024-01-15',
                text: 'منتج رائع جداً! الجودة عالية والسعر مناسب. سأشتري منه مرة أخرى.'
            },
            {
                author: 'فاطمة علي',
                rating: 4,
                date: '2024-01-10',
                text: 'جيد جداً، لكن الشحن استغرق وقتاً أطول من المتوقع.'
            },
            {
                author: 'محمود حسن',
                rating: 5,
                date: '2024-01-05',
                text: 'ممتاز! المنتج كما هو موصوف تماماً. أنصح به بشدة.'
            }
        ];

        const reviewsList = document.getElementById('reviewsList');
        reviewsList.innerHTML = reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="review-author">${review.author}</div>
                    <div class="review-date">${this.formatDate(review.date)}</div>
                </div>
                <div class="review-rating">
                    ${Array.from({length: 5}, (_, i) => 
                        `<span class="star ${i < review.rating ? '' : 'empty'}">★</span>`
                    ).join('')}
                </div>
                <div class="review-text">${review.text}</div>
            </div>
        `).join('');
    }

    loadSimilarProducts() {
        // Sample similar products
        const similarProducts = [
            {
                id: 2,
                name: 'تيشيرت رياضي أزرق',
                price: 120,
                image: 'https://via.placeholder.com/200x200?text=T-Shirt+Blue',
                rating: 4.3,
                reviewCount: 95
            },
            {
                id: 3,
                name: 'تيشيرت طباعة أحمر',
                price: 180,
                image: 'https://via.placeholder.com/200x200?text=T-Shirt+Red',
                rating: 4.7,
                reviewCount: 142
            },
            {
                id: 4,
                name: 'تيشيرت أبيض كلاسيك',
                price: 140,
                image: 'https://via.placeholder.com/200x200?text=T-Shirt+White',
                rating: 4.6,
                reviewCount: 118
            }
        ];

        const container = document.getElementById('similarProducts');
        container.innerHTML = similarProducts.map(product => createProductCardHTML(product)).join('');

        container.querySelectorAll('.product-card-advanced').forEach(card => {
            new ProductCard(card);
        });
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ar-EG', options);
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary);
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

// Global functions
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

function increaseQuantity() {
    const input = document.getElementById('quantityInput');
    input.value = parseInt(input.value) + 1;
    productDetail.quantity = parseInt(input.value);
}

function decreaseQuantity() {
    const input = document.getElementById('quantityInput');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        productDetail.quantity = parseInt(input.value);
    }
}

function addToCart() {
    if (!productDetail.selectedSize) {
        alert('الرجاء اختيار حجم المنتج');
        return;
    }

    const cartItem = {
        id: productDetail.product.id,
        name: productDetail.product.name,
        price: productDetail.product.price,
        size: productDetail.selectedSize,
        color: productDetail.selectedColor || productDetail.product.colors[0].name,
        image: productDetail.product.image,
        quantity: productDetail.quantity
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => 
        item.id === cartItem.id && 
        item.size === cartItem.size && 
        item.color === cartItem.color
    );

    if (existingItem) {
        existingItem.quantity += cartItem.quantity;
    } else {
        cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    productDetail.showToast(`تم إضافة ${cartItem.quantity} من المنتج إلى السلة ✓`);
    
    // Reset quantity
    document.getElementById('quantityInput').value = 1;
    productDetail.quantity = 1;
}

function submitReview() {
    const comment = document.getElementById('reviewComment').value;
    
    if (!productDetail.selectedRating) {
        alert('الرجاء اختيار تقييم');
        return;
    }
    
    if (!comment.trim()) {
        alert('الرجاء كتابة تعليق');
        return;
    }

    // In production, this would be sent to Firebase
    productDetail.showToast('شكراً لتقييمك! سيتم عرضه بعد المراجعة.');
    
    // Reset form
    document.getElementById('reviewComment').value = '';
    productDetail.selectedRating = 0;
    productDetail.updateReviewStars();
}

// Initialize product detail page
let productDetail;
document.addEventListener('DOMContentLoaded', function() {
    productDetail = new ProductDetailPage();
});
