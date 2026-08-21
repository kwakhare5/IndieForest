# Product Journal

A chronological record of project milestones, features shipped, and metrics. This file is append-only.

---

## How to Maintain This Journal (For the Agent)
During the Session End ritual (called automatically whenever significant changes are made), the agent:
1. Reads the current `JOURNAL.md`.
2. Formats all work under **at most ONE date heading per calendar day** (`### [Project — Summary] YYYY-MM-DD`).
3. If today's date heading (`YYYY-MM-DD`) already exists under `## Log Entries`, merges/appends the new bullet points under `- **Shipped**:`, updates `- **Commit**:`, and updates `- **Vibe**:`.
4. If today's date heading does NOT exist, prepends a new date heading `### [Project — Summary] YYYY-MM-DD` directly under `## Log Entries` (newest date on top).

---

## Log Entries

### [IndieForest — Architecture Overhaul, Ponytail Cleanup & Codebase Hardening] 2026-08-21
- **Commit**: `75aac90`
- **Shipped**:
  - **Full Codebase Architecture Refactoring:** Created `src/types/game.ts` as the canonical source of truth for all domain entities, eliminating domain $\leftrightarrow$ store circular dependencies and type fragmentation across UI components.
  - **Ponytail Dead Code Purge:** Safely deleted obsolete/duplicate `src/utils/supabase/` and unreferenced `src/lib/supabase/server.ts`, and made `src/lib/supabase/client.ts` cleanly self-contained.
  - **Modern ESLint 9 Flat Config:** Configured modern `eslint.config.mjs` flat configuration resolving all Next.js 16 linting issues (clean pass with 0 errors, 0 warnings).
  - **Next.js 16 Deprecation Fix:** Removed deprecated `runtime = "edge"` in `/api/og/route.tsx` and purged all residual raw emojis (`🌰`, `🌲`) in favor of clean geometric Lucide icons and SVG vector marks.
  - **Warm Studio Linen 404 Page:** Redesigned `src/app/not-found.tsx` with double-bezel porcelain card structure and standardized button primitives.
  - **Clerk Authentication Engine:** Integrated `@clerk/nextjs` (ClerkProvider, clerkMiddleware, `<SignInButton mode="modal">`, `<UserButton />`) with 1-click Google OAuth and zero dev configuration.
  - **TDD Gamification & Store Hardening:** Expanded test suite to 37/37 passing Vitest tests across math, streak decay, shields, quests, camp decor, and cloud synchronization.
  - **WebGL 3D Canvas Snapshot for Social Sharing:** Built high-resolution PNG composite generator in `ShareCardModal` with 1-click clipboard image copy for Twitter/X.
- **Metrics**: 37/37 Vitest unit & store tests passing · 0 lint errors/warnings · 0 TypeScript errors · 100% production build pass.
- **Visuals**: Clean double-bezel porcelain modals, instant Google OAuth modal, Warm Studio Linen 404 page, and high-res 3D PNG social card exports.
- **Ask/Roast**: Session logged to JOURNAL.md.
- **Vibe**: 🌲 Surgical codebase perfection, zero dead code, zero circular imports, 37/37 tests green!

### [IndieForest — Next.js 16 + 3D Low-Poly Island + Gamification Engine + Anti-Slop Design] 2026-08-20
- **Commit**: `ad2b93c`
- **Shipped**:
  - **Full-Stack Initialization:** Upgraded stack to **Next.js 16.3.1 (Turbopack)** + **React 19** + **Tailwind CSS v4** + **TypeScript 5.7 (Strict)**.
  - **3D Living Isometric Island:** Built 3D low-poly floating island in React Three Fiber (`@react-three/fiber` v9) with terraced voxel terrain, turquoise pond, contact stones, and 5-tier stepped pine trees (Emerald Shipping vs Golden Revenue).
  - **Complete Gamification Loop:** Pure domain XP leveling curve (`200 * Level^1.35`), developer ranks (Seedling Scout → Forest Monarch), Streak Shield burnout protection, and Pinecone (🌰) cosmetic camp shop.
  - **Universal Double-Bezel Design System:** Engineered chamfered porcelain card architecture (`glass-dock` outer shell + `porcelain-surface` inner core) with Warm Studio Linen palette (`#ece7de`) using `taste-skill` and `high-end-visual-design`.
  - **Complete Emoji & AI Slop Purge:** Replaced all informal emojis across HUD, modals, and landing page with clean geometric Lucide icons (`strokeWidth={1.5}`) and Roman numeral rank tiers.
  - **1-Click Daily Shipping Ritual:** Built Daily Shipping modal with Web Audio API synthesized retro chimes, particle rain shower event, and Twitter/X progress card exporter.
  - **Automated Verification:** 25/25 Vitest unit tests passing in 218ms; Turbopack production build compiled in 773ms with 0 errors.
- **Metrics**: 25/25 Vitest unit tests passing · 8 static/dynamic routes · 0 lint warnings · 0 errors.
- **Visuals**: Warm Studio Linen `#ece7de`, radiant apple green branding, double-bezel porcelain surfaces, and crisp Satoshi + Editorial typography.
- **Vibe**: 🌲 Fast, surgical, high-polish agency finish with zero AI slop!
