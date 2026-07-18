import { STATUS_LABEL, STATUS_TONE, type ExceptionStatus } from '@/lib/dashboard/mock-data'
import { cn } from '@/lib/utils'

const TONE_CLASS: Record<string, string> = {
  amber: 'text-[var(--accent-amber-ink)] bg-[var(--accent-amber-soft)]',
  blue: 'text-[var(--accent-blue-ink)] bg-[var(--accent-blue-soft)]',
  green: 'text-[var(--accent-green-ink)] bg-[var(--accent-green-soft)]',
  red: 'text-destructive bg-destructive/10',
}

export function ExceptionStatusBadge({ status, className }: { status: ExceptionStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-medium',
        TONE_CLASS[STATUS_TONE[status]],
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}
