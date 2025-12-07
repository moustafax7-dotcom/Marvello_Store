// js/products.js
let allProducts = [];

async function loadProducts() {
    const grid = document.getElementById('productsGrid'); 
    if(!grid) return;
    grid.innerHTML = '<p style="text-align:center;">جاري التحميل...</p>';
    try {
        const res = await fetch('../data/products.json'); 
        const json = await res.json();
        const local = JSON.parse(localStorage.getItem('marvelloProducts')) || [];
        allProducts = [...json, ...local]; 
        renderProducts(allProducts);
    } catch (e) { grid.innerHTML = '<p>خطأ في تحميل المنتجات</p>'; }
}

function renderProducts(list) {
    const grid = document.getElementById('productsGrid'); 
    grid.innerHTML = '';
    if(list.length===0) { 
        grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">لا توجد نتائج</p>'; 
        return; 
    }
    
    const wishlist = JSON.parse(localStorage.getItem('marvelloWishlist')) || [];
    
    list.forEach(p => {
        // حساب الخصم والنسبة المئوية
        let discountPercent = 0;
        let priceBlock = `<span class="price">${p.price} ج.م</span>`;
        
        if(p.oldPrice && p.oldPrice > p.price) {
            discountPercent = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
            priceBlock = `
                <div style="display:flex; align-items:center; justify-content:center; gap:5px;">
                    <span style="text-decoration:line-through; color:#777; font-size:13px;">${p.oldPrice}</span>
                    <span class="price" style="margin:0;">${p.price} ج.م</span>
                </div>
            `;
        }
        
        // حساب حالة المخزون
        let stockClass = p.stock > 10 ? 'in-stock' : p.stock > 0 ? 'low-stock' : 'out-of-stock';
        let stockText = p.stock > 10 ? 'متوفر' : p.stock > 0 ? `تبقى ${p.stock}` : 'نفذت';
        
        // تحديد حالة المفضلة
        const isWishlisted = wishlist.includes(p.id);
        const wishlistClass = isWishlisted ? 'active' : '';

        grid.innerHTML += `
            <div class="product-card">
                <div class="product-image-container">
                    <img src="${p.images ? p.images[0] : p.image}" alt="${p.name}" onclick="window.location.href='product-details.html?id=${p.id}'" style="cursor:pointer;">
                    ${discountPercent > 0 ? `<div class="discount-badge">-${discountPercent}%</div>` : ''}
                    <div class="wishlist-icon ${wishlistClass}" data-product-id="${p.id}" onclick="event.stopPropagation(); toggleWishlist(${p.id}, this)">
                        <i class="fas fa-heart"></i>
                    </div>
                    <div class="stock-badge ${stockClass}">${stockText}</div>
                </div>
                <div class="card-body">
                    <h3 onclick="window.location.href='product-details.html?id=${p.id}'" style="cursor:pointer;">${p.name}</h3>
                    ${priceBlock}
                    <button class="btn btn-primary" style="width:100%" onclick="window.location.href='product-details.html?id=${p.id}'">عرض التفاصيل</button>
                </div>
            </div>`;
    });
}

// دوال البحث والفلتر
function searchProducts(q) { 
    renderProducts(allProducts.filter(p => p.name.includes(q))); 
}

function filterCategory(c, btn) {
    document.querySelectorAll('.categories-btn-group button').forEach(b => b.classList.remove('active')); 
    if(btn) btn.classList.add('active');
    renderProducts(c === 'all' ? allProducts : allProducts.filter(p => p.category === c));
}
