# ⚡ Inicio Rápido

¿Primera vez usando la API? Sigue estos pasos:

---

## 🚀 5 Pasos para Empezar

### 1️⃣ Instalar dependencias (2 minutos)

```bash
npm install
```

### 2️⃣ Configurar Supabase (5 minutos)

1. Ve a [supabase.com](https://supabase.com)
2. Crea un proyecto gratuito
3. Copia la **Connection String** desde Settings → Database

### 3️⃣ Configurar variables de entorno (2 minutos)

Crea un archivo `.env` con:

```env
DATABASE_URL="postgresql://postgres.xxx:TU_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
MAIL_USER=tucorreo@gmail.com
MAIL_PASSWORD=tu-password-de-app
ADMIN_EMAIL=admin@museo.com
PORT=3000
```

**Para Gmail:**

- Genera una "Contraseña de aplicación" en tu cuenta de Google
- [Guía aquí](https://support.google.com/accounts/answer/185833)

### 4️⃣ Crear la base de datos (1 minuto)

```bash
npm run prisma:generate
npm run prisma:migrate
```

Cuando te pida un nombre, escribe: `init`

### 5️⃣ Ejecutar (30 segundos)

```bash
npm run start:dev
```

Abre: http://localhost:3000

---

## ✅ ¿Funcionó?

Prueba este endpoint en tu navegador:

```
http://localhost:3000/horarios/disponibles?fecha=2026-03-15
```

Deberías ver una lista de horarios con disponibilidad.

---

## 🎯 Próximos Pasos

1. Lee [INSTALACION.md](./INSTALACION.md) para detalles completos
2. Explora [EJEMPLOS.md](./EJEMPLOS.md) para ver todos los endpoints
3. Consulta [COMANDOS.md](./COMANDOS.md) si algo falla

---

## 🆘 Problemas Comunes

### No conecta con Supabase

- Verifica que la URL en `.env` sea correcta
- Asegúrate de que el proyecto en Supabase esté activo (verde)

### No se envían correos

- Usa una **Contraseña de aplicación** de Google (no tu contraseña normal)
- Verifica que la verificación en 2 pasos esté activa

### Puerto en uso

- Cambia `PORT=3001` en `.env`

---

## 📚 Documentación Completa

- **[README.md](./README.md)** - Documentación general
- **[INSTALACION.md](./INSTALACION.md)** - Guía paso a paso
- **[EJEMPLOS.md](./EJEMPLOS.md)** - Ejemplos de todos los endpoints
- **[COMANDOS.md](./COMANDOS.md)** - Comandos útiles y troubleshooting

---

**¡Listo para crear reservas! 🎉**
