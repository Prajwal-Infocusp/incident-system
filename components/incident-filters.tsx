'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { SEVERITY_COLORS, STATUS_COLORS, Incident, Severity, IncidentStatus } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Label } from './ui/label'
import { User } from 'next-auth'
import { ArrowUpDown } from 'lucide-react'

interface IncidentFiltersProps {
  users: User[]
}

type SortField = 'severity' | 'createdAt' | 'createdBy' | 'assignedTo' | null

export function IncidentFilters({ users }: IncidentFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [status, setStatus] = useState(searchParams.get('status') || 'all')
  const [severity, setSeverity] = useState(searchParams.get('severity') || 'all')
  const [assignee, setAssignee] = useState(searchParams.get('assignee') || 'all')

  useEffect(() => {
    const params = new URLSearchParams()
    if (status !== 'all') params.set('status', status)
    if (severity !== 'all') params.set('severity', severity)
    if (assignee !== 'all') params.set('assignee', assignee)

    const query = params.toString()
    router.push(`/incidents${query ? `?${query}` : ''}`, { scroll: false })
  }, [status, severity, assignee, router])

  return (
    <div className="flex flex-wrap gap-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="INVESTIGATING">Investigating</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Severity</Label>
        <Select value={severity} onValueChange={setSeverity}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All severities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All severities</SelectItem>
            <SelectItem value="CRITICAL">Critical</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Assignee</Label>
        <Select value={assignee} onValueChange={setAssignee}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All assignees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All assignees</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name || user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}