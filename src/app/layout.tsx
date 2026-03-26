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
