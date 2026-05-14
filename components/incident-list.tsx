'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { SEVERITY_COLORS, STATUS_COLORS, Incident, Severity, IncidentStatus } from '@/types'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

interface IncidentListProps {
  incidents: Incident[]
}

type SortField = 'severity' | 'createdAt' | 'createdBy' | 'assignedTo'
type SortDirection = 'asc' | 'desc'

const severityOrder: Record<Severity, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function SortableHeader({ 
  field, 
  label, 
  currentField, 
  direction, 
  onSort 
}: { 
  field: SortField
  label: string
  currentField: SortField | null
  direction: SortDirection
  onSort: (field: SortField) => void
}) {
  const isActive = currentField === field
  
  return (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive ? (
          direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
        ) : (
          <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
        )}
      </div>
    </TableHead>
  )
}

export function IncidentList({ incidents }: IncidentListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedIncidents = useMemo(() => {
    if (!sortField) return incidents

    return [...incidents].sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case 'severity':
          comparison = severityOrder[a.severity] - severityOrder[b.severity]
          break
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'createdBy':
          const aName = a.createdBy?.name || a.createdBy?.email || ''
          const bName = b.createdBy?.name || b.createdBy?.email || ''
          comparison = aName.localeCompare(bName)
          break
        case 'assignedTo':
          const aAssign = a.assignedTo?.name || a.assignedTo?.email || ''
          const bAssign = b.assignedTo?.name || b.assignedTo?.email || ''
          comparison = aAssign.localeCompare(bAssign)
          break
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [incidents, sortField, sortDirection])

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
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <SortableHeader 
              field="severity" 
              label="Severity" 
              currentField={sortField} 
              direction={sortDirection}
              onSort={handleSort}
            />
            <TableHead>Status</TableHead>
            <SortableHeader 
              field="assignedTo" 
              label="Assignee" 
              currentField={sortField} 
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortableHeader 
              field="createdBy" 
              label="Created By" 
              currentField={sortField} 
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortableHeader 
              field="createdAt" 
              label="Created At" 
              currentField={sortField} 
              direction={sortDirection}
              onSort={handleSort}
            />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedIncidents.map((incident) => (
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
                {incident.assignedTo?.name || incident.assignedTo?.email || '-'}
              </TableCell>
              <TableCell>
                {incident.createdBy?.name || incident.createdBy?.email || '-'}
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