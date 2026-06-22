'use client'

import { Reveal } from '@/components/reveal'
import { AnimatedCounter } from '@/components/ui/animated-counter'

const COMPARISONS = [
  { before: 'Knowledge lives in people\'s heads.', after: 'Every decision becomes organizational knowledge.' },
  { before: 'Agents ask managers repeatedly.', after: 'Agents resolve cases consistently using precedent.' },
  { before: 'Similar cases receive different outcomes.', after: 'Similar cases handled the same way, by default.' },
  { before: 'Policies drift without anyone noticing.', after: 'Policy evolution is tracked, visible, and governed.' },
  { before: 'When employees leave, knowledge leaves.', after: 'Institutional memory persists regardless of headcount.' },
  { before: 'Managers approve the same edge case repeatedly.', after: 'Approved precedents auto-surface — no re-escalation.' },
]

const STATS = [
  { value: '~42%', label: 'of a veteran\'s work can\'t be covered when they leave', source: 'Tallyfy' },
  { value: '$50K/yr', label: 'lost to knowledge gaps for a 10-person team', source: 'IDC' },
  { value: '~60%', label: 'of what a new hire needs is documented — they guess the rest', source: 'Industry average' },
]

export function ResultsSection() {
  return (
    <section id="results" className="scroll-mt-24 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal variant="blur" className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">What changes</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Before and after the decision layer.
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
            rezlv turns company decision-making into a searchable, version-controlled system of record.
          </p>
        </Reveal>

        {/* Stats */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80} variant="scale">
              <div className="h-full rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-sm)] transition-all duration-300 hover:shadow-[var(--shadow-md)]">
                <p className="text-4xl font-semibold tracking-tight"><AnimatedCounter value={stat.value} /></p>
                <p className="mt-3 text-sm leading-snug text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-xs text-muted-foreground/60">{stat.source}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Comparison table */}
        <Reveal delay={200} variant="scale" className="mx-auto mt-16 max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-sm)]">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-border bg-muted/40">
              <div className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-muted-foreground/50">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M5 5l4 4M9 5l-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Without rezlv</span>
                </div>
              </div>
              <div className="flex h-full items-center px-2">
                <div className="h-8 w-px bg-border" />
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-foreground">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M4.5 7l2 2L9.5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground">With rezlv</span>
                </div>
              </div>
            </div>

            {/* Table rows */}
            {COMPARISONS.map((item, i) => (
              <div
                key={item.before}
                className={`grid grid-cols-[1fr_auto_1fr] items-center transition-colors hover:bg-muted/20 ${
                  i < COMPARISONS.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="px-6 py-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.before}</p>
                </div>
                <div className="flex h-full items-center px-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-muted-foreground/30">
                    <path d="M4 8h8M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="px-6 py-4">
                  <p className="text-sm font-medium leading-relaxed text-foreground">{item.after}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
