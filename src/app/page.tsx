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
