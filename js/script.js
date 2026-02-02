// js/script.js - تحسينات شاملة

// عند تحميل أي صفحة، حدث عداد السلة
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateWishlistUI();
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
        // إظهار/إخفاء الشارة بناءً على العدد
        countSpan.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// نظام المفضلة (Wishlist)
function toggleWishlist(id, iconElement) {
    let wishlist = JSON.parse(localStorage.getItem('marvelloWishlist')) || [];
    
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(itemId => itemId !== id);
        if(iconElement) iconElement.classList.remove('active');
        showToast('تم الحذف من المفضلة ❌');
    } else {
        wishlist.push(id);
        if(iconElement) iconElement.classList.add('active');
        showToast('تم الإضافة للمفضلة ❤️');
    }
    localStorage.setItem('marvelloWishlist', JSON.stringify(wishlist));
}

// تحديث واجهة المفضلة
function updateWishlistUI() {
    const wishlist = JSON.parse(localStorage.getItem('marvelloWishlist')) || [];
    document.querySelectorAll('.wishlist-icon').forEach(icon => {
        const productId = parseInt(icon.dataset.productId);
        if(wishlist.includes(productId)) {
            icon.classList.add('active');
        } else {
            icon.classList.remove('active');
        }
    });
}

// دالة مساعدة لعمل إشعار سريع (Toast)
function showToast(message) {
    // إنشاء عنصر الإشعار لو مش موجود
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
    
    // حركة الظهور
    toast.style.animation = 'slideIn 0.3s ease-in-out';
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// إضافة الحركات للـ Toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// مراقبة التغييرات في localStorage
window.addEventListener('storage', () => {
    updateCartCount();
    updateWishlistUI();
});
