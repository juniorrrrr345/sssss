import { create } from 'zustand';
import apiClient from '../lib/axios';

/**
 * Store Zustand pour gérer les liens
 */
const useLinksStore = create((set) => ({
  links: null,
  loading: false,
  error: null,

  /**
   * Récupère tous les liens depuis l'API
   */
  fetchLinks: async () => {
    set({
      loading: true,
      error: null
    });

    try {
      const response = await apiClient.get('/links');
      set({
        links: response.data,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching links:', error);
      set({
        error: 'Failed to fetch links',
        loading: false
      });
    }
  }
}));

export default useLinksStore;
