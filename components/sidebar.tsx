'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, AlertTriangle, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { Session } from 'next-auth'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
]

interface SidebarProps {
  session: Session | null
}

export function Sidebar({ session }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-64 border-r bg-white h-screen">
      <div className="flex h-16 items-center px-4 border-b">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-orange-600" />
          <span className="font-bold text-lg">IncidentHub</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t">
        {session?.user && (
          <div className="mb-3 px-3">
            <p className="text-sm font-medium truncate">{session.user.name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  )
}
