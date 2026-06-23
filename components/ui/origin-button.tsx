'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type OriginButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
}

const OriginButton = React.forwardRef<HTMLButtonElement, OriginButtonProps>(
  ({ children, className, disabled = false, loading = false, type = 'button', ...props }, ref) => {
    const isDisabled = Boolean(disabled || loading)

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cn(
          'relative inline-flex h-12 cursor-pointer select-none items-center justify-center overflow-hidden rounded-xl px-8 text-[15px] font-medium tracking-[-0.02em]',
          'border-[0.5px] border-border bg-card text-card-foreground',
          'transition-all duration-300 ease-out',
          'hover:bg-foreground hover:text-background hover:scale-[1.02] hover:shadow-lg',
          'active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
        {...props}
      >
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    )
  },
)
OriginButton.displayName = 'OriginButton'

export { OriginButton }
export type { OriginButtonProps }
