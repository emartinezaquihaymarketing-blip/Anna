document.addEventListener('DOMContentLoaded', () => {
    const novemberCalendar = document.getElementById('november-calendar');
    const decemberCalendar = document.getElementById('december-calendar');
    const modal = document.getElementById('message-modal');
    const closeModalBtn = document.querySelector('.modal-close-btn');
    const predictionForm = document.getElementById('prediction-form');
    const selectedDateText = document.getElementById('selected-date-text');
    const successMessage = document.getElementById('form-success-message');

    let selectedDate = '';

    // --- IMPORTANTE: Instrucciones para el usuario ---
    // 1. Crea un Google Form con dos preguntas de "Respuesta corta": una para la 'Fecha' y otra para el 'Mensaje'.
    // 2. Haz clic en "Enviar" > icono de enlace (<>) > y copia la URL del formulario.
    // 3. Pega la URL aquí abajo, reemplazando la URL de ejemplo.
    //    Ejemplo: 'https://docs.google.com/forms/d/e/ABCDEFGHIJKL/viewform'
        const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSe5h25P2sxBjEiIytsnApheOfXTpYc4j7njHSI0PfWf3JZvkQ/viewform';

    /**
     * Genera un calendario para un mes y año específicos.
     * @param {number} year - El año del calendario.
     * @param {number} month - El mes del calendario (1 = Enero, 12 = Diciembre).
     * @param {HTMLElement} container - El elemento contenedor para el calendario.
     */
    function generateCalendar(year, month, container) {
        const monthIndex = month - 1;
        const daysInMonth = new Date(year, month, 0).getDate();
        const firstDayOfMonth = new Date(year, monthIndex, 1).getDay(); // 0=Domingo, 1=Lunes
        const dayOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1; // Lunes como primer día

        // Nombres de los días de la semana
        const weekDays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
        weekDays.forEach(day => {
            const dayNameEl = document.createElement('div');
            dayNameEl.className = 'calendar-day-name';
            dayNameEl.textContent = day;
            container.appendChild(dayNameEl);
        });

        // Espacios en blanco para los días antes del primero del mes
        for (let i = 0; i < dayOffset; i++) {
            container.appendChild(document.createElement('div'));
        }

        // Días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;
            dayEl.dataset.date = `${day} de ${container.previousElementSibling.textContent.split(' ')[0]} de ${year}`;
            container.appendChild(dayEl);
        }
    }

    // Generar los calendarios
    generateCalendar(2025, 11, novemberCalendar);
    generateCalendar(2025, 12, decemberCalendar);

    // Abrir el modal al hacer clic en un día
    document.querySelectorAll('.calendar-day').forEach(day => {
        if (day.textContent) { // Solo añadir evento si es un día real
            day.addEventListener('click', () => {
                selectedDate = day.dataset.date;
                selectedDateText.textContent = selectedDate;
                predictionForm.style.display = 'block';
                successMessage.style.display = 'none';
                document.getElementById('user-message').value = '';
                modal.style.display = 'flex';
            });
        }
    });

    // Cerrar el modal
    function closeModal() {
        modal.style.display = 'none';
    }

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Enviar el formulario
    predictionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = document.getElementById('user-message').value;

        if (GOOGLE_FORM_URL === '
https://docs.google.com/forms/d/e/1FAIpQLSe5h25P2sxBjEiIytsnApheOfXTpYc4j7njHSI0PfWf3JZvkQ/viewform') {
            alert('Por favor, configura la URL de tu Google Form en el archivo prediction.js');
            return;
        }

        // --- IMPORTANTE: Mapeo de los campos del formulario ---
        // Asegúrate de que los nombres de los campos ('entry.XXXXX') coinciden con los de tu Google Form.
        // Para encontrarlos: ve a tu formulario > obtén el enlace pre-rellenado > rellena los campos y obtén el enlace.
        // Los 'entry.XXXXX' estarán en la URL generada.
        const formData = new FormData();
                formData.append('entry.2011703115', selectedDate); // Reemplaza XXXXXXX con el ID de tu campo 'Fecha'
                formData.append('entry.451574532', message);    // Reemplaza YYYYYYY con el ID de tu campo 'Mensaje'    // Reemplaza YYYYYYY con el ID de tu campo 'Mensaje'

        // Envío de datos en segundo plano
        fetch(GOOGLE_FORM_URL.replace('/viewform', '/formResponse'), {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // 'no-cors' es necesario para evitar errores de CORS con Google Forms
        }).then(() => {
            predictionForm.style.display = 'none';
            successMessage.style.display = 'block';
            setTimeout(closeModal, 3000); // Cierra el modal después de 3 segundos
        }).catch(error => {
            console.error('Error al enviar:', error);
            alert('Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.');
        });
    });
});