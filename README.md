# Ruta de 10 proyectos de diseño de sistemas con Google Cloud

Objetivo: completar aproximadamente **un proyecto por semana**, avanzando desde una API contenerizada hasta una plataforma distribuida orientada a eventos. Cada proyecto debe incluir código, infraestructura reproducible, observabilidad, pruebas y una breve decisión de arquitectura.

## Reglas para todos los proyectos

- Usar un proyecto de GCP separado o etiquetas por semana: `curso=system-design`, `semana=N`.
- Definir la infraestructura con Terraform cuando el alcance lo permita.
- Configurar presupuesto y alertas antes de desplegar recursos.
- Mantener secretos en Secret Manager; nunca subir credenciales al repositorio.
- Añadir diagrama de arquitectura, README, instrucciones de despliegue y limpieza.
- Registrar al menos una decisión en `docs/adr/` (Architecture Decision Record).
- Medir latencia p50/p95/p99, tasa de errores, throughput y costo estimado.
- Ejecutar una prueba de carga y una prueba de fallo controlada.
- Destruir o escalar a cero los recursos al terminar cada práctica.

## Hoja de ruta

| Semana | Propuesta sencilla | Servicios principales de GCP | Concepto principal |
|---|---|---|---|
| 1 | Acortador de enlaces | Cloud Run, Artifact Registry, Firestore | Contenedores y servicios sin estado |
| 2 | Generador de miniaturas | Cloud Storage, Eventarc, Cloud Run | Arquitectura orientada a eventos |
| 3 | Recordatorios programados | Cloud Tasks, Cloud Run, Firestore | Colas, reintentos e idempotencia |
| 4 | Muro de mensajes en vivo | Firestore, Firebase Hosting | Tiempo real y consistencia eventual |
| 5 | Catálogo de libros | Cloud SQL, Cloud Run | Modelado relacional, índices y paginación |
| 6 | Contador de visitas | Pub/Sub, Cloud Run, BigQuery | Ingesta y analítica de eventos |
| 7 | Reserva de asientos | Cloud Run, Cloud SQL, Pub/Sub | Concurrencia y compensaciones |
| 8 | Galería pública de imágenes | Cloud Storage, Cloud CDN, Load Balancing | Caché, CDN y distribución global |
| 9 | API con respaldo regional | Dos servicios de Cloud Run, Load Balancing, Firestore | Alta disponibilidad y failover |
| 10 | Tienda mínima orientada a eventos | Cloud Run, Firestore, Pub/Sub, Cloud Monitoring | Integración, observabilidad y resiliencia |

## Detalle semanal

### Semana 1 — Acortador de enlaces

Una página permite pegar una URL larga y devuelve un código corto. Al visitar `/{codigo}`, el usuario es redirigido.

- **MVP:** crear enlace, redirigir y mostrar contador de visitas.
- **Aprendizaje:** empaquetar una API en Docker, desplegarla en Cloud Run y guardar datos en Firestore.
- **Límite:** sin cuentas, dominio propio ni panel administrativo.
- **Prueba:** medir el cold start y enviar 100 solicitudes concurrentes.

### Semana 2 — Generador de miniaturas

El usuario sube una imagen a un bucket y el sistema crea automáticamente una copia pequeña en otro directorio.

- **MVP:** aceptar JPG/PNG y producir una miniatura de tamaño fijo.
- **Aprendizaje:** evento de Cloud Storage → Eventarc → contenedor en Cloud Run.
- **Límite:** sin editor, filtros ni reconocimiento de imágenes.
- **Prueba:** subir dos veces el mismo archivo y comprobar que el resultado sea seguro e idempotente.

### Semana 3 — Recordatorios programados

Una API recibe un texto y una fecha; cuando llega la hora, ejecuta una notificación simulada que queda registrada.

- **MVP:** crear, listar y ejecutar recordatorios; la notificación solo se imprime en logs.
- **Aprendizaje:** Cloud Tasks, reintentos, backoff e idempotencia.
- **Límite:** sin SMS, correo real ni zonas horarias múltiples.
- **Prueba:** provocar un fallo temporal y verificar que la tarea se reintente sin duplicar la notificación.

### Semana 4 — Muro de mensajes en vivo

Una web sencilla muestra mensajes y se actualiza automáticamente cuando alguien publica uno nuevo.

- **MVP:** nombre, mensaje, fecha y lista de los 20 mensajes recientes.
- **Aprendizaje:** listeners en tiempo real, ordenamiento y consistencia eventual con Firestore.
- **Límite:** sin autenticación, respuestas, archivos ni moderación.
- **Prueba:** abrir dos navegadores y medir cuánto tarda un mensaje en aparecer en el segundo.

### Semana 5 — Catálogo de libros

Una API permite registrar libros y buscarlos por título, autor o categoría.

- **MVP:** CRUD, búsqueda textual sencilla y paginación.
- **Aprendizaje:** Cloud SQL, conexiones desde Cloud Run, índices y planes de consulta.
- **Límite:** sin compras, usuarios ni buscador especializado.
- **Prueba:** cargar 10 000 registros y comparar la consulta antes y después de crear un índice.

### Semana 6 — Contador de visitas

Cada visita a una página publica un evento; un consumidor lo guarda para consultar visitas por página y por día.

- **MVP:** endpoint para emitir visitas y tres consultas SQL en BigQuery.
- **Aprendizaje:** productor, topic, consumidor, entrega duplicada y diferencia entre OLTP y analítica.
- **Límite:** sin dashboard complejo ni Dataflow; un consumidor de Cloud Run es suficiente.
- **Prueba:** publicar 1 000 eventos, incluidos duplicados, y validar los totales.

### Semana 7 — Reserva de asientos

Una API expone 20 asientos para una función y permite reservar uno evitando dobles reservas.

- **MVP:** listar, reservar, confirmar y cancelar asientos; el pago es simulado.
- **Aprendizaje:** concurrencia, transacciones, eventos y una compensación sencilla al fallar el pago.
- **Límite:** solo una función, sin usuarios ni microservicios numerosos.
- **Prueba:** lanzar varias reservas simultáneas sobre el mismo asiento y aceptar exactamente una.

### Semana 8 — Galería pública con CDN

Una página muestra imágenes almacenadas en Cloud Storage y servidas mediante Cloud CDN.

- **MVP:** cargar imágenes manualmente y mostrar una galería pública.
- **Aprendizaje:** bucket, cabeceras de caché, load balancer, CDN, cache hit y cache miss.
- **Límite:** sin cuentas, edición ni imágenes privadas.
- **Prueba:** solicitar una imagen varias veces, revisar las cabeceras y comparar tiempos con caché fría y caliente.

### Semana 9 — API con respaldo regional

La misma API de estado se despliega en dos regiones y responde indicando qué región atendió la solicitud.

- **MVP:** endpoint `/health` y endpoint `/info`, ambos detrás de un balanceador global.
- **Aprendizaje:** health checks, routing, failover, RTO y despliegues regionales.
- **Límite:** datos mínimos en Firestore; no usar Spanner ni Kubernetes.
- **Prueba:** deshabilitar temporalmente una región y medir cuánto tarda el tráfico en pasar a la otra.

### Semana 10 — Tienda mínima orientada a eventos

Una tienda pequeña permite ver cinco productos y crear pedidos; cada pedido publica un evento que actualiza inventario y estadísticas.

- **MVP:** catálogo fijo, crear pedido, descontar stock y consultar ventas totales. El pago es siempre simulado.
- **Aprendizaje:** unir contenedores, eventos, idempotencia, compensación, métricas y alertas.
- **Límite:** sin autenticación, carrito, pagos reales, Kubernetes ni interfaz compleja.
- **Prueba:** procesar eventos duplicados, simular la caída del consumidor y comprobar su recuperación.

## Estructura sugerida por semana

```text
semana-N-nombre/
├── README.md
├── docs/
│   ├── arquitectura.png
│   └── adr/
├── src/
├── tests/
├── infra/
├── scripts/
└── Dockerfile
```

## Rutina de trabajo semanal

1. **Día 1:** requisitos, estimaciones de tráfico y diagrama inicial.
2. **Día 2:** MVP local y pruebas unitarias.
3. **Día 3:** infraestructura y despliegue en GCP.
4. **Día 4:** observabilidad, seguridad y pruebas de carga/fallo.
5. **Día 5:** métricas, costos, ADR y retrospectiva.

## Criterio de finalización

Una semana termina cuando el sistema puede desplegarse desde cero, soporta una carga medida, presenta métricas útiles, tolera al menos un fallo previsto y explica claramente sus decisiones y limitaciones. No es necesario convertir cada proyecto en un producto completo: el objetivo es aprender y demostrar un concepto principal con evidencia.
