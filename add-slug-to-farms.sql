-- Ajouter la colonne slug à la table farms
ALTER TABLE farms ADD COLUMN slug TEXT;

-- Créer un index sur slug pour les performances
CREATE INDEX IF NOT EXISTS idx_farms_slug ON farms(slug);
