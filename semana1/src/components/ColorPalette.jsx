import { COLORES } from '../constants'

export function ColorPalette({ activo, onChange }) {
  return (
    <div className="color-palette" role="radiogroup" aria-label="Color de acento">
      {COLORES.map((color) => (
        <button
          key={color.valor}
          type="button"
          role="radio"
          aria-checked={activo === color.valor}
          aria-label={`Color ${color.nombre}`}
          title={color.nombre}
          className={`color-swatch ${activo === color.valor ? 'activo' : ''}`}
          style={{ '--swatch': color.valor }}
          onClick={() => onChange(color.valor)}
        />
      ))}
    </div>
  )
}
