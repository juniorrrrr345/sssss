-- Table pour les farms (fermes/marques)
CREATE TABLE IF NOT EXISTS farms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    country TEXT,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index pour les farms
CREATE INDEX IF NOT EXISTS idx_farms_slug ON farms(slug);
CREATE INDEX IF NOT EXISTS idx_farms_active ON farms(is_active);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER IF NOT EXISTS update_farms_timestamp 
AFTER UPDATE ON farms
BEGIN
    UPDATE farms SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Ajouter la colonne farm_id aux produits
ALTER TABLE products ADD COLUMN farm_id INTEGER REFERENCES farms(id);

-- Insérer quelques farms par défaut
INSERT OR IGNORE INTO farms (id, name, slug, country, display_order) VALUES
(1, 'WIZARD TREES', 'wizard-trees', 'USA', 1),
(2, 'ESTATICO', 'estatico', 'USA', 2),
(3, 'KARMA CARTEL', 'karma-cartel', 'USA', 3),
(4, 'NORTH BAY GARDEN', 'north-bay-garden', 'USA', 4),
(5, 'MCAFARM', 'mcafarm', 'USA', 5),
(6, '100K', '100k', 'FR', 6),
(7, 'PREMIUM', 'premium', 'FR', 7),
(8, 'EXCLUSIVE', 'exclusive', 'FR', 8);
