// js/products.js

let allProducts = [];

// جلب المنتجات عند تحميل الصفحة
async function loadProducts() {
    const grid = document.getElementById('productsGrid');
    if(!grid) return; // لو مش في صفحة المنتجات اخرج

    grid.innerHTML = '<p style="text-align:center; width:100%;">جاري تحميل المنتجات...</p>';

    try {
        // 1. محاولة جلب البيانات من ملف JSON
        const response = await fetch('../data/products.json');
        const jsonData = await response.json();
        
        // 2. جلب المنتجات المضاف من الأدمن (Local Storage)
        const localData = JSON.parse(localStorage.getItem('marvelloProducts')) || [];
        
        // 3. دمج الاثنين
        allProducts = [...jsonData, ...localData];
        
        // 4. عرض النتيجة
        renderProducts(allProducts);

    } catch (error) {
        console.error("Error:", error);
        grid.innerHTML = '<p>حدث خطأ في تحميل البيانات.</p>';
    }
}

// دالة رسم المنتجات في الشاشة
function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    if(!grid) return;

    grid.innerHTML = '';

    if(products.length === 0) {
        grid.innerHTML = '<p style="text-align:center;">لا توجد منتجات مطابقة.</p>';
        return;
    }

    products.forEach(product => {
        // التأكد من المفضلة
        const wishlist = JSON.parse(localStorage.getItem('marvelloWishlist')) || [];
        const isLoved = wishlist.includes(product.id) ? 'active' : '';

        grid.innerHTML += `
            <div class="product-card">
                <div class="wishlist-icon ${isLoved}" onclick="toggleWishlist(${product.id}, this)">
                    <i class="fas fa-heart"></i>
                </div>
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="card-body">
                    <h3>${product.name}</h3>
                    <span class="price">${product.price} ج.م</span>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})" style="width:100%">
                        <i class="fas fa-cart-plus"></i> إضافة للسلة
                    </button>
                </div>
            </div>
        `;
    });
}

// البحث
function searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(lowerQuery));
    renderProducts(filtered);
}

// الفلترة
function filterCategory(category, btn) {
    // تحديث شكل الأزرار
    document.querySelectorAll('.categories-btn-group button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (category === 'all') {
        renderProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category === category);
        renderProducts(filtered);
    }
}