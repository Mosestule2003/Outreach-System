'use client'

import { ReactNode, lazy, Suspense } from 'react'
import { WaitlistProvider } from './waitlist-context'

const WaitlistModal = lazy(() =>
  import('./waitlist-modal').then((m) => ({ default: m.WaitlistModal }))
)

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WaitlistProvider>
      {children}
      <Suspense fallback={null}>
        <WaitlistModal />
      </Suspense>
    </WaitlistProvider>
  )
}
