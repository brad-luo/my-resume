import { fetchGitHubRepos, fetchGitHubEvents, buildActivityGrid } from '@/lib/github'

global.fetch = jest.fn()

afterEach(() => jest.clearAllMocks())

describe('fetchGitHubRepos', () => {
  it('returns repos sorted by stars descending', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, name: 'repo-a', stargazers_count: 5, language: 'Python', html_url: 'https://github.com/brad-luo/repo-a', description: 'desc a', fork: false },
        { id: 2, name: 'repo-b', stargazers_count: 12, language: 'TypeScript', html_url: 'https://github.com/brad-luo/repo-b', description: 'desc b', fork: false },
      ],
    })
    const repos = await fetchGitHubRepos('brad-luo')
    expect(repos[0].name).toBe('repo-b')
    expect(repos[1].name).toBe('repo-a')
  })

  it('throws on non-ok response', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 403 })
    await expect(fetchGitHubRepos('brad-luo')).rejects.toThrow('GitHub API error: 403')
  })
})

describe('fetchGitHubEvents', () => {
  it('returns only PushEvents', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { type: 'PushEvent', repo: { name: 'brad-luo/repo-a' }, payload: { commits: [{ message: 'fix bug' }] }, created_at: '2025-01-01T00:00:00Z' },
        { type: 'WatchEvent', repo: { name: 'brad-luo/repo-b' }, payload: {}, created_at: '2025-01-01T00:00:00Z' },
      ],
    })
    const events = await fetchGitHubEvents('brad-luo')
    expect(events).toHaveLength(1)
    expect(events[0].type).toBe('PushEvent')
  })

  it('throws on non-ok response', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 429 })
    await expect(fetchGitHubEvents('brad-luo')).rejects.toThrow('GitHub API error: 429')
  })
})

describe('buildActivityGrid', () => {
  it('returns 12 weeks of day buckets', () => {
    const grid = buildActivityGrid([])
    expect(grid).toHaveLength(12)
    expect(grid[0]).toHaveLength(7)
  })

  it('counts events per day', () => {
    const today = new Date().toISOString()
    const events = [
      { type: 'PushEvent' as const, repo: { name: 'r' }, payload: { commits: [] }, created_at: today },
      { type: 'PushEvent' as const, repo: { name: 'r' }, payload: { commits: [] }, created_at: today },
    ]
    const grid = buildActivityGrid(events)
    const flat = grid.flat()
    expect(flat.some(d => d.count >= 2)).toBe(true)
  })
})
