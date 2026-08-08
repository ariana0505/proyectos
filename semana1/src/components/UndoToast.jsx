export function UndoToast({ borrado, onUndo }) {
  if (!borrado) return null

  return (
    <div className="undo-toast" role="status">
      <span>Tarea eliminada: "{borrado.tarea.texto}"</span>
      <button type="button" onClick={onUndo}>
        Deshacer
      </button>
    </div>
  )
}
