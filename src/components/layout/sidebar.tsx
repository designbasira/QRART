import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Plus, Settings, X, Palette, ShoppingBag, Store, Crown, ChevronsRight, ChevronsLeft } from 'lucide-react'
import type { Profile } from '@/types'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { label: 'QRART', href: '/user', icon: LayoutDashboard },
  { label: 'Créer un QR', href: '/user/create', icon: Plus },
  { label: 'Studio', href: '/user/studio', icon: Palette },
  { label: 'Commander', href: '/user/pod', icon: ShoppingBag },
  { label: 'Etsy', href: '/user/etsy', icon: Store },
  { label: 'Abonnement', href: '/user/subscription', icon: Crown },
]

interface SidebarProps {
  profile: Profile
  expanded: boolean
  onToggle: () => void
}

/* ============ ICON SIDEBAR (Desktop) — Expandable ============ */
export function Sidebar({ profile, expanded, onToggle }: SidebarProps) {
  const { pathname } = useLocation()

  const initials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (profile.email?.[0] ?? 'U').toUpperCase()

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col min-h-[calc(100vh-53px)] glass-panel !rounded-none !rounded-r-[28px] py-6 gap-2 transition-all duration-300',
        expanded ? 'w-[220px] px-4' : 'w-[72px] items-center'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center mb-6', expanded ? 'gap-3 px-1' : 'justify-center')}>
        <div className="w-10 h-10 rounded-[18px] bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
          Q
        </div>
        {expanded && (
          <span className="font-serif font-bold text-base text-text-primary truncate">QRART</span>
        )}
      </div>

      {/* Nav items */}
      <nav className={cn('flex flex-col gap-1.5 flex-1', !expanded && 'items-center')}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'relative flex items-center rounded-[18px] transition-all duration-200 group',
                expanded ? 'gap-3 px-3 py-2.5' : 'w-10 h-10 justify-center',
                isActive
                  ? 'bg-primary-soft text-primary shadow-sm shadow-primary/10'
                  : 'text-text-primary hover:bg-surface-alt'
              )}
              title={!expanded ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {expanded && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
              {/* Tooltip (collapsed only) */}
              {!expanded && (
                <span className="absolute left-14 px-3 py-1.5 rounded-[12px] bg-text-primary text-white text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Settings */}
      <Link
        to="/user/settings"
        className={cn(
          'flex items-center rounded-[18px] text-text-primary hover:bg-surface-alt transition-all mb-2',
          expanded ? 'gap-3 px-3 py-2.5' : 'w-10 h-10 justify-center'
        )}
        title={!expanded ? 'Paramètres' : undefined}
      >
        <Settings className="w-5 h-5 shrink-0" />
        {expanded && <span className="text-sm font-medium">Paramètres</span>}
      </Link>

      {/* Avatar */}
      <div className={cn('flex items-center', expanded ? 'gap-3 px-1' : 'justify-center')}>
        <div className="w-10 h-10 rounded-[999px] bg-primary-soft flex items-center justify-center text-xs font-semibold text-primary shrink-0">
          {initials}
        </div>
        {expanded && (
          <span className="text-sm font-medium text-text-primary truncate">
            {profile.full_name || profile.email}
          </span>
        )}
      </div>

      {/* Toggle expand/collapse */}
      <button
        onClick={onToggle}
        className={cn(
          'flex items-center rounded-[18px] text-text-primary hover:bg-surface-alt transition-all mt-2',
          expanded ? 'gap-3 px-3 py-2.5' : 'w-10 h-10 justify-center'
        )}
        title={expanded ? 'Réduire' : 'Agrandir'}
      >
        {expanded ? <ChevronsLeft className="w-5 h-5 shrink-0" /> : <ChevronsRight className="w-5 h-5" />}
        {expanded && <span className="text-sm font-medium">Réduire</span>}
      </button>
    </aside>
  )
}

/* ============ MOBILE SIDEBAR (Overlay) ============ */
export function MobileSidebar({ profile, open, onClose }: { profile: Profile; open: boolean; onClose: () => void }) {
  const { pathname } = useLocation()

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
                    : 'text-text-primary hover:bg-surface-alt'
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
