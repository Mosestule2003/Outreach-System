import { Reveal } from '@/components/reveal'

const STAGES = [
  {
    n: '01',
    title: 'Capture',
    body: 'Every operational decision is recorded automatically from Gorgias, Zendesk, email, Slack, and help desk tools. No manual logging — rezlv captures what actually happens.',
  },
  {
    n: '02',
    title: 'Organize',
    body: 'Decisions are linked to policies, precedents, outcomes, and owners. Every decision becomes a node in your company\'s decision graph — searchable, attributable, and connected.',
  },
  {
    n: '03',
    title: 'Recommend',
    body: 'When a similar situation occurs, rezlv surfaces how the company handled it previously and recommends the most appropriate action based on precedent.',
  },
  {
    n: '04',
    title: 'Govern',
    body: 'Leaders see who is making decisions, where deviations occur, and how policies evolve over time. Decision drift becomes visible before it becomes a problem.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-muted/40 px-6 py-16 sm:px-12">
        <Reveal variant="blur" className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">How it works</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            From scattered knowledge to executable decisions.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STAGES.map((stage, i) => (
            <Reveal key={stage.n} delay={i * 100}>
              <div className="interactive-card group relative h-full rounded-xl border border-border/60 bg-card p-6 hover:border-foreground/10 hover:shadow-[var(--shadow-md)]">
                <span className="inline-flex size-8 items-center justify-center rounded-lg bg-foreground font-mono text-xs font-bold text-background">
                  {stage.n}
                </span>
                <h3 className="mt-4 text-xl font-semibold tracking-tight">{stage.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{stage.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
