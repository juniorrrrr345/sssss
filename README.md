# 🛍️ Panel Admin Al Gran

Système complet de gestion de boutique en ligne avec **Cloudflare D1** (base de données) et **R2** (stockage images).

![Status](https://img.shields.io/badge/status-ready-success)
![Cloudflare](https://img.shields.io/badge/cloudflare-workers-orange)
![D1](https://img.shields.io/badge/database-D1-blue)
![R2](https://img.shields.io/badge/storage-R2-blue)

## ✨ Fonctionnalités

### 🎛️ Panel Admin Complet
- ✅ **Dashboard** avec statistiques en temps réel
- ✅ **Gestion des produits** (CRUD complet)
- ✅ **Gestion des catégories**
- ✅ **Upload d'images** vers Cloudflare R2
- ✅ **Paramètres** de la boutique
- ✅ Interface moderne et responsive

### 🏪 Boutique Frontend
- ✅ Page d'accueil
- ✅ Page produits avec recherche
- ✅ Page catégories
- ✅ Page contact
- ✅ Design spatial/cosmique moderne
- ✅ Navigation mobile fluide

### 🗄️ Base de données D1
- ✅ 6 tables complètes
- ✅ Relations et contraintes
- ✅ Triggers automatiques
- ✅ Index optimisés
- ✅ Données de démarrage

### 🔌 API REST Complète
- ✅ Produits (GET, POST, PUT, DELETE)
- ✅ Catégories (GET, POST, PUT)
- ✅ Paramètres (GET, PUT)
- ✅ Statistiques (GET)
- ✅ Upload images R2 (POST)
- ✅ CORS configuré

## 🚀 Installation Rapide

### 1️⃣ Installer les dépendances

```bash
npm install -g wrangler
```

### 2️⃣ Authentification Cloudflare

```bash
wrangler login
```

### 3️⃣ Initialiser la base de données

```bash
chmod +x init-database.sh
./init-database.sh
```

### 4️⃣ Déployer l'API

```bash
npm run deploy
```

### 5️⃣ Configurer l'URL API

Ouvrez `admin.js` ligne 7 et remplacez par votre URL Workers :

```javascript
const API_URL = 'https://algran-api.VOTRE-SUBDOMAIN.workers.dev';
```

### 6️⃣ Lancer le panel admin

```bash
# Option simple : double-cliquez sur admin.html

# Option serveur local :
python -m http.server 8000
# Puis : http://localhost:8000/admin.html
```

## 🔐 Connexion Admin

- **URL** : `admin.html`
- **Mot de passe par défaut** : `admin123`
- ⚠️ **Changez-le immédiatement après la première connexion !**

## 📁 Structure du Projet

```
/workspace/
│
├── 🎨 Frontend Boutique
│   ├── index.html                  # Page d'accueil
│   ├── products-complete.html      # Page produits complète
│   ├── categories-fixed.html       # Page catégories corrigée
│   ├── contact.html                # Page contact
│   ├── style.css                   # Styles principaux
│   └── script.js                   # JavaScript frontend
│
├── 🎛️ Panel Admin
│   ├── admin.html                  # Interface admin
│   └── admin.js                    # Logique admin
│
├── 🔌 API Cloudflare Workers
│   ├── src/
│   │   └── index.js               # API REST complète
│   └── wrangler.toml              # Configuration Workers
│
├── 🗄️ Base de données
│   └── schema.sql                  # Schéma D1 complet
│
├── 📦 Configuration
│   ├── package.json                # NPM config
│   ├── .env.example                # Variables d'environnement
│   └── init-database.sh            # Script d'init
│
└── 📚 Documentation
    ├── README.md                   # Ce fichier
    └── GUIDE_INSTALLATION.md       # Guide détaillé
```

## 📊 Base de Données

### Tables

1. **categories** - Catégories de produits
2. **products** - Produits avec détails complets
3. **settings** - Paramètres de la boutique
4. **images** - Historique uploads R2
5. **orders** - Commandes clients
6. **order_items** - Détails commandes

### Catégories par défaut

- 🔥 Extract
- 💎 Static-Sift
- ❄️ Frozen-Sift
- 🌿 Dry-Sift
- 🍃 Weed

## 🔌 Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/products` | Liste tous les produits |
| GET | `/api/products/:id` | Détails produit |
| POST | `/api/products` | Créer un produit |
| PUT | `/api/products/:id` | Modifier un produit |
| DELETE | `/api/products/:id` | Supprimer un produit |
| GET | `/api/categories` | Liste catégories |
| POST | `/api/categories` | Créer une catégorie |
| PUT | `/api/categories/:id` | Modifier une catégorie |
| GET | `/api/settings` | Récupérer paramètres |
| PUT | `/api/settings` | Mettre à jour paramètres |
| GET | `/api/stats` | Statistiques |
| POST | `/api/upload` | Upload image R2 |

## 🎨 Captures d'écran

### Panel Admin
- Dashboard avec statistiques
- Gestion produits avec tableau
- Modal d'ajout/édition produit
- Gestion catégories

### Boutique
- Page d'accueil moderne
- Grille de produits responsive
- Recherche en temps réel
- Navigation mobile

## 🔧 Commandes Utiles

```bash
# Développement local
npm run dev

# Déployer en production
npm run deploy

# Voir les logs
npm run tail

# Initialiser la DB
npm run init-db

# Requête SQL directe
wrangler d1 execute algran-db --command="SELECT * FROM products" --remote
```

## 🛠️ Technologies

- **Frontend** : HTML5, CSS3, JavaScript Vanilla
- **Backend** : Cloudflare Workers
- **Database** : Cloudflare D1 (SQLite)
- **Storage** : Cloudflare R2
- **Deploy** : Wrangler CLI

## 📝 Credentials Cloudflare

Vos credentials sont dans `.env.example` :
- Account ID : `7979421604bd07b3bd34d3ed96222512`
- Database ID : `5ee52135-17f2-43ee-80a8-c20fcaee99d5`
- R2 Bucket : `boutique-images`
- R2 Public URL : `https://pub-b38679a01a274648827751df94818418.r2.dev`

## 🔒 Sécurité

⚠️ **Important** :
1. Changez le mot de passe admin par défaut
2. Ne committez jamais `.env` avec vos vraies credentials
3. Ajoutez `.env` à `.gitignore`
4. Utilisez Cloudflare Access pour plus de sécurité

## 📚 Documentation Complète

Consultez `GUIDE_INSTALLATION.md` pour :
- Installation détaillée pas à pas
- Configuration avancée
- Dépannage
- Exemples d'utilisation API
- Déploiement en production

## 🐛 Dépannage

### Base de données ne se connecte pas
```bash
wrangler d1 list
```

### API ne répond pas
```bash
wrangler tail
```

### Images ne s'uploadent pas
Vérifiez que R2 est bien configuré dans `wrangler.toml`

## 🎯 Prochaines étapes

Pour démarrer :
1. ✅ Installez Wrangler : `npm install -g wrangler`
2. ✅ Authentifiez-vous : `wrangler login`
3. ✅ Initialisez la DB : `./init-database.sh`
4. ✅ Déployez l'API : `npm run deploy`
5. ✅ Ouvrez `admin.html` et connectez-vous !

## 💡 Fonctionnalités futures

- [ ] Gestion des commandes
- [ ] Système de paiement
- [ ] Email notifications
- [ ] Export données
- [ ] Multi-utilisateurs
- [ ] Statistiques avancées
- [ ] Mode maintenance

## 📞 Support

Pour toute question :
- Consultez la documentation Cloudflare
- Vérifiez les logs avec `wrangler tail`
- Testez l'API avec Postman/Insomnia

---

**Made with ❤️ for Al Gran**

🚀 **Votre boutique est prête à décoller !**
