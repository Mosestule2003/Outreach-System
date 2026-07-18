'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Check, Lock, XCircle } from 'lucide-react'
import { OnboardingCard } from '@/components/onboarding/onboarding-card'
import { ShopifyIcon } from '@/components/ui/shopify-icon'
import { OriginButton } from '@/components/ui/origin-button'
import { useOnboarding } from '@/lib/onboarding/mock-store'
import { confirmationVariants } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

// Mock outcome cycling so all three OAuth states are reachable for review/QA
// without wiring a real Shopify app: 1st attempt denies, 2nd errors, 3rd+ succeeds.
export default function StoreConnectPage() {
  const router = useRouter()
  const { state, dispatch } = useOnboarding()
  const reduceMotion = useReducedMotion()
  const [attempt, setAttempt] = React.useState(0)

  async function handleConnect() {
    dispatch({ type: 'STORE_OAUTH_START' })
    await new Promise((r) => setTimeout(r, 1400))

    const outcome = attempt === 0 ? 'denied' : attempt === 1 ? 'error' : 'connected'
    setAttempt((a) => a + 1)

    if (outcome === 'connected') {
      dispatch({ type: 'STORE_OAUTH_RESULT', result: 'connected', domain: 'brand-name.myshopify.com' })
      await new Promise((r) => setTimeout(r, 1200))
      router.push('/onboarding/carrier')
    } else {
      dispatch({ type: 'STORE_OAUTH_RESULT', result: outcome })
    }
  }

  const isPending = state.storeConnection === 'pending'
  const isConnected = state.storeConnection === 'connected'

  return (
    <OnboardingCard step={1} tone="amber">
      <div className="flex flex-col items-center gap-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.06 }}
          className="flex size-14 items-center justify-center rounded-xl bg-secondary shadow-[var(--shadow-sm)]"
        >
          <ShopifyIcon className="size-7" />
        </motion.div>

        <div>
          <h1 className="text-[26px] font-bold tracking-[-0.025em] text-foreground">Connect your Shopify store</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            Read-only access to fulfillment events — nothing else.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isConnected ? (
            <motion.div
              key="connected"
              variants={confirmationVariants(reduceMotion)}
              initial="initial"
              animate="animate"
              className="flex items-center gap-2 rounded-full bg-[var(--accent-green-soft)] px-3.5 py-1.5 text-[13px] font-medium text-[var(--accent-green-ink)]"
            >
              <Check className="size-4" />
              Connected: {state.storeDomain}
            </motion.div>
          ) : state.storeConnection === 'denied' ? (
            <motion.div
              key="denied"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-2 rounded-lg bg-[var(--accent-amber-soft)] px-3.5 py-3 text-left text-[13px] text-[var(--accent-amber-ink)]"
            >
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>Looks like you didn&apos;t finish connecting. No changes were made — try again when ready.</span>
            </motion.div>
          ) : state.storeConnection === 'error' ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-2 rounded-lg bg-destructive/10 px-3.5 py-3 text-left text-[13px] text-destructive"
            >
              <XCircle className="mt-0.5 size-4 shrink-0" />
              <span>Connection failed — this is on our end, not yours.</span>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <OriginButton onClick={handleConnect} loading={isPending} disabled={isConnected} className="w-full">
          {isPending
            ? 'Connecting to Shopify'
            : isConnected
              ? 'Connected'
              : state.storeConnection === 'idle'
                ? 'Connect Shopify store'
                : 'Retry'}
        </OriginButton>

        <p className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <Lock className="size-3.5" />
          Encrypted in transit and at rest.
        </p>
      </div>
    </OnboardingCard>
  )
}
