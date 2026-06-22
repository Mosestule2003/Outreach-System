'use client'

import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { WaitlistButton } from './waitlist-button'
import { trackEvent } from '@/lib/analytics'
import { OriginButton } from '@/components/ui/origin-button'
import { useWaitlist } from './waitlist-context'

function DemoCard() {
  return (
    <div id="demo" className="scroll-mt-24 flex h-full flex-col justify-between rounded-2xl bg-foreground p-8 text-background sm:p-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-background/50">
          Book a walkthrough
        </p>
        <h3 className="mt-4 text-balance text-3xl font-semibold tracking-tight">
          See it working on your actual workflow.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-background/60">
          A 20-minute call using your real returns and CX scenarios. Founder-priced access
          for the first cohort of brands who help shape the product.
        </p>
      </div>

      <a
        href="https://calendar.app.google/L2M8WNnoBo3ufACb7"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('book_walkthrough_click', { location: 'cta_demo' })}
        className="group mt-8 inline-flex items-center justify-center gap-2 self-start rounded-xl bg-background px-6 py-3.5 text-sm font-medium text-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      >
        Book a 20-min walkthrough
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </a>
    </div>
  )
}

function WaitlistCard() {
  const { openWaitlist } = useWaitlist()

  return (
    <div id="waitlist" className="scroll-mt-24 flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-8 sm:p-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Request access</p>
        <h3 className="mt-4 text-balance text-3xl font-semibold tracking-tight">
          Want to follow along first?
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Request access for early onboarding, product updates, and the playbook we use to help
          brands make the right call by default — before a costly inconsistency forces the issue.
        </p>
      </div>

      <div className="mt-8">
        <OriginButton
          onClick={() => {
            trackEvent('waitlist_open', { source: 'cta_section' })
            openWaitlist()
          }}
          className="w-full rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground sm:w-auto"
        >
          Request early access
        </OriginButton>
        <p className="mt-4 text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
      </div>
    </div>
  )
}

export function CtaSection() {
  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal variant="blur" className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Stop losing decisions to Slack threads and memory.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Request access to the decision layer scaling brands are missing.
            Currently onboarding Shopify/DTC brands at $500K–$2M revenue.
          </p>
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal variant="left" delay={80}>
            <DemoCard />
          </Reveal>
          <Reveal variant="right" delay={160}>
            <WaitlistCard />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
