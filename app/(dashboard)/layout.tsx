import { getSession } from '@/lib/auth'
import { AuthGuard } from '@/components/auth-guard'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import type { Session } from 'next-auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = (await getSession()) as Session | null

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar session={session} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
