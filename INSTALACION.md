# 🚀 Guía de Instalación Completa

Esta guía te llevará paso a paso por la instalación y configuración del sistema.

---

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior) - [Descargar](https://nodejs.org/)
- **npm** (viene con Node.js)
- **Git** (opcional, para clonar el proyecto)

Para verificar las instalaciones:

```bash
node --version
npm --version
```

---

## 🔧 Paso 1: Instalar Dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Este proceso puede tardar unos minutos. Instalará todas las dependencias necesarias:

- NestJS
- Prisma
- nodemailer
- class-validator
- y más...

---

## 🗄️ Paso 2: Configurar Supabase (Base de Datos)

### 2.1 Crear cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en **"Start your project"**
3. Crea una cuenta con tu correo o GitHub

### 2.2 Crear un nuevo proyecto

1. En el Dashboard, haz clic en **"New Project"**
2. Completa los datos:
   - **Name**: `museo-reservas` (o el nombre que prefieras)
   - **Database Password**: Guarda esta contraseña (la necesitarás)
   - **Region**: Selecciona la más cercana a tu ubicación
3. Haz clic en **"Create new project"**
4. Espera 1-2 minutos mientras se crea el proyecto

### 2.3 Obtener la URL de conexión

1. En el panel izquierdo, ve a **Settings** ⚙️
2. Haz clic en **Database**
3. Busca la sección **"Connection string"**
4. Selecciona **"URI"** o **"Transaction Pooling"** (recomendado)
5. Copia la URL completa (similar a):

```
postgresql://postgres.abcdefgh:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

**⚠️ IMPORTANTE:** Reemplaza `[YOUR-PASSWORD]` con la contraseña que creaste

---

## 🔑 Paso 3: Configurar Variables de Entorno

### 3.1 Crear archivo .env

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

O créalo manualmente con el siguiente contenido:

### 3.2 Editar .env

Abre el archivo `.env` y configura:

```env
# === BASE DE DATOS ===
DATABASE_URL="postgresql://postgres.abcdefgh:TU_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# === APLICACIÓN ===
PORT=3000
NODE_ENV=development

# === CORREO ELECTRÓNICO (Gmail) ===
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tucorreo@gmail.com
MAIL_PASSWORD=abcd efgh ijkl mnop
MAIL_FROM="Museo Reservas <tucorreo@gmail.com>"

# === ADMINISTRACIÓN ===
ADMIN_EMAIL=admin@museo.com

# === CONFIGURACIÓN DEL MUSEO ===
MUSEO_NOMBRE="Museo de Historia Natural"
MUSEO_DIRECCION="Av. Principal #123, Ciudad"
MUSEO_TELEFONO="+123456789"
MUSEO_MAX_PERSONAS_POR_HORARIO=10
```

### 3.3 Configurar correo de Gmail

Para que el sistema pueda enviar correos, necesitas:

#### Opción A: Usar Gmail (Recomendado)

1. Ve a tu cuenta de Google: [https://myaccount.google.com](https://myaccount.google.com)
2. En el menú lateral, haz clic en **"Seguridad"**
3. Activa la **"Verificación en 2 pasos"** (si no la tienes)
4. Una vez activada, busca **"Contraseñas de aplicaciones"**
5. Genera una nueva contraseña:
   - **Selecciona app:** Correo
   - **Selecciona dispositivo:** Otro (nombre personalizado)
   - **Nombre:** "Museo API"
6. Google generará una contraseña de 16 caracteres (ejemplo: `abcd efgh ijkl mnop`)
7. Copia esa contraseña y pégala en `MAIL_PASSWORD` del archivo `.env`

#### Opción B: Usar otro servicio de correo

Si usas otro proveedor (Outlook, Yahoo, etc.), consulta su documentación SMTP.

---

## 🗃️ Paso 4: Crear la Base de Datos

Ahora vamos a crear las tablas en la base de datos usando Prisma:

### 4.1 Generar el cliente de Prisma

```bash
npm run prisma:generate
```

### 4.2 Ejecutar las migraciones

```bash
npm run prisma:migrate
```

Te pedirá un nombre para la migración, escribe: `init`

Si todo sale bien, verás:

```
✔ Generated Prisma Client
Your database is now in sync with your schema.
```

### 4.3 (Opcional) Ver la base de datos

Para ver las tablas creadas visualmente:

```bash
npm run prisma:studio
```

Esto abrirá una interfaz web en `http://localhost:5555`

---

## ▶️ Paso 5: Ejecutar la Aplicación

### Modo desarrollo (recomendado para pruebas)

```bash
npm run start:dev
```

Verás en la consola:

```
🚀 API del Museo ejecutándose en: http://localhost:3000
📊 Base de datos: PostgreSQL (Supabase)
```

### Modo producción

```bash
# Compilar
npm run build

# Ejecutar
npm run start:prod
```

---

## ✅ Paso 6: Probar la API

### 6.1 Verificar que funciona

Abre tu navegador y ve a:

```
http://localhost:3000
```

Deberías ver un JSON con información de la API.

### 6.2 Probar el endpoint de salud

```
http://localhost:3000/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "timestamp": "2026-03-07T...",
  "service": "Museo API"
}
```

### 6.3 Probar horarios disponibles

```
http://localhost:3000/horarios/disponibles?fecha=2026-03-15
```

Respuesta esperada:

```json
[
  {
    "hora": "09:00",
    "cuposDisponibles": 10,
    "cuposOcupados": 0,
    "total": 10
  },
  ...
]
```

---

## 🧪 Paso 7: Probar con Postman o Thunder Client

### Instalar Thunder Client (VS Code)

1. En VS Code, ve a **Extensiones** (Ctrl+Shift+X)
2. Busca **"Thunder Client"**
3. Instala la extensión

### Crear una reserva de prueba

1. Abre Thunder Client
2. Crea una nueva petición **POST**
3. URL: `http://localhost:3000/reservas`
4. Body (JSON):

```json
{
  "nombreResponsable": "Juan Pérez",
  "cedula": "1234567890",
  "correo": "juan@email.com",
  "telefono": "3001234567",
  "fecha": "2026-03-15",
  "hora": "10:00",
  "numeroPersonas": 5,
  "visitantes": [
    {
      "nombre": "Juan Pérez",
      "cedula": "1234567890"
    },
    {
      "nombre": "María López",
      "cedula": "0987654321"
    }
  ]
}
```

5. Haz clic en **Send**

Si todo está correcto, recibirás:

```json
{
  "estado": "confirmado",
  "idReserva": "clx123abc456",
  "mensaje": "Reserva confirmada exitosamente..."
}
```

Y se enviarán los correos automáticamente.

---

## 🐛 Solución de Problemas

### Error: "Can't reach database server"

**Causa:** La URL de Supabase es incorrecta o el proyecto está pausado.

**Solución:**

- Verifica que la URL en `.env` sea correcta
- Verifica que Supabase esté activo (puede pausarse por inactividad)
- Ve al Dashboard de Supabase y asegúrate de que el proyecto esté en verde

### Error: "Invalid login: 535 Authentication failed"

**Causa:** Las credenciales de correo son incorrectas.

**Solución:**

- Si usas Gmail, asegúrate de usar la **Contraseña de aplicación** (no tu contraseña normal)
- Verifica que la verificación en 2 pasos esté activa
- Regenera una nueva contraseña de aplicación

### Error: "Port 3000 is already in use"

**Causa:** Ya hay algo corriendo en el puerto 3000.

**Solución:**

- Cambia el puerto en `.env`: `PORT=3001`
- O mata el proceso que usa el puerto 3000

### Los correos no se envían

**Solución temporal:**

- Los correos se envían en segundo plano
- Revisa la consola para ver errores
- Puedes desactivar el envío temporalmente comentando la línea en `reservas.controller.ts`

---

## 🎉 ¡Listo!

Tu API está funcionando correctamente. Ahora puedes:

1. ✅ Consultar horarios disponibles
2. ✅ Crear reservas
3. ✅ Recibir correos de confirmación
4. ✅ Ver reservas desde el panel admin
5. ✅ Cancelar reservas
6. ✅ Registrar feedback

---

## 📚 Próximos pasos

- Lee el archivo `EJEMPLOS.md` para ver todos los ejemplos de uso
- Revisa el `README.md` para la documentación completa
- Integra la API con tu frontend

---

**¿Necesitas ayuda?** Revisa los logs en la consola o contacta al desarrollador.
