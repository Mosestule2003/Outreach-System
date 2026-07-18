import { Reveal } from '@/components/marketing/reveal'
import { PackageX, Clock3, Ticket, TriangleAlert } from 'lucide-react'

const ROOT_CAUSES = [
  {
    icon: <PackageX className="size-5" />,
    title: 'Carriers do not self-resolve',
    body: 'A carrier marks a package "attempted" and moves on. Nobody gets contacted.',
  },
  {
    icon: <Clock3 className="size-5" />,
    title: 'Manual resolution takes days',
    body: 'What should take 30 seconds takes an agent 2 to 3 days to chase down.',
  },
  {
    icon: <Ticket className="size-5" />,
    title: 'Most tickets are avoidable',
    body: '15 to 30 percent of your CS queue is "where is my order," and none of it needs a human.',
  },
  {
    icon: <TriangleAlert className="size-5" />,
    title: 'Every exception has a price',
    body: 'A failed delivery that becomes a return costs $21 to $40, plus the customer.',
  },
]

export function ProblemSection() {
  return (
    <section className="px-4 py-20 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal variant="blur" className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Shipping software tells you something went wrong. Nothing fixes it.
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            40 to 60 percent of failed deliveries become returns. Not because the fix was hard,
            but because nobody made it in time.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2">
          {ROOT_CAUSES.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className="interactive-card bento-card group h-full p-7 hover:shadow-[var(--shadow-md)]">
                <div className="interactive-icon mb-5 flex size-11 items-center justify-center rounded-full bg-muted text-foreground group-hover:bg-foreground group-hover:text-background">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold leading-snug tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
