// js/cart.js
document.addEventListener('DOMContentLoaded', () => { renderCartPage(); });

function renderCartPage() {
    const tableBody = document.getElementById('cartTableBody');
    const subTotalEl = document.getElementById('subTotalPrice');
    const shippingEl = document.getElementById('shippingPrice');
    const finalTotalEl = document.getElementById('finalTotalPrice');
    
    let cart = JSON.parse(localStorage.getItem('marvelloCart')) || [];
    tableBody.innerHTML = ''; 
    let subTotal = 0;

    if (cart.length === 0) { tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:30px;">السلة فارغة 🛒</td></tr>'; if(finalTotalEl) finalTotalEl.innerText='0'; return; }

    cart.forEach((item, index) => {
        const itemTotal = item.price * (item.quantity || 1);
        subTotal += itemTotal;
        // عرض المقاس واللون المختار
        let variantInfo = "";
        if(item.selectedSize) variantInfo += ` | مقاس: ${item.selectedSize}`;
        if(item.selectedColor) variantInfo += ` | لون: ${item.selectedColor}`;

        tableBody.innerHTML += `<tr>
            <td>
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${item.images ? item.images[0] : item.image}" style="width:40px;"> 
                    <div>${item.name} <span style="font-size:11px; color:#555;">${variantInfo}</span></div>
                </div>
            </td>
            <td>${item.price}</td>
            <td><button onclick="updQty(${index},-1)">-</button> ${item.quantity} <button onclick="updQty(${index},1)">+</button></td>
            <td>${itemTotal}</td>
            <td><i class="fas fa-trash" onclick="rmItem(${index})" style="color:red; cursor:pointer;"></i></td>
        </tr>`;
    });

    // منطق الشحن المجاني (لو أول طلب)
    const user = JSON.parse(localStorage.getItem('marvelloUser'));
    const allOrders = JSON.parse(localStorage.getItem('marvelloOrders')) || [];
    // لو مفيش ايميل بنعتبره مش أول طلب احتياطياً، أو ممكن نعتبره أول طلب
    const previousOrders = allOrders.filter(o => o.customer?.name === user?.name); 
    
    let shipping = 50;
    let shipText = "50 ج.م";
    
    if(previousOrders.length === 0) {
        shipping = 0;
        shipText = "<span style='color:green; text-decoration:line-through;'>50</span> <span style='color:#b12704; font-weight:bold;'>مجاني (أول طلب)</span>";
    }

    if(subTotalEl) subTotalEl.innerText = subTotal;
    if(shippingEl) shippingEl.innerHTML = shipText;
    if(finalTotalEl) finalTotalEl.innerText = subTotal + shipping;
}

document.getElementById('checkoutForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const payMethod = document.querySelector('input[name="payment"]:checked').value;
    
    if(payMethod === 'visa') {
        const card = prompt("⚠️ محاكاة الدفع: أدخل رقم البطاقة (وهمي):");
        if(card) processOrder('Visa');
    } else {
        processOrder('Cash');
    }
});

function processOrder(method) {
    let cart = JSON.parse(localStorage.getItem('marvelloCart'));
    const total = document.getElementById('finalTotalPrice').innerText; // ناخد الرقم النهائي
    
    const order = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        status: 'قيد المراجعة',
        paymentMethod: method,
        customer: {
            name: document.getElementById('cName').value,
            phone: document.getElementById('cPhone').value,
            address: document.getElementById('cAddress').value,
            locationMap: document.getElementById('cLocation').value
        },
        items: cart,
        totalAmount: total
    };

    // حفظ الطلب
    let orders = JSON.parse(localStorage.getItem('marvelloOrders')) || [];
    orders.push(order);
    localStorage.setItem('marvelloOrders', JSON.stringify(orders));
    
    // خصم المخزون
    let products = JSON.parse(localStorage.getItem('marvelloProducts'));
    cart.forEach(cItem => {
        let p = products.find(prod => prod.id == cItem.id);
        if(p) p.stock -= cItem.quantity;
    });
    localStorage.setItem('marvelloProducts', JSON.stringify(products));

    localStorage.removeItem('marvelloCart');
    alert(`تم الطلب بنجاح! الدفع: ${method}`);
    window.location.href = 'home.html';
}

window.updQty = function(i,c){let ct=JSON.parse(localStorage.getItem('marvelloCart')); if(ct[i].quantity+c>0){ct[i].quantity+=c; localStorage.setItem('marvelloCart',JSON.stringify(ct)); renderCartPage();}}
window.rmItem = function(i){let ct=JSON.parse(localStorage.getItem('marvelloCart')); ct.splice(i,1); localStorage.setItem('marvelloCart',JSON.stringify(ct)); renderCartPage();}
