// Worker Cloudflare pour gérer toutes les routes API

export async function onRequest(context) {
    const { request, env, params } = context;
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Headers CORS
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
    };

    // Gérer les requêtes OPTIONS (CORS preflight)
    if (method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Authentification pour les opérations admin
        if (method !== 'GET' || path.includes('/settings')) {
            const auth = request.headers.get('Authorization');
            const token = auth?.replace('Bearer ', '');
            
            if (token !== env.ADMIN_PASSWORD) {
                return new Response('Non autorisé', { 
                    status: 401, 
                    headers: corsHeaders 
                });
            }
        }

        // Router les requêtes
        const route = path.replace('/api/', '');
        const routeParts = route.split('/');
        const resource = routeParts[0];
        const id = routeParts[1];

        switch (resource) {
            case 'products':
                return await handleProducts(method, id, request, env);
            case 'categories':
                return await handleCategories(method, id, request, env);
            case 'farms':
                return await handleFarms(method, id, request, env);
            case 'socials':
                return await handleSocials(method, id, request, env);
            case 'settings':
                return await handleSettings(method, request, env);
            case 'upload':
                return await handleUpload(method, request, env);
            default:
                return new Response('Route non trouvée', { 
                    status: 404, 
                    headers: corsHeaders 
                });
        }
    } catch (error) {
        console.error('Erreur:', error);
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500, 
            headers: corsHeaders 
        });
    }
}

// Gestion des produits
async function handleProducts(method, id, request, env) {
    const db = env.DB;
    
    switch (method) {
        case 'GET':
            if (id) {
                // Récupérer un produit avec ses prix
                const product = await db.prepare(`
                    SELECT p.*, c.name as category_name, f.name as farm_name
                    FROM products p
                    LEFT JOIN categories c ON p.category_id = c.id
                    LEFT JOIN farms f ON p.farm_id = f.id
                    WHERE p.id = ?
                `).bind(id).first();
                
                if (!product) {
                    return jsonResponse({ error: 'Produit non trouvé' }, 404);
                }
                
                // Récupérer les prix
                const prices = await db.prepare(`
                    SELECT * FROM prices WHERE product_id = ?
                `).bind(id).all();
                
                product.prices = prices.results;
                return jsonResponse(product);
            } else {
                // Liste de tous les produits
                const products = await db.prepare(`
                    SELECT p.*, c.name as category_name, f.name as farm_name
                    FROM products p
                    LEFT JOIN categories c ON p.category_id = c.id
                    LEFT JOIN farms f ON p.farm_id = f.id
                    ORDER BY p.id DESC
                `).all();
                
                // Récupérer les prix pour chaque produit
                for (let product of products.results) {
                    const prices = await db.prepare(`
                        SELECT * FROM prices WHERE product_id = ?
                    `).bind(product.id).all();
                    product.prices = prices.results;
                }
                
                return jsonResponse(products.results);
            }
            
        case 'POST':
            const newProduct = await request.json();
            
            // Insérer le produit
            const result = await db.prepare(`
                INSERT INTO products (name, description, media_url, media_type, category_id, farm_id)
                VALUES (?, ?, ?, ?, ?, ?)
            `).bind(
                newProduct.name,
                newProduct.description || null,
                newProduct.media_url || null,
                newProduct.media_type || 'image',
                newProduct.category_id || null,
                newProduct.farm_id || null
            ).run();
            
            const productId = result.meta.last_row_id;
            
            // Insérer les prix
            if (newProduct.prices && newProduct.prices.length > 0) {
                for (let price of newProduct.prices) {
                    await db.prepare(`
                        INSERT INTO prices (product_id, qty, price)
                        VALUES (?, ?, ?)
                    `).bind(productId, price.qty, price.price).run();
                }
            }
            
            return jsonResponse({ id: productId, ...newProduct }, 201);
            
        case 'PUT':
            const updatedProduct = await request.json();
            
            // Mettre à jour le produit
            await db.prepare(`
                UPDATE products 
                SET name = ?, description = ?, media_url = ?, media_type = ?, 
                    category_id = ?, farm_id = ?
                WHERE id = ?
            `).bind(
                updatedProduct.name,
                updatedProduct.description || null,
                updatedProduct.media_url || null,
                updatedProduct.media_type || 'image',
                updatedProduct.category_id || null,
                updatedProduct.farm_id || null,
                id
            ).run();
            
            // Supprimer les anciens prix
            await db.prepare(`DELETE FROM prices WHERE product_id = ?`).bind(id).run();
            
            // Insérer les nouveaux prix
            if (updatedProduct.prices && updatedProduct.prices.length > 0) {
                for (let price of updatedProduct.prices) {
                    await db.prepare(`
                        INSERT INTO prices (product_id, qty, price)
                        VALUES (?, ?, ?)
                    `).bind(id, price.qty, price.price).run();
                }
            }
            
            return jsonResponse({ id, ...updatedProduct });
            
        case 'DELETE':
            // Supprimer les prix d'abord
            await db.prepare(`DELETE FROM prices WHERE product_id = ?`).bind(id).run();
            // Supprimer le produit
            await db.prepare(`DELETE FROM products WHERE id = ?`).bind(id).run();
            return jsonResponse({ success: true });
    }
}

// Gestion des catégories
async function handleCategories(method, id, request, env) {
    const db = env.DB;
    
    switch (method) {
        case 'GET':
            const categories = await db.prepare(`SELECT * FROM categories ORDER BY name`).all();
            return jsonResponse(categories.results);
            
        case 'POST':
            const { name } = await request.json();
            const result = await db.prepare(`
                INSERT INTO categories (name) VALUES (?)
            `).bind(name).run();
            return jsonResponse({ id: result.meta.last_row_id, name }, 201);
            
        case 'PUT':
            const { name: updatedName } = await request.json();
            await db.prepare(`
                UPDATE categories SET name = ? WHERE id = ?
            `).bind(updatedName, id).run();
            return jsonResponse({ id, name: updatedName });
            
        case 'DELETE':
            await db.prepare(`DELETE FROM categories WHERE id = ?`).bind(id).run();
            return jsonResponse({ success: true });
    }
}

// Gestion des farms
async function handleFarms(method, id, request, env) {
    const db = env.DB;
    
    switch (method) {
        case 'GET':
            const farms = await db.prepare(`SELECT * FROM farms ORDER BY name`).all();
            return jsonResponse(farms.results);
            
        case 'POST':
            const { name } = await request.json();
            const result = await db.prepare(`
                INSERT INTO farms (name) VALUES (?)
            `).bind(name).run();
            return jsonResponse({ id: result.meta.last_row_id, name }, 201);
            
        case 'PUT':
            const { name: updatedName } = await request.json();
            await db.prepare(`
                UPDATE farms SET name = ? WHERE id = ?
            `).bind(updatedName, id).run();
            return jsonResponse({ id, name: updatedName });
            
        case 'DELETE':
            await db.prepare(`DELETE FROM farms WHERE id = ?`).bind(id).run();
            return jsonResponse({ success: true });
    }
}

// Gestion des réseaux sociaux
async function handleSocials(method, id, request, env) {
    const db = env.DB;
    
    switch (method) {
        case 'GET':
            const socials = await db.prepare(`SELECT * FROM socials ORDER BY name`).all();
            return jsonResponse(socials.results);
            
        case 'POST':
            const { name, url } = await request.json();
            const result = await db.prepare(`
                INSERT INTO socials (name, url) VALUES (?, ?)
            `).bind(name, url).run();
            return jsonResponse({ id: result.meta.last_row_id, name, url }, 201);
            
        case 'PUT':
            const updated = await request.json();
            await db.prepare(`
                UPDATE socials SET name = ?, url = ? WHERE id = ?
            `).bind(updated.name, updated.url, id).run();
            return jsonResponse({ id, ...updated });
            
        case 'DELETE':
            await db.prepare(`DELETE FROM socials WHERE id = ?`).bind(id).run();
            return jsonResponse({ success: true });
    }
}

// Gestion des paramètres
async function handleSettings(method, request, env) {
    const db = env.DB;
    
    switch (method) {
        case 'GET':
            const settings = await db.prepare(`SELECT * FROM settings WHERE id = 1`).first();
            return jsonResponse(settings || {});
            
        case 'PUT':
            const newSettings = await request.json();
            
            // Vérifier si les paramètres existent
            const existing = await db.prepare(`SELECT * FROM settings WHERE id = 1`).first();
            
            if (existing) {
                await db.prepare(`
                    UPDATE settings 
                    SET shop_name = ?, theme_bg_url = ?, command_url = ?
                    WHERE id = 1
                `).bind(
                    newSettings.shop_name || null,
                    newSettings.theme_bg_url || null,
                    newSettings.command_url || null
                ).run();
            } else {
                await db.prepare(`
                    INSERT INTO settings (id, shop_name, theme_bg_url, command_url)
                    VALUES (1, ?, ?, ?)
                `).bind(
                    newSettings.shop_name || null,
                    newSettings.theme_bg_url || null,
                    newSettings.command_url || null
                ).run();
            }
            
            return jsonResponse(newSettings);
    }
}

// Gestion des uploads vers R2
async function handleUpload(method, request, env) {
    if (method !== 'POST') {
        return jsonResponse({ error: 'Méthode non autorisée' }, 405);
    }
    
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        
        if (!file) {
            return jsonResponse({ error: 'Aucun fichier fourni' }, 400);
        }
        
        // Générer un nom unique
        const filename = `${Date.now()}-${file.name}`;
        
        // Upload vers R2
        await env.R2.put(filename, file.stream(), {
            httpMetadata: {
                contentType: file.type
            }
        });
        
        // Retourner l'URL publique
        const publicUrl = `${env.CLOUDFLARE_R2_PUBLIC_URL}/${filename}`;
        
        return jsonResponse({ url: publicUrl });
    } catch (error) {
        console.error('Erreur upload:', error);
        return jsonResponse({ error: 'Erreur lors de l\'upload' }, 500);
    }
}

// Fonction helper pour les réponses JSON
function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}