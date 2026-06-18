import Image from 'next/image'
import { Reveal } from '@/components/reveal'

const FEATURES = [
  {
    eyebrow: 'Decision logic, in the flow',
    title: 'Your policy, surfaced at the moment of action.',
    body: 'A brand-specific decision tree — refund vs. replace vs. deny, damaged vs. remorse, VIP overrides — appears right inside the agent’s reply. Not a doc they have to remember to open.',
    image: '/feature-decision-tree.png',
    alt: 'A returns decision tree showing branches for damaged, buyer remorse, and VIP customers leading to refund, replace, or deny outcomes',
  },
  {
    eyebrow: 'Enforced ownership',
    title: 'Every exception gets an owner and a reason.',
    body: 'Off-policy decisions are auto-assigned to an owner with a nudge, and every deviation is logged with the why behind it. Accountability — not another wiki nobody reads.',
    image: '/feature-ownership-log.png',
    alt: 'A deviation log listing decision owners, outcomes, timestamps, and reason tags with one row assigned an owner',
  },
  {
    eyebrow: 'Human-in-the-loop replies',
    title: 'On-policy drafts your team approves in one click.',
    body: 'rezlv drafts the customer reply constrained to your policy and voice. A human clicks approve or edits. By design, it can’t promise outcomes you’d never honor.',
    image: '/feature-reply-draft.png',
    alt: 'An AI-drafted customer reply constrained to brand voice with approve and edit controls and an on-brand badge',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">What rezlv does</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            One workflow. The right call, every time.
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            A ticket or return comes in, your decision logic is applied, the exception
            gets an owner, and the deviation is logged. That&apos;s the whole loop.
          </p>
        </Reveal>

        <div className="mt-16 flex flex-col gap-20 sm:gap-28">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title}>
              <div
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                  i % 2 === 1 ? 'lg:[&>div:first-child]:order-2' : ''
                }`}
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {feature.eyebrow}
                  </p>
                  <h3 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                    {feature.title}
                  </h3>
                  <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                </div>

                <div className="overflow-hidden rounded-3xl border border-border bg-muted/40 p-3 shadow-[0_30px_80px_-40px_oklch(0.16_0_0_/_0.3)]">
                  <Image
                    src={feature.image || '/placeholder.svg'}
                    alt={feature.alt}
                    width={1200}
                    height={900}
                    className="h-auto w-full rounded-2xl"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
