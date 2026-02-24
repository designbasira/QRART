import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createClient } from '@/lib/supabase/client'
import { QR_BASE_URL } from '@/lib/constants'
import {
  Eye, Copy, CheckCircle, Globe, GlobeLock, Trash2, UserPlus,
  AlertTriangle, Link2, BarChart3, ArrowLeft, Clock,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Design, Profile } from '@/types'

interface ScanLog {
  id: string
  created_at: string
  ip_address: string | null
  user_agent: string | null
}

export function AdminDesignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [design, setDesign] = useState<Design | null>(null)
  const [users, setUsers] = useState<Profile[]>([])
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([])
  const [selectedOwner, setSelectedOwner] = useState('')
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!id) return
    async function load() {
      const supabase = createClient()
      const [designRes, usersRes, logsRes] = await Promise.all([
        supabase.from('designs').select('*').eq('id', id).single(),
        supabase.from('profiles').select('*').eq('role', 'user'),
        supabase.from('scan_logs').select('*').eq('design_id', id).order('created_at', { ascending: false }).limit(10),
      ])
      if (designRes.data) { setDesign(designRes.data as Design); setSelectedOwner((designRes.data as Design).owner_id) }
      if (usersRes.data) setUsers(usersRes.data as Profile[])
      if (logsRes.data) setScanLogs(logsRes.data as ScanLog[])
    }
    load()
  }, [id])

  async function handleTogglePublish() {
    if (!design) return
    setSaving(true)
    const supabase = createClient()
    const res = await supabase.from('designs').update({ is_published: !design.is_published }).eq('id', design.id).select().single()
    if (res.data) setDesign(res.data as Design)
    setSaving(false)
  }

  async function handleAssign() {
    if (!design || !selectedOwner) return
    setSaving(true)
    const supabase = createClient()
    const res = await supabase.from('designs').update({ owner_id: selectedOwner }).eq('id', design.id).select().single()
    if (res.data) setDesign(res.data as Design)
    setSaving(false)
  }

  async function handleDelete() {
    if (!design || !confirm('Supprimer ce design ?')) return
    const supabase = createClient()
    await supabase.from('designs').delete().eq('id', design.id)
    navigate('/admin/designs')
  }

  function copyScanUrl() {
    if (!design) return
    navigator.clipboard.writeText(`${QR_BASE_URL}/${design.short_id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!design) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-surface-alt rounded-[18px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 h-64" />
          <div className="glass-card p-6 h-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/designs')} className="p-2 rounded-[18px] hover:bg-surface-alt transition-colors">
          <ArrowLeft size={18} className="text-text-secondary" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-[26px] font-bold text-text-primary truncate">{design.title}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-mono text-xs bg-surface-alt px-2.5 py-1 rounded-[999px] text-text-secondary">{design.short_id}</span>
            <span className={`text-xs px-2.5 py-1 rounded-[999px] font-medium ${design.is_published ? 'bg-success/10 text-success' : 'bg-surface-alt text-text-secondary'}`}>{design.is_published ? 'Publié' : 'Brouillon'}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 space-y-5">
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2"><BarChart3 size={18} /> Informations</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <dt className="text-text-secondary">URL de scan</dt>
              <dd className="flex items-center gap-2">
                <code className="font-mono text-xs text-text-secondary bg-surface-alt px-2 py-1 rounded-[12px] max-w-[200px] truncate">{QR_BASE_URL}/{design.short_id}</code>
                <button onClick={copyScanUrl} className="p-1.5 rounded-[12px] hover:bg-surface-alt transition-colors">
                  {copied ? <CheckCircle size={14} className="text-success" /> : <Copy size={14} className="text-text-secondary" />}
                </button>
              </dd>
            </div>
            <div className="flex justify-between"><dt className="text-text-secondary">Scans</dt><dd className="font-semibold text-text-primary flex items-center gap-1.5"><Eye size={14} className="text-primary" /> {design.scan_count}</dd></div>
            <div className="flex justify-between"><dt className="text-text-secondary">Type de contenu</dt><dd className="capitalize text-text-primary">{design.content_type}</dd></div>
            <div className="flex justify-between"><dt className="text-text-secondary">Créé le</dt><dd className="text-text-primary">{formatDate(design.created_at)}</dd></div>
          </dl>
          {design.silhouette_image_url && (
            <div>
              <p className="text-xs text-text-secondary mb-2">Silhouette</p>
              <img src={design.silhouette_image_url} alt="Silhouette" className="rounded-[18px] border border-border max-h-40 w-full object-contain bg-surface-alt" />
            </div>
          )}
          <button onClick={handleTogglePublish} disabled={saving} className="btn-secondary w-full flex items-center justify-center gap-2">
            {design.is_published ? <><GlobeLock size={16} /> Dépublier</> : <><Globe size={16} /> Publier</>}
          </button>
        </div>
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2"><UserPlus size={18} /> Assigner à un utilisateur</h3>
            <select value={selectedOwner} onChange={(e) => setSelectedOwner(e.target.value)} className="input w-full">
              {users.map((user) => (<option key={user.id} value={user.id}>{user.full_name || user.email}</option>))}
            </select>
            <button onClick={handleAssign} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
              <Link2 size={16} /> {saving ? 'Assignation...' : 'Assigner'}
            </button>
          </div>
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2"><Clock size={18} /> Derniers scans</h3>
            {scanLogs.length > 0 ? (
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {scanLogs.map((log) => (
                  <li key={log.id} className="flex items-center justify-between text-xs bg-surface-alt rounded-[12px] px-3 py-2">
                    <span className="text-text-secondary">{new Date(log.created_at).toLocaleString('fr-FR')}</span>
                    <span className="text-text-secondary font-mono truncate max-w-[120px]">{log.ip_address || '—'}</span>
                  </li>
                ))}
              </ul>
            ) : (<p className="text-sm text-text-secondary">Aucun scan enregistré.</p>)}
          </div>
          <div className="glass-card p-6 space-y-4 border border-danger/30">
            <div className="flex items-center gap-2 text-danger"><AlertTriangle size={16} /><h3 className="text-sm font-semibold">Supprimer ce design</h3></div>
            <button onClick={handleDelete} className="btn-danger flex items-center gap-2"><Trash2 size={16} /> Supprimer définitivement</button>
          </div>
        </div>
      </div>
    </div>
  )
}
