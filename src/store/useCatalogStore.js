'use client';

import { create } from 'zustand';
import {
  fetchProducts,
  fetchCategories,
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  createCategory as apiCreateCategory,
  deleteCategory as apiDeleteCategory,
} from '@/services/api';

export const useCatalogStore = create((set, get) => ({
  products: [],
  categories: [],
  loading: false,
  error: null,

  fetchCatalog: async () => {
    set({ loading: true, error: null });
    try {
      const [prodRes, catRes] = await Promise.all([fetchProducts(), fetchCategories()]);
      set({ products: prodRes.data, categories: catRes.data, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || err.message || 'Failed to load catalog',
      });
    }
  },

  addProduct: async (product) => {
    const payload = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      dimensions: product.dimensions,
      material: product.material,
      ply: product.ply,
      condition: product.condition,
      description: product.description,
      customizable: product.customizable,
      images: product.images,
      bulkPricing: product.bulkPricing || [],
    };
    await apiCreateProduct(payload);
    await get().fetchCatalog();
  },

  updateProduct: async (id, updates) => {
    const payload = {
      name: updates.name,
      category: updates.category,
      price: updates.price,
      stock: updates.stock,
      dimensions: updates.dimensions,
      material: updates.material,
      ply: updates.ply,
      condition: updates.condition,
      description: updates.description,
      customizable: updates.customizable,
      images: updates.images,
      bulkPricing: updates.bulkPricing || [],
    };
    await apiUpdateProduct(id, payload);
    await get().fetchCatalog();
  },

  deleteProduct: async (id) => {
    await apiDeleteProduct(id);
    await get().fetchCatalog();
  },

  addCategory: async (category) => {
    await apiCreateCategory(category);
    await get().fetchCatalog();
  },

  deleteCategory: async (id) => {
    await apiDeleteCategory(id);
    await get().fetchCatalog();
  },

  getCategoryName: (id) => get().categories.find((c) => c.id === id)?.name || id.replace(/-/g, ' '),
}));
