// Script pour mettre à jour le nom de la boutique sur toutes les pages
(function() {
    // Attendre que config.js soit chargé
    function waitForConfig() {
        if (window.API_URL || window.config) {
            updateShopName();
        } else {
            setTimeout(waitForConfig, 100);
        }
    }

    async function updateShopName() {
        try {
            const API_URL = window.API_URL || 'https://algran-api.calitek-junior.workers.dev';
            const response = await fetch(`${API_URL}/api/settings`);
            const data = await response.json();
            
            if (data.success && data.settings && data.settings.shop_name) {
                const shopName = data.settings.shop_name;
                
                // Mettre à jour tous les éléments possibles
                const selectors = [
                    '#shopName',
                    '.shop-name',
                    '.logo-text',
                    '.site-title',
                    '.hero-title'
                ];
                
                selectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => {
                        if (el.textContent.includes('Al Gran') || 
                            el.textContent.includes('COFFEELA55') || 
                            el.textContent.includes('Avec Amour')) {
                            el.textContent = shopName;
                        }
                    });
                });
                
                // Mettre à jour le titre de la page
                if (document.title.includes('Al Gran')) {
                    document.title = document.title.replace('Al Gran', shopName);
                }
                
                console.log('✅ Nom de boutique mis à jour:', shopName);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du nom:', error);
        }
    }

    // Lancer au chargement de la page
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForConfig);
    } else {
        waitForConfig();
    }
    
    // Réessayer après 2 secondes au cas où
    setTimeout(updateShopName, 2000);
})();