import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'
import {
  Sparkles,
  QrCode,
  RefreshCw,
  Upload,
  ChevronDown,
  ChevronRight,
  Check,
  Star,
  Shirt,
  Coffee,
  Frame,
  Globe,
  ArrowRight,
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* ============ HEADER ============ */}
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
              href="/login"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/signup"
              className="btn-primary !h-10 !text-sm !px-5 !rounded-[18px]"
            >
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* ============ HERO — Fashion Editorial ============ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large vertical brand text — like fashion editorial (Image 1 inspiration) */}
          <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 font-serif text-[80px] md:text-[120px] lg:text-[160px] font-bold leading-none tracking-tighter text-accent/20 select-none"
               style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
            SILHOUETTE
          </div>

          {/* Floating glass decorative panels */}
          <div className="absolute top-32 right-[15%] w-48 h-32 glass-card animate-float opacity-60" style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-40 right-[8%] w-36 h-24 glass-card animate-float opacity-40" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[60%] left-[12%] w-28 h-20 glass-card animate-float opacity-30" style={{ animationDelay: '4s' }} />

          {/* Large semi-transparent letters background — like Image 1 "ELEC" */}
          <div className="absolute right-0 bottom-0 font-serif text-[200px] md:text-[300px] font-bold text-accent/[0.06] leading-none select-none">
            QR
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left: Content */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[999px] bg-primary-soft text-primary text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                Print-on-Demand intelligent
              </div>

              <h1 className="font-serif text-[34px] sm:text-[44px] lg:text-[52px] font-bold tracking-tight leading-[1.1] text-text-primary">
                Vos silhouettes deviennent des{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  QR Codes vivants
                </span>
              </h1>

              <p className="mt-6 text-lg text-text-secondary max-w-lg leading-relaxed">
                Transformez vos photos en QR codes artistiques imprimés sur des produits personnalisés. Le contenu reste modifiable à tout moment.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="btn-primary">
                  Créer mon QR gratuit
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#how-it-works" className="btn-secondary">
                  Découvrir le concept
                </a>
              </div>

              {/* Credits — fashion editorial style (Image 1 bottom-left) */}
              <div className="mt-16 text-xs text-text-secondary/60 space-y-1 hidden lg:block">
                <p>Design by Basira Design</p>
                <p>Platform: Silhouette QR Live</p>
              </div>
            </div>

            {/* Right: Product Hero with floating glass elements (Image 1 + Image 5 inspiration) */}
            <div className="relative animate-slide-up hidden lg:block">
              {/* Main product area — large T-shirt mockup placeholder */}
              <div className="relative mx-auto w-[400px] h-[500px]">
                {/* Product silhouette placeholder */}
                <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-surface-alt to-surface flex items-center justify-center overflow-hidden">
                  <div className="w-64 h-72 rounded-[24px] bg-accent/10 flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-accent/30" />
                  </div>
                </div>

                {/* Floating glass info panels (Image 5 — floating specs) */}
                <div className="absolute -top-4 -right-8 glass-card !p-3 !rounded-[18px] animate-float" style={{ animationDelay: '1s' }}>
                  <div className="text-xs font-medium text-text-secondary">Couleur</div>
                  <div className="text-sm font-semibold text-text-primary mt-1">Blanc Premium</div>
                  <div className="flex gap-2 mt-2">
                    <div className="w-5 h-5 rounded-full bg-white border border-border" />
                    <div className="w-5 h-5 rounded-full bg-text-primary" />
                    <div className="w-5 h-5 rounded-full bg-accent" />
                  </div>
                </div>

                <div className="absolute top-1/3 -right-12 glass-card !p-3 !rounded-[18px] animate-float" style={{ animationDelay: '2.5s' }}>
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold">QR Dynamique</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-xs text-success font-medium">Actif</span>
                  </div>
                </div>

                <div className="absolute bottom-16 -left-10 glass-card !p-3 !rounded-[18px] animate-float" style={{ animationDelay: '3.5s' }}>
                  <div className="text-xs text-text-secondary">Scans totaux</div>
                  <div className="text-2xl font-bold text-text-primary font-script">147</div>
                </div>

                {/* Price tag — geometric glass (Image 5 style) */}
                <div className="absolute bottom-4 -right-6 glass-card !p-4 !rounded-[18px]">
                  <div className="text-xs text-text-secondary">À partir de</div>
                  <div className="text-xl font-bold text-primary">29.99€</div>
                </div>

                {/* Social links row — like Image 1 bottom */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-6 text-xs font-medium text-text-secondary/50">
                  <span>IN</span>
                  <span>TW</span>
                  <span>YT</span>
                  <span>OS</span>
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
            <p className="mt-4 text-text-secondary text-base">
              Un workflow simple en 3 étapes
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
                className="glass-card card-hover animate-slide-up relative"
              >
                <span className="font-script text-[34px] text-accent/60 absolute top-5 right-6">
                  {item.step}
                </span>
                <div className="w-12 h-12 rounded-[18px] bg-primary-soft flex items-center justify-center mb-5">
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

      {/* ============ PRODUCTS — Futuristic style (Image 5) ============ */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-surface-alt/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[26px] sm:text-[34px] font-bold tracking-tight text-text-primary">
              Nos produits
            </h2>
            <p className="mt-4 text-text-secondary text-base">
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
              },
              {
                icon: Coffee,
                name: 'Mug Céramique',
                quality: 88,
                custom: 85,
                price: '19.99€',
              },
              {
                icon: Frame,
                name: 'Cadre Photo',
                quality: 92,
                custom: 95,
                price: '39.99€',
              },
            ].map((product) => (
              <div
                key={product.name}
                className="group relative glass-card card-hover animate-slide-up overflow-hidden"
              >
                {/* Product placeholder */}
                <div className="w-full h-56 rounded-[18px] bg-gradient-to-b from-surface-alt to-surface flex items-center justify-center mb-6">
                  <product.icon className="w-20 h-20 text-accent/30 group-hover:text-primary/30 transition-colors" />
                </div>

                {/* Floating attribute bars (Image 5 style) */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">Qualité</span>
                    <span className="font-semibold text-text-primary">{product.quality}%</span>
                  </div>
                  <div className="h-1.5 rounded-[999px] bg-surface-alt overflow-hidden">
                    <div
                      className="h-full rounded-[999px] bg-primary transition-all duration-500"
                      style={{ width: `${product.quality}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">Personnalisation</span>
                    <span className="font-semibold text-text-primary">{product.custom}%</span>
                  </div>
                  <div className="h-1.5 rounded-[999px] bg-surface-alt overflow-hidden">
                    <div
                      className="h-full rounded-[999px] bg-accent transition-all duration-500"
                      style={{ width: `${product.custom}%` }}
                    />
                  </div>
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-text-primary">{product.name}</h3>
                    <p className="text-lg font-bold text-primary mt-1">{product.price}</p>
                  </div>
                  <Link
                    href="/signup"
                    className="w-10 h-10 rounded-[18px] bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors"
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
            <p className="mt-4 text-text-secondary text-base">
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
                features: ['3 designs QR codes', 'Contenu dynamique', 'Support email'],
                cta: 'Commencer gratuitement',
                highlighted: false,
              },
              {
                name: 'Pro',
                price: '9.99€',
                period: '/mois',
                badge: 'Populaire',
                features: ['25 designs QR codes', 'Export haute résolution', 'Analytics détaillés', 'Priorité support'],
                cta: 'Passer au Pro',
                highlighted: true,
              },
              {
                name: 'Creator',
                price: '24.99€',
                period: '/mois',
                badge: null,
                features: ['Designs illimités', 'Accès API', 'Mockups produits', 'Support dédié', 'White label'],
                cta: 'Devenir Creator',
                highlighted: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`glass-card card-hover animate-slide-up relative ${
                  plan.highlighted ? 'border-primary/50 ring-1 ring-primary/20' : ''
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-[999px] bg-primary text-white text-xs font-semibold">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
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
                  href="/signup"
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
                  <ChevronRight className="w-5 h-5 text-text-secondary transition-transform group-open:rotate-90" />
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
              <Link href="#" className="hover:text-white transition-colors">Mentions légales</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact</Link>
              <Link href="#" className="hover:text-white transition-colors">CGV</Link>
            </div>

            {/* Social row like Image 1 */}
            <div className="flex items-center gap-6 text-sm font-medium text-white/40">
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
