# Boutique Al Gran

Boutique e-commerce moderne avec panel d'administration, utilisant Cloudflare Workers pour l'API.

## 🌐 Pages principales

- **Accueil** : `home.html`
- **Produits** : `products.html`
- **Catégories** : `categories.html`
- **Contact** : `contact.html`
- **Admin** : `admin.html`

## 🚀 Installation rapide

1. **Cloner le projet**
```bash
git clone https://github.com/juniorrrrr345/sssss.git
cd sssss
```

2. **Lancer en local**
```bash
python -m http.server 8000
```

3. **Accéder au site**
- Site : http://localhost:8000/home.html
- Admin : http://localhost:8000/admin.html

## 🔧 Configuration API

L'API est déjà déployée sur : `https://algran-api.calitek-junior.workers.dev`

Pour modifier l'URL de l'API, éditer :
- `api-connector.js` : Pour les pages publiques
- `admin.js` : Pour le panel admin

## 📁 Structure du projet

```
├── home.html          # Page d'accueil
├── products.html      # Liste des produits
├── categories.html    # Catégories
├── contact.html       # Contact
├── admin.html         # Panel admin
├── style.css          # Styles principaux
├── home-style.css     # Styles page d'accueil
├── admin.js           # Script admin
├── script.js          # Scripts généraux
├── api-connector.js   # Connexion API
├── icons.js           # Icônes SVG
└── wrangler.toml      # Config Cloudflare
```

## 🎨 Thème

Le site utilise un thème noir et blanc moderne avec :
- Design épuré et professionnel
- Navigation responsive
- Animations fluides
- Mode sombre par défaut

## 🔐 Admin

Mot de passe par défaut : `admin123`

Fonctionnalités :
- Gestion des produits
- Gestion des catégories
- Paramètres du site
- Statistiques

## 📱 Responsive

Le site est entièrement responsive et fonctionne sur :
- 📱 Mobile
- 📱 Tablette
- 💻 Desktop