import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TaskItem } from './TaskItem'

const tarea = {
  id: 'abc',
  texto: 'Comprar pan',
  completada: false,
  prioridad: 'media',
  fechaLimite: null,
  fechaCreacion: '2026-08-01T10:00:00.000Z',
}

function renderItem(overrides = {}, handlers = {}) {
  const props = {
    task: { ...tarea, ...overrides },
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    onEdit: vi.fn(),
    ...handlers,
  }
  render(<TaskItem {...props} />)
  return props
}

describe('TaskItem', () => {
  it('avisa al marcar la tarea como completada', async () => {
    const user = userEvent.setup()
    const { onToggle } = renderItem()
    await user.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith('abc')
  })

  it('avisa al eliminar', async () => {
    const user = userEvent.setup()
    const { onDelete } = renderItem()
    await user.click(screen.getByRole('button', { name: /Eliminar/ }))
    expect(onDelete).toHaveBeenCalledWith('abc')
  })

  describe('edición', () => {
    it('guarda el texto nuevo al pulsar Enter', async () => {
      const user = userEvent.setup()
      const { onEdit } = renderItem()

      await user.click(screen.getByRole('button', { name: /Editar/ }))
      await user.clear(screen.getByRole('textbox'))
      await user.type(screen.getByRole('textbox'), 'Comprar leche{Enter}')

      expect(onEdit).toHaveBeenCalledWith('abc', { texto: 'Comprar leche' })
    })

    it('descarta los cambios al pulsar Escape', async () => {
      const user = userEvent.setup()
      const { onEdit } = renderItem()

      await user.click(screen.getByRole('button', { name: /Editar/ }))
      await user.clear(screen.getByRole('textbox'))
      await user.type(screen.getByRole('textbox'), 'texto descartado{Escape}')

      expect(onEdit).not.toHaveBeenCalled()
      expect(screen.getByText('Comprar pan')).toBeInTheDocument()
    })

    it('no guarda un texto vacío y restaura el original', async () => {
      const user = userEvent.setup()
      const { onEdit } = renderItem()

      await user.click(screen.getByRole('button', { name: /Editar/ }))
      await user.clear(screen.getByRole('textbox'))
      await user.type(screen.getByRole('textbox'), '   {Enter}')

      expect(onEdit).not.toHaveBeenCalled()
      expect(screen.getByText('Comprar pan')).toBeInTheDocument()
    })

    it('entra en edición al hacer doble clic sobre el texto', async () => {
      const user = userEvent.setup()
      renderItem()
      await user.dblClick(screen.getByText('Comprar pan'))
      expect(screen.getByRole('textbox')).toHaveValue('Comprar pan')
    })
  })

  describe('prioridad', () => {
    it.each([
      ['alta', 'media'],
      ['media', 'baja'],
      ['baja', 'alta'],
    ])('al hacer clic pasa de %s a %s', async (desde, hasta) => {
      const user = userEvent.setup()
      const { onEdit } = renderItem({ prioridad: desde })

      await user.click(screen.getByRole('button', { name: new RegExp(`Prioridad ${desde}`) }))

      expect(onEdit).toHaveBeenCalledWith('abc', { prioridad: hasta })
    })

    it('trata una tarea sin prioridad como media', () => {
      renderItem({ prioridad: undefined })
      expect(screen.getByRole('button', { name: /Prioridad media/ })).toBeInTheDocument()
    })
  })

  describe('fecha límite', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-08-07T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('no muestra nada si la tarea no tiene fecha', () => {
      renderItem()
      expect(screen.queryByText(/Vence:|Vencida:/)).not.toBeInTheDocument()
    })

    it('muestra la fecha futura en formato dd/mm/aaaa', () => {
      renderItem({ fechaLimite: '2030-06-01' })
      expect(screen.getByText('Vence: 01/06/2030')).toBeInTheDocument()
    })

    it('marca como vencida una fecha pasada', () => {
      renderItem({ fechaLimite: '2020-01-01' })
      expect(screen.getByText('Vencida: 01/01/2020')).toBeInTheDocument()
    })

    it('no marca como vencida una tarea pasada que ya está completada', () => {
      renderItem({ fechaLimite: '2020-01-01', completada: true })
      expect(screen.getByText('Vence: 01/01/2020')).toBeInTheDocument()
    })

    it('no marca como vencida la fecha de hoy', () => {
      renderItem({ fechaLimite: '2026-08-07' })
      expect(screen.getByText('Vence: 07/08/2026')).toBeInTheDocument()
    })
  })
})
