/**
 * Panel Admin JavaScript - Al Gran
 * Gestion complète via API Cloudflare
 */

// Configuration API
const API_URL = 'http://localhost:8787'; // Pour dev local - Changez pour production: https://algran-api.VOTRE-SUBDOMAIN.workers.dev
const ADMIN_PASSWORD = 'votre_nouveau_mot_de_passe'; // À changer après premier login

// État global
let currentSection = 'dashboard';
let products = [];
let categories = [];
let editingProductId = null;

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
    
    if (productId) {
        // Mode édition
        const product = products.find(p => p.id === productId);
        if (product) {
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category_id;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productUnit').value = product.unit;
            document.getElementById('productBadge').value = product.badge || '';
            document.getElementById('productImage').value = product.image_url || '';
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
        category_id: parseInt(document.getElementById('productCategory').value),
        price: parseFloat(document.getElementById('productPrice').value),
        unit: document.getElementById('productUnit').value,
        badge: document.getElementById('productBadge').value,
        image_url: document.getElementById('productImage').value,
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
            <td>${cat.icon || ''} ${cat.name}</td>
            <td>${cat.description || ''}</td>
            <td>${cat.product_count || 0}</td>
            <td>
                <button class="btn btn-primary" onclick="editCategory(${cat.id})">
                    <i class="fas fa-edit"></i> Modifier
                </button>
            </td>
        </tr>
    `).join('');
}

// Éditer une catégorie
function editCategory(id) {
    const category = categories.find(c => c.id === id);
    if (category) {
        const newName = prompt('Nouveau nom:', category.name);
        if (newName && newName !== category.name) {
            updateCategoryAction(id, { name: newName });
        }
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
        fields = ['shop_name', 'shop_description', 'shop_email', 'shop_phone'];
    } else if (section === 'social') {
        fields = ['shop_whatsapp', 'shop_telegram', 'shop_instagram', 'shop_linktree'];
    } else if (section === 'home') {
        fields = ['home_welcome_title', 'home_services_text', 'home_delivery_text', 'home_delivery_zones'];
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
window.saveSettings = saveSettings;
