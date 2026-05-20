# 🚀 Guía Completa de Despliegue en Render

## 📋 Índice
1. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
2. [Requisitos Previos](#requisitos-previos)
3. [Paso a Paso: Desplegar en Render](#paso-a-paso-desplegar-en-render)
4. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
5. [Verificación Post-Despliegue](#verificación-post-despliegue)
6. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitectura del Proyecto

### Descripción General
**Museo Reservas API** es un backend API REST construido con **NestJS** que gestiona:
- 📅 Reservas de visitas al museo
- ⏰ Horarios y disponibilidad
- 📧 Notificaciones por correo
- 🔐 Autenticación JWT
- 👨‍💼 Panel administrativo
- 💬 Sistema de feedback

### Stack Tecnológico

```
Frontend (Separado)
       ↓
┌─────────────────────────────────────┐
│   RENDER.COM (Hosting Gratuito)     │
│  ┌─────────────────────────────────┐│
│  │   NestJS 11 (API REST)          ││
│  │                                 ││
│  │  Módulos Principales:           ││
│  │  • Auth (JWT)                   ││
│  │  • Horarios                     ││
│  │  • Reservas                     ││
│  │  • Admin                        ││
│  │  • Feedback                     ││
│  │  • Mail                         ││
│  │                                 ││
│  │  Tecnologías:                   ││
│  │  • Passport (Auth)              ││
│  │  • Prisma ORM                   ││
│  │  • Class-Validator              ││
│  │  • Nodemailer                   ││
│  └─────────────────────────────────┘│
│               ↓                      │
│  Puerto 3000 (dinámico)             │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│   SUPABASE (PostgreSQL)             │
│   • Base de datos gratuita          │
│   • 500 MB de almacenamiento        │
│   • Connection pooling              │
└─────────────────────────────────────┘
       ↓
┌─────────────────────────────────────┐
│   GMAIL (Notificaciones)            │
│   • Correos de confirmación         │
│   • Notificaciones al admin         │
└─────────────────────────────────────┘
```

### Estructura de Módulos

```
src/
├── auth/              → Autenticación JWT
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── jwt-auth.guard.ts
│
├── horarios/          → Gestión de horarios
│   ├── horarios.controller.ts
│   ├── horarios.service.ts
│   └── horarios.module.ts
│
├── reservas/          → Gestión de reservas
│   ├── reservas.controller.ts
│   ├── reservas.service.ts
│   ├── reservas.module.ts
│   └── dto/
│       └── create-reserva.dto.ts
│
├── admin/             → Panel administrativo
│   ├── admin.controller.ts
│   ├── admin.service.ts
│   └── admin.module.ts
│
├── feedback/          → Sistema de feedback
│   ├── feedback.controller.ts
│   ├── feedback.service.ts
│   ├── feedback.module.ts
│   └── dto/
│       └── create-feedback.dto.ts
│
├── mail/              → Servicio de correos
│   ├── mail.service.ts
│   └── mail.module.ts
│
├── prisma/            → ORM Database
│   ├── prisma.service.ts
│   └── prisma.module.ts
│
└── common/            → Elementos compartidos
    ├── constants.ts
    ├── filters/
    │   └── http-exception.filter.ts
    └── interceptors/
        └── response.interceptor.ts
```

### Base de Datos (PostgreSQL - Supabase)

```sql
Tablas Principales:

1. reservas
   - id (PK)
   - nombreResponsable
   - cedula
   - correo
   - telefono
   - fecha
   - hora
   - numeroPersonas
   - estado (CONFIRMADO, CANCELADO)
   - createdAt, updatedAt

2. visitantes
   - id (PK)
   - nombre
   - cedula
   - reservaId (FK)
   - createdAt

3. feedbacks
   - id (PK)
   - reservaId (FK, UNIQUE)
   - calificacion (1-5)
   - comentario
   - createdAt

4. admins
   - id (PK)
   - usuario (UNIQUE)
   - password (hasheada con bcrypt)
   - nombre
   - createdAt, updatedAt
```

### Variables de Entorno Requeridas

```env
# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://usuario:password@...

# Aplicación
PORT=3000
NODE_ENV=production
JWT_SECRET=clave-super-segura-cambiar

# Email (Gmail SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu-correo@gmail.com
MAIL_PASSWORD=contraseña-app-de-google
MAIL_FROM=Museo Reservas <tu-correo@gmail.com>

# Admin
ADMIN_EMAIL=admin@museo.com

# Museo Config
MUSEO_NOMBRE=Museo de Historia Natural
MUSEO_DIRECCION=Av. Principal #123
MUSEO_TELEFONO=+123456789
MUSEO_MAX_PERSONAS_POR_HORARIO=10
```

---

## ✅ Requisitos Previos

Antes de desplegar en Render, asegúrate de tener:

### 1. **Cuenta en Supabase** (Gratuita)
   - Ve a [supabase.com](https://supabase.com)
   - Crea una cuenta
   - Crea un nuevo proyecto
   - Obtén tu `DATABASE_URL` desde Settings → Database

### 2. **Cuenta en Render** (Gratuita)
   - Ve a [render.com](https://render.com)
   - Crea una cuenta
   - Conecta tu repositorio GitHub

### 3. **Repositorio en GitHub**
   - Tu código debe estar en GitHub (público o privado)
   - Render se conecta directamente a GitHub

### 4. **Configuración de Gmail**
   - Habilita verificación en 2 pasos en tu cuenta de Google
   - Genera una "Contraseña de aplicación" desde [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Copia esa contraseña (no tu contraseña normal de Gmail)

---

## 🚀 Paso a Paso: Desplegar en Render

### Paso 1: Preparar el Repositorio GitHub

#### 1.1 Verifica que todo esté committeado
```bash
git status
git add .
git commit -m "feat: ready for deployment to Render"
git push origin main
```

#### 1.2 Crear archivo `.nvmrc` (opcional pero recomendado)
```bash
echo "20.x" > .nvmrc
git add .nvmrc
git commit -m "feat: specify Node version for Render"
git push origin main
```

#### 1.3 Verifica que `package.json` tiene los scripts correctos
✅ **Debe tener estos scripts:**
```json
{
  "scripts": {
    "build": "./node_modules/.bin/nest build",
    "start:prod": "node dist/main.js"
  }
}
```

---

### Paso 2: Crear Servicio en Render

#### 2.1 Accede a [render.com](https://render.com)

#### 2.2 Haz clic en **+ New** → **Web Service**

#### 2.3 Conecta tu repositorio GitHub
- Selecciona tu repositorio `yt_museo_back`
- Autoriza a Render si es necesario

#### 2.4 Configura el servicio

| Campo | Valor |
|-------|-------|
| **Name** | `museo-reservas-api` (o tu preferencia) |
| **Environment** | `Node` |
| **Region** | `N. California` (o la más cercana) |
| **Branch** | `main` |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start:prod` |

#### 2.5 Plan
- Selecciona **Free** (no cobras nada, puede tardar más)
- O **Paid** si quieres más recursos

---

### Paso 3: Configurar Variables de Entorno en Render

#### 3.1 En la página de creación del servicio, desplázate hasta **Environment**

#### 3.2 Agrega todas estas variables:

```env
# Database
DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-us-east-1.pooler.supabase.com:5432/postgres

# App
PORT=3000
NODE_ENV=production
JWT_SECRET=usa-una-clave-fuerte-cambiar-cada-despliegue

# Mail (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu-correo@gmail.com
MAIL_PASSWORD=tu-contraseña-de-app-google
MAIL_FROM=Museo Reservas <tu-correo@gmail.com>

# Admin
ADMIN_EMAIL=admin@museo.com

# Museo
MUSEO_NOMBRE=Museo de Historia Natural
MUSEO_DIRECCION=Av. Principal #123, Ciudad
MUSEO_TELEFONO=+123456789
MUSEO_MAX_PERSONAS_POR_HORARIO=10
```

**⚠️ IMPORTANTE:** 
- Reemplaza `DATABASE_URL` con tu URL real de Supabase
- Usa una "Contraseña de aplicación" de Google (no tu contraseña normal)
- Genera un `JWT_SECRET` fuerte, ej: `openssl rand -base64 32`

---

### Paso 4: Desplegar

#### 4.1 Haz clic en **Create Web Service**

Render comenzará a:
1. Clonar tu repositorio
2. Instalar dependencias (`npm install`)
3. Compilar el proyecto (`npm run build`)
4. Iniciar la aplicación (`npm start:prod`)

#### 4.2 Espera a que termine
- Esto puede tardar 2-5 minutos en el plan gratuito
- Verás un log en vivo en la pantalla

#### 4.3 Cuando veas ✅ **Live** en verde
Tu API está funcionando. Obtendrás una URL como:
```
https://museo-reservas-api.onrender.com
```

---

## 🔧 Configuración de Variables de Entorno

### Obtener DATABASE_URL de Supabase

1. Accede a [supabase.com](https://supabase.com)
2. Abre tu proyecto
3. Ve a **Settings** → **Database** → **Connection Pooling**
4. Copia la **Connection String**
5. Reemplaza `[YOUR-PASSWORD]` con tu contraseña real

**Ejemplo:**
```
postgresql://postgres.abc123def456:supersecretatrCqWs7LqJ@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### Obtener MAIL_PASSWORD de Gmail

1. Ve a [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Selecciona App: **Mail** y Device: **Windows Computer** (o tu dispositivo)
3. Gmail generará una contraseña de 16 caracteres
4. Copia esa contraseña (no tu contraseña normal)

**Ejemplo:**
```
abcd efgh ijkl mnop
```

### Generar JWT_SECRET Fuerte

En tu terminal (Linux/Mac):
```bash
openssl rand -base64 32
```

O usa un generador online: [randomkeygen.com](https://randomkeygen.com)

**Ejemplo:**
```
a3F8kJ7mL2pQ9wX5zC1bN6dE4rT8uI0vS3yA6hG2jK4l
```

---

## ✅ Verificación Post-Despliegue

### Paso 1: Verificar que la API está activa

```bash
# Reemplaza tu-url con la URL de tu servicio en Render
curl https://tu-url.onrender.com/

# Deberías recibir una respuesta (puede ser 404 o mensaje de bienvenida)
```

### Paso 2: Probar endpoint público (Horarios)

```bash
curl "https://tu-url.onrender.com/horarios/disponibles?fecha=2026-05-20"

# Deberías ver un JSON con los horarios disponibles
```

### Paso 3: Revisar logs en Render

1. Ve a tu servicio en Render
2. Haz clic en **Logs**
3. Busca mensajes como:
   ```
   ✓ API del Museo ejecutándose en puerto 3000
   ✓ Base de datos: PostgreSQL (Supabase)
   ```

### Paso 4: Probar con Postman

1. Abre [Postman](https://www.postman.com/downloads/)
2. Crea una nueva solicitud GET a:
   ```
   https://tu-url.onrender.com/horarios/disponibles?fecha=2026-05-20
   ```
3. Presiona **Send**
4. Deberías ver una respuesta JSON

---

## 🔐 Seguridad en Producción

### Cambios Recomendados

#### 1. CORS (Seguridad de origen cruzado)

**Archivo:** [src/main.ts](src/main.ts)

Actualmente está así:
```typescript
app.enableCors({
  origin: '*', // ⚠️ INSEGURO en producción
});
```

**Cambiar a:**
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

**Luego agregar en Render:**
```
FRONTEND_URL=https://tu-frontend.vercel.app
```

---

#### 2. Rate Limiting (Limitar solicitudes)

Instala:
```bash
npm install @nestjs/throttler
```

Luego en `app.module.ts`:
```typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 segundos
        limit: 100, // máximo 100 solicitudes
      },
    ]),
    // ... otros módulos
  ],
})
export class AppModule {}
```

---

#### 3. Variables de Entorno Secretas

**NUNCA** hagas commit de `.env`

Verifica que tu `.gitignore` contenga:
```
.env
.env.local
.env.*.local
```

---

## 🛠️ Troubleshooting

### Error: "Cannot find module 'prisma'"

**Solución:**
1. Ve a Render → Settings → Build & Deploy
2. En Build Command, cambia a:
   ```
   npm install && npm run prisma:generate && npm run build
   ```
3. Redeploy

---

### Error: "Database connection timeout"

**Soluciones:**
1. Verifica que `DATABASE_URL` sea correcta
2. En Supabase, verifica que tu proyecto esté activo (verde)
3. Asegúrate de usar **Connection Pooling** en Supabase:
   - Settings → Database → Connection String → Pooling

---

### Error: "Cannot send mail"

**Soluciones:**
1. Usa una **Contraseña de aplicación** de Google (no tu contraseña normal)
2. Verifica que Gmail tenga **2FA habilitado**
3. Prueba localmente primero:
   ```bash
   npm run start:dev
   ```
4. Revisa los logs en Render

---

### Error: "Port already in use"

**Solución:**
El puerto 3000 ya está usado. Render asigna un puerto dinámicamente.
Tu código ya lo maneja:
```typescript
const port = process.env.PORT || 3000;
await app.listen(port, '0.0.0.0');
```

---

### La API tarda mucho en responder

**Causas:**
1. Plan Render gratuito (spins down después de 15 min de inactividad)
2. Base de datos Supabase lenta

**Soluciones:**
1. Upgrade a plan Paid en Render
2. Agrega un "pinger" que mantenga la API activa (ver abajo)

---

## 💡 Optimizaciones Opcionales

### Auto-Ping para mantener API activa

Crea un archivo `keep-alive.ts`:

```typescript
// src/keep-alive.ts
import axios from 'axios';

export async function keepAlive() {
  const API_URL = process.env.API_URL || 'http://localhost:3000';
  
  setInterval(async () => {
    try {
      await axios.get(`${API_URL}/healthcheck`);
      console.log('✓ Keep-alive ping enviado');
    } catch (error) {
      console.log('Keep-alive ping fallido (normal si no está activo)');
    }
  }, 10 * 60 * 1000); // Cada 10 minutos
}
```

Luego en `main.ts`:
```typescript
import { keepAlive } from './keep-alive';

async function bootstrap() {
  // ... código existente ...
  
  keepAlive();
  
  console.log(`API ejecutándose en puerto ${port}`);
}
```

---

## 📞 Recursos Útiles

| Recurso | Enlace |
|---------|--------|
| **Render Docs** | [render.com/docs](https://render.com/docs) |
| **Supabase Docs** | [supabase.com/docs](https://supabase.com/docs) |
| **NestJS Docs** | [docs.nestjs.com](https://docs.nestjs.com) |
| **Prisma Docs** | [prisma.io/docs](https://prisma.io/docs) |
| **JWT Explicado** | [jwt.io](https://jwt.io) |
| **Gmail App Password** | [support.google.com/accounts/answer/185833](https://support.google.com/accounts/answer/185833) |

---

## 📝 Checklist Final

Antes de desplegar, verifica:

- [ ] Repositorio en GitHub (public o private)
- [ ] `.env.example` actualizado con todos los campos
- [ ] `package.json` tiene `"build"` y `"start:prod"` scripts
- [ ] `.gitignore` contiene `.env`
- [ ] Supabase proyecto creado y CONNECTION STRING obtenida
- [ ] Gmail con 2FA habilitado y contraseña de app generada
- [ ] Render cuenta creada
- [ ] Variables de entorno configuradas en Render
- [ ] Primer despliegue exitoso (sin errores)
- [ ] Endpoints probados y funcionando

---

## ✨ ¡Listo!

Tu API está en vivo en:
```
https://tu-servicio.onrender.com
```

**Próximos pasos:**
1. Conecta tu frontend a esta URL
2. Prueba los endpoints en Postman
3. Monitorea los logs en Render
4. Añade más seguridad según sea necesario

¿Preguntas? Revisa los logs en Render o contacta al soporte.

---

**Última actualización:** Mayo 2026
**Versión API:** 1.0.0
**Status:** ✅ Listo para producción
