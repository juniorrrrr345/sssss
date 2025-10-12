-- Base de données complète pour Al Gran (Mise à jour)
-- Cloudflare D1 Database Schema

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    image_url TEXT,
    product_count INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des produits (mise à jour avec support multi-images et vidéos)
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    category_id INTEGER NOT NULL,
    farm TEXT,
    badge TEXT,
    image1 TEXT,
    image2 TEXT,
    image3 TEXT,
    image4 TEXT,
    image5 TEXT,
    video TEXT,
    stock_quantity INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    is_featured INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Table des prix (pour supporter plusieurs prix par produit)
CREATE TABLE IF NOT EXISTS product_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    gram TEXT NOT NULL,
    price REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Table des paramètres de la boutique
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des images (historique uploads R2)
CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    original_name TEXT,
    url TEXT NOT NULL,
    size INTEGER,
    mime_type TEXT,
    entity_type TEXT, -- 'product', 'category', 'settings'
    entity_id INTEGER,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des commandes (pour futur)
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled, completed
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des items de commande
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_farm ON products(farm);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_images_entity ON images(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_product_prices_product ON product_prices(product_id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER IF NOT EXISTS update_products_timestamp 
AFTER UPDATE ON products
BEGIN
    UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_categories_timestamp 
AFTER UPDATE ON categories
BEGIN
    UPDATE categories SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_orders_timestamp 
AFTER UPDATE ON orders
BEGIN
    UPDATE orders SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger pour incrémenter/décrémenter le compteur de produits dans les catégories
CREATE TRIGGER IF NOT EXISTS increment_category_count
AFTER INSERT ON products
WHEN NEW.is_active = 1
BEGIN
    UPDATE categories 
    SET product_count = product_count + 1 
    WHERE id = NEW.category_id;
END;

CREATE TRIGGER IF NOT EXISTS decrement_category_count
AFTER DELETE ON products
WHEN OLD.is_active = 1
BEGIN
    UPDATE categories 
    SET product_count = product_count - 1 
    WHERE id = OLD.category_id AND product_count > 0;
END;

CREATE TRIGGER IF NOT EXISTS update_category_count_on_status_change
AFTER UPDATE ON products
WHEN NEW.is_active != OLD.is_active
BEGIN
    UPDATE categories 
    SET product_count = product_count + (CASE WHEN NEW.is_active = 1 THEN 1 ELSE -1 END)
    WHERE id = NEW.category_id;
END;

-- Insérer les catégories par défaut
INSERT OR IGNORE INTO categories (name, slug, description, icon) VALUES
('Extract', 'extract', 'Extraits premium de haute qualité', '🔥'),
('Static-Sift', 'static-sift', 'Produits Static-Sift premium', '💎'),
('Frozen-Sift', 'frozen-sift', 'Frozen-Sift de qualité supérieure', '❄️'),
('Dry-Sift', 'dry-sift', 'Dry-Sift artisanal', '🌿'),
('Weed', 'weed', 'Fleurs premium sélectionnées', '🍃');

-- Insérer les paramètres par défaut
INSERT OR IGNORE INTO settings (key, value, description) VALUES
('shop_name', 'Al Gran', 'Nom de la boutique'),
('shop_email', 'contact@algran.com', 'Email de contact'),
('shop_phone', '+33 6 00 00 00 00', 'Numéro de téléphone'),
('contact_whatsapp', 'https://wa.me/33600000000', 'Lien WhatsApp'),
('lien_canal', 'https://t.me/algran', 'Canal Telegram'),
('lien_instagram', 'https://instagram.com/algran', 'Instagram'),
('link_trees', 'https://linktr.ee/algran', 'LinkTree'),
('admin_password', 'admin123', 'Mot de passe admin (à changer!)'),
('shop_description', 'Découvrez notre univers unique', 'Description de la boutique'),
('maintenance_mode', '0', 'Mode maintenance (0 = off, 1 = on)');
