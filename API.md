# 🔌 API Reference

Base URL: `http://localhost:5013/api`

> La API también puede explorarse interactivamente desde Swagger en `http://localhost:5013/swagger`.

---

## Cotizacion

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/Cotizacion` | Obtiene todas las cotizaciones |
| `GET` | `/api/Cotizacion/{id}` | Obtiene una cotización por ID |
| `POST` | `/api/Cotizacion` | Crea una nueva cotización |
| `DELETE` | `/api/Cotizacion/{id}` | Elimina una cotización |
| `PATCH` | `/api/Cotizacion/{id}/evento` | Vincula o desvincula un evento a la cotización |

---

## Evento

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/Evento/proximo` | Obtiene el próximo evento desde hoy |
| `GET` | `/api/Evento/mes?mes=&anio=` | Obtiene los eventos de un mes/año específico |
| `GET` | `/api/Evento/rango` | Obtiene eventos dentro de un rango de fechas |
| `GET` | `/api/Evento/{id}` | Obtiene un evento por ID |
| `POST` | `/api/Evento` | Crea un nuevo evento |
| `PUT` | `/api/Evento/{id}` | Edita un evento existente |
| `DELETE` | `/api/Evento/{id}` | Elimina un evento |

---

## Planificacion

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/Planificacion/{id}` | Obtiene una planificación por ID |
| `POST` | `/api/Planificacion` | Crea una nueva planificación y la vincula al evento |
| `PUT` | `/api/Planificacion/{id}` | Edita una planificación existente (reemplaza servicios y timings) |

---

## Reunion

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/Reunion/proxima` | Obtiene la próxima reunión desde ahora |
| `GET` | `/api/Reunion/mes?mes=&anio=` | Obtiene las reuniones de un mes/año específico |
| `POST` | `/api/Reunion` | Crea una nueva reunión |
| `DELETE` | `/api/Reunion/{id}` | Elimina una reunión |

---

## TimingEvento

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/TimingEvento/templates` | Obtiene los timings predefinidos (sin planificación asociada) |