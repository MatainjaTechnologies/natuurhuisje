import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'natuurhuisje - Find your perfect getaway in nature',
  description: 'Discover and book unique nature accommodations: cabins, treehouses, glamping, and more in the most beautiful natural settings.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={[inter.variable, poppins.variable].join(' ')}>
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
