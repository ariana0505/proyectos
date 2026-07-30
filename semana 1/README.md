# Semana 1 — To-Do List con persistencia

To-Do list con React + Vite. Persistencia en `localStorage` vía un hook custom.

## Correr el proyecto

```bash
npm install
npm run dev
```

## Estructura

```
src/
 ├─ components/
 │   ├─ TaskForm.jsx      # input + agregar tarea
 │   ├─ TaskList.jsx      # lista de tareas
 │   ├─ TaskItem.jsx      # tarea individual (toggle, editar, eliminar)
 │   ├─ TaskFilters.jsx   # todas / pendientes / completadas
 │   └─ TaskCounter.jsx   # contador de pendientes
 ├─ hooks/
 │   └─ useLocalStorage.js
 └─ App.jsx
```

## Features implementadas

- Crear, editar (doble click o botón), completar y eliminar tareas
- Filtros: todas / pendientes / completadas
- Persistencia en `localStorage`
- Contador de tareas pendientes

## Próximos pasos (opcional)

- Drag & drop para reordenar
- Fecha límite por tarea
- Migrar persistencia a JSON Server (API REST simulada)
- Tests con Vitest + React Testing Library
