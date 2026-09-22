'use client';

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ghazi_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (typeof window !== 'undefined' && err.response?.status === 401) {
      localStorage.removeItem('ghazi_token');
      localStorage.removeItem('ghazi_admin_user');
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const fetchProducts = () => api.get('/products');
export const fetchProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const fetchCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
export const fetchOrders = () => api.get('/orders');
export const createOrder = (data) => api.post('/orders', data);
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status });
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

export default api;
