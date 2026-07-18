import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type GrainColor = 'amber' | 'blue' | 'green'

const COLOR_CLASS: Record<GrainColor, string> = {
  amber: 'grain-amber',
  blue: 'grain-blue',
  green: 'grain-green',
}

export function GrainPanel({
  color,
  className,
  children,
}: {
  color: GrainColor
  className?: string
  children?: ReactNode
}) {
  return (
    <div className={cn('grain-panel', COLOR_CLASS[color], className)}>
      {children}
    </div>
  )
}
