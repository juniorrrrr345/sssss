-- Schéma de base de données pour Cloudflare D1

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

-- Table des farms
CREATE TABLE IF NOT EXISTS farms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

-- Table des produits
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  media_url TEXT,
  media_type TEXT DEFAULT 'image',
  category_id INTEGER,
  farm_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY(farm_id) REFERENCES farms(id) ON DELETE SET NULL
);

-- Table des prix (relation 1-N avec products)
CREATE TABLE IF NOT EXISTS prices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  qty TEXT NOT NULL,
  price TEXT NOT NULL,
  FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Table des réseaux sociaux
CREATE TABLE IF NOT EXISTS socials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  url TEXT NOT NULL
);

-- Table des paramètres du site
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY,
  shop_name TEXT DEFAULT 'Avec Amour',
  theme_bg_url TEXT,
  command_url TEXT
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_farm ON products(farm_id);
CREATE INDEX IF NOT EXISTS idx_prices_product ON prices(product_id);

-- Données initiales par défaut
INSERT OR IGNORE INTO settings (id, shop_name) VALUES (1, 'Avec Amour');

-- Exemples de catégories
INSERT OR IGNORE INTO categories (name) VALUES 
  ('Fleurs'),
  ('Extraits'),
  ('Huiles'),
  ('Comestibles');

-- Exemples de farms
INSERT OR IGNORE INTO farms (name) VALUES 
  ('Farm Californie'),
  ('Farm Amsterdam'),
  ('Farm Espagne');