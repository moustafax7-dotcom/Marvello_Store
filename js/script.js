// js/script.js

// عند تحميل أي صفحة، حدث عداد السلة
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

// إضافة منتج للسلة
function addToCart(id) {
    // نجيب المنتج من القائمة المحملة في الذاكرة (allProducts عرفناها في الملف التاني)
    // أو نجيبه من الـ LocalStorage لو إحنا في صفحة تانية
    // للتبسيط هنا هنعتمد إننا بنضيف من الصفحة الرئيسية غالباً
    
    // 1. هات السلة القديمة
    let cart = JSON.parse(localStorage.getItem('marvelloCart')) || [];
    
    // 2. هل المنتج موجود بالفعل؟
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity++; // زود العدد
    } else {
        // لو مش موجود، لازم نجيب تفاصيله. 
        // ملحوظة: في التطبيق الحقيقي بنجيب التفاصيل من الداتابيز.
        // هنا هنجيبها من المتغير allProducts اللي في ملف products.js
        const product = allProducts.find(p => p.id === id);
        if(product) {
            cart.push({ ...product, quantity: 1 });
        }
    }

    // 3. احفظ وحدث العداد
    localStorage.setItem('marvelloCart', JSON.stringify(cart));
    updateCartCount();
    
    // إشعار بسيط (Toast) بدل الـ Alert المزعج
    showToast('تمت الإضافة للسلة بنجاح ✅');
}

// تحديث الرقم الأحمر فوق السلة
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('marvelloCart')) || [];
    const countSpan = document.getElementById('cartCount');
    if(countSpan) {
        // نجمع كميات المنتجات مش بس عدد العناصر
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        countSpan.innerText = totalItems;
    }
}

// نظام المفضلة (Wishlist)
function toggleWishlist(id, iconElement) {
    let wishlist = JSON.parse(localStorage.getItem('marvelloWishlist')) || [];
    
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(itemId => itemId !== id);
        iconElement.classList.remove('active');
    } else {
        wishlist.push(id);
        iconElement.classList.add('active');
    }
    localStorage.setItem('marvelloWishlist', JSON.stringify(wishlist));
}

// دالة مساعدة لعمل إشعار سريع
function showToast(message) {
    // إنشاء عنصر الإشعار لو مش موجود
    let toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '20px';
    toast.style.background = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '9999';
    toast.innerText = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}