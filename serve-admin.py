#!/usr/bin/env python3
"""
Serveur local pour le panel admin et les pages HTML
Usage: python3 serve-admin.py
"""

import http.server
import socketserver
import os
import json
from urllib.parse import urlparse, parse_qs
import mimetypes

PORT = 8006

class AdminHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse l'URL
        parsed_path = urlparse(self.path)
        
        # Si on demande /admin, rediriger vers admin-bipcosa.html
        if parsed_path.path == '/admin' or parsed_path.path == '/admin/':
            self.path = '/admin-bipcosa.html'
        
        # Si on demande /admin.js sans préciser lequel
        elif parsed_path.path == '/admin.js':
            self.path = '/admin-bipcosa.js'
            
        # Pour tous les autres fichiers, servir normalement
        return http.server.SimpleHTTPRequestHandler.do_GET(self)
    
    def end_headers(self):
        # Ajouter les headers CORS pour permettre les requêtes cross-origin
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def guess_type(self, path):
        # S'assurer que les fichiers JS sont servis avec le bon type MIME
        mimetype = super().guess_type(path)
        if path.endswith('.js'):
            return 'application/javascript'
        return mimetype

# Configuration du serveur
with socketserver.TCPServer(("", PORT), AdminHTTPRequestHandler) as httpd:
    print(f"===========================================")
    print(f"🚀 Serveur Panel Admin démarré sur le port {PORT}")
    print(f"===========================================")
    print(f"")
    print(f"📋 URLs disponibles:")
    print(f"")
    print(f"  🔐 Panel Admin:      http://localhost:{PORT}/admin")
    print(f"  🏠 Page d'accueil:   http://localhost:{PORT}/home.html")
    print(f"  📦 Produits:         http://localhost:{PORT}/products.html")
    print(f"  📞 Contact:          http://localhost:{PORT}/contact.html")
    print(f"  📂 Catégories:       http://localhost:{PORT}/categories.html")
    print(f"")
    print(f"  ℹ️  Mot de passe admin: admin123")
    print(f"")
    print(f"===========================================")
    print(f"Appuyez sur Ctrl+C pour arrêter le serveur")
    print(f"")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Serveur arrêté.")