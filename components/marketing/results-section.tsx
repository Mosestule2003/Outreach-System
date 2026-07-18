import { Reveal } from '@/components/marketing/reveal'
import { AnimatedCounter } from '@/components/ui/animated-counter'

const COMPARISONS = [
  { before: 'An agent notices the exception, eventually.', after: 'Rezlv opens a case within minutes of the carrier scan.' },
  { before: 'Someone calls or emails the customer manually.', after: 'A text goes out automatically, with a one-tap fix-it link.' },
  { before: 'The fix gets typed into the carrier portal by hand.', after: 'The correction arrives pre-filled, ready for one click.' },
  { before: 'Nobody knows how many exceptions turned into returns.', after: 'Every resolution and every dollar saved is logged per order.' },
]

const STATS = [
  { value: '40-60%', label: 'of failed first-attempt deliveries become costly returns', source: 'Industry NDR/RTO benchmarks' },
  { value: '15-30%', label: 'of all CS tickets are delivery exceptions or WISMO calls', source: 'G2 / Trustpilot research' },
  { value: '$21-40', label: 'average reverse-logistics cost per returned package', source: 'Carrier rate data' },
]

export function ResultsSection() {
  return (
    <section id="results" className="scroll-mt-16 px-4 py-20 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal variant="blur" className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            The cost of a delivery exception, in numbers.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-[1.4fr_1fr] sm:grid-rows-2">
          {STATS.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 80}
              variant="scale"
              className={i === 0 ? 'sm:row-span-2' : ''}
            >
              <div
                className={`interactive-card flex h-full flex-col justify-center p-6 ${
                  i === 0 ? 'bento-card-featured sm:p-8' : 'bento-card hover:shadow-[var(--shadow-md)]'
                }`}
              >
                <p className={i === 0 ? 'text-5xl font-semibold tracking-tight sm:text-6xl' : 'text-4xl font-semibold tracking-tight'}>
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="mt-3 text-sm leading-snug text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-xs text-muted-foreground/60">{stat.source}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} variant="scale" className="mx-auto mt-16 max-w-4xl">
          <div className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-sm)]">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-border bg-muted/40">
              <div className="px-6 py-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">Without Rezlv</span>
              </div>
              <div className="flex h-full items-center px-2">
                <div className="h-8 w-px bg-border" />
              </div>
              <div className="px-6 py-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-foreground">With Rezlv</span>
              </div>
            </div>

            {COMPARISONS.map((item, i) => (
              <div
                key={item.before}
                className={`grid grid-cols-[1fr_auto_1fr] items-center ${i < COMPARISONS.length - 1 ? 'border-b border-border' : ''}`}
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
