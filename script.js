// Animation d'apparition des cartes au chargement
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Animation du titre principal
    const mainTitle = document.querySelector('.main-title');
    mainTitle.style.opacity = '0';
    mainTitle.style.transform = 'translateY(-30px)';
    
    setTimeout(() => {
        mainTitle.style.transition = 'opacity 1s ease, transform 1s ease';
        mainTitle.style.opacity = '1';
        mainTitle.style.transform = 'translateY(0)';
    }, 200);
    
    // Animation des titres néon
    const menuTitle = document.querySelector('.menu-title');
    const humourTitle = document.querySelector('.humour-title');
    
    if (menuTitle && humourTitle) {
        menuTitle.style.opacity = '0';
        humourTitle.style.opacity = '0';
        
        setTimeout(() => {
            menuTitle.style.transition = 'opacity 1s ease';
            menuTitle.style.opacity = '1';
        }, 800);
        
        setTimeout(() => {
            humourTitle.style.transition = 'opacity 1s ease';
            humourTitle.style.opacity = '1';
        }, 1200);
    }
});

// Effet parallaxe sur le fond cosmique
document.addEventListener('mousemove', function(e) {
    const stars = document.querySelector('.stars');
    const stars2 = document.querySelector('.stars2');
    const stars3 = document.querySelector('.stars3');
    
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    stars.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    stars2.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
    stars3.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
});

// Gestion de la navigation
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Retirer la classe active de tous les éléments
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // Ajouter la classe active à l'élément cliqué
        this.classList.add('active');
        
        // Animation de clic
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    });
});

// Animation au survol des cartes produits
const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        // Créer un effet de lueur
        const glow = document.createElement('div');
        glow.className = 'card-glow';
        glow.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(131, 56, 236, 0.3) 0%, transparent 70%);
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        this.appendChild(glow);
        
        setTimeout(() => {
            glow.style.opacity = '1';
        }, 10);
    });
    
    card.addEventListener('mouseleave', function() {
        const glow = this.querySelector('.card-glow');
        if (glow) {
            glow.style.opacity = '0';
            setTimeout(() => {
                glow.remove();
            }, 300);
        }
    });
    
    // Animation de clic sur les cartes
    card.addEventListener('click', function() {
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        // Effet d'onde
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            pointer-events: none;
            transition: width 0.6s ease, height 0.6s ease, opacity 0.6s ease;
        `;
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.style.width = '300px';
            ripple.style.height = '300px';
            ripple.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Créer des particules flottantes
function createParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        pointer-events: none;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, rgba(131, 56, 236, 0.8) 0%, transparent 70%);
        border-radius: 50%;
        left: ${Math.random() * window.innerWidth}px;
        top: ${window.innerHeight + 10}px;
        opacity: 0;
    `;
    document.body.appendChild(particle);
    
    // Animation de la particule
    let opacity = 0;
    let y = window.innerHeight + 10;
    let x = parseFloat(particle.style.left);
    let speedY = -(Math.random() * 2 + 1);
    let speedX = (Math.random() - 0.5) * 2;
    
    const animateParticle = () => {
        y += speedY;
        x += speedX;
        opacity = Math.min(opacity + 0.02, 0.8);
        
        if (y < window.innerHeight * 0.3) {
            opacity -= 0.02;
        }
        
        particle.style.top = y + 'px';
        particle.style.left = x + 'px';
        particle.style.opacity = opacity;
        
        if (y < -10 || opacity <= 0) {
            particle.remove();
        } else {
            requestAnimationFrame(animateParticle);
        }
    };
    
    requestAnimationFrame(animateParticle);
}

// Créer des particules périodiquement
setInterval(createParticle, 300);

// Animation de défilement fluide
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});