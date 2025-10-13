// Script universel pour mettre à jour le nom de la boutique partout
(async function() {
    const API_URL = 'https://algran-api.calitek-junior.workers.dev';
    
    async function forceUpdateShopName() {
        try {
            console.log('🔄 Mise à jour du nom de boutique...');
            
            const response = await fetch(`${API_URL}/api/settings`);
            const data = await response.json();
            
            if (data.success && data.settings && data.settings.shop_name) {
                const newShopName = data.settings.shop_name;
                console.log('📝 Nouveau nom:', newShopName);
                
                // Remplacer PARTOUT où on trouve "Al Gran"
                function replaceInElement(element) {
                    if (element.nodeType === Node.TEXT_NODE) {
                        if (element.textContent.includes('Al Gran') || 
                            element.textContent.includes('COFFEELA55') || 
                            element.textContent.includes('Avec Amour')) {
                            element.textContent = element.textContent
                                .replace(/Al Gran/g, newShopName)
                                .replace(/COFFEELA55/g, newShopName)
                                .replace(/Avec Amour/g, newShopName);
                        }
                    } else if (element.nodeType === Node.ELEMENT_NODE) {
                        for (let child of element.childNodes) {
                            replaceInElement(child);
                        }
                    }
                }
                
                // Remplacer dans tout le body
                replaceInElement(document.body);
                
                // Remplacer dans le titre
                document.title = document.title
                    .replace(/Al Gran/g, newShopName)
                    .replace(/COFFEELA55/g, newShopName)
                    .replace(/Avec Amour/g, newShopName);
                
                // Forcer la mise à jour des éléments spécifiques
                const elementsToUpdate = [
                    document.getElementById('shopName'),
                    ...document.querySelectorAll('.logo-text'),
                    ...document.querySelectorAll('.shop-name'),
                    ...document.querySelectorAll('.site-title'),
                    ...document.querySelectorAll('.hero-title'),
                    ...document.querySelectorAll('h1')
                ];
                
                elementsToUpdate.forEach(el => {
                    if (el && (el.textContent.includes('Al Gran') || 
                              el.textContent.includes('COFFEELA55') || 
                              el.textContent.includes('Avec Amour'))) {
                        el.textContent = newShopName;
                    }
                });
                
                console.log('✅ Nom de boutique mis à jour partout !');
                
                // Appliquer aussi l'image de fond si configurée
                if (data.settings.theme_background_url) {
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
                    }
                }
            }
        } catch (error) {
            console.error('❌ Erreur:', error);
        }
    }
    
    // Attendre que la page soit chargée
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceUpdateShopName);
    } else {
        // Attendre un peu que tout soit bien chargé
        setTimeout(forceUpdateShopName, 100);
    }
    
    // Réessayer après 1 seconde pour être sûr
    setTimeout(forceUpdateShopName, 1000);
})();