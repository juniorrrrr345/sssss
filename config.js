/**
 * Configuration centralisée pour Al Gran
 * Ce fichier contient l'URL de l'API et d'autres paramètres globaux
 */

// URL de l'API Cloudflare Workers
// Pour développement local : https://algran-api.calitek-junior.workers.dev
// Pour production : https://algran-api.VOTRE-SUBDOMAIN.workers.dev
const API_CONFIG = {
    // URL de base de l'API
    BASE_URL: 'https://algran-api.calitek-junior.workers.dev',
    
    // Endpoints
    ENDPOINTS: {
        PRODUCTS: '/api/products',
        CATEGORIES: '/api/categories',
        SERVICES: '/api/services',
        SETTINGS: '/api/settings',
        STATS: '/api/stats',
        UPLOAD: '/api/upload'
    },
    
    // Timeout pour les requêtes (en millisecondes)
    TIMEOUT: 10000,
    
    // Configuration du cache
    CACHE: {
        ENABLED: true,
        DURATION: 5 * 60 * 1000 // 5 minutes
    }
};

// Fonction helper pour construire les URLs complètes
function getApiUrl(endpoint) {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Fonction helper pour faire des requêtes API avec gestion d'erreur
async function fetchApi(endpoint, options = {}) {
    try {
        const url = getApiUrl(endpoint);
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur API:', error);
        throw error;
    }
}

// Cache simple pour les données
const dataCache = {
    data: {},
    timestamps: {},
    
    get(key) {
        if (!API_CONFIG.CACHE.ENABLED) return null;
        
        const timestamp = this.timestamps[key];
        if (!timestamp) return null;
        
        const age = Date.now() - timestamp;
        if (age > API_CONFIG.CACHE.DURATION) {
            delete this.data[key];
            delete this.timestamps[key];
            return null;
        }
        
        return this.data[key];
    },
    
    set(key, value) {
        if (!API_CONFIG.CACHE.ENABLED) return;
        
        this.data[key] = value;
        this.timestamps[key] = Date.now();
    },
    
    clear() {
        this.data = {};
        this.timestamps = {};
    }
};

// Exporter pour utilisation globale
if (typeof window !== 'undefined') {
    window.API_CONFIG = API_CONFIG;
    window.getApiUrl = getApiUrl;
    window.fetchApi = fetchApi;
    window.dataCache = dataCache;
}
