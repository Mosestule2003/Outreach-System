import Image from 'next/image'

const LOGOS = [
  { name: 'Shopify', src: '/logos/shopify-color.svg' },
  { name: 'Canada Post', src: '/logos/canadapost.jpg' },
  { name: 'UPS Canada', src: '/logos/ups-color.svg' },
  { name: 'Intelcom', src: '/logos/intelcom.svg' },
  { name: 'Purolator', src: '/logos/purolator.svg' },
  { name: 'Canpar Express', src: '/logos/canpar.svg' },
  { name: 'Loomis Express', src: '/logos/loomis.svg' },
  { name: 'FedEx Canada', src: '/logos/fedex-color.svg' },
  { name: 'Twilio', src: '/logos/twilio.svg' },
  { name: 'EasyPost', src: '/logos/easypost.svg' },
]

export function LogoStrip() {
  return (
    <section aria-label="Built on Shopify and carrier infrastructure" className="px-4 pb-16 sm:pb-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Built on Shopify and Canada&apos;s major carrier networks
        </p>
        <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee flex w-max shrink-0 items-center gap-x-16">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <div key={`${logo.name}-${i}`} className="flex shrink-0 items-center group cursor-pointer">
                <Image 
                  src={logo.src} 
                  alt={logo.name} 
                  width={140} 
                  height={40} 
                  className="h-9 w-auto object-contain sm:h-10 grayscale opacity-45 dark:opacity-30 dark:invert hover:grayscale-0 hover:opacity-100 dark:hover:invert-0 transition-all duration-350" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

