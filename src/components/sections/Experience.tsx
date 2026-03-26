'use client'

import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import resumeData from '../../../data/resume.json'
import type { ResumeData } from '../../../data/types'

const data = resumeData as ResumeData

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export function Experience() {
  const [expandedId, setExpandedId] = useState<string | null>(data.experience[0]?.id ?? null)

  return (
    <section id="experience" className="min-h-screen px-8 py-20">
      <div className="font-mono text-gh-muted text-sm mb-2">
        <span className="text-gh-green">brad@resume</span>
        <span className="text-gh-muted">:~$ </span>
        <span className="text-gh-text">cat experience.json</span>
      </div>
      <h2 className="text-3xl font-bold text-gh-text mb-10">Experience</h2>

      <div className="relative max-w-3xl">
        {/* Vertical line */}
        <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gh-border" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-6"
        >
          {data.experience.map(role => {
            const isExpanded = expandedId === role.id
            return (
              <motion.div key={role.id} variants={itemVariants} className="relative pl-10">
                {/* Timeline dot */}
                <div className={`absolute left-1.5 top-4 w-4 h-4 rounded-full border-2 transition-colors duration-200 ${
                  isExpanded ? 'border-gh-blue bg-gh-blue/30' : 'border-gh-border bg-gh-surface'
                }`} />

                {/* Card */}
                <div
                  className={`bg-gh-surface border rounded-lg cursor-pointer transition-colors duration-200 ${
                    isExpanded ? 'border-gh-blue/50' : 'border-gh-border hover:border-gh-muted'
                  }`}
                  onClick={() => setExpandedId(isExpanded ? null : role.id)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-gh-text font-semibold font-sans">{role.company}</h3>
                        <p className="text-gh-blue text-sm font-mono mt-0.5">{role.title}</p>
                      </div>
                      <div className="text-right ml-4 shrink-0">
                        <p className="text-gh-muted text-xs font-mono">{role.period}</p>
                        <p className="text-gh-muted text-xs font-mono">{role.location}</p>
                      </div>
                    </div>
                    <div className="mt-1 text-gh-muted text-xs font-mono">{isExpanded ? '▲ collapse' : '▼ expand'}</div>
                  </div>

                  {/* Expanded bullets */}
                  <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-gh-border px-4 pb-4"
                    >
                      {/* Sub-roles (e.g. CSL has two teams) */}
                      {role.subRoles && role.subRoles.length > 0 ? (
                        role.subRoles.map(sub => (
                          <div key={sub.title} className="mt-4">
                            <p className="text-gh-yellow text-xs font-mono mb-2">{sub.title} · {sub.period}</p>
                            <ul className="space-y-1.5">
                              {sub.bullets.map((b, i) => (
                                <li key={i} className="flex gap-2 text-gh-muted text-sm">
                                  <span className="text-gh-green mt-0.5 shrink-0">▸</span>
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))
                      ) : (
                        <ul className="mt-4 space-y-1.5">
                          {role.bullets.map((b, i) => (
                            <li key={i} className="flex gap-2 text-gh-muted text-sm">
                              <span className="text-gh-green mt-0.5 shrink-0">▸</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
