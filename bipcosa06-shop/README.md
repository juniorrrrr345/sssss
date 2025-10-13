# BipCosa06 Shop

Un site e-commerce moderne avec interface d'administration, conçu pour être simple et élégant.

## 🚀 Caractéristiques

- **Interface utilisateur moderne** : Design noir et blanc épuré avec animations subtiles
- **Panneau d'administration complet** : Gérez produits, catégories, farms et paramètres
- **Responsive** : Fonctionne parfaitement sur mobile, tablette et desktop
- **Persistance des données** : Utilise localStorage ou une API backend
- **Personnalisable** : Changez facilement le nom, les couleurs et le fond

## 📁 Structure du projet

```
bipcosa06-shop/
├── public/                  # Frontend client
│   ├── index.html          # Page d'accueil
│   ├── products.html       # Liste des produits
│   ├── product-detail.html # Détail d'un produit
│   ├── categories.html     # Liste des catégories
│   ├── contact.html        # Page de contact
│   ├── css/               # Styles CSS
│   │   ├── style.css
│   │   ├── home-style.css
│   │   └── black-white-override.css
│   └── js/                # Scripts JavaScript
│       ├── config.js
│       └── theme-loader.js
├── admin/                  # Interface d'administration
│   ├── index.html
│   ├── admin.js
│   └── admin-style.css
├── api/                    # Backend API (optionnel)
│   ├── server.js
│   └── package.json
└── README.md
```

## 🛠️ Installation

### Option 1 : Utilisation simple (sans serveur)

1. Téléchargez ou clonez le projet
2. Ouvrez `public/index.html` dans votre navigateur
3. Pour accéder à l'admin, ouvrez `admin/index.html`
4. Mot de passe admin par défaut : `admin123`

### Option 2 : Avec serveur API

1. Installez Node.js (version 14 ou supérieure)
2. Naviguez vers le dossier API :
   ```bash
   cd bipcosa06-shop/api
   npm install
   ```
3. Démarrez le serveur :
   ```bash
   npm start
   ```
4. Ouvrez votre navigateur sur `http://localhost:3000`

## 🔧 Configuration

### Changer le mot de passe admin

Éditez `admin/admin.js` et modifiez la ligne :
```javascript
const ADMIN_PASSWORD = "admin123"; // Changez cette valeur
```

### Personnaliser l'API

Éditez `public/js/config.js` pour pointer vers votre serveur :
```javascript
const API_CONFIG = {
    BASE_URL: 'https://votre-api.com'
    // ...
};
```

### Changer le thème

1. Connectez-vous au panneau admin
2. Allez dans "Paramètres"
3. Ajoutez l'URL d'une image de fond
4. Modifiez les autres paramètres selon vos besoins

## 📱 Utilisation

### Pour les clients

- Parcourez les produits par catégorie
- Utilisez la barre de recherche pour trouver des produits
- Cliquez sur un produit pour voir les détails
- Contactez via WhatsApp/Telegram depuis la page contact

### Pour les administrateurs

1. Accédez à `/admin/`
2. Connectez-vous avec le mot de passe
3. Gérez vos produits, catégories et paramètres
4. Les modifications sont sauvegardées automatiquement

## 🌟 Fonctionnalités avancées

### Ajouter un produit

1. Allez dans Admin > Produits
2. Cliquez sur "Ajouter un produit"
3. Remplissez les informations
4. L'image peut être une URL externe
5. Sauvegardez

### Gérer les catégories

- Ajoutez des emojis comme icônes
- Les produits sont automatiquement comptés par catégorie

### Personnalisation avancée

- Modifiez les fichiers CSS pour changer les couleurs
- Éditez les fichiers HTML pour modifier la structure
- Le JavaScript est modulaire et facile à étendre

## 🚨 Sécurité

⚠️ **Important pour la production** :

1. Changez le mot de passe admin par défaut
2. Utilisez HTTPS pour votre site
3. Sécurisez votre API backend
4. Ne stockez pas de données sensibles dans localStorage

## 📄 Licence

Ce projet est libre d'utilisation. Modifiez-le selon vos besoins !

## 🤝 Support

Pour toute question ou problème :
- Vérifiez la console du navigateur pour les erreurs
- Assurez-vous que JavaScript est activé
- Testez dans différents navigateurs

---

Fait avec ❤️ pour BipCosa06