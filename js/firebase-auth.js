// Firebase Authentication Module
// نظام المصادقة المحسّن باستخدام Firebase

// متغير عام لتخزين المستخدم الحالي
let currentUser = null;

// مراقب حالة المصادقة
auth.onAuthStateChanged((user) => {
    currentUser = user;
    
    if (user) {
        // المستخدم مسجل دخول
        console.log('مستخدم مسجل دخول:', user.email);
        
        // حفظ بيانات المستخدم في localStorage للاستخدام السريع
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'مستخدم',
            photoURL: user.photoURL || ''
        };
        localStorage.setItem('marvelloUser', JSON.stringify(userData));
        
        // تحديث واجهة المستخدم
        updateUIForLoggedInUser(user);
    } else {
        // المستخدم غير مسجل دخول
        console.log('المستخدم غير مسجل دخول');
        localStorage.removeItem('marvelloUser');
        updateUIForLoggedOutUser();
    }
});

// تسجيل مستخدم جديد
async function registerUser(email, password, displayName) {
    try {
        // إنشاء حساب جديد
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // تحديث اسم المستخدم
        await user.updateProfile({
            displayName: displayName
        });
        
        // إنشاء وثيقة المستخدم في Firestore
        await db.collection('users').doc(user.uid).set({
            email: email,
            displayName: displayName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            role: 'user', // الدور الافتراضي
            phone: '',
            address: ''
        });
        
        showToast('تم إنشاء الحساب بنجاح! 🎉');
        return user;
    } catch (error) {
        console.error('خطأ في التسجيل:', error);
        
        // معالجة الأخطاء الشائعة
        if (error.code === 'auth/email-already-in-use') {
            showToast('هذا البريد الإلكتروني مسجل بالفعل ❌');
        } else if (error.code === 'auth/weak-password') {
            showToast('كلمة المرور ضعيفة جداً (يجب أن تكون 6 أحرف على الأقل) ❌');
        } else if (error.code === 'auth/invalid-email') {
            showToast('البريد الإلكتروني غير صحيح ❌');
        } else {
            showToast('حدث خطأ في التسجيل: ' + error.message + ' ❌');
        }
        throw error;
    }
}

// تسجيل الدخول
async function loginUser(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        showToast('تم تسجيل الدخول بنجاح! ✅');
        return userCredential.user;
    } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        
        // معالجة الأخطاء الشائعة
        if (error.code === 'auth/user-not-found') {
            showToast('البريد الإلكتروني غير مسجل ❌');
        } else if (error.code === 'auth/wrong-password') {
            showToast('كلمة المرور غير صحيحة ❌');
        } else if (error.code === 'auth/invalid-email') {
            showToast('البريد الإلكتروني غير صحيح ❌');
        } else {
            showToast('خطأ في تسجيل الدخول: ' + error.message + ' ❌');
        }
        throw error;
    }
}

// تسجيل الخروج
async function logoutUser() {
    try {
        await auth.signOut();
        showToast('تم تسجيل الخروج بنجاح ✅');
        localStorage.removeItem('marvelloUser');
        window.location.href = '../index.html';
    } catch (error) {
        console.error('خطأ في تسجيل الخروج:', error);
        showToast('حدث خطأ في تسجيل الخروج ❌');
    }
}

// إعادة تعيين كلمة المرور
async function resetPassword(email) {
    try {
        await auth.sendPasswordResetEmail(email);
        showToast('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني ✅');
        return true;
    } catch (error) {
        console.error('خطأ في إعادة تعيين كلمة المرور:', error);
        
        if (error.code === 'auth/user-not-found') {
            showToast('البريد الإلكتروني غير مسجل ❌');
        } else {
            showToast('حدث خطأ: ' + error.message + ' ❌');
        }
        throw error;
    }
}

// تحديث بيانات المستخدم
async function updateUserProfile(displayName, photoURL = '') {
    try {
        if (currentUser) {
            await currentUser.updateProfile({
                displayName: displayName,
                photoURL: photoURL
            });
            
            // تحديث Firestore
            await db.collection('users').doc(currentUser.uid).update({
                displayName: displayName,
                photoURL: photoURL,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            showToast('تم تحديث البيانات بنجاح ✅');
            return true;
        }
    } catch (error) {
        console.error('خطأ في تحديث البيانات:', error);
        showToast('حدث خطأ في تحديث البيانات ❌');
        throw error;
    }
}

// الحصول على بيانات المستخدم الحالي
async function getCurrentUserData() {
    if (currentUser) {
        try {
            const userDoc = await db.collection('users').doc(currentUser.uid).get();
            if (userDoc.exists) {
                return userDoc.data();
            }
        } catch (error) {
            console.error('خطأ في جلب بيانات المستخدم:', error);
        }
    }
    return null;
}

// التحقق من صلاحيات المستخدم
async function isAdmin() {
    if (currentUser) {
        const userData = await getCurrentUserData();
        return userData && userData.role === 'admin';
    }
    return false;
}

// تحديث واجهة المستخدم للمستخدم المسجل دخول
function updateUIForLoggedInUser(user) {
    // يمكن تحديث العناصر في الصفحة هنا
    const logoutBtn = document.querySelector('[onclick="logoutUser()"]');
    if (logoutBtn) {
        logoutBtn.style.display = 'block';
    }
}

// تحديث واجهة المستخدم للمستخدم غير المسجل دخول
function updateUIForLoggedOutUser() {
    // إعادة توجيه إلى صفحة تسجيل الدخول إذا لزم الأمر
    const isPublicPage = window.location.href.includes('index.html') || 
                         window.location.href.includes('register.html') || 
                         window.location.href.includes('forgot.html');
    
    if (!isPublicPage && !window.location.href.includes('pages/')) {
        // لا تعيد التوجيه من الصفحات العامة
    }
}

// دالة مساعدة لعرض الإشعارات (Toast)
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
