# 🎯 GUIDE : Produits Avancés avec Prix Multiples et Vidéos

## 🚀 Nouvelles Fonctionnalités

1. ✅ **Prix Multiples** - Plusieurs options de quantité/prix par produit
2. ✅ **Vidéos** - Ajouter des vidéos aux produits
3. ✅ **Page Détails** - Page complète pour chaque produit
4. ✅ **Contact WhatsApp** - Bouton pour commander via WhatsApp

---

## 📥 Installation

```powershell
cd C:\Users\PC\Documents\sssss
git pull origin cursor/deploy-local-web-store-from-github-901c

# Ajouter les colonnes pour prix multiples et vidéos
wrangler d1 execute algran-db --file=schema-products-update.sql --remote

# Redéployer l'API
npm run deploy

# Tester
python -m http.server 8005
```

---

## 📦 Ajouter un Produit avec Prix Multiples

### 1. Panel Admin → Produits → Ajouter

### 2. Remplissez les champs :

**Nom :** Extract Premium

**Catégorie :** Extract

**Farm :** WIZARD TREES

**Prix et Quantités :**
```
1g|10
3.5g|30
7g|55
14g|100
28g|180
```

**Badge :** 🔥 TOP

**URL de l'image :**
```
https://i.imgur.com/xxxxx.jpg
```

**URL de la vidéo (optionnel) :**
```
https://example.com/video.mp4
```

**Description :**
```
Extract premium de haute qualité. Produit par WIZARD TREES en Californie.
```

### 3. Cliquez sur "Enregistrer"

---

## 🎬 Ajouter une Vidéo

### Format de l'URL vidéo :

**✅ Formats supportés :**
- MP4 direct : `https://example.com/video.mp4`
- Vidéos hébergées sur votre serveur
- Cloudflare R2 : `https://pub-xxxxx.r2.dev/video.mp4`

**❌ Non supporté (pour l'instant) :**
- YouTube
- Vimeo
- Instagram

---

## 💰 Format des Prix et Quantités

### Syntaxe :
```
quantité|prix
```

### Exemples :

**Pour du hash/extract :**
```
1g|10
3.5g|30
7g|55
14g|100
28g|180
```

**Pour des fleurs :**
```
1g|8
3.5g|25
7g|45
14g|80
28g|150
56g|280
```

**Pour des concentrés :**
```
0.5g|20
1g|35
2g|65
```

---

## 📱 Page Détails Produit

### Fonctionnalités :

1. **Image ou Vidéo** en grand
2. **Badge** du produit
3. **Titre et catégorie**
4. **Description** complète
5. **Sélection de la quantité** (boutons cliquables)
6. **Bouton WhatsApp** pour commander
7. **Métadonnées** (catégorie, farm)

### Accès :

Cliquez sur n'importe quel produit dans `products.html` !

---

## 📞 Contact WhatsApp

### Configuration :

1. Panel Admin → **Réseaux Sociaux**
2. Ajoutez WhatsApp avec l'URL : `https://wa.me/33612345678`
3. Le bouton "Commander" sur la page détails utilise automatiquement ce numéro !

### Message automatique :

```
Bonjour ! Je suis intéressé par : Extract Premium (3.5g)
```

---

## 🎨 Exemple Complet

### Produit : Extract Premium

```
Nom : Extract Premium
Catégorie : Extract
Farm : WIZARD TREES

Prix et Quantités :
1g|10
3.5g|30
7g|55

Badge : 🔥 PREMIUM

Image : https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800

Vidéo : (laissez vide si pas de vidéo)

Description : 
Extract premium de haute qualité produit par WIZARD TREES en Californie. 
Testé en laboratoire, THC 85%+. Texture crémeuse et parfaite.
```

---

## 🔄 Modifier un Produit Existant

### Ajouter des prix multiples à un produit existant :

1. Panel Admin → **Produits**
2. Cliquez sur **"Modifier"** sur un produit
3. Dans **"Prix et Quantités"**, ajoutez :
   ```
   1g|10
   3.5g|30
   7g|50
   ```
4. **Sauvegarder**

---

## ✅ Résultat Final

### Sur products.html :
- Les produits s'affichent normalement

### Clic sur un produit :
- Ouvre `product-detail.html?id=X`
- Affiche la photo ou vidéo
- Montre tous les prix disponibles
- Bouton WhatsApp pour commander

---

## 🎯 Checklist

- [ ] git pull
- [ ] wrangler d1 execute schema-products-update.sql
- [ ] npm run deploy
- [ ] python -m http.server 8005
- [ ] Panel Admin → Produits → Ajouter
- [ ] Remplir avec prix multiples
- [ ] Tester la page détails
- [ ] Tester le bouton WhatsApp

---

## 💡 Astuces

### Prix Multiples :
- Une ligne = un prix
- Format strict : `quantité|prix`
- Pas d'espaces !

### Vidéos :
- Utilisez des vidéos de moins de 10MB
- Format MP4 recommandé
- URL directe uniquement

### WhatsApp :
- Le numéro doit être dans Réseaux Sociaux
- Format : `https://wa.me/NUMERO`

---

**Votre boutique a maintenant des produits professionnels avec prix multiples !** 🎉
