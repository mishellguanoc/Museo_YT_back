# 🏛️ Sistema de Reservas para Museo - Backend API

API REST desarrollada con **NestJS + Prisma + PostgreSQL (Supabase)** para gestionar reservas de visitas al museo.

## 📋 Características

- ✅ Gestión de horarios y disponibilidad (máx. 10 personas/horario)
- ✅ Sistema completo de reservas con validaciones
- ✅ Notificaciones por correo electrónico (visitante + admin)
- ✅ Panel administrativo (consultar y cancelar reservas)
- ✅ Sistema de feedback post-visita
- ✅ Validación de datos con class-validator
- ✅ Base de datos PostgreSQL en Supabase (gratis)

---

## 🚀 Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase PostgreSQL

#### Crear proyecto en Supabase:

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Ve a **Settings > Database**
5. Copia la **Connection String** (modo Pooling recomendado)

#### Ejemplo de URL:

```
postgresql://postgres.xxxx:password@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### 3. Configurar variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita `.env` y configura:

```env
# Pega tu URL de Supabase aquí
DATABASE_URL="postgresql://..."

# Configuración de correo (Gmail)
MAIL_USER=tucorreo@gmail.com
MAIL_PASSWORD=tu-password-app

# Email del administrador
ADMIN_EMAIL=admin@museo.com
```

**⚠️ Importante para Gmail:**

- Habilita la verificación en 2 pasos
- Genera una "Contraseña de aplicación" desde tu cuenta de Google
- Usa esa contraseña en `MAIL_PASSWORD`

### 4. Crear la base de datos con Prisma

```bash
# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones (crear tablas)
npm run prisma:migrate

# (Opcional) Ver base de datos visualmente
npm run prisma:studio
```

### 5. Ejecutar la aplicación

```bash
# Modo desarrollo
npm run start:dev

# La API estará disponible en: http://localhost:3000
```

---

## 📚 Endpoints de la API

### 🟢 Públicos (Sin autenticación)

#### 1. Consultar horarios disponibles

```http
GET /horarios/disponibles?fecha=2026-03-15
```

**Respuesta:**

```json
[
  {
    "hora": "09:00",
    "cuposDisponibles": 6
  },
  {
    "hora": "10:00",
    "cuposDisponibles": 10
  }
]
```

#### 2. Crear una reserva

```http
POST /reservas
Content-Type: application/json

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

**Respuesta exitosa:**

```json
{
  "estado": "confirmado",
  "idReserva": "clx123abc456",
  "mensaje": "Reserva confirmada. Recibirás un correo de confirmación."
}
```

#### 3. Registrar feedback

```http
POST /feedback
Content-Type: application/json

{
  "idReserva": "clx123abc456",
  "calificacion": 5,
  "comentario": "Excelente experiencia, muy recomendado"
}
```

---

### 🔴 Administrativos

#### 4. Consultar reservas por fecha

```http
GET /admin/reservas?fecha=2026-03-15
```

**Respuesta:**

```json
[
  {
    "id": "clx123abc456",
    "hora": "09:00",
    "responsable": "Juan Pérez",
    "personas": 5,
    "telefono": "3001234567",
    "correo": "juan@email.com",
    "estado": "confirmado"
  }
]
```

#### 5. Cancelar una reserva

```http
PATCH /admin/reservas/:id/cancelar
```

**Respuesta:**

```json
{
  "mensaje": "Reserva cancelada exitosamente",
  "cuposLiberados": 5
}
```

---

## 🗄️ Estructura de la Base de Datos

### Tabla: `Reserva`

| Campo             | Tipo     | Descripción                |
| ----------------- | -------- | -------------------------- |
| id                | String   | ID único (UUID)            |
| nombreResponsable | String   | Persona responsable        |
| cedula            | String   | Cédula del responsable     |
| correo            | String   | Email de contacto          |
| telefono          | String   | Teléfono                   |
| fecha             | DateTime | Fecha de la visita         |
| hora              | String   | Hora (09:00, 10:00, etc.)  |
| numeroPersonas    | Int      | Cantidad de visitantes     |
| estado            | Enum     | `confirmado` / `cancelado` |
| createdAt         | DateTime | Fecha de creación          |

### Tabla: `Visitante`

| Campo     | Tipo   | Relación        |
| --------- | ------ | --------------- |
| id        | String | ID único        |
| nombre    | String | Nombre completo |
| cedula    | String | Documento       |
| reservaId | String | FK → Reserva    |

### Tabla: `Feedback`

| Campo        | Tipo     | Descripción           |
| ------------ | -------- | --------------------- |
| id           | String   | ID único              |
| reservaId    | String   | FK → Reserva          |
| calificacion | Int      | 1-5 estrellas         |
| comentario   | String   | Opinión del visitante |
| createdAt    | DateTime | Fecha de envío        |

---

## 📧 Sistema de Correos

### Email al visitante:

- Confirmación de reserva
- Fecha y hora
- Número de personas
- Dirección e indicaciones del museo

### Email al administrador:

- Notificación de nueva reserva
- Datos del responsable
- Detalles de contacto

---

## 🛠️ Scripts Útiles

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Ver base de datos
npm run prisma:studio

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Formatear código
npm run format
```

---

## 📦 Estructura del Proyecto

```
src/
├── main.ts                    # Punto de entrada
├── app.module.ts              # Módulo principal
├── horarios/                  # Módulo de disponibilidad
│   ├── horarios.controller.ts
│   ├── horarios.service.ts
│   └── horarios.module.ts
├── reservas/                  # Módulo de reservas
│   ├── reservas.controller.ts
│   ├── reservas.service.ts
│   ├── reservas.module.ts
│   └── dto/
│       └── create-reserva.dto.ts
├── admin/                     # Módulo administrativo
│   ├── admin.controller.ts
│   ├── admin.service.ts
│   └── admin.module.ts
├── feedback/                  # Módulo de retroalimentación
│   ├── feedback.controller.ts
│   ├── feedback.service.ts
│   └── feedback.module.ts
├── mail/                      # Servicio de correos
│   ├── mail.service.ts
│   └── mail.module.ts
├── prisma/                    # Servicio de Prisma
│   ├── prisma.service.ts
│   └── prisma.module.ts
└── common/                    # Utilidades compartidas
    └── constants.ts

prisma/
├── schema.prisma              # Esquema de base de datos
└── migrations/                # Historial de migraciones
```

---

## 🎯 Próximos pasos

1. ✅ Instalar dependencias
2. ✅ Configurar Supabase
3. ✅ Configurar `.env`
4. ✅ Ejecutar migraciones
5. ✅ Ejecutar la aplicación
6. ⏳ Probar endpoints con Postman/Thunder Client
7. ⏳ Integrar con el frontend

---

## 📞 Soporte

Para dudas o problemas:

- Revisa los logs en la consola
- Verifica que Supabase esté activo
- Comprueba la configuración de correo

---

**¡Listo para usar! 🚀**
