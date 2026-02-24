
import { useTheme } from '@/hooks/use-theme'
import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

const options = [
  { value: 'light' as const, label: 'Clair', icon: Sun },
  { value: 'dark' as const, label: 'Sombre', icon: Moon },
  { value: 'system' as const, label: 'Système', icon: Monitor },
]

export function ThemePreference() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text-primary">Thème</label>
      <div className="flex gap-2">
        {options.map((opt) => {
          const Icon = opt.icon
          const isActive = theme === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-[18px] text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary-soft text-primary ring-1 ring-primary/20'
                  : 'bg-surface-alt text-text-secondary hover:text-text-primary'
              )}
            >
              <Icon size={16} />
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
