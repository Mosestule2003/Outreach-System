'use client'

import * as React from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { TextField } from '@/components/ui/text-field'
import { OriginButton } from '@/components/ui/origin-button'
import { StatusChip } from '@/components/ui/status-chip'
import { stateChangeVariants } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import type { CarrierState } from '@/lib/onboarding/types'

// Real marks for the two live MVP carriers (public/logos). The rest are
// disabled "Coming soon" rows with no integration yet, so initials stay —
// shipping a real logo for a carrier we don't actually connect to would be
// its own kind of misleading placeholder.
const CARRIER_LOGO: Record<string, string> = {
  ups: '/logos/ups.svg',
  usps: '/logos/usps.svg',
}

const CARRIER_BADGE: Record<string, { bg: string; fg: string; initials: string }> = {
  'canada-post': { bg: '#C8102E', fg: '#FFFFFF', initials: 'CP' },
  purolator: { bg: '#5C2D91', fg: '#FFFFFF', initials: 'PU' },
  intelcom: { bg: '#111111', fg: '#FFFFFF', initials: 'IC' },
}

function CarrierMark({ id, className }: { id: string; className?: string }) {
  const logo = CARRIER_LOGO[id]
  if (logo) {
    return (
      <span className={`flex items-center justify-center rounded-md border-[0.5px] border-border bg-white p-1.5 ${className}`}>
        <Image src={logo} alt="" width={20} height={20} />
      </span>
    )
  }
  const badge = CARRIER_BADGE[id]
  return (
    <span
      className={`flex items-center justify-center rounded-md text-[10px] font-bold ${className}`}
      style={{ backgroundColor: badge.bg, color: badge.fg }}
    >
      {badge.initials}
    </span>
  )
}

export function CarrierRow({
  carrier,
  onOpenForm,
  onValidate,
}: {
  carrier: CarrierState
  onOpenForm: () => void
  onValidate: (apiKey: string, accountNumber: string) => void
}) {
  const reduceMotion = useReducedMotion()
  const [apiKey, setApiKey] = React.useState('')
  const [accountNumber, setAccountNumber] = React.useState('')

  if (!carrier.available) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-card px-4 py-3 opacity-60 shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-3">
          <CarrierMark id={carrier.id} className="size-8" />
          <span className="text-[14px] font-medium text-foreground">{carrier.name}</span>
        </div>
        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          Coming soon
        </span>
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{ boxShadow: 'var(--shadow-md)' }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-lg bg-card shadow-[var(--shadow-sm)]"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.08, rotate: -4 }} transition={{ duration: 0.2 }}>
            <CarrierMark id={carrier.id} className="size-8" />
          </motion.div>
          <span className="text-[14px] font-medium text-foreground">{carrier.name}</span>
        </div>

        {carrier.state === 'connected' ? (
          <StatusChip tone="connected" />
        ) : carrier.state === 'validating' ? (
          <StatusChip tone="validating" />
        ) : carrier.state === 'needs_reauth' ? (
          <StatusChip tone="needs_reauth" />
        ) : carrier.state === 'disconnected' ? (
          <button
            type="button"
            onClick={onOpenForm}
            className="interactive-link text-[13px] font-medium text-foreground"
          >
            Connect
          </button>
        ) : null}
      </div>

      <AnimatePresence initial={false}>
        {carrier.state === 'form_open' && (
          <motion.div
            variants={stateChangeVariants(reduceMotion)}
            initial="initial"
            animate="animate"
            exit="exit"
            className="border-t-[0.5px] border-border bg-secondary/50 px-4 py-4"
          >
            <div className="flex flex-col gap-3">
              <TextField
                label="API key"
                name={`${carrier.id}-api-key`}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="••••••••••••"
              />
              <TextField
                label="Account number"
                name={`${carrier.id}-account`}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. A1B2C3"
              />
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                Encrypted in transit and at rest. Used only to submit address corrections on your behalf.
              </p>
              <OriginButton
                type="button"
                onClick={() => onValidate(apiKey, accountNumber)}
                disabled={!apiKey || !accountNumber}
                className="h-10 w-full text-[14px]"
              >
                Save & connect
              </OriginButton>
            </div>
          </motion.div>
        )}

        {carrier.state === 'validating' && (
          <motion.div
            variants={stateChangeVariants(reduceMotion)}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center gap-2 border-t-[0.5px] border-border bg-secondary/50 px-4 py-3 text-[13px] text-muted-foreground"
          >
            <Loader2 className="size-3.5 animate-spin" />
            Validating credentials...
          </motion.div>
        )}

        {carrier.state === 'error' && (
          <motion.div
            variants={stateChangeVariants(reduceMotion)}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center justify-between border-t-[0.5px] border-border bg-destructive/5 px-4 py-3 text-[13px] text-destructive"
          >
            <span>Those credentials didn&apos;t work — double check your API key.</span>
            <button type="button" onClick={onOpenForm} className="interactive-link shrink-0 font-medium">
              Try again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
