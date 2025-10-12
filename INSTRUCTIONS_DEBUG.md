# 🔧 DEBUG - Pages qui ne chargent pas

## 📥 Commandes à exécuter MAINTENANT :

```powershell
cd C:\Users\PC\Documents\sssss

git pull origin cursor/deploy-local-web-store-from-github-901c

npm run deploy

python -m http.server 8005
```

---

## 🔍 Vérifier dans la Console (F12)

Allez sur :
- http://localhost:8005/home.html
- http://localhost:8005/categories.html

Appuyez sur **F12** et regardez la **Console**.

Vous devriez voir :
```
Loading shop info...
Responses received
Settings: {success: true, settings: {...}}
Services: {success: true, services: [...]}
```

---

## ⚠️ Si vous voyez des erreurs :

### Erreur : "Failed to fetch" ou "net::ERR_CONNECTION_REFUSED"
**Solution :**
```powershell
npm run deploy
```
L'API n'est pas déployée ou pas accessible.

### Erreur : "Unexpected token" ou "SyntaxError"
**Solution :**
Rechargez avec **Ctrl + Shift + R** (vider le cache)

### Erreur : CORS
**Solution :**
L'API doit être redéployée avec les bons headers.

---

## ✅ Corrections appliquées :

1. ✅ Erreur `ceConfirm is not defined` corrigée
2. ✅ Erreur 500 sur `/api/farms/1` corrigée
3. ✅ Product modal gère maintenant `prices: null`
4. ✅ Logs debug ajoutés pour tracer le problème

---

## 📞 Testez maintenant :

1. `git pull`
2. `npm run deploy` (IMPORTANT !)
3. `python -m http.server 8005`
4. **Ctrl + Shift + R** sur chaque page
5. **F12** → Console → Regardez les logs

**Dites-moi ce que vous voyez dans la console !** 🔍
