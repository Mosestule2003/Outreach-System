'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useOnboarding } from '@/lib/onboarding/mock-store'
import { DashboardSidebar } from '@/components/dashboard/sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { state } = useOnboarding()

  React.useEffect(() => {
    if (!state.email) {
      router.replace('/signup')
      return
    }
    if (!state.onboardingComplete) {
      router.replace(`/onboarding/${state.currentStep}`)
    }
  }, [state.email, state.onboardingComplete, state.currentStep, router])

  if (!state.onboardingComplete) return null

  return (
    <div className="flex min-h-svh">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
