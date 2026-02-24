import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/components/auth/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { QR_BASE_URL, PROVIDERS } from '@/lib/constants'
import {
  QrCode, Eye, Zap, Link2, Plus, Edit, Cloud, TrendingUp, Sparkles,
  Pencil, ExternalLink, Check, AlertCircle, X, Trash2, CheckCircle, AlertTriangle,
} from 'lucide-react'
import type { Integration } from '@/types'

const providerIcons: Record<string, string> = {
  google_drive: '📁',
  dropbox: '📦',
  onedrive: '☁️',
}

function extractShortId(input: string): string {
  const trimmed = input.trim()
  const match = trimmed.match(/\/scan\/([A-Za-z0-9_-]+)/)
  if (match) return match[1]
  return trimmed
}

export function UserDashboardPage() {
  const { user, profile } = useAuth()
  const [designs, setDesigns] = useState<any[]>([])
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)

  // Link QR form
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [linkInput, setLinkInput] = useState('')
  const [linkLoading, setLinkLoading] = useState(false)
  const [linkMessage, setLinkMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Integration form
  const [intProvider, setIntProvider] = useState<'google_drive' | 'dropbox' | 'onedrive'>('google_drive')
  const [shareLink, setShareLink] = useState('')
  const [intLabel, setIntLabel] = useState('')
  const [intSaving, setIntSaving] = useState(false)
  const [intError, setIntError] = useState<string | null>(null)
  const [intSuccess, setIntSuccess] = useState(false)

  async function loadDesigns() {
    if (!user) return
    const supabase = createClient()
    const { data } = await supabase
      .from('designs')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })
    setDesigns(data || [])
    setLoading(false)
  }

  async function loadIntegrations() {
    const supabase = createClient()
    const { data } = await supabase
      .from('integrations')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setIntegrations(data)
  }

  useEffect(() => {
    if (!user) return
    loadDesigns()
    loadIntegrations()
  }, [user])

  // --- Link QR ---
  async function handleLinkDesign() {
    if (!user || !linkInput.trim()) return
    setLinkLoading(true)
    setLinkMessage(null)

    const shortId = extractShortId(linkInput)
    const supabase = createClient()

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

    if (design.owner_id === user.id) {
      setLinkMessage({ type: 'error', text: 'Ce design vous appartient déjà.' })
      setLinkLoading(false)
      return
    }

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
    setTimeout(() => { setShowLinkForm(false); setLinkMessage(null) }, 2000)
  }

  // --- Add integration ---
  async function handleAddIntegration() {
    if (!shareLink) return
    setIntError(null)
    setIntSuccess(false)

    try { new URL(shareLink) } catch {
      setIntError('Veuillez entrer une URL valide')
      return
    }

    setIntSaving(true)
    try {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) throw new Error('Non authentifié')

      const { error: dbError } = await supabase.from('integrations').insert({
        user_id: authUser.id,
        provider: intProvider,
        share_link: shareLink,
        label: intLabel || null,
      })
      if (dbError) throw new Error(dbError.message)

      setShareLink('')
      setIntLabel('')
      setIntSuccess(true)
      setTimeout(() => setIntSuccess(false), 3000)
      loadIntegrations()
    } catch (err) {
      setIntError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setIntSaving(false)
    }
  }

  async function handleDeleteIntegration(id: string) {
    const supabase = createClient()
    await supabase.from('integrations').delete().eq('id', id)
    loadIntegrations()
  }

  const totalDesigns = designs.length
  const activeDesigns = designs.filter(d => d.is_published).length
  const totalScans = designs.reduce((sum, d) => sum + (d.scan_count ?? 0), 0)
  const firstName = profile?.full_name?.split(' ')[0] || 'vous'

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-script text-[28px] text-text-primary leading-tight">Bonjour, {firstName}</h2>
          <p className="text-sm text-text-secondary mt-1">Gérez vos créations QR</p>
        </div>
        <Link to="/user/create" className="btn-primary !h-10 !text-sm !px-4">
          <Plus className="w-4 h-4" />Nouveau
        </Link>
      </div>

      {/* Stats */}
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

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 stagger">
        {[
          { icon: Link2, label: 'Lier un QR', onClick: () => { setShowLinkForm(!showLinkForm); setLinkMessage(null) }, accent: true },
          { icon: Edit, label: 'Modifier message', href: '/user/designs', accent: false },
          { icon: Cloud, label: 'Intégrations', scrollTo: 'integrations', accent: false },
        ].map((action) => (
          action.onClick ? (
            <button
              key={action.label}
              onClick={action.onClick}
              className="glass-card card-hover animate-slide-up !p-5 flex flex-col items-center gap-3 text-center group"
            >
              <div className="w-12 h-12 rounded-[18px] flex items-center justify-center transition-transform group-hover:scale-110 bg-primary text-white shadow-sm shadow-primary/20">
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-text-primary">{action.label}</span>
            </button>
          ) : action.scrollTo ? (
            <button
              key={action.label}
              onClick={() => document.getElementById(action.scrollTo!)?.scrollIntoView({ behavior: 'smooth' })}
              className="glass-card card-hover animate-slide-up !p-5 flex flex-col items-center gap-3 text-center group"
            >
              <div className="w-12 h-12 rounded-[18px] flex items-center justify-center transition-transform group-hover:scale-110 bg-primary-soft">
                <action.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-semibold text-text-primary">{action.label}</span>
            </button>
          ) : (
            <Link
              key={action.label}
              to={action.href!}
              className="glass-card card-hover animate-slide-up !p-5 flex flex-col items-center gap-3 text-center group"
            >
              <div className="w-12 h-12 rounded-[18px] flex items-center justify-center transition-transform group-hover:scale-110 bg-primary-soft">
                <action.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-semibold text-text-primary">{action.label}</span>
            </Link>
          )
        ))}
      </div>

      {/* Link QR form */}
      {showLinkForm && (
        <div className="glass-card p-5 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-text-primary">Lier un QR Code à votre compte</h3>
            <button onClick={() => { setShowLinkForm(false); setLinkMessage(null) }} className="text-text-secondary hover:text-text-primary">
              <X size={18} />
            </button>
          </div>
          <p className="text-xs text-text-secondary">
            Collez le lien scan ou le code reçu (ex: CCJROJZcU0 ou https://qrart.vercel.app/scan/CCJROJZcU0)
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

      {/* ============ MES DESIGNS ============ */}
      <div>
        <h3 className="font-semibold text-lg text-text-primary mb-5">Mes designs</h3>

        {designs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {designs.map((design) => (
              <div key={design.id} className="glass-card p-5 space-y-3 card-hover animate-fade-in">
                <div className="w-full h-28 rounded-[18px] bg-surface-alt flex items-center justify-center">
                  <QrCode size={36} className="text-accent" />
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-text-primary">{design.title}</h4>
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
          <div className="glass-card text-center py-16">
            <div className="w-16 h-16 rounded-[24px] bg-primary-soft flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <p className="text-text-primary font-medium">Aucun design pour le moment</p>
            <p className="text-sm text-text-secondary mt-1">Créez votre premier QR code artistique</p>
            <Link to="/user/create" className="btn-primary mt-6 inline-flex">
              <Plus className="w-4 h-4" />Créer mon premier QR
            </Link>
          </div>
        )}
      </div>

      {/* ============ INTÉGRATIONS CLOUD ============ */}
      <div id="integrations">
        <h3 className="font-semibold text-lg text-text-primary mb-5">Intégrations cloud</h3>

        {/* Provider cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {(Object.entries(PROVIDERS) as [keyof typeof PROVIDERS, string][]).map(([key, name]) => {
            const count = integrations.filter((i) => i.provider === key).length
            return (
              <div key={key} className="glass-card !p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-[18px] bg-primary-soft flex items-center justify-center text-lg">
                  {providerIcons[key]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary">{name}</p>
                  <p className="text-xs text-text-secondary">
                    {count > 0 ? `${count} lien${count > 1 ? 's' : ''}` : 'Non connecté'}
                  </p>
                </div>
                {count > 0 && <div className="w-2 h-2 rounded-full bg-success" />}
              </div>
            )
          })}
        </div>

        {/* Add form */}
        <div className="glass-card p-6 space-y-4 mb-6">
          <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Plus size={16} /> Ajouter un lien de partage
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={intProvider}
              onChange={(e) => setIntProvider(e.target.value as typeof intProvider)}
              className="input"
            >
              {Object.entries(PROVIDERS).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
            <input
              type="url"
              value={shareLink}
              onChange={(e) => setShareLink(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="input"
            />
            <input
              type="text"
              value={intLabel}
              onChange={(e) => setIntLabel(e.target.value)}
              placeholder="Nom (optionnel)"
              className="input"
            />
          </div>

          {intError && (
            <div className="bg-danger/10 text-danger p-3 rounded-[16px] text-sm flex items-center gap-2">
              <AlertTriangle size={16} /> {intError}
            </div>
          )}
          {intSuccess && (
            <div className="bg-success/10 text-success p-3 rounded-[16px] text-sm flex items-center gap-2 animate-fade-in">
              <CheckCircle size={16} /> Intégration ajoutée !
            </div>
          )}

          <button
            onClick={handleAddIntegration}
            disabled={intSaving || !shareLink}
            className="btn-primary flex items-center gap-2 !text-sm"
          >
            <Link2 size={16} />
            {intSaving ? 'Ajout...' : 'Ajouter'}
          </button>
        </div>

        {/* List */}
        {integrations.length > 0 ? (
          <div className="glass-card overflow-hidden">
            <ul className="divide-y divide-border">
              {integrations.map((integration) => (
                <li key={integration.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-[12px] bg-surface-alt flex items-center justify-center text-sm shrink-0">
                      {providerIcons[integration.provider]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary">
                        {PROVIDERS[integration.provider as keyof typeof PROVIDERS]} {integration.label ? `— ${integration.label}` : ''}
                      </p>
                      <p className="text-xs text-text-secondary truncate max-w-md">{integration.share_link}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteIntegration(integration.id)}
                    className="p-2 rounded-[12px] text-text-secondary hover:text-danger hover:bg-surface-alt transition-colors shrink-0"
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="glass-card p-8 text-center space-y-2">
            <Cloud size={32} className="text-accent mx-auto" />
            <p className="text-sm text-text-primary">Aucune intégration pour le moment.</p>
            <p className="text-xs text-text-secondary">Ajoutez un lien de partage pour commencer.</p>
          </div>
        )}
      </div>
    </div>
  )
}
