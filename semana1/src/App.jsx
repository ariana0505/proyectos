import { useEffect, useMemo, useRef, useState } from 'react'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { TaskFilters } from './components/TaskFilters'
import { TaskCounter } from './components/TaskCounter'
import { SearchBar } from './components/SearchBar'
import { UndoToast } from './components/UndoToast'
import { ColorPalette } from './components/ColorPalette'
import { ThemeToggle } from './components/ThemeToggle'
import { ProgressBar } from './components/ProgressBar'
import { SortSelect } from './components/SortSelect'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useAccentColor } from './hooks/useAccentColor'
import './App.css'

const UNDO_TIMEOUT = 5000
const PESO_PRIORIDAD = { alta: 0, media: 1, baja: 2 }

function App() {
  const [tasks, setTasks] = useLocalStorage('tasks', [])
  const [acento, setAcento] = useLocalStorage('acento', '#4f46e5')
  const [tema, setTema] = useLocalStorage('tema', 'auto')
  const [orden, setOrden] = useLocalStorage('orden', 'creacion')
  const [filtro, setFiltro] = useState('todas')
  const [busqueda, setBusqueda] = useState('')
  const [ultimoBorrado, setUltimoBorrado] = useState(null)
  const undoTimerRef = useRef(null)
  const searchRef = useRef(null)

  useAccentColor(acento)

  useEffect(() => {
    document.documentElement.dataset.theme = tema
  }, [tema])

  // Atajo global: "/" enfoca la búsqueda, salvo si ya se está escribiendo en un campo.
  useEffect(() => {
    function handleKey(e) {
      const enCampo = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)
      if (e.key === '/' && !enCampo) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => () => clearTimeout(undoTimerRef.current), [])

  function addTask({ texto, prioridad, fechaLimite }) {
    const nuevaTarea = {
      id: crypto.randomUUID(),
      texto,
      completada: false,
      prioridad,
      fechaLimite: fechaLimite || null,
      fechaCreacion: new Date().toISOString(),
    }
    setTasks([nuevaTarea, ...tasks])
  }

  function toggleTask(id) {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completada: !t.completada } : t))
    )
  }

  function deleteTask(id) {
    const tarea = tasks.find((t) => t.id === id)
    const indice = tasks.findIndex((t) => t.id === id)
    if (!tarea) return

    setTasks(tasks.filter((t) => t.id !== id))

    clearTimeout(undoTimerRef.current)
    setUltimoBorrado({ tarea, indice })
    undoTimerRef.current = setTimeout(() => setUltimoBorrado(null), UNDO_TIMEOUT)
  }

  function deshacerBorrado() {
    if (!ultimoBorrado) return
    clearTimeout(undoTimerRef.current)
    const copia = [...tasks]
    copia.splice(ultimoBorrado.indice, 0, ultimoBorrado.tarea)
    setTasks(copia)
    setUltimoBorrado(null)
  }

  function editTask(id, cambios) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...cambios } : t)))
  }

  function clearCompleted() {
    setTasks(tasks.filter((t) => !t.completada))
  }

  const tasksVisibles = useMemo(() => {
    let resultado = tasks
    if (filtro === 'pendientes') resultado = resultado.filter((t) => !t.completada)
    if (filtro === 'completadas') resultado = resultado.filter((t) => t.completada)

    const q = busqueda.trim().toLowerCase()
    if (q) resultado = resultado.filter((t) => t.texto.toLowerCase().includes(q))

    const ordenada = [...resultado]
    if (orden === 'prioridad') {
      ordenada.sort(
        (a, b) => (PESO_PRIORIDAD[a.prioridad] ?? 1) - (PESO_PRIORIDAD[b.prioridad] ?? 1)
      )
    } else if (orden === 'fecha') {
      // Las tareas sin fecha límite van al final.
      ordenada.sort((a, b) => (a.fechaLimite ?? '9999').localeCompare(b.fechaLimite ?? '9999'))
    } else if (orden === 'alfabetico') {
      ordenada.sort((a, b) => a.texto.localeCompare(b.texto, 'es'))
    }
    return ordenada
  }, [tasks, filtro, busqueda, orden])

  const completadas = tasks.filter((t) => t.completada).length
  const hayCompletadas = completadas > 0

  return (
    <main className="app">
      <header className="app-header">
        <ColorPalette activo={acento} onChange={setAcento} />
        <ThemeToggle tema={tema} onChange={setTema} />
      </header>

      <h1>To-Do List</h1>

      <TaskForm onAdd={addTask} />
      <SearchBar ref={searchRef} value={busqueda} onChange={setBusqueda} />

      <div className="toolbar">
        <TaskFilters filtroActivo={filtro} onChange={setFiltro} />
        <SortSelect orden={orden} onChange={setOrden} />
      </div>

      <ProgressBar total={tasks.length} completadas={completadas} />

      <TaskList
        tasks={tasksVisibles}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onEdit={editTask}
        haySinFiltrar={tasks.length > 0}
      />

      <div className="app-footer">
        <TaskCounter tasks={tasks} />
        {hayCompletadas && (
          <button type="button" className="clear-completed" onClick={clearCompleted}>
            Borrar completadas
          </button>
        )}
      </div>

      <UndoToast borrado={ultimoBorrado} onUndo={deshacerBorrado} />
    </main>
  )
}

export default App
