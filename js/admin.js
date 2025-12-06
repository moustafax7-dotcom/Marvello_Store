/* =========================================
   Marvello Admin Logic
   ========================================= */

// متغير لتحديد وضع العمل: (-1 = إضافة جديد) | (رقم = تعديل منتج موجود)
let editIndex = -1;

// 1. التحقق من صلاحية الأدمن وتشغيل الصفحة
function checkAdmin() {
    const user = JSON.parse(localStorage.getItem('marvelloUser'));
    if (!user || user.role !== 'admin') {
        window.location.href = '../index.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAdmin();
    renderStats();
    renderOrders();
    renderMyProducts();
});

/* =========================================
   2. قسم الإحصائيات (Dashboard Stats)
   ========================================= */
function renderStats() {
    const products = JSON.parse(localStorage.getItem('marvelloProducts')) || [];
    const orders = JSON.parse(localStorage.getItem('marvelloOrders')) || [];
    
    // حساب إجمالي الأرباح
    const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0);

    document.getElementById('countOrders').innerText = orders.length;
    // (6) هو عدد المنتجات الافتراضية في ملف JSON
    document.getElementById('countProducts').innerText = products.length + 6; 
    document.getElementById('totalEarnings').innerText = totalSales + ' ج.م';
}

/* =========================================
   3. قسم إدارة الطلبات (Orders Management)
   ========================================= */
function renderOrders() {
    const table = document.getElementById('ordersTable');
    const orders = JSON.parse(localStorage.getItem('marvelloOrders')) || [];
    table.innerHTML = '';

    if (orders.length === 0) {
        table.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px;">لا توجد طلبات جديدة 📭</td></tr>';
        return;
    }

    orders.forEach((order, index) => {
        // تنسيق المنتجات
        let itemsText = order.items.map(i => `- ${i.name} (x${i.quantity || 1})`).join('<br>');
        
        // زر اللوكيشن
        let locationBtn = order.customer.locationMap && order.customer.locationMap.includes('http')
            ? `<a href="${order.customer.locationMap}" target="_blank" style="color:#2980b9; font-weight:bold; text-decoration:underline;">عرض الموقع 📍</a>` 
            : '<span style="color:#999;">غير محدد</span>';

        // قائمة الحالة (Dropdown)
        let statusOptions = `
            <select onchange="changeStatus(${index}, this.value)" style="padding:5px; border-radius:5px; border:1px solid #ccc;">
                <option value="قيد المراجعة" ${order.status === 'قيد المراجعة' ? 'selected' : ''}>🕒 قيد المراجعة</option>
                <option value="خرج للتوصيل" ${order.status === 'خرج للتوصيل' ? 'selected' : ''}>🚚 خرج للتوصيل</option>
                <option value="تم الاستلام" ${order.status === 'تم الاستلام' ? 'selected' : ''}>✅ تم الاستلام</option>
            </select>
        `;

        table.innerHTML += `
            <tr style="border-bottom:1px solid #eee; background:#fff;">
                <td>${index + 1}</td>
                <td>
                    <div style="font-weight:bold;">${order.customer.name}</div>
                    <div style="font-size:13px; color:#555;">${order.customer.phone}</div>
                    <div style="margin-top:5px;">${locationBtn}</div>
                </td>
                <td style="font-size:14px; line-height:1.6;">${itemsText}</td>
                <td style="color:#27ae60; font-weight:bold;">${order.totalAmount} ج.م</td>
                <td>${statusOptions}</td>
                <td>
                    <button onclick="deleteOrder(${index})" style="color:#e74c3c; background:none; border:none; cursor:pointer; font-size:16px;">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// تغيير حالة الطلب
window.changeStatus = function(index, newStatus) {
    let orders = JSON.parse(localStorage.getItem('marvelloOrders')) || [];
    orders[index].status = newStatus;
    localStorage.setItem('marvelloOrders', JSON.stringify(orders));
    // لا نحتاج لإعادة تحميل الصفحة، التغيير يتم في الخلفية
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

/* =========================================
   4. قسم إدارة المنتجات (إضافة + تعديل + حذف)
   ========================================= */

// تعريف عناصر الفورم
const productForm = document.getElementById('addProductForm');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('formTitle');

// دالة الحفظ (Submit)
if (productForm) {
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let products = JSON.parse(localStorage.getItem('marvelloProducts')) || [];

        // جلب البيانات من الخانات
        const productData = {
            id: editIndex === -1 ? Date.now() : products[editIndex].id, // لو جديد هات id جديد، لو قديم حافظ عليه
            name: document.getElementById('pName').value,
            price: document.getElementById('pPrice').value,
            description: document.getElementById('pDesc').value,
            category: document.getElementById('pCategory').value,
            image: document.getElementById('pImage').value || 'https://placehold.co/300'
        };

        if (editIndex === -1) {
            // === وضع الإضافة ===
            products.push(productData);
            alert('تم نشر المنتج بنجاح! 🎉');
        } else {
            // === وضع التعديل ===
            products[editIndex] = productData; // استبدال القديم بالجديد
            alert('تم حفظ التعديلات! ✅');
            resetForm(); // العودة للوضع الطبيعي
        }

        // الحفظ والتحديث
        localStorage.setItem('marvelloProducts', JSON.stringify(products));
        renderMyProducts();
        renderStats();
        
        if (editIndex === -1) productForm.reset();
    });
}

// دالة البدء في التعديل (تُستدعى عند الضغط على زر تعديل)
window.startEdit = function(index) {
    let products = JSON.parse(localStorage.getItem('marvelloProducts')) || [];
    const p = products[index];

    // ملء الخانات بالبيانات القديمة
    document.getElementById('pName').value = p.name;
    document.getElementById('pPrice').value = p.price;
    document.getElementById('pDesc').value = p.description || "";
    document.getElementById('pCategory').value = p.category;
    document.getElementById('pImage').value = p.image;

    // تغيير شكل الواجهة لوضع التعديل
    editIndex = index;
    saveBtn.innerText = "💾 حفظ التعديلات";
    saveBtn.style.background = "#27ae60"; // أخضر
    cancelBtn.style.display = "block"; // إظهار زر الإلغاء
    formTitle.innerText = `✏️ تعديل: ${p.name}`;

    // الصعود للفورم
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// دالة إلغاء التعديل
window.resetForm = function() {
    editIndex = -1;
    productForm.reset();
    
    // استرجاع شكل الواجهة لوضع الإضافة
    saveBtn.innerText = "نشر المنتج";
    saveBtn.style.background = ""; // يرجع للون الـ CSS الأصلي
    cancelBtn.style.display = "none";
    formTitle.innerText = "➕ إضافة منتج جديد";
}

// عرض المنتجات المضافة في القائمة
function renderMyProducts() {
    const list = document.getElementById('addedProductsList');
    if (!list) return;

    const products = JSON.parse(localStorage.getItem('marvelloProducts')) || [];
    list.innerHTML = '';

    if (products.length === 0) {
        list.innerHTML = '<li style="color:#888; text-align:center; padding:10px;">لم تقم بإضافة منتجات بعد.</li>';
        return;
    }

    products.forEach((p, index) => {
        list.innerHTML += `
            <li style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:10px; margin-bottom:10px; border:1px solid #eee; border-radius:5px; box-shadow:0 2px 4px rgba(0,0,0,0.03);">
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${p.image}" style="width:40px; height:40px; object-fit:cover; border-radius:5px;">
                    <div>
                        <div style="font-weight:bold; color:#333;">${p.name}</div>
                        <div style="font-size:12px; color:green;">${p.price} ج.م</div>
                    </div>
                </div>
                <div style="display:flex; gap:5px;">
                    <button onclick="startEdit(${index})" title="تعديل" style="background:#f39c12; color:white; border:none; width:30px; height:30px; border-radius:4px; cursor:pointer;">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteProduct(${index})" title="حذف" style="background:#e74c3c; color:white; border:none; width:30px; height:30px; border-radius:4px; cursor:pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
        `;
    });
}

// حذف المنتج
window.deleteProduct = function(index) {
    if(confirm('هل أنت متأكد من حذف هذا المنتج؟ لن يظهر للعملاء بعد الآن.')) {
        let products = JSON.parse(localStorage.getItem('marvelloProducts')) || [];
        
        // لو كنا بنعدل المنتج ده ومسحناه، نلغي وضع التعديل
        if(index === editIndex) resetForm();

        products.splice(index, 1);
        localStorage.setItem('marvelloProducts', JSON.stringify(products));
        
        renderMyProducts();
        renderStats();
    }
}
