# 🚀 Démarrage Rapide - 5 minutes

Guide ultra-rapide pour lancer votre panel admin Al Gran.

## ⚡ Installation Express

### 1️⃣ Installer Wrangler (1 min)

```bash
npm install -g wrangler
```

### 2️⃣ Se connecter à Cloudflare (1 min)

```bash
wrangler login
```

Une page s'ouvrira dans votre navigateur. Cliquez sur "Autoriser".

### 3️⃣ Initialiser la base de données (1 min)

**Windows (PowerShell)** :
```powershell
wrangler d1 execute algran-db --file=schema.sql --remote
```

**Linux/Mac** :
```bash
chmod +x init-database.sh
./init-database.sh
```

### 4️⃣ Déployer l'API (1 min)

```bash
npm run deploy
```

Vous obtiendrez une URL comme :
```
https://algran-api.XXXX.workers.dev
```

### 5️⃣ Configurer l'URL API (30 secondes)

Ouvrez `admin.js` et modifiez la ligne 7 :

```javascript
const API_URL = 'https://algran-api.XXXX.workers.dev'; // ← Mettez votre URL ici
```

### 6️⃣ Lancer le panel admin (30 secondes)

**Double-cliquez sur `admin.html`** ✅

Ou lancez un serveur :

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

Puis ouvrez : `http://localhost:8000/admin.html`

## 🔐 Première Connexion

1. Ouvrez `admin.html` dans votre navigateur
2. Entrez le mot de passe : **`admin123`**
3. Cliquez sur "Se connecter" ✅

## ✨ Ajouter votre premier produit

1. Cliquez sur **"Produits"** dans le menu
2. Cliquez sur **"+ Ajouter un produit"**
3. Remplissez le formulaire :
   - **Nom** : "Hash Premium"
   - **Catégorie** : Extract
   - **Prix** : 150
   - **Unité** : / 3.5g
   - **Badge** : 🔥 TOPSHELF
4. Cliquez sur **"Enregistrer"** ✅

## 🎯 Que faire ensuite ?

### ✅ Changez le mot de passe admin
Modifiez `ADMIN_PASSWORD` dans `admin.js` ligne 8.

### ✅ Ajoutez vos produits
Via le panel admin → Produits → Ajouter

### ✅ Personnalisez la boutique
Via le panel admin → Paramètres

### ✅ Testez la boutique frontend
Ouvrez `products-complete.html` pour voir vos produits

## 🐛 Problèmes courants

### ❌ "Database not found"
**Solution** : Réexécutez `wrangler d1 execute algran-db --file=schema.sql --remote`

### ❌ "API not responding"
**Solution** : 
1. Vérifiez que l'API est déployée : `wrangler deploy`
2. Vérifiez l'URL dans `admin.js` ligne 7

### ❌ "Not authenticated"
**Solution** : `wrangler login`

### ❌ "CORS error"
**Solution** : L'API doit être déployée sur Cloudflare Workers, pas en local

## 📞 Besoin d'aide ?

1. **Logs en temps réel** : `wrangler tail`
2. **Lister vos bases** : `wrangler d1 list`
3. **Voir les tables** : `wrangler d1 execute algran-db --command="SELECT * FROM products" --remote`

## 🎉 C'est tout !

Votre panel admin est opérationnel. Bon business ! 🛍️

---

**Temps total : ~5 minutes** ⏱️

Pour plus de détails, consultez `GUIDE_INSTALLATION.md` ou `README.md`.
