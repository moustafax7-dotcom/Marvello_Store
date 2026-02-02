/**
 * Sidebar Cart Management System
 * Handles cart display, updates, and checkout
 */

class SidebarCart {
    constructor() {
        this.cart = [];
        this.isOpen = false;
        this.promoCode = '';
        this.discountPercent = 0;
        
        this.init();
    }

    init() {
        this.loadCart();
        this.createCartHTML();
        this.attachEventListeners();
        this.updateCartDisplay();
        
        // Listen for cart updates from other pages
        window.addEventListener('cartUpdated', (e) => {
            this.cart = e.detail;
            this.updateCartDisplay();
        });
    }

    createCartHTML() {
        // Create cart sidebar HTML
        const cartHTML = `
            <div class="cart-overlay" id="cartOverlay"></div>
            <div class="cart-sidebar" id="cartSidebar">
                <div class="cart-header">
                    <h2 class="cart-title">سلة التسوق</h2>
                    <button class="cart-close-btn" onclick="sidebarCart.toggleCart()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="cart-items-container" id="cartItemsContainer">
                    <!-- Cart items will be rendered here -->
                </div>
                
                <div class="promo-section">
                    <div class="promo-input-group">
                        <input type="text" class="promo-input" id="promoInput" placeholder="أدخل كود الخصم">
                        <button class="promo-btn" onclick="sidebarCart.applyPromo()">تطبيق</button>
                    </div>
                </div>
                
                <div class="cart-summary">
                    <div class="summary-row">
                        <span class="summary-label">المجموع الفرعي:</span>
                        <span class="summary-value" id="subtotal">0 ج.م</span>
                    </div>
                    <div class="summary-row" id="discountRow" style="display: none;">
                        <span class="summary-label">الخصم:</span>
                        <span class="summary-value" id="discount" style="color: var(--success);">-0 ج.م</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">الشحن:</span>
                        <span class="summary-value" id="shipping">مجاني</span>
                    </div>
                    <div class="summary-row total">
                        <span>الإجمالي:</span>
                        <span id="total">0 ج.م</span>
                    </div>
                </div>
                
                <div class="cart-actions">
                    <button class="btn-checkout" onclick="sidebarCart.proceedToCheckout()">
                        <i class="fas fa-credit-card"></i>
                        <span>متابعة الدفع</span>
                    </button>
                    <button class="btn-continue-shopping" onclick="sidebarCart.continueShopping()">
                        <i class="fas fa-shopping-bag"></i>
                        <span>متابعة التسوق</span>
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', cartHTML);
    }

    attachEventListeners() {
        // Close cart on overlay click
        document.getElementById('cartOverlay').addEventListener('click', () => this.toggleCart());
        
        // Close cart on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.toggleCart();
        });
    }

    loadCart() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    toggleCart() {
        this.isOpen = !this.isOpen;
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        
        if (this.isOpen) {
            sidebar.classList.add('open');
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        } else {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
            document.body.style.overflow = 'auto';
        }
    }

    updateCartDisplay() {
        this.loadCart();
        this.renderCartItems();
        this.updateCartSummary();
        this.updateCartBadge();
    }

    renderCartItems() {
        const container = document.getElementById('cartItemsContainer');
        
        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <p class="empty-cart-text">سلة التسوق فارغة</p>
                    <a href="../pages/shop.html" class="continue-shopping-btn" onclick="sidebarCart.toggleCart()">
                        ابدأ التسوق
                    </a>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-variants">
                        ${item.size ? `<span>الحجم: ${item.size}</span>` : ''}
                        ${item.color ? `<span> • اللون: ${item.color}</span>` : ''}
                    </div>
                    <div class="cart-item-price">${item.price} ج.م</div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="sidebarCart.decreaseQuantity(${index})">−</button>
                        <input type="number" class="qty-input" value="${item.quantity}" min="1" 
                               onchange="sidebarCart.updateQuantity(${index}, this.value)">
                        <button class="qty-btn" onclick="sidebarCart.increaseQuantity(${index})">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="sidebarCart.removeItem(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    updateCartSummary() {
        const subtotal = this.calculateSubtotal();
        const discount = this.calculateDiscount(subtotal);
        const total = subtotal - discount;
        
        document.getElementById('subtotal').textContent = `${subtotal} ج.م`;
        
        if (discount > 0) {
            document.getElementById('discountRow').style.display = 'flex';
            document.getElementById('discount').textContent = `-${discount} ج.م`;
        } else {
            document.getElementById('discountRow').style.display = 'none';
        }
        
        document.getElementById('total').textContent = `${total} ج.م`;
    }

    calculateSubtotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    calculateDiscount(subtotal) {
        return Math.round(subtotal * (this.discountPercent / 100));
    }

    updateCartBadge() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const badge = document.querySelector('.cart-badge');
        
        if (badge) {
            if (totalItems > 0) {
                badge.textContent = totalItems;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    increaseQuantity(index) {
        if (this.cart[index]) {
            this.cart[index].quantity += 1;
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    decreaseQuantity(index) {
        if (this.cart[index] && this.cart[index].quantity > 1) {
            this.cart[index].quantity -= 1;
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    updateQuantity(index, newQuantity) {
        const quantity = parseInt(newQuantity);
        if (this.cart[index] && quantity > 0) {
            this.cart[index].quantity = quantity;
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    removeItem(index) {
        if (confirm('هل تريد حذف هذا المنتج من السلة؟')) {
            this.cart.splice(index, 1);
            this.saveCart();
            this.updateCartDisplay();
            this.showToast('تم حذف المنتج من السلة');
        }
    }

    applyPromo() {
        const input = document.getElementById('promoInput');
        const code = input.value.trim().toUpperCase();
        
        if (!code) {
            alert('الرجاء إدخال كود الخصم');
            return;
        }
        
        // Sample promo codes
        const promoCodes = {
            'WELCOME10': 10,
            'SAVE20': 20,
            'SUMMER30': 30,
            'VIP50': 50
        };
        
        if (promoCodes[code]) {
            this.discountPercent = promoCodes[code];
            this.promoCode = code;
            this.updateCartSummary();
            this.showToast(`تم تطبيق الخصم بنسبة ${this.discountPercent}% ✓`);
            input.value = '';
        } else {
            alert('كود الخصم غير صحيح');
        }
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            alert('سلة التسوق فارغة');
            return;
        }
        
        // Save cart to localStorage for checkout page
        localStorage.setItem('checkoutCart', JSON.stringify({
            items: this.cart,
            promoCode: this.promoCode,
            discountPercent: this.discountPercent
        }));
        
        // Redirect to checkout page
        window.location.href = '../pages/checkout.html';
    }

    continueShopping() {
        this.toggleCart();
        window.location.href = '../pages/shop.html';
    }

    showToast(message) {
        const toast = document.createElement('div');
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
            z-index: 10000;
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

// Create cart toggle button in header
function createCartButton() {
    const header = document.querySelector('header .nav-links');
    if (!header) return;
    
    // Remove existing cart button if any
    const existing = header.querySelector('.cart-toggle-btn');
    if (existing) existing.remove();
    
    const cartBtn = document.createElement('button');
    cartBtn.className = 'cart-toggle-btn';
    cartBtn.innerHTML = `
        <i class="fas fa-shopping-cart"></i>
        <span class="cart-badge" style="display: none;">0</span>
    `;
    cartBtn.onclick = () => sidebarCart.toggleCart();
    
    header.insertBefore(cartBtn, header.firstChild);
}

// Initialize sidebar cart
let sidebarCart;
document.addEventListener('DOMContentLoaded', function() {
    sidebarCart = new SidebarCart();
    createCartButton();
});

// Listen for cart updates from other pages
window.addEventListener('cartUpdated', (e) => {
    if (sidebarCart) {
        sidebarCart.cart = e.detail;
        sidebarCart.updateCartDisplay();
    }
});
