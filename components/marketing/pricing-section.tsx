import { Check, Mail, BarChart3, ShieldAlert, Sparkles, Inbox } from 'lucide-react'
import { Reveal } from '@/components/marketing/reveal'
import { WaitlistButton } from './waitlist-button'

// Using icons mapped to the features for the new UI
const INCLUDED = [
  { text: 'SMS + email + AI voice escalation ladder', icon: Mail },
  { text: 'Ready-to-submit carrier corrections', icon: ShieldAlert },
  { text: 'Merchant dashboard + full audit trail', icon: BarChart3 },
]

const RATE_TIERS = [
  {
    range: '1–100',
    label: 'cases',
    price: '$8.00',
    note: 'Your first tier — most brands start here.',
    highlight: false,
  },
  {
    range: '101–500',
    label: 'cases',
    price: '$5.00',
    note: 'Kicks in automatically once you cross 100 resolved cases.',
    highlight: true,
  },
  {
    range: '501+',
    label: 'cases',
    price: '$3.00',
    note: 'Volume rate for high-growth brands.',
    highlight: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-16 px-4 py-24 sm:py-32 bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl">
        
        {/* Header - Left Aligned */}
        <Reveal className="max-w-2xl text-left">
          <h2 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
            Priced against what a return actually costs you.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
            You only pay when Rezlv actually resolves something — never a flat subscription fee.
            One graduated rate, three volume tiers.
          </p>
        </Reveal>

        {/* Pricing Cards Grid */}
        <div className="mx-auto mt-16 grid gap-6 sm:grid-cols-3 items-stretch">
          {RATE_TIERS.map((tier, i) => (
            <Reveal key={tier.range} delay={i * 90} className="h-full flex">
              <div className="flex h-full w-full flex-col rounded-[24px] border border-zinc-200 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-950">
                
                {/* Top Half (Gray) */}
                <div className="flex flex-col bg-zinc-50/80 p-8 border-b border-zinc-100 dark:bg-zinc-900/40 dark:border-zinc-800/60">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                      {tier.range} <span className="text-base font-normal text-zinc-500">{tier.label}</span>
                    </h3>
                    {tier.highlight && (
                      <span className="px-2.5 py-1 rounded-full bg-blue-100/80 text-[10px] font-bold uppercase tracking-widest text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        Most common
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">{tier.price}</span>
                    <span className="text-sm font-medium text-zinc-500">/case</span>
                  </div>
                  
                  <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 min-h-[40px]">
                    {tier.note}
                  </p>

                  <WaitlistButton
                    source={`pricing_${tier.range}`}
                    className={`mt-8 flex h-10 w-full items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                      tier.highlight
                        ? 'bg-zinc-900 text-white shadow-md hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white'
                        : 'bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800'
                    }`}
                  >
                    Get early access
                  </WaitlistButton>
                </div>

                {/* Bottom Half (White) - Features */}
                <div className="flex-1 bg-white p-8 dark:bg-zinc-950">
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-6">
                    Key Features:
                  </p>
                  <ul className="flex flex-col gap-4">
                    {INCLUDED.map((item, idx) => {
                      const Icon = item.icon
                      return (
                        <li key={idx} className="flex items-start gap-3">
                          <Icon className="size-4 shrink-0 mt-0.5 text-zinc-400 dark:text-zinc-500" />
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 border-b border-dotted border-zinc-300 dark:border-zinc-700 pb-0.5">
                            {item.text}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
                
              </div>
            </Reveal>
          ))}
        </div>


      </div>
    </section>
  )
}
