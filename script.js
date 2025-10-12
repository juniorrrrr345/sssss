// Données des produits basées sur l'image
const products = [
    {
        id: 1,
        name: "100K ROSIN",
        category: "100K",
        badge: "🔥 LIVE ROSIN",
        price: 200,
        unit: "/ 2g",
        image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=500&h=400&fit=crop"
    },
    {
        id: 2,
        name: "HASH BURGER",
        category: "ESTATICO",
        badge: "💎 FROZEN USA us",
        price: 120,
        unit: "/ 5g",
        image: "https://images.unsplash.com/photo-1536964310528-e47dd655ecf3?w=500&h=400&fit=crop"
    },
    {
        id: 3,
        name: "POTION",
        category: "WIZARD TREES",
        badge: "🌿 TOPSHELF CALIFORNIA BRANDED us",
        price: 110,
        unit: "/ 3.5g",
        image: "https://images.unsplash.com/photo-1603909075879-2c6e224fd5bb?w=500&h=400&fit=crop"
    },
    {
        id: 4,
        name: "ZANGBANGER",
        category: "WIZARD TREES",
        badge: "🔥 TOPSHELF CALIFORNIA BRANDED us",
        price: 110,
        unit: "/ 3.5g",
        image: "https://images.unsplash.com/photo-1566054757965-20c27d98b0e2?w=500&h=400&fit=crop"
    },
    {
        id: 5,
        name: "TOP DRY",
        category: "MCAFARM",
        badge: "💨 DRY us",
        price: 50,
        unit: "/ 3g",
        image: "https://images.unsplash.com/photo-1587767766972-fdf899d364e6?w=500&h=400&fit=crop"
    },
    {
        id: 6,
        name: "DARK MATTER",
        category: "WIZARD TREES",
        badge: "🌿 TOPSHELF USA us",
        price: 110,
        unit: "/ 3.5g",
        image: "https://images.unsplash.com/photo-1610896650098-34d3af7d98be?w=500&h=400&fit=crop"
    },
    {
        id: 7,
        name: "CONCRETE JUNGLE",
        category: "KARMA CARTEL",
        badge: "💎 TOPSHELF BRANDED us",
        price: 180,
        unit: "/ 7g",
        image: "https://images.unsplash.com/photo-1563181672-99f84b03c2e5?w=500&h=400&fit=crop"
    },
    {
        id: 8,
        name: "ZKITTLEZ",
        category: "NORTH BAY GARDEN",
        badge: "🌈 TOPSHELF BRANDED us",
        price: 180,
        unit: "/ 7g",
        image: "https://images.unsplash.com/photo-1587760560986-1c8b85fc89e8?w=500&h=400&fit=crop"
    },
    {
        id: 9,
        name: "BIG Z",
        category: "KARMA CARTEL",
        badge: "💜 TOPSHELF BRANDED us",
        price: 100,
        unit: "/ 3.5g",
        image: "https://images.unsplash.com/photo-1608571387750-4d14e2a4c179?w=500&h=400&fit=crop"
    },
    {
        id: 10,
        name: "GUSHMINTZ",
        category: "ESTATICO",
        badge: "❄️ STATIC USA us",
        price: 170,
        unit: "/ 5g",
        image: "https://images.unsplash.com/photo-1620912366589-b0c5285c2fc2?w=500&h=400&fit=crop"
    },
    {
        id: 11,
        name: "WEDDING CAKE",
        category: "PREMIUM",
        badge: "💎 TOPSHELF BRANDED",
        price: 150,
        unit: "/ 7g",
        image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=500&h=400&fit=crop"
    },
    {
        id: 12,
        name: "GELATO 41",
        category: "EXCLUSIVE",
        badge: "🔥 TOPSHELF USA",
        price: 130,
        unit: "/ 3.5g",
        image: "https://images.unsplash.com/photo-1609770215665-9a5360f41b4e?w=500&h=400&fit=crop"
    },
    {
        id: 13,
        name: "PURPLE PUNCH",
        category: "WIZARD TREES",
        badge: "💜 TOPSHELF CALIFORNIA",
        price: 120,
        unit: "/ 3.5g",
        image: "https://images.unsplash.com/photo-1617661394886-5919e6aa1a5a?w=500&h=400&fit=crop"
    },
    {
        id: 14,
        name: "BLUE DREAM",
        category: "CLASSIC",
        badge: "💙 TOPSHELF BRANDED",
        price: 95,
        unit: "/ 3.5g",
        image: "https://images.unsplash.com/photo-1628582420968-c0ed80e35b0d?w=500&h=400&fit=crop"
    },
    {
        id: 15,
        name: "OG KUSH",
        category: "LEGEND",
        badge: "👑 CLASSIC USA",
        price: 140,
        unit: "/ 5g",
        image: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=500&h=400&fit=crop"
    }
];

let filteredProducts = [...products];

// Fonction pour créer une carte produit
function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <div style="position: relative;">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-badge">${product.badge}</div>
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
    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 40px; font-size: 1.2rem;">Aucun produit trouvé 😔</p>';
        return;
    }
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
    alert(`🌿 ${product.name}\n\n` +
          `Catégorie: ${product.category}\n` +
          `${product.badge}\n\n` +
          `Prix: ${product.price}€ ${product.unit}\n\n` +
          `Cliquez pour ajouter au panier !`);
}

// Animation de chargement
window.addEventListener('load', () => {
    setTimeout(() => {
        displayProducts(filteredProducts);
    }, 100);
});

// Affichage initial des produits
displayProducts(filteredProducts);

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
