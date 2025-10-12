# 🚀 Intégration API - Al Gran

## 📋 Résumé des Modifications

Votre projet a été mis à jour pour récupérer et afficher les données depuis l'API Cloudflare Workers au lieu d'utiliser des données statiques.

## ✨ Nouvelles Fonctionnalités

### Frontend

#### 1. **Page Produits** (`products.html`)
- ✅ Récupération dynamique des produits depuis `/api/products`
- ✅ Filtres par catégorie et farm
- ✅ Recherche en temps réel
- ✅ Modal de détails produit avec carrousel d'images/vidéos
- ✅ Support multi-prix
- ✅ Design responsive (grille 2-5 colonnes)

#### 2. **Page Catégories** (`categories.html`)
- ✅ Chargement dynamique depuis `/api/categories`
- ✅ Affichage du nombre de produits par catégorie
- ✅ Navigation vers les produits de la catégorie

#### 3. **Page Produits par Catégorie** (`category-products.html`)
- ✅ **NOUVELLE PAGE** pour afficher les produits d'une catégorie spécifique
- ✅ Utilise `/api/products/category/:category`
- ✅ Bouton retour vers les catégories

#### 4. **Page Contact** (`contact.html`)
- ✅ Liens récupérés depuis `/api/links`
- ✅ Support WhatsApp, Telegram, Instagram, LinkTree
- ✅ Gestion des liens non disponibles

### Backend

#### Nouveaux Endpoints API

```javascript
GET  /api/products                      // Liste tous les produits
GET  /api/products/:id                  // Un produit spécifique
GET  /api/products/category/:category   // Produits d'une catégorie
GET  /api/categories                    // Liste des catégories
GET  /api/links                         // Liens de contact
GET  /api/farms                         // Liste des farms
```

#### Structure de Données Mise à Jour

**Produit :**
```javascript
{
  _id: 1,
  name: "100K ROSIN",
  description: "...",
  category: "Extract",
  farm: "100K",
  image1: "url1",  // Jusqu'à image5
  video: "url_video",
  createdAt: "2024-01-01",
  prices: [
    { _id: 1, gram: "2g", price: 200 },
    { _id: 2, gram: "5g", price: 450 }
  ]
}
```

## 📁 Nouveaux Fichiers

### Scripts JavaScript
```
api-client.js          - Client API centralisé
products-script.js     - Logique de la page produits
categories-script.js   - Logique de la page catégories
contact-script.js      - Logique de la page contact
```

### Pages HTML
```
category-products.html - Page produits par catégorie
```

### Base de Données
```
schema-updated.sql          - Nouveau schéma avec support multi-images/vidéos/prix
init-database-updated.sh    - Script d'initialisation avec données d'exemple
```

### Documentation
```
MIGRATION_GUIDE.md     - Guide de migration détaillé
README_INTEGRATION.md  - Ce fichier (résumé de l'intégration)
```

## 🚀 Démarrage Rapide

### 1. Mettre à jour la base de données

```bash
# Option A : Utiliser le script automatique
./init-database-updated.sh

# Option B : Manuellement
wrangler d1 execute algran-db --file=schema-updated.sql
```

### 2. Démarrer le serveur de développement

```bash
wrangler dev
```

### 3. Ouvrir dans le navigateur

```
http://localhost:8787/products.html
```

## 🎨 Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│  (HTML + JavaScript Vanilla)                    │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ products.html │  │categories.html│            │
│  └──────┬───────┘  └──────┬───────┘            │
│         │                  │                     │
│         └──────┬───────────┘                     │
│                │                                 │
│         ┌──────▼──────────┐                     │
│         │  api-client.js  │                     │
│         └──────┬──────────┘                     │
└────────────────┼────────────────────────────────┘
                 │ HTTP/HTTPS
                 │
┌────────────────▼────────────────────────────────┐
│            Cloudflare Workers                    │
│              (src/index.js)                      │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │  Routes:                                  │  │
│  │  - /api/products                          │  │
│  │  - /api/products/:id                      │  │
│  │  - /api/products/category/:category       │  │
│  │  - /api/categories                        │  │
│  │  - /api/links                             │  │
│  │  - /api/farms                             │  │
│  └──────────────┬───────────────────────────┘  │
└─────────────────┼──────────────────────────────┘
                  │
┌─────────────────▼──────────────────────────────┐
│         Cloudflare D1 Database                  │
│                                                  │
│  Tables:                                        │
│  - products (avec image1-5, video, farm)       │
│  - product_prices (nouveau)                    │
│  - categories                                   │
│  - settings (avec liens de contact)            │
└─────────────────────────────────────────────────┘
```

## 🔧 Configuration

### 1. API Base URL

Le fichier `api-client.js` détecte automatiquement l'environnement :

```javascript
const API_CONFIG = {
    baseURL: window.location.origin.includes('localhost')
        ? 'http://localhost:8787'     // Dev
        : window.location.origin       // Prod
};
```

### 2. Liens de Contact

Configurez vos liens via la base de données :

```bash
wrangler d1 execute algran-db --command="
INSERT OR REPLACE INTO settings (key, value) VALUES
  ('contact_whatsapp', 'https://wa.me/VOTRE_NUMERO'),
  ('lien_canal', 'https://t.me/VOTRE_CANAL'),
  ('lien_instagram', 'https://instagram.com/VOTRE_COMPTE'),
  ('link_trees', 'https://linktr.ee/VOTRE_COMPTE');
"
```

## 🎯 Fonctionnalités Clés

### Modal Produit
- ✅ Carrousel d'images avec miniatures
- ✅ Support vidéo intégré
- ✅ Liste de prix triée
- ✅ Bouton WhatsApp dynamique
- ✅ Zoom sur les images

### Filtres
- ✅ Recherche textuelle (nom, catégorie, farm)
- ✅ Filtre par catégorie
- ✅ Filtre par farm
- ✅ Bouton reset des filtres

### Performance
- ✅ Chargement progressif avec loader
- ✅ Gestion des erreurs
- ✅ Images avec fallback
- ✅ Requêtes optimisées

## 📱 Responsive Design

Le design s'adapte automatiquement :

```css
Mobile (< 640px):    2 colonnes
Tablet (640-768px):  3 colonnes  
Desktop (768-1024px): 4 colonnes
Large (> 1024px):    5 colonnes
```

## 🐛 Débogage

### Afficher les requêtes API

Ouvrez la console du navigateur (F12) pour voir :
- Les requêtes API
- Les erreurs éventuelles
- Les données reçues

### Tester l'API directement

```bash
# Tous les produits
curl http://localhost:8787/api/products | jq

# Une catégorie
curl http://localhost:8787/api/products/category/Extract | jq

# Les liens
curl http://localhost:8787/api/links | jq
```

### Logs en temps réel

```bash
wrangler tail
```

## 🚀 Déploiement

### 1. Déployer l'API

```bash
wrangler deploy
```

### 2. Mettre à jour la DB en production

```bash
wrangler d1 execute algran-db --env production --file=schema-updated.sql
```

### 3. Déployer le frontend

Uploadez tous les fichiers vers votre hébergement :
```
products.html
categories.html
category-products.html
contact.html
api-client.js
products-script.js
categories-script.js
contact-script.js
style.css
images/
```

## ⚠️ Important

### Données d'Exemple

Le script `init-database-updated.sh` insère des données d'exemple. **Supprimez-les avant la production !**

```bash
wrangler d1 execute algran-db --command="DELETE FROM products; DELETE FROM product_prices;"
```

### Images

Les URLs d'images d'exemple utilisent Unsplash. Remplacez-les par vos vraies images uploadées sur R2.

### Sécurité

L'API est actuellement publique (CORS `*`). En production, restreignez l'accès :

```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://votre-domaine.com',
  // ...
};
```

## 📚 Documentation Complète

- **Guide de Migration** : `MIGRATION_GUIDE.md`
- **Guide d'Installation** : `GUIDE_INSTALLATION.md`
- **Démarrage Rapide** : `DEMARRAGE_RAPIDE.md`

## ✅ Checklist de Mise en Production

- [ ] Remplacer les données d'exemple par vos vrais produits
- [ ] Configurer les vrais liens de contact
- [ ] Uploader vos images vers Cloudflare R2
- [ ] Mettre à jour les URLs des images dans la DB
- [ ] Restreindre les CORS en production
- [ ] Tester sur mobile et desktop
- [ ] Vérifier les performances
- [ ] Configurer un nom de domaine custom
- [ ] Activer HTTPS

## 🎉 Résultat

Vous avez maintenant :
- ✅ Une API REST complète
- ✅ Un frontend dynamique connecté à l'API
- ✅ Support multi-images et vidéos
- ✅ Système de prix flexible
- ✅ Filtres et recherche avancés
- ✅ Design moderne et responsive

---

**Branche :** `cursor/fetch-and-display-product-data-bad2`
**Date :** 2025-10-12
**Version :** 2.0.0
