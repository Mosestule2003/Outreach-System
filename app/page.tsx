import { SiteHeader } from '@/components/marketing/site-header'
import { Hero } from '@/components/marketing/hero'
import { LogoStrip } from '@/components/marketing/logo-strip'
import { ProblemSection } from '@/components/marketing/problem-section'
import { PillarsSection } from '@/components/marketing/features-section'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { ResultsSection } from '@/components/marketing/results-section'
import { IntegrationSection } from '@/components/marketing/integration-section'
import { PricingSection } from '@/components/marketing/pricing-section'
import { FaqSection } from '@/components/marketing/faq-section'
import { CtaSection } from '@/components/marketing/cta-section'
import { SiteFooter } from '@/components/marketing/site-footer'
import { DashedLine } from '@/components/ui/dashed-line'

const SITE_URL = 'https://rezlv.com'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Rezlv',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon.svg`,
        contentUrl: `${SITE_URL}/icon.svg`,
      },
      description:
        'Rezlv is an exception resolution orchestration platform for Canadian Shopify DTC brands. It detects failed deliveries, contacts the customer, and prepares the fix for the carrier — ready for the merchant to confirm in one click.',
      sameAs: [
        'https://twitter.com/rezlv',
        'https://linkedin.com/company/rezlv',
      ],
      foundingDate: '2026',
      numberOfEmployees: { '@type': 'QuantitativeValue', value: '1' },
      knowsAbout: [
        'exception resolution orchestration',
        'delivery exception automation',
        'RTO prevention',
        'carrier API write-back',
        'Shopify fulfillment automation',
        'NDR classification',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Rezlv',
      description: 'Exception Resolution Orchestration for Shopify DTC brands',
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
      inLanguage: 'en-CA',
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: 'Rezlv: Delivery exceptions, resolved before they become returns',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
      description:
        'Rezlv detects failed Shopify deliveries, contacts your customer, and prepares the fix for your carrier — a one-click confirm for your team, not a support ticket.',
      inLanguage: 'en-CA',
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
        ],
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#software`,
      name: 'Rezlv',
      alternateName: ['rezlv.com'],
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'Exception Resolution Orchestration',
      operatingSystem: 'Web',
      url: SITE_URL,
      description:
        'Rezlv is an exception resolution orchestration platform for Canadian Shopify brands. It detects delivery exceptions, contacts the customer for a fix, prepares the carrier-ready correction, and updates Shopify automatically once confirmed.',
      featureList: [
        'Automatic delivery exception detection from Shopify and carrier webhooks',
        'NDR classification: address issue, failed attempt, access issue, carrier delay, customs hold, damaged in transit, lost or stolen, delivery refused',
        'Automated SMS customer outreach with a secure correction portal',
        'Ready-to-submit corrections for Canada Post, UPS Canada, Intelcom, Purolator, Canpar Express, Loomis Express, and FedEx Canada',
        'Automatic Shopify fulfillment record updates',
        'Merchant dashboard with resolution rate and RTO savings',
      ],
      screenshot: `${SITE_URL}/hero.webp`,
      offers: {
        '@type': 'Offer',
        price: '8.00',
        priceCurrency: 'CAD',
        description: 'Pay only on resolved cases — $8/case for the first 100/month, graduated down to $3/case at 501+',
        availability: 'https://schema.org/InStock',
      },
      author: { '@id': `${SITE_URL}/#organization` },
      provider: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What does Rezlv actually do?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'When a package fails to deliver, Rezlv detects the exception within minutes, texts the customer a secure link to correct the issue, and prepares that correction exactly as the carrier needs it — ready for the merchant to confirm in one click.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is Rezlv different from AfterShip or Narvar?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Those are excellent notification tools. They tell your customer something went wrong. Rezlv is the layer that also gets it fixed: customer outreach and carrier-ready corrections in the same automated flow. Most brands run both.',
          },
        },
        {
          '@type': 'Question',
          name: 'Our CS team already handles this. Why do we need it?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most brands spend 2 to 3 days per exception on manual resolution. Rezlv resolves it in under 2 hours, automatically. Your team only sees the 5 to 10 percent of cases that genuinely need human judgment.',
          },
        },
        {
          '@type': 'Question',
          name: 'What if the customer never responds?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Rezlv runs a fully agentic escalation ladder before the carrier’s return-to-sender deadline: SMS first, then email, then an AI voice agent as the last attempt. If none of it lands, you are notified and can escalate to CS, offer a nearby pickup point, or let the carrier auto-hold the package.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which carriers does Rezlv support?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Canada Post, UPS Canada, Intelcom, Purolator, Canpar Express, Loomis Express, and FedEx Canada at launch — covering the carriers that actually move Canadian DTC parcel volume, connected through your own carrier accounts (BYOD).',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does setup take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Install is a Shopify webhook connection with no developer work required. Most brands see their first detected exception within 48 hours.',
          },
        },
      ],
    },
  ],
}

function Divider() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <DashedLine className="my-0" />
    </div>
  )
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main>
        <Hero />
        <LogoStrip />
        <Divider />
        <ProblemSection />
        <Divider />
        <HowItWorks />
        <PillarsSection />
        <IntegrationSection />
        <Divider />
        <ResultsSection />
        <Divider />
        <PricingSection />
        <Divider />
        <FaqSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  )
}
