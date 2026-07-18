import { Reveal } from '@/components/marketing/reveal'

export function OriginStory() {
  return (
    <section className="px-4 py-20 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Reveal variant="blur">
          <div className="rounded-xl bg-card p-8 shadow-[var(--shadow-sm)] sm:p-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Why this exists
            </p>
            <blockquote className="mt-5 text-balance text-xl font-medium leading-relaxed tracking-[-0.02em] sm:text-2xl">
              &ldquo;A package I ordered got marked as a delivery exception and just sat there. No
              text, no call, nothing. I had to find the tracking number myself and wait on hold
              with the carrier to fix a problem their own system already knew about.&rdquo;
            </blockquote>
            <p className="mt-6 text-muted-foreground">
              That happens to a $40 order and it is annoying. It happens to a Shopify brand's
              orders thousands of times a month, and it is a line item. Rezlv is the fix I wanted
              to exist: the carrier already knows something is wrong, so something should already
              be fixing it.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
                MK
              </div>
              <div>
                <p className="text-sm font-semibold">Moses Kpughur-Tule</p>
                <p className="text-xs text-muted-foreground">Founder, Rezlv</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
