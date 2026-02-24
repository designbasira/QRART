import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { Plus, Eye, QrCode, ArrowRight } from 'lucide-react'

export function AdminDesignsPage() {
  const [designs, setDesigns] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('designs')
        .select('*, profiles!designs_owner_id_fkey(full_name, email)')
        .order('created_at', { ascending: false })
      setDesigns(data || [])
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[26px] font-bold text-text-primary">Tous les designs</h2>
        <Link to="/admin/create" className="btn-primary flex items-center gap-2 !text-sm"><Plus size={16} /> Nouveau</Link>
      </div>
      <div className="glass-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-alt/50 border-b border-border">
            <tr>
              <th className="text-left px-5 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wider">Titre</th>
              <th className="text-left px-5 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wider">ID QR</th>
              <th className="text-left px-5 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wider hidden md:table-cell">Propriétaire</th>
              <th className="text-left px-5 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wider">Scans</th>
              <th className="text-left px-5 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wider">Statut</th>
              <th className="text-left px-5 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wider hidden lg:table-cell">Date</th>
              <th className="px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {designs.map((design) => (
              <tr key={design.id} className="hover:bg-surface-alt/30 transition-colors duration-150">
                <td className="px-5 py-3.5 font-medium text-text-primary">{design.title}</td>
                <td className="px-5 py-3.5"><span className="font-mono text-[11px] bg-surface-alt px-2 py-0.5 rounded-[999px] text-text-secondary">{design.short_id}</span></td>
                <td className="px-5 py-3.5 text-text-secondary hidden md:table-cell">{(design.profiles as any)?.full_name || (design.profiles as any)?.email || '—'}</td>
                <td className="px-5 py-3.5"><span className="flex items-center gap-1 text-text-secondary"><Eye size={13} /> {design.scan_count}</span></td>
                <td className="px-5 py-3.5"><span className={`text-[11px] px-2.5 py-0.5 rounded-[999px] font-medium ${design.is_published ? 'bg-success/10 text-success' : 'bg-surface-alt text-text-secondary'}`}>{design.is_published ? 'Publié' : 'Brouillon'}</span></td>
                <td className="px-5 py-3.5 text-text-secondary text-xs hidden lg:table-cell">{formatDate(design.created_at)}</td>
                <td className="px-5 py-3.5"><Link to={`/admin/designs/${design.id}`} className="text-primary hover:text-primary/80 text-xs font-semibold flex items-center gap-1 transition-colors">Détails <ArrowRight size={12} /></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {designs.length === 0 && (
          <div className="p-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-[18px] bg-primary-soft flex items-center justify-center mx-auto"><QrCode size={24} className="text-primary" /></div>
            <p className="text-text-secondary">Aucun design.</p>
          </div>
        )}
      </div>
    </div>
  )
}
