#!/bin/bash

# Script pour arrêter l'environnement de développement

# Couleurs
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}========================================"
echo -e "  Arrêt de l'environnement de développement"
echo -e "========================================${NC}"
echo ""

# Lire les PIDs
if [ -f .logs/wrangler.pid ]; then
    WRANGLER_PID=$(cat .logs/wrangler.pid)
    if ps -p $WRANGLER_PID > /dev/null; then
        echo -e "${YELLOW}🛑 Arrêt de l'API Cloudflare Workers...${NC}"
        kill $WRANGLER_PID
        echo -e "${GREEN}   ✅ API arrêtée${NC}"
    else
        echo -e "${YELLOW}   ℹ️  L'API n'était pas en cours d'exécution${NC}"
    fi
    rm .logs/wrangler.pid
else
    echo -e "${YELLOW}   ℹ️  Aucun PID trouvé pour l'API${NC}"
fi

if [ -f .logs/http-server.pid ]; then
    HTTP_SERVER_PID=$(cat .logs/http-server.pid)
    if ps -p $HTTP_SERVER_PID > /dev/null; then
        echo -e "${YELLOW}🛑 Arrêt du serveur web...${NC}"
        kill $HTTP_SERVER_PID
        echo -e "${GREEN}   ✅ Serveur web arrêté${NC}"
    else
        echo -e "${YELLOW}   ℹ️  Le serveur web n'était pas en cours d'exécution${NC}"
    fi
    rm .logs/http-server.pid
else
    echo -e "${YELLOW}   ℹ️  Aucun PID trouvé pour le serveur web${NC}"
fi

echo ""
echo -e "${GREEN}✅ Environnement de développement arrêté${NC}"
echo ""
