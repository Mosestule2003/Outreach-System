import { AlertTriangle, Check, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type StatusChipTone = 'connected' | 'validating' | 'error' | 'needs_reauth'

const TONE_STYLES: Record<StatusChipTone, string> = {
  connected: 'bg-[var(--accent-green-soft)] text-[var(--accent-green-ink)]',
  validating: 'bg-muted text-muted-foreground',
  error: 'bg-destructive/10 text-destructive',
  needs_reauth: 'bg-[var(--accent-amber-soft)] text-[var(--accent-amber-ink)]',
}

const TONE_ICON: Record<StatusChipTone, React.ReactNode> = {
  connected: <Check className="size-3.5" />,
  validating: <Loader2 className="size-3.5 animate-spin" />,
  error: <X className="size-3.5" />,
  needs_reauth: <AlertTriangle className="size-3.5" />,
}

const TONE_LABEL: Record<StatusChipTone, string> = {
  connected: 'Connected',
  validating: 'Validating',
  error: 'Error',
  needs_reauth: 'Reconnect needed',
}

export function StatusChip({ tone, label, className }: { tone: StatusChipTone; label?: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        TONE_STYLES[tone],
        className,
      )}
    >
      {TONE_ICON[tone]}
      {label ?? TONE_LABEL[tone]}
    </span>
  )
}
