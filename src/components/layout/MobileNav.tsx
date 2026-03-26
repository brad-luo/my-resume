'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
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

export function MobileNav() {
  const [open, setOpen] = useState(false)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <header className="lg:hidden sticky top-0 z-50 bg-gh-surface/95 backdrop-blur border-b border-gh-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gh-green to-gh-blue flex items-center justify-center text-white font-bold text-xs font-mono">
          BL
        </div>
        <span className="text-gh-text text-sm font-mono font-semibold">brad_luo</span>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<button className="text-gh-muted hover:text-gh-text font-mono text-lg p-1" />}>
          ☰
        </SheetTrigger>
        <SheetContent side="left" className="bg-gh-surface border-gh-border w-56 pt-8">
          <div className="flex flex-col gap-1 mt-4">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-left px-3 py-2.5 text-gh-muted hover:text-gh-blue font-mono text-sm hover:bg-gh-border/30 rounded transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="absolute bottom-6 left-4 flex gap-4 font-mono text-xs">
            <a href={data.personal.github} target="_blank" rel="noopener noreferrer" className="text-gh-muted hover:text-gh-blue">GH</a>
            <a href={data.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-gh-muted hover:text-gh-blue">LI</a>
            <a href={`mailto:${data.personal.email}`} className="text-gh-muted hover:text-gh-blue">✉</a>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
