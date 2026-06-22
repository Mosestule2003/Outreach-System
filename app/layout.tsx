import { Analytics } from '@vercel/analytics/next'
import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'], display: 'swap' })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

const SITE_URL = 'https://rezlv.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'rezlv: Decision version control for ecommerce operations',
    template: '%s · rezlv',
  },
  description:
    'rezlv captures how operational decisions are actually made — across returns, escalations, edge cases, and disputes — then turns them into searchable, version-controlled organizational knowledge.',
  keywords: [
    'decision version control',
    'ecommerce decision management',
    'operational accountability',
    'decision infrastructure',
    'DTC operations platform',
    'ecommerce policy governance',
    'decision intelligence',
    'operational decision tracking',
    'Shopify operations tool',
    'DTC decision system',
    'ecommerce accountability software',
    'returns decision management',
    'policy version control',
    'decision audit trail',
    'Gorgias Zendesk integration',
    'operational knowledge management',
    'decision precedent system',
    'ecommerce decision layer',
    'rezlv',
    'rezlv.com',
    'tribal knowledge solution',
    'decision consistency platform',
    'ecommerce policy enforcement',
    'operational decision intelligence',
    'decision governance software',
    'scaling ecommerce operations',
  ],
  authors: [{ name: 'rezlv', url: SITE_URL }],
  creator: 'rezlv',
  publisher: 'rezlv',
  category: 'Business Software',
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en-US': SITE_URL,
      'x-default': SITE_URL,
    },
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'rezlv',
    title: 'rezlv: Decision version control for ecommerce operations',
    description:
      'rezlv captures how operational decisions are actually made and turns them into searchable, version-controlled organizational knowledge.',
    images: [
      {
        url: '/hero.webp',
        width: 1200,
        height: 630,
        alt: 'rezlv — Decision version control for ecommerce operations',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@rezlv',
    creator: '@rezlv',
    title: 'rezlv: Decision version control for ecommerce operations',
    description:
      'rezlv captures how operational decisions are actually made and turns them into searchable, version-controlled organizational knowledge.',
    images: ['/hero.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/icon.svg',
  },
  other: {
    'application-name': 'rezlv',
    'msapplication-TileColor': '#000000',
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} light bg-background`}>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </Providers>
      </body>
      {process.env.NODE_ENV === 'production' && (
        <GoogleAnalytics gaId="G-NDYQLYEVLK" />
      )}
    </html>
  )
}
