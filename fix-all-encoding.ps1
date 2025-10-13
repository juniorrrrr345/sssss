# Script pour corriger TOUS les problèmes d'encodage

Write-Host "🔧 Correction complète de l'encodage..." -ForegroundColor Green

# Fonction pour corriger un fichier
function Fix-FileEncoding {
    param($file)
    
    if (Test-Path $file) {
        Write-Host "📄 Correction de $file..." -ForegroundColor Yellow
        
        # Lire le contenu
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Remplacer tous les caractères mal encodés
        $replacements = @{
            # Caractères accentués
            "Ã©" = "é"
            "Ã¨" = "è"
            "Ã " = "à"
            "Ã¢" = "â"
            "Ãª" = "ê"
            "Ã´" = "ô"
            "Ã§" = "ç"
            "Ã¹" = "ù"
            "Ã®" = "î"
            "Ã«" = "ë"
            "Ã¯" = "ï"
            
            # Double encodage
            "Ã©" = "é"
            "Ã¨" = "è"
            "ÃƒÂ©" = "é"
            "ÃƒÂ¨" = "è"
            "Ãƒ " = "à"
            
            # Emojis mal encodés
            "ðŸ"¥" = "🔥"
            "ðŸ'Ž" = "💎"
            "â„ï¸" = "❄️"
            "ðŸŒ¿" = "🌿"
            "ðŸƒ" = "🍃"
            "ðŸ"—" = "🔗"
            
            # Mots complets
            "diffÃ©rentes" = "différentes"
            "CatÃ©gories" = "Catégories"
            "qualitÃ©" = "qualité"
            "supÃ©rieure" = "supérieure"
            "sÃ©lectionnÃ©es" = "sélectionnées"
        }
        
        # Appliquer tous les remplacements
        foreach ($key in $replacements.Keys) {
            $content = $content -replace [regex]::Escape($key), $replacements[$key]
        }
        
        # Sauvegarder en UTF-8 sans BOM
        $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
        [System.IO.File]::WriteAllText($file, $content, $utf8NoBom)
        
        Write-Host "✅ $file corrigé !" -ForegroundColor Green
    }
}

# Corriger tous les fichiers HTML
$files = @("categories.html", "products.html", "contact.html", "home.html", "product-detail.html")

foreach ($file in $files) {
    Fix-FileEncoding $file
}

Write-Host "`n✨ Terminé ! Tous les fichiers sont corrigés." -ForegroundColor Green
Write-Host "`n📝 Instructions :" -ForegroundColor Cyan
Write-Host "1. Arrête le serveur (Ctrl+C)" -ForegroundColor White
Write-Host "2. Relance-le : python -m http.server 8000" -ForegroundColor White
Write-Host "3. Vide le cache du navigateur (Ctrl+F5)" -ForegroundColor White
Write-Host "4. Ou ouvre un nouvel onglet privé (Ctrl+Shift+N)" -ForegroundColor White