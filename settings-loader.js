// Chargeur de paramètres pour toutes les pages
const API_URL = 'https://algran-api.calitek-junior.workers.dev';

async function loadShopSettings() {
    try {
        const response = await fetch(`${API_URL}/api/settings`);
        if (!response.ok) throw new Error('Erreur API');
        
        const data = await response.json();
        
        if (data.success && data.settings) {
            // Appliquer le nom de la boutique
            if (data.settings.shop_name) {
                // Mettre à jour tous les éléments qui contiennent le nom
                document.querySelectorAll('.shop-name, .site-title, .hero-title, h1').forEach(el => {
                    // Vérifier si l'élément contient un nom de boutique
                    if (el.textContent.includes('Al Gran') || 
                        el.textContent.includes('COFFEELA55') || 
                        el.textContent.includes('Avec Amour')) {
                        el.textContent = data.settings.shop_name;
                    }
                });
                
                // Mettre à jour le titre de la page
                if (document.title.includes('Al Gran') || 
                    document.title.includes('COFFEELA55') || 
                    document.title.includes('Avec Amour')) {
                    document.title = document.title.replace(/Al Gran|COFFEELA55|Avec Amour/g, data.settings.shop_name);
                }
            }
            
            // Appliquer l'image de fond si configurée
            if (data.settings.theme_background_url) {
                // Créer ou mettre à jour l'overlay de fond
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
                        background-image: url(${data.settings.theme_background_url});
                        background-size: cover;
                        background-position: center;
                        background-attachment: fixed;
                        opacity: 0.1;
                        z-index: -1;
                        pointer-events: none;
                    `;
                    document.body.appendChild(overlay);
                } else {
                    overlay.style.backgroundImage = `url(${data.settings.theme_background_url})`;
                }
            }
            
            // Stocker les paramètres globalement
            window.shopSettings = data.settings;
            
            return data.settings;
        }
    } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
    }
}

// Charger automatiquement au chargement de la page
document.addEventListener('DOMContentLoaded', loadShopSettings);

// Recharger les paramètres toutes les 30 secondes pour rester à jour
setInterval(loadShopSettings, 30000);

// Export pour utilisation
window.loadShopSettings = loadShopSettings;