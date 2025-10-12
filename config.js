/**
 * Configuration Centralisée - Al Gran
 * 
 * ⚠️ IMPORTANT : Après avoir déployé votre API sur Cloudflare Workers,
 * remplacez l'URL ci-dessous par votre URL Workers.
 * 
 * Exemple : https://algran-api-votre-nom.workers.dev
 */

// URL de l'API
// Pour le développement local avec Wrangler : http://localhost:8787
// Pour la production : https://algran-api-xxx.workers.dev
const API_CONFIG = {
    // ⬇️ MODIFIEZ CETTE LIGNE APRÈS LE DÉPLOIEMENT ⬇️
    apiUrl: 'http://localhost:8787',
    
    // Timeout pour les requêtes (en millisecondes)
    timeout: 10000,
    
    // Activer les logs de débogage
    debug: true
};

// Fonction helper pour faire des requêtes à l'API
async function apiRequest(endpoint, options = {}) {
    const url = `${API_CONFIG.apiUrl}${endpoint}`;
    
    if (API_CONFIG.debug) {
        console.log(`🌐 API Request: ${url}`);
    }
    
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (API_CONFIG.debug) {
            console.log(`✅ API Response:`, data);
        }
        
        return data;
    } catch (error) {
        console.error(`❌ API Error (${endpoint}):`, error.message);
        throw error;
    }
}

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, apiRequest };
}
