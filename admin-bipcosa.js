// ===== CONFIG =====
const ADMIN_PASSWORD = "admin123"; // Change-le si besoin

// ===== STATE =====
let products = [], categories = [], farms = [], services = [], socials = [];
let editing = { type: null, id: null };

// Liste des pages HTML du site
const sitePages = [
    {
        id: 'home',
        filename: 'home.html',
        title: 'AVEC AMOUR - Accueil',
        description: 'Page d\'accueil avec présentation des services',
        status: 'active',
        lastModified: null,
        components: ['Logo géant', 'Animation Lottie', 'Services', 'Zone de livraison']
    },
    {
        id: 'index',
        filename: 'index.html',
        title: 'Page principale',
        description: 'Page d\'index du site',
        status: 'active',
        lastModified: null,
        components: ['Navigation', 'Contenu principal']
    },
    {
        id: 'products',
        filename: 'products.html',
        title: 'Tous les Produits',
        description: 'Catalogue complet des produits avec filtres et recherche',
        status: 'active',
        lastModified: null,
        components: ['Recherche', 'Filtres catégories', 'Grille produits', 'Pagination']
    },
    {
        id: 'products-complete',
        filename: 'products-complete.html',
        title: 'Produits (Version complète)',
        description: 'Version alternative de la page produits',
        status: 'active',
        lastModified: null,
        components: ['Liste produits', 'Catégories']
    },
    {
        id: 'product-detail',
        filename: 'product-detail.html',
        title: 'Détail Produit',
        description: 'Page de détail d\'un produit individuel',
        status: 'template',
        lastModified: null,
        components: ['Image produit', 'Description', 'Prix', 'Actions']
    },
    {
        id: 'categories',
        filename: 'categories.html',
        title: 'Catégories',
        description: 'Page des catégories de produits',
        status: 'active',
        lastModified: null,
        components: ['Liste catégories', 'Navigation']
    },
    {
        id: 'categories-fixed',
        filename: 'categories-fixed.html',
        title: 'Catégories (Version corrigée)',
        description: 'Version alternative de la page catégories',
        status: 'active',
        lastModified: null,
        components: ['Liste catégories améliorée']
    },
    {
        id: 'contact',
        filename: 'contact.html',
        title: 'Nous Contacter',
        description: 'Page de contact avec liens vers réseaux sociaux',
        status: 'active',
        lastModified: null,
        components: ['WhatsApp', 'Telegram', 'Instagram', 'Formulaire contact']
    },
    {
        id: 'animations-demo',
        filename: 'animations-demo.html',
        title: 'Démo Animations',
        description: 'Page de démonstration des animations Lottie',
        status: 'demo',
        lastModified: null,
        components: ['Animations Lottie', 'Tests visuels']
    }
];

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    initNavigation();
    initLogout();
    initModals();
    loadDashboard();
});

// ===== AUTH =====
function checkAuth() {
    const auth = sessionStorage.getItem("admin_authenticated");
    if (!auth) showLoginModal();
}

function showLoginModal() {
    const pwd = prompt("Entrez le mot de passe admin :");
    if (pwd !== null) {
        if (pwd === ADMIN_PASSWORD) {
            sessionStorage.setItem("admin_authenticated","true");
            showAlert("Connexion réussie !","success");
        } else {
            showAlert("Mot de passe incorrect !","error");
            showLoginModal();
        }
    }
}

// ===== NAVIGATION =====
function initNavigation(){
    document.querySelectorAll(".nav-item").forEach(item=>{
        item.addEventListener("click",()=>{
            if(item.id==="logoutBtn") return;
            document.querySelectorAll(".nav-item").forEach(i=>i.classList.remove("active"));
            item.classList.add("active");
            const section = item.dataset.section;
            document.querySelectorAll(".content-section").forEach(s=>s.classList.remove("active"));
            if(section) {
                document.getElementById(section).classList.add("active");
                updateSection(section);
            }
        });
    });
}

// ===== UPDATE SECTION =====
function updateSection(section) {
    switch(section) {
        case 'dashboard': loadDashboard(); break;
        case 'pages': renderPages(); break;
        case 'products': renderProducts(); break;
        case 'categories': renderCategories(); break;
        case 'farms': renderFarms(); break;
        case 'services': renderServices(); break;
        case 'social': renderSocials(); break;
    }
}

// ===== DASHBOARD =====
function loadDashboard(){
    document.getElementById("statPages").textContent = sitePages.length;
    document.getElementById("statProducts").textContent = products.length;
    document.getElementById("statCategories").textContent = categories.length;
    document.getElementById("statFarms").textContent = farms.length;
    document.getElementById("statServices").textContent = services.length;
    document.getElementById("statSocial").textContent = socials.length;
}

// ===== LOGOUT =====
function initLogout(){
    document.getElementById("logoutBtn").addEventListener("click",()=>{
        sessionStorage.removeItem("admin_authenticated");
        location.reload();
    });
}

// ===== ALERT =====
function showAlert(msg, type="success"){
    const container = document.getElementById("alertContainer");
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = msg;
    container.appendChild(alert);
    setTimeout(()=>{ alert.remove(); },3000);
}

// ===== MODALS =====
function initModals(){
    // Product Modal
    const productModal = document.getElementById("productModal");
    document.getElementById("addProductBtn").addEventListener("click", ()=>{
        editing = {type:"product", id:null};
        document.getElementById("productForm").reset();
        productModal.classList.add("active");
    });
    document.getElementById("closeProductModal").addEventListener("click", ()=>productModal.classList.remove("active"));

    document.getElementById("productForm").addEventListener("submit", e=>{
        e.preventDefault();
        const data = {
            id: editing.id||Date.now(),
            name: document.getElementById("productName").value,
            category: document.getElementById("productCategory").value,
            price: document.getElementById("productPrice").value,
            unit: document.getElementById("productUnit").value,
            image: document.getElementById("productImage").value,
            description: document.getElementById("productDescription").value
        };
        if(editing.id){
            products = products.map(p=>p.id===editing.id?data:p);
            showAlert("Produit modifié !","success");
        } else {
            products.push(data);
            showAlert("Produit ajouté !","success");
        }
        productModal.classList.remove("active");
        renderProducts();
        loadDashboard();
    });

    // Page Edit Modal
    const pageEditModal = document.getElementById("pageEditModal");
    document.getElementById("closePageEditModal").addEventListener("click", ()=>pageEditModal.classList.remove("active"));
    
    document.getElementById("pageEditForm").addEventListener("submit", e=>{
        e.preventDefault();
        const pageId = document.getElementById("pageId").value;
        const page = sitePages.find(p => p.id === pageId);
        if (page) {
            page.title = document.getElementById("pageTitle").value;
            page.description = document.getElementById("pageDescription").value;
            page.status = document.getElementById("pageStatus").value;
            page.lastModified = new Date().toISOString();
            showAlert("Page modifiée avec succès !", "success");
            pageEditModal.classList.remove("active");
            renderPages();
        }
    });

    // SEO Modal
    document.getElementById("closeSeoModal").addEventListener("click", ()=>{
        document.getElementById("seoModal").classList.remove("active");
    });

    // Category Modal
    document.getElementById("addCategoryBtn").addEventListener("click", ()=>{
        const name = prompt("Nom de la catégorie :");
        if(name) {
            categories.push({id: Date.now(), name});
            showAlert("Catégorie ajoutée !", "success");
            renderCategories();
            loadDashboard();
        }
    });

    // Farm Modal
    document.getElementById("addFarmBtn").addEventListener("click", ()=>{
        const name = prompt("Nom de la farm :");
        if(name) {
            farms.push({id: Date.now(), name});
            showAlert("Farm ajoutée !", "success");
            renderFarms();
            loadDashboard();
        }
    });

    // Service Modal
    document.getElementById("addServiceBtn").addEventListener("click", ()=>{
        const name = prompt("Nom du service :");
        if(name) {
            services.push({id: Date.now(), name});
            showAlert("Service ajouté !", "success");
            renderServices();
            loadDashboard();
        }
    });

    // Social Modal
    document.getElementById("addSocialBtn").addEventListener("click", ()=>{
        const name = prompt("Nom du réseau social :");
        if(name) {
            const url = prompt("URL du réseau social :");
            if(url) {
                socials.push({id: Date.now(), name, url});
                showAlert("Réseau social ajouté !", "success");
                renderSocials();
                loadDashboard();
            }
        }
    });
}

// ===== RENDER PAGES =====
function renderPages() {
    const container = document.getElementById('pagesContainer');
    
    container.innerHTML = sitePages.map(page => `
        <div class="page-card" data-page-id="${page.id}">
            <div class="page-header">
                <h3 class="page-title">${page.title}</h3>
                <span class="page-status status-${page.status}">
                    ${getStatusLabel(page.status)}
                </span>
            </div>
            <div class="page-info">
                <p class="page-filename">
                    <i class="fas fa-file-code"></i> ${page.filename}
                </p>
                <p class="page-description">${page.description}</p>
            </div>
            <div class="page-components">
                <strong>Composants:</strong>
                <div class="components-list">
                    ${page.components.map(comp => `<span class="component-tag">${comp}</span>`).join('')}
                </div>
            </div>
            <div class="page-actions">
                <button class="btn-view" onclick="previewPage('${page.filename}')">
                    <i class="fas fa-eye"></i> Voir
                </button>
                <button class="btn-edit" onclick="editPageInfo('${page.id}')">
                    <i class="fas fa-edit"></i> Infos
                </button>
                <button class="btn-seo" onclick="analyzePageSEO('${page.filename}')">
                    <i class="fas fa-search"></i> SEO
                </button>
            </div>
        </div>
    `).join('');
}

// ===== RENDER TABLES =====
function renderProducts(){
    const tbody = document.getElementById("productsTableBody");
    tbody.innerHTML = products.length?products.map(p=>`
        <tr>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${p.price} ${p.unit||''}</td>
            <td><img src="${p.image||'https://via.placeholder.com/50'}" width="50"></td>
            <td>
                <button class="btn-edit" onclick="editProduct(${p.id})">Modifier</button>
                <button class="btn-delete" onclick="deleteItem('products',${p.id})">Supprimer</button>
            </td>
        </tr>`).join(''):`<tr><td colspan="5" style="text-align:center;">Aucun produit</td></tr>`;
}

function renderCategories(){
    const tbody = document.getElementById("categoriesTableBody");
    tbody.innerHTML = categories.length?categories.map(c=>`
        <tr>
            <td>${c.name}</td>
            <td>
                <button class="btn-edit" onclick="editCategory(${c.id})">Modifier</button>
                <button class="btn-delete" onclick="deleteItem('categories',${c.id})">Supprimer</button>
            </td>
        </tr>`).join(''):`<tr><td colspan="2">Aucune catégorie</td></tr>`;
}

function renderFarms(){
    const tbody = document.getElementById("farmsTableBody");
    tbody.innerHTML = farms.length?farms.map(f=>`
        <tr>
            <td>${f.name}</td>
            <td>
                <button class="btn-edit" onclick="editFarm(${f.id})">Modifier</button>
                <button class="btn-delete" onclick="deleteItem('farms',${f.id})">Supprimer</button>
            </td>
        </tr>`).join(''):`<tr><td colspan="2">Aucune farm</td></tr>`;
}

function renderServices(){
    const tbody = document.getElementById("servicesTableBody");
    tbody.innerHTML = services.length?services.map(s=>`
        <tr>
            <td>${s.name}</td>
            <td>
                <button class="btn-edit" onclick="editService(${s.id})">Modifier</button>
                <button class="btn-delete" onclick="deleteItem('services',${s.id})">Supprimer</button>
            </td>
        </tr>`).join(''):`<tr><td colspan="2">Aucun service</td></tr>`;
}

function renderSocials(){
    const tbody = document.getElementById("socialTableBody");
    tbody.innerHTML = socials.length?socials.map(s=>`
        <tr>
            <td>${s.name}</td><td>${s.url}</td>
            <td>
                <button class="btn-edit" onclick="editSocial(${s.id})">Modifier</button>
                <button class="btn-delete" onclick="deleteItem('socials',${s.id})">Supprimer</button>
            </td>
        </tr>`).join(''):`<tr><td colspan="3">Aucun réseau</td></tr>`;
}

// ===== DELETE =====
function deleteItem(type,id){
    if(!confirm("Supprimer cet élément ?")) return;
    switch(type){
        case "products": products=products.filter(p=>p.id!==id); renderProducts(); break;
        case "categories": categories=categories.filter(c=>c.id!==id); renderCategories(); break;
        case "farms": farms=farms.filter(f=>f.id!==id); renderFarms(); break;
        case "services": services=services.filter(s=>s.id!==id); renderServices(); break;
        case "socials": socials=socials.filter(s=>s.id!==id); renderSocials(); break;
    }
    showAlert("Élément supprimé !","success");
    loadDashboard();
}

// ===== EDIT FUNCTIONS =====
function editProduct(id){
    editing={type:"product", id};
    const p=products.find(p=>p.id===id);
    document.getElementById("productName").value=p.name;
    document.getElementById("productCategory").value=p.category;
    document.getElementById("productPrice").value=p.price;
    document.getElementById("productUnit").value=p.unit;
    document.getElementById("productImage").value=p.image;
    document.getElementById("productDescription").value=p.description;
    document.getElementById("productModal").classList.add("active");
}

function editCategory(id){
    const cat = categories.find(c=>c.id===id);
    const newName = prompt("Nouveau nom:", cat.name);
    if(newName && newName !== cat.name) {
        cat.name = newName;
        showAlert("Catégorie modifiée !", "success");
        renderCategories();
    }
}

function editFarm(id){
    const farm = farms.find(f=>f.id===id);
    const newName = prompt("Nouveau nom:", farm.name);
    if(newName && newName !== farm.name) {
        farm.name = newName;
        showAlert("Farm modifiée !", "success");
        renderFarms();
    }
}

function editService(id){
    const service = services.find(s=>s.id===id);
    const newName = prompt("Nouveau nom:", service.name);
    if(newName && newName !== service.name) {
        service.name = newName;
        showAlert("Service modifié !", "success");
        renderServices();
    }
}

function editSocial(id){
    const social = socials.find(s=>s.id===id);
    const newName = prompt("Nouveau nom:", social.name);
    if(newName) {
        const newUrl = prompt("Nouvelle URL:", social.url);
        if(newUrl) {
            social.name = newName;
            social.url = newUrl;
            showAlert("Réseau social modifié !", "success");
            renderSocials();
        }
    }
}

// ===== PAGE MANAGEMENT FUNCTIONS =====
function getStatusLabel(status) {
    const labels = {
        'active': 'Actif',
        'template': 'Template',
        'demo': 'Démo',
        'inactive': 'Inactif'
    };
    return labels[status] || status;
}

function previewPage(filename) {
    window.open(`/${filename}`, '_blank');
}

function editPageInfo(pageId) {
    const page = sitePages.find(p => p.id === pageId);
    if (!page) return;
    
    document.getElementById('pageId').value = page.id;
    document.getElementById('pageTitle').value = page.title;
    document.getElementById('pageDescription').value = page.description;
    document.getElementById('pageStatus').value = page.status;
    
    document.getElementById('pageEditModal').classList.add('active');
}

async function analyzePageSEO(filename) {
    try {
        const response = await fetch(`/${filename}`);
        if (!response.ok) throw new Error('Page non trouvée');
        
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        
        const seoAnalysis = {
            title: doc.querySelector('title')?.textContent || 'Pas de titre',
            titleLength: doc.querySelector('title')?.textContent?.length || 0,
            metaDescription: doc.querySelector('meta[name="description"]')?.content || 'Pas de description',
            metaDescriptionLength: doc.querySelector('meta[name="description"]')?.content?.length || 0,
            h1Count: doc.querySelectorAll('h1').length,
            h1Text: Array.from(doc.querySelectorAll('h1')).map(h => h.textContent).join(', '),
            imgAltMissing: Array.from(doc.querySelectorAll('img:not([alt])')).length,
            totalImages: doc.querySelectorAll('img').length,
            hasOgTags: !!doc.querySelector('meta[property^="og:"]'),
            hasViewport: !!doc.querySelector('meta[name="viewport"]'),
            hasCharset: !!doc.querySelector('meta[charset]'),
            externalLinks: doc.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])').length,
            internalLinks: doc.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]').length
        };
        
        showSEOAnalysis(filename, seoAnalysis);
        
    } catch (error) {
        showAlert('Erreur lors de l\'analyse SEO', 'error');
    }
}

function showSEOAnalysis(filename, analysis) {
    document.getElementById('seoPageName').textContent = filename;
    
    const content = document.getElementById('seoContent');
    content.innerHTML = `
        <div class="seo-section">
            <h3>Balises Meta</h3>
            <div class="seo-item ${analysis.titleLength >= 30 && analysis.titleLength <= 60 ? 'good' : 'warning'}">
                <strong>Title:</strong> ${analysis.title} 
                <span class="seo-badge">${analysis.titleLength} caractères</span>
                ${analysis.titleLength < 30 ? '<span class="seo-tip">⚠️ Trop court</span>' : ''}
                ${analysis.titleLength > 60 ? '<span class="seo-tip">⚠️ Trop long</span>' : ''}
            </div>
            <div class="seo-item ${analysis.metaDescriptionLength >= 120 && analysis.metaDescriptionLength <= 160 ? 'good' : 'warning'}">
                <strong>Description:</strong> ${analysis.metaDescription}
                <span class="seo-badge">${analysis.metaDescriptionLength} caractères</span>
                ${analysis.metaDescriptionLength < 120 ? '<span class="seo-tip">⚠️ Trop courte</span>' : ''}
                ${analysis.metaDescriptionLength > 160 ? '<span class="seo-tip">⚠️ Trop longue</span>' : ''}
            </div>
        </div>
        
        <div class="seo-section">
            <h3>Structure</h3>
            <div class="seo-item ${analysis.h1Count === 1 ? 'good' : 'warning'}">
                <strong>Balises H1:</strong> ${analysis.h1Count}
                ${analysis.h1Count === 0 ? '<span class="seo-tip">⚠️ Aucune balise H1</span>' : ''}
                ${analysis.h1Count > 1 ? '<span class="seo-tip">⚠️ Plusieurs H1 détectés</span>' : ''}
                ${analysis.h1Text ? '<br><em>' + analysis.h1Text + '</em>' : ''}
            </div>
        </div>
        
        <div class="seo-section">
            <h3>Images</h3>
            <div class="seo-item ${analysis.imgAltMissing === 0 ? 'good' : 'warning'}">
                <strong>Images sans alt:</strong> ${analysis.imgAltMissing} / ${analysis.totalImages}
                ${analysis.imgAltMissing > 0 ? '<span class="seo-tip">⚠️ Ajoutez des attributs alt</span>' : ''}
            </div>
        </div>
        
        <div class="seo-section">
            <h3>Optimisations techniques</h3>
            <div class="seo-item ${analysis.hasViewport ? 'good' : 'error'}">
                <strong>Viewport meta:</strong> ${analysis.hasViewport ? '✅ Présent' : '❌ Manquant'}
            </div>
            <div class="seo-item ${analysis.hasCharset ? 'good' : 'error'}">
                <strong>Charset:</strong> ${analysis.hasCharset ? '✅ Défini' : '❌ Non défini'}
            </div>
            <div class="seo-item ${analysis.hasOgTags ? 'good' : 'warning'}">
                <strong>Open Graph:</strong> ${analysis.hasOgTags ? '✅ Présent' : '⚠️ Absent'}
            </div>
        </div>
        
        <div class="seo-section">
            <h3>Liens</h3>
            <div class="seo-item">
                <strong>Liens internes:</strong> ${analysis.internalLinks}
            </div>
            <div class="seo-item">
                <strong>Liens externes:</strong> ${analysis.externalLinks}
            </div>
        </div>
    `;
    
    document.getElementById('seoModal').classList.add('active');
}

// Make functions globally accessible
window.editProduct = editProduct;
window.deleteItem = deleteItem;
window.editCategory = editCategory;
window.editFarm = editFarm;
window.editService = editService;
window.editSocial = editSocial;
window.previewPage = previewPage;
window.editPageInfo = editPageInfo;
window.analyzePageSEO = analyzePageSEO;