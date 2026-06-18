import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { WaitlistButton } from './waitlist-button'

function DemoCard() {
  return (
    <div id="demo" className="scroll-mt-24 flex h-full flex-col justify-between rounded-3xl bg-primary p-8 text-primary-foreground sm:p-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/60">
          Book a walkthrough
        </p>
        <h3 className="mt-4 text-balance text-3xl font-semibold tracking-tight">
          See it working on your actual workflow.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
          A 20-minute call using your real returns and CX scenarios. Founder-priced access
          for the first cohort of brands who help shape the product.
        </p>
      </div>

      <a
        href="https://calendar.app.google/L2M8WNnoBo3ufACb7"
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-8 inline-flex items-center justify-center gap-2 self-start rounded-2xl bg-accent px-6 py-3.5 text-sm font-medium text-accent-foreground transition-transform duration-300 hover:scale-[1.02]"
      >
        Book a 20-min walkthrough
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </a>
    </div>
  )
}

function WaitlistCard() {
  return (
    <div id="waitlist" className="scroll-mt-24 flex h-full flex-col justify-between rounded-3xl border border-border bg-card p-8 sm:p-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Join the waitlist</p>
        <h3 className="mt-4 text-balance text-3xl font-semibold tracking-tight">
          Want to follow along first?
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Join the waitlist for early access, product updates, and the playbook we use to help
          brands make the right call by default — before a costly inconsistency forces the issue.
        </p>
      </div>

      <div className="mt-8">
        <WaitlistButton
          className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.02] sm:w-auto"
        >
          Join waitlist
        </WaitlistButton>
        <p className="mt-4 text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
      </div>
    </div>
  )
}

export function CtaSection() {
  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Stop being the final word on every exception.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Build a system where your team makes the right call by default — without routing everything through you first.
          </p>
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal>
            <DemoCard />
          </Reveal>
          <Reveal delay={120}>
            <WaitlistCard />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
