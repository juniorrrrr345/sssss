# Script pour corriger l'encodage de products.html

Write-Host "Correction de products.html..." -ForegroundColor Yellow

# Lire le fichier
$content = Get-Content products.html -Raw

# Liste des remplacements
$replacements = @{
    "catÃ©gorie" = "catégorie"
    "CatÃ©gories" = "Catégories" 
    "gÃ©nÃ©rÃ©s" = "générés"
    "chargÃ©" = "chargé"
    "DonnÃ©es" = "Données"
    "reÃ§ues" = "reçues"
    "rÃ©ponse" = "réponse"
    "VÃ©rifiez" = "Vérifiez"
    "dÃ©marrÃ©e" = "démarrée"
    "CrÃ©er" = "Créer"
    "trouvÃ©" = "trouvé"
    "Ã‰vÃ©nements" = "Événements"
    "avancÃ©s" = "avancés"
    "bientÃ´t" = "bientôt"
    "dÃ©tail" = "détail"
    "â‚¬" = "€"
    "âœ…" = "✅"
    "â³" = "⏳"
    "âš ï¸" = "⚠️"
    "âŒ" = "❌"
    "ðŸš€" = "🚀"
    "ðŸ"¦" = "📦"
    "ðŸ"¡" = "📡"
    "ðŸŽ¯" = "🎯"
    "ðŸ–±ï¸" = "🖱️"
}

# Appliquer les remplacements
foreach ($old in $replacements.Keys) {
    $content = $content -replace [regex]::Escape($old), $replacements[$old]
}

# Sauvegarder
[System.IO.File]::WriteAllText("products.html", $content, [System.Text.Encoding]::UTF8)

Write-Host "✅ Fichier corrigé !" -ForegroundColor Green