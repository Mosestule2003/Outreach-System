'use client'

import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/marketing/reveal'
import { WaitlistButton } from './waitlist-button'
import { trackEvent } from '@/lib/analytics'
import { OriginButton } from '@/components/ui/origin-button'
import { useWaitlist } from './waitlist-context'
import { GrainPanel } from '@/components/ui/grain-panel'

function DemoCard() {
  return (
    <div id="demo" className="scroll-mt-16 flex h-full flex-col justify-between rounded-xl bg-foreground p-8 text-background sm:p-10">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-background/50">
          Book a demo
        </p>
        <h3 className="mt-4 text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
          See it resolve one of your actual exceptions.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-background/60">
          A 15-minute call using your real order and tracking data. Founder-led, for the first
          cohort of brands helping shape the product.
        </p>
      </div>

      <a
        href="https://cal.com/rezlv-official/15min"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('book_demo_click', { location: 'cta_demo' })}
        className="group mt-8 inline-flex items-center justify-center gap-2 self-start rounded-full bg-background px-6 py-3.5 text-sm font-medium text-foreground shadow-[var(--shadow-sm)] transition-colors hover:bg-[var(--paper-mist)]"
      >
        Book a 15-min demo
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </a>
    </div>
  )
}

function WaitlistCard() {
  const { openWaitlist } = useWaitlist()

  return (
    <div id="waitlist" className="scroll-mt-16 flex h-full flex-col justify-between rounded-xl bg-card p-8 shadow-[var(--shadow-sm)] sm:p-10">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Get early access</p>
        <h3 className="mt-4 text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
          Want to try it on your store first?
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Get early access to the resolution loop, plus the pilot pricing we are testing with the
          first brands on the platform.
        </p>
      </div>

      <div className="mt-8">
        <OriginButton
          onClick={() => {
            trackEvent('waitlist_open', { source: 'cta_section' })
            openWaitlist()
          }}
          className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-button)] sm:w-auto"
        >
          Get early access
        </OriginButton>
        <p className="mt-4 text-xs text-muted-foreground">No spam. Every application reviewed personally.</p>
      </div>
    </div>
  )
}

export function CtaSection() {
  return (
    <section className="px-4 py-20 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal variant="blur" className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Stop losing orders to failed deliveries.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Currently onboarding the first cohort of Canadian Shopify DTC brands.
          </p>
        </Reveal>

        <GrainPanel color="amber" className="rounded-xl p-3 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <Reveal variant="left" delay={80}>
              <DemoCard />
            </Reveal>
            <Reveal variant="right" delay={160}>
              <WaitlistCard />
            </Reveal>
          </div>
        </GrainPanel>
      </div>
    </section>
  )
}
