import { useEffect } from 'react'
import { COLORES } from '../constants'

export function useAccentColor(valor) {
  useEffect(() => {
    const color = COLORES.find((c) => c.valor === valor) ?? COLORES[0]
    document.documentElement.style.setProperty('--accent-color', color.valor)
    document.documentElement.style.setProperty('--accent-hover', color.hover)
  }, [valor])
}
