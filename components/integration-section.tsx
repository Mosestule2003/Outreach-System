import { Reveal } from '@/components/reveal'
import { IntegrationIllustration } from './illustrations'

export function IntegrationSection() {
  return (
    <section id="integration" className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Integration</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Works inside your store and helpdesk. No new tab required.
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
            rezlv connects to your ecommerce platform and helpdesk via API — pulling customer profiles,
            order history, ticket context, satisfaction scores, and VIP tags into a single decision view
            your agents see at the exact moment they need it. Your stack stays the same. Your decisions get consistent.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-16">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-border/50 bg-card p-2 shadow-2xl sm:p-4">
            <div className="overflow-hidden rounded-[1.5rem] border border-border/50 bg-background">
              <IntegrationIllustration />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
