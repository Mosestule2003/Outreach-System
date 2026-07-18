'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, MapPin, Package, Truck } from 'lucide-react'
import { DashboardTopbar } from '@/components/dashboard/topbar'
import { ExceptionStatusBadge } from '@/components/dashboard/exception-status-badge'
import { OriginButton } from '@/components/ui/origin-button'
import { getExceptionById, TYPE_LABEL } from '@/lib/dashboard/mock-data'
import { staggerContainer, staggerItem } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useToast } from '@/lib/toast/toast-store'
import { cn } from '@/lib/utils'

export default function CaseDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const { push } = useToast()
  const [overriding, setOverriding] = React.useState(false)
  const [overridden, setOverridden] = React.useState(false)

  const exception = getExceptionById(params.id)

  if (!exception) {
    return (
      <>
        <DashboardTopbar title="Case not found" />
        <div className="flex-1 p-8">
          <button onClick={() => router.push('/dashboard/exceptions')} className="interactive-link text-[13px] font-medium">
            ← Back to exception queue
          </button>
        </div>
      </>
    )
  }

  async function handleManualOverride() {
    setOverriding(true)
    await new Promise((r) => setTimeout(r, 1300))
    setOverriding(false)
    setOverridden(true)
    push({
      tone: 'success',
      title: `${exception.orderNumber} marked resolved`,
      description: 'The customer will not receive any further automated messages for this case.',
    })
  }

  // Escalated cases especially need the override action available — that's
  // exactly the moment a merchant is most likely to want to step in by hand.
  const isOpen = exception.status !== 'resolved' && !overridden
  const needsAttention = exception.status === 'escalated' && !overridden

  return (
    <>
      <DashboardTopbar title={exception.orderNumber} subtitle={exception.customer} />

      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <button
          onClick={() => router.push('/dashboard/exceptions')}
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to queue
        </button>

        <motion.div
          variants={staggerContainer(reduceMotion, 0.08)}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]"
        >
          {/* Timeline */}
          <motion.div variants={staggerItem(reduceMotion)} className="rounded-xl bg-card p-6 shadow-[var(--shadow-sm)]">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[14px] font-semibold text-foreground">Timeline</span>
              <ExceptionStatusBadge status={overridden ? 'resolved' : exception.status} />
            </div>

            <ol className="flex flex-col gap-4">
              {exception.timeline.map((event, i) => (
                <motion.li
                  key={event.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: reduceMotion ? 0 : 0.05 * i }}
                  className="flex gap-3"
                >
                  <div className="flex flex-col items-center">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-blue-soft)] text-[var(--accent-blue-ink)]">
                      <Check className="size-3.5" />
                    </span>
                    {i < exception.timeline.length - 1 && <div className="mt-1 h-full w-px flex-1 bg-border" />}
                  </div>
                  <div className="pb-2">
                    <p className="text-[13px] font-medium text-foreground">{event.label}</p>
                    <p className="mt-0.5 text-[12px] text-muted-foreground">{event.detail}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground/70">{event.timestamp}</p>
                  </div>
                </motion.li>
              ))}

              <AnimatePresence>
                {overridden && (
                  <motion.li
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-green-soft)] text-[var(--accent-green-ink)]">
                      <Check className="size-3.5" />
                    </span>
                    <div>
                      <p className="text-[13px] font-medium text-foreground">Manually resolved</p>
                      <p className="mt-0.5 text-[12px] text-muted-foreground">Marked resolved by MK — CS override</p>
                    </div>
                  </motion.li>
                )}
              </AnimatePresence>
            </ol>

            {isOpen && (
              <div className="mt-6 border-t border-border pt-5">
                <OriginButton onClick={handleManualOverride} loading={overriding} className="h-10 text-[13px]">
                  {overriding ? 'Resolving' : 'Mark resolved manually'}
                </OriginButton>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Use this if you've resolved the exception outside Rezlv (phone call, in-person, etc).
                </p>
              </div>
            )}

            {needsAttention && (
              <div className="mt-6 rounded-lg bg-destructive/5 p-4 text-[13px] text-destructive">
                Customer didn&apos;t respond within the 24hr window. Escalate to CS or offer a nearby pickup point.
              </div>
            )}
          </motion.div>

          {/* Case details */}
          <motion.div variants={staggerItem(reduceMotion)} className="flex flex-col gap-4">
            <div className="rounded-xl bg-card p-5 shadow-[var(--shadow-sm)]">
              <div className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-foreground">
                <Package className="size-4" />
                Order details
              </div>
              <dl className="flex flex-col gap-3 text-[13px]">
                <Row label="Order" value={exception.orderNumber} mono />
                <Row label="Customer" value={exception.customer} />
                <Row label="Exception type" value={TYPE_LABEL[exception.type]} />
              </dl>
            </div>

            <div className="rounded-xl bg-card p-5 shadow-[var(--shadow-sm)]">
              <div className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-foreground">
                <MapPin className="size-4" />
                Delivery address
              </div>
              <p className="text-[13px] text-muted-foreground line-through decoration-destructive/50">{exception.address}</p>
              {exception.correctedAddress && (
                <p className="mt-1.5 text-[13px] font-medium text-[var(--accent-green-ink)]">{exception.correctedAddress}</p>
              )}
            </div>

            <div className="rounded-xl bg-card p-5 shadow-[var(--shadow-sm)]">
              <div className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-foreground">
                <Truck className="size-4" />
                Carrier
              </div>
              <p className="text-[13px] text-muted-foreground">{exception.carrier} — Delivery Intercept API</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn('font-medium text-foreground', mono && 'font-mono')}>{value}</dd>
    </div>
  )
}
