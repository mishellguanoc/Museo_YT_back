# 🛠️ Comandos Útiles y Troubleshooting

Referencia rápida de comandos y soluciones a problemas comunes.

---

## 📦 Instalación y Configuración

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Ver base de datos en navegador
npm run prisma:studio
```

---

## ▶️ Ejecutar la Aplicación

```bash
# Desarrollo (con hot-reload)
npm run start:dev

# Producción (compilado)
npm run build
npm run start:prod

# Debug
npm run start:debug
```

---

## 🗄️ Prisma - Comandos

```bash
# Ver el esquema en navegador
npx prisma studio

# Crear una nueva migración
npx prisma migrate dev --name nombre_de_migracion

# Resetear la base de datos (⚠️ BORRA TODO)
npx prisma migrate reset

# Formatear schema.prisma
npx prisma format

# Generar cliente después de cambios en schema
npx prisma generate

# Ver el estado de migraciones
npx prisma migrate status
```

---

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:cov

# Tests en modo watch
npm run test:watch
```

---

## 🔍 Linting y Formato

```bash
# Formatear código
npm run format

# Ejecutar linter
npm run lint
```

---

## 🐛 Solución de Problemas

### ❌ Error: "Can't reach database server"

**Síntomas:**

```
Error: P1001: Can't reach database server at XXX
```

**Soluciones:**

1. **Verifica la URL de Supabase:**

   ```bash
   # En .env, asegúrate de que DATABASE_URL sea correcta
   echo $DATABASE_URL  # Linux/Mac
   # o
   echo %DATABASE_URL%  # Windows CMD
   ```

2. **Verifica que Supabase esté activo:**
   - Ve a https://supabase.com/dashboard
   - Verifica que tu proyecto esté en estado "Active" (verde)
   - Los proyectos gratuitos se pausan después de 1 semana sin uso

3. **Prueba la conexión:**
   ```bash
   npx prisma db pull
   ```

---

### ❌ Error: "Invalid `prisma.XXX.findMany()` invocation"

**Síntomas:**

```
Invalid `prisma.reserva.findMany()` invocation
```

**Solución:**

```bash
# Regenerar el cliente de Prisma
npm run prisma:generate
```

---

### ❌ Error: "Port 3000 is already in use"

**Síntomas:**

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Soluciones:**

1. **Cambiar el puerto:**

   ```env
   # En .env
   PORT=3001
   ```

2. **Matar el proceso (Windows):**

   ```bash
   # Encontrar el proceso
   netstat -ano | findstr :3000

   # Matar el proceso (reemplaza PID)
   taskkill /PID <número_proceso> /F
   ```

3. **Matar el proceso (Linux/Mac):**
   ```bash
   # Encontrar y matar
   lsof -ti:3000 | xargs kill -9
   ```

---

### ❌ Error de correo: "Invalid login: 535 Authentication failed"

**Síntomas:**

```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Soluciones:**

1. **Gmail - Usar Contraseña de Aplicación:**
   - NO uses tu contraseña de Gmail normal
   - Genera una "Contraseña de aplicación" desde tu cuenta de Google
   - Guía: https://support.google.com/accounts/answer/185833

2. **Verifica las credenciales:**

   ```env
   MAIL_USER=tucorreo@gmail.com
   MAIL_PASSWORD=abcd efgh ijkl mnop  # 16 caracteres de Google
   ```

3. **Prueba con un script:**

   ```javascript
   // test-mail.js
   const nodemailer = require('nodemailer');

   const transporter = nodemailer.createTransport({
     host: 'smtp.gmail.com',
     port: 587,
     secure: false,
     auth: {
       user: 'tucorreo@gmail.com',
       pass: 'tu-password-app',
     },
   });

   transporter.verify((error, success) => {
     if (error) console.log('Error:', error);
     else console.log('✓ Servidor listo para enviar correos');
   });
   ```

---

### ❌ Error: "Cannot find module"

**Síntomas:**

```
Error: Cannot find module '@nestjs/common'
```

**Solución:**

```bash
# Borrar node_modules y reinstalar
rm -rf node_modules package-lock.json  # Linux/Mac
# o
rmdir /s node_modules && del package-lock.json  # Windows

npm install
```

---

### ❌ Migraciones no se aplican

**Solución:**

```bash
# Resetear migraciones (⚠️ BORRA DATOS)
npx prisma migrate reset

# Crear nueva migración limpia
npx prisma migrate dev --name init
```

---

## 🔄 Reset Completo (Desarrollo)

Si algo sale muy mal, puedes resetear todo:

```bash
# 1. Borrar dependencias
rm -rf node_modules package-lock.json

# 2. Reinstalar
npm install

# 3. Regenerar Prisma
npm run prisma:generate

# 4. Resetear base de datos
npx prisma migrate reset

# 5. Aplicar migraciones
npm run prisma:migrate

# 6. Ejecutar
npm run start:dev
```

---

## 📊 Ver logs en producción

```bash
# Ver logs en tiempo real
npm run start:prod | tee logs.txt

# Ver solo errores
npm run start:prod 2>&1 | grep -i error
```

---

## 🔐 Variables de Entorno

### Verificar que estén cargadas

Crea un script temporal `check-env.js`:

```javascript
require('dotenv').config();

console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✓ Configurada' : '✗ No configurada');
console.log('MAIL_USER:', process.env.MAIL_USER ? '✓ Configurada' : '✗ No configurada');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL ? '✓ Configurada' : '✗ No configurada');
```

Ejecuta:

```bash
node check-env.js
```

---

## 🚀 Despliegue

### Variables de entorno en producción

No subas el archivo `.env` a Git. En su lugar:

1. **Railway:**
   - Ve a tu proyecto → Variables
   - Agrega cada variable manualmente

2. **Render:**
   - Environment → Add Environment Variable

3. **Vercel:**
   ```bash
   vercel env add DATABASE_URL
   ```

### Build para producción

```bash
# Compilar
npm run build

# La carpeta dist/ contiene el código compilado
# Ejecutar:
cd dist
node main.js
```

---

## 📝 Logs personalizados

Agrega logs para debugging:

```typescript
// En cualquier servicio
console.log('🔍 Datos recibidos:', datos);
console.error('❌ Error al procesar:', error);
console.warn('⚠️ Advertencia:', mensaje);
```

---

## 🧹 Limpieza

```bash
# Borrar archivos compilados
rm -rf dist

# Borrar cache de NestJS
rm -rf dist .nest

# Limpiar todo (excepto código fuente)
npm run clean  # Si tienes el script configurado
```

---

## 🔧 Extensiones de VS Code Recomendadas

- **Prisma** (prisma.prisma)
- **Thunder Client** (rangav.vscode-thunder-client)
- **ESLint** (dbaeumer.vscode-eslint)
- **Prettier** (esbenp.prettier-vscode)

---

## 📚 Recursos Adicionales

- **NestJS Docs:** https://docs.nestjs.com
- **Prisma Docs:** https://www.prisma.io/docs
- **Supabase Docs:** https://supabase.com/docs
- **Nodemailer Docs:** https://nodemailer.com

---

**¿Problema no resuelto?** Revisa los logs completos en la consola y busca el mensaje de error específico.
