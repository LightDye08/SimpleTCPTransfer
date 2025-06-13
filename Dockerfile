# Usa la imagen oficial de Node.js
FROM node:18-alpine

# Instala Git (necesario para clonar el repo)
RUN apk add --no-cache git

# Clona el repositorio (cambia la URL por la tuya)
RUN git clone https://github.com/LightDye08/basictcpserver /app

# Directorio de trabajo
WORKDIR /app

# Instala dependencias (si hay package.json)
RUN npm install

# Expone el puerto del servidor
EXPOSE 3000

# Inicia el servidor
CMD ["node", "server.js"]
