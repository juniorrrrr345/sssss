# Script PowerShell pour corriger le nom de boutique sur toutes les pages

Write-Host "🔧 Correction du nom de boutique dynamique..." -ForegroundColor Green

# Créer le fichier shop-name-updater.js
$shopNameUpdater = @'
// Script pour mettre à jour le nom de la boutique sur toutes les pages
(function() {
    // Attendre que config.js soit chargé
    function waitForConfig() {
        if (window.API_URL || window.config) {
            updateShopName();
        } else {
            setTimeout(waitForConfig, 100);
        }
    }

    async function updateShopName() {
        try {
            const API_URL = window.API_URL || 'https://algran-api.calitek-junior.workers.dev';
            const response = await fetch(`${API_URL}/api/settings`);
            const data = await response.json();
            
            if (data.success && data.settings && data.settings.shop_name) {
                const shopName = data.settings.shop_name;
                
                // Mettre à jour tous les éléments possibles
                const selectors = [
                    '#shopName',
                    '.shop-name',
                    '.logo-text',
                    '.site-title',
                    '.hero-title'
                ];
                
                selectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => {
                        if (el.textContent.includes('Al Gran') || 
                            el.textContent.includes('COFFEELA55') || 
                            el.textContent.includes('Avec Amour')) {
                            el.textContent = shopName;
                        }
                    });
                });
                
                // Mettre à jour le titre de la page
                if (document.title.includes('Al Gran')) {
                    document.title = document.title.replace('Al Gran', shopName);
                }
                
                console.log('✅ Nom de boutique mis à jour:', shopName);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du nom:', error);
        }
    }

    // Lancer au chargement de la page
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForConfig);
    } else {
        waitForConfig();
    }
    
    // Réessayer après 2 secondes au cas où
    setTimeout(updateShopName, 2000);
})();
'@

# Sauvegarder shop-name-updater.js
$shopNameUpdater | Out-File -FilePath "shop-name-updater.js" -Encoding UTF8
Write-Host "✅ Créé shop-name-updater.js" -ForegroundColor Green

# Fonction pour ajouter le script à un fichier HTML
function Add-ShopNameScript {
    param($file)
    
    if (Test-Path $file) {
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Vérifier si le script n'est pas déjà ajouté
        if ($content -notmatch "shop-name-updater.js") {
            # Ajouter avant la fermeture du body
            $newScript = @"

<!-- Script pour mettre à jour le nom de la boutique -->
<script src="shop-name-updater.js"></script>
</body>
"@
            $content = $content -replace "</body>", $newScript
            
            # Ajouter API_CONFIG si nécessaire
            if ($content -match "API_CONFIG" -and $content -notmatch "window.API_URL") {
                $apiConfig = @"
<script>
// Configuration API pour cette page
window.API_URL = 'https://algran-api.calitek-junior.workers.dev';
</script>
"@
                $content = $content -replace "(<script src=`"config.js`"></script>)", "$apiConfig`n`$1"
            }
            
            $content | Out-File -FilePath $file -Encoding UTF8
            Write-Host "✅ Modifié $file" -ForegroundColor Green
        } else {
            Write-Host "⏭️  $file déjà à jour" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Fichier non trouvé: $file" -ForegroundColor Red
    }
}

# Modifier les fichiers HTML
Add-ShopNameScript "products.html"
Add-ShopNameScript "categories.html"
Add-ShopNameScript "contact.html"
Add-ShopNameScript "product-detail.html"

Write-Host "`n✅ Terminé ! Le nom de la boutique sera maintenant dynamique sur toutes les pages." -ForegroundColor Green
Write-Host "`n📝 Pour tester:" -ForegroundColor Cyan
Write-Host "1. Lance le serveur: python -m http.server 8000" -ForegroundColor White
Write-Host "2. Va dans l'admin et change le nom de la boutique" -ForegroundColor White
Write-Host "3. Recharge les autres pages pour voir le changement" -ForegroundColor White