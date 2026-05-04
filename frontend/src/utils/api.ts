import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' }, timeout: 10000 });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('otbAdminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) { localStorage.removeItem('otbAdminToken'); window.location.href = '/admin/login'; }
  return Promise.reject(err);
});

export const productApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/products', { params }),
  search: (q: string) => api.get('/products/search', { params: { q } }),
  getById: (id: string) => api.get(`/products/${id}`),
  getBySlug: (slug: string) => api.get(`/products/slug/${slug}`),
  create: (data: unknown) => api.post('/products', data),
  update: (id: string, data: unknown) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  updateStock: (id: string, stock: number) => api.patch(`/products/${id}/stock`, { stock }),
};

export const categoryApi = {
  getAll: () => api.get('/categories'),
  create: (data: unknown) => api.post('/categories', data),
  update: (id: string, data: unknown) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

export const orderApi = {
  create: (data: unknown) => api.post('/orders', data),
  getAll: (params?: Record<string, unknown>) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string, note?: string) => api.patch(`/orders/${id}/status`, { status, note }),
};

export const reviewApi = {
  create: (data: unknown) => api.post('/reviews', data),
  getByProduct: (productId: string) => api.get(`/reviews/product/${productId}`),
  getAll: () => api.get('/reviews'),
  approve: (id: string) => api.patch(`/reviews/${id}/approve`),
  delete: (id: string) => api.delete(`/reviews/${id}`),
};

export const uploadApi = {
  uploadImage: (file: File) => { const f = new FormData(); f.append('image', file); return api.post('/upload/image', f, { headers: { 'Content-Type': 'multipart/form-data' } }); },
  uploadImages: (files: File[]) => { const f = new FormData(); files.forEach(fi => f.append('images', fi)); return api.post('/upload/images', f, { headers: { 'Content-Type': 'multipart/form-data' } }); },
  deleteImage: (publicId: string) => api.delete('/upload/image', { data: { publicId } }),
};

export const bannerApi = {
  getAll: (type?: string) => api.get('/banners', { params: type ? { type } : {} }),
  create: (data: unknown) => api.post('/banners', data),
  update: (id: string, data: unknown) => api.put(`/banners/${id}`, data),
  delete: (id: string) => api.delete(`/banners/${id}`),
};

export const dashboardApi = { getStats: () => api.get('/dashboard/stats') };

export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
  registerFirst: (data: unknown) => api.post('/auth/register-first-admin', data),
};

export const couponApi = {
  validate: (code: string, orderAmount: number) => api.post('/coupons/validate', { code, orderAmount }),
};

export default api;
