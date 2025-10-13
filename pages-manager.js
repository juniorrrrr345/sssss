/**
 * Gestionnaire de pages HTML pour le panel admin
 */

// Liste des pages de votre site
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

// Fonction pour obtenir les informations des fichiers
async function getPageInfo(filename) {
    try {
        const response = await fetch(`/${filename}`);
        if (response.ok) {
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            
            return {
                exists: true,
                title: doc.querySelector('title')?.textContent || 'Sans titre',
                size: new Blob([text]).size,
                hasStyles: !!doc.querySelector('link[rel="stylesheet"], style'),
                hasScripts: !!doc.querySelector('script'),
                metaDescription: doc.querySelector('meta[name="description"]')?.content || ''
            };
        }
    } catch (error) {
        console.error(`Erreur lors du chargement de ${filename}:`, error);
    }
    return { exists: false };
}

// Fonction pour afficher les pages dans le panel admin
function displayPages(pages) {
    const container = document.getElementById('pagesContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="pages-grid">
            ${pages.map(page => `
                <div class="page-card ${page.status}" data-page-id="${page.id}">
                    <div class="page-header">
                        <h3 class="page-title">${page.title}</h3>
                        <span class="page-status badge badge-${getStatusBadgeClass(page.status)}">
                            ${getStatusLabel(page.status)}
                        </span>
                    </div>
                    <div class="page-info">
                        <p class="page-filename">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" width="1em" height="1em" style="display: inline-block; vertical-align: middle;"><path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z"/></svg>
                            ${page.filename}
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
                        <button class="btn btn-primary btn-sm" onclick="previewPage('${page.filename}')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" width="1em" height="1em" style="display: inline-block; vertical-align: middle;"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg> Voir
                        </button>
                        <button class="btn btn-success btn-sm" onclick="editPageInfo('${page.id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em" style="display: inline-block; vertical-align: middle;"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg> Infos
                        </button>
                        <button class="btn btn-warning btn-sm" onclick="analyzePageSEO('${page.filename}')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em" style="display: inline-block; vertical-align: middle;"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg> SEO
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Fonction pour obtenir la classe CSS du badge de statut
function getStatusBadgeClass(status) {
    const statusClasses = {
        'active': 'success',
        'template': 'warning',
        'demo': 'info',
        'inactive': 'danger'
    };
    return statusClasses[status] || 'secondary';
}

// Fonction pour obtenir le libellé du statut
function getStatusLabel(status) {
    const statusLabels = {
        'active': 'Actif',
        'template': 'Template',
        'demo': 'Démo',
        'inactive': 'Inactif'
    };
    return statusLabels[status] || status;
}

// Fonction pour prévisualiser une page
function previewPage(filename) {
    window.open(`/${filename}`, '_blank');
}

// Fonction pour éditer les informations d'une page
function editPageInfo(pageId) {
    const page = sitePages.find(p => p.id === pageId);
    if (!page) return;
    
    // Créer un modal pour éditer les infos
    const modal = createEditModal(page);
    document.body.appendChild(modal);
    modal.classList.add('active');
}

// Fonction pour créer le modal d'édition
function createEditModal(page) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Modifier les informations de la page</h2>
                <button class="btn-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <form onsubmit="savePageInfo(event, '${page.id}')">
                <div class="form-group">
                    <label>Titre de la page</label>
                    <input type="text" value="${page.title}" id="edit-page-title" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="edit-page-description" rows="3" required>${page.description}</textarea>
                </div>
                <div class="form-group">
                    <label>Statut</label>
                    <select id="edit-page-status">
                        <option value="active" ${page.status === 'active' ? 'selected' : ''}>Actif</option>
                        <option value="template" ${page.status === 'template' ? 'selected' : ''}>Template</option>
                        <option value="demo" ${page.status === 'demo' ? 'selected' : ''}>Démo</option>
                        <option value="inactive" ${page.status === 'inactive' ? 'selected' : ''}>Inactif</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-success">Sauvegarder</button>
            </form>
        </div>
    `;
    return modal;
}

// Fonction pour sauvegarder les infos d'une page
function savePageInfo(event, pageId) {
    event.preventDefault();
    
    const page = sitePages.find(p => p.id === pageId);
    if (!page) return;
    
    page.title = document.getElementById('edit-page-title').value;
    page.description = document.getElementById('edit-page-description').value;
    page.status = document.getElementById('edit-page-status').value;
    page.lastModified = new Date().toISOString();
    
    // Fermer le modal
    document.querySelector('.modal').remove();
    
    // Rafraîchir l'affichage
    displayPages(sitePages);
    
    // Afficher une notification
    showAlert('Informations de la page mises à jour !', 'success');
}

// Fonction pour analyser le SEO d'une page
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
        
        // Créer un modal pour afficher l'analyse SEO
        showSEOAnalysisModal(filename, seoAnalysis);
        
    } catch (error) {
        showAlert('Erreur lors de l\'analyse SEO', 'error');
    }
}

// Fonction pour afficher le modal d'analyse SEO
function showSEOAnalysisModal(filename, analysis) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h2 class="modal-title">Analyse SEO - ${filename}</h2>
                <button class="btn-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="seo-analysis">
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
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Exporter les fonctions pour utilisation globale
window.sitePages = sitePages;
window.displayPages = displayPages;
window.previewPage = previewPage;
window.editPageInfo = editPageInfo;
window.savePageInfo = savePageInfo;
window.analyzePageSEO = analyzePageSEO;