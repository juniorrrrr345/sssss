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

// Charger automatiquement les paramètres du site
async function autoLoadSettings() {
    try {
        const settings = await fetchApi('/api/settings');
        
        if (settings && settings.settings) {
            // Appliquer le nom de la boutique
            if (settings.settings.shop_name) {
                document.querySelectorAll('.shop-name, .site-title, .hero-title, h1, #shopName, .logo-text').forEach(el => {
                    if (el.textContent.includes('Al Gran') || 
                        el.textContent.includes('COFFEELA55') || 
                        el.textContent.includes('Avec Amour')) {
                        el.textContent = settings.settings.shop_name;
                    }
                });
                
                // Mettre à jour le titre de la page
                if (document.title.includes('Al Gran')) {
                    document.title = document.title.replace('Al Gran', settings.settings.shop_name);
                }
            }
            
            // Appliquer l'image de fond
            if (settings.settings.theme_background_url) {
                let overlay = document.querySelector('.theme-background-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'theme-background-overlay';
                    overlay.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-image: url(${settings.settings.theme_background_url});
                        background-size: cover;
                        background-position: center;
                        background-attachment: fixed;
                        opacity: 0.1;
                        z-index: -1;
                        pointer-events: none;
                    `;
                    document.body.appendChild(overlay);
                } else {
                    overlay.style.backgroundImage = `url(${settings.settings.theme_background_url})`;
                }
            }
            
            window.shopSettings = settings.settings;
        }
    } catch (error) {
        console.error('Erreur chargement paramètres:', error);
    }
}

// Charger au démarrage
document.addEventListener('DOMContentLoaded', autoLoadSettings);