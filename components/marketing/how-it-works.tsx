import { Reveal } from '@/components/marketing/reveal'

const STEPS = [
  {
    n: '1',
    title: 'Exception detected, case opened',
    body: 'A carrier or Shopify event fires. Rezlv opens a case and starts tracking it toward resolution before your CS team even knows it happened.',
  },
  {
    n: '2',
    title: 'SMS goes out first',
    body: 'One text, one secure link. No account to create, no app to download.',
  },
  {
    n: '3',
    title: 'No reply? Email follows.',
    body: 'Still inside the carrier’s window before the package returns to sender, Rezlv escalates to email automatically.',
  },
  {
    n: '4',
    title: 'Still nothing? An AI agent calls.',
    body: 'Last attempt before the RTO deadline: an AI voice agent calls the customer directly to collect their fix. It is still their decision — the agent is just reaching them, not deciding for them.',
  },
  {
    n: '5',
    title: 'Your team gets the fix, ready to send',
    body: 'The correction is packaged exactly as your carrier needs it — Canada Post, Intelcom, UPS Canada, and 4 more — and handed to you as a one-click confirm. No retyping, no digging through a carrier portal. You stay the final check.',
  },
  {
    n: '6',
    title: 'Case closed, receipt logged',
    body: 'Order saved, RTO prevented, dollar amount attached, every escalation step timestamped. Every time it happens.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 px-4 py-20 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal variant="blur" className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            One resolution loop. Six steps. Zero tickets.
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Your customer never has to call the carrier. A fully agentic escalation ladder — SMS,
            then email, then an AI voice call — keeps trying until someone answers, all before the
            carrier’s return-to-sender deadline.
          </p>
        </Reveal>

        <div className="relative mt-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 90}>
                <div className="relative">
                  <span className="relative z-10 flex size-10 items-center justify-center rounded-full bg-card font-mono text-sm font-bold shadow-[var(--shadow-sm)]">
                    {step.n}
                  </span>
                  <h3 className="mt-4 text-base font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
