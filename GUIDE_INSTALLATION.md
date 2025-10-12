# 📚 Guide d'Installation - Panel Admin Al Gran

Système complet de gestion de boutique avec Cloudflare D1 (base de données) et R2 (stockage images).

## 🎯 Prérequis

- [Node.js](https://nodejs.org/) (v16 ou supérieur)
- Compte [Cloudflare](https://cloudflare.com/)
- Accès à Cloudflare D1 et R2

## 📦 Installation

### 1. Installer Wrangler (CLI Cloudflare)

```bash
npm install -g wrangler
```

### 2. S'authentifier avec Cloudflare

```bash
wrangler login
```

Cela ouvrira votre navigateur pour vous connecter à Cloudflare.

### 3. Vérifier la base de données D1

Votre base de données existe déjà :
- **Database ID**: `5ee52135-17f2-43ee-80a8-c20fcaee99d5`
- **Account ID**: `7979421604bd07b3bd34d3ed96222512`

### 4. Initialiser les tables

```bash
chmod +x init-database.sh
./init-database.sh
```

Ou manuellement :

```bash
wrangler d1 execute algran-db --file=schema.sql --remote
```

### 5. Déployer l'API Cloudflare Workers

```bash
npm run deploy
```

Cette commande va :
- Déployer votre API sur Cloudflare Workers
- Connecter automatiquement D1 et R2
- Vous donner une URL du type : `https://algran-api.VOTRE-SUBDOMAIN.workers.dev`

### 6. Configurer l'URL de l'API

Ouvrez `admin.js` et modifiez la ligne 7 :

```javascript
const API_URL = 'https://algran-api.VOTRE-SUBDOMAIN.workers.dev';
```

Remplacez par l'URL fournie après le déploiement.

### 7. Tester le panel admin

Ouvrez `admin.html` dans votre navigateur :

```bash
# Option 1: Double-cliquez sur admin.html

# Option 2: Utilisez un serveur local
python -m http.server 8000
# Puis ouvrez: http://localhost:8000/admin.html

# Option 3: Avec Node.js
npx http-server
```

## 🔐 Connexion

- **Mot de passe par défaut**: `admin123`
- ⚠️ **Changez-le immédiatement après la première connexion !**

## 📁 Structure du projet

```
/workspace/
├── admin.html              # Interface du panel admin
├── admin.js                # Logique frontend
├── schema.sql              # Schéma de base de données
├── wrangler.toml          # Configuration Cloudflare
├── src/
│   └── index.js           # API Cloudflare Workers
├── init-database.sh       # Script d'initialisation
├── package.json           # Configuration npm
└── GUIDE_INSTALLATION.md  # Ce fichier
```

## 🗄️ Schéma de base de données

### Tables créées :

1. **categories** - Gestion des catégories
   - id, name, slug, description, icon, image_url, product_count, is_active

2. **products** - Gestion des produits
   - id, name, slug, description, category_id, price, unit, badge, image_url, stock_quantity, is_active, is_featured, views_count

3. **settings** - Paramètres de la boutique
   - id, key, value, description

4. **images** - Historique des uploads R2
   - id, filename, url, size, mime_type, entity_type, entity_id

5. **orders** - Commandes (pour le futur)
   - id, order_number, customer_name, total_amount, status

6. **order_items** - Détails des commandes
   - id, order_id, product_id, quantity, unit_price

### Catégories par défaut :

- Extract 🔥
- Static-Sift 💎
- Frozen-Sift ❄️
- Dry-Sift 🌿
- Weed 🍃

## 🔧 Fonctionnalités du Panel Admin

### ✅ Gestion des Produits
- ➕ Ajouter des produits
- ✏️ Modifier des produits
- 🗑️ Supprimer des produits
- 📊 Voir les statistiques

### ✅ Gestion des Catégories
- 📋 Voir toutes les catégories
- ✏️ Modifier les catégories
- 📊 Compteur de produits par catégorie

### ✅ Paramètres
- ⚙️ Nom de la boutique
- 📧 Email de contact
- 📱 WhatsApp, Telegram, Instagram

### ✅ Statistiques
- 📦 Total produits
- ✓ Produits actifs
- 📂 Total catégories
- 🖼️ Images uploadées

## 📡 API Endpoints

### Produits
- `GET /api/products` - Liste tous les produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit

### Catégories
- `GET /api/categories` - Liste toutes les catégories
- `POST /api/categories` - Créer une catégorie
- `PUT /api/categories/:id` - Modifier une catégorie

### Paramètres
- `GET /api/settings` - Récupérer les paramètres
- `PUT /api/settings` - Mettre à jour les paramètres

### Statistiques
- `GET /api/stats` - Statistiques globales

### Upload
- `POST /api/upload` - Upload image vers R2

## 🖼️ Upload d'images vers R2

Les images sont automatiquement uploadées vers Cloudflare R2 et accessibles via :

```
https://pub-b38679a01a274648827751df94818418.r2.dev/FILENAME
```

## 🔒 Sécurité

### ⚠️ Important :

1. **Changez le mot de passe admin** immédiatement
2. Modifiez `ADMIN_PASSWORD` dans `wrangler.toml`
3. Ne commitez JAMAIS vos tokens dans Git
4. Utilisez `.env` pour les secrets en local
5. Activez l'authentification Cloudflare Access si possible

## 🐛 Dépannage

### Erreur : "Database not found"
```bash
wrangler d1 list
# Vérifiez que votre database existe
```

### Erreur : "Not authenticated"
```bash
wrangler login
# Reconnectez-vous
```

### Les changements ne s'appliquent pas
```bash
# Effacez le cache du navigateur ou utilisez Ctrl+F5
```

### API ne répond pas
```bash
# Vérifiez les logs
wrangler tail
```

## 📝 Commandes utiles

```bash
# Développement local
npm run dev

# Déployer en production
npm run deploy

# Voir les logs en temps réel
npm run tail

# Exécuter une requête SQL
wrangler d1 execute algran-db --command="SELECT * FROM products" --remote

# Lister les buckets R2
wrangler r2 bucket list
```

## 🚀 Déploiement en production

1. Déployez l'API :
   ```bash
   npm run deploy
   ```

2. Uploadez `admin.html` et `admin.js` sur :
   - Cloudflare Pages
   - Vercel
   - Netlify
   - Ou n'importe quel hébergeur

3. Mettez à jour l'URL de l'API dans `admin.js`

## 📞 Support

En cas de problème :
1. Vérifiez les logs : `wrangler tail`
2. Consultez la doc Cloudflare : https://developers.cloudflare.com/
3. Vérifiez que toutes les ressources sont dans le bon account

## 🎉 C'est tout !

Votre panel admin est maintenant opérationnel !

Accédez à `admin.html` et commencez à gérer votre boutique. 🛍️
