document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURACIÓN ---
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSe5h25P2sxBjEiIytsnApheOfXTpYc4j7njHSI0PfWf3JZvkQ/viewform';
    const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSwohiRq4HO3c8B-i3zo1aCVOgNn6IeY5QKZAtufvV52dYm3oE8XJkvMbR2eZwn40s6vGpXGXTK9Iao/pub?gid=1974329891&single=true&output=csv';
    const NAME_ENTRY_ID = '987818306';
    const DATE_ENTRY_ID = '2011703115';
    const MESSAGE_ENTRY_ID = '451574532';
    const DATE_COLUMN_INDEX = 2; // La columna de la fecha en el CSV (0=Timestamp, 1=Nombre, 2=Fecha)

    // --- ELEMENTOS DEL DOM ---
    
    const novemberCalendar = document.getElementById('november-calendar');
    const decemberCalendar = document.getElementById('december-calendar');
    const modal = document.getElementById('message-modal');
    const closeModalBtn = document.querySelector('.modal-close-btn');
    const predictionForm = document.getElementById('prediction-form');
    const selectedDateText = document.getElementById('selected-date-text');
    const successMessage = document.getElementById('form-success-message');

    let selectedDate = '';

    function generateNovemberCalendar(year, month, container) {
        const monthIndex = month - 1;
        const weekDays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
        weekDays.forEach(day => {
            const dayNameEl = document.createElement('div');
            dayNameEl.className = 'calendar-day-name';
            dayNameEl.textContent = day;
            container.appendChild(dayNameEl);
        });

        // Last week of November 2025 starts on Monday 24th
        for (let day = 24; day <= 30; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.innerHTML = `<span class="day-number">${day}</span>`;
            dayEl.dataset.date = `${day} de Noviembre de ${year}`;
            container.appendChild(dayEl);
        }
    }

    /**
     * Genera un calendario para un mes y año específicos.
     */
    function generateCalendar(year, month, container) {
        const monthIndex = month - 1;
        const daysInMonth = new Date(year, month, 0).getDate();
        const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
        const dayOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

        const weekDays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
        weekDays.forEach(day => {
            const dayNameEl = document.createElement('div');
            dayNameEl.className = 'calendar-day-name';
            dayNameEl.textContent = day;
            container.appendChild(dayNameEl);
        });

        for (let i = 0; i < dayOffset; i++) {
            container.appendChild(document.createElement('div'));
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.innerHTML = `<span class="day-number">${day}</span>`;
            dayEl.dataset.date = `${day} de ${container.previousElementSibling.textContent.split(' ')[0]} de ${year}`;
            container.appendChild(dayEl);
        }
    }

    /**
     * Procesa los datos del CSV para contar votos por fecha.
     */
    function processVoteData(csvText) {
        const voteCounts = {};
        let totalVotes = 0;
        const rows = csvText.split(/\r?\n/);

        // Empezar desde 1 para saltar la fila de cabecera
        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].split(',');
            if (cells.length > DATE_COLUMN_INDEX) {
                const date = cells[DATE_COLUMN_INDEX].trim();
                if (date) {
                    voteCounts[date] = (voteCounts[date] || 0) + 1;
                    totalVotes++;
                }
            }
        }
        return { voteCounts, totalVotes };
    }

    /**
     * Muestra los votos visualmente en el calendario.
     */
    function displayVoteVisuals(voteCounts, totalVotes) {
        if (totalVotes === 0) return;

        document.querySelectorAll('.calendar-day[data-date]').forEach(dayEl => {
            const date = dayEl.dataset.date;
            if (voteCounts[date]) {
                const percentage = Math.round((voteCounts[date] / totalVotes) * 100);
                // Aplicar el estilo de fondo para el efecto de llenado
                dayEl.style.background = `linear-gradient(to top, #ffc0d9 ${percentage}%, #fff ${percentage}%)`;
            }
        });
    }

    /**
     * Obtiene los datos de votación y actualiza la UI.
     */
    async function fetchAndDisplayVotes() {
        try {
            const response = await fetch(GOOGLE_SHEET_CSV_URL);
            if (!response.ok) {
                throw new Error('Error al cargar los datos de votación.');
            }
            const csvText = await response.text();
            const { voteCounts, totalVotes } = processVoteData(csvText);
            displayVoteVisuals(voteCounts, totalVotes);
        } catch (error) {
            console.error('Fallo al obtener los votos:', error);
        }
    }

    /**
     * Configura los event listeners para los días del calendario.
     */
    function setupCalendarListeners() {
        document.querySelectorAll('.calendar-day[data-date]').forEach(day => {
            day.addEventListener('click', () => {
                selectedDate = day.dataset.date;
                selectedDateText.textContent = selectedDate;
                predictionForm.style.display = 'block';
                successMessage.style.display = 'none';
                document.getElementById('user-name').value = '';
                document.getElementById('user-message').value = '';
                modal.style.display = 'flex';
            });
        });
    }

    // --- Lógica del Modal y Formulario ---
    function closeModal() {
        modal.style.display = 'none';
    }

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    predictionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('user-name').value.trim();
        const message = document.getElementById('user-message').value;

        if (name === '') {
            alert('Por favor, dinos tu nombre.');
            return;
        }

        const formData = new FormData();
        formData.append(`entry.${NAME_ENTRY_ID}`, name);
        formData.append(`entry.${DATE_ENTRY_ID}`, selectedDate);
        formData.append(`entry.${MESSAGE_ENTRY_ID}`, message);

        fetch(GOOGLE_FORM_URL.replace('/viewform', '/formResponse'), {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        }).then(() => {
            predictionForm.style.display = 'none';
            successMessage.style.display = 'block';
            setTimeout(closeModal, 3000);
        }).catch(error => {
            console.error('Error al enviar:', error);
            alert('Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.');
        });
    });

    // --- INICIALIZACIÓN ---
    function init() {
        generateCalendar(2025, 11, novemberCalendar);
        generateCalendar(2025, 12, decemberCalendar);
        setupCalendarListeners();
        fetchAndDisplayVotes();
    }

    init();
});