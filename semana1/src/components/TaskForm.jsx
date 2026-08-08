import { useState } from 'react'

export function TaskForm({ onAdd }) {
  const [texto, setTexto] = useState('')
  const [prioridad, setPrioridad] = useState('media')
  const [fechaLimite, setFechaLimite] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const valor = texto.trim()
    if (!valor) return
    onAdd({ texto: valor, prioridad, fechaLimite })
    setTexto('')
    setFechaLimite('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form-row">
        <input
          type="text"
          placeholder="Nueva tarea..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          aria-label="Texto de la nueva tarea"
        />
        <button type="submit">Agregar</button>
      </div>
      <div className="task-form-row task-form-extra">
        <select
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value)}
          aria-label="Prioridad"
        >
          <option value="alta">Prioridad alta</option>
          <option value="media">Prioridad media</option>
          <option value="baja">Prioridad baja</option>
        </select>
        <input
          type="date"
          value={fechaLimite}
          onChange={(e) => setFechaLimite(e.target.value)}
          aria-label="Fecha límite"
        />
      </div>
    </form>
  )
}
