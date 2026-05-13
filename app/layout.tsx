import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import type { Session } from 'next-auth'

export const metadata: Metadata = {
  title: 'Incident Management System',
  description: 'Simple incident management for your team',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = (await getSession()) as Session | null

  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
