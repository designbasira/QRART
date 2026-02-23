'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types'

interface NavItem {
  label: string
  href: string
}

const adminNav: NavItem[] = [
  { label: 'Vue d\'ensemble', href: '/admin' },
  { label: 'Nouveau design', href: '/admin/create' },
  { label: 'Designs', href: '/admin/designs' },
  { label: 'Utilisateurs', href: '/admin/users' },
]

const userNav: NavItem[] = [
  { label: 'Vue d\'ensemble', href: '/user' },
  { label: 'Mes designs', href: '/user/designs' },
  { label: 'Intégrations', href: '/user/integrations' },
]

export function Sidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const navItems = profile.role === 'admin' ? adminNav : userNav

  return (
    <aside className="w-64 border-r bg-gray-50 min-h-screen p-4">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-black text-white'
                : 'text-gray-700 hover:bg-gray-200'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
