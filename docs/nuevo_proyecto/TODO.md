# Guía de Reconstrucción — Sistema de Reservas ADN
Stack nuevo: NestJS + MySQL

---

## Estado general

- [x] Responder preguntas abiertas del análisis BD
- [x] Diseñar nuevo schema de BD
- [x] Generar DB.sql limpio
- [ ] Definir arquitectura backend (NestJS)
- [ ] Definir arquitectura frontend
- [ ] Definir fases de desarrollo con estimaciones

---

## Análisis BD — Problemas resueltos

### Bugs corregidos

- [x] **Columnas swapeadas** en términos y condiciones — `modificado_por VARCHAR`, `modificado_en DATETIME`
- [x] **`agregado_en` con `ON UPDATE`** — `creado_en` ahora es solo `DEFAULT CURRENT_TIMESTAMP`
- [x] **`responsables DEFAULT 'Null'`** — eliminado, campo no existe en el nuevo schema
- [x] **`password VARCHAR(45)`** — corregido a `VARCHAR(255)` para bcrypt/argon2

### Inconsistencias resueltas

- [x] **Dos tablas de términos casi idénticas** → unificadas en `terminos_condiciones` con campo `tipo ENUM('general','especifico')` y `id_parque` nullable
- [x] **`id_parque` NOT NULL en usuarios** → reemplazado por tabla pivot `usuarios_parques` con `id_rol` por asignación (Escenario B)
- [x] **`tbl_permisos_usuarios` mal diseñada** → RBAC completo: `roles` + `permisos` + `rol_permisos`
- [x] **`dia_semana VARCHAR(45)`** → `TINYINT` (1=Lunes … 7=Domingo, ISO 8601)
- [x] **Participantes sin segmentar** → 6 campos: `cantidad_adultos`, `cantidad_ninos`, `cantidad_ninas` + `_discapacidad` para cada uno
- [x] **Prefijo `tbl_` en todas las tablas** → eliminado

### Decisiones de diseño nuevas

- [x] **`reservaciones` → `solicitudes_reservaciones`** — semántica correcta: empieza como solicitud
- [x] **`lista_espera` eliminada como tabla separada** — la espera es un estado dentro de `solicitudes_reservaciones` con campos nullable: `posicion_espera`, `notificado_en`, `expira_en`
- [x] **Estados autoexplicativos:**
  - `correo_sin_verificar` → ciudadano llenó el form, aún no verifica correo
  - `pendiente_aprobacion` → correo verificado, admin debe revisar
  - `en_lista_espera` → zona sin cupo, en cola
  - `aprobada` / `rechazada` / `cancelada` / `vencida` / `realizada`
- [x] **Dos tablas de logs con responsabilidades claras:**
  - `logs_solicitud` → ciclo de vida de cada solicitud (con FK)
  - `logs_auditoria` → acciones administrativas generales (parques, usuarios, roles...)
- [x] **Logs manejados por backend (NestJS)** — no triggers, para preservar contexto del usuario autenticado (`id_usuario`)
- [x] **`coordenadas_maps VARCHAR`** → `latitud DECIMAL(10,8)` + `longitud DECIMAL(11,8)` separados
- [x] **`zonas.capacidad_maxima`** → `INT UNSIGNED DEFAULT 0` (0 = sin límite)
- [x] **`tokens_verificacion`** — nueva tabla para verificación de correo y notificaciones de lista de espera
- [x] **`usuarios.es_superadmin BOOLEAN`** — acceso total sin restricción de parque

---

## Preguntas abiertas resueltas

- [x] ¿Rol global o por parque? → **Escenario B: rol por asignación de parque** (`usuarios_parques.id_rol`)
- [x] ¿Permisos fijos o dinámicos? → **Roles dinámicos, permisos fijos** en seed (lista cerrada)
- [x] ¿Términos unificados o separados? → **Una tabla** con `tipo` y `id_parque` nullable
- [x] ¿Lista de espera como tabla o estado? → **Estado dentro de `solicitudes_reservaciones`**
- [x] ¿Logs por trigger o backend? → **Backend** (NestJS `LogsService` + interceptor con decorador)

---

## Tablas del nuevo schema

| Tabla | Descripción |
|---|---|
| `tipo_documentos` | Catálogo: Cédula, Pasaporte, RNC... |
| `tipo_eventos` | Catálogo de tipos de evento |
| `parques` | Parques con lat/lng separados |
| `zonas` | Zonas con `capacidad_maxima` |
| `horarios_parque` | Horarios por parque (`dia_semana TINYINT`) |
| `horarios_zona` | Horarios por zona (`dia_semana TINYINT`) |
| `imagenes_parque` | Galería de imágenes por parque |
| `imagenes_zona` | Galería de imágenes por zona |
| `telefonos_parque` | Teléfonos por parque |
| `terminos_condiciones` | Términos generales y específicos por parque |
| `permisos` | Lista fija de permisos del sistema (seed) |
| `roles` | Roles dinámicos creados por el admin |
| `rol_permisos` | Pivot: qué permisos tiene cada rol |
| `usuarios` | Usuarios del sistema admin |
| `usuarios_parques` | Pivot: usuario + parque + rol (Escenario B) |
| `solicitantes` | Ciudadanos que solicitan reservas |
| `tokens_verificacion` | Tokens de verificación de correo y lista de espera |
| `solicitudes_reservaciones` | Solicitudes con ciclo de vida completo |
| `logs_solicitud` | Historial de acciones sobre cada solicitud |
| `logs_auditoria` | Auditoría general del sistema |

---

## Pendiente — Requiere reunión previa

- [ ] **Módulo de gestión y mantenimiento de parques**
  - El sistema no es solo reservas — también gestionará el estado operativo de los parques
  - Pendiente definir: ¿qué tipos de mantenimiento? ¿quién los registra? ¿afectan la disponibilidad de reservas?
  - Una vez definido: ajustar schema (nuevas tablas) y agregar a la arquitectura NestJS
  - ⚠️ Esto puede afectar el flujo de solicitudes: un parque en mantenimiento no debería aceptar nuevas reservas

---

## Próximos pasos

- [ ] Definir arquitectura NestJS (módulos, capas, estructura de carpetas)
- [ ] Definir arquitectura frontend
- [ ] Definir fases de desarrollo con estimaciones
- [ ] Reunión sobre módulo de mantenimiento de parques → ajustar schema
