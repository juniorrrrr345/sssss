# Script pour enlever le nom de boutique des pages

Write-Host "🔧 Suppression du nom de boutique des pages..." -ForegroundColor Green

# Fonction pour nettoyer un fichier
function Remove-ShopName {
    param($file)
    
    if (Test-Path $file) {
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Remplacer les occurrences de "Al Gran" dans les titres
        $patterns = @(
            # Pour products.html
            '<div class="logo-text"[^>]*>Al Gran</div>',
            '<div class="logo-text"[^>]*>COFFEELA55</div>',
            '<div class="logo-text"[^>]*>[^<]+</div>',
            # Pour d'autres formats possibles
            '<h1[^>]*>Al Gran[^<]*</h1>',
            '<div[^>]*class="[^"]*shop-name[^"]*"[^>]*>[^<]+</div>'
        )
        
        foreach ($pattern in $patterns) {
            # Remplacer par une chaîne vide ou un espace
            $content = $content -replace $pattern, ''
        }
        
        # Pour products.html spécifiquement - enlever toute la div logo-text
        if ($file -eq "products.html") {
            $content = $content -replace '<div class="logo-text"[^>]*style="[^"]*">[^<]*</div>', ''
        }
        
        # Sauvegarder
        $content | Out-File -FilePath $file -Encoding UTF8 -NoNewline
        Write-Host "✅ Nettoyé: $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Non trouvé: $file" -ForegroundColor Red
    }
}

# Nettoyer les fichiers
Remove-ShopName "products.html"
Remove-ShopName "categories.html"
Remove-ShopName "contact.html"

Write-Host "`n✅ Terminé ! Le nom de boutique a été supprimé des pages." -ForegroundColor Green