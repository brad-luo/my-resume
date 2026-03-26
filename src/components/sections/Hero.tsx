'use client'

import { useTypewriter } from '@/hooks/useTypewriter'
import resumeData from '../../../data/resume.json'
import type { ResumeData } from '../../../data/types'

const data = resumeData as ResumeData

const HIGHLIGHT_TAGS = ['React', 'Next.js', 'Python', 'AWS', 'GenAI', 'Docker', 'TypeScript', 'PyTorch']

export function Hero() {
  const displayed = useTypewriter(data.personal.titles, 80, 1800, 40)

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center px-8 py-16 lg:py-24">
      {/* Prompt line */}
      <div className="font-mono text-gh-muted text-sm mb-2">
        <span className="text-gh-green">brad@resume</span>
        <span className="text-gh-muted">:</span>
        <span className="text-gh-blue">~</span>
        <span className="text-gh-muted">$ </span>
        <span className="text-gh-text">whoami</span>
      </div>

      {/* Name */}
      <h1 className="text-4xl lg:text-6xl font-bold text-gh-text font-sans mt-4 mb-3">
        {data.personal.name}
      </h1>

      {/* Typewriter title */}
      <div className="flex items-center gap-0 h-10 mb-6">
        <span className="text-xl lg:text-2xl text-gh-blue font-mono">
          {displayed}
        </span>
        <span className="text-gh-green font-mono text-xl lg:text-2xl cursor-blink ml-0.5">█</span>
      </div>

      {/* Profile summary */}
      <p className="text-gh-muted text-base lg:text-lg max-w-2xl leading-relaxed mb-8 font-sans">
        {data.personal.profileSummary}
      </p>

      {/* Skill badges */}
      <div className="flex flex-wrap gap-2 mb-10 max-w-2xl">
        {HIGHLIGHT_TAGS.map(tag => (
          <span
            key={tag}
            className="px-3 py-1 text-xs font-mono rounded-full border bg-gh-surface border-gh-border text-gh-text hover:border-gh-blue hover:text-gh-blue transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CTA links */}
      <div className="flex flex-wrap gap-4 font-mono text-sm">
        <a href={`mailto:${data.personal.email}`} className="flex items-center gap-2 text-gh-green hover:text-gh-blue transition-colors">
          <span>✉</span> {data.personal.email}
        </a>
        <a href={data.personal.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gh-muted hover:text-gh-blue transition-colors">
          <span>⬡</span> github.com/brad-luo
        </a>
        <a href={data.personal.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gh-muted hover:text-gh-blue transition-colors">
          <span>in</span> linkedin
        </a>
      </div>

      {/* Scroll hint */}
      <div className="mt-16 font-mono text-gh-muted text-xs animate-bounce">
        ▼ scroll to explore
      </div>
    </section>
  )
}
