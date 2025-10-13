// Configuration API
window.API_URL = 'https://algran-api.calitek-junior.workers.dev';

// Configuration générale
const API_CONFIG = {
    BASE_URL: window.API_URL,
    ENDPOINTS: {
        PRODUCTS: '/api/products',
        CATEGORIES: '/api/categories',
        SETTINGS: '/api/settings'
    }
};

// Fonction helper pour les appels API
async function fetchApi(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur API:', error);
        throw error;
    }
}