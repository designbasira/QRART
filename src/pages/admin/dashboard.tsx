import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { createClient } from '@/lib/supabase/client'
import { QrCode, Users, Plus, Eye, TrendingUp, ArrowRight, Sparkles, BarChart3 } from 'lucide-react'

export function AdminDashboardPage() {
  const [designCount, setDesignCount] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [recentDesigns, setRecentDesigns] = useState<any[]>([])
  const [totalScans, setTotalScans] = useState(0)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const [designRes, userRes, recentRes] = await Promise.all([
        supabase.from('designs').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
        supabase.from('designs').select('*').order('created_at', { ascending: false }).limit(4),
      ])
      setDesignCount(designRes.count ?? 0)
      setUserCount(userRes.count ?? 0)
      setRecentDesigns(recentRes.data || [])
      setTotalScans((recentRes.data || []).reduce((sum: number, d: any) => sum + (d.scan_count ?? 0), 0))
    }
    load()
  }, [])

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[26px] font-bold text-text-primary">Tableau de bord</h2>
          <p className="text-sm text-text-secondary mt-1">Administration Silhouette QR Live</p>
        </div>
        <Link to="/admin/create" className="btn-primary"><Plus className="w-4 h-4" />Nouveau design</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 stagger">
        {[
          { icon: QrCode, value: designCount, label: 'Total designs', color: 'text-primary' },
          { icon: Users, value: userCount, label: 'Utilisateurs', color: 'text-primary' },
          { icon: BarChart3, value: totalScans, label: 'Scans ce mois', color: 'text-primary' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card animate-slide-up group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-[18px] bg-primary-soft flex items-center justify-center group-hover:scale-110 transition-transform">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <p className="text-[34px] font-bold text-text-primary leading-none">{stat.value}</p>
            <p className="text-sm text-text-secondary mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg text-text-primary">Designs récents</h3>
          <Link to="/admin/designs" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">Voir tout <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
        {recentDesigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
            {recentDesigns.map((design) => (
              <Link key={design.id} to={`/admin/designs/${design.id}`} className="glass-card card-hover animate-slide-up !p-5 group">
                <div className="w-full h-28 rounded-[18px] bg-gradient-to-b from-surface-alt to-surface flex items-center justify-center mb-4 group-hover:from-primary-soft/30 transition-colors">
                  <QrCode className="w-10 h-10 text-accent/30 group-hover:text-primary/30 transition-colors" />
                </div>
                <h4 className="font-semibold text-sm text-text-primary truncate">{design.title}</h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-text-secondary font-mono tracking-wider">{design.short_id}</span>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-[999px] font-semibold ${design.is_published ? 'bg-success/10 text-success' : 'bg-surface-alt text-text-secondary'}`}>
                    {design.is_published ? 'Actif' : 'Brouillon'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-text-secondary"><Eye className="w-3 h-3" />{design.scan_count ?? 0} scans</div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-card text-center py-16">
            <div className="w-16 h-16 rounded-[24px] bg-primary-soft flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <p className="text-text-secondary font-medium">Aucun design créé</p>
            <p className="text-sm text-text-secondary/70 mt-1">Commencez par créer votre premier design QR</p>
            <Link to="/admin/create" className="btn-primary mt-6 inline-flex"><Plus className="w-4 h-4" />Créer un design</Link>
          </div>
        )}
      </div>
    </div>
  )
}
