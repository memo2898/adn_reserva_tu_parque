/**
 * API SERVICE
 * Servicio centralizado para todas las llamadas HTTP al backend
 */

class ApiService {
    constructor() {
        this.baseURL = window.location.origin;
        this.endpoints = {
            // Parques
            parques: '/Reservaciones_parque_espera',
            parqueHorarios: '/Reservaciones_parque_horarios',
            parqueZonasImg: '/Reservaciones_zonas_img',

            // Eventos
            eventos: '/reservaciones_eventos',

            // Solicitantes/Usuarios
            solicitantes: '/Reservaciones_solicitantes',
            solicitanteEmail: '/Reservaciones_email',
            padron: '/ADN_Padron',

            // Reservaciones
            reservacionesDia: '/Reservaciones_dia',
            reservacionesDoc: '/Reservaciones_doc_where',
            reservacionesUser: '/Reservaciones_user',
            reservacionesPost: '/Reservaciones_2_post',

            // Correos
            enviarCorreo: '/enviar-correo',

            // Otros
            azul: '/Azul'
        };
    }

    // ============================================
    // MÉTODOS HTTP BÁSICOS
    // ============================================

    /**
     * Realiza una petición GET
     * @param {string} url - URL completa o endpoint
     * @returns {Promise<any>}
     */
    async get(url) {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Error en GET:', url, error);
            throw this.handleError(error);
        }
    }

    /**
     * Realiza una petición POST
     * @param {string} url - URL completa o endpoint
     * @param {object} data - Datos a enviar
     * @returns {Promise<any>}
     */
    async post(url, data) {
        try {
            const response = await axios.post(url, data);
            return response.data;
        } catch (error) {
            console.error('Error en POST:', url, error);
            throw this.handleError(error);
        }
    }

    /**
     * Maneja errores de las peticiones
     * @param {Error} error - Error de axios
     * @returns {object}
     */
    handleError(error) {
        if (error.response) {
            return {
                status: error.response.status,
                message: error.response.data?.message || 'Error en la petición',
                data: error.response.data
            };
        } else if (error.request) {
            return {
                status: 0,
                message: 'No se recibió respuesta del servidor',
                data: null
            };
        } else {
            return {
                status: -1,
                message: error.message,
                data: null
            };
        }
    }

    // ============================================
    // PARQUES
    // ============================================

    /**
     * Obtiene el tiempo de espera de un parque
     * @param {number} idParque - ID del parque
     * @returns {Promise<number>}
     */
    async obtenerTiempoEsperaParque(idParque) {
        const url = `${this.endpoints.parques}/${idParque}`;
        return await this.get(url);
    }

    /**
     * Obtiene los horarios de un parque
     * @param {number} idParque - ID del parque
     * @returns {Promise<Array>}
     */
    async obtenerHorariosParque(idParque) {
        const url = `${this.endpoints.parqueHorarios}/${idParque}`;
        return await this.get(url);
    }

    /**
     * Obtiene las zonas de un parque con imágenes
     * @param {number} idParque - ID del parque
     * @returns {Promise<Array>}
     */
    async obtenerZonasParque(idParque) {
        const url = `${this.endpoints.parqueZonasImg}/${idParque}`;
        return await this.get(url);
    }

    // ============================================
    // EVENTOS
    // ============================================

    /**
     * Obtiene los tipos de eventos disponibles para un parque
     * @param {number} idParque - ID del parque
     * @returns {Promise<Array>}
     */
    async obtenerTiposEventos(idParque) {
        const url = `${this.endpoints.eventos}/${idParque}`;
        try {
            const data = await this.get(url);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.warn('No se encontraron tipos de eventos para el parque:', idParque);
            return [];
        }
    }

    // ============================================
    // SOLICITANTES/USUARIOS
    // ============================================

    /**
     * Busca un solicitante por documento
     * @param {number} tipoDocumento - ID del tipo de documento
     * @param {string} documento - Número de documento
     * @returns {Promise<object|null>}
     */
    async buscarSolicitantePorDocumento(tipoDocumento, documento) {
        const url = `${this.endpoints.solicitantes}/${tipoDocumento}/${documento}`;
        try {
            const data = await this.get(url);
            return data;
        } catch (error) {
            if (error.status === 404) {
                return null;
            }
            throw error;
        }
    }

    /**
     * Verifica si un email ya está registrado
     * @param {string} email - Email a verificar
     * @returns {Promise<boolean>} - true si existe, false si no existe
     */
    async verificarEmailExistente(email) {
        const url = `${this.endpoints.solicitanteEmail}/${email}`;
        try {
            const data = await this.get(url);
            return data !== 404; // Si devuelve 404, no existe
        } catch (error) {
            if (error.status === 404) {
                return false;
            }
            throw error;
        }
    }

    /**
     * Consulta el padrón dominicano por cédula
     * @param {string} cedula - Número de cédula
     * @returns {Promise<object>}
     */
    async consultarPadron(cedula) {
        const url = `${this.endpoints.padron}/${cedula}`;
        return await this.get(url);
    }

    /**
     * Registra un nuevo solicitante
     * @param {object} datosUsuario - Datos del usuario
     * @returns {Promise<object>}
     */
    async registrarSolicitante(datosUsuario) {
        const url = this.endpoints.reservacionesUser;
        return await this.post(url, { data: datosUsuario });
    }

    // ============================================
    // RESERVACIONES
    // ============================================

    /**
     * Obtiene las reservaciones de un día específico para un parque
     * @param {string} fecha - Fecha en formato YYYY-MM-DD
     * @param {number} idParque - ID del parque
     * @returns {Promise<Array|null>}
     */
    async obtenerReservacionesDia(fecha, idParque) {
        const url = `${this.endpoints.reservacionesDia}/${fecha}/${idParque}`;
        try {
            const data = await this.get(url);
            return data === 404 ? null : data;
        } catch (error) {
            return null;
        }
    }

    /**
     * Verifica si un solicitante ya tiene reservación para una fecha
     * @param {string} fecha - Fecha en formato YYYY-MM-DD
     * @param {number} idSolicitante - ID del solicitante
     * @returns {Promise<boolean>}
     */
    async verificarReservacionSolicitanteFecha(fecha, idSolicitante) {
        const url = `${this.endpoints.reservacionesDoc}/${fecha}/${idSolicitante}`;
        try {
            const data = await this.get(url);
            return data !== 404;
        } catch (error) {
            return false;
        }
    }

    /**
     * Crea una nueva reservación
     * @param {object} datosReservacion - Datos de la reservación
     * @returns {Promise<object>}
     */
    async crearReservacion(datosReservacion) {
        const url = this.endpoints.reservacionesPost;

        const data = {
            id_solicitante: datosReservacion.id_solicitante,
            id_parque: datosReservacion.id_parque,
            id_zona: datosReservacion.id_zona,
            id_evento: datosReservacion.id_evento,
            fecha_evento: datosReservacion.fecha_evento,
            hora_inicio: datosReservacion.hora_inicio,
            hora_fin: datosReservacion.hora_fin,
            motivo_evento: datosReservacion.motivo_evento,
            descripcion_evento: datosReservacion.descripcion_evento,
            responsables: datosReservacion.responsables,
            cantidad_adultos: datosReservacion.cantidad_adultos,
            cantidad_ninos: datosReservacion.cantidad_ninos,
            codigo_reservacion: datosReservacion.codigo_reservacion
        };

        return await this.post(url, data);
    }

    // ============================================
    // CORREOS
    // ============================================

    /**
     * Envía el correo de confirmación con el QR
     * @param {number} idReservacion - ID de la reservación
     * @param {string} qrBase64 - Imagen QR en base64
     * @returns {Promise<object>}
     */
    async enviarCorreoConfirmacion(idReservacion, qrBase64) {
        const url = this.endpoints.enviarCorreo;

        const data = {
            Reservacion: idReservacion,
            QR: qrBase64
        };

        return await this.post(url, data);
    }

    // ============================================
    // UTILIDADES
    // ============================================

    /**
     * Genera un código de reservación único
     * @param {number} idSolicitante - ID del solicitante
     * @param {number} idParque - ID del parque
     * @param {string} fecha - Fecha actual YYYY-MM-DD
     * @returns {string}
     */
    generarCodigoReservacion(idSolicitante, idParque, fecha) {
        const fechaFormateada = fecha.replace(/-/g, '');
        return `PRB#${idSolicitante}${idParque}-${fechaFormateada}`;
    }

    /**
     * Guarda imagen QR en el servidor ADN
     * @param {number} id - ID de la reservación
     * @param {string} imageBase64 - Imagen en base64
     * @returns {Promise<object>}
     */
    async guardarImagenQR(id, imageBase64) {
        const url = 'https://adn.gob.do/guardar_base/recibir_qr.php';

        const data = {
            id: id,
            image: imageBase64
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            return await response.json();
        } catch (error) {
            console.error('Error guardando imagen QR:', error);
            throw error;
        }
    }

    // ============================================
    // MÉTODOS DE ALTO NIVEL (WORKFLOWS COMPLETOS)
    // ============================================

    /**
     * Workflow completo: Buscar o crear solicitante
     * @param {object} datosFormulario - Datos del formulario Step 2
     * @returns {Promise<object>} - { id, esNuevo, datos }
     */
    async procesarSolicitante(datosFormulario) {
        // 1. Buscar solicitante existente
        const solicitanteExistente = await this.buscarSolicitantePorDocumento(
            datosFormulario.id_tipo_doc,
            datosFormulario.documento
        );

        if (solicitanteExistente) {
            return {
                id: solicitanteExistente[0].id,
                esNuevo: false,
                datos: solicitanteExistente[0]
            };
        }

        // 2. Si no existe, registrar nuevo
        const nuevoSolicitante = await this.registrarSolicitante(datosFormulario);

        return {
            id: nuevoSolicitante.id,
            esNuevo: true,
            datos: nuevoSolicitante
        };
    }

    /**
     * Workflow completo: Crear reservación y enviar correo
     * @param {object} datosCompletos - Todos los datos de la reservación
     * @returns {Promise<object>}
     */
    async procesarReservacionCompleta(datosCompletos) {
        // 1. Crear reservación
        const reservacion = await this.crearReservacion(datosCompletos);

        // 2. Generar QR (asumiendo que hay una función global QRMaker)
        if (typeof QRMaker === 'function') {
            QRMaker(reservacion.id);
        }

        // 3. Enviar correo (después de un pequeño delay para que se genere el QR)
        setTimeout(async () => {
            try {
                const canvas = document.querySelector("#QRdisplay > canvas");
                if (canvas) {
                    const qrBase64 = canvas.toDataURL();
                    await this.enviarCorreoConfirmacion(reservacion.id, qrBase64);
                }
            } catch (error) {
                console.error('Error enviando correo:', error);
            }
        }, 2000);

        return reservacion;
    }
}

// Crear instancia única (Singleton)
const apiService = new ApiService();

// Exportar para uso global
window.ApiService = apiService;

console.log('✅ ApiService inicializado correctamente');
