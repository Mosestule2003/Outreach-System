'use client'

import { useWaitlist } from './waitlist-context'
import { trackEvent } from '@/lib/analytics'
import { cn } from '@/lib/utils'
import { ReactNode, ButtonHTMLAttributes } from 'react'

interface WaitlistButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  source?: string
}

export function WaitlistButton({ children = 'Join waitlist', className, source = 'unknown', ...props }: WaitlistButtonProps) {
  const { openWaitlist } = useWaitlist()

  const handleClick = () => {
    trackEvent('waitlist_open', { source })
    openWaitlist()
  }

  return (
    <button
      onClick={handleClick}
      className={cn('', className)}
      {...props}
    >
      {children}
    </button>
  )
}
