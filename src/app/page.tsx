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
