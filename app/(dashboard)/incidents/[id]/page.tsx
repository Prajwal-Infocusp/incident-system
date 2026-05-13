import { getIncident } from '@/lib/actions'
import { notFound } from 'next/navigation'
import { IncidentDetail } from '@/components/incident-detail'
import { ActivityTimeline } from '@/components/activity-timeline'

export const dynamic = 'force-dynamic'

export default async function IncidentPage({ params }: { params: { id: string } }) {
  const incident = await getIncident(params.id)

  if (!incident) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <IncidentDetail incident={incident} />
      <ActivityTimeline activities={incident.activities} />
    </div>
  )
}
