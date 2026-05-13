import { NextResponse } from 'next/server'
import { createIncident } from '@/lib/actions'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const incident = await createIncident(body)
    return NextResponse.json(incident, { status: 201 })
  } catch (error) {
    console.error('Failed to create incident:', error)
    return NextResponse.json(
      { error: 'Failed to create incident' },
      { status: 500 }
    )
  }
}
