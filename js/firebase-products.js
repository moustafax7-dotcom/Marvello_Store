// Firebase Products Module
// نظام إدارة المنتجات باستخدام Firestore

// متغير لتخزين المنتجات المحملة
let allProducts = [];
let filteredProducts = [];

// تحميل جميع المنتجات من Firestore
async function loadProductsFromFirebase() {
    try {
        const snapshot = await db.collection('products').get();
        allProducts = [];
        
        snapshot.forEach(doc => {
            allProducts.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log('تم تحميل ' + allProducts.length + ' منتج من Firebase');
        return allProducts;
    } catch (error) {
        console.error('خطأ في تحميل المنتجات:', error);
        showToast('خطأ في تحميل المنتجات ❌');
        return [];
    }
}

// إضافة منتج جديد
async function addProductToFirebase(productData) {
    try {
        if (!await isAdmin()) {
            showToast('أنت لا تملك صلاحيات الإدارة ❌');
            return null;
        }
        
        // إضافة بيانات إضافية
        const newProduct = {
            ...productData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: currentUser.uid,
            reviews: [],
            rating: 0
        };
        
        // إضافة المنتج إلى Firestore
        const docRef = await db.collection('products').add(newProduct);
        
        showToast('تم إضافة المنتج بنجاح ✅');
        
        // إعادة تحميل المنتجات
        await loadProductsFromFirebase();
        
        return docRef.id;
    } catch (error) {
        console.error('خطأ في إضافة المنتج:', error);
        showToast('خطأ في إضافة المنتج: ' + error.message + ' ❌');
        return null;
    }
}

// تحديث منتج
async function updateProductInFirebase(productId, productData) {
    try {
        if (!await isAdmin()) {
            showToast('أنت لا تملك صلاحيات الإدارة ❌');
            return false;
        }
        
        await db.collection('products').doc(productId).update({
            ...productData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: currentUser.uid
        });
        
        showToast('تم تحديث المنتج بنجاح ✅');
        
        // إعادة تحميل المنتجات
        await loadProductsFromFirebase();
        
        return true;
    } catch (error) {
        console.error('خطأ في تحديث المنتج:', error);
        showToast('خطأ في تحديث المنتج: ' + error.message + ' ❌');
        return false;
    }
}

// حذف منتج
async function deleteProductFromFirebase(productId) {
    try {
        if (!await isAdmin()) {
            showToast('أنت لا تملك صلاحيات الإدارة ❌');
            return false;
        }
        
        // تأكيد الحذف
        if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
            return false;
        }
        
        await db.collection('products').doc(productId).delete();
        
        showToast('تم حذف المنتج بنجاح ✅');
        
        // إعادة تحميل المنتجات
        await loadProductsFromFirebase();
        
        return true;
    } catch (error) {
        console.error('خطأ في حذف المنتج:', error);
        showToast('خطأ في حذف المنتج: ' + error.message + ' ❌');
        return false;
    }
}

// الحصول على منتج واحد
async function getProductFromFirebase(productId) {
    try {
        const doc = await db.collection('products').doc(productId).get();
        
        if (doc.exists) {
            return {
                id: doc.id,
                ...doc.data()
            };
        } else {
            console.log('المنتج غير موجود');
            return null;
        }
    } catch (error) {
        console.error('خطأ في جلب المنتج:', error);
        return null;
    }
}

// البحث عن منتجات
function searchProducts(query) {
    if (!query) {
        filteredProducts = allProducts;
    } else {
        query = query.toLowerCase();
        filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
    }
    return filteredProducts;
}

// فلترة المنتجات حسب التصنيف
function filterProductsByCategory(category) {
    if (category === 'all' || !category) {
        filteredProducts = allProducts;
    } else {
        filteredProducts = allProducts.filter(product => product.category === category);
    }
    return filteredProducts;
}

// ترتيب المنتجات
function sortProducts(sortBy) {
    let sorted = [...filteredProducts];
    
    switch(sortBy) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            sorted.sort((a, b) => b.createdAt - a.createdAt);
            break;
        case 'rating':
            sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        default:
            break;
    }
    
    return sorted;
}

// إضافة تقييم للمنتج
async function addReviewToProduct(productId, review) {
    try {
        const product = await getProductFromFirebase(productId);
        
        if (!product) {
            showToast('المنتج غير موجود ❌');
            return false;
        }
        
        const newReview = {
            id: Date.now(),
            userId: currentUser.uid,
            userName: currentUser.displayName || 'مستخدم',
            rating: review.rating,
            comment: review.comment,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // إضافة التقييم
        const reviews = product.reviews || [];
        reviews.push(newReview);
        
        // حساب متوسط التقييم
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / reviews.length;
        
        // تحديث المنتج
        await db.collection('products').doc(productId).update({
            reviews: reviews,
            rating: averageRating
        });
        
        showToast('تم إضافة تقييمك بنجاح ✅');
        return true;
    } catch (error) {
        console.error('خطأ في إضافة التقييم:', error);
        showToast('خطأ في إضافة التقييم ❌');
        return false;
    }
}

// تحديث المخزون بعد الشراء
async function updateProductStock(productId, quantity) {
    try {
        const product = await getProductFromFirebase(productId);
        
        if (!product) {
            showToast('المنتج غير موجود ❌');
            return false;
        }
        
        const newStock = product.stock - quantity;
        
        if (newStock < 0) {
            showToast('الكمية المطلوبة غير متوفرة ❌');
            return false;
        }
        
        await db.collection('products').doc(productId).update({
            stock: newStock
        });
        
        return true;
    } catch (error) {
        console.error('خطأ في تحديث المخزون:', error);
        showToast('خطأ في تحديث المخزون ❌');
        return false;
    }
}

// الحصول على المنتجات الأكثر مبيعاً
async function getTopSellingProducts(limit = 5) {
    try {
        const snapshot = await db.collection('products')
            .orderBy('sales', 'desc')
            .limit(limit)
            .get();
        
        const products = [];
        snapshot.forEach(doc => {
            products.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return products;
    } catch (error) {
        console.error('خطأ في جلب المنتجات الأكثر مبيعاً:', error);
        return [];
    }
}

// الحصول على المنتجات الجديدة
async function getNewProducts(limit = 5) {
    try {
        const snapshot = await db.collection('products')
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();
        
        const products = [];
        snapshot.forEach(doc => {
            products.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return products;
    } catch (error) {
        console.error('خطأ في جلب المنتجات الجديدة:', error);
        return [];
    }
}

// مراقب المنتجات في الوقت الفعلي
function watchProducts(callback) {
    return db.collection('products').onSnapshot((snapshot) => {
        allProducts = [];
        snapshot.forEach(doc => {
            allProducts.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        if (callback) {
            callback(allProducts);
        }
    }, (error) => {
        console.error('خطأ في مراقبة المنتجات:', error);
    });
}
