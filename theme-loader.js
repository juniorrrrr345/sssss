/**
 * Chargeur de thème dynamique
 * Charge le fond de thème depuis les paramètres
 */

async function loadThemeBackground() {
    try {
        const data = await fetchApi('/api/settings');
        
        if (data.success && data.settings && data.settings.theme_background_url) {
            const bgUrl = data.settings.theme_background_url;
            
            if (bgUrl.trim() !== '') {
                // Appliquer l'image de fond
                document.body.style.backgroundImage = `url('${bgUrl}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundAttachment = 'fixed';
                document.body.style.backgroundRepeat = 'no-repeat';
                
                // Assombrir un peu pour la lisibilité
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.4);
                    z-index: -1;
                    pointer-events: none;
                `;
                document.body.insertBefore(overlay, document.body.firstChild);
                
                console.log('🎨 Fond de thème chargé:', bgUrl);
            }
        }
    } catch (error) {
        console.log('⚠️ Pas de fond de thème personnalisé');
    }
}

// Charger au démarrage
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', loadThemeBackground);
}
