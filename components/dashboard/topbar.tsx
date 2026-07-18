'use client'

import { Search } from 'lucide-react'

export function DashboardTopbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-6 py-4 md:px-8">
      <div>
        <h1 className="text-[20px] font-bold tracking-[-0.02em] text-foreground">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[13px] text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg bg-card px-3 py-1.5 text-[13px] text-muted-foreground shadow-[var(--shadow-sm)] sm:flex">
          <Search className="size-3.5" />
          Search
        </div>
        <div className="flex size-8 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background">
          MK
        </div>
      </div>
    </div>
  )
}
