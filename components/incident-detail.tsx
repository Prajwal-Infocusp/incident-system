'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { SEVERITY_COLORS, STATUS_COLORS, Incident, Severity } from '@/types'
import { ArrowLeft } from 'lucide-react'
import { User } from 'next-auth'

interface IncidentDetailProps {
  incident: Incident
  users: User[]
}

export function IncidentDetail({ incident, users }: IncidentDetailProps) {
  const router = useRouter()
  const [status, setStatus] = useState(incident.status)
  const [severity, setSeverity] = useState(incident.severity)
  const [assignedToId, setAssignedToId] = useState(incident.assignedToId || 'unassigned')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleUpdate() {
    setLoading(true)
    try {
      await fetch(`/api/incidents/${incident.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          severity,
          assignedToId: assignedToId === 'unassigned' ? null : assignedToId,
        }),
      })

      if (comment) {
        await fetch(`/api/incidents/${incident.id}/activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'COMMENTED',
            message: comment,
          }),
        })
      }

      router.refresh()
    } catch (error) {
      console.error('Failed to update incident:', error)
    } finally {
      setLoading(false)
    }
  }

  function formatDate(date: Date | string) {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/incidents">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{incident.title}</h1>
          <p className="text-muted-foreground font-mono text-sm">
            ID: {incident.id.toUpperCase()}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="mt-1">{incident.description || 'No description provided'}</p>
              </div>
              <div className="pt-4 border-t">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-muted-foreground">Created By</Label>
                    <p className="mt-1">{incident.createdBy?.name || incident.createdBy?.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Created At</Label>
                    <p className="mt-1">{formatDate(incident.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Incident</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="INVESTIGATING">Investigating</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select value={severity} onValueChange={(v) => setSeverity(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select value={assignedToId} onValueChange={setAssignedToId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Add Comment</Label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a note about this update..."
                  rows={3}
                />
              </div>
              <Button onClick={handleUpdate} disabled={loading}>
                {loading ? 'Updating...' : 'Update Incident'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={`text-base px-3 py-1 ${STATUS_COLORS[incident.status]}`}>
                {incident.status}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Severity</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={`text-base px-3 py-1 ${SEVERITY_COLORS[incident.severity]}`}>
                {incident.severity}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assignee</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">
                {incident.assignedTo?.name || incident.assignedTo?.email || 'Unassigned'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Created At</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{formatDate(incident.createdAt)}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}