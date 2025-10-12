# 🚀 Merge et Déploiement Local

## 📋 Étape 1 : Merger sur main

### Dans votre terminal local (PowerShell) :

```powershell
# 1. Assurez-vous d'avoir tous les changements
git fetch origin

# 2. Passez sur la branche main
git checkout main

# 3. Mergez la branche cursor
git merge cursor/create-product-page-7595

# 4. Si pas de conflits, poussez sur GitHub
git push origin main
```

### Si vous avez des conflits :

```powershell
# Git vous dira quels fichiers ont des conflits
# Ouvrez-les et résolvez les conflits
# Puis :
git add .
git commit -m "Merge panel admin complet"
git push origin main
```

## 🏠 Étape 2 : Déployer en Local

### A. Cloner/Mettre à jour votre projet local

```powershell
# Si déjà cloné, mettez à jour
cd C:\Users\PC\Documents\sssss
git pull origin main

# Ou clonez de nouveau si besoin
cd C:\Users\PC\Documents
git clone https://github.com/juniorrrrr345/sssss.git
cd sssss
```

### B. Installer Wrangler

```powershell
npm install -g wrangler
```

### C. Se connecter à Cloudflare

```powershell
wrangler login
```

### D. Initialiser la base de données D1

```powershell
# Option 1 : Script automatique (Linux/Mac/WSL)
bash init-database.sh

# Option 2 : Commande manuelle (Windows)
wrangler d1 execute algran-db --file=schema.sql --remote
```

### E. Déployer l'API Cloudflare Workers

```powershell
npm install
npm run deploy
```

Vous obtiendrez une URL comme :
```
✨ https://algran-api-XXXX.workers.dev
```

**COPIEZ CETTE URL !** 📋

### F. Configurer l'URL de l'API

Ouvrez `admin.js` (ligne 7) et remplacez :

```javascript
const API_URL = 'https://algran-api-XXXX.workers.dev'; // ← Collez votre URL ici
```

### G. Lancer un serveur local

```powershell
# Option 1 : Python
python -m http.server 8000

# Option 2 : Node.js http-server
npm install -g http-server
http-server -p 8000

# Option 3 : PHP
php -S localhost:8000
```

### H. Ouvrir dans le navigateur

Ouvrez votre navigateur à :
- **Panel Admin** : http://localhost:8000/admin.html
- **Boutique** : http://localhost:8000/products-complete.html

## 🔐 Connexion Admin

- **Mot de passe** : `admin123`
- ⚠️ Changez-le après la première connexion !

## ✅ Tester le Panel Admin

1. **Connectez-vous** avec le mot de passe
2. **Dashboard** : Vérifiez les statistiques
3. **Produits** : 
   - Cliquez sur "Ajouter un produit"
   - Remplissez le formulaire
   - Cliquez "Enregistrer"
4. **Catégories** : Vérifiez les 5 catégories par défaut
5. **Retournez sur Dashboard** : Les stats doivent être mises à jour !

## 🛍️ Tester la Boutique

1. Ouvrez : http://localhost:8000/products-complete.html
2. Vous devriez voir vos produits ajoutés
3. Testez la recherche
4. Cliquez sur un produit

## 📱 Tester sur Mobile

1. Trouvez votre IP locale :
   ```powershell
   ipconfig
   # Cherchez "IPv4 Address"
   ```

2. Sur votre téléphone, ouvrez :
   ```
   http://VOTRE-IP:8000/admin.html
   ```

## 🐛 Dépannage

### Problème : "Database not found"

```powershell
# Listez vos bases D1
wrangler d1 list

# Réexécutez le schéma
wrangler d1 execute algran-db --file=schema.sql --remote
```

### Problème : "API not responding"

```powershell
# Vérifiez les logs
wrangler tail

# Re-déployez
npm run deploy
```

### Problème : "Not authenticated"

```powershell
wrangler login
```

### Problème : "CORS error"

✅ L'API DOIT être déployée sur Cloudflare Workers (pas localhost)
✅ Vérifiez que `API_URL` dans `admin.js` pointe vers votre URL Workers

### Problème : Port 8000 déjà utilisé

```powershell
# Utilisez un autre port
python -m http.server 8080
# Puis : http://localhost:8080/admin.html
```

## 🎯 Checklist Complète

- [ ] Git merge sur main
- [ ] Git push origin main
- [ ] Git pull sur local
- [ ] Wrangler installé
- [ ] Wrangler login
- [ ] Base de données initialisée
- [ ] API déployée sur Workers
- [ ] URL API configurée dans admin.js
- [ ] Serveur local lancé
- [ ] Admin.html ouvert
- [ ] Connexion réussie
- [ ] Produit ajouté avec succès
- [ ] Boutique affiche les produits

## 📊 Vérification Rapide

### Test API (dans le navigateur) :

1. Ouvrez : `https://votre-api.workers.dev/api/categories`
2. Vous devriez voir les 5 catégories en JSON

### Test Base de données :

```powershell
wrangler d1 execute algran-db --command="SELECT * FROM categories" --remote
```

Vous devriez voir :
```
Extract, Static-Sift, Frozen-Sift, Dry-Sift, Weed
```

## 🎉 Vous êtes prêt !

Une fois tout testé :
1. ✅ Panel admin fonctionne
2. ✅ Produits s'ajoutent/modifient/suppriment
3. ✅ Boutique affiche les produits
4. ✅ Recherche fonctionne

**Votre boutique est opérationnelle !** 🛍️

## 🚀 Prochaine étape : Héberger en ligne

Pour mettre en ligne gratuitement :
- **Panel Admin** : Cloudflare Pages, Vercel, Netlify
- **API** : Déjà sur Cloudflare Workers ✅
- **Base de données** : Déjà sur Cloudflare D1 ✅
- **Images** : Déjà sur Cloudflare R2 ✅

Tout est déjà cloud ! Vous devez juste héberger les fichiers HTML/CSS/JS.

---

**Besoin d'aide ?** Consultez `GUIDE_INSTALLATION.md` ou `README.md`
