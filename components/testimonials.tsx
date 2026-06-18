import { Reveal } from '@/components/reveal'
import { TestimonialsIllustration } from './illustrations'

export function Testimonials() {
  return (
    <section className="bg-muted/30 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Early feedback</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            What founders building with us are saying.
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
            We&apos;re in private beta with a small cohort of ecommerce brands helping shape the product.
            Here&apos;s what they&apos;re telling us.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-16">
          <TestimonialsIllustration />
        </Reveal>
      </div>
    </section>
  )
}
