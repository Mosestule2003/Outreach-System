import Image from 'next/image'
import { Reveal } from '@/components/reveal'

const INTEGRATIONS = [
  {
    title: 'Shopify',
    description: 'Order history, customer LTV, purchase data, and return records flow in automatically — giving every decision full context.',
    logo: '/logos/shopify.svg',
    bgColor: 'bg-[#f0fdf4]',
    borderHover: 'hover:border-[#95BF47]/40',
  },
  {
    title: 'Gorgias',
    description: 'Ticket context, agent assignments, CSAT scores, and VIP tags pulled in real-time so decisions are never made blind.',
    logo: '/logos/gorgias.svg',
    bgColor: 'bg-[#f5f5f5]',
    borderHover: 'hover:border-[#1F1F1F]/20',
  },
  {
    title: 'Zendesk',
    description: 'Full ticket history and escalation paths sync seamlessly into the decision layer for complete operational visibility.',
    logo: '/logos/zendesk.svg',
    bgColor: 'bg-[#f0fdfa]',
    borderHover: 'hover:border-[#03363D]/30',
  },
]

const TOOL_LOGOS = [
  { src: '/logos/jira.svg', alt: 'Jira' },
  { src: '/logos/notion.svg', alt: 'Notion' },
  { src: '/logos/asana.svg', alt: 'Asana' },
  { src: '/logos/drive.svg', alt: 'Google Drive' },
  { src: '/logos/monday.svg', alt: 'Monday' },
  { src: '/logos/confluence.svg', alt: 'Confluence' },
]

export function IntegrationSection() {
  return (
    <section id="integration" className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal variant="blur" className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Integrations</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Connects to where decisions already happen.
          </h2>
        </Reveal>

        {/* Primary integration cards */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {INTEGRATIONS.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className={`interactive-card group flex h-full flex-col rounded-3xl border border-border bg-card p-8 hover:shadow-[var(--shadow-lg)] ${item.borderHover}`}>
                <div className={`mb-6 flex h-20 w-full items-center justify-center rounded-2xl ${item.bgColor}`}>
                  <Image
                    src={item.logo}
                    alt={item.title}
                    width={140}
                    height={48}
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Learn more
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
                    <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Secondary tools grid */}
        <Reveal delay={300}>
          <div className="mt-8 rounded-2xl border border-border bg-muted/40 p-8">
            <div className="mb-6 text-center">
              <h3 className="font-semibold">Plus your entire stack</h3>
              <p className="mt-1 text-sm text-muted-foreground">No more scattered policies across Notion, Slack, and Google Docs.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-10">
              {TOOL_LOGOS.map((logo) => (
                <div key={logo.alt} className="flex items-center opacity-60 transition-all hover:opacity-100">
                  <Image src={logo.src} alt={logo.alt} width={120} height={40} className="h-10 w-auto object-contain" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Badges */}
        <Reveal delay={400} className="mt-6 flex flex-wrap justify-center gap-2">
          {['REST API', 'Webhook sync', 'Real-time', 'Human-in-loop', 'Shopify · Gorgias · Zendesk'].map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-muted-foreground shadow-[var(--shadow-sm)]"
            >
              {badge}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
