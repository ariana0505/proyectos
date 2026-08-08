import { useState } from 'react'

const CICLO_PRIORIDAD = { alta: 'media', media: 'baja', baja: 'alta' }

function formatearFecha(iso) {
  const [anio, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${anio}`
}

function estaVencida(fechaLimite, completada) {
  if (!fechaLimite || completada) return false
  const hoy = new Date().toISOString().slice(0, 10)
  return fechaLimite < hoy
}

export function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [editando, setEditando] = useState(false)
  const [texto, setTexto] = useState(task.texto)

  function guardarEdicion() {
    const valor = texto.trim()
    if (valor) onEdit(task.id, { texto: valor })
    else setTexto(task.texto)
    setEditando(false)
  }

  function cancelarEdicion() {
    setTexto(task.texto)
    setEditando(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') guardarEdicion()
    if (e.key === 'Escape') cancelarEdicion()
  }

  function ciclarPrioridad() {
    const actual = task.prioridad ?? 'media'
    onEdit(task.id, { prioridad: CICLO_PRIORIDAD[actual] })
  }

  const prioridad = task.prioridad ?? 'media'
  const vencida = estaVencida(task.fechaLimite, task.completada)

  return (
    <li className={`task-item ${task.completada ? 'completada' : ''}`}>
      <input
        type="checkbox"
        checked={task.completada}
        onChange={() => onToggle(task.id)}
        aria-label={`Marcar "${task.texto}" como ${task.completada ? 'pendiente' : 'completada'}`}
      />

      <button
        type="button"
        className={`prioridad-dot prioridad-${prioridad}`}
        onClick={ciclarPrioridad}
        title={`Prioridad ${prioridad} — clic para cambiar`}
        aria-label={`Prioridad ${prioridad}. Clic para cambiar`}
      />

      <div className="task-main">
        {editando ? (
          <input
            type="text"
            className="task-edit-input"
            value={texto}
            autoFocus
            onChange={(e) => setTexto(e.target.value)}
            onBlur={guardarEdicion}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span className="task-texto" onDoubleClick={() => setEditando(true)}>
            {task.texto}
          </span>
        )}

        {task.fechaLimite && (
          <span className={`task-fecha ${vencida ? 'vencida' : ''}`}>
            {vencida ? 'Vencida: ' : 'Vence: '}
            {formatearFecha(task.fechaLimite)}
          </span>
        )}
      </div>

      <div className="task-actions">
        <button type="button" onClick={() => setEditando(true)} aria-label={`Editar "${task.texto}"`}>
          Editar
        </button>
        <button type="button" onClick={() => onDelete(task.id)} aria-label={`Eliminar "${task.texto}"`}>
          Eliminar
        </button>
      </div>
    </li>
  )
}
