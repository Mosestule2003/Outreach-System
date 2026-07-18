'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}

/** Label above field, inline error below — not floating labels, which hurt scanability on credential forms. */
export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const fieldId = id ?? props.name
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId} className="text-[13px] font-medium text-foreground">
          {label}
        </label>
        <input
          ref={ref}
          id={fieldId}
          className={cn(
            'h-11 rounded-lg border border-border bg-card px-3.5 text-[15px] text-foreground',
            'transition-colors duration-200 ease-out',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            error && 'border-destructive ring-1 ring-destructive',
            className,
          )}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${fieldId}-error`} className="text-[13px] text-destructive">
            {error}
          </p>
        )}
      </div>
    )
  },
)
TextField.displayName = 'TextField'
