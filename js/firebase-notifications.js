// Firebase Notifications Module
// نظام الإشعارات والبريد الإلكتروني

// إعدادات الإشعارات
const NOTIFICATION_CONFIG = {
    email: {
        enabled: false, // تفعيل عند الإعداد
        provider: 'sendgrid' // أو 'mailgun'
    },
    sms: {
        enabled: false, // تفعيل عند الإعداد
        provider: 'twilio'
    },
    push: {
        enabled: false, // تفعيل عند الإعداد
    }
};

// إرسال بريد إلكتروني للترحيب
async function sendWelcomeEmail(user) {
    try {
        if (!NOTIFICATION_CONFIG.email.enabled) {
            console.log('خدمة البريد الإلكتروني غير مفعّلة');
            return false;
        }
        
        const emailData = {
            to: user.email,
            subject: 'أهلاً بك في Marvello Store 👋',
            template: 'welcome',
            data: {
                name: user.displayName || 'صديقنا',
                email: user.email
            }
        };
        
        return await sendEmailNotification(emailData);
    } catch (error) {
        console.error('خطأ في إرسال بريد الترحيب:', error);
        return false;
    }
}

// إرسال تأكيد الطلب
async function sendOrderConfirmationEmail(order) {
    try {
        if (!NOTIFICATION_CONFIG.email.enabled) {
            console.log('خدمة البريد الإلكتروني غير مفعّلة');
            return false;
        }
        
        const emailData = {
            to: order.userEmail,
            subject: `تأكيد طلبك #${order.id} 📦`,
            template: 'order-confirmation',
            data: {
                orderId: order.id,
                customerName: order.deliveryInfo.name,
                items: order.items,
                total: order.total,
                deliveryAddress: order.deliveryInfo.address,
                estimatedDelivery: calculateEstimatedDelivery()
            }
        };
        
        return await sendEmailNotification(emailData);
    } catch (error) {
        console.error('خطأ في إرسال تأكيد الطلب:', error);
        return false;
    }
}

// إرسال تحديث حالة الطلب
async function sendOrderStatusUpdateEmail(order, newStatus) {
    try {
        if (!NOTIFICATION_CONFIG.email.enabled) {
            console.log('خدمة البريد الإلكتروني غير مفعّلة');
            return false;
        }
        
        const statusMessages = {
            'processing': 'جاري معالجة طلبك',
            'shipped': 'تم شحن طلبك',
            'delivered': 'تم تسليم طلبك',
            'cancelled': 'تم إلغاء طلبك'
        };
        
        const emailData = {
            to: order.userEmail,
            subject: `تحديث طلبك #${order.id} 📬`,
            template: 'order-status-update',
            data: {
                orderId: order.id,
                customerName: order.deliveryInfo.name,
                status: getOrderStatusInArabic(newStatus),
                statusMessage: statusMessages[newStatus] || 'تم تحديث حالة طلبك',
                trackingUrl: `${window.location.origin}/pages/track-order.html?id=${order.id}`
            }
        };
        
        return await sendEmailNotification(emailData);
    } catch (error) {
        console.error('خطأ في إرسال تحديث الحالة:', error);
        return false;
    }
}

// إرسال إشعار الدفع
async function sendPaymentConfirmationEmail(order, paymentData) {
    try {
        if (!NOTIFICATION_CONFIG.email.enabled) {
            console.log('خدمة البريد الإلكتروني غير مفعّلة');
            return false;
        }
        
        const emailData = {
            to: order.userEmail,
            subject: `تأكيد الدفع 💳`,
            template: 'payment-confirmation',
            data: {
                orderId: order.id,
                customerName: order.deliveryInfo.name,
                amount: order.total,
                paymentMethod: paymentData.method,
                transactionId: paymentData.transactionId,
                timestamp: new Date().toLocaleString('ar-EG')
            }
        };
        
        return await sendEmailNotification(emailData);
    } catch (error) {
        console.error('خطأ في إرسال تأكيد الدفع:', error);
        return false;
    }
}

// إرسال رسالة SMS
async function sendOrderSMS(phoneNumber, orderId) {
    try {
        if (!NOTIFICATION_CONFIG.sms.enabled) {
            console.log('خدمة SMS غير مفعّلة');
            return false;
        }
        
        const smsData = {
            to: phoneNumber,
            message: `تم استقبال طلبك برقم ${orderId}. شكراً لاستخدام Marvello Store!`
        };
        
        return await sendSMSNotification(smsData);
    } catch (error) {
        console.error('خطأ في إرسال SMS:', error);
        return false;
    }
}

// إرسال إشعار Push
async function sendPushNotification(userId, notification) {
    try {
        if (!NOTIFICATION_CONFIG.push.enabled) {
            console.log('خدمة Push Notifications غير مفعّلة');
            return false;
        }
        
        const pushData = {
            userId: userId,
            title: notification.title,
            body: notification.body,
            icon: '/images/logo.png',
            badge: '/images/badge.png',
            data: notification.data || {}
        };
        
        return await sendPushNotificationToUser(pushData);
    } catch (error) {
        console.error('خطأ في إرسال Push Notification:', error);
        return false;
    }
}

// دالة عامة لإرسال البريد الإلكتروني
async function sendEmailNotification(emailData) {
    try {
        // استدعاء Cloud Function لإرسال البريد
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await currentUser.getIdToken()}`
            },
            body: JSON.stringify(emailData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('تم إرسال البريد بنجاح');
            return true;
        } else {
            console.error('فشل إرسال البريد:', result.error);
            return false;
        }
    } catch (error) {
        console.error('خطأ في إرسال البريد:', error);
        return false;
    }
}

// دالة عامة لإرسال SMS
async function sendSMSNotification(smsData) {
    try {
        const response = await fetch('/api/send-sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await currentUser.getIdToken()}`
            },
            body: JSON.stringify(smsData)
        });
        
        const result = await response.json();
        return result.success || false;
    } catch (error) {
        console.error('خطأ في إرسال SMS:', error);
        return false;
    }
}

// دالة عامة لإرسال Push Notification
async function sendPushNotificationToUser(pushData) {
    try {
        const response = await fetch('/api/send-push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await currentUser.getIdToken()}`
            },
            body: JSON.stringify(pushData)
        });
        
        const result = await response.json();
        return result.success || false;
    } catch (error) {
        console.error('خطأ في إرسال Push Notification:', error);
        return false;
    }
}

// حفظ تفضيلات الإشعارات
async function saveNotificationPreferences(userId, preferences) {
    try {
        await db.collection('users').doc(userId).update({
            notificationPreferences: preferences,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('تم حفظ التفضيلات بنجاح ✅');
        return true;
    } catch (error) {
        console.error('خطأ في حفظ التفضيلات:', error);
        showToast('خطأ في حفظ التفضيلات ❌');
        return false;
    }
}

// الحصول على تفضيلات الإشعارات
async function getNotificationPreferences(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        
        if (userDoc.exists) {
            return userDoc.data().notificationPreferences || {
                email: true,
                sms: false,
                push: true
            };
        }
        
        return null;
    } catch (error) {
        console.error('خطأ في جلب التفضيلات:', error);
        return null;
    }
}

// حساب تاريخ التسليم المتوقع
function calculateEstimatedDelivery() {
    const today = new Date();
    const estimatedDate = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000)); // 3 أيام
    
    return estimatedDate.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// إرسال رسالة تنبيه للمسؤول
async function notifyAdminNewOrder(order) {
    try {
        const adminEmail = 'admin@marvellostore.com'; // استبدل بـ بريد الإدارة
        
        const emailData = {
            to: adminEmail,
            subject: `طلب جديد #${order.id} 🎉`,
            template: 'admin-new-order',
            data: {
                orderId: order.id,
                customerName: order.deliveryInfo.name,
                customerPhone: order.deliveryInfo.phone,
                items: order.items,
                total: order.total,
                address: order.deliveryInfo.address,
                timestamp: new Date().toLocaleString('ar-EG')
            }
        };
        
        return await sendEmailNotification(emailData);
    } catch (error) {
        console.error('خطأ في إشعار الإدارة:', error);
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
