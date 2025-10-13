/**
 * Panel Admin JavaScript - Al Gran
 * Gestion complète via API Cloudflare
 */

// Configuration API
const API_URL = 'http://localhost:8787'; // Pour dev local - Changez pour production: https://algran-api.juniorrrrr345.workers.dev
const ADMIN_PASSWORD = 'admin123'; // À changer après premier login

// État global
let currentSection = 'dashboard';
let products = [];
let categories = [];
let editingProductId = null;
// UI state (produits)
let productsFiltered = [];
let currentPage = 1;
let pageSize = 10;
let sortValue = 'created_desc';
let searchValue = '';

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initEventListeners();
});

// Vérifier l'authentification
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('admin_authenticated');
    if (isAuthenticated === 'true') {
        showAdminPanel();
        loadDashboard();
    } else {
        showLogin();
    }
}

// Afficher la page de connexion
function showLogin() {
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('adminContainer').classList.remove('active');
}

// Afficher le panel admin
function showAdminPanel() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminContainer').classList.add('active');
}

// Initialiser les écouteurs d'événements
function initEventListeners() {
    // Login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => handleNavigation(item));
    });
    
    // Modal produit
    document.getElementById('addProductBtn').addEventListener('click', () => openProductModal());
    document.getElementById('closeModalBtn').addEventListener('click', closeProductModal);
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
    const uploadBtn = document.getElementById('uploadProductImageBtn');
    if (uploadBtn) uploadBtn.addEventListener('click', uploadProductImageToR2);
    // Catégories
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    if (addCategoryBtn) addCategoryBtn.addEventListener('click', () => openCategoryModal());
    const closeCategoryModalBtn = document.getElementById('closeCategoryModalBtn');
    if (closeCategoryModalBtn) closeCategoryModalBtn.addEventListener('click', closeCategoryModal);
    const categoryForm = document.getElementById('categoryForm');
    if (categoryForm) categoryForm.addEventListener('submit', handleCategorySubmit);
    const uploadCategoryBtn = document.getElementById('uploadCategoryImageBtn');
    if (uploadCategoryBtn) uploadCategoryBtn.addEventListener('click', uploadCategoryImageToR2);
    
    // Login - toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const input = document.getElementById('passwordInput');
            if (input) input.type = input.type === 'password' ? 'text' : 'password';
        });
    }
    
    // Toolbar produits
    const search = document.getElementById('productsSearch');
    if (search) {
        search.addEventListener('input', (e) => {
            searchValue = e.target.value.trim().toLowerCase();
            currentPage = 1;
            applyProductsFilters();
        });
    }
    const sort = document.getElementById('productsSort');
    if (sort) {
        sort.addEventListener('change', (e) => {
            sortValue = e.target.value;
            currentPage = 1;
            applyProductsFilters();
        });
    }
    const size = document.getElementById('productsPageSize');
    if (size) {
        size.addEventListener('change', (e) => {
            pageSize = parseInt(e.target.value) || 10;
            currentPage = 1;
            applyProductsFilters();
        });
    }
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    if (prevBtn) prevBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderProductsTable(); } });
    if (nextBtn) nextBtn.addEventListener('click', () => { const max = Math.ceil(productsFiltered.length / pageSize); if (currentPage < max) { currentPage++; renderProductsTable(); } });

    // Fermer modal en cliquant à l'extérieur
    document.getElementById('productModal').addEventListener('click', (e) => {
        if (e.target.id === 'productModal') {
            closeProductModal();
        }
    });
}

// Gestion de la connexion
async function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('passwordInput').value;
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_authenticated', 'true');
        showAdminPanel();
        loadDashboard();
        showAlert('Connexion réussie !', 'success');
    } else {
        showAlert('Mot de passe incorrect', 'error');
    }
}

// Déconnexion
function handleLogout() {
    sessionStorage.removeItem('admin_authenticated');
    showLogin();
    document.getElementById('passwordInput').value = '';
}

// Navigation
function handleNavigation(item) {
    // Retirer active de tous les items
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    
    // Cacher toutes les sections
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    
    // Afficher la section sélectionnée
    const section = item.dataset.section;
    currentSection = section;
    document.getElementById(section).classList.add('active');
    
    // Mettre à jour le titre
    const titles = {
        dashboard: 'Dashboard',
        products: 'Gestion des Produits',
        categories: 'Gestion des Catégories',
        settings: 'Paramètres'
    };
    document.getElementById('pageTitle').textContent = titles[section];
    
    // Charger les données
    if (section === 'dashboard') loadDashboard();
    if (section === 'products') loadProducts();
    if (section === 'categories') loadCategories();
    if (section === 'settings') loadSettings();
}

// Charger le dashboard
async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/api/stats`);
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('totalProducts').textContent = data.stats.totalProducts;
            document.getElementById('totalCategories').textContent = data.stats.totalCategories;
            document.getElementById('activeProducts').textContent = data.stats.activeProducts;
            document.getElementById('totalImages').textContent = data.stats.totalImages;
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showAlert('Erreur lors du chargement du dashboard', 'error');
    }
}

// Charger les produits
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/api/products`);
        const data = await response.json();
        
        if (data.success) {
            products = data.products;
            applyProductsFilters();
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showAlert('Erreur lors du chargement des produits', 'error');
    }
}

// Afficher les produits dans le tableau
function displayProducts(productsToDisplay) {
    const tbody = document.getElementById('productsTableBody');
    
    if (productsToDisplay.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">Aucun produit</td></tr>';
        return;
    }
    
    tbody.innerHTML = productsToDisplay.map(product => `
        <tr>
            <td>
                <img src="${product.image_url || 'https://via.placeholder.com/50'}" 
                     alt="${product.name}" 
                     class="product-image"
                     onerror="this.src='https://via.placeholder.com/50'">
            </td>
            <td>${product.name}</td>
            <td>
                ${product.category_icon || ''} ${product.category_name || 'N/A'}
            </td>
            <td>${product.price}€ ${product.unit || ''}</td>
            <td>
                <label class="switch">
                    <input type="checkbox" ${product.is_active ? 'checked' : ''} onchange="toggleProductActive(${product.id}, this.checked)">
                    <span class="slider"></span>
                </label>
            </td>
            <td>
                <button class="btn btn-primary" onclick="editProduct(${product.id})" style="margin-right: 0.5rem;">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteProductConfirm(${product.id}, '${product.name}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Filtrage/tri/pagination
function applyProductsFilters() {
    // search
    productsFiltered = products.filter(p => {
        if (!searchValue) return true;
        const hay = `${p.name || ''} ${p.category_name || ''}`.toLowerCase();
        return hay.includes(searchValue);
    });
    // sort
    productsFiltered.sort((a,b) => {
        switch (sortValue) {
            case 'price_asc': return (a.price||0) - (b.price||0);
            case 'price_desc': return (b.price||0) - (a.price||0);
            case 'name_asc': return (a.name||'').localeCompare(b.name||'');
            case 'name_desc': return (b.name||'').localeCompare(a.name||'');
            default: // created_desc (fallback by id desc)
                return (b.id||0) - (a.id||0);
        }
    });
    currentPage = 1;
    renderProductsTable();
}

function renderProductsTable() {
    const start = (currentPage - 1) * pageSize;
    const pageItems = productsFiltered.slice(start, start + pageSize);
    displayProducts(pageItems);
    const pageInfo = document.getElementById('pageInfo');
    if (pageInfo) {
        const totalPages = Math.max(1, Math.ceil(productsFiltered.length / pageSize));
        pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;
    }
}

// Toggle actif inline
async function toggleProductActive(id, isChecked) {
    try {
        const response = await fetch(`${API_URL}/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_active: isChecked ? 1 : 0 })
        });
        const data = await response.json();
        if (!data.success) throw new Error('Update failed');
        const item = products.find(p => p.id === id);
        if (item) item.is_active = isChecked ? 1 : 0;
        applyProductsFilters();
        loadDashboard();
    } catch (e) {
        console.error(e);
        showAlert('Impossible de modifier le statut', 'error');
        // revert UI state by reloading list
        loadProducts();
    }
}

// Ouvrir le modal produit
async function openProductModal(productId = null) {
    editingProductId = productId;
    
    // Charger les catégories si pas déjà fait
    if (categories.length === 0) {
        await loadCategoriesForForm();
    }
    
    // Réinitialiser le formulaire
    document.getElementById('productForm').reset();
    
    if (productId) {
        // Mode édition
        const product = products.find(p => p.id === productId);
        if (product) {
            document.getElementById('productName').value = product.name;
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productCategory').value = product.category_id;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productUnit').value = product.unit;
            document.getElementById('productBadge').value = product.badge || '';
            document.getElementById('productImage').value = product.image_url || '';
            document.getElementById('productIsActive').checked = !!product.is_active;
            document.querySelector('.modal-title').textContent = 'Modifier le Produit';
        }
    } else {
        // Mode création
        document.querySelector('.modal-title').textContent = 'Ajouter un Produit';
    }
    
    document.getElementById('productModal').classList.add('active');
}

// Fermer le modal
function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    editingProductId = null;
}

// Charger les catégories pour le formulaire
async function loadCategoriesForForm() {
    try {
        const response = await fetch(`${API_URL}/api/categories`);
        const data = await response.json();
        
        if (data.success) {
            categories = data.categories;
            const select = document.getElementById('productCategory');
            select.innerHTML = categories.map(cat => 
                `<option value="${cat.id}">${cat.icon || ''} ${cat.name}</option>`
            ).join('');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Soumettre le formulaire produit
async function handleProductSubmit(e) {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        category_id: parseInt(document.getElementById('productCategory').value),
        price: parseFloat(document.getElementById('productPrice').value),
        unit: document.getElementById('productUnit').value,
        badge: document.getElementById('productBadge').value,
        image_url: document.getElementById('productImage').value,
        is_active: document.getElementById('productIsActive').checked ? 1 : 0
    };
    
    try {
        let response;
        if (editingProductId) {
            // Mise à jour
            response = await fetch(`${API_URL}/api/products/${editingProductId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        } else {
            // Création
            response = await fetch(`${API_URL}/api/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        }
        
        const data = await response.json();
        
        if (data.success) {
            showAlert(editingProductId ? 'Produit modifié avec succès !' : 'Produit créé avec succès !', 'success');
            closeProductModal();
            loadProducts();
            loadDashboard(); // Mettre à jour les stats
        } else {
            showAlert('Erreur: ' + (data.error || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Error saving product:', error);
        showAlert('Erreur lors de la sauvegarde', 'error');
    }
}

// Éditer un produit
function editProduct(id) {
    openProductModal(id);
}

// Confirmer la suppression
function deleteProductConfirm(id, name) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) {
        deleteProductAction(id);
    }
}

// Supprimer un produit
async function deleteProductAction(id) {
    try {
        const response = await fetch(`${API_URL}/api/products/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Produit supprimé avec succès !', 'success');
            loadProducts();
            loadDashboard();
        } else {
            showAlert('Erreur lors de la suppression', 'error');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        showAlert('Erreur lors de la suppression', 'error');
    }
}

// Charger les catégories
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/api/categories`);
        const data = await response.json();
        
        if (data.success) {
            categories = data.categories;
            displayCategories(categories);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        showAlert('Erreur lors du chargement des catégories', 'error');
    }
}

// Afficher les catégories
function displayCategories(categoriesToDisplay) {
    const tbody = document.getElementById('categoriesTableBody');
    
    tbody.innerHTML = categoriesToDisplay.map(cat => `
        <tr>
            <td>${cat.icon || ''} ${cat.name}</td>
            <td>${cat.description || ''}</td>
            <td>${cat.product_count || 0}</td>
            <td>
                <button class="btn btn-primary" onclick="editCategory(${cat.id})"><i class="fas fa-edit"></i> Modifier</button>
            </td>
        </tr>
    `).join('');
}

// Éditer une catégorie
function editCategory(id) {
    const category = categories.find(c => c.id === id);
    if (category) {
        openCategoryModal(id);
    }
}

// Mettre à jour une catégorie
async function updateCategoryAction(id, data) {
    try {
        const response = await fetch(`${API_URL}/api/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('Catégorie modifiée avec succès !', 'success');
            loadCategories();
        }
    } catch (error) {
        console.error('Error updating category:', error);
        showAlert('Erreur lors de la mise à jour', 'error');
    }
}

// Charger les paramètres
async function loadSettings() {
    try {
        const response = await fetch(`${API_URL}/api/settings`);
        const data = await response.json();
        
        if (data.success) {
            const s = data.settings;
            document.getElementById('settingsShopName').value = s.shop_name || '';
            document.getElementById('settingsShopDescription').value = s.shop_description || '';
            document.getElementById('settingsShopEmail').value = s.shop_email || '';
            document.getElementById('settingsShopPhone').value = s.shop_phone || '';
            document.getElementById('settingsShopWhatsapp').value = s.shop_whatsapp || '';
            document.getElementById('settingsShopTelegram').value = s.shop_telegram || '';
            document.getElementById('settingsShopInstagram').value = s.shop_instagram || '';
            document.getElementById('settingsShopLinktree').value = s.shop_linktree || '';
            document.getElementById('settingsSocialLinksJson').value = s.social_links_json || '';
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Sauvegarder les paramètres
document.addEventListener('DOMContentLoaded', () => {
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                shop_name: document.getElementById('settingsShopName').value,
                shop_description: document.getElementById('settingsShopDescription').value,
                shop_email: document.getElementById('settingsShopEmail').value,
                shop_phone: document.getElementById('settingsShopPhone').value,
                shop_whatsapp: document.getElementById('settingsShopWhatsapp').value,
                shop_telegram: document.getElementById('settingsShopTelegram').value,
                shop_instagram: document.getElementById('settingsShopInstagram').value,
                shop_linktree: document.getElementById('settingsShopLinktree').value,
                social_links_json: document.getElementById('settingsSocialLinksJson').value
            };
            try {
                const response = await fetch(`${API_URL}/api/settings`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await response.json();
                if (result.success) {
                    showAlert('Paramètres sauvegardés', 'success');
                } else {
                    showAlert('Erreur lors de la sauvegarde', 'error');
                }
            } catch (err) {
                console.error(err);
                showAlert('Erreur réseau', 'error');
            }
        });
    }
});

// Modal Catégorie
let editingCategoryId = null;
function openCategoryModal(categoryId = null) {
    editingCategoryId = categoryId;
    document.getElementById('categoryForm').reset();
    document.querySelector('#categoryModal .modal-title').textContent = categoryId ? 'Modifier une Catégorie' : 'Ajouter une Catégorie';
    if (categoryId) {
        const cat = categories.find(c => c.id === categoryId);
        if (cat) {
            document.getElementById('categoryName').value = cat.name || '';
            document.getElementById('categoryDescription').value = cat.description || '';
            document.getElementById('categoryIcon').value = cat.icon || '';
            document.getElementById('categoryImage').value = cat.image_url || '';
            document.getElementById('categoryIsActive').checked = !!cat.is_active;
        }
    }
    document.getElementById('categoryModal').classList.add('active');
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('active');
    editingCategoryId = null;
}

async function handleCategorySubmit(e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('categoryName').value,
        description: document.getElementById('categoryDescription').value,
        icon: document.getElementById('categoryIcon').value,
        image_url: document.getElementById('categoryImage').value,
        is_active: document.getElementById('categoryIsActive').checked ? 1 : 0
    };
    try {
        let response;
        if (editingCategoryId) {
            response = await fetch(`${API_URL}/api/categories/${editingCategoryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(`${API_URL}/api/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }
        const result = await response.json();
        if (result.success) {
            showAlert(editingCategoryId ? 'Catégorie modifiée' : 'Catégorie créée', 'success');
            closeCategoryModal();
            loadCategories();
            loadDashboard();
        } else {
            showAlert('Erreur: ' + (result.error || 'Inconnue'), 'error');
        }
    } catch (err) {
        console.error(err);
        showAlert('Erreur réseau', 'error');
    }
}

// Upload image R2 helpers
async function uploadFileToR2(fileInputId) {
    const input = document.getElementById(fileInputId);
    const file = input && input.files && input.files[0];
    if (!file) {
        showAlert('Sélectionnez un fichier d\'abord', 'warning');
        return null;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
        const res = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (data.success) {
            showAlert('Image uploadée', 'success');
            return data.url;
        }
        showAlert('Upload échoué', 'error');
        return null;
    } catch (e) {
        console.error(e);
        showAlert('Erreur réseau upload', 'error');
        return null;
    }
}

async function uploadProductImageToR2() {
    const url = await uploadFileToR2('productImageFile');
    if (url) document.getElementById('productImage').value = url;
}

async function uploadCategoryImageToR2() {
    const url = await uploadFileToR2('categoryImageFile');
    if (url) document.getElementById('categoryImage').value = url;
}

// Afficher une alerte avec animation Lottie
function showAlert(message, type = 'success') {
    const container = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} active`;
    
    // Créer un conteneur pour l'animation Lottie
    const lottieContainer = document.createElement('div');
    lottieContainer.style.width = '40px';
    lottieContainer.style.height = '40px';
    lottieContainer.style.marginRight = '15px';
    lottieContainer.style.flexShrink = '0';
    
    // Message
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    messageSpan.style.flex = '1';
    
    alert.appendChild(lottieContainer);
    alert.appendChild(messageSpan);
    container.appendChild(alert);
    
    // Charger l'animation Lottie appropriée
    const lottieUrls = {
        success: 'https://lottie.host/e9729a7c-8c92-4ab1-9ba8-093b6732e203/iOLLrbWYAc.json',
        error: 'https://lottie.host/c1c7f68b-fa9e-4e3c-85e5-2bb7d23b6b1c/P0Bz7iQzGY.json',
        warning: 'https://lottie.host/f9bc6d36-8a2f-4b8a-8e42-c45e7eb4ce31/sLRfjVZkN1.json'
    };
    
    lottie.loadAnimation({
        container: lottieContainer,
        renderer: 'svg',
        loop: type !== 'success', // Success joue une seule fois
        autoplay: true,
        path: lottieUrls[type] || lottieUrls.success
    });
    
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
    }, 4000);
}

// Exposer les fonctions globalement pour les boutons inline
window.editProduct = editProduct;
window.deleteProductConfirm = deleteProductConfirm;
window.editCategory = editCategory;
window.openCategoryModal = openCategoryModal;
