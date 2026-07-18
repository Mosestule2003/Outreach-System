import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type HighlightColor = 'amber' | 'blue' | 'green'

const COLOR_CLASS: Record<HighlightColor, string> = {
  amber: 'marker-amber',
  blue: 'marker-blue',
  green: 'marker-green',
}

export function Highlight({
  children,
  color = 'amber',
  className,
}: {
  children: ReactNode
  color?: HighlightColor
  className?: string
}) {
  return (
    <span className={cn('marker', COLOR_CLASS[color], className)}>{children}</span>
  )
}
