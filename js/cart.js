// js/cart.js

const SHIPPING_FEES = 50; // مصاريف الشحن 50 جنية

document.addEventListener('DOMContentLoaded', () => {
    renderCartPage();
});

function renderCartPage() {
    const tableBody = document.getElementById('cartTableBody');
    const subTotalEl = document.getElementById('subTotalPrice');
    const shippingEl = document.getElementById('shippingPrice');
    const finalTotalEl = document.getElementById('finalTotalPrice');
    
    let cart = JSON.parse(localStorage.getItem('marvelloCart')) || [];
    
    tableBody.innerHTML = '';
    let subTotal = 0;

    if (cart.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:30px;">السلة فارغة 🛒</td></tr>';
        if(finalTotalEl) finalTotalEl.innerText = '0';
        return;
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * (item.quantity || 1);
        subTotal += itemTotal;

        tableBody.innerHTML += `
            <tr>
                <td><img src="${item.image}" style="width:40px; vertical-align:middle"> ${item.name}</td>
                <td>${item.price}</td>
                <td>
                    <button onclick="updateQuantity(${index}, -1)" style="width:25px">-</button>
                    ${item.quantity || 1}
                    <button onclick="updateQuantity(${index}, 1)" style="width:25px">+</button>
                </td>
                <td>${itemTotal}</td>
                <td><i class="fas fa-trash" onclick="removeFromCart(${index})" style="color:red; cursor:pointer"></i></td>
            </tr>
        `;
    });

    // الحسابات المالية
    if(subTotalEl) subTotalEl.innerText = subTotal;
    if(shippingEl) shippingEl.innerText = SHIPPING_FEES;
    if(finalTotalEl) finalTotalEl.innerText = subTotal + SHIPPING_FEES;
}

// زرار تحديد الموقع الجغرافي
window.getLocation = function() {
    const status = document.getElementById('locationStatus');
    const input = document.getElementById('cLocation');
    
    if (!navigator.geolocation) {
        status.innerText = "المتصفح لا يدعم تحديد الموقع";
        return;
    }

    status.innerText = "جاري تحديد مكانك...";
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            // بنعمل لينك لجوجل ماب
            const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;
            input.value = mapLink;
            status.innerHTML = '<span style="color:green">تم تحديد موقعك بنجاح ✅</span>';
        },
        () => {
            status.innerText = "تعذر الوصول للموقع. اكتب العنوان يدوياً.";
        }
    );
}

// إتمام الطلب
document.getElementById('checkoutForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    let cart = JSON.parse(localStorage.getItem('marvelloCart')) || [];
    
    if (cart.length === 0) return alert('السلة فارغة');

    const subTotal = parseFloat(document.getElementById('subTotalPrice').innerText);
    const total = subTotal + SHIPPING_FEES;

    const order = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        status: 'جاري المراجعة 🕒', // الحالة الافتراضية
        customer: {
            name: document.getElementById('cName').value,
            phone: document.getElementById('cPhone').value,
            address: document.getElementById('cAddress').value,
            locationMap: document.getElementById('cLocation').value // اللوكيشن
        },
        items: cart,
        totalAmount: total
    };

    let orders = JSON.parse(localStorage.getItem('marvelloOrders')) || [];
    orders.push(order);
    localStorage.setItem('marvelloOrders', JSON.stringify(orders));
    localStorage.removeItem('marvelloCart');

    alert(`تم الطلب! الإجمالي بالشحن: ${total} ج.م`);
    window.location.href = 'home.html';
});

// دوال المساعدة (الكمية والحذف) زي ما هي...
window.updateQuantity = function(index, change) {
    let cart = JSON.parse(localStorage.getItem('marvelloCart')) || [];
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
        localStorage.setItem('marvelloCart', JSON.stringify(cart));
        renderCartPage();
        updateCartCount();
    }
}
window.removeFromCart = function(index) {
    let cart = JSON.parse(localStorage.getItem('marvelloCart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('marvelloCart', JSON.stringify(cart));
    renderCartPage();
    updateCartCount();
}