# Solution finale pour corriger l'encodage

Write-Host "🔨 Correction FINALE de products.html..." -ForegroundColor Yellow

# Lire le fichier en tant que bytes
$bytes = [System.IO.File]::ReadAllBytes("products.html")

# Convertir en string avec différents encodages pour trouver le bon
$text = [System.Text.Encoding]::UTF8.GetString($bytes)

# Si ça ne marche pas, essayer Latin1
if ($text -match "Ã") {
    $text = [System.Text.Encoding]::GetEncoding("ISO-8859-1").GetString($bytes)
}

# Maintenant corriger tous les problèmes
$corrections = @(
    @("catÃƒÂ©gorie", "catégorie"),
    @("catÃ©gorie", "catégorie"),
    @("CatÃƒÂ©gories", "Catégories"),
    @("CatÃ©gories", "Catégories"),
    @("â‚¬", "€"),
    @("€", "€"),
    @("Ã ", "à"),
    @("Ã©", "é"),
    @("Ã¨", "è"),
    @("gÃ©nÃ©rÃ©s", "générés"),
    @("chargÃ©", "chargé"),
    @("trouvÃ©", "trouvé"),
    @("DonnÃ©es", "Données"),
    @("reÃ§ues", "reçues"),
    @("rÃ©ponse", "réponse"),
    @("VÃ©rifiez", "Vérifiez"),
    @("dÃ©marrÃ©e", "démarrée"),
    @("CrÃ©er", "Créer"),
    @("Ã‰vÃ©nements", "Événements"),
    @("avancÃ©s", "avancés"),
    @("bientÃ´t", "bientôt"),
    @("dÃ©tail", "détail"),
    @("ðŸš€", "🚀"),
    @("ðŸ"¦", "📦"),
    @("ðŸ"¡", "📡"),
    @("âœ…", "✅"),
    @("â³", "⏳"),
    @("âš ï¸", "⚠️"),
    @("âŒ", "❌"),
    @("ðŸŽ¯", "🎯"),
    @("ðŸ–±ï¸", "🖱️")
)

# Appliquer toutes les corrections
foreach ($correction in $corrections) {
    $text = $text -replace [regex]::Escape($correction[0]), $correction[1]
}

# Sauvegarder en UTF-8 sans BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("products.html", $text, $utf8NoBom)

Write-Host "✅ Correction terminée !" -ForegroundColor Green
Write-Host "🔄 Arrête le serveur (Ctrl+C) et relance-le" -ForegroundColor Yellow
Write-Host "🌐 Ouvre un NOUVEL onglet privé (Ctrl+Shift+N)" -ForegroundColor Yellow