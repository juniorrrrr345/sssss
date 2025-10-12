// Configuration de l'API
const API_URL = 'https://algran-api.calitek-junior.workers.dev';
const ADMIN_PASSWORD = 'admin123';

// Configuration globale
const config = {
    api: {
        baseUrl: API_URL,
        endpoints: {
            products: '/api/products',
            categories: '/api/categories',
            settings: '/api/settings',
            stats: '/api/stats',
            socials: '/api/socials',
            farms: '/api/farms'
        }
    },
    defaultImage: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=500&h=400&fit=crop',
    shopName: 'Al Gran',
    theme: {
        primaryColor: '#ff3ea5',
        secondaryColor: '#a855f7',
        darkBg: '#0a0e27'
    }
};

// Fonction helper pour les appels API
async function fetchApi(endpoint, options = {}) {
    try {
        const url = `${config.api.baseUrl}${endpoint}`;
        console.log(`📡 Fetching: ${url}`);
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };
        
        const response = await fetch(url, { ...defaultOptions, ...options });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ Erreur API:', error);
        throw error;
    }
}

// Export pour utilisation dans d'autres scripts
window.API_URL = API_URL;
window.config = config;
window.fetchApi = fetchApi;