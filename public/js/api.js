// API Client pour communiquer avec le Worker Cloudflare
const API_BASE = 'https://algran-api.calitek-junior.workers.dev/api';

class API {
    constructor() {
        this.token = localStorage.getItem('adminToken');
    }

    // Headers avec authentification
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    // Gestion des erreurs
    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || `Erreur ${response.status}`);
        }
        return response.json();
    }

    // Authentification
    setToken(token) {
        this.token = token;
        localStorage.setItem('adminToken', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('adminToken');
    }

    // Produits
    async getProducts() {
        const response = await fetch(`${API_BASE}/products`);
        return this.handleResponse(response);
    }

    async getProduct(id) {
        const response = await fetch(`${API_BASE}/products/${id}`);
        return this.handleResponse(response);
    }

    async createProduct(product) {
        const response = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(product)
        });
        return this.handleResponse(response);
    }

    async updateProduct(id, product) {
        const response = await fetch(`${API_BASE}/products/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(product)
        });
        return this.handleResponse(response);
    }

    async deleteProduct(id) {
        const response = await fetch(`${API_BASE}/products/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    // Catégories
    async getCategories() {
        const response = await fetch(`${API_BASE}/categories`);
        return this.handleResponse(response);
    }

    async createCategory(name) {
        const response = await fetch(`${API_BASE}/categories`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ name })
        });
        return this.handleResponse(response);
    }

    async updateCategory(id, name) {
        const response = await fetch(`${API_BASE}/categories/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify({ name })
        });
        return this.handleResponse(response);
    }

    async deleteCategory(id) {
        const response = await fetch(`${API_BASE}/categories/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    // Farms
    async getFarms() {
        const response = await fetch(`${API_BASE}/farms`);
        return this.handleResponse(response);
    }

    async createFarm(name) {
        const response = await fetch(`${API_BASE}/farms`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ name })
        });
        return this.handleResponse(response);
    }

    async updateFarm(id, name) {
        const response = await fetch(`${API_BASE}/farms/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify({ name })
        });
        return this.handleResponse(response);
    }

    async deleteFarm(id) {
        const response = await fetch(`${API_BASE}/farms/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    // Réseaux sociaux
    async getSocials() {
        const response = await fetch(`${API_BASE}/socials`);
        return this.handleResponse(response);
    }

    async createSocial(social) {
        const response = await fetch(`${API_BASE}/socials`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(social)
        });
        return this.handleResponse(response);
    }

    async updateSocial(id, social) {
        const response = await fetch(`${API_BASE}/socials/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(social)
        });
        return this.handleResponse(response);
    }

    async deleteSocial(id) {
        const response = await fetch(`${API_BASE}/socials/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    // Paramètres
    async getSettings() {
        const response = await fetch(`${API_BASE}/settings`);
        return this.handleResponse(response);
    }

    async updateSettings(settings) {
        const response = await fetch(`${API_BASE}/settings`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(settings)
        });
        return this.handleResponse(response);
    }

    // Upload de fichiers
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            body: formData
        });
        return this.handleResponse(response);
    }

    // Charger les paramètres du site (nom, fond)
    async loadSiteSettings() {
        try {
            const settings = await this.getSettings();
            if (settings) {
                // Appliquer le nom de la boutique
                if (settings.shop_name) {
                    document.querySelectorAll('.shop-title').forEach(el => {
                        el.textContent = settings.shop_name;
                    });
                    document.title = settings.shop_name + ' - Boutique Magique';
                }
                
                // Appliquer le fond personnalisé
                if (settings.theme_bg_url) {
                    const overlay = document.querySelector('.background-overlay');
                    if (overlay) {
                        overlay.style.backgroundImage = `url(${settings.theme_bg_url})`;
                    }
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement des paramètres:', error);
        }
    }
}

// Instance globale de l'API
const api = new API();