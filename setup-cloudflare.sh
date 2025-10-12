#!/bin/bash

# Script de configuration complète Cloudflare pour Al Gran
# Ce script configure automatiquement votre boutique avec Cloudflare

set -e

echo "🚀 Configuration Cloudflare pour Al Gran"
echo "========================================="
echo ""

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ACCOUNT_ID="7979421604bd07b3bd34d3ed96222512"
DATABASE_ID="5ee52135-17f2-43ee-80a8-c20fcaee99d5"
DATABASE_NAME="algran-db"
R2_BUCKET="boutique-images"

echo -e "${BLUE}📋 Configuration:${NC}"
echo "   Account ID: $ACCOUNT_ID"
echo "   Database: $DATABASE_NAME"
echo "   R2 Bucket: $R2_BUCKET"
echo ""

# Étape 1: Vérifier Wrangler
echo -e "${BLUE}📦 Étape 1/6: Vérification de Wrangler...${NC}"
if ! command -v wrangler &> /dev/null && ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ Wrangler et npx ne sont pas installés${NC}"
    echo "Installez Node.js et npm, puis exécutez: npm install"
    exit 1
fi

if command -v wrangler &> /dev/null; then
    WRANGLER_CMD="wrangler"
else
    WRANGLER_CMD="npx wrangler"
fi

echo -e "${GREEN}✅ Wrangler est disponible${NC}"
echo ""

# Étape 2: Vérifier l'authentification
echo -e "${BLUE}🔐 Étape 2/6: Vérification de l'authentification...${NC}"
if ! $WRANGLER_CMD whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vous devez vous authentifier avec Cloudflare${NC}"
    echo ""
    echo "Exécutez la commande suivante dans votre terminal:"
    echo -e "${GREEN}$WRANGLER_CMD login${NC}"
    echo ""
    echo "Puis relancez ce script."
    exit 1
fi

echo -e "${GREEN}✅ Authentification réussie${NC}"
$WRANGLER_CMD whoami
echo ""

# Étape 3: Vérifier la base de données D1
echo -e "${BLUE}📊 Étape 3/6: Vérification de la base de données D1...${NC}"
if $WRANGLER_CMD d1 list | grep -q "$DATABASE_NAME"; then
    echo -e "${GREEN}✅ La base de données '$DATABASE_NAME' existe${NC}"
else
    echo -e "${YELLOW}⚠️  La base de données '$DATABASE_NAME' n'existe pas${NC}"
    echo "Création de la base de données..."
    $WRANGLER_CMD d1 create "$DATABASE_NAME"
fi
echo ""

# Étape 4: Initialiser le schéma de la base de données
echo -e "${BLUE}🗄️  Étape 4/6: Initialisation du schéma de la base de données...${NC}"
echo "Exécution de schema.sql sur la base distante..."
$WRANGLER_CMD d1 execute "$DATABASE_NAME" --file=schema.sql --remote

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Schéma de base de données initialisé${NC}"
else
    echo -e "${YELLOW}⚠️  Le schéma a peut-être déjà été initialisé (erreurs ignorées)${NC}"
fi
echo ""

# Étape 5: Vérifier le bucket R2
echo -e "${BLUE}🪣 Étape 5/6: Vérification du bucket R2...${NC}"
if $WRANGLER_CMD r2 bucket list | grep -q "$R2_BUCKET"; then
    echo -e "${GREEN}✅ Le bucket R2 '$R2_BUCKET' existe${NC}"
else
    echo -e "${YELLOW}⚠️  Le bucket R2 '$R2_BUCKET' n'existe pas${NC}"
    echo "Création du bucket R2..."
    $WRANGLER_CMD r2 bucket create "$R2_BUCKET"
fi
echo ""

# Étape 6: Déployer l'API Workers
echo -e "${BLUE}🚀 Étape 6/6: Déploiement de l'API Cloudflare Workers...${NC}"
echo "Déploiement en cours..."
$WRANGLER_CMD deploy

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ API déployée avec succès !${NC}"
else
    echo -e "${RED}❌ Erreur lors du déploiement${NC}"
    exit 1
fi
echo ""

# Obtenir l'URL de l'API déployée
echo -e "${BLUE}🔗 Récupération de l'URL de l'API...${NC}"
API_URL=$($WRANGLER_CMD deployments list --name=algran-api 2>/dev/null | grep -oP 'https://[^\s]+workers\.dev' | head -1)

if [ -z "$API_URL" ]; then
    echo -e "${YELLOW}⚠️  Impossible de récupérer automatiquement l'URL${NC}"
    echo ""
    echo "Exécutez la commande suivante pour voir vos déploiements:"
    echo -e "${GREEN}$WRANGLER_CMD deployments list${NC}"
    echo ""
    echo "Votre URL devrait ressembler à:"
    echo "https://algran-api.VOTRE-SUBDOMAIN.workers.dev"
    echo ""
else
    echo -e "${GREEN}✅ URL de l'API: $API_URL${NC}"
    echo ""
    
    # Mettre à jour admin.js avec la nouvelle URL
    echo -e "${BLUE}📝 Mise à jour de admin.js avec l'URL de production...${NC}"
    sed -i.bak "s|const API_URL = 'http://localhost:8787';|const API_URL = '$API_URL';|g" admin.js
    echo -e "${GREEN}✅ admin.js mis à jour${NC}"
fi

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}🎉 Configuration Cloudflare terminée !${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${BLUE}📝 Prochaines étapes:${NC}"
echo ""
echo "1. Vérifiez votre API:"
if [ ! -z "$API_URL" ]; then
    echo -e "   ${GREEN}curl $API_URL${NC}"
else
    echo "   curl https://algran-api.VOTRE-SUBDOMAIN.workers.dev"
fi
echo ""
echo "2. Ouvrez le panel admin:"
echo -e "   ${GREEN}Ouvrez admin.html dans votre navigateur${NC}"
echo ""
echo "3. Connectez-vous avec:"
echo "   Mot de passe: admin123"
echo -e "   ${RED}⚠️  Changez ce mot de passe immédiatement !${NC}"
echo ""
echo "4. Si vous utilisez le frontend React:"
echo "   - Allez dans le dossier frontend/"
echo "   - Créez un fichier .env"
if [ ! -z "$API_URL" ]; then
    echo -e "   - Ajoutez: ${GREEN}REACT_APP_API_URL=$API_URL/api${NC}"
else
    echo "   - Ajoutez: REACT_APP_API_URL=https://algran-api.VOTRE-SUBDOMAIN.workers.dev/api"
fi
echo "   - Exécutez: npm start"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "   README.md - Guide complet"
echo "   GUIDE_INSTALLATION.md - Installation détaillée"
echo ""
echo -e "${GREEN}🚀 Votre boutique Al Gran est prête !${NC}"
