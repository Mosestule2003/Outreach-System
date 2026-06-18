'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useWaitlist } from './waitlist-context'

const NAV = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Results', href: '#results' },
  { label: 'FAQ', href: '#faq' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { openWaitlist } = useWaitlist()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <div
        className={cn(
          'flex w-full max-w-6xl items-center justify-between rounded-full border border-transparent px-4 py-2.5 transition-all duration-500',
          scrolled
            ? 'border-border/60 bg-background/80 shadow-sm backdrop-blur-xl'
            : 'bg-transparent',
        )}
      >
        <a href="#top" className="flex items-center gap-2 pl-1">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="size-3 rounded-full bg-accent" />
          </span>
          <span className="text-lg font-semibold tracking-tight">rezlv</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={openWaitlist}
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Join waitlist
          </button>
          <a
            href="https://calendar.app.google/L2M8WNnoBo3ufACb7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
          >
            Book a walkthrough
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-9 items-center justify-center rounded-full text-foreground md:hidden"
          >
            <span className="relative flex h-3 w-4 flex-col justify-between">
              <span className={cn('h-0.5 w-full bg-current transition-transform', open && 'translate-y-[5px] rotate-45')} />
              <span className={cn('h-0.5 w-full bg-current transition-opacity', open && 'opacity-0')} />
              <span className={cn('h-0.5 w-full bg-current transition-transform', open && '-translate-y-[5px] -rotate-45')} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute inset-x-4 top-[72px] rounded-3xl border border-border/60 bg-background/95 p-3 shadow-lg backdrop-blur-xl md:hidden">
          <nav className="flex flex-col">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => {
                setOpen(false)
                openWaitlist()
              }}
              className="text-left rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              Join waitlist
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
