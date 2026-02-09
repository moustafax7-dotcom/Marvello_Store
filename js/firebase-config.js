// Firebase Configuration - إعدادات Firebase الأساسية

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7wGZGoQYMtMfOAFiIAp94eEbnZ77ZOGc",
  authDomain: "marvello-38b2a.firebaseapp.com",
  projectId: "marvello-38b2a",
  storageBucket: "marvello-38b2a.firebasestorage.app",
  messagingSenderId: "1066633090194",
  appId: "1:1066633090194:web:769914a57832ccc702824b",
  measurementId: "G-HXFLDYMGRL"
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
    // لا نعيد التوجيه الإجباري - جميع الصفحات متاحة للعملاء
    // يمكنك إضافة منطق هنا لتحديث واجهة المستخدم فقط
    if (user) {
        console.log('مستخدم مسجل دخول:', user.email);
    } else {
        console.log('المستخدم غير مسجل دخول');
    }
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
