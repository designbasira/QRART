import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { QrCode, Eye, Zap, Plus, Edit, Grid3X3, Crown } from 'lucide-react'

export const metadata = { title: 'Mon espace - Silhouette QR Live' }

export default async function UserPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user!.id)
    .single()

  const { data: designs } = await supabase
    .from('designs')
    .select('*')
    .eq('owner_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(6)

  const totalDesigns = designs?.length ?? 0
  const activeDesigns = designs?.filter(d => d.is_published).length ?? 0
  const totalScans = designs?.reduce((sum, d) => sum + (d.scan_count ?? 0), 0) ?? 0

  const firstName = profile?.full_name?.split(' ')[0] || 'vous'

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome — Caveat script emotional greeting */}
      <div>
        <h2 className="font-script text-[26px] text-text-primary">
          Bonjour, {firstName}
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Gérez vos créations QR
        </p>
      </div>

      {/* Quick Stats — 3 glass pills */}
      <div className="grid grid-cols-3 gap-3 stagger">
        <div className="glass-card !p-4 animate-slide-up flex items-center gap-3">
          <div className="w-10 h-10 rounded-[18px] bg-primary-soft flex items-center justify-center shrink-0">
            <QrCode className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">{totalDesigns}</p>
            <p className="text-xs text-text-secondary">Designs</p>
          </div>
        </div>
        <div className="glass-card !p-4 animate-slide-up flex items-center gap-3">
          <div className="w-10 h-10 rounded-[18px] bg-primary-soft flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">{activeDesigns}</p>
            <p className="text-xs text-text-secondary">Actifs</p>
          </div>
        </div>
        <div className="glass-card !p-4 animate-slide-up flex items-center gap-3">
          <div className="w-10 h-10 rounded-[18px] bg-primary-soft flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">{totalScans}</p>
            <p className="text-xs text-text-secondary">Scans</p>
          </div>
        </div>
      </div>

      {/* Quick Actions — 2x2 grid of glass cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
        {[
          { icon: Plus, label: 'Nouveau design', href: '/user/designs', color: 'text-primary' },
          { icon: Edit, label: 'Modifier message', href: '/user/designs', color: 'text-text-secondary' },
          { icon: Grid3X3, label: 'Mes QR codes', href: '/user/designs', color: 'text-text-secondary' },
          { icon: Crown, label: 'Abonnement', href: '/user', color: 'text-text-secondary' },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="glass-card card-hover animate-slide-up !p-5 flex flex-col items-center gap-3 text-center"
          >
            <div className="w-12 h-12 rounded-[18px] bg-primary-soft flex items-center justify-center">
              <action.icon className={`w-6 h-6 ${action.color}`} />
            </div>
            <span className="text-sm font-semibold text-text-primary">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent Designs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-text-primary">Récents</h3>
          <Link href="/user/designs" className="text-sm font-medium text-primary hover:underline">
            Voir tout &rarr;
          </Link>
        </div>

        {designs && designs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {designs.slice(0, 3).map((design) => (
              <Link
                key={design.id}
                href={`/user/designs/${design.id}`}
                className="glass-card card-hover animate-slide-up !p-5"
              >
                <div className="w-full h-32 rounded-[18px] bg-surface-alt flex items-center justify-center mb-4">
                  <QrCode className="w-12 h-12 text-accent/40" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-text-primary">{design.title}</h4>
                    <p className="text-xs text-text-secondary mt-1 font-mono">{design.short_id}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-[999px] font-medium ${
                    design.is_published
                      ? 'bg-success/10 text-success'
                      : 'bg-surface-alt text-text-secondary'
                  }`}>
                    {design.is_published ? 'Actif' : 'Brouillon'}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-3">{design.scan_count ?? 0} scans</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-card text-center py-12">
            <QrCode className="w-12 h-12 text-accent/30 mx-auto mb-4" />
            <p className="text-text-secondary">Aucun design pour le moment.</p>
            <Link href="/user/designs" className="btn-primary mt-4 inline-flex">
              Créer mon premier QR
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
