# QRART - Silhouette QR Live

## Project Overview
Platform that bridges physical personalized objects (Print-on-Demand) and dynamic digital content. A client's silhouette is transformed into an artistic QR Code whose content remains modifiable by the end client at any time.

## Tech Stack
- **Framework**: Vite + React Router (TypeScript)
- **Database/Auth**: Supabase (PostgreSQL + Auth + Storage, PKCE flow)
- **Styling**: Tailwind CSS
- **QR Generation**: qr-code-styling (artistic QR with image overlay, error correction H)
- **Background Removal**: @imgly/background-removal (client-side, free)
- **AI Mockups**: Google Imagen API (via src/lib/whisk.ts)
- **Testing**: Vitest + @testing-library/react
- **Hosting**: Vercel

## Project Structure
```
src/
  main.tsx         → Entry point
  App.tsx          → Routes (React Router)
  globals.css      → Design tokens + glassmorphism
  pages/           → Page components (home, login, signup, admin/*, user/*)
  layouts/         → Layout wrappers (auth-layout, dashboard-layout)
  components/      → React components (admin/, user/, auth/, layout/)
  lib/             → Core libraries (supabase/, qr/, background-removal/, whisk.ts)
  hooks/           → Custom React hooks
  types/           → TypeScript types
  tests/           → Test setup and utilities
```

## Conventions
- Use TypeScript strict mode
- Use `@/` import alias for all internal imports
- Components use PascalCase filenames, utilities use kebab-case
- All components are client-side (Vite SPA, no server components)
- Zod for all form validation
- Supabase RLS enforced on all tables
- Two roles: `admin` and `user` (stored in `profiles.role`)

## Key Patterns
- Supabase client: singleton `createClient()` from `@/lib/supabase/client` (PKCE flow)
- Auth: `AuthProvider` context → `AuthGuard` + `RoleGuard` route wrappers
- QR codes use 10-char nanoid as `short_id` for compact URLs
- Background removal runs entirely in browser (no server cost)
- Mockups generated via `generateMockup()` from `@/lib/whisk` (Google Imagen API)
- Environment variables must be prefixed with `VITE_` to be exposed to the client

## Development Methodology
This project uses **Superpowers** (obra/superpowers) for structured AI-driven development:
- TDD: Write failing test first, then implement, then refactor
- Git worktrees for feature isolation
- Plans broken into 2-5 minute tasks
- Systematic code review before merge

## MCP Servers Available
- **Supabase**: Database management during development
- **Stitch (Google)**: UI component prototyping
- **Figma**: Design token import, mockup inspection
- **Blender**: 3D product mockups (future)
- **Vercel**: Deploy, logs, monitoring
