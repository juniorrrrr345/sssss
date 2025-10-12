#!/bin/bash

# Script Bash pour démarrer l'environnement de développement
# Al Gran - Boutique Cloudflare

# Couleurs
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================"
echo -e "  Al Gran - Démarrage Environnement Dev"
echo -e "========================================${NC}"
echo ""

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Erreur : npm n'est pas installé${NC}"
    echo -e "${YELLOW}   Installez Node.js depuis https://nodejs.org${NC}"
    exit 1
fi

# Vérifier que python est installé
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo -e "${RED}❌ Erreur : python n'est pas installé${NC}"
    echo -e "${YELLOW}   Installez Python depuis https://www.python.org${NC}"
    exit 1
fi

# Déterminer la commande Python
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
else
    PYTHON_CMD="python"
fi

echo -e "${GREEN}✅ Prérequis vérifiés${NC}"
echo ""

# Créer un dossier pour les logs
mkdir -p .logs

# Démarrer l'API Cloudflare Workers en arrière-plan
echo -e "${YELLOW}🚀 Démarrage de l'API Cloudflare Workers (port 8787)...${NC}"
npx wrangler dev --port 8787 --local > .logs/wrangler.log 2>&1 &
WRANGLER_PID=$!

# Attendre que l'API démarre
sleep 3

# Vérifier que l'API a bien démarré
if ! ps -p $WRANGLER_PID > /dev/null; then
    echo -e "${RED}❌ Erreur : L'API n'a pas pu démarrer${NC}"
    echo -e "${YELLOW}   Consultez les logs : cat .logs/wrangler.log${NC}"
    exit 1
fi

# Démarrer le serveur web en arrière-plan
echo -e "${YELLOW}🌐 Démarrage du serveur web (port 8005)...${NC}"
$PYTHON_CMD -m http.server 8005 > .logs/http-server.log 2>&1 &
HTTP_SERVER_PID=$!

# Attendre que le serveur web démarre
sleep 2

# Vérifier que le serveur web a bien démarré
if ! ps -p $HTTP_SERVER_PID > /dev/null; then
    echo -e "${RED}❌ Erreur : Le serveur web n'a pas pu démarrer${NC}"
    echo -e "${YELLOW}   Consultez les logs : cat .logs/http-server.log${NC}"
    kill $WRANGLER_PID 2>/dev/null
    exit 1
fi

# Sauvegarder les PIDs pour pouvoir les arrêter plus tard
echo $WRANGLER_PID > .logs/wrangler.pid
echo $HTTP_SERVER_PID > .logs/http-server.pid

echo ""
echo -e "${GREEN}========================================"
echo -e "  ✅ Environnement démarré avec succès !"
echo -e "========================================${NC}"
echo ""
echo -e "${CYAN}📍 URLs disponibles :${NC}"
echo ""
echo -e "  Panel Admin    : ${YELLOW}http://localhost:8005/admin.html${NC}"
echo -e "  Mot de passe   : ${YELLOW}votre_nouveau_mot_de_passe${NC}"
echo ""
echo -e "  Page d'accueil : ${YELLOW}http://localhost:8005/home.html${NC}"
echo -e "  Produits       : ${YELLOW}http://localhost:8005/products.html${NC}"
echo -e "  Catégories     : ${YELLOW}http://localhost:8005/categories-dynamic.html${NC}"
echo -e "  Contact        : ${YELLOW}http://localhost:8005/contact.html${NC}"
echo ""
echo -e "  API directe    : ${YELLOW}http://localhost:8787${NC}"
echo ""
echo -e "${CYAN}📝 Logs :${NC}"
echo -e "  API            : ${YELLOW}tail -f .logs/wrangler.log${NC}"
echo -e "  Serveur web    : ${YELLOW}tail -f .logs/http-server.log${NC}"
echo ""
echo -e "${RED}🛑 Pour arrêter   : ${YELLOW}./stop-dev.sh${NC}"
echo ""
