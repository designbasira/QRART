import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { createClient } from '@/lib/supabase/client'
import { APP_NAME, QR_BASE_URL } from '@/lib/constants'
import { Eye, MessageCircle, Image, ExternalLink, QrCode } from 'lucide-react'
import { ScanShareButtons } from '@/components/scan/share-buttons'

export function ScanPage() {
  const { id } = useParams<{ id: string }>()
  const [design, setDesign] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('designs')
        .select('*')
        .eq('short_id', id)
        .eq('is_active', true)
        .single()
      setDesign(data)
      setLoading(false)
      // Update page title
      if (data) document.title = `${data.title} - ${APP_NAME}`
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-[18px] bg-primary-soft flex items-center justify-center animate-pulse">
          <span className="text-primary font-bold">Q</span>
        </div>
      </div>
    )
  }

  if (!design) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="glass-card p-8 text-center space-y-4">
          <QrCode size={32} className="text-accent mx-auto" />
          <p className="text-text-secondary">Ce QR Code n'existe pas ou n'est plus actif.</p>
          <Link to="/" className="btn-primary inline-flex">Retour</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg glass-card p-8 space-y-6 animate-fade-in">
        <div className="text-center space-y-1">
          <p className="text-xs text-accent uppercase tracking-[0.2em] font-medium">{APP_NAME}</p>
          <h1 className="text-2xl font-bold text-text-primary font-serif">{design.title}</h1>
        </div>

        {design.content_type === 'text' && design.current_message && (
          <div className="bg-surface-alt rounded-[18px] p-6 animate-slide-up">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-[12px] bg-primary-soft flex items-center justify-center shrink-0 mt-0.5">
                <MessageCircle size={16} className="text-primary" />
              </div>
              <p className="text-text-primary whitespace-pre-wrap leading-relaxed">{design.current_message}</p>
            </div>
          </div>
        )}

        {design.content_type === 'image' && design.current_media_url && (
          <div className="rounded-[18px] overflow-hidden animate-slide-up">
            <img src={design.current_media_url} alt={design.title} className="w-full h-auto rounded-[18px]" />
          </div>
        )}

        {design.content_type === 'link' && design.current_media_url && (
          <div className="text-center animate-slide-up">
            <a href={design.current_media_url} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
              <ExternalLink size={16} /> Ouvrir le lien
            </a>
          </div>
        )}

        {!design.current_message && !design.current_media_url && (
          <div className="text-center py-8 space-y-2">
            <div className="w-14 h-14 rounded-[18px] bg-surface-alt flex items-center justify-center mx-auto">
              <Image size={24} className="text-accent" />
            </div>
            <p className="text-text-secondary">Aucun contenu pour le moment.</p>
            <p className="text-xs text-text-secondary">Le propriétaire n&apos;a pas encore personnalisé ce design.</p>
          </div>
        )}

        <div className="text-center pt-2">
          <span className="glass-pill inline-flex items-center gap-1.5 text-xs text-text-secondary">
            <Eye size={12} /> {design.scan_count} scans
          </span>
        </div>

        <ScanShareButtons url={`${QR_BASE_URL}/scan/${id}`} title={design.title} />

        <div className="text-center pt-2 space-y-3">
          <div className="w-full h-px bg-border" />
          <p className="text-xs text-text-secondary">Créez votre propre QR Code artistique</p>
          <Link to="/signup" className="btn-primary inline-flex items-center gap-2">
            <QrCode size={16} /> Créer mon QR Code
          </Link>
        </div>
      </div>
    </div>
  )
}
