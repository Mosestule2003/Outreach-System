import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const SITE_URL = 'https://rezlv.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'rezlv — Returns & CX decisions, correct by default',
    template: '%s · rezlv',
  },
  description:
    'rezlv is the decision layer for Shopify & DTC brands. Surface your returns and refund logic inside every agent reply, enforce ownership of every exception, and ship on-policy, human-approved responses — so the right call happens by default.',
  keywords: [
    'returns automation',
    'refund decision software',
    'Shopify customer support',
    'DTC CX tools',
    'returns policy enforcement',
    'customer service AI',
    'refund workflow',
    'ecommerce returns management',
  ],
  authors: [{ name: 'rezlv' }],
  creator: 'rezlv',
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'rezlv',
    title: 'rezlv — Returns & CX decisions, correct by default',
    description:
      'The decision layer for Shopify & DTC brands. Consistent returns and refund calls, enforced ownership, and on-policy human-approved replies.',
    images: ['/hero-decision-mockup.png'],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'rezlv — Returns & CX decisions, correct by default',
    description:
      'The decision layer for Shopify & DTC brands. Consistent returns and refund calls, enforced ownership, and on-policy human-approved replies.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      }
    ],
    apple: '/icon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

import { Providers } from '@/components/providers'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </Providers>
      </body>
    </html>
  )
}
