// Firebase Configuration
// ملف إعدادات Firebase للمشروع

// تحذير مهم: هذا الملف يحتوي على مفاتيح عامة (Public Keys) وليس سرية
// لا تضع مفاتيح سرية (Secret Keys) في الكود الأمامي

const firebaseConfig = {
    // يجب استبدال هذه القيم ببيانات مشروعك على Firebase
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
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

// تصدير الخدمات للاستخدام في ملفات أخرى
// (إذا كنت تستخدم modules)
// export { auth, db, storage };
