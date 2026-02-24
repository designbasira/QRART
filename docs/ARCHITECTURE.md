# Architecture Technique — Silhouette QR Live

---

## Stack

| Couche | Technologie | Version |
|--------|-------------|---------|
| Framework | Vite + React Router | 6.x |
| Langage | TypeScript (strict) | 5.x |
| Base de données | Supabase PostgreSQL | - |
| Auth | Supabase Auth (email + Google OAuth, PKCE) | - |
| Storage | Supabase Storage | - |
| Styling | Tailwind CSS | 4.x |
| QR Generation | qr-code-styling | 1.9.x |
| Background Removal | @imgly/background-removal | 1.7.x |
| AI (Mockups) | Google Imagen API (via whisk.ts) | - |
| Icons | lucide-react | 0.575.x |
| Validation | Zod | 4.x |
| Hosting | Vercel | - |
| PWA | Service Worker + manifest.json | - |

---

## Structure du projet

```
QRART/
├── docs/                          # Documentation projet
│   ├── PRD.md                     # Product Requirements Document
│   ├── DESIGN-SYSTEM.md           # Tokens design system officiel
│   ├── SCREENS.md                 # Documentation des écrans UI
│   └── ARCHITECTURE.md            # Ce fichier
├── public/
│   ├── icons/                     # PWA icons (192, 512)
│   ├── manifest.json              # PWA manifest
│   └── sw.js                      # Service Worker
├── src/
│   ├── main.tsx                   # Entry point React
│   ├── App.tsx                    # Routes (React Router)
│   ├── globals.css                # Design tokens CSS + glassmorphism
│   ├── pages/
│   │   ├── home.tsx               # Landing page
│   │   ├── login.tsx              # Page connexion
│   │   ├── signup.tsx             # Page inscription
│   │   ├── auth-callback.tsx      # OAuth callback (PKCE)
│   │   ├── scan.tsx               # Page scan publique
│   │   ├── not-found.tsx          # 404
│   │   ├── admin/
│   │   │   ├── dashboard.tsx      # Admin dashboard
│   │   │   ├── create.tsx         # Pipeline création
│   │   │   ├── designs.tsx        # Liste designs
│   │   │   ├── design-detail.tsx  # Détail design
│   │   │   └── users.tsx          # Gestion utilisateurs
│   │   └── user/
│   │       ├── dashboard.tsx      # User dashboard (PWA home)
│   │       ├── designs.tsx        # Mes designs
│   │       ├── design-detail.tsx  # Détail design user
│   │       ├── integrations.tsx   # Cloud integrations
│   │       ├── settings.tsx       # Paramètres
│   │       └── subscription.tsx   # Abonnement
│   ├── layouts/
│   │   ├── auth-layout.tsx        # Layout auth (centered, glass)
│   │   └── dashboard-layout.tsx   # Layout dashboard (auth guard)
│   ├── components/
│   │   ├── admin/
│   │   │   ├── creation-pipeline.tsx  # 4-step stepper
│   │   │   ├── image-upload.tsx
│   │   │   ├── background-remover.tsx
│   │   │   ├── qr-generator.tsx
│   │   │   └── export-panel.tsx
│   │   ├── auth/
│   │   │   ├── auth-provider.tsx      # AuthContext (user, profile, loading)
│   │   │   ├── auth-guard.tsx         # Route guard (redirect /login)
│   │   │   ├── role-guard.tsx         # Role check (admin only)
│   │   │   ├── login-form.tsx
│   │   │   └── signup-form.tsx
│   │   ├── layout/
│   │   │   ├── dashboard-shell.tsx    # Wrapper (header+sidebar+bottomnav)
│   │   │   ├── header.tsx             # Glass header
│   │   │   ├── sidebar.tsx            # Icon sidebar (72px)
│   │   │   └── bottom-nav.tsx         # Mobile bottom nav (72px)
│   │   └── user/
│   │       └── content-editor.tsx     # Tabs Texte/Image/Lien
│   ├── lib/
│   │   ├── constants.ts
│   │   ├── utils.ts                   # cn(), formatDate()
│   │   ├── validators.ts             # Zod schemas
│   │   ├── supabase/
│   │   │   └── client.ts             # Browser client (singleton, PKCE)
│   │   ├── qr/                        # QR generation utilities
│   │   ├── background-removal/        # @imgly wrapper
│   │   └── whisk.ts                   # Google Imagen API (mockups)
│   ├── hooks/                         # Custom React hooks
│   └── types/
│       ├── index.ts                   # Profile, Design, etc.
│       └── database.ts                # Supabase generated types
├── CLAUDE.md                          # Instructions IA
├── .mcp.json                          # MCP servers config
├── vite.config.ts                     # Vite configuration
├── package.json
└── tsconfig.json
```

---

## Patterns clés

### Authentication Flow
```
Visitor → /login or /signup
  → Supabase Auth (email/password or Google OAuth)
  → Google redirects to /auth/callback?code=...
  → Supabase client auto-exchanges code (PKCE)
  → onAuthStateChange fires SIGNED_IN
  → Query profiles.role
  → window.location.href → /admin or /user
```

### Dashboard Guard (client-side)
```
App.tsx wraps all routes in <AuthProvider>
  → Protected routes wrapped in <AuthGuard>
  → AuthGuard checks useAuth() → user exists?
  → if !user → <Navigate to="/login" />
  → Admin routes also wrapped in <RoleGuard role="admin">
  → DashboardLayout renders <DashboardShell> with profile
```

### QR Creation Pipeline
```
Admin uploads image
  → Client-side background removal (@imgly)
  → Silhouette extracted (data URL)
  → QR code generated with silhouette overlay (qr-code-styling)
  → Design saved to Supabase (designs table, nanoid short_id)
  → Export PNG/JPG + scan link
  → Optional: AI mockup generation (whisk.ts → Google Imagen)
```

### Dynamic Scan Content
```
User scans QR → /scan/{short_id}
  → Supabase query: designs WHERE short_id = ...
  → Display current_message / current_media_url
  → Increment scan_count
```

---

## Sécurité

| Mesure | Implémentation |
|--------|----------------|
| RLS | Row Level Security sur toutes les tables Supabase |
| Auth Guard | Client-side AuthGuard + RoleGuard (React Router) |
| Validation | Zod schemas sur tous les formulaires |
| Admin Gate | Code d'invitation requis pour signup admin |
| PKCE | Flow OAuth sécurisé (pas de token dans l'URL) |
| XSS | React auto-escape + pas de dangerouslySetInnerHTML |

---

## Déploiement

| Environnement | Plateforme | URL |
|---------------|-----------|-----|
| Production | Vercel | À configurer |
| Preview | Vercel (par branche) | Auto-generated |
| Database | Supabase Cloud | Dashboard Supabase |

### Variables d'environnement requises
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_APP_URL=
VITE_QR_BASE_URL=
VITE_GOOGLE_AI_API_KEY=
```
