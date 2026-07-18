'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, Check, Clock, MapPin, MessageSquare, PackageX, Truck } from 'lucide-react'
import { OriginButton } from '@/components/ui/origin-button'
import { TextField } from '@/components/ui/text-field'
import { Logo } from '@/components/ui/logo'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

type Phase = 'intro' | 'detected' | 'sms_sent' | 'awaiting_input' | 'submitted' | 'sent_to_carrier' | 'resolved'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * NDR-aware option routing — RICE 1620, the highest-scored item in the MVP
 * feature backlog. Different exception types need genuinely different
 * customer actions, not one generic "fix your address" form for everything.
 */
type DemoExceptionType = 'address_issue' | 'failed_attempt' | 'access_issue'

const EXCEPTION_CONFIG: Record<
  DemoExceptionType,
  { label: string; orderAddress: string; portalHeadline: string; portalSub: string; resolvedAction: string }
> = {
  address_issue: {
    label: 'address_issue',
    orderAddress: '128 Maple St, Apt 4',
    portalHeadline: "We couldn't deliver your package",
    portalSub: 'Confirm or correct your delivery address below.',
    resolvedAction: 'Sent to UPS for redelivery',
  },
  failed_attempt: {
    label: 'failed_attempt',
    orderAddress: '45 Birchwood Ave',
    portalHeadline: 'You missed your delivery attempt',
    portalSub: 'Pick a new time window that works for you.',
    resolvedAction: 'Redelivery window sent to UPS',
  },
  access_issue: {
    label: 'access_issue',
    orderAddress: '900 Harbor Blvd, Unit 12',
    portalHeadline: 'Our driver couldn’t get to your door',
    portalSub: 'Choose a nearby pickup point instead.',
    resolvedAction: 'Pickup point sent to UPS',
  },
}

const TIME_WINDOWS = ['Tomorrow, 9am–12pm', 'Tomorrow, 12–3pm', 'Tomorrow, 3–6pm']
const PICKUP_POINTS = ['Shoppers Drug Mart — 0.4 mi', 'UPS Access Point — 0.9 mi', 'Circle K — 1.2 mi']

interface TimelineEntry {
  id: string
  label: string
  icon: React.ReactNode
}

export function TestExceptionDemo({ onComplete }: { onComplete: () => void }) {
  const reduceMotion = useReducedMotion()
  const [exceptionType, setExceptionType] = React.useState<DemoExceptionType>('address_issue')
  const [phase, setPhase] = React.useState<Phase>('intro')
  const [address, setAddress] = React.useState('')
  const [selectedWindow, setSelectedWindow] = React.useState<string | null>(null)
  const [selectedPickup, setSelectedPickup] = React.useState<string | null>(null)
  const [timeline, setTimeline] = React.useState<TimelineEntry[]>([])

  const config = EXCEPTION_CONFIG[exceptionType]

  function resetDemo(nextType: DemoExceptionType) {
    setExceptionType(nextType)
    setPhase('intro')
    setAddress('')
    setSelectedWindow(null)
    setSelectedPickup(null)
    setTimeline([])
  }

  const phaseTimeline: Partial<Record<Phase, TimelineEntry>> = React.useMemo(
    () => ({
      detected: { id: 'detected', label: 'Exception detected', icon: <PackageX className="size-4" /> },
      sms_sent: { id: 'sms_sent', label: 'SMS sent to customer', icon: <MessageSquare className="size-4" /> },
      submitted: {
        id: 'submitted',
        label:
          exceptionType === 'address_issue'
            ? 'Address correction received'
            : exceptionType === 'failed_attempt'
              ? 'Delivery window selected'
              : 'Pickup point selected',
        icon:
          exceptionType === 'failed_attempt' ? (
            <Calendar className="size-4" />
          ) : (
            <MapPin className="size-4" />
          ),
      },
      sent_to_carrier: { id: 'sent_to_carrier', label: config.resolvedAction, icon: <Truck className="size-4" /> },
      resolved: { id: 'resolved', label: 'Resolved', icon: <Check className="size-4" /> },
    }),
    [exceptionType, config.resolvedAction],
  )

  // Keyed on exceptionType (which only changes when the demo resets), not on
  // phase — depending on `phase` here would re-run this effect every time a
  // timer fires and set `phase`, and the resulting cleanup would cancel the
  // still-pending later timers before they ever got a chance to run.
  React.useEffect(() => {
    let cancelled = false
    async function play() {
      await sleep(900)
      if (cancelled) return
      setPhase('detected')
      await sleep(1000)
      if (cancelled) return
      setPhase('sms_sent')
      await sleep(1300)
      if (cancelled) return
      setPhase('awaiting_input')
    }
    play()
    return () => {
      cancelled = true
    }
  }, [exceptionType])

  React.useEffect(() => {
    const entry = phaseTimeline[phase]
    if (entry) setTimeline((t) => (t.find((e) => e.id === entry.id) ? t : [...t, entry]))
  }, [phase, phaseTimeline])

  async function advanceAfterSubmit() {
    setPhase('submitted')
    await new Promise((r) => setTimeout(r, 900))
    setPhase('sent_to_carrier')
    await new Promise((r) => setTimeout(r, 1100))
    setPhase('resolved')
  }

  const showOrderCard = phase !== 'intro' || false
  const showPortal = phase === 'awaiting_input' || phase === 'submitted' || phase === 'sent_to_carrier' || phase === 'resolved'
  const portalInteractive = phase === 'awaiting_input'
  const isDone = phase === 'resolved' || phase === 'sent_to_carrier' || phase === 'submitted'

  return (
    <div className="flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-[12px] text-muted-foreground">Simulate:</span>
        {(Object.keys(EXCEPTION_CONFIG) as DemoExceptionType[]).map((type) => (
          <button
            key={type}
            onClick={() => resetDemo(type)}
            className={cn(
              'rounded-full border-[0.5px] px-3 py-1 text-[12px] font-medium transition-colors',
              exceptionType === type
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-muted-foreground hover:bg-secondary',
            )}
          >
            {EXCEPTION_CONFIG[type].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left: timeline */}
        <div className="flex flex-col gap-4">
          <p className="text-[13px] font-medium text-muted-foreground">
            {phase === 'intro' ? 'Simulating a failed delivery...' : 'Live timeline'}
          </p>

          {showOrderCard && (
            <motion.div
              key={exceptionType}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between rounded-lg bg-card px-4 py-3 shadow-[var(--shadow-sm)]"
            >
              <div>
                <p className="font-mono text-[14px] font-medium text-foreground">Order #10482</p>
                <p className="text-[12px] text-muted-foreground">{config.orderAddress}</p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-[var(--accent-amber-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--accent-amber-ink)]">
                <PackageX className="size-3.5" />
                {config.label}
              </span>
            </motion.div>
          )}

          <ol className="flex flex-col gap-1">
            <AnimatePresence initial={false}>
              {timeline.map((entry) => (
                <motion.li
                  key={entry.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: reduceMotion ? 0.2 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] text-foreground"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-blue-soft)] text-[var(--accent-blue-ink)]">
                    {entry.icon}
                  </span>
                  {entry.label}
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>

          {phase === 'resolved' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center gap-3 rounded-lg bg-[var(--accent-green-soft)] px-4 py-3 text-[var(--accent-green-ink)]"
            >
              <Check className="size-5" />
              <span className="text-[14px] font-medium">Exception resolved — no CS ticket needed.</span>
            </motion.div>
          )}
        </div>

        {/* Right: live customer portal preview, in a device frame */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-[340px] overflow-hidden rounded-[28px] border-[6px] border-primary bg-background shadow-[var(--shadow-xl)]">
            <div className="flex items-center justify-center border-b-[0.5px] border-border py-2.5">
              <div className="h-1 w-10 rounded-full bg-muted" />
            </div>
            <div className="flex min-h-[380px] flex-col gap-5 p-5">
              <div className="flex items-center gap-2">
                <Logo size={5} />
                <span className="text-[13px] font-medium text-foreground">Rezlv</span>
              </div>

              <AnimatePresence mode="wait">
                {!showPortal ? (
                  <motion.div
                    key="waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-1 items-center justify-center text-center text-[13px] text-muted-foreground"
                  >
                    Waiting for exception detection...
                  </motion.div>
                ) : isDone ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-1 flex-col items-center justify-center gap-3 text-center"
                  >
                    <span className="flex size-12 items-center justify-center rounded-full bg-[var(--accent-green-soft)] text-[var(--accent-green-ink)]">
                      <Check className="size-6" />
                    </span>
                    <p className="text-[14px] font-medium text-foreground">
                      {exceptionType === 'address_issue' && "Thanks — we've updated your address."}
                      {exceptionType === 'failed_attempt' && "Thanks — we've booked your window."}
                      {exceptionType === 'access_issue' && "Thanks — we've set your pickup point."}
                    </p>
                    <p className="text-[12px] text-muted-foreground">Your package will be redelivered.</p>
                  </motion.div>
                ) : exceptionType === 'address_issue' ? (
                  <motion.form
                    key="address-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (address.trim()) advanceAfterSubmit()
                    }}
                    className="flex flex-1 flex-col gap-4"
                  >
                    <PortalHeader headline={config.portalHeadline} sub={config.portalSub} />
                    <TextField
                      label="Delivery address"
                      name="portal-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="128 Maple St, Apt 4B"
                      disabled={!portalInteractive}
                      autoFocus
                    />
                    <OriginButton type="submit" disabled={!address.trim() || !portalInteractive} className="mt-auto h-10 w-full text-[14px]">
                      Confirm address
                    </OriginButton>
                  </motion.form>
                ) : exceptionType === 'failed_attempt' ? (
                  <motion.div key="window-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-1 flex-col gap-4">
                    <PortalHeader headline={config.portalHeadline} sub={config.portalSub} />
                    <div className="flex flex-col gap-2">
                      {TIME_WINDOWS.map((w) => (
                        <button
                          key={w}
                          type="button"
                          disabled={!portalInteractive}
                          onClick={() => setSelectedWindow(w)}
                          className={cn(
                            'flex items-center gap-2.5 rounded-lg border-[0.5px] px-3.5 py-2.5 text-left text-[13px] transition-colors',
                            selectedWindow === w ? 'border-foreground bg-secondary font-medium' : 'border-border text-muted-foreground',
                          )}
                        >
                          <Clock className="size-3.5 shrink-0" />
                          {w}
                        </button>
                      ))}
                    </div>
                    <OriginButton
                      type="button"
                      onClick={() => selectedWindow && advanceAfterSubmit()}
                      disabled={!selectedWindow || !portalInteractive}
                      className="mt-auto h-10 w-full text-[14px]"
                    >
                      Confirm window
                    </OriginButton>
                  </motion.div>
                ) : (
                  <motion.div key="pickup-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-1 flex-col gap-4">
                    <PortalHeader headline={config.portalHeadline} sub={config.portalSub} />
                    <div className="flex flex-col gap-2">
                      {PICKUP_POINTS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          disabled={!portalInteractive}
                          onClick={() => setSelectedPickup(p)}
                          className={cn(
                            'flex items-center gap-2.5 rounded-lg border-[0.5px] px-3.5 py-2.5 text-left text-[13px] transition-colors',
                            selectedPickup === p ? 'border-foreground bg-secondary font-medium' : 'border-border text-muted-foreground',
                          )}
                        >
                          <MapPin className="size-3.5 shrink-0" />
                          {p}
                        </button>
                      ))}
                    </div>
                    <OriginButton
                      type="button"
                      onClick={() => selectedPickup && advanceAfterSubmit()}
                      disabled={!selectedPickup || !portalInteractive}
                      className="mt-auto h-10 w-full text-[14px]"
                    >
                      Confirm pickup point
                    </OriginButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <p className="text-center text-[12px] text-muted-foreground">
            This is the exact screen your customer would see — try it yourself.
          </p>
        </div>
      </div>

      {phase === 'resolved' && <OriginButton onClick={onComplete} className="w-full">Continue</OriginButton>}
    </div>
  )
}

function PortalHeader({ headline, sub }: { headline: string; sub: string }) {
  return (
    <div>
      <p className="text-[15px] font-medium text-foreground">{headline}</p>
      <p className="mt-1 text-[13px] text-muted-foreground">{sub}</p>
    </div>
  )
}
