'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type OAuthButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode
  loading?: boolean
}

export const OAuthButton = React.forwardRef<HTMLButtonElement, OAuthButtonProps>(
  ({ icon, loading = false, disabled, children, className, type = 'button', ...props }, ref) => {
    const isDisabled = Boolean(disabled || loading)
    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cn(
          'inline-flex h-11 w-full cursor-pointer select-none items-center justify-center gap-2.5 rounded-full',
          'border border-border bg-card text-[14px] font-medium text-foreground',
          'transition-all duration-200 ease-out hover:bg-secondary',
          'active:scale-[0.99]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {loading ? (
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          icon
        )}
        {children}
      </button>
    )
  },
)
OAuthButton.displayName = 'OAuthButton'
