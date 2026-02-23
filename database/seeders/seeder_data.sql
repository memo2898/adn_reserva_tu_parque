-- =====================================================
-- SEEDER DE DATOS - VERSIÓN CONSOLIDADA
-- Base de Datos: adn_reservaciones_parques
-- Propósito: Datos iniciales con catálogos completos
-- =====================================================

USE `adn_reservaciones_parques`;

SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- LIMPIEZA (IMPORTANTE)
-- =====================================================
TRUNCATE tbl_reservaciones;
TRUNCATE tbl_solicitantes;
TRUNCATE tbl_usuario;
TRUNCATE tbl_terminos_condiciones_p;
TRUNCATE tbl_terminos_condiciones_generales;
TRUNCATE tbl_telefonos_por_parques;
TRUNCATE tbl_horarios_zonas;
TRUNCATE tbl_zonas_parques;
TRUNCATE tbl_horarios_parques;
TRUNCATE tbl_parques;
TRUNCATE tbl_tipos_eventos;
TRUNCATE tbl_permisos_usuarios;
TRUNCATE tbl_tipo_documentos;

-- =====================================================
-- 1. TIPOS DE DOCUMENTOS
-- =====================================================
INSERT INTO `tbl_tipo_documentos` (`id`, `tipo_documento`, `agregado_por`, `agregado_en`, `estado`) VALUES
(1, 'Cédula', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Pasaporte', 'Reservaciones_ADN', NOW(), 'activo');
-- (3, 'RNC', 'Reservaciones_ADN', NOW(), 'activo'),
-- (4, 'DNI', 'Reservaciones_ADN', NOW(), 'activo'),
-- (5, 'Otro', 'Reservaciones_ADN', NOW(), 'activo');

-- =====================================================
-- 2. PERMISOS DE USUARIOS (ROLES)
-- =====================================================
INSERT INTO `tbl_permisos_usuarios` (`id`, `posicion`, `permisos`, `agregado_por`, `agregado_en`, `estado`) VALUES
(1, 'Administrador', 'administrador', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Supervisor', 'supervisor', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 'Operador', 'operador', 'Reservaciones_ADN', NOW(), 'activo'),
(4, 'Encargado de Parque', 'gestionar', 'Reservaciones_ADN', NOW(), 'activo');

-- =====================================================
-- 3. TIPOS DE EVENTOS
-- =====================================================
INSERT INTO `tbl_tipos_eventos` (`id`, `tipo`, `agregado_por`, `agregado_en`, `estado`) VALUES
(1, 'Cumpleaños', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Boda', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 'Evento Corporativo', 'Reservaciones_ADN', NOW(), 'activo'),
(4, 'Picnic Familiar', 'Reservaciones_ADN', NOW(), 'activo'),
(5, 'Actividad Deportiva', 'Reservaciones_ADN', NOW(), 'activo'),
(6, 'Evento Cultural', 'Reservaciones_ADN', NOW(), 'activo'),
(7, 'Actividad Educativa', 'Reservaciones_ADN', NOW(), 'activo'),
(8, 'Otro', 'Reservaciones_ADN', NOW(), 'activo');




-- =====================================================
-- 9. TERMINOS GENERALES
-- =====================================================
INSERT INTO `tbl_terminos_condiciones_generales`
(`id_parque`, `condiciones`, `agregado_por`, `agregado_en`, `estado`)
VALUES
(1, 'No se permite música a alto volumen', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Prohibido el uso de bebidas alcohólicas', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Mantener limpia el área asignada', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Respetar los horarios establecidos', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Mantener las áreas limpias', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'No dañar la vegetación del parque', 'Reservaciones_ADN', NOW(), 'activo');

-- =====================================================
-- 10. TERMINOS POR PARQUE
-- =====================================================
-- INSERT INTO `tbl_terminos_condiciones_p`
-- (`id_parque`, `condiciones`, `agregado_por`, `agregado_en`, `estado`)
-- VALUES
-- (1, 'Capacidad máxima: 100 personas por zona', 'Reservaciones_ADN', NOW(), 'activo'),
-- (1, 'Se requiere depósito de garantía', 'Reservaciones_ADN', NOW(), 'activo'),
-- (2, 'Eventos grandes requieren permiso especial', 'Reservaciones_ADN', NOW(), 'activo'),
-- (2, 'Actividades culturales tienen preferencia', 'Reservaciones_ADN', NOW(), 'activo');

-- =====================================================
-- 11. USUARIOS
-- =====================================================
INSERT INTO `tbl_usuario`
(`id_parque`, `id_user_type`, `id_tipo_doc`, `documento`, `nombre`, `apellido`, `correo`, `telefono`, `usuario`, `password`, `agregado_por`, `agregado_en`, `estado`)
VALUES
-- Administradores
(1, 1, 1, '00112345678', 'Carlos', 'Pérez', 'carlos.perez@adn.gob.do', '809-555-1001', 'cperez', 'admin123', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 1, 1, '00123456789', 'María', 'González', 'maria.gonzalez@adn.gob.do', '809-555-1002', 'mgonzalez', 'admin123', 'Reservaciones_ADN', NOW(), 'activo'),

-- Supervisores
(1, 2, 1, '00198765432', 'Juan', 'Martínez', 'juan.martinez@adn.gob.do', '809-555-1003', 'jmartinez', 'super123', 'Reservaciones_ADN', NOW(), 'activo'),

-- Encargados de Parque
(1, 4, 1, '00187654321', 'Ana', 'Rodríguez', 'ana.rodriguez@adn.gob.do', '809-555-1004', 'arodriguez', 'encargado123', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 4, 1, '00165432109', 'Carmen', 'Jiménez', 'carmen.jimenez@adn.gob.do', '809-555-1006', 'cjimenez', 'encargado123', 'Reservaciones_ADN', NOW(), 'activo'),

-- Operadores
(1, 3, 1, '00176543210', 'Luis', 'Fernández', 'luis.fernandez@adn.gob.do', '809-555-1005', 'lfernandez', 'operador123', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 3, 1, '00143210987', 'Laura', 'Ramírez', 'laura.ramirez@adn.gob.do', '809-555-1008', 'lramirez', 'operador123', 'Reservaciones_ADN', NOW(), 'activo');

-- =====================================================
-- SOLICITANTES Y RESERVACIONES
-- (Vacíos - se crearán desde la aplicación)
-- =====================================================

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- =====================================================
SELECT 'RESUMEN DE DATOS INSERTADOS:' as '';
SELECT COUNT(*) as 'Total Tipos de Documentos' FROM tbl_tipo_documentos;
SELECT COUNT(*) as 'Total Permisos/Roles' FROM tbl_permisos_usuarios;
SELECT COUNT(*) as 'Total Tipos de Eventos' FROM tbl_tipos_eventos;
SELECT COUNT(*) as 'Total Parques' FROM tbl_parques;
SELECT COUNT(*) as 'Total Horarios Parques' FROM tbl_horarios_parques;
SELECT COUNT(*) as 'Total Zonas' FROM tbl_zonas_parques;
SELECT COUNT(*) as 'Total Horarios Zonas' FROM tbl_horarios_zonas;
SELECT COUNT(*) as 'Total Teléfonos' FROM tbl_telefonos_por_parques;
SELECT COUNT(*) as 'Total Términos Generales' FROM tbl_terminos_condiciones_generales;
SELECT COUNT(*) as 'Total Términos por Parque' FROM tbl_terminos_condiciones_p;
SELECT COUNT(*) as 'Total Usuarios Sistema' FROM tbl_usuario;
SELECT COUNT(*) as 'Total Solicitantes' FROM tbl_solicitantes;
SELECT COUNT(*) as 'Total Reservaciones' FROM tbl_reservaciones;
