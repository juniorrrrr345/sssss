# Guide du Panel Admin BipCosa06

## 🚀 Démarrage rapide

1. **Lancer le serveur local** :
   ```bash
   python3 serve-admin.py
   ```

2. **Accéder au panel admin** :
   - Ouvrez votre navigateur à : http://localhost:8006/admin
   - Mot de passe : `admin123`

## 📱 Fonctionnalités du Panel Admin

### 1. Dashboard
- Vue d'ensemble avec statistiques
- Nombre de pages HTML
- Nombre de produits, catégories, farms, services et réseaux sociaux

### 2. Section Pages (NOUVEAU !)
- **Liste toutes vos pages HTML** :
  - home.html (Page d'accueil)
  - products.html (Catalogue produits)
  - contact.html (Page contact)
  - categories.html (Page catégories)
  - Et toutes les autres pages

- **Pour chaque page** :
  - ✅ Voir la page en direct
  - 📝 Modifier les informations (titre, description, statut)
  - 🔍 Analyser le SEO
  - 📊 Voir les composants utilisés

### 3. Gestion des Produits
- Ajouter/Modifier/Supprimer des produits
- Gérer les prix, unités, images et descriptions

### 4. Gestion des Catégories
- Créer et gérer les catégories de produits

### 5. Farms & Services
- Gérer vos différentes farms
- Gérer vos services

### 6. Réseaux Sociaux
- Ajouter et gérer vos liens de réseaux sociaux

## 🎨 Structure de vos pages

Votre site contient les pages suivantes :

1. **home.html** - Page d'accueil avec :
   - Logo géant "AVEC AMOUR"
   - Animations Lottie
   - Section services
   - Zone de livraison

2. **products.html** - Catalogue produits avec :
   - Barre de recherche
   - Filtres par catégorie
   - Grille de produits
   - Système de pagination

3. **contact.html** - Page de contact avec :
   - Liens WhatsApp
   - Telegram
   - Instagram
   - Autres réseaux sociaux

4. **categories.html** - Liste des catégories
5. **product-detail.html** - Template pour les détails produits

## 🔍 Analyse SEO

Le panel admin inclut un analyseur SEO qui vérifie :
- ✅ Balises title et meta description
- ✅ Structure H1
- ✅ Attributs alt des images
- ✅ Balises meta viewport et charset
- ✅ Open Graph
- ✅ Liens internes et externes

## 🛠️ Personnalisation

### Changer le mot de passe admin
Dans le fichier `admin-bipcosa.js`, modifiez la ligne :
```javascript
const ADMIN_PASSWORD = "admin123"; // Changez ici
```

### Ajouter une nouvelle page
Dans `admin-bipcosa.js`, ajoutez votre page dans le tableau `sitePages` :
```javascript
{
    id: 'ma-page',
    filename: 'ma-page.html',
    title: 'Ma Nouvelle Page',
    description: 'Description de ma page',
    status: 'active',
    components: ['Composant 1', 'Composant 2']
}
```

## 📊 États des pages

- **Actif** : Page en ligne et fonctionnelle
- **Template** : Page modèle réutilisable
- **Démo** : Page de démonstration
- **Inactif** : Page désactivée

## 🔗 URLs importantes

- Panel Admin : http://localhost:8006/admin
- Page d'accueil : http://localhost:8006/home.html
- Produits : http://localhost:8006/products.html
- Contact : http://localhost:8006/contact.html

## 💡 Conseils

1. **Sauvegarde** : Les données sont stockées localement dans le navigateur (sessionStorage)
2. **SEO** : Utilisez l'analyseur SEO pour optimiser vos pages
3. **Preview** : Testez toujours vos pages avec le bouton "Voir"

## 🐛 Dépannage

- **Erreur 404 sur main.js** : Normal, ce fichier n'existe pas dans votre structure
- **Pages non trouvées** : Vérifiez que les fichiers HTML sont bien dans le dossier racine
- **Mot de passe oublié** : Modifiez directement dans admin-bipcosa.js

---

Créé avec ❤️ pour BipCosa06