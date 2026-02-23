# 🚀 Guía de Despliegue - ADN Reserva tu Parque

Esta guía contiene las estrategias de despliegue para diferentes entornos.

---

## 📋 Tabla de Contenidos

1. [Desarrollo Local con XAMPP](#1-desarrollo-local-con-xampp)
2. [Desarrollo Local con Docker](#2-desarrollo-local-con-docker)
3. [Servidor Institucional con XAMPP](#3-servidor-institucional-con-xampp)
4. [Servidor de Producción (Apache/Nginx)](#4-servidor-de-producción-apachenginx)
5. [Hosting Compartido (cPanel)](#5-hosting-compartido-cpanel)
6. [Checklist de Seguridad](#6-checklist-de-seguridad)

---

## 1. Desarrollo Local con XAMPP

### 📁 Estructura de Carpetas
```
C:\xampp\htdocs\adn_reserva_tu_parque\
├── app/
├── config/
├── public/          ← Punto de entrada
│   ├── index.php
│   ├── .htaccess
│   └── assets/
├── .env
└── ...
```

### 🔧 Opción A: Acceso Directo (Más Simple)

**URL de acceso:**
```
http://localhost/adn_reserva_tu_parque/public
```

**Pros:**
- ✅ No requiere configuración adicional
- ✅ Funciona inmediatamente

**Contras:**
- URL no profesional con `/public`
- No es ideal para demostración

---

### 🔧 Opción B: Virtual Host (Recomendado)

**Paso 1:** Edita `C:\xampp\apache\conf\extra\httpd-vhosts.conf`

```apache
<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/adn_reserva_tu_parque/public"
    ServerName reservas.local

    <Directory "C:/xampp/htdocs/adn_reserva_tu_parque/public">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog "logs/reservas-error.log"
    CustomLog "logs/reservas-access.log" combined
</VirtualHost>
```

**Paso 2:** Edita `C:\Windows\System32\drivers\etc\hosts` (como Administrador)

```
127.0.0.1    reservas.local
```

**Paso 3:** Reinicia Apache en el panel de XAMPP

**URL de acceso:**
```
http://reservas.local
```

**Pros:**
- ✅ URL profesional
- ✅ Simula entorno real
- ✅ Ideal para desarrollo

---

### 🔧 Opción C: Redirección Automática

Si no puedes modificar Apache, crea un `index.php` en la raíz del proyecto:

```php
<?php
// index.php (en la raíz, NO en public)
header('Location: public/index.php');
exit;
```

**URL de acceso:**
```
http://localhost/adn_reserva_tu_parque
```

**Pros:**
- ✅ No requiere modificar Apache
- ✅ URL sin `/public`

**Contras:**
- ⚠️ No es la mejor práctica
- ⚠️ Solo para desarrollo/demostración

---

## 2. Desarrollo Local con Docker

### 📁 Dockerfile (Ya configurado)

El `Dockerfile` en el directorio padre ya está configurado para Laravel:

```dockerfile
FROM php:8.1-apache
RUN docker-php-ext-install pdo pdo_mysql
RUN a2enmod rewrite
COPY . /var/www/html/
RUN chown -R www-data:www-data /var/www/html
RUN echo '<VirtualHost *:80> \n\
    DocumentRoot /var/www/html/public \n\
    <Directory /var/www/html/public> \n\
        AllowOverride All \n\
        Require all granted \n\
    </Directory> \n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf
EXPOSE 80
```

### 🚀 Comandos para Ejecutar

```bash
# 1. Navega al directorio del proyecto
cd "/Users/mac/Documents/Proyectos Software/PHP_Docker/htdocs"

# 2. Construye la imagen
docker build -t adn-reserva .

# 3. Ejecuta el contenedor
docker run -d -p 8080:80 --name adn-reserva-app adn-reserva

# 4. Accede a la aplicación
# http://localhost:8080
```

### 🛑 Comandos Útiles

```bash
# Ver contenedores en ejecución
docker ps

# Detener el contenedor
docker stop adn-reserva-app

# Eliminar el contenedor
docker rm adn-reserva-app

# Ver logs
docker logs adn-reserva-app

# Acceder al contenedor
docker exec -it adn-reserva-app bash
```

---

## 3. Servidor Institucional con XAMPP

### 🏢 Escenario Típico
- Servidor Windows con XAMPP instalado
- Acceso limitado a configuración de Apache
- Red interna de la institución

### 🔧 Configuración Recomendada

**Opción 1: Virtual Host (Si tienes acceso al servidor)**

1. Sube el proyecto a: `C:\xampp\htdocs\adn_reserva_tu_parque\`

2. Edita `C:\xampp\apache\conf\extra\httpd-vhosts.conf`:

```apache
<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/adn_reserva_tu_parque/public"
    ServerName reservas.institucion.local
    ServerAlias www.reservas.institucion.local

    <Directory "C:/xampp/htdocs/adn_reserva_tu_parque/public">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Logs
    ErrorLog "C:/xampp/logs/reservas-error.log"
    CustomLog "C:/xampp/logs/reservas-access.log" combined
</VirtualHost>
```

3. Configura DNS interno o archivo hosts en las computadoras cliente:
```
192.168.X.X    reservas.institucion.local
```

4. Reinicia Apache

**URL de acceso:**
```
http://reservas.institucion.local
```

---

**Opción 2: Acceso por IP (Sin Virtual Host)**

Si NO tienes acceso a configuración:

**URL de acceso:**
```
http://192.168.X.X/adn_reserva_tu_parque/public
```

Para eliminar `/public` de la URL, crea `index.php` en la raíz:

```php
<?php
// index.php (en la raíz)
header('Location: public/index.php');
exit;
```

**URL de acceso mejorada:**
```
http://192.168.X.X/adn_reserva_tu_parque
```

---

### ⚙️ Configuración de `.env` para Servidor Institucional

```env
APP_NAME="Reserva tu Parque"
APP_ENV=production
APP_KEY=base64:TU_KEY_GENERADA
APP_DEBUG=false
APP_URL=http://192.168.X.X/adn_reserva_tu_parque

LOG_CHANNEL=daily
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=reserva_parques
DB_USERNAME=root
DB_PASSWORD=tu_password_segura

# IMPORTANTE: Genera una nueva APP_KEY
# php artisan key:generate
```

---

## 4. Servidor de Producción (Apache/Nginx)

### 🌐 Apache (Hosting VPS/Dedicado)

**Archivo: `/etc/apache2/sites-available/reservas.conf`**

```apache
<VirtualHost *:80>
    ServerName reservas.dominio.com
    ServerAlias www.reservas.dominio.com

    DocumentRoot /var/www/adn_reserva_tu_parque/public

    <Directory /var/www/adn_reserva_tu_parque/public>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Seguridad: Denegar acceso a archivos sensibles
    <DirectoryMatch "/\.git/">
        Require all denied
    </DirectoryMatch>

    <FilesMatch "^\.env">
        Require all denied
    </FilesMatch>

    ErrorLog ${APACHE_LOG_DIR}/reservas-error.log
    CustomLog ${APACHE_LOG_DIR}/reservas-access.log combined

    # SSL Configuration (Usar Certbot para Let's Encrypt)
    # Include /etc/letsencrypt/options-ssl-apache.conf
</VirtualHost>
```

**Activar el sitio:**

```bash
# Habilitar el sitio
sudo a2ensite reservas.conf

# Habilitar mod_rewrite
sudo a2enmod rewrite

# Reiniciar Apache
sudo systemctl restart apache2

# Instalar certificado SSL (Let's Encrypt)
sudo certbot --apache -d reservas.dominio.com -d www.reservas.dominio.com
```

---

### 🌐 Nginx (Alternativa)

**Archivo: `/etc/nginx/sites-available/reservas`**

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name reservas.dominio.com www.reservas.dominio.com;
    root /var/www/adn_reserva_tu_parque/public;

    index index.php index.html;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    # SSL Configuration
    # listen 443 ssl http2;
    # ssl_certificate /etc/letsencrypt/live/reservas.dominio.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/reservas.dominio.com/privkey.pem;
}
```

**Activar el sitio:**

```bash
# Crear symlink
sudo ln -s /etc/nginx/sites-available/reservas /etc/nginx/sites-enabled/

# Probar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx

# Instalar certificado SSL
sudo certbot --nginx -d reservas.dominio.com -d www.reservas.dominio.com
```

---

## 5. Hosting Compartido (cPanel)

### 📁 Estructura para cPanel

```
/home/usuario/
├── public_html/              ← DocumentRoot
│   ├── .htaccess             ← Redirección
│   └── index.php             ← Redirección
├── adn_reserva_tu_parque/    ← Aplicación Laravel
│   ├── app/
│   ├── public/
│   │   ├── index.php         ← Aplicación real
│   │   └── .htaccess
│   ├── .env
│   └── ...
```

### 🔧 Configuración

**1. Sube el proyecto fuera de `public_html`**

Usa FileZilla/FTP para subir todo el proyecto a:
```
/home/usuario/adn_reserva_tu_parque
```

**2. Crea `index.php` en `public_html`:**

```php
<?php
// /home/usuario/public_html/index.php

// Redirigir todas las peticiones a la carpeta public de Laravel
require __DIR__.'/../adn_reserva_tu_parque/public/index.php';
```

**3. Crea `.htaccess` en `public_html`:**

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Redirigir todas las peticiones a index.php
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php [L]
</IfModule>
```

**4. Configura `.env`:**

```env
APP_URL=https://tudominio.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=usuario_reservas
DB_USERNAME=usuario_admin
DB_PASSWORD=password_cpanel
```

**5. En cPanel, crea la base de datos y ejecuta:**

```bash
# Via SSH (si está disponible)
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 6. Checklist de Seguridad

### ✅ Antes de Desplegar

- [ ] **Archivo `.env`**
  - [ ] `APP_ENV=production`
  - [ ] `APP_DEBUG=false`
  - [ ] `APP_KEY` generada: `php artisan key:generate`
  - [ ] Credenciales de base de datos correctas

- [ ] **Archivos sensibles**
  - [ ] `.env` NO está en Git (verificar `.gitignore`)
  - [ ] Eliminar archivos duplicados (`.env copy`, backups)
  - [ ] Permisos correctos en Linux: `chmod 600 .env`

- [ ] **Carpetas de almacenamiento**
  - [ ] `storage/` y `bootstrap/cache/` con permisos de escritura
  - [ ] Linux: `chmod -R 775 storage bootstrap/cache`
  - [ ] Linux: `chown -R www-data:www-data storage bootstrap/cache`

- [ ] **Base de datos**
  - [ ] Backup de datos existentes
  - [ ] Ejecutar migraciones: `php artisan migrate --force`
  - [ ] Ejecutar seeders si es necesario: `php artisan db:seed`

- [ ] **Caché de producción**
  ```bash
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache
  php artisan optimize
  ```

- [ ] **Seguridad**
  - [ ] Certificado SSL instalado (HTTPS)
  - [ ] Archivos `.git` inaccesibles desde web
  - [ ] Deshabilitar listado de directorios
  - [ ] Configurar firewall (si aplica)

---

## 📞 Comandos Útiles

### Limpiar Caché
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Generar Caché (Producción)
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Permisos (Linux)
```bash
# Dar permisos de escritura
sudo chmod -R 775 storage bootstrap/cache

# Cambiar propietario
sudo chown -R www-data:www-data storage bootstrap/cache
```

### Base de Datos
```bash
# Ejecutar migraciones
php artisan migrate

# Ejecutar migraciones en producción (sin confirmación)
php artisan migrate --force

# Rollback de la última migración
php artisan migrate:rollback

# Refrescar base de datos (CUIDADO: Borra todos los datos)
php artisan migrate:fresh
```

---

## 🆘 Solución de Problemas Comunes

### Error: "The provided cwd does not exist"
**Causa:** La carpeta `public/` no existe
**Solución:** Verificar que existe `public/` con `index.php` y `.htaccess`

### Error 500 - Internal Server Error
**Causas comunes:**
1. `APP_KEY` no configurada → `php artisan key:generate`
2. Permisos incorrectos en `storage/` → `chmod -R 775 storage`
3. `.env` no existe → copiar desde `.env.example`
4. Caché corrupta → `php artisan cache:clear`

### Error 404 - Not Found (rutas no funcionan)
**Causa:** `mod_rewrite` deshabilitado
**Solución:**
- Apache: `sudo a2enmod rewrite && sudo systemctl restart apache2`
- XAMPP: Verificar que `httpd.conf` tiene `LoadModule rewrite_module`

### Base de datos no conecta
**Verificar:**
1. Credenciales en `.env`
2. Servicio MySQL corriendo
3. Host correcto (`localhost` o `127.0.0.1`)
4. Puerto correcto (por defecto `3306`)

---

## 📚 Recursos Adicionales

- [Documentación Laravel Deployment](https://laravel.com/docs/deployment)
- [Laravel Forge](https://forge.laravel.com/) - Automatización de despliegue
- [Laravel Vapor](https://vapor.laravel.com/) - Despliegue serverless en AWS

---

**Última actualización:** 2026-02-10
**Proyecto:** ADN Reserva tu Parque
**Framework:** Laravel
