// Firebase Payment Module
// نظام الدفع المتقدم مع دعم Stripe و Fawry

// إعدادات الدفع
const PAYMENT_CONFIG = {
    stripe: {
        publicKey: 'YOUR_STRIPE_PUBLIC_KEY', // استبدل بـ Public Key الخاص بك
        enabled: false // تفعيل عند الإعداد
    },
    fawry: {
        merchantCode: 'YOUR_FAWRY_MERCHANT_CODE', // استبدل بـ Merchant Code الخاص بك
        enabled: false // تفعيل عند الإعداد
    },
    cash: {
        enabled: true // الدفع عند الاستلام مفعّل افتراضياً
    }
};

// إنشاء جلسة دفع
async function createPaymentSession(orderData) {
    try {
        const paymentMethod = orderData.paymentMethod || 'cash';
        
        switch(paymentMethod) {
            case 'stripe':
                return await createStripePayment(orderData);
            case 'fawry':
                return await createFawryPayment(orderData);
            case 'cash':
                return await createCashPayment(orderData);
            default:
                throw new Error('طريقة دفع غير معروفة');
        }
    } catch (error) {
        console.error('خطأ في إنشاء جلسة الدفع:', error);
        showToast('خطأ في معالجة الدفع: ' + error.message + ' ❌');
        return null;
    }
}

// الدفع عبر Stripe
async function createStripePayment(orderData) {
    try {
        if (!PAYMENT_CONFIG.stripe.enabled) {
            showToast('خدمة Stripe غير مفعّلة حالياً ❌');
            return null;
        }
        
        // إنشاء Payment Intent على الخادم
        const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: Math.round(orderData.total * 100), // تحويل إلى فلوس
                currency: 'egp',
                orderId: orderData.orderId,
                description: `طلب من Marvello Store - ${orderData.orderId}`
            })
        });
        
        const paymentIntent = await response.json();
        
        if (!paymentIntent.clientSecret) {
            throw new Error('فشل في إنشاء جلسة الدفع');
        }
        
        // حفظ معرف الدفع
        localStorage.setItem('stripePaymentIntentId', paymentIntent.id);
        
        return {
            method: 'stripe',
            clientSecret: paymentIntent.clientSecret,
            paymentIntentId: paymentIntent.id
        };
    } catch (error) {
        console.error('خطأ في Stripe:', error);
        showToast('خطأ في معالجة الدفع عبر Stripe ❌');
        return null;
    }
}

// الدفع عبر Fawry
async function createFawryPayment(orderData) {
    try {
        if (!PAYMENT_CONFIG.fawry.enabled) {
            showToast('خدمة Fawry غير مفعّلة حالياً ❌');
            return null;
        }
        
        const fawryPayload = {
            merchantCode: PAYMENT_CONFIG.fawry.merchantCode,
            merchantRefNum: orderData.orderId,
            customerProfileId: currentUser.uid,
            chargeItems: [
                {
                    itemId: 'MARVELLO_ORDER',
                    description: 'طلب من Marvello Store',
                    price: orderData.total,
                    quantity: 1
                }
            ],
            customerEmail: currentUser.email,
            customerMobileNumber: orderData.phone,
            paymentExpiry: Math.floor(Date.now() / 1000) + (3600 * 24), // 24 ساعة
            language: 'ar-EG',
            returnUrl: window.location.origin + '/pages/payment-success.html'
        };
        
        // إرسال الطلب إلى Fawry
        const response = await fetch('https://atfawry.fawrystaging.com/ECommerceWeb/Fawry/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fawryPayload)
        });
        
        const fawryResponse = await response.json();
        
        if (!fawryResponse.statusCode || fawryResponse.statusCode !== 200) {
            throw new Error('فشل في إنشاء جلسة الدفع على Fawry');
        }
        
        // حفظ معرف الدفع
        localStorage.setItem('fawryPaymentId', fawryResponse.paymentId);
        
        return {
            method: 'fawry',
            paymentId: fawryResponse.paymentId,
            redirectUrl: fawryResponse.paymentUrl
        };
    } catch (error) {
        console.error('خطأ في Fawry:', error);
        showToast('خطأ في معالجة الدفع عبر Fawry ❌');
        return null;
    }
}

// الدفع عند الاستلام (كاش)
async function createCashPayment(orderData) {
    try {
        // إنشاء الطلب مباشرة
        const orderId = await createOrderInFirebase(orderData);
        
        if (orderId) {
            showToast('تم إنشاء الطلب بنجاح! سيتم التواصل معك قريباً ✅');
            
            // حفظ معرف الطلب
            localStorage.setItem('lastOrderId', orderId);
            
            return {
                method: 'cash',
                orderId: orderId,
                status: 'pending'
            };
        }
        
        return null;
    } catch (error) {
        console.error('خطأ في إنشاء الطلب:', error);
        showToast('خطأ في إنشاء الطلب ❌');
        return null;
    }
}

// التحقق من حالة الدفع
async function verifyPaymentStatus(paymentId, method) {
    try {
        switch(method) {
            case 'stripe':
                return await verifyStripePayment(paymentId);
            case 'fawry':
                return await verifyFawryPayment(paymentId);
            case 'cash':
                return { status: 'pending', verified: true };
            default:
                return null;
        }
    } catch (error) {
        console.error('خطأ في التحقق من الدفع:', error);
        return null;
    }
}

// التحقق من Stripe
async function verifyStripePayment(paymentIntentId) {
    try {
        const response = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                paymentIntentId: paymentIntentId
            })
        });
        
        const result = await response.json();
        
        return {
            verified: result.status === 'succeeded',
            status: result.status,
            amount: result.amount
        };
    } catch (error) {
        console.error('خطأ في التحقق من Stripe:', error);
        return null;
    }
}

// التحقق من Fawry
async function verifyFawryPayment(paymentId) {
    try {
        const response = await fetch(`/api/verify-fawry-payment/${paymentId}`);
        const result = await response.json();
        
        return {
            verified: result.status === 'PAID',
            status: result.status,
            amount: result.amount
        };
    } catch (error) {
        console.error('خطأ في التحقق من Fawry:', error);
        return null;
    }
}

// معالج رد الاتصال من Stripe
async function handleStripeCallback(paymentIntentId) {
    try {
        const paymentStatus = await verifyStripePayment(paymentIntentId);
        
        if (paymentStatus && paymentStatus.verified) {
            showToast('تم الدفع بنجاح! ✅');
            
            // تحديث حالة الطلب
            const orderId = localStorage.getItem('lastOrderId');
            if (orderId) {
                await updateOrderStatus(orderId, 'processing');
            }
            
            return true;
        } else {
            showToast('فشل الدفع. يرجى المحاولة مرة أخرى ❌');
            return false;
        }
    } catch (error) {
        console.error('خطأ في معالجة رد الاتصال:', error);
        return false;
    }
}

// معالج رد الاتصال من Fawry
async function handleFawryCallback(paymentId) {
    try {
        const paymentStatus = await verifyFawryPayment(paymentId);
        
        if (paymentStatus && paymentStatus.verified) {
            showToast('تم الدفع بنجاح! ✅');
            
            // تحديث حالة الطلب
            const orderId = localStorage.getItem('lastOrderId');
            if (orderId) {
                await updateOrderStatus(orderId, 'processing');
            }
            
            return true;
        } else {
            showToast('فشل الدفع. يرجى المحاولة مرة أخرى ❌');
            return false;
        }
    } catch (error) {
        console.error('خطأ في معالجة رد الاتصال:', error);
        return false;
    }
}

// حساب الرسوم والضرائب
function calculatePaymentFees(amount, paymentMethod) {
    let fees = 0;
    
    switch(paymentMethod) {
        case 'stripe':
            // 2.9% + 0.30 دولار (تقريباً)
            fees = (amount * 0.029) + 0.30;
            break;
        case 'fawry':
            // 1.5% - 2.5% حسب المبلغ
            fees = amount * 0.02;
            break;
        case 'cash':
            fees = 0;
            break;
    }
    
    return Math.round(fees * 100) / 100;
}

// عرض خيارات الدفع المتاحة
function getAvailablePaymentMethods() {
    const methods = [];
    
    if (PAYMENT_CONFIG.cash.enabled) {
        methods.push({
            id: 'cash',
            name: 'الدفع عند الاستلام',
            description: 'ادفع عند استلام طلبك',
            icon: '💵',
            fees: 0
        });
    }
    
    if (PAYMENT_CONFIG.stripe.enabled) {
        methods.push({
            id: 'stripe',
            name: 'بطاقة ائتمان (Stripe)',
            description: 'ادفع بأمان عبر Stripe',
            icon: '💳',
            fees: calculatePaymentFees(100, 'stripe') // مثال
        });
    }
    
    if (PAYMENT_CONFIG.fawry.enabled) {
        methods.push({
            id: 'fawry',
            name: 'Fawry',
            description: 'ادفع عبر Fawry',
            icon: '🏦',
            fees: calculatePaymentFees(100, 'fawry') // مثال
        });
    }
    
    return methods;
}

// تسجيل معاملة الدفع
async function logPaymentTransaction(orderId, paymentData) {
    try {
        await db.collection('payments').add({
            orderId: orderId,
            userId: currentUser.uid,
            method: paymentData.method,
            amount: paymentData.amount,
            status: paymentData.status,
            transactionId: paymentData.transactionId || null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            metadata: paymentData.metadata || {}
        });
        
        return true;
    } catch (error) {
        console.error('خطأ في تسجيل المعاملة:', error);
        return false;
    }
}

// دالة مساعدة لعرض الإشعارات
function showToast(message) {
    let toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '15px 20px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    toast.style.fontFamily = "'Cairo', sans-serif";
    toast.style.fontSize = '14px';
    toast.innerText = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
