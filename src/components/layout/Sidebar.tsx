'use client'

import { useScrollSpy } from '@/hooks/useScrollSpy'
import resumeData from '../../../data/resume.json'
import type { ResumeData } from '../../../data/types'

const data = resumeData as ResumeData

const NAV_ITEMS = [
  { id: 'hero', label: '~/hero' },
  { id: 'skills', label: '~/skills' },
  { id: 'experience', label: '~/experience' },
  { id: 'projects', label: '~/projects' },
  { id: 'github', label: '~/github' },
  { id: 'contact', label: '~/contact' },
]

const SECTION_IDS = NAV_ITEMS.map(n => n.id)

export function Sidebar() {
  const activeId = useScrollSpy(SECTION_IDS)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-56 bg-gh-surface border-r border-gh-border z-50">
      {/* Avatar + identity */}
      <div className="flex items-center gap-3 p-4 border-b border-gh-border">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gh-green to-gh-blue flex items-center justify-center text-white font-bold text-sm font-mono shrink-0">
          BL
        </div>
        <div>
          <div className="text-gh-text text-sm font-mono font-semibold">brad_luo</div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gh-green"></span>
            <span className="text-gh-green text-xs font-mono">online</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2">
        {NAV_ITEMS.map(item => {
          const isActive = activeId === item.id
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`w-full text-left px-3 py-2 rounded-r text-sm font-mono transition-all duration-150 mb-1 ${
                isActive
                  ? 'text-gh-blue bg-gh-blue/10 border-l-2 border-gh-blue'
                  : 'text-gh-muted hover:text-gh-text hover:bg-gh-border/30 border-l-2 border-transparent'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Social icons */}
      <div className="p-4 border-t border-gh-border flex gap-4">
        <a href={data.personal.github} target="_blank" rel="noopener noreferrer" className="text-gh-muted hover:text-gh-blue transition-colors text-xs font-mono">GH</a>
        <a href={data.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-gh-muted hover:text-gh-blue transition-colors text-xs font-mono">LI</a>
        <a href={`mailto:${data.personal.email}`} className="text-gh-muted hover:text-gh-blue transition-colors text-xs font-mono">✉</a>
      </div>
    </aside>
  )
}
