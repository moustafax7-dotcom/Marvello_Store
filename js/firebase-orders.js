// Firebase Orders Module
// نظام إدارة الطلبات باستخدام Firestore

// إنشاء طلب جديد
async function createOrderInFirebase(orderData) {
    try {
        if (!currentUser) {
            showToast('يجب تسجيل الدخول أولاً ❌');
            return null;
        }
        
        const newOrder = {
            userId: currentUser.uid,
            userName: currentUser.displayName || 'مستخدم',
            userEmail: currentUser.email,
            items: orderData.items,
            subtotal: orderData.subtotal,
            shipping: orderData.shipping || 50,
            total: orderData.total,
            paymentMethod: orderData.paymentMethod || 'cash',
            status: 'pending', // pending, processing, shipped, delivered, cancelled
            deliveryInfo: {
                name: orderData.name,
                phone: orderData.phone,
                address: orderData.address,
                location: orderData.location || ''
            },
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            notes: orderData.notes || ''
        };
        
        // إضافة الطلب إلى Firestore
        const docRef = await db.collection('orders').add(newOrder);
        
        // تحديث المخزون لكل منتج
        for (const item of orderData.items) {
            await updateProductStock(item.id, item.quantity);
        }
        
        showToast('تم إنشاء الطلب بنجاح ✅');
        
        // حفظ معرف الطلب في localStorage للمرجع
        localStorage.setItem('lastOrderId', docRef.id);
        
        return docRef.id;
    } catch (error) {
        console.error('خطأ في إنشاء الطلب:', error);
        showToast('خطأ في إنشاء الطلب: ' + error.message + ' ❌');
        return null;
    }
}

// جلب الطلبات الخاصة بالمستخدم الحالي
async function getUserOrders() {
    try {
        if (!currentUser) {
            return [];
        }
        
        const snapshot = await db.collection('orders')
            .where('userId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .get();
        
        const orders = [];
        snapshot.forEach(doc => {
            orders.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return orders;
    } catch (error) {
        console.error('خطأ في جلب الطلبات:', error);
        return [];
    }
}

// جلب طلب واحد
async function getOrderFromFirebase(orderId) {
    try {
        const doc = await db.collection('orders').doc(orderId).get();
        
        if (doc.exists) {
            return {
                id: doc.id,
                ...doc.data()
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('خطأ في جلب الطلب:', error);
        return null;
    }
}

// جلب جميع الطلبات (للمسؤولين فقط)
async function getAllOrders() {
    try {
        if (!await isAdmin()) {
            showToast('أنت لا تملك صلاحيات الإدارة ❌');
            return [];
        }
        
        const snapshot = await db.collection('orders')
            .orderBy('createdAt', 'desc')
            .get();
        
        const orders = [];
        snapshot.forEach(doc => {
            orders.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return orders;
    } catch (error) {
        console.error('خطأ في جلب الطلبات:', error);
        return [];
    }
}

// تحديث حالة الطلب
async function updateOrderStatus(orderId, newStatus) {
    try {
        if (!await isAdmin()) {
            showToast('أنت لا تملك صلاحيات الإدارة ❌');
            return false;
        }
        
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(newStatus)) {
            showToast('حالة غير صحيحة ❌');
            return false;
        }
        
        await db.collection('orders').doc(orderId).update({
            status: newStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showToast('تم تحديث حالة الطلب بنجاح ✅');
        return true;
    } catch (error) {
        console.error('خطأ في تحديث حالة الطلب:', error);
        showToast('خطأ في تحديث حالة الطلب ❌');
        return false;
    }
}

// حذف طلب (للمسؤولين فقط)
async function deleteOrderFromFirebase(orderId) {
    try {
        if (!await isAdmin()) {
            showToast('أنت لا تملك صلاحيات الإدارة ❌');
            return false;
        }
        
        if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
            return false;
        }
        
        await db.collection('orders').doc(orderId).delete();
        
        showToast('تم حذف الطلب بنجاح ✅');
        return true;
    } catch (error) {
        console.error('خطأ في حذف الطلب:', error);
        showToast('خطأ في حذف الطلب ❌');
        return false;
    }
}

// الحصول على إحصائيات الطلبات
async function getOrdersStatistics() {
    try {
        if (!await isAdmin()) {
            showToast('أنت لا تملك صلاحيات الإدارة ❌');
            return null;
        }
        
        const snapshot = await db.collection('orders').get();
        
        let totalOrders = 0;
        let totalRevenue = 0;
        let ordersByStatus = {
            pending: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
        };
        
        snapshot.forEach(doc => {
            const order = doc.data();
            totalOrders++;
            totalRevenue += order.total || 0;
            
            if (ordersByStatus.hasOwnProperty(order.status)) {
                ordersByStatus[order.status]++;
            }
        });
        
        return {
            totalOrders,
            totalRevenue,
            ordersByStatus,
            averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
        };
    } catch (error) {
        console.error('خطأ في جلب الإحصائيات:', error);
        return null;
    }
}

// مراقب الطلبات في الوقت الفعلي
function watchUserOrders(callback) {
    if (!currentUser) {
        return null;
    }
    
    return db.collection('orders')
        .where('userId', '==', currentUser.uid)
        .orderBy('createdAt', 'desc')
        .onSnapshot((snapshot) => {
            const orders = [];
            snapshot.forEach(doc => {
                orders.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            if (callback) {
                callback(orders);
            }
        }, (error) => {
            console.error('خطأ في مراقبة الطلبات:', error);
        });
}

// مراقب جميع الطلبات (للمسؤولين)
function watchAllOrders(callback) {
    return db.collection('orders')
        .orderBy('createdAt', 'desc')
        .onSnapshot((snapshot) => {
            const orders = [];
            snapshot.forEach(doc => {
                orders.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            if (callback) {
                callback(orders);
            }
        }, (error) => {
            console.error('خطأ في مراقبة الطلبات:', error);
        });
}

// تحويل حالة الطلب إلى نص عربي
function getOrderStatusInArabic(status) {
    const statusMap = {
        'pending': 'قيد الانتظار',
        'processing': 'قيد المعالجة',
        'shipped': 'تم الشحن',
        'delivered': 'تم التسليم',
        'cancelled': 'ملغى'
    };
    
    return statusMap[status] || status;
}

// حساب إجمالي الطلبات حسب الحالة
async function getOrderCountByStatus() {
    try {
        const snapshot = await db.collection('orders').get();
        
        const counts = {
            pending: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
        };
        
        snapshot.forEach(doc => {
            const order = doc.data();
            if (counts.hasOwnProperty(order.status)) {
                counts[order.status]++;
            }
        });
        
        return counts;
    } catch (error) {
        console.error('خطأ في حساب عدد الطلبات:', error);
        return null;
    }
}
