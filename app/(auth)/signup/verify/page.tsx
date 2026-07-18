'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Mail } from 'lucide-react'
import { useOnboarding } from '@/lib/onboarding/mock-store'
import { stepVariants } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const RESEND_COOLDOWN = 60
// Mock: verification "arrives" on its own after this long, simulating the user clicking the email link.
const MOCK_VERIFY_DELAY_MS = 4000

export default function VerifyPage() {
  const router = useRouter()
  const { state, dispatch } = useOnboarding()
  const reduceMotion = useReducedMotion()
  const [cooldown, setCooldown] = React.useState(0)
  const [verified, setVerified] = React.useState(false)

  React.useEffect(() => {
    if (!state.email) {
      router.replace('/signup')
    }
  }, [state.email, router])

  React.useEffect(() => {
    const timer = setTimeout(() => setVerified(true), MOCK_VERIFY_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  React.useEffect(() => {
    if (!verified) return
    dispatch({ type: 'EMAIL_VERIFIED' })
    const timer = setTimeout(() => router.push('/onboarding/store'), 700)
    return () => clearTimeout(timer)
  }, [verified, dispatch, router])

  React.useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  return (
    <motion.div
      variants={stepVariants(reduceMotion)}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center gap-6 text-center"
    >
      <AnimatePresence mode="wait">
        {verified ? (
          <motion.div
            key="verified"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex size-14 items-center justify-center rounded-full bg-[var(--accent-green-soft)] text-[var(--accent-green-ink)]"
          >
            <Check className="size-6" />
          </motion.div>
        ) : (
          <motion.div
            key="pending"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground"
          >
            <Mail className="size-6" />
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-[26px] font-bold tracking-[-0.025em] text-foreground">
          {verified ? 'Verified' : 'Check your email'}
        </h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          {verified ? 'Taking you to setup...' : (
            <>we sent a link to <span className="text-foreground">{state.email}</span>.</>
          )}
        </p>
      </div>

      {!verified && (
        <button
          type="button"
          disabled={cooldown > 0}
          onClick={() => setCooldown(RESEND_COOLDOWN)}
          className="interactive-link text-[14px] font-medium text-foreground disabled:pointer-events-none disabled:text-muted-foreground"
        >
          {cooldown > 0 ? `Resend available in ${cooldown}s` : 'Resend email'}
        </button>
      )}
    </motion.div>
  )
}
