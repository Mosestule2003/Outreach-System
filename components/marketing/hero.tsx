'use client'

import { ChevronRight } from 'lucide-react'
import { Reveal } from '@/components/marketing/reveal'
import { WaitlistButton } from './waitlist-button'
import { trackEvent } from '@/lib/analytics'
import { Highlight } from '@/components/ui/highlight'
import { cn } from '@/lib/utils'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-20 pt-32 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,var(--accent-amber-soft),transparent_60%)] dark:bg-[linear-gradient(to_bottom,rgba(22,163,74,0.05),transparent_60%)]" />
      <div className="mx-auto max-w-4xl text-center">
        <Reveal delay={80} variant="blur">
          <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Your delivery exceptions,{' '}
            <Highlight color="amber">resolved before they become returns.</Highlight>
          </h1>
        </Reveal>

        <Reveal delay={160} variant="fade">
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Rezlv detects failed deliveries, contacts your customer, and prepares the fix for your
            carrier — a one-click confirm, not a support ticket.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <WaitlistButton
              source="hero_cta"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow-[var(--shadow-button)] transition-all hover:bg-[var(--graphite)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Get early access
            </WaitlistButton>
            <a
              href="https://cal.com/rezlv-official/15min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('book_demo_click', { location: 'hero' })}
              className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full border border-border bg-card px-8 text-sm font-medium text-foreground transition-all hover:bg-muted hover:scale-[1.02] active:scale-[0.98]"
            >
              <ChevronRight className="size-4" />
              Book a demo
            </a>
          </div>
        </Reveal>
      </div>

      <Reveal delay={220} variant="scale" className="mx-auto mt-20 max-w-6xl relative z-10">
        <div className="absolute -inset-x-6 -inset-y-4 -z-10 rounded-[2.5rem] bg-gradient-to-b from-muted/50 to-transparent dark:from-muted/20" />
        <div className="absolute inset-x-20 -top-10 -z-10 h-32 rounded-full bg-[var(--accent-amber-glow)] opacity-20 blur-3xl dark:opacity-10" />
        <div className="interactive-card overflow-hidden rounded-xl border border-border/50 bg-card p-2 shadow-[var(--shadow-xl)] sm:p-4">
          <div className="overflow-hidden rounded-lg border border-border/30 bg-background shadow-inner">
            <HeroDashboard />
          </div>
        </div>
      </Reveal>
    </section>
  )
}

const NAV_GROUPS = [
  {
    label: null,
    items: [{ label: 'Home', active: false, icon: 'home' }],
  },
  {
    label: 'Resolution',
    items: [
      { label: 'Exceptions', active: true, icon: 'alert' },
      { label: 'Customers', active: false, icon: 'users' },
      { label: 'Carriers', active: false, icon: 'truck' },
    ],
  },
  {
    label: 'Reporting',
    items: [
      { label: 'Analytics', active: false, icon: 'grid' },
      { label: 'Integrations', active: false, icon: 'plug' },
      { label: 'Settings', active: false, icon: 'gear' },
    ],
  },
]

const FILTER_TABS = ['All', 'Active', 'Resolved']

const STATUS_DOT: Record<string, string> = {
  Resolved: 'var(--accent-green-ink)',
  'Customer responded': 'var(--accent-blue-ink)',
  'SMS sent': 'var(--accent-amber-ink)',
}

const STATUS_STYLE: Record<string, string> = {
  Resolved: 'text-[var(--accent-green-ink)] bg-[var(--accent-green-soft)]',
  'Customer responded': 'text-[var(--accent-blue-ink)] bg-[var(--accent-blue-soft)]',
  'SMS sent': 'text-[var(--accent-amber-ink)] bg-[var(--accent-amber-soft)]',
}

const RESOLUTION_BARS = [
  { month: 'Jun', h: 38 },
  { month: 'Jul', h: 47 },
  { month: 'Aug', h: 52 },
  { month: 'Sep', h: 61 },
  { month: 'Oct', h: 68 },
  { month: 'Nov', h: 74 },
  { month: 'Dec', h: 79 },
]

const EXCEPTION_QUEUE = [
  { id: '#10482', initials: 'MO', customer: 'M. Okafor', carrier: 'Canada Post', type: 'Address issue', status: 'Resolved', caught: '2 min' },
  { id: '#10481', initials: 'JW', customer: 'J. Whitfield', carrier: 'Intelcom', type: 'Failed attempt', status: 'Customer responded', caught: '4 min' },
  { id: '#10480', initials: 'RD', customer: 'R. Delgado', carrier: 'UPS Canada', type: 'Access issue', status: 'SMS sent', caught: '1 min' },
  { id: '#10479', initials: 'SY', customer: 'S. Yoon', carrier: 'Purolator', type: 'Address issue', status: 'Resolved', caught: '6 min' },
]

function NavIcon({ type }: { type: string }) {
  switch (type) {
    case 'alert':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1.5L1 12h12L7 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M7 5.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="7" cy="10.5" r="0.6" fill="currentColor" />
        </svg>
      )
    case 'users':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="5" cy="4" r="2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M1 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="10" cy="4.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M10.5 8c1.4.4 2.5 1.7 2.5 3.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )
    case 'truck':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="4" width="7" height="6" rx="0.6" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8 6h2.5L13 8.5V10h-5V6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <circle cx="4" cy="11" r="1.1" stroke="currentColor" strokeWidth="1.1" />
          <circle cx="10.5" cy="11" r="1.1" stroke="currentColor" strokeWidth="1.1" />
        </svg>
      )
    case 'grid':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )
    case 'gear':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.75 2.75l1.06 1.06M10.19 10.19l1.06 1.06M11.25 2.75l-1.06 1.06M3.81 10.19l-1.06 1.06" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )
    case 'home':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 6.5L7 2l5 4.5V12a1 1 0 01-1 1H3a1 1 0 01-1-1V6.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M5.5 13V8.5h3V13" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      )
    case 'plug':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 1.5v3M9 1.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M3.5 4.5h7V7a3.5 3.5 0 01-3.5 3.5A3.5 3.5 0 013.5 7V4.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M7 10.5V13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )
    default:
      return null
  }
}

function BellIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3.5 5.5a3.5 3.5 0 017 0v2.3l1 1.7H2.5l1-1.7V5.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M5.7 11c.2.6.7 1 1.3 1s1.1-.4 1.3-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
      <path d="M1.5 2.5h11L8.5 7.5v4l-3 1.5v-5.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M9 9l3.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function SortIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
      <path d="M4 3v8M4 3L1.5 5.5M4 3l2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11V3M10 11l2.5-2.5M10 11L7.5 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HeroDashboard() {
  return (
    <div className="relative w-full select-none font-sans text-foreground">
      <div className="flex items-center gap-2 border-b border-border bg-background px-4 py-3 sm:px-5">
        <span className="text-[13px] font-bold tracking-tight">rezlv</span>
        <span className="text-[12px] text-muted-foreground">/</span>
        <span className="text-[12px] text-muted-foreground">Acme Outdoor Co.</span>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-muted-foreground"><BellIcon /></span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://randomuser.me/api/portraits/men/54.jpg"
            alt=""
            className="size-6 rounded-full object-cover"
          />
        </div>
      </div>

      <div className="flex">
        <div className="hidden w-[180px] shrink-0 flex-col justify-between border-r border-border bg-background p-3 md:flex">
          <nav className="flex flex-col gap-3.5">
            {NAV_GROUPS.map((group, gi) => (
              <div key={gi}>
                {group.label && (
                  <p className="mb-1 px-2.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    {group.label}
                  </p>
                )}
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-[12px] font-medium ${
                        item.active ? 'bg-muted text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      <NavIcon type={item.icon} />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex-1 bg-background p-4 sm:p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold sm:text-lg">Exceptions</h2>
              <p className="text-[11px] text-muted-foreground">Delivery exception status and resolution details</p>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="rounded-[6px] border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground">
                Export
              </span>
              <span className="rounded-[6px] bg-foreground px-2.5 py-1.5 text-[11px] font-medium text-background">
                New case
              </span>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {[
              { label: 'Auto-resolution rate', value: '71.4%', sub: '+8.2pts vs last month', hi: true },
              { label: 'RTOs prevented (30d)', value: '$8,240', sub: '212 orders saved', hi: false },
              { label: 'Avg. time to resolve', value: '47 min', sub: '-1.6 hrs vs manual', hi: false },
            ].map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  'rounded-lg border p-4',
                  stat.hi ? 'border-transparent' : 'border-border bg-card',
                )}
                style={stat.hi ? { backgroundColor: 'var(--accent-green-soft)' } : undefined}
              >
                <span className="text-[11px] text-muted-foreground">{stat.label}</span>
                <p className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">{stat.value}</p>
                <p className="mt-0.5 text-[10px]" style={stat.hi ? { color: 'var(--accent-green-ink)' } : undefined}>{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="mb-4 rounded-lg border border-border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[12px] font-semibold">Resolution rate over time</span>
              <span className="text-[10px] text-muted-foreground">Last 7 months</span>
            </div>
            <div className="flex gap-2">
              <div className="flex h-[90px] flex-col justify-between text-right text-[9px] text-muted-foreground">
                <span>80</span>
                <span>40</span>
                <span>0</span>
              </div>
              <div className="relative flex flex-1 items-end gap-2">
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-px w-full bg-border" />
                  ))}
                </div>
                {RESOLUTION_BARS.map((bar, i) => (
                  <div key={bar.month} className="relative z-10 flex flex-1 flex-col items-center gap-1">
                    <div className="flex w-full items-end justify-center" style={{ height: 90 }}>
                      <div
                        className="w-4 rounded-t-[2px]"
                        style={{
                          height: `${bar.h}%`,
                          backgroundColor: i === RESOLUTION_BARS.length - 1 ? 'var(--accent-green)' : 'var(--muted-foreground)',
                          opacity: i === RESOLUTION_BARS.length - 1 ? 1 : 0.25,
                        }}
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground">{bar.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
              <div className="flex items-center gap-1 rounded-[6px] bg-muted p-0.5">
                {FILTER_TABS.map((tab, i) => (
                  <span
                    key={tab}
                    className={`rounded-[5px] px-2.5 py-1 text-[10px] font-medium ${
                      i === 0 ? 'bg-card text-foreground shadow-[var(--shadow-sm)]' : 'text-muted-foreground'
                    }`}
                  >
                    {tab}
                  </span>
                ))}
                <span className="ml-1 flex items-center gap-1 rounded-[5px] px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                  <FilterIcon />
                  Filters
                </span>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <span className="flex items-center gap-1.5 rounded-[6px] border border-border bg-background px-2.5 py-1 text-[10px] text-muted-foreground">
                  <SearchIcon />
                  Search
                </span>
                <span className="flex items-center gap-1.5 rounded-[6px] border border-border bg-background px-2.5 py-1 text-[10px] text-muted-foreground">
                  <SortIcon />
                  Sort order
                </span>
              </div>
            </div>
            <div className="grid grid-cols-[20px_1.2fr_0.7fr_1.2fr_1fr_0.7fr] items-center gap-2 border-b border-border px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              <span className="size-3 rounded-[3px] border border-border" />
              <span>Customer</span>
              <span>Carrier</span>
              <span>Exception</span>
              <span>Status</span>
              <span>Caught in</span>
            </div>
            {EXCEPTION_QUEUE.map((row) => (
              <div key={row.id} className="grid grid-cols-[20px_1.2fr_0.7fr_1.2fr_1fr_0.7fr] items-center gap-2 border-b border-border px-4 py-2.5">
                <span className="size-3 rounded-[3px] border border-border" />
                <span className="flex items-center gap-2">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[8px] font-semibold text-muted-foreground">
                    {row.initials}
                  </span>
                  <span className="text-[11px] font-medium">{row.customer}</span>
                </span>
                <span className="text-[11px] text-muted-foreground">{row.carrier}</span>
                <span className="text-[11px] text-muted-foreground">{row.type}</span>
                <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLE[row.status] ?? ''}`}>
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: STATUS_DOT[row.status] }} />
                  {row.status}
                </span>
                <span className="text-[11px] text-muted-foreground">{row.caught}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-2.5 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-2">
                1-4 of 14 &middot; Results per page
                <span className="flex items-center gap-1 rounded-[4px] border border-border px-1.5 py-0.5">4 ▾</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="flex size-5 items-center justify-center rounded-[4px] border border-border">‹</span>
                <span className="font-medium text-foreground">1/4</span>
                <span className="flex size-5 items-center justify-center rounded-[4px] border border-border">›</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
