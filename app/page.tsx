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

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'rezlv',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description:
        'rezlv is the decision layer for returns and CX exceptions for Shopify and DTC brands. It surfaces brand policy inside every reply, enforces ownership of every exception, and drafts on-policy, human-approved responses.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Design-partner program',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Does rezlv send refunds automatically?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No — and that’s the point. rezlv drafts on-policy replies and recommends decisions, but a human approves before anything goes out. It’s human-in-the-loop by design so it can never promise an outcome you wouldn’t honor.',
          },
        },
        {
          '@type': 'Question',
          name: 'What does it integrate with?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'rezlv connects to Shopify and one helpdesk (like Gorgias or Zendesk) to start. We deliberately keep the surface narrow so setup is fast and the decision logic stays sharp.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does setup take?',
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
            text: 'Shopify and DTC brands with roughly 7–15 people and a real returns/CX volume — especially teams that have just hit a painful, visible inconsistency and want the right call to happen by default.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is this different from an AI chatbot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Chatbots try to answer everything autonomously and often go off-policy. rezlv is a decision and accountability layer: it enforces your rules, assigns ownership of every exception, and logs deviations — with a human in the loop.',
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
