// js/auth.js - النسخة النهائية

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
    
    alert("تم إنشاء الحساب بنجاح! سجل دخول الآن.");
    window.location.href = '../index.html';
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
        // توجيه للصفحة المناسبة حسب مكاني الحالي
        const target = window.location.href.includes('pages') ? 'home.html' : 'pages/home.html';
        window.location.href = target;
    } else {
        alert("بيانات الدخول غير صحيحة!");
    }
}

// 3. التحقق من الدخول (حماية الصفحات)
function checkLogin() {
    const user = localStorage.getItem('marvelloUser');
    // الصفحات المسموح بزيارتها بدون تسجيل دخول
    const isPublicPage = window.location.href.includes('index.html') || 
                         window.location.href.includes('register.html') || 
                         window.location.href.includes('forgot.html');

    if (!user && !isPublicPage) {
        // لو مش مسجل ومش في صفحة عامة، اطرده لصفحة الدخول
        const path = window.location.href.includes('/pages/') ? '../index.html' : 'index.html';
        window.location.href = path;
    }
}

// 4. تسجيل الخروج
function logout() {
    localStorage.removeItem('marvelloUser');
    window.location.href = '../index.html';

}
