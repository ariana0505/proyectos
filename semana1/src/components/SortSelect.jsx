import { ORDENES } from '../constants'

export function SortSelect({ orden, onChange }) {
  return (
    <label className="sort-select">
      Ordenar por
      <select value={orden} onChange={(e) => onChange(e.target.value)}>
        {ORDENES.map(({ valor, etiqueta }) => (
          <option key={valor} value={valor}>
            {etiqueta}
          </option>
        ))}
      </select>
    </label>
  )
}
