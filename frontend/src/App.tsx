import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './context/store';
import Layout from './components/Layout';
import AdminLayout from './components/Admin/AdminLayout';
import Spinner from './components/UI/Spinner';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AdminLogin = lazy(() => import('./pages/Admin/Login'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/Admin/Products'));
const AdminProductForm = lazy(() => import('./pages/Admin/ProductForm'));
const AdminOrders = lazy(() => import('./pages/Admin/Orders'));
const AdminOrderDetail = lazy(() => import('./pages/Admin/OrderDetail'));
const AdminCategories = lazy(() => import('./pages/Admin/Categories'));
const AdminBanners = lazy(() => import('./pages/Admin/Banners'));
const AdminReviews = lazy(() => import('./pages/Admin/Reviews'));

const App: React.FC = () => (
  <HelmetProvider>
    <Provider store={store}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'Montserrat, sans-serif', fontWeight: 600 },
            success: { iconTheme: { primary: '#C8102E', secondary: '#fff' } },
          }}
        />
        <Suspense fallback={<Spinner fullPage />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="mehsullar" element={<Products />} />
              <Route path="mehsullar/:slug" element={<ProductDetail />} />
              <Route path="kategoriya/:slug" element={<Products />} />
              <Route path="sebat" element={<Cart />} />
              <Route path="sifaris" element={<Checkout />} />
              <Route path="sifaris-ugurlu/:orderNumber" element={<OrderSuccess />} />
              <Route path="sevimliler" element={<Wishlist />} />
              <Route path="haqqimizda" element={<About />} />
              <Route path="elaqe" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="mehsullar" element={<AdminProducts />} />
              <Route path="mehsullar/yeni" element={<AdminProductForm />} />
              <Route path="mehsullar/:id/duzenle" element={<AdminProductForm />} />
              <Route path="sifarisler" element={<AdminOrders />} />
              <Route path="sifarisler/:id" element={<AdminOrderDetail />} />
              <Route path="kateqoriyalar" element={<AdminCategories />} />
              <Route path="bannerler" element={<AdminBanners />} />
              <Route path="reyler" element={<AdminReviews />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  </HelmetProvider>
);

export default App;
