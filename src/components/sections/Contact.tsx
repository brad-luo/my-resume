'use client'

import { motion } from 'framer-motion'
import resumeData from '../../../data/resume.json'
import type { ResumeData } from '../../../data/types'

const data = resumeData as ResumeData

const LINKS = [
  {
    label: 'Email',
    value: data.personal.email,
    href: `mailto:${data.personal.email}`,
    icon: '✉',
    color: 'hover:text-gh-green hover:border-gh-green/50',
    description: 'Best way to reach me',
  },
  {
    label: 'GitHub',
    value: `github.com/${data.personal.githubUsername}`,
    href: data.personal.github,
    icon: '⬡',
    color: 'hover:text-gh-blue hover:border-gh-blue/50',
    description: 'Open source projects',
  },
  {
    label: 'LinkedIn',
    value: data.personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\//, '').replace(/\/$/, ''),
    href: data.personal.linkedin,
    icon: 'in',
    color: 'hover:text-gh-blue hover:border-gh-blue/50',
    description: 'Professional profile',
  },
  {
    label: 'Website',
    value: data.personal.website.replace('https://', ''),
    href: data.personal.website,
    icon: '↗',
    color: 'hover:text-gh-purple hover:border-gh-purple/50',
    description: 'Personal website',
  },
]

export function Contact() {
  return (
    <section id="contact" className="min-h-[60vh] px-8 py-20">
      <div className="font-mono text-gh-muted text-sm mb-2">
        <span className="text-gh-green">brad@resume</span>
        <span className="text-gh-muted">:~$ </span>
        <span className="text-gh-text">cat contact.json</span>
      </div>
      <h2 className="text-3xl font-bold text-gh-text mb-4">Contact</h2>
      <p className="text-gh-muted font-sans mb-10 max-w-lg">
        Open to interesting opportunities. Reach out via email or connect on LinkedIn.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl"
      >
        {LINKS.map(link => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('mailto') ? undefined : '_blank'}
            rel="noopener noreferrer"
            className={`group flex items-center gap-4 bg-gh-surface border border-gh-border rounded-lg p-4 transition-colors duration-200 ${link.color}`}
          >
            <div className="w-10 h-10 rounded-lg bg-gh-bg border border-gh-border flex items-center justify-center font-mono text-gh-muted group-hover:border-current group-hover:text-current transition-colors text-sm">
              {link.icon}
            </div>
            <div>
              <div className="text-gh-text text-sm font-semibold font-sans">{link.label}</div>
              <div className="text-gh-muted text-xs font-mono">{link.value}</div>
              <div className="text-gh-muted text-xs mt-0.5">{link.description}</div>
            </div>
          </a>
        ))}
      </motion.div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-gh-border font-mono text-gh-muted text-xs">
        <span>Built with Next.js · Deployed on Vercel · </span>
        <a href={data.personal.github} target="_blank" rel="noopener noreferrer" className="text-gh-blue hover:underline">
          view source
        </a>
      </div>
    </section>
  )
}
