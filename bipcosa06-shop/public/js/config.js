// Configuration de l'API
const API_CONFIG = {
    BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : 'https://api.bipcosa06.com', // À remplacer par votre URL d'API réelle
    ENDPOINTS: {
        PRODUCTS: '/api/products',
        CATEGORIES: '/api/categories',
        SETTINGS: '/api/settings',
        SERVICES: '/api/services',
        FARMS: '/api/farms',
        ORDERS: '/api/orders'
    }
};

// Fonction helper pour construire les URLs d'API
function getApiUrl(endpoint) {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Fonction helper pour les requêtes API
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
        // En cas d'erreur, retourner une structure vide
        return { success: false, error: error.message };
    }
}

// Fonction pour sauvegarder des données localement
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Erreur sauvegarde localStorage:', error);
    }
}

// Fonction pour récupérer des données locales
function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Erreur lecture localStorage:', error);
        return null;
    }
}

// Configuration du shop par défaut
const DEFAULT_SETTINGS = {
    shop_name: 'BipCosa06',
    shop_description: 'Votre boutique de confiance',
    theme_color: '#1e90ff',
    currency: '€',
    contact_email: 'contact@bipcosa06.com'
};