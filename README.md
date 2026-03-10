# LegalIA - Plataforma de Información Legal con IA

Plataforma web de información jurídica actualizada con inteligencia artificial para la Dirección Jurídica Municipal.

## Características

- **Biblioteca Jurídica**: Acceso a legislación, jurisprudencia, doctrina y prácticas jurídicas
- **Buscador Inteligente**: Búsqueda por palabras clave, categoría y contenido
- **Chat con IA**: Asistente jurídico impulsado por Llama 3.3 70B (Groq - GRATUITO)
- **Newsletter Automático**: Boletines diarios y semanales
- **Panel Administrativo**: Gestión de documentos y usuarios

## Stack Tecnológico

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de Datos**: PostgreSQL (Neon - gratuito)
- **Autenticación**: NextAuth.js
- **IA**: Groq + Llama 3.3 70B (GRATUITO)
- **Email**: Resend

## Requisitos Previos

- Node.js 18+
- Docker y Docker Compose (para desarrollo local)
- Cuenta en Groq (GRATIS en https://console.groq.com)
- Cuenta en Resend (para newsletters, opcional)
- Cuenta en Neon (base de datos gratuita)

## Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/sergiojsw/plataforma-informacion-legal.git
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

### 4. Obtener API Key de Groq (GRATIS)

1. Ve a [console.groq.com](https://console.groq.com)
2. Crea una cuenta (sin tarjeta de crédito)
3. Genera una API Key
4. Agrégala a tu `.env` como `GROQ_API_KEY`

### 5. Iniciar con Docker

```bash
docker-compose up -d
```

### 6. Ejecutar migraciones

```bash
npx prisma db push
```

### 7. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Deploy en Vercel

### Variables de entorno requeridas:

| Variable | Descripción | Dónde obtenerla |
|----------|-------------|-----------------|
| `DATABASE_URL` | PostgreSQL connection string | [neon.tech](https://neon.tech) (gratis) |
| `NEXTAUTH_URL` | URL de la app | Tu dominio en Vercel |
| `NEXTAUTH_SECRET` | Secreto para JWT | `openssl rand -base64 32` |
| `GROQ_API_KEY` | API key para chat IA | [console.groq.com](https://console.groq.com) (GRATIS) |
| `RESEND_API_KEY` | API key para emails | [resend.com](https://resend.com) (opcional) |

## Usuarios de Prueba

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

## Estructura del Proyecto

```
├── prisma/schema.prisma      # Esquema de base de datos
├── src/
│   ├── app/
│   │   ├── (auth)/           # Login/registro
│   │   ├── (dashboard)/      # Páginas protegidas
│   │   └── api/              # API Routes
│   ├── components/           # Componentes React
│   └── lib/                  # Utilidades
├── docker-compose.yml
└── vercel.json
```

## Licencia

MIT
