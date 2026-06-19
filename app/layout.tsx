import { Analytics } from '@vercel/analytics/next'
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
    default: 'rezlv: Returns & CX decisions, correct by default',
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
    'Shopify returns policy AI',
    'DTC refund automation tool',
    'customer experience automation',
    'ecommerce CX platform',
    'returns management software',
    'Shopify refund automation',
    'human in the loop CX',
    'returns exception handling',
    'Gorgias Zendesk integration',
    'DTC brand customer service tool',
    'returns decision engine',
    'rezlv',
    'rezlv.com',
    'on-policy customer replies',
    'Shopify helpdesk automation',
    'ecommerce support AI',
    'refund policy enforcement software',
    'CX decision layer',
    'customer support accountability',
  ],
  authors: [{ name: 'rezlv', url: SITE_URL }],
  creator: 'rezlv',
  publisher: 'rezlv',
  category: 'Business Software',
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'rezlv',
    title: 'rezlv: Returns & CX decisions, correct by default',
    description:
      'The decision layer for Shopify & DTC brands. Consistent returns and refund calls, enforced ownership, and on-policy human-approved replies.',
    images: [
      {
        url: '/hero-decision-mockup.png',
        width: 1200,
        height: 630,
        alt: 'rezlv — Returns & CX decision platform for Shopify and DTC brands',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@rezlv',
    creator: '@rezlv',
    title: 'rezlv: Returns & CX decisions, correct by default',
    description:
      'The decision layer for Shopify & DTC brands. Consistent returns and refund calls, enforced ownership, and on-policy human-approved replies.',
    images: ['/hero-decision-mockup.png'],
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
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
    </html>
  )
}
