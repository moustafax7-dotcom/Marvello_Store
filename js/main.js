// ============================================================
// MARVELLO v2 — Complete JavaScript
// Cart · Wishlist · Reviews · Tracking · Skeletons · Toast
// ============================================================

// ── DATA ──────────────────────────────────────────────────────
const PRODUCTS = [
  { id:1, name:'Structured Blazer',    category:'jackets',      price:1850, oldPrice:2400, badge:'sale',
    image:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
    images:['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80','https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=600&q=80'],
    sizes:['XS','S','M','L','XL'], colors:['black','white'], rating:4.8, reviews:42,
    description:'A tailored structured blazer crafted from premium Italian wool blend. Features sharp lapels and a modern silhouette perfect for any occasion.' },
  { id:2, name:'Slim Tapered Trousers',category:'pants',        price:950,  oldPrice:null, badge:'new',
    image:'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80',
    images:['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80','https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80'],
    sizes:['S','M','L','XL'], colors:['black','gray'], rating:4.5, reviews:28,
    description:'Slim tapered trousers with a clean, minimalist cut. Made from a wrinkle-resistant fabric blend for all-day comfort.' },
  { id:3, name:'Oversized Linen Shirt',category:'shirts',       price:720,  oldPrice:null, badge:null,
    image:'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80',
    images:['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80'],
    sizes:['XS','S','M','L','XL','XXL'], colors:['white','beige'], rating:4.6, reviews:19,
    description:'An oversized linen shirt with a relaxed silhouette and breathable fabric. Perfect for a smart casual look.' },
  { id:4, name:'Minimal Leather Belt',  category:'accessories',  price:480,  oldPrice:null, badge:null,
    image:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    images:['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80'],
    sizes:['S','M','L'], colors:['black','brown'], rating:4.9, reviews:65,
    description:'Hand-stitched genuine leather belt with a brushed gold buckle. The perfect finishing touch.' },
  { id:5, name:'Relaxed Jogger Pants',  category:'pants',        price:780,  oldPrice:1100, badge:'sale',
    image:'https://images.unsplash.com/photo-1556906781-9a412961a28f?w=600&q=80',
    images:['https://images.unsplash.com/photo-1556906781-9a412961a28f?w=600&q=80'],
    sizes:['S','M','L','XL'], colors:['black','gray'], rating:4.3, reviews:31,
    description:'Premium cotton jogger pants with a tapered leg and elastic waistband. Effortlessly comfortable.' },
  { id:6, name:'Crewneck Essential Tee',category:'tshirts',      price:380,  oldPrice:null, badge:'new',
    image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    images:['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80','https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80'],
    sizes:['XS','S','M','L','XL','XXL'], colors:['white','black','gray'], rating:4.7, reviews:88,
    description:'The essential crewneck t-shirt made from 100% Pima cotton. A wardrobe staple.' },
  { id:7, name:'Suede Chelsea Boots',   category:'shoes',        price:2200, oldPrice:null, badge:null,
    image:'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&q=80',
    images:['https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&q=80'],
    sizes:['39','40','41','42','43','44'], colors:['black','brown'], rating:4.8, reviews:24,
    description:'Classic Chelsea boots crafted from premium suede leather with elastic side panels.' },
  { id:8, name:'Heavyweight Hoodie',    category:'jackets',      price:1100, oldPrice:null, badge:null,
    image:'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80',
    images:['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80'],
    sizes:['S','M','L','XL','XXL'], colors:['gray','black'], rating:4.6, reviews:53,
    description:'A heavyweight French terry hoodie with a clean, minimal design. Built to last.' }
];

const COUPONS = {
  'MARVELLO10': { type:'percent', value:10, label:'10% off' },
  'WELCOME20':  { type:'percent', value:20, label:'20% off' },
  'SAVE100':    { type:'fixed',   value:100, label:'EGP 100 off' }
};

// ── STATE ──────────────────────────────────────────────────────
let cart     = JSON.parse(localStorage.getItem('mv_cart')     || '[]');
let wishlist = JSON.parse(localStorage.getItem('mv_wishlist') || '[]');
let reviews  = JSON.parse(localStorage.getItem('mv_reviews')  || '{}');
let appliedCoupon = null;

// ── FORMAT ────────────────────────────────────────────────────
const fmt = (n) => 'EGP ' + Number(n).toLocaleString('en-EG');
const stars = (r) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));

// ── SAVE ──────────────────────────────────────────────────────
function saveCart()     { localStorage.setItem('mv_cart',     JSON.stringify(cart));     updateCartBadge(); }
function saveWishlist() { localStorage.setItem('mv_wishlist', JSON.stringify(wishlist)); updateWishBadge(); }
function saveReviews()  { localStorage.setItem('mv_reviews',  JSON.stringify(reviews));  }

// ── BADGES ────────────────────────────────────────────────────
function updateCartBadge() {
  const total = cart.reduce((s,i) => s + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(b => {
    b.textContent = total;
    b.style.display = total > 0 ? 'flex' : 'none';
  });
}
function updateWishBadge() {
  document.querySelectorAll('.wish-badge').forEach(b => {
    b.textContent = wishlist.length;
    b.style.display = wishlist.length > 0 ? 'flex' : 'none';
  });
}

// ── TOAST ─────────────────────────────────────────────────────
function toast(msg, duration = 3000) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.innerHTML = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), duration);
}

// ── CART ──────────────────────────────────────────────────────
function addToCart(productId, size = 'M', qty = 1) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;
  const idx = cart.findIndex(i => i.id === productId && i.size === size);
  if (idx > -1) { cart[idx].qty += qty; }
  else { cart.push({ id:productId, name:p.name, price:p.price, image:p.image, size, qty }); }
  saveCart(); renderCartDrawer();
  toast(`<i class="fas fa-check-circle"></i> <strong>${p.name}</strong> added to bag`);
}
function removeFromCart(id, size) {
  cart = cart.filter(i => !(i.id===id && i.size===size));
  saveCart(); renderCartDrawer();
}
function updateQty(id, size, delta) {
  const item = cart.find(i => i.id===id && i.size===size);
  if (item) { item.qty = Math.max(1, item.qty + delta); saveCart(); renderCartDrawer(); }
}
function cartSubtotal() { return cart.reduce((s,i) => s + i.price * i.qty, 0); }
function cartDiscount() {
  if (!appliedCoupon) return 0;
  const c = COUPONS[appliedCoupon];
  if (!c) return 0;
  return c.type === 'percent' ? Math.round(cartSubtotal() * c.value / 100) : c.value;
}
function cartShipping() { return cartSubtotal() - cartDiscount() >= 2000 ? 0 : 150; }
function cartTotal()    { return cartSubtotal() - cartDiscount() + cartShipping(); }

function applyCoupon(code) {
  const c = COUPONS[code.toUpperCase()];
  if (c) {
    appliedCoupon = code.toUpperCase();
    toast(`<i class="fas fa-tag"></i> Coupon applied — ${c.label}!`);
    return true;
  } else {
    toast('<i class="fas fa-times-circle"></i> Invalid coupon code');
    return false;
  }
}

// ── WISHLIST ───────────────────────────────────────────────────
function toggleWishlist(productId) {
  const p   = PRODUCTS.find(x => x.id === productId);
  const idx = wishlist.findIndex(i => i.id === productId);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    toast(`<i class="far fa-heart"></i> Removed from wishlist`);
  } else {
    wishlist.push({ id:productId, name:p.name, price:p.price, image:p.image });
    toast(`<i class="fas fa-heart" style="color:#c0392b"></i> Added to wishlist`);
  }
  saveWishlist(); updateWishlistBtns(); renderWishlistDrawer();
}
function isWishlisted(id) { return wishlist.some(i => i.id === id); }
function updateWishlistBtns() {
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const id = parseInt(btn.dataset.id);
    btn.classList.toggle('active', isWishlisted(id));
    btn.innerHTML = isWishlisted(id) ? '<i class="fas fa-heart" style="color:#c0392b"></i>' : '<i class="far fa-heart"></i>';
  });
}
function moveToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (p) { addToCart(id, p.sizes[0] || 'M', 1); }
  wishlist = wishlist.filter(i => i.id !== id);
  saveWishlist(); renderWishlistDrawer(); updateWishlistBtns();
}

// ── DRAWERS ────────────────────────────────────────────────────
function openCart()     { document.querySelector('.cart-drawer')?.classList.add('open'); document.querySelector('.overlay')?.classList.add('open'); document.body.style.overflow='hidden'; }
function closeCart()    { document.querySelector('.cart-drawer')?.classList.remove('open'); closeOverlay(); }
function openWishlist() { document.querySelector('.wishlist-drawer')?.classList.add('open'); document.querySelector('.overlay')?.classList.add('open'); document.body.style.overflow='hidden'; }
function closeWishlist(){ document.querySelector('.wishlist-drawer')?.classList.remove('open'); closeOverlay(); }
function closeOverlay() {
  const anyOpen = document.querySelector('.cart-drawer.open') || document.querySelector('.wishlist-drawer.open');
  if (!anyOpen) { document.querySelector('.overlay')?.classList.remove('open'); document.body.style.overflow=''; }
}

function renderCartDrawer() {
  const body  = document.querySelector('.drawer-body');
  const subEl = document.querySelector('.drawer-subtotal-val');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty-state">
        <i class="fas fa-shopping-bag"></i>
        <p>Your bag is empty</p>
        <span>Discover the new collection</span>
        <a href="pages/shop.html" class="btn btn-black" style="margin-top:16px;">Shop Now</a>
      </div>`;
  } else {
    body.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&q=60'">
        <div class="cart-item-body">
          <div>
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-meta">Size: ${item.size}</div>
          </div>
          <div class="cart-item-bottom">
            <div class="qty-control">
              <button onclick="updateQty(${item.id},'${item.size}',-1)"><i class="fas fa-minus"></i></button>
              <span>${item.qty}</span>
              <button onclick="updateQty(${item.id},'${item.size}',1)"><i class="fas fa-plus"></i></button>
            </div>
            <span class="cart-item-price">${fmt(item.price * item.qty)}</span>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id},'${item.size}')">Remove</button>
        </div>
      </div>`).join('');
  }
  if (subEl) subEl.textContent = fmt(cartSubtotal());
}

function renderWishlistDrawer() {
  const body = document.querySelector('.wishlist-drawer .drawer-body');
  if (!body) return;
  if (wishlist.length === 0) {
    body.innerHTML = `
      <div class="cart-empty-state">
        <i class="far fa-heart"></i>
        <p>Wishlist is empty</p>
        <span>Save items you love</span>
      </div>`;
  } else {
    body.innerHTML = wishlist.map(item => `
      <div class="wishlist-item">
        <img class="wishlist-item-img" src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&q=60'">
        <div>
          <div class="wishlist-item-name">${item.name}</div>
          <div class="wishlist-item-price">${fmt(item.price)}</div>
        </div>
        <div class="wishlist-item-actions">
          <button class="wishlist-move-cart" onclick="moveToCart(${item.id})">Add to Bag</button>
          <button class="wishlist-remove" onclick="toggleWishlist(${item.id})"><i class="fas fa-times"></i></button>
        </div>
      </div>`).join('');
  }
}

// ── PRODUCT CARD RENDERER ─────────────────────────────────────
function renderProducts(containerId, products, skeleton = false) {
  const el = document.getElementById(containerId);
  if (!el) return;

  if (skeleton) {
    el.innerHTML = Array(8).fill(0).map(() => `
      <div class="product-card skeleton-card">
        <div class="product-img-wrap skeleton skeleton-img"></div>
        <div class="product-info">
          <div class="skeleton skeleton-line w-80"></div>
          <div class="skeleton skeleton-line w-50" style="margin-top:6px;"></div>
          <div class="skeleton skeleton-line w-30" style="margin-top:8px;"></div>
        </div>
      </div>`).join('');
    return;
  }

  el.innerHTML = products.map(p => `
    <div class="product-card" onclick="goProduct(${p.id})">
      <div class="product-img-wrap">
        ${p.badge ? `<span class="product-badge badge-${p.badge}">${p.badge}</span>` : ''}
        <img class="product-img" src="${p.image}" alt="${p.name}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=60'">
        <button class="wishlist-btn ${isWishlisted(p.id)?'active':''}" data-id="${p.id}"
                onclick="event.stopPropagation();toggleWishlist(${p.id})">
          <i class="${isWishlisted(p.id)?'fas':'far'} fa-heart" ${isWishlisted(p.id)?'style="color:#c0392b"':''}></i>
        </button>
        <button class="quick-add" onclick="event.stopPropagation();quickAdd(${p.id})">
          <i class="fas fa-shopping-bag"></i> Quick Add
        </button>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-cat">${p.category}</div>
        <div class="product-price">
          <span class="price-now">${fmt(p.price)}</span>
          ${p.oldPrice ? `<span class="price-old">${fmt(p.oldPrice)}</span><span class="price-off">-${Math.round((1-p.price/p.oldPrice)*100)}%</span>` : ''}
        </div>
      </div>
    </div>`).join('');
}

function goProduct(id) {
  const base = window.location.pathname.includes('/pages/') ? '' : 'pages/';
  window.location.href = `${base}product.html?id=${id}`;
}

function quickAdd(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  addToCart(id, p.sizes[0] || 'M', 1);
  openCart();
}

// ── REVIEWS ────────────────────────────────────────────────────
const DEFAULT_REVIEWS = {
  1: [
    { name:'Ahmed H.',    rating:5, text:'Absolutely stunning blazer. The quality is beyond expectations.', date:'Mar 2026' },
    { name:'Sara M.',     rating:4, text:'Beautiful cut, true to size. Highly recommend.', date:'Feb 2026' },
    { name:'Omar K.',     rating:5, text:'Premium feel, perfect for business and events.', date:'Jan 2026' }
  ],
  6: [
    { name:'Nour A.',     rating:5, text:'Best basic tee I\'ve ever owned. So soft!', date:'Mar 2026' },
    { name:'Youssef T.',  rating:4, text:'Great quality, fast delivery.', date:'Feb 2026' }
  ]
};

function getProductReviews(productId) {
  const custom   = reviews[productId] || [];
  const defaults = DEFAULT_REVIEWS[productId] || [];
  return [...custom, ...defaults];
}

function addReview(productId, review) {
  if (!reviews[productId]) reviews[productId] = [];
  reviews[productId].unshift(review);
  saveReviews();
}

function renderReviews(productId, containerId) {
  const el   = document.getElementById(containerId);
  if (!el) return;
  const list = getProductReviews(productId);
  const avg  = list.length ? (list.reduce((s,r) => s + r.rating, 0) / list.length).toFixed(1) : 0;

  // Rating bars
  const barData = [5,4,3,2,1].map(s => {
    const cnt = list.filter(r => r.rating === s).length;
    return { star:s, pct: list.length ? Math.round(cnt/list.length*100) : 0 };
  });

  el.innerHTML = `
    <div class="reviews-section">
      <div class="section-label">Customer Feedback</div>
      <h2 class="section-title">Reviews & Ratings</h2>
      <div class="reviews-summary">
        <div class="reviews-score">
          <div class="big">${avg}</div>
          <div class="stars">${'★'.repeat(Math.round(avg))}${'☆'.repeat(5-Math.round(avg))}</div>
          <div class="count">${list.length} reviews</div>
        </div>
        <div class="review-bars">
          ${barData.map(b => `
            <div class="review-bar-row">
              <span class="review-bar-label">${b.star}</span>
              <div class="review-bar-track"><div class="review-bar-fill" style="width:${b.pct}%"></div></div>
              <span class="review-bar-pct">${b.pct}%</span>
            </div>`).join('')}
        </div>
      </div>

      <div class="reviews-grid">
        ${list.slice(0,6).map(r => `
          <div class="review-card">
            <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
            <p class="review-text">"${r.text}"</p>
            <div class="reviewer">
              <div class="reviewer-avatar">${r.name.charAt(0)}</div>
              <div>
                <div class="reviewer-name">${r.name}</div>
                <div class="reviewer-date">${r.date || ''}</div>
              </div>
            </div>
          </div>`).join('')}
      </div>

      <!-- Write Review -->
      <div class="write-review">
        <h3 class="write-review-title">Write a Review</h3>
        <div class="star-rating" id="starRating">
          ${[1,2,3,4,5].map(s => `<button class="star-btn" data-star="${s}" onclick="setRating(${s})">★</button>`).join('')}
        </div>
        <div class="review-form-grid">
          <input class="review-input" id="reviewName" placeholder="Your name">
          <input class="review-input" id="reviewDate" type="month" value="${new Date().toISOString().slice(0,7)}">
        </div>
        <textarea class="review-input" id="reviewText" placeholder="Share your experience..." style="margin-bottom:16px;"></textarea>
        <button class="btn btn-black" onclick="submitReview(${productId}, '${containerId}')">
          <i class="fas fa-paper-plane"></i> Submit Review
        </button>
      </div>
    </div>`;
}

let selectedRating = 5;
function setRating(r) {
  selectedRating = r;
  document.querySelectorAll('.star-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i < r);
  });
}

function submitReview(productId, containerId) {
  const name = document.getElementById('reviewName')?.value.trim();
  const text = document.getElementById('reviewText')?.value.trim();
  const date = document.getElementById('reviewDate')?.value;
  if (!name || !text) { toast('<i class="fas fa-exclamation-circle"></i> Please fill in name and review'); return; }
  addReview(productId, { name, rating: selectedRating, text, date: date || 'Recently' });
  renderReviews(productId, containerId);
  toast('<i class="fas fa-check-circle"></i> Review submitted, thank you!');
}

// ── ORDER TRACKING ─────────────────────────────────────────────
const SAMPLE_ORDERS = {
  'MRV-1042': {
    id:'MRV-1042', date:'March 6, 2026', status:'delivered',
    items:[{ name:'Structured Blazer', size:'M', qty:1, price:1850, image:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&q=60' }],
    steps:[
      { title:'Order Placed',    desc:'We received your order',              done:true  },
      { title:'Processing',      desc:'Your order is being prepared',        done:true  },
      { title:'Shipped',         desc:'Your order is on its way',            done:true  },
      { title:'Out for Delivery',desc:'Your package is with the courier',    done:true  },
      { title:'Delivered',       desc:'Your order has been delivered',       done:true, current:false }
    ]
  },
  'MRV-1041': {
    id:'MRV-1041', date:'March 5, 2026', status:'shipped',
    items:[{ name:'Slim Tapered Trousers', size:'L', qty:1, price:950, image:'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&q=60' }],
    steps:[
      { title:'Order Placed',    desc:'We received your order',              done:true  },
      { title:'Processing',      desc:'Your order is being prepared',        done:true  },
      { title:'Shipped',         desc:'Your order is on its way',            done:true, current:true },
      { title:'Out for Delivery',desc:'Your package is with the courier',    done:false },
      { title:'Delivered',       desc:'Your order has been delivered',       done:false }
    ]
  }
};

function trackOrder(orderId) {
  const resultEl = document.getElementById('trackingResult');
  if (!resultEl) return;
  const order = SAMPLE_ORDERS[orderId.toUpperCase()];
  if (!order) {
    resultEl.innerHTML = `
      <div style="text-align:center;padding:60px;color:var(--gray-400);">
        <i class="fas fa-search" style="font-size:2.5rem;margin-bottom:16px;display:block;"></i>
        <p style="font-family:var(--font-display);font-size:1.4rem;color:var(--black);">Order not found</p>
        <p style="font-size:13px;margin-top:8px;">Try: MRV-1042 or MRV-1041</p>
      </div>`;
    return;
  }

  const doneCount = order.steps.filter(s => s.done).length;
  const fillPct   = ((doneCount - 1) / (order.steps.length - 1) * 100);

  resultEl.innerHTML = `
    <div class="tracking-result">
      <div class="tracking-id">Order #${order.id}</div>
      <div class="tracking-date">Placed on ${order.date}</div>
      <div class="tracking-steps">
        <div class="tracking-line">
          <div class="tracking-line-fill" style="height:${fillPct}%"></div>
        </div>
        ${order.steps.map(s => `
          <div class="tracking-step">
            <div class="step-dot ${s.current?'current':s.done?'done':''}">
              ${s.done ? '<i class="fas fa-check"></i>' : ''}
            </div>
            <div>
              <div class="step-title" style="${s.done||s.current?'color:var(--black)':'color:var(--gray-400)'}">${s.title}</div>
              <div class="step-desc">${s.desc}</div>
            </div>
          </div>`).join('')}
      </div>
      <div class="tracking-items">
        <div style="font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:16px;">Items in this order</div>
        ${order.items.map(i => `
          <div class="tracking-item">
            <img src="${i.image}" alt="${i.name}" onerror="this.src='https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&q=60'">
            <div>
              <div class="tracking-item-name">${i.name}</div>
              <div class="tracking-item-meta">Size: ${i.size} · Qty: ${i.qty}</div>
            </div>
            <span class="tracking-item-price">${fmt(i.price)}</span>
          </div>`).join('')}
      </div>
    </div>`;
}

// ── NAVBAR ─────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 50);
});

// ── INIT ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  updateWishBadge();
  renderCartDrawer();
  renderWishlistDrawer();

  // Cart
  document.querySelectorAll('.cart-toggle').forEach(b => b.addEventListener('click', openCart));
  document.querySelector('.cart-drawer .drawer-close')?.addEventListener('click', closeCart);

  // Wishlist
  document.querySelectorAll('.wish-toggle').forEach(b => b.addEventListener('click', openWishlist));
  document.querySelector('.wishlist-drawer .drawer-close')?.addEventListener('click', closeWishlist);

  // Overlay
  document.querySelector('.overlay')?.addEventListener('click', () => { closeCart(); closeWishlist(); });

  // Mobile menu
  document.getElementById('hamburger')?.addEventListener('click', () => {
    document.getElementById('mobileNav')?.classList.add('open');
  });
  document.getElementById('mobileNavClose')?.addEventListener('click', () => {
    document.getElementById('mobileNav')?.classList.remove('open');
  });

  // Checkout btn in drawer
  document.querySelector('.drawer-checkout')?.addEventListener('click', () => {
    if (cart.length === 0) { toast('<i class="fas fa-info-circle"></i> Your bag is empty'); return; }
    const base = window.location.pathname.includes('/pages/') ? '' : 'pages/';
    window.location.href = `${base}checkout.html`;
  });
});

// Expose
window.PRODUCTS=PRODUCTS; window.COUPONS=COUPONS;
window.cart=cart; window.wishlist=wishlist;
window.addToCart=addToCart; window.removeFromCart=removeFromCart;
window.updateQty=updateQty; window.toggleWishlist=toggleWishlist;
window.openCart=openCart; window.closeCart=closeCart;
window.openWishlist=openWishlist; window.closeWishlist=closeWishlist;
window.renderProducts=renderProducts; window.renderReviews=renderReviews;
window.submitReview=submitReview; window.setRating=setRating;
window.trackOrder=trackOrder; window.applyCoupon=applyCoupon;
window.quickAdd=quickAdd; window.moveToCart=moveToCart;
window.goProduct=goProduct; window.fmt=fmt; window.stars=stars;
window.cartSubtotal=cartSubtotal; window.cartDiscount=cartDiscount;
window.cartShipping=cartShipping; window.cartTotal=cartTotal;
window.isWishlisted=isWishlisted;
