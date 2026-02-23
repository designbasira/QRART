import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { QrCode, Users, Plus, Eye, TrendingUp, ArrowRight } from 'lucide-react'

export const metadata = { title: 'Admin - Silhouette QR Live' }

export default async function AdminPage() {
  const supabase = await createClient()

  const { count: designCount } = await supabase
    .from('designs')
    .select('*', { count: 'exact', head: true })

  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'user')

  const { data: recentDesigns } = await supabase
    .from('designs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4)

  const totalScans = recentDesigns?.reduce((sum, d) => sum + (d.scan_count ?? 0), 0) ?? 0

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[26px] font-bold text-text-primary">Tableau de bord</h2>
          <p className="text-sm text-text-secondary mt-1">Administration Silhouette QR Live</p>
        </div>
        <Link href="/admin/create" className="btn-primary">
          <Plus className="w-4 h-4" />
          Nouveau design
        </Link>
      </div>

      {/* Stats row — 3 glass cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 stagger">
        <div className="glass-card animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-[18px] bg-primary-soft flex items-center justify-center">
              <QrCode className="w-5 h-5 text-primary" />
            </div>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <p className="text-[34px] font-bold text-text-primary">{designCount ?? 0}</p>
          <p className="text-sm text-text-secondary mt-1">Total designs</p>
        </div>

        <div className="glass-card animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-[18px] bg-primary-soft flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <p className="text-[34px] font-bold text-text-primary">{userCount ?? 0}</p>
          <p className="text-sm text-text-secondary mt-1">Utilisateurs</p>
        </div>

        <div className="glass-card animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-[18px] bg-primary-soft flex items-center justify-center">
              <Eye className="w-5 h-5 text-primary" />
            </div>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <p className="text-[34px] font-bold text-text-primary">{totalScans}</p>
          <p className="text-sm text-text-secondary mt-1">Scans ce mois</p>
        </div>
      </div>

      {/* Recent designs grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-text-primary">Designs récents</h3>
          <Link href="/admin/designs" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            Voir tout <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentDesigns && recentDesigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
            {recentDesigns.map((design) => (
              <Link
                key={design.id}
                href={`/admin/designs/${design.id}`}
                className="glass-card card-hover animate-slide-up !p-5"
              >
                <div className="w-full h-28 rounded-[18px] bg-surface-alt flex items-center justify-center mb-4">
                  <QrCode className="w-10 h-10 text-accent/40" />
                </div>
                <h4 className="font-semibold text-sm text-text-primary truncate">{design.title}</h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-text-secondary font-mono">{design.short_id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-[999px] font-medium ${
                    design.is_published
                      ? 'bg-success/10 text-success'
                      : 'bg-surface-alt text-text-secondary'
                  }`}>
                    {design.is_published ? 'Actif' : 'Brouillon'}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-2">{design.scan_count ?? 0} scans</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-card text-center py-12">
            <QrCode className="w-12 h-12 text-accent/30 mx-auto mb-4" />
            <p className="text-text-secondary mb-4">Aucun design créé.</p>
            <Link href="/admin/create" className="btn-primary inline-flex">
              <Plus className="w-4 h-4" />
              Créer un design
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
