import { Reveal } from '@/components/reveal'
import { AlertTriangle, Users, TrendingDown, Brain } from 'lucide-react'

const ROOT_CAUSES = [
  {
    icon: <AlertTriangle className="size-5" />,
    title: 'Policies are scattered',
    body: 'Some are in Notion. Some are in Slack. Some are in managers\' heads. There is no single authoritative source at the moment of decision.',
  },
  {
    icon: <Users className="size-5" />,
    title: 'Agents lack context',
    body: 'They don\'t know how similar cases were handled before or who approved past decisions. They don\'t know what precedent exists.',
  },
  {
    icon: <TrendingDown className="size-5" />,
    title: 'Policies drift silently',
    body: 'A manager approves one edge case Monday. Another manager handles it differently Friday. Nobody records why. The policy evolves invisibly.',
  },
  {
    icon: <Brain className="size-5" />,
    title: 'Knowledge is tribal',
    body: 'The best agents know what to do. New ones don\'t. When employees leave, knowledge leaves too. ~42% of a veteran\'s work can\'t be covered by those who remain.',
  },
]

export function ProblemSection() {
  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal variant="blur" className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">The real enemy</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Your real enemy isn&apos;t ticket volume. It&apos;s decision inconsistency.
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Different employees make different decisions for the same situation. Not because they&apos;re
            bad at their jobs — because the system doesn&apos;t give them what they need.
          </p>
        </Reveal>

        <Reveal className="mx-auto mt-10 max-w-2xl text-center">
          <p className="text-base font-medium text-foreground">
            Companies lack a system that captures, standardizes, and applies operational decision-making across the organization.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {ROOT_CAUSES.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className="interactive-card group h-full rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-sm)] hover:border-foreground/10 hover:shadow-[var(--shadow-md)]">
                <div className="interactive-icon mb-4 flex size-10 items-center justify-center rounded-xl border border-border bg-muted text-foreground group-hover:bg-foreground group-hover:text-background">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold leading-tight tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
