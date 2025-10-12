# 🚀 Guide de Déploiement Simple - Boutique Al Gran

## 📋 Ce que vous allez faire :
1. **Installer Wrangler** (outil Cloudflare)
2. **Se connecter à Cloudflare**
3. **Créer la base de données**
4. **Déployer l'API**
5. **Lancer votre boutique en local**

---

## 🔧 Étape 1 : Installation de Wrangler

Ouvrez **PowerShell** dans votre dossier `C:\Users\PC\Documents\sssss` et exécutez :

```powershell
npm install -g wrangler
```

✅ Attendez que l'installation se termine (environ 1-2 minutes)

---

## 🔑 Étape 2 : Connexion à Cloudflare

Dans le même terminal, tapez :

```powershell
wrangler login
```

📱 **Une page web va s'ouvrir** :
- Cliquez sur **"Allow"** (Autoriser)
- Retournez dans votre terminal
- Vous devriez voir : **"Successfully logged in!"**

---

## 🗄️ Étape 3 : Créer la base de données D1

### A. Créer la base de données

```powershell
wrangler d1 create algran-db
```

📝 **IMPORTANT** : Vous allez recevoir quelque chose comme :

```
✨ Successfully created DB 'algran-db'!

[[d1_databases]]
binding = "DB"
database_name = "algran-db"
database_id = "XXXXX-XXXXX-XXXXX-XXXXX"
```

**COPIEZ le `database_id`** (la longue chaîne de caractères)

### B. Mettre à jour wrangler.toml

Ouvrez le fichier **`wrangler.toml`** et remplacez la ligne 9 :

```toml
database_id = "VOTRE-NOUVEAU-ID-ICI"
```

### C. Initialiser le schéma de la base de données

```powershell
wrangler d1 execute algran-db --file=schema.sql --remote
```

✅ Vous devriez voir : **"Successfully executed SQL"**

---

## 🚀 Étape 4 : Déployer l'API sur Cloudflare Workers

```powershell
npm install
npm run deploy
```

📋 **IMPORTANT** : Vous allez recevoir une URL comme :

```
✨ Published algran-api
   https://algran-api.VOTRE-USERNAME.workers.dev
```

**COPIEZ CETTE URL COMPLÈTE** !

---

## 🔧 Étape 5 : Configurer l'URL de l'API

### A. Ouvrir admin.js

Ouvrez le fichier **`admin.js`** (avec Notepad ou VSCode)

### B. Modifier la ligne 7

Remplacez :
```javascript
const API_URL = 'http://localhost:8787';
```

Par :
```javascript
const API_URL = 'https://algran-api.VOTRE-USERNAME.workers.dev';
```

⚠️ **Utilisez l'URL que vous avez copiée à l'étape 4 !**

### C. Sauvegarder le fichier (Ctrl + S)

---

## 🏠 Étape 6 : Lancer votre boutique en local

### Option A : Serveur Python (Recommandé)

```powershell
python -m http.server 8000
```

### Option B : Serveur Node.js

```powershell
npm install -g http-server
http-server -p 8000
```

### Option C : Double-clic (Plus simple mais limité)

Double-cliquez simplement sur le fichier **`admin.html`**

---

## 🎉 Étape 7 : Accéder à votre boutique

Ouvrez votre navigateur et allez sur :

### 🎛️ Panel Admin
```
http://localhost:8000/admin.html
```

**Mot de passe :** `admin123`

### 🏪 Boutique
```
http://localhost:8000/products-complete.html
```

### 🏠 Page d'accueil
```
http://localhost:8000/index.html
```

---

## ✅ Tester que tout fonctionne

### Test 1 : Panel Admin

1. Ouvrez `http://localhost:8000/admin.html`
2. Entrez le mot de passe : **`admin123`**
3. Vous devriez voir le **Dashboard** avec des statistiques
4. Cliquez sur **"Produits"** dans le menu
5. Cliquez sur **"Ajouter un produit"**
6. Remplissez le formulaire :
   - Nom : "Test Produit"
   - Description : "Ceci est un test"
   - Catégorie : Choisissez "Extract"
   - Prix : 25
7. Cliquez sur **"Enregistrer"**

✅ Si le produit apparaît dans la liste, **tout fonctionne** !

### Test 2 : Boutique

1. Ouvrez `http://localhost:8000/products-complete.html`
2. Vous devriez voir votre produit "Test Produit"
3. Testez la recherche en tapant "test"

---

## 🐛 Problèmes courants

### Problème : "Database not found"

**Solution :**
```powershell
# Listez vos bases de données
wrangler d1 list

# Réexécutez le schéma
wrangler d1 execute algran-db --file=schema.sql --remote
```

### Problème : "API not responding" ou erreurs CORS

**Solutions :**

1. **Vérifiez que l'URL est correcte dans admin.js**
   - Ouvrez `admin.js`
   - Ligne 7 doit contenir votre URL Workers (pas localhost)

2. **Redéployez l'API**
   ```powershell
   npm run deploy
   ```

3. **Vérifiez les logs**
   ```powershell
   wrangler tail
   ```

### Problème : "Not authenticated"

**Solution :**
```powershell
wrangler login
```

### Problème : Port 8000 déjà utilisé

**Solution :** Utilisez un autre port
```powershell
python -m http.server 8080
# Puis ouvrez : http://localhost:8080/admin.html
```

---

## 📱 Accéder depuis votre téléphone

### 1. Trouver votre IP locale

```powershell
ipconfig
```

Cherchez **"IPv4 Address"**, par exemple : `192.168.1.10`

### 2. Sur votre téléphone

Ouvrez le navigateur et allez sur :
```
http://192.168.1.10:8000/admin.html
```

⚠️ **Assurez-vous d'être sur le même réseau WiFi !**

---

## 🔐 Sécurité importante

### ⚠️ CHANGEZ LE MOT DE PASSE !

1. Connectez-vous au panel admin
2. Allez dans **"Paramètres"**
3. Changez le mot de passe par défaut **`admin123`**

---

## 🎯 Récapitulatif des commandes

```powershell
# 1. Installer Wrangler
npm install -g wrangler

# 2. Se connecter
wrangler login

# 3. Créer et initialiser la DB
wrangler d1 create algran-db
wrangler d1 execute algran-db --file=schema.sql --remote

# 4. Déployer l'API
npm install
npm run deploy

# 5. Lancer le serveur local
python -m http.server 8000
```

---

## 🌐 Pour mettre en ligne (Production)

Une fois que tout fonctionne en local, vous pouvez héberger gratuitement :

### Frontend (HTML/CSS/JS)
- **Cloudflare Pages** (Recommandé)
- **Vercel**
- **Netlify**
- **GitHub Pages**

### Backend
- ✅ **Déjà en ligne** sur Cloudflare Workers !
- ✅ **Base de données** déjà sur Cloudflare D1 !
- ✅ **Stockage images** déjà sur Cloudflare R2 !

Il vous suffit juste d'héberger les fichiers HTML/CSS/JS !

---

## 💡 Commandes utiles

```powershell
# Voir les logs en temps réel
wrangler tail

# Lister vos bases de données
wrangler d1 list

# Exécuter une requête SQL
wrangler d1 execute algran-db --command="SELECT * FROM categories" --remote

# Voir vos Workers déployés
wrangler deployments list

# Développement local (API + frontend)
wrangler dev
```

---

## 🎉 Félicitations !

Votre boutique Al Gran est maintenant **opérationnelle** ! 🛍️

### Ce que vous avez maintenant :

✅ **Panel Admin complet** pour gérer vos produits  
✅ **API REST** déployée sur Cloudflare  
✅ **Base de données D1** avec 5 catégories par défaut  
✅ **Boutique en ligne** responsive et moderne  
✅ **Stockage R2** pour les images  

---

## 📞 Besoin d'aide ?

- Consultez `README.md` pour plus de détails
- Vérifiez les logs : `wrangler tail`
- Testez l'API directement : `https://votre-api.workers.dev/api/categories`

---

**Made with ❤️ for Al Gran** 🌟
