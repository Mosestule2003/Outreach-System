'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardIndexPage() {
  const router = useRouter()

  React.useEffect(() => {
    router.replace('/dashboard/exceptions')
  }, [router])

  return null
}
