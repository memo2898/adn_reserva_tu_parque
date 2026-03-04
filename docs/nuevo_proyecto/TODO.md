# Guía de Reconstrucción — Sistema de Reservas ADN
Stack nuevo: NestJS + MySQL

---

## Estado general

- [ ] Definir respuestas a preguntas abiertas (ver sección final)
- [ ] Diseñar nuevo schema de BD
- [ ] Generar DB.sql limpio
- [ ] Definir arquitectura backend (NestJS)
- [ ] Definir arquitectura frontend
- [ ] Definir fases de desarrollo con estimaciones

---

## Análisis BD actual — Problemas encontrados

### Bugs reales

1. **Columnas swapeadas** en `tbl_terminos_condiciones_generales` y `tbl_terminos_condiciones_p`:
   - `modificado_por` tiene tipo DATETIME (debería ser VARCHAR)
   - `modificado_en` tiene tipo VARCHAR(45) (debería ser DATETIME)

2. **`agregado_en` con `ON UPDATE CURRENT_TIMESTAMP`** en:
   - `tbl_horarios_parques`, `tbl_horarios_zonas`, `tbl_imagenes_por_zona`, `tbl_solicitantes`, `tbl_usuario`
   - El campo de creación se sobreescribe en cada UPDATE. Se pierde la fecha original.

3. **`responsables VARCHAR(45) DEFAULT 'Null'`** en `tbl_reservaciones`:
   - El string `"Null"` en lugar de NULL real. Rompe validaciones `IS NULL`.

4. **`password VARCHAR(45)`** en `tbl_usuario`:
   - Bcrypt genera hashes de 60 chars mínimo. Las contraseñas se truncan o no pueden hashearse.

---

### Inconsistencias de diseño

5. **`tbl_terminos_condiciones_generales` vs `tbl_terminos_condiciones_p`**:
   - Ambas tienen `id_parque` y `condiciones`. Son prácticamente idénticas.
   - ¿Cuál es la diferencia? ¿O fue un error y deberían unificarse?

6. **`tbl_usuario.id_parque` NOT NULL**:
   - Un usuario solo puede pertenecer a UN parque.
   - ¿Los superadmins a qué parque pertenecen? Esto rompe cualquier rol global.

7. **`tbl_permisos_usuarios` mal nombrada y mal diseñada**:
   - Es una tabla de roles, no de permisos.
   - Los permisos son un `VARCHAR(70)` con texto libre — no es RBAC, es un campo de notas.

8. **`dia_semana VARCHAR(45)`** en horarios:
   - Texto libre sin restricción. Inconsistencia garantizada ("Lunes", "lunes", "LUNES").

9. **`cantidad_participantes_ninos`**:
   - Un solo campo sin distinción de género ni discapacidad.

---

### Lo que falta para los nuevos features

| Feature pedido                  | Tabla necesaria         | ¿Existe? |
|---------------------------------|-------------------------|----------|
| Lista de espera                 | `lista_espera`          | No       |
| Logs de aprobación              | `logs_reservacion`      | No       |
| Verificación de correo          | `tokens_verificacion`   | No       |
| RBAC real                       | `roles`, `permisos`, `rol_permisos` | No |
| Límite de personas por zona     | campo en `zonas`        | No       |
| Niños / Niñas separados         | campos en `reservaciones` | No     |
| Discapacitados                  | campos en `reservaciones` | No     |

---

## Lo que SÍ se conserva del schema actual

- Estructura general parque → zona (bien pensada)
- Separación entre `solicitantes` (ciudadanos) y `usuarios` (admin) — correcto
- Tabla de horarios por parque y por zona — correcto
- Tabla de imágenes por parque y por zona — correcto
- Tabla de teléfonos por parque — correcto
- `tbl_tipo_documentos` y `tbl_tipos_eventos` como catálogos — correcto
- `codigo_reservacion` en reservaciones — correcto
- ENUM de estados en reservaciones (aunque incompleto) — base correcta

---

## Preguntas abiertas — Requieren respuesta antes de escribir el SQL

### Usuarios y roles
- [ ] ¿Un usuario admin puede gestionar múltiples parques o siempre está asignado a uno solo?
- [ ] ¿Los roles son fijos en código (superadmin, admin, evaluador) o el admin los crea dinámicamente desde la interfaz?

### Lista de espera
- [ ] Cuando alguien cancela, ¿el siguiente en cola recibe un correo y tiene X horas para confirmar? ¿O se le asigna automáticamente sin confirmación?
- [ ] ¿La lista de espera es por zona + fecha, o solo por zona?
- [ ] ¿Qué pasa si llega la fecha del evento y la reserva sigue en lista de espera? ¿Se marca como vencida automáticamente?

### Términos y condiciones
- [ ] ¿Cuál era la diferencia entre `tbl_terminos_condiciones_generales` y `tbl_terminos_condiciones_p`?
  - Opción A: Una es global del sistema y la otra es por parque específico.
  - Opción B: Fue un error y deberían unificarse en una sola tabla.

---

## Próximos pasos

1. Responder preguntas abiertas
2. Escribir nuevo `DB.sql` limpio
3. Continuar con arquitectura NestJS
