import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const currentUserId = (session?.user as any)?.id || null

    if (!currentUserId) {
      return NextResponse.json({ notifications: [], currentUserId: null })
    }

    const incidents = await prisma.incident.findMany({
      where: {
        assignedToId: currentUserId,
        status: { not: 'RESOLVED' },
        readAt: null,
      },
      select: {
        id: true,
        title: true,
        severity: true,
        status: true,
        assignedToId: true,
      },
      orderBy: [
        { severity: 'asc' },
        { createdAt: 'desc' },
      ],
      take: 10,
    })

    return NextResponse.json({ notifications: incidents, currentUserId })
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}