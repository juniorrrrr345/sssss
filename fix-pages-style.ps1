# Script pour uniformiser le style des pages

Write-Host "🎨 Uniformisation du style des pages..." -ForegroundColor Yellow

# Template commun pour toutes les pages
$commonHead = @'
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="black-white-override.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
'@

$commonBodyStart = @'
    <div class="cosmic-background"></div>
    <div class="bubbles-container">
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
    </div>
'@

# Créer categories.html avec le bon style
$categoriesHTML = @"
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catégories</title>
$commonHead
</head>
<body>
$commonBodyStart

    <div class="container">
        <h1 class="title" style="color: #fff; font-weight: 900; text-shadow: 3px 3px 6px rgba(0, 0, 0, 1), 0 0 10px rgba(0, 0, 0, 1);">Nos Catégories</h1>
        
        <div id="categoriesGrid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; max-width: 1200px; margin: 2rem auto;">
            <!-- Catégories chargées ici -->
        </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
        <a href="home.html" class="nav-item">
            <div class="nav-icon-circle">
                <i class="fas fa-home"></i>
            </div>
            <span class="nav-label">Accueil</span>
        </a>
        <a href="products.html" class="nav-item">
            <div class="nav-icon-circle">
                <i class="fas fa-shopping-bag"></i>
            </div>
            <span class="nav-label">Produits</span>
        </a>
        <a href="categories.html" class="nav-item active">
            <div class="nav-icon-circle">
                <i class="fas fa-th"></i>
            </div>
            <span class="nav-label">Catégories</span>
        </a>
        <a href="contact.html" class="nav-item">
            <div class="nav-icon-circle">
                <i class="fas fa-envelope"></i>
            </div>
            <span class="nav-label">Contact</span>
        </a>
    </nav>

    <script src="config.js"></script>
    <script src="theme-loader.js"></script>
    <script>
        async function loadCategories() {
            try {
                const response = await fetch((window.API_URL || 'https://algran-api.calitek-junior.workers.dev') + '/api/categories');
                const data = await response.json();
                
                if (data.success && data.categories) {
                    const grid = document.getElementById('categoriesGrid');
                    grid.innerHTML = data.categories.map(cat => `
                        <a href="products.html?category=\${cat.id}" class="category-card" style="display: block; background: rgba(255,255,255,0.05); border: 2px solid #fff; border-radius: 15px; overflow: hidden; text-decoration: none; color: white; transition: all 0.3s;">
                            <div style="height: 200px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; overflow: hidden;">
                                \${cat.image_url ? 
                                    `<img src="\${cat.image_url}" alt="\${cat.name}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                                    `<span style="font-size: 4rem;">\${getIcon(cat.name)}</span>`
                                }
                            </div>
                            <div style="padding: 1.5rem;">
                                <h3 style="font-size: 1.5rem; font-weight: 900; margin-bottom: 0.5rem;">\${cat.name}</h3>
                                <p style="margin-bottom: 1rem; opacity: 0.9;">\${cat.description || ''}</p>
                                <p style="font-weight: bold;">\${cat.product_count || 0} produits</p>
                            </div>
                        </a>
                    `).join('');
                    
                    // Ajouter hover effect
                    document.querySelectorAll('.category-card').forEach(card => {
                        card.onmouseover = function() {
                            this.style.transform = 'translateY(-5px)';
                            this.style.boxShadow = '0 10px 30px rgba(255,255,255,0.3)';
                        };
                        card.onmouseout = function() {
                            this.style.transform = '';
                            this.style.boxShadow = '';
                        };
                    });
                }
            } catch (error) {
                console.error('Erreur:', error);
            }
        }
        
        function getIcon(name) {
            const icons = {
                'Extract': '🔥',
                'Static-Sift': '💎',
                'Frozen-Sift': '❄️',
                'Dry-Sift': '🌿',
                'Weed': '🍃',
                'Ye': '✨'
            };
            return icons[name] || '📦';
        }
        
        document.addEventListener('DOMContentLoaded', loadCategories);
    </script>
</body>
</html>
"@

# Créer products.html avec le bon style
$productsHTML = @"
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Produits</title>
$commonHead
</head>
<body>
$commonBodyStart

    <div class="container">
        <h1 class="title" style="color: #fff; font-weight: 900; text-shadow: 3px 3px 6px rgba(0, 0, 0, 1), 0 0 10px rgba(0, 0, 0, 1);">Tous les Produits</h1>
        
        <div style="display: flex; gap: 15px; margin: 2rem auto; max-width: 800px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 250px; position: relative;">
                <i class="fas fa-search" style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.7);"></i>
                <input type="text" id="searchInput" placeholder="Rechercher par nom..." style="width: 100%; padding: 15px 15px 15px 45px; border-radius: 25px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: white;">
            </div>
        </div>

        <div id="productsGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px;">
            <!-- Produits chargés ici -->
        </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
        <a href="home.html" class="nav-item">
            <div class="nav-icon-circle">
                <i class="fas fa-home"></i>
            </div>
            <span class="nav-label">Accueil</span>
        </a>
        <a href="products.html" class="nav-item active">
            <div class="nav-icon-circle">
                <i class="fas fa-shopping-bag"></i>
            </div>
            <span class="nav-label">Produits</span>
        </a>
        <a href="categories.html" class="nav-item">
            <div class="nav-icon-circle">
                <i class="fas fa-th"></i>
            </div>
            <span class="nav-label">Catégories</span>
        </a>
        <a href="contact.html" class="nav-item">
            <div class="nav-icon-circle">
                <i class="fas fa-envelope"></i>
            </div>
            <span class="nav-label">Contact</span>
        </a>
    </nav>

    <script src="config.js"></script>
    <script src="theme-loader.js"></script>
    <script>
        let allProducts = [];
        
        async function loadProducts() {
            const grid = document.getElementById('productsGrid');
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: white;">⏳ Chargement...</div>';
            
            try {
                const response = await fetch((window.API_URL || 'https://algran-api.calitek-junior.workers.dev') + '/api/products');
                const data = await response.json();
                
                if (data.success && data.products) {
                    allProducts = data.products.filter(p => p.is_active);
                    displayProducts(allProducts);
                }
            } catch (error) {
                console.error('Erreur:', error);
                grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #ff6b6b;">Erreur de chargement</div>';
            }
        }

        function displayProducts(products) {
            const grid = document.getElementById('productsGrid');
            
            if (products.length === 0) {
                grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: white;">Aucun produit trouvé</div>';
                return;
            }
            
            grid.innerHTML = products.map(product => `
                <div onclick="window.location.href='product-detail.html?id=\${product.id}'" style="background: rgba(255,255,255,0.05); border: 2px solid #fff; border-radius: 20px; overflow: hidden; cursor: pointer; transition: all 0.3s;">
                    <div style="height: 200px; background: rgba(255,255,255,0.1); position: relative;">
                        \${product.image_url ? `<img src="\${product.image_url}" style="width: 100%; height: 100%; object-fit: cover;">` : ''}
                    </div>
                    <div style="padding: 20px;">
                        <h3 style="color: #fff; font-weight: 900; text-transform: uppercase; margin-bottom: 10px;">\${product.name}</h3>
                        \${product.farm_name ? `<p style="color: #fff; margin-bottom: 10px;">🌿 \${product.farm_name}</p>` : ''}
                        <p style="color: #fff; font-size: 1.5rem; font-weight: 900;">\${product.price}€ <span style="font-size: 0.9rem;">\${product.unit || ''}</span></p>
                    </div>
                </div>
            `).join('');
            
            // Ajouter hover effect
            document.querySelectorAll('#productsGrid > div').forEach(card => {
                card.onmouseover = function() {
                    this.style.transform = 'translateY(-8px)';
                    this.style.boxShadow = '0 15px 40px rgba(255,255,255,0.3)';
                };
                card.onmouseout = function() {
                    this.style.transform = '';
                    this.style.boxShadow = '';
                };
            });
        }

        document.getElementById('searchInput').addEventListener('input', (e) => {
            const search = e.target.value.toLowerCase();
            const filtered = allProducts.filter(p => 
                p.name.toLowerCase().includes(search) ||
                (p.category_name && p.category_name.toLowerCase().includes(search))
            );
            displayProducts(filtered);
        });

        document.addEventListener('DOMContentLoaded', loadProducts);
    </script>
</body>
</html>
"@

# Sauvegarder les fichiers
[System.IO.File]::WriteAllText("categories.html", $categoriesHTML, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText("products.html", $productsHTML, [System.Text.Encoding]::UTF8)

Write-Host "✅ Pages uniformisées avec le style de contact.html !" -ForegroundColor Green
Write-Host "✅ Bulles cosmiques, ombres et effets inclus !" -ForegroundColor Green
Write-Host "🔄 Relance le serveur et rafraîchis les pages" -ForegroundColor Yellow