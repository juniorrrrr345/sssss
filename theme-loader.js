// Chargeur de thème dynamique
async function loadThemeBackground() {
    try {
        const response = await fetch(`${window.API_URL || 'https://algran-api.calitek-junior.workers.dev'}/api/settings`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const settings = await response.json();
        
        if (settings && settings.theme_bg_url) {
            // Créer un overlay pour le fond
            const overlay = document.createElement('div');
            overlay.className = 'theme-background-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url(${settings.theme_bg_url});
                background-size: cover;
                background-position: center;
                background-attachment: fixed;
                opacity: 0.1;
                z-index: -1;
                pointer-events: none;
            `;
            document.body.appendChild(overlay);
            
            console.log('✅ Fond de thème chargé:', settings.theme_bg_url);
        }
        
        // Appliquer le nom de la boutique si présent
        if (settings && settings.shop_name) {
            document.querySelectorAll('.shop-name, .site-title, .hero-title').forEach(el => {
                el.textContent = settings.shop_name;
            });
            
            // Mettre à jour le titre de la page
            if (document.title.includes('Al Gran')) {
                document.title = document.title.replace('Al Gran', settings.shop_name);
            }
        }
        
        return settings;
    } catch (error) {
        console.warn('⚠️ Pas de fond de thème personnalisé', error);
        return null;
    }
}

// Charger le thème au démarrage
document.addEventListener('DOMContentLoaded', loadThemeBackground);

// Export pour utilisation
window.loadThemeBackground = loadThemeBackground;