'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Check, Info, X } from 'lucide-react'
import { useToast, type ToastTone } from '@/lib/toast/toast-store'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const TONE_ICON: Record<ToastTone, React.ReactNode> = {
  success: <Check className="size-4" />,
  error: <AlertCircle className="size-4" />,
  info: <Info className="size-4" />,
}

const TONE_CLASS: Record<ToastTone, string> = {
  success: 'text-[var(--accent-green-ink)] bg-[var(--accent-green-soft)]',
  error: 'text-destructive bg-destructive/10',
  info: 'text-[var(--accent-blue-ink)] bg-[var(--accent-blue-soft)]',
}

export function ToastHost() {
  const { toasts, dismiss } = useToast()
  const reduceMotion = useReducedMotion()

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2 sm:bottom-6 sm:right-6">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex w-[300px] items-start gap-3 rounded-lg bg-card p-3.5 shadow-[var(--shadow-lg)]"
          >
            <span className={`flex size-6 shrink-0 items-center justify-center rounded-full ${TONE_CLASS[toast.tone]}`}>
              {TONE_ICON[toast.tone]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-foreground">{toast.title}</p>
              {toast.description && <p className="mt-0.5 text-[12px] text-muted-foreground">{toast.description}</p>}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="size-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
