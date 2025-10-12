/**
 * Panel Admin JavaScript - Al Gran
 * Gestion complète via API Cloudflare
 */

// Configuration API
// ⚠️ IMPORTANT: Remplacez cette URL par votre URL Cloudflare Workers après déploiement
// Exemple: https://algran-api-votre-nom.workers.dev
const API_URL = 'https://algran-api.calitek-junior.workers.dev'; 
const ADMIN_PASSWORD = 'admin123'; // À changer après premier login

// Vérifier si l'API est accessible
let API_AVAILABLE = false;

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
    
    // Formulaire paramètres
    document.getElementById('settingsForm').addEventListener('submit', saveSettings);
    
    // Boutons Farms, Services et Social
    document.getElementById('addFarmBtn').addEventListener('click', () => openFarmModal());
    document.getElementById('addServiceBtn').addEventListener('click', () => openServiceModal());
    document.getElementById('addSocialBtn').addEventListener('click', () => openSocialModal());
    
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
        farms: 'Gestion des Farms',
        services: 'Gestion des Services',
        social: 'Réseaux Sociaux',
        settings: 'Paramètres'
    };
    document.getElementById('pageTitle').textContent = titles[section];
    
    // Charger les données
    if (section === 'dashboard') loadDashboard();
    if (section === 'products') loadProducts();
    if (section === 'categories') loadCategories();
    if (section === 'farms') loadFarms();
    if (section === 'services') loadServices();
    if (section === 'social') loadSocialNetworks();
    if (section === 'settings') loadSettings();
}

// Charger le dashboard
async function loadDashboard() {
    try {
        // Afficher un message de chargement
        document.getElementById('totalProducts').textContent = '...';
        document.getElementById('totalCategories').textContent = '...';
        document.getElementById('activeProducts').textContent = '...';
        document.getElementById('totalImages').textContent = '...';
        
        const response = await fetch(`${API_URL}/api/stats`);
        
        if (!response.ok) {
            throw new Error(`API non disponible (${response.status})`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('totalProducts').textContent = data.stats.totalProducts;
            document.getElementById('totalCategories').textContent = data.stats.totalCategories;
            document.getElementById('activeProducts').textContent = data.stats.activeProducts;
            document.getElementById('totalImages').textContent = data.stats.totalImages;
            API_AVAILABLE = true;
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        document.getElementById('totalProducts').textContent = '0';
        document.getElementById('totalCategories').textContent = '0';
        document.getElementById('activeProducts').textContent = '0';
        document.getElementById('totalImages').textContent = '0';
        
        // Message d'erreur plus clair
        showAlert('⚠️ API NON DISPONIBLE ! Vérifiez que vous avez bien déployé l\'API et mis l\'URL correcte dans admin.js ligne 9. Exemple: https://algran-api-xxx.workers.dev', 'error');
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
    
    // Charger les catégories et farms
    await loadCategoriesForForm();
    await loadFarmsForForm();
    
    // Réinitialiser le formulaire
    document.getElementById('productForm').reset();
    
    if (productId) {
        // Mode édition
        const product = products.find(p => p.id === productId);
        if (product) {
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category_id;
            document.getElementById('productFarm').value = product.farm_id || '';
            
            // Gérer les prix multiples
            if (product.prices && product.prices !== 'null') {
                try {
                    const prices = JSON.parse(product.prices);
                    const pricesText = prices.map(p => `${p.quantity}|${p.price}`).join('\n');
                    document.getElementById('productPrices').value = pricesText;
                } catch (e) {
                    // Si erreur de parsing, utiliser l'ancien format
                    document.getElementById('productPrices').value = `${product.unit || '1g'}|${product.price}`;
                }
            } else {
                // Ancien format (prix unique) ou prices est null
                const unit = product.unit || '1g';
                const price = product.price || 0;
                document.getElementById('productPrices').value = `${unit}|${price}`;
            }
            
            document.getElementById('productBadge').value = product.badge || '';
            document.getElementById('productImage').value = product.image_url || '';
            document.getElementById('productVideo').value = product.video_url || '';
            document.getElementById('productDescription').value = product.description || '';
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
                `<option value="${cat.id}">${cat.name}</option>`
            ).join('');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Charger les farms pour le formulaire
async function loadFarmsForForm() {
    try {
        const response = await fetch(`${API_URL}/api/farms`);
        const data = await response.json();
        
        farms = data.farms || [];
        const select = document.getElementById('productFarm');
        select.innerHTML = '<option value="">Aucune</option>' + 
            farms.map(farm => 
                `<option value="${farm.id}">${farm.name}</option>`
            ).join('');
    } catch (error) {
        console.error('Error loading farms for form:', error);
        document.getElementById('productFarm').innerHTML = '<option value="">Aucune</option>';
    }
}

// Soumettre le formulaire produit
async function handleProductSubmit(e) {
    e.preventDefault();
    
    // Parser les prix multiples
    const pricesText = document.getElementById('productPrices').value;
    const pricesArray = pricesText.split('\n')
        .filter(line => line.trim())
        .map(line => {
            const [quantity, price] = line.split('|');
            return { quantity: quantity.trim(), price: parseFloat(price) };
        });
    
    // Validation
    if (pricesArray.length === 0) {
        showAlert('Veuillez entrer au moins un prix !', 'error');
        return;
    }
    
    const productData = {
        name: document.getElementById('productName').value,
        category_id: parseInt(document.getElementById('productCategory').value),
        farm_id: document.getElementById('productFarm').value ? parseInt(document.getElementById('productFarm').value) : null,
        prices: JSON.stringify(pricesArray),
        price: pricesArray[0].price,
        unit: pricesArray[0].quantity,
        badge: document.getElementById('productBadge').value,
        image_url: document.getElementById('productImage').value,
        video_url: document.getElementById('productVideo').value,
        description: document.getElementById('productDescription').value || '',
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
    
    if (categoriesToDisplay.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem;">Aucune catégorie</td></tr>';
        return;
    }
    
    tbody.innerHTML = categoriesToDisplay.map(cat => `
        <tr>
            <td>
                ${cat.image_url ? `<img src="${cat.image_url}" alt="${cat.name}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover; margin-right: 10px; vertical-align: middle;">` : ''}
                <strong>${cat.name}</strong>
            </td>
            <td>${cat.description || ''}</td>
            <td>${cat.product_count || 0}</td>
            <td>
                <button class="btn btn-primary" onclick="editCategory(${cat.id})" style="margin-right: 0.5rem;">
                    <i class="fas fa-edit"></i> Modifier
                </button>
                <button class="btn btn-danger" onclick="deleteCategoryConfirm(${cat.id}, '${escapeHtml(cat.name)}')">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </td>
        </tr>
    `).join('');
}

// Fonction utilitaire pour échapper les caractères HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Créer une nouvelle catégorie
function createNewCategory() {
    const name = prompt('Nom de la catégorie (ex: Extract, Weed):');
    if (!name) return;
    
    const icon = prompt('Icône (emoji, ex: 🔥):', '');
    const description = prompt('Description:', '');
    const imageUrl = prompt('URL de l\'image (optionnel):\n\n💡 Utilisez un lien direct (finit par .jpg, .png, .webp)\nExemple: https://i.imgur.com/xxxxx.jpg', '');
    
    createCategoryAction({ 
        name, 
        icon, 
        description,
        image_url: imageUrl 
    });
}

// Créer une catégorie
async function createCategoryAction(data) {
    try {
        const response = await fetch(`${API_URL}/api/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            showAlert('Catégorie créée avec succès !', 'success');
            loadCategories();
        } else {
            showAlert('Erreur: ' + (result.message || 'Création impossible'), 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Erreur lors de la création', 'error');
    }
}

// Éditer une catégorie
function editCategory(id) {
    const category = categories.find(c => c.id === id);
    if (category) {
        const newName = prompt('Nom de la catégorie:', category.name);
        if (!newName) return;
        
        const newDescription = prompt('Description:', category.description || '');
        const newImageUrl = prompt('URL de l\'image (optionnel):\n\nExemple: https://i.imgur.com/xxxxx.jpg', category.image_url || '');
        
        updateCategoryAction(id, { 
            name: newName,
            description: newDescription,
            image_url: newImageUrl
        });
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

// Confirmer suppression catégorie
function deleteCategoryConfirm(id, name) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${name}" ?\n\nATTENTION : Les produits de cette catégorie ne seront pas supprimés.`)) {
        deleteCategoryAction(id);
    }
}

// Supprimer une catégorie
async function deleteCategoryAction(id) {
    try {
        const response = await fetch(`${API_URL}/api/categories/${id}`, { 
            method: 'DELETE' 
        });
        const result = await response.json();
        if (result.success) {
            showAlert('Catégorie supprimée avec succès !', 'success');
            loadCategories();
        } else {
            showAlert('Erreur: ' + (result.message || 'Suppression impossible'), 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Erreur lors de la suppression', 'error');
    }
}

// Charger les paramètres
async function loadSettings() {
    try {
        const response = await fetch(`${API_URL}/api/settings`);
        const data = await response.json();
        
        if (data.success && data.settings) {
            // Remplir le formulaire avec les valeurs actuelles
            let settings = {};
            
            // Si data.settings est un tableau
            if (Array.isArray(data.settings)) {
                data.settings.forEach(setting => {
                    settings[setting.key] = setting.value;
                });
            } 
            // Si data.settings est déjà un objet
            else if (typeof data.settings === 'object') {
                settings = data.settings;
            }
            
            document.getElementById('shopName').value = settings.shop_name || 'Al Gran';
            document.getElementById('shopSubtitle').value = settings.shop_subtitle || 'Amour';
            document.getElementById('backgroundImage').value = settings.background_image_url || '';
            
            console.log('Settings loaded:', settings);
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        // Ne pas afficher d'alerte d'erreur, juste utiliser les valeurs par défaut
        document.getElementById('shopName').value = 'Al Gran';
        document.getElementById('shopSubtitle').value = 'Amour';
        document.getElementById('backgroundImage').value = '';
    }
}

// Sauvegarder les paramètres
async function saveSettings(e) {
    e.preventDefault();
    
    const settingsData = {
        shop_name: document.getElementById('shopName').value,
        shop_subtitle: document.getElementById('shopSubtitle').value,
        background_image_url: document.getElementById('backgroundImage').value
    };
    
    // Si un nouveau mot de passe est fourni
    const newPassword = document.getElementById('adminPassword').value;
    if (newPassword) {
        settingsData.admin_password = newPassword;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settingsData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('✅ Paramètres sauvegardés avec succès !', 'success');
            document.getElementById('adminPassword').value = ''; // Vider le champ mot de passe
            
            // Si le mot de passe a été changé, déconnecter l'utilisateur
            if (newPassword) {
                showAlert('⚠️ Mot de passe changé ! Vous allez être déconnecté...', 'warning');
                setTimeout(() => {
                    handleLogout();
                }, 2000);
            }
        } else {
            showAlert('❌ Erreur: ' + (data.error || 'Erreur inconnue'), 'error');
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        showAlert('❌ Erreur lors de la sauvegarde', 'error');
    }
}

// Afficher une alerte
function showAlert(message, type = 'success') {
    const container = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} active`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    container.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// ==================== FARMS ====================

let farms = [];

// Charger les farms
async function loadFarms() {
    try {
        const response = await fetch(`${API_URL}/api/farms`);
        const data = await response.json();
        
        if (data.success) {
            farms = data.farms || [];
            displayFarms(farms);
        } else {
            displayFarms([]);
        }
    } catch (error) {
        console.error('Error loading farms:', error);
        displayFarms([]);
    }
}

// Afficher les farms
function displayFarms(farmsToDisplay) {
    const tbody = document.getElementById('farmsTableBody');
    
    if (farmsToDisplay.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">Aucune farm</td></tr>';
        return;
    }
    
    tbody.innerHTML = farmsToDisplay.map(farm => `
        <tr>
            <td><strong>${farm.name}</strong></td>
            <td>${farm.country || '-'}</td>
            <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${farm.description || '-'}</td>
            <td>${farm.display_order || 0}</td>
            <td>
                <button class="btn btn-primary" onclick="editFarm(${farm.id})" style="margin-right: 0.5rem;">
                    <i class="fas fa-edit"></i> Modifier
                </button>
                <button class="btn btn-danger" onclick="deleteFarmConfirm(${farm.id}, '${escapeHtml(farm.name)}')">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </td>
        </tr>
    `).join('');
}

// Ouvrir modal farm
function openFarmModal(farmId = null) {
    const name = farmId ? prompt('Nom de la farm:', farms.find(f => f.id === farmId)?.name || '') : prompt('Nom de la farm (ex: WIZARD TREES):', '');
    if (!name) return;
    
    const country = prompt('Pays (ex: USA, FR):', farmId ? farms.find(f => f.id === farmId)?.country : 'USA');
    const description = prompt('Description:', farmId ? farms.find(f => f.id === farmId)?.description : '');
    const order = prompt('Ordre d\'affichage:', farmId ? farms.find(f => f.id === farmId)?.display_order : farms.length + 1);
    
    const farmData = { 
        name, 
        country: country || '', 
        description: description || '', 
        display_order: parseInt(order) || 0 
    };
    
    if (farmId) {
        updateFarmAction(farmId, farmData);
    } else {
        createFarmAction(farmData);
    }
}

// Créer une farm
async function createFarmAction(data) {
    try {
        const response = await fetch(`${API_URL}/api/farms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log('Create farm result:', result);
        if (result.success) {
            showAlert('Farm créée avec succès !', 'success');
            loadFarms();
        } else {
            showAlert(`Erreur: ${result.error || 'Erreur inconnue'}`, 'error');
        }
    } catch (error) {
        console.error('Create farm error:', error);
        showAlert('Erreur lors de la création', 'error');
    }
}

// Modifier une farm
function editFarm(id) {
    openFarmModal(id);
}

// Mettre à jour une farm
async function updateFarmAction(id, data) {
    try {
        const response = await fetch(`${API_URL}/api/farms/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            showAlert('Farm modifiée avec succès !', 'success');
            loadFarms();
        }
    } catch (error) {
        showAlert('Erreur lors de la mise à jour', 'error');
    }
}

// Confirmer suppression farm
function deleteFarmConfirm(id, name) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) {
        deleteFarmAction(id);
    }
}

// Supprimer une farm
async function deleteFarmAction(id) {
    try {
        const response = await fetch(`${API_URL}/api/farms/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
            showAlert('Farm supprimée avec succès !', 'success');
            loadFarms();
        }
    } catch (error) {
        showAlert('Erreur lors de la suppression', 'error');
    }
}

// ==================== SERVICES ====================

let services = [];

// Charger les services
async function loadServices() {
    try {
        const response = await fetch(`${API_URL}/api/services`);
        const data = await response.json();
        
        if (data.success) {
            services = data.services || [];
            displayServices(services);
        }
    } catch (error) {
        console.error('Error loading services:', error);
        showAlert('Erreur lors du chargement des services', 'error');
    }
}

// Afficher les services
function displayServices(servicesToDisplay) {
    const tbody = document.getElementById('servicesTableBody');
    
    if (servicesToDisplay.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">Aucun service</td></tr>';
        return;
    }
    
    tbody.innerHTML = servicesToDisplay.map(service => `
        <tr>
            <td>${service.title}</td>
            <td style="font-size: 1.5rem;">${service.icon}</td>
            <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${service.content.substring(0, 80)}...</td>
            <td>${service.display_order}</td>
            <td>
                <button class="btn btn-primary" onclick="editService(${service.id})" style="margin-right: 0.5rem;">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteServiceConfirm(${service.id}, '${service.title}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Ouvrir modal service
function openServiceModal(serviceId = null) {
    const title = serviceId ? prompt('Titre du service:', services.find(s => s.id === serviceId)?.title || '') : prompt('Titre du service:', '');
    if (!title) return;
    
    const icon = prompt('Icône (emoji):', serviceId ? services.find(s => s.id === serviceId)?.icon : '📝');
    if (!icon) return;
    
    const content = prompt('Contenu du service:', serviceId ? services.find(s => s.id === serviceId)?.content : '');
    if (!content) return;
    
    const order = prompt('Ordre d\'affichage (nombre):', serviceId ? services.find(s => s.id === serviceId)?.display_order : services.length + 1);
    
    const serviceData = { title, icon, content, display_order: parseInt(order) || 0 };
    
    if (serviceId) {
        updateServiceAction(serviceId, serviceData);
    } else {
        createServiceAction(serviceData);
    }
}

// Créer un service
async function createServiceAction(data) {
    try {
        const response = await fetch(`${API_URL}/api/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            showAlert('Service créé avec succès !', 'success');
            loadServices();
        }
    } catch (error) {
        showAlert('Erreur lors de la création', 'error');
    }
}

// Modifier un service
function editService(id) {
    openServiceModal(id);
}

// Mettre à jour un service
async function updateServiceAction(id, data) {
    try {
        const response = await fetch(`${API_URL}/api/services/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            showAlert('Service modifié avec succès !', 'success');
            loadServices();
        }
    } catch (error) {
        showAlert('Erreur lors de la mise à jour', 'error');
    }
}

// Confirmer suppression service
function deleteServiceConfirm(id, title) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${title}" ?`)) {
        deleteServiceAction(id);
    }
}

// Supprimer un service
async function deleteServiceAction(id) {
    try {
        const response = await fetch(`${API_URL}/api/services/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
            showAlert('Service supprimé avec succès !', 'success');
            loadServices();
        }
    } catch (error) {
        showAlert('Erreur lors de la suppression', 'error');
    }
}

// ==================== RÉSEAUX SOCIAUX ====================

let socialNetworks = [];

// Charger les réseaux sociaux
async function loadSocialNetworks() {
    try {
        const response = await fetch(`${API_URL}/api/social-networks`);
        const data = await response.json();
        
        if (data.success) {
            socialNetworks = data.networks || [];
            displaySocialNetworks(socialNetworks);
        } else {
            displaySocialNetworks([]);
        }
    } catch (error) {
        console.error('Error loading social networks:', error);
        displaySocialNetworks([]);
    }
}

// Afficher les réseaux sociaux
function displaySocialNetworks(networksToDisplay) {
    const tbody = document.getElementById('socialTableBody');
    
    if (networksToDisplay.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">Aucun réseau social configuré</td></tr>';
        return;
    }
    
    tbody.innerHTML = networksToDisplay.map(network => `
        <tr>
            <td>${network.name}</td>
            <td style="font-size: 1.5rem;">${network.icon}</td>
            <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${network.url}</td>
            <td>${network.display_order}</td>
            <td>
                <button class="btn btn-primary" onclick="editSocialNetwork(${network.id})" style="margin-right: 0.5rem;">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteSocialConfirm(${network.id}, '${network.name}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Ouvrir modal réseau social
function openSocialModal(networkId = null) {
    const name = networkId ? prompt('Nom du réseau:', socialNetworks.find(s => s.id === networkId)?.name || '') : prompt('Nom du réseau (ex: WhatsApp, Instagram):', '');
    if (!name) return;
    
    const icon = prompt('Icône (emoji ou classe Font Awesome):', networkId ? socialNetworks.find(s => s.id === networkId)?.icon : '📱');
    if (!icon) return;
    
    const url = prompt('URL complète:', networkId ? socialNetworks.find(s => s.id === networkId)?.url : '');
    if (!url) return;
    
    const order = prompt('Ordre d\'affichage:', networkId ? socialNetworks.find(s => s.id === networkId)?.display_order : socialNetworks.length + 1);
    
    const networkData = { name, icon, url, display_order: parseInt(order) || 0 };
    
    if (networkId) {
        updateSocialNetworkAction(networkId, networkData);
    } else {
        createSocialNetworkAction(networkData);
    }
}

// Créer un réseau social
async function createSocialNetworkAction(data) {
    try {
        const response = await fetch(`${API_URL}/api/social-networks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            showAlert('Réseau social ajouté avec succès !', 'success');
            loadSocialNetworks();
        }
    } catch (error) {
        showAlert('Erreur lors de la création', 'error');
    }
}

// Modifier un réseau social
function editSocialNetwork(id) {
    openSocialModal(id);
}

// Mettre à jour un réseau social
async function updateSocialNetworkAction(id, data) {
    try {
        const response = await fetch(`${API_URL}/api/social-networks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            showAlert('Réseau social modifié avec succès !', 'success');
            loadSocialNetworks();
        }
    } catch (error) {
        showAlert('Erreur lors de la mise à jour', 'error');
    }
}

// Confirmer suppression réseau social
function deleteSocialConfirm(id, name) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) {
        deleteSocialNetworkAction(id);
    }
}

// Supprimer un réseau social
async function deleteSocialNetworkAction(id) {
    try {
        const response = await fetch(`${API_URL}/api/social-networks/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
            showAlert('Réseau social supprimé avec succès !', 'success');
            loadSocialNetworks();
        }
    } catch (error) {
        showAlert('Erreur lors de la suppression', 'error');
    }
}

// Exposer les fonctions globalement pour les boutons inline
window.editProduct = editProduct;
window.deleteProductConfirm = deleteProductConfirm;
window.createNewCategory = createNewCategory;
window.editCategory = editCategory;
window.deleteCategoryConfirm = deleteCategoryConfirm;
window.editFarm = editFarm;
window.deleteFarmConfirm = deleteFarmConfirm;
window.editService = editService;
window.deleteServiceConfirm = deleteServiceConfirm;
window.editSocialNetwork = editSocialNetwork;
window.deleteSocialConfirm = deleteSocialConfirm;
window.escapeHtml = escapeHtml;
