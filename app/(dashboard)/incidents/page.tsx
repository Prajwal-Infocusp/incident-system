import { getIncidents, getUsers } from '@/lib/actions'
import { IncidentList } from '@/components/incident-list'
import { IncidentFilters } from '@/components/incident-filters'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function IncidentsPage({
  searchParams,
}: {
  searchParams: { status?: string; severity?: string; assignee?: string }
}) {
  const [incidents, users] = await Promise.all([
    getIncidents({
      status: searchParams.status,
      severity: searchParams.severity,
      assignedToId: searchParams.assignee,
    }),
    getUsers(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incidents</h1>
          <p className="text-muted-foreground">
            Manage and track all incidents
          </p>
        </div>
        <Link href="/incidents/new">
          <Button>Create Incident</Button>
        </Link>
      </div>

      <IncidentFilters users={users} />
      <IncidentList incidents={incidents} />
    </div>
  )
}
