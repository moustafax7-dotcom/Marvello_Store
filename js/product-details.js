// js/product-details.js

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

let currentProduct = null;
let selectedSize = null;
let selectedColor = null;
let currentRating = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
    setupStars();
});

function loadProductDetails() {
    const products = JSON.parse(localStorage.getItem('marvelloProducts')) || [];
    currentProduct = products.find(p => p.id == productId);

    if (!currentProduct) {
        document.getElementById('productDetailsContainer').innerHTML = "<h2>المنتج غير موجود :(</h2>";
        return;
    }

    const container = document.getElementById('productDetailsContainer');
    
    // عرض السعر والخصم
    let priceHtml = `<span style="font-size:24px; color:#b12704; font-weight:bold;">${currentProduct.price} ج.م</span>`;
    if(currentProduct.oldPrice > currentProduct.price) {
        priceHtml += `<span style="text-decoration:line-through; color:#565959; font-size:14px; margin-right:10px;">${currentProduct.oldPrice} ج.م</span>`;
    }

    // المخزون
    let stockHtml = "";
    if (currentProduct.stock <= 0) stockHtml = "<div class='stock-warning'>نفذت الكمية!</div>";
    else if (currentProduct.stock < 10) stockHtml = `<div class='stock-warning'>تبقى ${currentProduct.stock} فقط - اطلبه الآن!</div>`;
    else stockHtml = "<div class='stock-status'>متوفر في المخزون</div>";

    // الصور المصغرة
    let thumbs = currentProduct.images.map((img, i) => 
        `<img src="${img}" class="thumb ${i===0?'active':''}" onclick="changeImg('${img}', this)">`
    ).join('');

    // الفيديو
    let video = currentProduct.video ? `<div style="margin-top:20px;"><iframe width="100%" height="300" src="${currentProduct.video}" frameborder="0" allowfullscreen></iframe></div>` : "";

    container.innerHTML = `
        <div class="details-images">
            <img src="${currentProduct.images[0]}" id="mainImage" class="main-img">
            <div class="thumbnails">${thumbs}</div>
            ${video}
        </div>
        <div class="details-info">
            <h1 class="details-title">${currentProduct.name}</h1>
            ${priceHtml}
            ${stockHtml}
            <p style="margin:15px 0; color:#333; line-height:1.5;">${currentProduct.description}</p>
            
            ${currentProduct.sizes && currentProduct.sizes.length > 0 ? `
                <div class="variant-section"><strong>المقاس:</strong> ${currentProduct.sizes.map(s => `<button class="variant-btn" onclick="selSize(this, '${s}')">${s}</button>`).join('')}</div>
            ` : ''}

            ${currentProduct.colors && currentProduct.colors.length > 0 ? `
                <div class="variant-section"><strong>اللون:</strong> ${currentProduct.colors.map(c => `<button class="variant-btn" onclick="selColor(this, '${c}')">${c}</button>`).join('')}</div>
            ` : ''}

            <button onclick="addToCartDetailed()" class="btn-primary" style="width:100%; padding:15px; font-size:16px; margin-top:10px;">
                <i class="fas fa-cart-plus"></i> إضافة إلى العربة
            </button>
        </div>
    `;
    renderReviews();
}

window.changeImg = function(src, el) {
    document.getElementById('mainImage').src = src;
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
}

window.selSize = function(el, size) {
    document.querySelectorAll('.variant-section button').forEach(b => {
        if(currentProduct.sizes.includes(b.innerText)) b.classList.remove('selected');
    });
    el.classList.add('selected');
    selectedSize = size;
}

window.selColor = function(el, color) {
    const siblings = el.parentElement.querySelectorAll('button');
    siblings.forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
    selectedColor = color;
}

window.addToCartDetailed = function() {
    if(currentProduct.stock <= 0) return alert("نفذت الكمية!");
    if(currentProduct.sizes.length > 0 && !selectedSize) return alert("اختر المقاس أولاً");
    if(currentProduct.colors.length > 0 && !selectedColor) return alert("اختر اللون أولاً");

    let cart = JSON.parse(localStorage.getItem('marvelloCart')) || [];
    const uniqueId = currentProduct.id + (selectedSize||'') + (selectedColor||'');
    const exist = cart.find(i => i.uniqueId === uniqueId);

    if(exist) exist.quantity++;
    else cart.push({ ...currentProduct, uniqueId, selectedSize, selectedColor, quantity: 1 });

    localStorage.setItem('marvelloCart', JSON.stringify(cart));
    alert("تمت الإضافة للسلة!");
    window.location.href = "cart.html";
}

// التقييمات
function setupStars() {
    document.querySelectorAll('.star').forEach(s => s.addEventListener('click', () => {
        currentRating = s.dataset.val;
        document.querySelectorAll('.star').forEach(st => st.classList.toggle('gold', st.dataset.val <= currentRating));
    }));
}

window.submitReview = function() {
    if(currentRating === 0) return alert("قيم بالنجوم أولاً");
    const user = JSON.parse(localStorage.getItem('marvelloUser')) || {name: "عميل"};
    const review = { user: user.name, rating: currentRating, comment: document.getElementById('reviewComment').value, date: new Date().toLocaleDateString() };
    
    if(!currentProduct.reviews) currentProduct.reviews = [];
    currentProduct.reviews.push(review);
    
    let products = JSON.parse(localStorage.getItem('marvelloProducts'));
    const idx = products.findIndex(p => p.id == productId);
    products[idx] = currentProduct;
    localStorage.setItem('marvelloProducts', JSON.stringify(products));
    
    renderReviews();
    document.getElementById('reviewComment').value = "";
    currentRating = 0;
    document.querySelectorAll('.star').forEach(s => s.classList.remove('gold'));
}

function renderReviews() {
    const list = document.getElementById('reviewsList');
    if(!currentProduct.reviews || currentProduct.reviews.length === 0) { list.innerHTML = "<p>لا توجد تقييمات.</p>"; return; }
    list.innerHTML = currentProduct.reviews.map(r => `
        <div style="margin-bottom:10px; padding-bottom:10px; border-bottom:1px solid #eee;">
            <strong>${r.user}</strong> <span style="color:#ffa41c;">${'★'.repeat(r.rating)}</span> <span style="font-size:12px; color:#777;">${r.date}</span>
            <p>${r.comment}</p>
        </div>
    `).join('');
}