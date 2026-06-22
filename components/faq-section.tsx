'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/reveal'
import { trackEvent } from '@/lib/analytics'

const FAQS = [
  {
    q: 'What does "decision version control" actually mean?',
    a: 'Every time your team makes an operational call — approving a refund, handling an edge case, escalating a dispute — rezlv logs what was decided, who decided it, why, and what precedent supported it. Over time, you can see how your decision-making evolves and where policies need updating.',
  },
  {
    q: 'How is this different from a knowledge base or wiki?',
    a: 'Wikis are passive — they require someone to remember to check them. rezlv is active. It captures decisions as they happen, surfaces relevant precedent at the moment of action, and tracks how policies evolve over time.',
  },
  {
    q: 'How is this different from CX automation tools?',
    a: 'CX automation tools like Gorgias or Zendesk AI automate responses. rezlv governs the decisions behind those responses. We don\'t replace your helpdesk — we connect to it and create a decision layer on top.',
  },
  {
    q: 'At what stage do brands need this?',
    a: 'The pain typically starts around $500K+ in annual revenue with 7–10 team members. By $2M and 15 people, the lack of decision infrastructure becomes a visible growth blocker.',
  },
  {
    q: 'Does rezlv send refunds or take actions automatically?',
    a: 'No. rezlv surfaces precedents and recommends decisions, but a human always approves before anything goes out. It\'s human-in-the-loop by design.',
  },
  {
    q: 'What does it integrate with?',
    a: 'rezlv connects to Shopify, Gorgias, Zendesk, and email. We capture how decisions are actually being made across these systems and organize them into a searchable decision history.',
  },
  {
    q: 'How long does setup take?',
    a: 'Most brands go from kickoff to capturing real decisions within two weeks. Connecting your tools takes a working session, not a multi-quarter project.',
  },
  {
    q: 'We already have SOPs. Why do we still need this?',
    a: 'SOPs tell your team what the policy is. They don\'t track whether anyone followed it, how similar cases were handled, or when the policy drifted. rezlv captures the actual decisions your team makes and turns that into governed, searchable knowledge.',
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
    <section id="faq" className="scroll-mt-24 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <Reveal variant="blur" className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">FAQ</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Questions, answered.
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
            Still unsure if rezlv fits your stack?{' '}
            <a
              href="https://calendar.app.google/L2M8WNnoBo3ufACb7"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('book_walkthrough_click', { location: 'faq' })}
              className="font-medium text-foreground underline underline-offset-4"
            >
              Book a walkthrough
            </a>{' '}
            and we&apos;ll walk through your exact workflow.
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
                    'rounded-2xl border transition-all duration-300',
                    isOpen
                      ? 'border-foreground/10 bg-card shadow-[var(--shadow-md)]'
                      : 'border-border bg-card/50 hover:bg-card',
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
