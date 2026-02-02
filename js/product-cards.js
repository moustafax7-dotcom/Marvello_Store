/**
 * Advanced Product Card Functions
 * Handles product card interactions, variant selection, and quick actions
 */

class ProductCard {
    constructor(productElement) {
        this.element = productElement;
        this.productId = productElement.dataset.productId;
        this.selectedSize = null;
        this.selectedColor = null;
        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Size selection
        const sizeOptions = this.element.querySelectorAll('.size-option');
        sizeOptions.forEach(option => {
            option.addEventListener('click', (e) => this.selectSize(e));
        });

        // Color selection
        const colorOptions = this.element.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', (e) => this.selectColor(e));
        });

        // Quick add to cart
        const quickAddBtn = this.element.querySelector('.quick-add-btn');
        if (quickAddBtn) {
            quickAddBtn.addEventListener('click', (e) => this.quickAddToCart(e));
        }

        // Quick view
        const quickViewBtn = this.element.querySelector('.quick-view-btn');
        if (quickViewBtn) {
            quickViewBtn.addEventListener('click', (e) => this.quickView(e));
        }

        // Add to cart button
        const addToCartBtn = this.element.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => this.addToCart(e));
        }

        // Wishlist button
        const wishlistBtn = this.element.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', (e) => this.toggleWishlist(e));
        }
    }

    selectSize(event) {
        const option = event.target;
        const container = option.closest('.variant-selector');
        
        // Remove active class from all size options
        container.querySelectorAll('.size-option').forEach(opt => {
            opt.classList.remove('active');
        });
        
        // Add active class to selected option
        option.classList.add('active');
        this.selectedSize = option.dataset.size;
        
        // Update visual feedback
        this.updateVariantDisplay();
    }

    selectColor(event) {
        const option = event.target;
        const container = option.closest('.variant-selector');
        
        // Remove active class from all color options
        container.querySelectorAll('.color-option').forEach(opt => {
            opt.classList.remove('active');
        });
        
        // Add active class to selected option
        option.classList.add('active');
        this.selectedColor = option.dataset.color;
        
        // Update visual feedback
        this.updateVariantDisplay();
    }

    updateVariantDisplay() {
        // Update product image based on selected variant
        const productImage = this.element.querySelector('.product-image');
        if (this.selectedColor && productImage.dataset.images) {
            const images = JSON.parse(productImage.dataset.images);
            if (images[this.selectedColor]) {
                productImage.src = images[this.selectedColor];
            }
        }
    }

    quickAddToCart(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const productData = {
            id: this.productId,
            name: this.element.querySelector('.product-name-advanced').textContent,
            price: this.element.querySelector('.product-price').textContent,
            size: this.selectedSize,
            color: this.selectedColor,
            image: this.element.querySelector('.product-image').src,
            quantity: 1
        };

        // Add to cart (integrate with your cart system)
        this.addProductToCart(productData);
        
        // Show feedback
        this.showAddedFeedback();
    }

    quickView(event) {
        event.preventDefault();
        event.stopPropagation();
        
        // Navigate to product details page
        window.location.href = `/pages/product-details.html?id=${this.productId}`;
    }

    addToCart(event) {
        event.preventDefault();
        
        if (!this.selectedSize) {
            alert('الرجاء اختيار حجم المنتج');
            return;
        }

        const productData = {
            id: this.productId,
            name: this.element.querySelector('.product-name-advanced').textContent,
            price: this.element.querySelector('.product-price').textContent,
            size: this.selectedSize,
            color: this.selectedColor,
            image: this.element.querySelector('.product-image').src,
            quantity: 1
        };

        this.addProductToCart(productData);
        this.showAddedFeedback();
    }

    addProductToCart(productData) {
        // Get existing cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product with same variants already exists
        const existingItem = cart.find(item => 
            item.id === productData.id && 
            item.size === productData.size && 
            item.color === productData.color
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(productData);
        }

        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Dispatch custom event for cart update
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    }

    showAddedFeedback() {
        // Add animation
        this.element.classList.add('added');
        
        // Show toast notification
        this.showToast('تم إضافة المنتج إلى السلة بنجاح ✓');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            this.element.classList.remove('added');
        }, 600);
    }

    toggleWishlist(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const btn = event.target.closest('.wishlist-btn');
        btn.classList.toggle('active');
        
        // Get wishlist from localStorage
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        if (btn.classList.contains('active')) {
            // Add to wishlist
            if (!wishlist.includes(this.productId)) {
                wishlist.push(this.productId);
            }
            this.showToast('تم إضافة المنتج إلى المفضلة ♥');
        } else {
            // Remove from wishlist
            wishlist = wishlist.filter(id => id !== this.productId);
            this.showToast('تم حذف المنتج من المفضلة');
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    showToast(message) {
        // Create toast element
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
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

/**
 * Initialize all product cards on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card-advanced');
    productCards.forEach(card => {
        new ProductCard(card);
    });
});

/**
 * Handle dynamic product card loading
 */
function initializeProductCard(element) {
    new ProductCard(element);
}

/**
 * Create product card HTML from data
 */
function createProductCardHTML(product) {
    const discountPercent = product.originalPrice ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    const rating = product.rating || 4.5;
    const reviewCount = product.reviewCount || 0;
    const stockStatus = product.stock > 10 ? 'متوفر' : 
                       product.stock > 0 ? 'متوفر (كمية محدودة)' : 'غير متوفر';
    const stockClass = product.stock > 10 ? 'stock-available' : 
                      product.stock > 0 ? 'stock-low' : 'stock-unavailable';
    
    const badge = product.badge ? `<div class="product-badge badge-${product.badge.type}">${product.badge.text}</div>` : '';
    
    const sizes = product.sizes ? product.sizes.map(size => 
        `<button class="size-option" data-size="${size}">${size}</button>`
    ).join('') : '';
    
    const colors = product.colors ? product.colors.map(color => 
        `<button class="color-option" data-color="${color.name}" style="background-color: ${color.hex};" title="${color.name}"></button>`
    ).join('') : '';
    
    const starsHTML = Array.from({length: 5}, (_, i) => 
        `<span class="star ${i < Math.floor(rating) ? '' : 'empty'}">★</span>`
    ).join('');
    
    return `
        <div class="product-card-advanced" data-product-id="${product.id}">
            <div class="product-image-container">
                <div class="product-image-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="product-image" data-images='${JSON.stringify(product.images || {})}'>
                </div>
                ${badge}
                <button class="wishlist-btn" title="إضافة إلى المفضلة">
                    <i class="far fa-heart"></i>
                </button>
                <div class="quick-actions">
                    <button class="quick-action-btn quick-add-btn">
                        <i class="fas fa-shopping-cart"></i>
                        <span>إضافة سريعة</span>
                    </button>
                    <button class="quick-action-btn quick-view-btn">
                        <i class="fas fa-eye"></i>
                        <span>عرض</span>
                    </button>
                </div>
            </div>
            
            <div class="product-info-advanced">
                <div class="product-category">${product.category || 'ملابس'}</div>
                <h3 class="product-name-advanced">${product.name}</h3>
                
                <div class="product-rating">
                    <div class="stars">${starsHTML}</div>
                    <span class="rating-count">(${reviewCount})</span>
                </div>
                
                ${sizes ? `
                    <div class="product-variants">
                        <div class="variant-selector">
                            <label class="variant-label">الحجم</label>
                            <div style="display: flex; gap: 4px;">
                                ${sizes}
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                ${colors ? `
                    <div class="product-variants">
                        <div class="variant-selector">
                            <label class="variant-label">اللون</label>
                            <div style="display: flex; gap: 4px;">
                                ${colors}
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <div class="product-price-section">
                    <span class="product-price">${product.price} ج.م</span>
                    ${product.originalPrice ? `
                        <span class="product-original-price">${product.originalPrice} ج.م</span>
                        <span class="product-discount">-${discountPercent}%</span>
                    ` : ''}
                </div>
                
                <div class="stock-status ${stockClass}">
                    ${stockStatus}
                </div>
                
                <div class="social-proof">
                    <strong>${product.soldCount || 0}+</strong> عميل اشتروا هذا المنتج
                </div>
                
                <button class="add-to-cart-btn">
                    <i class="fas fa-shopping-cart"></i>
                    <span>أضف إلى السلة</span>
                </button>
            </div>
        </div>
    `;
}

/**
 * Render products grid
 */
function renderProductsGrid(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = products.map(product => createProductCardHTML(product)).join('');
    
    // Initialize product cards
    container.querySelectorAll('.product-card-advanced').forEach(card => {
        new ProductCard(card);
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProductCard, createProductCardHTML, renderProductsGrid };
}
