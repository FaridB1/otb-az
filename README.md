# 🏗️ OTB.az — Online Tikinti Bazarı

Azərbaycanın ən böyük online tikinti materialları e-commerce platforması.

## 🚀 Texnologiyalar

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **SCSS Modules** (styling)
- **Redux Toolkit** (state management)
- **React Router v6** (routing)
- **Swiper** (hero slider)
- **React Icons** + **React Hot Toast**

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** authentication
- **Multer** (file upload)
- **Cloudinary** (optional image hosting)
- **bcryptjs** (password hashing)

## 📁 Layihə Strukturu

```
otb-az/
├── frontend/
│   ├── src/
│   │   ├── assets/styles/global.scss
│   │   ├── components/
│   │   │   ├── Admin/AdminLayout.tsx
│   │   │   ├── Cart/CartSidebar.tsx
│   │   │   ├── Footer/Footer.tsx
│   │   │   ├── Header/Header.tsx
│   │   │   ├── ProductCard/ProductCard.tsx
│   │   │   └── UI/Spinner.tsx
│   │   ├── context/store.ts         (Redux store)
│   │   ├── pages/
│   │   │   ├── Admin/               (Dashboard, Products, Orders, etc.)
│   │   │   ├── Home.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── Checkout.tsx
│   │   │   └── ...
│   │   ├── types/index.ts
│   │   ├── utils/api.ts
│   │   └── App.tsx
│   └── package.json
└── backend/
    ├── src/
    │   ├── middleware/auth.js
    │   ├── models/index.js          (Mongoose schemas)
    │   ├── routes/
    │   │   ├── auth.js
    │   │   ├── products.js
    │   │   ├── categories.js
    │   │   ├── orders.js
    │   │   ├── reviews.js
    │   │   ├── upload.js
    │   │   ├── banners.js
    │   │   ├── dashboard.js
    │   │   ├── wishlist.js
    │   │   └── coupons.js
    │   ├── utils/seed.js
    │   └── server.js
    └── package.json
```

## ⚡ Qurulum (1 gündə hazır)

### 1. Layihəni klonla
```bash
git clone <repo-url>
cd otb-az
```

### 2. Backend qurulumu
```bash
cd backend
npm install
cp .env.example .env
# .env faylını redaktə et (MongoDB URI, JWT_SECRET)
npm run seed        # Test məlumatları yüklə
npm run dev         # Port 5000-də başla
```

### 3. Frontend qurulumu
```bash
cd frontend
npm install
# .env.local artıq mövcuddur
npm run dev         # Port 5173-də başla
```

### 4. Admin Panelə Giriş
```
URL: http://localhost:5173/admin
Email: admin@otb.az
Şifrə: admin123
```

## 🔑 API Endpoints

| Method | Endpoint | Açıqlama |
|--------|----------|----------|
| POST | /api/auth/login | Admin girişi |
| GET | /api/products | Məhsullar (filterlər ilə) |
| GET | /api/products/slug/:slug | Məhsul (slug ilə) |
| GET | /api/categories | Kateqoriyalar |
| POST | /api/orders | Sifariş yarat |
| GET | /api/orders | Sifarişlər (admin) |
| POST | /api/reviews | Rəy əlavə et |
| GET | /api/dashboard/stats | Dashboard statistikası |
| POST | /api/coupons/validate | Kupon yoxla |
| POST | /api/upload/image | Şəkil yüklə |

## 🗂️ Kateqoriyalar
- 🧱 Tikinti Materialları (1240 məhsul)
- 🔨 Alətlər (858 məhsul)
- 🪵 Taxta & Laminat (430 məhsul)
- 🎨 Boya & Primer (680 məhsul)
- 🚿 Santexnika (920 məhsul)
- ⚡ Elektrik (1630 məhsul)
- ⚙️ Sement & Harç (340 məhsul)
- 🚪 Qapı & Pəncərə (230 məhsul)

## 🎨 Dizayn

OTB.az-ın orijinal dizaynına uyğun:
- **Rəng:** Qırmızı (#C8102E) + Tünd lacivert (#1A1A2E)
- **Font:** Montserrat (başlıqlar) + Inter (mətn)
- **Layout:** Responsive, mobile-first
- **Components:** Sticky header, cart sidebar, flash sale timer

## 📦 Məhsul Vahidləri
`ədəd`, `m²`, `m`, `kq`, `litr`, `vedrə`, `kisə`, `rulon`, `dəst`

## 🔐 Ətraf mühit dəyişənləri

**.env (backend):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/otb-az
JWT_SECRET=your-super-secret-key
FRONTEND_URL=http://localhost:5173
# Cloudinary (isteğe bağlı)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## 🚀 Production Deploy

```bash
# Frontend build
cd frontend && npm run build

# Backend production
cd backend
NODE_ENV=production npm start
```
