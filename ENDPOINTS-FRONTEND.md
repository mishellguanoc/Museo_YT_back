# 📱 Guía de Endpoints para el Frontend

## 🔐 1. AUTENTICACIÓN - Login del Admin

### Endpoint
```
POST /auth/login
```

### Headers
```
Content-Type: application/json
```

### Body (Request)
```json
{
  "usuario": "admin@museo.com",
  "password": "admin123"
}
```

### Respuesta Exitosa (200 OK)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbGoxMzQ1Nm9wMDAwMDAwMDAwMDAwMDAwIiwidXN1YXJpbyI6ImFkbWluQG11c2VvLmNvbSIsImlhdCI6MTcxNzUwMDAwMCwiZXhwIjoxNzE3NTg2NDAwfQ.xK9...",
  "admin": {
    "id": "clj13456op0000000000000000",
    "usuario": "admin@museo.com",
    "nombre": "Administrador Principal"
  }
}
```

### Respuesta Error - Credenciales Inválidas (401 Unauthorized)
```json
{
  "message": "Credenciales inválidas",
  "statusCode": 401
}
```

### Respuesta Error - Falta Usuario o Password (400 Bad Request)
```json
{
  "message": "Usuario y password son requeridos",
  "statusCode": 400
}
```

### 📌 Instrucciones para el Frontend

**1. Guardar el token después del login:**
```javascript
// En JavaScript/React
const login = async (usuario, password) => {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, password })
  });

  if (!response.ok) {
    throw new Error('Login fallido');
  }

  const data = await response.json();
  
  // Guardar el token en localStorage
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('admin', JSON.stringify(data.admin));
  
  return data;
};
```

**2. Guardar en sessionStorage (opcional, más seguro):**
```javascript
sessionStorage.setItem('access_token', data.access_token);
```

---

## 🛡️ 2. ENDPOINTS PROTEGIDOS (Requieren Token JWT)

> ⚠️ **IMPORTANTE:** Todos estos endpoints requieren el token en el header: 
> `Authorization: Bearer <access_token>`

### Template para todas las requests protegidas
```javascript
// Función helper para requests autenticados
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('access_token');
  
  return fetch(`http://localhost:3000${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });
};
```

---

## 📅 ENDPOINT: Obtener Reservas por Fecha

### Endpoint
```
GET /admin/reservas?fecha=2026-03-15
```

### Parameters
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| fecha | string | ✅ Sí | Formato: YYYY-MM-DD (ej: 2026-03-15) |

### Headers Requeridos
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Ejemplo de Request (JavaScript)
```javascript
const obtenerReservasPorFecha = async (fecha) => {
  const token = localStorage.getItem('access_token');

  const response = await fetch(
    `http://localhost:3000/admin/reservas?fecha=${fecha}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      console.error('Sesión expirada o token inválido');
      // Redirigir al login
    }
    throw new Error('Error al obtener reservas');
  }

  return response.json();
};

// Uso:
const reservas = await obtenerReservasPorFecha('2026-03-15');
console.log(reservas);
```

### Ejemplo de Request (cURL)
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
     "http://localhost:3000/admin/reservas?fecha=2026-03-15"
```

### Respuesta Exitosa (200 OK)
```json
[
  {
    "id": "clj134567op0000000000000001",
    "hora": "09:00",
    "responsable": "Juan García",
    "cedula": "1234567890",
    "personas": 5,
    "telefono": "+34 612 345 678",
    "correo": "juan@email.com",
    "estado": "CONFIRMADO",
    "visitantes": 5,
    "createdAt": "2026-03-14T10:30:00.000Z"
  },
  {
    "id": "clj134567op0000000000000002",
    "hora": "10:30",
    "responsable": "María López",
    "cedula": "0987654321",
    "personas": 3,
    "telefono": "+34 623 456 789",
    "correo": "maria@email.com",
    "estado": "CONFIRMADO",
    "visitantes": 3,
    "createdAt": "2026-03-14T11:15:00.000Z"
  }
]
```

### Respuesta Error - Formato de Fecha Inválido (400 Bad Request)
```json
{
  "message": "Formato de fecha inválido. Use YYYY-MM-DD",
  "statusCode": 400
}
```

### Respuesta Error - Token Inválido (401 Unauthorized)
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

---

## 🔍 ENDPOINT: Obtener Detalle de Una Reserva

### Endpoint
```
GET /admin/reservas/:id
```

### Parameters
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| id | string | ✅ Sí | ID de la reserva (ej: clj134567op0000000000000001) |

### Headers Requeridos
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Ejemplo de Request (JavaScript)
```javascript
const obtenerDetalleReserva = async (id) => {
  const token = localStorage.getItem('access_token');

  const response = await fetch(
    `http://localhost:3000/admin/reservas/${id}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) throw new Error('Error al obtener reserva');
  return response.json();
};

// Uso:
const detalle = await obtenerDetalleReserva('clj134567op0000000000000001');
```

### Respuesta Exitosa (200 OK)
```json
{
  "id": "clj134567op0000000000000001",
  "nombreResponsable": "Juan García",
  "cedula": "1234567890",
  "correo": "juan@email.com",
  "telefono": "+34 612 345 678",
  "fecha": "2026-03-15",
  "hora": "09:00",
  "numeroPersonas": 5,
  "estado": "CONFIRMADO",
  "visitantes": [
    {
      "id": "vis001",
      "nombre": "Juan García",
      "cedula": "1234567890"
    },
    {
      "id": "vis002",
      "nombre": "Pedro García",
      "cedula": "1234567891"
    }
  ],
  "feedback": null,
  "createdAt": "2026-03-14T10:30:00.000Z"
}
```

### Respuesta Error - Reserva No Encontrada (404 Not Found)
```json
{
  "message": "Reserva no encontrada",
  "statusCode": 404
}
```

---

## ❌ ENDPOINT: Cancelar una Reserva

### Endpoint
```
PATCH /admin/reservas/:id/cancelar
```

### Parameters
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| id | string | ✅ Sí | ID de la reserva a cancelar |

### Headers Requeridos
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Ejemplo de Request (JavaScript)
```javascript
const cancelarReserva = async (id) => {
  const token = localStorage.getItem('access_token');

  const response = await fetch(
    `http://localhost:3000/admin/reservas/${id}/cancelar`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) throw new Error('Error al cancelar reserva');
  return response.json();
};

// Uso:
await cancelarReserva('clj134567op0000000000000001');
```

### Respuesta Exitosa (200 OK)
```json
{
  "id": "clj134567op0000000000000001",
  "nombreResponsable": "Juan García",
  "cedula": "1234567890",
  "correo": "juan@email.com",
  "telefono": "+34 612 345 678",
  "fecha": "2026-03-15",
  "hora": "09:00",
  "numeroPersonas": 5,
  "estado": "CANCELADO",
  "visitantes": [...],
  "feedback": null,
  "createdAt": "2026-03-14T10:30:00.000Z"
}
```

---

## 📊 ENDPOINT: Obtener Estadísticas Generales

### Endpoint
```
GET /admin/estadisticas
```

### Headers Requeridos
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Ejemplo de Request (JavaScript)
```javascript
const obtenerEstadisticas = async () => {
  const token = localStorage.getItem('access_token');

  const response = await fetch(
    'http://localhost:3000/admin/estadisticas',
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) throw new Error('Error al obtener estadísticas');
  return response.json();
};

// Uso:
const stats = await obtenerEstadisticas();
```

### Respuesta Exitosa (200 OK)
```json
{
  "totalReservas": 150,
  "reservasConfirmadas": 120,
  "reservasCanceladas": 30,
  "totalVisitantes": 580,
  "reservasPorFecha": {
    "2026-03-15": 12,
    "2026-03-16": 8,
    "2026-03-17": 15
  },
  "horariosPopulares": {
    "09:00": 25,
    "10:00": 18,
    "11:00": 22
  }
}
```

---

## 📈 ENDPOINT: Obtener Resumen de Próximos Días

### Endpoint
```
GET /admin/resumen-proximos-dias?dias=7
```

### Parameters
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| dias | number | ❌ No | Número de días (1-30). Default: 7 |

### Headers Requeridos
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Ejemplo de Request (JavaScript)
```javascript
const obtenerResumenProximosDias = async (dias = 7) => {
  const token = localStorage.getItem('access_token');

  const response = await fetch(
    `http://localhost:3000/admin/resumen-proximos-dias?dias=${dias}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) throw new Error('Error al obtener resumen');
  return response.json();
};

// Uso:
const resumen = await obtenerResumenProximosDias(7);
const resumenMesCompleto = await obtenerResumenProximosDias(30);
```

### Respuesta Exitosa (200 OK)
```json
{
  "periodo": "2026-03-15 a 2026-03-21",
  "totalDias": 7,
  "resumenDiario": [
    {
      "fecha": "2026-03-15",
      "reservas": 5,
      "visitantesEsperados": 25,
      "horarios": ["09:00", "10:00", "11:00", "14:00", "15:30"]
    },
    {
      "fecha": "2026-03-16",
      "reservas": 3,
      "visitantesEsperados": 12,
      "horarios": ["10:00", "11:30", "15:00"]
    }
  ],
  "totalReservas": 28,
  "totalVisitantesEsperados": 125
}
```

---

## ⚠️ Manejo de Errores Comunes

### 1. Token Expirado (401)
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```
**Acción:** Redirigir al login y pedir que se autentique nuevamente.

### 2. Token Inválido o Corrupto (401)
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```
**Acción:** Limpiar el localStorage y redirigir al login.

### 3. Parámetros Inválidos (400)
```json
{
  "message": "El parámetro \"fecha\" es requerido (formato: YYYY-MM-DD)",
  "statusCode": 400
}
```
**Acción:** Validar los parámetros antes de enviar.

### 4. Recurso No Encontrado (404)
```json
{
  "message": "Reserva no encontrada",
  "statusCode": 404
}
```
**Acción:** Mostrar mensaje al usuario o redirigir.

---

## 🛠️ Ejemplo Completo - Sistema de Login + Dashboard

### React Hook personalizado
```javascript
// useAdmin.js
import { useState, useEffect } from 'react';

export const useAdmin = () => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar token al montar
  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    const savedAdmin = localStorage.getItem('admin');
    if (savedToken) {
      setToken(savedToken);
      setAdmin(JSON.parse(savedAdmin));
    }
  }, []);

  const login = async (usuario, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('admin', JSON.stringify(data.admin));
      setToken(data.access_token);
      setAdmin(data.admin);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('admin');
    setToken(null);
    setAdmin(null);
  };

  const fetchWithAuth = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });

    if (response.status === 401) {
      logout();
      throw new Error('Sesión expirada');
    }

    return response;
  };

  return {
    admin,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!token,
    fetchWithAuth
  };
};
```

### Uso en componentes
```javascript
// LoginPage.jsx
import { useAdmin } from './hooks/useAdmin';

export const LoginPage = () => {
  const { login, loading, error } = useAdmin();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(usuario, password);
      // Redirigir al dashboard
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};
```

---

## 📋 Checklist para el Frontend

- [ ] Implementar login en `/auth/login`
- [ ] Guardar token en localStorage o sessionStorage
- [ ] Crear helper para requests autenticados
- [ ] Proteger rutas que requieren autenticación
- [ ] Manejar expiración de token (401)
- [ ] Mostrar información del admin logeado
- [ ] Implementar logout
- [ ] Validar formato de fechas (YYYY-MM-DD)
- [ ] Manejar errores de red
- [ ] Mostrar loading states

---

## 🔗 URLs Base por Entorno

| Entorno | URL |
|---------|-----|
| Desarrollo Local | `http://localhost:3000` |
| Testing | `http://staging-api.museo.com` |
| Producción | `https://api.museo.com` |

---

## 🚨 Notas Importantes

1. **Token Expira en 24 horas** - Implementar refresh token en el futuro
2. **HTTPS en Producción** - Usar solo HTTPS, nunca HTTP
3. **CORS** - Asegurar que el frontend está en la lista de orígenes permitidos
4. **Contraseña en Tránsito** - Siempre usar HTTPS para proteger credenciales
5. **No Guardar en localStorage** - Considerar usar httpOnly cookies en el futuro

