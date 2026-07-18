'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal } from '@/components/marketing/reveal'
import { GrainPanel } from '@/components/ui/grain-panel'
import { Highlight } from '@/components/ui/highlight'
import { WorkflowDiagram } from '@/components/marketing/workflow-diagram'
import { PhoneMessageMockup } from '@/components/marketing/phone-message-mockup'
import { Check, Radar, MessageSquareText, PackageCheck, Webhook, KeySquare, Repeat, ShieldCheck } from 'lucide-react'

type Pillar = 'amber' | 'blue' | 'green'

const INK: Record<Pillar, string> = {
  amber: 'var(--accent-amber-ink)',
  blue: 'var(--accent-blue-ink)',
  green: 'var(--accent-green-ink)',
}

function SubFeature({
  icon,
  label,
  body,
  color,
}: {
  icon: React.ReactNode
  label: string
  body: string
  color: Pillar
}) {
  return (
    <div className="border-t border-border py-5 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: INK[color] }}>
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  )
}

// Orchestration — SMS thread types in message by message, matching the
// escalation ladder's actual pacing (SMS -> reply -> confirmation).
// Execution — the corrected illustration. NOT a fake API-call log implying
// silent automation. A "ready to confirm" panel: the agent has prepared
// each correction, a human clicks Confirm & Submit. Loops through a
// confirm animation on an interval so it reads as alive, not static.
function ExecutionMockup() {
  const rows = [
    { order: '#10482', carrier: 'Canada Post', detail: 'Corrected address for order #10482' },
    { order: '#10479', carrier: 'UPS Canada', detail: 'Redelivery window confirmed for order #10479' },
    { order: '#10475', carrier: 'Intelcom', detail: 'Gate code submitted for order #10475' },
  ]
  const [confirmed, setConfirmed] = useState<number[]>([])

  useEffect(() => {
    if (confirmed.length >= rows.length) {
      const reset = setTimeout(() => setConfirmed([]), 1400)
      return () => clearTimeout(reset)
    }
    const next = setTimeout(() => setConfirmed((c) => [...c, c.length]), 1100)
    return () => clearTimeout(next)
  }, [confirmed, rows.length])

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-[12px] font-semibold">Ready to confirm</span>
        <span className="text-[11px] font-semibold text-muted-foreground">3 corrections prepared</span>
      </div>
      <div className="flex flex-col gap-2 p-3">
        {rows.map((r, i) => {
          const isConfirmed = confirmed.includes(i)
          return (
            <div key={r.order} className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-semibold text-muted-foreground">
                {r.carrier.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-medium">{r.detail}</p>
                <p className="text-[10px] text-muted-foreground">&rarr; {r.carrier}</p>
              </div>
              <AnimatePresence mode="wait">
                {isConfirmed ? (
                  <motion.span
                    key="confirmed"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-1 rounded-full bg-foreground px-2.5 py-1 text-[10px] font-medium text-background"
                  >
                    <Check className="size-3" /> Confirmed
                  </motion.span>
                ) : (
                  <motion.button
                    key="confirm"
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    className="shrink-0 rounded-full border border-border px-2.5 py-1 text-[10px] font-medium text-foreground"
                  >
                    Confirm &amp; Submit
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function PillarsSection() {
  return (
    <section id="platform" className="scroll-mt-16 px-4 py-20 sm:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Pillar 1 — Detection */}
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow" style={{ color: INK.amber }}>Catch it before it becomes a return</p>
              <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                <Highlight color="amber">Detection</Highlight>
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                Shopify fulfillment webhooks and carrier tracking data feed one classifier that
                tells a delayed package apart from a dead one.
              </p>
              <div className="mt-6">
                <SubFeature
                  icon={<Webhook className="size-3.5" />}
                  label="Real-time ingestion"
                  body="Shopify and carrier events land within minutes of the carrier scan, not the next batch sync."
                  color="amber"
                />
                <SubFeature
                  icon={<Radar className="size-3.5" />}
                  label="NDR classification"
                  body="Every exception is tagged: address issue, failed attempt, access issue, carrier delay, customs hold, damaged in transit, lost or stolen, or delivery refused."
                  color="amber"
                />
              </div>
            </div>
            <GrainPanel color="amber" className="rounded-xl p-3 sm:p-6">
              <WorkflowDiagram />
            </GrainPanel>
          </div>
        </Reveal>

        {/* Pillar 2 — Orchestration */}
        <Reveal className="mt-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <GrainPanel color="blue" className="rounded-xl p-3 sm:p-6 lg:order-2">
              <PhoneMessageMockup />
            </GrainPanel>
            <div className="lg:order-1">
              <p className="eyebrow" style={{ color: INK.blue }}>Reach the customer in under 60 seconds</p>
              <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                <Highlight color="blue">Orchestration</Highlight>
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                The moment an exception is classified, Rezlv fires a secure link by SMS, then
                escalates through email and an AI voice call if nobody responds, all before the
                carrier's return-to-sender deadline closes.
              </p>
              <div className="mt-6">
                <SubFeature
                  icon={<MessageSquareText className="size-3.5" />}
                  label="SMS outreach"
                  body="A plain-English text with a single-use portal link. No account, no app download."
                  color="blue"
                />
                <SubFeature
                  icon={<Repeat className="size-3.5" />}
                  label="Agentic escalation ladder"
                  body="No reply? Email next, then an AI voice call. Every step is automatic and timestamped on the case."
                  color="blue"
                />
                <SubFeature
                  icon={<KeySquare className="size-3.5" />}
                  label="Tokenized portal"
                  body="24-hour expiry, single use. The customer sees only their own order."
                  color="blue"
                />
              </div>
            </div>
          </div>
        </Reveal>

        {/* Pillar 3 — Execution (breaks the split pattern: stacked, full width) */}
        <Reveal className="mt-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow justify-center" style={{ color: INK.green }}>The step every competitor skips</p>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              <Highlight color="green">Execution</Highlight>
            </h2>
            <p className="mt-4 text-muted-foreground">
              The customer's correction gets translated into exactly what your carrier needs —
              then handed to you, ready to submit, in one click. The only thing that waits on a
              human is the click you were always going to make anyway.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.3fr] lg:items-center">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <SubFeature
                icon={<PackageCheck className="size-3.5" />}
                label="Ready-to-submit corrections"
                body="Packaged exactly as Canada Post, UPS Canada, Intelcom, Purolator, Canpar Express, Loomis Express, or FedEx Canada needs it. You confirm, we handle the rest."
                color="green"
              />
              <SubFeature
                icon={<Repeat className="size-3.5" />}
                label="Shopify auto-sync"
                body="Fulfillment notes and order status update the moment your carrier confirms."
                color="green"
              />
              <SubFeature
                icon={<ShieldCheck className="size-3.5" />}
                label="Full audit trail"
                body="Every attempt, success, and failure logged against the order."
                color="green"
              />
            </div>
            <GrainPanel color="green" className="rounded-xl p-3 sm:p-6">
              <ExecutionMockup />
            </GrainPanel>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
