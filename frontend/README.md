# Boutique Al Gran - Frontend React

Frontend moderne pour la boutique en ligne Al Gran.

## 📦 Fonctionnalités

- **Gestion des produits** : Affichage, création, modification, suppression
- **Produits en vedette** : Système de mise en avant des produits
- **Catégories** : Filtrage par catégories
- **Icônes Lucide** : Collection d'icônes modernes (Package, Play, Star, Tag, X)
- **State Management** : Zustand pour la gestion d'état
- **API Client** : Axios configuré pour les appels API

## 🚀 Installation

```bash
cd frontend
npm install
```

## 💻 Développement

```bash
npm start
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🏗️ Build de production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `build/`

## 📁 Structure du projet

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── icons/          # Icônes Lucide React
│   ├── lib/
│   │   ├── axios.js        # Client API
│   │   ├── lucide.js       # Utilitaire pour les icônes
│   │   └── toast.js        # Système de notifications
│   ├── stores/
│   │   ├── useLinksStore.js    # Store Zustand pour les liens
│   │   └── useProductStore.js  # Store Zustand pour les produits
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🔧 Configuration

Créez un fichier `.env` à la racine du dossier frontend :

```
REACT_APP_API_URL=http://localhost:8787/api
```

## 📚 Stores Zustand

### useProductStore

- `fetchAllProducts()` : Récupère tous les produits
- `fetchProductsByCategory(category)` : Filtre par catégorie
- `fetchFeaturedProducts()` : Récupère les produits en vedette
- `createProduct(data)` : Crée un nouveau produit
- `editProduct(id, data)` : Modifie un produit
- `deleteProduct(id)` : Supprime un produit
- `toggleFeaturedProduct(id)` : Bascule l'état "featured"

### useLinksStore

- `fetchLinks()` : Récupère tous les liens

## 🎨 Icônes disponibles

- Package
- Play
- Star
- Tag
- X

## 📄 Licence

ISC
