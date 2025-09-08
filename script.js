document.addEventListener('DOMContentLoaded', function() {
    // --- CONSTANTES ---
    const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSwohiRq4HO3c8B-i3zo1aCVOgNn6IeY5QKZAtufvV52dYm3oE8XJkvMbR2eZwn40s6vGpXGXTK9Iao/pub?output=csv';
    const WISHLIST_URL = 'https://www.hellobb.net/guest/W5rk';

    // --- ELEMENTOS DEL DOM ---
    const wishlistBtn = document.getElementById('wishlistBtn');
    const wishlistModal = document.getElementById('wishlist-modal');
    const priceAckCheckbox = document.getElementById('price-ack-checkbox');
    const modalAcceptBtn = document.getElementById('modal-accept-btn');
    const interactiveBaby = document.getElementById('interactive-baby');
    const messageCountSpan = document.getElementById('message-count');

    // --- LÓGICA DEL BEBÉ INTERACTIVO ---

    // 1. Obtener y mostrar el número de mensajes
    async function fetchMessageCount() {
        try {
            const response = await fetch(GOOGLE_SHEET_CSV_URL);
            if (!response.ok) {
                console.error('Error de red al intentar obtener los mensajes.');
                return;
            }
            const csvText = await response.text();
            // Filtrar cualquier fila en blanco o con solo comas para un conteo más preciso
            const rows = csvText.split(/\r?\n/).filter(row => row.replace(/,/g, '').trim() !== '');
            // El conteo es el número de filas menos la cabecera. Si solo hay cabecera, el conteo es 0.
            const messageCount = rows.length > 1 ? rows.length - 1 : 0;
            updateBaby(messageCount);
        } catch (error) {
            console.error('Error al cargar o procesar los mensajes:', error);
        }
    }

    // 2. Actualizar la apariencia y texto del bebé
    function updateBaby(count) {
        messageCountSpan.textContent = count;
        interactiveBaby.classList.remove('happy-1', 'happy-2', 'happy-3');
        if (count >= 16) {
            interactiveBaby.classList.add('happy-3');
        } else if (count >= 6) {
            interactiveBaby.classList.add('happy-2');
        } else if (count > 0) {
            interactiveBaby.classList.add('happy-1');
        }
    }

    // 3. Lógica para arrastrar al bebé
    let isDragging = false;
    let offsetX, offsetY;

    function startDrag(e) {
        isDragging = true;
        interactiveBaby.classList.add('dragging');
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        offsetX = clientX - interactiveBaby.offsetLeft;
        offsetY = clientY - interactiveBaby.offsetTop;
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
        if (e.type === 'touchmove') e.preventDefault();
    }

    function onDrag(e) {
        if (!isDragging) return;
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        let newX = clientX - offsetX;
        let newY = clientY - offsetY;

        const maxX = window.innerWidth - interactiveBaby.offsetWidth;
        const maxY = window.innerHeight - interactiveBaby.offsetHeight;
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        interactiveBaby.style.left = `${newX}px`;
        interactiveBaby.style.top = `${newY}px`;
        if (e.type === 'touchmove') e.preventDefault();
    }

    function stopDrag() {
        isDragging = false;
        interactiveBaby.classList.remove('dragging');
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
    }

    interactiveBaby.addEventListener('mousedown', startDrag);
    interactiveBaby.addEventListener('touchstart', startDrag, { passive: false });

    // --- LÓGICA DEL MODAL DE AVISO ---
    wishlistBtn.addEventListener('click', () => {
        wishlistModal.style.display = 'flex';
    });

    priceAckCheckbox.addEventListener('change', () => {
        modalAcceptBtn.disabled = !priceAckCheckbox.checked;
    });

    modalAcceptBtn.addEventListener('click', () => {
        if (!priceAckCheckbox.checked) return;
        wishlistModal.style.display = 'none';
        createConfetti();
        setTimeout(() => { window.open(WISHLIST_URL, '_blank'); }, 300);
    });

    // --- OTRAS ANIMACIONES Y EFECTOS ---
    function createConfetti() {
        const colors = ['#ff69b4', '#ff1493', '#dc143c', '#ffd1e8', '#ffb3d9'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `position:fixed;width:10px;height:10px;background-color:${colors[Math.floor(Math.random()*colors.length)]};left:${Math.random()*window.innerWidth}px;top:-10px;border-radius:50%;pointer-events:none;z-index:1000;animation:confettiFall ${Math.random()*3+2}s linear forwards`;
            document.body.appendChild(confetti);
            setTimeout(() => { confetti.remove(); }, 5000);
        }
    }

    // --- INICIALIZACIÓN ---
    fetchMessageCount();

});

// CSS adicional para animaciones JS
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
`;
document.head.appendChild(style);