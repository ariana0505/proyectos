import { useState } from 'react'

export function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [editando, setEditando] = useState(false)
  const [texto, setTexto] = useState(task.texto)

  function guardarEdicion() {
    const valor = texto.trim()
    if (valor) onEdit(task.id, valor)
    setEditando(false)
  }

  return (
    <li className={`task-item ${task.completada ? 'completada' : ''}`}>
      <input
        type="checkbox"
        checked={task.completada}
        onChange={() => onToggle(task.id)}
      />

      {editando ? (
        <input
          type="text"
          className="task-edit-input"
          value={texto}
          autoFocus
          onChange={(e) => setTexto(e.target.value)}
          onBlur={guardarEdicion}
          onKeyDown={(e) => e.key === 'Enter' && guardarEdicion()}
        />
      ) : (
        <span className="task-texto" onDoubleClick={() => setEditando(true)}>
          {task.texto}
        </span>
      )}

      <div className="task-actions">
        <button type="button" onClick={() => setEditando(true)}>
          Editar
        </button>
        <button type="button" onClick={() => onDelete(task.id)}>
          Eliminar
        </button>
      </div>
    </li>
  )
}
