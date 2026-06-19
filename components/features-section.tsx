import { Reveal } from '@/components/reveal'
import { Sparkles, Users } from 'lucide-react'
import { DecisionDelegationIllustration, CustomerContextIllustration } from './illustrations'

const FEATURES = [
  {
    title: 'Every exception gets an owner — automatically.',
    description: 'No more "who handles this?" in Slack. When a ticket hits an edge case, rezlv assigns it to the right person based on your rules — with a nudge, a deadline, and a log of how it was resolved. Your Head of CX stops being the human router for every exception.',
    icon: <Users className="size-5 text-accent" />,
    illustration: <DecisionDelegationIllustration />,
  },
  {
    title: 'Full customer picture, right where your team decides.',
    description: 'rezlv pulls order history, open tickets, conversation history, satisfaction scores, and VIP tags from your store and helpdesk into a single view — surfaced inside the reply your agent is already writing, not in a separate tab they have to remember to check.',
    icon: <Sparkles className="size-5 text-accent" />,
    illustration: <CustomerContextIllustration />,
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24 bg-muted/30 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Features</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            The right call, by default. Every time, for every agent.
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
                      {feature.illustration}
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
