import Image from 'next/image'
import { Reveal } from '@/components/marketing/reveal'
import { Check, X } from 'lucide-react'

const COMPARISON = [
  { name: 'Narvar', notifies: true, selfServe: false, color: '#2B2B2B' },
  { name: 'AfterShip', notifies: true, selfServe: false, color: '#1B47FF' },
  { name: 'parcelLab', notifies: true, selfServe: false, color: '#4B286D' },
  { name: 'ClickPost', notifies: true, selfServe: false, color: '#1877F2' },
  { name: '"Carriers handle it"', notifies: false, selfServe: false, color: '#9CA3AF' },
  { name: 'Rezlv', notifies: true, selfServe: true, highlight: true },
]

function Cell({ ok }: { ok: boolean }) {
  return ok ? (
    <Check className="mx-auto size-5 text-[#E33B76]" strokeWidth={2.5} />
  ) : (
    <X className="mx-auto size-5 text-zinc-300 dark:text-zinc-700" strokeWidth={1.5} />
  )
}

const STACK_TILES = [
  { name: 'Shopify', src: '/logos/shopify-color.svg' },
  { name: 'Canada Post', src: '/logos/canadapost.jpg' },
  { name: 'UPS Canada', src: '/logos/ups-color.svg' },
  { name: 'Intelcom', src: '/logos/intelcom.svg' },
  { name: 'Purolator', src: '/logos/purolator.svg' },
  { name: 'Canpar Express', src: '/logos/canpar.svg' },
  { name: 'Loomis Express', src: '/logos/loomis.svg' },
  { name: 'FedEx Canada', src: '/logos/fedex-color.svg' },
]

export function IntegrationSection() {
  return (
    <section className="px-4 py-20 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal variant="blur" className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Everybody notifies. Few let the customer decide the fix.
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Most platforms in this category run their own automated outreach and feed carrier
            systems on the back end. Rezlv&apos;s difference is narrower and more specific: your
            customer submits the exact correction, and that input is exactly what gets packaged
            and handed to your team to send — not an ops team guessing, not an automation
            deciding on their behalf.
          </p>
        </Reveal>

        <Reveal delay={100} className="mx-auto mt-14 max-w-2xl">
          <div className="overflow-hidden rounded-[16px] bg-white border border-zinc-100 shadow-sm dark:bg-zinc-950 dark:border-zinc-800">
            <div className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-zinc-100 dark:border-zinc-800 bg-transparent">
              <div className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Platform</div>
              <div className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500">Notifies</div>
              <div className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500">Customer self-serve fix</div>
            </div>
            {COMPARISON.map((row, idx) => (
              <div
                key={row.name}
                className={`grid grid-cols-[1.4fr_1fr_1fr] items-center ${idx !== COMPARISON.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''} ${row.highlight ? 'bg-[#FDF2F7] dark:bg-pink-950/20' : 'bg-white dark:bg-zinc-950'}`}
              >
                <div className={`px-6 py-4 text-[15px] flex items-center ${row.highlight ? 'font-bold text-zinc-900 dark:text-white' : 'font-medium text-zinc-600 dark:text-zinc-300'}`}>
                  {row.color && <span className="mr-3 inline-block size-2.5 rounded-full" style={{ backgroundColor: row.color }} />}
                  {row.name}
                </div>
                <div className="px-6 py-4"><Cell ok={row.notifies} /></div>
                <div className="px-6 py-4"><Cell ok={row.selfServe} /></div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground/70">
            &ldquo;Customer self-serve fix&rdquo; means the customer&apos;s own input (address, window, pickup
            choice) is what gets prepared for submission, not an ops or automation decision made for them.
          </p>
        </Reveal>

        <Reveal delay={200} className="mt-20">
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Works with your stack
          </p>
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {STACK_TILES.map((tile, i) => (
              <Reveal key={tile.name} delay={i * 70} variant="scale">
                <div className="bento-card interactive-card group flex h-full flex-col items-center justify-center gap-3 p-6 hover:shadow-[var(--shadow-md)] cursor-pointer">
                  <Image 
                    src={tile.src} 
                    alt={tile.name} 
                    width={120} 
                    height={36} 
                    className="h-8 w-auto object-contain sm:h-9 grayscale opacity-45 dark:opacity-30 dark:invert group-hover:grayscale-0 group-hover:opacity-100 dark:group-hover:invert-0 transition-all duration-300" 
                  />
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{tile.name}</span>
                </div>
              </Reveal>
            ))}
          </div>

        </Reveal>
      </div>
    </section>
  )
}
