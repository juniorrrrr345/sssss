-- Table pour les services personnalisables
CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    icon TEXT NOT NULL,
    content TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Supprimer les anciens services
DELETE FROM services;

-- Insérer les services par défaut
INSERT INTO services (id, title, icon, content, display_order) VALUES
(1, 'Nos Services', '❤️', 'Bienvenue sur Al Gran ! Nous vous proposons une très large sélection de produits sélectionnés par nos soins parmi ce qui se fait de mieux dans le monde. Les meilleurs prix du marché, du réassort fréquent et un service imbattable. 🚀', 1),
(2, 'Zone de Livraison', '📍', 'Livraisons/Meetup dans toute l''île de France, le jour même, envois de France à France ou à l''international avec suivis, preuves de dépôts et assurances. 👍 😜 🌍<br><br><strong>Départements :</strong> 75, 77, 78, 91, 92, 93, 94, 95', 2),
(3, 'Meetup Paris', '🤝', 'Possibilité de meetup dans Paris et environs. Contactez-nous pour organiser une rencontre !', 3);
