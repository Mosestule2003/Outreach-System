import { Reveal } from '@/components/reveal'

const STATS = [
  { value: '~60%', label: 'of what a new hire needs', sub: 'is actually covered by documented process (Industry average)' },
  { value: '3x', label: 'escalation rate', sub: 'for returns compared to standard inquiries' },
  { value: '80%', label: 'of CX leads', sub: 'report being the bottleneck for edge-case approvals' },
  { value: '1 in 4', label: 'refund decisions', sub: 'are made inconsistently across the same team' },
]

export function ResultsSection() {
  return (
    <section id="results" className="scroll-mt-24 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">The reality</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Why returns feel so messy.
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
            Industry data shows why standard wikis and static policies fail at the moment of decision.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div className="h-full rounded-3xl border border-border bg-card p-7">
                <p className="text-5xl font-semibold tracking-tight">{stat.value}</p>
                <p className="mt-4 text-sm font-medium leading-snug text-foreground">{stat.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
