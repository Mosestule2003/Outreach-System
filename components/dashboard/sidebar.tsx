'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AlertTriangle, BarChart3, Settings as SettingsIcon, Truck, Users } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { cn } from '@/lib/utils'
import { EXCEPTIONS } from '@/lib/dashboard/mock-data'

const NAV_ITEMS = [
  { label: 'Exceptions', href: '/dashboard/exceptions', icon: AlertTriangle },
  { label: 'Customers', href: '/dashboard/customers', icon: Users },
  { label: 'Carriers', href: '/dashboard/settings#carriers', icon: Truck },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const needsAttention = EXCEPTIONS.filter((e) => e.status === 'escalated').length

  return (
    <aside className="hidden w-[220px] shrink-0 flex-col border-r border-border bg-secondary/30 md:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <Logo size={7} />
        <span className="text-[16px] font-bold tracking-tight">Rezlv</span>
      </div>

      <nav className="flex flex-col gap-0.5 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href.split('#')[0])
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
                isActive ? 'bg-[var(--paper)] text-foreground shadow-[var(--shadow-sm)]' : 'text-muted-foreground hover:bg-secondary',
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {needsAttention > 0 && (
        <div
          className="mx-3 mt-6 rounded-xl p-4 text-[var(--accent-amber-ink)]"
          style={{ backgroundColor: 'var(--accent-amber-soft)' }}
        >
          <p className="text-[12px] font-bold">
            {needsAttention} exception{needsAttention > 1 ? 's' : ''} need{needsAttention === 1 ? 's' : ''} you
          </p>
          <p className="mt-1 text-[11px] leading-relaxed opacity-80">
            Customer did not respond within the 24hr window.
          </p>
        </div>
      )}
    </aside>
  )
}
