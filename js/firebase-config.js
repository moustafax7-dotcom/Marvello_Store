// Firebase Configuration - إعدادات Firebase الأساسية

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGFUYp8Ic9Bd7JDSbzstsx3OapW1lJYFo",
  authDomain: "marvello-d448c.firebaseapp.com",
  projectId: "marvello-d448c",
  storageBucket: "marvello-d448c.firebasestorage.app",
  messagingSenderId: "393349646082",
  appId: "1:393349646082:web:6cebfe762d7e01f542241b",
  measurementId: "G-7B0Z39CMKY"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// الحصول على مراجع الخدمات
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// تفعيل الوضع غير المتصل (Offline Mode)
db.enablePersistence()
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            console.log('تم فتح قاعدة البيانات في نافذة أخرى');
        } else if (err.code == 'unimplemented') {
            console.log('المتصفح لا يدعم الوضع غير المتصل');
        }
    });

// متغيرات عامة
let currentUser = null;

// مراقبة حالة المصادقة
auth.onAuthStateChanged(user => {
    currentUser = user;
    // يمكنك إضافة منطق هنا لتحديث واجهة المستخدم
    if (user) {
        // التحقق من الدور وإعادة التوجيه
        isAdmin().then(is_admin => {
            if (is_admin) {
                window.location.href = 'pages/admin.html';
            } else {
                window.location.href = 'pages/home.html';
            }
        });
    } else {
        // إذا لم يكن هناك مستخدم، أعد التوجيه إلى صفحة تسجيل الدخول إذا لم يكن في صفحة الهبوط
        if (window.location.pathname.indexOf('landing.html') === -1) {
            window.location.href = 'index.html';
        }
    }
    // مثال: updateUI(user);
});

// دالة مساعدة لعرض الإشعارات
function showToast(message) {
    let toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '15px 20px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    toast.style.fontFamily = "'Cairo', sans-serif";
    toast.style.fontSize = '14px';
    toast.innerText = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// دالة مساعدة للتحقق من صلاحيات المسؤول
async function isAdmin() {
    if (!currentUser) return false;
    
    try {
        // تعيين دور المسؤول بشكل افتراضي لبريد المستخدم
        if (currentUser.email === 'moustafa.mahmoudx7@gmail.com') {
            return true;
        }
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
            return userDoc.data().role === 'admin';
        }
        return false;
    } catch (error) {
        console.error('خطأ في التحقق من صلاحيات المسؤول:', error);
        return false;
    }
}
