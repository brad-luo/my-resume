# Resume Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a dark terminal-themed personal resume website for Brad Luo at resume.bradluo.com.

**Architecture:** Single-page Next.js 14 App Router app with a fixed terminal-style sidebar using IntersectionObserver scroll-spy. All resume content lives in `data/resume.json`. Six sections: Hero (typewriter animation), Skills (radar chart), Experience (animated timeline), Projects (cards), GitHub (live API), Contact.

**Tech Stack:** Next.js 14 (App Router), TypeScript, TailwindCSS, Shadcn UI, Framer Motion, Recharts, Jest + React Testing Library, Vercel, AWS Route53

---

## File Map

| File | Purpose |
|---|---|
| `src/app/layout.tsx` | Root layout, Inter + JetBrains Mono fonts, metadata, dark HTML class |
| `src/app/page.tsx` | Single page — renders Sidebar + all 6 sections |
| `src/app/globals.css` | Tailwind directives, CSS custom properties for terminal theme colours |
| `src/components/layout/Sidebar.tsx` | Fixed sidebar: avatar, scroll-spy nav, social icons |
| `src/components/sections/Hero.tsx` | Terminal prompt, typewriter animation, skill badges |
| `src/components/sections/Skills.tsx` | Recharts RadarChart + filterable tag cloud |
| `src/components/sections/Experience.tsx` | Framer Motion animated vertical timeline |
| `src/components/sections/Projects.tsx` | Project card grid with tech badges |
| `src/components/sections/GitHub.tsx` | Live GitHub REST API feed + activity grid |
| `src/components/sections/Contact.tsx` | Email, GitHub, LinkedIn, website links |
| `src/hooks/useScrollSpy.ts` | IntersectionObserver hook — returns active section id |
| `src/hooks/useTypewriter.ts` | Cycles through strings with typing/deleting effect |
| `src/lib/github.ts` | GitHub REST API v3 fetch helpers |
| `data/resume.json` | All resume content — single source of truth |
| `data/types.ts` | TypeScript types for resume.json |
| `src/__tests__/hooks/useScrollSpy.test.ts` | Tests for useScrollSpy |
| `src/__tests__/hooks/useTypewriter.test.ts` | Tests for useTypewriter |
| `src/__tests__/lib/github.test.ts` | Tests for GitHub API helpers |
| `jest.config.ts` | Jest config for Next.js |
| `jest.setup.ts` | @testing-library/jest-dom setup |

---

## Task 1: Scaffold Next.js project

**Branch:** `feature/scaffold`

**Files:**
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Create: `jest.config.ts`, `jest.setup.ts`
- Modify: `package.json`, `tailwind.config.ts`, `tsconfig.json`

- [ ] **Step 1: Create Next.js app in existing repo directory**

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --yes
```

Expected: Next.js files scaffolded. Existing files (docs/, requirments.md, resume_brad_luo_SWE.md, .gitignore) are preserved.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install framer-motion recharts
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install next-themes
```

- [ ] **Step 3: Install Shadcn UI**

```bash
npx shadcn@latest init --defaults
```

When prompted, choose: New York style, Zinc base color, CSS variables: yes.

- [ ] **Step 4: Add Shadcn components used across the site**

```bash
npx shadcn@latest add badge card button sheet separator
```

- [ ] **Step 5: Create jest.config.ts**

```typescript
// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default createJestConfig(config)
```

- [ ] **Step 6: Create jest.setup.ts**

```typescript
// jest.setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 7: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 8: Configure Tailwind for terminal dark theme**

Replace `tailwind.config.ts` content:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gh-bg': '#0d1117',
        'gh-surface': '#161b22',
        'gh-border': '#30363d',
        'gh-text': '#e6edf3',
        'gh-muted': '#8b949e',
        'gh-green': '#3fb950',
        'gh-blue': '#58a6ff',
        'gh-purple': '#a371f7',
        'gh-yellow': '#e3b341',
      },
      fontFamily: {
        mono: ['var(--font-jetbrains-mono)', 'Courier New', 'monospace'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

- [ ] **Step 9: Replace globals.css**

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 216 28% 7%;
    --foreground: 210 17% 91%;
    --card: 215 28% 9%;
    --card-foreground: 210 17% 91%;
    --border: 215 19% 19%;
    --input: 215 19% 19%;
    --primary: 212 100% 67%;
    --primary-foreground: 0 0% 100%;
    --muted: 215 19% 27%;
    --muted-foreground: 215 10% 60%;
    --radius: 0.5rem;
  }
}

@layer base {
  * { @apply border-border; }
  body {
    @apply bg-gh-bg text-gh-text;
    font-family: var(--font-inter), system-ui, sans-serif;
  }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.cursor-blink {
  animation: blink 1s step-end infinite;
}

/* Scrollbar styling */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0d1117; }
::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #58a6ff; }
```

- [ ] **Step 10: Replace app/layout.tsx**

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

export const metadata: Metadata = {
  title: 'Brad Luo — Senior Software Engineer',
  description: 'Personal resume website for Xiaole (Brad) Luo — Senior SWE, Full-Stack Developer, GenAI Engineer.',
  openGraph: {
    title: 'Brad Luo — Senior Software Engineer',
    description: 'Senior SWE with 10+ years. Full-Stack, GenAI, AWS, GCP.',
    url: 'https://resume.bradluo.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} bg-gh-bg text-gh-text antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 11: Create placeholder app/page.tsx**

```typescript
// src/app/page.tsx
export default function Home() {
  return (
    <main className="flex min-h-screen bg-gh-bg">
      <p className="text-gh-green font-mono p-8">$ scaffold complete</p>
    </main>
  )
}
```

- [ ] **Step 12: Verify the app runs**

```bash
npm run dev
```

Expected: App runs at http://localhost:3000. Green text "$ scaffold complete" on dark background.

- [ ] **Step 13: Run tests (should pass with no test files)**

```bash
npm test
```

Expected: "No tests found" or 0 test suites pass.

- [ ] **Step 14: Commit and push feature branch**

```bash
git checkout -b feature/scaffold
git add -A
git commit -m "feat: scaffold Next.js 14 with Tailwind, Shadcn, Framer Motion, Recharts, Jest"
git push -u origin feature/scaffold
```

- [ ] **Step 15: Open PR to main**

```bash
gh pr create --title "feat: scaffold Next.js project" --body "Sets up Next.js 14 + TailwindCSS dark theme + Shadcn UI + Framer Motion + Recharts + Jest/RTL. Foundation for all subsequent features."
```

---

## Task 2: Data layer

**Branch:** `feature/data-layer`

**Files:**
- Create: `data/types.ts`
- Create: `data/resume.json`

- [ ] **Step 1: Create branch**

```bash
git checkout main && git pull
git checkout -b feature/data-layer
```

- [ ] **Step 2: Create data/types.ts**

```typescript
// data/types.ts

export interface PersonalInfo {
  name: string
  title: string
  titles: string[]          // typewriter cycles through these
  email: string
  website: string
  linkedin: string
  github: string
  githubUsername: string
  location: string
  profileSummary: string
}

export interface SkillDomain {
  name: string
  score: number             // 0-100, used in radar chart
}

export interface Skills {
  domains: SkillDomain[]
  tags: Record<string, string[]>  // domain name → tag list
}

export interface ExperienceRole {
  id: string
  company: string
  title: string
  period: string
  location: string
  bullets: string[]
  subRoles?: Array<{
    title: string
    period: string
    bullets: string[]
  }>
}

export interface Project {
  id: string
  name: string
  period: string
  description: string
  techStack: string[]
  tags: string[]
  githubUrl?: string
  demoUrl?: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  period: string
  grade: string
}

export interface ResumeData {
  personal: PersonalInfo
  skills: Skills
  experience: ExperienceRole[]
  projects: Project[]
  education: Education[]
}
```

- [ ] **Step 3: Create data/resume.json**

```json
{
  "personal": {
    "name": "Xiaole (Brad) Luo",
    "title": "Senior Software Engineer",
    "titles": [
      "Senior Software Engineer",
      "Full-Stack Developer",
      "GenAI Engineer",
      "Cloud & AI Specialist"
    ],
    "email": "xiaoleluo2@gmail.com",
    "website": "https://bradluo.com",
    "linkedin": "https://www.linkedin.com/in/xiaole-brad-luo/",
    "github": "https://github.com/brad-luo",
    "githubUsername": "brad-luo",
    "location": "Melbourne, VIC",
    "profileSummary": "Senior Software Engineer and Full-Stack Developer with 10+ years of experience building robust, scalable, and cloud-native applications. Holds a Master's in Artificial Intelligence (High Distinction) and brings a strong GenAI edge — integrating LLMs, Agentic AI workflows, and modern ML capabilities directly into production systems."
  },
  "skills": {
    "domains": [
      { "name": "Full-Stack", "score": 95 },
      { "name": "GenAI", "score": 90 },
      { "name": "Cloud/DevOps", "score": 88 },
      { "name": "ML/AI", "score": 80 },
      { "name": "Databases", "score": 85 },
      { "name": "Other", "score": 75 }
    ],
    "tags": {
      "Full-Stack": ["React", "Next.js", "Vue.js/Nuxt.js", "TailwindCSS", "Shadcn UI", "MUI", "FastAPI", "Django", "Flask", "Express", "Node.js", "Python", "JavaScript/TypeScript", "Java"],
      "GenAI": ["LLMs (GPT-*, Claude-*, Gemini-*)", "Context Engineering", "Spec Engineering", "Harness Engineering", "Claude Code", "Cursor", "MCP", "Agentic Workflows", "Multi Agents", "n8n"],
      "Cloud/DevOps": ["AWS Lambda", "API Gateway", "DynamoDB", "Cognito", "Amplify", "S3", "EC2", "ECS", "GCP", "Firestore", "Cloud Run", "GKE", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Jenkins", "Nginx"],
      "ML/AI": ["PyTorch", "TensorFlow", "Keras", "Hugging Face", "Scikit-learn", "XGBoost", "MLflow", "Databricks", "TetraScience", "OpenCV", "Pandas", "Numpy"],
      "Databases": ["PostgreSQL", "MySQL", "MongoDB", "Redis", "DynamoDB", "Firestore", "OrientDB", "OpenTSDB", "Elasticsearch", "SQLite"],
      "Other": ["REST", "GraphQL", "gRPC", "SharePoint SPFx", "Power Apps", "Power Automate", "Power BI", "Graph API", "Kibana", "Jira", "Confluence"]
    }
  },
  "experience": [
    {
      "id": "csl",
      "company": "CSL (via ProPharma)",
      "title": "Application Developer",
      "period": "Jun 2024 – Present",
      "location": "Melbourne, VIC",
      "bullets": [],
      "subRoles": [
        {
          "title": "R&D Enabling Technology Team",
          "period": "Nov 2025 – Present",
          "bullets": [
            "Built data pipelines on the TetraScience Data Platform for R&D laboratory data ingestion and management.",
            "Integrated Databricks for data engineering and analytics workflows.",
            "Worked with ELN (Electronic Lab Notebook) and Posit Connect to support scientific computing infrastructure."
          ]
        },
        {
          "title": "Research Digital Innovation Team",
          "period": "Jun 2024 – Nov 2025",
          "bullets": [
            "Applied LLMs and GenAI to enhance applications and automate repetitive tasks, leveraging Databricks and Power Platform AI models.",
            "Developed SharePoint Framework (SPFx) web parts using React, integrating advanced visualisations and third-party libraries.",
            "Built end-to-end business applications with Power Apps and Power Automate, integrating with enterprise tooling.",
            "Deployed and maintained full-stack applications on Posit Connect, Posit Workbench, and AWS EC2 with Nginx."
          ]
        }
      ]
    },
    {
      "id": "monash",
      "company": "Monash University",
      "title": "Deep Learning Researcher",
      "period": "Jul 2022 – Jul 2023",
      "location": "Melbourne, VIC",
      "bullets": [
        "Developed a modified 3D-UNet for automated prostate cancer segmentation from 3D MRI scans (PI-CAI 2022 dataset), achieving an overall score of 0.732 (AUC: 0.833, AP: 0.631).",
        "Explored deep learning techniques for multiple sclerosis diagnosis using MRI-based segmentation models."
      ]
    },
    {
      "id": "globalegrow",
      "company": "Globalegrow E-commerce",
      "title": "Senior Python Developer",
      "period": "Mar 2018 – Oct 2019",
      "location": "Shenzhen, China",
      "bullets": [
        "Architected and built the internal Ops Platform from scratch using Django, Vue.js, and OrientDB (graph DB), covering servers, network, CI/CD, monitoring, and work order management.",
        "Customised the Open-Falcon monitoring platform (Flask full-stack) with multi-channel alerting (WeChat, email, SMS).",
        "Implemented async task scheduling with Celery and APScheduler; wrote scripts to collect metrics from thousands of servers."
      ]
    },
    {
      "id": "guangdong",
      "company": "Guangdong Achieve Information Technology",
      "title": "Python Developer",
      "period": "Aug 2017 – Feb 2018",
      "location": "Shenzhen, China",
      "bullets": [
        "Developed all APIs and crawlers for an App Detection System that scraped ~500 app stores, downloaded apps for virus and integrity scanning.",
        "Maintained and extended a large-scale Safety Audit System (PHP/Smarty/MySQL) auditing all intranet machines."
      ]
    },
    {
      "id": "deepera",
      "company": "Deepera Information Technology",
      "title": "Python Developer",
      "period": "Mar 2016 – Jul 2017",
      "location": "Shenzhen, China",
      "bullets": [
        "Built and deployed all APIs for a WeChat mini-program locksmith platform (Huaxiawanan), serving client-side, locksmith mobile-side, and city management dashboard (Django, Nginx, MySQL).",
        "Handled Linux server deployment and contributed to front-end development."
      ]
    }
  ],
  "projects": [
    {
      "id": "comics-creator",
      "name": "Brad's Comics Creator",
      "period": "Aug 2025 – Present",
      "description": "An AI-powered web app that brings comic ideas to life. Users input a creative prompt, optionally upload reference characters and styles, and choose how many panels to generate. The app produces a plot, then iteratively creates each panel to ensure narrative consistency.",
      "techStack": ["Next.js", "TailwindCSS", "Shadcn UI", "Google Gemini 2.5 Flash", "GCP", "Firebase", "Firestore"],
      "tags": ["GenAI", "Next.js", "GCP"],
      "githubUrl": null,
      "demoUrl": null
    },
    {
      "id": "image-style",
      "name": "Image Style Generators",
      "period": "Aug 2025 – Present",
      "description": "A web platform for AI-powered image style transformation. Users upload an image, describe the transformation, select artistic styles, and get results in under a minute presented in an interactive gallery.",
      "techStack": ["Next.js", "TailwindCSS", "Shadcn UI", "Google Gemini 2.5 Flash", "GCP", "Firebase", "Firestore"],
      "tags": ["GenAI", "Next.js", "GCP"],
      "githubUrl": null,
      "demoUrl": null
    },
    {
      "id": "devops-stack",
      "name": "Self-hosted DevOps Stack on GKE",
      "period": "Ongoing",
      "description": "A suite of production-grade self-hosted tools on Google Kubernetes Engine: n8n for AI/workflow automation, Jenkins for CI/CD, Grafana for monitoring, and Kubernetes Dashboard for cluster management.",
      "techStack": ["Kubernetes", "GKE", "GCP", "n8n", "Jenkins", "Grafana", "Helm"],
      "tags": ["Cloud/DevOps", "Kubernetes", "GCP"],
      "githubUrl": null,
      "demoUrl": null
    },
    {
      "id": "openpromo",
      "name": "OpenPromo",
      "period": "Dec 2023 – Mar 2024",
      "description": "A cloud-native promotional products platform with a fully decoupled microservices architecture on AWS. Serverless APIs via Lambda + API Gateway, GraphQL via AppSync, multi-AZ deployment.",
      "techStack": ["Nuxt.js", "AWS Amplify", "Lambda", "API Gateway", "AppSync", "DynamoDB", "Cognito", "OpenSearch"],
      "tags": ["Full-Stack", "AWS", "Serverless"],
      "githubUrl": null,
      "demoUrl": null
    },
    {
      "id": "prostate-cancer",
      "name": "Prostate Cancer Segmentation",
      "period": "Jul 2022 – Jul 2023",
      "description": "A deep learning solution for automatic prostate cancer segmentation from 3D MRI scans. Modified 3D-UNet encoder-decoder trained on PI-CAI 2022 dataset. Achieved overall score 0.732 (AUC: 0.833, AP: 0.631).",
      "techStack": ["PyTorch", "3D-UNet", "Python", "Numpy", "OpenCV"],
      "tags": ["ML/AI", "Deep Learning", "Research"],
      "githubUrl": null,
      "demoUrl": null
    },
    {
      "id": "ops-platform",
      "name": "Ops Platform",
      "period": "Mar 2018 – Oct 2019",
      "description": "A comprehensive automated Operations platform built from scratch, covering the full IT operations lifecycle — servers, network, CI/CD, monitoring, work orders, and script execution.",
      "techStack": ["Django", "Vue.js", "OrientDB", "Celery", "APScheduler", "Docker"],
      "tags": ["Full-Stack", "DevOps", "Python"],
      "githubUrl": null,
      "demoUrl": null
    }
  ],
  "education": [
    {
      "id": "monash-masters",
      "institution": "Monash University",
      "degree": "Master of Artificial Intelligence",
      "period": "Oct 2021 – Sep 2023",
      "grade": "High Distinction (HD)"
    },
    {
      "id": "foshan-bachelors",
      "institution": "Foshan University",
      "degree": "Bachelor of Electrical Engineering & Automation",
      "period": "Sep 2012 – Jun 2016",
      "grade": "High Distinction (HD)"
    }
  ]
}
```

- [ ] **Step 4: Commit and push**

```bash
git add data/
git commit -m "feat: add resume.json data layer and TypeScript types"
git push -u origin feature/data-layer
```

- [ ] **Step 5: Open PR**

```bash
gh pr create --title "feat: data layer — resume.json and types" --body "Single source of truth for all resume content. Edit resume.json to update the site."
```

---

## Task 3: Custom hooks

**Branch:** `feature/hooks`

**Files:**
- Create: `src/hooks/useTypewriter.ts`
- Create: `src/hooks/useScrollSpy.ts`
- Create: `src/__tests__/hooks/useTypewriter.test.ts`
- Create: `src/__tests__/hooks/useScrollSpy.test.ts`

- [ ] **Step 1: Create branch**

```bash
git checkout main && git pull
git checkout -b feature/hooks
```

- [ ] **Step 2: Write failing tests for useTypewriter**

```bash
mkdir -p src/__tests__/hooks
```

```typescript
// src/__tests__/hooks/useTypewriter.test.ts
import { renderHook, act } from '@testing-library/react'
import { useTypewriter } from '@/hooks/useTypewriter'

jest.useFakeTimers()

describe('useTypewriter', () => {
  const strings = ['Hello', 'World']

  it('starts with an empty string', () => {
    const { result } = renderHook(() => useTypewriter(strings, 50))
    expect(result.current).toBe('')
  })

  it('types the first character after one interval', () => {
    const { result } = renderHook(() => useTypewriter(strings, 50))
    act(() => { jest.advanceTimersByTime(50) })
    expect(result.current).toBe('H')
  })

  it('completes typing the first string', () => {
    const { result } = renderHook(() => useTypewriter(strings, 50))
    act(() => { jest.advanceTimersByTime(50 * 5) }) // 'Hello' = 5 chars
    expect(result.current).toBe('Hello')
  })

  it('starts deleting after pause at full string', () => {
    const { result } = renderHook(() => useTypewriter(strings, 50, 500))
    // Type full string: 5 * 50 = 250ms
    act(() => { jest.advanceTimersByTime(250) })
    expect(result.current).toBe('Hello')
    // Pause: 500ms
    act(() => { jest.advanceTimersByTime(500) })
    // Delete one char: 50ms
    act(() => { jest.advanceTimersByTime(50) })
    expect(result.current).toBe('Hell')
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npm test -- --testPathPattern=useTypewriter
```

Expected: FAIL — "Cannot find module '@/hooks/useTypewriter'"

- [ ] **Step 4: Implement useTypewriter**

```typescript
// src/hooks/useTypewriter.ts
import { useState, useEffect, useRef } from 'react'

export function useTypewriter(
  strings: string[],
  typingSpeed = 80,
  pauseDuration = 1500,
  deletingSpeed = 40
): string {
  const [displayed, setDisplayed] = useState('')
  const [stringIndex, setStringIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const current = strings[stringIndex]

    if (!isDeleting && charIndex < current.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex + 1))
        setCharIndex(c => c + 1)
      }, typingSpeed)
    } else if (!isDeleting && charIndex === current.length) {
      timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseDuration)
    } else if (isDeleting && charIndex > 0) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex - 1))
        setCharIndex(c => c - 1)
      }, deletingSpeed)
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false)
      setStringIndex(i => (i + 1) % strings.length)
    }

    return () => clearTimeout(timeoutRef.current)
  }, [charIndex, isDeleting, stringIndex, strings, typingSpeed, pauseDuration, deletingSpeed])

  return displayed
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npm test -- --testPathPattern=useTypewriter
```

Expected: PASS — 4 tests passing

- [ ] **Step 6: Write failing tests for useScrollSpy**

```typescript
// src/__tests__/hooks/useScrollSpy.test.ts
import { renderHook } from '@testing-library/react'
import { useScrollSpy } from '@/hooks/useScrollSpy'

// Mock IntersectionObserver
const mockObserve = jest.fn()
const mockUnobserve = jest.fn()
const mockDisconnect = jest.fn()

let observerCallback: IntersectionObserverCallback

beforeEach(() => {
  mockObserve.mockClear()
  mockUnobserve.mockClear()
  global.IntersectionObserver = jest.fn((cb) => {
    observerCallback = cb
    return {
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
    }
  }) as unknown as typeof IntersectionObserver
})

describe('useScrollSpy', () => {
  it('returns null when no sections are intersecting', () => {
    const { result } = renderHook(() => useScrollSpy(['hero', 'skills']))
    expect(result.current).toBeNull()
  })

  it('observes elements matching provided ids', () => {
    const hero = document.createElement('div')
    hero.id = 'hero'
    document.body.appendChild(hero)

    renderHook(() => useScrollSpy(['hero']))
    expect(mockObserve).toHaveBeenCalledWith(hero)

    document.body.removeChild(hero)
  })

  it('returns id of highest-ratio intersecting entry', () => {
    const hero = document.createElement('div')
    hero.id = 'hero'
    document.body.appendChild(hero)

    const { result } = renderHook(() => useScrollSpy(['hero']))

    const entries = [
      { target: hero, intersectionRatio: 0.8, isIntersecting: true },
    ] as unknown as IntersectionObserverEntry[]

    const { act } = require('@testing-library/react')
    act(() => observerCallback(entries, {} as IntersectionObserver))

    expect(result.current).toBe('hero')
    document.body.removeChild(hero)
  })
})
```

- [ ] **Step 7: Run test to verify it fails**

```bash
npm test -- --testPathPattern=useScrollSpy
```

Expected: FAIL — "Cannot find module '@/hooks/useScrollSpy'"

- [ ] **Step 8: Implement useScrollSpy**

```typescript
// src/hooks/useScrollSpy.ts
import { useState, useEffect } from 'react'

export function useScrollSpy(sectionIds: string[], threshold = 0.3): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const ratioMap = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          ratioMap.set(entry.target.id, entry.intersectionRatio)
        })
        let maxRatio = 0
        let maxId: string | null = null
        ratioMap.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio
            maxId = id
          }
        })
        if (maxId) setActiveId(maxId)
      },
      { threshold: [0, 0.1, 0.3, 0.5, 0.7, 1.0] }
    )

    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sectionIds])

  return activeId
}
```

- [ ] **Step 9: Run tests to verify they pass**

```bash
npm test -- --testPathPattern=hooks
```

Expected: PASS — all tests passing

- [ ] **Step 10: Commit and push**

```bash
git add src/hooks/ src/__tests__/hooks/
git commit -m "feat: add useTypewriter and useScrollSpy hooks with tests"
git push -u origin feature/hooks
```

- [ ] **Step 11: Open PR**

```bash
gh pr create --title "feat: custom hooks — useTypewriter and useScrollSpy" --body "TDD implementation of the two core hooks. useTypewriter cycles through strings with typing/deleting effect. useScrollSpy uses IntersectionObserver to track active section."
```

---

## Task 4: GitHub API library

**Branch:** `feature/github-lib`

**Files:**
- Create: `src/lib/github.ts`
- Create: `src/__tests__/lib/github.test.ts`

- [ ] **Step 1: Create branch**

```bash
git checkout main && git pull
git checkout -b feature/github-lib
```

- [ ] **Step 2: Write failing tests**

```bash
mkdir -p src/__tests__/lib
```

```typescript
// src/__tests__/lib/github.test.ts
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
      { type: 'PushEvent', repo: { name: 'r' }, payload: { commits: [] }, created_at: today },
      { type: 'PushEvent', repo: { name: 'r' }, payload: { commits: [] }, created_at: today },
    ]
    const grid = buildActivityGrid(events)
    const flat = grid.flat()
    expect(flat.some(d => d.count >= 2)).toBe(true)
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
npm test -- --testPathPattern=github
```

Expected: FAIL — "Cannot find module '@/lib/github'"

- [ ] **Step 4: Implement lib/github.ts**

```typescript
// src/lib/github.ts

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
  payload: { commits: Array<{ message: string }> }
  created_at: string
}

export interface ActivityDay {
  date: string
  count: number
}

const BASE = 'https://api.github.com'

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const res = await fetch(`${BASE}/users/${username}/repos?per_page=100&sort=updated`, {
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  const repos: GitHubRepo[] = await res.json()
  return repos
    .filter(r => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6)
}

export async function fetchGitHubEvents(username: string): Promise<GitHubPushEvent[]> {
  const res = await fetch(`${BASE}/users/${username}/events/public?per_page=90`, {
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  const events = await res.json()
  return events.filter((e: { type: string }) => e.type === 'PushEvent') as GitHubPushEvent[]
}

export function buildActivityGrid(events: GitHubPushEvent[]): ActivityDay[][] {
  const now = new Date()
  // Build a map of date string → count
  const countMap = new Map<string, number>()
  events.forEach(e => {
    const d = e.created_at.slice(0, 10)
    countMap.set(d, (countMap.get(d) ?? 0) + 1)
  })

  // Build 12 weeks × 7 days grid, starting from 84 days ago
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
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test -- --testPathPattern=github
```

Expected: PASS — all tests passing

- [ ] **Step 6: Commit and push**

```bash
git add src/lib/ src/__tests__/lib/
git commit -m "feat: GitHub REST API helpers with tests"
git push -u origin feature/github-lib
```

- [ ] **Step 7: Open PR**

```bash
gh pr create --title "feat: GitHub API library" --body "fetchGitHubRepos, fetchGitHubEvents, buildActivityGrid — all tested with mocked fetch. No auth required."
```

---

## Task 5: Layout and Sidebar

**Branch:** `feature/layout`

**Files:**
- Create: `src/components/layout/Sidebar.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create branch**

```bash
git checkout main && git pull
git checkout -b feature/layout
```

- [ ] **Step 2: Create Sidebar.tsx**

```tsx
// src/components/layout/Sidebar.tsx
'use client'

import { useScrollSpy } from '@/hooks/useScrollSpy'
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

const SECTION_IDS = NAV_ITEMS.map(n => n.id)

export function Sidebar() {
  const activeId = useScrollSpy(SECTION_IDS)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-56 bg-gh-surface border-r border-gh-border z-50">
      {/* Avatar + identity */}
      <div className="flex items-center gap-3 p-4 border-b border-gh-border">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gh-green to-gh-blue flex items-center justify-center text-white font-bold text-sm font-mono shrink-0">
          BL
        </div>
        <div>
          <div className="text-gh-text text-sm font-mono font-semibold">brad_luo</div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gh-green"></span>
            <span className="text-gh-green text-xs font-mono">online</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2">
        {NAV_ITEMS.map(item => {
          const isActive = activeId === item.id
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`w-full text-left px-3 py-2 rounded-r text-sm font-mono transition-all duration-150 mb-1 ${
                isActive
                  ? 'text-gh-blue bg-gh-blue/10 border-l-2 border-gh-blue'
                  : 'text-gh-muted hover:text-gh-text hover:bg-gh-border/30 border-l-2 border-transparent'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Social icons */}
      <div className="p-4 border-t border-gh-border flex gap-4">
        <a href={data.personal.github} target="_blank" rel="noopener noreferrer" className="text-gh-muted hover:text-gh-blue transition-colors text-xs font-mono">GH</a>
        <a href={data.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-gh-muted hover:text-gh-blue transition-colors text-xs font-mono">LI</a>
        <a href={`mailto:${data.personal.email}`} className="text-gh-muted hover:text-gh-blue transition-colors text-xs font-mono">✉</a>
      </div>
    </aside>
  )
}
```

- [ ] **Step 3: Update app/page.tsx with layout shell**

```tsx
// src/app/page.tsx
import { Sidebar } from '@/components/layout/Sidebar'

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gh-bg">
      <Sidebar />
      <main className="flex-1 lg:ml-56 overflow-y-auto">
        {/* Sections will be added in subsequent tasks */}
        <div className="p-8 text-gh-green font-mono">
          <span>$ layout ready</span>
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Verify layout renders**

```bash
npm run dev
```

Expected: Dark sidebar on left with "brad_luo / online" header and nav items. Main area scrolls on the right.

- [ ] **Step 5: Commit and push**

```bash
git add src/components/layout/ src/app/page.tsx
git commit -m "feat: fixed sidebar with scroll-spy navigation"
git push -u origin feature/layout
```

- [ ] **Step 6: Open PR**

```bash
gh pr create --title "feat: layout and sidebar" --body "Fixed left sidebar with scroll-spy active highlighting. Avatar, nav items, social links. Responsive: hidden on mobile."
```

---

## Task 6: Hero section

**Branch:** `feature/hero`

**Files:**
- Create: `src/components/sections/Hero.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create branch**

```bash
git checkout main && git pull
git checkout -b feature/hero
```

- [ ] **Step 2: Create Hero.tsx**

```tsx
// src/components/sections/Hero.tsx
'use client'

import { useTypewriter } from '@/hooks/useTypewriter'
import resumeData from '../../../data/resume.json'
import type { ResumeData } from '../../../data/types'
import { Badge } from '@/components/ui/badge'

const data = resumeData as ResumeData

const DOMAIN_COLORS: Record<string, string> = {
  'Full-Stack': 'bg-gh-green/20 text-gh-green border-gh-green/30',
  'GenAI': 'bg-gh-yellow/20 text-gh-yellow border-gh-yellow/30',
  'Cloud/DevOps': 'bg-gh-purple/20 text-gh-purple border-gh-purple/30',
  'ML/AI': 'bg-gh-blue/20 text-gh-blue border-gh-blue/30',
}

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
```

- [ ] **Step 3: Add Hero to page.tsx**

```tsx
// src/app/page.tsx
import { Sidebar } from '@/components/layout/Sidebar'
import { Hero } from '@/components/sections/Hero'

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gh-bg">
      <Sidebar />
      <main className="flex-1 lg:ml-56">
        <Hero />
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Expected: Hero section with name, typing animation cycling through titles, skill badges, and CTA links on dark background.

- [ ] **Step 5: Commit and push**

```bash
git add src/components/sections/Hero.tsx src/app/page.tsx
git commit -m "feat: hero section with terminal prompt and typewriter animation"
git push -u origin feature/hero
```

- [ ] **Step 6: Open PR**

```bash
gh pr create --title "feat: hero section" --body "Terminal prompt aesthetic, typewriter cycling through titles, skill badge chips, email/GitHub/LinkedIn CTAs."
```

---

## Task 7: Skills section

**Branch:** `feature/skills`

**Files:**
- Create: `src/components/sections/Skills.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create branch**

```bash
git checkout main && git pull
git checkout -b feature/skills
```

- [ ] **Step 2: Create Skills.tsx**

```tsx
// src/components/sections/Skills.tsx
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
    : allDomains.flatMap(d => data.skills.tags[d])

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
                style={activeFilter === domain ? { borderColor: DOMAIN_COLORS[domain], color: DOMAIN_COLORS[domain], background: `${DOMAIN_COLORS[domain]}18` } : {}}
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
```

- [ ] **Step 3: Add Skills to page.tsx**

```tsx
// src/app/page.tsx
import { Sidebar } from '@/components/layout/Sidebar'
import { Hero } from '@/components/sections/Hero'
import { Skills } from '@/components/sections/Skills'

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gh-bg">
      <Sidebar />
      <main className="flex-1 lg:ml-56">
        <Hero />
        <Skills />
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Expected: Skills section below hero with radar chart on left, filterable tag cloud on right. Clicking a domain filter shows only that domain's tags.

- [ ] **Step 5: Commit and push**

```bash
git add src/components/sections/Skills.tsx src/app/page.tsx
git commit -m "feat: skills section with radar chart and filterable tag cloud"
git push -u origin feature/skills
```

- [ ] **Step 6: Open PR**

```bash
gh pr create --title "feat: skills section" --body "Recharts RadarChart with 6 domains, Framer Motion scroll-entry animation, filterable tag cloud with domain color coding."
```

---

## Task 8: Experience section

**Branch:** `feature/experience`

**Files:**
- Create: `src/components/sections/Experience.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create branch**

```bash
git checkout main && git pull
git checkout -b feature/experience
```

- [ ] **Step 2: Create Experience.tsx**

```tsx
// src/components/sections/Experience.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import resumeData from '../../../data/resume.json'
import type { ResumeData } from '../../../data/types'

const data = resumeData as ResumeData

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export function Experience() {
  const [expandedId, setExpandedId] = useState<string | null>('csl')

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
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Add Experience to page.tsx**

```tsx
// src/app/page.tsx
import { Sidebar } from '@/components/layout/Sidebar'
import { Hero } from '@/components/sections/Hero'
import { Skills } from '@/components/sections/Skills'
import { Experience } from '@/components/sections/Experience'

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gh-bg">
      <Sidebar />
      <main className="flex-1 lg:ml-56">
        <Hero />
        <Skills />
        <Experience />
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Expected: Experience section with vertical timeline, animated stagger on scroll entry, click-to-expand cards showing bullet points.

- [ ] **Step 5: Commit and push**

```bash
git add src/components/sections/Experience.tsx src/app/page.tsx
git commit -m "feat: experience section with animated vertical timeline"
git push -u origin feature/experience
```

- [ ] **Step 6: Open PR**

```bash
gh pr create --title "feat: experience section" --body "Animated vertical timeline with Framer Motion staggerChildren. Click-to-expand cards. Sub-roles support for CSL. All 5 positions from resume.json."
```

---

## Task 9: Projects section

**Branch:** `feature/projects`

**Files:**
- Create: `src/components/sections/Projects.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create branch**

```bash
git checkout main && git pull
git checkout -b feature/projects
```

- [ ] **Step 2: Create Projects.tsx**

```tsx
// src/components/sections/Projects.tsx
'use client'

import { motion } from 'framer-motion'
import resumeData from '../../../data/resume.json'
import type { ResumeData } from '../../../data/types'

const data = resumeData as ResumeData

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
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
```

- [ ] **Step 3: Add Projects to page.tsx**

```tsx
// src/app/page.tsx
import { Sidebar } from '@/components/layout/Sidebar'
import { Hero } from '@/components/sections/Hero'
import { Skills } from '@/components/sections/Skills'
import { Experience } from '@/components/sections/Experience'
import { Projects } from '@/components/sections/Projects'

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gh-bg">
      <Sidebar />
      <main className="flex-1 lg:ml-56">
        <Hero />
        <Skills />
        <Experience />
        <Projects />
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Expected: Projects grid with 6 cards, each showing name, description, tag badges, tech stack chips, and link (or "private repo").

- [ ] **Step 5: Commit and push**

```bash
git add src/components/sections/Projects.tsx src/app/page.tsx
git commit -m "feat: projects section with animated card grid"
git push -u origin feature/projects
```

- [ ] **Step 6: Open PR**

```bash
gh pr create --title "feat: projects section" --body "Animated card grid with stagger. Domain tag badges, tech stack chips, GitHub/demo links. All 6 projects from resume.json."
```

---

## Task 10: GitHub section

**Branch:** `feature/github`

**Files:**
- Create: `src/components/sections/GitHub.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create branch**

```bash
git checkout main && git pull
git checkout -b feature/github
```

- [ ] **Step 2: Create GitHub.tsx**

```tsx
// src/components/sections/GitHub.tsx
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
```

- [ ] **Step 3: Add GitHub to page.tsx**

```tsx
// src/app/page.tsx
import { Sidebar } from '@/components/layout/Sidebar'
import { Hero } from '@/components/sections/Hero'
import { Skills } from '@/components/sections/Skills'
import { Experience } from '@/components/sections/Experience'
import { Projects } from '@/components/sections/Projects'
import { GitHub } from '@/components/sections/GitHub'

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gh-bg">
      <Sidebar />
      <main className="flex-1 lg:ml-56">
        <Hero />
        <Skills />
        <Experience />
        <Projects />
        <GitHub />
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Expected: GitHub section with activity grid, recent commits list, top repos. Loading skeleton shown briefly, then data appears.

- [ ] **Step 5: Commit and push**

```bash
git add src/components/sections/GitHub.tsx src/app/page.tsx
git commit -m "feat: GitHub section with live REST API feed and activity grid"
git push -u origin feature/github
```

- [ ] **Step 6: Open PR**

```bash
gh pr create --title "feat: GitHub live activity section" --body "Client-side fetch from GitHub public REST API. Activity grid (12 weeks), recent commits, top repos by stars. Graceful error state on rate limit."
```

---

## Task 11: Contact section

**Branch:** `feature/contact`

**Files:**
- Create: `src/components/sections/Contact.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create branch**

```bash
git checkout main && git pull
git checkout -b feature/contact
```

- [ ] **Step 2: Create Contact.tsx**

```tsx
// src/components/sections/Contact.tsx
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
    value: 'github.com/brad-luo',
    href: data.personal.github,
    icon: '⬡',
    color: 'hover:text-gh-blue hover:border-gh-blue/50',
    description: 'Open source projects',
  },
  {
    label: 'LinkedIn',
    value: 'in/xiaole-brad-luo',
    href: data.personal.linkedin,
    icon: 'in',
    color: 'hover:text-gh-blue hover:border-gh-blue/50',
    description: 'Professional profile',
  },
  {
    label: 'Website',
    value: 'bradluo.com',
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
```

- [ ] **Step 3: Add Contact and finalize page.tsx**

```tsx
// src/app/page.tsx
import { Sidebar } from '@/components/layout/Sidebar'
import { Hero } from '@/components/sections/Hero'
import { Skills } from '@/components/sections/Skills'
import { Experience } from '@/components/sections/Experience'
import { Projects } from '@/components/sections/Projects'
import { GitHub } from '@/components/sections/GitHub'
import { Contact } from '@/components/sections/Contact'

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gh-bg">
      <Sidebar />
      <main className="flex-1 lg:ml-56">
        <Hero />
        <Skills />
        <Experience />
        <Projects />
        <GitHub />
        <Contact />
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Verify full site in browser**

```bash
npm run dev
```

Expected: All 6 sections render end-to-end. Sidebar scroll-spy highlights the active section as you scroll.

- [ ] **Step 5: Commit and push**

```bash
git add src/components/sections/Contact.tsx src/app/page.tsx
git commit -m "feat: contact section and complete single-page layout"
git push -u origin feature/contact
```

- [ ] **Step 6: Open PR**

```bash
gh pr create --title "feat: contact section — completes all 6 sections" --body "Email, GitHub, LinkedIn, website links with hover states. Footer with source link. All sections now wired in page.tsx."
```

---

## Task 12: Mobile responsiveness

**Branch:** `feature/mobile`

**Files:**
- Create: `src/components/layout/MobileNav.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create branch**

```bash
git checkout main && git pull
git checkout -b feature/mobile
```

- [ ] **Step 2: Create MobileNav.tsx**

```tsx
// src/components/layout/MobileNav.tsx
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
        <SheetTrigger asChild>
          <button className="text-gh-muted hover:text-gh-text font-mono text-lg p-1">☰</button>
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
```

- [ ] **Step 3: Add MobileNav to page.tsx**

```tsx
// src/app/page.tsx
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { Hero } from '@/components/sections/Hero'
import { Skills } from '@/components/sections/Skills'
import { Experience } from '@/components/sections/Experience'
import { Projects } from '@/components/sections/Projects'
import { GitHub } from '@/components/sections/GitHub'
import { Contact } from '@/components/sections/Contact'

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gh-bg">
      <Sidebar />
      <div className="flex-1 lg:ml-56 flex flex-col">
        <MobileNav />
        <main className="flex-1">
          <Hero />
          <Skills />
          <Experience />
          <Projects />
          <GitHub />
          <Contact />
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify mobile layout**

```bash
npm run dev
```

Open Chrome DevTools → toggle device toolbar → set to iPhone 14 (390px wide).
Expected: Sidebar hidden, sticky top nav bar with "BL · brad_luo" and hamburger ☰. Tapping ☰ opens a left drawer with nav items.

- [ ] **Step 5: Commit and push**

```bash
git add src/components/layout/MobileNav.tsx src/app/page.tsx
git commit -m "feat: mobile navigation with hamburger drawer"
git push -u origin feature/mobile
```

- [ ] **Step 6: Open PR**

```bash
gh pr create --title "feat: mobile responsive navigation" --body "Sticky top bar with hamburger on <1024px. Shadcn Sheet drawer for nav. Sidebar hidden on mobile via lg: prefix."
```

---

## Task 13: Vercel deployment

**Branch:** `feature/deployment`

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Create branch**

```bash
git checkout main && git pull
git checkout -b feature/deployment
```

- [ ] **Step 2: Create vercel.json**

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

- [ ] **Step 3: Commit and push**

```bash
git add vercel.json
git commit -m "chore: add vercel.json deployment config"
git push -u origin feature/deployment
```

- [ ] **Step 4: Open PR and merge to main**

```bash
gh pr create --title "chore: Vercel deployment config" --body "Adds vercel.json. After merging, connect the repo to Vercel to enable auto-deploy."
```

Merge this PR to `main` before proceeding.

- [ ] **Step 5: Connect repo to Vercel**

```bash
vercel link
```

When prompted:
- Set up and deploy: **Y**
- Which scope: select your account
- Link to existing project: **N** (create new)
- Project name: **my-resume**
- Directory: **./** (current)

- [ ] **Step 6: Deploy to production**

```bash
vercel --prod
```

Expected output includes a production URL like `https://my-resume-xxx.vercel.app`. Note this URL — you'll need it for DNS.

- [ ] **Step 7: Add custom domain in Vercel**

```bash
vercel domains add resume.bradluo.com
```

Expected: Vercel prints a CNAME target like `cname.vercel-dns.com` or a specific value. **Note this CNAME value** for the next task.

---

## Task 14: Route53 DNS

No branch needed — AWS infrastructure change.

- [ ] **Step 1: Find your Route53 hosted zone ID**

```bash
aws route53 list-hosted-zones --query "HostedZones[?Name=='bradluo.com.'].Id" --output text
```

Expected output like: `/hostedzone/Z0123456789ABC`
Note the zone ID (the part after `/hostedzone/`).

- [ ] **Step 2: Create the CNAME record**

Replace `ZONE_ID` with your hosted zone ID and `VERCEL_CNAME_TARGET` with the value from Task 13 Step 7.

```bash
aws route53 change-resource-record-sets \
  --hosted-zone-id ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "resume.bradluo.com",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [{"Value": "VERCEL_CNAME_TARGET"}]
      }
    }]
  }'
```

Expected: JSON response with `"Status": "PENDING"`.

- [ ] **Step 3: Wait for DNS propagation and verify**

```bash
# Check propagation (repeat until you see the CNAME)
dig resume.bradluo.com CNAME +short

# Or use nslookup
nslookup resume.bradluo.com
```

Expected: Returns the Vercel CNAME target. May take 1-5 minutes.

- [ ] **Step 4: Verify Vercel picks up the domain**

```bash
vercel domains ls
```

Expected: `resume.bradluo.com` listed as **Valid Configuration** with SSL certificate issued.

- [ ] **Step 5: Visit the live site**

Open `https://resume.bradluo.com` in your browser.
Expected: Full site live with HTTPS, terminal dark theme, all 6 sections, scroll-spy sidebar.

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Dark terminal theme (#0d1117, neon green/blue) — globals.css + Tailwind config
- ✅ Fixed sidebar with scroll-spy — Sidebar.tsx + useScrollSpy hook
- ✅ Mobile hamburger nav — MobileNav.tsx
- ✅ Hero typing animation — Hero.tsx + useTypewriter hook
- ✅ Skills radar chart + filterable tag cloud — Skills.tsx
- ✅ Animated experience timeline — Experience.tsx
- ✅ Projects card grid — Projects.tsx
- ✅ GitHub live feed (events + repos + activity grid) — GitHub.tsx + lib/github.ts
- ✅ Contact links (email, GitHub, LinkedIn, website) — Contact.tsx
- ✅ resume.json single source of truth — data/resume.json + types.ts
- ✅ Vercel auto-deploy — vercel.json + Task 13
- ✅ Route53 CNAME to resume.bradluo.com — Task 14
- ✅ GitHub repo with feature branches + PRs — every task has a PR step
- ✅ Graceful GitHub API fallback — error state in GitHub.tsx

**Type consistency:** All components import `ResumeData` from `data/types.ts` and cast `resumeData as ResumeData`. `GitHubRepo`, `GitHubPushEvent`, `ActivityDay` exported from `lib/github.ts` and used consistently in `GitHub.tsx`. `useTypewriter` returns `string`, used in `Hero.tsx`. `useScrollSpy` returns `string | null`, used in `Sidebar.tsx`.
