'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/reveal'
import { trackEvent } from '@/lib/analytics'

const FAQS = [
  {
    q: 'Does rezlv send refunds automatically?',
    a: 'No — and that\'s the point. rezlv drafts on-policy replies and recommends decisions, but a human approves before anything goes out. It\'s human-in-the-loop by design so it can never promise an outcome you wouldn\'t honor.',
  },
  {
    q: 'What does it integrate with?',
    a: 'rezlv connects to your ecommerce store and your helpdesk — currently supporting Shopify, Gorgias, and Zendesk. We pull customer profiles, full ticket and conversation history, agent assignments, CSAT scores, and order data into a single decision view. We deliberately keep the integration surface narrow so setup is fast and the decision logic stays sharp.',
  },
  {
    q: 'How long does setup take?',
    a: 'Most brands go from kickoff to routing real decisions within two weeks. Mapping your policy into a decision tree is a working session, not a multi-quarter project.',
  },
  {
    q: 'Who is rezlv for?',
    a: 'Ecommerce and DTC brands at the $500K–$2M stage with 7–15 people. At that size, founder proximity breaks — you\'ve already bought the tools but the ownership gaps are still there. rezlv is especially sharp for teams that have just hit a visible, costly inconsistency (a refund scandal, a viral off-brand reply, a key CX person leaving) and need the right call to happen by default going forward.',
  },
  {
    q: 'How is this different from my helpdesk AI or a chatbot?',
    a: 'Your helpdesk unifies the inbox — but agents still need your brand\'s judgment to answer correctly. Chatbots try to resolve everything autonomously and regularly make promises your policy doesn\'t cover. rezlv is the decision and accountability layer that sits on top: it enforces your specific rules, surfaces the right call inside the reply your agent is writing, assigns ownership of every exception, and logs deviations — with a human approving before anything goes out.',
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
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">FAQ</p>
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
          <div className="divide-y divide-border rounded-3xl border border-border bg-card">
            {FAQS.map((item, i) => {
              const isOpen = open === i
              return (
                <div key={item.q} className="px-6">
                  <button
                    type="button"
                    onClick={() => toggle(i, item.q)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="text-base font-medium text-foreground">{item.q}</span>
                    <Plus
                      className={cn(
                        'size-5 shrink-0 text-muted-foreground transition-transform duration-300',
                        isOpen && 'rotate-45',
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      'grid transition-all duration-300 ease-out',
                      isOpen ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <p className="overflow-hidden text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </p>
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
