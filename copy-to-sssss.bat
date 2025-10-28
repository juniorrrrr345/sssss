@echo off
echo ===============================================
echo    Installation de BipCosa06 Shop
echo ===============================================
echo.

REM Créer les dossiers nécessaires
echo Création de la structure des dossiers...
mkdir public\css 2>nul
mkdir public\js 2>nul
mkdir public\images 2>nul
mkdir admin 2>nul
mkdir api 2>nul

REM Copier les fichiers HTML publics
echo.
echo Copie des fichiers HTML...
copy /Y bipcosa06-shop\public\index.html public\index.html
copy /Y bipcosa06-shop\public\products.html public\products.html
copy /Y bipcosa06-shop\public\product-detail.html public\product-detail.html
copy /Y bipcosa06-shop\public\categories.html public\categories.html
copy /Y bipcosa06-shop\public\contact.html public\contact.html

REM Copier les fichiers CSS
echo.
echo Copie des fichiers CSS...
copy /Y bipcosa06-shop\public\css\style.css public\css\style.css
copy /Y bipcosa06-shop\public\css\home-style.css public\css\home-style.css
copy /Y bipcosa06-shop\public\css\black-white-override.css public\css\black-white-override.css

REM Copier les fichiers JavaScript
echo.
echo Copie des fichiers JavaScript...
copy /Y bipcosa06-shop\public\js\config.js public\js\config.js
copy /Y bipcosa06-shop\public\js\theme-loader.js public\js\theme-loader.js

REM Copier les fichiers admin
echo.
echo Copie du panneau d'administration...
copy /Y bipcosa06-shop\admin\index.html admin\index.html
copy /Y bipcosa06-shop\admin\admin.js admin\admin.js
copy /Y bipcosa06-shop\admin\admin-style.css admin\admin-style.css

REM Copier l'API (optionnel)
echo.
echo Copie de l'API backend...
copy /Y bipcosa06-shop\api\server.js api\server.js
copy /Y bipcosa06-shop\api\package.json api\package.json

REM Copier le README
copy /Y bipcosa06-shop\README.md README_BIPCOSA06.md

echo.
echo ===============================================
echo    Installation terminée !
echo ===============================================
echo.
echo Pour démarrer le site :
echo 1. Ouvrez public\index.html dans votre navigateur
echo.
echo Pour accéder à l'administration :
echo 1. Ouvrez admin\index.html
echo 2. Mot de passe : admin123
echo.
echo Pour utiliser l'API (optionnel) :
echo 1. Installez Node.js
echo 2. cd api
echo 3. npm install
echo 4. npm start
echo.
pause