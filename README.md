# Servidor HTTP Node.js Docker y Nativo de linux

Un servidor HTTP configurable construido con Node.js que puede operar en modo síncrono y asíncrono. El proyecto está preparado para Docker y puede clonarse directamente desde GitHub para un despliegue sencillo.

## Primeros pasos

Estas instrucciones te permitirán obtener una copia del proyecto funcionando en tu máquina local para propósitos de desarrollo y pruebas.

### Prerrequisitos

Necesitarás tener instalado el siguiente software:

- Docker (opcional) ([Guía de instalación](https://docs.docker.com/get-docker/))
- Git
- Node.js (solo se requiere si se ejecuta sin Docker)

### Instalacion para distintas distribuciones

Debian/Ubuntu:
```
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

Arch Linux:
```
sudo pacman -S docker
```
### Instalación

Sigue estos pasos para configurar el proyecto:

1. Clona el repositorio:
```
https://github.com/LightDye08/basictcpserver
cd basictcpserver
```

2. Construye la imagen de Docker:
```
docker build -t node-server .
```

3. Ejecuta el contenedor:
```
docker run -it -p 3000:3000 node-server:latest
```

4. Verifica que el servidor esté funcionando:
```
curl http://localhost:3000
```

## Ejecutando el servidor

El servidor proporciona un menú interactivo al iniciarse:

1. Accede a la interfaz del servidor:
```
docker run -it -p 3000:3000 node-server:latest
```

2. El servidor mostrará:
```
=== Modo de Ejecución del Servidor ===
1. Modo síncrono (bloqueante)
2. Modo asíncrono (no bloqueante)
3. Salir
Selecciona modo (1-3):
```

### Probando el servidor

Para verificar que ambos modos funcionan:

1. Para probar modo síncrono:
```
curl http://localhost:3000
```

2. Para probar modo asíncrono (debería mostrar salida similar pero manejar mejor peticiones concurrentes):
```
ab -n 100 -c 10 http://localhost:3000/
```


Para conectarte al servidor desde otra maquina puedes usar:

```
curl localhost 3000
```
## Despliegue

Para despliegue en producción:

1. Construye la imagen de producción:
```
docker build -t node-server-prod .
```

2. Ejecuta con política de reinicio:
```
docker run -it -p 3000:3000 -d --name servidor-produccion --restart always node-server-prod
```

## Construido con

* [Node.js](https://nodejs.org/) - Entorno de ejecución JavaScript
* [Docker](https://www.docker.com/) - Plataforma de contenedores
* [Git](https://git-scm.com/) - Control de versiones

## Contribución

No hay contribuciones, solo es una tarea universitaria

## Control de versiones

Utilizo [Github](https://github.com), [Gitlab](https://gitlab.com/), [Bitbucket](https://bitbucket.org) para el control de versiones.

## Autores

* **Oscar Jesus Trejo Rocha** - *Trabajo inicial* - [LightDye](https://github.com/LightDye08)

## Licencia

Este proyecto está licenciado bajo la Licencia MIT


