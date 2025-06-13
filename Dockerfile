# Usa la imagen oficial de Node.js
FROM node:24-alpine

# Directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios
COPY server.js .

# Expone el puerto del servidor
EXPOSE 3000

# Inicia el servidor
CMD ["node", "server.js"]
