'use client'

import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { WaitlistButton } from './waitlist-button'
import { trackEvent } from '@/lib/analytics'
import { OriginButton } from '@/components/ui/origin-button'
import { useWaitlist } from './waitlist-context'
import Image from 'next/image'

export function Hero() {
  const { openWaitlist } = useWaitlist()

  return (
    <section id="top" className="relative overflow-hidden px-4 pt-32 sm:pt-40">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <WaitlistButton
            source="hero_badge"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground shadow-[var(--shadow-sm)] transition-colors hover:text-foreground"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-foreground opacity-30" />
              <span className="relative inline-flex size-1.5 rounded-full bg-foreground" />
            </span>
            DECISION VERSION CONTROL FOR ECOMMERCE · PRIVATE BETA
          </WaitlistButton>
        </Reveal>

        <Reveal delay={80} variant="blur">
          <h1 className="mt-6 text-balance text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            Version control for every operational decision your team makes.
          </h1>
        </Reveal>

        <Reveal delay={160} variant="fade">
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            rezlv captures how decisions are actually made — across returns, escalations, refunds, and disputes — then turns them into searchable, governed organizational knowledge.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <OriginButton
              onClick={() => {
                trackEvent('waitlist_open', { source: 'hero_cta' })
                openWaitlist()
              }}
              className="h-12 rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground"
            >
              Request early access
              <ArrowRight className="size-4" />
            </OriginButton>
            <a
              href="#how-it-works"
              onClick={() => trackEvent('hero_scroll_cta_click')}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-medium text-foreground transition-all duration-300 hover:bg-muted hover:scale-[1.02] active:scale-[0.98]"
            >
              See how it works
            </a>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <p className="mt-4 text-sm text-muted-foreground">
            For scaling ecommerce brands at the $500K–$2M stage where tribal knowledge starts breaking.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            No credit card · 20-minute walkthrough · Founder-priced for early brands
          </p>
        </Reveal>
      </div>

      <Reveal delay={200} variant="scale" className="mx-auto mt-16 max-w-5xl">
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-x-6 -bottom-6 -top-2 -z-10 rounded-[2.5rem] bg-gradient-to-b from-muted/40 to-transparent"
          />
          <div className="relative mx-auto mt-20 max-w-5xl animate-float overflow-hidden rounded-2xl border border-border/60 bg-card p-2 shadow-[var(--shadow-xl)] sm:p-4">
            <div className="overflow-hidden rounded-xl border border-border/50 bg-background">
              <HeroDashboard />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

const NAV_ITEMS = [
  { label: 'Overview', active: true, icon: 'grid' },
  { label: 'Decisions', active: false, icon: 'git' },
  { label: 'Policies', active: false, icon: 'shield' },
  { label: 'Team', active: false, icon: 'users' },
  { label: 'Integrations', active: false, icon: 'plug' },
  { label: 'Settings', active: false, icon: 'gear' },
]

const ESCALATION_BARS = [
  { month: 'Jun', h: 85 },
  { month: 'Jul', h: 70 },
  { month: 'Aug', h: 55 },
  { month: 'Sep', h: 40 },
  { month: 'Oct', h: 28 },
  { month: 'Nov', h: 18 },
  { month: 'Dec', h: 10 },
]

const DECISIONS_TABLE = [
  { id: 'DEC-4821', type: 'Return Request', agent: 'Sarah L.', date: 'Jan 14, 2:34 pm', policy: 'VIP Override', status: 'Approved', statusColor: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-400/10' },
  { id: 'DEC-4820', type: 'Refund Escalation', agent: 'Marcus T.', date: 'Jan 14, 1:12 pm', policy: '30-Day Window', status: 'Escalated', statusColor: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-400/10' },
  { id: 'DEC-4819', type: 'Exchange Denied', agent: 'Priya K.', date: 'Jan 14, 11:48 am', policy: 'Final Sale', status: 'Denied', statusColor: 'text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-400/10' },
  { id: 'DEC-4818', type: 'Partial Refund', agent: 'Sarah L.', date: 'Jan 13, 4:55 pm', policy: 'Goodwill Credit', status: 'Approved', statusColor: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-400/10' },
]

const TOP_POLICIES = [
  { name: 'VIP Return Override', uses: 142, trend: '+12%' },
  { name: '30-Day Return Window', uses: 98, trend: '+3%' },
  { name: 'Goodwill Credit Policy', uses: 67, trend: '-8%' },
]

function NavIcon({ type }: { type: string }) {
  const c = 'text-current'
  switch (type) {
    case 'grid':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={c}>
          <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )
    case 'git':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={c}>
          <circle cx="7" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="4" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="10" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M7 4.5V7L4 9.5M7 7l3 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )
    case 'shield':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={c}>
          <path d="M7 1L2 3.5V6.5C2 9.5 4 12 7 13c3-1 5-3.5 5-6.5V3.5L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M5 7l1.5 1.5L9 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'users':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={c}>
          <circle cx="5" cy="4" r="2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M1 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="10" cy="4.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M10.5 8c1.4.4 2.5 1.7 2.5 3.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )
    case 'plug':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={c}>
          <path d="M5 1v3M9 1v3M3 5h8v2a4 4 0 01-8 0V5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 11v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )
    case 'gear':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={c}>
          <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.75 2.75l1.06 1.06M10.19 10.19l1.06 1.06M11.25 2.75l-1.06 1.06M3.81 10.19l-1.06 1.06" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )
    default:
      return null
  }
}

function HeroDashboard() {
  return (
    <div className="relative w-full select-none font-sans text-foreground">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-border bg-muted/60 px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="size-[10px] rounded-full bg-red-400/70 dark:bg-red-400/50" />
          <div className="size-[10px] rounded-full bg-amber-400/70 dark:bg-amber-400/50" />
          <div className="size-[10px] rounded-full bg-emerald-400/70 dark:bg-emerald-400/50" />
        </div>
        <div className="mx-auto flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1 text-[11px] text-muted-foreground">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1a4 4 0 100 8 4 4 0 000-8z" stroke="currentColor" strokeWidth="1" />
            <path d="M5 3v2l1.2 1.2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
          app.rezlv.io/dashboard
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-4 rounded border border-border" />
          <div className="size-4 rounded border border-border" />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden w-[180px] shrink-0 border-r border-border bg-muted/30 p-3 md:block">
          <div className="mb-5 flex items-center gap-2 px-2">
            <div className="flex size-6 items-center justify-center rounded-lg bg-foreground">
              <div className="size-2.5 rounded-full bg-background" />
            </div>
            <span className="text-[13px] font-bold tracking-tight">rezlv</span>
          </div>

          <nav className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12px] font-medium transition-colors ${
                  item.active
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <NavIcon type={item.icon} />
                {item.label}
              </div>
            ))}
          </nav>

          {/* Sidebar bottom upgrade */}
          <div className="mt-6 rounded-xl bg-foreground p-3.5 text-background">
            <p className="text-[11px] font-bold">Upgrade Pro</p>
            <p className="mt-0.5 text-[9px] leading-tight text-background/50">
              Unlock advanced governance, audit exports, and custom workflows.
            </p>
            <div className="mt-2.5 rounded-md bg-background px-2.5 py-1.5 text-center text-[10px] font-bold text-foreground">
              Upgrade Now
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 bg-background p-4 sm:p-5">
          {/* Header bar */}
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold sm:text-lg">Welcome back, Cooper</h2>
              <p className="text-[11px] text-muted-foreground">Here&apos;s your decision operations overview</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-[11px] text-muted-foreground sm:flex">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M8 8l2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Search...
                <span className="ml-3 rounded border border-border bg-background px-1 py-0.5 text-[9px] font-bold text-muted-foreground/60">⌘K</span>
              </div>
              <div className="flex size-7 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                CV
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {[
              { label: 'On-Policy Rate', value: '97.2%', sub: '+3.1% from last month', icon: 'shield', highlight: true },
              { label: 'Total Decisions', value: '2,847', sub: '+118% from last month', icon: 'git', highlight: false },
              { label: 'Avg. Resolution', value: '1.8 hrs', sub: '-24% from last month', icon: 'clock', highlight: false },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl border p-4 ${
                  stat.highlight
                    ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/40 dark:bg-emerald-900/10'
                    : 'border-border bg-card'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{stat.label}</span>
                  <div className="flex size-6 items-center justify-center rounded-md border border-border bg-muted/40">
                    {stat.icon === 'shield' && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L2 3v2.5C2 8 3.5 10.5 6 11.5 8.5 10.5 10 8 10 5.5V3L6 1z" stroke="currentColor" strokeWidth="1" /></svg>
                    )}
                    {stat.icon === 'git' && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="2.5" r="1.2" stroke="currentColor" strokeWidth="1" /><circle cx="3.5" cy="9.5" r="1.2" stroke="currentColor" strokeWidth="1" /><circle cx="8.5" cy="9.5" r="1.2" stroke="currentColor" strokeWidth="1" /><path d="M6 3.7V6L3.5 8.3M6 6l2.5 2.3" stroke="currentColor" strokeWidth="1" /></svg>
                    )}
                    {stat.icon === 'clock' && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1" /><path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>
                    )}
                  </div>
                </div>
                <p className="text-xl font-bold tracking-tight sm:text-2xl">{stat.value}</p>
                <p className="mt-0.5 text-[10px] text-emerald-600 dark:text-emerald-400">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Charts + Top policies row */}
          <div className="mb-4 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
            {/* Escalation chart */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-semibold">Escalations Over Time</span>
                  <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                    <span className="inline-block size-1.5 rounded-full bg-foreground" /> This period
                    <span className="ml-1 inline-block size-1.5 rounded-full bg-muted-foreground/30" /> Last period
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">•••</span>
              </div>
              {/* Y-axis labels + bars */}
              <div className="flex gap-2">
                <div className="flex h-[100px] flex-col justify-between text-right text-[9px] text-muted-foreground">
                  <span>80</span>
                  <span>60</span>
                  <span>40</span>
                  <span>20</span>
                  <span>0</span>
                </div>
                <div className="relative flex flex-1 items-end gap-2">
                  {/* Grid lines */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-px w-full bg-border" />
                    ))}
                  </div>
                  {ESCALATION_BARS.map((bar, i) => (
                    <div key={bar.month} className="relative z-10 flex flex-1 flex-col items-center gap-1">
                      <div className="flex w-full items-end justify-center gap-0.5" style={{ height: 100 }}>
                        <div
                          className="w-2.5 rounded-t-sm bg-muted-foreground/20"
                          style={{ height: `${bar.h + 15}%` }}
                        />
                        <div
                          className={`w-2.5 rounded-t-sm ${i === ESCALATION_BARS.length - 1 ? 'bg-foreground' : 'bg-foreground/60'}`}
                          style={{ height: `${bar.h}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-muted-foreground">{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top policies used */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[12px] font-semibold">Top Active Policies</span>
                <span className="text-[10px] font-medium text-muted-foreground">See All</span>
              </div>
              <div className="flex flex-col gap-3">
                {TOP_POLICIES.map((policy, i) => (
                  <div key={policy.name} className="flex items-center gap-3">
                    <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${i === 0 ? 'bg-foreground text-background' : 'bg-muted'}`}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1L2 3.5V6.5C2 9.5 4 12 7 13c3-1 5-3.5 5-6.5V3.5L7 1z" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold">{policy.name}</p>
                      <p className="text-[10px] text-muted-foreground">{policy.uses} decisions</p>
                    </div>
                    <div className="text-right">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{policy.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Decisions table */}
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-[12px] font-semibold">Latest Decisions</span>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1 rounded-md border border-border px-2 py-1">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 2h8M3 5h4M4.5 8h1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>
                  Filter
                </span>
                <span className="flex items-center gap-1 rounded-md border border-border px-2 py-1">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1h3v3H1zM6 1h3v3H6zM1 6h3v3H1zM6 6h3v3H6z" stroke="currentColor" strokeWidth="0.8" /></svg>
                  Export
                </span>
              </div>
            </div>

            {/* Table header */}
            <div className="hidden grid-cols-[1fr_1.2fr_0.8fr_1fr_0.8fr_0.6fr] gap-2 border-b border-border px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:grid">
              <span>Decision ID</span>
              <span>Type</span>
              <span>Agent</span>
              <span>Date</span>
              <span>Policy</span>
              <span>Status</span>
            </div>

            {/* Table rows */}
            {DECISIONS_TABLE.map((row) => (
              <div key={row.id} className="grid grid-cols-[1fr_1fr] gap-2 border-b border-border px-4 py-2.5 last:border-0 sm:grid-cols-[1fr_1.2fr_0.8fr_1fr_0.8fr_0.6fr]">
                <span className="text-[11px] font-medium">{row.id}</span>
                <span className="text-[11px] text-muted-foreground">{row.type}</span>
                <span className="hidden text-[11px] text-muted-foreground sm:block">{row.agent}</span>
                <span className="hidden text-[11px] text-muted-foreground sm:block">{row.date}</span>
                <span className="hidden text-[11px] text-muted-foreground sm:block">{row.policy}</span>
                <span className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${row.statusColor}`}>{row.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
