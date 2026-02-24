import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Plus, Image, Users, FolderOpen, Link2, Settings, X } from 'lucide-react'
import type { Profile } from '@/types'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

const adminNav: NavItem[] = [
  { label: 'Vue d\'ensemble', href: '/admin', icon: LayoutDashboard },
  { label: 'Nouveau design', href: '/admin/create', icon: Plus },
  { label: 'Designs', href: '/admin/designs', icon: Image },
  { label: 'Utilisateurs', href: '/admin/users', icon: Users },
]

const userNav: NavItem[] = [
  { label: 'Vue d\'ensemble', href: '/user', icon: LayoutDashboard },
  { label: 'Mes designs', href: '/user/designs', icon: FolderOpen },
  { label: 'Intégrations', href: '/user/integrations', icon: Link2 },
]

/* ============ ICON SIDEBAR (Desktop) — Image 3/4 style ============ */
export function Sidebar({ profile }: { profile: Profile }) {
  const { pathname } = useLocation()
  const navItems = profile.role === 'admin' ? adminNav : userNav

  const initials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (profile.email?.[0] ?? 'U').toUpperCase()

  return (
    <aside className="hidden md:flex flex-col items-center w-[72px] min-h-[calc(100vh-53px)] glass-panel !rounded-none !rounded-r-[28px] py-6 gap-2">
      {/* Logo icon */}
      <div className="w-10 h-10 rounded-[18px] bg-primary flex items-center justify-center text-white font-bold text-sm mb-6">
        Q
      </div>

      {/* Nav icons */}
      <nav className="flex flex-col items-center gap-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'relative w-10 h-10 rounded-[18px] flex items-center justify-center transition-all duration-200 group',
                isActive
                  ? 'bg-primary-soft text-primary shadow-sm shadow-primary/10'
                  : 'text-text-secondary hover:bg-surface-alt hover:text-text-primary'
              )}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              {/* Tooltip */}
              <span className="absolute left-14 px-3 py-1.5 rounded-[12px] bg-text-primary text-white text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Settings */}
      <Link
        to={profile.role === 'admin' ? '/admin/settings' : '/user/settings'}
        className="w-10 h-10 rounded-[18px] flex items-center justify-center text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-all mb-2"
        title="Paramètres"
      >
        <Settings className="w-5 h-5" />
      </Link>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-[999px] bg-primary-soft flex items-center justify-center text-xs font-semibold text-primary">
        {initials}
      </div>
    </aside>
  )
}

/* ============ MOBILE SIDEBAR (Overlay) ============ */
export function MobileSidebar({ profile, open, onClose }: { profile: Profile; open: boolean; onClose: () => void }) {
  const { pathname } = useLocation()
  const navItems = profile.role === 'admin' ? adminNav : userNav

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 left-0 z-50 w-72 glass-panel !rounded-none !rounded-r-[28px] p-6 shadow-xl md:hidden animate-scale-in origin-left">
        <div className="flex items-center justify-between mb-8">
          <span className="font-serif font-bold text-base text-text-primary">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-[18px] hover:bg-surface-alt transition-colors"
          >
            <X className="w-4 h-4 text-text-primary" />
          </button>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-[18px] text-sm font-semibold transition-all',
                  isActive
                    ? 'bg-primary-soft text-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
