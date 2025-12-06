// js/admin.js - النسخة النهائية الشاملة

// 1. حماية الصفحة: ممنوع الدخول لغير الأدمن
function checkAdmin() {
    const user = JSON.parse(localStorage.getItem('marvelloUser'));
    if (!user || user.role !== 'admin') {
        window.location.href = '../index.html';
    }
}

// تشغيل الدوال عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    checkAdmin();
    renderStats();
    renderOrders();
    renderMyProducts();
});

// --- قسم الإحصائيات ---
function renderStats() {
    const products = JSON.parse(localStorage.getItem('marvelloProducts')) || [];
    const orders = JSON.parse(localStorage.getItem('marvelloOrders')) || [];
    
    // حساب إجمالي المبيعات
    const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0);

    document.getElementById('countOrders').innerText = orders.length;
    document.getElementById('countProducts').innerText = products.length + 6; 
    document.getElementById('totalEarnings').innerText = totalSales + ' ج.م';
}

// --- قسم إدارة الطلبات (الجديد مع اللوكيشن والحالة) ---
function renderOrders() {
    const table = document.getElementById('ordersTable');
    const orders = JSON.parse(localStorage.getItem('marvelloOrders')) || [];
    table.innerHTML = '';

    if (orders.length === 0) {
        table.innerHTML = '<tr><td colspan="6" style="text-align:center">لا توجد طلبات</td></tr>';
        return;
    }

    orders.forEach((order, index) => {
        let itemsText = order.items.map(i => `${i.name} (x${i.quantity || 1})`).join('<br>');
        
        // زرار اللوكيشن (لو موجود)
        let locationBtn = order.customer.locationMap && order.customer.locationMap.includes('http')
            ? `<a href="${order.customer.locationMap}" target="_blank" style="color:blue; text-decoration:underline; font-weight:bold;">عرض الموقع 📍</a>` 
            : 'غير محدد';

        // قائمة الحالة
        let statusOptions = `
            <select onchange="changeStatus(${index}, this.value)" style="padding:5px; border-radius:5px; border:1px solid #ccc;">
                <option value="قيد المراجعة" ${order.status === 'قيد المراجعة' ? 'selected' : ''}>قيد المراجعة 🕒</option>
                <option value="خرج للتوصيل" ${order.status === 'خرج للتوصيل' ? 'selected' : ''}>خرج للتوصيل 🚚</option>
                <option value="تم الاستلام" ${order.status === 'تم الاستلام' ? 'selected' : ''}>تم الاستلام ✅</option>
            </select>
        `;

        table.innerHTML += `
            <tr style="background:white; border-bottom:1px solid #eee;">
                <td>${index + 1}</td>
                <td>
                    <b>${order.customer.name}</b><br>
                    ${order.customer.phone}<br>
                    ${order.customer.address}<br>
                    ${locationBtn}
                </td>
                <td style="font-size:14px;">${itemsText}</td>
                <td style="color:green; font-weight:bold;">${order.totalAmount} ج.م</td>
                <td>${statusOptions}</td>
                <td><button onclick="deleteOrder(${index})" style="color:white; background:red; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">حذف</button></td>
            </tr>
        `;
    });
}

// دالة تغيير حالة الطلب
window.changeStatus = function(index, newStatus) {
    let orders = JSON.parse(localStorage.getItem('marvelloOrders')) || [];
    orders[index].status = newStatus;
    localStorage.setItem('marvelloOrders', JSON.stringify(orders));
    // مش هنعمل alert عشان مايبقاش مزعج، بس هنحدث الصفحة لو تحبي
    // renderOrders(); 
}

// حذف الطلب
window.deleteOrder = function(index) {
    if(confirm('هل أنت متأكد من حذف هذا الطلب نهائياً؟')) {
        let orders = JSON.parse(localStorage.getItem('marvelloOrders')) || [];
        orders.splice(index, 1);
        localStorage.setItem('marvelloOrders', JSON.stringify(orders));
        renderOrders();
        renderStats();
    }
}

// --- قسم إضافة منتج جديد ---
document.getElementById('addProductForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const newProduct = {
        id: Date.now(),
        name: document.getElementById('pName').value,
        price: document.getElementById('pPrice').value,
        category: document.getElementById('pCategory').value,
        image: document.getElementById('pImage').value || 'https://placehold.co/300',
        description: 'منتج جديد'
    };

    let products = JSON.parse(localStorage.getItem('marvelloProducts')) || [];
    products.push(newProduct);
    localStorage.setItem('marvelloProducts', JSON.stringify(products));

    alert('تم إضافة المنتج بنجاح!');
    e.target.reset();
    renderMyProducts();
    renderStats();
});

// عرض المنتجات المضافة
function renderMyProducts() {
    const list = document.getElementById('addedProductsList');
    if(!list) return;
    
    const products = JSON.parse(localStorage.getItem('marvelloProducts')) || [];

    list.innerHTML = '';
    products.forEach((p, index) => {
        list.innerHTML += `
            <li style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee;">
                <span><img src="${p.image}" style="width:30px;"> ${p.name}</span>
                <button onclick="deleteProduct(${index})" style="color:red; border:none; background:none; cursor:pointer;">حذف</button>
            </li>
        `;
    });
}

window.deleteProduct = function(index) {
    if(confirm('حذف هذا المنتج؟')) {
        let products = JSON.parse(localStorage.getItem('marvelloProducts')) || [];
        products.splice(index, 1);
        localStorage.setItem('marvelloProducts', JSON.stringify(products));
        renderMyProducts();
        renderStats();
    }
}