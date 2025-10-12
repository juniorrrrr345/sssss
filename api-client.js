/**
 * Client API pour Al Gran
 * Gère toutes les requêtes vers l'API Cloudflare Workers
 */

// Configuration de l'API
const API_CONFIG = {
    // URL de base de l'API - à configurer selon l'environnement
    baseURL: window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
        ? 'http://localhost:8787' // Développement local
        : window.location.origin, // Production
    timeout: 10000
};

/**
 * Fonction utilitaire pour faire des requêtes HTTP
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

/**
 * API Products
 */
const ProductsAPI = {
    /**
     * Récupère tous les produits
     */
    async getAll() {
        return await apiRequest('/api/products');
    },

    /**
     * Récupère un produit par son ID
     */
    async getById(id) {
        return await apiRequest(`/api/products/${id}`);
    },

    /**
     * Récupère les produits d'une catégorie
     */
    async getByCategory(category) {
        return await apiRequest(`/api/products/category/${encodeURIComponent(category)}`);
    }
};

/**
 * API Categories
 */
const CategoriesAPI = {
    /**
     * Récupère toutes les catégories
     */
    async getAll() {
        return await apiRequest('/api/categories');
    }
};

/**
 * API Links
 */
const LinksAPI = {
    /**
     * Récupère les liens de contact
     */
    async getLinks() {
        return await apiRequest('/api/links');
    }
};

/**
 * API Farms
 */
const FarmsAPI = {
    /**
     * Récupère la liste des farms
     */
    async getAll() {
        return await apiRequest('/api/farms');
    }
};

/**
 * API Settings
 */
const SettingsAPI = {
    /**
     * Récupère les paramètres
     */
    async getAll() {
        return await apiRequest('/api/settings');
    }
};

/**
 * Exporter l'API client
 */
window.API = {
    products: ProductsAPI,
    categories: CategoriesAPI,
    links: LinksAPI,
    farms: FarmsAPI,
    settings: SettingsAPI
};
