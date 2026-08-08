import { TaskItem } from './TaskItem'

export function TaskList({ tasks, onToggle, onDelete, onEdit, haySinFiltrar }) {
  if (tasks.length === 0) {
    return (
      <p className="empty-state">
        {haySinFiltrar ? 'Ninguna tarea coincide con el filtro.' : 'No hay tareas por aquí.'}
      </p>
    )
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  )
}
