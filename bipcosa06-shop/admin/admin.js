// Configuration Admin
const ADMIN_PASSWORD = "admin123"; // À changer en production !
const API_BASE = window.API_CONFIG ? window.API_CONFIG.BASE_URL : 'http://localhost:3000';

// État de l'application
let state = {
    products: [],
    categories: [],
    farms: [],
    services: [],
    socials: [],
    settings: {},
    editing: { type: null, id: null }
};

// ===== INITIALISATION =====
document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    initNavigation();
    initLogout();
    initModals();
    initForms();
    loadAllData();
});

// ===== AUTHENTIFICATION =====
function checkAuth() {
    const auth = sessionStorage.getItem("admin_authenticated");
    if (!auth) {
        showLoginModal();
    }
}

function showLoginModal() {
    const password = prompt("Entrez le mot de passe administrateur :");
    if (password !== null) {
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem("admin_authenticated", "true");
            showAlert("Connexion réussie !", "success");
        } else {
            showAlert("Mot de passe incorrect !", "error");
            setTimeout(() => showLoginModal(), 1000);
        }
    } else {
        window.location.href = "../public/index.html";
    }
}

// ===== NAVIGATION =====
function initNavigation() {
    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", () => {
            if (item.id === "logoutBtn") return;
            
            document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            
            const section = item.dataset.section;
            document.querySelectorAll(".content-section").forEach(s => s.classList.remove("active"));
            if (section) {
                document.getElementById(section).classList.add("active");
                updateSection(section);
            }
        });
    });
}

function updateSection(section) {
    switch(section) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'products':
            renderProducts();
            break;
        case 'categories':
            renderCategories();
            break;
        case 'farms':
            renderFarms();
            break;
        case 'services':
            renderServices();
            break;
        case 'social':
            renderSocials();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// ===== CHARGEMENT DES DONNÉES =====
async function loadAllData() {
    // Charger depuis l'API ou le localStorage
    try {
        // Essayer de charger depuis l'API
        if (window.fetchApi) {
            const [productsData, categoriesData, servicesData, settingsData] = await Promise.all([
                fetchApi('/api/products'),
                fetchApi('/api/categories'),
                fetchApi('/api/services'),
                fetchApi('/api/settings')
            ]);
            
            if (productsData.success) state.products = productsData.products || [];
            if (categoriesData.success) state.categories = categoriesData.categories || [];
            if (servicesData.success) state.services = servicesData.services || [];
            if (settingsData.success) state.settings = settingsData.settings || {};
        }
    } catch (error) {
        console.log('API non disponible, utilisation du localStorage');
    }
    
    // Charger depuis localStorage comme fallback
    state.products = getFromLocalStorage('admin_products') || state.products;
    state.categories = getFromLocalStorage('admin_categories') || state.categories;
    state.farms = getFromLocalStorage('admin_farms') || state.farms;
    state.services = getFromLocalStorage('admin_services') || state.services;
    state.socials = getFromLocalStorage('admin_socials') || state.socials;
    state.settings = getFromLocalStorage('admin_settings') || state.settings;
    
    // Si aucune donnée, initialiser avec des données par défaut
    if (state.categories.length === 0) {
        state.categories = [
            { id: 1, name: 'Fleurs Premium', icon: '🌺', description: 'Nos meilleures sélections' },
            { id: 2, name: 'Résines', icon: '💎', description: 'Résines de haute qualité' },
            { id: 3, name: 'Huiles', icon: '🧪', description: 'Extraits concentrés' },
            { id: 4, name: 'Accessoires', icon: '🔧', description: 'Tout le nécessaire' }
        ];
        saveToLocalStorage('admin_categories', state.categories);
    }
    
    if (state.farms.length === 0) {
        state.farms = [
            { id: 1, name: 'Green Valley', region: 'Californie', logo: '' },
            { id: 2, name: 'Mountain Farm', region: 'Colorado', logo: '' },
            { id: 3, name: 'Valley Gardens', region: 'Oregon', logo: '' }
        ];
        saveToLocalStorage('admin_farms', state.farms);
    }
    
    updateDashboard();
}

// ===== DASHBOARD =====
function updateDashboard() {
    document.getElementById("statProducts").textContent = state.products.filter(p => p.is_active !== false).length;
    document.getElementById("statCategories").textContent = state.categories.length;
    document.getElementById("statFarms").textContent = state.farms.length;
    document.getElementById("statServices").textContent = state.services.filter(s => s.is_active !== false).length;
}

// ===== LOGOUT =====
function initLogout() {
    document.getElementById("logoutBtn").addEventListener("click", () => {
        sessionStorage.removeItem("admin_authenticated");
        window.location.href = "../public/index.html";
    });
}

// ===== ALERTS =====
function showAlert(message, type = "success") {
    const container = document.getElementById("alertContainer");
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    container.appendChild(alert);
    
    setTimeout(() => {
        alert.style.opacity = "0";
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// ===== MODALS =====
function initModals() {
    // Boutons d'ajout
    document.getElementById("addProductBtn").addEventListener("click", () => openProductModal());
    document.getElementById("addCategoryBtn").addEventListener("click", () => openCategoryModal());
    document.getElementById("addFarmBtn").addEventListener("click", () => openFarmModal());
    document.getElementById("addServiceBtn").addEventListener("click", () => openServiceModal());
    document.getElementById("addSocialBtn").addEventListener("click", () => openSocialModal());
    
    // Fermeture des modals
    document.querySelectorAll(".close-modal, .btn-secondary").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const modalId = e.target.dataset.modal || e.target.closest('.modal').id;
            closeModal(modalId);
        });
    });
    
    // Fermeture au clic en dehors
    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add("active");
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove("active");
}

// ===== FORMULAIRES =====
function initForms() {
    // Formulaire produit
    document.getElementById("productForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        saveProduct();
    });
    
    // Formulaire catégorie
    document.getElementById("categoryForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        saveCategory();
    });
    
    // Formulaire farm
    document.getElementById("farmForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        saveFarm();
    });
    
    // Formulaire paramètres
    document.getElementById("settingsForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        saveSettings();
    });
}

// ===== PRODUITS =====
function renderProducts() {
    const tbody = document.getElementById("productsTableBody");
    
    if (state.products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Aucun produit</td></tr>';
        return;
    }
    
    tbody.innerHTML = state.products.map(product => `
        <tr>
            <td>
                <img src="${product.image_url || 'https://via.placeholder.com/50'}" 
                     alt="${product.name}" 
                     class="table-image">
            </td>
            <td>${product.name}</td>
            <td>${getCategoryName(product.category_id)}</td>
            <td>${getFarmName(product.farm_id) || '-'}</td>
            <td>${product.price}€ ${product.unit || ''}</td>
            <td>
                <span class="badge ${product.is_active !== false ? 'badge-active' : 'badge-inactive'}">
                    ${product.is_active !== false ? 'Actif' : 'Inactif'}
                </span>
            </td>
            <td>
                <button class="btn-edit" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteItem('products', ${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function openProductModal(product = null) {
    state.editing = { type: 'product', id: product ? product.id : null };
    
    // Remplir les selects
    const categorySelect = document.getElementById("productCategory");
    categorySelect.innerHTML = '<option value="">Sélectionner une catégorie</option>' +
        state.categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    
    const farmSelect = document.getElementById("productFarm");
    farmSelect.innerHTML = '<option value="">Sélectionner une farm</option>' +
        state.farms.map(farm => `<option value="${farm.id}">${farm.name}</option>`).join('');
    
    if (product) {
        document.getElementById("productModalTitle").textContent = "Modifier le produit";
        document.getElementById("productId").value = product.id;
        document.getElementById("productName").value = product.name;
        document.getElementById("productCategory").value = product.category_id;
        document.getElementById("productFarm").value = product.farm_id || '';
        document.getElementById("productPrice").value = product.price;
        document.getElementById("productUnit").value = product.unit || '';
        document.getElementById("productImage").value = product.image_url || '';
        document.getElementById("productDescription").value = product.description || '';
        document.getElementById("productActive").checked = product.is_active !== false;
    } else {
        document.getElementById("productModalTitle").textContent = "Ajouter un produit";
        document.getElementById("productForm").reset();
    }
    
    openModal("productModal");
}

function saveProduct() {
    const id = document.getElementById("productId").value || Date.now();
    const product = {
        id: parseInt(id),
        name: document.getElementById("productName").value,
        category_id: parseInt(document.getElementById("productCategory").value),
        farm_id: document.getElementById("productFarm").value ? parseInt(document.getElementById("productFarm").value) : null,
        price: parseFloat(document.getElementById("productPrice").value),
        unit: document.getElementById("productUnit").value,
        image_url: document.getElementById("productImage").value,
        description: document.getElementById("productDescription").value,
        is_active: document.getElementById("productActive").checked
    };
    
    if (state.editing.id) {
        state.products = state.products.map(p => p.id === parseInt(id) ? product : p);
        showAlert("Produit modifié avec succès !", "success");
    } else {
        state.products.push(product);
        showAlert("Produit ajouté avec succès !", "success");
    }
    
    saveToLocalStorage('admin_products', state.products);
    closeModal("productModal");
    renderProducts();
    updateDashboard();
}

function editProduct(id) {
    const product = state.products.find(p => p.id === id);
    if (product) {
        openProductModal(product);
    }
}

// ===== CATÉGORIES =====
function renderCategories() {
    const tbody = document.getElementById("categoriesTableBody");
    
    if (state.categories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Aucune catégorie</td></tr>';
        return;
    }
    
    tbody.innerHTML = state.categories.map(category => {
        const productCount = state.products.filter(p => p.category_id === category.id).length;
        return `
            <tr>
                <td style="font-size: 2rem;">${category.icon || '📦'}</td>
                <td>${category.name}</td>
                <td>${category.description || '-'}</td>
                <td>${productCount}</td>
                <td>
                    <button class="btn-edit" onclick="editCategory(${category.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteItem('categories', ${category.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function openCategoryModal(category = null) {
    state.editing = { type: 'category', id: category ? category.id : null };
    
    if (category) {
        document.getElementById("categoryModalTitle").textContent = "Modifier la catégorie";
        document.getElementById("categoryId").value = category.id;
        document.getElementById("categoryName").value = category.name;
        document.getElementById("categoryIcon").value = category.icon || '';
        document.getElementById("categoryDescription").value = category.description || '';
    } else {
        document.getElementById("categoryModalTitle").textContent = "Ajouter une catégorie";
        document.getElementById("categoryForm").reset();
    }
    
    openModal("categoryModal");
}

function saveCategory() {
    const id = document.getElementById("categoryId").value || Date.now();
    const category = {
        id: parseInt(id),
        name: document.getElementById("categoryName").value,
        icon: document.getElementById("categoryIcon").value || '📦',
        description: document.getElementById("categoryDescription").value
    };
    
    if (state.editing.id) {
        state.categories = state.categories.map(c => c.id === parseInt(id) ? category : c);
        showAlert("Catégorie modifiée avec succès !", "success");
    } else {
        state.categories.push(category);
        showAlert("Catégorie ajoutée avec succès !", "success");
    }
    
    saveToLocalStorage('admin_categories', state.categories);
    closeModal("categoryModal");
    renderCategories();
    updateDashboard();
}

function editCategory(id) {
    const category = state.categories.find(c => c.id === id);
    if (category) {
        openCategoryModal(category);
    }
}

// ===== FARMS =====
function renderFarms() {
    const tbody = document.getElementById("farmsTableBody");
    
    if (state.farms.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Aucune farm</td></tr>';
        return;
    }
    
    tbody.innerHTML = state.farms.map(farm => {
        const productCount = state.products.filter(p => p.farm_id === farm.id).length;
        return `
            <tr>
                <td>
                    ${farm.logo ? `<img src="${farm.logo}" alt="${farm.name}" class="table-image">` : '-'}
                </td>
                <td>${farm.name}</td>
                <td>${farm.region || '-'}</td>
                <td>${productCount}</td>
                <td>
                    <button class="btn-edit" onclick="editFarm(${farm.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteItem('farms', ${farm.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function openFarmModal(farm = null) {
    state.editing = { type: 'farm', id: farm ? farm.id : null };
    
    if (farm) {
        document.getElementById("farmModalTitle").textContent = "Modifier la farm";
        document.getElementById("farmId").value = farm.id;
        document.getElementById("farmName").value = farm.name;
        document.getElementById("farmRegion").value = farm.region || '';
        document.getElementById("farmLogo").value = farm.logo || '';
    } else {
        document.getElementById("farmModalTitle").textContent = "Ajouter une farm";
        document.getElementById("farmForm").reset();
    }
    
    openModal("farmModal");
}

function saveFarm() {
    const id = document.getElementById("farmId").value || Date.now();
    const farm = {
        id: parseInt(id),
        name: document.getElementById("farmName").value,
        region: document.getElementById("farmRegion").value,
        logo: document.getElementById("farmLogo").value
    };
    
    if (state.editing.id) {
        state.farms = state.farms.map(f => f.id === parseInt(id) ? farm : f);
        showAlert("Farm modifiée avec succès !", "success");
    } else {
        state.farms.push(farm);
        showAlert("Farm ajoutée avec succès !", "success");
    }
    
    saveToLocalStorage('admin_farms', state.farms);
    closeModal("farmModal");
    renderFarms();
    updateDashboard();
}

function editFarm(id) {
    const farm = state.farms.find(f => f.id === id);
    if (farm) {
        openFarmModal(farm);
    }
}

// ===== SERVICES =====
function renderServices() {
    const tbody = document.getElementById("servicesTableBody");
    
    if (state.services.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Aucun service</td></tr>';
        return;
    }
    
    tbody.innerHTML = state.services.map(service => `
        <tr>
            <td>${service.title}</td>
            <td>${service.content.substring(0, 50)}${service.content.length > 50 ? '...' : ''}</td>
            <td>${service.display_order || 0}</td>
            <td>
                <span class="badge ${service.is_active !== false ? 'badge-active' : 'badge-inactive'}">
                    ${service.is_active !== false ? 'Actif' : 'Inactif'}
                </span>
            </td>
            <td>
                <button class="btn-edit" onclick="editService(${service.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteItem('services', ${service.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function openServiceModal(service = null) {
    // À implémenter selon les besoins
    showAlert("Fonction en cours de développement", "warning");
}

// ===== RÉSEAUX SOCIAUX =====
function renderSocials() {
    const tbody = document.getElementById("socialTableBody");
    
    if (state.socials.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Aucun réseau social</td></tr>';
        return;
    }
    
    tbody.innerHTML = state.socials.map(social => `
        <tr>
            <td style="font-size: 2rem;">${social.icon || '🔗'}</td>
            <td>${social.name}</td>
            <td><a href="${social.url}" target="_blank" style="color: #1e90ff;">${social.url}</a></td>
            <td>${social.order || 0}</td>
            <td>
                <button class="btn-edit" onclick="editSocial(${social.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteItem('socials', ${social.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function openSocialModal(social = null) {
    // À implémenter selon les besoins
    showAlert("Fonction en cours de développement", "warning");
}

// ===== PARAMÈTRES =====
function loadSettings() {
    const settings = state.settings;
    document.getElementById("shopName").value = settings.shop_name || 'BipCosa06';
    document.getElementById("shopDescription").value = settings.shop_description || '';
    document.getElementById("themeBackgroundUrl").value = settings.theme_background_url || '';
    document.getElementById("shopWhatsapp").value = settings.shop_whatsapp || '';
    document.getElementById("shopTelegram").value = settings.shop_telegram || '';
    document.getElementById("shopInstagram").value = settings.shop_instagram || '';
}

function saveSettings() {
    state.settings = {
        shop_name: document.getElementById("shopName").value,
        shop_description: document.getElementById("shopDescription").value,
        theme_background_url: document.getElementById("themeBackgroundUrl").value,
        shop_whatsapp: document.getElementById("shopWhatsapp").value,
        shop_telegram: document.getElementById("shopTelegram").value,
        shop_instagram: document.getElementById("shopInstagram").value
    };
    
    saveToLocalStorage('admin_settings', state.settings);
    saveToLocalStorage('shop_settings', state.settings); // Pour le frontend
    showAlert("Paramètres enregistrés avec succès !", "success");
}

// ===== SUPPRESSION =====
function deleteItem(type, id) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;
    
    switch(type) {
        case 'products':
            state.products = state.products.filter(p => p.id !== id);
            saveToLocalStorage('admin_products', state.products);
            renderProducts();
            break;
        case 'categories':
            state.categories = state.categories.filter(c => c.id !== id);
            saveToLocalStorage('admin_categories', state.categories);
            renderCategories();
            break;
        case 'farms':
            state.farms = state.farms.filter(f => f.id !== id);
            saveToLocalStorage('admin_farms', state.farms);
            renderFarms();
            break;
        case 'services':
            state.services = state.services.filter(s => s.id !== id);
            saveToLocalStorage('admin_services', state.services);
            renderServices();
            break;
        case 'socials':
            state.socials = state.socials.filter(s => s.id !== id);
            saveToLocalStorage('admin_socials', state.socials);
            renderSocials();
            break;
    }
    
    showAlert("Élément supprimé avec succès !", "success");
    updateDashboard();
}

// ===== HELPERS =====
function getCategoryName(categoryId) {
    const category = state.categories.find(c => c.id === categoryId);
    return category ? category.name : '-';
}

function getFarmName(farmId) {
    const farm = state.farms.find(f => f.id === farmId);
    return farm ? farm.name : null;
}

function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Erreur sauvegarde localStorage:', error);
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Erreur lecture localStorage:', error);
        return null;
    }
}

// ===== EXPORT DES FONCTIONS GLOBALES =====
window.editProduct = editProduct;
window.editCategory = editCategory;
window.editFarm = editFarm;
window.editService = (id) => showAlert("Fonction en cours de développement", "warning");
window.editSocial = (id) => showAlert("Fonction en cours de développement", "warning");
window.deleteItem = deleteItem;