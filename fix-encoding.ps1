# Script pour corriger l'encodage UTF-8 de tous les fichiers HTML

Write-Host "🔧 Correction de l'encodage des fichiers HTML..." -ForegroundColor Green

$files = @(
    "home.html",
    "products.html",
    "categories.html",
    "contact.html",
    "product-detail.html",
    "admin.html"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        # Lire avec détection automatique et sauvegarder en UTF-8
        $content = Get-Content $file -Raw
        
        # S'assurer que la balise meta charset est présente
        if ($content -notmatch '<meta charset="UTF-8"') {
            $content = $content -replace '<head>', '<head>`n    <meta charset="UTF-8">'
        }
        
        # Sauvegarder en UTF-8 sans BOM
        $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
        [System.IO.File]::WriteAllText($file, $content, $utf8NoBom)
        
        Write-Host "✅ Corrigé: $file" -ForegroundColor Green
    }
}

Write-Host "`n✅ Encodage corrigé ! Les caractères spéciaux devraient s'afficher correctement." -ForegroundColor Green