'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { SEVERITY_COLORS, STATUS_COLORS, Incident } from '@/types'

interface RecentIncidentsProps {
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

export function RecentIncidents({ incidents }: RecentIncidentsProps) {
  if (incidents.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">No incidents yet</p>
        <Link href="/incidents/new">
          <Button variant="link" className="mt-2">Create your first incident</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Recent Incidents</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assignee</TableHead>
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
