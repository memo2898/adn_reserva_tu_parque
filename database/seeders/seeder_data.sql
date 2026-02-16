USE `adn_reservaciones_parques`;

SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- LIMPIEZA (IMPORTANTE)
-- =====================================================
TRUNCATE tbl_reservaciones;
TRUNCATE tbl_usuario;
TRUNCATE tbl_terminos_condiciones_p;
TRUNCATE tbl_terminos_condiciones_generales;
TRUNCATE tbl_telefonos_por_parques;
TRUNCATE tbl_horarios_zonas;
TRUNCATE tbl_zonas_parques;
TRUNCATE tbl_horarios_parques;
TRUNCATE tbl_parques;

-- =====================================================
-- PARQUES (SOLO 2)
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
-- HORARIOS PARQUES
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
-- ZONAS
-- =====================================================
INSERT INTO `tbl_zonas_parques`
(`id`, `id_parque`, `nombre`, `coordenadas_maps`, `agregado_por`, `agregado_en`, `estado`)
VALUES
-- Mirador Sur
(1,1,'Zona de Picnic','18.4705,-69.9550','Reservaciones_ADN',NOW(),'activo'),
(2,1,'Zona de Eventos','18.4695,-69.9560','Reservaciones_ADN',NOW(),'activo'),

-- Iberoamerica
(3,2,'Plaza Central','18.4762,-69.9140','Reservaciones_ADN',NOW(),'activo'),
(4,2,'Área Infantil','18.4760,-69.9135','Reservaciones_ADN',NOW(),'activo');

-- =====================================================
-- HORARIOS ZONAS
-- =====================================================
INSERT INTO `tbl_horarios_zonas`
(`id_zona`, `dia_semana`, `hora_apertura`, `hora_cierre`, `agregado_por`, `agregado_en`, `estado`)
VALUES
(1,'Lunes','08:00:00','17:00:00','Reservaciones_ADN',NOW(),'activo'),
(2,'Lunes','09:00:00','18:00:00','Reservaciones_ADN',NOW(),'activo'),
(3,'Lunes','08:00:00','17:00:00','Reservaciones_ADN',NOW(),'activo'),
(4,'Lunes','08:00:00','17:00:00','Reservaciones_ADN',NOW(),'activo');

-- =====================================================
-- TELÉFONOS
-- =====================================================
INSERT INTO `tbl_telefonos_por_parques`
(`id_parque`, `telefono`, `agregado_por`, `agregado_en`, `estado`)
VALUES
(1,'809-221-4660','Reservaciones_ADN',NOW(),'activo'),
(2,'809-685-1133','Reservaciones_ADN',NOW(),'activo');

-- =====================================================
-- TERMINOS GENERALES
-- =====================================================
INSERT INTO `tbl_terminos_condiciones_generales`
(`id_parque`, `condiciones`, `agregado_por`, `agregado_en`, `estado`)
VALUES
(1,'No música a alto volumen','Reservaciones_ADN',NOW(),'activo'),
(2,'Mantener las áreas limpias','Reservaciones_ADN',NOW(),'activo');

-- =====================================================
-- TERMINOS POR PARQUE
-- =====================================================
INSERT INTO `tbl_terminos_condiciones_p`
(`id_parque`, `condiciones`, `agregado_por`, `agregado_en`, `estado`)
VALUES
(1,'Capacidad máxima 100 personas','Reservaciones_ADN',NOW(),'activo'),
(2,'Eventos grandes requieren permiso','Reservaciones_ADN',NOW(),'activo');

-- =====================================================
-- USUARIOS
-- =====================================================
INSERT INTO `tbl_usuario`
(`id_parque`, `id_user_type`, `id_tipo_doc`, `documento`, `nombre`, `apellido`, `correo`, `telefono`, `usuario`, `password`, `agregado_por`, `agregado_en`, `estado`)
VALUES
(1,1,1,'00112345678','Carlos','Pérez','carlos.perez@adn.gob.do','809-555-1001','cperez','admin123','Reservaciones_ADN',NOW(),'activo'),
(2,4,1,'00187654321','Ana','Rodríguez','ana.rodriguez@adn.gob.do','809-555-1004','arodriguez','encargado123','Reservaciones_ADN',NOW(),'activo');

-- =====================================================
-- RESERVACIONES (ejemplo)
-- =====================================================
INSERT INTO `tbl_reservaciones`
(`id_solicitante`, `id_parque`, `id_zona`, `id_evento`, `fecha_evento`, `hora_inicio`, `hora_fin`,
`motivo_evento`, `descripcion_evento`, `responsables`,
`cantidad_participantes_adultos`, `cantidad_participantes_ninos`,
`codigo_reservacion`, `agregado_por`, `agregado_en`, `estado`)
VALUES
(1,1,1,1,'2026-03-15','10:00:00','14:00:00','Cumpleaños','Actividad familiar','Roberto',20,10,'RES-001','Reservaciones_ADN',NOW(),'confirmada'),
(2,2,3,4,'2026-03-20','15:00:00','18:00:00','Picnic','Encuentro familiar','Sofía',30,5,'RES-002','Reservaciones_ADN',NOW(),'espera');

SET FOREIGN_KEY_CHECKS = 1;
