'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, Grid3X3, Plus, Crown, Settings } from 'lucide-react'
import type { Profile } from '@/types'

interface BottomNavProps {
  profile: Profile
}

const userTabs = [
  { label: 'Home', href: '/user', icon: Home },
  { label: 'Designs', href: '/user/designs', icon: Grid3X3 },
  { label: 'Créer', href: '/user/designs', icon: Plus, isCenter: true },
  { label: 'Abo', href: '/user/subscription', icon: Crown },
  { label: 'Réglages', href: '/user/settings', icon: Settings },
]

const adminTabs = [
  { label: 'Home', href: '/admin', icon: Home },
  { label: 'Designs', href: '/admin/designs', icon: Grid3X3 },
  { label: 'Créer', href: '/admin/create', icon: Plus, isCenter: true },
  { label: 'Users', href: '/admin/users', icon: Crown },
  { label: 'Réglages', href: '/admin/settings', icon: Settings },
]

export function BottomNav({ profile }: BottomNavProps) {
  const pathname = usePathname()
  const tabs = profile.role === 'admin' ? adminTabs : userTabs

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden glass border-t border-border"
         style={{ height: '72px', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around h-full px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.href ||
            (tab.href !== '/user' && tab.href !== '/admin' && pathname.startsWith(tab.href))

          if (tab.isCenter) {
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className="flex flex-col items-center justify-center -mt-4"
              >
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </Link>
            )
          }

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className="flex flex-col items-center justify-center gap-1 min-w-[56px]"
            >
              <div className={cn(
                'relative p-1.5 rounded-[999px] transition-colors',
                isActive && 'bg-primary-soft'
              )}>
                <Icon className={cn(
                  'w-5 h-5 transition-colors',
                  isActive ? 'text-primary' : 'text-text-secondary'
                )} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span className={cn(
                'text-[11px] font-medium',
                isActive ? 'text-primary' : 'text-text-secondary'
              )}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
