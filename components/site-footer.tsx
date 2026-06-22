'use client'

import { WaitlistButton } from './waitlist-button'
import { trackEvent } from '@/lib/analytics'
import { DashedLine } from '@/components/ui/dashed-line'

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
      { label: 'Request access', href: '#waitlist' },
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

const SOCIALS = [
  {
    label: 'Twitter',
    href: 'https://twitter.com/rezlv',
    icon: (
      <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/rezlv',
    icon: (
      <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <a href="#top" className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background">
                <span className="size-3 rounded-full bg-background" />
              </span>
              <span className="text-lg font-semibold tracking-tight">rezlv</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The decision layer for returns and CX operations. Built for DTC brands scaling past founder-led workflows.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all duration-300 hover:bg-foreground hover:text-background hover:scale-110 hover:border-foreground"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold text-foreground">{col.heading}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.label === 'Request access' ? (
                      <WaitlistButton
                        source="footer"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </WaitlistButton>
                    ) : (
                      <a
                        href={link.href}
                        target={link.label === 'Book a walkthrough' ? '_blank' : undefined}
                        rel={link.label === 'Book a walkthrough' ? 'noopener noreferrer' : undefined}
                        onClick={() => {
                          if (link.label === 'Book a walkthrough') {
                            trackEvent('book_walkthrough_click', { location: 'footer' })
                          } else {
                            trackEvent('footer_nav_click', { label: link.label })
                          }
                        }}
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

        <DashedLine className="my-10" />

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} rezlv. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made for the messy middle of commerce.
          </p>
        </div>
      </div>
    </footer>
  )
}
