'use client'

import { ReactNode, lazy, Suspense } from 'react'
import { WaitlistProvider } from './marketing/waitlist-context'
import { OnboardingProvider } from '@/lib/onboarding/mock-store'
import { ToastProvider } from '@/lib/toast/toast-store'
import { ToastHost } from '@/components/ui/toast-host'

const WaitlistModal = lazy(() =>
  import('./marketing/waitlist-modal').then((m) => ({ default: m.WaitlistModal }))
)

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WaitlistProvider>
      <OnboardingProvider>
        <ToastProvider>
          {children}
          <Suspense fallback={null}>
            <WaitlistModal />
          </Suspense>
          <ToastHost />
        </ToastProvider>
      </OnboardingProvider>
    </WaitlistProvider>
  )
}
