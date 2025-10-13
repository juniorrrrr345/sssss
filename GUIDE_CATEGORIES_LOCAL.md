# Guide d'utilisation locale - Page Catégories

## Fichiers créés

1. **categories.html** - La page HTML principale
2. **categories-style.css** - Les styles CSS en thème noir et blanc

## Comment utiliser en local

### Étape 1 : Vérifier les fichiers
Assurez-vous d'avoir ces fichiers dans votre dossier :
- `categories.html`
- `categories-style.css`

### Étape 2 : Ouvrir dans le navigateur
1. Double-cliquez sur `categories.html`
2. Ou faites un clic droit > "Ouvrir avec" > Votre navigateur

### Étape 3 : Serveur local (recommandé)
Pour un meilleur fonctionnement avec l'API :

```bash
# Si vous avez Python
python -m http.server 8000

# Si vous avez Node.js
npx http-server
```

Puis ouvrez : http://localhost:8000/categories.html

## Structure des fichiers

```
votre-projet/
├── categories.html          # Page principale
├── categories-style.css     # Styles noir et blanc
├── index.html              # Page d'accueil
├── products.html           # Page produits
└── contact.html            # Page contact
```

## Caractéristiques du thème noir et blanc

- **Fond** : Noir pur (#000000)
- **Texte** : Blanc pur (#ffffff)
- **Bordures** : Blanches 2px
- **Hover** : Effets de gris transparents
- **Aucune couleur** : Tout est en noir, blanc et nuances de gris

## API

La page charge automatiquement les catégories depuis :
```
https://algran-api.calitek-junior.workers.dev/api/categories
```

## Navigation

La barre de navigation en bas permet d'accéder aux autres pages :
- Accueil (index.html)
- Produits (products.html)
- Catégories (categories.html) - Page active
- Contact (contact.html)

## Personnalisation

Pour modifier les styles, éditez `categories-style.css` :
- Variables CSS en haut du fichier
- Sections commentées pour chaque partie
- Media queries pour le responsive