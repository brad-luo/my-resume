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
