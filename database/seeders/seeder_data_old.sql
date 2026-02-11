-- =====================================================
-- SEEDER DE DATOS DE PRUEBA
-- Base de Datos: adn_reservaciones_parques
-- Propósito: Poblar la BD con datos de prueba
-- =====================================================

USE `adn_reservaciones_parques`;

SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- 1. TIPOS DE DOCUMENTOS
-- =====================================================
INSERT INTO `tbl_tipo_documentos` (`id`, `tipo_documento`, `agregado_por`, `agregado_en`, `estado`) VALUES
(1, 'Cédula', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Pasaporte', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 'RNC', 'Reservaciones_ADN', NOW(), 'activo'),
(4, 'DNI', 'Reservaciones_ADN', NOW(), 'activo'),
(5, 'Otro', 'Reservaciones_ADN', NOW(), 'activo');

-- =====================================================
-- 2. PERMISOS DE USUARIOS (ROLES)
-- =====================================================
INSERT INTO `tbl_permisos_usuarios` (`id`, `posicion`, `permisos`, `agregado_por`, `agregado_en`, `estado`) VALUES
(1, 'Administrador', 'Total', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Supervisor', 'Evaluación', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 'Operador', 'Consulta', 'Reservaciones_ADN', NOW(), 'activo'),
(4, 'Encargado de Parque', 'Gestión de Parque', 'Reservaciones_ADN', NOW(), 'activo');

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
-- 4. PARQUES
-- =====================================================
INSERT INTO `tbl_parques` (`id`, `nombre_parque`, `descripcion`, `correo`, `provincia`, `municipio`, `sector`, `circunscripcion`, `coordenadas_maps`, `direccion`, `espera`, `agregado_por`, `agregado_en`, `estado`) VALUES
(1, 'Parque Mirador Sur', 'Hermoso parque urbano con áreas verdes, senderos para caminar y ciclovía. Perfecto para actividades familiares y deportivas.', 'miradorsur@adn.gob.do', 'Distrito Nacional', 'Santo Domingo', 'Bella Vista', '1', '18.4698,-69.9557', 'Av. Mirador del Sur, Santo Domingo', 1, 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Parque Mirador Norte', 'Extenso parque con zonas recreativas, áreas deportivas y espacios para eventos. Ideal para grandes concentraciones.', 'miradornorte@adn.gob.do', 'Distrito Nacional', 'Santo Domingo', 'Los Jardines Metropolitanos', '2', '18.5024,-69.9398', 'Av. Jacobo Majluta, Santo Domingo', 1, 'Reservaciones_ADN', NOW(), 'activo'),
(3, 'Parque Ecológico Centenario', 'Parque con gran biodiversidad, senderos naturales y áreas de picnic. Perfecto para actividades educativas y recreativas.', 'centenario@adn.gob.do', 'Distrito Nacional', 'Santo Domingo', 'Ciudad Universitaria', '1', '18.4781,-69.9191', 'Av. Máximo Gómez, Santo Domingo', 1, 'Reservaciones_ADN', NOW(), 'activo'),
(4, 'Parque Independencia', 'Parque histórico en el corazón de la ciudad colonial. Ideal para eventos culturales y educativos.', 'independencia@adn.gob.do', 'Distrito Nacional', 'Santo Domingo', 'Ciudad Colonial', '1', '18.4666,-69.8827', 'Parque Independencia, Zona Colonial', 1, 'Reservaciones_ADN', NOW(), 'activo'),
(5, 'Parque Nacional Los Tres Ojos', 'Parque natural con lagos subterráneos y vegetación exuberante. Perfecto para tours educativos y fotografía.', 'tresojos@adn.gob.do', 'Santo Domingo', 'Santo Domingo Este', 'Los Tres Ojos', '3', '18.4723,-69.8583', 'Carretera Las Americas Km 6.5', 1, 'Reservaciones_ADN', NOW(), 'activo');

-- =====================================================
-- 5. HORARIOS DE PARQUES
-- =====================================================
INSERT INTO `tbl_horarios_parques` (`id_parque`, `dia_semana`, `hora_apertura`, `hora_cierre`, `agregado_por`, `agregado_en`, `estado`) VALUES
-- Parque Mirador Sur
(1, 'Lunes', '06:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Martes', '06:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Miércoles', '06:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Jueves', '06:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Viernes', '06:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Sábado', '06:00:00', '20:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Domingo', '06:00:00', '20:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
-- Parque Mirador Norte
(2, 'Lunes', '05:00:00', '19:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Martes', '05:00:00', '19:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Miércoles', '05:00:00', '19:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Jueves', '05:00:00', '19:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Viernes', '05:00:00', '19:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Sábado', '05:00:00', '21:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Domingo', '05:00:00', '21:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
-- Parque Centenario
(3, 'Lunes', '06:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 'Martes', '06:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 'Miércoles', '06:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 'Jueves', '06:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 'Viernes', '06:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 'Sábado', '07:00:00', '19:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 'Domingo', '07:00:00', '19:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
-- Parque Independencia
(4, 'Lunes', '08:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(4, 'Martes', '08:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(4, 'Miércoles', '08:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(4, 'Jueves', '08:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(4, 'Viernes', '08:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(4, 'Sábado', '08:00:00', '20:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(4, 'Domingo', '08:00:00', '20:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
-- Parque Los Tres Ojos
(5, 'Lunes', '08:30:00', '17:30:00', 'Reservaciones_ADN', NOW(), 'activo'),
(5, 'Martes', '08:30:00', '17:30:00', 'Reservaciones_ADN', NOW(), 'activo'),
(5, 'Miércoles', '08:30:00', '17:30:00', 'Reservaciones_ADN', NOW(), 'activo'),
(5, 'Jueves', '08:30:00', '17:30:00', 'Reservaciones_ADN', NOW(), 'activo'),
(5, 'Viernes', '08:30:00', '17:30:00', 'Reservaciones_ADN', NOW(), 'activo'),
(5, 'Sábado', '08:30:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(5, 'Domingo', '08:30:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo');

-- =====================================================
-- 6. ZONAS DE PARQUES
-- =====================================================
INSERT INTO `tbl_zonas_parques` (`id`, `id_parque`, `nombre`, `coordenada_X`, `coordenada_Y`, `direccion`, `coordenadas_maps`, `agregado_por`, `agregado_en`, `estado`) VALUES
-- Zonas Parque Mirador Sur
(1, 1, 'Zona de Picnic Norte', '18.4705', '-69.9550', 'Sector Norte del Parque', '18.4705,-69.9550', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 1, 'Zona de Eventos Principal', '18.4695', '-69.9560', 'Área Central del Parque', '18.4695,-69.9560', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 1, 'Zona Deportiva', '18.4690', '-69.9565', 'Lado Este del Parque', '18.4690,-69.9565', 'Reservaciones_ADN', NOW(), 'activo'),
-- Zonas Parque Mirador Norte
(4, 2, 'Plaza de Eventos', '18.5030', '-69.9400', 'Plaza Principal', '18.5030,-69.9400', 'Reservaciones_ADN', NOW(), 'activo'),
(5, 2, 'Zona Familiar', '18.5020', '-69.9395', 'Área Familiar', '18.5020,-69.9395', 'Reservaciones_ADN', NOW(), 'activo'),
(6, 2, 'Zona Deportiva Norte', '18.5028', '-69.9390', 'Sector Deportivo', '18.5028,-69.9390', 'Reservaciones_ADN', NOW(), 'activo'),
-- Zonas Parque Centenario
(7, 3, 'Área de Picnic Bosque', '18.4785', '-69.9195', 'Zona Boscosa', '18.4785,-69.9195', 'Reservaciones_ADN', NOW(), 'activo'),
(8, 3, 'Zona Educativa', '18.4778', '-69.9188', 'Centro Educativo', '18.4778,-69.9188', 'Reservaciones_ADN', NOW(), 'activo'),
-- Zonas Parque Independencia
(9, 4, 'Plaza Central', '18.4668', '-69.8825', 'Plaza Principal', '18.4668,-69.8825', 'Reservaciones_ADN', NOW(), 'activo'),
(10, 4, 'Zona Cultural', '18.4665', '-69.8830', 'Área Cultural', '18.4665,-69.8830', 'Reservaciones_ADN', NOW(), 'activo'),
-- Zonas Parque Los Tres Ojos
(11, 5, 'Mirador Principal', '18.4725', '-69.8585', 'Entrada Principal', '18.4725,-69.8585', 'Reservaciones_ADN', NOW(), 'activo'),
(12, 5, 'Sendero Ecológico', '18.4720', '-69.8580', 'Zona de Senderos', '18.4720,-69.8580', 'Reservaciones_ADN', NOW(), 'activo');

-- =====================================================
-- 7. HORARIOS DE ZONAS
-- =====================================================
INSERT INTO `tbl_horarios_zonas` (`id_zona`, `dia_semana`, `hora_apertura`, `hora_cierre`, `agregado_por`, `agregado_en`, `estado`) VALUES
-- Zona de Picnic Norte (Mirador Sur)
(1, 'Lunes', '08:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Martes', '08:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Miércoles', '08:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Jueves', '08:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Viernes', '08:00:00', '17:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Sábado', '08:00:00', '19:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Domingo', '08:00:00', '19:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
-- Zona de Eventos Principal (Mirador Sur)
(2, 'Lunes', '09:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Martes', '09:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Miércoles', '09:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Jueves', '09:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Viernes', '09:00:00', '18:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Sábado', '09:00:00', '20:00:00', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Domingo', '09:00:00', '20:00:00', 'Reservaciones_ADN', NOW(), 'activo');

-- =====================================================
-- 8. TELÉFONOS DE PARQUES
-- =====================================================
INSERT INTO `tbl_telefonos_por_parques` (`id_parque`, `telefono`, `agregado_por`, `agregado_en`, `estado`) VALUES
(1, '809-221-4660', 'Reservaciones_ADN', NOW(), 'activo'),
(1, '809-221-4661', 'Reservaciones_ADN', NOW(), 'activo'),
(2, '809-472-4204', 'Reservaciones_ADN', NOW(), 'activo'),
(2, '809-472-4205', 'Reservaciones_ADN', NOW(), 'activo'),
(3, '809-535-6789', 'Reservaciones_ADN', NOW(), 'activo'),
(4, '809-682-1234', 'Reservaciones_ADN', NOW(), 'activo'),
(5, '809-788-5656', 'Reservaciones_ADN', NOW(), 'activo'),
(5, '809-788-5657', 'Reservaciones_ADN', NOW(), 'activo');

-- =====================================================
-- 9. TÉRMINOS Y CONDICIONES GENERALES
-- =====================================================
INSERT INTO `tbl_terminos_condiciones_generales` (`id_parque`, `condiciones`, `agregado_por`, `agregado_en`, `estado`) VALUES
(1, 'No se permite música a alto volumen', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Prohibido el uso de bebidas alcohólicas', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Mantener limpia el área asignada', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Respetar los horarios establecidos', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'No dañar la vegetación del parque', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 'Actividades educativas tienen prioridad', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 'Prohibido alimentar a los animales', 'Reservaciones_ADN', NOW(), 'activo'),
(4, 'Respetar el patrimonio histórico', 'Reservaciones_ADN', NOW(), 'activo'),
(5, 'Seguir las rutas establecidas', 'Reservaciones_ADN', NOW(), 'activo'),
(5, 'No nadar en los lagos', 'Reservaciones_ADN', NOW(), 'activo');

-- =====================================================
-- 10. TÉRMINOS Y CONDICIONES POR PARQUE
-- =====================================================
INSERT INTO `tbl_terminos_condiciones_p` (`id_parque`, `condiciones`, `agregado_por`, `agregado_en`, `estado`) VALUES
(1, 'Capacidad máxima: 100 personas por zona', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 'Se requiere depósito de garantía', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 'Eventos corporativos requieren permiso esp.', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 'Grupos escolares tienen descuento', 'Reservaciones_ADN', NOW(), 'activo'),
(4, 'Actividades culturales tienen preferencia', 'Reservaciones_ADN', NOW(), 'activo'),
(5, 'Guía obligatorio para grupos mayores a 20', 'Reservaciones_ADN', NOW(), 'activo');

-- =====================================================
-- 11. USUARIOS DEL SISTEMA
-- =====================================================
INSERT INTO `tbl_usuario` (`id_parque`, `id_user_type`, `id_tipo_doc`, `documento`, `nombre`, `apellido`, `correo`, `telefono`, `usuario`, `password`, `agregado_por`, `agregado_en`, `estado`) VALUES
(1, 1, 1, '00112345678', 'Carlos', 'Pérez', 'carlos.perez@adn.gob.do', '809-555-1001', 'cperez', 'admin123', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 1, 1, '00123456789', 'María', 'González', 'maria.gonzalez@adn.gob.do', '809-555-1002', 'mgonzalez', 'admin123', 'Reservaciones_ADN', NOW(), 'activo'),
(1, 2, 1, '00198765432', 'Juan', 'Martínez', 'juan.martinez@adn.gob.do', '809-555-1003', 'jmartinez', 'super123', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 4, 1, '00187654321', 'Ana', 'Rodríguez', 'ana.rodriguez@adn.gob.do', '809-555-1004', 'arodriguez', 'encargado123', 'Reservaciones_ADN', NOW(), 'activo'),
(2, 3, 1, '00176543210', 'Luis', 'Fernández', 'luis.fernandez@adn.gob.do', '809-555-1005', 'lfernandez', 'operador123', 'Reservaciones_ADN', NOW(), 'activo'),
(4, 4, 1, '00165432109', 'Carmen', 'Jiménez', 'carmen.jimenez@adn.gob.do', '809-555-1006', 'cjimenez', 'encargado123', 'Reservaciones_ADN', NOW(), 'activo'),
(5, 4, 1, '00154321098', 'Pedro', 'Santos', 'pedro.santos@adn.gob.do', '809-555-1007', 'psantos', 'encargado123', 'Reservaciones_ADN', NOW(), 'activo'),
(3, 3, 1, '00143210987', 'Laura', 'Ramírez', 'laura.ramirez@adn.gob.do', '809-555-1008', 'lramirez', 'operador123', 'Reservaciones_ADN', NOW(), 'activo');

-- =====================================================
-- 12. SOLICITANTES
-- =====================================================
INSERT INTO `tbl_solicitantes` (`nombres`, `apellidos`, `id_tipo_doc`, `documento`, `telefono`, `celular`, `correo`, `agregado_por`, `agregado_en`, `estado`) VALUES
('Roberto', 'Méndez', 1, '40212345678', '809-555-2001', '829-555-2001', 'roberto.mendez@gmail.com', 'Reservaciones_ADN', NOW(), 'activo'),
('Sofía', 'Herrera', 1, '40223456789', '809-555-2002', '829-555-2002', 'sofia.herrera@hotmail.com', 'Reservaciones_ADN', NOW(), 'activo'),
('Miguel', 'Ortiz', 1, '40234567890', NULL, '849-555-2003', 'miguel.ortiz@yahoo.com', 'Reservaciones_ADN', NOW(), 'activo'),
('Isabella', 'Castro', 1, '40245678901', '809-555-2004', '829-555-2004', 'isabella.castro@gmail.com', 'Reservaciones_ADN', NOW(), 'activo'),
('Diego', 'Vargas', 1, '40256789012', NULL, '849-555-2005', 'diego.vargas@outlook.com', 'Reservaciones_ADN', NOW(), 'activo'),
('Valentina', 'Morales', 1, '40267890123', '809-555-2006', '829-555-2006', 'valentina.morales@gmail.com', 'Reservaciones_ADN', NOW(), 'activo'),
('Andrés', 'Reyes', 1, '40278901234', NULL, '849-555-2007', 'andres.reyes@gmail.com', 'Reservaciones_ADN', NOW(), 'activo'),
('Camila', 'Torres', 1, '40289012345', '809-555-2008', '829-555-2008', 'camila.torres@hotmail.com', 'Reservaciones_ADN', NOW(), 'activo'),
('Empresa XYZ S.A.', '', 3, '131234567', '809-555-3001', '829-555-3001', 'eventos@empresaxyz.com', 'Reservaciones_ADN', NOW(), 'activo'),
('Fundación Cultural DR', '', 3, '431234568', '809-555-3002', '829-555-3002', 'info@fundacioncultural.org', 'Reservaciones_ADN', NOW(), 'activo');

-- =====================================================
-- 13. RESERVACIONES
-- =====================================================
INSERT INTO `tbl_reservaciones` (`id_solicitante`, `id_parque`, `id_zona`, `id_evento`, `fecha_evento`, `hora_inicio`, `hora_fin`, `motivo_evento`, `descripcion_evento`, `responsables`, `cantidad_participantes_adultos`, `cantidad_participantes_ninos`, `codigo_reservacion`, `agregado_por`, `agregado_en`, `estado`) VALUES
-- Reservaciones Confirmadas
(1, 1, 1, 1, '2026-03-15', '10:00:00', '14:00:00', 'Cumpleaños de niño', 'Celebración de cumpleaños con juegos y comida', 'Roberto Méndez', 25, 15, 'RES-2026-001', 'Reservaciones_ADN', NOW(), 'confirmada'),
(2, 1, 2, 2, '2026-03-20', '15:00:00', '20:00:00', 'Boda al aire libre', 'Ceremonia y recepción de boda', 'Sofía Herrera', 80, 10, 'RES-2026-002', 'Reservaciones_ADN', NOW(), 'confirmada'),
(3, 2, 4, 3, '2026-03-18', '09:00:00', '13:00:00', 'Team Building', 'Actividad de integración empresarial', 'Miguel Ortiz', 50, 0, 'RES-2026-003', 'Reservaciones_ADN', NOW(), 'confirmada'),
(4, 3, 7, 4, '2026-03-22', '11:00:00', '16:00:00', 'Reunión Familiar', 'Picnic familiar de fin de semana', 'Isabella Castro', 30, 20, 'RES-2026-004', 'Reservaciones_ADN', NOW(), 'confirmada'),

-- Reservaciones en Espera
(5, 2, 5, 5, '2026-04-10', '08:00:00', '12:00:00', 'Torneo de Fútbol', 'Torneo deportivo comunitario', 'Diego Vargas', 40, 15, 'RES-2026-005', 'Reservaciones_ADN', NOW(), 'espera'),
(6, 1, 3, 1, '2026-04-12', '14:00:00', '18:00:00', 'Cumpleaños juvenil', 'Fiesta de cumpleaños con música', 'Valentina Morales', 35, 5, 'RES-2026-006', 'Reservaciones_ADN', NOW(), 'espera'),

-- Reservaciones Pendientes
(7, 4, 9, 6, '2026-04-15', '10:00:00', '15:00:00', 'Presentación Cultural', 'Show de danza folklórica', 'Andrés Reyes', 60, 20, 'RES-2026-007', 'Reservaciones_ADN', NOW(), 'pendiente'),
(8, 5, 11, 7, '2026-04-20', '09:00:00', '12:00:00', 'Tour Educativo', 'Visita educativa con estudiantes', 'Camila Torres', 45, 30, 'RES-2026-008', 'Reservaciones_ADN', NOW(), 'pendiente'),

-- Reservaciones Rechazadas
(9, 3, 2, 3, '2026-02-10', '18:00:00', '23:00:00', 'Evento Corporativo', 'Conferencia empresarial', 'Empresa XYZ S.A.', 100, 0, 'RES-2026-009', 'Reservaciones_ADN', NOW(), 'rechazada'),

-- Reservaciones Realizadas (pasadas)
(1, 1, 1, 4, '2026-01-15', '10:00:00', '15:00:00', 'Picnic Familiar', 'Reunión familiar de inicio de año', 'Roberto Méndez', 20, 12, 'RES-2026-010', 'Reservaciones_ADN', NOW(), 'realizada'),
(10, 4, 10, 6, '2026-01-25', '16:00:00', '19:00:00', 'Concierto Acústico', 'Presentación musical cultural', 'Fundación Cultural DR', 150, 30, 'RES-2026-011', 'Reservaciones_ADN', NOW(), 'realizada'),

-- Reservaciones Vencidas
(2, 2, 5, 5, '2026-01-10', '08:00:00', '12:00:00', 'Maratón', 'Carrera deportiva comunitaria', 'Sofía Herrera', 100, 20, 'RES-2026-012', 'Reservaciones_ADN', NOW(), 'vencida');

-- =====================================================
-- FIN DEL SEEDER
-- =====================================================

SET FOREIGN_KEY_CHECKS = 1;

-- Verificación de datos insertados
SELECT 'RESUMEN DE DATOS INSERTADOS:' as '';
SELECT COUNT(*) as 'Total Parques' FROM tbl_parques;
SELECT COUNT(*) as 'Total Zonas' FROM tbl_zonas_parques;
SELECT COUNT(*) as 'Total Tipos de Documentos' FROM tbl_tipo_documentos;
SELECT COUNT(*) as 'Total Tipos de Eventos' FROM tbl_tipos_eventos;
SELECT COUNT(*) as 'Total Permisos/Roles' FROM tbl_permisos_usuarios;
SELECT COUNT(*) as 'Total Usuarios Sistema' FROM tbl_usuario;
SELECT COUNT(*) as 'Total Solicitantes' FROM tbl_solicitantes;
SELECT COUNT(*) as 'Total Reservaciones' FROM tbl_reservaciones;
SELECT COUNT(*) as 'Total Horarios Parques' FROM tbl_horarios_parques;
SELECT COUNT(*) as 'Total Horarios Zonas' FROM tbl_horarios_zonas;
SELECT COUNT(*) as 'Total Teléfonos' FROM tbl_telefonos_por_parques;

-- Distribución de reservaciones por estado
SELECT estado, COUNT(*) as cantidad
FROM tbl_reservaciones
GROUP BY estado;
