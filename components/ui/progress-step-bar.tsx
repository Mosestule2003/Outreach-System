'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressStepBarProps {
  step: number // 1-indexed, current step
  total: number
  labels?: string[]
  className?: string
}

export function ProgressStepBar({ step, total, labels, className }: ProgressStepBarProps) {
  return (
    <div className={cn('flex w-full items-center', className)}>
      {Array.from({ length: total }, (_, i) => i + 1).map((n, i) => {
        const isDone = n < step
        const isCurrent = n === step
        return (
          <div key={n} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.08 : 1,
                  backgroundColor: isDone || isCurrent ? 'var(--foreground)' : 'transparent',
                  borderColor: isDone || isCurrent ? 'var(--foreground)' : 'var(--border)',
                }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  'flex size-7 items-center justify-center rounded-full border-[1.5px] text-[12px] font-semibold',
                  isDone || isCurrent ? 'text-background' : 'text-muted-foreground',
                )}
              >
                {isDone ? <Check className="size-3.5" /> : n}
              </motion.div>
              {labels?.[i] && (
                <span
                  className={cn(
                    'hidden font-heading text-[11px] font-medium sm:block',
                    isCurrent ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {labels[i]}
                </span>
              )}
            </div>
            {n < total && (
              <div className="mx-2 h-[1.5px] flex-1 overflow-hidden rounded-full bg-border">
                <motion.div
                  className="h-full bg-foreground"
                  initial={false}
                  animate={{ width: isDone ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
