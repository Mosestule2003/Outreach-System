import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { ProblemSection } from '@/components/problem-section'
import { FeaturesSection } from '@/components/features-section'
import { HowItWorks } from '@/components/how-it-works'
import { ResultsSection } from '@/components/results-section'
import { IntegrationSection } from '@/components/integration-section'
import { Testimonials } from '@/components/testimonials'
import { FaqSection } from '@/components/faq-section'
import { CtaSection } from '@/components/cta-section'
import { SiteFooter } from '@/components/site-footer'

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
        'rezlv is the decision layer for returns and CX exceptions for Shopify and DTC brands. It surfaces brand policy inside every agent reply, enforces ownership of every exception, and drafts on-policy, human-approved responses.',
      sameAs: [
        'https://twitter.com/rezlv',
        'https://linkedin.com/company/rezlv',
      ],
      foundingDate: '2024',
      numberOfEmployees: { '@type': 'QuantitativeValue', value: '2' },
      knowsAbout: [
        'ecommerce returns automation',
        'DTC customer experience',
        'Shopify refund management',
        'customer service AI',
        'returns policy enforcement',
        'CX decision software',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'rezlv',
      description: 'Returns & CX decisions, correct by default',
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
      name: 'rezlv — Returns & CX decisions, correct by default',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
      description:
        'rezlv is the decision layer for Shopify & DTC brands. Surface your returns and refund logic inside every agent reply, enforce ownership of every exception, and ship on-policy, human-approved responses.',
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
      applicationSubCategory: 'Customer Experience Software',
      operatingSystem: 'Web',
      url: SITE_URL,
      description:
        'rezlv is the decision layer for returns and CX exceptions for Shopify and DTC brands. It surfaces brand policy inside every reply, enforces ownership of every exception, and drafts on-policy, human-approved responses.',
      featureList: [
        'Returns policy decision engine',
        'Human-in-the-loop approval workflow',
        'Shopify integration',
        'Gorgias and Zendesk helpdesk integration',
        'Exception ownership tracking',
        'On-policy draft replies',
        'CX accountability logging',
      ],
      screenshot: `${SITE_URL}/hero-decision-mockup.png`,
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
          name: 'Does rezlv send refunds automatically?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No — and that is the point. rezlv drafts on-policy replies and recommends decisions, but a human approves before anything goes out. It is human-in-the-loop by design so it can never promise an outcome you would not honor.',
          },
        },
        {
          '@type': 'Question',
          name: 'What does rezlv integrate with?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'rezlv connects to Shopify and one helpdesk (like Gorgias or Zendesk) to start. The surface is deliberately narrow so setup is fast and the decision logic stays sharp.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does rezlv setup take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most brands go from kickoff to routing real decisions within two weeks. Mapping your policy into a decision tree is a working session, not a multi-quarter project.',
          },
        },
        {
          '@type': 'Question',
          name: 'Who is rezlv for?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Shopify and DTC brands with roughly 7 to 15 people and a real returns and CX volume — especially teams that have just hit a painful, visible inconsistency and want the right call to happen by default.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is rezlv different from an AI chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Chatbots try to answer everything autonomously and often go off-policy. rezlv is a decision and accountability layer: it enforces your rules, assigns ownership of every exception, and logs deviations — with a human in the loop.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is rezlv.com?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'rezlv.com is the home of rezlv, a CX decision platform built for Shopify and DTC brands. It helps brands enforce returns and refund policy consistently, draft on-policy agent replies, and keep humans accountable for every exception.',
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
        <Hero />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorks />
        <IntegrationSection />
        <ResultsSection />
        <Testimonials />
        <FaqSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  )
}
