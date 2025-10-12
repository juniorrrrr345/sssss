/**
 * Script pour la page de contact
 * Récupère et affiche les liens de contact depuis l'API
 */

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    await initContactPage();
});

/**
 * Initialise la page de contact
 */
async function initContactPage() {
    try {
        showLoader();
        await fetchAndDisplayLinks();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showError('Erreur lors du chargement des informations de contact');
    } finally {
        hideLoader();
    }
}

/**
 * Récupère et affiche les liens de contact
 */
async function fetchAndDisplayLinks() {
    try {
        const response = await API.links.getLinks();
        
        if (response.success && response.links) {
            displayContactLinks(response.links);
        } else {
            throw new Error('Format de réponse invalide');
        }
    } catch (error) {
        console.error('Erreur de récupération des liens:', error);
        throw error;
    }
}

/**
 * Affiche les liens de contact
 */
function displayContactLinks(links) {
    const container = document.getElementById('contactLinksContainer');
    
    if (!container) return;

    const contactItems = [
        {
            icon: '🌳',
            title: 'LinkTree',
            link: links.linkTrees,
            description: 'Accédez à tous nos liens importants',
            color: 'from-green-400 to-emerald-600'
        },
        {
            icon: '💬',
            title: 'WhatsApp',
            link: links.contact,
            description: 'Contactez-nous directement sur WhatsApp',
            color: 'from-green-400 to-teal-500'
        },
        {
            icon: '📱',
            title: 'Canal Telegram',
            link: links.lienCanal,
            description: 'Rejoignez notre canal Telegram pour les dernières mises à jour',
            color: 'from-blue-400 to-cyan-500'
        },
        {
            icon: '📷',
            title: 'Instagram',
            link: links.lienInstagram,
            description: 'Suivez-nous sur Instagram',
            color: 'from-pink-400 to-purple-600'
        }
    ];

    container.innerHTML = contactItems.map(item => createContactCard(item)).join('');

    // Ajouter les écouteurs de clic
    container.querySelectorAll('.contact-card').forEach((card, index) => {
        if (contactItems[index].link) {
            card.addEventListener('click', () => {
                window.open(contactItems[index].link, '_blank', 'noopener,noreferrer');
            });
        }
    });
}

/**
 * Crée une carte de contact
 */
function createContactCard(item) {
    return `
        <div class="contact-card flex items-center bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-xl hover:bg-opacity-20 transition-all duration-300 cursor-pointer shadow-lg transform hover:scale-105">
            <div class="mr-6 text-5xl">
                ${item.icon}
            </div>
            <div class="flex-1">
                <h2 class="text-2xl font-semibold text-white mb-1">${item.title}</h2>
                <p class="text-sm text-gray-400">
                    ${item.link ? item.description : 'Non disponible'}
                </p>
            </div>
            ${item.link ? `
                <div class="ml-auto text-purple-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Affiche le loader
 */
function showLoader() {
    const container = document.getElementById('contactLinksContainer');
    if (container) {
        container.innerHTML = `
            <div class="col-span-full flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
        `;
    }
}

/**
 * Masque le loader
 */
function hideLoader() {
    // Le loader est remplacé par le contenu
}

/**
 * Affiche une erreur
 */
function showError(message) {
    const container = document.getElementById('contactLinksContainer');
    if (container) {
        container.innerHTML = `
            <div class="col-span-full text-center py-10">
                <span class="text-xl text-red-400">${message}</span>
            </div>
        `;
    }
}
