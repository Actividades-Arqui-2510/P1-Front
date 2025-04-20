# Etapa de construcción
FROM node:20-alpine as build

WORKDIR /app

# Instalar dependencias
COPY package.json package-lock.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Usar ARG para recibir variables en tiempo de construcción
ARG VITE_DOCKER_ENV
ARG VITE_API_URL

# Establecer variables desde los ARGs
ENV VITE_DOCKER_ENV=${VITE_DOCKER_ENV}
ENV VITE_API_URL=${VITE_API_URL}

EXPOSE 5173
# hay que exponer en 0.0.0.0 para que sea accesible fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]