import { useState } from 'react'

export function TaskForm({ onAdd }) {
  const [texto, setTexto] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const valor = texto.trim()
    if (!valor) return
    onAdd(valor)
    setTexto('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nueva tarea..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <button type="submit">Agregar</button>
    </form>
  )
}
