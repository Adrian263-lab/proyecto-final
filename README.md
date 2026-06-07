Huellitas - Plataforma de Adopción y Apadrinamiento

Huellitas es el Trabajo de Fin de Grado (TFG) para el Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW). Se trata de una plataforma integral diseñada para digitalizar, centralizar y facilitar la gestión de adopciones en protectoras de animales.

Características Principales

- Arquitectura Desacoplada (API REST): Frontend (React) y Backend (Laravel) totalmente independientes.
- Gestión de Roles (RBAC): Accesos diferenciados para Administrador, Protectora y Particular.
- Procesamiento Asíncrono: Uso de colas (Queue Workers) para el envío de correos electrónicos y notificaciones sin bloquear la interfaz de usuario.
- Geolocalización: Integración de mapas interactivos para localizar a las entidades protectoras.
- Infraestructura Contenerizada: Despliegue orquestado mediante Docker y Docker Compose, servido a través de Caddy.

Estructura del Proyecto

El repositorio está dividido en los siguientes módulos principales:

- /frontend: Aplicación SPA (Single Page Application) desarrollada en React, gestionada con Vite y maquetada con Bootstrap 5.
- /laravel: Núcleo del backend (API REST) construido con Laravel 11.
- /php: Configuración personalizada de la imagen de PHP-FPM utilizada en los contenedores.
- docker-compose.yml: Archivo de orquestación de la infraestructura.
- Caddyfile: Configuración del servidor web y proxy inverso.

Despliegue en Entorno Local

Gracias a la contenerización, levantar el proyecto es un proceso estandarizado.

Requisitos Previos:
- Docker Desktop o Docker Engine instalado.
- Git.

Instrucciones de instalación:

1. Clonar el repositorio:
git clone https://github.com/tu-usuario/proyecto-final.git
cd proyecto-final

2. Levantar la infraestructura con Docker:
docker compose up -d

3. Instalar dependencias del Backend:
docker compose exec php composer install

4. Configurar el entorno de Laravel:
docker compose exec php cp .env.example .env
docker compose exec php php artisan key:generate

5. Preparar la Base de Datos (Migraciones y Seeders):
docker compose exec php php artisan migrate:fresh --seed

Accesos por defecto (Seeders)

Tras ejecutar el comando de migración y volcado de datos, se puede acceder a la plataforma con los siguientes usuarios de prueba:

Administrador del Sistema:
- Email: admin@test.com
- Contraseña: 12345678

Usuario Particular (Adoptante):
- Email: juan@test.com
- Contraseña: 12345678

Protectora (Ejemplo):
- Email: protectora@test.com
- Contraseña: 12345678

Autor

Desarrollado por Adrián Izquierdo como Trabajo de Fin de Grado (DAW).
