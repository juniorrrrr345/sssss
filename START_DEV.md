# 🚀 Démarrage Rapide - Environnement de Développement

## Pour tester localement (avant déploiement Cloudflare)

### 1️⃣ Terminal 1 : Démarrer l'API Cloudflare Workers

```bash
npx wrangler dev --port 8787 --local
```

✅ L'API sera accessible sur : `http://localhost:8787`

### 2️⃣ Terminal 2 : Démarrer le serveur web

```bash
python -m http.server 8005
```

✅ Le site sera accessible sur : `http://localhost:8005`

---

## 🌐 Accès aux pages

Une fois les deux serveurs démarrés :

- **Panel Admin** : http://localhost:8005/admin.html
  - Mot de passe : `votre_nouveau_mot_de_passe`
  
- **Page d'accueil** : http://localhost:8005/home.html

- **Produits** : http://localhost:8005/products.html

- **Catégories** : http://localhost:8005/categories-dynamic.html

- **Contact** : http://localhost:8005/contact.html

- **API directe** : http://localhost:8787

---

## ⚙️ Configuration requise

Les pages web (port 8005) doivent communiquer avec l'API (port 8787).

Vérifiez que dans `config.js` et `admin.js`, l'URL est bien :
```javascript
const API_URL = 'http://localhost:8787';
```

---

## 🧪 Tester l'API

Ouvrez dans votre navigateur :
- http://localhost:8787 (API root)
- http://localhost:8787/api/products (liste des produits)
- http://localhost:8787/api/categories (liste des catégories)
- http://localhost:8787/api/settings (paramètres)
- http://localhost:8787/api/stats (statistiques)

---

## 🐛 Problèmes courants

### Erreur "ERR_CONNECTION_REFUSED"

**Cause** : L'API (port 8787) n'est pas démarrée.

**Solution** : Démarrez l'API dans un terminal séparé :
```bash
npx wrangler dev --port 8787 --local
```

### Erreur "Failed to fetch" ou CORS

**Cause** : L'API n'accepte pas les requêtes depuis le serveur web.

**Solution** : L'API est déjà configurée avec CORS (`Access-Control-Allow-Origin: *`)

### Base de données vide

**Cause** : La base de données locale n'est pas initialisée.

**Solution** : Initialisez le schéma :
```bash
npx wrangler d1 execute algran-db --file=schema.sql --local
```

---

## 📦 Scripts utiles

### Windows (PowerShell)

Créez un fichier `start-dev.ps1` :
```powershell
# Terminal 1 : API
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx wrangler dev --port 8787 --local"

# Terminal 2 : Serveur web
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m http.server 8005"

Write-Host "✅ Environnement de développement démarré !"
Write-Host "Panel Admin : http://localhost:8005/admin.html"
```

Puis exécutez :
```powershell
.\start-dev.ps1
```

### Linux/Mac (Bash)

Créez un fichier `start-dev.sh` :
```bash
#!/bin/bash

# Démarrer l'API en arrière-plan
echo "🚀 Démarrage de l'API Cloudflare Workers..."
npx wrangler dev --port 8787 --local > wrangler.log 2>&1 &
WRANGLER_PID=$!

# Attendre que l'API démarre
sleep 3

# Démarrer le serveur web
echo "🌐 Démarrage du serveur web..."
python3 -m http.server 8005 &
HTTP_SERVER_PID=$!

echo ""
echo "✅ Environnement de développement démarré !"
echo ""
echo "📍 URLs :"
echo "  - Panel Admin : http://localhost:8005/admin.html"
echo "  - API : http://localhost:8787"
echo ""
echo "Pour arrêter : kill $WRANGLER_PID $HTTP_SERVER_PID"
```

Puis :
```bash
chmod +x start-dev.sh
./start-dev.sh
```

---

## 🛑 Arrêter l'environnement

### Windows
Fermez simplement les deux fenêtres PowerShell.

### Linux/Mac
```bash
# Trouver les processus
ps aux | grep wrangler
ps aux | grep http.server

# Tuer les processus
kill [PID_WRANGLER] [PID_HTTP_SERVER]
```

Ou utilisez `Ctrl+C` dans chaque terminal.

---

## 🚀 Déploiement en production

Une fois que tout fonctionne localement :

1. **Authentification Cloudflare**
   ```bash
   npx wrangler login
   ```

2. **Initialiser la base D1 en production**
   ```bash
   npx wrangler d1 execute algran-db --file=schema.sql --remote
   ```

3. **Déployer l'API**
   ```bash
   npm run deploy
   ```

4. **Mettre à jour les URLs**
   - Remplacez `http://localhost:8787` par votre URL Workers dans :
     - `config.js`
     - `admin.js`

5. **Héberger le frontend**
   - Cloudflare Pages (recommandé)
   - Netlify
   - Vercel
   - Ou n'importe quel hébergeur statique

---

## ✅ Checklist avant de commencer

- [ ] Node.js et npm installés
- [ ] Python installé (pour le serveur web local)
- [ ] Dépendances installées (`npm install`)
- [ ] Fichier `.env` configuré
- [ ] Base de données initialisée localement

---

**Bon développement ! 🎉**
