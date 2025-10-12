# Script PowerShell pour démarrer l'environnement de développement
# Al Gran - Boutique Cloudflare

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Al Gran - Démarrage Environnement Dev" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que npm est installé
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Erreur : npm n'est pas installé" -ForegroundColor Red
    Write-Host "   Installez Node.js depuis https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Vérifier que python est installé
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Erreur : python n'est pas installé" -ForegroundColor Red
    Write-Host "   Installez Python depuis https://www.python.org" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Prérequis vérifiés" -ForegroundColor Green
Write-Host ""

# Démarrer l'API Cloudflare Workers dans un nouveau terminal
Write-Host "🚀 Démarrage de l'API Cloudflare Workers (port 8787)..." -ForegroundColor Yellow
$apiCommand = "npx wrangler dev --port 8787 --local"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '🔌 API Cloudflare Workers' -ForegroundColor Cyan; Write-Host ''; $apiCommand"

# Attendre un peu que l'API démarre
Start-Sleep -Seconds 3

# Démarrer le serveur web dans un nouveau terminal
Write-Host "🌐 Démarrage du serveur web (port 8005)..." -ForegroundColor Yellow
$webCommand = "python -m http.server 8005"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '🌐 Serveur Web' -ForegroundColor Cyan; Write-Host ''; $webCommand"

# Attendre que tout démarre
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ Environnement démarré avec succès !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs disponibles :" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Panel Admin    : " -NoNewline
Write-Host "http://localhost:8005/admin.html" -ForegroundColor Yellow
Write-Host "  Mot de passe   : " -NoNewline
Write-Host "votre_nouveau_mot_de_passe" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Page d'accueil : " -NoNewline
Write-Host "http://localhost:8005/home.html" -ForegroundColor Yellow
Write-Host "  Produits       : " -NoNewline
Write-Host "http://localhost:8005/products.html" -ForegroundColor Yellow
Write-Host "  Catégories     : " -NoNewline
Write-Host "http://localhost:8005/categories-dynamic.html" -ForegroundColor Yellow
Write-Host "  Contact        : " -NoNewline
Write-Host "http://localhost:8005/contact.html" -ForegroundColor Yellow
Write-Host ""
Write-Host "  API directe    : " -NoNewline
Write-Host "http://localhost:8787" -ForegroundColor Yellow
Write-Host ""
Write-Host "🛑 Pour arrêter : Fermez les deux fenêtres PowerShell" -ForegroundColor Red
Write-Host ""
Write-Host "Appuyez sur une touche pour fermer cette fenêtre..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
