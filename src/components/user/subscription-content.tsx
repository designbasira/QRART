
import { PlanCard } from '@/components/user/plan-card'
import { Layers, Palette, Sparkles, BarChart3 } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: 'Gratuit',
    price: '0€',
    icon: Layers,
    maxDesigns: 3,
    features: ['3 designs QR codes', 'Contenu dynamique', 'Support email'],
    cta: 'Plan actuel',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '9.99€',
    period: '/mois',
    icon: Palette,
    maxDesigns: 25,
    badge: 'Populaire',
    features: ['25 designs QR codes', 'Export haute résolution', 'Analytics détaillés', 'Priorité support'],
    cta: 'Passer au Pro',
    highlighted: true,
  },
  {
    id: 'creator',
    name: 'Creator',
    price: '24.99€',
    period: '/mois',
    icon: Sparkles,
    maxDesigns: Infinity,
    features: ['Designs illimités', 'Accès API', 'Mockups produits', 'Support dédié', 'White label'],
    cta: 'Devenir Creator',
  },
] as const

interface SubscriptionContentProps {
  currentPlan: string
  designCount: number
}

export function SubscriptionContent({ currentPlan, designCount }: SubscriptionContentProps) {
  const current = PLANS.find((p) => p.id === currentPlan) || PLANS[0]
  const maxDesigns = current.maxDesigns === Infinity ? '∞' : current.maxDesigns
  const usagePercent = current.maxDesigns === Infinity ? 0 : Math.min((designCount / current.maxDesigns) * 100, 100)

  return (
    <div className="space-y-8">
      {/* Usage */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <BarChart3 size={18} /> Utilisation
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Designs utilisés</span>
            <span className="font-semibold text-text-primary">
              {designCount} / {maxDesigns}
            </span>
          </div>
          <div className="w-full bg-surface-alt rounded-[999px] h-2.5">
            <div
              className="bg-primary h-2.5 rounded-[999px] transition-all duration-500"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          {usagePercent >= 80 && usagePercent < 100 && (
            <p className="text-xs text-warning">Vous approchez de la limite de votre plan.</p>
          )}
          {usagePercent >= 100 && (
            <p className="text-xs text-danger">Limite atteinte. Passez à un plan supérieur pour créer plus de designs.</p>
          )}
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            name={plan.name}
            price={plan.price}
            period={'period' in plan ? plan.period : undefined}
            icon={plan.icon}
            features={[...plan.features]}
            isCurrent={plan.id === currentPlan}
            isHighlighted={'highlighted' in plan ? plan.highlighted : false}
            badge={'badge' in plan ? plan.badge : undefined}
            ctaLabel={plan.cta}
            onSelect={() => {
              // Payment integration will be added in a future phase
              alert('Paiement bientôt disponible')
            }}
          />
        ))}
      </div>
    </div>
  )
}
