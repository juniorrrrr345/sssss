-- Vérifier et ajouter seulement farm_id si elle n'existe pas
-- SQLite ne supporte pas IF NOT EXISTS pour ALTER TABLE, donc on utilise une approche différente

-- Créer un index sur farm_id (cela échouera silencieusement si la colonne n'existe pas)
CREATE INDEX IF NOT EXISTS idx_products_farm_id ON products(farm_id);

-- Si vous voyez une erreur "no such column: farm_id", exécutez ces commandes une par une :
-- ALTER TABLE products ADD COLUMN farm_id INTEGER;
-- ALTER TABLE products ADD COLUMN video_url TEXT;
-- ALTER TABLE products ADD COLUMN prices TEXT;
