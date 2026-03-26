import { renderHook, act } from '@testing-library/react'
import { useTypewriter } from '@/hooks/useTypewriter'

jest.useFakeTimers()

async function advanceTicks(n: number, interval: number) {
  for (let i = 0; i < n; i++) {
    await act(async () => { await jest.advanceTimersByTimeAsync(interval) })
  }
}

describe('useTypewriter', () => {
  const strings = ['Hello', 'World']

  it('starts with an empty string', () => {
    const { result } = renderHook(() => useTypewriter(strings, 50))
    expect(result.current).toBe('')
  })

  it('types the first character after one interval', async () => {
    const { result } = renderHook(() => useTypewriter(strings, 50))
    await advanceTicks(1, 50)
    expect(result.current).toBe('H')
  })

  it('completes typing the first string', async () => {
    const { result } = renderHook(() => useTypewriter(strings, 50))
    await advanceTicks(5, 50)
    expect(result.current).toBe('Hello')
  })

  it('starts deleting after pause at full string', async () => {
    const { result } = renderHook(() => useTypewriter(strings, 50, 500))
    // Type all 5 chars (5 * 50ms = 250ms)
    await advanceTicks(5, 50)
    expect(result.current).toBe('Hello')
    // Wait for pause (500ms) — triggers setIsDeleting(true)
    await act(async () => { await jest.advanceTimersByTimeAsync(500) })
    // One delete tick (40ms default deletingSpeed)
    await act(async () => { await jest.advanceTimersByTimeAsync(50) })
    expect(result.current).toBe('Hell')
  })
})
