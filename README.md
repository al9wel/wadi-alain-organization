# منظومة مؤسسة وادي العين للتنمية والأرشفة — الواجهة الأمامية (Frontend)

واجهة ويب أحادية الصفحة (**SPA**) مبنية باستخدام **React 19** و**TypeScript 6** و**Vite 8** لإدارة الأرشيف الرقمي، الأقسام، المستخدمين ومرفقاتهم، الملف الشخصي، وسجل النشاط المؤسسي لمؤسسة وادي العين.

---

## 1. متطلبات البيئة والإصدارات (Environment & Versions)

هذه هي الإصدارات المعتمدة لتشغيل وبناء المشروع في بيئات التطوير والإنتاج (CI/CD):

| الأداة / الحزمة | الإصدار المعتمد | ملاحظات لمهندس الـ DevOps |
| :--- | :--- | :--- |
| **Node.js** | `v22.13.0` (`>= 22.12.0 LTS`) | يتطلب Vite 8 إصدار Node `20.19+` أو `22.12+` |
| **npm** | `11.7.0` (`>= 10.x`) | استخدم `npm ci` في السيرفر وخطوط البناء لضمان تطابق `package-lock.json` |
| **React / React DOM** | `^19.3.1` | مكتبة واجهة المستخدم |
| **TypeScript** | `~6.0.3` | فحص صارم للأنواع أثناء البناء (`tsc -b`) |
| **Vite** | `^8.3.6` | أداة التجميع والبناء (تُخرج الملفات الثابتة النهائية في مجلد `dist/`) |
| **Tailwind CSS** | `^4.3.5` | مدمج عبر `@tailwindcss/vite` |
| **React Router** | `^7.18.6` | توجيه SPA يعتمد على HTML5 History API (`createBrowserRouter`) |
| **TanStack Query / Table** | `^5.108.2` / `^8.21.2` | إدارة الكاش والطلبات والجداول |
| **Axios** | `^1.21.1` | عميل HTTP مركزي مع معالجة التوكن `Bearer Token` |

---

## 2. متغيرات البيئة (Environment Variables)

انسخ ملف `.env.example` إلى `.env` قبل التشغيل أو مرر المتغيرات في بيئة البناء:

```bash
cp .env.example .env
```

## 3. أوامر التشغيل والفحص والبناء (Scripts)

```bash
# 1. تثبيت الاعتماديات
npm ci

# 2. تشغيل خادم التطوير المحلي (المنفذ الافتراضي 5173)
npm run dev

# 3. فحص جودة الكود (ESLint)
npm run lint

# 4. فحص الأنواع وبناء نسخة الإنتاج داخل مجلد dist/
npm run build

# 5. معاينة نسخة الإنتاج محلياً بعد البناء (المنفذ الافتراضي 4173)
npm run preview
```

- **مجلد مخرجات البناء (Build Output Directory):** `dist`

---

## 4. توجيه المسارات (SPA Routing & Page Refresh)

التطبيق عبارة عن **Single Page Application (SPA)** يستخدم `react-router-dom`. لضمان عدم حدوث خطأ `404` عند تحديث المتصفح (`Refresh`) على المسارات الداخلية (مثل `/dashboard/users` أو `/dashboard/profile`):

- تم تضمين ملف **`vercel.json`** وملف **`public/_redirects`** لإعادة توجيه جميع المسارات تلقائياً إلى `/index.html` على المنصات السحابية مثل Vercel وNetlify وCloudflare Pages وAmplify.
- في حال تقديم ملفات `dist/` عبر خادم ويب مخصص (مثل **Nginx** أو **Apache** أو **CloudFront**)، يجب توجيه المسارات غير الموجودة إلى `/index.html` (مثلاً `try_files $uri $uri/ /index.html;` في Nginx).
- تأكد من إضافة نطاق الواجهة الأمامية ضمن `allowed_origins` في إعدادات **CORS** بالباكند (`config/cors.php`).

---

## 5. هيكلية المشروع المختصرة

```text
├── public/               # الأصول العامة وملف _redirects
├── src/
│   ├── app/              # الراوتر، الحراس، صفحات النظام (NotFound, Unauthorized, ErrorState)، ومخزن Zustand
│   ├── components/       # التخطيطات العامة (Sidebar / Navbar) ومكونات Shadcn UI
│   ├── constants/        # المسارات (routes)، الأدوار (roles)، والصلاحيات (permissions)
│   ├── features/         # الميزات المقسمة حسب النطاق (auth, departments, users, activity-logs, profile, settings)
│   ├── hooks/            # الخطافات المشتركة (useAuth, usePermission)
│   ├── lib/              # عميل Axios الموحد (api-client.ts) والأدوات المساعدة
│   ├── styles/           # إعدادات Tailwind v4 والهوية البصرية (globals.css)
│   └── types/            # تعريفات TypeScript المركزية
├── vercel.json           # إعداد إعادة التوجيه لـ SPA
└── .env.example          # نموذج متغيرات البيئة
```
