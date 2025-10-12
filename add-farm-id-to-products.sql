-- Ajouter la colonne farm_id à la table products
ALTER TABLE products ADD COLUMN farm_id INTEGER;

-- Ajouter la colonne video_url si elle n'existe pas
ALTER TABLE products ADD COLUMN video_url TEXT;

-- Ajouter la colonne prices si elle n'existe pas
ALTER TABLE products ADD COLUMN prices TEXT;

-- Créer un index sur farm_id pour les performances
CREATE INDEX IF NOT EXISTS idx_products_farm_id ON products(farm_id);
