import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/components/auth/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { QR_BASE_URL } from '@/lib/constants'
import { Eye, QrCode, ExternalLink, Pencil } from 'lucide-react'

export function UserDesignsPage() {
  const { user } = useAuth()
  const [designs, setDesigns] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('designs').select('*').eq('owner_id', user!.id).order('created_at', { ascending: false })
      setDesigns(data || [])
    }
    load()
  }, [user])

  return (
    <div className="space-y-6">
      <h2 className="text-[26px] font-bold text-text-primary">Mes designs</h2>
      {designs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {designs.map((design) => (
            <div key={design.id} className="glass-card p-5 space-y-3 card-hover animate-fade-in">
              <div className="w-full h-28 rounded-[18px] bg-surface-alt flex items-center justify-center">
                <QrCode size={36} className="text-accent" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-text-primary">{design.title}</h3>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-[999px] font-medium ${design.is_published ? 'bg-success/10 text-success' : 'bg-surface-alt text-text-secondary'}`}>
                  {design.is_published ? 'Publié' : 'Brouillon'}
                </span>
              </div>
              <p className="text-xs text-text-secondary truncate">{design.current_message || 'Aucun message'}</p>
              <div className="flex items-center gap-3 text-xs text-text-secondary">
                <span className="flex items-center gap-1"><Eye size={13} /> {design.scan_count}</span>
                <span className="font-mono text-[11px] bg-surface-alt px-2 py-0.5 rounded-[999px]">{design.short_id}</span>
              </div>
              <div className="flex gap-2 pt-1">
                <Link to={`/user/designs/${design.id}`} className="btn-primary flex-1 text-center !py-2 !text-xs flex items-center justify-center gap-1.5">
                  <Pencil size={13} /> Modifier
                </Link>
                {design.is_published && (
                  <a href={`${QR_BASE_URL}/${design.short_id}`} target="_blank" rel="noopener noreferrer" className="btn-secondary !py-2 !text-xs flex items-center gap-1.5">
                    <ExternalLink size={13} /> Tester
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-10 text-center space-y-3">
          <div className="w-14 h-14 rounded-[18px] bg-primary-soft flex items-center justify-center mx-auto">
            <QrCode size={24} className="text-primary" />
          </div>
          <p className="text-text-secondary">Aucun design assigné pour le moment.</p>
        </div>
      )}
    </div>
  )
}
