import { useNavigate } from 'react-router-dom'
import { createClient } from '@/lib/supabase/client'
import { APP_NAME } from '@/lib/constants'
import { LogOut, Shield, User, Menu, Bell } from 'lucide-react'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { LocaleToggle } from '@/components/layout/locale-toggle'
import type { Profile } from '@/types'

interface HeaderProps {
  profile: Profile
  onMenuToggle?: () => void
}

export function Header({ profile, onMenuToggle }: HeaderProps) {
  const navigate = useNavigate()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    navigate('/login')
  }

  const initials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (profile.email?.[0] ?? 'U').toUpperCase()

  return (
    <header className="sticky top-0 z-40 glass px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 -ml-2 rounded-[18px] hover:bg-surface-alt transition-colors"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 text-text-primary" />
          </button>
        )}
        <h1 className="font-serif font-bold text-base tracking-tight text-text-primary">
          {APP_NAME}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Role badge */}
        <span className={`inline-flex items-center gap-1 rounded-[999px] px-3 py-1 text-xs font-semibold ${
          profile.role === 'admin'
            ? 'bg-primary text-white'
            : 'bg-primary-soft text-primary'
        }`}>
          {profile.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
          {profile.role}
        </span>

        {/* Locale toggle */}
        <div className="hidden sm:block">
          <LocaleToggle />
        </div>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Notification bell */}
        <button className="p-2 rounded-[18px] text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        {/* User name (desktop) */}
        <span className="hidden sm:inline text-sm text-text-secondary truncate max-w-[160px]">
          {profile.full_name || profile.email}
        </span>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-[999px] bg-primary-soft flex items-center justify-center text-xs font-semibold text-primary">
          {initials}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-[18px] text-text-secondary hover:text-danger hover:bg-surface-alt transition-colors"
          title="Déconnexion"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
