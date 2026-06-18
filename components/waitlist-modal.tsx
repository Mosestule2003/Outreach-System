'use client'

import { FormEvent, useState, useEffect } from 'react'
import { Check, X } from 'lucide-react'
import { useWaitlist } from './waitlist-context'

export function WaitlistModal() {
  const { isOpen, closeWaitlist } = useWaitlist()
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWaitlist()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeWaitlist])

  // Reset status when opened
  useEffect(() => {
    if (isOpen) {
      setStatus('idle')
    }
  }, [isOpen])

  if (!isOpen) return null

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (status !== 'idle') return
    setStatus('loading')
    setTimeout(() => setStatus('done'), 900)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Translucent background */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
        onClick={closeWaitlist}
        aria-hidden="true"
      />
      
      {/* Modal content */}
      <div className="relative z-50 w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-2xl sm:p-10 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={closeWaitlist}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Join the waitlist</p>
        <h3 className="mt-4 text-balance text-2xl font-semibold tracking-tight">
          Request early access
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          rezlv is currently in private beta for Shopify & DTC brands. Join the waitlist to get early access.
        </p>

        {status === 'done' ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-border bg-secondary p-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Check className="size-6" />
            </span>
            <p className="mt-2 text-sm text-foreground">You&apos;re on the list. We&apos;ll be in touch soon.</p>
            <button 
              onClick={closeWaitlist}
              className="mt-4 w-full rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
            <input
              required
              type="text"
              placeholder="Your name"
              className="w-full rounded-2xl border border-border bg-background px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
            <input
              required
              type="email"
              placeholder="Work email"
              className="w-full rounded-2xl border border-border bg-background px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
            <input
              required
              type="text"
              placeholder="Company name"
              className="w-full rounded-2xl border border-border bg-background px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
            <input
              required
              type="text"
              placeholder="Store URL (myshop.myshopify.com)"
              className="w-full rounded-2xl border border-border bg-background px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.02] disabled:opacity-70"
            >
              {status === 'loading' ? 'Joining…' : 'Join waitlist'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
