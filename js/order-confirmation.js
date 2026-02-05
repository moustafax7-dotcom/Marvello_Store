/**
 * Order Confirmation Page JavaScript
 * Displays order details and confirmation information
 */

class OrderConfirmation {
    constructor() {
        this.orderId = this.getOrderIdFromURL();
        this.order = null;
        this.init();
    }

    init() {
        this.loadOrder();
        this.displayOrderDetails();
        this.displayOrderItems();
        this.displayOrderSummary();
    }

    getOrderIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id') || null;
    }

    loadOrder() {
        if (!this.orderId) {
            // Try to get from localStorage
            const lastOrderId = localStorage.getItem('lastOrderId');
            if (lastOrderId) {
                this.orderId = lastOrderId;
            }
        }

        // Load order from localStorage
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        this.order = orders.find(order => order.id === this.orderId);

        if (!this.order) {
            // Create a sample order if not found
            this.order = this.createSampleOrder();
        }
    }

    createSampleOrder() {
        return {
            id: this.orderId || 'ORD-' + Date.now(),
            timestamp: new Date().toISOString(),
            items: [],
            shipping: {
                fullName: 'العميل',
                email: 'customer@example.com',
                phone: '+20 1234567890',
                address: 'العنوان',
                city: 'القاهرة',
                zipCode: '11111'
            },
            payment: {
                method: 'card',
                status: 'pending'
            },
            total: 0
        };
    }

    displayOrderDetails() {
        // Display order ID
        document.getElementById('orderId').textContent = this.order.id;

        // Display email
        document.getElementById('confirmationEmail').textContent = this.order.shipping.email;

        // Display shipping information
        document.getElementById('shippingName').textContent = this.order.shipping.fullName;
        document.getElementById('shippingAddress').textContent = this.order.shipping.address;
        document.getElementById('shippingCity').textContent = this.order.shipping.city;
        document.getElementById('shippingPhone').textContent = this.order.shipping.phone;

        // Display payment information
        const paymentMethods = {
            'card': 'بطاقة ائتمان',
            'fawry': 'فودافون كاش',
            'wallet': 'محفظة رقمية',
            'cod': 'الدفع عند الاستلام'
        };
        document.getElementById('paymentMethod').textContent = 
            paymentMethods[this.order.payment.method] || 'غير محدد';

        // Display payment status
        const statusText = this.order.payment.status === 'completed' ? 'مكتمل' : 'قيد المعالجة';
        const statusColor = this.order.payment.status === 'completed' ? 'var(--success)' : 'var(--warning)';
        const statusElement = document.getElementById('paymentStatus');
        statusElement.textContent = statusText;
        statusElement.style.color = statusColor;

        // Display order date
        const orderDate = new Date(this.order.timestamp);
        const formattedDate = orderDate.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('orderDate').textContent = formattedDate;

        // Display order status
        const orderStatusElement = document.getElementById('orderStatus');
        orderStatusElement.textContent = 'قيد المعالجة';
        orderStatusElement.style.color = 'var(--warning)';

        // Calculate and display estimated delivery
        const estimatedDate = new Date(orderDate);
        estimatedDate.setDate(estimatedDate.getDate() + 4); // 3-5 days
        const formattedEstimated = estimatedDate.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('estimatedDelivery').textContent = formattedEstimated;
    }

    displayOrderItems() {
        const container = document.getElementById('orderItemsList');

        if (!this.order.items || this.order.items.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--gray);">لا توجد منتجات في الطلب</p>';
            return;
        }

        container.innerHTML = this.order.items.map(item => `
            <div class="order-item">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <div>
                        <div class="item-name">${item.name}</div>
                        <div class="item-variants">
                            ${item.size ? `الحجم: ${item.size}` : ''}
                            ${item.color ? ` • اللون: ${item.color}` : ''}
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div class="item-quantity">الكمية: ${item.quantity}</div>
                        <div class="item-price">${item.price * item.quantity} ج.م</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    displayOrderSummary() {
        const subtotal = this.calculateSubtotal();
        const discount = this.calculateDiscount(subtotal);
        const total = subtotal - discount;

        document.getElementById('subtotal').textContent = `${subtotal} ج.م`;

        if (discount > 0) {
            document.getElementById('discountRow').style.display = 'flex';
            document.getElementById('discount').textContent = `-${discount} ج.م`;
        }

        document.getElementById('total').textContent = `${total} ج.م`;
    }

    calculateSubtotal() {
        if (!this.order.items) return 0;
        return this.order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    calculateDiscount(subtotal) {
        if (!this.order.discountPercent) return 0;
        return Math.round(subtotal * (this.order.discountPercent / 100));
    }
}

// Initialize order confirmation page
document.addEventListener('DOMContentLoaded', function() {
    new OrderConfirmation();
});
