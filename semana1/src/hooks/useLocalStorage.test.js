import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useLocalStorage } from './useLocalStorage'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useLocalStorage', () => {
  it('devuelve el valor inicial cuando no hay nada guardado', () => {
    const { result } = renderHook(() => useLocalStorage('tasks', []))
    expect(result.current[0]).toEqual([])
  })

  it('lee el valor ya existente en localStorage', () => {
    localStorage.setItem('tasks', JSON.stringify([{ id: '1' }]))
    const { result } = renderHook(() => useLocalStorage('tasks', []))
    expect(result.current[0]).toEqual([{ id: '1' }])
  })

  it('persiste los cambios', () => {
    const { result } = renderHook(() => useLocalStorage('tasks', []))
    act(() => result.current[1]([{ id: '2' }]))
    expect(JSON.parse(localStorage.getItem('tasks'))).toEqual([{ id: '2' }])
  })

  it('cae al valor inicial si el JSON guardado está corrupto', () => {
    localStorage.setItem('tasks', '{esto no es json')
    const { result } = renderHook(() => useLocalStorage('tasks', []))
    expect(result.current[0]).toEqual([])
  })

  it('no rompe si localStorage falla al escribir (cuota excedida)', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    const { result } = renderHook(() => useLocalStorage('tasks', []))
    expect(() => act(() => result.current[1]([{ id: '3' }]))).not.toThrow()
    expect(result.current[0]).toEqual([{ id: '3' }])
  })
})
