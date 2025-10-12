# 🚀 Configuration Cloudflare Complète - Al Gran

## ✅ Ce qui a été fait

Votre boutique Al Gran a été **entièrement reconfigurée** pour fonctionner avec Cloudflare de manière dynamique. Toutes les pages chargent maintenant leurs données depuis l'API Cloudflare Workers + D1.

### 📋 Modifications effectuées

#### 1. **Configuration Cloudflare** ✅
- ✅ `.env` mis à jour avec vos credentials
- ✅ `wrangler.toml` configuré avec la base D1 et le bucket R2
- ✅ `schema.sql` enrichi avec tous les paramètres nécessaires
- ✅ Mot de passe admin changé en `votre_nouveau_mot_de_passe`

#### 2. **API Cloudflare Workers** ✅
- ✅ Endpoints existants pour produits, catégories, paramètres
- ✅ Support complet des paramètres dynamiques (liens sociaux, contenu accueil)
- ✅ Upload d'images vers R2
- ✅ CORS configuré

#### 3. **Pages Frontend Dynamiques** ✅
- ✅ **products.html** - Charge les produits depuis l'API
- ✅ **categories-dynamic.html** - Affiche les catégories depuis l'API
- ✅ **contact.html** - Liens sociaux dynamiques (WhatsApp, Telegram, Instagram, LinkTree)
- ✅ **home.html** - Contenu entièrement dynamique (textes, zones de livraison)

#### 4. **Panel Admin Amélioré** ✅
- ✅ Gestion complète des produits
- ✅ Gestion des catégories
- ✅ **NOUVEAU**: Section "Informations Générales"
- ✅ **NOUVEAU**: Section "Liens Sociaux et Contact" (WhatsApp, Telegram, Instagram, LinkTree)
- ✅ **NOUVEAU**: Section "Contenu de la Page d'Accueil"
- ✅ **NOUVEAU**: Section "Paramètres Avancés" (mode maintenance)

#### 5. **Fichier config.js centralisé** ✅
- ✅ Configuration API centralisée
- ✅ Helper functions pour les requêtes
- ✅ Système de cache intégré

---

## 🛠️ Déploiement - Étapes à suivre

### Prérequis

```bash
# 1. Installer Node.js et npm (si ce n'est pas déjà fait)
# Vérifier l'installation:
node --version
npm --version
```

### Étape 1: Authentification Cloudflare

```bash
# Se connecter à Cloudflare
npx wrangler login
```

Une fenêtre de navigateur s'ouvrira. Connectez-vous avec votre compte Cloudflare.

### Étape 2: Initialiser la base de données D1

```bash
# Vérifier que la base de données existe
npx wrangler d1 list

# Initialiser le schéma (créer toutes les tables)
npx wrangler d1 execute algran-db --file=schema.sql --remote
```

**Note**: Si vous voyez des erreurs "table already exists", c'est normal. Cela signifie que certaines tables existent déjà.

### Étape 3: Vérifier le bucket R2

```bash
# Vérifier que le bucket existe
npx wrangler r2 bucket list

# Si le bucket n'existe pas, le créer:
npx wrangler r2 bucket create boutique-images
```

### Étape 4: Déployer l'API Workers

```bash
# Déployer l'API en production
npm run deploy

# Ou directement:
npx wrangler deploy
```

Après le déploiement, vous recevrez une URL du type:
```
https://algran-api.VOTRE-SUBDOMAIN.workers.dev
```

**⚠️ IMPORTANT**: Notez cette URL !

### Étape 5: Mettre à jour les URLs de l'API

Vous devez mettre à jour l'URL de l'API dans **3 fichiers** :

#### 1. `config.js` (ligne 11)
```javascript
const API_CONFIG = {
    BASE_URL: 'https://algran-api.VOTRE-SUBDOMAIN.workers.dev',  // ⬅️ Remplacez ici
    // ...
};
```

#### 2. `admin.js` (ligne 7)
```javascript
const API_URL = 'https://algran-api.VOTRE-SUBDOMAIN.workers.dev';  // ⬅️ Remplacez ici
```

#### 3. `.env` (ligne 14)
```bash
API_URL=https://algran-api.VOTRE-SUBDOMAIN.workers.dev  # ⬅️ Remplacez ici
```

---

## 🎯 Utilisation du Panel Admin

### 1. Ouvrir le Panel Admin

Ouvrez simplement `admin.html` dans votre navigateur:
- En double-cliquant sur le fichier
- Ou via un serveur local: `python -m http.server 8000` puis `http://localhost:8000/admin.html`

### 2. Se connecter

**Mot de passe**: `votre_nouveau_mot_de_passe`

### 3. Gérer le contenu

#### Dashboard
- Visualisez les statistiques de votre boutique
- Nombre de produits, catégories, images

#### Gestion des Produits
- Ajoutez, modifiez, supprimez des produits
- Uploadez des images vers R2
- Associez des produits à des catégories

#### Gestion des Catégories
- Créez et modifiez les catégories
- Ajoutez des icônes emoji (🔥, 💎, ❄️, etc.)

#### Paramètres

##### Informations Générales
- Nom de la boutique
- Description
- Email et téléphone de contact

##### Liens Sociaux et Contact
- **WhatsApp**: Entrez votre numéro avec l'indicatif pays
  - Exemple: `33612345678` ou `+33612345678`
- **Telegram**: Entrez votre username ou canal
  - Exemple: `@votre_canal` ou `votre_canal`
- **Instagram**: Entrez votre username
  - Exemple: `@votre_compte` ou `votre_compte`
- **LinkTree**: URL complète
  - Exemple: `https://linktr.ee/votre_profil`

##### Contenu de la Page d'Accueil
- **Titre principal**: Ex: "AVEC AMOUR"
- **Texte de présentation**: Services offerts
- **Texte livraisons**: Informations sur les livraisons
- **Zones de livraison**: Départements séparés par des virgules
  - Exemple: `75,77,78,91,92,93,94,95`

##### Paramètres Avancés
- Mode maintenance (activer/désactiver le site)

---

## 📁 Structure des Fichiers

```
/workspace/
├── 📝 Configuration
│   ├── .env                          # Credentials Cloudflare
│   ├── wrangler.toml                 # Configuration Workers
│   ├── config.js                     # Config API centralisée
│   └── schema.sql                    # Schéma base de données
│
├── 🔌 API Backend
│   └── src/
│       └── index.js                  # API Cloudflare Workers
│
├── 🎨 Frontend Boutique (DYNAMIQUE)
│   ├── home.html                     # Page d'accueil (dynamique)
│   ├── products.html                 # Produits (depuis API)
│   ├── categories-dynamic.html       # Catégories (depuis API)
│   ├── contact.html                  # Contact (liens dynamiques)
│   ├── style.css                     # Styles principaux
│   └── script.js                     # Scripts généraux
│
├── 🎛️ Panel Admin
│   ├── admin.html                    # Interface admin
│   └── admin.js                      # Logique admin
│
├── 📚 Documentation
│   ├── README.md                     # Documentation principale
│   ├── CONFIGURATION_CLOUDFLARE.md   # Ce fichier
│   └── setup-cloudflare.sh           # Script d'installation automatique
│
└── 📦 Autres
    ├── package.json                  # Dépendances npm
    └── init-database.sh              # Script d'init DB
```

---

## 🔄 Workflow de Mise à Jour

### Ajouter un nouveau produit

1. Ouvrir `admin.html`
2. Aller dans "Gestion des Produits"
3. Cliquer sur "Ajouter un Produit"
4. Remplir le formulaire
5. Sauvegarder
6. ✅ Le produit apparaît automatiquement sur `products.html`

### Modifier les liens sociaux

1. Ouvrir `admin.html`
2. Aller dans "Paramètres" → "Liens Sociaux et Contact"
3. Modifier les champs (WhatsApp, Telegram, Instagram, LinkTree)
4. Cliquer sur "Sauvegarder"
5. ✅ Les liens sont mis à jour automatiquement sur `contact.html`

### Changer le contenu de la page d'accueil

1. Ouvrir `admin.html`
2. Aller dans "Paramètres" → "Contenu de la Page d'Accueil"
3. Modifier les textes et zones
4. Cliquer sur "Sauvegarder"
5. ✅ Le contenu est mis à jour automatiquement sur `home.html`

---

## 🧪 Tester l'API

### Test manuel avec curl

```bash
# URL de votre API
API_URL="https://algran-api.VOTRE-SUBDOMAIN.workers.dev"

# 1. Tester l'API (root)
curl $API_URL

# 2. Récupérer tous les produits
curl $API_URL/api/products

# 3. Récupérer toutes les catégories
curl $API_URL/api/categories

# 4. Récupérer les paramètres
curl $API_URL/api/settings

# 5. Récupérer les statistiques
curl $API_URL/api/stats
```

### Test dans le navigateur

Ouvrez simplement ces URLs dans votre navigateur:
- `https://algran-api.VOTRE-SUBDOMAIN.workers.dev`
- `https://algran-api.VOTRE-SUBDOMAIN.workers.dev/api/products`
- `https://algran-api.VOTRE-SUBDOMAIN.workers.dev/api/categories`

---

## 🐛 Dépannage

### Problème: "Failed to fetch" dans le frontend

**Cause**: L'URL de l'API n'est pas correcte ou l'API n'est pas déployée.

**Solution**:
1. Vérifiez que l'API est déployée: `npx wrangler deployments list`
2. Vérifiez l'URL dans `config.js` et `admin.js`
3. Testez l'API manuellement: `curl https://algran-api.VOTRE-SUBDOMAIN.workers.dev`

### Problème: "Database not found"

**Cause**: La base de données D1 n'existe pas ou n'est pas initialisée.

**Solution**:
```bash
# Vérifier les bases de données
npx wrangler d1 list

# Créer la base si nécessaire
npx wrangler d1 create algran-db

# Initialiser le schéma
npx wrangler d1 execute algran-db --file=schema.sql --remote
```

### Problème: Les images ne s'uploadent pas

**Cause**: Le bucket R2 n'existe pas ou n'est pas configuré.

**Solution**:
```bash
# Vérifier les buckets
npx wrangler r2 bucket list

# Créer le bucket si nécessaire
npx wrangler r2 bucket create boutique-images
```

### Problème: "Unauthorized" lors de la connexion admin

**Cause**: Le mot de passe a été changé mais pas dans le code.

**Solution**:
Vérifiez que le mot de passe dans `admin.js` (ligne 8) correspond à celui que vous utilisez.

---

## 📊 Credentials Cloudflare

Vos credentials sont dans le fichier `.env`:

```bash
# Cloudflare D1 Database
CLOUDFLARE_ACCOUNT_ID=7979421604bd07b3bd34d3ed96222512
CLOUDFLARE_DATABASE_ID=5ee52135-17f2-43ee-80a8-c20fcaee99d5

# Cloudflare R2 Storage
CLOUDFLARE_R2_BUCKET_NAME=boutique-images
CLOUDFLARE_R2_PUBLIC_URL=https://pub-b38679a01a274648827751df94818418.r2.dev
```

**⚠️ IMPORTANT**: Ne committez JAMAIS ce fichier sur GitHub !

---

## 🎉 Résultat Final

Une fois tout configuré, vous aurez:

1. ✅ Une **API Cloudflare Workers** hébergée gratuitement
2. ✅ Une **base de données D1** avec tous vos produits et paramètres
3. ✅ Un **stockage R2** pour vos images
4. ✅ Un **panel admin** complet pour gérer tout le contenu
5. ✅ Un **site web dynamique** qui se met à jour automatiquement
6. ✅ Des **pages de contact** avec liens sociaux dynamiques
7. ✅ Une **page d'accueil personnalisable** depuis l'admin

**Tout est maintenant géré via l'admin, sans toucher au code !** 🚀

---

## 📞 Commandes Utiles

```bash
# Déployer l'API
npm run deploy

# Voir les logs en temps réel
npm run tail

# Exécuter une requête SQL
npx wrangler d1 execute algran-db --command="SELECT * FROM products" --remote

# Lister les déploiements
npx wrangler deployments list

# Rollback vers un déploiement précédent
npx wrangler rollback [deployment-id]
```

---

**Made with ❤️ for Al Gran**

🚀 **Votre boutique Cloudflare est prête !**
