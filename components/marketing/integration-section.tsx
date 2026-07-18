import Image from 'next/image'
import { Reveal } from '@/components/marketing/reveal'
import { Check, X } from 'lucide-react'

const COMPARISON = [
  { name: 'Narvar', domain: 'narvar.com', notifies: true, selfServe: false, assembly: false, pricing: 'Enterprise SaaS' },
  { name: 'AfterShip', domain: 'aftership.com', notifies: true, selfServe: false, assembly: false, pricing: 'Enterprise SaaS' },
  { name: 'parcelLab', domain: 'parcellab.com', notifies: true, selfServe: false, assembly: false, pricing: 'Enterprise SaaS' },
  { name: 'ClickPost', domain: 'clickpost.ai', notifies: true, selfServe: false, assembly: false, pricing: 'Enterprise SaaS' },
  { name: '"Carriers handle it"', domain: '', notifies: false, selfServe: false, assembly: false, pricing: 'Hidden Ops Cost' },
  { name: 'Rezlv', domain: '', notifies: true, selfServe: true, assembly: true, pricing: 'Per Resolved Case', highlight: true },
]

function Cell({ ok }: { ok: boolean }) {
  return ok ? (
    <Check className="mx-auto size-5 text-[#E33B76]" strokeWidth={3} />
  ) : (
    <X className="mx-auto size-5 text-zinc-300 dark:text-zinc-700" strokeWidth={2} />
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
      <div className="mx-auto max-w-7xl">
        <Reveal variant="blur" className="mx-auto max-w-3xl text-center">
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

        <Reveal delay={100} className="mx-auto mt-14 max-w-5xl overflow-x-auto pb-4">
          <div className="min-w-[900px] overflow-hidden rounded-[16px] bg-white border border-zinc-200 shadow-sm dark:bg-zinc-950 dark:border-zinc-800">
            <div className="grid grid-cols-[1.5fr_1fr_1.2fr_1.2fr_1.2fr] border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
              <div className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">Platform</div>
              <div className="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">Notifies Customer</div>
              <div className="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">Self-Serve Fix</div>
              <div className="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">Carrier Assembly</div>
              <div className="px-6 py-5 text-right text-[11px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">Pricing Model</div>
            </div>
            {COMPARISON.map((row, idx) => (
              <div
                key={row.name}
                className={`grid grid-cols-[1.5fr_1fr_1.2fr_1.2fr_1.2fr] items-center ${idx !== COMPARISON.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800/60' : ''} ${row.highlight ? 'bg-[#FDF2F7] dark:bg-pink-950/20' : 'bg-white dark:bg-zinc-950'} hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors`}
              >
                <div className={`px-6 py-5 text-[16px] flex items-center gap-3 ${row.highlight ? 'font-black text-zinc-950 dark:text-white text-lg' : 'font-extrabold text-zinc-700 dark:text-zinc-200'}`}>
                  {row.domain && (
                    <div className="size-6 overflow-hidden rounded-md bg-white border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center justify-center shrink-0">
                      <Image 
                        src={`https://logo.clearbit.com/${row.domain}`} 
                        alt={row.name} 
                        width={24} 
                        height={24} 
                        className="object-contain p-0.5"
                        unoptimized
                      />
                    </div>
                  )}
                  {row.highlight && !row.domain && (
                    <div className="size-6 rounded-md bg-[#E33B76] shrink-0 flex items-center justify-center">
                      <span className="text-white text-[10px] font-black">R</span>
                    </div>
                  )}
                  {!row.domain && !row.highlight && (
                    <div className="size-6 shrink-0" />
                  )}
                  {row.name}
                </div>
                <div className="px-6 py-5"><Cell ok={row.notifies} /></div>
                <div className="px-6 py-5"><Cell ok={row.selfServe} /></div>
                <div className="px-6 py-5"><Cell ok={row.assembly} /></div>
                <div className={`px-6 py-5 text-right text-[13px] ${row.highlight ? 'font-black text-[#E33B76]' : 'font-semibold text-zinc-500'}`}>
                  {row.pricing}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-zinc-400">
            &ldquo;Customer self-serve fix&rdquo; means the customer&apos;s own input (address, window, pickup
            choice) is what gets prepared for submission. &ldquo;Carrier Assembly&rdquo; means a ready-to-submit correction packet is generated.
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
