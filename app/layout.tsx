import { Analytics } from '@vercel/analytics/next'
import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata, Viewport } from 'next'
import { Inter, Poppins, Roboto_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})
const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  display: 'swap',
})
const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const SITE_URL = 'https://rezlv.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Rezlv: Delivery exceptions, automatically resolved',
    template: '%s · Rezlv',
  },
  description:
    'Rezlv detects failed Shopify deliveries, texts the Canadian customer a fix-it link, and hands your team a ready-to-submit carrier correction. No CS ticket, no manual work chasing the fix.',
  keywords: [
    'exception resolution orchestration',
    'delivery exception automation',
    'failed delivery software',
    'NDR automation',
    'RTO prevention',
    'return to sender prevention',
    'Canada Post exception management',
    'UPS Canada exception management',
    'Shopify fulfillment automation',
    'Canadian DTC shipping software',
    'WISMO deflection',
    'carrier exception management',
    'address correction automation',
    'Shopify delivery exceptions',
    'post-purchase automation',
    'CS ticket deflection',
    'rezlv',
    'rezlv.com',
    'Canadian Shopify DTC operations software',
    'delivery recovery automation',
  ],
  authors: [{ name: 'Rezlv', url: SITE_URL }],
  creator: 'Rezlv',
  publisher: 'Rezlv',
  category: 'Business Software',
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en-CA': SITE_URL,
      'x-default': SITE_URL,
    },
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Rezlv',
    title: 'Rezlv: Delivery exceptions, automatically resolved',
    description:
      'Rezlv detects failed Shopify deliveries, texts the Canadian customer a fix-it link, and hands your team a ready-to-submit carrier correction. No CS ticket, no manual work chasing the fix.',
    images: [
      {
        url: '/hero.webp',
        width: 1200,
        height: 630,
        alt: 'Rezlv: Exception Resolution Orchestration for Shopify DTC brands',
      },
    ],
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@rezlv',
    creator: '@rezlv',
    title: 'Rezlv: Delivery exceptions, automatically resolved',
    description:
      'Rezlv detects failed Shopify deliveries, texts the Canadian customer a fix-it link, and hands your team a ready-to-submit carrier correction.',
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
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${robotoMono.variable} light bg-background`}>
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
