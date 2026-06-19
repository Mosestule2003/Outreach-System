'use client'

import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const ARTICLES = [
  {
    source: 'Shopify',
    tag: 'Returns Strategy',
    internalLink: { label: 'How rezlv handles this', href: '#how-it-works' },
    title: 'Ecommerce Returns: Average Return Rate and How to Reduce It',
    excerpt:
      '92% of consumers say they\'d buy from a brand again if returns were easy — and 95% say a poor returns experience makes them less likely to return. This guide breaks down what top brands get right.',
    url: 'https://www.shopify.com/enterprise/blog/ecommerce-returns',
    readTime: '8 min read',
  },
  {
    source: 'Modern Retail',
    tag: 'CX at Scale',
    internalLink: { label: 'See rezlv features', href: '#features' },
    title: 'As DTC Brands Grow Up, Customer Service Becomes a Bigger Headache',
    excerpt:
      'Growing digitally-native brands are realizing that the way to maintain their reputation is through consistent customer service — but consistency at scale is the hard part nobody talks about.',
    url: 'https://modernretail.co/startups/as-dtcs-scale-customer-service-becomes-a-bigger-headache',
    readTime: '6 min read',
  },
  {
    source: 'Gorgias',
    tag: 'Operations',
    internalLink: { label: 'See integrations', href: '#how-it-works' },
    title: 'Ecommerce Returns: 10 Best Practices for Your Online Store',
    excerpt:
      'Returns are one of the highest-volume CX interactions in ecommerce. Brands that treat them as a system — not a one-off decision — recover more revenue and keep more customers.',
    url: 'https://www.gorgias.com/blog/ecommerce-returns-best-practices',
    readTime: '7 min read',
  },
]

const SOURCE_COLORS: Record<string, string> = {
  Shopify: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Modern Retail': 'bg-blue-50 text-blue-700 border-blue-100',
  Gorgias: 'bg-violet-50 text-violet-700 border-violet-100',
}

export function ArticlesSection() {
  return (
    <section className="border-t border-border px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <Reveal className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              Further reading
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              What the best brands get right
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Sourced from industry leaders in ecommerce operations, returns strategy, and DTC customer experience.
            </p>
          </div>
        </Reveal>

        {/* Cards grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((article, i) => (
            <Reveal key={article.url} delay={i * 80}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-3xl border border-border bg-card p-7 transition-all duration-300 hover:border-foreground/20 hover:shadow-lg"
              >
                {/* Top row: source badge + read time */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${SOURCE_COLORS[article.source] ?? 'bg-muted text-muted-foreground border-border'}`}
                  >
                    {article.source}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{article.readTime}</span>
                </div>

                {/* Tag */}
                <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {article.tag}
                </p>

                {/* Title */}
                <h3 className="mt-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-accent">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>

                {/* Footer: external + internal link */}
                <div className="mt-6 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    Read article
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <a
                    href={article.internalLink.href}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[11px] font-medium text-accent underline underline-offset-2 hover:opacity-70"
                  >
                    {article.internalLink.label} →
                  </a>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  )
}
