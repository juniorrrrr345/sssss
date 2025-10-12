#!/bin/bash

# Script d'initialisation de la base de données Al Gran
# Ce script crée le schéma et insère des données d'exemple

echo "🚀 Initialisation de la base de données Al Gran..."
echo ""

# 1. Créer les tables
echo "📝 Création des tables..."
wrangler d1 execute algran-db --file=schema-updated.sql

echo ""
echo "✅ Tables créées avec succès!"
echo ""

# 2. Insérer des produits d'exemple
echo "📦 Insertion des produits d'exemple..."

# Récupérer les IDs des catégories
echo "SELECT id, name FROM categories;" | wrangler d1 execute algran-db

# Insérer quelques produits d'exemple
wrangler d1 execute algran-db --command="
INSERT INTO products (name, slug, description, category_id, farm, badge, image1, image2, image3, video, is_active, is_featured)
VALUES 
  ('100K ROSIN', '100k-rosin', 'Extrait premium de haute qualité', 1, '100K', '🔥 LIVE ROSIN', 
   'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&h=600&fit=crop',
   'https://images.unsplash.com/photo-1536964310528-e47dd655ecf3?w=800&h=600&fit=crop',
   'https://images.unsplash.com/photo-1603909075879-2c6e224fd5bb?w=800&h=600&fit=crop',
   NULL, 1, 1),
   
  ('HASH BURGER', 'hash-burger', 'Produit Static-Sift premium', 2, 'ESTATICO', '💎 FROZEN USA', 
   'https://images.unsplash.com/photo-1536964310528-e47dd655ecf3?w=800&h=600&fit=crop',
   'https://images.unsplash.com/photo-1566054757965-20c27d98b0e2?w=800&h=600&fit=crop',
   NULL, NULL, 1, 1),
   
  ('POTION', 'potion', 'Fleur premium californienne', 5, 'WIZARD TREES', '🌿 TOPSHELF CALIFORNIA BRANDED', 
   'https://images.unsplash.com/photo-1603909075879-2c6e224fd5bb?w=800&h=600&fit=crop',
   'https://images.unsplash.com/photo-1587767766972-fdf899d364e6?w=800&h=600&fit=crop',
   NULL, NULL, 1, 1),
   
  ('ZANGBANGER', 'zangbanger', 'Fleur californienne de qualité', 5, 'WIZARD TREES', '🔥 TOPSHELF CALIFORNIA BRANDED', 
   'https://images.unsplash.com/photo-1566054757965-20c27d98b0e2?w=800&h=600&fit=crop',
   NULL, NULL, NULL, 1, 0),
   
  ('TOP DRY', 'top-dry', 'Dry-Sift artisanal', 4, 'MCAFARM', '💨 DRY', 
   'https://images.unsplash.com/photo-1587767766972-fdf899d364e6?w=800&h=600&fit=crop',
   NULL, NULL, NULL, 1, 0);
"

echo ""
echo "✅ Produits insérés avec succès!"
echo ""

# 3. Insérer les prix pour chaque produit
echo "💰 Insertion des prix..."
wrangler d1 execute algran-db --command="
INSERT INTO product_prices (product_id, gram, price)
VALUES 
  (1, '2g', 200),
  (1, '5g', 450),
  (1, '10g', 850),
  
  (2, '3.5g', 120),
  (2, '5g', 160),
  (2, '10g', 300),
  
  (3, '3.5g', 110),
  (3, '7g', 200),
  (3, '14g', 380),
  
  (4, '3.5g', 110),
  (4, '7g', 200),
  
  (5, '3g', 50),
  (5, '5g', 80),
  (5, '10g', 150);
"

echo ""
echo "✅ Prix insérés avec succès!"
echo ""

# 4. Afficher un résumé
echo "📊 Résumé de la base de données:"
echo ""
wrangler d1 execute algran-db --command="
SELECT 
  (SELECT COUNT(*) FROM categories WHERE is_active = 1) as categories_actives,
  (SELECT COUNT(*) FROM products WHERE is_active = 1) as produits_actifs,
  (SELECT COUNT(*) FROM product_prices) as prix_total;
"

echo ""
echo "✨ Initialisation terminée avec succès!"
echo ""
echo "🔗 Pour tester votre API:"
echo "   wrangler dev"
echo ""
echo "📝 Endpoints disponibles:"
echo "   GET  /api/products"
echo "   GET  /api/products/:id"
echo "   GET  /api/products/category/:category"
echo "   GET  /api/categories"
echo "   GET  /api/links"
echo ""
