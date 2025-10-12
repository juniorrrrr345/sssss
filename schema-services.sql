-- Table pour les services personnalisables
CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    icon TEXT NOT NULL,
    content TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index pour l'ordre d'affichage
CREATE INDEX IF NOT EXISTS idx_services_order ON services(display_order, is_active);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER IF NOT EXISTS update_services_timestamp 
AFTER UPDATE ON services
BEGIN
    UPDATE services SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Insérer les services par défaut
INSERT OR IGNORE INTO services (id, title, icon, content, display_order) VALUES
(1, 'Nos Services', '❤️', 'Nous vous proposons une très large sélection de produits sélectionnés par nos soins parmi ce qui se fait de mieux dans le monde. Les meilleurs prix du marché, du réassort fréquent et un service imbattable. 🚀', 1),
(2, 'Zone de Livraison', '📍', 'Livraisons/Meetup dans toute l''ile de France, le jour même, envois de France à France ou à l''international avec suivis, preuves de dépôts et assurances. 👍 😜 🌍<br><br><strong>Départements :</strong> 75, 77, 78, 91, 92, 93, 94, 95', 2);
