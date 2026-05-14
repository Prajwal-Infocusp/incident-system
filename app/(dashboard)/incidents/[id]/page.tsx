import { getIncident, getUsers } from '@/lib/actions'
import { notFound } from 'next/navigation'
import { IncidentDetail } from '@/components/incident-detail'
import { ActivityTimeline } from '@/components/activity-timeline'

export const dynamic = 'force-dynamic'

export default async function IncidentPage({ params }: { params: { id: string } }) {
  const [incident, users] = await Promise.all([
    getIncident(params.id),
    getUsers(),
  ])

  if (!incident) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <IncidentDetail incident={incident} users={users} />
      <ActivityTimeline activities={incident.activities} />
    </div>
  )
}