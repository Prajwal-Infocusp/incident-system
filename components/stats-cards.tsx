import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { AlertTriangle, AlertCircle, CheckCircle2, Clock, AlertOctagon, UserCircle } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    total: number
    open: number
    investigating: number
    resolved: number
    critical: number
    assignedToMe: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open</CardTitle>
          <AlertCircle className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.open}</div>
          <p className="text-xs text-muted-foreground">Awaiting action</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Investigating</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.investigating}</div>
          <p className="text-xs text-muted-foreground">In progress</p>
        </CardContent>
      </Card>
      <Card className={stats.critical > 0 ? 'border-red-200 bg-red-50' : ''}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Critical</CardTitle>
          <AlertOctagon className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.critical}</div>
          <p className="text-xs text-muted-foreground">Needs immediate attention</p>
        </CardContent>
      </Card>
      <Card className={stats.assignedToMe > 0 ? 'border-blue-200 bg-blue-50' : ''}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assigned to You</CardTitle>
          <UserCircle className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.assignedToMe}</div>
          <p className="text-xs text-muted-foreground">Awaiting your action</p>
        </CardContent>
      </Card>
    </div>
  )
}