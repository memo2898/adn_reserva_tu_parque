-- =====================================================
-- FIX: Actualizar valores de permisos
-- =====================================================

USE `adn_reservaciones_parques`;

UPDATE `tbl_permisos_usuarios` SET `permisos` = 'administrador' WHERE `id` = 1;
UPDATE `tbl_permisos_usuarios` SET `permisos` = 'supervisor' WHERE `id` = 2;
UPDATE `tbl_permisos_usuarios` SET `permisos` = 'operador' WHERE `id` = 3;
UPDATE `tbl_permisos_usuarios` SET `permisos` = 'gestionar' WHERE `id` = 4;

-- Verificar los cambios
SELECT id, posicion, permisos FROM `tbl_permisos_usuarios`;
