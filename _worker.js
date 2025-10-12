export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Rediriger / vers /index.html
    if (url.pathname === '/') {
      return Response.redirect(url.origin + '/index.html', 301);
    }
    
    // Servir les fichiers statiques
    return env.ASSETS.fetch(request);
  }
}