'use client'

import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWaitlist } from './waitlist-context'
import { trackEvent } from '@/lib/analytics'
import { WaitlistButton } from './waitlist-button'
import { Logo } from '@/components/ui/logo'

const NAV = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Platform', href: '#platform' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-16 border-b bg-background transition-colors duration-300',
        scrolled ? 'border-border' : 'border-transparent',
      )}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        <a href="#top" className="flex items-center gap-2">
          <Logo size={6} />
          <span className="text-[15px] font-semibold tracking-tight">rezlv</span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => trackEvent('nav_click', { label: item.label, location: 'header' })}
              className="rounded-full px-3.5 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://cal.com/rezlv-official/15min"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('book_demo_click', { location: 'header' })}
            className="hidden items-center gap-1 rounded-full px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-muted sm:inline-flex"
          >
            <ChevronRight className="size-3.5" />
            Book a demo
          </a>
          <WaitlistButton
            source="header"
            className="hidden rounded-md bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground shadow-[var(--shadow-button)] transition-all hover:bg-[var(--graphite)] sm:inline-flex"
          >
            Get early access
          </WaitlistButton>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-9 items-center justify-center text-foreground lg:hidden"
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
        <div className="absolute inset-x-0 top-16 border-b border-border bg-background p-3 lg:hidden">
          <nav className="flex flex-col">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => {
                  setOpen(false)
                  trackEvent('nav_click', { label: item.label, location: 'header_mobile' })
                }}
                className="rounded-full px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {item.label}
              </a>
            ))}
            <WaitlistButton
              source="header_mobile"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full bg-primary px-4 py-3 text-left text-sm font-medium text-primary-foreground shadow-[var(--shadow-button)]"
            >
              Get early access
            </WaitlistButton>
          </nav>
        </div>
      )}
    </header>
  )
}
