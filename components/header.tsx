'use client'

import { Bell, BellRing } from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './ui/dropdown-menu'
import { Badge } from './ui/badge'
import { SEVERITY_COLORS, Severity, IncidentStatus } from '@/types'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Notification {
  id: string
  title: string
  severity: Severity
  status: IncidentStatus
  assignedToId: string | null
}

interface NotificationResponse {
  notifications: Notification[]
  currentUserId: string | null
}

export function Header() {
  const [data, setData] = useState<NotificationResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch('/api/notifications')
        if (res.ok) {
          const result = await res.json()
          setData(result)
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  const notifications = data?.notifications || []
  const unreadCount = notifications.length

  const handleMarkAsRead = async (id: string) => {
    setData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        notifications: prev.notifications.filter(n => n.id !== id),
      }
    })
    await fetch(`/api/notifications/${id}`, { method: 'POST' })
  }

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-white px-6">
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative w-10 h-10">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96">
            <div className="px-2 py-1.5 text-sm font-semibold border-b">
              Notifications
            </div>
            {loading ? (
              <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                No notifications
              </div>
            ) : (
              <>
                {notifications.slice(0, 5).map((notification) => {
                  const isAssignedToMe = data?.currentUserId && notification.assignedToId === data.currentUserId
                  return (
                    <DropdownMenuItem key={notification.id} className="p-0">
                      <div className={`flex flex-col w-full px-2 py-2 ${isAssignedToMe ? 'bg-blue-50' : 'hover:bg-accent'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col gap-1 min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm truncate">
                                {notification.title}
                              </span>
                              <Badge className={`text-xs ml-2 ${SEVERITY_COLORS[notification.severity]}`}>
                                {notification.severity}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground capitalize">
                              {notification.status.toLowerCase()}
                            </span>
                            {isAssignedToMe && (
                              <span className="text-xs text-blue-600 font-medium">Assigned to you</span>
                            )}
                          </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mt-1 h-7 text-xs w-full justify-center"
                            onClick={(e) => {
                              e.preventDefault()
                              handleMarkAsRead(notification.id)
                            }}
                          >
                            <BellRing className="h-3 w-3 mr-1" />
                            Mark as read
                          </Button>
                      </div>
                    </DropdownMenuItem>
                  )
                })}
                {notifications.length > 5 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center">
                      <Link href="/incidents" className="text-sm text-blue-600 hover:underline">
                        View all incidents
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}