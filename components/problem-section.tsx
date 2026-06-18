import { Reveal } from '@/components/reveal'

const PROBLEMS = [
  {
    stat: 'Two agents,',
    line: 'two different refund answers.',
    body: 'New hires guess. Veterans improvise. The same return gets approved on Monday and denied on Friday.',
  },
  {
    stat: 'Nobody owns',
    line: 'the exception.',
    body: 'Edge cases get tossed into Slack, the CX lead becomes the final word on everything, and decisions stall.',
  },
  {
    stat: 'Off-policy replies',
    line: 'promise what you can’t deliver.',
    body: 'Autonomous bots offer refunds you’d never approve. One bad call becomes a public, expensive problem.',
  },
]

export function ProblemSection() {
  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">The messy middle</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Your returns desk runs on memory and guesswork.
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Between 7 and 15 people, the policy lives in someone&apos;s head. That works
            until the day it doesn&apos;t — and a single inconsistent refund turns into a
            scandal you can&apos;t unsee.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
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
