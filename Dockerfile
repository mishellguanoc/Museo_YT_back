# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm install

# Generar cliente de Prisma
RUN npm run prisma:generate

# Copiar código fuente
COPY src ./src

# Compilar TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copiar solo package.json para instalar dependencias de producción
COPY package*.json ./
COPY prisma ./prisma

# Instalar solo dependencias de producción
RUN npm install --omit=dev

# Generar cliente de Prisma nuevamente (necesario en runtime)
RUN npm run prisma:generate

# Copiar código compilado del builder
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/main.js"]
