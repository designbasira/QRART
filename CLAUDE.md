# QRART - Silhouette QR Live

## Project Overview
Platform that bridges physical personalized objects (Print-on-Demand) and dynamic digital content. A client's silhouette is transformed into an artistic QR Code whose content remains modifiable by the end client at any time.

## Tech Stack
- **Framework**: Next.js 15 (App Router, TypeScript)
- **Database/Auth**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS + shadcn/ui
- **QR Generation**: qr-code-styling (artistic QR with image overlay, error correction H)
- **Background Removal**: @imgly/background-removal (client-side, free)
- **Testing**: Vitest + @testing-library/react
- **Hosting**: Vercel

## Project Structure
```
src/
  app/           → Next.js App Router pages and API routes
  components/    → React components (admin/, user/, auth/, layout/, ui/)
  lib/           → Core libraries (supabase/, qr/, background-removal/, validators)
  hooks/         → Custom React hooks
  types/         → TypeScript types
  tests/         → Test setup and utilities
```

## Conventions
- Use TypeScript strict mode
- Use `@/` import alias for all internal imports
- Components use PascalCase filenames, utilities use kebab-case
- Server Components by default, `'use client'` only when needed
- Zod for all form/API validation
- Supabase RLS enforced on all tables
- Two roles: `admin` and `user` (stored in `profiles.role`)

## Key Patterns
- Supabase clients: `createClient()` from `@/lib/supabase/client` (browser) or `@/lib/supabase/server` (server)
- Admin operations use `createAdminClient()` from `@/lib/supabase/admin`
- QR codes use 10-char nanoid as `short_id` for compact URLs
- Background removal runs entirely in browser (no server cost)

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
