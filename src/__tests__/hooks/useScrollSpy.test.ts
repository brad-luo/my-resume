import { renderHook, act } from '@testing-library/react'
import { useScrollSpy } from '@/hooks/useScrollSpy'

const mockObserve = jest.fn()
const mockUnobserve = jest.fn()
const mockDisconnect = jest.fn()
let observerCallback: IntersectionObserverCallback

beforeEach(() => {
  mockObserve.mockClear()
  mockUnobserve.mockClear()
  global.IntersectionObserver = jest.fn((cb) => {
    observerCallback = cb
    return {
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
    }
  }) as unknown as typeof IntersectionObserver
})

describe('useScrollSpy', () => {
  it('returns null when no sections are intersecting', () => {
    const { result } = renderHook(() => useScrollSpy(['hero', 'skills']))
    expect(result.current).toBeNull()
  })

  it('observes elements matching provided ids', () => {
    const hero = document.createElement('div')
    hero.id = 'hero'
    document.body.appendChild(hero)

    renderHook(() => useScrollSpy(['hero']))
    expect(mockObserve).toHaveBeenCalledWith(hero)

    document.body.removeChild(hero)
  })

  it('returns id of highest-ratio intersecting entry', () => {
    const hero = document.createElement('div')
    hero.id = 'hero'
    document.body.appendChild(hero)

    const { result } = renderHook(() => useScrollSpy(['hero']))

    act(() => {
      observerCallback(
        [{ target: hero, intersectionRatio: 0.8, isIntersecting: true }] as unknown as IntersectionObserverEntry[],
        {} as IntersectionObserver
      )
    })

    expect(result.current).toBe('hero')
    document.body.removeChild(hero)
  })
})
