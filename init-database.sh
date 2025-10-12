#!/bin/bash

# Script d'initialisation de la base de données Cloudflare D1
# Al Gran - Admin Panel Setup

echo "🚀 Initialisation de la base de données Al Gran"
echo "================================================"

# Configuration
ACCOUNT_ID="7979421604bd07b3bd34d3ed96222512"
DATABASE_ID="5ee52135-17f2-43ee-80a8-c20fcaee99d5"

echo ""
echo "📋 Informations de configuration:"
echo "Account ID: $ACCOUNT_ID"
echo "Database ID: $DATABASE_ID"
echo ""

# Vérifier si wrangler est installé
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler n'est pas installé"
    echo "📦 Installation de Wrangler..."
    npm install -g wrangler
fi

echo "✅ Wrangler est installé"
echo ""

# Authentification (si nécessaire)
echo "🔐 Vérification de l'authentification..."
wrangler whoami 2>/dev/null || {
    echo "⚠️  Vous devez vous authentifier avec Wrangler"
    echo "Exécutez: wrangler login"
    exit 1
}

echo "✅ Authentifié"
echo ""

# Exécuter le schéma SQL
echo "📊 Création des tables dans D1..."
wrangler d1 execute algran-db --file=schema.sql --remote

if [ $? -eq 0 ]; then
    echo "✅ Tables créées avec succès !"
else
    echo "❌ Erreur lors de la création des tables"
    exit 1
fi

echo ""
echo "🎉 Base de données initialisée avec succès !"
echo ""
echo "📝 Prochaines étapes:"
echo "1. Déployez l'API Workers: npm run deploy"
echo "2. Ouvrez admin.html dans votre navigateur"
echo "3. Connectez-vous avec le mot de passe: admin123"
echo ""
echo "⚠️  N'oubliez pas de changer le mot de passe admin !"
