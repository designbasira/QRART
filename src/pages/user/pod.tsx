import { useState } from 'react'
import { ShoppingBag, ExternalLink, AlertTriangle, Package, Truck } from 'lucide-react'
import { isPrintfulConfigured } from '@/lib/pod/printful'
import { isPrintifyConfigured } from '@/lib/pod/printify'

type Provider = 'printful' | 'printify' | null

const PROVIDERS = [
  {
    id: 'printful' as const,
    name: 'Printful',
    description: 'Impression haute qualité, livraison mondiale. 300+ produits.',
    url: 'https://www.printful.com',
    configured: isPrintfulConfigured(),
    features: ['T-shirts', 'Mugs', 'Posters', 'Hoodies', 'Coques'],
  },
  {
    id: 'printify' as const,
    name: 'Printify',
    description: '1300+ produits, réseau de fournisseurs mondial.',
    url: 'https://www.printify.com',
    configured: isPrintifyConfigured(),
    features: ['T-shirts', 'Mugs', 'Sacs', 'Stickers', 'Casquettes'],
  },
]

const SAMPLE_PRODUCTS = [
  { id: 1, name: 'T-shirt Unisex', category: 'Vêtements', price: '18.50', image: null },
  { id: 2, name: 'Mug Céramique 11oz', category: 'Accessoires', price: '9.95', image: null },
  { id: 3, name: 'Poster Mat 18x24', category: 'Décoration', price: '12.00', image: null },
  { id: 4, name: 'Hoodie Premium', category: 'Vêtements', price: '32.00', image: null },
  { id: 5, name: 'Tote Bag', category: 'Accessoires', price: '14.50', image: null },
  { id: 6, name: 'Coque iPhone', category: 'Tech', price: '16.00', image: null },
]

export function PodPage() {
  const [selectedProvider, setSelectedProvider] = useState<Provider>(null)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-[26px] font-bold text-text-primary">Print on Demand</h2>
        <p className="text-sm text-text-secondary mt-1">
          Commandez vos designs sur des produits physiques via nos partenaires POD.
        </p>
      </div>

      {/* Provider selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROVIDERS.map((provider) => (
          <button
            key={provider.id}
            onClick={() => setSelectedProvider(provider.id)}
            className={`glass-card p-5 text-left card-hover transition-all ${
              selectedProvider === provider.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg text-text-primary">{provider.name}</h3>
                <p className="text-xs text-text-secondary mt-1">{provider.description}</p>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-[999px] font-semibold ${
                provider.configured ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
              }`}>
                {provider.configured ? 'Connecté' : 'Non configuré'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {provider.features.map((f) => (
                <span key={f} className="text-[10px] bg-surface-alt text-text-secondary px-2 py-0.5 rounded-[999px]">
                  {f}
                </span>
              ))}
            </div>
            <a
              href={provider.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-xs text-primary mt-3 hover:underline"
            >
              Voir le site <ExternalLink size={11} />
            </a>
          </button>
        ))}
      </div>

      {/* Selected provider content */}
      {selectedProvider && (
        <div className="space-y-4 animate-fade-in">
          {!PROVIDERS.find(p => p.id === selectedProvider)?.configured && (
            <div className="glass-card p-5 border-l-4 border-warning">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-warning shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-text-primary text-sm">Configuration requise</h4>
                  <p className="text-xs text-text-secondary mt-1">
                    Pour commander via {selectedProvider === 'printful' ? 'Printful' : 'Printify'}, ajoutez votre clé API dans les variables d'environnement :
                  </p>
                  <code className="block mt-2 text-xs bg-surface-alt text-text-primary px-3 py-2 rounded-[12px] font-mono">
                    {selectedProvider === 'printful' ? 'VITE_PRINTFUL_API_KEY' : 'VITE_PRINTIFY_API_KEY'}=votre_clé_api
                  </code>
                  <a
                    href={selectedProvider === 'printful' ? 'https://developers.printful.com' : 'https://developers.printify.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary mt-2 hover:underline"
                  >
                    Obtenir une clé API <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Product catalog preview */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Package size={18} /> Catalogue produits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SAMPLE_PRODUCTS.map((product) => (
                <div key={product.id} className="bg-surface-alt rounded-[16px] p-4 space-y-2">
                  <div className="w-full h-24 rounded-[12px] bg-surface flex items-center justify-center">
                    <ShoppingBag size={24} className="text-text-secondary/30" />
                  </div>
                  <h4 className="font-semibold text-sm text-text-primary">{product.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-primary-soft text-primary px-2 py-0.5 rounded-[999px]">
                      {product.category}
                    </span>
                    <span className="font-bold text-sm text-text-primary">{product.price} &euro;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order flow info */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Truck size={18} /> Comment ça marche
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { step: '01', title: 'Créez', desc: 'Créez votre design dans le Studio avec fond transparent' },
                { step: '02', title: 'Choisissez', desc: 'Sélectionnez un produit et personnalisez les options' },
                { step: '03', title: 'Commandez', desc: 'Passez commande, le fournisseur imprime et expédie' },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <span className="font-script text-3xl text-primary">{s.step}</span>
                  <h4 className="font-semibold text-text-primary mt-1">{s.title}</h4>
                  <p className="text-xs text-text-secondary mt-1">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
