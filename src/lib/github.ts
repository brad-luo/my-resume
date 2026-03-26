export interface GitHubRepo {
  id: number
  name: string
  stargazers_count: number
  language: string | null
  html_url: string
  description: string | null
  fork: boolean
}

export interface GitHubPushEvent {
  type: 'PushEvent'
  repo: { name: string }
  payload: { commits?: Array<{ message: string }> }
  created_at: string
}

export interface ActivityDay {
  date: string
  count: number
}

const BASE = 'https://api.github.com'

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const res = await fetch(`${BASE}/users/${username}/repos?per_page=100&sort=updated`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  const repos: GitHubRepo[] = await res.json()
  return repos
    .filter(r => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6)
}

export async function fetchGitHubEvents(username: string): Promise<GitHubPushEvent[]> {
  const res = await fetch(`${BASE}/users/${username}/events/public?per_page=90`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  const events = await res.json()
  return events.filter((e: { type: string }) => e.type === 'PushEvent') as GitHubPushEvent[]
}

export function buildActivityGrid(events: GitHubPushEvent[]): ActivityDay[][] {
  const now = new Date()
  const countMap = new Map<string, number>()
  events.forEach(e => {
    const d = e.created_at.slice(0, 10)
    countMap.set(d, (countMap.get(d) ?? 0) + 1)
  })

  const grid: ActivityDay[][] = []
  const startDate = new Date(now)
  startDate.setDate(startDate.getDate() - 83)

  for (let week = 0; week < 12; week++) {
    const weekDays: ActivityDay[] = []
    for (let day = 0; day < 7; day++) {
      const d = new Date(startDate)
      d.setDate(startDate.getDate() + week * 7 + day)
      const dateStr = d.toISOString().slice(0, 10)
      weekDays.push({ date: dateStr, count: countMap.get(dateStr) ?? 0 })
    }
    grid.push(weekDays)
  }
  return grid
}
