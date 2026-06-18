const BRANDS = ['Lumière', 'Northpeak', 'Verra', 'Oat & Co', 'Maika', 'Studio Felt', 'Brightwell', 'Kindred']

export function LogoStrip() {
  return (
    <section aria-label="Trusted by modern commerce brands" className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Built with returns &amp; CX leads at fast-growing brands
        </p>
        <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-14">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <span
                key={`${brand}-${i}`}
                className="whitespace-nowrap text-xl font-semibold tracking-tight text-muted-foreground/70"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
