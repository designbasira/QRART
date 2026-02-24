import { Link } from 'react-router-dom'
import { APP_NAME } from '@/lib/constants'
import {
  Sparkles,
  QrCode,
  Upload,
  ChevronDown,
  ChevronRight,
  Check,
  Shirt,
  Coffee,
  Frame,
  Globe,
  ArrowRight,
  Scan,
  Palette,
  Layers,
} from 'lucide-react'

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ============ HEADER — Glass fixed ============ */}
      <nav className="fixed top-0 inset-x-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="font-serif font-bold text-lg tracking-tight text-text-primary">
            {APP_NAME}
          </span>

          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Comment ça marche
            </a>
            <a href="#pricing" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Tarifs
            </a>
            <a href="#faq" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-[999px] bg-surface-alt text-xs font-medium text-text-secondary">
              <Globe className="w-3.5 h-3.5" />
              FR
            </div>
            <Link
              to="/login"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Se connecter
            </Link>
            <Link
              to="/signup"
              className="btn-primary !h-10 !text-sm !px-5 !rounded-[18px]"
            >
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* ============ HERO — Fashion Editorial (Image 1 PROPELLD + Image 5 Adidas) ============ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background decorative layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* LARGE vertical brand text — like PROPELLD (Image 1) */}
          <div
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 font-serif text-[100px] md:text-[140px] lg:text-[180px] xl:text-[220px] font-bold leading-none tracking-[-0.04em] text-accent/[0.15] select-none"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            SILHOUETTE
          </div>

          {/* Large semi-transparent background letters — like "ELEC" in Image 1 */}
          <div className="absolute right-0 bottom-0 font-serif text-[220px] md:text-[320px] lg:text-[400px] font-bold text-accent/[0.04] leading-none select-none tracking-tighter">
            QR
          </div>

          {/* Decorative geometric shapes — rotating (Image 5 style) */}
          <div className="absolute top-[20%] right-[10%] w-40 h-40 border border-border/30 rounded-[28px] rotate-45 animate-spin-slow opacity-20" />
          <div className="absolute bottom-[25%] left-[15%] w-24 h-24 border border-accent/20 rounded-[18px] rotate-12 animate-spin-slow opacity-15" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-6 items-center">
            {/* Left: Content */}
            <div className="animate-fade-in max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[999px] bg-primary-soft text-primary text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                Print-on-Demand intelligent
              </div>

              <h1 className="font-serif text-[36px] sm:text-[46px] lg:text-[54px] font-bold tracking-tight leading-[1.08] text-text-primary">
                Vos silhouettes deviennent des{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  QR Codes vivants
                </span>
              </h1>

              <p className="mt-6 text-lg text-text-secondary max-w-lg leading-relaxed">
                Transformez vos photos en QR codes artistiques imprimés sur des produits personnalisés. Le contenu reste modifiable à tout moment.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="btn-primary">
                  Créer mon QR gratuit
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#how-it-works" className="btn-secondary">
                  Découvrir le concept
                </a>
              </div>

              {/* Credits — fashion editorial style like Image 1 bottom-left */}
              <div className="mt-20 hidden lg:block">
                <div className="flex items-center gap-6 text-[11px] text-text-secondary/50 uppercase tracking-widest">
                  <span>Design by Basira Design</span>
                  <span className="w-8 h-px bg-border" />
                  <span>2026</span>
                </div>
              </div>
            </div>

            {/* Right: Product Hero with floating glass elements */}
            <div className="relative animate-slide-up hidden lg:flex justify-center">
              {/* Main product area */}
              <div className="relative w-[420px] h-[520px]">
                {/* Product container */}
                <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-surface-alt/80 to-surface/60 border border-border/50 flex items-center justify-center overflow-hidden">
                  <div className="relative w-60 h-72 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-primary-soft/40 to-accent/10" />
                    <QrCode className="w-28 h-28 text-accent/40 relative z-10" />
                    <Shirt className="absolute w-48 h-48 text-accent/10" />
                  </div>
                </div>

                {/* ===== Floating glass panels (Image 1 + 5 style) ===== */}

                {/* Top-right: Color swatches panel */}
                <div className="absolute -top-3 -right-10 glass-card !p-3.5 !rounded-[18px] animate-float-slow shadow-lg" style={{ animationDelay: '0s' }}>
                  <div className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">Couleur</div>
                  <div className="text-sm font-bold text-text-primary mt-1.5">Blanc Premium</div>
                  <div className="flex gap-2 mt-2.5">
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-primary ring-2 ring-primary/20" />
                    <div className="w-6 h-6 rounded-full bg-text-primary border border-border" />
                    <div className="w-6 h-6 rounded-full bg-accent border border-border" />
                    <div className="w-6 h-6 rounded-full bg-primary-soft border border-border" />
                  </div>
                </div>

                {/* Right: QR Dynamic status */}
                <div className="absolute top-[35%] -right-14 glass-card !p-3.5 !rounded-[18px] animate-float-slow" style={{ animationDelay: '2s' }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[12px] bg-primary-soft flex items-center justify-center">
                      <QrCode className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-text-primary block">QR Dynamique</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        <span className="text-xs text-success font-medium">Actif</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Left: Scan counter */}
                <div className="absolute top-[55%] -left-12 glass-card !p-3.5 !rounded-[18px] animate-float-slow" style={{ animationDelay: '3.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[12px] bg-primary-soft flex items-center justify-center">
                      <Scan className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-[11px] text-text-secondary uppercase tracking-wider">Scans</div>
                      <div className="text-xl font-bold text-text-primary font-script">147</div>
                    </div>
                  </div>
                </div>

                {/* Bottom-right: Price tag — geometric style (Image 5) */}
                <div className="absolute -bottom-2 -right-6 glass-card !p-4 !rounded-[18px] animate-float-slow border-primary/20" style={{ animationDelay: '1.5s' }}>
                  <div className="text-[11px] text-text-secondary uppercase tracking-wider">À partir de</div>
                  <div className="text-2xl font-bold text-primary mt-0.5">29.99€</div>
                </div>

                {/* Bottom-left: Attribute bars (Image 5 Adidas style) */}
                <div className="absolute -bottom-6 -left-8 glass-card !p-3.5 !rounded-[18px] animate-float-slow" style={{ animationDelay: '4.5s' }}>
                  <div className="space-y-2 w-32">
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-text-secondary">Qualité</span>
                        <span className="font-bold text-text-primary">95%</span>
                      </div>
                      <div className="h-1 rounded-full bg-surface-alt overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: '95%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-text-secondary">Custom</span>
                        <span className="font-bold text-text-primary">90%</span>
                      </div>
                      <div className="h-1 rounded-full bg-surface-alt overflow-hidden">
                        <div className="h-full rounded-full bg-accent" style={{ width: '90%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social links row — like Image 1 bottom */}
                <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex gap-8 text-[11px] font-semibold text-text-secondary/40 uppercase tracking-[0.2em]">
                  <span className="hover:text-text-secondary transition-colors cursor-pointer">IN</span>
                  <span className="hover:text-text-secondary transition-colors cursor-pointer">TW</span>
                  <span className="hover:text-text-secondary transition-colors cursor-pointer">YT</span>
                  <span className="hover:text-text-secondary transition-colors cursor-pointer">OS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in">
          <ChevronDown className="w-5 h-5 text-text-secondary/40 animate-bounce" />
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-serif text-[26px] sm:text-[34px] font-bold tracking-tight text-text-primary">
              Comment ça marche
            </h2>
            <p className="mt-4 text-text-secondary text-base max-w-md mx-auto">
              Un workflow simple en 3 étapes pour créer vos QR codes artistiques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger">
            {[
              {
                step: '01',
                icon: Upload,
                title: 'Uploadez votre image',
                desc: 'Glissez-déposez votre photo. Notre IA supprime l\'arrière-plan automatiquement pour extraire la silhouette.',
              },
              {
                step: '02',
                icon: Sparkles,
                title: 'Détourage automatique',
                desc: 'L\'intelligence artificielle détecte et isole votre silhouette avec précision, directement dans le navigateur.',
              },
              {
                step: '03',
                icon: QrCode,
                title: 'QR Code artistique',
                desc: 'Votre silhouette est intégrée dans un QR Code unique. Imprimez-le sur vos produits Print-on-Demand.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="glass-card card-hover animate-slide-up relative group"
              >
                <span className="font-script text-[38px] text-accent/50 absolute top-4 right-6 group-hover:text-primary/30 transition-colors">
                  {item.step}
                </span>
                <div className="w-12 h-12 rounded-[18px] bg-primary-soft flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-text-primary">{item.title}</h3>
                <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRODUCTS — Futuristic floating specs (Image 5 Adidas) ============ */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-surface-alt/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[26px] sm:text-[34px] font-bold tracking-tight text-text-primary">
              Nos produits
            </h2>
            <p className="mt-4 text-text-secondary text-base max-w-md mx-auto">
              Imprimez votre QR silhouette sur des produits premium
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger">
            {[
              {
                icon: Shirt,
                name: 'T-shirt Premium',
                quality: 95,
                custom: 90,
                price: '29.99€',
                sizes: ['S', 'M', 'L', 'XL'],
              },
              {
                icon: Coffee,
                name: 'Mug Céramique',
                quality: 88,
                custom: 85,
                price: '19.99€',
                sizes: ['330ml', '450ml'],
              },
              {
                icon: Frame,
                name: 'Cadre Photo',
                quality: 92,
                custom: 95,
                price: '39.99€',
                sizes: ['A4', 'A3'],
              },
            ].map((product) => (
              <div
                key={product.name}
                className="group relative glass-card card-hover animate-slide-up overflow-hidden"
              >
                {/* Product with floating size tags (Image 5) */}
                <div className="relative w-full h-56 rounded-[18px] bg-gradient-to-b from-surface-alt to-surface flex items-center justify-center mb-6 overflow-hidden">
                  <product.icon className="w-20 h-20 text-accent/25 group-hover:text-primary/25 transition-colors relative z-10" />
                  <div className="absolute top-3 right-3 glass-pill !py-1 !px-2.5 text-[10px] font-semibold text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                    QR Ready
                  </div>
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    {product.sizes.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-[8px] bg-surface/80 border border-border/50 text-[10px] font-bold text-text-secondary">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Attribute bars (Image 5 Adidas style) */}
                <div className="space-y-3 mb-6">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-text-secondary font-medium">Qualité</span>
                      <span className="font-bold text-text-primary">{product.quality}%</span>
                    </div>
                    <div className="h-1.5 rounded-[999px] bg-surface-alt overflow-hidden">
                      <div className="h-full rounded-[999px] bg-primary transition-all duration-700" style={{ width: `${product.quality}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-text-secondary font-medium">Personnalisation</span>
                      <span className="font-bold text-text-primary">{product.custom}%</span>
                    </div>
                    <div className="h-1.5 rounded-[999px] bg-surface-alt overflow-hidden">
                      <div className="h-full rounded-[999px] bg-accent transition-all duration-700" style={{ width: `${product.custom}%` }} />
                    </div>
                  </div>
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-text-primary">{product.name}</h3>
                    <p className="text-xl font-bold text-primary mt-1">{product.price}</p>
                  </div>
                  <Link
                    to="/signup"
                    className="w-11 h-11 rounded-[18px] bg-primary flex items-center justify-center text-white hover:brightness-110 transition-all shadow-sm hover:shadow-md"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[26px] sm:text-[34px] font-bold tracking-tight text-text-primary">
              Nos tarifs
            </h2>
            <p className="mt-4 text-text-secondary text-base max-w-md mx-auto">
              Commencez gratuitement, évoluez quand vous voulez
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger">
            {[
              {
                name: 'Gratuit',
                price: '0€',
                period: '',
                badge: null,
                icon: Layers,
                features: ['3 designs QR codes', 'Contenu dynamique', 'Support email'],
                cta: 'Commencer gratuitement',
                highlighted: false,
              },
              {
                name: 'Pro',
                price: '9.99€',
                period: '/mois',
                badge: 'Populaire',
                icon: Palette,
                features: ['25 designs QR codes', 'Export haute résolution', 'Analytics détaillés', 'Priorité support'],
                cta: 'Passer au Pro',
                highlighted: true,
              },
              {
                name: 'Creator',
                price: '24.99€',
                period: '/mois',
                badge: null,
                icon: Sparkles,
                features: ['Designs illimités', 'Accès API', 'Mockups produits', 'Support dédié', 'White label'],
                cta: 'Devenir Creator',
                highlighted: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`glass-card card-hover animate-slide-up relative ${
                  plan.highlighted ? 'border-primary/50 ring-1 ring-primary/20 animate-pulse-glow' : ''
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-[999px] bg-primary text-white text-xs font-semibold shadow-sm">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <div className="w-10 h-10 rounded-[18px] bg-primary-soft flex items-center justify-center mb-4">
                    <plan.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-text-primary">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-[34px] font-bold text-text-primary">{plan.price}</span>
                    {plan.period && (
                      <span className="text-text-secondary text-sm">{plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-text-secondary">
                      <Check className="w-4 h-4 text-success flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/signup"
                  className={plan.highlighted ? 'btn-primary w-full' : 'btn-secondary w-full'}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-surface-alt/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[26px] sm:text-[34px] font-bold tracking-tight text-text-primary">
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-4 stagger">
            {[
              {
                q: 'Comment fonctionne le QR Code artistique ?',
                a: 'Nous intégrons votre silhouette détourée dans un QR Code avec un niveau de correction d\'erreur élevé (H). Le QR reste 100% scannable tout en affichant votre design unique.',
              },
              {
                q: 'Le contenu après scan est-il vraiment modifiable ?',
                a: 'Oui, le QR Code pointe vers une URL dynamique. Le propriétaire peut modifier le texte, l\'image ou la vidéo affichée à tout moment, sans changer le QR imprimé.',
              },
              {
                q: 'Quels produits Print-on-Demand sont disponibles ?',
                a: 'Actuellement : t-shirts, mugs et cadres photo. Nous ajoutons régulièrement de nouveaux produits (coques, sacs, posters).',
              },
              {
                q: 'Le détourage est-il vraiment gratuit ?',
                a: 'Oui. Le détourage s\'exécute entièrement dans votre navigateur grâce à l\'IA embarquée. Aucun coût serveur, aucune API payante.',
              },
              {
                q: 'Mes données sont-elles sécurisées ?',
                a: 'Toutes les données sont chiffrées. Chaque utilisateur ne peut accéder qu\'à ses propres designs grâce à notre système de sécurité Row Level Security.',
              },
            ].map((item, i) => (
              <details
                key={i}
                className="glass-card animate-slide-up group"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-text-primary">
                  {item.q}
                  <ChevronRight className="w-5 h-5 text-text-secondary transition-transform group-open:rotate-90 shrink-0 ml-4" />
                </summary>
                <p className="mt-4 text-sm text-text-secondary leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-text-primary py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="font-serif font-bold text-lg text-white">{APP_NAME}</span>
              <p className="mt-2 text-sm text-white/50">QR Codes artistiques dynamiques</p>
            </div>

            <div className="flex items-center gap-8 text-sm text-white/50">
              <Link to="#" className="hover:text-white transition-colors">Mentions légales</Link>
              <Link to="#" className="hover:text-white transition-colors">Contact</Link>
              <Link to="#" className="hover:text-white transition-colors">CGV</Link>
            </div>

            {/* Social row — like Image 1 bottom */}
            <div className="flex items-center gap-6 text-[11px] font-semibold text-white/30 uppercase tracking-[0.2em]">
              <span className="hover:text-white transition-colors cursor-pointer">IN</span>
              <span className="hover:text-white transition-colors cursor-pointer">TW</span>
              <span className="hover:text-white transition-colors cursor-pointer">YT</span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center text-xs text-white/30">
            &copy; {new Date().getFullYear()} Basira Design. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}
