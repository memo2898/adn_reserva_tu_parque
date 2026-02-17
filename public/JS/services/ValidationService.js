/**
 * VALIDATION SERVICE
 * Servicio centralizado para todas las validaciones del sistema
 */

class ValidationService {
    constructor() {
        this.validationRules = {
            email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            numbersOnly: /^[+]?\d+$/,
            alphanumeric: /^[a-zA-Z0-9]+$/
        };
    }

    // ============================================
    // VALIDACIÓN DE CÉDULA DOMINICANA
    // ============================================

    /**
     * Valida una cédula dominicana
     * @param {string} cedula - Número de cédula a validar
     * @returns {Promise<boolean>}
     */
    validarCedulaDominicana(cedula) {
        return new Promise((resolve, reject) => {
            const c = cedula.replace(/-/g, '');
            const cedulaDigits = c.substr(0, c.length - 1);
            const verificador = c.substr(c.length - 1, 1);
            let suma = 0;

            if (cedula.length < 11) {
                reject(new Error('Cédula inválida: muy corta'));
                return;
            }

            for (let i = 0; i < cedulaDigits.length; i++) {
                const mod = (i % 2) === 0 ? 1 : 2;
                let res = cedulaDigits.substr(i, 1) * mod;

                if (res > 9) {
                    const resStr = res.toString();
                    const uno = parseInt(resStr.substr(0, 1));
                    const dos = parseInt(resStr.substr(1, 1));
                    res = uno + dos;
                }

                suma += res;
            }

            const elNumero = (10 - (suma % 10)) % 10;

            if (elNumero == verificador && cedulaDigits.substr(0, 3) !== "000") {
                resolve(true);
            } else {
                reject(new Error('Cédula inválida'));
            }
        });
    }

    // ============================================
    // VALIDACIÓN DE EMAIL
    // ============================================

    /**
     * Valida formato de correo electrónico
     * @param {string} email - Email a validar
     * @returns {boolean}
     */
    validarEmail(email) {
        return this.validationRules.email.test(email);
    }

    /**
     * Valida formato de email y muestra feedback visual
     * @param {HTMLElement} input - Elemento input
     * @param {HTMLElement} errorElement - Elemento para mostrar error
     * @returns {boolean}
     */
    validarEmailConFeedback(input, errorElement = null) {
        const email = input.value.trim();
        const isValid = this.validarEmail(email);

        if (!isValid && email !== '') {
            input.classList.add('Input_red');
            if (errorElement) {
                errorElement.style.visibility = 'visible';
                errorElement.textContent = 'Formato de correo inválido';
            }
        } else {
            input.classList.remove('Input_red');
            if (errorElement) {
                errorElement.style.visibility = 'hidden';
            }
        }

        return isValid;
    }

    // ============================================
    // VALIDACIÓN DE TELÉFONO
    // ============================================

    /**
     * Valida que solo contenga números
     * @param {string} value - Valor a validar
     * @returns {boolean}
     */
    validarSoloNumeros(value) {
        return this.validationRules.numbersOnly.test(value);
    }

    /**
     * Valida un número de teléfono usando intl-tel-input
     * @param {object} phoneInput - Instancia de intlTelInput
     * @returns {boolean}
     */
    validarTelefono(phoneInput) {
        if (!phoneInput) return false;
        return phoneInput.isValidNumber();
    }

    // ============================================
    // VALIDACIÓN DE NOMBRES Y TEXTO
    // ============================================

    /**
     * Valida que el texto no esté vacío y tenga longitud mínima
     * @param {string} text - Texto a validar
     * @param {number} minLength - Longitud mínima (default: 2)
     * @returns {boolean}
     */
    validarTextoNoVacio(text, minLength = 2) {
        const trimmed = text.trim();
        return trimmed.length >= minLength;
    }

    /**
     * Valida nombre completo (nombre + apellido)
     * @param {string} nombre - Nombre
     * @param {string} apellido - Apellido
     * @returns {object} { isValid: boolean, errors: string[] }
     */
    validarNombreCompleto(nombre, apellido) {
        const errors = [];

        if (!this.validarTextoNoVacio(nombre, 2)) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }

        if (!this.validarTextoNoVacio(apellido, 2)) {
            errors.push('El apellido debe tener al menos 2 caracteres');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // ============================================
    // VALIDACIÓN DE NÚMEROS
    // ============================================

    /**
     * Valida que sea un número positivo
     * @param {string|number} value - Valor a validar
     * @param {boolean} allowZero - Permitir cero (default: false)
     * @returns {boolean}
     */
    validarNumeroPositivo(value, allowZero = false) {
        if (!this.validarSoloNumeros(String(value))) {
            return false;
        }

        const num = parseInt(value, 10);
        return allowZero ? num >= 0 : num > 0;
    }

    /**
     * Valida que un número esté en un rango
     * @param {number} value - Valor a validar
     * @param {number} min - Valor mínimo
     * @param {number} max - Valor máximo
     * @returns {boolean}
     */
    validarRango(value, min, max) {
        const num = parseInt(value, 10);
        return !isNaN(num) && num >= min && num <= max;
    }

    // ============================================
    // VALIDACIÓN DE FECHAS
    // ============================================

    /**
     * Valida que una fecha sea futura
     * @param {string} fecha - Fecha en formato YYYY-MM-DD
     * @param {number} diasMinimos - Días mínimos en el futuro (default: 0)
     * @returns {boolean}
     */
    validarFechaFutura(fecha, diasMinimos = 0) {
        const fechaSeleccionada = new Date(fecha);
        const fechaActual = new Date();
        fechaActual.setHours(0, 0, 0, 0);

        if (diasMinimos > 0) {
            fechaActual.setDate(fechaActual.getDate() + diasMinimos);
        }

        return fechaSeleccionada >= fechaActual;
    }

    /**
     * Valida que una fecha esté dentro del tiempo de espera del parque
     * @param {string} fecha - Fecha en formato YYYY-MM-DD
     * @param {string} horaInicio - Hora de inicio HH:MM
     * @param {number} diasEspera - Días de espera del parque
     * @returns {boolean}
     */
    validarTiempoEsperaParque(fecha, horaInicio, diasEspera) {
        const fechaSeleccionada = new Date(fecha);
        const fechaMinima = this.obtenerFechaFutura(diasEspera);

        if (fecha > fechaMinima) {
            return true;
        } else if (fecha === fechaMinima) {
            return horaInicio > this.obtenerHoraActual();
        }

        return false;
    }

    // ============================================
    // VALIDACIÓN DE HORARIOS
    // ============================================

    /**
     * Valida que un horario sea válido
     * @param {string} horaInicio - Hora inicio HH:MM
     * @param {string} horaFin - Hora fin HH:MM
     * @param {number} minutosMinimos - Duración mínima en minutos (default: 60)
     * @returns {object} { isValid: boolean, error: string }
     */
    validarHorario(horaInicio, horaFin, minutosMinimos = 60) {
        if (!horaInicio || !horaFin) {
            return { isValid: false, error: 'Debe seleccionar horario de inicio y fin' };
        }

        const [inicioHora, inicioMin] = horaInicio.split(':').map(Number);
        const [finHora, finMin] = horaFin.split(':').map(Number);

        const inicioMinutos = inicioHora * 60 + inicioMin;
        const finMinutos = finHora * 60 + finMin;

        if (finMinutos <= inicioMinutos) {
            return { isValid: false, error: 'La hora de fin debe ser posterior a la hora de inicio' };
        }

        const duracion = finMinutos - inicioMinutos;
        if (duracion < minutosMinimos) {
            return {
                isValid: false,
                error: `La reserva debe tener una duración mínima de ${minutosMinimos} minutos`
            };
        }

        return { isValid: true, error: null };
    }

    /**
     * Valida que un horario esté dentro del horario del parque
     * @param {string} horaInicio - Hora inicio HH:MM
     * @param {string} horaFin - Hora fin HH:MM
     * @param {string} aperturaParque - Hora apertura HH:MM
     * @param {string} cierreParque - Hora cierre HH:MM
     * @returns {boolean}
     */
    validarHorarioDentroDeHorarioParque(horaInicio, horaFin, aperturaParque, cierreParque) {
        return horaInicio >= aperturaParque &&
               horaFin <= cierreParque &&
               horaInicio < horaFin;
    }

    // ============================================
    // VALIDACIÓN DE DESCRIPCIÓN
    // ============================================

    /**
     * Valida la descripción del evento
     * @param {string} descripcion - Descripción del evento
     * @param {number} minCaracteres - Caracteres mínimos sin espacios (default: 15)
     * @param {number} maxCaracteres - Caracteres máximos (default: 600)
     * @returns {object} { isValid: boolean, error: string, length: number }
     */
    validarDescripcion(descripcion, minCaracteres = 15, maxCaracteres = 600) {
        const trimmed = descripcion.trim();
        const sinEspacios = trimmed.replace(/\s/g, '');

        if (sinEspacios.length < minCaracteres) {
            return {
                isValid: false,
                error: `La descripción debe tener al menos ${minCaracteres} caracteres`,
                length: sinEspacios.length
            };
        }

        if (trimmed.length > maxCaracteres) {
            return {
                isValid: false,
                error: `La descripción no puede exceder ${maxCaracteres} caracteres`,
                length: trimmed.length
            };
        }

        return {
            isValid: true,
            error: null,
            length: sinEspacios.length
        };
    }

    // ============================================
    // FORMATEO DE DOCUMENTOS
    // ============================================

    /**
     * Formatea una cédula dominicana con guiones
     * @param {string} cedula - Cédula sin formato
     * @returns {string} - Cédula formateada XXX-XXXXXXX-X
     */
    formatearCedula(cedula) {
        let valor = cedula.replace(/-/g, '');

        if (valor.length > 3) {
            valor = valor.slice(0, 3) + '-' + valor.slice(3);
        }

        if (valor.length > 11) {
            valor = valor.slice(0, 11) + '-' + valor.slice(11);
        }

        return valor;
    }

    // ============================================
    // UTILIDADES DE FECHA/HORA
    // ============================================

    /**
     * Obtiene la fecha actual en formato YYYY-MM-DD
     * @returns {string}
     */
    obtenerFechaActual() {
        const fecha = new Date();
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');
        return `${año}-${mes}-${dia}`;
    }

    /**
     * Obtiene una fecha futura
     * @param {number} dias - Días en el futuro
     * @returns {string} - Fecha en formato YYYY-MM-DD
     */
    obtenerFechaFutura(dias) {
        const hoy = new Date();
        const futuro = new Date(hoy.getTime() + dias * 24 * 60 * 60 * 1000);
        const año = futuro.getFullYear();
        const mes = String(futuro.getMonth() + 1).padStart(2, '0');
        const dia = String(futuro.getDate()).padStart(2, '0');
        return `${año}-${mes}-${dia}`;
    }

    /**
     * Obtiene la hora actual en formato HH:MM
     * @returns {string}
     */
    obtenerHoraActual() {
        const ahora = new Date();
        const horas = String(ahora.getHours()).padStart(2, '0');
        const minutos = String(ahora.getMinutes()).padStart(2, '0');
        return `${horas}:${minutos}`;
    }

    /**
     * Obtiene el día de la semana de una fecha
     * @param {string} fecha - Fecha en formato YYYY-MM-DD
     * @returns {string} - Nombre del día en español
     */
    obtenerDiaSemana(fecha) {
        const fechaObj = new Date(fecha + 'T00:00:00');
        const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        return dias[fechaObj.getDay()];
    }

    // ============================================
    // VALIDACIÓN COMPLETA DE FORMULARIOS
    // ============================================

    /**
     * Valida el formulario de información personal (Step 2)
     * @param {object} data - Datos del formulario
     * @returns {object} { isValid: boolean, errors: object }
     */
    validarFormularioPersonal(data) {
        const errors = {};

        // Validar documento
        if (!data.documento || data.documento.trim() === '') {
            errors.documento = 'El documento es requerido';
        }

        // Validar nombres
        if (!this.validarTextoNoVacio(data.nombres, 2)) {
            errors.nombres = 'El nombre debe tener al menos 2 caracteres';
        }

        // Validar apellidos
        if (!this.validarTextoNoVacio(data.apellidos, 2)) {
            errors.apellidos = 'El apellido debe tener al menos 2 caracteres';
        }

        // Validar email
        if (!this.validarEmail(data.correo)) {
            errors.correo = 'El formato del correo es inválido';
        }

        // Validar celular
        if (!data.celular || data.celular.trim() === '') {
            errors.celular = 'El número de celular es requerido';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Valida el formulario de evento (Step 3)
     * @param {object} data - Datos del formulario
     * @returns {object} { isValid: boolean, errors: object }
     */
    validarFormularioEvento(data) {
        const errors = {};

        // Validar tipo de evento
        if (!data.tipo_evento || data.tipo_evento === '') {
            errors.tipo_evento = 'Debe seleccionar un tipo de evento';
        }

        // Validar motivo
        if (!this.validarTextoNoVacio(data.motivo, 3)) {
            errors.motivo = 'El motivo debe tener al menos 3 caracteres';
        }

        // Validar adultos
        if (!this.validarNumeroPositivo(data.adultos, false)) {
            errors.adultos = 'Debe haber al menos 1 adulto';
        }

        // Validar niños (puede ser 0)
        if (data.niños && !this.validarNumeroPositivo(data.niños, true)) {
            errors.niños = 'La cantidad de niños debe ser un número válido';
        }

        // Validar descripción
        const descValidation = this.validarDescripcion(data.descripcion);
        if (!descValidation.isValid) {
            errors.descripcion = descValidation.error;
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

// Crear instancia única (Singleton)
const validationService = new ValidationService();

// Exportar para uso global
window.ValidationService = validationService;

console.log('✅ ValidationService inicializado correctamente');
