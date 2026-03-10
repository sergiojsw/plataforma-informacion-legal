FROM node:20-alpine

WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat openssl

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci

# Generar cliente Prisma
RUN npx prisma generate

# Copiar el resto del código
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando de desarrollo
CMD ["npm", "run", "dev"]
