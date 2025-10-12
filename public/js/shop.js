// Script pour la boutique publique
let allProducts = [];
let categories = [];
let searchTerm = '';
let selectedCategory = '';

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    await loadCategories();
    await loadSocials();
    api.loadSiteSettings();

    // Événements
    document.getElementById('searchInput').addEventListener('input', filterProducts);
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', handleNavigation);
    });

    // Modal de contact
    const contactModal = document.getElementById('contactModal');
    const closeBtn = contactModal.querySelector('.close');
    
    closeBtn.addEventListener('click', () => {
        contactModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === contactModal) {
            contactModal.style.display = 'none';
        }
    });
});

// Charger les produits
async function loadProducts() {
    try {
        allProducts = await api.getProducts();
        displayProducts(allProducts);
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        document.getElementById('productsGrid').innerHTML = 
            '<p class="error">Erreur lors du chargement des produits</p>';
    }
}

// Charger les catégories
async function loadCategories() {
    try {
        categories = await api.getCategories();
        const select = document.getElementById('categoryFilter');
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
    }
}

// Charger les réseaux sociaux
async function loadSocials() {
    try {
        const socials = await api.getSocials();
        const container = document.getElementById('socialLinks');
        
        container.innerHTML = socials.map(social => `
            <a href="${social.url}" target="_blank" class="social-link">
                <span>${getIconForSocial(social.name)}</span>
                <span>${social.name}</span>
            </a>
        `).join('');
    } catch (error) {
        console.error('Erreur lors du chargement des réseaux sociaux:', error);
    }
}

// Afficher les produits
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        grid.innerHTML = '<p class="no-products">Aucun produit trouvé</p>';
        return;
    }

    grid.innerHTML = products.map(product => `
        <a href="product.html?id=${product.id}" class="product-card">
            <div class="product-media">
                ${product.media_type === 'video' 
                    ? `<iframe src="${product.media_url}" frameborder="0"></iframe>`
                    : `<img src="${product.media_url}" alt="${product.name}" loading="lazy">`
                }
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-meta">
                    ${product.category_name ? `<span class="category">📁 ${product.category_name}</span>` : ''}
                    ${product.farm_name ? `<span class="farm">🌱 ${product.farm_name}</span>` : ''}
                </div>
                <div class="product-prices">
                    ${product.prices.map(price => 
                        `<span class="price-tag">${price.qty} - ${price.price}</span>`
                    ).join('')}
                </div>
            </div>
        </a>
    `).join('');
}

// Filtrer les produits
function filterProducts() {
    searchTerm = document.getElementById('searchInput').value.toLowerCase();
    selectedCategory = document.getElementById('categoryFilter').value;

    const filtered = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            (product.description && product.description.toLowerCase().includes(searchTerm));
        const matchesCategory = !selectedCategory || product.category_id == selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    displayProducts(filtered);
}

// Gérer la navigation
function handleNavigation(e) {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    
    // Retirer la classe active de tous les items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    e.currentTarget.classList.add('active');

    switch(href) {
        case '#contact':
            document.getElementById('contactModal').style.display = 'flex';
            break;
        case '#categories':
            // Scroller vers les filtres
            document.querySelector('.search-section').scrollIntoView({ behavior: 'smooth' });
            break;
        case '#products':
            // Scroller vers les produits
            document.getElementById('productsGrid').scrollIntoView({ behavior: 'smooth' });
            break;
        default:
            // Page d'accueil
            window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Obtenir l'icône pour un réseau social
function getIconForSocial(name) {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('instagram')) return '📷';
    if (lowerName.includes('whatsapp')) return '💬';
    if (lowerName.includes('telegram')) return '✈️';
    if (lowerName.includes('facebook')) return '👤';
    if (lowerName.includes('twitter') || lowerName.includes('x')) return '🐦';
    if (lowerName.includes('tiktok')) return '🎵';
    if (lowerName.includes('youtube')) return '📺';
    return '🔗';
}

// Rafraîchir automatiquement si des changements sont détectés (via storage events)
window.addEventListener('storage', (e) => {
    if (e.key === 'productsUpdated') {
        loadProducts();
    } else if (e.key === 'settingsUpdated') {
        api.loadSiteSettings();
    }
});