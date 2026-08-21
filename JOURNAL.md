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

### [IndieForest — Zero-Touch GitHub Ingestion, 3D Timeline Scrubber & Dynamic README Badges] 2026-08-22
- **Commit**: `pending`
- **Shipped**:
  - **Dynamic GitHub README SVG Badge Endpoint (`/api/badge/[username]`):** Built server-rendered SVG generator (`src/lib/badge.ts` + `/api/badge/[username]/route.ts`) supporting both 600×200px porcelain diorama cards and compact shields.io pills with 100% test-driven Vitest coverage.
  - **3D Timeline Scrubber & 10s Time-Lapse Player (`TimelineScrubber.tsx`):** Built floating interactive scrubber on dashboard (`src/app/dashboard/page.tsx`) and public profile (`src/app/u/[username]/page.tsx`) with quick-jumps (`7d`, `30d`, `90d`, `All`) and automated 10-second turntable growth animation for Twitter/X video clips.
  - **Multi-Tiered Weather Particle Engine (`WeatherSystem.tsx`):** Upgraded weather system with distinct particle FX: gentle emerald mist/rain for commits, dramatic thunderstorm lightning & golden sunrays for streak milestones, and radiant golden particle showers for Stripe sales.
  - **Verifiable Proof Popovers & Tree Inspector (`ForestCanvas.tsx`):** Upgraded 3D tree inspector to display verified GitHub commit SHAs with clickable diff links and Stripe webhook confirmation badges.
  - **Public Living Portfolio & Visitor Social Interaction (`u/[username]/page.tsx`):** Integrated 1-click **"💧 Water Tree"** visitor cheers (+5 XP toast) and campsite guestbook modal (`GuestbookModal.tsx`) for 1-line encouraging notes from fellow builders.
  - **16 Non-Overlapping Radial Slots & Smart Proof-of-Ship (`gamification.ts`):** Enforced 16 canonical radial sector slots (`WEST_EMERALD_SLOTS`, `EAST_GOLDEN_SLOTS`) to eliminate tree clipping and implemented dual-gated progression (commits + active days).
  - **Comprehensive Stress-Testing & Webhook Churn Engine (`github-stress.test.ts` & `revenueWebhook.ts`):** Hardened against bot commit spam, cross-timezone streak boundaries, zero-decimal currencies, XML XSS injection, and automated subscriber churn/cancellation handling (converting churned trees to dormant stumps).
- **Metrics**: 54/54 Vitest unit & store tests passing (100% green) · 0 lint errors/warnings · 0 TypeScript errors · 100% production Turbopack build pass.
- **Visuals**: Porcelain double-bezel timeline scrubber, dynamic SVG README cards, campsite guestbook, and multi-tiered weather particles in Warm Studio Linen `#ece7de`.
- **Vibe**: 🌲 100% zero manual labor, viral distribution loops complete, airtight game mechanics!

### [IndieForest — Architecture Overhaul, Ponytail Cleanup & Codebase Hardening] 2026-08-21
- **Commit**: `56d87a0`
- **Shipped**:
  - **Deep Codebase & Dead Code Purge:** Safely deleted redundant `src/components/hud/AuthModal.tsx` (131 lines removed), cleaned unused imports/props in `TopStatusBar.tsx` and `AddTreeModal.tsx`, achieving 100% clean ESLint pass (0 errors, 0 warnings) and clean Turbopack build.
  - **Decoupled Progression & Pure Game Mechanics:** Fully separated the Emerald Shipping Grove (commits/grind) from Golden Revenue Grove (MRR/payments) so pre-revenue builders can thrive with $0 MRR, replaced manual tree tier cheat overrides in `ForestCanvas.tsx` with authentic progress story cards, and overhauled `AddTreeModal.tsx` with 1-click copyable webhook endpoints.
  - **Calibrated Zoomed-Out 3D Diorama & Lightweight Typography:** Fixed orthographic default framing to a comfortable zoomed-out panoramic scale (`zoom: 29` dashboard, `zoom: 28` profile, `zoom: 24` preview), switched to thin-weight `Jersey 10` & `Silkscreen` font engine, purged dead code `src/lib/supabase/sync.ts`, and achieved 100% clean Turbopack production build with zero warnings.
  - **Mindful HUD, Solid Porcelain & Sizing Normalization:** Reorganized HUD into a clean Top-Left back navigation and expandable quest popover (`[ ← | 🎯 Quests 1/3 ▾ ]`), a compact Top-Right status pill (`[ Lvl 12 (75%) | 🌰 50 | ⚙️ ▾ ]`) with expandable quick-controls, an integrated bottom action dock unifying daily shipping with streak flame and burnout shields (`[ 🔥 14d 🛡️ 2 | +Tree | LOG DAILY SHIP | Shop | Share ]`), replaced the central onboarding card with a gentle floating pointer bubble directly above the dock, enforced solid Porcelain White double-bezel styling, and safely deleted obsolete `DailyQuestPanel.tsx`.
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
