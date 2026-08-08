import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

async function agregar(user, texto, { prioridad, fecha } = {}) {
  await user.type(screen.getByLabelText('Texto de la nueva tarea'), texto)
  if (prioridad) await user.selectOptions(screen.getByLabelText('Prioridad'), prioridad)
  if (fecha) await user.type(screen.getByLabelText('Fecha límite'), fecha)
  await user.click(screen.getByRole('button', { name: 'Agregar' }))
}

function textosVisibles() {
  return screen
    .queryAllByRole('listitem')
    .map((li) => li.querySelector('.task-texto').textContent)
}

describe('App', () => {
  it('agrega tareas y las muestra con la más reciente primero', async () => {
    const user = userEvent.setup()
    render(<App />)

    await agregar(user, 'Primera')
    await agregar(user, 'Segunda')

    expect(textosVisibles()).toEqual(['Segunda', 'Primera'])
  })

  it('muestra el estado vacío cuando no hay tareas', () => {
    render(<App />)
    expect(screen.getByText('No hay tareas por aquí.')).toBeInTheDocument()
  })

  it('actualiza el contador de pendientes al completar', async () => {
    const user = userEvent.setup()
    render(<App />)

    await agregar(user, 'Una tarea')
    expect(screen.getByText('1 tarea pendiente')).toBeInTheDocument()

    await user.click(screen.getByRole('checkbox'))
    expect(screen.getByText('0 tareas pendientes')).toBeInTheDocument()
  })

  it('muestra el progreso de completadas', async () => {
    const user = userEvent.setup()
    render(<App />)

    await agregar(user, 'A')
    await agregar(user, 'B')
    await user.click(screen.getAllByRole('checkbox')[0])

    expect(screen.getByText('1 de 2 completadas (50%)')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50')
  })

  describe('filtros', () => {
    it('separa pendientes de completadas', async () => {
      const user = userEvent.setup()
      render(<App />)

      await agregar(user, 'Pendiente')
      await agregar(user, 'Hecha')
      await user.click(screen.getAllByRole('checkbox')[0]) // "Hecha" está arriba

      await user.click(screen.getByRole('button', { name: 'Pendientes' }))
      expect(textosVisibles()).toEqual(['Pendiente'])

      await user.click(screen.getByRole('button', { name: 'Completadas' }))
      expect(textosVisibles()).toEqual(['Hecha'])

      await user.click(screen.getByRole('button', { name: 'Todas' }))
      expect(textosVisibles()).toHaveLength(2)
    })

    it('distingue "sin tareas" de "sin coincidencias"', async () => {
      const user = userEvent.setup()
      render(<App />)

      await agregar(user, 'Existe')
      await user.click(screen.getByRole('button', { name: 'Completadas' }))

      expect(screen.getByText('Ninguna tarea coincide con el filtro.')).toBeInTheDocument()
    })
  })

  describe('búsqueda', () => {
    it('filtra por texto ignorando mayúsculas', async () => {
      const user = userEvent.setup()
      render(<App />)

      await agregar(user, 'Comprar pan')
      await agregar(user, 'Regar plantas')

      await user.type(screen.getByLabelText('Buscar tareas'), 'PAN')
      expect(textosVisibles()).toEqual(['Comprar pan'])
    })

    it('se combina con el filtro activo', async () => {
      const user = userEvent.setup()
      render(<App />)

      await agregar(user, 'Tarea uno')
      await agregar(user, 'Tarea dos')
      await user.click(screen.getAllByRole('checkbox')[0]) // completa "Tarea dos"

      await user.click(screen.getByRole('button', { name: 'Pendientes' }))
      await user.type(screen.getByLabelText('Buscar tareas'), 'tarea')

      expect(textosVisibles()).toEqual(['Tarea uno'])
    })

    it('la tecla / enfoca el buscador', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('heading', { name: 'To-Do List' }))
      await user.keyboard('/')

      expect(screen.getByLabelText('Buscar tareas')).toHaveFocus()
    })

    it('la tecla / no interfiere al escribir en un campo', async () => {
      const user = userEvent.setup()
      render(<App />)

      const input = screen.getByLabelText('Texto de la nueva tarea')
      await user.type(input, 'a/b')

      expect(input).toHaveValue('a/b')
      expect(input).toHaveFocus()
    })
  })

  describe('ordenación', () => {
    it('ordena por prioridad: alta, media, baja', async () => {
      const user = userEvent.setup()
      render(<App />)

      await agregar(user, 'Baja', { prioridad: 'baja' })
      await agregar(user, 'Alta', { prioridad: 'alta' })
      await agregar(user, 'Media', { prioridad: 'media' })

      await user.selectOptions(screen.getByLabelText(/Ordenar por/), 'prioridad')
      expect(textosVisibles()).toEqual(['Alta', 'Media', 'Baja'])
    })

    it('ordena alfabéticamente', async () => {
      const user = userEvent.setup()
      render(<App />)

      await agregar(user, 'Zanahoria')
      await agregar(user, 'Alcachofa')

      await user.selectOptions(screen.getByLabelText(/Ordenar por/), 'alfabetico')
      expect(textosVisibles()).toEqual(['Alcachofa', 'Zanahoria'])
    })

    it('ordena por fecha límite y deja las tareas sin fecha al final', async () => {
      const user = userEvent.setup()
      render(<App />)

      await agregar(user, 'Sin fecha')
      await agregar(user, 'Tarde', { fecha: '2030-12-31' })
      await agregar(user, 'Pronto', { fecha: '2030-01-01' })

      await user.selectOptions(screen.getByLabelText(/Ordenar por/), 'fecha')
      expect(textosVisibles()).toEqual(['Pronto', 'Tarde', 'Sin fecha'])
    })
  })

  describe('borrado', () => {
    it('ofrece deshacer y restaura la tarea en su posición', async () => {
      const user = userEvent.setup()
      render(<App />)

      await agregar(user, 'Primera')
      await agregar(user, 'Segunda')
      await agregar(user, 'Tercera')

      // Elimina la del medio ("Segunda").
      await user.click(screen.getAllByRole('button', { name: /Eliminar/ })[1])
      expect(textosVisibles()).toEqual(['Tercera', 'Primera'])

      await user.click(screen.getByRole('button', { name: 'Deshacer' }))
      expect(textosVisibles()).toEqual(['Tercera', 'Segunda', 'Primera'])
    })

    it('borra todas las completadas de una vez', async () => {
      const user = userEvent.setup()
      render(<App />)

      await agregar(user, 'Queda')
      await agregar(user, 'Se va')
      await user.click(screen.getAllByRole('checkbox')[0]) // completa "Se va"

      await user.click(screen.getByRole('button', { name: 'Borrar completadas' }))

      expect(textosVisibles()).toEqual(['Queda'])
    })

    it('no ofrece borrar completadas si no hay ninguna', async () => {
      const user = userEvent.setup()
      render(<App />)

      await agregar(user, 'Pendiente')

      expect(
        screen.queryByRole('button', { name: 'Borrar completadas' })
      ).not.toBeInTheDocument()
    })
  })

  describe('preferencias', () => {
    it('guarda el color de acento elegido', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('radio', { name: 'Color Esmeralda' }))

      expect(JSON.parse(localStorage.getItem('acento'))).toBe('#10b981')
      expect(document.documentElement.style.getPropertyValue('--accent-color')).toBe('#10b981')
    })

    it('aplica y guarda el tema oscuro', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('radio', { name: 'Oscuro' }))

      expect(document.documentElement.dataset.theme).toBe('oscuro')
      expect(JSON.parse(localStorage.getItem('tema'))).toBe('oscuro')
    })

    it('recupera las tareas guardadas al volver a montar', async () => {
      const user = userEvent.setup()
      const { unmount } = render(<App />)

      await agregar(user, 'Persistente')
      unmount()
      render(<App />)

      expect(screen.getByText('Persistente')).toBeInTheDocument()
    })
  })
})
