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
    } catch (e) { grid.innerHTML = '<p>خطأ</p>'; }
}

function renderProducts(list) {
    const grid = document.getElementById('productsGrid'); grid.innerHTML = '';
    if(list.length===0) { grid.innerHTML = '<p>لا توجد نتائج</p>'; return; }
    list.forEach(p => {
        // حساب الخصم
        let priceBlock = `<span class="price">${p.price} ج.م</span>`;
        if(p.oldPrice && p.oldPrice > p.price) {
            priceBlock = `
                <div style="display:flex; align-items:center; justify-content:center; gap:5px;">
                    <span style="text-decoration:line-through; color:#777; font-size:13px;">${p.oldPrice}</span>
                    <span class="price" style="margin:0;">${p.price} ج.م</span>
                </div>
            `;
        }

        grid.innerHTML += `
            <div class="product-card" onclick="window.location.href='product-details.html?id=${p.id}'">
                <div class="product-image-container"><img src="${p.images ? p.images[0] : p.image}" alt="${p.name}"></div>
                <div class="card-body">
                    <h3>${p.name}</h3>
                    ${priceBlock}
                    <button class="btn btn-primary" style="width:100%">عرض التفاصيل</button>
                </div>
            </div>`;
    });
}
// باقي دوال البحث والفلتر زي ما هي...
function searchProducts(q) { renderProducts(allProducts.filter(p => p.name.includes(q))); }
function filterCategory(c, btn) {
    document.querySelectorAll('.categories-btn-group button').forEach(b => b.classList.remove('active')); 
    if(btn) btn.classList.add('active');
    renderProducts(c === 'all' ? allProducts : allProducts.filter(p => p.category === c));
}
