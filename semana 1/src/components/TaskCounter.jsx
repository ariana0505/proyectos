export function TaskCounter({ tasks }) {
  const pendientes = tasks.filter((t) => !t.completada).length

  return (
    <p className="task-counter">
      {pendientes} {pendientes === 1 ? 'tarea pendiente' : 'tareas pendientes'}
    </p>
  )
}
