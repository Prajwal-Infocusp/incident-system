import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { IncidentActivity, ACTIVITY_ICONS } from '@/types'

interface ActivityTimelineProps {
  activities: IncidentActivity[]
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No activity yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6">
          <div className="absolute left-2 top-3 bottom-3 w-px bg-border" />
          {activities.map((activity, index) => (
            <div key={activity.id} className="relative flex gap-4 pl-8">
              <div className="absolute left-0 flex h-5 w-5 items-center justify-center rounded-full bg-background border text-sm">
                {ACTIVITY_ICONS[activity.action]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{activity.message}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">
                    {activity.createdBy?.name || activity.createdBy?.email}
                  </p>
                  <span className="text-xs text-muted-foreground">•</span>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(activity.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
