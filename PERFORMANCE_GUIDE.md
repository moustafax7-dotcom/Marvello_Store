# دليل تحسين الأداء والـ Lighthouse

## 📊 ما هو Lighthouse؟

Lighthouse هي أداة مفتوحة المصدر من Google تقيس جودة صفحات الويب. تقيم الموقع في 5 مجالات:

1. **Performance** (الأداء)
2. **Accessibility** (إمكانية الوصول)
3. **Best Practices** (أفضل الممارسات)
4. **SEO** (تحسين محركات البحث)
5. **PWA** (تطبيق الويب التقدمي)

---

## 🚀 كيفية استخدام Lighthouse

### الطريقة 1: Chrome DevTools

1. افتح الموقع في Google Chrome
2. اضغط على `F12` أو `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
3. انتقل إلى تبويب **Lighthouse**
4. اختر الفئات التي تريد تقييمها
5. اضغط **Analyze page load**

### الطريقة 2: PageSpeed Insights

1. اذهب إلى [PageSpeed Insights](https://pagespeed.web.dev/)
2. أدخل رابط موقعك
3. اضغط **Analyze**
4. انتظر النتائج

### الطريقة 3: Command Line

```bash
npm install -g lighthouse
lighthouse https://your-site.com --view
```

---

## 📈 Core Web Vitals

### 1. LCP (Largest Contentful Paint)
**التعريف:** الوقت الذي يستغرقه أكبر عنصر مرئي للظهور

**الهدف:**
- ✅ ممتاز: < 2.5 ثانية
- ⚠️ يحتاج تحسين: 2.5 - 4 ثواني
- ❌ سيء: > 4 ثواني

**كيفية التحسين:**
```javascript
// تأجيل تحميل الصور غير الضرورية
<img loading="lazy" src="image.jpg" alt="...">

// استخدام CDN للصور
<img src="https://cdn.example.com/image.jpg" alt="...">

// تقليل حجم الصور
// استخدم أدوات مثل TinyPNG أو ImageOptim
```

### 2. FID (First Input Delay)
**التعريف:** الوقت بين تفاعل المستخدم والاستجابة

**الهدف:**
- ✅ ممتاز: < 100 ميلي ثانية
- ⚠️ يحتاج تحسين: 100 - 300 ميلي ثانية
- ❌ سيء: > 300 ميلي ثانية

**كيفية التحسين:**
```javascript
// تقسيم المهام الطويلة
function longTask() {
    // قسّم المهمة إلى أجزاء صغيرة
    setTimeout(() => {
        // جزء من المهمة
    }, 0);
}

// استخدام Web Workers
const worker = new Worker('worker.js');
worker.postMessage(data);
```

### 3. CLS (Cumulative Layout Shift)
**التعريف:** مقدار تحرك العناصر على الصفحة بشكل غير متوقع

**الهدف:**
- ✅ ممتاز: < 0.1
- ⚠️ يحتاج تحسين: 0.1 - 0.25
- ❌ سيء: > 0.25

**كيفية التحسين:**
```css
/* حدد أحجام الصور مسبقاً */
img {
    width: 300px;
    height: 200px;
}

/* استخدم aspect-ratio */
img {
    aspect-ratio: 3 / 2;
}

/* تجنب الإعلانات والعناصر المنبثقة */
```

---

## ⚡ تحسينات الأداء

### 1. تقليل حجم الملفات

#### ضغط JavaScript
```bash
# استخدم Terser أو UglifyJS
npm install -g terser
terser script.js -o script.min.js
```

#### ضغط CSS
```bash
# استخدم cssnano
npm install -g cssnano
cssnano style.css -o style.min.css
```

#### ضغط الصور
```bash
# استخدم ImageMagick
convert image.jpg -quality 85 image-compressed.jpg

# أو استخدم أدوات أونلاين
# https://tinypng.com
# https://imageoptim.com
```

### 2. استخدام CDN

```html
<!-- استخدم CDN للمكتبات -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>

<!-- استخدم CDN للصور -->
<img src="https://cdn.example.com/images/product.jpg" alt="...">
```

### 3. Browser Caching

```javascript
// في Firebase Hosting
// firebase.json
{
  "hosting": {
    "headers": [
      {
        "source": "**/*.{js,css,png,gif,jpg,jpeg,svg,eot,otf,ttf,ttc,woff,woff2,font.css}",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### 4. Lazy Loading

```html
<!-- تحميل الصور بطريقة كسولة -->
<img loading="lazy" src="image.jpg" alt="...">

<!-- تحميل الإطارات بطريقة كسولة -->
<iframe loading="lazy" src="video.html"></iframe>
```

### 5. Code Splitting

```javascript
// استخدم Dynamic Imports
const module = await import('./heavy-module.js');

// أو استخدم Webpack
import(/* webpackChunkName: "heavy" */ './heavy-module.js')
    .then(module => {
        // استخدم الوحدة
    });
```

---

## ♿ إمكانية الوصول (Accessibility)

### 1. ARIA Labels
```html
<!-- أضف ARIA labels للعناصر التفاعلية -->
<button aria-label="إغلاق القائمة">✕</button>

<!-- استخدم aria-describedby -->
<input type="text" aria-describedby="error-message">
<span id="error-message">البريد الإلكتروني غير صحيح</span>
```

### 2. Semantic HTML
```html
<!-- استخدم عناصر دلالية -->
<header>رأس الموقع</header>
<nav>التنقل</nav>
<main>المحتوى الرئيسي</main>
<aside>الشريط الجانبي</aside>
<footer>تذييل الموقع</footer>
```

### 3. Color Contrast
```css
/* تأكد من التباين الكافي بين النصوص والخلفية */
/* النسبة الموصى بها: 4.5:1 للنصوص العادية */
/* 3:1 للنصوص الكبيرة */

body {
    color: #333; /* أسود غامق */
    background-color: #fff; /* أبيض */
    /* النسبة: 21:1 ممتازة */
}
```

### 4. Keyboard Navigation
```html
<!-- تأكد من أن جميع العناصر قابلة للتنقل بلوحة المفاتيح -->
<button tabindex="0">زر</button>
<a href="#" tabindex="0">رابط</a>
```

---

## 🔒 أفضل الممارسات

### 1. HTTPS
- استخدم شهادة SSL
- جميع الاتصالات يجب أن تكون آمنة

### 2. No Unminified JavaScript
- استخدم ملفات مضغوطة (.min.js)

### 3. No Unminified CSS
- استخدم ملفات مضغوطة (.min.css)

### 4. Avoid Inline JavaScript
```html
<!-- تجنب -->
<button onclick="doSomething()">زر</button>

<!-- استخدم بدلاً من ذلك -->
<button id="my-button">زر</button>
<script>
    document.getElementById('my-button').addEventListener('click', doSomething);
</script>
```

### 5. Use Viewport Meta Tag
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## 📊 أدوات مفيدة

| الأداة | الاستخدام |
|-------|----------|
| [PageSpeed Insights](https://pagespeed.web.dev/) | قياس الأداء |
| [GTmetrix](https://gtmetrix.com/) | تحليل الأداء المتقدم |
| [WebPageTest](https://www.webpagetest.org/) | اختبار الأداء التفصيلي |
| [Lighthouse](https://developers.google.com/web/tools/lighthouse) | تقييم شامل |
| [Google Search Console](https://search.google.com/search-console) | مراقبة الأداء |
| [TinyPNG](https://tinypng.com/) | ضغط الصور |
| [ImageOptim](https://imageoptim.com/) | تحسين الصور |

---

## ✅ Checklist الأداء

- [ ] LCP < 2.5 ثانية
- [ ] FID < 100 ميلي ثانية
- [ ] CLS < 0.1
- [ ] JavaScript مضغوط
- [ ] CSS مضغوط
- [ ] الصور محسّنة
- [ ] Lazy Loading للصور
- [ ] Browser Caching مفعّل
- [ ] HTTPS مفعّل
- [ ] CDN مستخدم
- [ ] Accessibility محسّنة
- [ ] Meta Tags موجودة

---

## 📞 الدعم

للمزيد من المعلومات:
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Web.dev Performance Guide](https://web.dev/performance/)
- [MDN Web Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)

---

**تم إعداد دليل الأداء بنجاح! 🎉**
