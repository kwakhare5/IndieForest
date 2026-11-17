# AGENTS.md - IndieForest

Global rules: read C:\Users\kwakh\.agents\AGENTS.md first. This file adds project-specific rules. It can make global limits stricter, never looser. Do not repeat global rules here.

## 1. What this is
- One-line promise: GitHub README SVG widget and botanical field guide for indie hackers that turns daily shipping momentum into a living forest.
- What is out of scope: Shelved project. No active external tracking or new feature development unless unshelved.

## 2. Stack and commands
- Stack: Next.js 16 (Turbopack + App Router), React 19, TypeScript, Tailwind CSS v4, Clerk GitHub OAuth, Supabase PostgreSQL, Vitest.
- Install: `npm install`
- Dev server: `npm run dev`
- Test: `npm test`
- Build: `npm run build`
- Lint / typecheck: `npm run lint`
- Database / seed: Supabase migrations in `supabase/migrations/`
- Environment variable names: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. No secrets or values.

## 3. Project rules
- Data contract: The widget endpoint `/u/[username].svg` reads Supabase with Camo-safe cache headers; never calls GitHub directly (only `/api/sync`).
- Invariants and gotchas: Pure SVG renderer in `src/lib/forest-svg.ts` is the single source of truth for all graphics; zero framework imports, zero clock calls.
- Strict types: No `any` or loose casts.
- Never commit secrets, passwords or API keys. Keep them in an untracked `.env` or environment variables.
- Required env vars: Clerk and Supabase credentials. Missing vars fail fast on auth or DB client init.
- (Only with a database) Never modify or delete migrations that have already run.
- Security and privacy rules: Camo-safe cache headers on SVG endpoints. Service role keys used server-side only.

## 4. UI rules (only for projects with a UI)
- Design source of truth: Shelved project. No UI skill loaded.
- Follow design tokens and components in DESIGN.md. No inline styles.
- Handle loading, empty and error states for every async call.

## 5. Surfaces and verification
- Screen or endpoint map: `/` (landing), `/u/[username].svg` (widget endpoint), `/api/sync` (sync worker).
- Verification skill path: None (use test suite).
- Done check: `npm test` + `npm run lint` both exit 0.

## 6. Project-specific stops
- The phase checklist (Plan -> Scout -> Build -> Review -> Fix -> Verify -> Close) lives in TASKS.md, not here.
- Project is shelved; do not push migrations or live schema updates without explicit permission.

## 7. Folder map
- `src/app/`: Next.js App Router endpoints and pages.
- `src/components/`: UI components.
- `src/lib/`: Core utilities including `forest-svg.ts`.
- `supabase/`: Migrations and Supabase configuration.
- `tests/`: Vitest test suites.

## 8. Open decisions
- Shelved status.

## 9. Do not touch
- Applied migrations in `supabase/migrations/`.
- Pure SVG logic contract in `src/lib/forest-svg.ts` without explicit spec changes.

## 10. Doc map
- `ARCHITECTURE.md`: Architecture overview.
- `CONTEXT.md`: Project context.
- `JOURNAL.md`: Work log.
- `INDIEFOREST_FINAL_BUILD_SPEC.md`: Original build spec.
