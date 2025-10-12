# 🧪 Tests API - Al Gran

## Tests Rapides de l'API

### Prérequis

```bash
# Démarrer le serveur
wrangler dev
```

---

## 1️⃣ Test des Endpoints

### Test 1 : Documentation API

```bash
curl http://localhost:8787/
```

**Résultat attendu :**
```json
{
  "success": true,
  "name": "Al Gran API",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

---

### Test 2 : Liste des Produits

```bash
curl http://localhost:8787/api/products
```

**Résultat attendu :**
```json
{
  "success": true,
  "products": [
    {
      "_id": 1,
      "name": "100K ROSIN",
      "category": "Extract",
      "farm": "100K",
      "image1": "...",
      "prices": [
        { "_id": 1, "gram": "2g", "price": 200 }
      ]
    }
  ]
}
```

---

### Test 3 : Produits par Catégorie

```bash
curl http://localhost:8787/api/products/category/Extract
```

**Résultat attendu :**
```json
{
  "success": true,
  "products": [ /* Produits de la catégorie Extract */ ]
}
```

---

### Test 4 : Liste des Catégories

```bash
curl http://localhost:8787/api/categories
```

**Résultat attendu :**
```json
{
  "success": true,
  "categories": [
    {
      "id": 1,
      "name": "Extract",
      "slug": "extract",
      "icon": "🔥",
      "product_count": 1
    }
  ]
}
```

---

### Test 5 : Liens de Contact

```bash
curl http://localhost:8787/api/links
```

**Résultat attendu :**
```json
{
  "success": true,
  "links": {
    "contact": "https://wa.me/33600000000",
    "linkTrees": "https://linktr.ee/algran",
    "lienCanal": "https://t.me/algran",
    "lienInstagram": "https://instagram.com/algran"
  }
}
```

---

### Test 6 : Liste des Farms

```bash
curl http://localhost:8787/api/farms
```

**Résultat attendu :**
```json
{
  "success": true,
  "farms": ["100K", "ESTATICO", "WIZARD TREES", "MCAFARM"]
}
```

---

## 2️⃣ Test du Frontend

### Test 1 : Page Produits

1. Ouvrir http://localhost:8787/products.html
2. ✅ Vérifier que les produits se chargent
3. ✅ Vérifier que la recherche fonctionne
4. ✅ Vérifier que les filtres s'affichent
5. ✅ Cliquer sur un produit pour ouvrir la modal
6. ✅ Vérifier le carrousel d'images
7. ✅ Vérifier les prix

### Test 2 : Page Catégories

1. Ouvrir http://localhost:8787/categories.html
2. ✅ Vérifier que les catégories se chargent
3. ✅ Cliquer sur une catégorie
4. ✅ Vérifier la redirection vers category-products.html
5. ✅ Vérifier que les produits de la catégorie s'affichent

### Test 3 : Page Contact

1. Ouvrir http://localhost:8787/contact.html
2. ✅ Vérifier que les liens se chargent
3. ✅ Vérifier que les liens sont cliquables
4. ✅ Vérifier les icônes et descriptions

---

## 3️⃣ Test de la Base de Données

### Vérifier les Tables

```bash
wrangler d1 execute algran-db --command="
  SELECT name FROM sqlite_master WHERE type='table';
"
```

**Tables attendues :**
- categories
- products
- product_prices
- settings
- images
- orders
- order_items

### Vérifier les Données

```bash
# Compter les produits
wrangler d1 execute algran-db --command="
  SELECT COUNT(*) as total FROM products;
"

# Compter les catégories
wrangler d1 execute algran-db --command="
  SELECT COUNT(*) as total FROM categories WHERE is_active = 1;
"

# Vérifier les prix
wrangler d1 execute algran-db --command="
  SELECT p.name, pp.gram, pp.price 
  FROM products p 
  JOIN product_prices pp ON p.id = pp.product_id 
  LIMIT 5;
"
```

---

## 4️⃣ Test des Erreurs

### Test 1 : Produit Inexistant

```bash
curl http://localhost:8787/api/products/99999
```

**Résultat attendu :**
```json
{
  "error": "Product not found"
}
```

### Test 2 : Catégorie Inexistante

```bash
curl http://localhost:8787/api/products/category/NonExistant
```

**Résultat attendu :**
```json
{
  "success": true,
  "products": []
}
```

---

## 5️⃣ Test de Performance

### Test avec Apache Bench

```bash
# Installer Apache Bench
sudo apt-get install apache2-utils

# Test de charge (100 requêtes, 10 concurrentes)
ab -n 100 -c 10 http://localhost:8787/api/products
```

**Métriques à vérifier :**
- Requests per second > 50
- Time per request < 200ms
- Failed requests = 0

---

## 6️⃣ Test du Responsive

### Tailles d'écran à tester

1. **Mobile (375px)**
   - 2 colonnes de produits
   - Navigation bottom visible
   - Filtres en pleine largeur

2. **Tablet (768px)**
   - 3-4 colonnes de produits
   - Navigation bottom visible

3. **Desktop (1024px+)**
   - 5 colonnes de produits
   - Tous les éléments visibles

### Navigateurs à tester

- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

---

## 🐛 Problèmes Courants

### Problème 1 : API ne répond pas

**Solution :**
```bash
# Vérifier que le serveur tourne
ps aux | grep wrangler

# Redémarrer
wrangler dev
```

### Problème 2 : Base de données vide

**Solution :**
```bash
# Réinitialiser
./init-database-updated.sh
```

### Problème 3 : CORS Error

**Solution :**
Vérifier que les headers CORS sont bien dans `src/index.js` :
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  // ...
};
```

### Problème 4 : Images ne chargent pas

**Solution :**
- Vérifier les URLs dans la base de données
- Vérifier la console du navigateur (F12)
- Vérifier le fallback `images/product-placeholder.jpg`

---

## ✅ Checklist Complète

### Backend
- [ ] API répond à `/`
- [ ] `/api/products` retourne des produits
- [ ] `/api/products/:id` retourne un produit
- [ ] `/api/products/category/:category` fonctionne
- [ ] `/api/categories` retourne les catégories
- [ ] `/api/links` retourne les liens
- [ ] `/api/farms` retourne les farms
- [ ] Les prix sont inclus dans les produits
- [ ] Les images multiples sont supportées

### Frontend
- [ ] products.html charge les produits
- [ ] La recherche fonctionne
- [ ] Les filtres fonctionnent
- [ ] La modal de détails s'ouvre
- [ ] Le carrousel fonctionne
- [ ] categories.html charge les catégories
- [ ] category-products.html filtre par catégorie
- [ ] contact.html charge les liens
- [ ] Navigation entre pages fonctionne
- [ ] Responsive sur mobile

### Base de Données
- [ ] Toutes les tables existent
- [ ] Les catégories sont insérées
- [ ] Les produits sont insérés
- [ ] Les prix sont insérés
- [ ] Les settings sont configurés
- [ ] Les foreign keys fonctionnent

---

## 📊 Rapport de Test

### Date : _______________

#### Résultats

| Test | Status | Notes |
|------|--------|-------|
| API Root | ⬜ Pass / ❌ Fail | |
| Products List | ⬜ Pass / ❌ Fail | |
| Products by Category | ⬜ Pass / ❌ Fail | |
| Categories | ⬜ Pass / ❌ Fail | |
| Links | ⬜ Pass / ❌ Fail | |
| Farms | ⬜ Pass / ❌ Fail | |
| Frontend Products | ⬜ Pass / ❌ Fail | |
| Frontend Categories | ⬜ Pass / ❌ Fail | |
| Frontend Contact | ⬜ Pass / ❌ Fail | |
| Mobile Responsive | ⬜ Pass / ❌ Fail | |

#### Notes

```
__________________________________________
__________________________________________
__________________________________________
```

---

**Testé par :** _______________  
**Date :** _______________  
**Environnement :** Dev / Staging / Production
