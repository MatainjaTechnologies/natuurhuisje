import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import '../globals.css'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { i18n, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'

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

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return {
    title: 'natuurhuisje - Find your perfect getaway in nature',
    description: 'Discover and book unique nature accommodations: cabins, treehouses, glamping, and more in the most beautiful natural settings.',
    icons: {
      icon: '/images/fav.ico',
    },
  };
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  
  return (
    <html lang={lang} className={[inter.variable, poppins.variable].join(' ')}>
      <body className="font-sans antialiased">
        <Header lang={lang} />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer lang={lang} />
      </body>
    </html>
  )
}
