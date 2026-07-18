'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { OriginButton } from '@/components/ui/origin-button'
import { useOnboarding } from '@/lib/onboarding/mock-store'
import { staggerContainer, staggerItem } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

function CheckmarkDrawOn({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <motion.circle
        cx="32"
        cy="32"
        r="30"
        stroke="var(--accent-green-ink)"
        strokeWidth="2"
        fill="var(--accent-green-soft)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.2 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d="M20 33L28 41L44 24"
        stroke="var(--accent-green-ink)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduceMotion ? 0.2 : 0.4, delay: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  )
}

export default function LivePage() {
  const router = useRouter()
  const { state, dispatch } = useOnboarding()
  const reduceMotion = useReducedMotion()

  function goToDashboard() {
    dispatch({ type: 'ONBOARDING_COMPLETE' })
    router.push('/dashboard')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative flex w-full max-w-md flex-col items-center gap-6 text-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-20 -z-10 opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--accent-green), transparent 70%)' }}
      />
      <CheckmarkDrawOn reduceMotion={reduceMotion} />

      <div>
        <h1 className="text-[32px] font-bold tracking-[-0.03em] text-foreground">You&apos;re live.</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          Rezlv is now watching{' '}
          <span className="text-foreground">{state.storeDomain ?? 'your store'}</span> for delivery exceptions.
        </p>
      </div>

      <motion.div
        variants={staggerContainer(reduceMotion, 0.1)}
        initial="initial"
        animate="animate"
        className="grid w-full grid-cols-3 gap-3"
      >
        <motion.div variants={staggerItem(reduceMotion)}>
          <StatPlaceholder value="0" label="Exceptions detected" />
        </motion.div>
        <motion.div variants={staggerItem(reduceMotion)}>
          <StatPlaceholder
            value={String(state.carriers.filter((c) => c.state === 'connected').length)}
            label="Carriers connected"
          />
        </motion.div>
        <motion.div variants={staggerItem(reduceMotion)}>
          <StatPlaceholder value="—" label="Avg. resolution time" />
        </motion.div>
      </motion.div>

      <OriginButton onClick={goToDashboard} className="w-full">
        Go to dashboard
      </OriginButton>
    </motion.div>
  )
}

function StatPlaceholder({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg bg-card px-2 py-3 shadow-[var(--shadow-sm)]">
      <span className="text-[20px] font-bold tracking-[-0.02em] text-foreground">{value}</span>
      <span className="text-center text-[11px] leading-tight text-muted-foreground">{label}</span>
    </div>
  )
}
