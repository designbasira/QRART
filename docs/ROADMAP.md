# ROADMAP — Silhouette QR Live (QRART)

> 15 phases de micro-tâches. Chaque tâche cible un seul fichier et s'exécute en quelques minutes.

---

## État actuel du projet

**Stack** : Vite + React Router + TypeScript + Supabase + Tailwind CSS

**Déjà implémenté :**
- Design system complet dans `globals.css` (light/dark, glass, animations)
- Landing page avec glassmorphism + floating elements
- Auth (login/signup) avec Supabase + Google OAuth (PKCE)
- Dashboard shell (header, sidebar icon 72px, bottom-nav mobile)
- Dashboards admin + user avec glass cards
- Pipeline création 4 étapes (upload → détourage IA → QR → export)
- Content editor (texte/image/lien) avec tabs
- Mockup AI via Google Imagen (appel direct whisk.ts)
- PWA manifest + service worker basique
- Responsive mobile corrigé sur composants admin

**Stitch UI (référence visuelle) :**
- Projet : `projects/1034985716730192226`
- Landing Page Desktop : générée
- Auth Login Desktop (2 variantes) : générées
- Autres écrans : à générer manuellement dans Stitch web

---

## PHASE 1 — Alignement Design System (pages secondaires)

**But** : Les pages `user/designs`, `admin/designs`, `admin/users`, `scan/:id` utilisent des couleurs Tailwind en dur (`bg-white`, `bg-gray-50`, `bg-black`) au lieu des tokens du design system.

| # | Micro-tâche | Fichier | Détail |
|---|-------------|---------|--------|
| 1.1 | Aligner `user/designs` | `src/pages/user/designs.tsx` | `bg-white` → `bg-surface`, `text-gray-500` → `text-text-secondary`, `bg-black` → `btn-primary`, `rounded-lg` → `rounded-[24px]`, ajouter `glass-card` |
| 1.2 | Aligner `admin/designs` | `src/pages/admin/designs.tsx` | Table brute → glass-cards ou table stylée. `bg-gray-50` → `bg-surface-alt`, `bg-black` → `btn-primary` |
| 1.3 | Aligner `admin/users` | `src/pages/admin/users.tsx` | Même traitement que admin/designs |
| 1.4 | Aligner `scan/:id` | `src/pages/scan.tsx` | `bg-gray-50` → `bg-background`, `bg-white` → `glass-card`, `bg-black` → `btn-primary`. Branding QR Live |
| 1.5 | Aligner `user/designs/:id` | `src/pages/user/design-detail.tsx` | Appliquer glass-card + tokens |

**Vérification** : `npm run build` passe. Inspecter chaque page dans le navigateur.

---

## PHASE 2 — Alignement Design System (composants admin)

**But** : Les 4 composants admin du pipeline utilisent des couleurs hardcodées (`border-gray-300`, `bg-gray-50`, `bg-black`).

| # | Micro-tâche | Fichier | Détail |
|---|-------------|---------|--------|
| 2.1 | Aligner `image-upload.tsx` | `src/components/admin/image-upload.tsx` | `border-gray-300` → `border-border`, `bg-gray-50` → `bg-surface-alt`, `text-gray-500` → `text-text-secondary` |
| 2.2 | Aligner `background-remover.tsx` | `src/components/admin/background-remover.tsx` | Tokens + `glass-card` wrapper |
| 2.3 | Aligner `qr-generator.tsx` | `src/components/admin/qr-generator.tsx` | `bg-black` → `btn-primary`, tokens couleurs |
| 2.4 | Aligner `export-panel.tsx` | `src/components/admin/export-panel.tsx` | Tokens + glass styling |

**Vérification** : `/admin/create` — pipeline visuellement cohérent avec le reste.

---

## PHASE 3 — Page Settings (nouvelle page)

**But** : La page paramètres utilisateur n'existe pas encore.

| # | Micro-tâche | Fichier | Détail |
|---|-------------|---------|--------|
| 3.1 | Créer la page settings | `src/pages/user/settings.tsx` | Fetch profile. Sections : profil, abonnement, préférences, zone danger |
| 3.2 | Composant ProfileForm | `src/components/user/profile-form.tsx` | Formulaire nom/email. Zod validation. Feedback success/error |
| 3.3 | Composant PasswordForm | `src/components/user/password-form.tsx` | 3 champs mot de passe. Supabase `updateUser` |
| 3.4 | Section DangerZone | Inline dans settings page | Bouton supprimer compte avec confirmation. Bordure `border-danger` |
| 3.5 | Lien Settings dans nav | `sidebar.tsx` + `bottom-nav.tsx` | Vérifier que `/user/settings` est actif et pointe correctement |

**Vérification** : `/user/settings` — modifier le nom, changer le mot de passe, vérifier le feedback.

---

## PHASE 4 — Dark Mode Toggle

**But** : Toggle dark/light mode fonctionnel (le CSS dark existe déjà dans `globals.css`).

| # | Micro-tâche | Fichier | Détail |
|---|-------------|---------|--------|
| 4.1 | Hook `useTheme` | `src/hooks/use-theme.ts` | Gère la classe `dark` sur `<html>`. `localStorage`. Respecte `prefers-color-scheme` |
| 4.2 | Composant ThemeToggle | `src/components/layout/theme-toggle.tsx` | Bouton Sun/Moon. Style `glass-pill` |
| 4.3 | Intégrer dans Header | `src/components/layout/header.tsx` | `<ThemeToggle />` à côté du bell icon |
| 4.4 | Ajouter dans Settings | `src/pages/user/settings.tsx` | Toggle thème section Préférences |
| 4.5 | Tester le switch | Manuel | Toutes les pages en dark. Corriger tokens manquants |

**Vérification** : Toggle → vérifier landing + dashboard + auth. Rafraîchir → choix persiste.

---

## PHASE 5 — Page Scan améliorée

**But** : La page `/scan/:id` est minimaliste. Beautifier + inciter à l'action.

| # | Micro-tâche | Fichier | Détail |
|---|-------------|---------|--------|
| 5.1 | Redesign page scan | `src/pages/scan.tsx` | `bg-background`, glass card centré, logo serif, `animate-fade-in` |
| 5.2 | CTA d'inscription | `src/pages/scan.tsx` | Non authentifié : "Personnalisez ce QR" → `/signup`. Authentifié : "Modifier" → `/user/designs/:id` |
| 5.3 | Compteur scans | `src/pages/scan.tsx` | Incrément `scan_count` + log `scan_logs` via Supabase client |
| 5.4 | Partage social | `src/pages/scan.tsx` | Boutons copier lien, WhatsApp, Twitter. Glass pills |

**Vérification** : `/scan/{short_id}` en incognito. Affichage, compteur, CTA.

---

## PHASE 6 — PWA Enhancement

**But** : App installable, mode standalone, offline basique.

| # | Micro-tâche | Fichier | Détail |
|---|-------------|---------|--------|
| 6.1 | Manifest amélioré | `public/manifest.json` | `categories`, `shortcuts`, `screenshots` |
| 6.2 | Service worker amélioré | `public/sw.js` | Cache assets statiques. Network-first pour API |
| 6.3 | Bannière d'installation | `src/components/layout/install-banner.tsx` | "Installer l'app" mobile. `beforeinstallprompt` |
| 6.4 | Splash screen config | `public/manifest.json` | `background_color`, `theme_color` |
| 6.5 | Mode offline basique | `public/sw.js` | Page fallback "Vous êtes hors ligne" |

**Vérification** : Android Chrome → "Ajouter à l'écran d'accueil" → vérifier splash + navigation + offline.

---

## PHASE 7 — Tests unitaires

**But** : Tests pour les fonctions critiques. Vitest + RTL déjà configurés.

| # | Micro-tâche | Fichier | Détail |
|---|-------------|---------|--------|
| 7.1 | Tests validators | `src/tests/validators.test.ts` | `loginSchema`, `signupSchema`, `designUpdateContentSchema` — cas valides/invalides |
| 7.2 | Tests utils | `src/tests/utils.test.ts` | `cn()`, `formatDate()` |
| 7.3 | Tests QR generation | `src/tests/qr-generate.test.ts` | `createStyledQR()` retourne instance, `generateQRDataUrl()` retourne data URL |
| 7.4 | Tests constants | `src/tests/constants.test.ts` | Constantes définies (STORAGE_BUCKETS, etc.) |
| 7.5 | Test content-editor | `src/tests/content-editor.test.tsx` | 3 tabs rendus, click switch les tabs |

**Vérification** : `npm run test` — tous passent.

---

## PHASE 8 — SEO & Metadata

**But** : Métadonnées SEO, Open Graph. Avec Vite (SPA), utiliser `react-helmet-async` ou meta tags dans `index.html`.

| # | Micro-tâche | Fichier | Détail |
|---|-------------|---------|--------|
| 8.1 | Meta tags index.html | `index.html` | title, description, OG image, Twitter card |
| 8.2 | react-helmet pour pages | Pages publiques | Titre dynamique par page |
| 8.3 | Sitemap statique | `public/sitemap.xml` | Pages publiques |
| 8.4 | Robots.txt | `public/robots.txt` | Autoriser `/`, `/scan/*`. Bloquer `/admin/*`, `/user/*` |

**Vérification** : Meta tags dans HTML source. Outil OG preview.

---

## PHASE 9 — Performance

**But** : Optimiser chargement et performances.

| # | Micro-tâche | Fichier | Détail |
|---|-------------|---------|--------|
| 9.1 | Loading states | Composants dashboard | Skeleton loader glass |
| 9.2 | Code splitting | `vite.config.ts` | `manualChunks` pour gros packages (onnxruntime, etc.) |
| 9.3 | Lazy load background-removal | `src/components/admin/background-remover.tsx` | Dynamic `import()` de `@imgly/background-removal` |
| 9.4 | Lazy routes | `src/App.tsx` | `React.lazy()` pour pages admin/user |
| 9.5 | Reduced motion | `src/globals.css` | `@media (prefers-reduced-motion: reduce)` |

**Vérification** : Lighthouse mobile > 80. Reduced-motion fonctionne.

---

## PHASE 10 — Abonnements (UI)

**But** : Interface gestion abonnements (sans paiement réel).

| # | Micro-tâche | Fichier | Détail |
|---|-------------|---------|--------|
| 10.1 | Vérifier section tarifs landing | `src/pages/home.tsx` | Plans à jour |
| 10.2 | Page abonnement | `src/pages/user/subscription.tsx` | Plan actuel, limites, usage, boutons upgrade |
| 10.3 | Composant PlanCard | `src/components/user/plan-card.tsx` | Glass card réutilisable : plan, prix, features, CTA |
| 10.4 | Enforcement limites | `src/pages/admin/create.tsx` | Bloquer création si limite atteinte |
| 10.5 | Lien subscription nav | `sidebar.tsx` + `bottom-nav.tsx` | `/user/subscription` actif |

**Vérification** : `/user/subscription` — affichage plans, tentative au-delà limite.

---

## PHASE 11 — Intégrations Cloud

**But** : Connecter Google Drive/Dropbox pour les médias.

| # | Micro-tâche | Fichier | Détail |
|---|-------------|---------|--------|
| 11.1 | Page intégrations redesign | `src/pages/user/integrations.tsx` | Providers avec icônes, état connecté/déconnecté |
| 11.2 | Composant IntegrationCard | `src/components/user/integration-card.tsx` | Glass card : icône, nom, statut, action |
| 11.3 | Formulaire share link | `src/components/user/share-link-form.tsx` | Coller lien partage. Zod validation URL |
| 11.4 | CRUD intégrations | Direct Supabase client | CRUD table `integrations` via Supabase JS |

**Vérification** : Intégrations → ajouter lien Google Drive → vérifier BDD.

---

## PHASE 12 — i18n (FR/EN)

**But** : Support bilingue français/anglais.

| # | Micro-tâche | Fichier | Détail |
|---|-------------|---------|--------|
| 12.1 | Structure i18n | `src/lib/i18n/` | `fr.ts`, `en.ts`, hook `useTranslation` |
| 12.2 | Hook useLocale | `src/hooks/use-locale.ts` | localStorage + détection navigateur |
| 12.3 | Traduire landing | `src/pages/home.tsx` | Strings → clés i18n |
| 12.4 | Traduire dashboard | Pages dashboard | Strings → clés |
| 12.5 | Toggle langue header | `src/components/layout/header.tsx` | Pill FR/EN cliquable |

**Vérification** : Switch EN → pages traduites → rafraîchir → persiste.

---

## PHASE 13 — Admin Design Detail

**But** : Page détail design améliorée pour l'admin.

| # | Micro-tâche | Fichier | Détail |
|---|-------------|---------|--------|
| 13.1 | Redesign détail | `src/pages/admin/design-detail.tsx` | Glass card, QR preview, images, stats, actions |
| 13.2 | Assignation user | Même fichier | Formulaire assigner user (chercher par email) |
| 13.3 | Régénérer QR | Même fichier | Bouton régénérer avec nouveaux paramètres |
| 13.4 | Historique scans | Même fichier | Mini-tableau scans depuis `scan_logs` |

**Vérification** : Ouvrir design admin → affichage, assignation, historique.

---

## PHASE 14 — Mockups Produits (Imagen API)

**But** : Améliorer la génération de mockups produits via Google Imagen.

| # | Micro-tâche | Fichier | Détail |
|---|-------------|---------|--------|
| 14.1 | UI mockup export panel | `src/components/admin/export-panel.tsx` | Section "Mockups" avec boutons T-shirt/Mug/Cadre (fait) |
| 14.2 | Appel direct whisk.ts | `src/lib/whisk.ts` | Améliorer prompts (prompt engineering) |
| 14.3 | Preview mockup | `src/components/admin/export-panel.tsx` | Afficher dans glass card. Bouton télécharger (fait) |
| 14.4 | Galerie mockups | `src/components/admin/mockup-gallery.tsx` | Sauvegarder + galerie scrollable |

**Vérification** : QR → export → "Mockup T-shirt" → rendu.

---

## PHASE 15 — Polish & Deploy

**But** : Dernières corrections et production.

| # | Micro-tâche | Fichier | Détail |
|---|-------------|---------|--------|
| 15.1 | Audit accessibilité | Global | Contrasts WCAG AA, focus visible, aria-labels |
| 15.2 | Error boundaries | `src/pages/not-found.tsx` + error boundary | Pages 404/500 design system |
| 15.3 | Favicon + OG image | `public/` | Favicon SVG + OG 1200x630 branded |
| 15.4 | Env variables doc | `src/lib/constants.ts` | Variables documentées |
| 15.5 | Deploy production | Vercel | Build final, logs, test production |

**Vérification** : Site live. Lighthouse > 80 toutes catégories. Tests passent. PWA installable.

---

## Résumé

| Phase | Thème | Tâches | Priorité |
|-------|-------|--------|----------|
| 1 | Design System — pages secondaires | 5 | P0 |
| 2 | Design System — composants admin | 4 | P0 |
| 3 | Page Settings | 5 | P0 |
| 4 | Dark Mode Toggle | 5 | P1 |
| 5 | Page Scan améliorée | 4 | P0 |
| 6 | PWA Enhancement | 5 | P1 |
| 7 | Tests unitaires | 5 | P1 |
| 8 | SEO & Metadata | 4 | P1 |
| 9 | Performance | 5 | P1 |
| 10 | Abonnements (UI) | 5 | P1 |
| 11 | Intégrations Cloud | 4 | P2 |
| 12 | i18n (FR/EN) | 5 | P2 |
| 13 | Admin Design Detail | 4 | P1 |
| 14 | Mockups Produits | 4 | P2 |
| 15 | Polish & Deploy | 5 | P0 |
| **TOTAL** | | **~69 tâches** | |
