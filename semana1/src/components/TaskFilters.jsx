const FILTROS = [
  { valor: 'todas', etiqueta: 'Todas' },
  { valor: 'pendientes', etiqueta: 'Pendientes' },
  { valor: 'completadas', etiqueta: 'Completadas' },
]

export function TaskFilters({ filtroActivo, onChange }) {
  return (
    <div className="task-filters">
      {FILTROS.map(({ valor, etiqueta }) => (
        <button
          key={valor}
          type="button"
          className={filtroActivo === valor ? 'activo' : ''}
          onClick={() => onChange(valor)}
        >
          {etiqueta}
        </button>
      ))}
    </div>
  )
}
