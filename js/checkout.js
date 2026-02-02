/**
 * Checkout Page JavaScript
 * Handles checkout form, payment processing, and order submission
 */

class CheckoutPage {
    constructor() {
        this.checkoutData = null;
        this.selectedPaymentMethod = 'card';
        this.init();
    }

    init() {
        this.loadCheckoutData();
        this.renderOrderSummary();
        this.attachEventListeners();
        this.loadUserData();
    }

    loadCheckoutData() {
        const data = localStorage.getItem('checkoutCart');
        if (data) {
            this.checkoutData = JSON.parse(data);
        } else {
            // Fallback to cart data
            const cart = localStorage.getItem('cart');
            this.checkoutData = {
                items: cart ? JSON.parse(cart) : [],
                promoCode: '',
                discountPercent: 0
            };
        }
    }

    renderOrderSummary() {
        const container = document.getElementById('summaryItems');
        if (!this.checkoutData.items || this.checkoutData.items.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--gray);">السلة فارغة</p>';
            return;
        }

        let totalPrice = 0;
        let html = '';

        this.checkoutData.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            html += `
                <div class="summary-item">
                    <div>
                        <div class="item-name">${item.name}</div>
                        <small style="color: var(--gray);">الكمية: ${item.quantity}</small>
                    </div>
                    <div class="item-price">${itemTotal} ج.م</div>
                </div>
            `;
        });

        container.innerHTML = html;

        // Calculate total with discount
        const discount = Math.round(totalPrice * (this.checkoutData.discountPercent / 100));
        const total = totalPrice - discount;

        document.getElementById('totalAmount').textContent = `${total} ج.م`;
    }

    attachEventListeners() {
        // User type selection
        document.querySelectorAll('input[name="userType"]').forEach(radio => {
            radio.addEventListener('change', (e) => this.handleUserTypeChange(e));
        });

        // Card number formatting
        const cardNumber = document.getElementById('cardNumber');
        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => this.formatCardNumber(e));
        }

        // Expiry date formatting
        const expiry = document.getElementById('cardExpiry');
        if (expiry) {
            expiry.addEventListener('input', (e) => this.formatExpiry(e));
        }
    }

    handleUserTypeChange(event) {
        const userType = event.target.value;
        const form = document.getElementById('shippingForm');
        
        if (userType === 'guest') {
            form.style.display = 'block';
        } else {
            form.style.display = 'block';
            this.loadUserData();
        }
    }

    loadUserData() {
        // Try to load user data from localStorage or Firebase
        const userData = localStorage.getItem('userData');
        if (userData) {
            const user = JSON.parse(userData);
            document.getElementById('fullName').value = user.fullName || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('phone').value = user.phone || '';
            document.getElementById('address').value = user.address || '';
            document.getElementById('city').value = user.city || '';
            document.getElementById('zipCode').value = user.zipCode || '';
        }
    }

    formatCardNumber(event) {
        let value = event.target.value.replace(/\s/g, '');
        let formatted = '';
        
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formatted += ' ';
            }
            formatted += value[i];
        }
        
        event.target.value = formatted;
    }

    formatExpiry(event) {
        let value = event.target.value.replace(/\D/g, '');
        
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        
        event.target.value = value;
    }

    validateForm() {
        // Validate shipping information
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const city = document.getElementById('city').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        if (!fullName || !email || !phone || !address || !city) {
            alert('الرجاء ملء جميع حقول الشحن');
            return false;
        }

        if (!this.isValidEmail(email)) {
            alert('الرجاء إدخال بريد إلكتروني صحيح');
            return false;
        }

        if (!agreeTerms) {
            alert('الرجاء الموافقة على شروط الخدمة');
            return false;
        }

        // Validate payment method
        if (this.selectedPaymentMethod === 'card') {
            const cardName = document.getElementById('cardName').value.trim();
            const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
            const cardExpiry = document.getElementById('cardExpiry').value;
            const cardCVV = document.getElementById('cardCVV').value;

            if (!cardName || !cardNumber || !cardExpiry || !cardCVV) {
                alert('الرجاء ملء جميع بيانات البطاقة');
                return false;
            }

            if (cardNumber.length !== 16) {
                alert('رقم البطاقة غير صحيح');
                return false;
            }

            if (cardCVV.length !== 3) {
                alert('رمز الأمان غير صحيح');
                return false;
            }
        }

        return true;
    }

    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    submitOrder() {
        if (!this.validateForm()) {
            return;
        }

        // Prepare order data
        const orderData = {
            id: this.generateOrderId(),
            timestamp: new Date().toISOString(),
            items: this.checkoutData.items,
            shipping: {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                zipCode: document.getElementById('zipCode').value
            },
            payment: {
                method: this.selectedPaymentMethod,
                status: 'pending'
            },
            promoCode: this.checkoutData.promoCode,
            discountPercent: this.checkoutData.discountPercent,
            total: this.calculateTotal()
        };

        // Save order to localStorage
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Clear cart
        localStorage.removeItem('cart');
        localStorage.removeItem('checkoutCart');

        // Show success message
        this.showSuccess(orderData.id);
    }

    calculateTotal() {
        const subtotal = this.checkoutData.items.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0
        );
        const discount = Math.round(subtotal * (this.checkoutData.discountPercent / 100));
        return subtotal - discount;
    }

    generateOrderId() {
        return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    showSuccess(orderId) {
        // Save order ID for confirmation page
        localStorage.setItem('lastOrderId', orderId);

        // Redirect to confirmation page
        window.location.href = `../pages/order-confirmation.html?id=${orderId}`;
    }
}

// Global functions
function selectPaymentMethod(element, method) {
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('selected');
    });
    element.classList.add('selected');
    
    checkout.selectedPaymentMethod = method;

    // Show/hide card form based on payment method
    const cardForm = document.getElementById('cardForm');
    if (method === 'card') {
        cardForm.style.display = 'block';
    } else {
        cardForm.style.display = 'none';
    }
}

function submitCheckout() {
    checkout.submitOrder();
}

// Initialize checkout page
let checkout;
document.addEventListener('DOMContentLoaded', function() {
    checkout = new CheckoutPage();
});
