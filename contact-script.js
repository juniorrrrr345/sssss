// Script pour la page de contact avec animations supplémentaires

document.addEventListener('DOMContentLoaded', function() {
    // Animation des étoiles scintillantes
    createTwinklingStars();
    
    // Effet de parallaxe sur le mouvement de la souris
    setupParallaxEffect();
    
    // Animation au clic sur les cartes
    setupCardAnimations();
    
    // Particules dynamiques
    createDynamicParticles();
});

// Créer des étoiles scintillantes dynamiques
function createTwinklingStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'twinkling-stars';
    document.querySelector('.cosmic-background').appendChild(starsContainer);
    
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'twinkling-star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        starsContainer.appendChild(star);
    }
}

// Effet de parallaxe
function setupParallaxEffect() {
    const cosmicBg = document.querySelector('.cosmic-background');
    const nebula = document.querySelector('.nebula');
    const bubbles = document.querySelectorAll('.bubble');
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        
        // Déplacer la nébuleuse
        if (nebula) {
            nebula.style.transform = `translate(${x * 20}px, ${y * 20}px) rotate(${Date.now() * 0.001}deg)`;
        }
        
        // Déplacer les bulles avec différentes vitesses
        bubbles.forEach((bubble, index) => {
            const speed = (index + 1) * 10;
            bubble.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
}

// Animations des cartes au clic
function setupCardAnimations() {
    const cards = document.querySelectorAll('.contact-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Créer un effet de ripple
            const ripple = document.createElement('div');
            ripple.className = 'ripple-effect';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
        
        // Effet de hover magnétique
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            this.style.transform = `perspective(1000px) rotateY(${deltaX * 5}deg) rotateX(${-deltaY * 5}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Créer des particules dynamiques
function createDynamicParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    document.querySelector('.cosmic-background').appendChild(particlesContainer);
    
    setInterval(() => {
        if (document.querySelectorAll('.particle').length < 20) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
            particlesContainer.appendChild(particle);
            
            // Supprimer la particule après l'animation
            particle.addEventListener('animationend', () => {
                particle.remove();
            });
        }
    }, 1000);
}

// Styles CSS additionnels injectés dynamiquement
const additionalStyles = `
    <style>
    .twinkling-stars {
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
    
    .twinkling-star {
        position: absolute;
        width: 2px;
        height: 2px;
        background: white;
        border-radius: 50%;
        animation: twinkle 3s ease-in-out infinite;
    }
    
    @keyframes twinkle {
        0%, 100% { opacity: 0; transform: scale(0.5); }
        50% { opacity: 1; transform: scale(1); }
    }
    
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .particles-container {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
    }
    
    .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: linear-gradient(45deg, #ff6ec7, #873eff);
        border-radius: 50%;
        bottom: -10px;
        animation: float-up linear;
        box-shadow: 0 0 10px rgba(255, 110, 199, 0.5);
    }
    
    @keyframes float-up {
        to {
            transform: translateY(-120vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    .contact-card {
        position: relative;
        overflow: hidden;
        transform-style: preserve-3d;
        transition: transform 0.1s ease-out;
    }
    
    .contact-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.1), 
            transparent);
        transition: left 0.5s ease;
    }
    
    .contact-card:hover::before {
        left: 100%;
    }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Effet de texte animé pour "Avec Amour"
const avecText = document.querySelector('.avec-amour');
const amourText = document.querySelector('.amour-text');

if (avecText && amourText) {
    // Animation de typing effect au chargement
    const avecOriginal = avecText.textContent;
    const amourOriginal = amourText.textContent;
    
    avecText.textContent = '';
    amourText.textContent = '';
    
    let i = 0;
    const typeAvec = setInterval(() => {
        if (i < avecOriginal.length) {
            avecText.textContent += avecOriginal[i];
            i++;
        } else {
            clearInterval(typeAvec);
            
            // Commencer à taper "Amour"
            let j = 0;
            const typeAmour = setInterval(() => {
                if (j < amourOriginal.length) {
                    amourText.textContent += amourOriginal[j];
                    j++;
                } else {
                    clearInterval(typeAmour);
                }
            }, 150);
        }
    }, 150);
}

// Effet de son au survol (optionnel - décommenté si souhaité)
/*
const cards = document.querySelectorAll('.contact-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        // Créer un son de hover subtil
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        audio.volume = 0.1;
        audio.play().catch(() => {}); // Ignorer les erreurs si l'audio ne peut pas être joué
    });
});
*/