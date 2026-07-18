'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ProgressStepBar } from '@/components/ui/progress-step-bar'
import { TestExceptionDemo } from '@/components/onboarding/test-exception-demo'
import { useOnboarding } from '@/lib/onboarding/mock-store'
import { stepVariants } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export default function TestExceptionPage() {
  const router = useRouter()
  const { dispatch } = useOnboarding()
  const reduceMotion = useReducedMotion()

  function complete() {
    dispatch({ type: 'TEST_EXCEPTION_COMPLETE' })
    router.push('/onboarding/live')
  }

  return (
    <motion.div
      variants={stepVariants(reduceMotion)}
      initial="initial"
      animate="animate"
      className="flex w-full max-w-5xl flex-col items-center gap-8"
    >
      <ProgressStepBar step={3} total={3} labels={['Store', 'Carrier', 'Test']} className="max-w-[480px]" />

      <div className="text-center">
        <h1 className="text-[26px] font-bold tracking-[-0.025em] text-foreground">See it work</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          We&apos;ll simulate a failed delivery — you can even fill in the customer&apos;s side.
        </p>
      </div>

      <TestExceptionDemo onComplete={complete} />

      <div className="flex w-full justify-end">
        <button
          type="button"
          onClick={complete}
          className="text-[13px] text-muted-foreground underline-offset-2 hover:underline"
        >
          Skip demo
        </button>
      </div>
    </motion.div>
  )
}
