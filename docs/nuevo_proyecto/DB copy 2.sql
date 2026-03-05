-- =============================================
-- Sistema: ADN Reserva tu Parque
-- Stack:   NestJS + MySQL
-- Versión: 2.0 (Rebuild)
-- Fecha:   2026-03-04
-- Autor:   Manuel Maldonado
-- =============================================
-- Decisiones de diseño:
--   - Sin prefijo tbl_
--   - Roles por asignación de parque (Escenario B)
--   - Permisos fijos en BD, roles dinámicos desde el panel
--   - latitud/longitud separados en lugar de coordenadas_maps texto
--   - dia_semana como TINYINT (1=Lunes ... 7=Domingo, ISO 8601)
--   - Términos unificados en una sola tabla con campo `tipo`
--   - Participantes segmentados: adultos, niños, niñas + discapacidad
--   - password VARCHAR(255) para bcrypt/argon2
--   - creado_en sin ON UPDATE (preserva fecha original)
--   - reservaciones → solicitudes_reservaciones (semántica correcta)
--   - lista_espera eliminada: la espera es un estado dentro de solicitudes_reservaciones
--   - Estados autoexplicativos: correo_sin_verificar, pendiente_aprobacion, en_lista_espera
-- =============================================

SET NAMES utf8mb4;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `adn_reservaciones` DEFAULT CHARACTER SET utf8mb4;
USE `adn_reservaciones`;


-- =============================================
-- CATÁLOGOS
-- =============================================

CREATE TABLE tipo_documentos (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  tipo        VARCHAR(45)  NOT NULL COMMENT 'Cédula, Pasaporte, RNC, DNI, Otro',
  estado      ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  creado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;


CREATE TABLE tipo_eventos (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  tipo        VARCHAR(100) NOT NULL,
  estado      ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  creado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;


-- =============================================
-- PARQUES Y ZONAS
-- =============================================

CREATE TABLE parques (
  id                INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  id_parque_adn     VARCHAR(45)   NULL      COMMENT 'ID interno del sistema ADN',
  nombre            VARCHAR(100)  NOT NULL,
  descripcion       TEXT          NULL,
  correo            VARCHAR(150)  NULL,
  provincia         VARCHAR(45)   NOT NULL,
  municipio         VARCHAR(45)   NOT NULL,
  sector            VARCHAR(45)   NOT NULL,
  circunscripcion   VARCHAR(45)   NOT NULL,
  direccion         VARCHAR(200)  NULL,
  latitud           DECIMAL(10,8) NULL,
  longitud          DECIMAL(11,8) NULL,
  portada_url       VARCHAR(500)  NULL,
  portada_size      INT UNSIGNED  NULL,
  portada_formato   VARCHAR(10)   NULL,
  estado            ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  creado_por        VARCHAR(100)  NULL,
  creado_en         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modificado_por    VARCHAR(100)  NULL,
  modificado_en     DATETIME      NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;


CREATE TABLE zonas (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_parque         INT UNSIGNED NOT NULL,
  nombre            VARCHAR(100) NOT NULL,
  descripcion       TEXT         NULL,
  capacidad_maxima  INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '0 = sin límite definido',
  latitud           DECIMAL(10,8) NULL,
  longitud          DECIMAL(11,8) NULL,
  estado            ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  creado_por        VARCHAR(100) NULL,
  creado_en         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modificado_por    VARCHAR(100) NULL,
  modificado_en     DATETIME     NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_zonas_parque
    FOREIGN KEY (id_parque) REFERENCES parques(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;


CREATE TABLE horarios_parque (
  id                    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_parque             INT UNSIGNED NOT NULL,
  dia_semana            TINYINT UNSIGNED NOT NULL COMMENT '1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado, 7=Domingo',
  hora_apertura         TIME         NOT NULL,
  hora_cierre           TIME         NOT NULL,
  es_especial           BOOLEAN      NOT NULL DEFAULT FALSE,
  descripcion_especial  VARCHAR(200) NULL,
  estado                ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  creado_en             TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modificado_en         DATETIME     NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_horarios_parque
    FOREIGN KEY (id_parque) REFERENCES parques(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;


CREATE TABLE horarios_zona (
  id                    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_zona               INT UNSIGNED NOT NULL,
  dia_semana            TINYINT UNSIGNED NOT NULL COMMENT '1=Lunes ... 7=Domingo',
  hora_apertura         TIME         NOT NULL,
  hora_cierre           TIME         NOT NULL,
  es_especial           BOOLEAN      NOT NULL DEFAULT FALSE,
  descripcion_especial  VARCHAR(200) NULL,
  estado                ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  creado_en             TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modificado_en         DATETIME     NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_horarios_zona
    FOREIGN KEY (id_zona) REFERENCES zonas(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;


CREATE TABLE imagenes_parque (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_parque       INT UNSIGNED NOT NULL,
  url             VARCHAR(500) NOT NULL,
  nombre_original VARCHAR(200) NULL,
  formato         VARCHAR(10)  NULL,
  size            INT UNSIGNED NULL,
  estado          ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  creado_por      VARCHAR(100) NULL,
  creado_en       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_imagenes_parque
    FOREIGN KEY (id_parque) REFERENCES parques(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;


CREATE TABLE imagenes_zona (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_zona         INT UNSIGNED NOT NULL,
  url             VARCHAR(500) NOT NULL,
  nombre_original VARCHAR(200) NULL,
  formato         VARCHAR(10)  NULL,
  size            INT UNSIGNED NULL,
  estado          ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  creado_por      VARCHAR(100) NULL,
  creado_en       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_imagenes_zona
    FOREIGN KEY (id_zona) REFERENCES zonas(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;


CREATE TABLE telefonos_parque (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_parque   INT UNSIGNED NOT NULL,
  telefono    VARCHAR(20)  NOT NULL,
  tipo        ENUM('principal','secundario','fax') NOT NULL DEFAULT 'principal',
  estado      ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  creado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_telefonos_parque
    FOREIGN KEY (id_parque) REFERENCES parques(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;


-- Una sola tabla para términos generales y específicos por parque.
-- Si id_parque es NULL → aplica a todos los parques (general).
-- Si id_parque tiene valor → aplica solo a ese parque (específico).
CREATE TABLE terminos_condiciones (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_parque      INT UNSIGNED NULL    COMMENT 'NULL = término general del sistema',
  tipo           ENUM('general','especifico') NOT NULL DEFAULT 'general',
  titulo         VARCHAR(200) NOT NULL,
  contenido      TEXT         NOT NULL,
  estado         ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  creado_por     VARCHAR(100) NULL,
  creado_en      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modificado_por VARCHAR(100) NULL,
  modificado_en  DATETIME     NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_terminos_parque
    FOREIGN KEY (id_parque) REFERENCES parques(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;


-- =============================================
-- RBAC — Roles y Permisos
-- Escenario B: el rol vive en la asignación
-- usuario ↔ parque, no en el usuario directamente.
-- Superadmin tiene acceso total sin restricción de parque.
-- =============================================

-- Permisos fijos definidos por el sistema.
-- El admin NO puede crear ni eliminar permisos,
-- solo asignarlos o quitarlos de un rol.
CREATE TABLE permisos (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  clave        VARCHAR(100) NOT NULL UNIQUE COMMENT 'snake_case, ej: aprobar_reservacion',
  descripcion  VARCHAR(200) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;


-- Roles dinámicos: el admin los crea desde el panel.
CREATE TABLE roles (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre         VARCHAR(100) NOT NULL,
  descripcion    VARCHAR(200) NULL,
  estado         ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  creado_por     VARCHAR(100) NULL,
  creado_en      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modificado_por VARCHAR(100) NULL,
  modificado_en  DATETIME     NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;


-- El admin asigna qué permisos tiene cada rol.
CREATE TABLE rol_permisos (
  id_rol     INT UNSIGNED NOT NULL,
  id_permiso INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_rol, id_permiso),
  CONSTRAINT fk_rp_rol
    FOREIGN KEY (id_rol) REFERENCES roles(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_rp_permiso
    FOREIGN KEY (id_permiso) REFERENCES permisos(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;


CREATE TABLE usuarios (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_tipo_doc     INT UNSIGNED NULL,
  documento       VARCHAR(45)  NOT NULL,
  nombre          VARCHAR(100) NOT NULL,
  apellido        VARCHAR(100) NOT NULL,
  correo          VARCHAR(150) NOT NULL UNIQUE,
  telefono        VARCHAR(20)  NULL,
  usuario         VARCHAR(100) NOT NULL UNIQUE,
  password        VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt o argon2 — nunca texto plano',
  es_superadmin   BOOLEAN      NOT NULL DEFAULT FALSE COMMENT 'TRUE = acceso total, no requiere asignación de parque',
  imagen_url      VARCHAR(500) NULL,
  estado          ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  creado_por      VARCHAR(100) NULL,
  creado_en       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modificado_por  VARCHAR(100) NULL,
  modificado_en   DATETIME     NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_usuarios_tipo_doc
    FOREIGN KEY (id_tipo_doc) REFERENCES tipo_documentos(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;


-- Un usuario puede tener roles distintos en distintos parques.
-- UNIQUE en (id_usuario, id_parque): un usuario tiene un solo rol por parque.
-- Para cambiar el rol en un parque, se actualiza el registro, no se duplica.
CREATE TABLE usuarios_parques (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario   INT UNSIGNED NOT NULL,
  id_parque    INT UNSIGNED NOT NULL,
  id_rol       INT UNSIGNED NOT NULL,
  estado       ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  asignado_por VARCHAR(100) NULL,
  asignado_en  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuario_parque (id_usuario, id_parque),
  CONSTRAINT fk_up_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_up_parque
    FOREIGN KEY (id_parque) REFERENCES parques(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_up_rol
    FOREIGN KEY (id_rol) REFERENCES roles(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;


-- =============================================
-- SOLICITANTES (CIUDADANOS)
-- Separados de los usuarios del sistema admin.
-- =============================================

CREATE TABLE solicitantes (
  id                  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_tipo_doc         INT UNSIGNED NOT NULL,
  documento           VARCHAR(100) NOT NULL,
  nombres             VARCHAR(100) NOT NULL,
  apellidos           VARCHAR(100) NOT NULL,
  telefono            VARCHAR(20)  NULL,
  celular             VARCHAR(20)  NOT NULL,
  correo              VARCHAR(150) NOT NULL,
  correo_verificado   BOOLEAN      NOT NULL DEFAULT FALSE,
  estado              ENUM('activo','inactivo','pendiente') NOT NULL DEFAULT 'pendiente',
  creado_en           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modificado_en       DATETIME     NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_solicitantes_tipo_doc
    FOREIGN KEY (id_tipo_doc) REFERENCES tipo_documentos(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;


-- Tokens para verificación de correo y notificaciones de lista de espera.
CREATE TABLE tokens_verificacion (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_solicitante  INT UNSIGNED NOT NULL,
  token           VARCHAR(255) NOT NULL UNIQUE,
  tipo            ENUM('verificacion_correo','lista_espera') NOT NULL,
  expira_en       DATETIME     NOT NULL,
  usado_en        DATETIME     NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_tokens_solicitante
    FOREIGN KEY (id_solicitante) REFERENCES solicitantes(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;


-- =============================================
-- SOLICITUDES DE RESERVACIÓN
-- =============================================

-- Flujo de estados:
--   correo_sin_verificar  → ciudadano llenó el formulario, aún no verifica su correo
--   pendiente_aprobacion  → correo verificado, esperando revisión del admin
--   en_lista_espera       → zona sin cupo disponible, en cola de espera
--   aprobada              → admin aprobó la solicitud
--   rechazada             → admin rechazó la solicitud
--   cancelada             → ciudadano canceló
--   vencida               → expiró sin acción (plazo de verificación o de lista de espera)
--   realizada             → evento completado exitosamente
--
-- Campos de lista de espera (nullable, solo aplican cuando estado = 'en_lista_espera'):
--   posicion_espera  → orden en la cola (1 = próximo a ser notificado)
--   notificado_en    → cuándo se le avisó que hay disponibilidad
--   expira_en        → plazo para confirmar tras la notificación
CREATE TABLE solicitudes_reservaciones (
  id                            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_solicitante                INT UNSIGNED NOT NULL,
  id_parque                     INT UNSIGNED NOT NULL,
  id_zona                       INT UNSIGNED NOT NULL,
  id_tipo_evento                INT UNSIGNED NOT NULL,
  codigo                        VARCHAR(20)  NOT NULL UNIQUE,
  fecha_evento                  DATE         NOT NULL,
  hora_inicio                   TIME         NOT NULL,
  hora_fin                      TIME         NOT NULL,
  motivo                        VARCHAR(200) NULL,
  descripcion                   TEXT         NULL,
  -- Participantes
  cantidad_adultos              INT UNSIGNED NOT NULL DEFAULT 0,
  cantidad_ninos                INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Varones',
  cantidad_ninas                INT UNSIGNED NOT NULL DEFAULT 0,
  cantidad_adultos_discapacidad INT UNSIGNED NOT NULL DEFAULT 0,
  cantidad_ninos_discapacidad   INT UNSIGNED NOT NULL DEFAULT 0,
  cantidad_ninas_discapacidad   INT UNSIGNED NOT NULL DEFAULT 0,
  -- Estado
  estado                        ENUM('correo_sin_verificar','pendiente_aprobacion','en_lista_espera','aprobada','rechazada','cancelada','vencida','realizada') NOT NULL DEFAULT 'correo_sin_verificar',
  -- Campos de lista de espera (NULL cuando no aplica)
  posicion_espera               INT UNSIGNED NULL     COMMENT 'Orden en la cola. 1 = próximo a notificar',
  notificado_en                 DATETIME     NULL     COMMENT 'Cuándo se le notificó disponibilidad',
  expira_en                     DATETIME     NULL     COMMENT 'Plazo para confirmar tras la notificación',
  -- Auditoría
  creado_en                     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modificado_en                 DATETIME     NULL,
  PRIMARY KEY (id),
  INDEX idx_fecha_zona  (fecha_evento, id_zona),
  INDEX idx_estado      (estado),
  INDEX idx_lista_espera (id_zona, fecha_evento, posicion_espera),
  CONSTRAINT fk_sr_solicitante
    FOREIGN KEY (id_solicitante) REFERENCES solicitantes(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_sr_parque
    FOREIGN KEY (id_parque) REFERENCES parques(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_sr_zona
    FOREIGN KEY (id_zona) REFERENCES zonas(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_sr_tipo_evento
    FOREIGN KEY (id_tipo_evento) REFERENCES tipo_eventos(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;


-- Registro inmutable de cada acción sobre una solicitud.
-- id_usuario NULL = acción automática del sistema (cron, expiración, etc).
CREATE TABLE logs_solicitud (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_solicitud    INT UNSIGNED NOT NULL,
  id_usuario      INT UNSIGNED NULL     COMMENT 'NULL = acción automática del sistema',
  accion          ENUM('creada','correo_verificado','pendiente_aprobacion','en_lista_espera','aprobada','rechazada','cancelada','vencida','realizada') NOT NULL,
  comentario      TEXT         NULL,
  creado_en       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_logs_solicitud (id_solicitud),
  CONSTRAINT fk_logs_solicitud
    FOREIGN KEY (id_solicitud) REFERENCES solicitudes_reservaciones(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_logs_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;


-- =============================================
-- AUDITORÍA GENERAL
-- =============================================

-- Registra acciones administrativas sobre cualquier entidad del sistema.
-- No reemplaza logs_solicitud — ese cubre el flujo específico de solicitudes.
-- Este cubre todo lo demás: parques, zonas, usuarios, roles, permisos.
-- No tiene FK a entidad_id porque puede apuntar a tablas distintas.
CREATE TABLE logs_auditoria (
  id           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  id_usuario   INT UNSIGNED  NULL     COMMENT 'NULL = acción automática del sistema',
  tabla        VARCHAR(100)  NOT NULL COMMENT 'Tabla afectada: parques, zonas, usuarios, roles...',
  entidad_id   INT UNSIGNED  NOT NULL COMMENT 'ID del registro afectado',
  accion       ENUM('creado','modificado','activado','desactivado','eliminado') NOT NULL,
  detalle      TEXT          NULL     COMMENT 'Descripción libre de qué cambió',
  creado_en    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_auditoria_tabla    (tabla, entidad_id),
  INDEX idx_auditoria_usuario  (id_usuario),
  CONSTRAINT fk_auditoria_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;


-- =============================================
-- SEED: Permisos del sistema
-- Lista cerrada — solo el desarrollador puede agregar permisos nuevos.
-- El admin asigna/quita estos permisos a los roles desde el panel.
-- =============================================

INSERT INTO permisos (clave, descripcion) VALUES
('ver_solicitudes',       'Ver listado de solicitudes de reservación'),
('aprobar_solicitud',     'Aprobar una solicitud pendiente de aprobación'),
('rechazar_solicitud',    'Rechazar una solicitud pendiente de aprobación'),
('cancelar_solicitud',    'Cancelar una solicitud aprobada'),
('gestionar_parques',    'Crear, editar y desactivar parques'),
('gestionar_zonas',      'Crear, editar y desactivar zonas de un parque'),
('gestionar_usuarios',   'Crear y administrar usuarios del sistema'),
('gestionar_roles',      'Crear roles y asignar permisos'),
('ver_reportes',         'Acceder a reportes y estadísticas'),
('gestionar_terminos',   'Crear y editar términos y condiciones');


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
