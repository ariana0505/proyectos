import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TaskForm } from './TaskForm'

describe('TaskForm', () => {
  it('envía el texto, la prioridad y la fecha elegidos', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<TaskForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Texto de la nueva tarea'), 'Comprar pan')
    await user.selectOptions(screen.getByLabelText('Prioridad'), 'alta')
    await user.type(screen.getByLabelText('Fecha límite'), '2030-06-01')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(onAdd).toHaveBeenCalledWith({
      texto: 'Comprar pan',
      prioridad: 'alta',
      fechaLimite: '2030-06-01',
    })
  })

  it('usa prioridad media por defecto y fecha vacía', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<TaskForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Texto de la nueva tarea'), 'Sin extras')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(onAdd).toHaveBeenCalledWith({
      texto: 'Sin extras',
      prioridad: 'media',
      fechaLimite: '',
    })
  })

  it('recorta los espacios sobrantes del texto', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<TaskForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Texto de la nueva tarea'), '   con espacios   ')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ texto: 'con espacios' }))
  })

  it('ignora el envío si el texto está vacío o es solo espacios', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<TaskForm onAdd={onAdd} />)

    await user.click(screen.getByRole('button', { name: 'Agregar' }))
    await user.type(screen.getByLabelText('Texto de la nueva tarea'), '     ')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('limpia el texto y la fecha tras agregar, conservando la prioridad', async () => {
    const user = userEvent.setup()
    render(<TaskForm onAdd={vi.fn()} />)

    const input = screen.getByLabelText('Texto de la nueva tarea')
    const fecha = screen.getByLabelText('Fecha límite')
    await user.type(input, 'Una tarea')
    await user.selectOptions(screen.getByLabelText('Prioridad'), 'baja')
    await user.type(fecha, '2030-06-01')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(input).toHaveValue('')
    expect(fecha).toHaveValue('')
    expect(screen.getByLabelText('Prioridad')).toHaveValue('baja')
  })
})
