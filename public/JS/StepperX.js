/**
 * StepperX - Componente de pasos adaptado para vanilla JS
 * Basado en el componente React del ejemplo
 */

class StepperX {
    constructor() {
        this.currentStep = 1; // Empezamos en paso 1
        this.totalSteps = 5;
        this.completedSteps = [];

        this.init();
    }

    init() {
        // Sincronizar con la variable global position
        if (typeof position !== 'undefined') {
            this.currentStep = position;
        }

        // Interceptar funciones de navegación existentes
        this.setupNavigationInterceptors();

        // Interceptar función de selección de parque
        this.setupParkSelectorInterceptor();

        // Actualizar el indicador inicial
        this.updateIndicator();

        // Observar cambios en position
        this.observePositionChanges();
    }

    setupNavigationInterceptors() {
        // Guardar funciones originales
        const originalNext = window.Next;
        const originalPrevious = window.Previous;
        const originalIluminar = window.Iluminar;

        const self = this;

        // Interceptar Next
        if (originalNext) {
            window.Next = async function() {
                const result = await originalNext.call(this);
                self.currentStep = position;
                self.updateIndicator();
                return result;
            };
        }

        // Interceptar Previous
        if (originalPrevious) {
            window.Previous = function() {
                const result = originalPrevious.call(this);
                self.currentStep = position;
                self.updateIndicator();
                return result;
            };
        }

        // Interceptar Iluminar
        if (originalIluminar) {
            window.Iluminar = function() {
                const result = originalIluminar.call(this);
                self.currentStep = position;
                self.updateIndicator();
                return result;
            };
        }
    }

    setupParkSelectorInterceptor() {
        // Usar setTimeout para asegurar que ParkSelector ya esté definida
        setTimeout(() => {
            const originalParkSelector = window.ParkSelector;

            if (originalParkSelector) {
                console.log('✅ Interceptando ParkSelector');
                window.ParkSelector = function(ID, Nombre) {
                    console.log('🎯 ParkSelector llamado para parque:', ID, Nombre);

                    const container = document.getElementById('park-selection-container');
                    const selectedCard = document.getElementById('PK_' + ID);
                    const isAlreadySelected = selectedCard && selectedCard.classList.contains('selected');

                    // Si ya está seleccionado, deseleccionar (toggle)
                    if (isAlreadySelected) {
                        console.log('🔄 Deseleccionando parque:', ID);

                        // Remover clase selected
                        selectedCard.classList.remove('selected');

                        // Quitar modo split
                        if (container) {
                            container.classList.remove('split-mode');
                        }

                        // Ocultar todos los detalles
                        const allParkDetails = document.querySelectorAll('.tag_center');
                        allParkDetails.forEach(detail => {
                            detail.style.display = 'none';
                        });

                        console.log('✅ Parque deseleccionado');
                        return;
                    }

                    // Si es una nueva selección, llamar función original
                    const result = originalParkSelector.call(this, ID, Nombre);

                    // Activar modo split
                    if (container) {
                        container.classList.add('split-mode');
                        console.log('📐 Modo split activado');
                    }

                    // Asegurar que el parque específico esté visible
                    // Primero ocultar todos los detalles de parques
                    const allParkDetails = document.querySelectorAll('.tag_center');
                    allParkDetails.forEach(detail => {
                        detail.style.display = 'none';
                    });

                    // Luego mostrar solo el seleccionado
                    const selectedParkDetail = document.getElementById('park_' + ID);
                    if (selectedParkDetail) {
                        selectedParkDetail.style.display = 'block';
                        console.log('🗺️ Detalles del parque mostrados:', ID);
                    }

                    // Remover clase 'selected' de todos los cards
                    const allCards = document.querySelectorAll('.park-card');
                    allCards.forEach(card => card.classList.remove('selected'));

                    // Agregar clase 'selected' al card clickeado
                    if (selectedCard) {
                        selectedCard.classList.add('selected');
                        console.log('✨ Card seleccionado:', ID);
                    }

                    return result;
                };
            } else {
                console.warn('⚠️ ParkSelector no encontrada, no se puede interceptar');
            }
        }, 500);
    }

    observePositionChanges() {
        const self = this;
        let lastPosition = this.currentStep;

        setInterval(() => {
            if (typeof position !== 'undefined' && position !== lastPosition) {
                self.currentStep = position;
                self.updateIndicator();
                lastPosition = position;
            }
        }, 100);
    }

    updateIndicator() {
        // Actualizar todos los pasos
        for (let i = 1; i <= this.totalSteps; i++) {
            this.updateStep(i);
        }
    }

    updateStep(stepNumber) {
        const stepElement = document.querySelector(`[data-step="${stepNumber}"]`);
        if (!stepElement) return;

        // Remover todas las clases de estado
        stepElement.classList.remove('pending', 'current', 'completed');

        // Determinar estado
        let status = 'pending';
        if (stepNumber < this.currentStep) {
            status = 'completed';
        } else if (stepNumber === this.currentStep) {
            status = 'current';
        }

        // Aplicar clase de estado
        stepElement.classList.add(status);

        // Actualizar línea conectora
        const connector = stepElement.querySelector('.stepperx-connector');
        if (connector && stepNumber < this.currentStep) {
            connector.style.background = '#22c55e'; // verde para completados
        } else if (connector) {
            connector.style.background = '#e2e8f0'; // gris por defecto
        }
    }

    goToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > this.totalSteps) return;

        // Solo permitir ir a pasos previos o al siguiente
        if (stepNumber < this.currentStep || stepNumber === this.currentStep + 1) {
            this.currentStep = stepNumber;

            // Actualizar variable global
            if (typeof position !== 'undefined') {
                position = stepNumber;
            }

            // Llamar a la función existente si hay
            if (typeof FormOpcion === 'function') {
                FormOpcion(stepNumber);
            }

            this.updateIndicator();
        }
    }

    reset() {
        this.currentStep = 1;
        this.completedSteps = [];
        this.updateIndicator();
    }
}

// Función global para manejar la carga del mapa
window.handleMapLoad = function(parkId, iframeElement) {
    const skeleton = document.getElementById('map-skeleton-' + parkId);

    if (skeleton) {
        skeleton.classList.add('hidden');
    }

    if (iframeElement) {
        iframeElement.classList.add('loaded');
    }

    console.log('🗺️ Mapa cargado para parque:', parkId);
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.stepperX = new StepperX();
    console.log('✅ StepperX inicializado');
});
