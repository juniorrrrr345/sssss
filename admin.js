/**
 * Panel Admin JavaScript - Al Gran
 * Gestion complète via API Cloudflare
 */

// Configuration API
const API_URL = 'http://localhost:8787'; // Pour dev local - Changez pour production: https://algran-api.VOTRE-SUBDOMAIN.workers.dev
const ADMIN_PASSWORD = 'admin123'; // Mot de passe par défaut

// État global
let currentSection = 'dashboard';
let products = [];
let categories = [];
let services = [];
let farms = [];
let socialLinks = [];
let editingProductId = null;
let editingServiceId = null;
let editingFarmId = null;
let editingSocialId = null;
let editingCategoryId = null;
let productVariants = []; // Prix multiples

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
    
    // Fermer modal en cliquant à l'extérieur
    document.getElementById('productModal').addEventListener('click', (e) => {
        if (e.target.id === 'productModal') {
            closeProductModal();
        }
    });
    
    // Modal service
    document.getElementById('addServiceBtn').addEventListener('click', () => openServiceModal());
    document.getElementById('closeServiceModalBtn').addEventListener('click', closeServiceModal);
    document.getElementById('serviceForm').addEventListener('submit', handleServiceSubmit);
    
    // Fermer modal service en cliquant à l'extérieur
    document.getElementById('serviceModal').addEventListener('click', (e) => {
        if (e.target.id === 'serviceModal') {
            closeServiceModal();
        }
    });
    
    // Modal farm
    document.getElementById('addFarmBtn').addEventListener('click', () => openFarmModal());
    document.getElementById('closeFarmModalBtn').addEventListener('click', closeFarmModal);
    document.getElementById('farmForm').addEventListener('submit', handleFarmSubmit);
    
    // Fermer modal farm en cliquant à l'extérieur
    document.getElementById('farmModal').addEventListener('click', (e) => {
        if (e.target.id === 'farmModal') {
            closeFarmModal();
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
        farms: 'Gestion des Farms',
        social: 'Gestion des Réseaux Sociaux',
        services: 'Gestion des Services',
        settings: 'Paramètres'
    };
    document.getElementById('pageTitle').textContent = titles[section];
    
    // Charger les données
    if (section === 'dashboard') loadDashboard();
    if (section === 'products') loadProducts();
    if (section === 'categories') loadCategories();
    if (section === 'farms') loadFarms();
    if (section === 'social') loadSocialLinks();
    if (section === 'services') loadServices();
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
            displayProducts(products);
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
            <td>${product.price}€ ${product.unit}</td>
            <td>
                <span class="badge ${product.is_active ? 'badge-success' : 'badge-warning'}">
                    ${product.is_active ? 'Actif' : 'Inactif'}
                </span>
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

// Ouvrir le modal produit
async function openProductModal(productId = null) {
    editingProductId = productId;
    
    // Charger les catégories si pas déjà fait
    if (categories.length === 0) {
        await loadCategoriesForForm();
    }
    
    // Réinitialiser le formulaire
    document.getElementById('productForm').reset();
    document.getElementById('productUnit').value = '/ 3.5g';
    document.getElementById('productStock').value = '0';
    
    if (productId) {
        // Mode édition
        const product = products.find(p => p.id === productId);
        if (product) {
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category_id;
            document.getElementById('productFarm').value = product.farm_id || '';
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productLongDescription').value = product.long_description || '';
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productUnit').value = product.unit;
            document.getElementById('productStock').value = product.stock_quantity || 0;
            document.getElementById('productBadge').value = product.badge || '';
            document.getElementById('productImage').value = product.image_url || '';
            document.getElementById('productVideo').value = product.video_url || '';
            document.querySelector('#productModal .modal-title').innerHTML = '<i class="fas fa-edit"></i> Modifier le Produit';
        }
    } else {
        // Mode création
        document.querySelector('#productModal .modal-title').innerHTML = '<i class="fas fa-plus-circle"></i> Ajouter un Produit';
    }
    
    document.getElementById('productModal').classList.add('active');
}

// Fermer le modal
function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    editingProductId = null;
}

// Charger les catégories et farms pour le formulaire
async function loadCategoriesForForm() {
    try {
        // Charger les catégories
        const catResponse = await fetch(`${API_URL}/api/categories`);
        const catData = await catResponse.json();
        
        if (catData.success) {
            categories = catData.categories;
            const catSelect = document.getElementById('productCategory');
            catSelect.innerHTML = categories.map(cat => 
                `<option value="${cat.id}">${cat.icon || ''} ${cat.name}</option>`
            ).join('');
        }
        
        // Charger les farms
        const farmResponse = await fetch(`${API_URL}/api/farms`);
        const farmData = await farmResponse.json();
        
        if (farmData.success) {
            const farmSelect = document.getElementById('productFarm');
            farmSelect.innerHTML = '<option value="">-- Aucune farm --</option>' + 
                farmData.farms.map(farm => 
                    `<option value="${farm.id}">${farm.name}</option>`
                ).join('');
        }
    } catch (error) {
        console.error('Error loading form data:', error);
    }
}

// Soumettre le formulaire produit
async function handleProductSubmit(e) {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('productName').value,
        category_id: parseInt(document.getElementById('productCategory').value),
        farm_id: document.getElementById('productFarm') ? parseInt(document.getElementById('productFarm').value) || null : null,
        price: parseFloat(document.getElementById('productPrice').value),
        unit: document.getElementById('productUnit').value,
        badge: document.getElementById('productBadge').value,
        description: document.getElementById('productDescription') ? document.getElementById('productDescription').value : '',
        long_description: document.getElementById('productLongDescription') ? document.getElementById('productLongDescription').value : '',
        image_url: document.getElementById('productImage').value,
        video_url: document.getElementById('productVideo') ? document.getElementById('productVideo').value : '',
        stock_quantity: document.getElementById('productStock') ? parseInt(document.getElementById('productStock').value) || 0 : 0,
        is_active: 1
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
            <td>
                ${cat.image_url ? `<img src="${cat.image_url}" alt="${cat.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">` : `<div style="width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 2rem;">${cat.icon || '📦'}</div>`}
            </td>
            <td><strong>${cat.icon || ''} ${cat.name}</strong></td>
            <td>${cat.description || ''}</td>
            <td>${cat.product_count || 0}</td>
            <td>
                <button class="btn btn-primary" onclick="editCategory(${cat.id})" style="margin-right: 0.5rem;">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteCategoryConfirm(${cat.id}, '${cat.name.replace(/'/g, "\\'")}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Éditer une catégorie
function editCategory(id) {
    const category = categories.find(c => c.id === id);
    if (category) {
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999;';
        
        modal.innerHTML = `
            <div style="background: #1a1f3a; padding: 2rem; border-radius: 15px; max-width: 500px; width: 90%;">
                <h3 style="margin-bottom: 1.5rem;">Modifier la Catégorie</h3>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Nom</label>
                    <input type="text" id="editCatName" value="${category.name}" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: white;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Description</label>
                    <textarea id="editCatDesc" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: white; min-height: 80px;">${category.description || ''}</textarea>
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Icône (emoji)</label>
                    <input type="text" id="editCatIcon" value="${category.icon || ''}" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: white;" placeholder="ex: 🔥">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">URL de l'image (optionnel)</label>
                    <input type="url" id="editCatImage" value="${category.image_url || ''}" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: white;" placeholder="https://imgur.com/...">
                    <small style="color: rgba(255,255,255,0.6); font-size: 0.85rem;">Vous pouvez utiliser Imgur, Cloudinary, etc.</small>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 1.5rem;">
                    <button onclick="saveCategoryEdit(${id})" class="btn btn-success" style="flex: 1;">
                        <i class="fas fa-save"></i> Sauvegarder
                    </button>
                    <button onclick="this.closest('div[style*=fixed]').remove()" class="btn btn-secondary" style="flex: 1;">
                        Annuler
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
}

// Sauvegarder les modifications de catégorie
window.saveCategoryEdit = async function(id) {
    const data = {
        name: document.getElementById('editCatName').value,
        description: document.getElementById('editCatDesc').value,
        icon: document.getElementById('editCatIcon').value,
        image_url: document.getElementById('editCatImage').value
    };
    
    await updateCategoryAction(id, data);
    document.querySelector('div[style*="position: fixed"]').remove();
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
            const settings = data.settings;
            
            // Remplir tous les champs avec les valeurs actuelles
            Object.keys(settings).forEach(key => {
                const input = document.getElementById(`setting_${key}`);
                if (input) {
                    input.value = settings[key] || '';
                }
            });
            
            console.log('Settings loaded:', settings);
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Sauvegarder les paramètres
async function saveSettings(section) {
    const settingsData = {};
    
    // Déterminer quels champs sauvegarder selon la section
    let fields = [];
    if (section === 'general') {
        fields = ['shop_name'];
    } else if (section === 'theme') {
        fields = ['theme_background_url'];
    } else if (section === 'advanced') {
        fields = ['maintenance_mode'];
    }
    
    // Récupérer les valeurs des champs
    fields.forEach(field => {
        const input = document.getElementById(`setting_${field}`);
        if (input) {
            settingsData[field] = input.value;
        }
    });
    
    try {
        const response = await fetch(`${API_URL}/api/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settingsData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('Paramètres sauvegardés avec succès !', 'success');
        } else {
            showAlert('Erreur: ' + (result.error || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        showAlert('Erreur lors de la sauvegarde', 'error');
    }
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
    
    // Icône simple au lieu de Lottie (problème de 403)
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️'
    };
    
    lottieContainer.style.fontSize = '32px';
    lottieContainer.style.display = 'flex';
    lottieContainer.style.alignItems = 'center';
    lottieContainer.style.justifyContent = 'center';
    lottieContainer.textContent = icons[type] || icons.success;
    
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
    }, 4000);
}

// ===== GESTION DES SERVICES =====

// Charger les services
async function loadServices() {
    try {
        const response = await fetch(`${API_URL}/api/services`);
        const data = await response.json();
        
        if (data.success) {
            services = data.services;
            displayServices(services);
        }
    } catch (error) {
        console.error('Error loading services:', error);
        showAlert('Erreur lors du chargement des services', 'error');
    }
}

// Afficher les services dans le tableau
function displayServices(servicesToDisplay) {
    const tbody = document.getElementById('servicesTableBody');
    
    if (servicesToDisplay.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">Aucun service</td></tr>';
        return;
    }
    
    tbody.innerHTML = servicesToDisplay.map(service => `
        <tr>
            <td style="font-size: 1.5rem;">${service.icon || '📌'}</td>
            <td><strong>${service.title}</strong></td>
            <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${service.content.substring(0, 100)}${service.content.length > 100 ? '...' : ''}
            </td>
            <td>${service.display_order}</td>
            <td>
                <span class="badge ${service.is_active ? 'badge-success' : 'badge-warning'}">
                    ${service.is_active ? 'Actif' : 'Inactif'}
                </span>
            </td>
            <td>
                <button class="btn btn-primary" onclick="editService(${service.id})" style="margin-right: 0.5rem;">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteServiceConfirm(${service.id}, '${service.title.replace(/'/g, "\\'")}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Ouvrir le modal service
async function openServiceModal(serviceId = null) {
    editingServiceId = serviceId;
    
    // Réinitialiser le formulaire
    document.getElementById('serviceForm').reset();
    document.getElementById('serviceActive').checked = true;
    
    if (serviceId) {
        // Mode édition
        const service = services.find(s => s.id === serviceId);
        if (service) {
            document.getElementById('serviceTitle').value = service.title;
            document.getElementById('serviceContent').value = service.content;
            document.getElementById('serviceIcon').value = service.icon || '';
            document.getElementById('serviceOrder').value = service.display_order || 0;
            document.getElementById('serviceActive').checked = service.is_active === 1;
            document.querySelector('#serviceModal .modal-title').textContent = 'Modifier le Service';
        }
    } else {
        // Mode création
        document.querySelector('#serviceModal .modal-title').textContent = 'Ajouter un Service';
    }
    
    document.getElementById('serviceModal').classList.add('active');
}

// Fermer le modal service
function closeServiceModal() {
    document.getElementById('serviceModal').classList.remove('active');
    editingServiceId = null;
}

// Soumettre le formulaire service
async function handleServiceSubmit(e) {
    e.preventDefault();
    
    const serviceData = {
        title: document.getElementById('serviceTitle').value,
        content: document.getElementById('serviceContent').value,
        icon: document.getElementById('serviceIcon').value,
        display_order: parseInt(document.getElementById('serviceOrder').value) || 0,
        is_active: document.getElementById('serviceActive').checked ? 1 : 0
    };
    
    try {
        let response;
        if (editingServiceId) {
            // Mise à jour
            response = await fetch(`${API_URL}/api/services/${editingServiceId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(serviceData)
            });
        } else {
            // Création
            response = await fetch(`${API_URL}/api/services`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(serviceData)
            });
        }
        
        const data = await response.json();
        
        if (data.success) {
            showAlert(editingServiceId ? 'Service modifié avec succès !' : 'Service créé avec succès !', 'success');
            closeServiceModal();
            loadServices();
        } else {
            showAlert('Erreur: ' + (data.error || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Error saving service:', error);
        showAlert('Erreur lors de la sauvegarde', 'error');
    }
}

// Éditer un service
function editService(id) {
    openServiceModal(id);
}

// Confirmer la suppression d'un service
function deleteServiceConfirm(id, title) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${title}" ?`)) {
        deleteServiceAction(id);
    }
}

// Supprimer un service
async function deleteServiceAction(id) {
    try {
        const response = await fetch(`${API_URL}/api/services/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Service supprimé avec succès !', 'success');
            loadServices();
        } else {
            showAlert('Erreur lors de la suppression', 'error');
        }
    } catch (error) {
        console.error('Error deleting service:', error);
        showAlert('Erreur lors de la suppression', 'error');
    }
}

// Confirmer la suppression d'une catégorie
function deleteCategoryConfirm(id, name) {
    if (confirm(`⚠️ ATTENTION : Supprimer la catégorie "${name}" va aussi supprimer TOUS les produits associés.\n\nÊtes-vous vraiment sûr ?`)) {
        deleteCategoryAction(id);
    }
}

// Supprimer une catégorie
async function deleteCategoryAction(id) {
    try {
        const response = await fetch(`${API_URL}/api/categories/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Catégorie supprimée avec succès !', 'success');
            loadCategories();
            loadDashboard(); // Mettre à jour les stats
        } else {
            showAlert('Erreur lors de la suppression', 'error');
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        showAlert('Erreur lors de la suppression', 'error');
    }
}

// ===== GESTION DES FARMS =====

// Charger les farms
async function loadFarms() {
    try {
        const response = await fetch(`${API_URL}/api/farms`);
        const data = await response.json();
        
        if (data.success) {
            farms = data.farms;
            displayFarms(farms);
        }
    } catch (error) {
        console.error('Error loading farms:', error);
        showAlert('Erreur lors du chargement des farms', 'error');
    }
}

// Afficher les farms
function displayFarms(farmsToDisplay) {
    const tbody = document.getElementById('farmsTableBody');
    
    if (farmsToDisplay.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">Aucune farm</td></tr>';
        return;
    }
    
    tbody.innerHTML = farmsToDisplay.map(farm => `
        <tr>
            <td>
                ${farm.logo_url ? `<img src="${farm.logo_url}" alt="${farm.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">` : `<div style="width: 50px; height: 50px; background: rgba(255,255,255,0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🌿</div>`}
            </td>
            <td><strong>${farm.name}</strong></td>
            <td>${farm.description || ''}</td>
            <td>${farm.country || '-'}</td>
            <td>
                <span class="badge ${farm.is_active ? 'badge-success' : 'badge-warning'}">
                    ${farm.is_active ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td>
                <button class="btn btn-primary" onclick="editFarm(${farm.id})" style="margin-right: 0.5rem;">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteFarmConfirm(${farm.id}, '${farm.name.replace(/'/g, "\\'")}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Ouvrir modal farm
function openFarmModal(farmId = null) {
    editingFarmId = farmId;
    
    document.getElementById('farmForm').reset();
    document.getElementById('farmActive').checked = true;
    
    if (farmId) {
        const farm = farms.find(f => f.id === farmId);
        if (farm) {
            document.getElementById('farmName').value = farm.name;
            document.getElementById('farmDescription').value = farm.description || '';
            document.getElementById('farmCountry').value = farm.country || '';
            document.getElementById('farmLogo').value = farm.logo_url || '';
            document.getElementById('farmActive').checked = farm.is_active === 1;
            document.querySelector('#farmModal .modal-title').innerHTML = '<i class="fas fa-edit"></i> Modifier la Farm';
        }
    } else {
        document.querySelector('#farmModal .modal-title').innerHTML = '<i class="fas fa-plus-circle"></i> Ajouter une Farm';
    }
    
    document.getElementById('farmModal').classList.add('active');
}

// Fermer modal farm
function closeFarmModal() {
    document.getElementById('farmModal').classList.remove('active');
    editingFarmId = null;
}

// Soumettre formulaire farm
async function handleFarmSubmit(e) {
    e.preventDefault();
    
    const farmData = {
        name: document.getElementById('farmName').value,
        description: document.getElementById('farmDescription').value,
        country: document.getElementById('farmCountry').value,
        logo_url: document.getElementById('farmLogo').value,
        is_active: document.getElementById('farmActive').checked ? 1 : 0
    };
    
    try {
        let response;
        if (editingFarmId) {
            response = await fetch(`${API_URL}/api/farms/${editingFarmId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(farmData)
            });
        } else {
            response = await fetch(`${API_URL}/api/farms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(farmData)
            });
        }
        
        const data = await response.json();
        
        if (data.success) {
            showAlert(editingFarmId ? 'Farm modifiée !' : 'Farm créée !', 'success');
            closeFarmModal();
            loadFarms();
            loadCategoriesForForm(); // Recharger les farms dans le formulaire produit
        } else {
            showAlert('Erreur: ' + (data.error || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Error saving farm:', error);
        showAlert('Erreur lors de la sauvegarde', 'error');
    }
}

function editFarm(id) {
    openFarmModal(id);
}

function deleteFarmConfirm(id, name) {
    if (confirm(`Supprimer la farm "${name}" ?\n\nLes produits associés ne seront pas supprimés.`)) {
        deleteFarmAction(id);
    }
}

async function deleteFarmAction(id) {
    try {
        const response = await fetch(`${API_URL}/api/farms/${id}`, { method: 'DELETE' });
        const data = await response.json();
        
        if (data.success) {
            showAlert('Farm supprimée !', 'success');
            loadFarms();
        } else {
            showAlert('Erreur lors de la suppression', 'error');
        }
    } catch (error) {
        console.error('Error deleting farm:', error);
        showAlert('Erreur lors de la suppression', 'error');
    }
}

// ===== GESTION DES VARIANTES DE PRIX =====

let variantCounter = 0;

function addVariantField() {
    variantCounter++;
    const container = document.getElementById('variantsContainer');
    const variantHtml = `
        <div class="variant-row" id="variant-${variantCounter}" style="display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 10px; margin-bottom: 10px; padding: 10px; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
            <input type="text" class="variant-quantity" placeholder="2g" style="padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: white;">
            <input type="number" step="0.01" class="variant-price" placeholder="20" style="padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: white;">
            <input type="number" class="variant-stock" placeholder="Stock" value="0" style="padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: white;">
            <button type="button" onclick="removeVariant(${variantCounter})" class="btn btn-danger" style="padding: 8px 12px;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', variantHtml);
}

function removeVariant(id) {
    document.getElementById(`variant-${id}`).remove();
}

// Exposer les fonctions globalement pour les boutons inline
window.editProduct = editProduct;
window.deleteProductConfirm = deleteProductConfirm;
window.editCategory = editCategory;
window.deleteCategoryConfirm = deleteCategoryConfirm;
window.editFarm = editFarm;
window.deleteFarmConfirm = deleteFarmConfirm;
window.editService = editService;
window.deleteServiceConfirm = deleteServiceConfirm;
window.saveSettings = saveSettings;
window.addVariantField = addVariantField;
window.removeVariant = removeVariant;
