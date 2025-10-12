/**
 * API Cloudflare Workers pour Al Gran
 * Gestion complète des produits, catégories et paramètres
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route racine - Documentation de l'API
      if (path === '/' && method === 'GET') {
        return jsonResponse({
          success: true,
          name: 'Al Gran API',
          version: '1.0.0',
          endpoints: {
            products: {
              'GET /api/products': 'Liste tous les produits',
              'GET /api/products/:id': 'Récupère un produit spécifique',
              'POST /api/products': 'Crée un nouveau produit',
              'PUT /api/products/:id': 'Modifie un produit',
              'DELETE /api/products/:id': 'Supprime un produit'
            },
            categories: {
              'GET /api/categories': 'Liste toutes les catégories',
              'POST /api/categories': 'Crée une nouvelle catégorie',
              'PUT /api/categories/:id': 'Modifie une catégorie'
            },
            settings: {
              'GET /api/settings': 'Récupère les paramètres',
              'PUT /api/settings': 'Met à jour les paramètres'
            },
            stats: {
              'GET /api/stats': 'Statistiques de la boutique'
            },
            services: {
              'GET /api/services': 'Liste tous les services',
              'POST /api/services': 'Crée un nouveau service',
              'PUT /api/services/:id': 'Modifie un service',
              'DELETE /api/services/:id': 'Supprime un service'
            },
            farms: {
              'GET /api/farms': 'Liste toutes les farms',
              'POST /api/farms': 'Crée une nouvelle farm',
              'PUT /api/farms/:id': 'Modifie une farm',
              'DELETE /api/farms/:id': 'Supprime une farm'
            },
            upload: {
              'POST /api/upload': 'Upload une image vers R2'
            }
          },
          database: {
            status: 'connected',
            type: 'Cloudflare D1'
          }
        }, 200, corsHeaders);
      }
      
      // Routes
      if (path === '/api/products' && method === 'GET') {
        return await getProducts(env, corsHeaders);
      }
      
      if (path === '/api/products' && method === 'POST') {
        return await createProduct(request, env, corsHeaders);
      }
      
      if (path.match(/^\/api\/products\/\d+$/) && method === 'GET') {
        const id = path.split('/')[3];
        return await getProduct(id, env, corsHeaders);
      }
      
      if (path.match(/^\/api\/products\/\d+$/) && method === 'PUT') {
        const id = path.split('/')[3];
        return await updateProduct(id, request, env, corsHeaders);
      }
      
      if (path.match(/^\/api\/products\/\d+$/) && method === 'DELETE') {
        const id = path.split('/')[3];
        return await deleteProduct(id, env, corsHeaders);
      }
      
      if (path === '/api/categories' && method === 'GET') {
        return await getCategories(env, corsHeaders);
      }
      
      if (path === '/api/categories' && method === 'POST') {
        return await createCategory(request, env, corsHeaders);
      }
      
      if (path.match(/^\/api\/categories\/\d+$/) && method === 'PUT') {
        const id = path.split('/')[3];
        return await updateCategory(id, request, env, corsHeaders);
      }
      
      if (path.match(/^\/api\/categories\/\d+$/) && method === 'DELETE') {
        const id = path.split('/')[3];
        return await deleteCategory(id, env, corsHeaders);
      }
      
      if (path === '/api/settings' && method === 'GET') {
        return await getSettings(env, corsHeaders);
      }
      
      if (path === '/api/settings' && method === 'PUT') {
        return await updateSettings(request, env, corsHeaders);
      }
      
      if (path === '/api/stats' && method === 'GET') {
        return await getStats(env, corsHeaders);
      }
      
      // Services
      if (path === '/api/services' && method === 'GET') {
        return await getServices(env, corsHeaders);
      }
      
      if (path === '/api/services' && method === 'POST') {
        return await createService(request, env, corsHeaders);
      }
      
      if (path.match(/^\/api\/services\/\d+$/) && method === 'PUT') {
        const id = path.split('/')[3];
        return await updateService(id, request, env, corsHeaders);
      }
      
      if (path.match(/^\/api\/services\/\d+$/) && method === 'DELETE') {
        const id = path.split('/')[3];
        return await deleteService(id, env, corsHeaders);
      }
      
      // Farms
      if (path === '/api/farms' && method === 'GET') {
        return await getFarms(env, corsHeaders);
      }
      
      if (path === '/api/farms' && method === 'POST') {
        return await createFarm(request, env, corsHeaders);
      }
      
      if (path.match(/^\/api\/farms\/\d+$/) && method === 'PUT') {
        const id = path.split('/')[3];
        return await updateFarm(id, request, env, corsHeaders);
      }
      
      if (path.match(/^\/api\/farms\/\d+$/) && method === 'DELETE') {
        const id = path.split('/')[3];
        return await deleteFarm(id, env, corsHeaders);
      }

      // Upload image to R2
      if (path === '/api/upload' && method === 'POST') {
        return await uploadImage(request, env, corsHeaders);
      }

      return jsonResponse({ error: 'Route not found' }, 404, corsHeaders);
      
    } catch (error) {
      console.error('Error:', error);
      return jsonResponse({ error: error.message }, 500, corsHeaders);
    }
  }
};

// Helper function pour les réponses JSON
function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

// Générer un slug
function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// GET /api/products - Liste tous les produits
async function getProducts(env, headers) {
  const { results } = await env.DB.prepare(`
    SELECT p.*, c.name as category_name, c.icon as category_icon, f.name as farm_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN farms f ON p.farm_id = f.id
    ORDER BY p.created_at DESC
  `).all();
  
  return jsonResponse({ success: true, products: results }, 200, headers);
}

// GET /api/products/:id - Récupère un produit
async function getProduct(id, env, headers) {
  const product = await env.DB.prepare(`
    SELECT p.*, c.name as category_name, c.icon as category_icon
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `).bind(id).first();
  
  if (!product) {
    return jsonResponse({ error: 'Product not found' }, 404, headers);
  }
  
  return jsonResponse({ success: true, product }, 200, headers);
}

// POST /api/products - Créer un nouveau produit
async function createProduct(request, env, headers) {
  const data = await request.json();
  
  // Validation
  if (!data.name || !data.category_id || !data.price) {
    return jsonResponse({ error: 'Missing required fields' }, 400, headers);
  }
  
  const slug = generateSlug(data.name);
  
  const result = await env.DB.prepare(`
    INSERT INTO products (name, slug, description, long_description, category_id, farm_id, price, unit, badge, image_url, video_url, stock_quantity, is_active, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    data.name,
    slug,
    data.description || '',
    data.long_description || '',
    data.category_id,
    data.farm_id || null,
    data.price,
    data.unit || '/ 3.5g',
    data.badge || '',
    data.image_url || '',
    data.video_url || '',
    data.stock_quantity || 0,
    data.is_active !== undefined ? data.is_active : 1,
    data.is_featured || 0
  ).run();
  
  return jsonResponse({
    success: true,
    message: 'Product created successfully',
    id: result.meta.last_row_id
  }, 201, headers);
}

// PUT /api/products/:id - Modifier un produit
async function updateProduct(id, request, env, headers) {
  const data = await request.json();
  
  // Vérifier que le produit existe
  const existing = await env.DB.prepare('SELECT id FROM products WHERE id = ?').bind(id).first();
  if (!existing) {
    return jsonResponse({ error: 'Product not found' }, 404, headers);
  }
  
  const slug = data.name ? generateSlug(data.name) : undefined;
  
  const updates = [];
  const bindings = [];
  
  if (data.name !== undefined) {
    updates.push('name = ?');
    bindings.push(data.name);
    updates.push('slug = ?');
    bindings.push(slug);
  }
  if (data.description !== undefined) {
    updates.push('description = ?');
    bindings.push(data.description);
  }
  if (data.category_id !== undefined) {
    updates.push('category_id = ?');
    bindings.push(data.category_id);
  }
  if (data.price !== undefined) {
    updates.push('price = ?');
    bindings.push(data.price);
  }
  if (data.unit !== undefined) {
    updates.push('unit = ?');
    bindings.push(data.unit);
  }
  if (data.badge !== undefined) {
    updates.push('badge = ?');
    bindings.push(data.badge);
  }
  if (data.image_url !== undefined) {
    updates.push('image_url = ?');
    bindings.push(data.image_url);
  }
  if (data.stock_quantity !== undefined) {
    updates.push('stock_quantity = ?');
    bindings.push(data.stock_quantity);
  }
  if (data.is_active !== undefined) {
    updates.push('is_active = ?');
    bindings.push(data.is_active);
  }
  if (data.is_featured !== undefined) {
    updates.push('is_featured = ?');
    bindings.push(data.is_featured);
  }
  
  bindings.push(id);
  
  await env.DB.prepare(`
    UPDATE products 
    SET ${updates.join(', ')}
    WHERE id = ?
  `).bind(...bindings).run();
  
  return jsonResponse({ success: true, message: 'Product updated successfully' }, 200, headers);
}

// DELETE /api/products/:id - Supprimer un produit
async function deleteProduct(id, env, headers) {
  const result = await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
  
  if (result.meta.changes === 0) {
    return jsonResponse({ error: 'Product not found' }, 404, headers);
  }
  
  return jsonResponse({ success: true, message: 'Product deleted successfully' }, 200, headers);
}

// GET /api/categories - Liste toutes les catégories
async function getCategories(env, headers) {
  const { results } = await env.DB.prepare(`
    SELECT * FROM categories ORDER BY name
  `).all();
  
  return jsonResponse({ success: true, categories: results }, 200, headers);
}

// POST /api/categories - Créer une catégorie
async function createCategory(request, env, headers) {
  const data = await request.json();
  
  if (!data.name) {
    return jsonResponse({ error: 'Name is required' }, 400, headers);
  }
  
  const slug = generateSlug(data.name);
  
  const result = await env.DB.prepare(`
    INSERT INTO categories (name, slug, description, icon, image_url, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    data.name,
    slug,
    data.description || '',
    data.icon || '📦',
    data.image_url || '',
    data.is_active !== undefined ? data.is_active : 1
  ).run();
  
  return jsonResponse({
    success: true,
    message: 'Category created successfully',
    id: result.meta.last_row_id
  }, 201, headers);
}

// PUT /api/categories/:id - Modifier une catégorie
async function updateCategory(id, request, env, headers) {
  const data = await request.json();
  
  const updates = [];
  const bindings = [];
  
  if (data.name !== undefined) {
    updates.push('name = ?', 'slug = ?');
    bindings.push(data.name, generateSlug(data.name));
  }
  if (data.description !== undefined) {
    updates.push('description = ?');
    bindings.push(data.description);
  }
  if (data.icon !== undefined) {
    updates.push('icon = ?');
    bindings.push(data.icon);
  }
  if (data.image_url !== undefined) {
    updates.push('image_url = ?');
    bindings.push(data.image_url);
  }
  if (data.is_active !== undefined) {
    updates.push('is_active = ?');
    bindings.push(data.is_active);
  }
  
  bindings.push(id);
  
  await env.DB.prepare(`
    UPDATE categories 
    SET ${updates.join(', ')}
    WHERE id = ?
  `).bind(...bindings).run();
  
  return jsonResponse({ success: true, message: 'Category updated successfully' }, 200, headers);
}

// DELETE /api/categories/:id - Supprimer une catégorie
async function deleteCategory(id, env, headers) {
  const result = await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
  
  if (result.meta.changes === 0) {
    return jsonResponse({ error: 'Category not found' }, 404, headers);
  }
  
  return jsonResponse({ success: true, message: 'Category deleted successfully' }, 200, headers);
}

// GET /api/settings - Récupère tous les paramètres
async function getSettings(env, headers) {
  const { results } = await env.DB.prepare('SELECT * FROM settings').all();
  
  const settings = {};
  results.forEach(row => {
    settings[row.key] = row.value;
  });
  
  return jsonResponse({ success: true, settings }, 200, headers);
}

// PUT /api/settings - Met à jour les paramètres
async function updateSettings(request, env, headers) {
  const data = await request.json();
  
  for (const [key, value] of Object.entries(data)) {
    await env.DB.prepare(`
      INSERT INTO settings (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP
    `).bind(key, value, value).run();
  }
  
  return jsonResponse({ success: true, message: 'Settings updated successfully' }, 200, headers);
}

// GET /api/stats - Statistiques
async function getStats(env, headers) {
  const stats = {};
  
  // Total produits
  const totalProducts = await env.DB.prepare('SELECT COUNT(*) as count FROM products').first();
  stats.totalProducts = totalProducts.count;
  
  // Produits actifs
  const activeProducts = await env.DB.prepare('SELECT COUNT(*) as count FROM products WHERE is_active = 1').first();
  stats.activeProducts = activeProducts.count;
  
  // Total catégories
  const totalCategories = await env.DB.prepare('SELECT COUNT(*) as count FROM categories').first();
  stats.totalCategories = totalCategories.count;
  
  // Total images
  const totalImages = await env.DB.prepare('SELECT COUNT(*) as count FROM images').first();
  stats.totalImages = totalImages.count;
  
  return jsonResponse({ success: true, stats }, 200, headers);
}

// GET /api/services - Liste tous les services
async function getServices(env, headers) {
  const { results } = await env.DB.prepare(`
    SELECT * FROM services 
    ORDER BY display_order ASC, id ASC
  `).all();
  
  return jsonResponse({ success: true, services: results }, 200, headers);
}

// POST /api/services - Créer un service
async function createService(request, env, headers) {
  const data = await request.json();
  
  if (!data.title || !data.content) {
    return jsonResponse({ error: 'Title and content are required' }, 400, headers);
  }
  
  const result = await env.DB.prepare(`
    INSERT INTO services (title, content, icon, display_order, is_active)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    data.title,
    data.content,
    data.icon || '📌',
    data.display_order || 0,
    data.is_active !== undefined ? data.is_active : 1
  ).run();
  
  return jsonResponse({
    success: true,
    message: 'Service created successfully',
    id: result.meta.last_row_id
  }, 201, headers);
}

// PUT /api/services/:id - Modifier un service
async function updateService(id, request, env, headers) {
  const data = await request.json();
  
  const updates = [];
  const bindings = [];
  
  if (data.title !== undefined) {
    updates.push('title = ?');
    bindings.push(data.title);
  }
  if (data.content !== undefined) {
    updates.push('content = ?');
    bindings.push(data.content);
  }
  if (data.icon !== undefined) {
    updates.push('icon = ?');
    bindings.push(data.icon);
  }
  if (data.display_order !== undefined) {
    updates.push('display_order = ?');
    bindings.push(data.display_order);
  }
  if (data.is_active !== undefined) {
    updates.push('is_active = ?');
    bindings.push(data.is_active);
  }
  
  if (updates.length === 0) {
    return jsonResponse({ error: 'No fields to update' }, 400, headers);
  }
  
  bindings.push(id);
  
  await env.DB.prepare(`
    UPDATE services 
    SET ${updates.join(', ')}
    WHERE id = ?
  `).bind(...bindings).run();
  
  return jsonResponse({ success: true, message: 'Service updated successfully' }, 200, headers);
}

// DELETE /api/services/:id - Supprimer un service
async function deleteService(id, env, headers) {
  const result = await env.DB.prepare('DELETE FROM services WHERE id = ?').bind(id).run();
  
  if (result.meta.changes === 0) {
    return jsonResponse({ error: 'Service not found' }, 404, headers);
  }
  
  return jsonResponse({ success: true, message: 'Service deleted successfully' }, 200, headers);
}

// GET /api/farms - Liste toutes les farms
async function getFarms(env, headers) {
  const { results } = await env.DB.prepare(`
    SELECT * FROM farms 
    ORDER BY name ASC
  `).all();
  
  return jsonResponse({ success: true, farms: results }, 200, headers);
}

// POST /api/farms - Créer une farm
async function createFarm(request, env, headers) {
  const data = await request.json();
  
  if (!data.name) {
    return jsonResponse({ error: 'Name is required' }, 400, headers);
  }
  
  const slug = generateSlug(data.name);
  
  const result = await env.DB.prepare(`
    INSERT INTO farms (name, slug, description, logo_url, country, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    data.name,
    slug,
    data.description || '',
    data.logo_url || '',
    data.country || '',
    data.is_active !== undefined ? data.is_active : 1
  ).run();
  
  return jsonResponse({
    success: true,
    message: 'Farm created successfully',
    id: result.meta.last_row_id
  }, 201, headers);
}

// PUT /api/farms/:id - Modifier une farm
async function updateFarm(id, request, env, headers) {
  const data = await request.json();
  
  const updates = [];
  const bindings = [];
  
  if (data.name !== undefined) {
    updates.push('name = ?', 'slug = ?');
    bindings.push(data.name, generateSlug(data.name));
  }
  if (data.description !== undefined) {
    updates.push('description = ?');
    bindings.push(data.description);
  }
  if (data.logo_url !== undefined) {
    updates.push('logo_url = ?');
    bindings.push(data.logo_url);
  }
  if (data.country !== undefined) {
    updates.push('country = ?');
    bindings.push(data.country);
  }
  if (data.is_active !== undefined) {
    updates.push('is_active = ?');
    bindings.push(data.is_active);
  }
  
  if (updates.length === 0) {
    return jsonResponse({ error: 'No fields to update' }, 400, headers);
  }
  
  bindings.push(id);
  
  await env.DB.prepare(`
    UPDATE farms 
    SET ${updates.join(', ')}
    WHERE id = ?
  `).bind(...bindings).run();
  
  return jsonResponse({ success: true, message: 'Farm updated successfully' }, 200, headers);
}

// DELETE /api/farms/:id - Supprimer une farm
async function deleteFarm(id, env, headers) {
  const result = await env.DB.prepare('DELETE FROM farms WHERE id = ?').bind(id).run();
  
  if (result.meta.changes === 0) {
    return jsonResponse({ error: 'Farm not found' }, 404, headers);
  }
  
  return jsonResponse({ success: true, message: 'Farm deleted successfully' }, 200, headers);
}

// GET /api/social-links - Liste tous les réseaux sociaux
async function getSocialLinks(env, headers) {
  const { results } = await env.DB.prepare(`
    SELECT * FROM social_links 
    ORDER BY display_order ASC, id ASC
  `).all();
  
  return jsonResponse({ success: true, social_links: results }, 200, headers);
}

// POST /api/social-links - Créer un réseau social
async function createSocialLink(request, env, headers) {
  const data = await request.json();
  
  if (!data.name || !data.url) {
    return jsonResponse({ error: 'Name and URL are required' }, 400, headers);
  }
  
  const result = await env.DB.prepare(`
    INSERT INTO social_links (name, url, icon, display_order, is_active)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    data.name,
    data.url,
    data.icon || '🔗',
    data.display_order || 0,
    data.is_active !== undefined ? data.is_active : 1
  ).run();
  
  return jsonResponse({
    success: true,
    message: 'Social link created successfully',
    id: result.meta.last_row_id
  }, 201, headers);
}

// PUT /api/social-links/:id - Modifier un réseau social
async function updateSocialLink(id, request, env, headers) {
  const data = await request.json();
  
  const updates = [];
  const bindings = [];
  
  if (data.name !== undefined) {
    updates.push('name = ?');
    bindings.push(data.name);
  }
  if (data.url !== undefined) {
    updates.push('url = ?');
    bindings.push(data.url);
  }
  if (data.icon !== undefined) {
    updates.push('icon = ?');
    bindings.push(data.icon);
  }
  if (data.display_order !== undefined) {
    updates.push('display_order = ?');
    bindings.push(data.display_order);
  }
  if (data.is_active !== undefined) {
    updates.push('is_active = ?');
    bindings.push(data.is_active);
  }
  
  if (updates.length === 0) {
    return jsonResponse({ error: 'No fields to update' }, 400, headers);
  }
  
  bindings.push(id);
  
  await env.DB.prepare(`
    UPDATE social_links 
    SET ${updates.join(', ')}
    WHERE id = ?
  `).bind(...bindings).run();
  
  return jsonResponse({ success: true, message: 'Social link updated successfully' }, 200, headers);
}

// DELETE /api/social-links/:id - Supprimer un réseau social
async function deleteSocialLink(id, env, headers) {
  const result = await env.DB.prepare('DELETE FROM social_links WHERE id = ?').bind(id).run();
  
  if (result.meta.changes === 0) {
    return jsonResponse({ error: 'Social link not found' }, 404, headers);
  }
  
  return jsonResponse({ success: true, message: 'Social link deleted successfully' }, 200, headers);
}

// POST /api/upload - Upload image vers R2
async function uploadImage(request, env, headers) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return jsonResponse({ error: 'No file uploaded' }, 400, headers);
    }
    
    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    
    // Upload vers R2
    await env.R2.put(filename, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });
    
    const imageUrl = `${env.R2_PUBLIC_URL}/${filename}`;
    
    // Enregistrer dans la base de données
    await env.DB.prepare(`
      INSERT INTO images (filename, original_name, url, size, mime_type)
      VALUES (?, ?, ?, ?, ?)
    `).bind(filename, file.name, imageUrl, file.size, file.type).run();
    
    return jsonResponse({
      success: true,
      message: 'Image uploaded successfully',
      url: imageUrl,
      filename
    }, 200, headers);
    
  } catch (error) {
    console.error('Upload error:', error);
    return jsonResponse({ error: 'Upload failed: ' + error.message }, 500, headers);
  }
}
