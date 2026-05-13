import { getIncidentStats, getIncidents } from '@/lib/actions'
import { StatsCards } from '@/components/stats-cards'
import { RecentIncidents } from '@/components/recent-incidents'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [stats, incidents] = await Promise.all([
    getIncidentStats(),
    getIncidents(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of all incidents
          </p>
        </div>
        <Link href="/incidents/new">
          <Button>Create Incident</Button>
        </Link>
      </div>

      <StatsCards stats={stats} />

      <RecentIncidents incidents={incidents.slice(0, 10)} />
    </div>
  )
}
