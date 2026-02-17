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
-- 4. PARQUES (SOLO 2)
-- =====================================================
INSERT INTO `tbl_parques`
(`id`, `nombre_parque`, `descripcion`, `correo`, `provincia`, `municipio`, `sector`, `circunscripcion`, `coordenadas_maps`, `direccion`, `espera`, `agregado_por`, `agregado_en`, `estado`)
VALUES
(1, 'Parque Mirador Sur',
'Hermoso parque urbano con áreas verdes, senderos y ciclovía.',
'miradorsur@adn.gob.do',
'Distrito Nacional',
'Santo Domingo',
'Bella Vista',
'1',
'18.4423,-69.9597',
'Av. Mirador del Sur, Santo Domingo',
1,
'Reservaciones_ADN',
NOW(),
'activo'),

(2, 'Parque Iberoamerica',
'Parque céntrico utilizado para actividades culturales y familiares.',
'iberoamerica@adn.gob.do',
'Distrito Nacional',
'Santo Domingo',
'La Esperilla',
'1',
'18.4669,-69.9195',
'Av. Bolívar, Santo Domingo',
1,
'Reservaciones_ADN',
NOW(),
'activo');

-- =====================================================
-- 5. HORARIOS PARQUES
-- =====================================================
INSERT INTO `tbl_horarios_parques`
(`id_parque`, `dia_semana`, `hora_apertura`, `hora_cierre`, `agregado_por`, `agregado_en`, `estado`)
VALUES
-- Mirador Sur
(1,'Lunes','06:00:00','18:00:00','Reservaciones_ADN',NOW(),'activo'),
(1,'Martes','06:00:00','18:00:00','Reservaciones_ADN',NOW(),'activo'),
(1,'Miércoles','06:00:00','18:00:00','Reservaciones_ADN',NOW(),'activo'),
(1,'Jueves','06:00:00','18:00:00','Reservaciones_ADN',NOW(),'activo'),
(1,'Viernes','06:00:00','18:00:00','Reservaciones_ADN',NOW(),'activo'),
(1,'Sábado','06:00:00','20:00:00','Reservaciones_ADN',NOW(),'activo'),
(1,'Domingo','06:00:00','20:00:00','Reservaciones_ADN',NOW(),'activo'),

-- Iberoamerica
(2,'Lunes','06:00:00','18:00:00','Reservaciones_ADN',NOW(),'activo'),
(2,'Martes','06:00:00','18:00:00','Reservaciones_ADN',NOW(),'activo'),
(2,'Miércoles','06:00:00','18:00:00','Reservaciones_ADN',NOW(),'activo'),
(2,'Jueves','06:00:00','18:00:00','Reservaciones_ADN',NOW(),'activo'),
(2,'Viernes','06:00:00','18:00:00','Reservaciones_ADN',NOW(),'activo'),
(2,'Sábado','06:00:00','20:00:00','Reservaciones_ADN',NOW(),'activo'),
(2,'Domingo','06:00:00','20:00:00','Reservaciones_ADN',NOW(),'activo');

-- =====================================================
-- 6. ZONAS
-- =====================================================
INSERT INTO `tbl_zonas_parques`
(`id`, `id_parque`, `nombre`, `coordenadas_maps`, `agregado_por`, `agregado_en`, `estado`)
VALUES
-- Mirador Sur (3 zonas)
(1, 1, 'Zona de Picnic', '18.4705,-69.9550', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 1, 'Zona de Eventos', '18.4695,-69.9560', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 1, 'Zona Deportiva', '18.4690,-69.9565', 'Reservaciones_ADN', NOW(), 'activo'),

-- Iberoamerica (3 zonas)
(4, 2, 'Plaza Central', '18.4762,-69.9140', 'Reservaciones_ADN', NOW(), 'activo'),
(5, 2, 'Área Infantil', '18.4760,-69.9135', 'Reservaciones_ADN', NOW(), 'activo'),
(6, 2, 'Zona Cultural', '18.4765,-69.9145', 'Reservaciones_ADN', NOW(), 'activo');

-- =====================================================
-- 7. HORARIOS ZONAS (TODOS LOS DÍAS)
-- =====================================================
INSERT INTO `tbl_horarios_zonas`
(`id_zona`, `dia_semana`, `hora_apertura`, `hora_cierre`, `agregado_por`, `agregado_en`, `estado`)
VALUES
-- Zona de Picnic (Mirador Sur - Zona 1)
(1, 'Lunes', '08:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Martes', '08:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Miércoles', '08:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Jueves', '08:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Viernes', '08:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Sábado', '08:00:00', '19:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Domingo', '08:00:00', '19:00:00', 'Reservaciones_ADN', NOW(), 'activo'),

-- Zona de Eventos (Mirador Sur - Zona 2)
(2, 'Lunes', '09:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Martes', '09:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Miércoles', '09:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Jueves', '09:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Viernes', '09:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Sábado', '09:00:00', '20:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Domingo', '09:00:00', '20:00:00', 'Reservaciones_ADN', NOW(), 'activo'),

-- Zona Deportiva (Mirador Sur - Zona 3)
(3, 'Lunes', '07:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 'Martes', '07:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 'Miércoles', '07:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 'Jueves', '07:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 'Viernes', '07:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 'Sábado', '07:00:00', '19:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 'Domingo', '07:00:00', '19:00:00', 'Reservaciones_ADN', NOW(), 'activo'),

-- Plaza Central (Iberoamerica - Zona 4)
(4, 'Lunes', '08:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(4, 'Martes', '08:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(4, 'Miércoles', '08:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(4, 'Jueves', '08:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(4, 'Viernes', '08:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(4, 'Sábado', '08:00:00', '19:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(4, 'Domingo', '08:00:00', '19:00:00', 'Reservaciones_ADN', NOW(), 'activo'),

-- Área Infantil (Iberoamerica - Zona 5)
(5, 'Lunes', '08:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(5, 'Martes', '08:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(5, 'Miércoles', '08:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(5, 'Jueves', '08:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(5, 'Viernes', '08:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(5, 'Sábado', '08:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(5, 'Domingo', '08:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),

-- Zona Cultural (Iberoamerica - Zona 6)
(6, 'Lunes', '09:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(6, 'Martes', '09:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(6, 'Miércoles', '09:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(6, 'Jueves', '09:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(6, 'Viernes', '09:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(6, 'Sábado', '09:00:00', '20:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(6, 'Domingo', '09:00:00', '20:00:00', 'Reservaciones_ADN', NOW(), 'activo');

-- =====================================================
-- 8. TELÉFONOS
-- =====================================================
INSERT INTO `tbl_telefonos_por_parques`
(`id_parque`, `telefono`, `agregado_por`, `agregado_en`, `estado`)
VALUES
(1, '809-221-4660', 'Reservaciones_ADN', NOW(), 'activo'),
(1, '809-221-4661', 'Reservaciones_ADN', NOW(), 'activo'),
(2, '809-685-1133', 'Reservaciones_ADN', NOW(), 'activo'),
(2, '809-685-1134', 'Reservaciones_ADN', NOW(), 'activo');

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
INSERT INTO `tbl_terminos_condiciones_p`
(`id_parque`, `condiciones`, `agregado_por`, `agregado_en`, `estado`)
VALUES
(1, 'Capacidad máxima: 100 personas por zona', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Se requiere depósito de garantía', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Eventos grandes requieren permiso especial', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Actividades culturales tienen preferencia', 'Reservaciones_ADN', NOW(), 'activo');

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
