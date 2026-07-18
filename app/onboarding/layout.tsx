'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { useOnboarding } from '@/lib/onboarding/mock-store'
import { stepIndex, type OnboardingStep } from '@/lib/onboarding/types'

const PATH_TO_STEP: Record<string, OnboardingStep> = {
  '/onboarding/store': 'store',
  '/onboarding/carrier': 'carrier',
  '/onboarding/test': 'test',
  '/onboarding/live': 'live',
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { state } = useOnboarding()

  // Route guard: you can't jump ahead of your current step. Going back to a
  // completed step is allowed (it's not an error, just navigation).
  React.useEffect(() => {
    if (!state.email) {
      router.replace('/signup')
      return
    }
    const requiredStep = PATH_TO_STEP[pathname]
    if (!requiredStep) return
    if (stepIndex(requiredStep) > stepIndex(state.currentStep)) {
      router.replace(`/onboarding/${state.currentStep}`)
    }
  }, [pathname, state.email, state.currentStep, router])

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <Logo size={6} />
          <span className="text-[15px] font-bold tracking-tight">Rezlv</span>
        </Link>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-16">{children}</main>
    </div>
  )
}
