import { useMemo, useState } from 'react'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { TaskFilters } from './components/TaskFilters'
import { TaskCounter } from './components/TaskCounter'
import { useLocalStorage } from './hooks/useLocalStorage'
import './App.css'

function App() {
  const [tasks, setTasks] = useLocalStorage('tasks', [])
  const [filtro, setFiltro] = useState('todas')

  function addTask(texto) {
    const nuevaTarea = {
      id: crypto.randomUUID(),
      texto,
      completada: false,
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
    setTasks(tasks.filter((t) => t.id !== id))
  }

  function editTask(id, texto) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, texto } : t)))
  }

  const tasksFiltradas = useMemo(() => {
    if (filtro === 'pendientes') return tasks.filter((t) => !t.completada)
    if (filtro === 'completadas') return tasks.filter((t) => t.completada)
    return tasks
  }, [tasks, filtro])

  return (
    <main className="app">
      <h1>To-Do List</h1>

      <TaskForm onAdd={addTask} />
      <TaskFilters filtroActivo={filtro} onChange={setFiltro} />
      <TaskList
        tasks={tasksFiltradas}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onEdit={editTask}
      />
      <TaskCounter tasks={tasks} />
    </main>
  )
}

export default App
