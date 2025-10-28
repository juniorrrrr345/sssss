// Theme Loader - Gère le chargement dynamique du thème
async function loadThemeBackground() {
    try {
        const data = await fetchApi(API_CONFIG.ENDPOINTS.SETTINGS);

        if (data.success && data.settings && data.settings.theme_background_url) {
            const bgUrl = data.settings.theme_background_url.trim();
            if (bgUrl !== '') {
                applyBackgroundImage(bgUrl);
                console.log('🎨 Fond de thème chargé:', bgUrl);
            }
        }
    } catch (error) {
        console.log('⚠️ Pas de fond de thème personnalisé', error);
    }
}

// Appliquer l'image de fond
function applyBackgroundImage(imageUrl) {
    // Appliquer l'image de fond
    document.body.style.backgroundImage = `url('${imageUrl}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundColor = '#000';

    // Masquer ou réduire l'opacité des éléments d'animation
    const cosmicBg = document.querySelector('.cosmic-background');
    if (cosmicBg) {
        cosmicBg.style.opacity = '0.3';
    }

    const bubbles = document.querySelector('.bubbles-container');
    if (bubbles) {
        bubbles.style.opacity = '0.3';
    }

    // Ajouter un overlay sombre pour améliorer la lisibilité
    if (!document.querySelector('.theme-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'theme-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.4);
            z-index: 0;
            pointer-events: none;
        `;
        document.body.insertBefore(overlay, document.body.firstChild);
    }
}

// Charger les paramètres du shop
async function loadShopSettings() {
    try {
        const data = await fetchApi(API_CONFIG.ENDPOINTS.SETTINGS);
        if (data.success && data.settings) {
            // Mettre à jour le nom du shop
            const shopNameElements = document.querySelectorAll('#shopName, .shop-name');
            shopNameElements.forEach(el => {
                el.textContent = data.settings.shop_name || DEFAULT_SETTINGS.shop_name;
            });

            // Mettre à jour le titre de la page
            if (data.settings.shop_name) {
                const currentTitle = document.title;
                const titleParts = currentTitle.split(' - ');
                if (titleParts.length > 1) {
                    document.title = `${titleParts[0]} - ${data.settings.shop_name}`;
                } else {
                    document.title = data.settings.shop_name;
                }
            }

            // Sauvegarder en local
            saveToLocalStorage('shop_settings', data.settings);
            
            return data.settings;
        }
    } catch (error) {
        console.error('Erreur chargement paramètres:', error);
        // Utiliser les paramètres sauvegardés localement
        const localSettings = getFromLocalStorage('shop_settings');
        if (localSettings) {
            return localSettings;
        }
    }
    
    return DEFAULT_SETTINGS;
}

// Initialisation au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    // Charger le thème de fond si pas déjà fait
    if (!document.body.style.backgroundImage) {
        loadThemeBackground();
    }
    
    // Charger les paramètres du shop
    loadShopSettings();
});

// Export des fonctions pour utilisation dans d'autres scripts
window.loadThemeBackground = loadThemeBackground;
window.loadShopSettings = loadShopSettings;