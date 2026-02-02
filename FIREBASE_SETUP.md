# دليل إعداد Firebase لموقع Marvello Store

## 📋 المتطلبات

قبل البدء، تأكد من أن لديك:
- حساب Google (Gmail)
- متصفح ويب
- معرفة أساسية بـ Firebase

---

## 🚀 خطوات الإعداد

### الخطوة 1: إنشاء مشروع Firebase جديد

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اضغط على **"إنشاء مشروع جديد"** (Create a new project)
3. أدخل اسم المشروع: `Marvello Store`
4. اختر البلد: **مصر** أو بلدك
5. اضغط **"إنشاء"** (Create)

### الخطوة 2: إضافة تطبيق ويب

1. في صفحة المشروع، اضغط على أيقونة الويب `</>`
2. أدخل اسم التطبيق: `Marvello Web`
3. اختر **"استضافة أيضاً"** (Also set up Firebase Hosting)
4. اضغط **"تسجيل التطبيق"** (Register app)
5. سيظهر لك كود الإعداد - **احفظه!**

### الخطوة 3: الحصول على بيانات الإعداد

بعد تسجيل التطبيق، ستجد كود يشبه هذا:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**انسخ هذا الكود واحفظه بأمان!**

### الخطوة 4: تحديث ملف firebase-config.js

1. افتح الملف `js/firebase-config.js`
2. استبدل القيم التالية ببيانات مشروعك:
   - `YOUR_API_KEY` → استبدل بـ `apiKey`
   - `YOUR_PROJECT_ID` → استبدل بـ `projectId`
   - إلخ...

مثال:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxx",
    authDomain: "marvello-store.firebaseapp.com",
    projectId: "marvello-store",
    storageBucket: "marvello-store.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdefg"
};
```

### الخطوة 5: تفعيل المصادقة (Authentication)

1. في Firebase Console، اذهب إلى **Authentication** (المصادقة)
2. اضغط على **"البدء"** (Get started)
3. اختر **"البريد الإلكتروني والكلمة المرورية"** (Email/Password)
4. فعّل هذا الخيار
5. اضغط **"حفظ"** (Save)

### الخطوة 6: إنشاء قاعدة البيانات (Firestore)

1. في Firebase Console، اذهب إلى **Firestore Database**
2. اضغط **"إنشاء قاعدة بيانات"** (Create database)
3. اختر **"بدء في وضع الاختبار"** (Start in test mode)
4. اختر موقع الخادم (أقرب منطقة لك)
5. اضغط **"إنشاء"** (Create)

### الخطوة 7: إعداد قواعد الأمان (Security Rules)

1. في Firestore، اذهب إلى تبويب **"القواعس"** (Rules)
2. استبدل الكود الحالي بهذا:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // السماح للمستخدمين المصرح لهم فقط
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // السماح بقراءة المنتجات للجميع، والكتابة للمسؤولين فقط
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth.uid != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // السماح بقراءة الطلبات للمستخدم صاحب الطلب أو المسؤولين
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.userId || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow write: if request.auth.uid != null;
    }
  }
}
```

3. اضغط **"نشر"** (Publish)

### الخطوة 8: إضافة مكتبة Firebase إلى HTML

تأكد من أن ملف `index.html` يحتوي على هذه الأسطر قبل إغلاق `</body>`:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebaseapp/9.22.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebaseapp/9.22.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebaseapp/9.22.0/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebaseapp/9.22.0/firebase-storage.js"></script>

<!-- Firebase Configuration -->
<script src="js/firebase-config.js"></script>

<!-- Firebase Modules -->
<script src="js/firebase-auth.js"></script>
<script src="js/firebase-products.js"></script>
<script src="js/firebase-orders.js"></script>
```

---

## 🔧 الملفات الجديدة

تم إضافة الملفات التالية:

| الملف | الوصف |
|------|-------|
| `js/firebase-config.js` | إعدادات Firebase الأساسية |
| `js/firebase-auth.js` | نظام المصادقة والتسجيل |
| `js/firebase-products.js` | إدارة المنتجات |
| `js/firebase-orders.js` | إدارة الطلبات |

---

## 📚 الدوال الرئيسية

### المصادقة (Authentication)

```javascript
// تسجيل مستخدم جديد
await registerUser(email, password, displayName);

// تسجيل الدخول
await loginUser(email, password);

// تسجيل الخروج
await logoutUser();

// إعادة تعيين كلمة المرور
await resetPassword(email);
```

### المنتجات (Products)

```javascript
// تحميل جميع المنتجات
await loadProductsFromFirebase();

// إضافة منتج جديد
await addProductToFirebase(productData);

// تحديث منتج
await updateProductInFirebase(productId, productData);

// حذف منتج
await deleteProductFromFirebase(productId);

// البحث عن منتجات
searchProducts(query);

// فلترة حسب التصنيف
filterProductsByCategory(category);
```

### الطلبات (Orders)

```javascript
// إنشاء طلب جديد
await createOrderInFirebase(orderData);

// جلب طلبات المستخدم
await getUserOrders();

// جلب جميع الطلبات (للمسؤولين)
await getAllOrders();

// تحديث حالة الطلب
await updateOrderStatus(orderId, newStatus);
```

---

## 🧪 الاختبار

### اختبار المصادقة

1. افتح الموقع في المتصفح
2. اذهب إلى صفحة التسجيل
3. أنشئ حساب جديد
4. تحقق من Firebase Console → Authentication

### اختبار المنتجات

1. سجل دخول كمسؤول
2. اذهب إلى صفحة الإدارة
3. أضف منتج جديد
4. تحقق من Firebase Console → Firestore

### اختبار الطلبات

1. أضف منتج إلى السلة
2. أكمل عملية الشراء
3. تحقق من Firebase Console → Firestore (مجموعة orders)

---

## ⚠️ ملاحظات أمان مهمة

1. **لا تشارك بيانات Firebase** مع أحد
2. **استخدم قواعس أمان قوية** (Security Rules)
3. **فعّل المصادقة** لجميع العمليات الحساسة
4. **راقب الاستخدام** في Firebase Console لتجنب تجاوز الحد المجاني

---

## 🆘 حل المشاكل الشائعة

### المشكلة: "Firebase is not defined"
**الحل:** تأكد من إضافة مكتبات Firebase في HTML قبل ملفات JavaScript الخاصة بك

### المشكلة: "Permission denied" عند إضافة منتج
**الحل:** تأكد من أن المستخدم لديه دور "admin" في Firestore

### المشكلة: البيانات لا تظهر
**الحل:** تحقق من قواعس الأمان (Security Rules) وتأكد من أنها تسمح بالقراءة

---

## 📞 الدعم

للمزيد من المعلومات:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)

---

**تم إعداد Firebase بنجاح! 🎉**
