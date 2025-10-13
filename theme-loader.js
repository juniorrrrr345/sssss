// Theme loader - applique le thème noir et blanc
document.addEventListener('DOMContentLoaded', function() {
    // Forcer le thème noir et blanc
    document.body.style.background = '#000';
    document.body.style.color = '#fff';
    
    // Supprimer toute mention du nom du shop si présent
    const shopElements = document.querySelectorAll('.shop-name, .logo-text, #shopName');
    shopElements.forEach(el => {
        if (el) el.style.display = 'none';
    });
});