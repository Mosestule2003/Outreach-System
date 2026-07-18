'use client'

import { motion } from 'framer-motion'
import { ProgressStepBar } from '@/components/ui/progress-step-bar'
import { stepVariants, type StepTone } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const STEP_LABELS = ['Store', 'Carrier', 'Test']

const TONE_GLOW: Record<StepTone, string> = {
  amber: 'var(--accent-amber)',
  blue: 'var(--accent-blue)',
  green: 'var(--accent-green)',
}

export function OnboardingCard({
  step,
  total = 3,
  tone,
  children,
}: {
  step: number
  total?: number
  tone?: StepTone
  children: React.ReactNode
}) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative w-full max-w-[480px]">
      {tone && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-20 -z-10 opacity-40 blur-3xl"
          style={{ background: `radial-gradient(circle, ${TONE_GLOW[tone]}, transparent 70%)` }}
        />
      )}
      <motion.div
        variants={stepVariants(reduceMotion)}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full rounded-xl bg-card p-8 shadow-[var(--shadow-xl)]"
      >
        <ProgressStepBar step={step} total={total} labels={STEP_LABELS.slice(0, total)} className="mb-8" />
        {children}
      </motion.div>
    </div>
  )
}
