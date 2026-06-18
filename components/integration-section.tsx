import { Reveal } from '@/components/reveal'
import Image from 'next/image'

export function IntegrationSection() {
  return (
    <section id="integration" className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Integration</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Plug into Shopify and Gorgias in minutes.
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
            Connect rezlv with your existing stack, import data, configure rules, and enable real-time syncing seamlessly.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-16">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-border/50 bg-card p-2 shadow-2xl sm:p-4">
            <div className="overflow-hidden rounded-[1.5rem] border border-border/50 bg-background">
              <Image
                src="/integration_workflow.png"
                alt="Step-by-step process of integrating rezlv with Shopify and Gorgias"
                width={2400}
                height={1600}
                className="w-full object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
