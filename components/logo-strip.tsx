import Image from 'next/image'

const LOGOS = [
  { name: 'Notion', src: '/logos/notion.svg' },
  { name: 'Jira', src: '/logos/jira.svg' },
  { name: 'Retool', src: '/logos/retool.svg' },
  { name: 'Ramp', src: '/logos/ramp.svg' },
  { name: 'Mercury', src: '/logos/mercury.svg' },
  { name: 'Asana', src: '/logos/asana.svg' },
  { name: 'Monday', src: '/logos/monday.svg' },
  { name: 'Drive', src: '/logos/drive.svg' },
]

export function LogoStrip() {
  return (
    <section aria-label="Trusted by modern commerce brands" className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Built to integrate with the tools your team already uses
        </p>
        <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-20">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <div key={`${logo.name}-${i}`} className="flex shrink-0 items-center opacity-70 transition-opacity hover:opacity-100">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={200}
                  height={56}
                  className="h-14 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
