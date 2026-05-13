import { NextResponse } from 'next/server'
import { addIncidentActivity } from '@/lib/actions'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const activity = await addIncidentActivity(params.id, body)
    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    console.error('Failed to add activity:', error)
    return NextResponse.json(
      { error: 'Failed to add activity' },
      { status: 500 }
    )
  }
}
