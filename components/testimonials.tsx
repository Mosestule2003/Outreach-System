import { Reveal } from '@/components/reveal'
import { FileWarning, MessageSquareOff, UserMinus } from 'lucide-react'

const COMPLAINTS = [
  {
    icon: <UserMinus className="size-5 text-accent" />,
    complaint:
      "Every time a new rep starts, I spend weeks reviewing their refund calls. They guess, they get it wrong, and I have to clean it up.",
    theme: 'The onboarding bottleneck',
  },
  {
    icon: <MessageSquareOff className="size-5 text-accent" />,
    complaint:
      "We had a customer blast us on Twitter because one agent denied a return and another approved it for the exact same issue.",
    theme: 'The consistency crisis',
  },
  {
    icon: <FileWarning className="size-5 text-accent" />,
    complaint:
      "Our policy lives in a Google Doc that nobody reads during a live ticket. It's too disconnected from the actual reply box.",
    theme: 'The disconnected policy',
  },
]

export function Testimonials() {
  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">The origin</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Shaped by 70+ documented complaints from CX leads and founders.
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
            We didn&apos;t invent the problem. We just listened to operators who were tired of being the final word on every edge case.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {COMPLAINTS.map((item, i) => (
            <Reveal key={item.theme} delay={i * 100}>
              <figure className="flex h-full flex-col rounded-3xl border border-border bg-card p-7">
                <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-secondary">
                  {item.icon}
                </div>
                <blockquote className="text-pretty text-base leading-relaxed text-foreground">
                  &ldquo;{item.complaint}&rdquo;
                </blockquote>
                <figcaption className="mt-auto pt-6">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {item.theme}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
