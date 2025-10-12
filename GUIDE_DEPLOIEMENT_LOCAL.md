# 🚀 Guide de Déploiement Local - Al Gran

## ✅ TOUT CE QUI A ÉTÉ FAIT AUJOURD'HUI

### Backend & Base de données :
- ✅ Table `farms` (5 farms par défaut)
- ✅ Table `services` (3 services par défaut)
- ✅ Table `product_variants` (prix multiples)
- ✅ Table `product_gallery` (galerie photos)
- ✅ Produits enrichis (farm_id, video_url, long_description)
- ✅ API complète avec tous les endpoints

### Panel Admin :
- ✅ Page **Farms** (CRUD complet)
- ✅ Page **Services** (gérer home.html)
- ✅ Formulaire produit enrichi (4 sections colorées)
- ✅ Support prix multiples
- ✅ Suppression catégories
- ✅ Catégories avec images externes

### Frontend :
- ✅ `products.html` - Liste dynamique
- ✅ `product-detail.html` - Page détail avec vidéo, farm, bouton Commander
- ✅ `categories.html` - 3 par ligne, images
- ✅ `home.html` - Services dynamiques
- ✅ `contact.html` - Liens sociaux dynamiques

---

## 🔧 WORKFLOW DE DÉPLOIEMENT

### Sur votre PC (C:\Users\PC\Documents\sssss) :

#### 1️⃣ Récupérer TOUS les fichiers depuis GitHub

```powershell
cd C:\Users\PC\Documents\sssss

# Sauvegarder vos modifs locales (si vous en avez)
git add -A
git stash

# Récupérer depuis GitHub
git fetch origin
git checkout cursor/reconfigure-shop-with-cloudflare-ba7c
git reset --hard origin/cursor/reconfigure-shop-with-cloudflare-ba7c
git pull origin cursor/reconfigure-shop-with-cloudflare-ba7c

# Vérifier que les fichiers sont à jour
findstr /i "Farms" admin.html
findstr /i "productsData" products.html
```

#### 2️⃣ Initialiser la base de données

```powershell
# Supprimer toutes les tables
npx wrangler d1 execute algran-db --command="DROP TABLE IF EXISTS products; DROP TABLE IF EXISTS categories; DROP TABLE IF EXISTS services; DROP TABLE IF EXISTS farms; DROP TABLE IF EXISTS product_variants; DROP TABLE IF EXISTS product_gallery; DROP TABLE IF EXISTS settings; DROP TABLE IF EXISTS images; DROP TABLE IF EXISTS orders; DROP TABLE IF EXISTS order_items;" --local

# Créer toutes les tables
npx wrangler d1 execute algran-db --file=schema.sql --local
```

#### 3️⃣ Démarrer l'API

```powershell
npx wrangler dev --port 8787 --local
```

Attendez : `[wrangler:inf] Ready on http://127.0.0.1:8787`

#### 4️⃣ Démarrer le serveur web (dans un autre terminal)

```powershell
cd C:\Users\PC\Documents\sssss
python -m http.server 9003
```

#### 5️⃣ Tester

```
http://localhost:9003/test-products.html
```

Si vous voyez le produit = ✅ API OK

```
http://localhost:9003/admin.html
```

Mot de passe : `admin123`

---

## 📋 CHECKLIST DE VÉRIFICATION

Après le déploiement, vérifiez :

- [ ] `git pull` sans erreur
- [ ] `findstr /i "Farms" admin.html` retourne des lignes
- [ ] L'API démarre sans erreur
- [ ] `curl http://localhost:8787/api/products` retourne du JSON
- [ ] test-products.html affiche les produits
- [ ] Panel admin montre Farms dans le menu
- [ ] Ajout de produit fonctionne
- [ ] products.html affiche les produits
- [ ] Clic sur produit → page détail
- [ ] Bouton Commander ouvre WhatsApp/Telegram

---

## 🐛 PROBLÈMES FRÉQUENTS

### "Products.html n'affiche rien"
**Cause** : Cache du navigateur  
**Solution** : Utilisez un nouveau port (9004, 9005, etc.) à chaque fois

### "Farms n'apparaît pas"
**Cause** : Fichiers locaux pas à jour  
**Solution** : `git reset --hard origin/cursor/...`

### "Erreur 400 lors ajout produit"
**Cause** : Base de données pas à jour  
**Solution** : Re-exécuter `schema.sql`

### "Cannot read properties of null"
**Cause** : script.js chargé alors qu'il ne faut pas  
**Solution** : Vérifier que products.html n'importe PAS script.js

---

## 🎯 COMMANDES RÉSUMÉES

```powershell
# Tout récupérer et redémarrer proprement

cd C:\Users\PC\Documents\sssss

# 1. Récupérer GitHub
git reset --hard origin/cursor/reconfigure-shop-with-cloudflare-ba7c
git pull origin cursor/reconfigure-shop-with-cloudflare-ba7c

# 2. Base de données (Terminal API)
npx wrangler d1 execute algran-db --command="DROP TABLE IF EXISTS products; DROP TABLE IF EXISTS categories; DROP TABLE IF EXISTS services; DROP TABLE IF EXISTS farms; DROP TABLE IF EXISTS product_variants; DROP TABLE IF EXISTS product_gallery; DROP TABLE IF EXISTS settings; DROP TABLE IF EXISTS images; DROP TABLE IF EXISTS orders; DROP TABLE IF EXISTS order_items;" --local
npx wrangler d1 execute algran-db --file=schema.sql --local

# 3. Démarrer API
npx wrangler dev --port 8787 --local

# 4. Serveur web (autre terminal)
python -m http.server 9003

# 5. Tester
http://localhost:9003/test-products.html
http://localhost:9003/admin.html
```

---

**Suivez ces commandes dans l'ordre ! 🚀**
