'use client'

import { useWaitlist } from './waitlist-context'

const FOOTER_LINKS = [
  {
    heading: 'Product',
    links: [
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Features', href: '#features' },
      { label: 'Results', href: '#results' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    heading: 'Get started',
    links: [
      { label: 'Book a walkthrough', href: 'https://calendar.app.google/L2M8WNnoBo3ufACb7' },
      { label: 'Join waitlist', href: '#waitlist' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  },
]

export function SiteFooter() {
  const { openWaitlist } = useWaitlist()
  return (
    <footer className="border-t border-border px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <a href="#top" className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="size-3 rounded-full bg-accent" />
              </span>
              <span className="text-lg font-semibold tracking-tight">rezlv</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The decision layer for returns and CX exceptions. Built for ecommerce and DTC
              brands that want the right call to happen by default.
            </p>
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold text-foreground">{col.heading}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.label === 'Join waitlist' ? (
                      <button
                        onClick={openWaitlist}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        target={link.label === 'Book a walkthrough' ? '_blank' : undefined}
                        rel={link.label === 'Book a walkthrough' ? 'noopener noreferrer' : undefined}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} rezlv. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made for the messy middle of commerce.
          </p>
        </div>
      </div>
    </footer>
  )
}
