import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { LogoStrip } from '@/components/logo-strip'
import { ProblemSection } from '@/components/problem-section'
import { FeaturesSection } from '@/components/features-section'
import { HowItWorks } from '@/components/how-it-works'
import { ResultsSection } from '@/components/results-section'
import { IntegrationSection } from '@/components/integration-section'
import { FaqSection } from '@/components/faq-section'
import { CtaSection } from '@/components/cta-section'
import { SiteFooter } from '@/components/site-footer'
import { Background } from '@/components/ui/background'
import { DashedLine } from '@/components/ui/dashed-line'

const SITE_URL = 'https://rezlv.com'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'rezlv',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon.svg`,
        contentUrl: `${SITE_URL}/icon.svg`,
      },
      description:
        'rezlv is a decision version control platform for ecommerce brands. It captures how operational decisions are actually made, organizes them into searchable knowledge, and governs how policies evolve over time.',
      sameAs: [
        'https://twitter.com/rezlv',
        'https://linkedin.com/company/rezlv',
      ],
      foundingDate: '2024',
      numberOfEmployees: { '@type': 'QuantitativeValue', value: '2' },
      knowsAbout: [
        'decision version control',
        'ecommerce operational accountability',
        'DTC decision management',
        'operational decision intelligence',
        'decision infrastructure',
        'ecommerce policy governance',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'rezlv',
      description: 'Decision version control for ecommerce operations',
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: 'rezlv: Decision version control for ecommerce operations',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
      description:
        'rezlv captures how operational decisions are actually made across returns, escalations, edge cases, and disputes — then turns them into searchable, version-controlled organizational knowledge.',
      inLanguage: 'en-US',
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
      name: 'rezlv',
      alternateName: ['rezlv.com', 'Rezlv'],
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'Decision Version Control',
      operatingSystem: 'Web',
      url: SITE_URL,
      description:
        'rezlv is a decision version control platform for ecommerce brands. It captures, organizes, recommends, and governs operational decisions across returns, escalations, edge cases, and disputes.',
      featureList: [
        'Automatic decision capture from operational tools',
        'Decision history with policy and precedent linking',
        'Precedent-based decision recommendations',
        'Policy evolution tracking and governance',
        'Decision ownership and accountability',
        'Shopify, Gorgias, and Zendesk integration',
        'Human-in-the-loop approval workflow',
      ],
      screenshot: `${SITE_URL}/hero.webp`,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Design-partner program — apply to join',
        availability: 'https://schema.org/LimitedAvailability',
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
          name: 'What does decision version control actually mean?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Every time your team makes an operational call — approving a refund, handling an edge case, escalating a dispute — that decision is logged with who, what, why, and what precedent supported it. Over time, you can see how your decision-making evolves, where it drifts, and where policies need updating.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is rezlv different from a knowledge base or wiki?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Wikis are passive — they require someone to remember to check them. rezlv is active. It captures decisions as they happen, surfaces relevant precedent at the moment of action, and tracks how policies evolve.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is rezlv different from CX automation tools?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'CX automation tools automate responses. rezlv governs decisions. We don\'t replace your helpdesk — we connect to it and create a decision layer on top.',
          },
        },
        {
          '@type': 'Question',
          name: 'At what stage do brands need this?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The pain typically starts at the $500K+ revenue mark with 7–10 team members. By $2M and 15 people, the lack of decision infrastructure becomes a visible growth blocker.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does rezlv send refunds automatically?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No — and that is the point. rezlv surfaces precedents and recommends decisions, but a human approves before anything goes out. It is human-in-the-loop by design.',
          },
        },
        {
          '@type': 'Question',
          name: 'What does rezlv integrate with?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'rezlv connects to your ecommerce store and operational tools — currently supporting Shopify, Gorgias, Zendesk, and email.',
          },
        },
        {
          '@type': 'Question',
          name: 'We already have SOPs. Why do we still need this?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SOPs tell your team what the policy is. They don\'t track whether anyone followed it, how similar cases were handled, or when the policy drifted. rezlv captures the actual decisions your team makes and turns that into governed, searchable knowledge.',
          },
        },
      ],
    },
  ],
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
        <Background variant="top">
          <Hero />
          <LogoStrip />
        </Background>

        <div className="mx-auto max-w-6xl px-4">
          <DashedLine className="my-0" />
        </div>

        <ProblemSection />

        <div className="mx-auto max-w-6xl px-4">
          <DashedLine className="my-0" />
        </div>

        <HowItWorks />
        <FeaturesSection />
        <IntegrationSection />

        <div className="mx-auto max-w-6xl px-4">
          <DashedLine className="my-0" />
        </div>

        <ResultsSection />

        <div className="mx-auto max-w-6xl px-4">
          <DashedLine className="my-0" />
        </div>

        <FaqSection />

        <Background variant="bottom">
          <CtaSection />
        </Background>
      </main>
      <SiteFooter />
    </>
  )
}
