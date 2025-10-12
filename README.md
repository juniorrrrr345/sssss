# Boutique "Avec Amour" - Site E-commerce avec Cloudflare

Site e-commerce complet avec panel d'administration, utilisant Cloudflare Workers, D1 (base de données) et R2 (stockage).

## 🚀 Installation et Déploiement

### 1. Prérequis
- Compte Cloudflare
- Wrangler CLI installé : `npm install -g wrangler`

### 2. Configuration de la base de données D1

```bash
# Créer la base de données
wrangler d1 create boutique-db

# Noter l'ID de la base de données et le mettre à jour dans wrangler.toml
# Remplacer YOUR_DATABASE_ID par l'ID obtenu

# Initialiser le schéma
wrangler d1 execute boutique-db --local --file=./schema.sql
wrangler d1 execute boutique-db --remote --file=./schema.sql
```

### 3. Configuration du bucket R2

```bash
# Créer le bucket R2
wrangler r2 bucket create boutique-images

# Activer l'accès public au bucket dans le dashboard Cloudflare
# Noter l'URL publique (https://pub-xxxx.r2.dev)
```

### 4. Variables d'environnement

Dans le dashboard Cloudflare, configurer ces variables :

- `ADMIN_PASSWORD` : Mot de passe pour accéder au panel admin
- `CLOUDFLARE_R2_PUBLIC_URL` : URL publique du bucket R2

### 5. Déploiement

```bash
# Déployer le site
wrangler pages deploy public

# Ou pour le développement local
wrangler pages dev public
```

## 📱 Utilisation

### Site public
- Page d'accueil : Liste tous les produits
- Recherche et filtres par catégorie
- Page de détail produit
- Bouton "Commander" configurable

### Panel Admin (/admin.html)
- Gestion des produits (CRUD complet)
- Gestion des catégories et farms
- Configuration des réseaux sociaux
- Paramètres du site :
  - Nom de la boutique
  - Image de fond
  - URL de commande

## 🎨 Personnalisation

Tout est personnalisable depuis le panel admin :
- Nom de la boutique
- Image de fond
- Produits et prix
- Catégories et farms
- Liens réseaux sociaux
- URL de commande (WhatsApp, formulaire, etc.)

## 🔒 Sécurité

- Panel admin protégé par mot de passe
- Authentification via header Authorization
- Pas de clés API dans le code source

## 📝 Structure du projet

```
/public           # Fichiers frontend
  ├── index.html  # Page boutique
  ├── product.html # Page produit
  ├── admin.html  # Panel admin
  ├── style.css   # Styles
  └── js/         # Scripts JS
/functions        # Worker Cloudflare
  └── api/
      └── [[route]].js # Routes API
/schema.sql       # Schéma base de données
/wrangler.toml    # Configuration Cloudflare
```