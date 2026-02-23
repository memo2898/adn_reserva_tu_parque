# 1. DESCRIPCIÓN DEL PROYECTO

## Información General

**Nombre del Proyecto:** ADN Reserva tu Parque
**Versión Laravel:** 10.0
**Versión PHP:** ^8.1
**Base de Datos:** MySQL (adn_reservaciones_parques)
**Repositorio:** Git
**Estado:** En desarrollo / Pre-producción

---

## 1.1 Propósito y Alcance

### Objetivo Principal

Sistema web de gestión y reservación de espacios en parques públicos institucionales, permitiendo a ciudadanos solicitar el uso de zonas específicas para eventos y actividades, mientras facilita a los administradores la gestión centralizada de todas las solicitudes.

### Alcance del Sistema

**Usuarios objetivo:**
- **Ciudadanos/Solicitantes:** Personas que desean reservar espacios en parques públicos
- **Operadores de Parque:** Personal encargado de gestionar reservas de un parque específico
- **Administradores:** Personal con acceso total al sistema para supervisión y gestión global

**Funcionalidades principales:**
1. Sistema de reservaciones públicas en línea
2. Gestión administrativa de solicitudes
3. Notificaciones automáticas por correo electrónico
4. Generación de códigos QR para confirmación de reservas
5. Panel de control con estadísticas
6. Gestión de múltiples parques y zonas
7. Sistema de roles y permisos

---

## 1.2 Contexto del Proyecto

### Problema que Resuelve

**Antes del sistema:**
- Proceso manual y presencial para reservar espacios en parques
- Falta de transparencia en el proceso de aprobación
- Imposibilidad de verificar disponibilidad en tiempo real
- Documentación en papel difícil de gestionar
- Sin trazabilidad de solicitudes

**Con el sistema:**
- Proceso 100% digital y accesible 24/7
- Transparencia total: el solicitante puede consultar el estado de su reserva
- Validación automática de disponibilidad
- Base de datos centralizada
- Trazabilidad completa con fechas de creación y modificación
- Notificaciones automáticas
- Códigos QR para validación en sitio

---

## 1.3 Stack Tecnológico

### Backend
- **Framework:** Laravel 10.0
- **Lenguaje:** PHP 8.1+
- **Base de Datos:** MySQL
- **ORM:** Eloquent
- **Autenticación API:** Laravel Sanctum 3.2
- **HTTP Client:** GuzzleHTTP 7.2 (integraciones externas)
- **Mail:** SMTP vía Office 365

### Frontend
- **Templating:** Blade (Laravel)
- **Build Tool:** Vite 4.0
- **HTTP Client:** Axios 1.1.2
- **Generación QR:** qr-code-styling 1.6.0-rc.1

### Desarrollo y Testing
- **Testing:** PHPUnit 10.1
- **Mocking:** Mockery 1.4.4
- **Code Style:** Laravel Pint 1.0
- **Error Handling:** Spatie Ignition 2.0
- **Fake Data:** FakerPHP 1.9.1

### Infraestructura
- **Containerización:** Docker
- **Servidores soportados:** Apache, Nginx, XAMPP
- **Despliegue:** Compatible con cPanel, Docker Compose

---

## 1.4 Arquitectura del Sistema

### Patrón de Diseño
- **MVC (Model-View-Controller):** Parcialmente implementado
  - **Models:** Eloquent ORM con 15 modelos principales
  - **Views:** Blade templates
  - **Controllers:** Lógica actualmente en closures de rutas (web.php)

### Estructura de Directorios

```
adn_reserva_tu_parque/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # Controlador base (lógica en routes/web.php)
│   │   └── Middleware/      # TokenAuthentication personalizado
│   ├── Models/              # 15 modelos Eloquent
│   └── Mail/                # Clases de envío de correos
├── config/                  # Configuraciones (app, database, mail, etc.)
├── database/
│   ├── migrations/          # 5 migraciones principales
│   ├── seeders/             # Seeders para datos iniciales
│   └── rebuild/             # Scripts SQL para recrear estructura
├── resources/
│   ├── views/               # Plantillas Blade (login, reservaciones, panel admin)
│   └── lang/                # Archivos de idioma
├── routes/
│   └── web.php              # 1300+ líneas con todas las rutas y lógica
├── public/                  # Assets públicos (CSS, JS, imágenes)
├── storage/                 # Logs, cache, archivos generados
└── tests/                   # Tests unitarios y de integración
```

---

## 1.5 Modelos de Datos Principales

### Entidades Core

#### 1. **tbl_reservaciones** (Reservaciones)
Tabla central del sistema que almacena todas las solicitudes de reserva.

**Campos principales:**
- `id_solicitante` - Relación con solicitante
- `id_parque` - Parque seleccionado
- `id_zona` - Zona específica del parque
- `id_evento` - Tipo de evento
- `fecha_evento`, `hora_inicio`, `hora_fin` - Temporalidad
- `motivo_evento`, `descripcion` - Detalles del evento
- `responsables` - Personas responsables
- `cantidad_participantes_adultos`, `cantidad_participantes_niños` - Capacidad
- `codigo_reservacion` - Código único para QR
- `estado` - espera | pendiente | confirmada | rechazada | vencida | realizada

#### 2. **tbl_solicitantes** (Solicitantes)
Usuarios que realizan solicitudes de reserva (no autenticados).

**Campos:**
- `nombres`, `apellidos`
- `id_tipo_doc`, `documento` - Identificación
- `celular`, `correo` - Contacto

#### 3. **tbl_usuario** (Usuarios Administrativos)
Personal del sistema (operadores y administradores).

**Campos:**
- `nombre`, `apellido`, `usuario`, `password`
- `tipo_documento`, `documento`
- `correo`, `telefono`
- `id_parque` - Parque asignado (NULL para administradores)
- `id_user_type` - Rol/permiso
- `estado` - activo | inactivo

#### 4. **tbl_parques** (Parques)
Información de parques disponibles para reserva.

**Campos:**
- `nombre_parque`, `descripcion`
- `correo` - Email de contacto
- `provincia`, `municipio`, `sector`, `circunscripcion` - Ubicación
- `coordenadas_maps` - Geolocalización
- `direccion`
- `espera` - Modo cola de espera (boolean)
- `estado` - activo | inactivo

#### 5. **tbl_zona_parques** (Zonas)
Áreas específicas dentro de cada parque.

**Campos:**
- `nombre` - Nombre de la zona
- `direccion` - Ubicación específica
- `coordenadas_maps`
- `id_parque` - Relación con parque

### Entidades de Soporte

- **tbl_tipos_eventos** - Catálogo de eventos permitidos
- **tbl_horarios_parques** - Horarios de apertura/cierre por parque
- **tbl_horarios_zonas** - Horarios específicos por zona y día
- **tbl_imagenes_por_parque** - Galería de imágenes de parques
- **tbl_imagenes_por_zona** - Galería de imágenes de zonas
- **tbl_telefonos_por_parque** - Múltiples teléfonos de contacto
- **tbl_tipo_documento** - Catálogo de tipos de identificación
- **tbl_permisos_usuarios** - Roles y permisos del sistema
- **tbl_terminos_condiciones_generales** - T&C por parque

---

## 1.6 Funcionalidades Implementadas

### Módulo Público (Sin Autenticación)

#### 1. **Sistema de Reservaciones**
- **Ruta:** `/reservaciones`
- **Funcionalidad:**
  - Formulario de solicitud de reserva
  - Selección de parque → zona → tipo de evento
  - Validación de disponibilidad en tiempo real
  - Carga de imágenes de parques y zonas
  - Visualización de horarios disponibles
  - Registro de datos del solicitante
  - Generación de código de reservación único

#### 2. **Consulta de Estado de Reserva**
- **Rutas:** `/solicitud_estado_json`, `/Reservaciones_email/{email}`
- **Funcionalidad:**
  - Búsqueda por código de reservación o email
  - Visualización del estado actual
  - Información completa de la reserva

#### 3. **Confirmación de Reserva**
- **Ruta:** `/actualizacion`
- **Funcionalidad:**
  - Enlace de confirmación enviado por email
  - Actualización automática de estado

### Módulo Administrativo (Requiere Autenticación)

#### 4. **Sistema de Autenticación**
- **Rutas:** `/login`, `/Reservaciones_cuenta`, `/return`
- **Funcionalidad:**
  - Login con usuario y contraseña
  - Validación de credenciales
  - Generación de token de sesión
  - Control de permisos por rol
  - Logout con limpieza de sesión

#### 5. **Dashboard**
- **Rutas:** `/inicio`, `/Dashboard`
- **Funcionalidad:**
  - Estadísticas mensuales de reservaciones
  - Vista discriminada por rol:
    - **Administrador:** Todas las reservas del sistema
    - **Operador:** Solo reservas de su parque asignado
  - Gráficos y métricas de uso

#### 6. **Gestión de Solicitudes**
- **Rutas:** `/R_solicitudes`, `/R_solicitudes_all`, `/Office`
- **Funcionalidad:**
  - Lista de solicitudes pendientes
  - Filtrado por parque (operadores)
  - Vista completa (administradores)
  - Detalles de cada reserva
  - Aprobación/rechazo de solicitudes
  - Actualización de estado (`PATCH /Office_patch/{id}`)

### Módulo de Notificaciones

#### 7. **Sistema de Correos Electrónicos**
- **Rutas:** `/enviar-correo`, `/enviar-correo_confirmacion`
- **Funcionalidad:**
  - Correo de confirmación de solicitud
  - Correo de aprobación/rechazo
  - Plantillas HTML profesionales
  - Código QR incrustado en email
  - Enlace de confirmación
  - Envío vía SMTP Office 365 (alerts@adn.gob.do)

#### 8. **Generación de Códigos QR**
- **Librería:** qr-code-styling
- **Funcionalidad:**
  - QR único por reservación
  - Contiene código de reservación
  - Incrustado en correos de confirmación
  - Utilizable para validación en sitio

### API y Servicios

#### 9. **Endpoints de Consulta**
- `/Reservaciones_solicitantes/{id_tipo_doc}/{documento}` - Buscar solicitante
- `/Reservaciones_dia/{fecha}/{parque}` - Reservas del día
- `/Reservaciones_doc_where/{fecha}/{id_solicitante}` - Reservas por solicitante
- `/Reservaciones_imagenes_zonas/{id_zona}` - Imágenes de zona
- `/Reservaciones_parque_horarios/{id_parque}` - Horarios de parque
- `/reservaciones_eventos/{id}` - Eventos activos por parque
- `/api/user` - Usuario autenticado (Sanctum)

#### 10. **Integración con Servicios Externos**
- **GuzzleHTTP:** Cliente HTTP para llamadas a APIs externas
- Validación de documentos de identidad
- Posible integración con servicios gubernamentales

---

## 1.7 Flujo de Negocio Principal

### Proceso de Reservación (Happy Path)

```
1. SOLICITUD
   ├─ Ciudadano accede a /reservaciones
   ├─ Selecciona: Parque → Zona → Tipo de Evento
   ├─ Elige: Fecha y horario
   ├─ Completa: Datos personales (nombre, documento, contacto)
   ├─ Describe: Motivo del evento, responsables, participantes
   └─ Envía formulario

2. VALIDACIÓN AUTOMÁTICA
   ├─ Sistema valida disponibilidad de fecha/zona
   ├─ Verifica horarios permitidos
   ├─ Genera código único de reservación
   └─ Registra en BD con estado "espera"

3. NOTIFICACIÓN INICIAL
   ├─ Sistema envía email de confirmación de recepción
   ├─ Incluye código QR con código de reservación
   └─ Proporciona enlace para consultar estado

4. REVISIÓN ADMINISTRATIVA
   ├─ Operador/Admin accede a /R_solicitudes
   ├─ Revisa detalles de la solicitud
   ├─ Valida cumplimiento de requisitos
   └─ Toma decisión: Aprobar o Rechazar

5. ACTUALIZACIÓN DE ESTADO
   ├─ Admin actualiza estado via PATCH /Office_patch/{id}
   ├─ Estado cambia a: "confirmada" o "rechazada"
   └─ Sistema registra fecha de modificación

6. NOTIFICACIÓN FINAL
   ├─ Sistema envía email con decisión
   ├─ Si aprobada: Incluye QR actualizado + instrucciones
   └─ Si rechazada: Incluye motivo (si aplica)

7. DÍA DEL EVENTO
   ├─ Solicitante presenta QR en parque
   ├─ Personal valida código de reservación
   ├─ Estado cambia a "realizada"
   └─ Registro completo en historial
```

---

## 1.8 Características Técnicas Destacables

### Seguridad
- ✅ Hashing de contraseñas en base de datos
- ✅ Protección CSRF (Cross-Site Request Forgery)
- ✅ Autenticación basada en sesiones (custom middleware)
- ✅ Laravel Sanctum para API tokens
- ✅ SSL/TLS para envío de correos
- ⚠️ Validación de entrada de usuario (parcial)

### Performance
- ✅ Vite para bundling optimizado de assets
- ✅ Eloquent ORM con eager loading (disponible)
- ✅ Sistema de caché de Laravel (configurado)
- ✅ Timestamps automáticos en todos los modelos

### Mantenibilidad
- ✅ Migraciones de base de datos versionadas
- ✅ Seeders para datos iniciales
- ✅ Scripts SQL de rebuild en `/database/rebuild/`
- ✅ Configuración por entorno (.env)
- ⚠️ Lógica de negocio en rutas (debería estar en controladores)

### Escalabilidad
- ✅ Arquitectura containerizada (Docker)
- ✅ Compatible con múltiples servidores web
- ✅ Base de datos relacional normalizada
- ⚠️ Sin sistema de jobs/queues implementado (correos sincrónicos)

---

## 1.9 Configuración de Entornos

### Variables de Entorno Clave (.env)

```env
# Aplicación
APP_NAME=Laravel
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

# Base de Datos
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=adn_reservaciones_parques
DB_USERNAME=root
DB_PASSWORD=

# Email (Office 365)
MAIL_MAILER=smtp
MAIL_HOST=smtp.office365.com
MAIL_PORT=587
MAIL_USERNAME=alerts@adn.gob.do
MAIL_PASSWORD=[REDACTED]
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=alerts@adn.gob.do
MAIL_FROM_NAME="${APP_NAME}"
```

### Middleware Personalizado

**TokenAuthentication** (`app/Http/Middleware/TokenAuthentication.php`)
- Alias: `token.auth`
- Valida existencia de sesión de usuario
- Protege rutas administrativas
- Redirecciona a `/login` si no autenticado

### Rutas Protegidas
Todas las rutas administrativas requieren middleware `token.auth`:
- `/inicio`, `/Dashboard`
- `/R_solicitudes`, `/R_solicitudes_all`
- `/Office`, `/Office_js`, `/Office_Get_id/{id}`
- `/Office_patch/{id}`

---

## 1.10 Patrones y Prácticas Implementadas

### ✅ Buenas Prácticas Observadas

1. **Timestamps Automáticos**
   - Todos los modelos usan `agregado_en` y `modificado_en`
   - Método `boot()` sobrescrito para asignación automática

2. **Conexión de Base de Datos Centralizada**
   - Todos los modelos apuntan a `ADN_reservaciones`
   - Facilita multi-tenancy si fuera necesario

3. **Validación de Disponibilidad**
   - Consultas de reservas existentes antes de permitir nueva reserva
   - Prevención de doble-booking

4. **Códigos Únicos de Reservación**
   - Generación de códigos alfanuméricos únicos
   - Facilita búsqueda y validación

5. **Notificaciones Automáticas**
   - Confirmación inmediata de recepción de solicitud
   - Notificación de decisión administrativa

### ⚠️ Áreas de Mejora Técnica

1. **Arquitectura de Rutas**
   - **Problema:** Toda la lógica de negocio en `routes/web.php` (1300+ líneas)
   - **Impacto:** Dificulta mantenimiento, testing y escalabilidad
   - **Recomendación:** Migrar lógica a Controllers

2. **Seguridad de Credenciales**
   - **Problema:** Credenciales de email en archivo `.env` compartido
   - **Impacto:** Riesgo de exposición de credenciales institucionales
   - **Recomendación:** Usar secrets manager o variables de entorno del servidor

3. **Manejo de Errores**
   - **Problema:** Sin implementación visible de try-catch global
   - **Impacto:** Errores pueden exponer información sensible
   - **Recomendación:** Handler de excepciones robusto

4. **Testing**
   - **Problema:** No hay tests implementados (carpeta `/tests` vacía o con defaults)
   - **Impacto:** Sin garantía de estabilidad en cambios
   - **Recomendación:** Implementar tests unitarios y de integración

5. **API Documentation**
   - **Problema:** No hay documentación de endpoints
   - **Impacto:** Dificulta integración y uso de API
   - **Recomendación:** Implementar Swagger/OpenAPI

6. **Jobs Asíncronos**
   - **Problema:** Envío de correos de forma síncrona
   - **Impacto:** Demora en respuesta de requests
   - **Recomendación:** Implementar Laravel Queues

---

## 1.11 Integraciones y Dependencias Externas

### Servicios Integrados

1. **Office 365 SMTP**
   - **Host:** smtp.office365.com:587
   - **Cuenta:** alerts@adn.gob.do
   - **Uso:** Envío de notificaciones por email
   - **Protocolo:** TLS

2. **Validación de Documentos** (Potencial)
   - **Herramienta:** GuzzleHTTP
   - **Uso:** Llamadas a APIs de validación de cédulas/documentos
   - **Estado:** Implementado en código, debe validarse funcionalidad

### Librerías Frontend

1. **Axios** - HTTP client para llamadas AJAX
2. **qr-code-styling** - Generación de códigos QR personalizados
3. **Vite** - Build tool para assets

### Herramientas de Desarrollo

1. **Laravel Tinker** - REPL para Laravel
2. **Laravel Pint** - Code styling
3. **PHPUnit** - Framework de testing
4. **Mockery** - Mocking para tests

---

## 1.12 Despliegue e Infraestructura

### Opciones de Despliegue Documentadas

El proyecto incluye `DEPLOYMENT.md` con guías para:

1. **Docker** (Recomendado para desarrollo)
   - Dockerfile incluido
   - Compatible con Docker Compose
   - Aislamiento completo del entorno

2. **XAMPP** (Desarrollo local Windows/Mac/Linux)
   - Apache + MySQL + PHP
   - Configuración de VirtualHost

3. **Nginx** (Producción Linux)
   - Configuración de server block
   - Proxy pass para PHP-FPM

4. **cPanel** (Hosting compartido)
   - Configuración de dominios
   - Import de base de datos
   - Variables de entorno

### Requisitos de Servidor

**Mínimos:**
- PHP 8.1+
- MySQL 5.7+ / MariaDB 10.3+
- Composer 2.x
- Node.js 16+ (para build de assets)
- 512MB RAM mínimo
- 100MB espacio en disco

**Recomendados:**
- PHP 8.2+
- MySQL 8.0+
- 2GB RAM
- 500MB espacio en disco
- SSL/TLS certificate
- Backup automatizado

---

## 1.13 Modelo de Datos Visual (Relaciones Principales)

```
tbl_solicitantes (1) ──────< (N) tbl_reservaciones
                                       │
                                       ├──> (N) tbl_parques (1)
                                       │           │
                                       │           ├──< (N) tbl_zona_parques
                                       │           ├──< (N) tbl_horarios_parques
                                       │           ├──< (N) tbl_imagenes_por_parque
                                       │           ├──< (N) tbl_telefonos_por_parque
                                       │           └──< (N) tbl_terminos_condiciones_generales
                                       │
                                       ├──> (N) tbl_zona_parques (1)
                                       │           ├──< (N) tbl_imagenes_por_zona
                                       │           └──< (N) tbl_horarios_zonas
                                       │
                                       └──> (N) tbl_tipos_eventos (1)

tbl_usuario ─────> (N) tbl_parques (1)
     │
     └──> (N) tbl_permisos_usuarios (1)
```

---

## 1.14 Glosario de Términos del Proyecto

| Término | Definición |
|---------|------------|
| **Parque** | Espacio público administrado por ADN disponible para reservaciones |
| **Zona** | Área específica dentro de un parque (ej: cancha, gazebo, área de picnic) |
| **Solicitante** | Usuario público que solicita una reserva (no autenticado en sistema) |
| **Usuario** | Personal administrativo autenticado (operador o administrador) |
| **Reservación** | Solicitud de uso de una zona en fecha/hora específica |
| **Estado de Reservación** | espera → pendiente → confirmada/rechazada → realizada/vencida |
| **Código de Reservación** | Identificador único alfanumérico asignado a cada reserva |
| **QR** | Código QR generado con código de reservación para validación |
| **Operador** | Usuario administrativo asignado a un parque específico |
| **Administrador** | Usuario con acceso total al sistema |
| **Cola de Espera** | Modo de parque cuando todas las zonas están ocupadas |

---

## 1.15 Conclusión

**ADN Reserva tu Parque** es un sistema web funcional construido con Laravel 10 que digitaliza el proceso de reservación de espacios en parques públicos. El sistema implementa un flujo completo desde la solicitud pública hasta la aprobación administrativa, con notificaciones automáticas y códigos QR para validación.

### Fortalezas
✅ Funcionalidad completa de reservaciones
✅ Sistema de notificaciones automatizado
✅ Interfaz administrativa para gestión
✅ Generación de códigos QR
✅ Multi-parque y multi-zona
✅ Trazabilidad completa de solicitudes
✅ Documentación de despliegue incluida

### Áreas de Oportunidad
⚠️ Refactorización de lógica a controladores
⚠️ Implementación de testing automatizado
⚠️ Mejoras en seguridad (manejo de credenciales)
⚠️ Implementación de jobs asíncronos
⚠️ Documentación de API

El proyecto está en un estado **funcional** pero requiere **optimizaciones y mejores prácticas** antes de considerarse listo para producción en un entorno crítico.

---

**Fecha de análisis:** 2026-02-11
**Analista:** Claude Sonnet 4.5
**Versión del documento:** 1.0
