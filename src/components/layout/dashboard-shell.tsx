
import { useState } from 'react'
import { Header } from './header'
import { Sidebar, MobileSidebar } from './sidebar'
import { BottomNav } from './bottom-nav'
import { InstallBanner } from './install-banner'
import type { Profile } from '@/types'

export function DashboardShell({ profile, children }: { profile: Profile; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header profile={profile} onMenuToggle={() => setMobileOpen(true)} />
      <div className="flex">
        <Sidebar profile={profile} />
        <MobileSidebar profile={profile} open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 pb-24 md:pb-8">
          {children}
        </main>
      </div>
      <BottomNav profile={profile} />
      <InstallBanner />
    </div>
  )
}
