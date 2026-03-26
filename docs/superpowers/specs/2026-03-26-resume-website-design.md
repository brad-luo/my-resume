# Resume Website — Design Spec

**Date:** 2026-03-26
**Author:** Brad Luo
**Domain:** resume.bradluo.com

---

## Overview

A personal resume website for Xiaole (Brad) Luo — Senior Software Engineer / Full-Stack / GenAI Engineer. Single-page scrollable site with a fixed terminal-style sidebar, deployed to Vercel and served at `resume.bradluo.com` via Route53.

---

## Design Direction

- **Theme:** Dark / Terminal — GitHub-dark background (`#0d1117`), monospace accents, neon green (`#3fb950`) and blue (`#58a6ff`) highlights
- **Feel:** IDE/shell aesthetic — sidebar resembles a file tree, active section highlighted like an open file
- **Typography:** Monospace for labels/prompts, sans-serif for body content

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 14 (App Router), TypeScript |
| Styling | TailwindCSS + Shadcn UI (dark theme) |
| Animations | Framer Motion |
| Charts | Recharts |
| Package manager | npm |
| Deployment | Vercel (auto-deploy from `main`) |
| DNS | AWS Route53 |

---

## Architecture

Single-page application. One `app/page.tsx` renders all sections in order. A fixed `<aside>` sidebar uses an `IntersectionObserver` scroll-spy hook to highlight the currently visible section. No routing — all navigation is scroll-based with anchor links.

### File Structure

```
src/
├── app/
│   ├── layout.tsx          # root layout, fonts, metadata, dark theme
│   ├── page.tsx            # single page, renders all sections
│   └── globals.css         # tailwind directives + CSS custom properties
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx     # fixed sidebar, scroll-spy nav, social links
│   ├── sections/
│   │   ├── Hero.tsx        # terminal typing animation
│   │   ├── Skills.tsx      # radar chart + tag cloud
│   │   ├── Experience.tsx  # animated vertical timeline
│   │   ├── Projects.tsx    # project cards with tech badges
│   │   ├── GitHub.tsx      # live GitHub activity feed
│   │   └── Contact.tsx     # email, GitHub, LinkedIn, bradluo.com
│   └── ui/                 # shadcn/ui components
├── hooks/
│   ├── useScrollSpy.ts     # IntersectionObserver — returns active section id
│   └── useTypewriter.ts    # cycles through strings with typing effect
├── lib/
│   └── github.ts           # GitHub public API fetch helpers
└── data/
    ├── resume.json          # all resume content — edit this to update site
    └── types.ts             # TypeScript types for resume.json shape
```

---

## Sections

### 1. Hero (`#hero`)
- Full-width section with terminal prompt aesthetic
- `$ whoami` prompt followed by typewriter cycling through: `"Senior Software Engineer"`, `"Full-Stack Developer"`, `"GenAI Engineer"`, `"Cloud & AI Specialist"`
- Name, contact links, and skill badge chips below
- Blinking cursor via CSS animation

### 2. Skills (`#skills`)
- Recharts `RadarChart` with 6 axes: Full-Stack, GenAI, Cloud/DevOps, ML/AI, Databases, Other
- Neon blue polygon fill, animated entry via Framer Motion when scrolled into view
- Filterable tag cloud below the chart — clicking a category filters visible tags

### 3. Experience (`#experience`)
- Vertical timeline with animated dots (Framer Motion `staggerChildren` on scroll entry)
- Each role: company, title, date range, location
- Click to expand card and reveal bullet points
- Roles: CSL, Monash University, Globalegrow, Guangdong Achieve, Deepera

### 4. Projects (`#projects`)
- Card grid — one card per project
- Each card: project name, description, tech stack badges, links (GitHub / live demo if available)
- Projects: Brad's Comics Creator, Image Style Generators, Self-hosted DevOps Stack on GKE, OpenPromo, Prostate Cancer Segmentation, Ops Platform

### 5. GitHub (`#github`)
- Client-side fetch to GitHub public REST API v3 (`api.github.com/users/brad-luo`) — no auth required
- Shows: recent push events (last 10 commits across repos), top public repos (name, stars, language), total public repo count
- Activity grid built from the last 90 public events (REST API limit) — approximate, not the full GitHub contribution graph (which requires GraphQL auth)
- Graceful fallback message if rate-limited (60 req/hr per IP on unauthenticated calls)

### 6. Contact (`#contact`)
- Email: xiaoleluo2@gmail.com
- GitHub: github.com/brad-luo
- LinkedIn: linkedin.com/in/xiaole-brad-luo/
- Website: bradluo.com

---

## Sidebar

- Fixed left sidebar, visible on desktop (hidden on mobile, replaced by hamburger menu)
- Top: avatar initials (`BL`), username `brad_luo`, green online indicator
- Nav links: `~/hero`, `~/skills`, `~/experience`, `~/projects`, `~/github`, `~/contact`
- Active section highlighted with blue left border + background tint (scroll-spy)
- Bottom: GitHub, LinkedIn, email icon links

---

## Content Management

All resume content is stored in `data/resume.json` — a plain JSON file with no TypeScript syntax. To update the site: edit `resume.json`, commit and push to `main`, Vercel auto-redeploys.

TypeScript types for the JSON shape are defined in `data/types.ts` and used throughout components.

---

## Feature Details

### Terminal Typing Animation
`useTypewriter` hook accepts an array of strings and a typing speed (ms/char). Cycles through strings with a delete-then-retype transition. Blinking `█` cursor rendered via CSS `@keyframes`.

### Scroll-Spy
`useScrollSpy` hook registers `IntersectionObserver` on each section element. Returns the `id` of the section with the highest intersection ratio. Sidebar uses this to apply active styles.

### Skill Radar Chart
Six skill domains with a 0–100 proficiency score defined in `resume.json`. Recharts `RadarChart` with `PolarGrid`, `PolarAngleAxis`, and `Radar` components. `Framer Motion` wraps the chart for fade-in on scroll.

### Animated Timeline
Framer Motion `motion.div` with `variants` for each timeline item. `staggerChildren: 0.15` on the container triggers each item to slide in from the left when the section enters the viewport. Click toggles `expanded` state to show/hide bullet points.

### GitHub Live Feed
`lib/github.ts` exports `fetchGitHubEvents(username)` and `fetchGitHubRepos(username)` — plain `fetch` calls to the GitHub REST API v3 (no auth, 60 req/hr per IP). `fetchGitHubEvents` returns the last 90 public events; the component filters for `PushEvent` type to show recent commits and builds an approximate activity grid. Components call these on mount with `useEffect`. Loading skeleton shown while fetching. Error state shows "GitHub activity unavailable."

---

## Responsive Behaviour

- **Desktop (≥1024px):** Fixed sidebar + scrollable main content
- **Mobile (<1024px):** Sidebar hidden; sticky top nav bar with hamburger menu that opens a drawer

---

## Deployment & DNS

1. **GitHub repo:** `my-resume` — feature branches, PRs to `main`
2. **Vercel:** Connect `my-resume` repo, auto-deploy on push to `main`, framework preset: Next.js
3. **Custom domain:** Add `resume.bradluo.com` in Vercel project settings → Vercel provides a CNAME target
4. **Route53:** In `bradluo.com` hosted zone, create `CNAME` record: name `resume`, value = Vercel CNAME target, TTL 300
5. **HTTPS:** Vercel auto-provisions Let's Encrypt cert once DNS propagates (~5 min)

---

## Git Workflow

- `main` — production branch, protected, auto-deploys to Vercel
- Feature branches: `feature/<name>` (e.g., `feature/hero-section`)
- PRs required to merge to `main`
- Suggested branch order: scaffold → hero → skills → experience → projects → github → contact → deployment → dns
