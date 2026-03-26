'use client'

import { motion, type Variants } from 'framer-motion'
import resumeData from '../../../data/resume.json'
import type { ResumeData } from '../../../data/types'

const data = resumeData as ResumeData

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const TAG_COLORS: Record<string, string> = {
  'GenAI': 'text-gh-yellow border-gh-yellow/30 bg-gh-yellow/10',
  'Full-Stack': 'text-gh-green border-gh-green/30 bg-gh-green/10',
  'Cloud/DevOps': 'text-gh-purple border-gh-purple/30 bg-gh-purple/10',
  'ML/AI': 'text-gh-blue border-gh-blue/30 bg-gh-blue/10',
  'Next.js': 'text-gh-text border-gh-border bg-gh-surface',
  'AWS': 'text-gh-yellow border-gh-yellow/30 bg-gh-yellow/10',
  'GCP': 'text-gh-blue border-gh-blue/30 bg-gh-blue/10',
  'Kubernetes': 'text-gh-purple border-gh-purple/30 bg-gh-purple/10',
  'Deep Learning': 'text-gh-blue border-gh-blue/30 bg-gh-blue/10',
  'Research': 'text-gh-muted border-gh-border bg-gh-surface',
  'Serverless': 'text-gh-green border-gh-green/30 bg-gh-green/10',
  'Python': 'text-gh-blue border-gh-blue/30 bg-gh-blue/10',
  'DevOps': 'text-gh-purple border-gh-purple/30 bg-gh-purple/10',
}

export function Projects() {
  return (
    <section id="projects" className="min-h-screen px-8 py-20">
      <div className="font-mono text-gh-muted text-sm mb-2">
        <span className="text-gh-green">brad@resume</span>
        <span className="text-gh-muted">:~$ </span>
        <span className="text-gh-text">ls -la projects/</span>
      </div>
      <h2 className="text-3xl font-bold text-gh-text mb-10">Projects</h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl"
      >
        {data.projects.map(project => (
          <motion.div
            key={project.id}
            variants={cardVariants}
            className="bg-gh-surface border border-gh-border rounded-lg p-5 hover:border-gh-blue/50 transition-colors duration-200 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-gh-text font-semibold font-sans text-base leading-tight">{project.name}</h3>
              <span className="text-gh-muted text-xs font-mono ml-3 shrink-0">{project.period}</span>
            </div>

            {/* Description */}
            <p className="text-gh-muted text-sm leading-relaxed mb-4 flex-1">{project.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tags.map(tag => (
                <span
                  key={tag}
                  className={`px-2 py-0.5 text-xs font-mono rounded border ${TAG_COLORS[tag] ?? 'text-gh-muted border-gh-border bg-gh-surface'}`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.techStack.map(tech => (
                <span key={tech} className="px-2 py-0.5 text-xs font-mono rounded border border-gh-border/50 text-gh-muted">
                  {tech}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="flex gap-3 text-xs font-mono">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gh-blue hover:text-gh-text transition-colors">
                  ⬡ source
                </a>
              )}
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-gh-green hover:text-gh-text transition-colors">
                  ↗ live demo
                </a>
              )}
              {!project.githubUrl && !project.demoUrl && (
                <span className="text-gh-muted">private repo</span>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
