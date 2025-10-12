// Script pour le panneau admin
let currentSection = 'products';
let editingProductId = null;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier l'authentification
    if (!api.token) {
        showLoginModal();
    } else {
        initializeAdmin();
    }
});

// Afficher le modal de connexion
function showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    loginModal.style.display = 'flex';

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;
        
        try {
            api.setToken(password);
            // Tester l'authentification
            await api.getSettings();
            loginModal.style.display = 'none';
            initializeAdmin();
        } catch (error) {
            alert('Mot de passe incorrect');
            api.clearToken();
        }
    });
}

// Initialiser le panneau admin
function initializeAdmin() {
    // Navigation
    document.querySelectorAll('.admin-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            showSection(section);
        });
    });

    // Déconnexion
    document.getElementById('logoutBtn').addEventListener('click', () => {
        api.clearToken();
        window.location.reload();
    });

    // Événements des sections
    initializeProductsSection();
    initializeFarmsSection();
    initializeCategoriesSection();
    initializeSocialsSection();
    initializeSettingsSection();

    // Afficher la première section
    showSection('products');
}

// Afficher une section
function showSection(section) {
    currentSection = section;
    
    // Masquer toutes les sections
    document.querySelectorAll('.admin-section').forEach(s => {
        s.classList.remove('active');
    });
    
    // Activer la section sélectionnée
    document.getElementById(section).classList.add('active');
    
    // Mettre à jour la navigation
    document.querySelectorAll('.admin-nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.section === section);
    });
    
    // Charger les données de la section
    switch(section) {
        case 'products':
            loadProducts();
            break;
        case 'farms':
            loadFarms();
            break;
        case 'categories':
            loadCategories();
            break;
        case 'socials':
            loadSocials();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// Section Produits
function initializeProductsSection() {
    document.getElementById('addProductBtn').addEventListener('click', () => {
        editingProductId = null;
        showProductModal();
    });

    document.getElementById('productForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveProduct();
    });

    document.getElementById('addPriceBtn').addEventListener('click', addPriceInput);
    
    // Modal
    const modal = document.getElementById('productModal');
    const closeBtn = modal.querySelector('.close');
    
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Charger les produits
async function loadProducts() {
    try {
        const products = await api.getProducts();
        const container = document.getElementById('productsList');
        
        container.innerHTML = products.map(product => `
            <div class="item-row">
                <div>
                    <strong>${product.name}</strong>
                    <span class="product-meta">
                        ${product.category_name || 'Sans catégorie'} | 
                        ${product.farm_name || 'Sans farm'}
                    </span>
                </div>
                <div class="item-actions">
                    <button class="btn btn-secondary" onclick="editProduct(${product.id})">Modifier</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Supprimer</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Afficher le modal produit
async function showProductModal() {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('modalTitle');
    
    // Charger les catégories et farms
    await loadSelectOptions();
    
    if (editingProductId) {
        title.textContent = 'Modifier le produit';
        const product = await api.getProduct(editingProductId);
        
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productCategory').value = product.category_id || '';
        document.getElementById('productFarm').value = product.farm_id || '';
        document.getElementById('productMediaUrl').value = product.media_url || '';
        document.getElementById('productMediaType').value = product.media_type || 'image';
        
        // Charger les prix
        const pricesList = document.getElementById('pricesList');
        pricesList.innerHTML = '';
        product.prices.forEach(price => {
            addPriceInput(price.qty, price.price);
        });
    } else {
        title.textContent = 'Ajouter un produit';
        document.getElementById('productForm').reset();
        document.getElementById('pricesList').innerHTML = '';
        addPriceInput();
    }
    
    modal.style.display = 'flex';
}

// Charger les options des selects
async function loadSelectOptions() {
    try {
        // Catégories
        const categories = await api.getCategories();
        const categorySelect = document.getElementById('productCategory');
        categorySelect.innerHTML = '<option value="">Sélectionner...</option>' +
            categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        
        // Farms
        const farms = await api.getFarms();
        const farmSelect = document.getElementById('productFarm');
        farmSelect.innerHTML = '<option value="">Sélectionner...</option>' +
            farms.map(f => `<option value="${f.id}">${f.name}</option>`).join('');
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Ajouter un champ de prix
function addPriceInput(qty = '', price = '') {
    const pricesList = document.getElementById('pricesList');
    const div = document.createElement('div');
    div.className = 'price-input';
    div.innerHTML = `
        <input type="text" placeholder="Quantité (ex: 2g)" class="price-qty" value="${qty}">
        <input type="text" placeholder="Prix (ex: 20€)" class="price-value" value="${price}">
        <button type="button" class="btn-remove" onclick="this.parentElement.remove()">×</button>
    `;
    pricesList.appendChild(div);
}

// Sauvegarder le produit
async function saveProduct() {
    try {
        const product = {
            name: document.getElementById('productName').value,
            description: document.getElementById('productDescription').value,
            category_id: document.getElementById('productCategory').value || null,
            farm_id: document.getElementById('productFarm').value || null,
            media_url: document.getElementById('productMediaUrl').value,
            media_type: document.getElementById('productMediaType').value,
            prices: []
        };
        
        // Récupérer les prix
        document.querySelectorAll('.price-input').forEach(priceDiv => {
            const qty = priceDiv.querySelector('.price-qty').value;
            const value = priceDiv.querySelector('.price-value').value;
            if (qty && value) {
                product.prices.push({ qty, price: value });
            }
        });
        
        if (editingProductId) {
            await api.updateProduct(editingProductId, product);
        } else {
            await api.createProduct(product);
        }
        
        closeModal();
        loadProducts();
        
        // Notifier la page publique
        localStorage.setItem('productsUpdated', Date.now());
    } catch (error) {
        alert('Erreur lors de la sauvegarde: ' + error.message);
    }
}

// Éditer un produit
async function editProduct(id) {
    editingProductId = id;
    await showProductModal();
}

// Supprimer un produit
async function deleteProduct(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        try {
            await api.deleteProduct(id);
            loadProducts();
            localStorage.setItem('productsUpdated', Date.now());
        } catch (error) {
            alert('Erreur lors de la suppression: ' + error.message);
        }
    }
}

// Section Farms
function initializeFarmsSection() {
    document.getElementById('addFarmBtn').addEventListener('click', async () => {
        const name = document.getElementById('farmName').value.trim();
        if (name) {
            try {
                await api.createFarm(name);
                document.getElementById('farmName').value = '';
                loadFarms();
            } catch (error) {
                alert('Erreur: ' + error.message);
            }
        }
    });
}

async function loadFarms() {
    try {
        const farms = await api.getFarms();
        const container = document.getElementById('farmsList');
        
        container.innerHTML = farms.map(farm => `
            <div class="item-row">
                <span>${farm.name}</span>
                <div class="item-actions">
                    <button class="btn btn-danger" onclick="deleteFarm(${farm.id})">Supprimer</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erreur:', error);
    }
}

async function deleteFarm(id) {
    if (confirm('Êtes-vous sûr ?')) {
        try {
            await api.deleteFarm(id);
            loadFarms();
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    }
}

// Section Catégories
function initializeCategoriesSection() {
    document.getElementById('addCategoryBtn').addEventListener('click', async () => {
        const name = document.getElementById('categoryName').value.trim();
        if (name) {
            try {
                await api.createCategory(name);
                document.getElementById('categoryName').value = '';
                loadCategories();
            } catch (error) {
                alert('Erreur: ' + error.message);
            }
        }
    });
}

async function loadCategories() {
    try {
        const categories = await api.getCategories();
        const container = document.getElementById('categoriesList');
        
        container.innerHTML = categories.map(category => `
            <div class="item-row">
                <span>${category.name}</span>
                <div class="item-actions">
                    <button class="btn btn-danger" onclick="deleteCategory(${category.id})">Supprimer</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erreur:', error);
    }
}

async function deleteCategory(id) {
    if (confirm('Êtes-vous sûr ?')) {
        try {
            await api.deleteCategory(id);
            loadCategories();
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    }
}

// Section Réseaux sociaux
function initializeSocialsSection() {
    document.getElementById('addSocialBtn').addEventListener('click', async () => {
        const name = document.getElementById('socialName').value.trim();
        const url = document.getElementById('socialUrl').value.trim();
        
        if (name && url) {
            try {
                await api.createSocial({ name, url });
                document.getElementById('socialName').value = '';
                document.getElementById('socialUrl').value = '';
                loadSocials();
            } catch (error) {
                alert('Erreur: ' + error.message);
            }
        }
    });
}

async function loadSocials() {
    try {
        const socials = await api.getSocials();
        const container = document.getElementById('socialsList');
        
        container.innerHTML = socials.map(social => `
            <div class="item-row">
                <div>
                    <strong>${social.name}</strong>
                    <a href="${social.url}" target="_blank" style="color: var(--text-muted);">${social.url}</a>
                </div>
                <div class="item-actions">
                    <button class="btn btn-danger" onclick="deleteSocial(${social.id})">Supprimer</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erreur:', error);
    }
}

async function deleteSocial(id) {
    if (confirm('Êtes-vous sûr ?')) {
        try {
            await api.deleteSocial(id);
            loadSocials();
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    }
}

// Section Paramètres
function initializeSettingsSection() {
    document.getElementById('settingsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const settings = {
            shop_name: document.getElementById('shopName').value,
            theme_bg_url: document.getElementById('themeBgUrl').value,
            command_url: document.getElementById('commandUrl').value
        };
        
        try {
            await api.updateSettings(settings);
            alert('Paramètres enregistrés !');
            localStorage.setItem('settingsUpdated', Date.now());
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    });
}

async function loadSettings() {
    try {
        const settings = await api.getSettings();
        if (settings) {
            document.getElementById('shopName').value = settings.shop_name || '';
            document.getElementById('themeBgUrl').value = settings.theme_bg_url || '';
            document.getElementById('commandUrl').value = settings.command_url || '';
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Fermer le modal
function closeModal() {
    document.getElementById('productModal').style.display = 'none';
    editingProductId = null;
}