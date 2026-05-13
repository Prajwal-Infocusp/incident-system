'use client'

import { Bell } from 'lucide-react'
import { Button } from './ui/button'

export function Header() {
  return (
    <header className="flex h-14 items-center justify-end gap-4 border-b bg-white px-6">
      <Button variant="ghost" size="icon">
        <Bell className="h-5 w-5" />
      </Button>
    </header>
  )
}
