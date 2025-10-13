# Script pour ajouter universal-shop-name.js à toutes les pages

Write-Host "🔧 Ajout du script universel à toutes les pages..." -ForegroundColor Green

# Liste des fichiers à modifier
$files = @(
    "products.html",
    "categories.html", 
    "contact.html",
    "product-detail.html"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Vérifier si le script n'est pas déjà ajouté
        if ($content -notmatch "universal-shop-name.js") {
            # Ajouter juste avant </body>
            $newScript = @"
<!-- Script universel pour le nom de boutique -->
<script src="universal-shop-name.js"></script>
</body>
"@
            $content = $content -replace "</body>", $newScript
            $content | Out-File -FilePath $file -Encoding UTF8 -NoNewline
            
            Write-Host "✅ Modifié: $file" -ForegroundColor Green
        } else {
            Write-Host "⏭️  Déjà à jour: $file" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Non trouvé: $file" -ForegroundColor Red
    }
}

Write-Host "`n✅ Terminé !" -ForegroundColor Green
Write-Host "`nPour tester:" -ForegroundColor Cyan
Write-Host "1. python -m http.server 8000" -ForegroundColor White
Write-Host "2. Ouvre les pages - le nom sera mis à jour automatiquement" -ForegroundColor White