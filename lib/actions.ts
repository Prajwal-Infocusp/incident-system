import { authOptions } from './auth'
import { getServerSession } from 'next-auth'
import { prisma } from './prisma'
import { CreateIncidentInput, UpdateIncidentInput, AddActivityInput } from '@/types'
import type { Session } from 'next-auth'

export async function getSession() {
  return (await getServerSession(authOptions)) as Session | null
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session?.user?.email) return null

  return await prisma.user.findUnique({
    where: { email: session.user.email },
  })
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function getIncidents(filters?: {
  status?: string
  severity?: string
  assignedToId?: string
}) {
  const where: any = {}

  if (filters?.status) where.status = filters.status
  if (filters?.severity) where.severity = filters.severity
  if (filters?.assignedToId) where.assignedToId = filters.assignedToId

  return await prisma.incident.findMany({
    where,
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
    },
    orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
  })
}

export async function getIncident(id: string) {
  return await prisma.incident.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
      activities: {
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })
}

export async function getIncidentStats() {
  const [total, open, investigating, resolved, critical] = await Promise.all([
    prisma.incident.count(),
    prisma.incident.count({ where: { status: 'OPEN' } }),
    prisma.incident.count({ where: { status: 'INVESTIGATING' } }),
    prisma.incident.count({ where: { status: 'RESOLVED' } }),
    prisma.incident.count({ where: { severity: 'CRITICAL', status: { not: 'RESOLVED' } } }),
  ])

  return { total, open, investigating, resolved, critical }
}

export async function createIncident(data: CreateIncidentInput) {
  const user = await requireAuth()

  const incident = await prisma.incident.create({
    data: {
      title: data.title,
      description: data.description,
      severity: data.severity,
      createdById: user.id,
      assignedToId: data.assignedToId,
    },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  })

  await prisma.incidentActivity.create({
    data: {
      action: 'CREATED',
      message: `Incident created by ${user.name || user.email}`,
      incidentId: incident.id,
      createdById: user.id,
    },
  })

  return incident
}

export async function updateIncident(id: string, data: UpdateIncidentInput) {
  const user = await requireAuth()

  const incident = await prisma.incident.update({
    where: { id },
    data,
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  })

  const activities: any[] = []

  if (data.status) {
    activities.push({
      action: 'STATUS_CHANGED',
      message: `Status changed to ${data.status}`,
      incidentId: id,
      createdById: user.id,
    })
  }

  if (data.assignedToId !== undefined) {
    if (data.assignedToId) {
      const assignee = await prisma.user.findUnique({ where: { id: data.assignedToId } })
      activities.push({
        action: 'ASSIGNED',
        message: `Assigned to ${assignee?.name || assignee?.email}`,
        incidentId: id,
        createdById: user.id,
      })
    } else {
      activities.push({
        action: 'ASSIGNED',
        message: 'Unassigned',
        incidentId: id,
        createdById: user.id,
      })
    }
  }

  if (activities.length > 0) {
    await prisma.incidentActivity.createMany({ data: activities })
  }

  return incident
}

export async function addIncidentActivity(id: string, data: AddActivityInput) {
  const user = await requireAuth()

  return await prisma.incidentActivity.create({
    data: {
      action: data.action,
      message: data.message,
      incidentId: id,
      createdById: user.id,
    },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
    },
  })
}
