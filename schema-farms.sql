-- Table pour les farms (fermes/marques)
CREATE TABLE IF NOT EXISTS farms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    country TEXT,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insérer quelques farms par défaut
INSERT OR IGNORE INTO farms (id, name, country, display_order) VALUES
(1, 'WIZARD TREES', 'USA', 1),
(2, 'ESTATICO', 'USA', 2),
(3, 'KARMA CARTEL', 'USA', 3),
(4, 'NORTH BAY GARDEN', 'USA', 4),
(5, 'MCAFARM', 'USA', 5),
(6, '100K', 'FR', 6),
(7, 'PREMIUM', 'FR', 7),
(8, 'EXCLUSIVE', 'FR', 8);
