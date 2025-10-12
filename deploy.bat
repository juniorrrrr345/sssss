@echo off
chcp 65001 >nul
color 0B

echo ========================================
echo   Déploiement Boutique Al Gran
echo ========================================
echo.

REM Étape 1 : Vérifier Node.js
echo [1/7] Vérification de Node.js...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js n'est pas installé !
    echo    Téléchargez-le sur : https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js installé : %NODE_VERSION%

REM Étape 2 : Installer les dépendances npm
echo.
echo [2/7] Installation des dépendances...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors de l'installation
    pause
    exit /b 1
)
echo ✅ Dépendances installées

REM Étape 3 : Vérifier Wrangler
echo.
echo [3/7] Vérification de Wrangler...
where wrangler >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ⏳ Installation de Wrangler...
    call npm install -g wrangler
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Erreur lors de l'installation de Wrangler
        pause
        exit /b 1
    )
    echo ✅ Wrangler installé
) else (
    echo ✅ Wrangler déjà installé
)

REM Étape 4 : Vérifier l'authentification
echo.
echo [4/7] Vérification de l'authentification Cloudflare...
wrangler whoami 2>&1 | find "not authenticated" >nul
if %ERRORLEVEL% EQU 0 (
    echo ⚠️  Vous n'êtes pas connecté à Cloudflare
    echo    Lancement de l'authentification...
    call wrangler login
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Erreur d'authentification
        pause
        exit /b 1
    )
    echo ✅ Authentification réussie
) else (
    echo ✅ Déjà authentifié à Cloudflare
)

REM Étape 5 : Vérifier/Créer la base de données
echo.
echo [5/7] Vérification de la base de données D1...
wrangler d1 list 2>&1 | find "algran-db" >nul
if %ERRORLEVEL% NEQ 0 (
    echo ⏳ Création de la base de données...
    wrangler d1 create algran-db
    echo.
    echo ⚠️  IMPORTANT: Copiez le 'database_id' ci-dessus 
    echo    et mettez-le dans wrangler.toml !
    echo    Appuyez sur une touche une fois que c'est fait...
    pause >nul
) else (
    echo ✅ Base de données 'algran-db' existe déjà
)

REM Étape 6 : Initialiser le schéma
echo.
echo [6/7] Initialisation du schéma de la base de données...
wrangler d1 execute algran-db --file=schema.sql --remote
if %ERRORLEVEL% EQU 0 (
    echo ✅ Schéma initialisé avec succès
) else (
    echo ⚠️  Vérifiez si le schéma a été créé
)

REM Étape 7 : Déployer l'API
echo.
echo [7/7] Déploiement de l'API sur Cloudflare Workers...
call npm run deploy

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ✅ DÉPLOIEMENT RÉUSSI !
    echo ========================================
    echo.
    echo 📝 PROCHAINES ÉTAPES :
    echo    1. Copiez l'URL de votre API ci-dessus
    echo    2. Ouvrez le fichier 'admin.js'
    echo    3. Ligne 7, remplacez l'URL par votre URL Workers
    echo    4. Sauvegardez le fichier
    echo.
    echo 🚀 LANCER LE SERVEUR LOCAL :
    echo    python -m http.server 8000
    echo.
    echo 🌐 ACCÉDER À LA BOUTIQUE :
    echo    Panel Admin  : http://localhost:8000/admin.html
    echo    Boutique     : http://localhost:8000/products-complete.html
    echo    Mot de passe : admin123
) else (
    echo.
    echo ❌ Erreur lors du déploiement
    echo    Consultez le guide DEPLOIEMENT_FACILE.md
)

echo.
echo ========================================
echo   Déploiement terminé !
echo ========================================
echo.
pause
