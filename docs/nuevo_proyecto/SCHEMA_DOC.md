# Documentación del Schema — ADN Reserva tu Parque
**Stack:** NestJS + MySQL
**Versión:** 2.0 (Rebuild)
**Fecha:** 2026-03-05
**Autor:** Manuel Maldonado

---

## Índice
1. [Resumen del sistema](#1-resumen-del-sistema)
2. [Mapa de tablas](#2-mapa-de-tablas)
3. [Dominio: Parques y Zonas](#3-dominio-parques-y-zonas)
4. [Dominio: Usuarios y RBAC](#4-dominio-usuarios-y-rbac)
5. [Dominio: Solicitudes de Reservación](#5-dominio-solicitudes-de-reservación)
6. [Dominio: Auditoría y Logs](#6-dominio-auditoría-y-logs)
7. [Máquina de estados](#7-máquina-de-estados)
8. [RBAC — Cómo funciona](#8-rbac--cómo-funciona)
9. [Decisiones de diseño](#9-decisiones-de-diseño)
10. [Pendiente — Módulo de mantenimiento](#10-pendiente--módulo-de-mantenimiento)

---

## 1. Resumen del sistema

El sistema gestiona la reservación de espacios dentro de parques intervenidos por el ADN (Ayuntamiento del Distrito Nacional). Cubre el ciclo completo desde que un ciudadano solicita un espacio hasta que el evento se realiza, incluyendo verificación de correo, lista de espera, aprobación administrativa y reportes estadísticos.

**Dos tipos de usuario:**
- **Ciudadano (solicitante):** No tiene cuenta. Llena un formulario, verifica su correo y espera aprobación.
- **Usuario admin:** Tiene cuenta con rol asignado por parque. Aprueba, rechaza y gestiona el sistema.

---

## 2. Mapa de tablas

### Catálogos
| Tabla | Descripción |
|---|---|
| `tipo_documentos` | Cédula, Pasaporte, RNC, DNI, Otro |
| `tipo_eventos` | Tipos de evento disponibles |

### Parques y Zonas
| Tabla | Descripción |
|---|---|
| `parques` | Parques con datos físicos, demográficos y estado operativo |
| `amenidades_parque` | Inventario físico por parque (bancos, juegos, canchas...) |
| `zonas` | Espacios reservables dentro de un parque |
| `horarios_parque` | Horarios de apertura y cierre por día |
| `horarios_zona` | Horarios específicos por zona |
| `imagenes_parque` | Galería de imágenes del parque |
| `imagenes_zona` | Galería de imágenes por zona |
| `telefonos_parque` | Teléfonos de contacto del parque |
| `terminos_condiciones` | Términos generales y específicos por parque |

### Usuarios y RBAC
| Tabla | Descripción |
|---|---|
| `permisos` | Lista fija de acciones del sistema (seed) |
| `roles` | Roles dinámicos creados por el admin |
| `rol_permisos` | Pivot: qué permisos tiene cada rol |
| `usuarios` | Usuarios admin del sistema |
| `usuarios_parques` | Pivot: usuario + parque + rol asignado |

### Solicitudes
| Tabla | Descripción |
|---|---|
| `solicitantes` | Ciudadanos que realizan solicitudes |
| `tokens_verificacion` | Tokens de verificación de correo y lista de espera |
| `solicitudes_reservaciones` | Solicitudes con ciclo de vida completo |

### Logs
| Tabla | Descripción |
|---|---|
| `logs_solicitud` | Historial de cada transición de estado de una solicitud |
| `logs_auditoria` | Auditoría de acciones administrativas (parques, usuarios, roles...) |

---

## 3. Dominio: Parques y Zonas

### `parques`
Tabla central del sistema. Contiene datos enriquecidos del inventario real del ADN (207 parques).

**Campos clave:**
- `id_parque_adn` — ID del sistema ADN original (ej: `ADN-P-1`). Permite trazabilidad.
- `tipo` — `Parque`, `Monumento`, `Plaza`, `Boulevard`, `Area Verde-recuperada`
- `circunscripcion` — `C1`, `C2`, `C3`
- `zona_lote` — Zona administrativa de la ciudad (ej: `ZONA 06`). Diferente a las zonas internas del parque.
- `localidad` — Barrio específico (ej: `ZONA COLONIAL`, `GAZCUE`)
- `area_m2` — Superficie en metros cuadrados
- `poblacion_masculina` / `poblacion_femenina` — Datos demográficos del entorno para reportes estadísticos
- `tiene_accesibilidad` — `BOOLEAN`. Si el parque tiene rampa. Se muestra al ciudadano en el formulario.
- `tiene_banos` — `BOOLEAN`. Si hay servicios sanitarios. Se muestra al ciudadano.
- `condicion_actual` — `ENUM('optima','en_intervencion','fuera_de_servicio')`. Los dos últimos bloquean nuevas solicitudes.

### `amenidades_parque`
Inventario físico flexible. Una fila por tipo de amenidad por parque.

**Por qué una tabla separada y no columnas en `parques`:**
El CSV tiene ~40 tipos de amenidades. Meter 40 columnas en `parques` lo haría inmanejable. Con esta tabla, agregar un nuevo tipo de amenidad no requiere alterar el schema.

**Tipos de amenidad:**
```
letrero_principal, normas_generales, gazebo, capilla, luminarias,
bancos, mesa_picnic, papeleras, juegos_ninos, maquinas_ejercicios,
llave_agua, tomacorriente, banderas, reflectores, senalecticas,
estatuas, jardineras, canchas_deportivas, canchas_soccer, tinaco,
parque_canino, pista_bicicleta, oficina, murales, karting
```

**Conexión con zonas:**
`canchas_deportivas`, `canchas_soccer`, `pista_bicicleta` y `parque_canino` son candidatas a convertirse en **zonas reservables** dentro del parque. La lógica de negocio en NestJS puede derivar zonas sugeridas del inventario de amenidades.

### `zonas`
Espacios específicos dentro de un parque que pueden ser reservados.

**Campo importante:** `capacidad_maxima INT DEFAULT 0` — El valor `0` significa sin límite definido. Cuando tiene valor, el sistema valida que la suma de participantes de la solicitud no supere el límite.

### `terminos_condiciones`
Una sola tabla para términos generales y específicos.

**Lógica:**
- `id_parque IS NULL` + `tipo = 'general'` → Aplica a todos los parques
- `id_parque = X` + `tipo = 'especifico'` → Solo aplica al parque X

En la solicitud, el ciudadano ve primero los términos generales y luego los del parque seleccionado.

---

## 4. Dominio: Usuarios y RBAC

### Escenario B — Rol por asignación de parque

El rol no vive en el usuario sino en la relación usuario-parque. Un mismo usuario puede ser `Administrador` en el Parque A y `Evaluador` en el Parque B.

```
usuarios
└── (sin rol directo)

usuarios_parques
├── id_usuario
├── id_parque
└── id_rol  ← el rol es específico por parque
```

**Excepción:** `usuarios.es_superadmin = TRUE` da acceso total sin restricción de parque. El superadmin no necesita estar en `usuarios_parques`.

### `permisos` — Lista fija (seed)
Los permisos son definidos por el desarrollador. El admin no puede crear ni eliminar permisos, solo asignarlos a roles.

| Clave | Descripción |
|---|---|
| `ver_solicitudes` | Ver listado de solicitudes |
| `aprobar_solicitud` | Aprobar solicitudes pendientes |
| `rechazar_solicitud` | Rechazar solicitudes pendientes |
| `cancelar_solicitud` | Cancelar solicitudes aprobadas |
| `gestionar_parques` | Crear, editar y desactivar parques |
| `gestionar_zonas` | Gestionar zonas de un parque |
| `gestionar_amenidades` | Gestionar inventario de amenidades |
| `gestionar_usuarios` | Administrar usuarios del sistema |
| `gestionar_roles` | Crear roles y asignar permisos |
| `ver_reportes` | Acceder a reportes y estadísticas |
| `gestionar_terminos` | Crear y editar términos y condiciones |

### `roles` — Dinámicos
El admin crea roles desde el panel y les asigna los permisos que considere. Ejemplos de roles típicos:

| Rol (ejemplo) | Permisos sugeridos |
|---|---|
| Evaluador | `ver_solicitudes`, `aprobar_solicitud`, `rechazar_solicitud` |
| Administrador de Parque | Todo lo anterior + `gestionar_zonas`, `gestionar_amenidades` |
| Consulta | Solo `ver_solicitudes`, `ver_reportes` |

---

## 5. Dominio: Solicitudes de Reservación

### Separación ciudadano / admin

`solicitantes` y `usuarios` son tablas completamente separadas. Un ciudadano que llena el formulario **no tiene cuenta** en el sistema. El único punto de contacto es su correo electrónico.

### `tokens_verificacion`
Maneja dos flujos:
- `tipo = 'verificacion_correo'` — Confirmar que el correo del ciudadano es válido
- `tipo = 'lista_espera'` — Notificar al ciudadano que se liberó un cupo y tiene tiempo limitado para confirmar

### `solicitudes_reservaciones`

#### Campos de participantes
```
cantidad_adultos
cantidad_ninos              (varones)
cantidad_ninas
cantidad_adultos_discapacidad
cantidad_ninos_discapacidad
cantidad_ninas_discapacidad
```

El sistema puede validar que el total de participantes no supere `zonas.capacidad_maxima`.

#### Campos de lista de espera (nullable)
Solo tienen valor cuando `estado = 'en_lista_espera'`:

```
posicion_espera   → orden en la cola (1 = próximo a notificar)
notificado_en     → cuándo se le notificó al ciudadano que hay cupo disponible
expira_en         → plazo límite para que el ciudadano confirme
```

---

## 6. Dominio: Auditoría y Logs

### `logs_solicitud`
Registro inmutable de cada transición de estado de una solicitud. Permite ver el historial completo de una solicitud: cuándo se creó, cuándo se verificó el correo, quién la aprobó y cuándo.

`id_usuario NULL` significa que la acción fue automática (el sistema marcó algo como vencido, por ejemplo).

### `logs_auditoria`
Auditoría general de acciones administrativas. Cubre todo lo que no es el flujo de solicitudes: quién desactivó un parque, quién cambió los permisos de un rol, quién creó un usuario.

**Por qué sin FK a `entidad_id`:**
El campo `entidad_id` puede apuntar a diferentes tablas (`parques`, `usuarios`, `roles`...). MySQL no permite FKs polimórficas, por lo que la integridad referencial se maneja desde NestJS.

**Por qué backend y no triggers:**
Los triggers de MySQL no tienen acceso al usuario autenticado de la aplicación. Si usáramos triggers, `id_usuario` siempre sería NULL, perdiendo el valor más importante del log.

---

## 7. Máquina de estados

```
[Ciudadano llena formulario]
          ↓
  correo_sin_verificar
          ↓  ciudadano hace clic en el enlace del correo
  pendiente_aprobacion ◄──────────────────────────────────┐
          ↓                                                │
     ¿Hay cupo?                                            │
     ├── Sí → pendiente_aprobacion (admin debe revisar)    │
     └── No → en_lista_espera                              │
                   ↓  se libera un cupo                    │
                   └── se notifica al ciudadano ───────────┘
                         (tiene plazo para confirmar)
          ↓
     [Admin revisa]
     ├── aprobada    → el evento está confirmado
     ├── rechazada   → se le notifica al ciudadano
     └── (sin acción antes del plazo) → vencida
          ↓
     (fecha del evento pasa con éxito)
          ↓
       realizada

Desde cualquier estado activo:
     cancelada  → el ciudadano decide cancelar
     vencida    → el sistema expira automáticamente (cron job)
```

---

## 8. RBAC — Cómo funciona

### Verificar si un usuario puede hacer algo en NestJS

```typescript
// En el guard de NestJS:
// 1. Si es superadmin → pasa todo
// 2. Si no → buscar en usuarios_parques para el parque en contexto
// 3. Obtener el rol → obtener permisos del rol
// 4. Verificar si el permiso requerido está en la lista

async tienePermiso(idUsuario: number, idParque: number, permiso: string): Promise<boolean> {
  const usuario = await this.usuariosRepo.findOne(idUsuario);
  if (usuario.es_superadmin) return true;

  const asignacion = await this.usuariosParquesRepo.findOne({ idUsuario, idParque });
  if (!asignacion) return false;

  const permisos = await this.rolPermisosRepo.findByRol(asignacion.id_rol);
  return permisos.some(p => p.clave === permiso);
}
```

### LogsService — Patrón de auditoría

```typescript
// Uso en cualquier servicio:
await this.logsService.auditoria({
  idUsuario: usuario.id,
  tabla: 'parques',
  entidadId: parque.id,
  accion: 'desactivado',
  detalle: `Estado cambiado de 'activo' a 'inactivo'`
});
```

---

## 9. Decisiones de diseño

| Decisión | Alternativa descartada | Razón |
|---|---|---|
| Rol en `usuarios_parques` (Escenario B) | Rol directo en `usuarios` | Un usuario puede tener distintos roles en distintos parques |
| `solicitudes_reservaciones` en lugar de `reservaciones` | `reservaciones` | La solicitud empieza antes de ser una reserva confirmada |
| Lista de espera como estado, no tabla | Tabla `lista_espera` separada | Evita duplicación de datos y simplifica queries |
| Estados autoexplicativos | `pendiente`, `en_revision` | Claridad sin necesidad de documentación adicional |
| Logs en backend, no triggers | Triggers MySQL | Los triggers no conocen el usuario autenticado |
| `amenidades_parque` tabla separada | 40 columnas en `parques` | Flexibilidad y mantenibilidad |
| `latitud`/`longitud DECIMAL` | `coordenadas_maps VARCHAR` | Permite cálculos geográficos y validaciones |
| `dia_semana TINYINT` (ISO 8601) | `VARCHAR(45)` | Consistencia, sin ambigüedad, eficiente en índices |
| `password VARCHAR(255)` | `VARCHAR(45)` | bcrypt genera hashes de 60 chars, argon2 más |
| Términos en una tabla con `tipo` | Dos tablas separadas | Elimina duplicación y columnas swapeadas |

---

## 10. Pendiente — Módulo de mantenimiento

**Estado:** Esperando reunión con el equipo.

**Lo que ya sabemos del CSV:**
- Los parques tienen `condicion_actual`: `"Optima condiciones"`, `"Procceso de intervencion por mal uso"`
- Hay campos `Fecha Ultimo Mantenimiento` y `Fecha Proximo Mantenimiento`
- Esto sugiere un historial de intervenciones con fechas y responsables

**Preguntas pendientes para la reunión:**
- ¿Qué tipos de mantenimiento existen? (correctivo, preventivo, intervención por mal uso...)
- ¿Quién registra el mantenimiento? ¿Un rol específico?
- ¿El mantenimiento bloquea automáticamente las solicitudes del parque?
- ¿Hay notificaciones a los ciudadanos con solicitudes aprobadas si el parque entra en mantenimiento?
- ¿Se guarda historial de intervenciones o solo el estado actual?

**Tablas que probablemente se agreguen:**
```
mantenimientos_parque
├── id_parque
├── tipo_mantenimiento
├── descripcion
├── fecha_inicio
├── fecha_fin (NULL si aún no termina)
├── responsable
└── estado: 'en_proceso', 'completado'
```

⚠️ El campo `parques.condicion_actual` ya está preparado para reflejar el estado del módulo de mantenimiento.
