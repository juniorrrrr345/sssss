// Connecteur API pour les pages Al Gran
const API_URL = 'https://algran-api.calitek-junior.workers.dev';

// Charger les produits depuis l'API
async function loadProductsFromAPI() {
    try {
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) throw new Error('Erreur API');
        
        const products = await response.json();
        
        // Stocker dans une variable globale pour les pages qui en ont besoin
        window.productsData = products;
        
        // Si on est sur la page products.html, afficher les produits
        if (window.displayProducts && typeof window.displayProducts === 'function') {
            window.displayProducts(products);
        }
        
        return products;
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        // Afficher un message d'erreur à l'utilisateur
        const container = document.querySelector('.products-grid') || document.querySelector('.products-container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #ff6b6b;">
                    <p>Impossible de charger les produits.</p>
                    <p>Vérifiez votre connexion internet.</p>
                </div>
            `;
        }
    }
}

// Charger les catégories depuis l'API
async function loadCategoriesFromAPI() {
    try {
        const response = await fetch(`${API_URL}/api/categories`);
        if (!response.ok) throw new Error('Erreur API');
        
        const categories = await response.json();
        window.categoriesData = categories;
        
        return categories;
    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
    }
}

// Charger les paramètres du site
async function loadSettingsFromAPI() {
    try {
        const response = await fetch(`${API_URL}/api/settings`);
        if (!response.ok) throw new Error('Erreur API');
        
        const settings = await response.json();
        
        // Appliquer le nom du site
        if (settings.shop_name) {
            document.querySelectorAll('.site-title, .hero-title, h1').forEach(el => {
                if (el.textContent.includes('Al Gran') || el.textContent.includes('Avec Amour')) {
                    el.textContent = settings.shop_name;
                }
            });
        }
        
        // Appliquer l'image de fond si configurée
        if (settings.theme_bg_url) {
            document.body.style.backgroundImage = `url(${settings.theme_bg_url})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
        }
        
        return settings;
    } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
    }
}

// Charger automatiquement au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    // Charger les paramètres du site
    await loadSettingsFromAPI();
    
    // Si on est sur une page qui affiche des produits
    if (window.location.pathname.includes('products.html') || 
        window.location.pathname.includes('home.html')) {
        await loadProductsFromAPI();
        await loadCategoriesFromAPI();
    }
});

// Exporter pour utilisation dans d'autres scripts
window.algranAPI = {
    loadProducts: loadProductsFromAPI,
    loadCategories: loadCategoriesFromAPI,
    loadSettings: loadSettingsFromAPI,
    API_URL
};