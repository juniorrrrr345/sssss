# 📸 Guide : Ajouter des Images aux Catégories

## ✅ Les catégories acceptent DÉJÀ les images externes !

---

## 🎯 Comment ajouter une image à une catégorie

### Étape 1 : Panel Admin

1. Ouvrez : http://localhost:8005/admin.html
2. Allez dans **Catégories**
3. Cliquez sur **"Modifier"** pour une catégorie

### Étape 2 : Entrer l'URL de l'image

Vous verrez 3 champs :
1. **Nom** : Extract, Dry-Sift, etc.
2. **Description** : (optionnel)
3. **URL de l'image** : Collez l'URL complète de l'image

---

## 📸 Formats d'URL supportés

### ✅ Imgur (Format direct)

**Attention !** Imgur a 2 types d'URLs :

❌ **Mauvais :** `https://imgur.com/a/fM30nY7` (page d'album)  
✅ **Bon :** `https://i.imgur.com/fM30nY7.jpg` (image directe)

**Comment obtenir l'URL directe :**
1. Allez sur votre image Imgur
2. Faites clic droit sur l'image
3. "Copier l'adresse de l'image"
4. Vous obtenez : `https://i.imgur.com/xxxxx.jpg`

### ✅ Unsplash

```
https://images.unsplash.com/photo-1605792657660-596af9009e82?w=500
```

### ✅ Cloudflare R2

```
https://pub-b38679a01a274648827751df94818418.r2.dev/image.jpg
```

### ✅ N'importe quelle URL directe

Toute URL qui se termine par `.jpg`, `.png`, `.webp`, etc.

---

## 🎨 Exemple Complet

### Modifier la catégorie "Extract" :

```
Panel Admin → Catégories → Modifier "Extract"

Nom : Extract
Description : Extraits premium de haute qualité
URL de l'image : https://i.imgur.com/fM30nY7.jpg
```

Puis validez !

---

## 🌐 Résultat sur categories.html

L'image apparaît avec :
- L'image en fond
- L'icône emoji par-dessus (effet overlay)
- Le nom de la catégorie
- Le nombre de produits

---

## 💡 Astuces

### Pour Imgur :

1. Uploadez votre image sur Imgur
2. Ouvrez l'image
3. Clic droit → "Copier l'adresse de l'image"
4. Collez dans le panel admin

### Format recommandé :

```
https://i.imgur.com/[code].jpg
```

Le `[code]` est unique pour chaque image (ex: fM30nY7)

---

## 📋 URLs d'images par défaut (pour tester)

### Extract (concentré)
```
https://images.unsplash.com/photo-1605792657660-596af9009e82?w=500
```

### Dry-Sift
```
https://images.unsplash.com/photo-1566054757965-20c27d98b0e2?w=500
```

### Weed (fleurs)
```
https://images.unsplash.com/photo-1587767766972-fdf899d364e6?w=500
```

### Static-Sift
```
https://images.unsplash.com/photo-1536964310528-e47dd655ecf3?w=500
```

---

## ✅ Checklist

- [ ] git pull
- [ ] Panel Admin → Catégories
- [ ] Modifier une catégorie
- [ ] Coller l'URL d'image (format direct !)
- [ ] Valider
- [ ] Recharger categories.html
- [ ] L'image apparaît ! 🎉

---

## 🚨 Problème : L'image ne s'affiche pas ?

### Vérifiez :

1. **L'URL est-elle directe ?**
   - ✅ `https://i.imgur.com/xxx.jpg`
   - ❌ `https://imgur.com/a/xxx`

2. **L'URL est-elle accessible ?**
   - Collez l'URL dans votre navigateur
   - L'image doit s'afficher directement

3. **Avez-vous rechargé la page ?**
   - Faites Ctrl + Shift + R

---

## 🎊 C'est tout !

Les catégories acceptent déjà les images externes. Utilisez simplement des URLs directes d'images ! 📸
