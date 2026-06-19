import { Reveal } from '@/components/reveal'

const PROBLEMS = [
  {
    stat: 'Two agents,',
    line: 'two different answers to the same ticket.',
    body: 'New hires guess from old tickets. Veterans improvise. The same return gets approved on Monday and denied on Friday — and the customer always notices.',
  },
  {
    stat: 'Nobody owns',
    line: 'the exception.',
    body: 'Edge cases get tossed into Slack. Your CX lead becomes the final word on everything. Decisions stall, things fall through cracks, and founders get pulled back in.',
  },
  {
    stat: 'Your AI agent',
    line: "is making promises you wouldn't approve.",
    body: "Unconstrained bots offer refunds, extensions, and exceptions your policy doesn't cover. One off-policy reply becomes a public, expensive problem.",
  },
  {
    stat: 'Your best CX person',
    line: 'just put in their two weeks.',
    body: "Half of what they know was never documented. The rest lives in Slack threads and muscle memory. Now you're onboarding a replacement into a system that only existed in someone's head.",
  },
]

export function ProblemSection() {
  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">The messy middle</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            You&apos;ve bought the tools. The ownership gaps are still there.
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Past $500K and 7+ people, founder proximity breaks. Teams add helpdesk macros, Notion SOPs,
            Slack pins &mdash; and still end up inconsistent. You have SOPs. Nobody follows them the same way.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map((item, i) => (
            <Reveal key={item.line} delay={i * 100}>
              <div className="h-full rounded-3xl border border-border bg-card p-7">
                <h3 className="text-2xl font-semibold leading-tight tracking-tight">
                  {item.stat}
                  <br />
                  <span className="text-muted-foreground">{item.line}</span>
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
