# 🔧 Configuration de l'URL de l'API

## ⚠️ IMPORTANT - À FAIRE APRÈS LE DÉPLOIEMENT

Après avoir déployé votre API sur Cloudflare Workers, vous devez mettre à jour l'URL de l'API dans tous les fichiers.

---

## 🎯 Méthode 1 : Configuration Centralisée (Recommandé)

### Étape 1 : Déployer l'API

```powershell
npm run deploy
```

Vous obtiendrez une URL comme :
```
✨ Published algran-api
   https://algran-api-xxx.workers.dev
```

**COPIEZ CETTE URL !** 📋

### Étape 2 : Mettre à jour config.js

Ouvrez le fichier **`config.js`** et modifiez la ligne 14 :

```javascript
apiUrl: 'https://algran-api-xxx.workers.dev',  // ⬅️ Mettez votre URL ici
```

### Étape 3 : Inclure config.js dans toutes les pages

Les pages suivantes doivent inclure `config.js` **avant** leurs autres scripts :

✅ Déjà configuré dans :
- `admin.html` - Panel d'administration
- `products-complete.html` - Page des produits
- `categories.html` - Page des catégories

---

## 🔍 Méthode 2 : Configuration Manuelle (Si config.js ne fonctionne pas)

Si vous préférez ou si vous rencontrez des problèmes avec `config.js`, vous pouvez mettre à jour l'URL directement dans chaque fichier :

### Fichier 1 : admin.js

**Ligne 9 :**
```javascript
const API_URL = 'https://algran-api-xxx.workers.dev';
```

### Fichier 2 : products-complete.html

**Ligne 233 :**
```javascript
const API_URL = 'https://algran-api-xxx.workers.dev';
```

### Fichier 3 : categories.html

**Dans la balise `<script>` en bas :**
```javascript
const API_URL = 'https://algran-api-xxx.workers.dev';
```

---

## ✅ Vérifier que tout fonctionne

### Test 1 : Tester l'API directement dans le navigateur

Ouvrez cette URL dans votre navigateur :
```
https://algran-api-xxx.workers.dev/api/categories
```

Vous devriez voir un JSON avec les 5 catégories :
```json
{
  "success": true,
  "categories": [
    {"id": 1, "name": "Extract", ...},
    {"id": 2, "name": "Static-Sift", ...},
    ...
  ]
}
```

### Test 2 : Vérifier le Panel Admin

1. Ouvrez : http://localhost:8000/admin.html
2. Connectez-vous avec : `admin123`
3. Vérifiez que le dashboard affiche les statistiques
4. Si vous voyez "0" partout, l'API n'est pas accessible

### Test 3 : Vérifier la page Produits

1. Ouvrez : http://localhost:8000/products-complete.html
2. Ouvrez la Console du navigateur (F12)
3. Vous devriez voir : `✅ X produits chargés depuis l'API`

---

## 🐛 Problèmes courants

### ❌ "API NON DISPONIBLE"

**Causes possibles :**
1. L'API n'est pas déployée
2. L'URL de l'API est incorrecte
3. Problème CORS

**Solutions :**

```powershell
# 1. Re-déployer l'API
npm run deploy

# 2. Vérifier que l'API répond
curl https://algran-api-xxx.workers.dev/api/categories

# 3. Voir les logs en temps réel
wrangler tail
```

### ❌ "CORS Error"

L'API **DOIT** être déployée sur Cloudflare Workers. Vous ne pouvez pas utiliser `http://localhost:8787` pour le frontend qui tourne sur `http://localhost:8000`.

**Solution :**
- Déployez l'API : `npm run deploy`
- Mettez l'URL Workers dans les fichiers

### ❌ "Utilisation des produits statiques"

Cela signifie que l'API n'a pas répondu, donc la page affiche des produits d'exemple.

**Vérifiez :**
1. L'URL de l'API est correcte
2. L'API est bien déployée
3. La console du navigateur pour plus de détails (F12)

---

## 📝 Checklist de Configuration

- [ ] API déployée sur Cloudflare Workers
- [ ] URL de l'API copiée
- [ ] `config.js` mis à jour avec l'URL
- [ ] Test API dans le navigateur réussi
- [ ] Panel admin charge les statistiques
- [ ] Page produits charge depuis l'API
- [ ] Page catégories affiche les compteurs

---

## 🔄 Développement Local vs Production

### Développement Local (avec Wrangler Dev)

```powershell
# Terminal 1 : Lancer l'API en local
wrangler dev

# Terminal 2 : Lancer le serveur web
python -m http.server 8000
```

Dans `config.js` :
```javascript
apiUrl: 'http://localhost:8787',
```

### Production

```powershell
# Déployer l'API
npm run deploy

# Lancer le serveur web (pour tester)
python -m http.server 8000
```

Dans `config.js` :
```javascript
apiUrl: 'https://algran-api-xxx.workers.dev',
```

---

## 💡 Astuce : Basculer facilement entre Dev et Prod

Vous pouvez ajouter une détection automatique dans `config.js` :

```javascript
const API_CONFIG = {
    apiUrl: window.location.hostname === 'localhost' 
        ? 'http://localhost:8787'  // Dev
        : 'https://algran-api-xxx.workers.dev',  // Prod
    
    timeout: 10000,
    debug: window.location.hostname === 'localhost'
};
```

---

## 📞 Besoin d'aide ?

Si vous rencontrez toujours des problèmes :

1. **Vérifiez les logs de l'API** : `wrangler tail`
2. **Vérifiez la console du navigateur** : Appuyez sur F12
3. **Testez l'API directement** : `curl https://votre-api.workers.dev/api/categories`
4. **Consultez** `DEPLOIEMENT_FACILE.md` pour plus de détails

---

**Made with ❤️ for Al Gran**
