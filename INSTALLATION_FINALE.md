# 🚀 INSTALLATION FINALE - AL GRAN

## ⚠️ IMPORTANT : Suivez ces étapes dans l'ordre !

---

## 📥 ÉTAPE 1 : Récupérer tous les fichiers

```powershell
cd C:\Users\PC\Documents\sssss
git pull origin cursor/deploy-local-web-store-from-github-901c
```

---

## 🗄️ ÉTAPE 2 : Créer TOUTES les tables dans la base de données

### Table 1 : Services
```powershell
wrangler d1 execute algran-db --file=schema-services.sql --remote
```

### Table 2 : Social Networks
```powershell
wrangler d1 execute algran-db --file=schema-social-networks.sql --remote
```

### Table 3 : Farms
```powershell
wrangler d1 execute algran-db --file=schema-farms.sql --remote
```

---

## 🚀 ÉTAPE 3 : Redéployer l'API

```powershell
npm run deploy
```

**Attendez que le déploiement soit terminé !**

---

## ✅ ÉTAPE 4 : Tester

```powershell
python -m http.server 8005
```

Puis ouvrez :
- http://localhost:8005/admin.html
- Mot de passe : **admin123**

---

## 🎯 Vérifications

### Dans le Panel Admin :

1. **Dashboard** ✅
   - Voir les stats

2. **Produits** ✅
   - Ajouter un produit
   - Voir la liste

3. **Catégories** ✅
   - Modifier une catégorie
   - Ajouter une image

4. **Services** ✅
   - Si vous voyez "Aucun service" → OK !
   - Cliquez "Ajouter un Service"

5. **Réseaux Sociaux** ✅
   - Si vous voyez "Aucun réseau social configuré" → OK !
   - Cliquez "Ajouter un Réseau Social"

6. **Paramètres** ✅
   - Modifier le nom : "Al Gran"
   - Modifier le sous-titre : "Amour"
   - Email

---

## 🆕 Ajouter vos premiers services

### Service 1 : Nos Services
```
Titre : Nos Services
Icône : ❤️
Contenu : Bienvenue ! Nous proposons une sélection premium de produits. Les meilleurs prix du marché ! 🚀
Ordre : 1
```

### Service 2 : Zone de Livraison
```
Titre : Zone de Livraison
Icône : 📍
Contenu : Livraisons/Meetup dans toute l'Île-de-France : 75, 77, 78, 91, 92, 93, 94, 95
Ordre : 2
```

### Service 3 : Meetup
```
Titre : Meetup Paris
Icône : 🤝
Contenu : Possibilité de meetup dans Paris et environs. Contactez-nous !
Ordre : 3
```

---

## 🌐 Ajouter vos réseaux sociaux

### WhatsApp
```
Nom : WhatsApp
Icône : 📱
URL : https://wa.me/33612345678
Ordre : 1
```

### Telegram
```
Nom : Telegram
Icône : ✈️
URL : https://t.me/ssssss
Ordre : 2
```

### Email
```
Nom : Email
Icône : ✉️
URL : mailto:contact@algran.com
Ordre : 3
```

---

## 🌿 Ajouter les Farms (optionnel maintenant)

Les farms sont déjà pré-créés dans la base :
- WIZARD TREES
- ESTATICO
- KARMA CARTEL
- NORTH BAY GARDEN
- MCAFARM
- 100K
- PREMIUM
- EXCLUSIVE

Vous pouvez en ajouter plus depuis le panel admin !

---

## 📋 Si "Chargement..." ne disparaît pas

**Cela signifie que les tables n'existent pas encore !**

### Solution : Exécutez les 3 commandes de l'ÉTAPE 2

```powershell
# Dans cet ordre :
wrangler d1 execute algran-db --file=schema-services.sql --remote
wrangler d1 execute algran-db --file=schema-social-networks.sql --remote
wrangler d1 execute algran-db --file=schema-farms.sql --remote

# Puis redéployez :
npm run deploy
```

---

## 🎊 Pages Web

Après avoir configuré le panel admin, testez vos pages :

### 1. home.html
- **Nom boutique** : Al Gran (modifiable)
- **Sous-titre** : Amour (modifiable)
- **Services** : Affichés depuis le panel admin

### 2. products.html
- **Filtres** : Catégories + Farms (déroulants)
- **Recherche** : En temps réel
- **Produits** : Depuis le panel admin

### 3. categories.html
- **Grille 2 colonnes**
- **Images des catégories**
- **Compteurs de produits**

### 4. contact.html
- **Réseaux sociaux** : Depuis le panel admin
- **Cartes cliquables**

---

## ✨ Fonctionnalités Complètes

### Panel Admin (6 sections)
1. 📊 **Dashboard** - Statistiques
2. 📦 **Produits** - CRUD complet
3. 📂 **Catégories** - CRUD + images
4. 🔔 **Services** - CRUD (nouveau !)
5. 🌐 **Réseaux Sociaux** - CRUD (nouveau !)
6. ⚙️ **Paramètres** - Nom + Sous-titre + Email

### Pages Web (4 pages)
1. 🏠 **home.html** - Services dynamiques
2. 🛍️ **products.html** - Filtres + Recherche
3. 📦 **categories.html** - Grille avec images
4. ✉️ **contact.html** - Réseaux sociaux

---

## 🔐 Sécurité

**CHANGEZ LE MOT DE PASSE PAR DÉFAUT !**

1. Panel Admin → Paramètres
2. Mot de passe admin : *(entrez un nouveau)*
3. Sauvegarder

---

## 📞 Problèmes Courants

### Problème 1 : "Chargement..." infini
**Solution** : Créer les tables (ÉTAPE 2) puis redéployer (ÉTAPE 3)

### Problème 2 : API ne répond pas
**Solution** :
```powershell
npm run deploy
```

### Problème 3 : Produits ne s'affichent pas
**Solution** : Vérifiez que vous avez ajouté des produits dans le panel admin

### Problème 4 : Filtres vides sur products.html
**Solution** : Ajoutez des catégories et farms dans le panel admin

---

## 🎯 Checklist Finale

- [ ] git pull
- [ ] wrangler d1 execute (3 fichiers SQL)
- [ ] npm run deploy
- [ ] python -m http.server 8005
- [ ] Admin accessible
- [ ] Dashboard fonctionne
- [ ] Services : "Aucun service" (normal)
- [ ] Réseaux Sociaux : "Aucun réseau" (normal)
- [ ] Ajouté au moins 1 service
- [ ] Ajouté au moins 1 réseau social
- [ ] Ajouté au moins 1 produit
- [ ] home.html affiche le nom personnalisé
- [ ] products.html affiche les filtres
- [ ] categories.html en grille 2 colonnes
- [ ] contact.html affiche les réseaux sociaux
- [ ] Changé le mot de passe admin

---

## 🎊 C'EST TOUT !

Votre boutique **Al Gran** est maintenant 100% fonctionnelle ! 🚀

- ✅ Panel admin complet
- ✅ 4 pages web synchronisées
- ✅ Services personnalisables
- ✅ Réseaux sociaux personnalisables
- ✅ Filtres dynamiques
- ✅ Recherche en temps réel
- ✅ Design unifié et moderne

---

**Made with ❤️ for Al Gran**
