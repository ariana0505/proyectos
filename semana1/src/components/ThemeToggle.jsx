const TEMAS = [
  { valor: 'auto', etiqueta: 'Auto' },
  { valor: 'claro', etiqueta: 'Claro' },
  { valor: 'oscuro', etiqueta: 'Oscuro' },
]

export function ThemeToggle({ tema, onChange }) {
  return (
    <div className="theme-toggle" role="radiogroup" aria-label="Tema">
      {TEMAS.map(({ valor, etiqueta }) => (
        <button
          key={valor}
          type="button"
          role="radio"
          aria-checked={tema === valor}
          className={tema === valor ? 'activo' : ''}
          onClick={() => onChange(valor)}
        >
          {etiqueta}
        </button>
      ))}
    </div>
  )
}
