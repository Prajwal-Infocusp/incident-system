import { getUsers } from '@/lib/actions'
import { CreateIncidentForm } from '@/components/create-incident-form'

export const dynamic = 'force-dynamic'

export default async function NewIncidentPage() {
  const users = await getUsers()

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create Incident</h1>
        <p className="text-muted-foreground">
          Report a new incident for your team
        </p>
      </div>
      <CreateIncidentForm users={users} />
    </div>
  )
}
