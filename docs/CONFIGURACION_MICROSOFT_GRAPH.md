# Configuración de Microsoft Graph para Envío de Correos

## ✅ Configuración Completada

Se ha configurado la aplicación para enviar correos usando **Microsoft Graph API** con OAuth2.

### Archivos Creados/Modificados:

1. **`app/Services/GraphMailer.php`** - Servicio principal para envío de correos
2. **`config/msgraph.php`** - Configuración de Microsoft Graph
3. **`.env`** - Credenciales agregadas
4. **`routes/web.php`** - Rutas actualizadas para usar GraphMailer

---

## ⚠️ IMPORTANTE: Configuración Requerida en Azure AD

Para que el envío de correos funcione, **debes configurar los permisos de API en Azure AD**:

### Pasos en Azure Portal:

1. Ve a [Azure Portal](https://portal.azure.com)
2. Navega a **Azure Active Directory** → **App registrations**
3. Busca tu aplicación con ID: `8f25601c-a9b6-490b-858d-c2e8ee706678`
4. Ve a **API permissions**

### Permisos Requeridos:

Agrega los siguientes **Application permissions** (NO Delegated):

- ✅ `Mail.Send` - Permite enviar correo como cualquier usuario
- ✅ `User.Read.All` - Permite leer información de usuarios (opcional pero recomendado)

### Pasos Detallados:

1. Click en **"Add a permission"**
2. Selecciona **"Microsoft Graph"**
3. Selecciona **"Application permissions"** (NO Delegated permissions)
4. Busca y selecciona:
   - `Mail.Send`
   - `User.Read.All` (opcional)
5. Click en **"Add permissions"**
6. **MUY IMPORTANTE:** Click en **"Grant admin consent for [Tu Organización]"**
   - Solo un administrador puede hacer esto
   - Sin este paso, la aplicación NO podrá enviar correos

---

## 🔧 Configuración en .env

Ya se agregaron las siguientes variables al archivo `.env`:

```env
MSGRAPH_CLIENT_ID=8f25601c-a9b6-490b-858d-c2e8ee706678
MSGRAPH_TENANT_ID=11f7d66f-a392-4a7c-90fe-d6f2d913a3da
MSGRAPH_SECRET_ID=YOUR_AZURE_SECRET_HERE
MSGRAPH_OAUTH_URL="${APP_URL}/msgraph/oauth"
MSGRAPH_LANDING_URL="${APP_URL}/msgraph/callback"
MSGRAPH_PREFER_TIMEZONE="outlook.timezone=\"America/Santo_Domingo\""
```

---

## 📧 Uso del Servicio GraphMailer

### Ejemplo Básico:

```php
use App\Services\GraphMailer;

$graphMailer = new GraphMailer();

// Enviar correo desde una vista
$resultado = $graphMailer->sendFromView(
    'destinatario@ejemplo.com',
    'Asunto del correo',
    'nombre_de_vista',
    ['variable1' => 'valor1', 'variable2' => 'valor2']
);

if ($resultado['success']) {
    echo "Correo enviado correctamente";
} else {
    echo "Error: " . $resultado['message'];
}
```

### Enviar HTML Directamente:

```php
$resultado = $graphMailer->sendEmail(
    'destinatario@ejemplo.com',
    'Asunto del correo',
    '<h1>Hola</h1><p>Este es un correo de prueba</p>'
);
```

### Con Archivos Adjuntos:

```php
$resultado = $graphMailer->sendEmail(
    'destinatario@ejemplo.com',
    'Asunto con adjunto',
    '<p>Ver archivo adjunto</p>',
    [
        'attachments' => [
            [
                'path' => '/ruta/al/archivo.pdf',
                'name' => 'documento.pdf',
                'type' => 'application/pdf'
            ]
        ]
    ]
);
```

---

## 🧪 Probar la Configuración

### Opción 1: Crear una Ruta de Prueba

Agrega esto temporalmente en `routes/web.php`:

```php
Route::get('/test-email', function () {
    $graphMailer = new GraphMailer();

    $resultado = $graphMailer->sendEmail(
        'tu-email@ejemplo.com',
        'Prueba de Microsoft Graph',
        '<h1>¡Funciona!</h1><p>El envío de correos con Microsoft Graph está configurado correctamente.</p>'
    );

    return response()->json($resultado);
});
```

Luego visita: `https://tu-dominio.com/test-email`

### Opción 2: Usar Tinker

```bash
php artisan tinker
```

```php
$mailer = new App\Services\GraphMailer();
$resultado = $mailer->sendEmail('tu-email@ejemplo.com', 'Test', '<p>Prueba</p>');
print_r($resultado);
```

---

## 🔍 Verificar Logs

Los logs de envío se guardan en:
- `storage/logs/laravel.log`

Busca:
- ✅ `Correo enviado exitosamente vía Microsoft Graph`
- `Error al enviar correo con Microsoft Graph`

---

## 🛠️ Solución de Problemas

### Error: "Insufficient privileges to complete the operation"
**Solución:** No se han otorgado los permisos de API en Azure AD. Sigue los pasos de "Configuración en Azure Portal" arriba.

### Error: "Invalid client secret"
**Solución:** Verifica que `MSGRAPH_SECRET_ID` en `.env` sea correcto. El secreto expira, puede que necesites crear uno nuevo en Azure.

### Error: "Tenant ID not found"
**Solución:** Verifica que `MSGRAPH_TENANT_ID` en `.env` sea correcto.

### El correo no llega
**Solución:**
1. Verifica que `MAIL_FROM_ADDRESS` sea una dirección válida en tu tenant de Office 365
2. Revisa la carpeta de spam
3. Verifica los logs en `storage/logs/laravel.log`

---

## 📝 Notas Adicionales

1. **El secreto tiene fecha de expiración** - Verifica en Azure Portal cuándo expira y crea uno nuevo antes
2. **Límites de envío** - Microsoft Graph tiene límites de rate limiting. Para producción considera implementar colas
3. **Tokens cacheados** - El token de acceso se cachea por 55 minutos para mejor rendimiento
4. **Usuario remitente** - Los correos se envían desde la cuenta configurada en `MAIL_FROM_ADDRESS`

---

## 🔄 Migración Completada

### Antes (SMTP):
```php
Mail::to($destinatario)->send(new ReservacionMaker($data));
```

### Ahora (Microsoft Graph):
```php
$graphMailer = new GraphMailer();
$graphMailer->sendFromView($destinatario, 'Asunto', 'vista', $data);
```

---

## ✨ Beneficios de Microsoft Graph

- ✅ Autenticación OAuth2 más segura
- ✅ Mejor control de permisos
- ✅ Integración nativa con Office 365
- ✅ No requiere contraseñas en texto plano
- ✅ Mejor tracking y auditoría
- ✅ Soporte para características avanzadas de Outlook

---

**Fecha de Configuración:** 2026-02-19
**Configurado por:** Claude Code
**Tenant ID:** 11f7d66f-a392-4a7c-90fe-d6f2d913a3da
**Client ID:** 8f25601c-a9b6-490b-858d-c2e8ee706678
