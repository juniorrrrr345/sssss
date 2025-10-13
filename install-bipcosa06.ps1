# Script PowerShell pour installer BipCosa06 Shop

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "    Installation de BipCosa06 Shop" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Créer la structure des dossiers
Write-Host "Création des dossiers..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path ".\public\css" | Out-Null
New-Item -ItemType Directory -Force -Path ".\public\js" | Out-Null
New-Item -ItemType Directory -Force -Path ".\public\images" | Out-Null
New-Item -ItemType Directory -Force -Path ".\admin" | Out-Null
New-Item -ItemType Directory -Force -Path ".\api" | Out-Null

Write-Host "✓ Dossiers créés" -ForegroundColor Green

# Fonction pour créer les fichiers
function Create-File {
    param(
        [string]$Path,
        [string]$Content
    )
    $Content | Out-File -FilePath $Path -Encoding UTF8
    Write-Host "✓ Créé: $Path" -ForegroundColor Green
}

# Créer config.js
$configJS = @'
// Configuration de l'API
const API_CONFIG = {
    BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : 'https://api.bipcosa06.com',
    ENDPOINTS: {
        PRODUCTS: '/api/products',
        CATEGORIES: '/api/categories',
        SETTINGS: '/api/settings',
        SERVICES: '/api/services',
        FARMS: '/api/farms',
        ORDERS: '/api/orders'
    }
};

function getApiUrl(endpoint) {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
}

async function fetchApi(endpoint, options = {}) {
    try {
        const url = getApiUrl(endpoint);
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur API:', error);
        return { success: false, error: error.message };
    }
}

function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Erreur sauvegarde localStorage:', error);
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Erreur lecture localStorage:', error);
        return null;
    }
}

const DEFAULT_SETTINGS = {
    shop_name: 'BipCosa06',
    shop_description: 'Votre boutique de confiance',
    theme_color: '#1e90ff',
    currency: '€',
    contact_email: 'contact@bipcosa06.com'
};
'@

Create-File -Path ".\public\js\config.js" -Content $configJS

# Créer un fichier start.bat pour Windows
$startBat = @'
@echo off
echo ===============================================
echo     BipCosa06 Shop - Démarrage
echo ===============================================
echo.
echo Ouverture du site dans votre navigateur...
start public\index.html
echo.
echo Site ouvert !
echo.
echo Pour accéder à l'administration :
echo   Ouvrez : admin\index.html
echo   Mot de passe : admin123
echo.
pause
'@

Create-File -Path ".\start.bat" -Content $startBat

Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host "    Installation terminée !" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Pour démarrer :" -ForegroundColor Cyan
Write-Host "  .\start.bat" -ForegroundColor White
Write-Host ""
Write-Host "Pour l'administration :" -ForegroundColor Cyan
Write-Host "  Ouvrez admin\index.html" -ForegroundColor White
Write-Host "  Mot de passe : admin123" -ForegroundColor White
Write-Host ""