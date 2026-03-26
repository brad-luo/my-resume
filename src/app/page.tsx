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
