'use client'

import { useWaitlist } from './waitlist-context'
import { cn } from '@/lib/utils'
import { ReactNode, ButtonHTMLAttributes } from 'react'

interface WaitlistButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
}

export function WaitlistButton({ children = 'Join waitlist', className, ...props }: WaitlistButtonProps) {
  const { openWaitlist } = useWaitlist()

  return (
    <button
      onClick={openWaitlist}
      className={cn('', className)}
      {...props}
    >
      {children}
    </button>
  )
}
