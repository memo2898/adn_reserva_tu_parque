/**
 * UI ENHANCEMENTS - Mejoras visuales para el multistep form
 * Este archivo complementa Rs_main.js sin modificarlo
 */

// ============================================
// ACTUALIZAR BARRA DE PROGRESO
// ============================================

/**
 * Actualiza la barra de progreso visual según el paso actual
 * @param {number} step - Número del paso actual (1-5)
 */
function updateProgressBar(step) {
    const progressBar = document.getElementById('progressBarFill');
    if (!progressBar) return;

    const progressPercentages = {
        1: '20%',
        2: '40%',
        3: '60%',
        4: '80%',
        5: '100%'
    };

    progressBar.style.width = progressPercentages[step] || '20%';
}

// ============================================
// MEJORAR FUNCIONES EXISTENTES
// ============================================

// Guardar la función original Iluminar
const originalIluminar = window.Iluminar;

// Sobrescribir Iluminar para incluir actualización de barra de progreso
window.Iluminar = function() {
    // Llamar función original
    if (originalIluminar) {
        originalIluminar();
    }

    // Actualizar barra de progreso
    if (typeof position !== 'undefined') {
        updateProgressBar(position);
    }
};

// ============================================
// ANIMACIONES SUAVES PARA CARDS
// ============================================

/**
 * Agrega clases de animación a elementos cuando aparecen
 */
function initCardAnimations() {
    const cards = document.querySelectorAll('.card_map, .zone_map');

    // Observador de intersección para animaciones al scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, index * 50); // Delay escalonado
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => observer.observe(card));
}

// ============================================
// MEJORAR FEEDBACK DE VALIDACIÓN
// ============================================

/**
 * Agrega animación shake a inputs con error
 */
function enhanceValidationFeedback() {
    // Observar cambios en la clase Input_red
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const element = mutation.target;
                if (element.classList.contains('Input_red')) {
                    // Asegurar que la animación se ejecute
                    element.style.animation = 'none';
                    setTimeout(() => {
                        element.style.animation = '';
                    }, 10);
                }
            }
        });
    });

    // Observar todos los inputs
    document.querySelectorAll('.AlignInfo, .InputAlign, .EventInfo').forEach(input => {
        observer.observe(input, { attributes: true });
    });
}

// ============================================
// SMOOTH SCROLL PARA NAVEGACIÓN
// ============================================

/**
 * Añade smooth scroll cuando se selecciona un parque/zona
 */
function initSmoothScroll() {
    // Scroll suave al hacer clic en cards
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.card_map, .zone_map');
        if (card) {
            // Pequeño scroll para centrar el elemento seleccionado
            setTimeout(() => {
                card.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }, 100);
        }
    });
}

// ============================================
// MEJORAR TRANSICIONES ENTRE STEPS
// ============================================

// Guardar funciones originales
const originalNext = window.Next;
const originalPrevious = window.Previous;

// Mejorar Next con animaciones
window.Next = async function() {
    const currentForm = document.querySelector('.Form' + position);

    if (currentForm) {
        currentForm.style.opacity = '0.5';
        currentForm.style.transform = 'scale(0.98)';
    }

    // Llamar función original
    if (originalNext) {
        await originalNext();
    }

    // Restaurar opacidad del nuevo form
    setTimeout(() => {
        const newForm = document.querySelector('.Form' + position);
        if (newForm) {
            newForm.style.opacity = '1';
            newForm.style.transform = 'scale(1)';
        }
    }, 100);
};

// Mejorar Previous con animaciones
window.Previous = function() {
    const currentForm = document.querySelector('.Form' + position);

    if (currentForm) {
        currentForm.style.opacity = '0.5';
        currentForm.style.transform = 'scale(0.98)';
    }

    // Llamar función original
    if (originalPrevious) {
        originalPrevious();
    }

    // Restaurar opacidad del nuevo form
    setTimeout(() => {
        const newForm = document.querySelector('.Form' + position);
        if (newForm) {
            newForm.style.opacity = '1';
            newForm.style.transform = 'scale(1)';
        }
    }, 100);
};

// ============================================
// TOOLTIPS MEJORADOS
// ============================================

/**
 * Agrega tooltips informativos a los pasos
 */
function initTooltips() {
    const steps = [
        { selector: '.FormStatus:nth-child(1), .FormStatus2:nth-child(2)', text: 'Selecciona tu parque favorito' },
        { selector: '.FormStatus:nth-child(2), .FormStatus2:nth-child(3)', text: 'Completa tu información personal' },
        { selector: '.FormStatus:nth-child(3), .FormStatus2:nth-child(4)', text: 'Detalles del evento' },
        { selector: '.FormStatus:nth-child(4), .FormStatus2:nth-child(5)', text: 'Elige la zona del parque' },
        { selector: '.FormStatus:nth-child(5), .FormStatus2:nth-child(6)', text: 'Confirma tu reservación' }
    ];

    steps.forEach(step => {
        const elements = document.querySelectorAll(step.selector);
        elements.forEach(element => {
            element.setAttribute('title', step.text);
        });
    });
}

// ============================================
// AUTO-RESIZE PARA TEXTAREA
// ============================================

/**
 * Hace que el textarea crezca automáticamente
 */
function initAutoResizeTextarea() {
    const textarea = document.querySelector('#MotivoEvento');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }
}

// ============================================
// CONTADOR DE CARACTERES
// ============================================

/**
 * Agrega contador visual para el textarea
 */
function initCharacterCounter() {
    const textarea = document.querySelector('#MotivoEvento');
    if (!textarea) return;

    const maxLength = 600;
    const minLength = 15;

    // Crear elemento contador
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
        text-align: right;
        font-size: 0.85rem;
        color: var(--GrisC);
        margin-top: 0.25rem;
        transition: color 0.3s ease;
    `;

    textarea.parentNode.insertBefore(counter, textarea.nextSibling);

    // Actualizar contador
    function updateCounter() {
        const length = textarea.value.trim().replace(/\s/g, '').length;
        counter.textContent = `${length}/${maxLength} caracteres`;

        if (length < minLength) {
            counter.style.color = '#dc3545';
        } else if (length > maxLength * 0.9) {
            counter.style.color = '#ffc107';
        } else {
            counter.style.color = 'var(--Verde)';
        }
    }

    textarea.addEventListener('input', updateCounter);
    updateCounter(); // Inicial
}

// ============================================
// MEJORAR LOADER
// ============================================

/**
 * Agrega texto dinámico al loader
 */
function enhanceLoader() {
    const loaderTexts = [
        'Verificando documento...',
        'Consultando disponibilidad...',
        'Validando información...',
        'Procesando solicitud...'
    ];

    let currentTextIndex = 0;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const loader = mutation.target;
            if (loader.style.visibility === 'initial' || loader.style.visibility === 'visible') {
                // Rotar textos cada 2 segundos
                const interval = setInterval(() => {
                    if (loader.style.visibility !== 'initial' && loader.style.visibility !== 'visible') {
                        clearInterval(interval);
                        return;
                    }
                    currentTextIndex = (currentTextIndex + 1) % loaderTexts.length;
                }, 2000);
            }
        });
    });

    const loaderContainer = document.querySelector('.loader-container');
    if (loaderContainer) {
        observer.observe(loaderContainer, { attributes: true, attributeFilter: ['style'] });
    }
}

// ============================================
// PREVIEW DE IMÁGENES DE PARQUES
// ============================================

/**
 * Agrega efecto de preview al hacer hover en imágenes
 */
function initImagePreview() {
    const images = document.querySelectorAll('.M_img, .Z_img');

    images.forEach(img => {
        img.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    });
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 UI Enhancements cargadas correctamente');

    // Inicializar todas las mejoras
    setTimeout(() => {
        initCardAnimations();
        enhanceValidationFeedback();
        initSmoothScroll();
        initTooltips();
        initAutoResizeTextarea();
        initCharacterCounter();
        enhanceLoader();
        initImagePreview();

        // Actualizar barra de progreso inicial
        updateProgressBar(1);
    }, 100);
});

// Actualizar barra cuando cambie position
if (typeof position !== 'undefined') {
    let lastPosition = position;
    setInterval(() => {
        if (position !== lastPosition) {
            updateProgressBar(position);
            lastPosition = position;
        }
    }, 100);
}

// ============================================
// UTILIDADES PÚBLICAS
// ============================================

// Exportar funciones útiles al scope global
window.UIEnhancements = {
    updateProgressBar,
    initCardAnimations,
    enhanceValidationFeedback,
    initSmoothScroll
};

console.log('✨ Sistema de mejoras UI inicializado');
