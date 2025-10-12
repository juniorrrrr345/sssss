// Données des produits exactes comme sur l'image
const products = [
    {
        id: 1,
        name: "HONEY BANANA",
        category: "BETR MADE",
        badge: "SINGLE SOURCE 🇺🇸",
        price: 200,
        unit: "/ 1g",
        image: "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=500&h=400&fit=crop",
        media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=800&h=600&fit=crop' }
        ]
    },
    {
        id: 2,
        name: "100K ROSIN",
        category: "100K",
        badge: "LIVE ROSIN",
        price: 200,
        unit: "/ 2g",
        image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=500&h=400&fit=crop",
        media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=600&fit=crop' }
        ]
    },
    {
        id: 3,
        name: "HASH BURGER",
        category: "ESTATICO",
        badge: "FROZEN USA 🇺🇸",
        price: 120,
        unit: "/ 5g",
        image: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=500&h=400&fit=crop",
        media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=800&h=600&fit=crop' }
        ]
    },
    {
        id: 4,
        name: "POTION",
        category: "WIZARD TREES",
        badge: "TOPSHELF CALIFORNIA BRANDED 🇺🇸",
        price: 110,
        unit: "/ 3.5g",
        image: "https://images.unsplash.com/photo-1587583650730-2bc61dd9f28e?w=500&h=400&fit=crop",
        media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1587583650730-2bc61dd9f28e?w=800&h=600&fit=crop' }
        ]
    },
    {
        id: 5,
        name: "ZANGBANGER",
        category: "WIZARD TREES",
        badge: "TOPSHELF CALIFORNIA BRANDED 🇺🇸",
        price: 110,
        unit: "/ 3.5g",
        image: "https://images.unsplash.com/photo-1606206873764-fd15982c78d9?w=500&h=400&fit=crop",
        media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1606206873764-fd15982c78d9?w=800&h=600&fit=crop' }
        ]
    },
    {
        id: 6,
        name: "TOP DRY",
        category: "MCAFARM",
        badge: "DRY 🇺🇸",
        price: 50,
        unit: "/ 5g",
        image: "https://images.unsplash.com/photo-1567606404190-8dd00b54e3d9?w=500&h=400&fit=crop",
        media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1567606404190-8dd00b54e3d9?w=800&h=600&fit=crop' }
        ]
    },
    {
        id: 7,
        name: "DARK MATTER",
        category: "WIZARD TREES",
        badge: "TOPSHELF USA 🇺🇸",
        price: 110,
        unit: "/ 3.5g",
        image: "https://images.unsplash.com/photo-1606225457115-9b0de873c5db?w=500&h=400&fit=crop",
        media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1606225457115-9b0de873c5db?w=800&h=600&fit=crop' }
        ]
    },
    {
        id: 8,
        name: "CONCRETE JUNGLE",
        category: "KARMA CARTEL",
        badge: "TOPSHELF BRANDED 🇺🇸",
        price: 180,
        unit: "/ 7g",
        image: "https://images.unsplash.com/photo-1623656575531-aec0aca0c0ff?w=500&h=400&fit=crop",
        media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1623656575531-aec0aca0c0ff?w=800&h=600&fit=crop' }
        ]
    },
    {
        id: 9,
        name: "ZKITTLEZ",
        category: "NORTH BAY GARDEN",
        badge: "TOPSHELF BRANDED 🇺🇸",
        price: 180,
        unit: "/ 7g",
        image: "https://images.unsplash.com/photo-1628582420968-c0ed80e35b0d?w=500&h=400&fit=crop",
        media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1628582420968-c0ed80e35b0d?w=800&h=600&fit=crop' }
        ]
    },
    {
        id: 10,
        name: "BIG Z",
        category: "KARMA CARTEL",
        badge: "TOPSHELF BRANDED 🇺🇸",
        price: 100,
        unit: "/ 3.5g",
        image: "https://images.unsplash.com/photo-1629116518542-9cc3088e94ed?w=500&h=400&fit=crop",
        media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1629116518542-9cc3088e94ed?w=800&h=600&fit=crop' }
        ]
    },
    {
        id: 11,
        name: "GUSHMINTZ",
        category: "ESTATICO",
        badge: "STATIC USA 🇺🇸",
        price: 170,
        unit: "/ 5g",
        image: "https://images.unsplash.com/photo-1606209749541-4b29dea5f065?w=500&h=400&fit=crop",
        media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1606209749541-4b29dea5f065?w=800&h=600&fit=crop' }
        ]
    },
    {
        id: 12,
        name: "PURPLE CREAM",
        category: "ESTATICO",
        badge: "STATIC USA 🇺🇸",
        price: 140,
        unit: "/ 5g",
        image: "https://images.unsplash.com/photo-1609770223364-84c2ab160a23?w=500&h=400&fit=crop",
        media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1609770223364-84c2ab160a23?w=800&h=600&fit=crop' }
        ]
    },
    {
        id: 13,
        name: "MARSHMALLOW X COOKIES",
        category: "TOPSHELF CANADA 🇨🇦",
        badge: "TOPSHELF CANADA 🇨🇦",
        price: 150,
        unit: "/ 7g",
        image: "https://images.unsplash.com/photo-1592136957897-b2b6ca21b10b?w=500&h=400&fit=crop",
        media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1592136957897-b2b6ca21b10b?w=800&h=600&fit=crop' }
        ]
    },
    {
        id: 14,
        name: "LORD SLUMPERZZ",
        category: "TOPSHELF CANADA 🇨🇦",
        badge: "TOPSHELF CANADA 🇨🇦",
        price: 160,
        unit: "/ 7g",
        image: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=500&h=400&fit=crop",
        media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800&h=600&fit=crop' }
        ]
    },
    {
        id: 15,
        name: "SUPERBOOF",
        category: "TOPSHELF SPAIN",
        badge: "TOPSHELF SPAIN",
        price: 130,
        unit: "/ 3.5g",
        image: "https://images.unsplash.com/photo-1618149439530-3d9db2f00c6f?w=500&h=400&fit=crop",
        media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1618149439530-3d9db2f00c6f?w=800&h=600&fit=crop' }
        ]
    }
];

let filteredProducts = [...products];
let loaderAnimation = null;
let emptyStateAnimation = null;

// Initialiser les animations Lottie
function initLottieAnimations() {
    // Animation de chargement (Spinner cosmique)
    loaderAnimation = lottie.loadAnimation({
        container: document.getElementById('lottieLoader'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://lottie.host/8ec4eb98-c3e4-4d2f-a5b6-32aa99da7d9a/rX1jjNzPit.json'
    });

    // Animation état vide (Boîte vide avec recherche)
    emptyStateAnimation = lottie.loadAnimation({
        container: document.getElementById('lottieEmpty'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://lottie.host/0c3be5a0-6109-45ff-89ec-8a7db1e3f7d7/CtGm8bZvxU.json'
    });
}

// Afficher le loader
function showLoader() {
    document.getElementById('loadingAnimation').style.display = 'block';
    document.getElementById('productsGrid').style.display = 'none';
    document.getElementById('emptyStateAnimation').style.display = 'none';
}

// Masquer le loader
function hideLoader() {
    document.getElementById('loadingAnimation').style.display = 'none';
}

// Fonction pour déterminer la classe du badge
function getBadgeClass(badge) {
    const badgeText = badge.toLowerCase();
    if (badgeText.includes('live rosin')) return 'live-rosin';
    if (badgeText.includes('frozen')) return 'frozen';
    if (badgeText.includes('topshelf california')) return 'topshelf';
    if (badgeText.includes('topshelf usa')) return 'topshelf';
    if (badgeText.includes('topshelf branded')) return 'topshelf';
    if (badgeText.includes('dry')) return 'dry';
    if (badgeText.includes('static')) return 'static';
    if (badgeText.includes('canada')) return 'canada';
    if (badgeText.includes('spain')) return 'topshelf';
    return '';
}

// Fonction pour créer une carte produit
function createProductCard(product) {
    const badgeClass = getBadgeClass(product.badge);
    return `
        <div class="product-card" data-id="${product.id}">
            <div style="position: relative;">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-badge ${badgeClass}">${product.badge}</div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-category">
                    <span class="category-icon"></span>
                    <span>${product.category}</span>
                </div>
                <div class="product-price">
                    ${product.price}€ <span class="unit">${product.unit}</span>
                </div>
            </div>
        </div>
    `;
}

// Fonction pour afficher les produits
function displayProducts(productsToDisplay) {
    const productsGrid = document.getElementById('productsGrid');
    const emptyState = document.getElementById('emptyStateAnimation');
    
    hideLoader();
    
    if (productsToDisplay.length === 0) {
        productsGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    productsGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    productsGrid.innerHTML = productsToDisplay.map(createProductCard).join('');
}

// Fonction de recherche
function handleSearch(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    if (term === '') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term) ||
            product.badge.toLowerCase().includes(term)
        );
    }
    
    displayProducts(filteredProducts);
}

// Gestionnaire d'événements pour la recherche
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
    handleSearch(e.target.value);
});

// Gestionnaire d'événements pour le bouton filtres
const filterBtn = document.getElementById('filterBtn');
const filterModal = document.getElementById('filterModal');
const closeModal = document.getElementById('closeModal');
const btnOk = document.getElementById('btnOk');

// Ouvrir le modal
filterBtn.addEventListener('click', () => {
    filterModal.classList.add('active');
});

// Fermer le modal avec le bouton X
closeModal.addEventListener('click', () => {
    filterModal.classList.remove('active');
});

// Fermer le modal avec le bouton OK
btnOk.addEventListener('click', () => {
    filterModal.classList.remove('active');
});

// Fermer le modal en cliquant en dehors
filterModal.addEventListener('click', (e) => {
    if (e.target === filterModal) {
        filterModal.classList.remove('active');
    }
});

// Gestionnaire de clic sur les cartes produits
document.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (card) {
        const productId = parseInt(card.dataset.id);
        const product = products.find(p => p.id === productId);
        if (product) {
            showProductDetails(product);
        }
    }
});

// Fonction pour afficher les détails du produit
function showProductDetails(product) {
    // Rediriger vers la page de détails du produit
    window.location.href = `product-detail.html?id=${product.id}`;
}

// Initialisation au chargement de la page
window.addEventListener('load', () => {
    initLottieAnimations();
    
    // Simuler un chargement pour montrer l'animation
    showLoader();
    setTimeout(() => {
        displayProducts(filteredProducts);
    }, 1500);
});

// Effet de parallaxe sur le scroll
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.main-title');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            ticking = false;
        });
        ticking = true;
    }
});
