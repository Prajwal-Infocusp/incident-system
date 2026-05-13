'use client'

import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { SEVERITY_COLORS, STATUS_COLORS, Incident } from '@/types'

interface IncidentListProps {
  incidents: Incident[]
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function IncidentList({ incidents }: IncidentListProps) {
  if (incidents.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">No incidents found</p>
        <Link href="/incidents/new">
          <Button variant="link" className="mt-2">Create a new incident</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.map((incident) => (
            <TableRow key={incident.id}>
              <TableCell className="font-mono text-xs">
                {incident.id.slice(-6).toUpperCase()}
              </TableCell>
              <TableCell>
                <Link
                  href={`/incidents/${incident.id}`}
                  className="font-medium hover:underline"
                >
                  {incident.title}
                </Link>
              </TableCell>
              <TableCell>
                <Badge className={SEVERITY_COLORS[incident.severity]}>
                  {incident.severity}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={STATUS_COLORS[incident.status]}>
                  {incident.status}
                </Badge>
              </TableCell>
              <TableCell>
                {incident.assignedTo?.name || incident.assignedTo?.email || 'Unassigned'}
              </TableCell>
              <TableCell>
                {incident.createdBy?.name || incident.createdBy?.email}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(incident.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
