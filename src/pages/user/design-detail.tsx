import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createClient } from '@/lib/supabase/client'
import { ContentEditor } from '@/components/user/content-editor'
import { QrCode, Eye, Globe, GlobeLock, Trash2, AlertTriangle } from 'lucide-react'
import { QR_BASE_URL } from '@/lib/constants'

export function UserDesignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [design, setDesign] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('designs').select('*').eq('id', id).single()
      setDesign(data)
    }
    load()
  }, [id])

  async function handleTogglePublish() {
    if (!design) return
    setSaving(true)
    const supabase = createClient()
    const { data } = await supabase.from('designs').update({ is_published: !design.is_published }).eq('id', design.id).select().single()
    if (data) setDesign(data)
    setSaving(false)
  }

  async function handleDelete() {
    if (!design || !confirm('Supprimer ce design définitivement ?')) return
    const supabase = createClient()
    await supabase.from('designs').delete().eq('id', design.id)
    navigate('/user/designs')
  }

  if (!design) {
    return <div className="space-y-6 animate-pulse"><div className="h-8 w-48 bg-surface-alt rounded-[18px]" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-[26px] font-bold text-text-primary">{design.title}</h2>
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <span className="font-mono bg-surface-alt px-2 py-0.5 rounded-[999px]">{design.short_id}</span>
            <span className="flex items-center gap-1"><Eye size={12} /> {design.scan_count} scans</span>
            <span className={`px-2 py-0.5 rounded-[999px] font-medium ${design.is_published ? 'bg-success/10 text-success' : 'bg-surface-alt text-text-secondary'}`}>
              {design.is_published ? 'Publié' : 'Brouillon'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={handleTogglePublish} disabled={saving} className="btn-secondary !text-xs flex items-center gap-1.5">
            {design.is_published ? <><GlobeLock size={14} /> Dépublier</> : <><Globe size={14} /> Publier</>}
          </button>
          {design.is_published && (
            <a href={`${QR_BASE_URL}/${design.short_id}`} target="_blank" rel="noopener noreferrer" className="btn-secondary !text-xs flex items-center gap-1.5">
              <QrCode size={14} /> Tester
            </a>
          )}
        </div>
      </div>

      <ContentEditor design={design} />

      {/* Zone danger */}
      <div className="glass-card p-5 border border-danger/30 space-y-3">
        <div className="flex items-center gap-2 text-danger">
          <AlertTriangle size={16} />
          <h3 className="text-sm font-semibold">Zone dangereuse</h3>
        </div>
        <p className="text-xs text-text-secondary">Cette action est irréversible. Le design et toutes ses données seront supprimés.</p>
        <button onClick={handleDelete} className="btn-danger flex items-center gap-2 !text-xs">
          <Trash2 size={14} /> Supprimer ce design
        </button>
      </div>
    </div>
  )
}
