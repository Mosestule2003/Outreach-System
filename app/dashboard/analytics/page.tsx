import { DashboardTopbar } from '@/components/dashboard/topbar'
import { BarChart3 } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <>
      <DashboardTopbar title="Analytics" />
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <BarChart3 className="size-8 text-muted-foreground" />
        <p className="text-[14px] font-medium text-foreground">Deeper analytics — coming soon</p>
        <p className="max-w-xs text-[13px] text-muted-foreground">
          Resolution-rate trends already live on the exception queue. Cohort and carrier-level breakdowns land next.
        </p>
      </div>
    </>
  )
}
