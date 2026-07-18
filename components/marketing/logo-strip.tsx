import Image from 'next/image'

const LOGOS = [
  { name: 'Canada Post', src: '/logos/Canada Post.jpg' },
  { name: 'UPS', src: '/logos/UPS.png' },
  { name: 'Intelcom', src: '/logos/Intercom.png' },
  { name: 'Purolator', src: '/logos/Purulator.png' },
  { name: 'Canpar', src: '/logos/Canpar.png' },
  { name: 'Loomis', src: '/logos/Loomis Express.png' },
  { name: 'FedEx', src: '/logos/fedex-color.svg' },
]

export function LogoStrip() {
  return (
    <section aria-label="Carrier infrastructure" className="px-4 pb-16 sm:pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee flex w-max shrink-0 items-center gap-x-12">
            {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
              <div key={`${logo.name}-${i}`} className="flex h-20 items-center justify-center shrink-0 group cursor-pointer bg-white rounded-xl px-2 dark:bg-white">
                <Image 
                  src={logo.src} 
                  alt={logo.name} 
                  width={180} 
                  height={56} 
                  className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

