# Usa una imagen base de Node
FROM node:24-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia todo el contenido del proyecto al contenedor
COPY . .

# Expone el puerto en el que escucha tu servidor
EXPOSE 3000

# Comando para ejecutar el servidor
CMD ["node", "server.js"]


