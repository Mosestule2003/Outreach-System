'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/marketing/reveal'
import { trackEvent } from '@/lib/analytics'

const FAQS = [
  {
    q: 'What does Rezlv actually do?',
    a: 'When a package fails to deliver, Rezlv detects the exception, texts your customer a secure link to fix it (a wrong address, a missed signature, a gate code), and prepares that correction exactly as your carrier needs it — ready for your team to confirm in one click.',
  },
  {
    q: 'We already use AfterShip or Narvar. Why do we need this too?',
    a: 'Those are excellent notification tools. They tell your customer something went wrong. Rezlv is the layer that also gets it fixed: customer outreach and carrier-ready corrections in the same automated flow. Most brands run both side by side.',
  },
  {
    q: 'How is Rezlv different from ClickPost?',
    a: 'ClickPost runs its own automated outreach and carrier feedback loop, and it does a lot of it well. Rezlv’s difference is narrower and specific: the customer submits the exact correction themselves through a secure link, and that input — not an ops team or an automation acting on their behalf — is exactly what gets packaged and handed to your team to send. Even when we escalate to an AI voice call, we are still collecting the customer’s own decision, not making it for them.',
  },
  {
    q: 'Our CS team already handles this manually. What changes?',
    a: 'Most teams spend 2 to 3 days per exception chasing a fix. Rezlv gets it ready to send in under 2 hours, automatically. Your team just confirms — no more digging through carrier portals or playing phone tag with the customer.',
  },
  {
    q: 'What if the customer never responds?',
    a: 'Rezlv runs a fully agentic escalation ladder before the carrier’s return-to-sender deadline: SMS first, then email if there is no reply, then an AI voice agent calls as the last attempt. Every step happens automatically and is timestamped on the case. If none of it lands, you get notified and can escalate to CS, offer a nearby pickup point, or let the carrier auto-hold the package.',
  },
  {
    q: 'Which carriers does Rezlv support?',
    a: 'Canada Post, UPS Canada, Intelcom, Purolator, Canpar Express, Loomis Express, and FedEx Canada at launch — covering the carriers that actually move Canadian DTC parcel volume, connected through your own carrier accounts (BYOD).',
  },
  {
    q: 'Does Rezlv send refunds or take actions without my approval?',
    a: 'Any refund or credit always requires your approval — Rezlv never moves money on its own. Every action is logged against the order, and you set the limits on what the agent can do unsupervised.',
  },
  {
    q: 'How long does setup take?',
    a: 'Install is a Shopify webhook connection, no developer work required. Most brands see their first detected exception within 48 hours of connecting.',
  },
  {
    q: 'Is this only for Shopify stores?',
    a: 'Yes, for now — that is where we started, and where Canadian DTC brands overwhelmingly are. WooCommerce and BigCommerce are on the roadmap.',
  },
  {
    q: 'What happens if I need to submit something myself?',
    a: 'You always can — Rezlv prepares everything and shows you exactly what to submit and where, but you are never locked out of your own carrier account. Think of Rezlv as doing 95 percent of the legwork, not replacing your control.',
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  const toggle = (i: number, q: string) => {
    const isOpening = open !== i
    setOpen(isOpening ? i : null)
    if (isOpening) {
      trackEvent('faq_expand', { question: q, index: i })
    }
  }

  return (
    <section id="faq" className="scroll-mt-24 px-4 py-20 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Reveal variant="blur" className="text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Questions, answered.
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
            Still unsure if Rezlv fits your stack?{' '}
            <a
              href="https://cal.com/rezlv-official/15min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('book_demo_click', { location: 'faq' })}
              className="font-medium text-foreground underline underline-offset-4"
            >
              Book a demo
            </a>{' '}
            and we&apos;ll walk it through your actual order flow.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-12 flex flex-col gap-2">
            {FAQS.map((item, i) => {
              const isOpen = open === i
              return (
                <div
                  key={item.q}
                  className={cn(
                    'rounded-xl transition-all duration-300',
                    isOpen
                      ? 'bg-card shadow-[var(--shadow-md)]'
                      : 'bg-card/60 shadow-[var(--shadow-sm)] hover:bg-card',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggle(i, item.q)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className={cn(
                      'text-[15px] font-medium transition-colors',
                      isOpen ? 'text-foreground' : 'text-foreground/80',
                    )}>
                      {item.q}
                    </span>
                    <span
                      className={cn(
                        'flex size-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                        isOpen
                          ? 'border-foreground/20 bg-foreground text-background rotate-0'
                          : 'border-border bg-muted text-muted-foreground rotate-0',
                      )}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        className={cn('transition-transform duration-300', isOpen && 'rotate-45')}
                      >
                        <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  <div
                    className={cn(
                      'grid transition-all duration-300 ease-out',
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <div className="overflow-hidden px-6 pb-5">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
