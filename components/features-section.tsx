import { Reveal } from '@/components/reveal'
import Image from 'next/image'
import { Sparkles, Users } from 'lucide-react'

const FEATURES = [
  {
    title: 'Automated task assignment',
    description: 'Every exception is assigned to the right owner automatically, based on predefined rules. No more guessing who should handle a tricky refund.',
    icon: <Users className="size-5 text-accent" />,
    image: '/feature_decision_delegation.png',
    alt: 'Decision delegation assigning a task to Sarah (CX Lead)',
  },
  {
    title: 'Centralized customer context',
    description: 'A comprehensive view of a customer’s profile, combining data from Shopify and your helpdesk. Access order history, interactions, and tags in one place.',
    icon: <Sparkles className="size-5 text-accent" />,
    image: '/feature_customer_context.png',
    alt: 'Centralized customer profile showing Shopify and helpdesk data',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24 bg-muted/30 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Features</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Everything you need to resolve tickets faster.
          </h2>
        </Reveal>

        <div className="mt-20 flex flex-col gap-24">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={100}>
              <div className={`flex flex-col items-center gap-12 lg:flex-row ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-secondary">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight">{feature.title}</h3>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
                <div className="flex-[1.5]">
                  <div className="overflow-hidden rounded-[1.5rem] border border-border/50 bg-background p-2 shadow-xl">
                    <div className="overflow-hidden rounded-2xl border border-border/50">
                      <Image
                        src={feature.image}
                        alt={feature.alt}
                        width={1600}
                        height={1000}
                        className="w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
