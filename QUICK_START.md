# ⚡ Démarrage Rapide - Al Gran API

## 🎯 En 3 minutes chrono !

### Étape 1 : Initialiser la Base de Données

```bash
./init-database-updated.sh
```

**✅ Ce script va :**
- Créer toutes les tables nécessaires
- Insérer 5 produits d'exemple
- Ajouter les prix
- Configurer les catégories

---

### Étape 2 : Démarrer le Serveur

```bash
wrangler dev
```

**✅ Le serveur démarre sur** : `http://localhost:8787`

---

### Étape 3 : Tester !

Ouvrez votre navigateur et visitez :

1. **📦 Page Produits**  
   → http://localhost:8787/products.html
   
2. **🏷️ Page Catégories**  
   → http://localhost:8787/categories.html
   
3. **📱 Page Contact**  
   → http://localhost:8787/contact.html

---

## 🎨 Que Faire Ensuite ?

### 1. Personnaliser les Liens de Contact

```bash
wrangler d1 execute algran-db --command="
UPDATE settings SET value = 'https://wa.me/VOTRE_NUMERO' WHERE key = 'contact_whatsapp';
UPDATE settings SET value = 'https://t.me/VOTRE_CANAL' WHERE key = 'lien_canal';
UPDATE settings SET value = 'https://instagram.com/VOTRE_COMPTE' WHERE key = 'lien_instagram';
UPDATE settings SET value = 'https://linktr.ee/VOTRE_COMPTE' WHERE key = 'link_trees';
"
```

### 2. Ajouter Vos Vrais Produits

Utilisez l'admin panel ou directement via SQL :

```bash
wrangler d1 execute algran-db --command="
INSERT INTO products (name, slug, description, category_id, farm, image1)
VALUES ('Mon Produit', 'mon-produit', 'Description', 1, 'Ma Farm', 'url_image');
"
```

### 3. Ajouter les Prix

```bash
wrangler d1 execute algran-db --command="
INSERT INTO product_prices (product_id, gram, price)
VALUES 
  (6, '3.5g', 100),
  (6, '7g', 180);
"
```

---

## 📚 Documentation Complète

- 📖 **Guide d'Intégration** : `README_INTEGRATION.md`
- 🔄 **Guide de Migration** : `MIGRATION_GUIDE.md`
- 📝 **Liste des Changements** : `CHANGEMENTS.md`
- 🧪 **Tests API** : `TEST_API.md`

---

## 🆘 Problème ?

### Le serveur ne démarre pas
```bash
npm install -g wrangler@latest
wrangler login
```

### La base de données est vide
```bash
./init-database-updated.sh
```

### Les produits ne s'affichent pas
1. Ouvrez la console du navigateur (F12)
2. Vérifiez les erreurs
3. Vérifiez que l'API répond : `curl http://localhost:8787/api/products`

---

## ✅ Checklist de Vérification

- [ ] Le serveur `wrangler dev` tourne sans erreur
- [ ] Les produits s'affichent sur `/products.html`
- [ ] Les catégories s'affichent sur `/categories.html`
- [ ] Les liens de contact s'affichent sur `/contact.html`
- [ ] La recherche fonctionne
- [ ] Les filtres fonctionnent
- [ ] La modal de détails s'ouvre au clic
- [ ] Les images se chargent
- [ ] Le carrousel fonctionne
- [ ] Le design est responsive (testez sur mobile)

---

## 🚀 Prêt pour la Production ?

### 1. Nettoyer les Données d'Exemple

```bash
wrangler d1 execute algran-db --command="
DELETE FROM product_prices;
DELETE FROM products;
"
```

### 2. Déployer

```bash
wrangler deploy
```

### 3. Configurer la Production

```bash
wrangler d1 execute algran-db --env production --file=schema-updated.sql
```

---

## 🎉 Félicitations !

Votre boutique Al Gran est maintenant connectée à l'API et prête à être utilisée !

**Prochaines étapes suggérées :**
1. ✅ Ajouter vos vrais produits
2. ✅ Uploader vos images sur Cloudflare R2
3. ✅ Personnaliser le design
4. ✅ Configurer un nom de domaine
5. ✅ Activer HTTPS
6. ✅ Ajouter Google Analytics

---

**Besoin d'aide ?**  
Consultez la documentation complète dans `README_INTEGRATION.md`

**Date :** 2025-10-12  
**Version :** 2.0.0
