# 📝 Ejemplos de Uso de la API

Esta guía contiene ejemplos prácticos de todos los endpoints de la API.

---

## 🔗 Base URL

```
http://localhost:3000
```

---

## 📋 Tabla de Contenidos

1. [Horarios](#1-horarios)
2. [Reservas](#2-reservas)
3. [Administración](#3-administración)
4. [Feedback](#4-feedback)

---

## 1. 🕐 Horarios

### 1.1 Consultar horarios disponibles

**Endpoint:** `GET /horarios/disponibles`

**Query Parameters:**

- `fecha` (required): Fecha en formato YYYY-MM-DD

**Ejemplo:**

```http
GET http://localhost:3000/horarios/disponibles?fecha=2026-03-15
```

**Respuesta exitosa (200):**

```json
[
  {
    "hora": "09:00",
    "cuposDisponibles": 10,
    "cuposOcupados": 0,
    "total": 10
  },
  {
    "hora": "10:00",
    "cuposDisponibles": 6,
    "cuposOcupados": 4,
    "total": 10
  },
  {
    "hora": "11:00",
    "cuposDisponibles": 0,
    "cuposOcupados": 10,
    "total": 10
  }
]
```

### 1.2 Verificar disponibilidad específica

**Endpoint:** `GET /horarios/verificar`

**Query Parameters:**

- `fecha` (required): YYYY-MM-DD
- `hora` (required): HH:mm
- `personas` (required): número

**Ejemplo:**

```http
GET http://localhost:3000/horarios/verificar?fecha=2026-03-15&hora=10:00&personas=5
```

**Respuesta exitosa:**

```json
{
  "disponible": true,
  "mensaje": "Horario disponible",
  "cuposDisponibles": 6
}
```

**Respuesta sin disponibilidad:**

```json
{
  "disponible": false,
  "mensaje": "Solo hay 3 cupos disponibles",
  "cuposDisponibles": 3
}
```

---

## 2. 📝 Reservas

### 2.1 Crear una reserva

**Endpoint:** `POST /reservas`

**Body (JSON):**

```json
{
  "nombreResponsable": "Juan Pérez García",
  "cedula": "1234567890",
  "correo": "juan.perez@email.com",
  "telefono": "+57 300 123 4567",
  "fecha": "2026-03-15",
  "hora": "10:00",
  "numeroPersonas": 5,
  "visitantes": [
    {
      "nombre": "Juan Pérez García",
      "cedula": "1234567890"
    },
    {
      "nombre": "María López Ramírez",
      "cedula": "0987654321"
    },
    {
      "nombre": "Carlos Pérez López",
      "cedula": "1122334455"
    },
    {
      "nombre": "Ana Martínez Silva",
      "cedula": "5544332211"
    },
    {
      "nombre": "Luis González Torres",
      "cedula": "9988776655"
    }
  ]
}
```

**Respuesta exitosa (201):**

```json
{
  "estado": "confirmado",
  "idReserva": "clx7a8b9c0d1e2f3g4h5",
  "mensaje": "Reserva confirmada exitosamente. Recibirás un correo de confirmación.",
  "reserva": {
    "id": "clx7a8b9c0d1e2f3g4h5",
    "fecha": "2026-03-15T00:00:00.000Z",
    "hora": "10:00",
    "numeroPersonas": 5,
    "responsable": "Juan Pérez García"
  }
}
```

**Errores comunes:**

```json
// Horario lleno
{
  "statusCode": 400,
  "message": "Solo hay 3 cupos disponibles",
  "error": "Bad Request"
}

// Fecha pasada
{
  "statusCode": 400,
  "message": "No se pueden hacer reservas para fechas pasadas",
  "error": "Bad Request"
}

// Validación fallida
{
  "statusCode": 400,
  "message": [
    "correo must be an email"
  ],
  "error": "Bad Request"
}
```

### 2.2 Obtener una reserva por ID

**Endpoint:** `GET /reservas/:id`

**Ejemplo:**

```http
GET http://localhost:3000/reservas/clx7a8b9c0d1e2f3g4h5
```

**Respuesta exitosa:**

```json
{
  "id": "clx7a8b9c0d1e2f3g4h5",
  "nombreResponsable": "Juan Pérez García",
  "cedula": "1234567890",
  "correo": "juan.perez@email.com",
  "telefono": "+57 300 123 4567",
  "fecha": "2026-03-15T00:00:00.000Z",
  "hora": "10:00",
  "numeroPersonas": 5,
  "estado": "CONFIRMADO",
  "visitantes": [
    {
      "id": "clx...",
      "nombre": "Juan Pérez García",
      "cedula": "1234567890",
      "reservaId": "clx7a8b9c0d1e2f3g4h5",
      "createdAt": "2026-03-07T..."
    }
  ],
  "feedback": null,
  "createdAt": "2026-03-07T...",
  "updatedAt": "2026-03-07T..."
}
```

---

## 3. 🔐 Administración

### 3.1 Consultar reservas por fecha

**Endpoint:** `GET /admin/reservas`

**Query Parameters:**

- `fecha` (required): YYYY-MM-DD

**Ejemplo:**

```http
GET http://localhost:3000/admin/reservas?fecha=2026-03-15
```

**Respuesta exitosa:**

```json
[
  {
    "id": "clx7a8b9c0d1e2f3g4h5",
    "hora": "09:00",
    "responsable": "Juan Pérez García",
    "cedula": "1234567890",
    "personas": 5,
    "telefono": "+57 300 123 4567",
    "correo": "juan.perez@email.com",
    "estado": "CONFIRMADO",
    "visitantes": 5,
    "createdAt": "2026-03-07T..."
  },
  {
    "id": "clx...",
    "hora": "10:00",
    "responsable": "Colegio ABC",
    "cedula": "9876543210",
    "personas": 10,
    "telefono": "+57 300 987 6543",
    "correo": "colegio@abc.edu",
    "estado": "CONFIRMADO",
    "visitantes": 10,
    "createdAt": "2026-03-07T..."
  }
]
```

### 3.2 Ver detalle de una reserva

**Endpoint:** `GET /admin/reservas/:id`

**Ejemplo:**

```http
GET http://localhost:3000/admin/reservas/clx7a8b9c0d1e2f3g4h5
```

**Respuesta:** Igual que `GET /reservas/:id`

### 3.3 Cancelar una reserva

**Endpoint:** `PATCH /admin/reservas/:id/cancelar`

**Ejemplo:**

```http
PATCH http://localhost:3000/admin/reservas/clx7a8b9c0d1e2f3g4h5/cancelar
```

**Respuesta exitosa:**

```json
{
  "mensaje": "Reserva cancelada exitosamente",
  "cuposLiberados": 5,
  "estado": "cancelado"
}
```

### 3.4 Obtener estadísticas generales

**Endpoint:** `GET /admin/estadisticas`

**Ejemplo:**

```http
GET http://localhost:3000/admin/estadisticas
```

**Respuesta:**

```json
{
  "reservas": {
    "total": 45,
    "confirmadas": 38,
    "canceladas": 7
  },
  "visitantes": {
    "total": 234
  },
  "feedback": {
    "total": 28,
    "promedioCalificacion": 4.5
  }
}
```

### 3.5 Resumen de próximos días

**Endpoint:** `GET /admin/resumen-proximos-dias`

**Query Parameters:**

- `dias` (optional): Número de días (1-30, default: 7)

**Ejemplo:**

```http
GET http://localhost:3000/admin/resumen-proximos-dias?dias=7
```

**Respuesta:**

```json
[
  {
    "fecha": "2026-03-15",
    "totalPersonas": 45
  },
  {
    "fecha": "2026-03-16",
    "totalPersonas": 32
  },
  {
    "fecha": "2026-03-17",
    "totalPersonas": 28
  }
]
```

---

## 4. ⭐ Feedback

### 4.1 Registrar feedback

**Endpoint:** `POST /feedback`

**Body (JSON):**

```json
{
  "idReserva": "clx7a8b9c0d1e2f3g4h5",
  "calificacion": 5,
  "comentario": "Excelente experiencia. El museo es hermoso y el personal muy amable. Recomendado 100%."
}
```

**Validaciones:**

- `calificacion`: número entre 1 y 5
- `comentario`: opcional, entre 10 y 500 caracteres

**Respuesta exitosa:**

```json
{
  "estado": "guardado",
  "mensaje": "¡Gracias por tu feedback!",
  "feedback": {
    "id": "clx...",
    "calificacion": 5,
    "fecha": "2026-03-15T..."
  }
}
```

**Errores comunes:**

```json
// Reserva no encontrada
{
  "statusCode": 404,
  "message": "Reserva no encontrada",
  "error": "Not Found"
}

// Feedback ya registrado
{
  "statusCode": 409,
  "message": "Ya se ha registrado feedback para esta reserva",
  "error": "Conflict"
}

// Fecha futura
{
  "statusCode": 400,
  "message": "No se puede enviar feedback antes de la fecha de la visita",
  "error": "Bad Request"
}
```

### 4.2 Obtener todos los feedbacks

**Endpoint:** `GET /feedback`

**Ejemplo:**

```http
GET http://localhost:3000/feedback
```

**Respuesta:**

```json
[
  {
    "id": "clx...",
    "reservaId": "clx7a8b9c0d1e2f3g4h5",
    "calificacion": 5,
    "comentario": "Excelente experiencia...",
    "createdAt": "2026-03-15T...",
    "reserva": {
      "nombreResponsable": "Juan Pérez García",
      "fecha": "2026-03-15T00:00:00.000Z",
      "hora": "10:00"
    }
  }
]
```

### 4.3 Obtener feedback de una reserva

**Endpoint:** `GET /feedback/reserva/:reservaId`

**Ejemplo:**

```http
GET http://localhost:3000/feedback/reserva/clx7a8b9c0d1e2f3g4h5
```

**Respuesta:** Objeto de feedback individual

### 4.4 Estadísticas de feedback

**Endpoint:** `GET /feedback/estadisticas`

**Ejemplo:**

```http
GET http://localhost:3000/feedback/estadisticas
```

**Respuesta:**

```json
{
  "total": 28,
  "promedioCalificacion": 4.5,
  "distribucion": [
    {
      "estrellas": 5,
      "cantidad": 18
    },
    {
      "estrellas": 4,
      "cantidad": 8
    },
    {
      "estrellas": 3,
      "cantidad": 2
    }
  ]
}
```

---

## 🧪 Colección de Postman/Thunder Client

### Importar colección

Puedes crear una colección con todos estos endpoints. Aquí un ejemplo de configuración:

**Variables de entorno:**

```json
{
  "base_url": "http://localhost:3000",
  "fecha_prueba": "2026-03-15",
  "reserva_id": "clx7a8b9c0d1e2f3g4h5"
}
```

---

## 🔄 Flujo completo de uso

### Caso 1: Usuario hace una reserva

1. **Consulta horarios disponibles:**

   ```
   GET /horarios/disponibles?fecha=2026-03-15
   ```

2. **Crea la reserva:**

   ```
   POST /reservas
   (con datos del formulario)
   ```

3. **Recibe correo de confirmación automáticamente**

4. **Después de la visita, envía feedback:**
   ```
   POST /feedback
   {
     "idReserva": "...",
     "calificacion": 5,
     "comentario": "..."
   }
   ```

### Caso 2: Administrador revisa reservas

1. **Ve las reservas del día:**

   ```
   GET /admin/reservas?fecha=2026-03-15
   ```

2. **Si necesita, cancela una reserva:**

   ```
   PATCH /admin/reservas/:id/cancelar
   ```

3. **Revisa estadísticas:**
   ```
   GET /admin/estadisticas
   GET /feedback/estadisticas
   ```

---

## 💡 Tips

- Usa `fecha` siempre en formato ISO: `YYYY-MM-DD`
- La `hora` debe estar en formato 24h: `HH:mm` (ej: `14:00`)
- Los IDs de reserva son strings largos (cuid): `clx7a8b9c0d1e2f3g4h5`
- La calificación de feedback es un número del 1 al 5

---

**¡Listo para integrar!** 🚀
