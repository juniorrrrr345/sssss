// Serveur API simple pour BipCosa06
// Utilise Express.js et SQLite pour la simplicité

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Base de données SQLite
const db = new sqlite3.Database('./bipcosa06.db');

// Initialiser la base de données
db.serialize(() => {
    // Table des produits
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category_id INTEGER,
        farm_id INTEGER,
        price REAL NOT NULL,
        unit TEXT,
        image_url TEXT,
        description TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Table des catégories
    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Table des farms
    db.run(`CREATE TABLE IF NOT EXISTS farms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        region TEXT,
        logo_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Table des services
    db.run(`CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        display_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Table des paramètres
    db.run(`CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
    )`);

    // Insérer des données par défaut si vide
    db.get("SELECT COUNT(*) as count FROM categories", (err, row) => {
        if (row.count === 0) {
            const categories = [
                ['Fleurs Premium', '🌺', 'Nos meilleures sélections'],
                ['Résines', '💎', 'Résines de haute qualité'],
                ['Huiles', '🧪', 'Extraits concentrés'],
                ['Accessoires', '🔧', 'Tout le nécessaire']
            ];
            const stmt = db.prepare("INSERT INTO categories (name, icon, description) VALUES (?, ?, ?)");
            categories.forEach(cat => stmt.run(cat));
            stmt.finalize();
        }
    });

    // Paramètres par défaut
    db.get("SELECT COUNT(*) as count FROM settings", (err, row) => {
        if (row.count === 0) {
            const settings = [
                ['shop_name', 'BipCosa06'],
                ['shop_description', 'Votre boutique de confiance'],
                ['shop_whatsapp', '+33612345678'],
                ['shop_telegram', '@bipcosa06'],
                ['shop_instagram', '@bipcosa06']
            ];
            const stmt = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
            settings.forEach(setting => stmt.run(setting));
            stmt.finalize();
        }
    });
});

// ===== ROUTES API =====

// Route racine
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Produits
app.get('/api/products', (req, res) => {
    const { category, active } = req.query;
    let query = `
        SELECT p.*, c.name as category_name, f.name as farm_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN farms f ON p.farm_id = f.id
        WHERE 1=1
    `;
    const params = [];

    if (category) {
        query += " AND p.category_id = ?";
        params.push(category);
    }
    if (active !== undefined) {
        query += " AND p.is_active = ?";
        params.push(active === 'true' ? 1 : 0);
    }

    query += " ORDER BY p.id DESC";

    db.all(query, params, (err, products) => {
        if (err) {
            res.status(500).json({ success: false, error: err.message });
        } else {
            res.json({ success: true, products });
        }
    });
});

app.get('/api/products/:id', (req, res) => {
    const query = `
        SELECT p.*, c.name as category_name, f.name as farm_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN farms f ON p.farm_id = f.id
        WHERE p.id = ?
    `;
    
    db.get(query, [req.params.id], (err, product) => {
        if (err) {
            res.status(500).json({ success: false, error: err.message });
        } else if (!product) {
            res.status(404).json({ success: false, error: 'Produit non trouvé' });
        } else {
            res.json({ success: true, product });
        }
    });
});

app.post('/api/products', (req, res) => {
    const { name, category_id, farm_id, price, unit, image_url, description, is_active } = req.body;
    
    db.run(
        `INSERT INTO products (name, category_id, farm_id, price, unit, image_url, description, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, category_id, farm_id, price, unit, image_url, description, is_active !== false ? 1 : 0],
        function(err) {
            if (err) {
                res.status(500).json({ success: false, error: err.message });
            } else {
                res.json({ success: true, id: this.lastID });
            }
        }
    );
});

app.put('/api/products/:id', (req, res) => {
    const { name, category_id, farm_id, price, unit, image_url, description, is_active } = req.body;
    
    db.run(
        `UPDATE products 
         SET name = ?, category_id = ?, farm_id = ?, price = ?, unit = ?, 
             image_url = ?, description = ?, is_active = ?
         WHERE id = ?`,
        [name, category_id, farm_id, price, unit, image_url, description, 
         is_active !== false ? 1 : 0, req.params.id],
        function(err) {
            if (err) {
                res.status(500).json({ success: false, error: err.message });
            } else {
                res.json({ success: true, changes: this.changes });
            }
        }
    );
});

app.delete('/api/products/:id', (req, res) => {
    db.run("DELETE FROM products WHERE id = ?", [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ success: false, error: err.message });
        } else {
            res.json({ success: true, changes: this.changes });
        }
    });
});

// Catégories
app.get('/api/categories', (req, res) => {
    const query = `
        SELECT c.*, COUNT(p.id) as product_count 
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
        GROUP BY c.id
        ORDER BY c.name
    `;
    
    db.all(query, [], (err, categories) => {
        if (err) {
            res.status(500).json({ success: false, error: err.message });
        } else {
            res.json({ success: true, categories });
        }
    });
});

app.post('/api/categories', (req, res) => {
    const { name, icon, description } = req.body;
    
    db.run(
        "INSERT INTO categories (name, icon, description) VALUES (?, ?, ?)",
        [name, icon, description],
        function(err) {
            if (err) {
                res.status(500).json({ success: false, error: err.message });
            } else {
                res.json({ success: true, id: this.lastID });
            }
        }
    );
});

// Farms
app.get('/api/farms', (req, res) => {
    db.all("SELECT * FROM farms ORDER BY name", [], (err, farms) => {
        if (err) {
            res.status(500).json({ success: false, error: err.message });
        } else {
            res.json({ success: true, farms });
        }
    });
});

// Services
app.get('/api/services', (req, res) => {
    db.all(
        "SELECT * FROM services WHERE is_active = 1 ORDER BY display_order, id",
        [],
        (err, services) => {
            if (err) {
                res.status(500).json({ success: false, error: err.message });
            } else {
                res.json({ success: true, services });
            }
        }
    );
});

// Paramètres
app.get('/api/settings', (req, res) => {
    db.all("SELECT key, value FROM settings", [], (err, rows) => {
        if (err) {
            res.status(500).json({ success: false, error: err.message });
        } else {
            const settings = {};
            rows.forEach(row => {
                settings[row.key] = row.value;
            });
            res.json({ success: true, settings });
        }
    });
});

app.post('/api/settings', (req, res) => {
    const { settings } = req.body;
    
    if (!settings || typeof settings !== 'object') {
        return res.status(400).json({ success: false, error: 'Invalid settings data' });
    }
    
    const stmt = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    
    Object.entries(settings).forEach(([key, value]) => {
        stmt.run(key, value);
    });
    
    stmt.finalize((err) => {
        if (err) {
            res.status(500).json({ success: false, error: err.message });
        } else {
            res.json({ success: true });
        }
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`✅ Serveur API BipCosa06 démarré sur http://localhost:${PORT}`);
    console.log(`📁 Base de données: ${path.join(__dirname, 'bipcosa06.db')}`);
});

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt du serveur...');
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('✅ Base de données fermée');
        process.exit(0);
    });
});