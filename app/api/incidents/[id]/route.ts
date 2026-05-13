import { NextResponse } from 'next/server'
import { getIncident, updateIncident } from '@/lib/actions'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const incident = await getIncident(params.id)
    if (!incident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(incident)
  } catch (error) {
    console.error('Failed to fetch incident:', error)
    return NextResponse.json(
      { error: 'Failed to fetch incident' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const incident = await updateIncident(params.id, body)
    return NextResponse.json(incident)
  } catch (error) {
    console.error('Failed to update incident:', error)
    return NextResponse.json(
      { error: 'Failed to update incident' },
      { status: 500 }
    )
  }
}
