#!/bin/bash

# Script de démarrage pour BipCosa06 Shop

echo "🚀 Démarrage de BipCosa06 Shop..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    echo "Visitez: https://nodejs.org/"
    exit 1
fi

# Vérifier si on veut démarrer l'API
if [ "$1" == "api" ]; then
    echo "📦 Installation des dépendances API..."
    cd api
    npm install
    echo "✅ Démarrage du serveur API..."
    npm start
else
    echo "🌐 Ouverture du site en mode statique..."
    
    # Détecter l'OS et ouvrir le navigateur
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open public/index.html
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open public/index.html
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        # Windows
        start public/index.html
    else
        echo "⚠️  Impossible d'ouvrir automatiquement le navigateur."
        echo "Ouvrez manuellement: public/index.html"
    fi
    
    echo ""
    echo "✅ Site ouvert dans votre navigateur!"
    echo ""
    echo "📝 Pour accéder à l'administration:"
    echo "   Ouvrez: admin/index.html"
    echo "   Mot de passe: admin123"
    echo ""
    echo "💡 Pour démarrer avec l'API:"
    echo "   ./start.sh api"
fi