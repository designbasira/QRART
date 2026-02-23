# Architecture Technique — Silhouette QR Live

---

## Stack

| Couche | Technologie | Version |
|--------|-------------|---------|
| Framework | Next.js (App Router) | 16.x |
| Langage | TypeScript (strict) | 5.x |
| Base de données | Supabase PostgreSQL | - |
| Auth | Supabase Auth (email + Google OAuth) | - |
| Storage | Supabase Storage | - |
| Styling | Tailwind CSS | 4.x |
| QR Generation | qr-code-styling | 1.9.x |
| Background Removal | @imgly/background-removal | 1.7.x |
| AI (Mockups) | Google Generative AI | 0.24.x |
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
│   ├── app/
│   │   ├── globals.css            # Design tokens CSS + glassmorphism
│   │   ├── layout.tsx             # Root layout (fonts, PWA)
│   │   ├── page.tsx               # Landing page
│   │   ├── (auth)/
│   │   │   ├── layout.tsx         # Auth layout (centered, glass)
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx         # Dashboard layout (auth guard)
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx       # Admin dashboard
│   │   │   │   ├── create/        # Pipeline création
│   │   │   │   ├── designs/       # Liste + détail designs
│   │   │   │   └── users/         # Gestion utilisateurs
│   │   │   └── user/
│   │   │       ├── page.tsx       # User dashboard (PWA home)
│   │   │       ├── designs/       # Mes designs + éditeur
│   │   │       └── integrations/  # Cloud integrations
│   │   ├── scan/[id]/             # Page scan publique
│   │   └── api/
│   │       ├── v1/
│   │       │   ├── scan/[id]/     # API scan (résout short_id)
│   │       │   ├── designs/       # CRUD designs
│   │       │   └── upload/        # Upload images
│   │       └── generate-mockup/   # AI mockup generation
│   ├── components/
│   │   ├── admin/
│   │   │   ├── creation-pipeline.tsx  # 4-step stepper
│   │   │   ├── image-upload.tsx
│   │   │   ├── background-remover.tsx
│   │   │   ├── qr-generator.tsx
│   │   │   └── export-panel.tsx
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   └── signup-form.tsx
│   │   ├── layout/
│   │   │   ├── dashboard-shell.tsx    # Wrapper (header+sidebar+bottomnav)
│   │   │   ├── header.tsx             # Glass header
│   │   │   ├── sidebar.tsx            # Icon sidebar (72px) + mobile
│   │   │   └── bottom-nav.tsx         # Mobile bottom nav (72px)
│   │   └── user/
│   │       └── content-editor.tsx     # Tabs Texte/Image/Lien
│   ├── lib/
│   │   ├── constants.ts
│   │   ├── utils.ts                   # cn(), formatDate()
│   │   ├── validators.ts             # Zod schemas
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client
│   │   │   ├── server.ts             # Server client
│   │   │   └── admin.ts              # Admin client (service role)
│   │   └── whisk.ts                  # Google AI integration
│   ├── hooks/                         # Custom React hooks
│   └── types/
│       ├── index.ts                   # Profile, Design, etc.
│       └── database.ts                # Supabase generated types
├── CLAUDE.md                          # Instructions IA
├── .mcp.json                          # MCP servers config
├── package.json
└── tsconfig.json
```

---

## Patterns clés

### Authentication Flow
```
Visitor → /login or /signup
  → Supabase Auth (email/password or Google OAuth)
  → /auth/callback (exchange code for session)
  → Check profiles.role
  → Redirect: admin → /admin, user → /user
```

### Dashboard Guard
```
(dashboard)/layout.tsx (Server Component)
  → supabase.auth.getUser()
  → if !user → redirect('/login')
  → fetch profile from profiles table
  → if !profile → redirect('/login')
  → render DashboardShell with profile prop
```

### QR Creation Pipeline
```
Admin uploads image
  → Client-side background removal (@imgly)
  → Silhouette extracted (data URL)
  → QR code generated with silhouette overlay (qr-code-styling)
  → Design saved to Supabase (designs table, nanoid short_id)
  → Export PNG/SVG + scan link
```

### Dynamic Scan Content
```
User scans QR → GET /api/v1/scan/{short_id}
  → Resolve short_id → design
  → Return current_message / current_media_url
  → Increment scan_count
  → Display content on /scan/{id}
```

### Client vs Server Components
```
Server Components (default):
  - Pages (data fetching, auth checks)
  - Layouts

Client Components ('use client'):
  - Interactive forms (login, signup, content editor)
  - Stateful components (sidebar toggle, pipeline steps)
  - Browser APIs (background removal, QR generation)
```

---

## Sécurité

| Mesure | Implémentation |
|--------|----------------|
| RLS | Row Level Security sur toutes les tables Supabase |
| Auth Guard | Server-side redirect dans dashboard layout |
| Validation | Zod schemas sur tous les formulaires et APIs |
| Admin Gate | Code d'invitation requis pour signup admin |
| CSRF | Géré par Supabase Auth (cookies httpOnly) |
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
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_QR_BASE_URL=
GOOGLE_GENERATIVE_AI_API_KEY=
```
