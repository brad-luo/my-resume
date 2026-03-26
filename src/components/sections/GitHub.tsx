'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  fetchGitHubRepos,
  fetchGitHubEvents,
  buildActivityGrid,
  type GitHubRepo,
  type GitHubPushEvent,
  type ActivityDay,
} from '@/lib/github'
import resumeData from '../../../data/resume.json'
import type { ResumeData } from '../../../data/types'

const data = resumeData as ResumeData
const USERNAME = data.personal.githubUsername

function activityColor(count: number): string {
  if (count === 0) return 'bg-gh-border/30'
  if (count === 1) return 'bg-gh-green/30'
  if (count <= 3) return 'bg-gh-green/55'
  if (count <= 6) return 'bg-gh-green/80'
  return 'bg-gh-green'
}

export function GitHub() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [events, setEvents] = useState<GitHubPushEvent[]>([])
  const [grid, setGrid] = useState<ActivityDay[][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([fetchGitHubRepos(USERNAME), fetchGitHubEvents(USERNAME)])
      .then(([r, e]) => {
        setRepos(r)
        setEvents(e)
        setGrid(buildActivityGrid(e))
      })
      .catch(() => setError('GitHub activity unavailable — API rate limit or network error.'))
      .finally(() => setLoading(false))
  }, [])

  const recentCommits = events.slice(0, 10).flatMap(e =>
    e.payload.commits.slice(0, 1).map(c => ({
      repo: e.repo.name.split('/')[1],
      message: c.message.split('\n')[0].slice(0, 60),
      date: new Date(e.created_at).toLocaleDateString(),
    }))
  ).slice(0, 8)

  return (
    <section id="github" className="min-h-screen px-8 py-20">
      <div className="font-mono text-gh-muted text-sm mb-2">
        <span className="text-gh-green">brad@resume</span>
        <span className="text-gh-muted">:~$ </span>
        <span className="text-gh-text">gh api /users/{USERNAME}</span>
      </div>
      <h2 className="text-3xl font-bold text-gh-text mb-10">GitHub</h2>

      {loading && (
        <div className="font-mono text-gh-muted text-sm animate-pulse">
          Fetching github.com/{USERNAME} ...
        </div>
      )}

      {error && (
        <div className="font-mono text-gh-muted text-sm border border-gh-border rounded p-4">
          ⚠ {error}
        </div>
      )}

      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 max-w-4xl"
        >
          {/* Activity grid */}
          <div>
            <p className="text-gh-muted text-xs font-mono mb-3">
              activity · last 12 weeks · {events.length} public events
            </p>
            <div className="flex gap-1">
              {grid.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      title={`${day.date}: ${day.count} events`}
                      className={`w-3 h-3 rounded-sm ${activityColor(day.count)} transition-colors`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent commits */}
            <div>
              <h3 className="text-gh-text text-sm font-mono mb-4 flex items-center gap-2">
                <span className="text-gh-green">●</span> recent commits
              </h3>
              <div className="space-y-2">
                {recentCommits.map((c, i) => (
                  <div key={i} className="bg-gh-surface border border-gh-border rounded p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gh-blue text-xs font-mono">{c.repo}</span>
                      <span className="text-gh-muted text-xs font-mono ml-auto">{c.date}</span>
                    </div>
                    <p className="text-gh-muted text-xs font-mono truncate">▸ {c.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top repos */}
            <div>
              <h3 className="text-gh-text text-sm font-mono mb-4 flex items-center gap-2">
                <span className="text-gh-yellow">⬡</span> top repos
              </h3>
              <div className="space-y-2">
                {repos.map(repo => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gh-surface border border-gh-border rounded p-3 hover:border-gh-blue/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gh-blue text-xs font-mono">{repo.name}</span>
                      <span className="text-gh-muted text-xs font-mono">★ {repo.stargazers_count}</span>
                    </div>
                    {repo.description && (
                      <p className="text-gh-muted text-xs truncate">{repo.description}</p>
                    )}
                    {repo.language && (
                      <span className="text-gh-muted text-xs font-mono mt-1 inline-block">{repo.language}</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  )
}
