'use client'

import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { WaitlistButton } from './waitlist-button'
import { HeroDashboardIllustration } from './illustrations'
import { trackEvent } from '@/lib/analytics'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pt-32 sm:pt-40">
      {/* soft background wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,oklch(0.7_0.16_158_/_0.10),transparent_70%)]"
      />

      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <WaitlistButton
            source="hero_badge"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground shadow-sm transition-colors hover:text-foreground"
          >
            <span className="flex size-1.5 rounded-full bg-accent" />
            FOR DTC BRANDS SCALING PAST FOUNDER-LED CX · PRIVATE BETA
          </WaitlistButton>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-6 text-balance text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            Your brand runs on tribal knowledge. That breaks when you scale.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            rezlv embeds your returns and CX decision logic directly into your store and helpdesk — so every agent makes the right call by default, every exception gets an owner, and you stop being the final word on everything.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <WaitlistButton
              source="hero_cta"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.02]"
            >
              Request early access
            </WaitlistButton>
            <a
              href="#how-it-works"
              onClick={() => trackEvent('hero_scroll_cta_click')}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              See how it works
            </a>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <p className="mt-4 text-sm text-muted-foreground">
            Built for brands with 7–25 people where decisions still route through the founder.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            No credit card · 20-minute walkthrough · Founder-priced for early brands
          </p>
        </Reveal>
      </div>

      {/* hero illustration */}
      <Reveal delay={200} className="mx-auto mt-16 max-w-5xl">
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-x-6 -bottom-6 -top-2 -z-10 rounded-[2.5rem] bg-gradient-to-b from-muted/60 to-transparent"
          />
          <div className="relative mx-auto mt-20 max-w-5xl rounded-[2rem] border border-border/50 bg-card p-2 shadow-2xl sm:p-4">
            <div className="overflow-hidden rounded-[1.5rem] border border-border/50 bg-background">
              <HeroDashboardIllustration />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
