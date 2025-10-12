-- Nouvelle table pour les réseaux sociaux personnalisables
CREATE TABLE IF NOT EXISTS social_networks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Supprimer les anciens réseaux
DELETE FROM social_networks;

-- Insérer des exemples de réseaux sociaux
INSERT INTO social_networks (id, name, icon, url, display_order) VALUES
(1, 'WhatsApp', '📱', 'https://wa.me/33612345678', 1),
(2, 'Telegram', '✈️', 'https://t.me/algran', 2),
(3, 'Instagram', '📸', 'https://instagram.com/algran', 3),
(4, 'Email', '✉️', 'mailto:contact@algran.com', 4);
