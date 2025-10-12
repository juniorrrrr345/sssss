# Script de déploiement automatique - Boutique Al Gran
# Pour Windows PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Déploiement Boutique Al Gran" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Fonction pour vérifier si une commande existe
function Test-Command($command) {
    try {
        if (Get-Command $command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Étape 1 : Vérifier Node.js
Write-Host "[1/7] Vérification de Node.js..." -ForegroundColor Yellow
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installé : $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js n'est pas installé !" -ForegroundColor Red
    Write-Host "   Téléchargez-le sur : https://nodejs.org" -ForegroundColor Red
    exit
}

# Étape 2 : Installer les dépendances npm
Write-Host ""
Write-Host "[2/7] Installation des dépendances..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dépendances installées" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors de l'installation" -ForegroundColor Red
    exit
}

# Étape 3 : Vérifier Wrangler
Write-Host ""
Write-Host "[3/7] Vérification de Wrangler..." -ForegroundColor Yellow
if (Test-Command "wrangler") {
    Write-Host "✅ Wrangler déjà installé" -ForegroundColor Green
} else {
    Write-Host "⏳ Installation de Wrangler..." -ForegroundColor Yellow
    npm install -g wrangler
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Wrangler installé" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur lors de l'installation de Wrangler" -ForegroundColor Red
        exit
    }
}

# Étape 4 : Vérifier l'authentification
Write-Host ""
Write-Host "[4/7] Vérification de l'authentification Cloudflare..." -ForegroundColor Yellow
$authCheck = wrangler whoami 2>&1
if ($authCheck -match "not authenticated") {
    Write-Host "⚠️  Vous n'êtes pas connecté à Cloudflare" -ForegroundColor Yellow
    Write-Host "   Lancement de l'authentification..." -ForegroundColor Yellow
    wrangler login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur d'authentification" -ForegroundColor Red
        exit
    }
    Write-Host "✅ Authentification réussie" -ForegroundColor Green
} else {
    Write-Host "✅ Déjà authentifié à Cloudflare" -ForegroundColor Green
}

# Étape 5 : Vérifier/Créer la base de données
Write-Host ""
Write-Host "[5/7] Vérification de la base de données D1..." -ForegroundColor Yellow
$dbList = wrangler d1 list 2>&1
if ($dbList -match "algran-db") {
    Write-Host "✅ Base de données 'algran-db' existe déjà" -ForegroundColor Green
} else {
    Write-Host "⏳ Création de la base de données..." -ForegroundColor Yellow
    $createDb = wrangler d1 create algran-db 2>&1
    Write-Host $createDb
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Copiez le 'database_id' ci-dessus et mettez-le dans wrangler.toml !" -ForegroundColor Yellow
    Write-Host "   Appuyez sur Entrée une fois que c'est fait..." -ForegroundColor Yellow
    Read-Host
}

# Étape 6 : Initialiser le schéma
Write-Host ""
Write-Host "[6/7] Initialisation du schéma de la base de données..." -ForegroundColor Yellow
wrangler d1 execute algran-db --file=schema.sql --remote
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Schéma initialisé avec succès" -ForegroundColor Green
} else {
    Write-Host "⚠️  Vérifiez si le schéma a été créé" -ForegroundColor Yellow
}

# Étape 7 : Déployer l'API
Write-Host ""
Write-Host "[7/7] Déploiement de l'API sur Cloudflare Workers..." -ForegroundColor Yellow
$deployOutput = npm run deploy 2>&1
Write-Host $deployOutput

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ DÉPLOIEMENT RÉUSSI !" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    # Extraire l'URL du Worker
    if ($deployOutput -match "https://[a-zA-Z0-9\-\.]+\.workers\.dev") {
        $workerUrl = $matches[0]
        Write-Host "🔗 URL de votre API : $workerUrl" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📝 PROCHAINES ÉTAPES :" -ForegroundColor Yellow
        Write-Host "   1. Ouvrez le fichier 'admin.js'" -ForegroundColor White
        Write-Host "   2. Ligne 7, remplacez l'URL par :" -ForegroundColor White
        Write-Host "      const API_URL = '$workerUrl';" -ForegroundColor Cyan
        Write-Host "   3. Sauvegardez le fichier" -ForegroundColor White
        Write-Host ""
        Write-Host "🚀 LANCER LE SERVEUR LOCAL :" -ForegroundColor Yellow
        Write-Host "   python -m http.server 8000" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "🌐 ACCÉDER À LA BOUTIQUE :" -ForegroundColor Yellow
        Write-Host "   Panel Admin  : http://localhost:8000/admin.html" -ForegroundColor Cyan
        Write-Host "   Boutique     : http://localhost:8000/products-complete.html" -ForegroundColor Cyan
        Write-Host "   Mot de passe : admin123" -ForegroundColor Cyan
    }
} else {
    Write-Host ""
    Write-Host "❌ Erreur lors du déploiement" -ForegroundColor Red
    Write-Host "   Consultez le guide DEPLOIEMENT_FACILE.md" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Déploiement terminé !" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
