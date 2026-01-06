/**
 * نظام الدفع المتقدم - Marvello Store
 * يدعم محاكاة Stripe و Fawry
 */

class PaymentSystem {
    constructor() {
        this.paymentMethods = {
            'stripe': {
                name: 'بطاقة ائتمان (Stripe)',
                icon: '💳',
                fee: 0.029 // 2.9%
            },
            'fawry': {
                name: 'Fawry',
                icon: '🏪',
                fee: 0.02 // 2%
            },
            'cash': {
                name: 'الدفع عند الاستلام',
                icon: '💵',
                fee: 0 // بدون رسوم
            }
        };
    }

    /**
     * حساب إجمالي الفاتورة مع الرسوم
     */
    calculateTotal(subtotal, paymentMethod = 'cash', shippingCost = 0) {
        const fee = subtotal * this.paymentMethods[paymentMethod].fee;
        const total = subtotal + fee + shippingCost;
        return {
            subtotal,
            fee,
            shippingCost,
            total,
            paymentMethod: this.paymentMethods[paymentMethod].name
        };
    }

    /**
     * معالجة الدفع عبر Stripe (محاكاة)
     */
    async processStripePayment(cardDetails) {
        return new Promise((resolve, reject) => {
            // محاكاة تأخير المعالجة
            setTimeout(() => {
                // التحقق من بيانات البطاقة (محاكاة)
                if (cardDetails.cardNumber && cardDetails.expiry && cardDetails.cvc) {
                    resolve({
                        success: true,
                        transactionId: 'stripe_' + Date.now(),
                        message: 'تم الدفع بنجاح عبر Stripe'
                    });
                } else {
                    reject({
                        success: false,
                        message: 'بيانات البطاقة غير صحيحة'
                    });
                }
            }, 2000);
        });
    }

    /**
     * معالجة الدفع عبر Fawry (محاكاة)
     */
    async processFawryPayment(phoneNumber) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (phoneNumber && phoneNumber.length === 11) {
                    resolve({
                        success: true,
                        transactionId: 'fawry_' + Date.now(),
                        message: 'تم إرسال رابط الدفع إلى رقم الهاتف'
                    });
                } else {
                    reject({
                        success: false,
                        message: 'رقم الهاتف غير صحيح'
                    });
                }
            }, 2000);
        });
    }

    /**
     * معالجة الدفع عند الاستلام
     */
    async processCashPayment(orderDetails) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    transactionId: 'cash_' + Date.now(),
                    message: 'تم تأكيد الطلب. سيتم التسليم والدفع عند الاستلام'
                });
            }, 1000);
        });
    }

    /**
     * الحصول على جميع طرق الدفع المتاحة
     */
    getPaymentMethods() {
        return this.paymentMethods;
    }

    /**
     * التحقق من صحة بيانات البطاقة
     */
    validateCardDetails(cardNumber, expiry, cvc) {
        // التحقق البسيط من طول البيانات
        return cardNumber.length === 16 && expiry.length === 5 && cvc.length === 3;
    }

    /**
     * التحقق من صحة رقم الهاتف
     */
    validatePhoneNumber(phoneNumber) {
        return phoneNumber.length === 11 && phoneNumber.startsWith('01');
    }
}

// تصدير الفئة
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaymentSystem;
}
