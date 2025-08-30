import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  title: 'AfterLight - Memorial Planning Platform',
  description: 'A premium digital platform designed to help families plan funerals, memorials, and celebrations of life with elegance and ease.',
  keywords: 'memorial planning, funeral planning, celebration of life, memorial services',
  authors: [{ name: 'AfterLight Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} ${playfair.variable} antialiased transition-smooth bg-white dark:bg-slate-900 text-slate-900 dark:text-white`}>
        {children}
      </body>
    </html>
  )
}
