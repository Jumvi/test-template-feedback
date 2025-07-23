// Script JavaScript pour la page de test
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Page chargée avec succès !');
    
    // Animation des éléments au scroll
    initScrollAnimations();
    
    // Gestion du formulaire de contact
    initContactForm();
    
    // Navigation smooth scroll
    initSmoothNavigation();
    
    // Effets interactifs
    initInteractiveEffects();
});

/**
 * Initialise les animations au scroll
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer les cartes de service
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

/**
 * Gère le formulaire de contact
 */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Validation simple
            if (!name || !email || !message) {
                showNotification('Veuillez remplir tous les champs', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Veuillez entrer un email valide', 'error');
                return;
            }
            
            // Simulation d'envoi
            showNotification('Message envoyé avec succès !', 'success');
            form.reset();
            
            console.log('📧 Formulaire soumis:', { name, email, message });
        });
    }
}

/**
 * Navigation avec scroll smooth
 */
function initSmoothNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Mettre à jour l'URL sans déclencher le scroll
                history.pushState(null, null, targetId);
            }
        });
    });
}

/**
 * Effets interactifs
 */
function initInteractiveEffects() {
    // Effet parallax léger sur le hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Effet hover sur les cartes
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Animation du logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'pulse 0.6s ease';
            }, 10);
        });
    }
}

/**
 * Fonction appelée par le bouton CTA
 */
function showMessage() {
    const messages = [
        "🎉 Félicitations ! Le système d'évaluation fonctionne !",
        "✨ Votre code est en cours d'analyse...",
        "🚀 Interface interactive détectée !",
        "💡 Excellent travail sur l'interactivité !",
        "🎯 Test d'évaluation automatique réussi !"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showNotification(randomMessage, 'success');
    
    // Effet visuel sur le bouton
    const button = event.target;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
    
    console.log('🎮 Interaction utilisateur détectée');
}

/**
 * Affiche une notification
 */
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles inline pour la notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Couleurs selon le type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8',
        warning: '#ffc107'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Animer l'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Supprimer après 4 secondes
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

/**
 * Valide un email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Gestion des erreurs JavaScript
 */
window.addEventListener('error', function(e) {
    console.error('❌ Erreur JavaScript:', e.error);
    showNotification('Une erreur s\'est produite', 'error');
});

/**
 * Performance monitoring
 */
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`⚡ Page chargée en ${loadTime.toFixed(2)}ms`);
    
    if (loadTime > 3000) {
        console.warn('⚠️ Temps de chargement élevé détecté');
    }
});

/**
 * Détection de la taille d'écran pour l'adaptabilité
 */
function checkResponsiveness() {
    const width = window.innerWidth;
    let device = 'desktop';
    
    if (width <= 480) {
        device = 'mobile';
    } else if (width <= 768) {
        device = 'tablet';
    }
    
    document.body.setAttribute('data-device', device);
    console.log(`📱 Device détecté: ${device} (${width}px)`);
}

// Vérifier au chargement et au redimensionnement
window.addEventListener('load', checkResponsiveness);
window.addEventListener('resize', checkResponsiveness);

// Export pour les tests (si nécessaire)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showMessage,
        isValidEmail,
        showNotification
    };
}
