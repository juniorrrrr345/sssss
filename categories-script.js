/**
 * Script pour la page des catégories
 * Récupère et affiche les catégories depuis l'API
 */

// État de l'application
let categories = [];
let isLoading = false;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    await initCategoriesPage();
});

/**
 * Initialise la page des catégories
 */
async function initCategoriesPage() {
    try {
        showLoader();
        await fetchCategories();
        displayCategories();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showError('Échec du chargement des catégories. Veuillez réessayer plus tard.');
    } finally {
        hideLoader();
    }
}

/**
 * Récupère les catégories depuis l'API
 */
async function fetchCategories() {
    try {
        const response = await API.categories.getAll();
        
        if (response.success && response.categories) {
            categories = response.categories.filter(c => c.is_active === 1);
        } else {
            throw new Error('Format de réponse invalide');
        }
    } catch (error) {
        console.error('Erreur de récupération des catégories:', error);
        throw error;
    }
}

/**
 * Affiche les catégories
 */
function displayCategories() {
    const grid = document.getElementById('categoriesGrid');
    
    if (!grid) return;

    if (categories.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-10">
                <p class="text-pink-400 text-lg mb-4">Aucune catégorie disponible.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = categories.map(category => createCategoryCard(category)).join('');

    // Ajouter les écouteurs de clic
    grid.querySelectorAll('.category-card').forEach((card, index) => {
        card.addEventListener('click', () => navigateToCategory(categories[index]));
    });
}

/**
 * Crée une carte de catégorie
 */
function createCategoryCard(category) {
    const icon = category.icon || '📦';
    const productCount = category.product_count || 0;
    const imageUrl = category.image_url || 'images/product-placeholder.jpg';

    return `
        <div class="category-card" data-id="${category.id}">
            <div class="relative aspect-square overflow-hidden rounded-xl mb-4">
                <img 
                    src="${imageUrl}" 
                    alt="${category.name}"
                    class="w-full h-full object-cover"
                    onerror="this.src='images/product-placeholder.jpg'"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute bottom-4 left-4">
                    <span class="text-4xl">${icon}</span>
                </div>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">${category.name}</h3>
            ${category.description ? `
                <p class="text-gray-400 text-sm mb-3">${category.description}</p>
            ` : ''}
            <div class="flex items-center justify-between">
                <span class="text-emerald-400 text-sm font-medium">
                    ${productCount} ${productCount > 1 ? 'produits' : 'produit'}
                </span>
                <svg class="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        </div>
    `;
}

/**
 * Navigue vers une catégorie
 */
function navigateToCategory(category) {
    // Rediriger vers la page des produits avec le filtre de catégorie
    window.location.href = `category-products.html?category=${encodeURIComponent(category.name)}`;
}

/**
 * Affiche le loader
 */
function showLoader() {
    isLoading = true;
    const grid = document.getElementById('categoriesGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="col-span-full flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
        `;
    }
}

/**
 * Masque le loader
 */
function hideLoader() {
    isLoading = false;
}

/**
 * Affiche une erreur
 */
function showError(message) {
    const grid = document.getElementById('categoriesGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-10">
                <span class="text-xl text-red-400">${message}</span>
            </div>
        `;
    }
}
