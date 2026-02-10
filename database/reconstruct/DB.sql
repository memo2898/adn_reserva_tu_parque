

-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema adn_reservaciones_parques
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema adn_reservaciones_parques
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `adn_reservaciones_parques` DEFAULT CHARACTER SET utf8mb4 ;
USE `adn_reservaciones_parques` ;

-- -----------------------------------------------------
-- Table `adn_reservaciones_parques`.`tbl_parques`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `adn_reservaciones_parques`.`tbl_parques` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre_parque` VARCHAR(45) NOT NULL,
  `descripcion` VARCHAR(1000) NOT NULL,
  `correo` VARCHAR(45) NOT NULL,
  `provincia` VARCHAR(45) NOT NULL,
  `municipio` VARCHAR(45) NOT NULL,
  `sector` VARCHAR(45) NOT NULL,
  `circunscripcion` VARCHAR(45) NOT NULL,
  `coordenadas_maps` VARCHAR(500) NOT NULL,
  `direccion` VARCHAR(100) NULL DEFAULT NULL,
  `espera` INT(11) NOT NULL DEFAULT 1,
  `agregado_por` VARCHAR(45) NULL DEFAULT NULL,
  `agregado_en` TIMESTAMP NULL DEFAULT NULL,
  `modificado_por` VARCHAR(45) NULL DEFAULT NULL,
  `modificado_en` DATETIME NULL DEFAULT NULL,
  `estado` ENUM('activo', 'inactivo') NULL DEFAULT 'activo',
  PRIMARY KEY (`id`))
ENGINE = InnoDB

DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `adn_reservaciones_parques`.`tbl_horarios_parques`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `adn_reservaciones_parques`.`tbl_horarios_parques` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_parque` INT(11) NOT NULL,
  `dia_semana` VARCHAR(45) NOT NULL,
  `hora_apertura` TIME NOT NULL,
  `hora_cierre` TIME NOT NULL,
  `agregado_por` VARCHAR(45) NULL DEFAULT 'Reservaciones_ADN',
  `agregado_en` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `modificado_por` VARCHAR(45) NULL DEFAULT NULL,
  `modificado_en` DATETIME NULL DEFAULT NULL,
  `horario_especial` VARCHAR(45) NULL DEFAULT 'inactivo',
  `descripcion_especial` VARCHAR(45) NULL DEFAULT NULL,
  `estado` ENUM('activo', 'inactivo') NULL DEFAULT 'activo',
  PRIMARY KEY (`id`),
  INDEX `id_parque` (`id_parque` ) ,
  CONSTRAINT `tbl_horarios_parques_ibfk_1`
    FOREIGN KEY (`id_parque`)
    REFERENCES `adn_reservaciones_parques`.`tbl_parques` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB

DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `adn_reservaciones_parques`.`tbl_zonas_parques`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `adn_reservaciones_parques`.`tbl_zonas_parques` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_parque` INT(11) NOT NULL,
  `nombre` VARCHAR(45) NOT NULL,
  `coordenada_X` VARCHAR(45) NULL DEFAULT NULL,
  `coordenada_Y` VARCHAR(45) NULL DEFAULT NULL,
  `direccion` VARCHAR(100) NULL DEFAULT NULL,
  `coordenadas_maps` VARCHAR(500) NULL DEFAULT NULL,
  `agregado_por` VARCHAR(45) NULL DEFAULT 'Reservaciones_ADN',
  `agregado_en` TIMESTAMP NULL DEFAULT NULL,
  `modificado_por` VARCHAR(45) NULL DEFAULT NULL,
  `modificado_en` DATETIME NULL DEFAULT NULL,
  `estado` ENUM('activo', 'inactivo') NULL DEFAULT 'activo',
  PRIMARY KEY (`id`),
  INDEX `id_parque` (`id_parque` ),
  CONSTRAINT `tbl_zonas_parques_ibfk_1`
    FOREIGN KEY (`id_parque`)
    REFERENCES `adn_reservaciones_parques`.`tbl_parques` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `adn_reservaciones_parques`.`tbl_horarios_zonas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `adn_reservaciones_parques`.`tbl_horarios_zonas` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_zona` INT(11) NOT NULL,
  `dia_semana` VARCHAR(45) NOT NULL,
  `hora_apertura` TIME NOT NULL,
  `hora_cierre` TIME NOT NULL,
  `agregado_por` VARCHAR(45) NULL DEFAULT 'Reservaciones_ADN',
  `agregado_en` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `modificado_por` VARCHAR(45) NULL DEFAULT NULL,
  `modificado_en` DATETIME NULL DEFAULT NULL,
  `horario_especial` VARCHAR(45) NULL DEFAULT 'inactivo',
  `descripcion_especial` VARCHAR(45) NULL DEFAULT NULL,
  `estado` ENUM('activo', 'inactivo') NULL DEFAULT 'activo',
  PRIMARY KEY (`id`),
  INDEX `id_zona` (`id_zona` ),
  CONSTRAINT `tbl_horarios_zonas_ibfk_1`
    FOREIGN KEY (`id_zona`)
    REFERENCES `adn_reservaciones_parques`.`tbl_zonas_parques` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB

DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `adn_reservaciones_parques`.`tbl_imagenes_por_parque`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `adn_reservaciones_parques`.`tbl_imagenes_por_parque` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_parque` INT(11) NOT NULL,
  `imagen` LONGBLOB NULL DEFAULT NULL,
  `agregado_por` VARCHAR(45) NULL DEFAULT NULL,
  `agregado_en` TIMESTAMP NULL DEFAULT NULL,
  `modificado_por` VARCHAR(45) NULL DEFAULT NULL,
  `modificado_en` DATETIME NULL DEFAULT NULL,
  `estado` ENUM('activo', 'inactivo') NULL DEFAULT 'activo',
  PRIMARY KEY (`id`),
  INDEX `id_parque` (`id_parque` ),
  CONSTRAINT `tbl_imagenes_por_parque_ibfk_1`
    FOREIGN KEY (`id_parque`)
    REFERENCES `adn_reservaciones_parques`.`tbl_parques` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB

DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `adn_reservaciones_parques`.`tbl_imagenes_por_zona`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `adn_reservaciones_parques`.`tbl_imagenes_por_zona` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_zona` INT(11) NOT NULL,
  `imagen` LONGBLOB NULL DEFAULT NULL,
  `ruta` VARCHAR(200) NULL DEFAULT NULL,
  `formato` VARCHAR(45) NULL DEFAULT NULL,
  `agregado_por` VARCHAR(45) NULL DEFAULT 'Reservaciones_ADN',
  `agregado_en` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `modificado_por` VARCHAR(45) NULL DEFAULT NULL,
  `modificado_en` DATETIME NULL DEFAULT NULL,
  `estado` ENUM('activo', 'inactivo') NULL DEFAULT 'activo',
  PRIMARY KEY (`id`),
  INDEX `id_zona` (`id_zona` ),
  CONSTRAINT `tbl_imagenes_por_zona_ibfk_1`
    FOREIGN KEY (`id_zona`)
    REFERENCES `adn_reservaciones_parques`.`tbl_zonas_parques` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB

DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `adn_reservaciones_parques`.`tbl_permisos_usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `adn_reservaciones_parques`.`tbl_permisos_usuarios` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `posicion` VARCHAR(45) NULL DEFAULT NULL,
  `permisos` VARCHAR(70) NOT NULL COMMENT 'PERMISOS\\\\n\\\\n1. Consulta (Unicamente revision)\\\\n2. Evaluacion (Autorizar o rechazar solicitudes)',
  `agregado_por` VARCHAR(45) NULL DEFAULT 'Reservaciones_ADN',
  `agregado_en` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `modificado_por` VARCHAR(45) NULL DEFAULT NULL,
  `modificado_en` DATETIME NULL DEFAULT NULL,
  `estado` ENUM('activo', 'inactivo') NULL DEFAULT 'activo',
  PRIMARY KEY (`id`))
ENGINE = InnoDB

DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `adn_reservaciones_parques`.`tbl_tipo_documentos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `adn_reservaciones_parques`.`tbl_tipo_documentos` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `tipo_documento` VARCHAR(45) NOT NULL COMMENT '1. Cédula\\\\n2. Pasaporte\\\\n3. RNC\\\\n4. DNI\\\\n5. Otro',
  `agregado_por` VARCHAR(45) NULL DEFAULT NULL,
  `agregado_en` TIMESTAMP NULL DEFAULT NULL,
  `modificado_por` VARCHAR(45) NULL DEFAULT NULL,
  `modificado_en` DATETIME NULL DEFAULT NULL,
  `estado` ENUM('activo', 'inactivo') NULL DEFAULT 'activo',
  PRIMARY KEY (`id`))
ENGINE = InnoDB

DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `adn_reservaciones_parques`.`tbl_solicitantes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `adn_reservaciones_parques`.`tbl_solicitantes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombres` VARCHAR(45) NOT NULL,
  `apellidos` VARCHAR(45) NOT NULL,
  `id_tipo_doc` INT(11) NOT NULL,
  `documento` VARCHAR(100) NOT NULL,
  `telefono` VARCHAR(45) NULL DEFAULT NULL,
  `celular` VARCHAR(45) NOT NULL,
  `correo` VARCHAR(70) NOT NULL,
  `agregado_por` VARCHAR(45) NOT NULL DEFAULT 'Reservaciones_ADN',
  `agregado_en` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `modificado_por` VARCHAR(45) NULL DEFAULT NULL,
  `modificado_en` DATETIME NULL DEFAULT NULL,
  `estado` ENUM('activo', 'inactivo', 'pendiente') NULL DEFAULT 'pendiente',
  PRIMARY KEY (`id`),
  INDEX `id_tipo_doc` (`id_tipo_doc` ),
  CONSTRAINT `tbl_solicitantes_ibfk_1`
    FOREIGN KEY (`id_tipo_doc`)
    REFERENCES `adn_reservaciones_parques`.`tbl_tipo_documentos` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB

DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `adn_reservaciones_parques`.`tbl_tipos_eventos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `adn_reservaciones_parques`.`tbl_tipos_eventos` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `tipo` VARCHAR(45) NOT NULL,
  `agregado_por` VARCHAR(45) NULL DEFAULT NULL,
  `agregado_en` TIMESTAMP NULL DEFAULT NULL,
  `modificado_por` VARCHAR(45) NULL DEFAULT NULL,
  `modificado_en` DATETIME NULL DEFAULT NULL,
  `estado` ENUM('activo', 'inactivo') NULL DEFAULT 'activo',
  PRIMARY KEY (`id`))
ENGINE = InnoDB

DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `adn_reservaciones_parques`.`tbl_reservaciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `adn_reservaciones_parques`.`tbl_reservaciones` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_solicitante` INT(11) NOT NULL,
  `id_parque` INT(11) NOT NULL,
  `id_zona` INT(11) NOT NULL,
  `id_evento` INT(11) NOT NULL,
  `fecha_evento` DATE NOT NULL,
  `hora_inicio` TIME NOT NULL,
  `hora_fin` TIME NOT NULL,
  `motivo_evento` VARCHAR(100) NULL DEFAULT NULL,
  `descripcion_evento` VARCHAR(300) NULL DEFAULT NULL,
  `responsables` VARCHAR(45) NULL DEFAULT 'Null',
  `cantidad_participantes_adultos` INT(11) NOT NULL,
  `cantidad_participantes_ninos` INT(11) NULL DEFAULT 0,
  `codigo_reservacion` VARCHAR(45) NOT NULL,
  `agregado_por` VARCHAR(45) NOT NULL DEFAULT 'Reservaciones_ADN',
  `agregado_en` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `modificado_por` VARCHAR(45) NULL DEFAULT NULL,
  `modificado_en` DATETIME NULL DEFAULT NULL,
  `estado` ENUM('pendiente', 'espera', 'confirmada', 'rechazada', 'vencida', 'realizada') NULL DEFAULT 'espera' COMMENT '1. Pendiente (Esperando confirmación del usuario…Correo)(Esperando que se deshabilite una reserva).\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n2. Confirmado.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n3. Esperando confirmación de inicio',
  PRIMARY KEY (`id`),
  INDEX `id_solicitante` (`id_solicitante` ),
  INDEX `id_zona` (`id_zona` ),
  INDEX `id_evento` (`id_evento` ),
  INDEX `tbl_reservaciones_ibfk_3` (`id_parque` ),
  CONSTRAINT `tbl_reservaciones_ibfk_1`
    FOREIGN KEY (`id_solicitante`)
    REFERENCES `adn_reservaciones_parques`.`tbl_solicitantes` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `tbl_reservaciones_ibfk_2`
    FOREIGN KEY (`id_zona`)
    REFERENCES `adn_reservaciones_parques`.`tbl_zonas_parques` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `tbl_reservaciones_ibfk_3`
    FOREIGN KEY (`id_parque`)
    REFERENCES `adn_reservaciones_parques`.`tbl_parques` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `tbl_reservaciones_ibfk_4`
    FOREIGN KEY (`id_evento`)
    REFERENCES `adn_reservaciones_parques`.`tbl_tipos_eventos` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB

DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `adn_reservaciones_parques`.`tbl_telefonos_por_parques`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `adn_reservaciones_parques`.`tbl_telefonos_por_parques` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_parque` INT(11) NOT NULL,
  `telefono` VARCHAR(45) NOT NULL,
  `agregado_por` VARCHAR(45) NULL DEFAULT NULL,
  `agregado_en` TIMESTAMP NULL DEFAULT NULL,
  `modificado_por` VARCHAR(45) NULL DEFAULT NULL,
  `modificado_en` DATETIME NULL DEFAULT NULL,
  `estado` ENUM('activo', 'inactivo') NULL DEFAULT 'activo',
  PRIMARY KEY (`id`),
  INDEX `id_parque` (`id_parque` ),
  CONSTRAINT `tbl_telefonos_por_parques_ibfk_1`
    FOREIGN KEY (`id_parque`)
    REFERENCES `adn_reservaciones_parques`.`tbl_parques` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB

DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `adn_reservaciones_parques`.`tbl_terminos_condiciones_generales`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `adn_reservaciones_parques`.`tbl_terminos_condiciones_generales` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_parque` INT(11) NOT NULL,
  `condiciones` VARCHAR(45) NOT NULL,
  `agregado_por` VARCHAR(45) NULL DEFAULT NULL,
  `agregado_en` TIMESTAMP NULL DEFAULT NULL,
  `modificado_por` DATETIME NULL DEFAULT NULL,
  `modificado_en` VARCHAR(45) NULL DEFAULT NULL,
  `estado` ENUM('activo', 'inactivo') NULL DEFAULT 'activo',
  PRIMARY KEY (`id`),
  INDEX `id_parque` (`id_parque` ),
  CONSTRAINT `tbl_terminos_condiciones_generales_ibfk_1`
    FOREIGN KEY (`id_parque`)
    REFERENCES `adn_reservaciones_parques`.`tbl_parques` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `adn_reservaciones_parques`.`tbl_terminos_condiciones_p`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `adn_reservaciones_parques`.`tbl_terminos_condiciones_p` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_parque` INT(11) NOT NULL,
  `condiciones` VARCHAR(45) NOT NULL,
  `agregado_por` VARCHAR(45) NULL DEFAULT NULL,
  `agregado_en` TIMESTAMP NULL DEFAULT NULL,
  `modificado_por` DATETIME NULL DEFAULT NULL,
  `modificado_en` VARCHAR(45) NULL DEFAULT NULL,
  `estado` ENUM('activo', 'inactivo') NULL DEFAULT 'activo',
  PRIMARY KEY (`id`),
  INDEX `id_parque` (`id_parque` ),
  CONSTRAINT `tbl_terminos_condiciones_p_ibfk_1`
    FOREIGN KEY (`id_parque`)
    REFERENCES `adn_reservaciones_parques`.`tbl_parques` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `adn_reservaciones_parques`.`tbl_usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `adn_reservaciones_parques`.`tbl_usuario` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_parque` INT(11) NOT NULL,
  `id_user_type` INT(11) NOT NULL,
  `id_tipo_doc` INT(11) NULL DEFAULT NULL,
  `documento` VARCHAR(45) NOT NULL,
  `nombre` VARCHAR(45) NOT NULL,
  `apellido` VARCHAR(45) NOT NULL,
  `correo` VARCHAR(45) NOT NULL,
  `telefono` VARCHAR(45) NULL DEFAULT NULL,
  `usuario` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `imagen` LONGBLOB NULL DEFAULT 'default',
  `agregado_por` VARCHAR(45) NULL DEFAULT 'Reservaciones_ADN',
  `agregado_en` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `modificado_por` VARCHAR(45) NULL DEFAULT NULL,
  `modificado_en` VARCHAR(45) NULL DEFAULT NULL,
  `estado` ENUM('activo', 'inactivo') NULL DEFAULT 'activo',
  PRIMARY KEY (`id`),
  INDEX `id_parque` (`id_parque` ),
  INDEX `id_user_type` (`id_user_type` ),
  CONSTRAINT `tbl_usuario_ibfk_1`
    FOREIGN KEY (`id_parque`)
    REFERENCES `adn_reservaciones_parques`.`tbl_parques` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `tbl_usuario_ibfk_2`
    FOREIGN KEY (`id_user_type`)
    REFERENCES `adn_reservaciones_parques`.`tbl_permisos_usuarios` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB

DEFAULT CHARACTER SET = utf8mb4;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
