// Version avec timestamp pour forcer le rechargement
const CACHE_BUSTER = Date.now();
const script = document.createElement('script');
script.src = `admin.js?v=${CACHE_BUSTER}`;
document.head.appendChild(script);
