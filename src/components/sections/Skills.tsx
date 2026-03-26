'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip
} from 'recharts'
import resumeData from '../../../data/resume.json'
import type { ResumeData } from '../../../data/types'

const data = resumeData as ResumeData

const DOMAIN_COLORS: Record<string, string> = {
  'Full-Stack': '#3fb950',
  'GenAI': '#e3b341',
  'Cloud/DevOps': '#a371f7',
  'ML/AI': '#58a6ff',
  'Databases': '#f78166',
  'Other': '#8b949e',
}

export function Skills() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const allDomains = Object.keys(data.skills.tags)
  const visibleTags = activeFilter
    ? data.skills.tags[activeFilter] ?? []
    : Array.from(new Set(allDomains.flatMap(d => data.skills.tags[d] ?? [])))

  const radarData = data.skills.domains.map(d => ({
    domain: d.name,
    score: d.score,
  }))

  return (
    <section id="skills" className="min-h-screen px-8 py-20">
      {/* Section header */}
      <div className="font-mono text-gh-muted text-sm mb-2">
        <span className="text-gh-green">brad@resume</span>
        <span className="text-gh-muted">:~$ </span>
        <span className="text-gh-text">cat skills.json</span>
      </div>
      <h2 className="text-3xl font-bold text-gh-text mb-10">Skills</h2>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-96 h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#30363d" />
              <PolarAngleAxis dataKey="domain" tick={{ fill: '#8b949e', fontSize: 12, fontFamily: 'var(--font-jetbrains-mono)' }} />
              <Radar
                name="Skills"
                dataKey="score"
                stroke="#58a6ff"
                fill="#58a6ff"
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6, fontFamily: 'monospace', fontSize: 12 }}
                labelStyle={{ color: '#e6edf3' }}
                itemStyle={{ color: '#58a6ff' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Tag cloud with filter */}
        <div className="flex-1">
          {/* Domain filter buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveFilter(null)}
              className={`px-3 py-1 text-xs font-mono rounded border transition-colors ${
                activeFilter === null
                  ? 'border-gh-blue text-gh-blue bg-gh-blue/10'
                  : 'border-gh-border text-gh-muted hover:border-gh-text hover:text-gh-text'
              }`}
            >
              all
            </button>
            {allDomains.map(domain => (
              <button
                key={domain}
                onClick={() => setActiveFilter(activeFilter === domain ? null : domain)}
                style={activeFilter === domain ? { borderColor: DOMAIN_COLORS[domain] ?? '#8b949e', color: DOMAIN_COLORS[domain] ?? '#8b949e', background: `${DOMAIN_COLORS[domain] ?? '#8b949e'}18` } : {}}
                className={`px-3 py-1 text-xs font-mono rounded border transition-colors ${
                  activeFilter === domain
                    ? ''
                    : 'border-gh-border text-gh-muted hover:border-gh-text hover:text-gh-text'
                }`}
              >
                {domain.toLowerCase()}
              </button>
            ))}
          </div>

          {/* Tags */}
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            {visibleTags.map(tag => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs font-mono rounded border border-gh-border bg-gh-surface text-gh-muted hover:border-gh-blue hover:text-gh-blue transition-colors cursor-default"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
