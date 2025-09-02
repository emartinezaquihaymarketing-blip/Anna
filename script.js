document.addEventListener('DOMContentLoaded', function() {
    // --- ELEMENTOS PRINCIPALES ---
    const wishlistBtn = document.getElementById('wishlistBtn');
    
    // --- ELEMENTOS DEL MODAL DE AVISO ---
    const wishlistModal = document.getElementById('wishlist-modal');
    const priceAckCheckbox = document.getElementById('price-ack-checkbox');
    const modalAcceptBtn = document.getElementById('modal-accept-btn');

    const wishlistUrl = 'https://www.hellobb.net/guest/W5rk'; // URL de la lista de deseos

    // --- LÓGICA DEL MODAL DE AVISO ---

    // 1. Abrir el modal al hacer clic en el botón de la lista de deseos
    wishlistBtn.addEventListener('click', function() {
        wishlistModal.style.display = 'flex';
    });

    // 2. Activar/desactivar el botón de Aceptar según el estado del checkbox
    priceAckCheckbox.addEventListener('change', function() {
        modalAcceptBtn.disabled = !this.checked;
    });

    // 3. Cerrar modal y redirigir al hacer clic en Aceptar
    modalAcceptBtn.addEventListener('click', function() {
        if (!priceAckCheckbox.checked) return; // Doble seguridad

        // Ocultar el modal
        wishlistModal.style.display = 'none';

        // Efecto de confeti (opcional, mantenido del código original)
        createConfetti();
        
        // Redirigir a la lista de deseos después de un breve delay
        setTimeout(() => {
            window.open(wishlistUrl, '_blank');
        }, 300);
    });


    // --- OTRAS ANIMACIONES Y EFECTOS (código original) ---

    const floatingElements = document.querySelectorAll('.element');

    // Efecto hover mejorado para el botón principal
    wishlistBtn.addEventListener('mouseenter', function() {
        this.style.background = 'linear-gradient(45deg, #ff1493, #dc143c, #b91372)';
        createSparkles(this);
    });

    wishlistBtn.addEventListener('mouseleave', function() {
        this.style.background = 'linear-gradient(45deg, #ff69b4, #ff1493, #dc143c)';
    });

    // Función para crear efecto confeti
    function createConfetti() {
        const colors = ['#ff69b4', '#ff1493', '#dc143c', '#ffd1e8', '#ffb3d9'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';
            confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;

            document.body.appendChild(confetti);

            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }
    }

    // Función para crear destellos en el botón
    function createSparkles(button) {
        const sparkleCount = 8;
        const buttonRect = button.getBoundingClientRect();

        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.position = 'fixed';
            sparkle.style.left = (buttonRect.left + Math.random() * buttonRect.width) + 'px';
            sparkle.style.top = (buttonRect.top + Math.random() * buttonRect.height) + 'px';
            sparkle.style.fontSize = '12px';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1001';
            sparkle.style.animation = 'sparkleEffect 1s ease-out forwards';

            document.body.appendChild(sparkle);

            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 1000);
        }
    }

    // Animación de elementos flotantes
    floatingElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.3) rotate(15deg)';
            this.style.transition = 'transform 0.3s ease';
        });

        element.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Efecto parallax suave
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed * 20;
            const y = (mouseY - 0.5) * speed * 20;
            
            element.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // Animación de entrada
    function animateOnLoad() {
        const elements = document.querySelectorAll('.title-line, .subtitle, .baby-illustration, .cta-button, .message');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    setTimeout(animateOnLoad, 100);

    // Partículas dinámicas
    function createDynamicParticles() {
        const particleContainer = document.querySelector('.particles');
        setInterval(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            particle.style.opacity = Math.random() * 0.6 + 0.2;
            particleContainer.appendChild(particle);
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 8000);
        }, 2000);
    }
    createDynamicParticles();

    // Efecto de respiración en el cochecito
    const babyCarriage = document.querySelector('.baby-carriage');
    setInterval(() => {
        babyCarriage.style.transform = 'scale(1.05)';
        setTimeout(() => {
            babyCarriage.style.transform = 'scale(1)';
        }, 1000);
    }, 4000);
});

// CSS adicional para animaciones JS
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    @keyframes sparkleEffect {
        0% { opacity: 1; transform: scale(0) rotate(0deg); }
        50% { opacity: 1; transform: scale(1) rotate(180deg); }
        100% { opacity: 0; transform: scale(0) rotate(360deg); }
    }
    .baby-carriage { transition: transform 0.5s ease-in-out; }
    .element { transition: transform 0.1s ease-out; cursor: pointer; }
`;
document.head.appendChild(style);