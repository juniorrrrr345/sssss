# Guide de Migration - Al Gran API

## Vue d'ensemble

Ce guide explique comment migrer votre base de données existante vers le nouveau schéma qui supporte :
- ✅ Plusieurs images par produit (image1 à image5)
- ✅ Support vidéo
- ✅ Plusieurs prix par produit
- ✅ Champ "farm" pour les produits
- ✅ Liens de contact dynamiques

## Nouveautés de l'API

### Nouveaux Endpoints

```
GET  /api/products/category/:category  - Récupère les produits d'une catégorie
GET  /api/links                        - Récupère les liens de contact
GET  /api/farms                        - Liste toutes les farms
```

### Format de Réponse Mis à Jour

**Produit :**
```json
{
  "_id": 1,
  "name": "100K ROSIN",
  "description": "Extrait premium",
  "category": "Extract",
  "farm": "100K",
  "image1": "url1",
  "image2": "url2",
  "image3": "url3",
  "image4": null,
  "image5": null,
  "video": "url_video",
  "createdAt": "2024-01-01",
  "prices": [
    { "_id": 1, "gram": "2g", "price": 200 },
    { "_id": 2, "gram": "5g", "price": 450 }
  ]
}
```

## Étapes de Migration

### 1. Sauvegarder vos données existantes

```bash
# Exporter les produits existants
wrangler d1 execute algran-db --command="SELECT * FROM products;" > backup-products.sql

# Exporter les catégories
wrangler d1 execute algran-db --command="SELECT * FROM categories;" > backup-categories.sql
```

### 2. Appliquer le nouveau schéma

```bash
# Créer les nouvelles tables
wrangler d1 execute algran-db --file=schema-updated.sql
```

### 3. Initialiser avec des données d'exemple

```bash
# Exécuter le script d'initialisation
./init-database-updated.sh
```

**Ou manuellement :**

```bash
# Créer les tables
wrangler d1 execute algran-db --file=schema-updated.sql

# Vérifier la création
wrangler d1 execute algran-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

### 4. Configurer les liens de contact

```bash
wrangler d1 execute algran-db --command="
INSERT OR REPLACE INTO settings (key, value, description) VALUES
  ('contact_whatsapp', 'https://wa.me/33600000000', 'Lien WhatsApp'),
  ('lien_canal', 'https://t.me/algran', 'Canal Telegram'),
  ('lien_instagram', 'https://instagram.com/algran', 'Instagram'),
  ('link_trees', 'https://linktr.ee/algran', 'LinkTree');
"
```

## Fichiers Modifiés

### Frontend
- ✅ `products.html` - Récupère les produits depuis l'API
- ✅ `categories.html` - Affiche les catégories dynamiquement
- ✅ `contact.html` - Charge les liens depuis l'API
- ✅ `category-products.html` - **NOUVEAU** - Affiche les produits par catégorie

### Scripts JavaScript
- ✅ `api-client.js` - **NOUVEAU** - Client API centralisé
- ✅ `products-script.js` - **NOUVEAU** - Logique des produits
- ✅ `categories-script.js` - **NOUVEAU** - Logique des catégories
- ✅ `contact-script.js` - **NOUVEAU** - Logique du contact

### Backend
- ✅ `src/index.js` - Nouveaux endpoints ajoutés
- ✅ `schema-updated.sql` - **NOUVEAU** - Schéma mis à jour

## Structure de la Base de Données

### Nouvelles Tables

**products** (modifiée)
```sql
- image1, image2, image3, image4, image5 TEXT
- video TEXT
- farm TEXT
- badge TEXT
```

**product_prices** (nouvelle)
```sql
- id INTEGER PRIMARY KEY
- product_id INTEGER
- gram TEXT
- price REAL
```

## Tester l'API

### 1. Démarrer le serveur local

```bash
wrangler dev
```

### 2. Tester les endpoints

```bash
# Tous les produits
curl http://localhost:8787/api/products

# Produits par catégorie
curl http://localhost:8787/api/products/category/Extract

# Liens de contact
curl http://localhost:8787/api/links

# Catégories
curl http://localhost:8787/api/categories
```

## Configuration de l'Environnement Local

### 1. Variables d'environnement

Le fichier `api-client.js` détecte automatiquement l'environnement :
- **Local** : `http://localhost:8787`
- **Production** : Utilise l'URL actuelle

### 2. CORS

L'API est configurée pour accepter les requêtes de toutes les origines pendant le développement.

## Déploiement

### 1. Déployer l'API

```bash
# Déployer sur Cloudflare Workers
wrangler deploy
```

### 2. Mettre à jour la base de données en production

```bash
# Utiliser l'environnement de production
wrangler d1 execute algran-db --env production --file=schema-updated.sql
```

### 3. Déployer le frontend

Uploadez tous les fichiers HTML et JS vers votre hébergement :
- `*.html`
- `*.js`
- `*.css`
- `images/`

## Dépannage

### Problème : L'API ne retourne pas de données

**Solution :**
```bash
# Vérifier les données dans la base
wrangler d1 execute algran-db --command="SELECT COUNT(*) FROM products;"

# Vérifier les logs
wrangler tail
```

### Problème : CORS Error

**Solution :** Vérifiez que l'API est bien déployée et accessible. Les headers CORS sont déjà configurés dans `src/index.js`.

### Problème : Images ne se chargent pas

**Solution :** Vérifiez que les URLs des images sont valides. Le placeholder `images/product-placeholder.jpg` est utilisé en cas d'erreur.

## Prochaines Étapes

1. ✅ Ajouter vos vrais produits via l'admin panel
2. ✅ Configurer les vrais liens de contact
3. ✅ Uploader vos images vers R2
4. ✅ Personnaliser les styles
5. ✅ Tester sur mobile

## Support

Pour toute question ou problème, consultez :
- [Documentation Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Documentation Wrangler](https://developers.cloudflare.com/workers/wrangler/)

---

**Dernière mise à jour :** 2024-01-12
**Version :** 2.0.0
