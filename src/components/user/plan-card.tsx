
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface PlanCardProps {
  name: string
  price: string
  period?: string
  icon: LucideIcon
  features: string[]
  isCurrent: boolean
  isHighlighted?: boolean
  badge?: string
  ctaLabel: string
  onSelect?: () => void
}

export function PlanCard({
  name,
  price,
  period,
  icon: Icon,
  features,
  isCurrent,
  isHighlighted,
  badge,
  ctaLabel,
  onSelect,
}: PlanCardProps) {
  return (
    <div
      className={cn(
        'glass-card relative',
        isHighlighted && 'border-primary/50 ring-1 ring-primary/20',
      )}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-[999px] bg-primary text-white text-xs font-semibold shadow-sm">
          {badge}
        </div>
      )}

      {isCurrent && (
        <div className="absolute top-4 right-4 px-3 py-1 rounded-[999px] bg-success/10 text-success text-xs font-semibold">
          Actuel
        </div>
      )}

      <div className="mb-6">
        <div className="w-10 h-10 rounded-[18px] bg-primary-soft flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-semibold text-lg text-text-primary">{name}</h3>
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-[34px] font-bold text-text-primary">{price}</span>
          {period && <span className="text-text-secondary text-sm">{period}</span>}
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-sm text-text-secondary">
            <Check className="w-4 h-4 text-success flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        disabled={isCurrent}
        className={cn(
          'w-full',
          isCurrent
            ? 'btn-secondary opacity-60 cursor-not-allowed'
            : isHighlighted
              ? 'btn-primary'
              : 'btn-secondary',
        )}
      >
        {isCurrent ? 'Plan actuel' : ctaLabel}
      </button>
    </div>
  )
}
