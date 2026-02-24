
import { useLocale } from '@/hooks/use-locale'
import { cn } from '@/lib/utils'

export function LocaleToggle() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="flex items-center rounded-[999px] bg-surface-alt p-0.5 text-xs font-medium">
      <button
        onClick={() => setLocale('fr')}
        className={cn(
          'px-2.5 py-1 rounded-[999px] transition-all',
          locale === 'fr'
            ? 'bg-primary text-white'
            : 'text-text-secondary hover:text-text-primary'
        )}
      >
        FR
      </button>
      <button
        onClick={() => setLocale('en')}
        className={cn(
          'px-2.5 py-1 rounded-[999px] transition-all',
          locale === 'en'
            ? 'bg-primary text-white'
            : 'text-text-secondary hover:text-text-primary'
        )}
      >
        EN
      </button>
    </div>
  )
}
