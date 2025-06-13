# Servidor HTTP Node.js con Docker: Modos Síncrono y Asíncrono con Gestión de Archivos

Un servidor HTTP configurable construido con Node.js que opera en modo síncrono (bloqueante) o asíncrono (no bloqueante). Incluye una interfaz web para gestión de archivos y está optimizado para despliegue con Docker.

## Características principales

- Selección de modo operación (síncrono/asíncrono)
- Interfaz web para gestión de archivos
- Operaciones CRUD para archivos (subir, listar, descargar, eliminar)
- Configuración lista para Docker
- Menú interactivo en terminal
- Notificaciones en tiempo real
- Soporte para arrastrar y soltar archivos



## Primeros pasos

### Prerrequisitos

- Docker ([Instalación](https://docs.docker.com/get-docker/))
- Node.js v14+ (solo para ejecución nativa)
- Git

## Instalación con Docker

```bash
# Clonar repositorio
git clone https://github.com/LightDye08/basictcpserver
cd basictcpserver

# Construir imagen Docker
docker build -t node-server .

# Ejecutar contenedor
docker run -it -p 3000:3000 node-server:latest
````

## Ejecución nativa

```bash
# Instalar dependencias (ninguna adicional requerida)
node server.js
```

## Uso del servidor

Al iniciar, se muestra un menú interactivo:

```
=== Modo de Ejecución del Servidor ===
1. Modo síncrono (bloqueante)
2. Modo asíncrono (no bloqueante)
3. Ejecutar Hola Mundo
4. Salir
Selecciona modo (1-4):
```

* **Modo síncrono**: Ideal para cargas bajas, procesa solicitudes secuencialmente
* **Modo asíncrono**: Óptimo para alta concurrencia, usa I/O no bloqueante
* **Hola Mundo**: Prueba básica de funcionamiento

## Gestión de archivos vía web

Accede a la interfaz en `http://localhost:3000`:

**Funcionalidades disponibles:**

* Subir archivos mediante arrastrar y soltar o selección tradicional
* Listado de archivos con información detallada (nombre, tamaño, tipo)
* Descarga directa de archivos
* Eliminación segura con confirmación
* Actualización automática de la lista de archivos
* Notificaciones de operaciones exitosas/fallidas

## Pruebas de rendimiento

### Prueba básica

```bash
curl http://localhost:3000
```

### Prueba de carga (Apache Benchmark)

```bash
# Modo síncrono
ab -n 100 -c 10 http://localhost:3000/

# Modo asíncrono (mejor rendimiento concurrente)
ab -n 1000 -c 100 http://localhost:3000/
```

## Despliegue en producción

```bash
# Construir imagen optimizada
docker build -t node-server-prod .

# Ejecutar en segundo plano con reinicio automático
docker run -d -p 3000:3000 \
  --name servidor-produccion \
  --restart always \
  node-server-prod
```

## Estructura del proyecto

```
├── Dockerfile          # Configuración de contenedor
├── server.js           # Lógica principal del servidor
├── public/             # Archivos estáticos servidos
│   └── index.html      # Interfaz web principal
├── uploads/            # Archivos subidos por usuarios
└── README.md           # Documentación
```

## Referencia técnica

### Variables de entorno

| Variable      | Valor por defecto | Descripción                     |
| ------------- | ----------------- | ------------------------------- |
| `PORT`        | 3000              | Puerto del servidor             |
| `UPLOADS_DIR` | uploads           | Directorio de subidas           |
| `PUBLIC_DIR`  | public            | Directorio de archivos públicos |

### Endpoints API

| Endpoint          | Método | Función                     |
| ----------------- | ------ | --------------------------- |
| `/upload`         | POST   | Subir archivo               |
| `/list-files`     | GET    | Obtener listado de archivos |
| `/download/:file` | GET    | Descargar archivo           |
| `/delete/:file`   | GET    | Eliminar archivo            |

## Construido con

* [Node.js](https://nodejs.org/) - Entorno de ejecución JavaScript
* [Docker](https://www.docker.com/) - Plataforma de contenedores
* [Font Awesome](https://fontawesome.com/) - Iconos
* [Roboto Font](https://fonts.google.com/specimen/Roboto) - Tipografía

## Autor

* **Oscar Jesus Trejo Rocha** - [LightDye](https://github.com/LightDye08)


