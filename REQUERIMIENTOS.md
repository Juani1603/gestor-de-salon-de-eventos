# 📋 Requerimientos del Sistema

## Requerimientos Funcionales

---

### RF-01 — Gestión de Cotizaciones

**RF-01.1 — Crear cotización**
El sistema debe permitir registrar una nueva cotización indicando nombre del cliente, fecha del evento, tipo de evento, cantidad de invitados y precio por invitado. Todos los campos son obligatorios.

**RF-01.2 — Listar cotizaciones**
El sistema debe mostrar el listado completo de cotizaciones registradas, incluyendo nombre del cliente, tipo de evento, fecha, cantidad de invitados, precio por invitado y total estimado.

**RF-01.3 — Filtrar cotizaciones**
El sistema debe permitir filtrar el listado de cotizaciones por nombre de cliente en tiempo real, y por estado (con o sin evento asignado).

**RF-01.4 — Eliminar cotización**
El sistema debe permitir eliminar una cotización existente, solicitando confirmación antes de ejecutar la acción. La eliminación es permanente e irreversible.

**RF-01.5 — Vincular cotización con evento**
El sistema debe actualizar automáticamente el campo `eventoId` de una cotización cuando se crea un evento a partir de ella, reflejando el vínculo en la interfaz con un indicador visual diferenciado.

---

### RF-02 — Gestión de Eventos

**RF-02.1 — Crear evento**
El sistema debe permitir registrar un nuevo evento indicando nombre del cliente, fecha, tipo de evento, estado, cantidad de invitados y precio por invitado. Todos los campos son obligatorios. La fecha debe ser igual o posterior a la fecha actual.

**RF-02.2 — Crear evento desde cotización**
El sistema debe permitir crear un evento a partir de una cotización existente, precargando automáticamente los datos de la misma. El usuario debe seleccionar el estado inicial del evento. Al confirmar, el sistema debe vincular el evento creado a la cotización de origen.

**RF-02.3 — Visualizar eventos en calendario**
El sistema debe mostrar los eventos del mes en un calendario mensual interactivo, permitiendo navegar entre meses y años. Al hacer clic sobre un evento, debe desplegarse un panel lateral con el detalle completo.

**RF-02.4 — Editar evento**
El sistema debe permitir modificar los datos de un evento existente: nombre del cliente, fecha, tipo de evento, estado, cantidad de invitados y precio por invitado. Los campos `fechaCreacion`, `cotizacionId` y `planificacionId` no son editables desde este flujo.

**RF-02.5 — Eliminar evento**
El sistema debe permitir eliminar un evento existente, solicitando confirmación antes de ejecutar la acción. Al eliminar un evento, el sistema debe desvincular automáticamente la cotización asociada (limpiar su `eventoId`).

**RF-02.6 — Navegar desde cotización a evento**
El sistema debe permitir navegar directamente desde una cotización a su evento vinculado, mostrando el calendario en el mes correspondiente y seleccionando el evento automáticamente.

---

### RF-03 — Planificación de Eventos

**RF-03.1 — Crear planificación**
El sistema debe permitir crear una planificación para un evento existente mediante un wizard de 3 pasos: horarios e invitados, servicios, y cronograma. Al guardar, la planificación debe vincularse automáticamente al evento.

**RF-03.2 — Paso 1 — Horarios e invitados**
El sistema debe permitir registrar hora de llegada, hora de cena/almuerzo (obligatoria), hora de finalización (opcional), desglose de invitados entre mayores y menores de edad (solo visual, no se persiste), y cantidad de mesas. La suma de mayores y menores no puede superar la cantidad de invitados del evento.

**RF-03.3 — Paso 2 — Servicios**
El sistema debe presentar un checklist de servicios disponibles. Los servicios que requieren cantidad o descripción adicional deben mostrar campos extra al ser seleccionados. El servicio "Altar para Boda" debe mostrarse únicamente si el tipo de evento es Boda.

**RF-03.4 — Paso 3 — Cronograma**
El sistema debe permitir agregar momentos al cronograma seleccionando desde una lista de timings predefinidos o creando uno personalizado. Cada momento requiere una hora asignada. Los momentos deben poder reordenarse mediante drag & drop.

**RF-03.5 — Editar planificación**
El sistema debe permitir editar una planificación existente, precargando todos los datos previamente guardados. Al guardar, los servicios y timings existentes deben reemplazarse por los nuevos.

**RF-03.6 — Descargar planificación en PDF**
El sistema debe permitir descargar la planificación de un evento en formato PDF, incluyendo: datos del evento, horarios, capacidad, servicios, cronograma y observaciones. El PDF debe generarse con el logo del salón y un diseño profesional apto para impresión.

---

### RF-04 — Gestión de Reuniones

**RF-04.1 — Crear reunión**
El sistema debe permitir registrar una nueva reunión indicando nombre del cliente, fecha y hora. La fecha y hora deben ser iguales o posteriores al momento actual. La vinculación con una cotización es opcional.

**RF-04.2 — Crear reunión desde cotización**
El sistema debe permitir agendar una reunión directamente desde el listado de cotizaciones, precargando el nombre del cliente y vinculando automáticamente el `cotizacionId`. El usuario solo debe seleccionar fecha y hora.

**RF-04.3 — Listar reuniones**
El sistema debe mostrar únicamente las reuniones vigentes desde el inicio del día actual hasta 30 días en el futuro, agrupadas por día y ordenadas cronológicamente. Las reuniones pasadas no deben mostrarse.

**RF-04.4 — Eliminar reunión**
El sistema debe permitir eliminar una reunión existente, solicitando confirmación antes de ejecutar la acción.

---

### RF-05 — Dashboard

**RF-05.1 — Próximo evento**
El sistema debe mostrar el evento más próximo desde el día actual, incluyendo nombre del cliente, fecha, tipo de evento, cantidad de invitados, estado y cantidad de días restantes.

**RF-05.2 — Próxima reunión**
El sistema debe mostrar la reunión más próxima desde el momento actual, incluyendo nombre del cliente, día y hora. Debe indicar si la reunión es el día de hoy.

**RF-05.3 — Mini calendario**
El sistema debe mostrar un calendario del mes actual destacando los días con eventos registrados. Al hacer hover sobre un día con evento, debe mostrar un tooltip con el detalle del evento.

**RF-05.4 — Estadísticas del mes**
El sistema debe mostrar tres métricas en tiempo real: cantidad de eventos del mes actual, cantidad de reuniones vigentes del mes actual, y cantidad de cotizaciones sin evento asignado.

---

## Requerimientos No Funcionales

---

### RNF-01 — Usabilidad

**RNF-01.1** — La interfaz debe ser responsiva, adaptándose correctamente a dispositivos de escritorio, tablets y teléfonos móviles.

**RNF-01.2** — Las acciones destructivas (eliminar evento, cotización o reunión) deben requerir confirmación explícita del usuario antes de ejecutarse.

**RNF-01.3** — El sistema debe mostrar feedback visual inmediato ante cualquier acción del usuario mediante notificaciones tipo toast que indiquen éxito o error.

**RNF-01.4** — Los formularios deben validar los campos obligatorios en el frontend antes de enviar la solicitud al backend, deshabilitando el botón de confirmación hasta que los datos sean válidos.

---

### RNF-02 — Rendimiento

**RNF-02.1** — Las páginas principales deben cargar en menos de 2 segundos en condiciones normales de red local.

**RNF-02.2** — Las operaciones de alta, edición y eliminación deben reflejar cambios en la interfaz sin recargar la página completa.

**RNF-02.3** — El filtrado de cotizaciones por nombre debe ejecutarse en tiempo real sin consultas adicionales al servidor.

---

### RNF-03 — Confiabilidad

**RNF-03.1** — El backend debe retornar mensajes de error descriptivos ante cualquier excepción, los cuales deben mostrarse al usuario a través de notificaciones en el frontend.

**RNF-03.2** — La eliminación de un evento debe garantizar la integridad referencial, desvinculando automáticamente la cotización asociada en la misma transacción.

**RNF-03.3** — La creación de un evento desde una cotización debe ser atómica: si falla la vinculación posterior, el evento no debe quedar huérfano en el sistema.

---

### RNF-04 — Mantenibilidad

**RNF-04.1** — El backend debe seguir el patrón Repositorio, separando la lógica de acceso a datos de la lógica de negocio mediante interfaces.

**RNF-04.2** — El backend debe aplicar inyección de dependencias para todos los casos de uso y repositorios, facilitando la extensibilidad y el reemplazo de implementaciones.

**RNF-04.3** — La comunicación entre capas del backend debe realizarse exclusivamente mediante DTOs, sin exponer entidades de dominio directamente en los endpoints.

**RNF-04.4** — Los servicios del frontend deben centralizar toda la comunicación con la API, evitando llamadas directas desde los componentes.

---

### RNF-05 — Seguridad

**RNF-05.1** — El backend debe validar los datos recibidos en cada endpoint, rechazando solicitudes con campos obligatorios faltantes o con valores fuera de rango.

**RNF-05.2** — Las fechas de reuniones no deben poder registrarse en el pasado, validación que debe realizarse tanto en el frontend como en el backend.

**RNF-05.3** — La generación de PDFs debe realizarse en el servidor, evitando exponer lógica sensible en el cliente.