# Écrans UI — Silhouette QR Live

> Documentation des écrans implémentés et de leur structure.

---

## 1. Landing Page (`/`)

**Fichier** : `src/app/page.tsx`
**Type** : Server Component (statique)
**Inspiration** : Hero fashion-editorial + floating glass UI elements

### Sections
| Section | Description |
|---------|-------------|
| Header | Navigation fixe, glass, logo serif, CTA "Commencer" #F1641E |
| Hero | Typo verticale "SILHOUETTE" (Playfair Display), produit central avec floating glass panels (stats, prix, couleurs), gradient text, 2 CTAs |
| Comment ça marche | 3 glass cards numérotées en Caveat ("01", "02", "03"), icônes Upload/Sparkles/QR |
| Nos produits | 3 cartes produits POD avec barres attributs (Qualité/Personnalisation), prix, CTA |
| Nos tarifs | 3 plans (Gratuit/Pro/Creator), glass cards, "Populaire" badge sur Pro |
| FAQ | 5 accordéons `<details>` en glass card |
| Footer | Fond #2C2C2C, liens légaux, social row (IN/TW/YT) |

---

## 2. PWA Home / User Dashboard (`/user`)

**Fichier** : `src/app/(dashboard)/user/page.tsx`
**Type** : Server Component (dynamique, auth required)
**Inspiration** : Component cards arrondies, layout modulaire mobile-first

### Sections
| Section | Description |
|---------|-------------|
| Welcome | Greeting en Caveat "Bonjour, {prénom}" |
| Quick Stats | 3 glass pills (Designs, Actifs, Scans) avec icônes #F1641E |
| Quick Actions | Grid 2x2 (mobile) / 4 cols (desktop) : Nouveau, Modifier, Mes QR, Abonnement |
| Récents | Grid de design cards avec QR thumbnail, status pill, scan count |

---

## 3. Admin Dashboard (`/admin`)

**Fichier** : `src/app/(dashboard)/admin/page.tsx`
**Type** : Server Component (dynamique, admin only)

### Sections
| Section | Description |
|---------|-------------|
| Header | Titre + bouton "+ Nouveau design" #F1641E |
| Stats | 3 glass cards : Total designs, Utilisateurs, Scans ce mois (34px bold numbers) |
| Designs récents | Grid 4 colonnes, glass cards avec QR thumbnail, short_id, status, scan count |

---

## 4. Admin Pipeline (`/admin/create`)

**Fichier** : `src/components/admin/creation-pipeline.tsx`
**Type** : Client Component

### Pipeline 4 étapes
| Étape | Composant | Description |
|-------|-----------|-------------|
| 1. Upload | `ImageUpload` | Drag & drop, formats PNG/JPG/WEBP |
| 2. Détourage | `BackgroundRemover` | IA client-side @imgly/background-removal |
| 3. QR Code | `QRGenerator` | qr-code-styling avec silhouette overlay |
| 4. Export | `ExportPanel` | PNG/SVG download + lien scan |

**Stepper** : Cercles numérotés connectés par ligne, progression #F1641E, état actif avec glow.

---

## 5. Content Editor (`/user/designs/[id]`)

**Fichier** : `src/components/user/content-editor.tsx`
**Type** : Client Component

### Tabs
| Tab | Description |
|-----|-------------|
| Texte | Textarea glass, compteur 0/5000 caractères |
| Image | Input URL + preview |
| Lien | Input URL pour YouTube/externe |

**Actions** : Bouton "Sauvegarder" full-width #F1641E, feedback success/danger animé.

---

## 6. Auth (Login / Signup)

**Fichiers** : `src/components/auth/login-form.tsx`, `signup-form.tsx`
**Layout** : `src/app/(auth)/layout.tsx` — centré, glass-card wrapper

### Éléments
- Google OAuth button (btn-secondary)
- Séparateur "ou par email"
- Formulaire inputs design system (48px height, 16px radius)
- btn-primary full-width
- Lien navigation entre login/signup en #F1641E

---

## 7. Layout Components

### Icon Sidebar (Desktop, 72px)
**Fichier** : `src/components/layout/sidebar.tsx`
- Glass panel avec rounded-r-[28px]
- Logo "Q" icon top
- Nav icons verticaux, active = #FFE6D6 circle + #F1641E icon
- Tooltips au hover
- Avatar initiales bottom

### Bottom Nav (Mobile, 72px)
**Fichier** : `src/components/layout/bottom-nav.tsx`
- Glass background + border-top
- 5 tabs : Home, Designs, +Create (FAB central 56px #F1641E), Abo, Settings
- Active = #F1641E + dot indicator
- Safe area padding pour iOS

### Header (Glass)
**Fichier** : `src/components/layout/header.tsx`
- Glass backdrop-blur
- Logo serif, role badge pill, bell notification, avatar initiales, logout

---

## Responsive Breakpoints

| Breakpoint | Largeur | Comportement |
|-----------|---------|-------------|
| Mobile | < 768px | Bottom nav visible, sidebar hidden, 1 colonne |
| Tablet | 768-1024px | Bottom nav hidden, sidebar icons, 2 colonnes |
| Desktop | > 1024px | Sidebar icons, 3-4 colonnes, panels latéraux |
