# 🔐 Cambios de Autenticación JWT Implementados

## ✅ Lo que se ha hecho:

### 1. **Schema Prisma Actualizado**
- ✅ Se agregó tabla `Admin` con campos:
  - `usuario` (único)
  - `password` (será hasheado)
  - `nombre`
  - Timestamps (createdAt, updatedAt)

### 2. **Dependencias Instaladas**
- ✅ `@nestjs/jwt` - Generación y validación de tokens
- ✅ `@nestjs/passport` - Estrategias de autenticación
- ✅ `passport-jwt` - Estrategia JWT
- ✅ `bcrypt` - Hashing de contraseñas

### 3. **Módulo de Autenticación**
Se creó en `/src/auth/`:
- ✅ `auth.service.ts` - Lógica de login y validación
- ✅ `auth.controller.ts` - Endpoint POST /auth/login
- ✅ `jwt.strategy.ts` - Estrategia de validación JWT
- ✅ `jwt-auth.guard.ts` - Guard que protege endpoints
- ✅ `auth.module.ts` - Módulo completo

### 4. **Protección del Admin Controller**
- ✅ Se agregó `@UseGuards(JwtAuthGuard)` al `AdminController`
- Esto significa que TODOS los endpoints de admin requieren token válido

---

## 🚀 Próximos Pasos:

### 1. **Instalar dependencias**
```bash
npm install
```

### 2. **Crear migration en Prisma**
```bash
npm run prisma:migrate
```
(Dale un nombre: "add_admin_table")

### 3. **Crear admin de prueba**
```bash
npm run prisma:seed
```
Esto crea un admin con:
- **Usuario:** admin@museo.com
- **Contraseña:** admin123
- **Nombre:** Administrador Principal

### 4. **Verificar variables de entorno**
Abre `.env` y asegúrate de tener:
```
JWT_SECRET="tu-clave-secreta-super-segura-cambiar-en-produccion"
```

---

## 🔓 Cómo usar la API:

### **LOGIN:**
```bash
POST /auth/login
Content-Type: application/json

{
  "usuario": "admin@museo.com",
  "password": "admin123"
}
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": {
    "id": "...",
    "usuario": "admin@museo.com",
    "nombre": "Administrador Principal"
  }
}
```

### **ACCEDER A ADMIN (con token):**
```bash
GET /admin/reservas?fecha=2026-03-15
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Sin el token o con un token inválido, recibirás: **401 Unauthorized**

---

## ⚠️ IMPORTANTE:

1. **Cambiar contraseña por defecto** en producción
2. **Cambiar JWT_SECRET** en `.env` por algo más seguro
3. **El token expira en 24 horas** (configurable en auth.module.ts)
4. El password siempre viaja **hasheado** con bcrypt, nunca en plano

---

## 📝 Para crear más admins:

Opción 1: Directamente en BD
```sql
INSERT INTO admins (id, usuario, password, nombre, "createdAt", "updatedAt")
VALUES (
  'new-id-123',
  'nuevo@museo.com',
  'hash-de-bcrypt-aqui',
  'Nuevo Admin',
  NOW(),
  NOW()
);
```

Opción 2: Agregar endpoint POST /auth/register (opcional, lo puedes implementar)

---

**¡Todo listo! Ahora solo instala dependencias y ejecuta las migraciones.** 🎉
