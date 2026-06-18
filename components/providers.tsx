'use client'

import { ReactNode } from 'react'
import { WaitlistProvider } from './waitlist-context'
import { WaitlistModal } from './waitlist-modal'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WaitlistProvider>
      {children}
      <WaitlistModal />
    </WaitlistProvider>
  )
}
