import { Reveal } from '@/components/reveal'

const STEPS = [
  {
    n: '01',
    title: 'Map your policy once',
    body: 'We turn your real returns and refund rules into a decision tree — thresholds, exceptions, VIP overrides. Setup takes a working session, not a quarter.',
  },
  {
    n: '02',
    title: 'Route every decision through it',
    body: 'Connect your ecommerce store and helpdesk. Every ticket and return is checked against your logic, surfaced inside the reply your agent is already writing — no separate tab to open.',
  },
  {
    n: '03',
    title: 'Own and log the edge cases',
    body: 'Every exception gets an assigned owner and a nudge. Deviations are logged with a reason. Within two weeks, your CX lead stops being the final word on everything — and you stop getting pulled in.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl rounded-[2.5rem] border border-border bg-secondary/60 px-6 py-16 sm:px-12">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">How it works</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Your policy, embedded in your workflow. Live in days.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 100}>
              <div className="relative">
                <span className="font-mono text-sm font-medium text-accent">{step.n}</span>
                <div className="mt-4 h-px w-full bg-border" />
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
