# LegalIA - Plataforma de Información Legal con IA

Plataforma web de información jurídica actualizada con inteligencia artificial para la Dirección Jurídica Municipal.

## Características

- **Biblioteca Jurídica**: Acceso a legislación, jurisprudencia, doctrina y prácticas jurídicas
- **Buscador Inteligente**: Búsqueda por palabras clave, categoría y contenido
- **Chat con IA**: Asistente jurídico impulsado por OpenAI GPT-4
- **Newsletter Automático**: Boletines diarios y semanales
- **Panel Administrativo**: Gestión de documentos y usuarios

## Stack Tecnológico

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de Datos**: PostgreSQL (Neon para producción)
- **Autenticación**: NextAuth.js
- **IA**: OpenAI GPT-4
- **Email**: Resend

## Requisitos Previos

- Node.js 18+
- Docker y Docker Compose (para desarrollo local)
- Cuenta en OpenAI (para chat con IA)
- Cuenta en Resend (para newsletters)
- Cuenta en Neon (para base de datos en producción)

## Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/plataforma-informacion-legal.git
cd plataforma-informacion-legal
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 4. Iniciar con Docker

```bash
docker-compose up -d
```

### 5. Ejecutar migraciones

```bash
npx prisma migrate dev
```

### 6. Crear usuario administrador

```bash
npm run db:seed
```

### 7. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Desarrollo sin Docker

Si prefieres no usar Docker, necesitas PostgreSQL instalado localmente:

```bash
# Iniciar PostgreSQL local
# Actualizar DATABASE_URL en .env

npm install
npx prisma migrate dev
npm run dev
```

## Deploy en Vercel

### 1. Crear base de datos en Neon

1. Ve a [neon.tech](https://neon.tech)
2. Crea un nuevo proyecto
3. Copia la connection string

### 2. Conectar con Vercel

1. Importa el repositorio en [vercel.com](https://vercel.com)
2. Configura las variables de entorno:
   - `DATABASE_URL`: Connection string de Neon
   - `NEXTAUTH_URL`: URL de tu app en Vercel
   - `NEXTAUTH_SECRET`: `openssl rand -base64 32`
   - `OPENAI_API_KEY`: Tu API key de OpenAI
   - `RESEND_API_KEY`: Tu API key de Resend

3. Deploy automático

## Estructura del Proyecto

```
├── prisma/
│   └── schema.prisma      # Esquema de base de datos
├── src/
│   ├── app/
│   │   ├── (auth)/        # Páginas de login/registro
│   │   ├── (dashboard)/   # Páginas protegidas
│   │   ├── api/           # API Routes
│   │   └── page.tsx       # Homepage
│   ├── components/        # Componentes React
│   └── lib/               # Utilidades (prisma, auth, ai)
├── docker-compose.yml     # Docker para desarrollo
├── Dockerfile
└── vercel.json
```

## Usuarios de Prueba

Después de ejecutar el seed:

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@legal.cl | admin123 | ADMIN |
| usuario@legal.cl | usuario123 | USUARIO |

## API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/documentos` | Listar documentos |
| POST | `/api/documentos` | Crear documento (admin) |
| GET | `/api/busqueda?q=...` | Buscar documentos |
| POST | `/api/chat` | Consultar chat IA |
| GET | `/api/chat` | Historial de chat |
| GET | `/api/newsletter` | Listar newsletters |
| POST | `/api/newsletter` | Crear newsletter (admin) |

## Licencia

MIT
