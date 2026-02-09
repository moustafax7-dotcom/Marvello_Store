// js/auth.js - النسخة المحدثة بدون تسجيل دخول إجباري

// 1. تسجيل عميل جديد (لصفحة Register)
function registerUser(name, email, password) {
    let users = JSON.parse(localStorage.getItem('marvelloUsersDB')) || [];
    
    // التأكد إن الإيميل مش موجود قبل كده
    if (users.find(u => u.email === email)) {
        alert("هذا البريد مسجل بالفعل!");
        return;
    }

    // إضافة العميل الجديد
    users.push({ name, email, password, role: 'user' });
    localStorage.setItem('marvelloUsersDB', JSON.stringify(users));
    
    alert("تم إنشاء الحساب بنجاح!");
    // التوجيه إلى صفحة المتجر بدلاً من صفحة الدخول
    window.location.href = window.location.href.includes('/pages/') ? 'shop.html' : 'pages/shop.html';
}

// 2. تسجيل الدخول (معدلة لتقبل الأدمن والعملاء)
function login(email, password) {
    // أ) هل هو الأدمن؟
    if (email === 'moustafa.mahmoudx7@gmail.com' && password === 'Moustafa7112005') {
        const adminData = { name: 'Admin', email: email, role: 'admin' };
        localStorage.setItem('marvelloUser', JSON.stringify(adminData));
        window.location.href = 'pages/admin.html';
        return;
    }

    // ب) هل هو عميل مسجل؟
    const users = JSON.parse(localStorage.getItem('marvelloUsersDB')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('marvelloUser', JSON.stringify(user));
        // توجيه للمتجر بدلاً من صفحة home
        window.location.href = window.location.href.includes('/pages/') ? 'shop.html' : 'pages/shop.html';
    } else {
        alert("بيانات الدخول غير صحيحة!");
    }
}

// 3. التحقق من الدخول (معطل - لا نحتاج حماية الصفحات)
function checkLogin() {
    // هذه الدالة معطلة الآن - جميع الصفحات متاحة للعملاء بدون تسجيل دخول
    // يمكن للعملاء الوصول إلى جميع الصفحات مباشرة
}

// 4. تسجيل الخروج
function logout() {
    localStorage.removeItem('marvelloUser');
    // التوجيه إلى صفحة المتجر بدلاً من صفحة الدخول
    window.location.href = window.location.href.includes('/pages/') ? 'shop.html' : 'pages/shop.html';
}
