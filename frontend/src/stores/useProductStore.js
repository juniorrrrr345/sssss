import { create } from 'zustand';
import apiClient from '../lib/axios';
import toast from '../lib/toast';

/**
 * Store Zustand pour gérer les produits
 */
const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  /**
   * Définit manuellement la liste des produits
   */
  setProducts: (products) => set({ products }),

  /**
   * Crée un nouveau produit
   */
  createProduct: async (productData) => {
    set({ loading: true });

    try {
      const response = await apiClient.post('/products', productData);
      set((state) => ({
        products: [...state.products, response.data],
        loading: false
      }));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create product');
      set({ loading: false });
    }
  },

  /**
   * Récupère tous les produits
   */
  fetchAllProducts: async () => {
    set({ loading: true });

    try {
      const response = await apiClient.get('/products');
      set({
        products: response.data.products,
        loading: false
      });
    } catch (error) {
      set({
        error: 'Failed to fetch products',
        loading: false
      });
      toast.error(error.response?.data?.error || 'Failed to fetch products');
    }
  },

  /**
   * Récupère les produits par catégorie
   */
  fetchProductsByCategory: async (category) => {
    set({ loading: true });

    try {
      const response = await apiClient.get(`/products/category/${category}`);
      set({
        products: response.data.products,
        loading: false
      });
    } catch (error) {
      set({
        error: 'Failed to fetch products',
        loading: false
      });
      toast.error(error.response?.data?.error || 'Failed to fetch products');
    }
  },

  /**
   * Supprime un produit par ID
   */
  deleteProduct: async (productId) => {
    set({ loading: true });

    try {
      await apiClient.delete(`/products/${productId}`);
      set((state) => ({
        products: state.products.filter((product) => product._id !== productId),
        loading: false
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.error || 'Failed to delete product');
    }
  },

  /**
   * Modifie un produit existant
   */
  editProduct: async (productId, productData) => {
    set({ loading: true });

    try {
      const response = await apiClient.put(`/products/${productId}`, productData);
      set((state) => ({
        products: state.products.map((product) =>
          product._id === productId ? response.data : product
        ),
        loading: false
      }));
      toast.success('Product updated successfully');
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.error || 'Failed to update product');
    }
  },

  /**
   * Bascule l'état "en vedette" d'un produit
   */
  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });

    try {
      const response = await apiClient.patch(`/products/${productId}`);
      set((state) => ({
        products: state.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.isFeatured }
            : product
        ),
        loading: false
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.error || 'Failed to update product');
    }
  },

  /**
   * Récupère les produits en vedette
   */
  fetchFeaturedProducts: async () => {
    set({ loading: true });

    try {
      const response = await apiClient.get('/products/featured');
      set({
        products: response.data,
        loading: false
      });
    } catch (error) {
      set({
        error: 'Failed to fetch products',
        loading: false
      });
      console.log('Error fetching featured products:', error);
    }
  }
}));

export default useProductStore;
