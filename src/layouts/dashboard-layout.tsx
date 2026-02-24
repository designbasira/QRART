import { Outlet } from 'react-router-dom'
import { useAuth } from '@/components/auth/auth-provider'
import { DashboardShell } from '@/components/layout/dashboard-shell'

export function DashboardLayout() {
  const { profile } = useAuth()

  if (!profile) return null

  return (
    <DashboardShell profile={profile}>
      <Outlet />
    </DashboardShell>
  )
}
