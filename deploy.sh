#!/bin/bash

# Script de déploiement automatique - Boutique Al Gran
# Pour Linux/Mac/WSL

echo "========================================"
echo "  Déploiement Boutique Al Gran"
echo "========================================"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Fonction pour vérifier si une commande existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Étape 1 : Vérifier Node.js
echo -e "${YELLOW}[1/7] Vérification de Node.js...${NC}"
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js installé : $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js n'est pas installé !${NC}"
    echo -e "${RED}   Téléchargez-le sur : https://nodejs.org${NC}"
    exit 1
fi

# Étape 2 : Installer les dépendances npm
echo ""
echo -e "${YELLOW}[2/7] Installation des dépendances...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dépendances installées${NC}"
else
    echo -e "${RED}❌ Erreur lors de l'installation${NC}"
    exit 1
fi

# Étape 3 : Vérifier Wrangler
echo ""
echo -e "${YELLOW}[3/7] Vérification de Wrangler...${NC}"
if command_exists wrangler; then
    echo -e "${GREEN}✅ Wrangler déjà installé${NC}"
else
    echo -e "${YELLOW}⏳ Installation de Wrangler...${NC}"
    npm install -g wrangler
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Wrangler installé${NC}"
    else
        echo -e "${RED}❌ Erreur lors de l'installation de Wrangler${NC}"
        exit 1
    fi
fi

# Étape 4 : Vérifier l'authentification
echo ""
echo -e "${YELLOW}[4/7] Vérification de l'authentification Cloudflare...${NC}"
AUTH_CHECK=$(wrangler whoami 2>&1)
if echo "$AUTH_CHECK" | grep -q "not authenticated"; then
    echo -e "${YELLOW}⚠️  Vous n'êtes pas connecté à Cloudflare${NC}"
    echo -e "${YELLOW}   Lancement de l'authentification...${NC}"
    wrangler login
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Erreur d'authentification${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Authentification réussie${NC}"
else
    echo -e "${GREEN}✅ Déjà authentifié à Cloudflare${NC}"
fi

# Étape 5 : Vérifier/Créer la base de données
echo ""
echo -e "${YELLOW}[5/7] Vérification de la base de données D1...${NC}"
DB_LIST=$(wrangler d1 list 2>&1)
if echo "$DB_LIST" | grep -q "algran-db"; then
    echo -e "${GREEN}✅ Base de données 'algran-db' existe déjà${NC}"
else
    echo -e "${YELLOW}⏳ Création de la base de données...${NC}"
    CREATE_DB=$(wrangler d1 create algran-db 2>&1)
    echo "$CREATE_DB"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT: Copiez le 'database_id' ci-dessus et mettez-le dans wrangler.toml !${NC}"
    echo -e "${YELLOW}   Appuyez sur Entrée une fois que c'est fait...${NC}"
    read -r
fi

# Étape 6 : Initialiser le schéma
echo ""
echo -e "${YELLOW}[6/7] Initialisation du schéma de la base de données...${NC}"
wrangler d1 execute algran-db --file=schema.sql --remote
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Schéma initialisé avec succès${NC}"
else
    echo -e "${YELLOW}⚠️  Vérifiez si le schéma a été créé${NC}"
fi

# Étape 7 : Déployer l'API
echo ""
echo -e "${YELLOW}[7/7] Déploiement de l'API sur Cloudflare Workers...${NC}"
DEPLOY_OUTPUT=$(npm run deploy 2>&1)
echo "$DEPLOY_OUTPUT"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  ✅ DÉPLOIEMENT RÉUSSI !${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    
    # Extraire l'URL du Worker
    WORKER_URL=$(echo "$DEPLOY_OUTPUT" | grep -oP 'https://[a-zA-Z0-9\-\.]+\.workers\.dev' | head -1)
    if [ -n "$WORKER_URL" ]; then
        echo -e "${CYAN}🔗 URL de votre API : $WORKER_URL${NC}"
        echo ""
        echo -e "${YELLOW}📝 PROCHAINES ÉTAPES :${NC}"
        echo -e "   1. Ouvrez le fichier 'admin.js'"
        echo -e "   2. Ligne 7, remplacez l'URL par :"
        echo -e "${CYAN}      const API_URL = '$WORKER_URL';${NC}"
        echo -e "   3. Sauvegardez le fichier"
        echo ""
        echo -e "${YELLOW}🚀 LANCER LE SERVEUR LOCAL :${NC}"
        echo -e "${CYAN}   python3 -m http.server 8000${NC}"
        echo -e "   ou"
        echo -e "${CYAN}   npx http-server -p 8000${NC}"
        echo ""
        echo -e "${YELLOW}🌐 ACCÉDER À LA BOUTIQUE :${NC}"
        echo -e "${CYAN}   Panel Admin  : http://localhost:8000/admin.html${NC}"
        echo -e "${CYAN}   Boutique     : http://localhost:8000/products-complete.html${NC}"
        echo -e "${CYAN}   Mot de passe : admin123${NC}"
    fi
else
    echo ""
    echo -e "${RED}❌ Erreur lors du déploiement${NC}"
    echo -e "${YELLOW}   Consultez le guide DEPLOIEMENT_FACILE.md${NC}"
fi

echo ""
echo "========================================"
echo "  Déploiement terminé !"
echo "========================================"
