import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/components/auth/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { QrCode, Eye, Zap, Link2, Plus, Edit, Grid3X3, Crown, TrendingUp, ArrowRight, Sparkles } from 'lucide-react'

export function UserDashboardPage() {
  const { user, profile } = useAuth()
  const [designs, setDesigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('designs')
        .select('*')
        .eq('owner_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(6)
      setDesigns(data || [])
      setLoading(false)
    }
    load()
  }, [user])

  const totalDesigns = designs.length
  const activeDesigns = designs.filter(d => d.is_published).length
  const totalScans = designs.reduce((sum, d) => sum + (d.scan_count ?? 0), 0)
  const firstName = profile?.full_name?.split(' ')[0] || 'vous'

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-script text-[28px] text-text-primary leading-tight">Bonjour, {firstName}</h2>
          <p className="text-sm text-text-secondary mt-1">Gérez vos créations QR</p>
        </div>
        <Link to="/user/designs" className="btn-primary !h-10 !text-sm !px-4">
          <Plus className="w-4 h-4" />Nouveau
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 stagger">
        {[
          { icon: QrCode, value: totalDesigns, label: 'Designs', trend: '+2' },
          { icon: Zap, value: activeDesigns, label: 'Actifs', trend: null },
          { icon: Eye, value: totalScans, label: 'Scans', trend: '+12' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card !p-4 animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-[14px] bg-primary-soft flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
              {stat.trend && (
                <span className="text-[10px] font-semibold text-success flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />{stat.trend}
                </span>
              )}
            </div>
            <p className="text-2xl sm:text-[28px] font-bold text-text-primary leading-none">{stat.value}</p>
            <p className="text-[11px] text-text-secondary mt-1.5 uppercase tracking-wider font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 stagger">
        {[
          { icon: Link2, label: 'Lier un QR', href: '/user/designs', accent: true },
          { icon: Edit, label: 'Modifier message', href: '/user/designs', accent: false },
          { icon: Grid3X3, label: 'Mes QR codes', href: '/user/designs', accent: false },
          { icon: Crown, label: 'Abonnement', href: '/user/subscription', accent: false },
        ].map((action) => (
          <Link
            key={action.label}
            to={action.href}
            className="glass-card card-hover animate-slide-up !p-5 flex flex-col items-center gap-3 text-center group"
          >
            <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center transition-transform group-hover:scale-110 ${
              action.accent ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'bg-primary-soft'
            }`}>
              <action.icon className={`w-5 h-5 ${action.accent ? 'text-white' : 'text-primary'}`} />
            </div>
            <span className="text-sm font-semibold text-text-primary">{action.label}</span>
          </Link>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg text-text-primary">Récents</h3>
          <Link to="/user/designs" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            Voir tout <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {designs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {designs.slice(0, 3).map((design) => (
              <Link
                key={design.id}
                to={`/user/designs/${design.id}`}
                className="glass-card card-hover animate-slide-up !p-5 group"
              >
                <div className="w-full h-32 rounded-[18px] bg-gradient-to-b from-surface-alt to-surface flex items-center justify-center mb-4 group-hover:from-primary-soft/30 transition-colors">
                  <QrCode className="w-12 h-12 text-accent/30 group-hover:text-primary/30 transition-colors" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-text-primary">{design.title}</h4>
                    <p className="text-[11px] text-text-secondary mt-1 font-mono tracking-wider">{design.short_id}</p>
                  </div>
                  <span className={`text-[11px] px-3 py-1 rounded-[999px] font-semibold ${
                    design.is_published ? 'bg-success/10 text-success' : 'bg-surface-alt text-text-secondary'
                  }`}>
                    {design.is_published ? 'Actif' : 'Brouillon'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-3 text-[11px] text-text-secondary">
                  <Eye className="w-3 h-3" />{design.scan_count ?? 0} scans
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-card text-center py-16">
            <div className="w-16 h-16 rounded-[24px] bg-primary-soft flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <p className="text-text-secondary font-medium">Aucun design pour le moment</p>
            <p className="text-sm text-text-secondary/70 mt-1">Créez votre premier QR code artistique</p>
            <Link to="/user/designs" className="btn-primary mt-6 inline-flex">
              <Plus className="w-4 h-4" />Créer mon premier QR
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
