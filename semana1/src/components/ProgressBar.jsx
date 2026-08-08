export function ProgressBar({ total, completadas }) {
  if (total === 0) return null

  const porcentaje = Math.round((completadas / total) * 100)

  return (
    <div className="progress">
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={porcentaje}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso de tareas completadas"
      >
        <div className="progress-fill" style={{ width: `${porcentaje}%` }} />
      </div>
      <span className="progress-label">
        {completadas} de {total} completadas ({porcentaje}%)
      </span>
    </div>
  )
}
