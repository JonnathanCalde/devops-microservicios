# Imagen base Node.js ligera
FROM node:18-alpine
WORKDIR /usr/src/app

# Copiar archivos de definición de dependencias
COPY package*.json ./

# Mejoras: usar package-lock.json si existe y npm ci
RUN if [ -f package-lock.json ]; then npm ci --only=production; else npm install --production; fi

# Copiar el resto de archivos
COPY . .

# Ejecutar la app
EXPOSE 8000
CMD ["node", "src/server.js"]
