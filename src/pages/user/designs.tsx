import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/components/auth/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { QR_BASE_URL } from '@/lib/constants'
import { Eye, QrCode, ExternalLink, Pencil, Link2, Check, AlertCircle, X } from 'lucide-react'

function extractShortId(input: string): string {
  const trimmed = input.trim()
  const match = trimmed.match(/\/scan\/([A-Za-z0-9_-]+)/)
  if (match) return match[1]
  return trimmed
}

export function UserDesignsPage() {
  const { user } = useAuth()
  const [designs, setDesigns] = useState<any[]>([])
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [linkInput, setLinkInput] = useState('')
  const [linkLoading, setLinkLoading] = useState(false)
  const [linkMessage, setLinkMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function loadDesigns() {
    if (!user) return
    const supabase = createClient()
    const { data } = await supabase.from('designs').select('*').eq('owner_id', user.id).order('created_at', { ascending: false })
    setDesigns(data || [])
  }

  useEffect(() => {
    loadDesigns()
  }, [user])

  async function handleLinkDesign() {
    if (!user || !linkInput.trim()) return
    setLinkLoading(true)
    setLinkMessage(null)

    const shortId = extractShortId(linkInput)
    const supabase = createClient()

    // 1. Chercher le design par short_id
    const { data: design, error } = await supabase
      .from('designs')
      .select('id, owner_id, short_id')
      .eq('short_id', shortId)
      .single()

    if (error || !design) {
      setLinkMessage({ type: 'error', text: 'Design introuvable. Vérifiez le code ou le lien.' })
      setLinkLoading(false)
      return
    }

    // 2. Vérifier propriété
    if (design.owner_id === user.id) {
      setLinkMessage({ type: 'error', text: 'Ce design vous appartient déjà.' })
      setLinkLoading(false)
      return
    }

    // 3. Vérifier si un autre utilisateur (non-admin) possède déjà ce design
    if (design.owner_id) {
      const { data: ownerProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', design.owner_id)
        .single()

      if (ownerProfile?.role === 'user') {
        setLinkMessage({ type: 'error', text: 'Ce design appartient déjà à un autre utilisateur.' })
        setLinkLoading(false)
        return
      }
    }

    // 4. Assigner le design à l'utilisateur
    const { error: updateError } = await supabase
      .from('designs')
      .update({ owner_id: user.id })
      .eq('id', design.id)

    if (updateError) {
      setLinkMessage({ type: 'error', text: 'Erreur lors de la liaison. Réessayez.' })
      setLinkLoading(false)
      return
    }

    setLinkMessage({ type: 'success', text: 'Design lié avec succès !' })
    setLinkInput('')
    setLinkLoading(false)
    loadDesigns()

    setTimeout(() => {
      setShowLinkForm(false)
      setLinkMessage(null)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[26px] font-bold text-text-primary">Mes designs</h2>
        <button
          onClick={() => { setShowLinkForm(!showLinkForm); setLinkMessage(null) }}
          className="btn-primary !h-10 !text-sm !px-4 flex items-center gap-2"
        >
          <Link2 size={16} />
          Lier un QR Code
        </button>
      </div>

      {showLinkForm && (
        <div className="glass-card p-5 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-text-primary">Lier un QR Code à votre compte</h3>
            <button onClick={() => { setShowLinkForm(false); setLinkMessage(null) }} className="text-text-secondary hover:text-text-primary">
              <X size={18} />
            </button>
          </div>
          <p className="text-xs text-text-secondary">
            Collez le lien scan ou le code reçu de l'administrateur (ex: CCJROJZcU0 ou https://qrart.vercel.app/scan/CCJROJZcU0)
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="Code ou lien du QR..."
              className="flex-1 h-12 px-4 rounded-[16px] bg-surface-alt border border-border text-text-primary placeholder:text-text-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              onKeyDown={(e) => e.key === 'Enter' && handleLinkDesign()}
            />
            <button
              onClick={handleLinkDesign}
              disabled={linkLoading || !linkInput.trim()}
              className="btn-primary !h-12 !px-6 !text-sm disabled:opacity-50"
            >
              {linkLoading ? 'Liaison...' : 'Lier'}
            </button>
          </div>
          {linkMessage && (
            <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-[16px] ${
              linkMessage.type === 'success' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
            }`}>
              {linkMessage.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
              {linkMessage.text}
            </div>
          )}
        </div>
      )}

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
          <p className="text-xs text-text-secondary/70 mt-1">Cliquez sur "Lier un QR Code" pour ajouter un design reçu de l'administrateur.</p>
        </div>
      )}
    </div>
  )
}
