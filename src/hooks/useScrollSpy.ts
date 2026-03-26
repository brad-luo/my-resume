import { useState, useEffect } from 'react'

export function useScrollSpy(sectionIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const ratioMap = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          ratioMap.set(entry.target.id, entry.intersectionRatio)
        })
        let maxRatio = 0
        let maxId: string | null = null
        ratioMap.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio
            maxId = id
          }
        })
        if (maxId) setActiveId(maxId)
      },
      { threshold: [0, 0.1, 0.3, 0.5, 0.7, 1.0] }
    )

    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sectionIds])

  return activeId
}
