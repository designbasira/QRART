import { useState, useEffect } from 'react'
import { Store, ExternalLink, AlertTriangle, Check, Upload, ShoppingBag } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { isEtsyConfigured } from '@/lib/etsy/client'

export function EtsyPage() {
  const { user } = useAuth()
  const [designs, setDesigns] = useState<any[]>([])
  const [connected, setConnected] = useState(false)
  const [shopName, setShopName] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    async function load() {
      const supabase = createClient()
      // Load user designs
      const { data } = await supabase
        .from('designs')
        .select('*')
        .eq('owner_id', user!.id)
        .order('created_at', { ascending: false })
      setDesigns(data || [])

      // Check Etsy connection
      const { data: etsy } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user!.id)
        .eq('provider', 'etsy')
        .limit(1)
        .single()

      if (etsy) {
        setConnected(true)
        setShopName(etsy.label || 'Ma boutique Etsy')
      }
    }
    load()
  }, [user])

  const configured = isEtsyConfigured()

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-[26px] font-bold text-text-primary flex items-center gap-3">
          <Store size={28} className="text-primary" /> Etsy
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Publiez vos designs directement dans votre boutique Etsy.
        </p>
      </div>

      {/* Configuration status */}
      {!configured && (
        <div className="glass-card p-5 border-l-4 border-warning">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-warning shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-text-primary text-sm">Configuration requise</h4>
              <p className="text-xs text-text-secondary mt-1">
                Pour connecter votre boutique Etsy, vous devez d'abord créer une application sur le portail développeur Etsy et ajouter la clé API.
              </p>
              <div className="mt-3 space-y-2">
                <p className="text-xs text-text-secondary">1. Créez une app sur <a href="https://developers.etsy.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">developers.etsy.com</a></p>
                <p className="text-xs text-text-secondary">2. Ajoutez la variable d'environnement :</p>
                <code className="block text-xs bg-surface-alt text-text-primary px-3 py-2 rounded-[12px] font-mono">
                  VITE_ETSY_API_KEY=votre_api_keystring
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection status */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center ${connected ? 'bg-success/10' : 'bg-surface-alt'}`}>
              <Store size={22} className={connected ? 'text-success' : 'text-text-secondary'} />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">
                {connected ? shopName : 'Boutique non connectée'}
              </h3>
              <p className="text-xs text-text-secondary">
                {connected ? 'Connecté et prêt à publier' : 'Connectez votre boutique pour publier'}
              </p>
            </div>
          </div>
          {connected ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-success bg-success/10 px-3 py-1.5 rounded-[999px]">
              <Check size={14} /> Connecté
            </span>
          ) : (
            <button
              disabled={!configured}
              className="btn-primary !text-sm disabled:opacity-50"
              onClick={() => {
                // OAuth flow will be implemented when API key is available
                alert('Configurez d\'abord votre clé API Etsy dans les variables d\'environnement.')
              }}
            >
              Connecter Etsy
            </button>
          )}
        </div>
      </div>

      {/* Designs to publish */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Upload size={18} /> Publier un design
        </h3>

        {designs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {designs.map((design) => (
              <div key={design.id} className="bg-surface-alt rounded-[16px] p-4 space-y-3">
                <div className="w-full h-24 rounded-[12px] bg-surface flex items-center justify-center">
                  <ShoppingBag size={24} className="text-text-secondary/30" />
                </div>
                <h4 className="font-semibold text-sm text-text-primary">{design.title}</h4>
                <p className="text-[11px] text-text-secondary font-mono">{design.short_id}</p>
                <button
                  disabled={!connected}
                  className="btn-primary w-full !text-xs !py-2 disabled:opacity-50"
                  onClick={() => {
                    if (!connected) {
                      alert('Connectez d\'abord votre boutique Etsy.')
                      return
                    }
                    // Listing creation flow
                    alert('Publication Etsy : fonctionnalité en cours de développement. Connectez votre boutique pour l\'activer.')
                  }}
                >
                  Publier sur Etsy
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-text-secondary text-sm">Aucun design à publier.</p>
            <p className="text-xs text-text-secondary/70 mt-1">Créez des designs dans le Studio pour les publier ici.</p>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-text-primary mb-4">Comment ça marche</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Connectez', desc: 'Liez votre boutique Etsy via OAuth' },
            { step: '02', title: 'Sélectionnez', desc: 'Choisissez un design à publier' },
            { step: '03', title: 'Personnalisez', desc: 'Ajoutez titre, description, prix et tags' },
            { step: '04', title: 'Publiez', desc: 'Le listing est créé dans votre boutique' },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <span className="font-script text-2xl text-primary">{s.step}</span>
              <h4 className="font-semibold text-sm text-text-primary mt-1">{s.title}</h4>
              <p className="text-[11px] text-text-secondary mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* External link */}
      <a
        href="https://www.etsy.com/your/shops/me"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
      >
        Ouvrir Etsy Seller Dashboard <ExternalLink size={14} />
      </a>
    </div>
  )
}
