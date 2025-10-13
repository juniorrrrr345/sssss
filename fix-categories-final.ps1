# Script pour corriger définitivement l'encodage

Write-Host "🔧 Correction définitive de categories.html..." -ForegroundColor Green

# Lire le fichier tel quel
$content = Get-Content categories.html -Raw

# Remplacer TOUTES les versions corrompues possibles
$replacements = @{
    "CatÃƒÂ©gories" = "Catégories"
    "CatÃ©gories" = "Catégories"
    "CatÃÂ©gories" = "Catégories"
    "Nos CatÃƒÂ©gories" = "Nos Catégories"
    "Nos CatÃ©gories" = "Nos Catégories"
    "sÃƒÂ©lection" = "sélection"
    "sÃ©lection" = "sélection"
    "qualitÃƒÂ©" = "qualité"
    "qualitÃ©" = "qualité"
    "crÃƒÂ©er" = "créer"
    "crÃ©er" = "créer"
}

# Appliquer tous les remplacements
foreach ($key in $replacements.Keys) {
    $content = $content -replace [regex]::Escape($key), $replacements[$key]
}

# Chercher et remplacer le titre spécifiquement
$content = $content -replace '<h1[^>]*>[^<]*Cat[^<]*</h1>', '<h1 class="title">Nos Catégories</h1>'
$content = $content -replace '<title>[^<]*</title>', '<title>Catégories - Boutique</title>'

# Sauvegarder en UTF-8 sans BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("categories.html", $content, $utf8NoBom)

Write-Host "✅ Fichier corrigé !" -ForegroundColor Green
Write-Host "Redémarre le serveur et vide le cache du navigateur (Ctrl+F5)" -ForegroundColor Yellow