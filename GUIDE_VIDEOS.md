# 🎬 GUIDE : Vidéos sur les Produits

## ✅ Formats d'URL Vidéo Supportés

### 1. Imgur (Recommandé !)

**Format :**
```
https://i.imgur.com/AV9ubk2.mp4
```

**Comment obtenir l'URL :**
1. Uploadez votre vidéo sur Imgur
2. Ouvrez la vidéo
3. Clic droit → "Copier l'adresse de la vidéo"
4. Vous obtenez : `https://i.imgur.com/xxxxx.mp4`

**✅ Avantages Imgur :**
- Gratuit
- Rapide
- Hébergement fiable
- Format MP4 direct

---

### 2. Cloudflare R2

**Format :**
```
https://pub-xxxxx.r2.dev/video.mp4
```

---

### 3. N'importe quelle URL MP4 directe

**Format :**
```
https://example.com/ma-video.mp4
```

**Important :** L'URL doit se terminer par `.mp4`

---

## 📦 Ajouter une Vidéo à un Produit

### 1. Panel Admin → Produits → Ajouter/Modifier

### 2. Remplissez le champ "URL de la vidéo"

**Exemple avec Imgur :**
```
https://i.imgur.com/AV9ubk2.mp4
```

### 3. Sauvegardez

### 4. Testez !

Cliquez sur le produit dans `products.html` → La vidéo s'affiche et joue automatiquement ! 🎥

---

## 🎥 Fonctionnalités de la Vidéo

- ✅ **Autoplay** - Se lance automatiquement (muet)
- ✅ **Loop** - Boucle infinie
- ✅ **Muted** - Son coupé par défaut (l'utilisateur peut l'activer)
- ✅ **Controls** - L'utilisateur peut mettre pause, changer le volume, etc.
- ✅ **Playsinline** - Joue directement sur mobile (pas en plein écran)

---

## 💡 Conseils pour les Vidéos

### Taille :
- **Maximum recommandé :** 50MB
- **Idéal :** 10-20MB

### Durée :
- **Idéal :** 10-30 secondes
- **Maximum :** 1 minute

### Résolution :
- **Mobile :** 720p (1280x720)
- **Desktop :** 1080p (1920x1080)

### Format :
- **MP4** (H.264 codec)
- **Compression :** Utilisez HandBrake ou FFmpeg

---

## 🔧 Exemple Complet

### Produit : Extract Premium avec Vidéo

```
Nom : Extract Premium
Catégorie : Extract
Farm : WIZARD TREES

Prix et Quantités :
1g|10
3.5g|30
7g|55

Badge : 🔥 PREMIUM

Image : https://i.imgur.com/xxxxx.jpg

Vidéo : https://i.imgur.com/AV9ubk2.mp4

Description : Extract premium avec texture parfaite
```

---

## ❓ Pourquoi ma vidéo ne s'affiche pas ?

### Vérifications :

1. **L'URL est-elle directe ?**
   - ✅ `https://i.imgur.com/xxxxx.mp4`
   - ❌ `https://imgur.com/a/xxxxx`

2. **Le format est-il MP4 ?**
   - ✅ `.mp4`
   - ❌ `.mov`, `.avi`, `.mkv`

3. **L'URL est-elle accessible ?**
   - Collez l'URL dans votre navigateur
   - La vidéo doit se charger directement

---

## 📱 Sur Mobile

Les vidéos fonctionnent aussi sur mobile avec :
- **Playsinline** - Pas de plein écran forcé
- **Autoplay muté** - Se lance automatiquement
- **Controls** - L'utilisateur peut contrôler

---

## 🎯 Priorité Vidéo vs Image

**Si un produit a à la fois une image et une vidéo :**
- ✅ La **vidéo** s'affiche en priorité
- ❌ L'image est ignorée

**Si vous voulez afficher l'image :**
- Laissez le champ "URL de la vidéo" vide

---

## ✅ Résumé

**Format recommandé :**
```
https://i.imgur.com/xxxxx.mp4
```

**Dans le panel admin :**
```
URL de la vidéo : https://i.imgur.com/AV9ubk2.mp4
```

**Résultat :**
- La vidéo s'affiche sur la page détails
- Autoplay + Loop
- Controls disponibles
- Fonctionne sur mobile et desktop

---

**Vos produits peuvent maintenant avoir des vidéos !** 🎬
