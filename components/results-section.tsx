import { Reveal } from '@/components/reveal'

const STATS = [
  { value: '~60%', label: 'of what a new hire needs to decide correctly', sub: 'is covered by documented process — they guess the other 40% (Industry average)' },
  { value: '~42%', label: 'of a key person\'s work', sub: 'cannot be picked up by remaining team when they leave or go OOO' },
  { value: '70%', label: 'of operational know-how', sub: 'is tribal knowledge — never written down, living in one person\'s head' },
  { value: '$50K/yr', label: 'estimated cost of knowledge gaps', sub: 'for a 10-person team from rework, wrong decisions, and slow onboarding' },
]

export function ResultsSection() {
  return (
    <section id="results" className="scroll-mt-24 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">The reality</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Why your team makes different calls on the same problem.
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
            The problem isn&apos;t effort or intent — it&apos;s that most of how your brand operates
            lives in people&apos;s heads, not in systems. Industry data shows how fast that breaks down.
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
