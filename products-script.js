/**
 * Script pour la page des produits
 * Récupère et affiche les produits depuis l'API
 */

// État de l'application
let allProducts = [];
let filteredProducts = [];
let selectedCategory = '';
let selectedFarm = '';
let searchTerm = '';
let isLoading = false;
let currentProductModal = null;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    await initProductsPage();
});

/**
 * Initialise la page des produits
 */
async function initProductsPage() {
    try {
        showLoader();
        await fetchProducts();
        setupEventListeners();
        displayProducts(filteredProducts);
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showError('Échec du chargement des produits. Veuillez réessayer plus tard.');
    } finally {
        hideLoader();
    }
}

/**
 * Récupère les produits depuis l'API
 */
async function fetchProducts() {
    try {
        const response = await API.products.getAll();
        
        if (response.success && response.products) {
            allProducts = response.products;
            filteredProducts = [...allProducts];
        } else {
            throw new Error('Format de réponse invalide');
        }
    } catch (error) {
        console.error('Erreur de récupération des produits:', error);
        throw error;
    }
}

/**
 * Configure les écouteurs d'événements
 */
function setupEventListeners() {
    // Recherche
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Bouton filtres
    const filterBtn = document.getElementById('filterBtn');
    if (filterBtn) {
        filterBtn.addEventListener('click', toggleFilters);
    }

    // Filtres de catégorie et farm
    const categoryFilter = document.getElementById('categoryFilter');
    const farmFilter = document.getElementById('farmFilter');
    
    if (categoryFilter) {
        populateFilterOptions();
        categoryFilter.addEventListener('change', handleCategoryFilter);
    }
    
    if (farmFilter) {
        farmFilter.addEventListener('change', handleFarmFilter);
    }

    // Bouton reset filtres
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
}

/**
 * Remplit les options des filtres
 */
function populateFilterOptions() {
    // Catégories uniques
    const categories = [...new Set(allProducts.map(p => p.category).filter(Boolean))].sort();
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (categoryFilter) {
        categoryFilter.innerHTML = '<option value="">Toutes les Catégories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = `🏷️ ${category}`;
            categoryFilter.appendChild(option);
        });
    }

    // Farms uniques
    const farms = [...new Set(allProducts.map(p => p.farm).filter(Boolean))].sort();
    const farmFilter = document.getElementById('farmFilter');
    
    if (farmFilter) {
        farmFilter.innerHTML = '<option value="">Toutes les Farms</option>';
        farms.forEach(farm => {
            const option = document.createElement('option');
            option.value = farm;
            option.textContent = `🌱 ${farm}`;
            farmFilter.appendChild(option);
        });
    }
}

/**
 * Gère la recherche
 */
function handleSearch(event) {
    searchTerm = event.target.value.toLowerCase().trim();
    applyFilters();
}

/**
 * Gère le filtre de catégorie
 */
function handleCategoryFilter(event) {
    selectedCategory = event.target.value;
    applyFilters();
}

/**
 * Gère le filtre de farm
 */
function handleFarmFilter(event) {
    selectedFarm = event.target.value;
    applyFilters();
}

/**
 * Applique tous les filtres
 */
function applyFilters() {
    filteredProducts = allProducts.filter(product => {
        // Filtre par catégorie
        if (selectedCategory && product.category !== selectedCategory) {
            return false;
        }

        // Filtre par farm
        if (selectedFarm && product.farm !== selectedFarm) {
            return false;
        }

        // Filtre par recherche
        if (searchTerm) {
            const searchableText = `${product.name} ${product.category} ${product.farm}`.toLowerCase();
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }

        return true;
    });

    displayProducts(filteredProducts);
}

/**
 * Réinitialise tous les filtres
 */
function resetFilters() {
    searchTerm = '';
    selectedCategory = '';
    selectedFarm = '';

    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const farmFilter = document.getElementById('farmFilter');

    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (farmFilter) farmFilter.value = '';

    applyFilters();
}

/**
 * Affiche/masque les filtres
 */
function toggleFilters() {
    const filtersContainer = document.getElementById('filtersContainer');
    if (filtersContainer) {
        const isVisible = filtersContainer.style.display === 'grid';
        filtersContainer.style.display = isVisible ? 'none' : 'grid';
    }
}

/**
 * Affiche les produits
 */
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    
    if (!grid) return;

    if (products.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-10">
                <p class="text-pink-400 text-lg mb-4">Aucun produit trouvé.</p>
                ${(selectedCategory || selectedFarm || searchTerm) ? `
                    <button onclick="resetFilters()" class="px-4 py-2 rounded-lg font-medium bg-pink-500 hover:bg-pink-600 text-white transition-all duration-200">
                        Réinitialiser les filtres
                    </button>
                ` : ''}
            </div>
        `;
        return;
    }

    grid.innerHTML = products.map(product => createProductCard(product)).join('');

    // Ajouter les écouteurs de clic
    grid.querySelectorAll('.product-card').forEach((card, index) => {
        card.addEventListener('click', () => openProductModal(products[index]));
    });
}

/**
 * Crée une carte produit
 */
function createProductCard(product) {
    const mainImage = product.image1 || 'images/product-placeholder.jpg';
    const minPrice = product.prices && product.prices.length > 0 
        ? Math.min(...product.prices.map(p => p.price))
        : 0;

    return `
        <div class="product-card flex" data-id="${product._id}">
            <div class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-200 cursor-pointer w-full">
                <div class="relative aspect-square overflow-hidden">
                    <img 
                        src="${mainImage}" 
                        alt="${product.name}"
                        class="w-full h-full object-cover"
                        onerror="this.src='images/product-placeholder.jpg'"
                    >
                    ${product.category ? `
                        <div class="absolute top-2 left-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2 py-1 rounded-full">
                            ${product.category}
                        </div>
                    ` : ''}
                </div>
                <div class="p-3">
                    <h3 class="font-bold text-white mb-1 text-sm">${product.name}</h3>
                    ${product.farm ? `
                        <p class="text-gray-400 text-xs mb-2">🌱 ${product.farm}</p>
                    ` : ''}
                    ${minPrice > 0 ? `
                        <p class="text-emerald-400 font-bold">À partir de ${minPrice}€</p>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * Ouvre la modal de détails du produit
 */
function openProductModal(product) {
    currentProductModal = product;
    
    const modal = document.getElementById('productModal');
    if (!modal) {
        createProductModal();
    }
    
    updateModalContent(product);
    document.getElementById('productModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Crée la modal de produit
 */
function createProductModal() {
    const modalHTML = `
        <div id="productModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg relative text-white border border-gray-800" onclick="event.stopPropagation()">
                    <button onclick="closeProductModal()" class="absolute top-3 right-3 z-20 bg-black/40 hover:bg-black/60 text-white/80 hover:text-white rounded-full p-1.5 backdrop-blur-sm transition-all duration-200">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    
                    <div id="modalCarousel" class="relative">
                        <!-- Le carrousel sera inséré ici -->
                    </div>
                    
                    <div class="p-5">
                        <div class="flex items-center justify-between mb-1">
                            <h2 id="modalProductName" class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"></h2>
                            <span id="modalProductCategory" class="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"></span>
                        </div>
                        <p id="modalProductDescription" class="text-gray-400 mb-5 text-sm leading-relaxed"></p>
                        
                        <div id="modalProductPrices" class="grid grid-cols-2 gap-2 mb-6">
                            <!-- Les prix seront insérés ici -->
                        </div>
                        
                        <a id="modalOrderLink" href="#" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-6 rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 font-medium">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                            </svg>
                            Commander
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Fermer en cliquant en dehors
    document.getElementById('productModal').addEventListener('click', (e) => {
        if (e.target.id === 'productModal') {
            closeProductModal();
        }
    });
}

/**
 * Met à jour le contenu de la modal
 */
function updateModalContent(product) {
    // Nom et catégorie
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductCategory').textContent = product.category || '';
    
    // Description
    document.getElementById('modalProductDescription').textContent = product.description || '';
    
    // Carrousel d'images/vidéos
    updateCarousel(product);
    
    // Prix
    const pricesContainer = document.getElementById('modalProductPrices');
    if (product.prices && product.prices.length > 0) {
        const sortedPrices = [...product.prices].sort((a, b) => a.price - b.price);
        pricesContainer.innerHTML = sortedPrices.map(price => `
            <div class="flex justify-between items-center bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3">
                <span class="text-gray-300 font-medium">${price.gram}</span>
                <span class="text-emerald-400 font-bold">${price.price}€</span>
            </div>
        `).join('');
    } else {
        pricesContainer.innerHTML = '<p class="text-gray-400 col-span-2">Prix non disponible</p>';
    }
    
    // Lien de commande (WhatsApp)
    updateOrderLink(product);
}

/**
 * Met à jour le carrousel
 */
function updateCarousel(product) {
    const carousel = document.getElementById('modalCarousel');
    const media = [];
    
    // Collecter toutes les images
    if (product.image1) media.push({ type: 'image', url: product.image1 });
    if (product.image2) media.push({ type: 'image', url: product.image2 });
    if (product.image3) media.push({ type: 'image', url: product.image3 });
    if (product.image4) media.push({ type: 'image', url: product.image4 });
    if (product.image5) media.push({ type: 'image', url: product.image5 });
    
    // Ajouter la vidéo si disponible
    if (product.video) media.push({ type: 'video', url: product.video });
    
    if (media.length === 0) {
        carousel.innerHTML = `
            <div class="aspect-[4/3] bg-gray-800 flex items-center justify-center">
                <p class="text-gray-400">Aucune image disponible</p>
            </div>
        `;
        return;
    }
    
    let currentIndex = 0;
    
    const renderCarousel = () => {
        const current = media[currentIndex];
        const mediaHTML = current.type === 'image' 
            ? `<img src="${current.url}" alt="${product.name}" class="w-full h-full object-cover" onerror="this.src='images/product-placeholder.jpg'">`
            : `<video controls class="w-full h-full object-cover">
                 <source src="${current.url}" type="video/mp4">
                 Votre navigateur ne prend pas en charge la balise vidéo.
               </video>`;
        
        carousel.innerHTML = `
            <div class="relative overflow-hidden rounded-xl">
                <div class="aspect-[4/3] bg-gray-800">
                    ${mediaHTML}
                </div>
                ${media.length > 1 ? `
                    <button onclick="changeCarouselMedia(-1)" class="absolute top-1/2 left-2 transform -translate-y-1/2 cursor-pointer z-10 bg-black/30 hover:bg-black/50 rounded-full p-2.5 backdrop-blur-sm transition-all duration-200 text-white/70 hover:text-white">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <button onclick="changeCarouselMedia(1)" class="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer z-10 bg-black/30 hover:bg-black/50 rounded-full p-2.5 backdrop-blur-sm transition-all duration-200 text-white/70 hover:text-white">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                    <div class="absolute bottom-4 left-0 right-0 flex justify-center">
                        <div class="flex gap-2 py-2 px-3 bg-black/40 backdrop-blur-md rounded-full">
                            ${media.map((m, i) => `
                                <button onclick="setCarouselIndex(${i})" class="w-2 h-2 rounded-full ${i === currentIndex ? 'bg-emerald-400' : 'bg-white/30'}"></button>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    };
    
    window.changeCarouselMedia = (direction) => {
        currentIndex = (currentIndex + direction + media.length) % media.length;
        renderCarousel();
    };
    
    window.setCarouselIndex = (index) => {
        currentIndex = index;
        renderCarousel();
    };
    
    renderCarousel();
}

/**
 * Met à jour le lien de commande
 */
async function updateOrderLink(product) {
    try {
        const response = await API.links.getLinks();
        const whatsappLink = response.links?.contact || 'https://wa.me/';
        document.getElementById('modalOrderLink').href = whatsappLink;
    } catch (error) {
        console.error('Erreur lors de la récupération du lien WhatsApp:', error);
    }
}

/**
 * Ferme la modal de produit
 */
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Affiche le loader
 */
function showLoader() {
    isLoading = true;
    const grid = document.getElementById('productsGrid');
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
    const grid = document.getElementById('productsGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-10">
                <span class="text-xl text-red-400">${message}</span>
            </div>
        `;
    }
}

// Ajouter le CSS pour la modal active
const style = document.createElement('style');
style.textContent = `
    #productModal.active {
        display: flex !important;
    }
`;
document.head.appendChild(style);

// Exporter les fonctions pour utilisation globale
window.resetFilters = resetFilters;
window.closeProductModal = closeProductModal;
