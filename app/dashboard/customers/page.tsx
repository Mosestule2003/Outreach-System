import { DashboardTopbar } from '@/components/dashboard/topbar'
import { Users } from 'lucide-react'

export default function CustomersPage() {
  return (
    <>
      <DashboardTopbar title="Customers" />
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <Users className="size-8 text-muted-foreground" />
        <p className="text-[14px] font-medium text-foreground">Customer directory — coming soon</p>
        <p className="max-w-xs text-[13px] text-muted-foreground">
          A per-customer view of exception history lands after the core exception queue ships.
        </p>
      </div>
    </>
  )
}
