'use client';

import { create } from 'zustand';
import {
  fetchOrders,
  createOrder as apiCreateOrder,
  updateOrderStatus as apiUpdateOrderStatus,
  deleteOrder as apiDeleteOrder,
} from '@/services/api';

export const useOrderStore = create((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await fetchOrders();
      set({ orders: data, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || err.message || 'Failed to load orders',
      });
    }
  },

  addOrder: async (order) => {
    const { data } = await apiCreateOrder(order);
    set({ orders: [data, ...get().orders] });
    return data;
  },

  updateOrderStatus: async (id, status) => {
    const { data } = await apiUpdateOrderStatus(id, status);
    set({ orders: get().orders.map((o) => (o.id === id ? data : o)) });
  },

  deleteOrder: async (id) => {
    await apiDeleteOrder(id);
    set({ orders: get().orders.filter((o) => o.id !== id) });
  },
}));
