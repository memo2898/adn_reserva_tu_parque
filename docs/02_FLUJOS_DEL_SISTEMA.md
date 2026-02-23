# 2. FLUJOS DEL SISTEMA

## Índice de Flujos

1. [Flujo de Reservación Ciudadana](#21-flujo-de-reservación-ciudadana)
2. [Flujo de Gestión Administrativa](#22-flujo-de-gestión-administrativa)
3. [Flujo de Autenticación y Autorización](#23-flujo-de-autenticación-y-autorización)
4. [Flujo de Notificaciones por Email](#24-flujo-de-notificaciones-por-email)
5. [Flujo de Consulta de Estado](#25-flujo-de-consulta-de-estado)
6. [Flujos de Validación y Error](#26-flujos-de-validación-y-error)
7. [Diagrama de Estados de Reservación](#27-diagrama-de-estados-de-reservación)
8. [Matriz de Permisos por Rol](#28-matriz-de-permisos-por-rol)

---

## 2.1 Flujo de Reservación Ciudadana

### Descripción General
Proceso completo desde que un ciudadano accede al sistema hasta que recibe confirmación de su solicitud de reserva.

### Actores
- **Ciudadano/Solicitante:** Usuario público sin autenticación
- **Sistema:** Aplicación Laravel
- **Base de Datos:** MySQL
- **Servicio de Email:** SMTP Office 365

---

### Diagrama de Flujo Principal

```
┌─────────────────────────────────────────────────────────────────┐
│                    INICIO - Ciudadano                           │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Accede a /reservaciones      │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Sistema carga datos:         │
        │ - Listado de parques activos │
        │ - Tipos de eventos          │
        │ - Tipos de documentos       │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Usuario selecciona PARQUE    │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Sistema obtiene:             │
        │ - Zonas del parque           │
        │ - Horarios disponibles       │
        │ - Imágenes del parque        │
        │ GET /reservaciones_eventos   │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Usuario selecciona:          │
        │ - Zona específica            │
        │ - Tipo de evento             │
        │ - Fecha del evento           │
        │ - Hora inicio y fin          │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Sistema obtiene imágenes     │
        │ de la zona seleccionada      │
        │ GET /imagenes_zonas/{id}     │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Usuario completa datos:      │
        │ - Tipo documento             │
        │ - Número documento           │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Sistema busca solicitante    │
        │ GET /Reservaciones_          │
        │ solicitantes/{tipo}/{doc}    │
        └──────────────┬───────────────┘
                       │
                ┌──────┴──────┐
                │             │
        ¿Existe? NO         SI │
                │             │
                ▼             ▼
    ┌────────────────┐  ┌──────────────┐
    │ Usuario llena: │  │ Sistema      │
    │ - Nombres      │  │ autocompleta │
    │ - Apellidos    │  │ datos        │
    │ - Celular      │  └──────┬───────┘
    │ - Email        │         │
    └────────┬───────┘         │
             │                 │
             └────────┬────────┘
                      │
                      ▼
        ┌──────────────────────────────┐
        │ Usuario completa:            │
        │ - Motivo del evento          │
        │ - Descripción                │
        │ - Responsables               │
        │ - Cantidad adultos           │
        │ - Cantidad niños             │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Usuario acepta términos      │
        │ y condiciones del parque     │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Usuario envía formulario     │
        │ POST /Reservaciones_2_post   │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ VALIDACIÓN DEL SISTEMA       │
        │                              │
        │ 1. Validar datos requeridos  │
        │ 2. Validar formato de datos  │
        │ 3. Verificar disponibilidad  │
        │    de fecha/zona             │
        │ 4. Validar horarios          │
        └──────────────┬───────────────┘
                       │
                ┌──────┴──────┐
                │             │
        ¿Válido? NO          SI │
                │             │
                ▼             ▼
    ┌────────────────┐  ┌──────────────────────┐
    │ Mostrar errores│  │ Si solicitante nuevo:│
    │ al usuario     │  │ POST /Reservaciones_ │
    │                │  │ user                 │
    │ Permitir       │  └──────────┬───────────┘
    │ corrección     │             │
    └────────────────┘             ▼
                       ┌──────────────────────────┐
                       │ Generar código único     │
                       │ de reservación           │
                       │ (alfanumérico)           │
                       └──────────┬───────────────┘
                                  │
                                  ▼
                       ┌──────────────────────────┐
                       │ Crear registro en        │
                       │ tbl_reservaciones        │
                       │ Estado: "espera"         │
                       └──────────┬───────────────┘
                                  │
                                  ▼
                       ┌──────────────────────────┐
                       │ Generar código QR        │
                       │ (qr-code-styling)        │
                       │ Contenido: código        │
                       │ de reservación           │
                       └──────────┬───────────────┘
                                  │
                                  ▼
                       ┌──────────────────────────┐
                       │ Enviar email confirmación│
                       │ POST /enviar-correo      │
                       │                          │
                       │ Incluye:                 │
                       │ - Código de reservación  │
                       │ - Código QR              │
                       │ - Detalles de reserva    │
                       │ - Enlace de confirmación │
                       └──────────┬───────────────┘
                                  │
                                  ▼
                       ┌──────────────────────────┐
                       │ Mostrar pantalla de éxito│
                       │                          │
                       │ "Su solicitud ha sido    │
                       │ recibida. Revise su      │
                       │ correo electrónico"      │
                       └──────────┬───────────────┘
                                  │
                                  ▼
                       ┌──────────────────────────┐
                       │ FIN - Solicitud Registrada│
                       └──────────────────────────┘
```

---

### Descripción Paso a Paso

#### FASE 1: Acceso y Carga Inicial

**Paso 1.1:** Ciudadano accede a la URL `/reservaciones`

**Paso 1.2:** Sistema ejecuta:
```php
// Obtiene parques activos
$parques = tbl_parques::where('estado', 1)->get();

// Obtiene tipos de eventos activos
$eventos = tbl_tipos_eventos::where('estado', 1)->get();

// Obtiene tipos de documentos
$tipo_documentos = tbl_tipo_documento::where('estado', 1)->get();
```

**Paso 1.3:** Sistema renderiza vista `Reservaciones.blade.php` con datos precargados

---

#### FASE 2: Selección de Parque y Zona

**Paso 2.1:** Usuario selecciona un parque del dropdown

**Paso 2.2:** JavaScript hace llamada AJAX:
```javascript
GET /reservaciones_eventos/{id_parque}
```

**Paso 2.3:** Sistema retorna JSON con:
- Zonas del parque
- Tipos de eventos permitidos
- Horarios de operación

**Paso 2.4:** Frontend actualiza dropdowns de zona y evento

**Paso 2.5:** Usuario selecciona zona

**Paso 2.6:** JavaScript carga imágenes de la zona:
```javascript
GET /Reservaciones_imagenes_zonas/{id_zona}
```

**Paso 2.7:** Sistema muestra galería de imágenes de la zona

---

#### FASE 3: Selección de Fecha y Horario

**Paso 3.1:** Usuario selecciona fecha en datepicker

**Paso 3.2:** Sistema consulta horarios disponibles del parque:
```javascript
GET /Reservaciones_parque_horarios/{id_parque}
```

**Paso 3.3:** Sistema retorna horarios:
```json
{
  "hora_apertura": "08:00",
  "hora_cierre": "18:00"
}
```

**Paso 3.4:** Sistema valida disponibilidad consultando reservas existentes:
```javascript
GET /Reservaciones_dia/{fecha}/{id_parque}
```

**Paso 3.5:** Frontend muestra horarios disponibles (excluyendo reservados)

**Paso 3.6:** Usuario selecciona hora inicio y hora fin

---

#### FASE 4: Datos del Solicitante

**Paso 4.1:** Usuario selecciona tipo de documento (cédula, pasaporte, RNC)

**Paso 4.2:** Usuario ingresa número de documento

**Paso 4.3:** Al blur del campo, sistema busca solicitante:
```javascript
GET /Reservaciones_solicitantes/{id_tipo_doc}/{documento}
```

**Paso 4.4a:** Si existe - Sistema autocompleta:
- Nombres
- Apellidos
- Celular
- Email

**Paso 4.4b:** Si NO existe - Usuario completa manualmente todos los campos

---

#### FASE 5: Detalles del Evento

**Paso 5.1:** Usuario selecciona tipo de evento del dropdown

**Paso 5.2:** Usuario completa:
- **Motivo del evento:** Texto libre (ej: "Cumpleaños infantil")
- **Descripción:** Detalles adicionales
- **Responsables:** Nombres de personas a cargo
- **Cantidad de participantes adultos:** Número
- **Cantidad de participantes niños:** Número

**Paso 5.3:** Usuario lee términos y condiciones del parque

**Paso 5.4:** Usuario marca checkbox de aceptación

---

#### FASE 6: Validación y Registro

**Paso 6.1:** Usuario hace clic en "Enviar Solicitud"

**Paso 6.2:** JavaScript valida campos en frontend:
- Campos requeridos no vacíos
- Formato de email válido
- Formato de documento válido
- Fecha no en el pasado
- Hora fin posterior a hora inicio
- Términos aceptados

**Paso 6.3:** Si validación frontend falla → Mostrar errores, detener

**Paso 6.4:** Si validación frontend OK → POST a `/Reservaciones_2_post`

**Paso 6.5:** Backend valida nuevamente:
```php
// Validar disponibilidad
$reservas_existentes = tbl_reservaciones::where([
    ['id_parque', '=', $request->parque],
    ['id_zona', '=', $request->zona],
    ['fecha_evento', '=', $request->fecha],
    ['estado', '!=', 'rechazada'],
    ['estado', '!=', 'vencida']
])->whereBetween('hora_inicio', [$request->hora_inicio, $request->hora_fin])
  ->orWhereBetween('hora_fin', [$request->hora_inicio, $request->hora_fin])
  ->count();

if ($reservas_existentes > 0) {
    return response()->json(['error' => 'Zona no disponible']);
}
```

**Paso 6.6:** Si solicitante es nuevo, crear registro:
```php
POST /Reservaciones_user
```
```php
$solicitante = tbl_solicitantes::create([
    'nombres' => $request->nombres,
    'apellidos' => $request->apellidos,
    'id_tipo_doc' => $request->tipo_doc,
    'documento' => $request->documento,
    'celular' => $request->celular,
    'correo' => $request->email
]);
```

**Paso 6.7:** Generar código único de reservación:
```php
$codigo_reservacion = strtoupper(substr(md5(uniqid(rand(), true)), 0, 10));
```

**Paso 6.8:** Crear registro de reservación:
```php
$reservacion = tbl_reservaciones::create([
    'id_solicitante' => $solicitante->id,
    'id_parque' => $request->parque,
    'id_zona' => $request->zona,
    'id_evento' => $request->evento,
    'fecha_evento' => $request->fecha,
    'hora_inicio' => $request->hora_inicio,
    'hora_fin' => $request->hora_fin,
    'motivo_evento' => $request->motivo,
    'descripcion' => $request->descripcion,
    'responsables' => $request->responsables,
    'cantidad_participantes_adultos' => $request->adultos,
    'cantidad_participantes_niños' => $request->ninos,
    'codigo_reservacion' => $codigo_reservacion,
    'estado' => 'espera'
]);
```

---

#### FASE 7: Notificación

**Paso 7.1:** Sistema genera código QR:
```javascript
// Frontend con qr-code-styling
const qrCode = new QRCodeStyling({
    data: codigo_reservacion,
    width: 300,
    height: 300,
    type: "svg"
});
```

**Paso 7.2:** Sistema prepara email con plantilla `stripo.blade.php`

**Paso 7.3:** Email incluye:
- Saludo personalizado
- Código de reservación
- Detalles de la reserva (parque, zona, fecha, hora)
- Código QR (embedded)
- Enlace de confirmación: `/actualizacion?codigo={codigo_reservacion}`
- Instrucciones

**Paso 7.4:** Sistema envía email vía Office 365 SMTP:
```php
POST /enviar-correo
```

**Paso 7.5:** Sistema retorna respuesta exitosa al frontend

**Paso 7.6:** Frontend muestra mensaje de éxito:
```
"¡Solicitud Recibida!"
Su código de reservación es: ABC123XYZ
Hemos enviado los detalles a su correo electrónico.
```

---

### Puntos de Validación

| Punto | Validación | Acción si Falla |
|-------|-----------|-----------------|
| 1 | Campos requeridos completos | Resaltar campos vacíos |
| 2 | Formato de email válido | Mensaje: "Email inválido" |
| 3 | Fecha no en el pasado | Mensaje: "Seleccione fecha futura" |
| 4 | Hora fin > hora inicio | Mensaje: "Horario inválido" |
| 5 | Horario dentro de apertura/cierre | Mensaje: "Fuera de horario" |
| 6 | Zona disponible en fecha/hora | Mensaje: "Zona no disponible" |
| 7 | Términos aceptados | Desactivar botón enviar |
| 8 | Documento válido (si hay validación externa) | Mensaje: "Documento inválido" |

---

### Casos de Uso Especiales

#### Caso A: Parque en Modo Espera
```
Si parque.espera == true:
    - Se permite crear reserva
    - Estado inicial: "espera"
    - Se envía a cola de espera
    - Administrador debe aprobar manualmente
```

#### Caso B: Solicitante Recurrente
```
Si documento ya existe en tbl_solicitantes:
    - Autocompletar datos personales
    - Validar si tiene reservas vigentes
    - Permitir nueva reserva
```

#### Caso C: Conflicto de Horario
```
Si existe reserva en misma zona/fecha/hora:
    - Rechazar solicitud
    - Sugerir horarios alternativos
    - Mostrar calendario de disponibilidad
```

---

### Datos de Entrada y Salida

**Input (Formulario de Reservación):**
```json
{
  "parque": 1,
  "zona": 3,
  "evento": 2,
  "fecha": "2026-03-15",
  "hora_inicio": "10:00",
  "hora_fin": "14:00",
  "tipo_doc": 1,
  "documento": "00112233445",
  "nombres": "Juan",
  "apellidos": "Pérez",
  "celular": "8091234567",
  "email": "juan.perez@example.com",
  "motivo": "Cumpleaños infantil",
  "descripcion": "Celebración de cumpleaños #5",
  "responsables": "Juan Pérez, María García",
  "adultos": 15,
  "ninos": 20,
  "acepto_terminos": true
}
```

**Output (Respuesta del Sistema):**
```json
{
  "success": true,
  "message": "Solicitud registrada exitosamente",
  "data": {
    "id_reservacion": 123,
    "codigo_reservacion": "ABC123XYZ",
    "estado": "espera",
    "email_enviado": true
  }
}
```

---

## 2.2 Flujo de Gestión Administrativa

### Descripción General
Proceso que sigue un administrador u operador de parque para gestionar las solicitudes de reserva recibidas.

### Actores
- **Operador de Parque:** Usuario con permisos limitados a su parque
- **Administrador:** Usuario con permisos globales
- **Sistema:** Aplicación Laravel

---

### Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────────┐
│              INICIO - Usuario Administrativo                    │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Accede a /login              │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Ingresa credenciales:        │
        │ - Usuario                    │
        │ - Contraseña                 │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │ POST /Reservaciones_cuenta   │
        │ Validar credenciales         │
        └──────────────┬───────────────┘
                       │
                ┌──────┴──────┐
                │             │
        ¿Válido? NO          SI │
                │             │
                ▼             ▼
    ┌────────────────┐  ┌──────────────────────┐
    │ Mostrar error  │  │ Crear sesión         │
    │ "Credenciales  │  │ POST /reservaciones_ │
    │ incorrectas"   │  │ sesion               │
    │                │  │                      │
    │ Volver a login │  │ Genera token y       │
    └────────────────┘  │ guarda en Session    │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │ Redirigir a /inicio  │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────────┐
                        │ Cargar Dashboard         │
                        │ GET /Dashboard           │
                        │                          │
                        │ Si Administrador:        │
                        │   - Todas las reservas   │
                        │                          │
                        │ Si Operador:             │
                        │   - Solo su parque       │
                        └──────────┬───────────────┘
                                   │
                                   ▼
                        ┌──────────────────────────┐
                        │ Muestra estadísticas:    │
                        │ - Reservas del mes       │
                        │ - Por estado             │
                        │ - Gráficas               │
                        └──────────┬───────────────┘
                                   │
                                   ▼
                        ┌──────────────────────────┐
                        │ Usuario hace clic en     │
                        │ "Gestionar Solicitudes"  │
                        └──────────┬───────────────┘
                                   │
                                   ▼
                        ┌──────────────────────────┐
                        │ GET /R_solicitudes       │
                        │                          │
                        │ Sistema filtra:          │
                        │ - Si Admin: todas        │
                        │ - Si Operador: su parque │
                        │                          │
                        │ WHERE estado IN          │
                        │ ('espera', 'pendiente')  │
                        └──────────┬───────────────┘
                                   │
                                   ▼
                        ┌──────────────────────────┐
                        │ Muestra tabla con:       │
                        │ - Código reservación     │
                        │ - Solicitante            │
                        │ - Parque                 │
                        │ - Zona                   │
                        │ - Fecha                  │
                        │ - Hora                   │
                        │ - Estado                 │
                        │ - Acciones               │
                        └──────────┬───────────────┘
                                   │
                                   ▼
                        ┌──────────────────────────┐
                        │ Usuario selecciona       │
                        │ una solicitud            │
                        └──────────┬───────────────┘
                                   │
                                   ▼
                        ┌──────────────────────────┐
                        │ GET /Office_Get_id/{id}  │
                        │                          │
                        │ Obtiene detalles         │
                        │ completos de reserva     │
                        └──────────┬───────────────┘
                                   │
                                   ▼
                        ┌──────────────────────────┐
                        │ Muestra modal/vista con: │
                        │ - Datos del solicitante  │
                        │ - Detalles del evento    │
                        │ - Motivo y descripción   │
                        │ - Responsables           │
                        │ - Cantidad participantes │
                        │ - Fecha de solicitud     │
                        └──────────┬───────────────┘
                                   │
                                   ▼
                        ┌──────────────────────────┐
                        │ Usuario revisa y decide  │
                        └──────────┬───────────────┘
                                   │
                        ┌──────────┴──────────┐
                        │                     │
                    APROBAR              RECHAZAR
                        │                     │
                        ▼                     ▼
        ┌────────────────────────┐  ┌────────────────────┐
        │ Selecciona "Confirmar" │  │ Selecciona         │
        │                        │  │ "Rechazar"         │
        └──────────┬─────────────┘  └──────┬─────────────┘
                   │                       │
                   ▼                       ▼
        ┌────────────────────────┐  ┌────────────────────┐
        │ PATCH /Office_patch/   │  │ PATCH /Office_     │
        │ {id}                   │  │ patch/{id}         │
        │                        │  │                    │
        │ Body:                  │  │ Body:              │
        │ { estado: "confirmada"}│  │ { estado:          │
        │                        │  │   "rechazada" }    │
        └──────────┬─────────────┘  └──────┬─────────────┘
                   │                       │
                   │                       │
                   └──────────┬────────────┘
                              │
                              ▼
                   ┌──────────────────────────┐
                   │ Sistema actualiza BD     │
                   │ UPDATE tbl_reservaciones │
                   │ SET estado = ?,          │
                   │     modificado_en = NOW()│
                   │ WHERE id = ?             │
                   └──────────┬───────────────┘
                              │
                              ▼
                   ┌──────────────────────────┐
                   │ Sistema envía email      │
                   │ POST /enviar-correo_     │
                   │ confirmacion             │
                   │                          │
                   │ - Si confirmada: QR +    │
                   │   instrucciones          │
                   │ - Si rechazada: mensaje  │
                   │   de disculpa            │
                   └──────────┬───────────────┘
                              │
                              ▼
                   ┌──────────────────────────┐
                   │ Sistema muestra mensaje  │
                   │ "Estado actualizado"     │
                   └──────────┬───────────────┘
                              │
                              ▼
                   ┌──────────────────────────┐
                   │ Refresca lista de        │
                   │ solicitudes              │
                   │ (solicitud procesada     │
                   │ desaparece de la lista)  │
                   └──────────┬───────────────┘
                              │
                              ▼
                   ┌──────────────────────────┐
                   │ Usuario puede:           │
                   │ - Procesar otra solicitud│
                   │ - Ver estadísticas       │
                   │ - Cerrar sesión          │
                   └──────────────────────────┘
```

---

### Descripción Paso a Paso

#### FASE 1: Acceso al Panel Administrativo

**Paso 1.1:** Usuario accede a `/login`

**Paso 1.2:** Sistema muestra formulario de autenticación

**Paso 1.3:** Usuario ingresa:
- Usuario (username)
- Contraseña

**Paso 1.4:** Sistema hace `POST /Reservaciones_cuenta`

**Paso 1.5:** Sistema valida:
```php
$user = tbl_usuario::where('usuario', $request->usuario)
                   ->where('estado', 1)
                   ->first();

if ($user && Hash::check($request->password, $user->password)) {
    // Credenciales válidas
    POST /reservaciones_sesion
} else {
    // Credenciales inválidas
    return error
}
```

**Paso 1.6:** Si válido, sistema crea sesión:
```php
Session::put('usuario', [
    'id' => $user->id,
    'nombre' => $user->nombre,
    'apellido' => $user->apellido,
    'id_parque' => $user->id_parque,
    'id_user_type' => $user->id_user_type,
    'token' => $generated_token
]);
```

**Paso 1.7:** Redirección a `/inicio`

---

#### FASE 2: Dashboard y Estadísticas

**Paso 2.1:** Sistema verifica middleware `token.auth`

**Paso 2.2:** Sistema carga dashboard (`GET /Dashboard`)

**Paso 2.3:** Sistema discrimina por rol:

**Si es Administrador (id_user_type == 1):**
```php
$reservas = tbl_reservaciones::whereMonth('agregado_en', now()->month)
                             ->get();
```

**Si es Operador (id_user_type == 2):**
```php
$reservas = tbl_reservaciones::where('id_parque', Session::get('usuario.id_parque'))
                             ->whereMonth('agregado_en', now()->month)
                             ->get();
```

**Paso 2.4:** Sistema calcula estadísticas:
- Total de reservas del mes
- Por estado (espera, confirmada, rechazada, realizada)
- Por parque (solo admin)
- Tendencias

**Paso 2.5:** Sistema renderiza gráficas y métricas

---

#### FASE 3: Gestión de Solicitudes

**Paso 3.1:** Usuario navega a "Solicitudes Pendientes"

**Paso 3.2:** Sistema carga `GET /R_solicitudes`

**Paso 3.3:** Sistema obtiene solicitudes:

**Administrador:**
```php
$solicitudes = tbl_reservaciones::whereIn('estado', ['espera', 'pendiente'])
                                ->with(['solicitante', 'parque', 'zona', 'evento'])
                                ->orderBy('agregado_en', 'desc')
                                ->get();
```

**Operador:**
```php
$solicitudes = tbl_reservaciones::where('id_parque', Session::get('usuario.id_parque'))
                                ->whereIn('estado', ['espera', 'pendiente'])
                                ->with(['solicitante', 'parque', 'zona', 'evento'])
                                ->orderBy('agregado_en', 'desc')
                                ->get();
```

**Paso 3.4:** Sistema muestra tabla con:
| Código | Solicitante | Parque | Zona | Fecha | Hora | Estado | Acciones |
|--------|-------------|--------|------|-------|------|--------|----------|
| ABC123 | Juan Pérez  | Central| Gazebo| 2026-03-15 | 10:00-14:00 | espera | [Ver] [Aprobar] [Rechazar] |

---

#### FASE 4: Revisión de Detalle

**Paso 4.1:** Usuario hace clic en "Ver" de una solicitud

**Paso 4.2:** Sistema obtiene detalles:
```php
GET /Office_Get_id/{id}
```

**Paso 4.3:** Sistema retorna JSON completo:
```json
{
  "id": 123,
  "codigo_reservacion": "ABC123XYZ",
  "solicitante": {
    "nombres": "Juan",
    "apellidos": "Pérez",
    "documento": "00112233445",
    "celular": "8091234567",
    "correo": "juan.perez@example.com"
  },
  "parque": {
    "nombre_parque": "Parque Central",
    "direccion": "Av. Principal #123"
  },
  "zona": {
    "nombre": "Gazebo Principal"
  },
  "evento": {
    "tipo": "Cumpleaños"
  },
  "fecha_evento": "2026-03-15",
  "hora_inicio": "10:00",
  "hora_fin": "14:00",
  "motivo_evento": "Cumpleaños infantil",
  "descripcion": "Celebración de cumpleaños #5",
  "responsables": "Juan Pérez, María García",
  "cantidad_participantes_adultos": 15,
  "cantidad_participantes_niños": 20,
  "estado": "espera",
  "agregado_en": "2026-02-10 15:30:00"
}
```

**Paso 4.4:** Sistema muestra modal/vista con información completa

---

#### FASE 5: Toma de Decisión

**Paso 5.1:** Usuario revisa todos los detalles

**Paso 5.2:** Usuario verifica:
- ✓ Disponibilidad de la zona
- ✓ Cumplimiento de requisitos
- ✓ Capacidad de la zona
- ✓ Información completa del solicitante

**Paso 5.3:** Usuario toma decisión:

**OPCIÓN A: APROBAR**
- Clic en botón "Aprobar" o "Confirmar"
- Sistema puede solicitar confirmación adicional
- Usuario confirma

**OPCIÓN B: RECHAZAR**
- Clic en botón "Rechazar"
- Sistema puede solicitar motivo (opcional)
- Usuario confirma

---

#### FASE 6: Actualización de Estado

**Paso 6.1:** Sistema envía:
```php
PATCH /Office_patch/{id}
```

**Request Body:**
```json
{
  "estado": "confirmada"  // o "rechazada"
}
```

**Paso 6.2:** Sistema actualiza base de datos:
```php
$reservacion = tbl_reservaciones::find($id);
$reservacion->estado = $request->estado;
$reservacion->modificado_en = now();
$reservacion->save();
```

**Paso 6.3:** Sistema registra en log (si existe):
```php
Log::info('Reservación actualizada', [
    'id' => $id,
    'estado_anterior' => $estado_previo,
    'estado_nuevo' => $request->estado,
    'usuario_id' => Session::get('usuario.id')
]);
```

---

#### FASE 7: Notificación al Solicitante

**Paso 7.1:** Sistema prepara email según decisión

**Si CONFIRMADA:**
```php
POST /enviar-correo_confirmacion
```
- Asunto: "Reservación Confirmada - Código: ABC123XYZ"
- Cuerpo: Plantilla `stripo_confirmacion.blade.php`
- Incluye:
  - Felicitación
  - Código QR actualizado
  - Detalles de reserva
  - Instrucciones para el día del evento
  - Contacto del parque

**Si RECHAZADA:**
```php
POST /enviar-correo_confirmacion
```
- Asunto: "Reservación No Aprobada - Código: ABC123XYZ"
- Cuerpo: Plantilla de rechazo
- Incluye:
  - Mensaje de disculpa
  - Motivo (si fue proporcionado)
  - Invitación a solicitar nuevamente
  - Contacto para consultas

**Paso 7.2:** Sistema envía email vía SMTP

**Paso 7.3:** Sistema verifica envío exitoso

---

#### FASE 8: Confirmación en Interfaz

**Paso 8.1:** Sistema muestra notificación de éxito:
```
"Estado actualizado correctamente"
"Se ha enviado notificación al solicitante"
```

**Paso 8.2:** Sistema cierra modal de detalles

**Paso 8.3:** Sistema refresca tabla de solicitudes

**Paso 8.4:** Solicitud procesada desaparece de la lista (ya no está en estado "espera" o "pendiente")

---

### Permisos por Rol

| Acción | Administrador | Operador |
|--------|---------------|----------|
| Ver todas las solicitudes | ✅ | |
| Ver solicitudes de su parque | ✅ | ✅ |
| Aprobar solicitudes | ✅ | ✅ |
| Rechazar solicitudes | ✅ | ✅ |
| Ver estadísticas globales | ✅ | |
| Ver estadísticas de su parque | ✅ | ✅ |
| Gestionar usuarios | ✅ | |
| Configurar parques | ✅ | |

---

### Casos Especiales

#### Caso A: Conflicto de Horario Descubierto Tarde
```
Si al aprobar se descubre conflicto:
    1. Sistema bloquea aprobación
    2. Muestra mensaje de error
    3. Sugiere contactar al solicitante
    4. Permite rechazar con motivo
```

#### Caso B: Operador Intenta Acceder a Otra Parque
```
Middleware valida:
if (id_parque_solicitado != Session::get('usuario.id_parque')) {
    return redirect('/inicio')->with('error', 'Acceso denegado');
}
```

#### Caso C: Solicitud Vencida
```
Si fecha_evento < hoy:
    - Estado automático a "vencida"
    - No se permite aprobar/rechazar
    - Solo visualización histórica
```

---

## 2.3 Flujo de Autenticación y Autorización

### Descripción General
Mecanismo de seguridad que controla el acceso al panel administrativo y discrimina funcionalidades por rol.

---

### Diagrama de Autenticación

```
┌────────────────────────────────────────────────────────────┐
│                   FLUJO DE AUTENTICACIÓN                   │
└────────────────────────┬───────────────────────────────────┘
                         │
                         ▼
          ┌──────────────────────────┐
          │ Usuario accede a ruta    │
          │ protegida (ej: /inicio)  │
          └──────────┬───────────────┘
                     │
                     ▼
          ┌──────────────────────────┐
          │ Middleware "token.auth"  │
          │ intercepta la petición   │
          └──────────┬───────────────┘
                     │
                     ▼
          ┌──────────────────────────┐
          │ Verifica si existe       │
          │ Session::get('usuario')  │
          └──────────┬───────────────┘
                     │
              ┌──────┴──────┐
              │             │
       ¿Existe? NO         SI
              │             │
              ▼             ▼
   ┌─────────────────┐  ┌────────────────────┐
   │ Redirige a      │  │ Valida token       │
   │ /login          │  │ de sesión          │
   │                 │  └────────┬───────────┘
   │ Mensaje:        │           │
   │ "Debe iniciar   │           │
   │ sesión"         │    ┌──────┴──────┐
   └─────────────────┘    │             │
                   ¿Token NO          SI
                    válido?│             │
                          ▼             ▼
                 ┌─────────────┐  ┌────────────────┐
                 │ Destruye    │  │ Permite acceso │
                 │ sesión      │  │ a la ruta      │
                 │             │  └────────┬───────┘
                 │ Redirige a  │           │
                 │ /login      │           ▼
                 └─────────────┘  ┌────────────────────┐
                                  │ Controlador verifica│
                                  │ id_user_type para   │
                                  │ permisos específicos│
                                  └────────┬───────────┘
                                           │
                                    ┌──────┴──────┐
                                    │             │
                            Administrador    Operador
                            (id=1)           (id=2)
                                    │             │
                                    ▼             ▼
                         ┌──────────────┐  ┌─────────────┐
                         │ Acceso total │  │ Acceso      │
                         │ al sistema   │  │ limitado    │
                         │              │  │ a su parque │
                         └──────────────┘  └─────────────┘
```

---

### Proceso de Login Detallado

#### Paso 1: Presentación de Formulario
```html
<!-- login.blade.php -->
<form method="POST" action="/Reservaciones_cuenta">
    @csrf
    <input type="text" name="usuario" placeholder="Usuario">
    <input type="password" name="password" placeholder="Contraseña">
    <button type="submit">Iniciar Sesión</button>
</form>
```

#### Paso 2: Validación de Credenciales
```php
// routes/web.php - POST /Reservaciones_cuenta
Route::post('/Reservaciones_cuenta', function (Request $request) {
    // Buscar usuario activo
    $usuario = tbl_usuario::where('usuario', $request->usuario)
                          ->where('estado', 1)
                          ->first();

    // Si no existe
    if (!$usuario) {
        return response()->json([
            'success' => false,
            'message' => 'Usuario no encontrado'
        ], 404);
    }

    // Verificar contraseña
    if (!Hash::check($request->password, $usuario->password)) {
        return response()->json([
            'success' => false,
            'message' => 'Contraseña incorrecta'
        ], 401);
    }

    // Credenciales válidas
    return response()->json([
        'success' => true,
        'data' => [
            'id' => $usuario->id,
            'nombre' => $usuario->nombre,
            'id_parque' => $usuario->id_parque,
            'id_user_type' => $usuario->id_user_type
        ]
    ]);
});
```

#### Paso 3: Generación de Token y Sesión
```php
// POST /reservaciones_sesion
Route::post('/reservaciones_sesion', function (Request $request) {
    // Generar token único
    $token = token_maker();

    // Guardar en sesión
    Session::put('usuario', [
        'id' => $request->id,
        'nombre' => $request->nombre,
        'apellido' => $request->apellido,
        'id_parque' => $request->id_parque,
        'id_user_type' => $request->id_user_type,
        'token' => $token,
        'login_time' => now()
    ]);

    return response()->json(['success' => true, 'token' => $token]);
});

// Función auxiliar
function token_maker() {
    return bin2hex(random_bytes(32));
}
```

---

### Middleware TokenAuthentication

```php
// app/Http/Middleware/TokenAuthentication.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Session;

class TokenAuthentication
{
    public function handle(Request $request, Closure $next)
    {
        // Verificar si existe sesión de usuario
        if (!Session::has('usuario')) {
            return redirect('/login')->with('error', 'Debe iniciar sesión');
        }

        // Obtener datos de sesión
        $usuario = Session::get('usuario');

        // Validar que tenga token
        if (!isset($usuario['token']) || empty($usuario['token'])) {
            Session::flush();
            return redirect('/login')->with('error', 'Sesión inválida');
        }

        // Validar tiempo de sesión (opcional - timeout)
        if (isset($usuario['login_time'])) {
            $login_time = $usuario['login_time'];
            $now = now();
            $diff_minutes = $login_time->diffInMinutes($now);

            // Si han pasado más de 120 minutos (2 horas)
            if ($diff_minutes > 120) {
                Session::flush();
                return redirect('/login')->with('error', 'Sesión expirada');
            }
        }

        // Todo OK, permitir acceso
        return $next($request);
    }
}
```

#### Registro en Kernel
```php
// app/Http/Kernel.php
protected $routeMiddleware = [
    // ...
    'token.auth' => \App\Http\Middleware\TokenAuthentication::class,
];
```

---

### Aplicación de Middleware en Rutas

```php
// routes/web.php

// Rutas protegidas con middleware
Route::middleware(['token.auth'])->group(function () {
    Route::get('/inicio', function () { /* ... */ });
    Route::get('/Dashboard', function () { /* ... */ });
    Route::get('/R_solicitudes', function () { /* ... */ });
    Route::get('/Office', function () { /* ... */ });
    Route::patch('/Office_patch/{id}', function () { /* ... */ });
});
```

---

### Discriminación por Rol

#### En Controlador/Ruta

```php
Route::get('/R_solicitudes', function () {
    $usuario = Session::get('usuario');

    // Administrador (id_user_type == 1)
    if ($usuario['id_user_type'] == 1) {
        // Ver todas las solicitudes
        $solicitudes = tbl_reservaciones::whereIn('estado', ['espera', 'pendiente'])
                                       ->get();
    }
    // Operador (id_user_type == 2)
    else if ($usuario['id_user_type'] == 2) {
        // Ver solo solicitudes de su parque
        $solicitudes = tbl_reservaciones::where('id_parque', $usuario['id_parque'])
                                       ->whereIn('estado', ['espera', 'pendiente'])
                                       ->get();
    }

    return view('oficina_fix.R_solicitudes', compact('solicitudes'));
})->middleware('token.auth');
```

#### En Vista Blade

```blade
{{-- Inicio.blade.php --}}
@if(Session::get('usuario.id_user_type') == 1)
    <div class="admin-panel">
        <h2>Panel de Administrador</h2>
        <a href="/usuarios">Gestionar Usuarios</a>
        <a href="/parques">Gestionar Parques</a>
        <a href="/R_solicitudes_all">Todas las Solicitudes</a>
    </div>
@else
    <div class="operador-panel">
        <h2>Panel de Operador</h2>
        <p>Parque: {{ Session::get('usuario.parque_nombre') }}</p>
        <a href="/R_solicitudes">Solicitudes de mi Parque</a>
    </div>
@endif
```

---

### Flujo de Logout

```php
// GET /return (logout)
Route::get('/return', function () {
    // Destruir sesión completa
    Session::flush();

    // Redirigir a login
    return redirect('/login')->with('message', 'Sesión cerrada correctamente');
});
```

---

## 2.4 Flujo de Notificaciones por Email

### Descripción General
Sistema automatizado de envío de correos electrónicos en diferentes etapas del proceso de reservación.

---

### Tipos de Emails

1. **Email de Confirmación de Recepción** (Estado: espera)
2. **Email de Aprobación** (Estado: confirmada)
3. **Email de Rechazo** (Estado: rechazada)

---

### Diagrama de Flujo de Email

```
┌────────────────────────────────────────────────────────────┐
│                SISTEMA DE NOTIFICACIONES                   │
└────────────────────┬───────────────────────────────────────┘
                     │
                     ▼
          ┌──────────────────────────┐
          │ Evento disparador:       │
          │ - Nueva reserva creada   │
          │ - Estado actualizado     │
          └──────────┬───────────────┘
                     │
              ┌──────┴──────┐
              │             │
       Nueva reserva    Estado
       (POST /2_post)   actualizado
              │         (PATCH /patch)
              │             │
              ▼             ▼
   ┌──────────────────┐  ┌──────────────────┐
   │ POST /enviar-    │  │ POST /enviar-    │
   │ correo           │  │ correo_          │
   │                  │  │ confirmacion     │
   └────────┬─────────┘  └────────┬─────────┘
            │                     │
            └──────────┬──────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │ Obtener datos:       │
            │ - Reservación        │
            │ - Solicitante        │
            │ - Parque             │
            │ - Zona               │
            └──────────┬───────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │ Generar/Obtener QR   │
            │ (qr-code-styling)    │
            └──────────┬───────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │ Seleccionar plantilla│
            │ según estado         │
            └──────────┬───────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
      espera      confirmada    rechazada
         │             │             │
         ▼             ▼             ▼
   ┌─────────┐  ┌──────────┐  ┌──────────┐
   │ stripo  │  │ stripo_  │  │ rechazo  │
   │ .blade  │  │ confir   │  │ .blade   │
   └────┬────┘  │ macion   │  └────┬─────┘
        │       │ .blade   │       │
        │       └────┬─────┘       │
        └────────────┼─────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │ Compilar plantilla   │
          │ con datos            │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │ Configurar SMTP:     │
          │ - Host: Office365    │
          │ - Puerto: 587        │
          │ - TLS habilitado     │
          │ - From: alerts@      │
          │   adn.gob.do         │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │ Enviar email         │
          │ Mail::send()         │
          └──────────┬───────────┘
                     │
              ┌──────┴──────┐
              │             │
          Éxito?  SI      NO
              │             │
              ▼             ▼
   ┌─────────────────┐  ┌──────────────┐
   │ Registrar log   │  │ Capturar     │
   │ de envío        │  │ excepción    │
   │                 │  │              │
   │ Return success  │  │ Log error    │
   └─────────────────┘  │              │
                        │ Reintentar   │
                        │ (max 3)      │
                        └──────────────┘
```

---

### Configuración SMTP

```php
// config/mail.php
return [
    'default' => env('MAIL_MAILER', 'smtp'),

    'mailers' => [
        'smtp' => [
            'transport' => 'smtp',
            'host' => env('MAIL_HOST', 'smtp.office365.com'),
            'port' => env('MAIL_PORT', 587),
            'encryption' => env('MAIL_ENCRYPTION', 'tls'),
            'username' => env('MAIL_USERNAME'),
            'password' => env('MAIL_PASSWORD'),
            'timeout' => null,
        ],
    ],

    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'alerts@adn.gob.do'),
        'name' => env('MAIL_FROM_NAME', 'ADN Reserva tu Parque'),
    ],
];
```

```env
# .env
MAIL_MAILER=smtp
MAIL_HOST=smtp.office365.com
MAIL_PORT=587
MAIL_USERNAME=alerts@adn.gob.do
MAIL_PASSWORD=[REDACTED]
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=alerts@adn.gob.do
MAIL_FROM_NAME="ADN Reserva tu Parque"
```

---

### Email 1: Confirmación de Recepción

**Disparador:** Creación de nueva reserva
**Plantilla:** `stripo.blade.php`
**Destinatario:** Solicitante

**Contenido:**
```
Asunto: Solicitud de Reserva Recibida - Código: [CODIGO]

Estimado/a [NOMBRE SOLICITANTE],

Hemos recibido su solicitud de reserva con los siguientes detalles:

📍 Parque: [NOMBRE PARQUE]
🏕️ Zona: [NOMBRE ZONA]
📅 Fecha: [FECHA EVENTO]
⏰ Horario: [HORA INICIO] - [HORA FIN]
🎉 Evento: [TIPO EVENTO]

Código de Reservación: [CODIGO RESERVACION]

[CÓDIGO QR]

Su solicitud está siendo revisada por nuestro equipo.
Recibirá una notificación cuando sea procesada.

Para consultar el estado de su reserva:
[ENLACE DE CONSULTA]

Atentamente,
Equipo ADN Reserva tu Parque
```

---

### Email 2: Aprobación de Reserva

**Disparador:** Actualización de estado a "confirmada"
**Plantilla:** `stripo_confirmacion.blade.php`
**Destinatario:** Solicitante

**Contenido:**
```
Asunto: ✅ Reserva CONFIRMADA - Código: [CODIGO]

¡Excelente noticia, [NOMBRE]!

Su reserva ha sido APROBADA:

📍 Parque: [NOMBRE PARQUE]
   [DIRECCION PARQUE]
   📞 [TELEFONO PARQUE]

🏕️ Zona: [NOMBRE ZONA]
📅 Fecha: [FECHA EVENTO]
⏰ Horario: [HORA INICIO] - [HORA FIN]

Código de Reservación: [CODIGO]

[CÓDIGO QR ACTUALIZADO]

INSTRUCCIONES PARA EL DÍA DEL EVENTO:
1. Llegue 15 minutos antes de su hora programada
2. Presente este código QR en la entrada
3. Identifíquese con el documento [TIPO DOC] [NUMERO]
4. Siga las indicaciones del personal

IMPORTANTE:
- Capacidad autorizada: [ADULTOS] adultos, [NIÑOS] niños
- Responsables: [RESPONSABLES]
- Cumplir con los términos y condiciones aceptados

¿Necesita modificar su reserva?
Contacte al parque al [TELEFONO] o responda este correo.

¡Nos vemos en [NOMBRE PARQUE]!

Equipo ADN Reserva tu Parque
```

---

### Email 3: Rechazo de Solicitud

**Disparador:** Actualización de estado a "rechazada"
**Plantilla:** `rechazo.blade.php` (o variación de stripo)
**Destinatario:** Solicitante

**Contenido:**
```
Asunto: Información sobre su Solicitud - Código: [CODIGO]

Estimado/a [NOMBRE],

Lamentamos informarle que su solicitud de reserva no pudo ser aprobada.

Código de Reservación: [CODIGO]

📍 Parque: [NOMBRE PARQUE]
📅 Fecha solicitada: [FECHA EVENTO]
⏰ Horario solicitado: [HORA INICIO] - [HORA FIN]

Motivo: [MOTIVO SI EXISTE]

ALTERNATIVAS:
- Solicite otra fecha/horario disponible
- Contacte directamente al parque: [TELEFONO]
- Consulte disponibilidad en nuestra plataforma

Puede realizar una nueva solicitud en cualquier momento:
[ENLACE A /reservaciones]

Para consultas: [EMAIL PARQUE] | [TELEFONO PARQUE]

Agradecemos su comprensión.

Atentamente,
Equipo ADN Reserva tu Parque
```

---

### Implementación del Envío

```php
// POST /enviar-correo
Route::post('/enviar-correo', function (Request $request) {
    try {
        // Obtener datos de reservación
        $reservacion = tbl_reservaciones::with(['solicitante', 'parque', 'zona', 'evento'])
                                        ->find($request->id_reservacion);

        if (!$reservacion) {
            return response()->json(['error' => 'Reservación no encontrada'], 404);
        }

        // Datos para la plantilla
        $data = [
            'codigo' => $reservacion->codigo_reservacion,
            'nombre' => $reservacion->solicitante->nombres,
            'apellido' => $reservacion->solicitante->apellidos,
            'parque' => $reservacion->parque->nombre_parque,
            'zona' => $reservacion->zona->nombre,
            'evento' => $reservacion->evento->tipo,
            'fecha' => $reservacion->fecha_evento,
            'hora_inicio' => $reservacion->hora_inicio,
            'hora_fin' => $reservacion->hora_fin,
            'adultos' => $reservacion->cantidad_participantes_adultos,
            'ninos' => $reservacion->cantidad_participantes_niños,
            'qr_image' => $request->qr_base64, // QR en base64
            'enlace_consulta' => url('/solicitud_estado_json?codigo=' . $reservacion->codigo_reservacion)
        ];

        // Seleccionar plantilla según estado
        $plantilla = match($reservacion->estado) {
            'espera' => 'emails.stripo',
            'confirmada' => 'emails.stripo_confirmacion',
            'rechazada' => 'emails.rechazo',
            default => 'emails.stripo'
        };

        // Enviar email
        Mail::send($plantilla, $data, function($message) use ($reservacion) {
            $message->to($reservacion->solicitante->correo)
                    ->subject('Reserva ' . ucfirst($reservacion->estado) . ' - ' . $reservacion->codigo_reservacion);
        });

        // Log de envío exitoso
        Log::info('Email enviado', [
            'reservacion_id' => $reservacion->id,
            'email' => $reservacion->solicitante->correo,
            'estado' => $reservacion->estado
        ]);

        return response()->json(['success' => true, 'message' => 'Email enviado']);

    } catch (\Exception $e) {
        // Log de error
        Log::error('Error enviando email', [
            'error' => $e->getMessage(),
            'reservacion_id' => $request->id_reservacion
        ]);

        return response()->json(['error' => 'Error al enviar email'], 500);
    }
});
```

---

### Plantilla Blade (Ejemplo)

```blade
{{-- resources/views/emails/stripo_confirmacion.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; }
        .header { background: #4CAF50; color: white; padding: 20px; }
        .content { padding: 20px; }
        .qr-code { text-align: center; margin: 20px 0; }
        .details { background: #f5f5f5; padding: 15px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>✅ Reserva Confirmada</h1>
    </div>

    <div class="content">
        <p>¡Excelente noticia, {{ $nombre }} {{ $apellido }}!</p>

        <p>Su reserva ha sido <strong>APROBADA</strong>:</p>

        <div class="details">
            <p><strong>📍 Parque:</strong> {{ $parque }}</p>
            <p><strong>🏕️ Zona:</strong> {{ $zona }}</p>
            <p><strong>📅 Fecha:</strong> {{ $fecha }}</p>
            <p><strong>⏰ Horario:</strong> {{ $hora_inicio }} - {{ $hora_fin }}</p>
            <p><strong>🎉 Evento:</strong> {{ $evento }}</p>
        </div>

        <div class="qr-code">
            <p><strong>Código de Reservación:</strong> {{ $codigo }}</p>
            <img src="{{ $qr_image }}" alt="Código QR" style="max-width: 300px;">
            <p><small>Presente este código QR el día del evento</small></p>
        </div>

        <div class="instructions">
            <h3>INSTRUCCIONES:</h3>
            <ol>
                <li>Llegue 15 minutos antes</li>
                <li>Presente el código QR en la entrada</li>
                <li>Identifíquese con su documento</li>
                <li>Disfrute de su evento</li>
            </ol>
        </div>

        <p style="margin-top: 30px;">
            <a href="{{ $enlace_consulta }}" style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Consultar Estado de Reserva
            </a>
        </p>
    </div>

    <div style="background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px;">
        <p>ADN Reserva tu Parque | alerts@adn.gob.do</p>
    </div>
</body>
</html>
```

---

## 2.5 Flujo de Consulta de Estado

### Descripción General
Permite a solicitantes verificar el estado de su reserva sin necesidad de autenticación.

---

### Diagrama de Flujo

```
┌────────────────────────────────────────────┐
│      CONSULTA DE ESTADO DE RESERVA         │
└──────────────────┬─────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
    Vía Email          Vía Formulario
    (enlace)           (búsqueda manual)
         │                   │
         ▼                   ▼
┌──────────────────┐  ┌──────────────────┐
│ Clic en enlace   │  │ Accede a página  │
│ del email        │  │ de consulta      │
│                  │  │                  │
│ /actualizacion?  │  │ /solicitud_estado│
│ codigo=ABC123    │  │ _json            │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         │                     ▼
         │          ┌──────────────────────┐
         │          │ Usuario ingresa:     │
         │          │ - Código reservación │
         │          │   O                  │
         │          │ - Email              │
         │          └──────────┬───────────┘
         │                     │
         │                     ▼
         │          ┌──────────────────────┐
         │          │ POST /solicitud_     │
         │          │ estado_json          │
         │          └──────────┬───────────┘
         │                     │
         └──────────┬──────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Sistema busca:       │
         │ WHERE codigo = ?     │
         │ OR email = ?         │
         └──────────┬───────────┘
                    │
            ┌───────┴───────┐
            │               │
      ¿Encontró? NO        SI
            │               │
            ▼               ▼
   ┌─────────────────┐  ┌──────────────────┐
   │ Muestra mensaje │  │ Obtiene datos    │
   │ "Reservación no │  │ completos con    │
   │ encontrada"     │  │ relaciones       │
   └─────────────────┘  └────────┬─────────┘
                                 │
                                 ▼
                      ┌──────────────────────┐
                      │ Retorna JSON con:    │
                      │ - Código             │
                      │ - Estado actual      │
                      │ - Datos del parque   │
                      │ - Datos de la zona   │
                      │ - Fecha y hora       │
                      │ - Fecha de solicitud │
                      │ - Fecha modificación │
                      └────────┬─────────────┘
                               │
                               ▼
                      ┌──────────────────────┐
                      │ Frontend muestra:    │
                      │                      │
                      │ Estado con color:    │
                      │ - Espera (amarillo)  │
                      │ - Confirmada (verde) │
                      │ - Rechazada (rojo)   │
                      │ - Vencida (gris)     │
                      │                      │
                      │ + Detalles completos │
                      └──────────────────────┘
```

---

### Implementación

```php
// POST /solicitud_estado_json
Route::post('/solicitud_estado_json', function (Request $request) {
    $reservacion = null;

    // Buscar por código de reservación
    if ($request->has('codigo') && !empty($request->codigo)) {
        $reservacion = tbl_reservaciones::where('codigo_reservacion', $request->codigo)
                                        ->with(['solicitante', 'parque', 'zona', 'evento'])
                                        ->first();
    }
    // Buscar por email
    else if ($request->has('email') && !empty($request->email)) {
        $reservacion = tbl_reservaciones::whereHas('solicitante', function($query) use ($request) {
                                            $query->where('correo', $request->email);
                                        })
                                        ->with(['solicitante', 'parque', 'zona', 'evento'])
                                        ->latest('agregado_en')
                                        ->first();
    }

    if (!$reservacion) {
        return response()->json([
            'success' => false,
            'message' => 'Reservación no encontrada'
        ], 404);
    }

    return response()->json([
        'success' => true,
        'data' => [
            'codigo_reservacion' => $reservacion->codigo_reservacion,
            'estado' => $reservacion->estado,
            'estado_label' => ucfirst($reservacion->estado),
            'solicitante' => [
                'nombre_completo' => $reservacion->solicitante->nombres . ' ' . $reservacion->solicitante->apellidos,
                'email' => $reservacion->solicitante->correo
            ],
            'parque' => [
                'nombre' => $reservacion->parque->nombre_parque,
                'direccion' => $reservacion->parque->direccion
            ],
            'zona' => $reservacion->zona->nombre,
            'evento' => $reservacion->evento->tipo,
            'fecha_evento' => $reservacion->fecha_evento,
            'hora_inicio' => $reservacion->hora_inicio,
            'hora_fin' => $reservacion->hora_fin,
            'participantes' => [
                'adultos' => $reservacion->cantidad_participantes_adultos,
                'ninos' => $reservacion->cantidad_participantes_niños
            ],
            'fechas' => [
                'solicitud' => $reservacion->agregado_en->format('d/m/Y H:i'),
                'modificacion' => $reservacion->modificado_en->format('d/m/Y H:i')
            ]
        ]
    ]);
});
```

---

## 2.6 Flujos de Validación y Error

### Validaciones Implementadas

#### 1. Validación de Disponibilidad de Zona

```php
// Antes de crear reserva
$conflicto = tbl_reservaciones::where('id_parque', $request->parque)
                              ->where('id_zona', $request->zona)
                              ->where('fecha_evento', $request->fecha)
                              ->whereIn('estado', ['espera', 'pendiente', 'confirmada'])
                              ->where(function($query) use ($request) {
                                  $query->whereBetween('hora_inicio', [$request->hora_inicio, $request->hora_fin])
                                        ->orWhereBetween('hora_fin', [$request->hora_inicio, $request->hora_fin])
                                        ->orWhere(function($q) use ($request) {
                                            $q->where('hora_inicio', '<=', $request->hora_inicio)
                                              ->where('hora_fin', '>=', $request->hora_fin);
                                        });
                              })
                              ->exists();

if ($conflicto) {
    return response()->json([
        'error' => 'La zona no está disponible en el horario seleccionado'
    ], 409);
}
```

#### 2. Validación de Horarios del Parque

```php
// Verificar que hora solicitada esté dentro de horario de operación
$horario_parque = tbl_horarios_parques::where('id_parque', $request->parque)->first();

if ($horario_parque) {
    if ($request->hora_inicio < $horario_parque->hora_apertura ||
        $request->hora_fin > $horario_parque->hora_cierre) {
        return response()->json([
            'error' => 'El horario solicitado está fuera del horario de operación del parque'
        ], 400);
    }
}
```

#### 3. Validación de Fecha en el Pasado

```javascript
// Frontend
const fechaSeleccionada = new Date(document.getElementById('fecha').value);
const hoy = new Date();
hoy.setHours(0,0,0,0);

if (fechaSeleccionada < hoy) {
    alert('No puede seleccionar una fecha en el pasado');
    return false;
}
```

#### 4. Validación de Términos Aceptados

```javascript
// Frontend
if (!document.getElementById('acepto_terminos').checked) {
    alert('Debe aceptar los términos y condiciones');
    return false;
}
```

---

### Manejo de Errores Comunes

| Error | Código | Mensaje | Acción Sugerida |
|-------|--------|---------|-----------------|
| Zona no disponible | 409 | "La zona ya está reservada en ese horario" | Sugerir horarios alternativos |
| Fuera de horario | 400 | "Horario fuera de operación del parque" | Mostrar horario del parque |
| Fecha pasada | 400 | "No puede reservar fechas pasadas" | Requerir fecha futura |
| Sesión expirada | 401 | "Su sesión ha expirado" | Redirigir a login |
| Permisos insuficientes | 403 | "No tiene permisos para esta acción" | Mostrar mensaje |
| Reserva no encontrada | 404 | "Reservación no encontrada" | Verificar código |
| Error de email | 500 | "Error al enviar notificación" | Reintentar, contactar soporte |

---

## 2.7 Diagrama de Estados de Reservación

### Estados Posibles

```
                    ┌──────────────────────────┐
                    │   NUEVA RESERVA CREADA   │
                    └───────────┬──────────────┘
                                │
                                ▼
                    ┌──────────────────────────┐
                    │      Estado: ESPERA      │
                    │                          │
                    │ - Solicitud recibida     │
                    │ - Email de confirmación  │
                    │   enviado                │
                    │ - Pendiente de revisión  │
                    └───────────┬──────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
              Administrador             Tiempo
              revisa                    transcurre
                    │                       │
         ┌──────────┴──────────┐           ▼
         │                     │    ┌──────────────┐
    APROBAR                RECHAZAR │   VENCIDA    │
         │                     │    │              │
         ▼                     ▼    │ Fecha pasó   │
┌──────────────┐      ┌──────────────┐ sin procesar│
│ CONFIRMADA   │      │  RECHAZADA   │└──────────────┘
│              │      │              │
│ - Aprobada   │      │ - No aprobada│
│ - Email QR   │      │ - Email      │
│   enviado    │      │   notif.     │
└──────┬───────┘      └──────────────┘
       │
       │ Día del evento
       │ (usuario asiste)
       ▼
┌──────────────┐
│  REALIZADA   │
│              │
│ - Evento     │
│   completado │
└──────────────┘
```

---

### Matriz de Transiciones

| Estado Actual | Puede cambiar a | Quién puede | Condición |
|---------------|-----------------|-------------|-----------|
| **espera** | confirmada | Admin/Operador | Aprobación manual |
| **espera** | rechazada | Admin/Operador | Rechazo manual |
| **espera** | vencida | Sistema (cron) | fecha_evento < hoy |
| **pendiente** | confirmada | Admin/Operador | Aprobación manual |
| **pendiente** | rechazada | Admin/Operador | Rechazo manual |
| **confirmada** | realizada | Admin/Operador | Después del evento |
| **confirmada** | vencida | Sistema (cron) | No se realizó |
| **rechazada** | - | - | Estado final |
| **vencida** | - | - | Estado final |
| **realizada** | - | - | Estado final |

---

## 2.8 Matriz de Permisos por Rol

### Tabla de Permisos

| Funcionalidad | Público | Operador | Administrador |
|---------------|---------|----------|---------------|
| **Ver formulario de reserva** | ✅ | ✅ | ✅ |
| **Crear reserva** | ✅ | ✅ | ✅ |
| **Consultar estado (sin auth)** | ✅ | ✅ | ✅ |
| **Iniciar sesión** | | ✅ | ✅ |
| **Ver dashboard** | | ✅ (solo su parque) | ✅ (global) |
| **Ver solicitudes pendientes** | | ✅ (solo su parque) | ✅ (todas) |
| **Aprobar reserva** | | ✅ (solo su parque) | ✅ (todas) |
| **Rechazar reserva** | | ✅ (solo su parque) | ✅ (todas) |
| **Ver estadísticas globales** | | | ✅ |
| **Gestionar usuarios** | | | ✅ |
| **Configurar parques** | | | ✅ |
| **Configurar zonas** | | | ✅ |
| **Ver historial completo** | | ✅ (solo su parque) | ✅ (global) |

---

## Resumen de Flujos

Este documento ha detallado los **8 flujos principales** del sistema ADN Reserva tu Parque:

1. ✅ **Flujo de Reservación Ciudadana** - Proceso completo de solicitud pública
2. ✅ **Flujo de Gestión Administrativa** - Aprobación/rechazo de solicitudes
3. ✅ **Flujo de Autenticación y Autorización** - Seguridad y permisos
4. ✅ **Flujo de Notificaciones por Email** - Sistema automatizado de correos
5. ✅ **Flujo de Consulta de Estado** - Verificación sin autenticación
6. ✅ **Flujos de Validación y Error** - Manejo de casos especiales
7. ✅ **Diagrama de Estados de Reservación** - Ciclo de vida de una reserva
8. ✅ **Matriz de Permisos por Rol** - Control de acceso

Todos estos flujos trabajan en conjunto para proporcionar una experiencia completa de reservación de parques públicos, desde la solicitud inicial hasta la realización del evento.

---

**Fecha de elaboración:** 2026-02-11
**Versión:** 1.0
**Elaborado por:** Claude Sonnet 4.5
