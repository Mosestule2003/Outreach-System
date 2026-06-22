import { Reveal } from '@/components/reveal'
import { GitBranch, Search, Shield, BarChart3, Clock, Zap } from 'lucide-react'

const FEATURES = [
  {
    icon: <GitBranch className="size-5" />,
    title: 'Decision History',
    description: 'Every operational decision is recorded with what was decided, who decided it, why, what policy supported it, and how similar cases were handled previously.',
  },
  {
    icon: <Search className="size-5" />,
    title: 'Precedent Recommendations',
    description: 'Instead of agents escalating every edge case, rezlv surfaces relevant precedents and recommends decisions based on prior company behavior.',
  },
  {
    icon: <Shield className="size-5" />,
    title: 'Policy Governance',
    description: 'Track how policies evolve over time. See when decisions deviate from policy and who approved the deviation.',
  },
  {
    icon: <BarChart3 className="size-5" />,
    title: 'Decision Analytics',
    description: 'Understand your team\'s decision patterns. See consistency rates, escalation trends, and policy adherence across your operation.',
  },
  {
    icon: <Clock className="size-5" />,
    title: 'Audit Trail',
    description: 'Complete, searchable record of every operational decision. Who, what, when, why, and what precedent was referenced.',
  },
  {
    icon: <Zap className="size-5" />,
    title: 'Human-in-the-Loop',
    description: 'rezlv recommends decisions but a human always approves. It can never promise an outcome you wouldn\'t honor.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal variant="blur" className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">The decision layer</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Everything you need to govern operational decisions.
          </h2>
        </Reveal>

        {/* Bento grid */}
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 80}>
              <div className="interactive-card group h-full rounded-2xl border border-border bg-card p-7 hover:border-foreground/10 hover:shadow-[var(--shadow-md)]">
                <div className="interactive-icon mb-4 flex size-10 items-center justify-center rounded-xl border border-border bg-muted text-foreground group-hover:bg-foreground group-hover:text-background">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
