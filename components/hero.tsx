'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { useWaitlist } from './waitlist-context'

export function Hero() {
  const { openWaitlist } = useWaitlist()
  return (
    <section id="top" className="relative overflow-hidden px-4 pt-32 sm:pt-40">
      {/* soft background wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,oklch(0.7_0.16_158_/_0.10),transparent_70%)]"
      />

      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <button
            onClick={openWaitlist}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground shadow-sm transition-colors hover:text-foreground"
          >
            <span className="flex size-1.5 rounded-full bg-accent" />
            FOR SHOPIFY &amp; DTC BRANDS · NOW IN PRIVATE BETA
          </button>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-6 text-balance text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            Everyone handles customers
            <br />
            <span className="text-muted-foreground">the way you would.</span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Your team shouldn&apos;t have to guess what to do when an order goes wrong. rezlv is the decision layer for returns and CX exceptions that puts your brand&apos;s policy inside every reply.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="https://calendar.app.google/L2M8WNnoBo3ufACb7"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
            >
              Book a walkthrough
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              See how it works
            </a>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <p className="mt-5 text-xs text-muted-foreground">
            No credit card · 20-minute walkthrough · Design-partner pricing
          </p>
        </Reveal>
      </div>

      {/* hero illustration */}
      <Reveal delay={200} className="mx-auto mt-16 max-w-5xl">
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-x-6 -bottom-6 -top-2 -z-10 rounded-[2.5rem] bg-gradient-to-b from-muted/60 to-transparent"
          />
          <div className="animate-float overflow-hidden rounded-3xl border border-border bg-card shadow-[0_40px_120px_-30px_oklch(0.16_0_0_/_0.25)]">
            <Image
              src="/hero-decision-mockup.png"
              alt="rezlv reply composer showing a recommended decision and policy clause in a support ticket"
              width={1600}
              height={1000}
              priority
              className="h-auto w-full"
            />
          </div>


        </div>
      </Reveal>
    </section>
  )
}
