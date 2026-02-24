import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { createClient } from '@/lib/supabase/client'
import { ContentEditor } from '@/components/user/content-editor'
import { QrCode, Eye } from 'lucide-react'
import { QR_BASE_URL } from '@/lib/constants'

export function UserDesignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [design, setDesign] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('designs').select('*').eq('id', id).single()
      setDesign(data)
    }
    load()
  }, [id])

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
        {design.is_published && (
          <a href={`${QR_BASE_URL}/${design.short_id}`} target="_blank" rel="noopener noreferrer" className="btn-secondary !text-xs flex items-center gap-1.5 shrink-0">
            <QrCode size={14} /> Tester le scan
          </a>
        )}
      </div>
      <ContentEditor design={design} />
    </div>
  )
}
