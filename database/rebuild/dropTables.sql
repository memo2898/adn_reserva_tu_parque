-- Opción 1: Usando un procedimiento almacenado
USE adn_reservaciones_parques;  -- Especificar la BD primero

DELIMITER $$

DROP PROCEDURE IF EXISTS drop_all_tables$$

CREATE PROCEDURE drop_all_tables()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE table_name VARCHAR(255);
    DECLARE cur CURSOR FOR 
        SELECT tables.table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'adn_reservaciones_parques';  -- Aquí especificas la BD
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    SET FOREIGN_KEY_CHECKS = 0;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO table_name;
        IF done THEN
            LEAVE read_loop;
        END IF;
        SET @stmt = CONCAT('DROP TABLE IF EXISTS `adn_reservaciones_parques`.`', table_name, '`');
        PREPARE stmt FROM @stmt;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END LOOP;

    CLOSE cur;
    SET FOREIGN_KEY_CHECKS = 1;
END$$

DELIMITER ;

CALL drop_all_tables();
DROP PROCEDURE IF EXISTS drop_all_tables;