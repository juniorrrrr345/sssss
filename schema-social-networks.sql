-- Nouvelle table pour les réseaux sociaux personnalisables
CREATE TABLE IF NOT EXISTS social_networks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index pour l'ordre d'affichage
CREATE INDEX IF NOT EXISTS idx_social_networks_order ON social_networks(display_order, is_active);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER IF NOT EXISTS update_social_networks_timestamp 
AFTER UPDATE ON social_networks
BEGIN
    UPDATE social_networks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
