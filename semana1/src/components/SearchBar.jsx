export function SearchBar({ value, onChange, ref }) {
  return (
    <input
      ref={ref}
      type="search"
      className="search-bar"
      placeholder="Buscar tareas...  (pulsa / para enfocar)"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Buscar tareas"
    />
  )
}
