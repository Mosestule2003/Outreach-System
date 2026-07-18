'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { DashboardTopbar } from '@/components/dashboard/topbar'
import { ExceptionStatusBadge } from '@/components/dashboard/exception-status-badge'
import { EXCEPTIONS, DASHBOARD_STATS, RESOLUTION_HISTORY, TYPE_LABEL, type ExceptionStatus } from '@/lib/dashboard/mock-data'
import { staggerContainer, staggerItem } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

const FILTERS: { label: string; value: ExceptionStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Needs you', value: 'escalated' },
  { label: 'In progress', value: 'sms_sent' },
  { label: 'Resolved', value: 'resolved' },
]

export default function ExceptionsPage() {
  const reduceMotion = useReducedMotion()
  const [filter, setFilter] = React.useState<ExceptionStatus | 'all'>('all')

  const filtered =
    filter === 'all'
      ? EXCEPTIONS
      : filter === 'sms_sent'
        ? EXCEPTIONS.filter((e) => e.status === 'sms_sent' || e.status === 'customer_responded' || e.status === 'sent_to_carrier')
        : EXCEPTIONS.filter((e) => e.status === filter)

  const maxPct = Math.max(...RESOLUTION_HISTORY.map((r) => r.pct))

  return (
    <>
      <DashboardTopbar title="Exception queue" subtitle={`${EXCEPTIONS.length} orders in flight right now`} />

      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <motion.div
          variants={staggerContainer(reduceMotion, 0.08)}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <motion.div variants={staggerItem(reduceMotion)}>
              <StatCard
                label="Auto-resolution rate"
                value={DASHBOARD_STATS.resolutionRate}
                sub={DASHBOARD_STATS.resolutionRateDelta}
                highlight
              />
            </motion.div>
            <motion.div variants={staggerItem(reduceMotion)}>
              <StatCard label="RTOs prevented (30d)" value={DASHBOARD_STATS.rtoSaved} sub={DASHBOARD_STATS.rtoSavedSub} />
            </motion.div>
            <motion.div variants={staggerItem(reduceMotion)}>
              <StatCard label="Avg. time to resolve" value={DASHBOARD_STATS.avgResolveTime} sub={DASHBOARD_STATS.avgResolveTimeSub} />
            </motion.div>
          </div>

          <motion.div
            variants={staggerItem(reduceMotion)}
            className="rounded-xl bg-card p-5 shadow-[var(--shadow-sm)]"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-foreground">Resolution rate over time</span>
              <span className="text-[11px] text-muted-foreground">Last 7 months</span>
            </div>
            <div className="flex items-end gap-3" style={{ height: 140 }}>
              {RESOLUTION_HISTORY.map((bar, i) => (
                <div key={bar.month} className="flex flex-1 flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(bar.pct / maxPct) * 100}%` }}
                    transition={{ duration: 0.6, delay: reduceMotion ? 0 : 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
                    className="flex w-full items-end justify-center"
                    style={{ height: 110 }}
                  >
                    <div
                      className="w-full rounded-t-md"
                      style={{
                        height: `${(bar.pct / maxPct) * 100}%`,
                        backgroundColor: i === RESOLUTION_HISTORY.length - 1 ? 'var(--accent-green)' : 'var(--muted-foreground)',
                        opacity: i === RESOLUTION_HISTORY.length - 1 ? 1 : 0.25,
                      }}
                    />
                  </motion.div>
                  <span className="text-[11px] text-muted-foreground">{bar.month}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={staggerItem(reduceMotion)} className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  'rounded-full border border-transparent px-3.5 py-1.5 text-[13px] font-medium transition-colors',
                  filter === f.value
                    ? 'bg-primary text-primary-foreground shadow-[var(--shadow-button)]'
                    : 'border-border text-muted-foreground hover:bg-secondary',
                )}
              >
                {f.label}
              </button>
            ))}
          </motion.div>

          <motion.div variants={staggerItem(reduceMotion)} className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-sm)]">
            <div className="grid grid-cols-[0.9fr_1.2fr_0.7fr_1.1fr_1.2fr] gap-2 border-b border-border px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <span>Order</span>
              <span>Customer</span>
              <span>Carrier</span>
              <span>Exception</span>
              <span>Status</span>
            </div>
            {filtered.map((row) => (
              <Link
                key={row.id}
                href={`/dashboard/exceptions/${row.id}`}
                className="grid grid-cols-[0.9fr_1.2fr_0.7fr_1.1fr_1.2fr] items-center gap-2 border-b border-border px-5 py-3.5 text-[13px] transition-colors last:border-0 hover:bg-secondary/50"
              >
                <span className="font-mono font-medium text-foreground">{row.orderNumber}</span>
                <span className="text-muted-foreground">{row.customer}</span>
                <span className="text-muted-foreground">{row.carrier}</span>
                <span className="text-muted-foreground">{TYPE_LABEL[row.type]}</span>
                <ExceptionStatusBadge status={row.status} />
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="px-5 py-10 text-center text-[13px] text-muted-foreground">No exceptions match this filter.</div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

function StatCard({ label, value, sub, highlight }: { label: string; value: string; sub: string; highlight?: boolean }) {
  return (
    <div
      className={cn('rounded-xl p-5', highlight ? '' : 'bg-card shadow-[var(--shadow-sm)]')}
      style={highlight ? { backgroundColor: 'var(--accent-green-soft)' } : undefined}
    >
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <p className="mt-2 text-[26px] font-bold tracking-[-0.02em] text-foreground">{value}</p>
      <p className="mt-0.5 text-[12px]" style={highlight ? { color: 'var(--accent-green-ink)' } : { color: 'var(--muted-foreground)' }}>
        {sub}
      </p>
    </div>
  )
}
